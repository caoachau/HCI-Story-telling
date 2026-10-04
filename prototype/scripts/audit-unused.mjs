import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Follow all three application entries, including CSS URLs and marker globs.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(item => {
  const file = path.join(dir, item.name);
  return item.isDirectory() ? walk(file) : [file];
});
const sourceFiles = walk(path.join(root, 'src'));
const used = new Set();
const missing = [];
const packages = new Set();
function visit(file) {
  if (used.has(file)) return;
  used.add(file);
  if (!/\.(?:tsx?|jsx?|css|html)$/.test(file)) return;
  const source = fs.readFileSync(file, 'utf8');
  const references = [...source.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|@import\s*|\bsrc\s*=\s*)['"]([^'"]+)['"]|\burl\(\s*['"]?([^'"\s)]+)|\bnew URL\(\s*['"]([^'"]+)['"]/g)]
    .map(match => match[1] || match[2] || match[3]);
  for (let ref of references) {
    ref = ref.split('?')[0];
    if (ref.startsWith('data:') || /^(https?:|#|%23)/.test(ref)) continue;
    if (ref.startsWith('/') && /\.html$/.test(ref)) continue;
    if (ref.startsWith('/') && !ref.startsWith('/src/')) continue;
    if (!ref.startsWith('.') && !ref.startsWith('/')) {
      packages.add(ref.startsWith('@') ? ref.split('/').slice(0, 2).join('/') : ref.split('/')[0]);
      continue;
    }
    const target = ref.startsWith('/') ? path.join(root, ref) : path.resolve(path.dirname(file), ref);
    const resolved = [target, ...['.ts', '.tsx', '.js', '.jsx', '.css', '/index.ts', '/index.tsx'].map(ext => target + ext)]
      .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (resolved) visit(resolved);
    else missing.push({ file: path.relative(root, file), ref });
  }
  if (source.includes('import.meta.glob')) {
    if (file.endsWith('heritageMarkers.ts')) {
      sourceFiles.filter(asset => asset.includes(`${path.sep}heritage-markers${path.sep}`) && /\.(png|webp|avif|jpe?g)$/.test(asset)).forEach(visit);
    } else missing.push({ file: path.relative(root, file), ref: 'Review dynamic glob manually' });
  }
}
['index.html', 'con-chim.html', 'ao-ba-om.html'].forEach(file => visit(path.join(root, file)));
const unused = sourceFiles.filter(file => !used.has(file) && !/\.(md|txt)$/.test(file));
const result = {
  packages: [...packages].sort(), missing,
  unused: unused.map(file => ({ path: path.relative(root, file).replaceAll('\\', '/'), bytes: fs.statSync(file).size })),
  used: [...used].map(file => path.relative(root, file).replaceAll('\\', '/')),
};
console.log(JSON.stringify(result, null, 2));
