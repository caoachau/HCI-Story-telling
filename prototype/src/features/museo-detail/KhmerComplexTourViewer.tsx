import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { loadMuseumPanorama } from "./museumMediaCache";
import { ArrowLeft, Maximize, Minimize, Minus, Plus, RotateCcw } from "lucide-react";
import type { PlaceLanguage } from "./khmerPlaces";
import type { DiscoveryAerial } from "./khmerDiscovery";
import { khmerComplexScenes } from "./khmerComplexScenes";
import { useMuseumReducedMotion } from "./museumMotion";

type Pose = { yaw: number; pitch: number; fov: number };
type Travel = { id: string | null; revision: number };

/** Three real capture locations, joined by finite camera moves and a dissolve. */
export function KhmerComplexTour({ aerial, selected, request, lang, active, children }: {
  aerial: DiscoveryAerial; selected: string; request?: Travel;
  lang: PlaceLanguage; active: boolean; children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null), host = useRef<HTMLDivElement>(null);
  const overview = useRef<HTMLDivElement>(null), overviewCamera = useRef<HTMLDivElement>(null);
  const expandedHost = useRef<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const current = useRef<string | null>(null);
  const views = useRef<Record<string, Pose>>({});
  const [phase, setPhase] = useState("overview");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const applied = useRef<number | undefined>(undefined), latestRequest = useRef(request);
  latestRequest.current = request;
  const reduced = useMuseumReducedMotion(root), reduce = useRef(reduced);
  reduce.current = reduced;
  const actions = useRef<{ go: (id: string | null) => void; zoom: (delta: number) => void; reset: () => void } | null>(null);
  const vi = lang === "vi";

  useEffect(() => {
    if (!active) return;
    const node = host.current, aerialNode = overview.current, plane = overviewCamera.current;
    if (!node || !aerialNode || !plane) return;
    let disposed = false, release: (() => void) | undefined;
    void (async () => {
      const THREE = await import("three");
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute("aria-label", vi ? "Ảnh 360° quần thể. Kéo để nhìn quanh, dùng cộng trừ để phóng." : "Complex panorama. Drag to look around, plus/minus to zoom.");
      node.append(canvas);
      const camera = new THREE.PerspectiveCamera(80, 1, .1, 100);
      const resources = new Map<string, Promise<{ scene: InstanceType<typeof THREE.Scene>; dispose: () => void }>>();
      const ready = new Map<string, { scene: InstanceType<typeof THREE.Scene>; dispose: () => void }>();
      const image = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error("Panorama image unavailable")); img.src = src;
      });
      const load = (id: string) => {
        const existing = resources.get(id);
        if (existing) return existing;
        const definition = khmerComplexScenes.find(scene => scene.id === id)!;
        const loading = (async () => {
          const scene = new THREE.Scene();
          let texture: InstanceType<typeof THREE.Texture>;
          let geometry: InstanceType<typeof THREE.SphereGeometry> | undefined;
          let material: InstanceType<typeof THREE.MeshBasicMaterial> | undefined;
          if (definition.image.kind === "cube") {
            const faces = await Promise.all(definition.image.faces.map(async urls => {
              const images = await Promise.all(urls.map(image));
              if (images.some(img => img.naturalWidth !== 512 || img.naturalHeight !== 512)) throw new Error("Invalid panorama tile");
              const face = document.createElement("canvas"); face.width = face.height = 1024;
              const context = face.getContext("2d")!;
              images.forEach((img, index) => context.drawImage(img, index % 2 * 512, Math.floor(index / 2) * 512));
              return face;
            }));
            texture = new THREE.CubeTexture(faces);
            texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
            scene.background = texture;
          } else {
            const photo = await loadMuseumPanorama(definition.image.src);
            if (photo.naturalWidth !== photo.naturalHeight * 2) throw new Error("Invalid spherical panorama");
            texture = new THREE.Texture(photo); texture.colorSpace = THREE.SRGBColorSpace; texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter; texture.generateMipmaps = false;
            geometry = new THREE.SphereGeometry(10, 64, 40); geometry.scale(-1, 1, 1);
            material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
            scene.add(new THREE.Mesh(geometry, material));
          }
          const resource = { scene, dispose: () => { texture.dispose(); geometry?.dispose(); material?.dispose(); } };
          if (disposed) { resource.dispose(); throw new Error("Disposed tour"); }
          ready.set(id, resource);
          return resource;
        })().catch(error => { resources.delete(id); throw error; });
        resources.set(id, loading); return loading;
      };
      const targets = [new THREE.WebGLRenderTarget(1, 1), new THREE.WebGLRenderTarget(1, 1)];
      const blendMaterial = new THREE.ShaderMaterial({
        uniforms: { before: { value: targets[0].texture }, after: { value: targets[1].texture }, mixAmount: { value: 0 } },
        vertexShader: "varying vec2 screenUv; void main(){screenUv=uv;gl_Position=vec4(position.xy,0.,1.);}",
        fragmentShader: "uniform sampler2D before; uniform sampler2D after; uniform float mixAmount; varying vec2 screenUv; void main(){gl_FragColor=mix(texture2D(before,screenUv),texture2D(after,screenUv),mixAmount);\n#include <colorspace_fragment>\n}",
        depthTest: false, depthWrite: false,
      });
      const blendScene = new THREE.Scene(), quad = new THREE.PlaneGeometry(2, 2);
      blendScene.add(new THREE.Mesh(quad, blendMaterial));
      const blendCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      let frame = 0, revision = 0;
      let transition: { from: string | null; to: string | null; elapsed: number; previous?: number; duration: number; fromPose?: Pose; toPose?: Pose } | undefined;
      let queued: { id: string | null } | undefined;
      const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
      const ease = (p: number) => { const t = clamp(p, 0, 1); return t ** 3 * (t * (t * 6 - 15) + 10); };
      const pose = (id: string) => views.current[id] ??= { ...khmerComplexScenes.find(scene => scene.id === id)!.view };
      const render = (id: string, view: Pose, target: typeof targets[number] | null = null) => {
        const resource = ready.get(id); if (!resource) return;
        const phi = THREE.MathUtils.degToRad(90 - view.pitch), theta = THREE.MathUtils.degToRad(view.yaw);
        camera.fov = view.fov; camera.updateProjectionMatrix();
        camera.lookAt(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
        renderer.setRenderTarget(target); renderer.render(resource.scene, camera);
      };
      const aerialPose = (id: string | null, amount: number) => {
        const marker = aerial.markers.find(marker => marker.entryId === id);
        const imagePlane = plane.querySelector<HTMLElement>(".kd-aerial-plane");
        if (!marker || !imagePlane) { plane.style.transform = "none"; return; }
        const scale = 1 + 2.6 * amount;
        const pointX = imagePlane.offsetLeft + marker.x * imagePlane.offsetWidth;
        const pointY = imagePlane.offsetTop + marker.y * imagePlane.offsetHeight;
        const x = plane.clientWidth / 2 - pointX;
        const y = plane.clientHeight / 2 - pointY;
        // Anchor magnification at the actual point in the cropped image.
        // Move that anchor straight to the viewport centre using the
        // same progress; multiplying translation by scale makes it drift away
        // first and then reverse direction.
        plane.style.transformOrigin = `${pointX}px ${pointY}px`;
        plane.style.transform = `translate(${x * amount}px, ${y * amount}px) scale(${scale})`;
      };
      const display = (mode: string, id: string | null) => {
        node.dataset.tourState = mode; node.dataset.scene = id ?? "overview";
        setPhase(mode); setLocation(id); current.current = id;
      };
      const draw = (now: number) => {
        frame = 0;
        if (disposed || document.hidden) return;
        let visiblePose: Pose | undefined;
        if (transition) {
          const t = transition;
          t.elapsed += t.previous === undefined ? 0 : clamp(now - t.previous, 0, 40); t.previous = now;
          const progress = reduce.current ? 1 : clamp(t.elapsed / t.duration, 0, 1);
          const incoming = t.toPose ? { ...t.toPose, fov: t.toPose.fov + 13 * (1 - ease(progress)) } : undefined;
          const outgoing = t.fromPose ? { ...t.fromPose, fov: t.fromPose.fov - 14 * ease(progress) } : undefined;
          visiblePose = incoming ?? outgoing;
          if (t.from && t.to && outgoing && incoming) {
            aerialNode.style.visibility = "hidden";
            render(t.from, outgoing, targets[0]); render(t.to, incoming, targets[1]);
            blendMaterial.uniforms.mixAmount.value = ease((progress - .2) / .7);
            renderer.setRenderTarget(null); renderer.render(blendScene, blendCamera);
          } else if (t.to && incoming) {
            render(t.to, incoming);
            aerialNode.style.visibility = "visible";
            aerialPose(t.to, ease(progress));
            aerialNode.style.opacity = String(1 - ease((progress - .5) / .5));
          } else if (t.from && outgoing) {
            render(t.from, { ...outgoing, fov: t.fromPose!.fov + 12 * ease(progress) });
            aerialNode.style.visibility = "visible";
            aerialPose(t.from, 1 - ease(progress)); aerialNode.style.opacity = String(ease(progress / .75));
          }
          node.dataset.progress = String(progress);
          if (progress === 1) {
            transition = undefined;
            aerialNode.style.visibility = t.to ? "hidden" : "visible";
            aerialNode.style.opacity = "1"; plane.style.transform = "none";
            aerialNode.inert = !!t.to;
            display(t.to ? "scene" : "overview", t.to);
            const next = queued; queued = undefined;
            if (next && next.id !== t.to) void go(next.id);
          } else requestFrame();
        } else if (current.current && ready.has(current.current)) {
          visiblePose = pose(current.current); render(current.current, visiblePose);
        }
        if (visiblePose) { node.dataset.yaw = String(visiblePose.yaw); node.dataset.pitch = String(visiblePose.pitch); node.dataset.fov = String(visiblePose.fov); }
      };
      const requestFrame = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
      const go = async (id: string | null) => {
        if (transition) { queued = { id }; setPending(id); if (id) void load(id).catch(() => {}); return; }
        const token = ++revision;
        if (id === current.current) { setError(false); setPhase(id ? "scene" : "overview"); node.dataset.tourState = id ? "scene" : "overview"; return; }
        setError(false); setPending(id); setPhase("loading"); node.dataset.tourState = "loading";
        try { if (id) await load(id); } catch {
          if (!disposed && token === revision) { setError(true); setPhase(current.current ? "scene" : "overview"); node.dataset.tourState = current.current ? "scene" : "overview"; }
          return;
        }
        if (disposed || token !== revision) return;
        transition = { from: current.current, to: id, elapsed: 0, duration: 1900,
          fromPose: current.current ? { ...pose(current.current) } : undefined,
          toPose: id ? { ...pose(id) } : undefined };
        setPhase("travelling"); node.dataset.tourState = "travelling"; aerialNode.inert = true; requestFrame();
      };
      const resize = () => {
        if (!node.clientWidth || !node.clientHeight) return;
        renderer.setSize(node.clientWidth, node.clientHeight, false); camera.aspect = node.clientWidth / node.clientHeight;
        const pixels = renderer.getDrawingBufferSize(new THREE.Vector2()); targets.forEach(target => target.setSize(pixels.x, pixels.y));
        requestFrame();
      };
      const zoom = (delta: number) => { if (transition || !current.current) return; const view = pose(current.current); view.fov = clamp(view.fov + delta, 40, 100); requestFrame(); };
      const reset = () => { if (transition || !current.current) return; views.current[current.current] = { ...khmerComplexScenes.find(scene => scene.id === current.current)!.view }; requestFrame(); };
      const pointers = new Map<number, { x: number; y: number }>();
      const down = (event: PointerEvent) => {
        if (transition || !current.current || event.pointerType === "mouse" && event.button !== 0) return;
        event.preventDefault(); event.stopPropagation(); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY }); node.dataset.dragging = "true";
      };
      const move = (event: PointerEvent) => {
        const previous = pointers.get(event.pointerId); if (!previous || transition || !current.current) return;
        event.preventDefault(); event.stopPropagation(); const view = pose(current.current), next = { x: event.clientX, y: event.clientY };
        if (pointers.size === 1) { view.yaw -= (next.x - previous.x) * view.fov / node.clientHeight; view.pitch = clamp(view.pitch + (next.y - previous.y) * view.fov / node.clientHeight, -85, 85); }
        else { const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)![1]; const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y), distance = Math.hypot(next.x - other.x, next.y - other.y); if (distance > 1 && oldDistance > 1) view.fov = clamp(view.fov * oldDistance / distance, 40, 100); }
        pointers.set(event.pointerId, next); requestFrame();
      };
      const up = (event: PointerEvent) => { pointers.delete(event.pointerId); if (!pointers.size) node.dataset.dragging = "false"; };
      const wheel = (event: WheelEvent) => { event.preventDefault(); event.stopPropagation(); zoom(event.deltaY * .04); };
      const key = (event: KeyboardEvent) => {
        if (transition || !current.current) return;
        const turns: Record<string, [number, number]> = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, 6], ArrowDown: [0, -6] };
        if (turns[event.key]) { const view = pose(current.current); view.yaw += turns[event.key][0]; view.pitch = clamp(view.pitch + turns[event.key][1], -85, 85); }
        else if (event.key === "+" || event.key === "=") zoom(-8); else if (event.key === "-") zoom(8); else if (event.key === "Home") reset(); else return;
        event.preventDefault(); event.stopPropagation(); requestFrame();
      };
      const lost = (event: Event) => { event.preventDefault(); if (!disposed) setError(true); };
      canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
      for (const name of ["pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(name, up);
      canvas.addEventListener("wheel", wheel, { passive: false }); canvas.addEventListener("keydown", key); canvas.addEventListener("webglcontextlost", lost);
      document.addEventListener("visibilitychange", requestFrame);
      const observer = new ResizeObserver(resize); observer.observe(node);
      actions.current = { go: id => { void go(id); }, zoom, reset };
      release = () => {
        ++revision; cancelAnimationFrame(frame); actions.current = null; observer.disconnect(); pointers.clear();
        document.removeEventListener("visibilitychange", requestFrame);
        canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
        for (const name of ["pointerup", "pointercancel", "lostpointercapture"] as const) canvas.removeEventListener(name, up);
        canvas.removeEventListener("wheel", wheel); canvas.removeEventListener("keydown", key); canvas.removeEventListener("webglcontextlost", lost);
        ready.forEach(resource => resource.dispose()); targets.forEach(target => target.dispose()); blendMaterial.dispose(); quad.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      };
      resize();
      if (current.current) { await load(current.current); if (disposed) return; aerialNode.style.visibility = "hidden"; aerialNode.inert = true; requestFrame(); }
      else { aerialNode.style.visibility = "visible"; aerialNode.style.opacity = "1"; aerialNode.inert = false; plane.style.transform = "none"; }
      setPhase(current.current ? "scene" : "overview");
      node.dataset.tourState = current.current ? "scene" : "overview"; node.dataset.scene = current.current ?? "overview";
      const latest = latestRequest.current;
      if (latest && applied.current !== latest.revision) { applied.current = latest.revision; void go(latest.id); }
    })().catch(() => { release?.(); if (!disposed) setError(true); });
    return () => { disposed = true; release?.(); };
    // Selection requests are handled separately, without recreating WebGL.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, aerial, expanded, vi]);

  useEffect(() => {
    if (!request || applied.current === request.revision || !actions.current) return;
    applied.current = request.revision; actions.current.go(request.id);
  }, [request]);
  useEffect(() => {
    const frame = expandedHost.current;
    if (!frame || !expanded) return;
    const siblings = [...frame.querySelectorAll<HTMLElement>(":scope > .kd-body, :scope > .kd-bottom")];
    siblings.forEach(node => { node.inert = true; });
    return () => { siblings.forEach(node => { node.inert = false; }); };
  }, [expanded]);
  const closeExpanded = () => {
    // Resizing out of the expanded view recreates the renderer. Start that
    // renderer on the aerial overview instead of restoring the last panorama.
    current.current = null;
    setLocation(null);
    setPhase("overview");
    setPending(null);
    setError(false);
    setExpanded(false);
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('[data-action="fullscreen-panorama"]')?.focus({ preventScroll: true }));
  };
  const toggleExpanded = () => {
    if (expanded) { closeExpanded(); return; }
    expandedHost.current = root.current?.closest("#museo-map")?.querySelector<HTMLElement>(".kd-frame") ?? null;
    if (expandedHost.current) setExpanded(true);
  };
  const travelling = phase === "travelling" || phase === "loading";
  const content = <div ref={root} className={`kd-complex-tour${expanded ? " kd-complex-expanded" : ""}`} data-complex-scene={location ?? "overview"} data-complex-phase={phase} onKeyDown={event => {
    if (event.key !== "Escape") return;
    event.preventDefault(); event.stopPropagation();
    if (expanded) closeExpanded(); else if (location || travelling) actions.current?.go(null);
  }}>
    <div ref={host} className="kd-complex-canvas" />
    <div ref={overview} className="kd-complex-overview"><div ref={overviewCamera} className="kd-complex-overview-camera">{children}</div></div>
    {(location || travelling) && <div className="kd-complex-location">
      <button type="button" data-action="complex-overview" onClick={() => actions.current?.go(null)}><ArrowLeft size={18} />{vi ? "Về tổng quan" : "Overview"}</button>
    </div>}
    {error && <div className="kd-complex-error" role="status"><p>{vi ? "Chưa tải được cảnh 360°. Bạn vẫn có thể xem ảnh và phần giới thiệu." : "This panorama could not load. The photograph and introduction remain available."}</p><button type="button" onClick={() => { const retry = pending ?? selected; actions.current?.go(retry); }}>{vi ? "Thử lại" : "Retry"}</button></div>}
    <div className="kd-complex-controls" role="group" aria-label={vi ? "Điều khiển tham quan 360°" : "Tour controls"}>
      {location && <><button type="button" disabled={travelling} onClick={() => actions.current?.zoom(-8)} aria-label={vi ? "Phóng to" : "Zoom in"}><Plus /></button><button type="button" disabled={travelling} onClick={() => actions.current?.zoom(8)} aria-label={vi ? "Thu nhỏ" : "Zoom out"}><Minus /></button><button type="button" disabled={travelling} onClick={() => actions.current?.reset()} aria-label={vi ? "Đặt lại góc nhìn" : "Reset view"}><RotateCcw /></button></>}
      <button type="button" disabled={travelling} data-action="fullscreen-panorama" onClick={toggleExpanded} aria-label={expanded ? vi ? "Thu gọn tham quan" : "Collapse tour" : vi ? "Mở rộng tham quan" : "Expand tour"}>{expanded ? <Minimize /> : <Maximize />}</button>
    </div>
  </div>;
  return expanded && expandedHost.current ? createPortal(content, expandedHost.current) : content;
}
