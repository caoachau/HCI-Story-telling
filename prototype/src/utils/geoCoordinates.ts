/**
 * Utility functions for cartographic and geodetic coordinate transformations
 * Supporting WGS-84 & VN-2000 coordinate display for Trà Vinh heritage interpretation
 */

export function toDMS(coordinate: number, type: 'lat' | 'lng'): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  let direction = '';
  if (type === 'lat') {
    direction = coordinate >= 0 ? 'N' : 'S';
  } else {
    direction = coordinate >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"${direction}`;
}

export function formatCoordinates(lat: number, lng: number): {
  dms: string;
  decimal: string;
  latDms: string;
  lngDms: string;
  utmZone: string;
} {
  const latDms = toDMS(lat, 'lat');
  const lngDms = toDMS(lng, 'lng');

  // Trà Vinh sits at 106°E - UTM Zone 48N
  const utmZone = lng < 108 ? 'UTM Zone 48N' : 'UTM Zone 49N';

  return {
    dms: `${latDms} ${lngDms}`,
    decimal: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
    latDms,
    lngDms,
    utmZone,
  };
}

/**
 * Bounds for National Geographic Context (Vietnam Physical Map)
 */
export const VIETNAM_MAP_BOUNDS = {
  north: 24.0,
  south: 8.0,
  west: 101.8,
  east: 110.3,
};

export function getVietnamMapPercentages(lat: number, lng: number): { xPercent: number; yPercent: number } {
  const { north, south, west, east } = VIETNAM_MAP_BOUNDS;
  const xPercent = ((lng - west) / (east - west)) * 100;
  const yPercent = ((north - lat) / (north - south)) * 100;
  return {
    xPercent: Math.min(100, Math.max(0, xPercent)),
    yPercent: Math.min(100, Math.max(0, yPercent)),
  };
}

/**
 * Focused Bounds for Trà Vinh Heritage Corridor (Mekong Delta South Coast)
 * Spans from Long Đức (North) to Ba Động / Duyên Hải (South Coast),
 * and from Châu Thành / TP Trà Vinh (West) to Cổ Chiên / Cồn Chim (East).
 */
export const TRA_VINH_MAP_BOUNDS = {
  north: 10.05,
  south: 9.55,
  west: 106.22,
  east: 106.62,
};

export function getTraVinhMapPercentages(lat: number, lng: number): { xPercent: number; yPercent: number } {
  const { north, south, west, east } = TRA_VINH_MAP_BOUNDS;
  const xPercent = ((lng - west) / (east - west)) * 100;
  const yPercent = ((north - lat) / (north - south)) * 100;
  return {
    xPercent: Math.min(96, Math.max(4, xPercent)),
    yPercent: Math.min(96, Math.max(4, yPercent)),
  };
}

/**
 * Decluttering offset for closely clustered sites (Ao Bà Om, Chùa Âng, Bảo tàng Khmer in Phường 8, TP Trà Vinh)
 * When viewed from a distance, provides subtle non-overlapping offsets to prevent marker collisions.
 */
export function getDeclutterOffset(siteId: string, zoomFactor: number): { x: number; y: number } {
  // If zoomed in close (zoomFactor > 1.8), render exactly at true coordinates (offset = 0)
  if (zoomFactor > 1.8) {
    return { x: 0, y: 0 };
  }

  // At distance, subtle radial fan-out for the Phường 8 cluster
  switch (siteId) {
    case 'ao-ba-om':
      return { x: 0, y: -16 * (1.8 - zoomFactor) }; // slightly north
    case 'chua-ang':
      return { x: -20 * (1.8 - zoomFactor), y: 12 * (1.8 - zoomFactor) }; // southwest
    case 'bao-tang-khmer':
      return { x: 20 * (1.8 - zoomFactor), y: 12 * (1.8 - zoomFactor) }; // southeast
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Calculates Great-Circle Distance between two coordinates in Kilometers (Haversine Formula)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
