import { resolveEsriTileUrl } from './esriImagery';
import { resolveGoogleTileUrl, registerGoogleTileFallback } from './googleImagery';
import { resolveTerrainTileUrl } from './terrainImagery';
import { resolveMapDetailsTileUrl } from './mapDetails';
import { MAP_CACHE_REVISION } from './mapCacheRevision.generated';

export function resolveMapTileUrl(url: string): string {
  return resolveMapDetailsTileUrl(resolveTerrainTileUrl(resolveGoogleTileUrl(resolveEsriTileUrl(url))));
}

/** Store requested map images across reloads without delaying the first view. */
export function registerMapTileCache(): void {
  registerGoogleTileFallback();
  if (!('serviceWorker' in navigator)) return;
  const workerUrl = `${import.meta.env.BASE_URL}map-cache-sw.js?revision=${encodeURIComponent(MAP_CACHE_REVISION)}`;
  void navigator.serviceWorker.register(workerUrl, { scope: import.meta.env.BASE_URL })
    .catch(() => { /* Local file routing still works when browser caching is unavailable. */ });
}
