import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

// Read-only audit of Vite's actual multi-page graph, including dynamic imports,
// import.meta.glob, aliases and CSS assets. Never delete files automatically.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const inside = file => file.startsWith(root + path.sep) && !relative(file).startsWith('node_modules/');
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  if (item.isSymbolicLink()) return [];
  const file = path.join(dir, item.name);
  return item.isDirectory() ? walk(file) : [file];
}) : [];
const used = new Set();
const entries = new Set();
const missing = [];
function remember(id) {
  if (!id || id.startsWith('\0')) return;
  const file = path.resolve(root, id.split('?')[0]);
  if (inside(file) && fs.existsSync(file) && fs.statSync(file).isFile()) used.add(file);
}

await build({
  root,
  logLevel: 'silent',
  build: { write: false, emptyOutDir: false, copyPublicDir: false },
  plugins: [{
    name: 'read-only-unused-audit',
    generateBundle(_options, bundle) {
      for (const id of this.getModuleIds()) {
        remember(id);
        if (this.getModuleInfo(id)?.isEntry && id.endsWith('.html')) entries.add(relative(path.resolve(id)));
      }
      for (const output of Object.values(bundle)) {
        if (output.type === 'asset') output.originalFileNames.forEach(remember);
      }
    },
  }],
});

// Type-only imports and small assets inlined into CSS may be absent from output.
// Keep their transitive references too.
for (const file of used) {
  if (!/\.(?:[cm]?[jt]sx?|css|html)$/.test(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const refs = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|@import\s*|\b(?:src|href)\s*=\s*)['"]([^'"]+)['"]|\burl\(\s*['"]?([^'"\s)]+)|\bnew URL\(\s*['"]([^'"]+)['"]/g)]
    .map(match => match[1] || match[2] || match[3]);
  for (let ref of refs) {
    ref = ref.split(/[?#]/)[0];
    if (!ref || /^(data:|https?:|\/\/)/.test(ref)) continue;
    let target;
    if (ref.startsWith('@/')) target = path.join(root, ref.slice(2));
    else if (ref.startsWith('/src/')) target = path.join(root, ref);
    else if (ref.startsWith('/')) target = path.join(root, 'public', ref);
    else if (ref.startsWith('.')) target = path.resolve(path.dirname(file), ref);
    else continue;
    const resolved = [target, ...['.ts', '.tsx', '.js', '.jsx', '.css', '/index.ts', '/index.tsx'].map(ext => target + ext)]
      .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (resolved) remember(resolved);
    else missing.push({ file: relative(file), ref });
  }
}

// Map URLs are assembled at runtime. Check cached tiles AND parent fallbacks.
const tileManifests = [
  ['esriTileCache.generated.ts', 'jpg'], ['googleTileCache.generated.ts', 'jpg'],
  ['terrainTileCache.generated.ts', 'png'], ['googleDetailsViCache.generated.ts', 'png'],
  ['googleDetailsEnCache.generated.ts', 'png'],
];
let tileCount = 0;
for (const [name, extension] of tileManifests) {
  const file = path.join(root, 'src/services', name);
  if (!used.has(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/export const \w+ = (\{[\s\S]*\}) as const;/);
  if (!match) throw new Error(`Unsupported tile manifest: ${name}; audit stopped.`);
  const manifest = JSON.parse(match[1]);
  const directory = manifest.cacheId ?? `esri-${manifest.releaseId}`;
  for (const key of new Set([...manifest.tiles, ...Object.values(manifest.fallbacks ?? {})])) {
    const target = path.resolve(root, 'public/map-tiles', directory, `${key}.${extension}`);
    if (!inside(target)) throw new Error(`Tile outside project: ${key}`);
    if (fs.existsSync(target)) { remember(target); tileCount++; }
    else missing.push({ file: relative(file), ref: relative(target) });
  }
}

const textSources = [...used].filter(file => /\.(?:[cm]?[jt]sx?|css|html)$/.test(file))
  .map(file => fs.readFileSync(file, 'utf8'));
for (const file of walk(path.join(root, 'public')).filter(file => !relative(file).startsWith('public/map-tiles/'))) {
  const publicPath = path.relative(path.join(root, 'public'), file).replaceAll('\\', '/');
  if (textSources.some(source => source.includes(publicPath))) remember(file);
}

const support = [...walk(path.join(root, 'docs')), ...walk(path.join(root, 'tests')), ...walk(path.join(root, 'scripts')),
  ...walk(path.join(root, 'src/assets')).filter(file => /\.(md|json|txt)$/.test(file))]
  .filter(file => file !== fileURLToPath(import.meta.url) && /\.(md|json|txt|[cm]?[jt]sx?|py|ps1)$/.test(file))
  .map(file => ({ file, text: fs.readFileSync(file, 'utf8') }));
const retention = JSON.parse(fs.readFileSync(path.join(root, 'scripts/asset-retention.json'), 'utf8'));
for (const file of Object.keys(retention)) {
  if (!fs.existsSync(path.resolve(root, file))) missing.push({ file: 'scripts/asset-retention.json', ref: file });
}
const unreferenced = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'assets')), ...walk(path.join(root, 'public'))]
  .filter(file => !used.has(file) && !/\.(md|txt)$/.test(file) && !file.endsWith('cache-summary.json'))
  .map(file => ({
    path: relative(file), bytes: fs.statSync(file).size,
    // "Unused" means not reached by the app. Test fixtures and source originals
    // still require review before removal.
    referencedBy: support.filter(item => item.file !== file && item.text.includes(path.basename(file))).map(item => relative(item.file)),
  }));
const retained = unreferenced.filter(file => retention[file.path]).map(file => ({ ...file, reason: retention[file.path] }));
const unused = unreferenced.filter(file => !retention[file.path]);
const result = {
  entries: [...entries].sort(), missing,
  summary: { runtimeFiles: used.size, cachedTiles: tileCount, retainedSupportFiles: retained.length, unusedFiles: unused.length, unusedBytes: unused.reduce((sum, file) => sum + file.bytes, 0) },
  unused, retained, used: [...used].map(relative).sort(),
};
const outputIndex = process.argv.indexOf('--output');
if (outputIndex !== -1) {
  if (!process.argv[outputIndex + 1]) throw new Error('--output requires a path');
  const output = path.resolve(process.argv[outputIndex + 1]);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ entries: result.entries, summary: result.summary, missing, report: output }, null, 2));
} else console.log(JSON.stringify({
  entries: result.entries, summary: result.summary, missing, unused,
  retained: retained.map(({ path, reason }) => ({ path, reason })),
}, null, 2));
if (missing.length) process.exitCode = 1;
