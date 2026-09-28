// The live World Imagery mosaic contains a cloudy image strip near Cồn Chim.
// Pin the inspected Wayback release so an upstream update cannot reintroduce it.
// Release date is the basemap publication date, not the image acquisition date.
// https://www.arcgis.com/home/item.html?id=929ed51e5c11448c8ff82ef637bf42d6
import { ESRI_TILE_CACHE } from './esriTileCache.generated';

export const ESRI_IMAGERY = {
  releaseDate: '2025-12-18',
  tileUrl: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/13192/{z}/{y}/{x}',
  maxZoom: 17,
  attribution: 'Esri World Imagery Wayback (2025-12-18), Esri, Maxar, Earthstar Geographics, GIS Community',
} as const;

const cachedTiles = new Set<string>(ESRI_TILE_CACHE.tiles);
const remoteTilePrefix = ESRI_IMAGERY.tileUrl.slice(0, ESRI_IMAGERY.tileUrl.indexOf('{z}'));
const releaseMatches = remoteTilePrefix.includes(`/tile/${ESRI_TILE_CACHE.releaseId}/`);

/** Serve the kiosk's main imagery from the app; retain Esri for other regions. */
export function resolveEsriTileUrl(url: string): string {
  if (!releaseMatches || !url.startsWith(remoteTilePrefix)) return url;
  const key = url.slice(remoteTilePrefix.length).split('?')[0];
  if (!cachedTiles.has(key)) return url;
  return `${import.meta.env.BASE_URL}map-tiles/esri-${ESRI_TILE_CACHE.releaseId}/${key}.jpg`;
}

export function getEsriTileUrl(x: number, y: number, z: number): string {
  return resolveEsriTileUrl(ESRI_IMAGERY.tileUrl
    .replace('{z}', String(z))
    .replace('{y}', String(y))
    .replace('{x}', String(x)));
}
