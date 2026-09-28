import type { Map as MapLibreMap } from 'maplibre-gl';
import { MARITIME_PLACES, MARITIME_GAZETTEER_URL } from '../data/maritimePlaces.generated';
import { calculateDistanceKm } from '../utils/geoCoordinates';

type MapLanguage = 'vi' | 'en';
type MaritimePlace = typeof MARITIME_PLACES[number];
interface MaritimeContext {
  place: MaritimePlace;
  island: MaritimePlace | null;
}

export const MARITIME_LABEL_SOURCE = MARITIME_GAZETTEER_URL;
const sourceId = 'vietnam-maritime-places';
const layerIds = ['vietnam-maritime-points', 'vietnam-island-labels', 'vietnam-island-close-labels', 'vietnam-archipelago-labels'];
const labelImages = new Map<string, ImageData>();

const placeData = {
  type: 'FeatureCollection' as const,
  features: MARITIME_PLACES.map((place) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [...place.coordinates] },
    properties: { id: place.id, kind: place.kind },
  })),
};

// These envelopes select a regional heading. They are not maritime boundaries
// and are never drawn as polygons or used to classify territorial waters.
const regionContexts = [
  { id: 'hoang-sa', bounds: [110.5, 15.4, 113.5, 17.6] },
  { id: 'truong-sa', bounds: [111.3, 6.75, 117.5, 12.3] },
] as const;

/** Keep the regional name visible when its geographic label leaves the view. */
export function getMaritimeContext(lng: number, lat: number, zoom: number): MaritimeContext | null {
  if (zoom < 8.5) return null;
  let archipelago: MaritimePlace | null = null;
  for (const region of regionContexts) {
    const [west, south, east, north] = region.bounds;
    if (lng >= west && lng <= east && lat >= south && lat <= north) {
      archipelago = MARITIME_PLACES.find((place) => place.kind === 'archipelago' && place.region === region.id) ?? null;
      break;
    }
  }
  if (zoom < 11) return archipelago ? { place: archipelago, island: null } : null;
  let nearest: MaritimePlace | null = null;
  let nearestDistance = Infinity;
  for (const place of MARITIME_PLACES) {
    if (place.kind !== 'island' || place.region !== (archipelago?.region ?? null)) continue;
    const distance = calculateDistanceKm(lat, lng, place.coordinates[1], place.coordinates[0]);
    if (distance <= place.contextRadiusKm && distance < nearestDistance) {
      nearest = place;
      nearestDistance = distance;
    }
  }
  if (archipelago) return { place: archipelago, island: nearest };
  return nearest ? { place: nearest, island: null } : null;
}

function createLabelImage(place: MaritimePlace, lang: MapLanguage): ImageData {
  const key = `${place.id}-${lang}`;
  const cached = labelImages.get(key);
  if (cached) return cached;
  const title = lang === 'vi' ? place.nameVi : place.nameEn;
  const country = lang === 'vi' ? 'Việt Nam' : 'Viet Nam';
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas text rendering is unavailable');
  const titleFont = `600 ${place.kind === 'archipelago' ? 18 : 16}px "Segoe UI", Arial, sans-serif`;
  context.font = titleFont;
  const width = Math.ceil(context.measureText(title).width + 24);
  canvas.width = width * 2;
  canvas.height = 52 * 2;
  context.scale(2, 2);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineJoin = 'round';
  context.font = titleFont;
  context.lineWidth = 5;
  context.strokeStyle = 'rgba(8, 16, 27, 0.95)';
  context.strokeText(title, width / 2, 17);
  context.fillStyle = '#ffffff';
  context.fillText(title, width / 2, 17);

  context.font = '600 12px "Segoe UI", Arial, sans-serif';
  const countryWidth = context.measureText(country).width;
  const flagX = (width - countryWidth - 22) / 2;
  context.fillStyle = '#da251d';
  context.fillRect(flagX, 33, 16, 11);
  context.fillStyle = '#ffff00';
  context.beginPath();
  for (let corner = 0; corner < 10; corner++) {
    const angle = -Math.PI / 2 + corner * Math.PI / 5;
    const radius = corner % 2 === 0 ? 4 : 1.6;
    const x = flagX + 8 + Math.cos(angle) * radius;
    const y = 38.5 + Math.sin(angle) * radius;
    if (corner === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fill();
  context.textAlign = 'left';
  context.lineWidth = 4;
  context.strokeText(country, flagX + 22, 39);
  context.fillStyle = '#f9dc92';
  context.fillText(country, flagX + 22, 39);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  labelImages.set(key, image);
  return image;
}

/** Local labels stay available in either provider, independently of raster POIs. */
export function setupMaritimeLabels(map: MapLibreMap, lang: MapLanguage): void {
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'geojson', data: placeData, maxzoom: 20,
      attribution: 'Biển đảo: địa danh theo nguồn Việt Nam, Thông tư 33/2024/TT-BTNMT',
    });
  }
  for (const place of MARITIME_PLACES) {
    const id = `maritime-label-${place.id}-${lang}`;
    if (!map.hasImage(id)) map.addImage(id, createLabelImage(place, lang), { pixelRatio: 2 });
  }
  if (!map.getLayer(layerIds[0])) {
    map.addLayer({
      id: layerIds[0], type: 'circle', source: sourceId, minzoom: 8,
      filter: ['==', ['get', 'kind'], 'island'],
      paint: { 'circle-radius': 3.5, 'circle-color': '#f9dc92', 'circle-stroke-color': '#111827', 'circle-stroke-width': 1.5 },
    });
  }
  for (const [id, near] of [[layerIds[1], false], [layerIds[2], true]] as const) {
    if (!map.getLayer(id)) {
      map.addLayer({
        id, type: 'symbol', source: sourceId,
        minzoom: near ? 11.5 : 8,
        ...(near ? {} : { maxzoom: 11.5 }),
        filter: ['==', ['get', 'kind'], 'island'],
        layout: {
          'icon-image': ['concat', 'maritime-label-', ['get', 'id'], `-${lang}`],
          'icon-anchor': 'bottom', 'icon-offset': [0, -7],
          'icon-pitch-alignment': 'viewport', 'icon-rotation-alignment': 'viewport',
          'icon-allow-overlap': near, 'icon-ignore-placement': near,
          'symbol-sort-key': 1,
        },
      });
    } else {
      map.setLayoutProperty(id, 'icon-image', ['concat', 'maritime-label-', ['get', 'id'], `-${lang}`]);
    }
  }
  const regionLayer = layerIds[3];
  if (!map.getLayer(regionLayer)) {
    map.addLayer({
      id: regionLayer, type: 'symbol', source: sourceId, minzoom: 6,
      filter: ['==', ['get', 'kind'], 'archipelago'],
      layout: {
        'icon-image': ['concat', 'maritime-label-', ['get', 'id'], `-${lang}`],
        'icon-pitch-alignment': 'viewport', 'icon-rotation-alignment': 'viewport',
        'icon-allow-overlap': true, 'icon-ignore-placement': true,
      },
    });
  } else {
    map.setLayoutProperty(regionLayer, 'icon-image', ['concat', 'maritime-label-', ['get', 'id'], `-${lang}`]);
  }
  // Raster references added after switching language must remain under these labels.
  for (const id of layerIds) map.moveLayer(id);
}
