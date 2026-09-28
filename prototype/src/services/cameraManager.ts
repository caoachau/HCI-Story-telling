/**
 * CameraController & Spatial Navigation Manager
 * 
 * Implements a robust state machine, distance-adaptive continuous flight,
 * optional continuous orbit, chapter-specific viewpoints, and clean flight cancellation.
 * Absolutely no instant setView() or teleportation during user navigation.
 */

import * as maplibregl from 'maplibre-gl';
import { HeritageSite } from '../data/heritageSites';
import { calculateDistanceKm } from '../utils/geoCoordinates';

// Ease velocity in/out, with a steady cruise between the ramps. Position,
// velocity and acceleration stay continuous without a mid-flight speed surge.
function flightEasing(t: number): number {
  const ramp = 0.28;
  const rampDistance = (u: number) => ramp * (u * u * u - 0.5 * u * u * u * u) / (1 - ramp);
  if (t < ramp) return rampDistance(t / ramp);
  if (t > 1 - ramp) return 1 - rampDistance((1 - t) / ramp);
  return (t - ramp / 2) / (1 - ramp);
}

export type CameraState =
  | 'idle'
  | 'departing'
  | 'cruising'
  | 'approaching'
  | 'orbiting'
  | 'userControlled';

export interface CameraChapterView {
  lng: number;
  lat: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface CameraManagerCallbacks {
  onStateChange?: (state: CameraState) => void;
  onDistanceCalculated?: (distanceKm: number) => void;
  onFlightComplete?: (site: HeritageSite) => void;
  onSettleComplete?: (site: HeritageSite) => void;
  onOverviewArrived?: () => void;
}

export class CameraManager {
  private map: maplibregl.Map | null = null;
  private state: CameraState = 'idle';
  private activeFlightId = 0;
  private isReduceMotion = false;
  private isAttractModeActive = false;
  private attractTimer: number | null = null;
  private orbitAnimationFrame: number | null = null;
  private flightCleanup: (() => void) | null = null;
  private callbacks: CameraManagerCallbacks = {};

  constructor(callbacks?: CameraManagerCallbacks) {
    if (callbacks) {
      this.callbacks = callbacks;
    }
  }

  public setMap(map: maplibregl.Map | null) {
    if (this.map === map) return;
    this.activeFlightId++;
    this.clearCameraAnimations();
    this.map = map;
    this.state = 'idle';
  }

  public setCallbacks(callbacks: CameraManagerCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public setReduceMotion(enabled: boolean) {
    this.isReduceMotion = enabled;
  }

  public getState(): CameraState {
    return this.state;
  }

  private setState(newState: CameraState) {
    this.state = newState;
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(newState);
    }
  }

  /**
   * Cancel ongoing flight immediately, halting camera at its current interpolated position
   */
  public cancelCurrentFlight(preserveUserGestures = false) {
    this.activeFlightId++;
    this.clearCameraAnimations(preserveUserGestures);
    this.setState('userControlled');
  }

  private clearCameraAnimations(preserveUserGestures = false) {
    this.flightCleanup?.();
    this.flightCleanup = null;
    if (this.orbitAnimationFrame !== null) {
      window.cancelAnimationFrame(this.orbitAnimationFrame);
      this.orbitAnimationFrame = null;
    }
    if (this.attractTimer !== null) {
      window.clearInterval(this.attractTimer);
      this.attractTimer = null;
    }
    this.isAttractModeActive = false;

    // MapLibre stops its camera ease when a gesture takes over. Calling the
    // public Map.stop() inside a gesture also resets the pinch/wheel handlers.
    if (this.map && !preserveUserGestures) {
      this.map.stop();
    }
  }

  /** Rotate around the selected landmark until the user stops the mode. */
  public startOrbit(targetSite: HeritageSite) {
    const map = this.map;
    if (!map || this.state === 'orbiting') return;

    this.cancelCurrentFlight();
    map.resize();
    const orbitId = this.activeFlightId;
    const center: [number, number] = [targetSite.lng, targetSite.lat];
    this.setState('orbiting');

    const beginRotation = () => {
      if (orbitId !== this.activeFlightId || this.map !== map) return;
      let lastTimestamp: number | null = null;
      let elapsedMs = 0;
      const rotate = (timestamp: number) => {
        if (orbitId !== this.activeFlightId || this.map !== map) return;
        // Ignore time spent in a suspended tab so returning never jumps ahead.
        const deltaMs = lastTimestamp === null ? 0 : Math.min(timestamp - lastTimestamp, 50);
        lastTimestamp = timestamp;
        elapsedMs += deltaMs;
        const ramp = Math.min(elapsedMs / 1200, 1);
        const speed = (this.isReduceMotion ? 3 : 6) * ramp * ramp * (3 - 2 * ramp);
        if (deltaMs > 0) {
          // Small frame increments cross ±180° seamlessly and complete true
          // 360° turns without MapLibre choosing a shorter arc to the start.
          map.jumpTo({ center, bearing: map.getBearing() + speed * deltaMs / 1000 });
        }
        if (orbitId === this.activeFlightId && this.map === map) {
          this.orbitAnimationFrame = window.requestAnimationFrame(rotate);
        }
      };
      this.orbitAnimationFrame = window.requestAnimationFrame(rotate);
    };

    const position = map.project(center);
    const canvas = map.getCanvas();
    const padding = map.getPadding();
    const isCentered = Math.hypot(
      position.x - canvas.clientWidth / 2,
      position.y - canvas.clientHeight / 2,
    ) <= 0.75;
    const hasPadding = Object.values(padding).some((value) => value !== 0);

    // Arrival already uses the orbit's center. Start rotating from the current
    // zoom/pitch without another camera transition when the landmark is centered.
    if (isCentered && !hasPadding) {
      beginRotation();
      return;
    }

    // Only recenter if the user has moved away from the landmark. Preserve the
    // current zoom and pitch so enabling orbit does not change the framing.
    const cleanup = () => {
      map.off('moveend', handleRecenterEnd);
      if (this.flightCleanup === cleanup) this.flightCleanup = null;
    };
    const handleRecenterEnd = () => {
      cleanup();
      beginRotation();
    };
    this.flightCleanup = cleanup;
    map.once('moveend', handleRecenterEnd);
    map.easeTo({
      center,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      offset: [0, 0],
      duration: 1000,
      essential: true,
      easing: flightEasing,
    });
  }

  public stopOrbit() {
    if (this.state !== 'orbiting') return;
    this.activeFlightId++;
    this.clearCameraAnimations();
    this.setState('idle');
  }

  /**
   * Adaptive cinematic flight to a target Heritage POI based on real geographic distance
   */
  public flyToPOI(
    targetSite: HeritageSite,
    viewMode: '3d' | '2d' = '3d',
    customDuration?: number
  ) {
    if (!this.map) return;

    // Clean cancellation of previous transition
    const flightId = ++this.activeFlightId;
    this.clearCameraAnimations();

    // flyTo captures its screen center once. Synchronize any window/fullscreen
    // resize before calculating the path; the story overlay does not resize it.
    this.map.resize();
    const currentCenter = this.map.getCenter();
    const distanceKm = calculateDistanceKm(
      currentCenter.lat,
      currentCenter.lng,
      targetSite.lat,
      targetSite.lng
    );

    if (this.callbacks.onDistanceCalculated) {
      this.callbacks.onDistanceCalculated(parseFloat(distanceKm.toFixed(1)));
    }

    const map = this.map;
    const targetZoom = Math.min(17, map.getMaxZoom());
    const zoomTravel = Math.abs(targetZoom - map.getZoom());
    const regionalDuration = distanceKm < 1 ? 2200 : distanceKm < 5 ? 2500 : distanceKm <= 20 ? 2800 : 3100;
    // Main landmark imagery ships with the app, so the continuous descent
    // no longer needs an extended flight to wait for remote tile requests.
    const durationMs = this.isReduceMotion
      ? 1600
      : customDuration && Number.isFinite(customDuration) && customDuration > 0
        ? customDuration
        : Math.min(3300, Math.max(regionalDuration, 2000 + zoomTravel * 160));
    const curve = this.isReduceMotion ? 1 : distanceKm < 1 ? 1.05 : distanceKm < 5 ? 1.15 : 1.25;
    const targetPitch = viewMode === '3d' ? (this.isReduceMotion ? 34 : 52) : 0;
    const targetBearing = viewMode === '3d' ? -12 : 0;
    const timers: number[] = [];
    let finished = false;

    const cleanup = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      map.off('moveend', handleFlightEnd);
      map.off('idle', finishArrival);
      if (this.flightCleanup === cleanup) this.flightCleanup = null;
    };
    this.flightCleanup = cleanup;

    const finishArrival = () => {
      if (finished || flightId !== this.activeFlightId || this.map !== map) return;
      finished = true;
      cleanup();
      this.setState('idle');
      this.callbacks.onFlightComplete?.(targetSite);
      this.callbacks.onSettleComplete?.(targetSite);
    };

    const handleFlightEnd = () => {
      if (flightId !== this.activeFlightId || this.map !== map) return;
      // Tile readiness only controls when the story opens, never the flight
      // trajectory. There is no intermediate pause or second zoom animation.
      if (map.areTilesLoaded()) {
        finishArrival();
        return;
      }
      this.setState('approaching');
      map.once('idle', finishArrival);
      timers.push(window.setTimeout(finishArrival, 250));
    };

    this.setState('departing');

    // Midway through duration, transition state to cruising -> approaching
    timers.push(window.setTimeout(() => {
      if (flightId === this.activeFlightId && this.state === 'departing') {
        this.setState('cruising');
      }
    }, durationMs * 0.3));

    timers.push(window.setTimeout(() => {
      if (flightId === this.activeFlightId && this.state === 'cruising') {
        this.setState('approaching');
      }
    }, durationMs * 0.7));

    // Execute MapLibre flyTo with explicit duration (strictly no maxDuration reset!)
    map.once('moveend', handleFlightEnd);
    map.flyTo({
      center: [targetSite.lng, targetSite.lat],
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      offset: [0, 0],
      zoom: targetZoom,
      pitch: targetPitch,
      bearing: targetBearing,
      duration: durationMs,
      curve: curve,
      essential: true,
      easing: flightEasing,
    });
  }

  /**
   * Bring the selected landmark back to the viewport center after a manual pan.
   * Preserve the user's zoom, pitch and bearing rather than replaying the flight.
   */
  public recenterOnSite(targetSite: HeritageSite) {
    const map = this.map;
    if (!map) return;

    const flightId = ++this.activeFlightId;
    this.clearCameraAnimations();
    map.resize();
    const currentCenter = map.getCenter();
    const distanceKm = calculateDistanceKm(currentCenter.lat, currentCenter.lng, targetSite.lat, targetSite.lng);

    const cleanup = () => {
      map.off('moveend', handleRecenterEnd);
      if (this.flightCleanup === cleanup) this.flightCleanup = null;
    };
    const handleRecenterEnd = () => {
      if (flightId !== this.activeFlightId || this.map !== map) return;
      cleanup();
      this.setState('idle');
      this.callbacks.onSettleComplete?.(targetSite);
    };
    this.flightCleanup = cleanup;
    this.setState('approaching');
    map.once('moveend', handleRecenterEnd);
    map.easeTo({
      center: [targetSite.lng, targetSite.lat],
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      offset: [0, 0],
      duration: this.isReduceMotion ? 850 : Math.min(1600, 1100 + distanceKm * 200),
      essential: true,
      easing: flightEasing,
    });
  }

  /**
   * Smooth transition to chapter-specific camera viewpoint (subtle pan/tilt)
   */
  public flyToChapter(view: CameraChapterView, viewMode: '3d' | '2d' = '3d') {
    if (!this.map) return;

    const flightId = ++this.activeFlightId;
    this.clearCameraAnimations();

    this.setState('approaching');

    this.map.easeTo({
      center: [view.lng, view.lat],
      zoom: view.zoom,
      pitch: viewMode === '3d' ? Math.min(view.pitch, 48) : 0,
      bearing: viewMode === '3d' ? view.bearing : 0,
      duration: this.isReduceMotion ? 1100 : 1500,
      easing: flightEasing,
    });

    const handleChapterEnd = () => {
      if (flightId !== this.activeFlightId) return;
      this.map?.off('moveend', handleChapterEnd);
      this.setState('idle');
    };

    this.map.once('moveend', handleChapterEnd);
  }

  /**
   * Continuous animated zoom-out arc back to provincial overview
   */
  public flyToOverview(
    center: [number, number] = [106.345, 9.855],
    zoom = 10.4,
    viewMode: '3d' | '2d' = '3d'
  ) {
    if (!this.map) return;

    const flightId = ++this.activeFlightId;
    this.clearCameraAnimations();

    this.setState('departing');

    this.map.flyTo({
      center,
      zoom,
      pitch: viewMode === '3d' ? 38 : 0,
      bearing: viewMode === '3d' ? -10 : 0,
      duration: this.isReduceMotion ? 1600 : Math.min(2800, 2000 + Math.abs(zoom - this.map.getZoom()) * 100),
      curve: 1.25,
      essential: true,
      easing: flightEasing,
    });

    const handleOverviewArrival = () => {
      if (flightId !== this.activeFlightId) return;
      this.map?.off('moveend', handleOverviewArrival);
      this.setState('idle');
      if (this.callbacks.onOverviewArrived) {
        this.callbacks.onOverviewArrived();
      }
    };

    this.map.once('moveend', handleOverviewArrival);
  }

  /**
   * Attract Mode: slow, stately museum glide over the landscape
   */
  public startAttractMode() {
    if (!this.map || this.isAttractModeActive) return;

    this.cancelCurrentFlight();
    this.isAttractModeActive = true;
    this.setState('cruising');

    let currentBearing = this.map.getBearing();
    this.attractTimer = window.setInterval(() => {
      if (!this.map || !this.isAttractModeActive) return;
      currentBearing = (currentBearing + 0.5) % 360;
      this.map.easeTo({
        bearing: currentBearing,
        duration: 900,
        easing: (t) => t,
      });
    }, 1000);
  }

  public stopAttractMode() {
    if (!this.isAttractModeActive) return;
    if (this.attractTimer) {
      window.clearInterval(this.attractTimer);
      this.attractTimer = null;
    }
    this.isAttractModeActive = false;
    this.setState('idle');
  }
}
