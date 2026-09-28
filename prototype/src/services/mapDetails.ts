import type { Map as MapLibreMap } from 'maplibre-gl';
import { GOOGLE_DETAILS_VI_CACHE } from './googleDetailsViCache.generated';
import { GOOGLE_DETAILS_EN_CACHE } from './googleDetailsEnCache.generated';
import { lngLatToTile, prefetchTile } from './tilePreloader';
import { setupMaritimeLabels } from './maritimeLabels';

type MapLanguage = 'vi' | 'en';

const detailCaches = {
  vi: GOOGLE_DETAILS_VI_CACHE,
  en: GOOGLE_DETAILS_EN_CACHE,
};
const cachedTiles = {
  vi: new Set<string>(detailCaches.vi.tiles),
  en: new Set<string>(detailCaches.en.tiles),
};

export const MAP_DETAILS = {
  maxZoom: 20,
  attribution: 'Map labels, roads and points of interest © Google',
} as const;

export function getMapDetailsTileUrls(lang: MapLanguage): string[] {
  return [0, 1, 2, 3].map((server) =>
    `https://mt${server}.google.com/vt/lyrs=h&hl=${lang}&gl=VN&x={x}&y={y}&z={z}`);
}

/** Both basemaps use the same transparent roads/POI overlay and local pack. */
export function resolveMapDetailsTileUrl(url: string): string {
  if (!/^https:\/\/mt[0-3]\.google\.com\/vt\?/.test(url)) return url;
  const params = new URL(url).searchParams;
  if (params.get('lyrs') !== 'h') return url;
  const lang = params.get('hl');
  if (lang !== 'vi' && lang !== 'en') return url;
  const key = `${params.get('z')}/${params.get('y')}/${params.get('x')}`;
  return cachedTiles[lang].has(key)
    ? `${import.meta.env.BASE_URL}map-tiles/${detailCaches[lang].cacheId}/${key}.png`
    : url;
}

export function setupMapDetails(map: MapLibreMap, enabled: boolean, lang: MapLanguage): void {
  // isStyleLoaded also waits for imagery/DEM downloads. The style's base layer
  // is enough here: a slow satellite request must not block the details toggle.
  if (!map.getLayer('google-satellite-layer') && !map.getLayer('esri-satellite-layer')) return;

  for (const language of ['vi', 'en'] as const) {
    const id = `map-details-${language}`;
    const sourceId = `${id}-source`;
    const visible = enabled && language === lang;

    if (visible && !map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: 'raster',
        tiles: getMapDetailsTileUrls(language),
        tileSize: 256,
        maxzoom: MAP_DETAILS.maxZoom,
        attribution: MAP_DETAILS.attribution,
      });
      map.addLayer({
        id,
        type: 'raster',
        source: sourceId,
        paint: {
          'raster-opacity': 1,
          'raster-resampling': 'linear',
          'raster-fade-duration': 100,
        },
      });
      // A single label zoom across the view avoids duplicate names and mismatched
      // road widths where the imagery uses multiple LODs in a tilted camera.
      map.setSourceTileLodParams(1, 1, sourceId);
    }

    if (map.getLayer(id)) {
      const visibility = visible ? 'visible' : 'none';
      if (map.getLayoutProperty(id, 'visibility') !== visibility) {
        map.setLayoutProperty(id, 'visibility', visibility);
      }
    }
  }
  // Keep sources and GPU/browser tile caches when hidden for immediate reuse.
  setupMaritimeLabels(map, lang);
}

/** Warm only a small neighborhood, with visible map requests taking priority. */
export async function prefetchMapDetails(
  lng: number,
  lat: number,
  zoom: number,
  lang: MapLanguage,
  signal: AbortSignal,
): Promise<void> {
  // MapLibre zooms use a 512px world tile; these Google tiles are 256px.
  const tileZoom = Math.min(MAP_DETAILS.maxZoom, Math.max(6, Math.floor(zoom + 1)));
  const levels = [...new Set([tileZoom, Math.min(MAP_DETAILS.maxZoom, tileZoom + 1)])];
  const urls: string[] = [];
  for (const z of levels) {
    const center = lngLatToTile(lng, lat, z);
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const x = center.x + dx;
      const y = center.y + dy;
      const remote = `https://mt${(x + y) % 4}.google.com/vt/lyrs=h&hl=${lang}&gl=VN&x=${x}&y=${y}&z=${z}`;
      urls.push(resolveMapDetailsTileUrl(remote));
    }
  }
  let next = 0;
  const warm = async () => {
    while (!signal.aborted && next < urls.length) {
      await prefetchTile(urls[next++], signal);
    }
  };
  await Promise.all([warm(), warm()]);
}
