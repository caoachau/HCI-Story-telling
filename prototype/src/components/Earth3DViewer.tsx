import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {
  HERITAGE_SITES,
  HeritageSite,
} from '../data/heritageSites';
import {
  prefetchAreaTiles,
} from '../services/tilePreloader';
import { ESRI_IMAGERY } from '../services/esriImagery';
import { GOOGLE_IMAGERY } from '../services/googleImagery';
import { TERRAIN_TILE_URL } from '../services/terrainImagery';
import { setupMapDetails, prefetchMapDetails } from '../services/mapDetails';
import { getMaritimeContext, MARITIME_LABEL_SOURCE } from '../services/maritimeLabels';
import { resolveMapTileUrl, registerMapTileCache } from '../services/mapTileCache';
import { calculateDistanceKm } from '../utils/geoCoordinates';
import { createHeritageMarker, updateHeritageMarker, updateHeritageMarkerLayout } from '../services/heritageMarkers';
import {
  CameraManager,
  CameraState,
  CameraChapterView,
} from '../services/cameraManager';
import {
  Compass,
  Layers,
  Eye,
  Navigation,
  Globe,
  Play,
  Pause,
  Sparkles,
  RotateCw,
  Orbit,
  Hand,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// MapLibre 6 cannot infer its worker location from Vite's dependency cache.
// Bundle the worker and its imports so DEM/GeoJSON do not remain loading.
maplibregl.setWorkerUrl(maplibreWorkerUrl);

interface Earth3DViewerProps {
  selectedSite: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  recenterRequestId?: number;
  lang: 'vi' | 'en';
  viewMode: '3d' | '2d';
  onToggleViewMode: (mode: '3d' | '2d') => void;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
  activeCategoryFilter?: string;
  onOpenStorytelling?: () => void;
  isStorytellingOpen?: boolean;
  onMapStoryFocus?: (site: HeritageSite | null) => void;
  onHomeClick?: () => void;
  hasUserSelectedSite?: boolean;
  isReduceMotion?: boolean;
  onRegisterCameraManager?: (manager: CameraManager) => void;
}

export type BasemapType = 'google-sat' | 'satellite';
const BASEMAP_MAX_ZOOM: Record<BasemapType, number> = {
  satellite: ESRI_IMAGERY.maxZoom,
  'google-sat': 19.8,
};

// Real World GIS Basemap Configurations (WGS-84 / Web Mercator EPSG:3857)
const BASEMAP_STYLES: Record<BasemapType, maplibregl.StyleSpecification> = {
  'google-sat': {
    version: 8,
    sources: {
      'google-satellite': {
        type: 'raster',
        tiles: [...GOOGLE_IMAGERY.tileUrls],
        tileSize: 256,
        attribution: GOOGLE_IMAGERY.attribution,
        maxzoom: GOOGLE_IMAGERY.maxZoom,
      },
    },
    layers: [
      {
        id: 'google-satellite-layer',
        type: 'raster',
        source: 'google-satellite',
        paint: {
          'raster-resampling': 'linear',
          'raster-fade-duration': 200,
          'raster-opacity': 1.0,
          'raster-contrast': 0.12,
          'raster-saturation': 0.22,
          'raster-brightness-max': 0.98,
        },
      },
    ],
  },
  satellite: {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [ESRI_IMAGERY.tileUrl],
        tileSize: 256,
        attribution: ESRI_IMAGERY.attribution,
        maxzoom: ESRI_IMAGERY.maxZoom,
      },
    },
    layers: [
      {
        id: 'esri-satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        paint: {
          'raster-resampling': 'linear',
          'raster-fade-duration': 200,
          'raster-saturation': -0.02,
          'raster-contrast': 0.06,
          'raster-brightness-max': 0.98,
        },
      },
    ],
  },
};

// TrĂ  Vinh Regional Geographic Center
export const TRA_VINH_CENTER: [number, number] = [106.345, 9.855];
export const TRA_VINH_OVERVIEW_ZOOM = 10.4;

// Separate entry/exit thresholds keep the story stable near a zoom boundary.
const STORY_OPEN_ZOOM = 15.3;
const STORY_CLOSE_ZOOM = 14.4;
const STORY_OPEN_DISTANCE_KM = 0.5;
const STORY_CLOSE_DISTANCE_KM = 0.9;

function isSiteInCategory(site: HeritageSite, category: string): boolean {
  if (category === 'khmer') return ['ao-ba-om', 'chua-ang', 'bao-tang-khmer'].includes(site.id);
  if (category === 'eco') return ['con-chim', 'bien-ba-dong', 'ao-ba-om'].includes(site.id);
  if (category === 'history') return ['den-tho-bac', 'chua-hang', 'chua-ang'].includes(site.id);
  return true;
}

function configureGestureMotion(map: maplibregl.Map, reduceMotion: boolean): void {
  // Use MapLibre's continuous gesture animation: wheel events share one ease,
  // and both mouse/touch pans decelerate without restarting camera transitions.
  map.scrollZoom.setWheelZoomRate(1 / 650);
  map.scrollZoom.setZoomRate(1 / 140);
  map.touchZoomRotate.setZoomRate(0.82);
  map.touchZoomRotate.setZoomThreshold(0.04);
  map.dragPan.enable({
    linearity: 0.3,
    maxSpeed: reduceMotion ? 0 : 650,
    deceleration: 2600,
    // Match the release speed and let it taper continuously to zero. Do not
    // ease in again on release, which would briefly stop and restart the pan.
    easing: (t) => 1 - (1 - t) * (1 - t),
  });
}

export const Earth3DViewer: React.FC<Earth3DViewerProps> = ({
  selectedSite,
  onSelectSite,
  recenterRequestId = 0,
  lang,
  viewMode,
  onToggleViewMode,
  isAutoTouring,
  onToggleAutoTour,
  activeCategoryFilter = 'all',
  onOpenStorytelling,
  isStorytellingOpen = false,
  onMapStoryFocus,
  onHomeClick,
  hasUserSelectedSite = false,
  isReduceMotion = false,
  onRegisterCameraManager,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersMapRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const cameraManagerRef = useRef<CameraManager>(new CameraManager());

  // UI state
  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>('satellite');
  const [showMapDetails, setShowMapDetails] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [zoomSliderValue, setZoomSliderValue] = useState(TRA_VINH_OVERVIEW_ZOOM);
  const [bearingSliderValue, setBearingSliderValue] = useState(-10);
  const [telemetry, setTelemetry] = useState({
    lat: TRA_VINH_CENTER[1],
    lng: TRA_VINH_CENTER[0],
    zoom: TRA_VINH_OVERVIEW_ZOOM,
    pitch: 45,
    bearing: -10,
  });

  const selectedSiteRef = useRef<HeritageSite>(selectedSite);
  selectedSiteRef.current = selectedSite;
  // DOM marker listeners live for the map's lifetime; always use the latest
  // selection handler so a repeated click sees the currently selected site.
  const onSelectSiteRef = useRef(onSelectSite);
  onSelectSiteRef.current = onSelectSite;
  const handledRecenterRequestRef = useRef(0);

  const viewModeRef = useRef<'3d' | '2d'>(viewMode);
  viewModeRef.current = viewMode;

  const onOpenStorytellingRef = useRef(onOpenStorytelling);
  onOpenStorytellingRef.current = onOpenStorytelling;
  const storyContextRef = useRef({ isOpen: isStorytellingOpen, hasSelection: hasUserSelectedSite, category: activeCategoryFilter, onFocus: onMapStoryFocus });
  storyContextRef.current = { isOpen: isStorytellingOpen, hasSelection: hasUserSelectedSite, category: activeCategoryFilter, onFocus: onMapStoryFocus };
  const mapFocusedSiteIdRef = useRef<string | null>(null);

  const currentBasemapRef = useRef<BasemapType>(currentBasemap);
  currentBasemapRef.current = currentBasemap;
  const appliedBasemapRef = useRef<BasemapType>(currentBasemap);
  const mapLanguageRef = useRef(lang);
  mapLanguageRef.current = lang;
  const showMapDetailsRef = useRef(showMapDetails);
  showMapDetailsRef.current = showMapDetails;

  const isInitialMountRef = useRef<boolean>(true);
  const lastTargetSiteIdRef = useRef<string | null>(null);
  const sliderAnimationFrameRef = useRef<number | null>(null);
  const sliderLastFrameTimeRef = useRef(0);
  const sliderTargetsRef = useRef<{ zoom: number; bearing: number } | null>(null);
  const isSliderDraggingRef = useRef(false);
  const lastTelemetryUpdateRef = useRef(0);

  const cancelSliderAnimation = useCallback(() => {
    if (sliderAnimationFrameRef.current !== null) {
      cancelAnimationFrame(sliderAnimationFrameRef.current);
      sliderAnimationFrameRef.current = null;
    }
    sliderLastFrameTimeRef.current = 0;
    sliderTargetsRef.current = null;
  }, []);

  const setupBasemapRendering = useCallback((map: maplibregl.Map) => {
    // Keep detailed imagery near the landmark and use fewer, coarser tiles
    // in the distance for either provider.
    for (const sourceId of ['esri-satellite', 'google-satellite']) {
      if (map.getSource(sourceId)) map.setSourceTileLodParams(3, 2, sourceId);
    }
  }, []);

  // Configure DEM terrain in 3D mode
  const setupTerrain = useCallback((map: maplibregl.Map, is3D: boolean) => {
    try {
      if (!map.getSource('terrain-dem')) {
        map.addSource('terrain-dem', {
          type: 'raster-dem',
          tiles: [TERRAIN_TILE_URL],
          encoding: 'terrarium',
          tileSize: 256,
          // The flat delta does not need new high-resolution DEM downloads
          // at every close zoom. Reuse the regional elevation tiles instead.
          maxzoom: 12,
        });
      }

      if (is3D) {
        // TrĂ  Vinh is a flat delta. Keep relief subtle so DEM tile boundaries
        // do not stretch the satellite imagery into visible slanted blocks.
        map.setTerrain({ source: 'terrain-dem', exaggeration: 0.7 });
      } else {
        map.setTerrain(null);
      }
    } catch {
      // In case raster-dem tiles are unavailable, fallback cleanly
    }
  }, []);

  const publishCameraTelemetry = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    const zoom = map.getZoom();
    markersMapRef.current.forEach((marker, siteId) => {
      updateHeritageMarkerLayout(marker.getElement(), siteId, zoom);
    });
    setTelemetry({
      lat: center.lat,
      lng: center.lng,
      zoom: parseFloat(map.getZoom().toFixed(1)),
      pitch: Math.round(map.getPitch()),
      bearing: Math.round(map.getBearing()),
    });
    if (!isSliderDraggingRef.current && sliderAnimationFrameRef.current === null) {
      setZoomSliderValue(map.getZoom());
      setBearingSliderValue(map.getBearing());
    }
  }, []);

  // Let MapLibre animate every frame; the controls only need ~12 updates/sec.
  const handleCameraUpdate = useCallback(() => {
    const now = performance.now();
    if (now - lastTelemetryUpdateRef.current < 80) return;
    lastTelemetryUpdateRef.current = now;
    publishCameraTelemetry();
  }, [publishCameraTelemetry]);

  // Follow slider targets with a damped animation so continuous input never
  // restarts a camera transition or causes an abrupt jump.
  const animateSliderCamera = useCallback((timestamp: number) => {
    const map = mapRef.current;
    const target = sliderTargetsRef.current;
    if (!map || !target) {
      sliderAnimationFrameRef.current = null;
      sliderLastFrameTimeRef.current = 0;
      return;
    }

    const elapsed = sliderLastFrameTimeRef.current === 0
      ? 16
      : Math.min(timestamp - sliderLastFrameTimeRef.current, 50);
    sliderLastFrameTimeRef.current = timestamp;
    const blend = 1 - Math.exp(-elapsed / 240);
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const zoomDelta = target.zoom - zoom;
    const bearingDelta = ((target.bearing - bearing + 540) % 360) - 180;

    if (Math.abs(zoomDelta) < 0.008 && Math.abs(bearingDelta) < 0.08) {
      map.jumpTo({ zoom: target.zoom, bearing: target.bearing });
      sliderAnimationFrameRef.current = null;
      sliderLastFrameTimeRef.current = 0;
      sliderTargetsRef.current = null;
      setZoomSliderValue(target.zoom);
      setBearingSliderValue(target.bearing);
      return;
    }

    map.jumpTo({
      zoom: zoom + zoomDelta * blend,
      bearing: bearing + bearingDelta * blend,
    });
    sliderAnimationFrameRef.current = requestAnimationFrame(animateSliderCamera);
  }, []);

  const animateMapToSliderTargets = useCallback(() => {
    if (sliderAnimationFrameRef.current === null) {
      sliderLastFrameTimeRef.current = 0;
      sliderAnimationFrameRef.current = requestAnimationFrame(animateSliderCamera);
    }
  }, [animateSliderCamera]);

  const syncStoryFocusWithMap = useCallback(() => {
    const map = mapRef.current;
    const context = storyContextRef.current;
    if (!map || !context.onFocus) return;

    const closeStory = () => {
      if (!context.isOpen) return;
      context.isOpen = false;
      context.onFocus?.(null);
    };
    if (map.getZoom() <= STORY_CLOSE_ZOOM) {
      closeStory();
      return;
    }

    const center = map.getCenter();
    const canvas = map.getCanvas();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;

    const nearby = HERITAGE_SITES
      .filter((site) => isSiteInCategory(site, context.category))
      .map((site) => {
        const point = map.project([site.lng, site.lat]);
        return {
          site,
          distance: calculateDistanceKm(center.lat, center.lng, site.lat, site.lng),
          visible: point.x >= 0 && point.x <= width && point.y >= 0 && point.y <= height,
          nearCenter: Math.hypot((point.x - width / 2) / (width * 0.35), (point.y - height / 2) / (height * 0.35)) <= 1,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    const current = nearby.find(({ site }) => site.id === selectedSiteRef.current.id);
    const canKeepCurrent = context.isOpen && current?.visible && current.distance <= STORY_CLOSE_DISTANCE_KM;
    const candidate = map.getZoom() >= STORY_OPEN_ZOOM
      ? nearby.find(({ distance, visible, nearCenter }) => distance <= STORY_OPEN_DISTANCE_KM && visible && nearCenter)
      : undefined;

    if (candidate) {
      const isCurrentSite = candidate.site.id === selectedSiteRef.current.id;
      // In the Ao Ba Om cluster, switch only when another landmark is clearly
      // closer, so small pans do not alternate between neighboring stories.
      if (canKeepCurrent && (isCurrentSite || candidate.distance >= current.distance * 0.75)) return;
      if (!isCurrentSite || !context.hasSelection) {
        mapFocusedSiteIdRef.current = candidate.site.id;
      }
      context.isOpen = true;
      context.hasSelection = true;
      selectedSiteRef.current = candidate.site;
      context.onFocus(candidate.site);
      return;
    }

    if (!canKeepCurrent) closeStory();
  }, []);

  // Initialize CameraManager callbacks
  useEffect(() => {
    const mgr = cameraManagerRef.current;
    mgr.setReduceMotion(isReduceMotion);
    mgr.setCallbacks({
      onStateChange: (st) => setCameraState(st),
      onFlightComplete: () => {
        // Flight ended
      },
      onSettleComplete: () => {
        // The manager already waits for destination tiles after arrival.
        onOpenStorytellingRef.current?.();
      },
      onOverviewArrived: () => {
        lastTargetSiteIdRef.current = null;
      },
    });

    if (onRegisterCameraManager) {
      onRegisterCameraManager(mgr);
    }
  }, [isReduceMotion, onRegisterCameraManager]);

  // 1. Initialize MapLibre GL Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    registerMapTileCache();

    const initialPitch = viewMode === '3d' ? 45 : 0;
    const initialBearing = viewMode === '3d' ? -10 : 0;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLES[currentBasemap],
      transformRequest: (url, resourceType) => ({
        url: resourceType === 'Tile' ? resolveMapTileUrl(url) : url,
      }),
      center: TRA_VINH_CENTER,
      zoom: TRA_VINH_OVERVIEW_ZOOM,
      pitch: initialPitch,
      bearing: initialBearing,
      maxPitch: 62,
      minZoom: 6,
      maxZoom: BASEMAP_MAX_ZOOM[currentBasemap],
      dragPan: true,
      touchZoomRotate: true,
      rotateSpeed: 0.6,
      pitchSpeed: -0.35,
      clickTolerance: 4,
      cooperativeGestures: false,
      doubleClickZoom: true,
      attributionControl: false,
      maxTileCacheSize: 700,
      maxTileCacheZoomLevels: 10,
      fadeDuration: 200,
      refreshExpiredTiles: false,
      // Keep parent imagery available while zooming rather than discarding
      // requests at each zoom step and exposing gaps between tile levels.
      cancelPendingTileRequestsWhileZooming: false,
      anisotropicFilterPitch: 24,
      canvasContextAttributes: {
        antialias: true,
        powerPreference: 'high-performance',
      },
    });

    mapRef.current = map;
    appliedBasemapRef.current = currentBasemap;
    cameraManagerRef.current.setMap(map);
    configureGestureMotion(map, isReduceMotion);

    map.on('load', () => {
      setIsMapLoaded(true);
      setupBasemapRendering(map);
      setupTerrain(map, viewModeRef.current === '3d');
      setupMapDetails(map, showMapDetailsRef.current, mapLanguageRef.current);
      handleCameraUpdate();

    });

    map.on('move', handleCameraUpdate);
    map.on('moveend', () => {
      // Orbit and slider jumpTo calls emit moveend every frame. Only flush
      // the final camera values after a native flight or user gesture ends.
      if (cameraManagerRef.current.getState() !== 'orbiting' && sliderAnimationFrameRef.current === null) {
        publishCameraTelemetry();
      }
    });

    let storyNavigationPending = false;
    let storyFocusTimer: number | null = null;
    const clearStoryFocusTimer = () => {
      if (storyFocusTimer !== null) window.clearTimeout(storyFocusTimer);
      storyFocusTimer = null;
    };
    const scheduleStoryFocus = () => {
      if (!storyNavigationPending) return;
      clearStoryFocusTimer();
      storyFocusTimer = window.setTimeout(() => {
        storyFocusTimer = null;
        const state = cameraManagerRef.current.getState();
        if (state !== 'idle' && state !== 'userControlled') {
          storyNavigationPending = false;
          return;
        }
        // Wait for the gesture/slider to settle before changing the map's width.
        if (map.isMoving() || sliderAnimationFrameRef.current !== null || isSliderDraggingRef.current) {
          scheduleStoryFocus();
          return;
        }
        storyNavigationPending = false;
        syncStoryFocusWithMap();
      }, 220);
    };
    const handleStoryNavigation = () => {
      const state = cameraManagerRef.current.getState();
      if (state !== 'idle' && state !== 'userControlled') {
        storyNavigationPending = false;
        clearStoryFocusTimer();
        return;
      }
      storyNavigationPending = true;
      scheduleStoryFocus();
    };
    // Listen to navigation, not resize/rotation: manually closing the story or
    // starting a 360-degree orbit must not reopen it by itself.
    map.on('zoom', handleStoryNavigation);
    map.on('drag', handleStoryNavigation);
    map.on('moveend', scheduleStoryFocus);

    // Mouse and touch gestures take over from flight/orbit animations.
    // Programmatic camera events have no originalEvent and must keep running.
    const handleUserCameraGesture = (event: { originalEvent?: unknown }) => {
      if (!event.originalEvent) return;
      cancelSliderAnimation();
      cameraManagerRef.current.cancelCurrentFlight(true);
    };
    // Stop before the first gesture frame: jumpTo in an orbit would otherwise
    // reset an in-progress pinch/wheel handler before it emits zoomstart.
    const handleOrbitInput = (event: { originalEvent?: unknown }) => {
      if (cameraManagerRef.current.getState() === 'orbiting' || sliderAnimationFrameRef.current !== null) {
        handleUserCameraGesture(event);
      }
    };
    map.on('mousedown', handleOrbitInput);
    map.on('touchstart', handleOrbitInput);
    map.on('wheel', handleOrbitInput);
    map.on('dragstart', handleUserCameraGesture);
    map.on('zoomstart', handleUserCameraGesture);
    map.on('rotatestart', handleUserCameraGesture);
    map.on('pitchstart', handleUserCameraGesture);

    return () => {
      clearStoryFocusTimer();
      cancelSliderAnimation();
      cameraManagerRef.current.setMap(null);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    configureGestureMotion(map, isReduceMotion);
  }, [isMapLoaded, isReduceMotion]);

  // 2. Handle Basemap Change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    // The constructor already applied the initial style. Reapplying it on
    // `load` tears down freshly added DEM/GIS sources while their tiles load.
    if (appliedBasemapRef.current === currentBasemap) return;
    appliedBasemapRef.current = currentBasemap;
    cameraManagerRef.current.stopOrbit();
    cancelSliderAnimation();

    const maxZoom = BASEMAP_MAX_ZOOM[currentBasemap];
    map.setMaxZoom(maxZoom);
    if (map.getZoom() > maxZoom) {
      map.jumpTo({ zoom: maxZoom });
    }

    const restoreLayers = () => {
      setupBasemapRendering(map);
      setupTerrain(map, viewModeRef.current === '3d');
      setupMapDetails(map, showMapDetailsRef.current, mapLanguageRef.current);
    };
    map.once('style.load', restoreLayers);
    map.setStyle(BASEMAP_STYLES[currentBasemap]);
    return () => { map.off('style.load', restoreLayers); };
  }, [currentBasemap, isMapLoaded, setupBasemapRendering, setupTerrain, setupMapDetails]);

  // Keep the optional labels and roads layer synchronized with the toggle.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    setupMapDetails(map, showMapDetails, lang);
  }, [showMapDetails, lang, isMapLoaded]);

  // Warm the current view before the first toggle and each flight destination.
  // Local PNGs are shared by Google/Esri and fetched at low priority, two at once.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;
    const controller = new AbortController();
    const center = map.getCenter();
    void prefetchMapDetails(center.lng, center.lat, map.getZoom(), lang, controller.signal);
    if (hasUserSelectedSite) {
      void prefetchMapDetails(selectedSite.lng, selectedSite.lat,
        Math.min(17, map.getMaxZoom()), lang, controller.signal);
    }
    return () => controller.abort();
  }, [isMapLoaded, showMapDetails, lang, selectedSite.id, hasUserSelectedSite, currentBasemap]);

  // 3. Handle 2D <-> 3D Mode Toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    cameraManagerRef.current.stopOrbit();
    if (viewMode === '3d') {
      setupTerrain(map, true);
      map.easeTo({
        pitch: 46,
        bearing: -12,
        duration: 1150,
      });
    } else {
      setupTerrain(map, false);
      map.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1200,
      });
    }
  }, [viewMode, isMapLoaded, setupTerrain]);

  // 4. Diorama markers with localized labels and a gentle viewing state.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    HERITAGE_SITES.forEach((site, index) => {
      const selected = hasUserSelectedSite && selectedSite.id === site.id;
      let marker = markersMapRef.current.get(site.id);
      if (!marker) {
        const element = createHeritageMarker(site, index, () => onSelectSiteRef.current(site));
        marker = new maplibregl.Marker({
          element,
          anchor: 'bottom',
          // The center of the 12px ground ring is the real map location.
          offset: [0, 6],
        }).setLngLat([site.lng, site.lat]).addTo(map);
        markersMapRef.current.set(site.id, marker);
      }

      // Keep existing DOM markers synchronized with the shared location data,
      // including hot updates while the map is already mounted.
      marker.setLngLat([site.lng, site.lat]);
      const element = marker.getElement();
      updateHeritageMarker(element, site, {
        lang,
        visible: isSiteInCategory(site, activeCategoryFilter),
        selected,
        viewing: selected && (isStorytellingOpen || cameraState === 'orbiting'),
        muted: hasUserSelectedSite && !selected,
        reduceMotion: isReduceMotion,
      });
      updateHeritageMarkerLayout(element, site.id, map.getZoom());
    });
  }, [selectedSite, hasUserSelectedSite, activeCategoryFilter, isMapLoaded, lang, isStorytellingOpen, cameraState, isReduceMotion]);

  // 5. CameraManager Trigger on Site Selection
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !selectedSite) return;

    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (!hasUserSelectedSite) return;
    }

    if (!hasUserSelectedSite) return;

    // This site was reached by a gesture, not by clicking a destination. Update
    // the story/marker selection while leaving the user's camera untouched.
    if (mapFocusedSiteIdRef.current === selectedSite.id) {
      mapFocusedSiteIdRef.current = null;
      lastTargetSiteIdRef.current = selectedSite.id;
      return;
    }

    if (lastTargetSiteIdRef.current === selectedSite.id && cameraState === 'idle') {
      return;
    }
    lastTargetSiteIdRef.current = selectedSite.id;

    // Warm parent imagery and the destination's detail neighborhood while the
    // continuous flight runs. Stop old prefetches if the target changes.
    const mapType = currentBasemapRef.current === 'satellite'
      ? 'esri'
      : 'google';
    const prefetchController = new AbortController();
    const zoomLevels = mapType === 'google' ? [16, 17, 18] : [15, 16, 17];
    void prefetchAreaTiles(selectedSite.lng, selectedSite.lat, mapType, zoomLevels, true, prefetchController.signal);

    // Call CameraManager flyToPOI
    cancelSliderAnimation();
    cameraManagerRef.current.flyToPOI(selectedSite, viewModeRef.current);
    return () => prefetchController.abort();
  }, [selectedSite, hasUserSelectedSite, isMapLoaded]);

  // Re-selecting the current landmark is a request to undo a manual pan. It
  // does not rely on the selected-site object changing or restart the full fly.
  useEffect(() => {
    if (!isMapLoaded || recenterRequestId === handledRecenterRequestRef.current) return;
    handledRecenterRequestRef.current = recenterRequestId;
    cancelSliderAnimation();
    cameraManagerRef.current.recenterOnSite(selectedSiteRef.current);
  }, [recenterRequestId, isMapLoaded, cancelSliderAnimation]);

  // 6. Auto-Tour Interval
  useEffect(() => {
    if (!isAutoTouring) return;

    const interval = setInterval(() => {
      const currentIndex = HERITAGE_SITES.findIndex((s) => s.id === selectedSiteRef.current.id);
      const nextIndex = (currentIndex + 1) % HERITAGE_SITES.length;
      onSelectSite(HERITAGE_SITES[nextIndex]);
    }, 18000);

    return () => clearInterval(interval);
  }, [isAutoTouring, onSelectSite]);

  // Home Flight Action
  const handleFlyToOverview = () => {
    cancelSliderAnimation();
    cameraManagerRef.current.flyToOverview(TRA_VINH_CENTER, TRA_VINH_OVERVIEW_ZOOM, viewMode);
    if (onHomeClick) {
      onHomeClick();
    }
  };

  const handleZoomSlider = (value: string) => {
    const map = mapRef.current;
    if (!map) return;
    cameraManagerRef.current.cancelCurrentFlight();
    const zoom = Number(value);
    setZoomSliderValue(zoom);
    sliderTargetsRef.current = {
      zoom,
      bearing: sliderTargetsRef.current?.bearing ?? map.getBearing(),
    };
    animateMapToSliderTargets();
  };

  const handleZoom = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    cancelSliderAnimation();
    cameraManagerRef.current.cancelCurrentFlight();
    map.zoomTo(map.getZoom() + delta, { duration: 420 });
  };

  const handleBearingSlider = (value: string) => {
    const map = mapRef.current;
    if (!map) return;
    cameraManagerRef.current.cancelCurrentFlight();
    const bearing = Number(value);
    setBearingSliderValue(bearing);
    sliderTargetsRef.current = {
      zoom: sliderTargetsRef.current?.zoom ?? map.getZoom(),
      bearing,
    };
    animateMapToSliderTargets();
  };

  const finishSliderDrag = () => {
    isSliderDraggingRef.current = false;
  };

  // Reset North Heading Handler
  const handleResetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    cancelSliderAnimation();
    cameraManagerRef.current.cancelCurrentFlight();
    map.easeTo({ bearing: 0, duration: 800 });
  };

  const isOrbiting = cameraState === 'orbiting';
  const isFlying = cameraState === 'departing' || cameraState === 'cruising' || cameraState === 'approaching';
  const canOrbit = isMapLoaded && hasUserSelectedSite && viewMode === '3d' && !isFlying;
  const orbitLabel = isOrbiting
    ? (lang === 'vi' ? 'Dừng xoay 360°' : 'Stop 360° orbit')
    : (lang === 'vi' ? 'Xoay 360° quanh địa điểm' : 'Orbit the landmark in 360°');
  const orbitTitle = !isMapLoaded
    ? (lang === 'vi' ? 'Đang tải bản đồ' : 'Loading map')
    : !hasUserSelectedSite
      ? (lang === 'vi' ? 'Chọn địa điểm để xoay 360°' : 'Select a landmark to orbit')
      : viewMode !== '3d'
        ? (lang === 'vi' ? 'Chuyển sang 3D để xoay 360°' : 'Switch to 3D to orbit')
        : isFlying
          ? (lang === 'vi' ? 'Chờ bay tới địa điểm để xoay 360°' : 'Wait for arrival to orbit')
          : orbitLabel;

  const handleToggleOrbit = () => {
    if (cameraManagerRef.current.getState() === 'orbiting') {
      cameraManagerRef.current.stopOrbit();
      return;
    }
    if (!canOrbit) return;
    cancelSliderAnimation();
    if (isAutoTouring) onToggleAutoTour();
    cameraManagerRef.current.startOrbit(selectedSite);
  };

  const maritimeContext = getMaritimeContext(telemetry.lng, telemetry.lat, telemetry.zoom);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#090b10]">
      {/* Real MapLibre GL Map Viewport Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {maritimeContext && (
        <div className="maritime-context pointer-events-none absolute left-1/2 top-20 z-10 flex max-w-[70vw] -translate-x-1/2 flex-col items-center gap-1 text-center" role="status" aria-live="polite">
          <span className="text-sm font-semibold text-white sm:text-base">
            {lang === 'vi' ? maritimeContext.place.nameVi : maritimeContext.place.nameEn}
          </span>
          {maritimeContext.island && (
            <span className="text-xs font-medium text-white/95 sm:text-sm">
              {lang === 'vi' ? maritimeContext.island.nameVi : maritimeContext.island.nameEn}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-100">
            <svg width="18" height="12" viewBox="0 0 30 20" aria-hidden="true">
              <rect width="30" height="20" fill="#da251d" />
              <path d="M15 4 L16.35 8.15 L20.7 8.15 L17.18 10.7 L18.52 14.85 L15 12.3 L11.48 14.85 L12.82 10.7 L9.3 8.15 L13.65 8.15 Z" fill="#ffff00" />
            </svg>
            {lang === 'vi' ? 'Việt Nam' : 'Viet Nam'}
          </span>
        </div>
      )}

      {/* Top Left: Satellite imagery selector */}
      <div className="absolute top-5 left-5 z-20">
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#0e121b]/95 p-1 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setCurrentBasemap('google-sat')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              currentBasemap === 'google-sat'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
            }`}
            title="Ảnh vệ tinh Google"
            aria-pressed={currentBasemap === 'google-sat'}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{lang === 'vi' ? 'Google vệ tinh' : 'Google Satellite'}</span>
          </button>
          <button
            onClick={() => setCurrentBasemap('satellite')}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              currentBasemap === 'satellite'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
            }`}
            title={`${lang === 'vi' ? 'Ảnh vệ tinh Esri Wayback' : 'Esri Wayback satellite imagery'} · ${ESRI_IMAGERY.releaseDate}`}
            aria-pressed={currentBasemap === 'satellite'}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Esri</span>
          </button>
          <button
            onClick={() => setShowMapDetails((visible) => !visible)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
              showMapDetails
                ? 'bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/50'
                : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
            }`}
            title={showMapDetails
              ? (lang === 'vi' ? 'Ẩn đường, địa điểm và tiện ích' : 'Hide roads, places and amenities')
              : (lang === 'vi' ? 'Hiện đường, địa điểm, bệnh viện, trường học, nhà hàng và tiện ích' : 'Show roads, places, hospitals, schools, restaurants and amenities')}
            aria-label={showMapDetails
              ? (lang === 'vi' ? 'Tắt thông tin bản đồ' : 'Turn map details off')
              : (lang === 'vi' ? 'Bật thông tin bản đồ' : 'Turn map details on')}
            aria-pressed={showMapDetails}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{lang === 'vi' ? 'Chi tiết' : 'Details'}</span>
          </button>
        </div>
      </div>
      {/* Top Right: kiosk actions */}
      <div className="absolute top-5 right-[calc(var(--story-controls-offset)+6rem)] z-20 flex items-center gap-2">
        <button
          onClick={() => {
            cameraManagerRef.current.stopOrbit();
            onToggleAutoTour();
          }}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-md border flex items-center gap-1.5 shadow-xl ${
            isAutoTouring
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-400/40'
              : 'bg-[#0e121b]/90 border-white/10 text-stone-300 hover:text-white hover:bg-white/10'
          }`}
          title={lang === 'vi' ? 'Tự động tham quan 7 điểm di sản' : 'Automatically tour the 7 heritage sites'}
        >
          {isAutoTouring ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isAutoTouring
            ? (lang === 'vi' ? 'Đang tham quan' : 'Touring')
            : (lang === 'vi' ? 'Tự động tham quan' : 'Auto tour')}</span>
        </button>
        <button
          onClick={handleFlyToOverview}
          className="px-3 py-2 rounded-xl text-xs font-medium bg-[#0e121b]/90 hover:bg-[#161c28] border border-white/10 text-stone-300 hover:text-amber-300 transition-all shadow-xl flex items-center gap-1.5 cursor-pointer"
          title={lang === 'vi' ? 'Bay về toàn cảnh tỉnh Trà Vinh' : 'Fly to the Trà Vinh overview'}
        >
          <Navigation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{lang === 'vi' ? 'Toàn cảnh tỉnh' : 'Province overview'}</span>
        </button>
      </div>

      {/* Right side control dock: zoom, perspective, orbit, and compass */}
      <div className="absolute right-[calc(var(--story-controls-offset)+1.25rem)] top-1/2 z-20 flex -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e121b]/92 p-1 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => handleZoom(0.8)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-stone-200 transition-colors hover:bg-white/10 hover:text-amber-300"
          title={lang === 'vi' ? 'Phóng to' : 'Zoom in'}
          aria-label={lang === 'vi' ? 'Phóng to bản đồ' : 'Zoom in on map'}
        ><ZoomIn className="h-5 w-5" /></button>
        <button
          onClick={() => handleZoom(-0.8)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-stone-200 transition-colors hover:bg-white/10 hover:text-amber-300"
          title={lang === 'vi' ? 'Thu nhỏ' : 'Zoom out'}
          aria-label={lang === 'vi' ? 'Thu nhỏ bản đồ' : 'Zoom out on map'}
        ><ZoomOut className="h-5 w-5" /></button>
        <div className="mx-2 my-1 h-px bg-white/10" />
        <button
          onClick={() => onToggleViewMode(viewMode === '3d' ? '2d' : '3d')}
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-mono font-bold transition-colors ${
            viewMode === '3d' ? 'bg-amber-500 text-stone-950' : 'text-amber-300 hover:bg-white/10'
          }`}
          title={viewMode === '3d'
            ? (lang === 'vi' ? 'Chuyển sang góc nhìn 2D' : 'Switch to 2D view')
            : (lang === 'vi' ? 'Chuyển sang góc nhìn 3D' : 'Switch to 3D view')}
          aria-label={viewMode === '3d'
            ? (lang === 'vi' ? 'Chuyển sang 2D' : 'Switch to 2D')
            : (lang === 'vi' ? 'Chuyển sang 3D' : 'Switch to 3D')}
        >{viewMode === '3d' ? '3D' : '2D'}</button>
        <button
          onClick={handleToggleOrbit}
          disabled={!canOrbit}
          className={`flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-xl transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isOrbiting
              ? 'bg-amber-500 text-stone-950'
              : 'text-stone-300 enabled:hover:bg-white/10 enabled:hover:text-amber-300'
          }`}
          title={orbitTitle}
          aria-label={orbitLabel}
          aria-pressed={isOrbiting}
        >
          <Orbit className="h-5 w-5" aria-hidden="true" />
          <span className="text-[8px] font-mono font-semibold leading-none" aria-hidden="true">360°</span>
        </button>
        <div className="mx-2 my-1 h-px bg-white/10" />
        <button
          onClick={handleResetNorth}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-stone-300 transition-colors hover:bg-white/10 hover:text-amber-400"
          title={lang === 'vi' ? 'Xoay về chính Bắc' : 'Reset to north'}
          aria-label={lang === 'vi' ? 'Xoay về hướng Bắc' : 'Rotate to north'}
        >
          <Compass className="h-5 w-5 transition-transform duration-300" style={{ transform: `rotate(${-telemetry.bearing}deg)` }} />
        </button>
      </div>      {/* Vertical zoom rail */}
      <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0e15]/85 px-2.5 py-3 shadow-2xl backdrop-blur-md sm:left-5" role="group" aria-label={lang === 'vi' ? 'Điều khiển thu phóng' : 'Zoom controls'}>
        <div className="flex flex-col items-center gap-2.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400">{lang === 'vi' ? 'Gần' : 'Near'}</span>
          <input
            className="map-range map-range-vertical"
            type="range"
            min={6}
            max={BASEMAP_MAX_ZOOM[currentBasemap]}
            step={0.1}
            value={Math.min(zoomSliderValue, BASEMAP_MAX_ZOOM[currentBasemap])}
            onPointerDown={() => { isSliderDraggingRef.current = true; }}
            onPointerUp={finishSliderDrag}
            onPointerCancel={finishSliderDrag}
            onBlur={finishSliderDrag}
            onChange={(event) => handleZoomSlider(event.currentTarget.value)}
            aria-label={lang === 'vi' ? 'Mức thu phóng bản đồ' : 'Map zoom level'}
            aria-valuetext={`${lang === 'vi' ? 'Mức zoom' : 'Zoom level'} ${telemetry.zoom.toFixed(1)}`}
          />
          <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400">{lang === 'vi' ? 'Xa' : 'Far'}</span>
          <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-amber-200">{telemetry.zoom.toFixed(1)}×</span>
        </div>
      </div>

      {/* Horizontal bearing rail */}
      <div className="absolute bottom-24 left-1/2 z-20 w-[min(78vw,440px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#0b0e15]/88 px-4 py-3 shadow-2xl backdrop-blur-md sm:bottom-5">
        <div className="flex items-center gap-3">
          <RotateCw className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <input
            className="map-range map-range-horizontal min-w-0 flex-1"
            type="range"
            min={-180}
            max={180}
            step={1}
            value={bearingSliderValue}
            onPointerDown={() => { isSliderDraggingRef.current = true; }}
            onPointerUp={finishSliderDrag}
            onPointerCancel={finishSliderDrag}
            onBlur={finishSliderDrag}
            onChange={(event) => handleBearingSlider(event.currentTarget.value)}
            aria-label={lang === 'vi' ? 'Xoay hướng bản đồ' : 'Rotate map'}
            aria-valuetext={`${Math.round(telemetry.bearing)}${lang === 'vi' ? ' độ' : ' degrees'}`}
          />
          <span className="min-w-10 text-right text-[10px] font-mono text-stone-300">{Math.round(telemetry.bearing)}°</span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
          <Hand className="h-3.5 w-3.5 text-amber-300/80" aria-hidden="true" />
          <span>{lang === 'vi'
            ? 'Kéo để di chuyển · Chụm để zoom · Xoay hai ngón để đổi hướng'
            : 'Drag to pan · Pinch to zoom · Twist two fingers to rotate'}</span>
        </div>
      </div>

      <div className="absolute bottom-2 right-[calc(var(--story-controls-offset)+0.75rem)] z-10 max-w-[60vw] rounded-md bg-black/55 px-2 py-1 text-right text-[9px] text-white/70 backdrop-blur-sm" aria-label={lang === 'vi' ? 'Nguồn bản đồ' : 'Map attribution'}>
        {currentBasemap === 'satellite' && `${lang === 'vi' ? 'Ảnh vệ tinh © Esri Wayback' : 'Satellite imagery © Esri Wayback'} · ${ESRI_IMAGERY.releaseDate}`}
        {currentBasemap === 'google-sat' && (lang === 'vi' ? 'Ảnh vệ tinh © Google' : 'Satellite imagery © Google')}
        {showMapDetails && (lang === 'vi'
          ? ' · Đường, địa điểm và tiện ích © Google'
          : ' · Roads, places and amenities © Google')}
        {' · '}
        <a href={MARITIME_LABEL_SOURCE} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white" title={lang === 'vi' ? 'Địa danh và nhãn chủ quyền theo nguồn Việt Nam' : 'Island names and sovereignty labels according to Vietnamese sources'}>
          {lang === 'vi' ? 'Biển đảo: nguồn Việt Nam' : 'Island labels: Vietnamese sources'}
        </a>
      </div>

    </div>
  );
};
