import { GOOGLE_TILE_CACHE } from './googleTileCache.generated';
import { addProtocol } from 'maplibre-gl';

export const GOOGLE_IMAGERY = {
  tileUrls: [0, 1, 2, 3].map((server) => `https://mt${server}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}`),
  maxZoom: 20,
  attribution: 'Google Earth Imagery / CNES / Airbus',
} as const;

const cachedTiles = new Set<string>(GOOGLE_TILE_CACHE.tiles);
const metadata = GOOGLE_TILE_CACHE as { cacheId: string; tiles: readonly string[]; fallbacks?: Record<string, string> };
const parentTiles = new Map<string, string>(Object.entries(metadata.fallbacks ?? {}));
const fallbackPrefix = 'google-parent://tile/';
let fallbackRegistered = false;

function localTileUrl(key: string): string {
  return `${import.meta.env.BASE_URL}map-tiles/${GOOGLE_TILE_CACHE.cacheId}/${key}.jpg`;
}

/** Crop Google's own cached parent where the provider has no child image. */
export function registerGoogleTileFallback(): void {
  if (fallbackRegistered) return;
  addProtocol('google-parent', async (request, controller) => {
    const key = request.url.slice(fallbackPrefix.length);
    const parent = parentTiles.get(key);
    if (!parent) throw new Error('No cached Google parent for this tile');
    const response = await fetch(localTileUrl(parent), { signal: controller.signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`Cached Google parent: HTTP ${response.status}`);
    const [z, y, x] = key.split('/').map(Number);
    const [parentZ, parentY, parentX] = parent.split('/').map(Number);
    const scale = 2 ** (z - parentZ);
    const size = 256 / scale;
    const bitmap = await createImageBitmap(await response.blob(),
      (x - parentX * scale) * size, (y - parentY * scale) * size, size, size,
      { resizeWidth: 256, resizeHeight: 256, resizeQuality: 'high' });
    if (controller.signal.aborted) {
      bitmap.close();
      throw new DOMException('Aborted', 'AbortError');
    }
    return { data: bitmap };
  });
  fallbackRegistered = true;
}

export function resolveGoogleTileUrl(url: string): string {
  if (!/^https:\/\/mt[0-3]\.google\.com\/vt\?/.test(url)) return url;
  const params = new URL(url).searchParams;
  if (params.get('lyrs') !== 's') return url;
  const key = `${params.get('z')}/${params.get('y')}/${params.get('x')}`;
  if (cachedTiles.has(key)) return localTileUrl(key);
  if (parentTiles.has(key)) return `${fallbackPrefix}${key}`;
  return url;
}

export function getGoogleTileUrl(x: number, y: number, z: number): string {
  const parent = parentTiles.get(`${z}/${y}/${x}`);
  // HTML image prefetches warm the real parent file; MapLibre crops it later.
  if (parent) return localTileUrl(parent);
  return resolveGoogleTileUrl(`https://mt${(x + y) % 4}.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${z}`);
}
