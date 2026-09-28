import { TERRAIN_TILE_CACHE } from './terrainTileCache.generated';

export const TERRAIN_TILE_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const prefix = TERRAIN_TILE_URL.slice(0, TERRAIN_TILE_URL.indexOf('{z}'));
const cachedTiles = new Set<string>(TERRAIN_TILE_CACHE.tiles);

export function resolveTerrainTileUrl(url: string): string {
  if (!url.startsWith(prefix)) return url;
  const coordinate = url.slice(prefix.length).match(/^(\d+)\/(\d+)\/(\d+)\.png(?:\?.*)?$/);
  if (!coordinate) return url;
  const [, z, x, y] = coordinate;
  const key = `${z}/${y}/${x}`;
  if (!cachedTiles.has(key)) return url;
  return `${import.meta.env.BASE_URL}map-tiles/${TERRAIN_TILE_CACHE.cacheId}/${key}.png`;
}
