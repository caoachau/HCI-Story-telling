import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { loadMuseumPanorama } from "./museumMediaCache";
import {
  ArrowUpRight,
  ArrowLeft,
  Maximize,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  X,
  List, Eye, EyeOff,
} from "lucide-react";
import type { DiscoveryEntry } from "./khmerDiscovery";
import { GroundsPointImage } from "./KhmerGroundsPointDetail";
import { craftTopicAreas, craftTopics, type CraftTopicAreaId } from "./khmerCraftTopics";
import {
  khmerPlacePhotos,
  type PlaceLanguage,
} from "./khmerPlaces";

export interface PanoramaView {
  yaw: number;
  pitch: number;
  fov: number;
}
type Status = "loading" | "ready" | "error" | "idle";

/** A true spherical viewer, using the public panorama supplied by the visitor.
 * Render on input/resize and during finite camera transitions.
 * A flat photograph is never stretched into a fake 360.
 */
export function KhmerGroundsPanorama({
  panorama,
  view,
  lang,
  active,
  selectedPointId,
  focusRequest,
  onSelectPoint,
  onOpenPoint,
  onBack,
  backLabel,
  onClearPoint,
}: {
  panorama: NonNullable<DiscoveryEntry["panorama"]>;
  view: PanoramaView;
  lang: PlaceLanguage;
  active: boolean;
  selectedPointId?: string;
  focusRequest?: { id: string; revision: number };
  onSelectPoint?: (id: string) => void;
  onOpenPoint?: (id: string, origin: HTMLElement) => void;
  onBack?: () => void;
  backLabel?: Record<PlaceLanguage, string>;
  onClearPoint?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null),
    host = useRef<HTMLDivElement>(null);
  const expandedHost = useRef<HTMLElement | null>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [surface] = useState(() => document.createElement("div"));
  const hotspotButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const popup = useRef<HTMLDivElement>(null);
  const popupState = useRef<{ id?: string; open: boolean }>({ open: false });
  const appliedFocus = useRef<number | undefined>(undefined);
  const actions = useRef<{
    zoom: (delta: number) => void;
    reset: () => void;
    lookAt: (view: PanoramaView) => void;
    focus: (id: string) => void;
    redraw: () => void;
  } | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [dismissedPopup, setDismissedPopup] = useState<string>();
  const [attempt, setAttempt] = useState(0),
    [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const fullscreen = fallbackFullscreen;
  const vi = lang === "vi";
  const themed = panorama.points?.some(point => point.markerKind === "topic") ?? false;
  const roomTopics = (panorama.points ?? []).filter(point => point.markerKind === "topic" && point.topicId?.startsWith("room-")).map(point => ({ id: point.topicId!, title: point.title, areaId: "main-display" as const, numbers: [1] as readonly number[], parentId: undefined as string | undefined }));
  const allTopics = [...craftTopics, ...roomTopics];
  const [topicId, setTopicId] = useState<string>();
  const [topicAreaId, setTopicAreaId] = useState<CraftTopicAreaId>();
  const [showHotspots, setShowHotspots] = useState(true);
  const [listOpen, setListOpen] = useState(false);
  const topicState = useRef({ themed, topicId, showHotspots });
  topicState.current = { themed, topicId, showHotspots };
  useEffect(() => { setTopicId(undefined); setTopicAreaId(undefined); setShowHotspots(true); setListOpen(false); }, [panorama]);
  useEffect(() => { actions.current?.redraw(); }, [topicId, showHotspots]);
  function chooseTopic(id: string) {
    const topic = allTopics.find(item => item.id === id);
    if (topic) setTopicAreaId(topic.areaId);
    setTopicId(id); setShowHotspots(true); setListOpen(false); onClearPoint?.();
    actions.current?.focus(`topic-${id}`);
  }
  function overview() {
    const areaId = allTopics.find(topic => topic.id === topicId)?.areaId ?? topicAreaId;
    setTopicId(undefined); setListOpen(false); setShowHotspots(true); onClearPoint?.();
    if (topicId?.startsWith("room-")) actions.current?.reset();
    else if (areaId) actions.current?.lookAt(craftTopicAreas[areaId]);
    else actions.current?.reset();
  }
  function backTopicLevel() {
    const topic = allTopics.find(item => item.id === topicId);
    if (!topic?.parentId) { overview(); return; }
    setTopicId(topic.parentId); setListOpen(false); setShowHotspots(true); onClearPoint?.();
    actions.current?.focus(`topic-${topic.parentId}`);
  }
  function toggleList() {
    if (listOpen) { setListOpen(false); return; }
    const visibleTopic = allTopics.find(topic => {
      const button = hotspotButtons.current[`topic-${topic.id}`];
      return button != null && !button.hidden;
    });
    setTopicAreaId(allTopics.find(topic => topic.id === topicId)?.areaId ?? visibleTopic?.areaId ?? "main-display");
    setListOpen(true);
  }
  const listAreaId = allTopics.find(topic => topic.id === topicId)?.areaId ?? topicAreaId ?? "main-display";
  const listedTopics = roomTopics.length ? roomTopics.filter(topic => !topicId || topic.id === topicId) : craftTopics.filter(topic => topic.areaId === listAreaId && topic.numbers.length > 0);
  const preview = khmerPlacePhotos[panorama.preview ?? "grounds360"];
  const selectedPoint = panorama.points?.find(
    (point) => point.id === selectedPointId,
  );
  // Keep the embedded photograph clear: its selected point is introduced in
  // the adjacent detail card. In-image popups belong to the expanded viewer.
  const popupOpen = fullscreen && !!selectedPoint && dismissedPopup !== selectedPoint.id;
  popupState.current = { id: selectedPointId, open: popupOpen };
  function closePopup() {
    setDismissedPopup(selectedPointId);
    hotspotButtons.current[selectedPointId ?? ""]?.focus({ preventScroll: true });
  }
  useLayoutEffect(() => {
    surface.className = "kd-panorama-surface";
    const target = fullscreen ? expandedHost.current : slot.current;
    target?.append(surface);
    actions.current?.redraw();
    return () => surface.remove();
  }, [fullscreen, surface]);
  useEffect(() => {
    setDismissedPopup(undefined);
  }, [selectedPointId, focusRequest?.revision]);
  useEffect(() => {
    if (status !== "ready") return;
    const observer = new ResizeObserver(() => actions.current?.redraw());
    if (popup.current) observer.observe(popup.current);
    actions.current?.redraw();
    return () => observer.disconnect();
  }, [popupOpen, selectedPointId, status, fallbackFullscreen]);
  useEffect(() => {
    const frame = expandedHost.current;
    if (!frame || !fallbackFullscreen) return;
    const siblings = [...frame.querySelectorAll<HTMLElement>(":scope > .kd-body, :scope > .kd-bottom")];
    siblings.forEach(node => { node.inert = true; });
    return () => { siblings.forEach(node => { node.inert = false; }); };
  }, [fallbackFullscreen]);
  useEffect(() => {
    if (!active) setFallbackFullscreen(false);
  }, [active]);

  useEffect(() => {
    const node = host.current;
    if (!node || !active) {
      setStatus("idle");
      return;
    }
    let disposed = false,
      release: (() => void) | undefined;
    setStatus("loading");
    void (async () => {
      const [THREE, image] = await Promise.all([
        import("three"), loadMuseumPanorama(panorama.src),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.tabIndex = 0;
      renderer.domElement.setAttribute("role", "img");
      renderer.domElement.setAttribute(
        "aria-label",
        vi
          ? `${preview.title.vi}. Kéo để nhìn quanh. Phím mũi tên để xoay, cộng trừ để phóng to, Home để đặt lại.`
          : `${preview.title.en}. Drag or use arrow keys to look around, plus and minus to zoom, Home to reset.`,
      );
      node.append(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(view.fov, 1, 0.1, 100);
      const geometry = new THREE.SphereGeometry(10, 64, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ toneMapped: false });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      let texture: InstanceType<typeof THREE.Texture> | undefined;
      let presented = false;
      let frame = 0,
        ready = false;
      const pointers = new Map<number, { x: number; y: number }>();
      const hotspots = (panorama.points ?? []).map((point) => {
        const theta = point.u * Math.PI * 2,
          phi = point.v * Math.PI;
        return {
          point,
          direction: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.cos(phi),
            Math.sin(phi) * Math.sin(theta),
          ),
        };
      });
      const projected = new THREE.Vector3(),
        cameraSpace = new THREE.Vector3();
      const clamp = (value: number, low: number, high: number) =>
        Math.max(low, Math.min(high, value));
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
      let turn: { previousFrame?: number; elapsed: number; duration: number; yaw: number; pitch: number; deltaYaw: number; deltaPitch: number } | undefined;
      const stopTurn = () => {
        turn = undefined;
        node.dataset.motionState = "idle";
      };
      stopTurn();
      const draw = (now: number) => {
        frame = 0;
        if (disposed || !ready || document.hidden) return;
        if (turn) {
          // Advance only through frames we can actually display. A delayed
          // texture/layout frame must not make the camera jump to catch up.
          turn.elapsed += turn.previousFrame === undefined ? 0 : clamp(now - turn.previousFrame, 0, 40);
          turn.previousFrame = now;
          const progress = clamp(turn.elapsed / turn.duration, 0, 1);
          const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
          view.yaw = turn.yaw + turn.deltaYaw * eased;
          view.pitch = turn.pitch + turn.deltaPitch * eased;
          if (progress === 1) stopTurn();
        }
        view.yaw = ((view.yaw % 360) + 360) % 360;
        view.pitch = clamp(view.pitch, -85, 85);
        view.fov = clamp(view.fov, 40, 100);
        const phi = THREE.MathUtils.degToRad(90 - view.pitch),
          theta = THREE.MathUtils.degToRad(view.yaw);
        camera.fov = view.fov;
        camera.updateProjectionMatrix();
        camera.lookAt(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta),
        );
        renderer.render(scene, camera);
        if (!presented) { presented = true; setStatus("ready"); }
        // Project the fixed spherical directions after each camera change.
        // Points outside the view or behind the camera never become edge pins.
        for (const { point, direction } of hotspots) {
          const button = hotspotButtons.current[point.id];
          if (!button) continue;
          cameraSpace.copy(direction).applyMatrix4(camera.matrixWorldInverse);
          projected.copy(direction).project(camera);
          const x = ((projected.x + 1) * node.clientWidth) / 2;
          const y = ((1 - projected.y) * node.clientHeight) / 2;
          const visible =
            (!topicState.current.themed || (point.targetEntryId
              ? true
              : topicState.current.showHotspots && (point.markerKind === "topic"
                ? (allTopics.find(topic => topic.id === point.topicId)?.parentId ?? undefined) === topicState.current.topicId
                : point.markerKind === "exhibit" && point.topicId === topicState.current.topicId && !turn))) &&
            cameraSpace.z < 0 &&
            projected.z >= -1 &&
            projected.z <= 1 &&
            x >= 24 &&
            x <= node.clientWidth - 24 &&
            y >= 24 &&
            y <= node.clientHeight - 24;
          button.hidden = !visible;
          if (visible) {
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
          }
          const card = popup.current;
          if (point.id !== popupState.current.id || !card) continue;
          const showPopup = visible && popupState.current.open && !turn;
          card.style.visibility = showPopup ? "visible" : "hidden";
          card.dataset.visible = String(showPopup);
          if (!visible || !popupState.current.open) continue;
          const width = node.clientWidth,
            height = node.clientHeight;
          const cardWidth = card.offsetWidth,
            cardHeight = card.offsetHeight;
          const gap = 42,
            inset = 12;
          let side: "left" | "right" | "above" | "below";
          let left: number, top: number;
          if (width - x - gap >= cardWidth + inset) {
            side = "right";
            left = x + gap;
            top = y - cardHeight / 2;
          } else if (x - gap >= cardWidth + inset) {
            side = "left";
            left = x - gap - cardWidth;
            top = y - cardHeight / 2;
          } else {
            side = y > height / 2 ? "above" : "below";
            left = x - cardWidth / 2;
            top = side === "above" ? y - gap - cardHeight : y + gap;
          }
          // Keep the card clear of the image controls at the bottom and the
          // viewpoint label at the top. Small frames use a horizontal card.
          left = clamp(
            left, inset, Math.max(inset, width - cardWidth - inset),
          );
          // Leave the shared accessibility rail reachable on narrow screens.
          if (width < 650) left = inset;
          const topInset = height >= 360 ? 52 : 12;
          const bottomInset = height >= 360 ? 105 : 40;
          top = clamp(
            top, topInset, Math.max(topInset, height - cardHeight - bottomInset),
          );
          card.dataset.side = side;
          card.style.left = `${left}px`;
          card.style.top = `${top}px`;
          card.style.setProperty(
            "--kd-popup-arrow-y", `${clamp(y - top, 20, cardHeight - 20)}px`,
          );
          card.style.setProperty(
            "--kd-popup-arrow-x", `${clamp(x - left, 20, cardWidth - 20)}px`,
          );
        }
        node.dataset.yaw = String(view.yaw);
        node.dataset.pitch = String(view.pitch);
        node.dataset.fov = String(view.fov);
        if (turn) request();
      };
      const request = () => {
        if (!frame && !disposed) frame = requestAnimationFrame(draw);
      };
      const resize = () => {
        const width = node.clientWidth,
          height = node.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        request();
      };
      const zoom = (delta: number) => {
        stopTurn();
        view.fov = clamp(view.fov + delta, 40, 100);
        request();
      };
      const reset = () => {
        stopTurn();
        Object.assign(view, {
          yaw: panorama.yaw,
          pitch: panorama.pitch,
          fov: panorama.fov,
        });
        request();
      };
      const lookAt = (target: PanoramaView) => {
        view.fov = target.fov;
        // Start from the displayed pose, even if a previous turn is unfinished.
        // Travel across the 0° seam by the shortest arc and never change zoom.
        const deltaYaw = ((target.yaw - view.yaw + 540) % 360) - 180;
        const deltaPitch = target.pitch - view.pitch;
        const angle = Math.hypot(deltaYaw, deltaPitch);
        stopTurn();
        if (reducedMotion.matches || angle < .05) {
          Object.assign(view, { yaw: target.yaw, pitch: target.pitch });
        } else {
          turn = { elapsed: 0, duration: clamp(1200 + angle * 12, 1500, 2500), yaw: view.yaw, pitch: view.pitch, deltaYaw, deltaPitch };
          node.dataset.motionState = "turning";
          if (popup.current) {
            popup.current.style.visibility = "hidden";
            popup.current.dataset.visible = "false";
          }
        }
        request();
      };
      const focus = (id: string) => {
        const point = panorama.points?.find((point) => point.id === id);
        if (!point) return;
        lookAt({ ...point.view, fov: point.markerKind === "topic" ? point.view.fov : view.fov });
      };
      const motionPreferenceChanged = () => {
        if (!reducedMotion.matches || !turn) return;
        view.yaw = turn.yaw + turn.deltaYaw;
        view.pitch = turn.pitch + turn.deltaPitch;
        stopTurn();
        request();
      };
      actions.current = { zoom, reset, lookAt, focus, redraw: request };
      const down = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        stopTurn();
        event.preventDefault();
        event.stopPropagation();
        renderer.domElement.focus({ preventScroll: true });
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        renderer.domElement.setPointerCapture(event.pointerId);
        node.dataset.dragging = "true";
      };
      const move = (event: PointerEvent) => {
        const before = pointers.get(event.pointerId);
        if (!before) return;
        event.preventDefault();
        event.stopPropagation();
        const after = { x: event.clientX, y: event.clientY };
        if (pointers.size === 1) {
          const sensitivity = view.fov / Math.max(1, node.clientHeight);
          view.yaw -= (after.x - before.x) * sensitivity;
          view.pitch += (after.y - before.y) * sensitivity;
        } else {
          const other = [...pointers.entries()].find(
            ([id]) => id !== event.pointerId,
          )![1];
          const oldDistance = Math.hypot(
            before.x - other.x,
            before.y - other.y,
          );
          const newDistance = Math.hypot(after.x - other.x, after.y - other.y);
          if (newDistance > 1 && oldDistance > 1)
            view.fov = clamp((view.fov * oldDistance) / newDistance, 40, 100);
        }
        pointers.set(event.pointerId, after);
        request();
      };
      const up = (event: PointerEvent) => {
        pointers.delete(event.pointerId);
        if (!pointers.size) node.dataset.dragging = "false";
      };
      const wheel = (event: WheelEvent) => {
        event.preventDefault();
        event.stopPropagation();
        zoom(event.deltaY * 0.04);
      };
      const key = (event: KeyboardEvent) => {
        const turns: Record<string, [number, number]> = {
          ArrowLeft: [-6, 0],
          ArrowRight: [6, 0],
          ArrowUp: [0, 6],
          ArrowDown: [0, -6],
        };
        if (turns[event.key]) {
          stopTurn();
          view.yaw += turns[event.key][0];
          view.pitch += turns[event.key][1];
        } else if (event.key === "+" || event.key === "=") zoom(-8);
        else if (event.key === "-") zoom(8);
        else if (event.key === "Home") reset();
        else return;
        event.preventDefault();
        event.stopPropagation();
        request();
      };
      const lost = (event: Event) => {
        event.preventDefault();
        if (!disposed) setStatus("error");
      };
      const containTouch = (event: TouchEvent) => event.stopPropagation();
      const observer = new ResizeObserver(resize);
      observer.observe(node);
      const canvas = renderer.domElement;
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);
      canvas.addEventListener("lostpointercapture", up);
      canvas.addEventListener("wheel", wheel, { passive: false });
      canvas.addEventListener("keydown", key);
      canvas.addEventListener("webglcontextlost", lost);
      canvas.addEventListener("touchstart", containTouch, { passive: true });
      canvas.addEventListener("touchmove", containTouch, { passive: true });
      canvas.addEventListener("touchend", containTouch, { passive: true });
      document.addEventListener("visibilitychange", request);
      reducedMotion.addEventListener("change", motionPreferenceChanged);
      release = () => {
        cancelAnimationFrame(frame);
        stopTurn();
        observer.disconnect();
        pointers.clear();
        document.removeEventListener("visibilitychange", request);
        reducedMotion.removeEventListener("change", motionPreferenceChanged);
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
        canvas.removeEventListener("lostpointercapture", up);
        canvas.removeEventListener("wheel", wheel);
        canvas.removeEventListener("keydown", key);
        canvas.removeEventListener("webglcontextlost", lost);
        canvas.removeEventListener("touchstart", containTouch);
        canvas.removeEventListener("touchmove", containTouch);
        canvas.removeEventListener("touchend", containTouch);
        geometry.dispose();
        material.dispose();
        texture?.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
        actions.current = null;
      };
      texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
      material.map = texture;
      material.needsUpdate = true;
      ready = true;
      resize();
      request();
    })().catch(() => {
      release?.();
      if (!disposed) setStatus("error");
    });
    return () => {
      disposed = true;
      release?.();
    };
  }, [panorama, view, active, attempt, vi]);
  useEffect(() => {
    if (
      status !== "ready" ||
      !focusRequest ||
      appliedFocus.current === focusRequest.revision
    )
      return;
    actions.current?.focus(focusRequest.id);
    appliedFocus.current = focusRequest.revision;
  }, [focusRequest, status]);

  function toggleFullscreen() {
    expandedHost.current = root.current?.closest("#museo-map")?.querySelector<HTMLElement>(".kd-frame") ?? null;
    if (expandedHost.current) setFallbackFullscreen(value => !value);
  }
  const content = (
    <div
      className={`kd-panorama${fullscreen ? " kd-panorama-expanded" : ""}`}
      data-expanded={fullscreen}
      ref={root}
      data-panorama-state={status}
      data-panorama-src={panorama.src}
      onKeyDown={(event) => {
        if (event.key === "Escape" && listOpen) {
          event.preventDefault(); event.stopPropagation(); setListOpen(false);
          root.current?.querySelector<HTMLButtonElement>('[data-action="exhibit-list"]')?.focus();
          return;
        }
        if (event.key !== "Escape" || (!popupOpen && !fullscreen)) return;
        event.preventDefault();
        event.stopPropagation();
        if (popupOpen) closePopup();
        else if (fullscreen) setFallbackFullscreen(false);
      }}
    >
      {status !== "ready" && (
        <img
          className="kd-panorama-preview"
          src={preview.src}
          alt={preview.title[lang]}
        />
      )}
      <div
        className="kd-panorama-canvas"
        ref={host}
        style={{ opacity: status === "ready" ? 1 : 0 }}
        inert={status !== "ready"}
        aria-hidden={status !== "ready"}
      />
      {preview.source !== "grounds360" && (
        <span className="kd-panorama-label">{preview.title[lang]}</span>
      )}
      <div
        className="kd-panorama-hotspots"
        role="group"
        aria-label={vi ? "Các mốc trong ảnh 360°" : "Panorama points"}
      >
        {panorama.points?.map((point) => (
          <button
            key={point.id}
            ref={(button) => {
              hotspotButtons.current[point.id] = button;
            }}
            type="button"
            className={`kd-hotspot${themed ? point.markerKind === "topic" ? " kd-topic-hotspot" : point.markerKind === "exhibit" ? " kd-exhibit-dot" : "" : ""}`}
            data-panorama-point={point.id}
            data-image-u={point.u}
            data-image-v={point.v}
            hidden
            aria-pressed={point.id === selectedPointId}
            aria-expanded={point.id === selectedPointId && popupOpen}
            aria-controls={point.id === selectedPointId && popupOpen ? "kd-panorama-point-popup" : undefined}
            aria-haspopup={point.targetEntryId || point.markerKind === "topic" ? undefined : "dialog"}
            aria-label={themed ? point.title[lang] : `${point.number ?? ""}. ${point.title[lang]}`}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => { if (point.markerKind === "topic") chooseTopic(point.topicId!); else { onSelectPoint?.(point.id); if (point.markerKind === "exhibit") onOpenPoint?.(point.id, event.currentTarget); } }}
          >
            <b>{point.markerKind === "topic" ? point.title[lang] : point.markerKind === "exhibit" ? <span className="kd-dot-core" /> : point.targetEntryId && !point.showNumber ? <ArrowUpRight size={24} aria-hidden="true" /> : point.number}</b>
            <span className="kd-hotspot-label">{point.title[lang]}</span>
          </button>
        ))}
      </div>
      {popupOpen && selectedPoint && (
        <div
          key={selectedPoint.id}
          ref={popup}
          id="kd-panorama-point-popup"
          className="kd-panorama-point-preview kd-panorama-popup"
          role="dialog"
          aria-modal="false"
          aria-labelledby="kd-panorama-popup-title"
          data-popup-point={selectedPoint.id}
          onPointerDown={(event) => event.stopPropagation()}
          onWheel={(event) => event.stopPropagation()}
        >
          <div className="kd-popup-photo">
            <GroundsPointImage key={selectedPoint.id} image={selectedPoint.images[0]} lang={lang} />
            {selectedPoint.number !== undefined && <span>{String(selectedPoint.number).padStart(2, "0")}</span>}
          </div>
          <button
            type="button"
            className="kd-popup-close"
            onClick={closePopup}
            aria-label={vi ? "Đóng thông tin trong ảnh 360°" : "Close panorama information"}
          >
            <X size={18} />
          </button>
          <div className="kd-popup-copy">
            <span className="kd-popup-category">{selectedPoint.category[lang]}</span>
            <h3 id="kd-panorama-popup-title">{selectedPoint.title[lang]}</h3>
            <p>{selectedPoint.summary[lang]}</p>
            <button
              type="button"
              className="kd-popup-open"
              onClick={(event) => onOpenPoint?.(selectedPoint.id, event.currentTarget)}
            >
              <span>{vi ? "Khám phá chi tiết" : "Explore details"}</span>
              <ArrowUpRight size={20} />
            </button>
            <small>{vi ? `${selectedPoint.images.length} ảnh tư liệu` : `${selectedPoint.images.length} photographs`}</small>
          </div>
        </div>
      )}
      {status === "loading" && (
        <div className="kd-panorama-status" role="status">
          {vi ? "Đang mở ảnh 360°…" : "Opening 360° panorama…"}
        </div>
      )}
      {themed && <div className="kd-topic-toolbar" data-topic={topicId ?? "overview"}>
        <button type="button" onClick={topicId ? backTopicLevel : overview}><ArrowLeft size={17} />{(() => {
          const parentId = allTopics.find(topic => topic.id === topicId)?.parentId;
          const parent = allTopics.find(topic => topic.id === parentId);
          return parent ? (vi ? `Quay lại ${parent.title.vi}` : `Back to ${parent.title.en}`) : (vi ? "Quay lại toàn cảnh" : "Room overview");
        })()}</button>
        {topicId && <span className="kd-current-topic">{allTopics.find(topic => topic.id === topicId)?.title[lang]}</span>}
        <button type="button" data-action="exhibit-list" aria-expanded={listOpen} onClick={toggleList}><List size={17} />{vi ? "Danh sách hiện vật" : "Exhibit list"}</button>
        <button type="button" data-action="toggle-hotspots" aria-pressed={showHotspots} onClick={() => setShowHotspots(value => !value)}>{showHotspots ? <Eye size={17} /> : <EyeOff size={17} />}{vi ? showHotspots ? "Ẩn hotspot" : "Hiện hotspot" : showHotspots ? "Hide hotspots" : "Show hotspots"}</button>
      </div>}
      {themed && listOpen && <div className="kd-topic-list" role="region" aria-label={vi ? "Danh sách hiện vật theo chủ đề" : "Exhibits by topic"}>
        <button className="kd-topic-list-close" type="button" onClick={() => setListOpen(false)} aria-label={vi ? "Đóng danh sách" : "Close list"}><X size={18} /></button>
        {listedTopics.map(topic => <section key={topic.id}>
          <h3><button type="button" onClick={() => chooseTopic(topic.id)}>{topic.title[lang]}</button></h3>
          {panorama.points?.filter(point => point.markerKind === "exhibit" && point.topicId === topic.id).map(point => <button key={point.id} type="button" className="kd-topic-list-item" aria-pressed={point.id === selectedPointId} onClick={(event) => { chooseTopic(topic.id); onSelectPoint?.(point.id); onOpenPoint?.(point.id, event.currentTarget); }}>{point.title[lang]}</button>)}
        </section>)}
      </div>}
      {onBack && <button type="button" className="kd-panorama-back" data-action="interior-back" onClick={onBack}><ArrowLeft size={20} />{backLabel?.[lang] ?? (vi ? "Quay về sảnh chính" : "Back to main hall")}</button>}
      {status === "error" && (
        <div className="kd-panorama-status" role="status">
          <p>
            {vi
              ? "Chưa mở được ảnh 360°. Bạn vẫn có thể xem ảnh phía sau hoặc mở nguồn."
              : "Panorama unavailable. You can still see the preview or open its source."}
          </p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            {vi ? "Thử lại" : "Retry"}
          </button>
        </div>
      )}
      <div
        className="kd-panorama-controls"
        role="group"
        aria-label={vi ? "Điều khiển ảnh 360°" : "Panorama controls"}
      >
        <button
          type="button"
          disabled={status !== "ready"}
          onClick={() => actions.current?.zoom(-8)}
          aria-label={vi ? "Phóng to ảnh 360°" : "Zoom in panorama"}
        >
          <Plus />
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          onClick={() => actions.current?.zoom(8)}
          aria-label={vi ? "Thu nhỏ ảnh 360°" : "Zoom out panorama"}
        >
          <Minus />
        </button>
        <button
          type="button"
          disabled={status !== "ready"}
          onClick={() => themed ? overview() : actions.current?.reset()}
          aria-label={vi ? "Về góc nhìn ban đầu" : "Reset panorama view"}
        >
          {themed ? <span>360°</span> : <RotateCcw />}
        </button>
        {
          <button
            type="button"
            onClick={toggleFullscreen}
            data-action="fullscreen-panorama"
            aria-label={
              fullscreen
                ? vi
                  ? "Thoát toàn màn hình ảnh 360°"
                  : "Exit panorama fullscreen"
                : vi
                  ? "Toàn màn hình ảnh 360°"
                  : "Fullscreen panorama"
            }
          >
            {fullscreen ? <Minimize /> : <Maximize />}
          </button>
        }
      </div>

    </div>
  );
  return <><div ref={slot} className="kd-panorama-slot" />{createPortal(content, surface)}</>;
}
