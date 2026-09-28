/**
 * Tile Preloader & LOD Optimization Service
 * 
 * Provides background prefetching, tile cache pre-warming, and sibling tile
 * buffering to eliminate tile pop-in, blurry blockiness, and latency during
 * cinematic Google Earth-style flyTo camera transitions.
 */

import { getEsriTileUrl } from './esriImagery';
import { getGoogleTileUrl } from './googleImagery';

export interface TileCoord {
  x: number;
  y: number;
  z: number;
}

/**
 * Converts WGS-84 (lng, lat) coordinates to Web Mercator Tile coordinates (x, y, z)
 */
export function lngLatToTile(lng: number, lat: number, zoom: number): TileCoord {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
  );
  return { x, y, z: zoom };
}

/**
 * Formats tile URL for different map providers
 */
export function getTileUrl(
  type: 'google' | 'esri' | 'carto' | 'topo',
  x: number,
  y: number,
  z: number
): string {
  switch (type) {
    case 'google':
      return getGoogleTileUrl(x, y, z);
    case 'esri':
      return getEsriTileUrl(x, y, z);
    case 'carto':
      return `https://basemaps.cartocdn.com/rastertiles/voyager_nolabels/${z}/${x}/${y}@2x.png`;
    case 'topo':
      return `https://tile.opentopomap.org/${z}/${x}/${y}.png`;
    default:
      return getEsriTileUrl(x, y, z);
  }
}

// Remember successful loads and share requests that are still in progress.
const prefetchedUrls = new Set<string>();
const pendingTiles = new Map<string, Promise<boolean>>();

/**
 * Pre-fetches an image tile into browser HTTP cache
 */
export function prefetchTile(url: string, signal?: AbortSignal): Promise<boolean> {
  if (signal?.aborted) return Promise.resolve(false);
  if (prefetchedUrls.has(url)) {
    return Promise.resolve(true);
  }
  const pending = pendingTiles.get(url);
  if (pending) return pending;

  const request = new Promise<boolean>((resolve) => {
    const img = new Image();
    let finished = false;
    const finish = (loaded: boolean, cancel = false) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
      img.onload = null;
      img.onerror = null;
      if (cancel) img.src = '';
      if (loaded) prefetchedUrls.add(url);
      pendingTiles.delete(url);
      resolve(loaded);
    };
    const abort = () => finish(false, true);
    const timeout = window.setTimeout(abort, 8000);
    img.crossOrigin = 'anonymous';
    // Visible map tiles should always take precedence over background warming.
    img.fetchPriority = 'low';
    img.onload = () => finish(true);
    img.onerror = () => finish(false);
    signal?.addEventListener('abort', abort, { once: true });
    img.src = url;
  });
  pendingTiles.set(url, request);
  return request;
}

/**
 * Warm centers first, then nearby detail tiles, without flooding the network
 * queue used by the visible map. Aborted flights stop their background loads.
 */
export async function prefetchAreaTiles(
  lng: number,
  lat: number,
  basemapType: 'google' | 'esri' | 'carto' | 'topo',
  zoomLevels: number[] = [14, 15, 16],
  includeSiblings: boolean = true,
  signal?: AbortSignal
): Promise<void> {
  const urls: string[] = [];

  for (const z of zoomLevels) {
    const center = lngLatToTile(lng, lat, z);

    urls.push(getTileUrl(basemapType, center.x, center.y, z));
  }

  for (const z of [...zoomLevels].sort((a, b) => b - a)) {
    const center = lngLatToTile(lng, lat, z);
    if (includeSiblings && z >= 14) {
      // Pre-warm 3x3 tile grid (center + 8 siblings)
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const x = center.x + dx;
          const y = center.y + dy;
          urls.push(getTileUrl(basemapType, x, y, z));
        }
      }
    }
  }

  let nextUrl = 0;
  const warmTiles = async () => {
    while (!signal?.aborted && nextUrl < urls.length) {
      const url = urls[nextUrl++];
      await prefetchTile(url, signal);
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, urls.length) }, warmTiles));
}

/**
 * Pre-warms key tiles for all heritage sites in background
 */
export function prewarmAllHeritageSites(
  sites: Array<{ lng: number; lat: number }>,
  basemapType: 'google' | 'esri' = 'google'
): void {
  // Stagger loading to prevent blocking the network queue
  let delay = 300;
  sites.forEach((site) => {
    setTimeout(() => {
      prefetchAreaTiles(site.lng, site.lat, basemapType, [12, 14, 16], true);
    }, delay);
    delay += 250;
  });
}
