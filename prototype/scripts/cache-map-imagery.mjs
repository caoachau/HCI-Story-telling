import { readFile, writeFile, mkdir, stat, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const imagerySource = await readFile(resolve(projectRoot, 'src/services/esriImagery.ts'), 'utf8');
const esriTemplate = imagerySource.match(/tileUrl:\s*'([^']+)'/)[1];
const releaseId = esriTemplate.match(/\/tile\/(\d+)\//)[1];
const siteSource = await readFile(resolve(projectRoot, 'src/data/heritageSites.ts'), 'utf8');
const sites = [...siteSource.matchAll(/^    id: '([^']+)',[\s\S]*?^    lat: ([\d.-]+),\r?\n    lng: ([\d.-]+),/gm)]
  .map((match) => ({ id: match[1], lat: Number(match[2]), lng: Number(match[3]) }));
if (sites.length !== 7) throw new Error(`Expected 7 heritage landmarks, found ${sites.length}`);

const providers = [
  { id: `esri-${releaseId}`, name: 'Esri', maxZoom: 17, extension: 'jpg', symbol: 'ESRI_TILE_CACHE', manifest: 'esriTileCache.generated.ts', metadata: { releaseId }, url: (z, y, x) => esriTemplate.replace('{z}', z).replace('{y}', y).replace('{x}', x) },
  { id: 'google-satellite-v1', name: 'Google Satellite', maxZoom: 20, extension: 'jpg', symbol: 'GOOGLE_TILE_CACHE', manifest: 'googleTileCache.generated.ts', metadata: { cacheId: 'google-satellite-v1' }, url: (z, y, x) => `https://mt${(x + y) % 4}.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}` },
  { id: 'terrain-v1', name: 'Elevation', maxZoom: 12, extension: 'png', symbol: 'TERRAIN_TILE_CACHE', manifest: 'terrainTileCache.generated.ts', metadata: { cacheId: 'terrain-v1' }, url: (z, y, x) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png` },
  ...['vi', 'en'].map((lang) => ({
    id: `google-details-${lang}-v1`, name: `Google Details (${lang})`,
    maxZoom: 20, extension: 'png', symbol: `GOOGLE_DETAILS_${lang.toUpperCase()}_CACHE`,
    manifest: `googleDetails${lang === 'vi' ? 'Vi' : 'En'}Cache.generated.ts`,
    metadata: { cacheId: `google-details-${lang}-v1`, lang },
    url: (z, y, x) => `https://mt${(x + y) % 4}.google.com/vt/lyrs=h&hl=${lang}&gl=VN&x=${x}&y=${y}&z=${z}`,
  })),
];

function coordinate(lng, lat, z) {
  const scale = 2 ** z;
  const latRad = lat * Math.PI / 180;
  return {
    x: Math.floor((lng + 180) / 360 * scale),
    y: Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * scale),
  };
}
function addRect(tiles, provider, z, minX, minY, maxX, maxY) {
  const limit = 2 ** z - 1;
  for (let x = Math.max(0, minX); x <= Math.min(limit, maxX); x++) {
    for (let y = Math.max(0, minY); y <= Math.min(limit, maxY); y++) {
      const key = `${z}/${y}/${x}`;
      tiles.set(key, { key, z, x, y, provider });
    }
  }
}
async function buildPlan(provider) {
  const tiles = new Map();
  // Cover the province and flight corridors at regional zooms, then every
  // bearing of the tilted close-up view around each landmark.
  for (let z = 6; z <= Math.min(provider.maxZoom, 14); z++) {
    const nw = coordinate(106.10, 10.18, z);
    const se = coordinate(106.72, 9.43, z);
    addRect(tiles, provider, z, nw.x - 1, nw.y - 1, se.x + 1, se.y + 1);
  }
  for (const site of sites) {
    for (let z = 15; z <= provider.maxZoom; z++) {
      const { x, y } = coordinate(site.lng, site.lat, z);
      const radius = z <= 17 ? 8 : z === 18 ? 7 : z === 19 ? 6 : 5;
      addRect(tiles, provider, z, x - radius, y - radius, x + radius, y + radius);
    }
  }
  // Retain the original overview's margin, including already shipped files.
  if (provider.maxZoom > 12) {
    for (let z = 9; z <= 12; z++) {
      const { x, y } = coordinate(106.345, 9.855, z);
      addRect(tiles, provider, z, x - 3, y - 3, x + 3, y + 3);
    }
  }
  // A corrected landmark must add coverage without discarding the imagery
  // already shipped around its former position and nearby flight corridors.
  let previousManifest;
  try {
    previousManifest = await readFile(resolve(projectRoot, 'src/services', provider.manifest), 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (previousManifest) {
    const match = previousManifest.match(/export const \w+ = (\{[\s\S]*\}) as const;/);
    if (!match) throw new Error(`Invalid previous tile manifest: ${provider.manifest}`);
    const previous = JSON.parse(match[1]);
    if (previous.cacheId === provider.metadata.cacheId && previous.releaseId === provider.metadata.releaseId) {
      for (const key of [...previous.tiles, ...Object.keys(previous.fallbacks ?? {})]) {
        const [z, y, x] = key.split('/').map(Number);
        if (Number.isInteger(z) && Number.isInteger(y) && Number.isInteger(x) && z >= 6 && z <= provider.maxZoom) {
          tiles.set(key, { key, z, x, y, provider });
        }
      }
    }
  }
  return [...tiles.values()];
}

const plans = await Promise.all(providers.map(async (provider) => ({ provider, entries: await buildPlan(provider), cached: [], failed: [], bytes: 0, completed: 0 })));
console.log(JSON.stringify(plans.map(({ provider, entries }) => ({ provider: provider.name, tiles: entries.length, maxZoom: provider.maxZoom })), null, 2));
if (process.argv.includes('--plan')) process.exit(0);

// Alternate providers so both modes gain coverage during the download.
const tasks = [];
for (let index = 0; index < Math.max(...plans.map((plan) => plan.entries.length)); index++) {
  for (const plan of plans) if (plan.entries[index]) tasks.push({ plan, tile: plan.entries[index] });
}
let next = 0;
let completed = 0;
let lastProgress = Date.now();
const started = Date.now();
const pause = (ms) => new Promise((resolvePause) => setTimeout(resolvePause, ms));

async function download() {
  while (next < tasks.length) {
    const { plan, tile: { key, z, x, y, provider } } = tasks[next++];
    const file = resolve(projectRoot, `public/map-tiles/${provider.id}/${key}.${provider.extension}`);
    try {
      let size = await stat(file).then((info) => info.size).catch(() => 0);
      if (!size) {
        let data;
        for (let attempt = 0; attempt < 4; attempt++) {
          try {
            const response = await fetch(provider.url(z, y, x), { signal: AbortSignal.timeout(15000) });
            if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
              const error = new Error(`HTTP ${response.status}: ${response.headers.get('content-type')}`);
              error.status = response.status;
              throw error;
            }
            data = Buffer.from(await response.arrayBuffer());
            if (data.length < 100) throw new Error('Empty imagery response');
            break;
          } catch (error) {
            if (error.status === 404 || attempt === 3) throw error;
            await pause(Math.min(4000, 300 * 2 ** attempt));
          }
        }
        await mkdir(dirname(file), { recursive: true });
        await writeFile(`${file}.partial`, data);
        await rename(`${file}.partial`, file);
        size = data.length;
      }
      plan.cached.push(key);
      plan.bytes += size;
    } catch (error) {
      plan.failed.push({ key, error: error.message });
    }
    plan.completed++;
    completed++;
    if (completed % 500 === 0 || Date.now() - lastProgress > 15000) {
      lastProgress = Date.now();
      console.log(`${completed}/${tasks.length} tiles, ${((Date.now() - started) / 1000).toFixed(0)}s: ${plans.map((item) => `${item.provider.name} ${item.cached.length} cached, ${item.failed.length} unavailable`).join(' | ')}`);
    }
  }
}
await Promise.all(Array.from({ length: 16 }, download));

const summary = [];
for (const plan of plans) {
  const { provider, cached, failed, bytes } = plan;
  cached.sort();
  const fallbacks = {};
  if (provider.name === 'Google Satellite') {
    const available = new Set(cached);
    for (const missing of failed) {
      if (!missing.error.startsWith('HTTP 404:')) continue;
      const [z, y, x] = missing.key.split('/').map(Number);
      for (let parentZ = z - 1; parentZ >= 6; parentZ--) {
        const divisor = 2 ** (z - parentZ);
        const parentKey = `${parentZ}/${Math.floor(y / divisor)}/${Math.floor(x / divisor)}`;
        if (available.has(parentKey)) {
          fallbacks[missing.key] = parentKey;
          break;
        }
      }
    }
  }
  const manifest = { ...provider.metadata, tiles: cached, fallbacks };
  const generated = `// Generated by scripts/cache-map-imagery.mjs. Imagery copyright remains with its providers.\nexport const ${provider.symbol} = ${JSON.stringify(manifest, null, 2)} as const;\n`;
  await writeFile(resolve(projectRoot, 'src/services', provider.manifest), generated);
  summary.push({ provider: provider.name, cached: cached.length, megabytes: +(bytes / 1024 / 1024).toFixed(2), parentFallbacks: Object.keys(fallbacks).length, failed });
}
await writeFile(resolve(projectRoot, 'public/map-tiles/cache-summary.json'), JSON.stringify({ generatedAt: new Date().toISOString(), coverage: [106.10, 9.43, 106.72, 10.18], providers: summary }, null, 2));
const revision = createHash('sha256').update(JSON.stringify(summary.map(({ provider, cached, megabytes }) => ({ provider, cached, megabytes, releaseId })))).digest('hex').slice(0, 16);
await writeFile(resolve(projectRoot, 'src/services/mapCacheRevision.generated.ts'), `// Generated by scripts/cache-map-imagery.mjs.\nexport const MAP_CACHE_REVISION = '${revision}';\n`);
console.log(JSON.stringify(summary.map(({ failed, ...item }) => ({ ...item, unavailable: failed.length, errors: [...new Set(failed.map((failure) => failure.error))] })), null, 2));
if (summary.some((item) => item.failed.length > item.parentFallbacks)) process.exitCode = 1;
