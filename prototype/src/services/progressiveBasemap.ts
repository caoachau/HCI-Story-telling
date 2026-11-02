import type { Map as MapLibreMap, RasterLayerSpecification, StyleSpecification } from 'maplibre-gl';
import { ESRI_IMAGERY } from './esriImagery';
import { GOOGLE_IMAGERY } from './googleImagery';

export type BasemapType = 'google-sat' | 'satellite';

const providers = {
  satellite: { id: 'esri-satellite', tiles: [ESRI_IMAGERY.tileUrl], ...ESRI_IMAGERY },
  'google-sat': { id: 'google-satellite', tiles: [...GOOGLE_IMAGERY.tileUrls], ...GOOGLE_IMAGERY },
};
const types = Object.keys(providers) as BasemapType[];

/** A separate, inexpensive source keeps geographic coverage while detail loads.
 * Its zoom never follows the flight, so cached overview tiles cannot be replaced
 * by an empty set of higher-resolution tiles. Both providers keep their caches.
 */
export function createBasemapStyle(initial: BasemapType): StyleSpecification {
  const sources: StyleSpecification['sources'] = {};
  const layers: RasterLayerSpecification[] = [];
  for (const type of types) {
    const provider = providers[type];
    for (const overview of [true, false]) {
      const id = provider.id + (overview ? '-overview' : '');
      sources[id] = {
        type: 'raster',
        tiles: overview ? provider.tiles : [`heritage-block://${type === 'satellite' ? 'esri' : 'google'}/{z}/{x}/{y}`],
        tileSize: overview ? 256 : 1024,
        minzoom: overview ? 0 : 7,
        // A 1024px tile contains the original 4x4 grid at z+2: same geographic
        // detail, sixteen times fewer requests/textures, not lower resolution.
        maxzoom: overview ? 9 : provider.maxZoom - 2,
        attribution: provider.attribution,
      };
      layers.push({
        id: `${id}-layer`, type: 'raster', source: id,
        ...(overview ? {} : { minzoom: 8 }),
        // Start with only the few overview tiles. Controls and markers become
        // available without waiting for hundreds of detailed/terrain requests.
        layout: { visibility: type === initial && overview ? 'visible' : 'none' },
        paint: {
          'raster-resampling': 'linear',
          'raster-fade-duration': overview ? 0 : 120,
          'raster-opacity': 1,
          'raster-opacity-transition': { duration: 0 },
          'raster-contrast': type === 'google-sat' ? 0.12 : 0.06,
          'raster-saturation': type === 'google-sat' ? 0.22 : -0.02,
          'raster-brightness-max': 0.98,
        },
      });
    }
  }
  return { version: 8, sources, layers };
}

export function configureBasemapLod(map: MapLibreMap): void {
  for (const { id } of Object.values(providers)) {
    map.setSourceTileLodParams(3, 2, id);
    map.setSourceTileLodParams(1, 1, `${id}-overview`);
  }
}

/** Prepare a new provider behind the current image; never tear down the style.
 * Returning a cancellation function prevents a slow old choice winning after
 * rapid switches. Hidden source caches, terrain and road labels are preserved.
 */
export function revealBasemap(map: MapLibreMap, type: BasemapType): () => void {
  const id = providers[type].id;
  const overview = `${id}-overview`;
  const layer = `${overview}-layer`;
  let cancelled = false;
  const wasVisible = map.getLayoutProperty(layer, 'visibility') === 'visible';
  let viewUpdated = wasVisible;
  if (!wasVisible) {
    map.setPaintProperty(layer, 'raster-opacity', 0);
    map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  const reveal = () => {
    if (cancelled || !viewUpdated || !map.isSourceLoaded(overview)) return;
    map.off('sourcedata', reveal);
    for (const other of types) {
      const otherId = providers[other].id;
      const visibility = other === type ? 'visible' : 'none';
      map.setLayoutProperty(`${otherId}-overview-layer`, 'visibility', visibility);
      map.setLayoutProperty(`${otherId}-layer`, 'visibility', visibility);
    }
    map.setPaintProperty(layer, 'raster-opacity', 1);
  };
  const afterRender = () => {
    viewUpdated = true;
    reveal();
  };
  map.on('sourcedata', reveal);
  // A hidden source reports "loaded" with zero tiles. Let the renderer select
  // its visible tiles before checking readiness, otherwise it blanks the map.
  if (wasVisible) reveal();
  else map.once('render', afterRender);
  return () => {
    cancelled = true;
    map.off('sourcedata', reveal);
    map.off('render', afterRender);
    // A cancelled preparation must not keep downloading invisible tiles.
    if (map.getPaintProperty(layer, 'raster-opacity') === 0) {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }
  };
}
