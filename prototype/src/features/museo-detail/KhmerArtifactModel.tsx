import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize, Minus, Plus, RotateCcw } from "lucide-react";
import { acquireMuseumArtifact } from "./museumMediaCache";
import { ExpandableMedia } from "./ExpandableMedia";
import type { PlaceLanguage } from "./khmerPlaces";

export function KhmerArtifactModel({ src, lang, title, initialZoomSteps = 0 }: { src: string; lang: PlaceLanguage; title?: string; initialZoomSteps?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const actions = useRef<{ zoom: (factor: number) => void; reset: () => void } | null>(null);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const vi = lang === "vi";
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let release: (() => void) | undefined;
    setStatus("loading");
    void (async () => {
      const [THREE, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three/addons/controls/OrbitControls.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", vi
        ? `Mô hình 3D ${title ?? "hiện vật"}. Kéo để xoay, hai ngón tay hoặc cộng trừ để phóng, Home để đặt lại.`
        : `${title ?? "Artifact"} 3D model. Drag to rotate, pinch or plus/minus to zoom, Home to reset.`);
      node.append(canvas);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x12110e);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
      const controls = new OrbitControls(camera, canvas);
      controls.enablePan = false;
      controls.enableDamping = false;
      const home = new THREE.Vector3();
      const light = new THREE.DirectionalLight(0xfff3df, 3);
      light.position.set(3, 4, 5);
      scene.add(new THREE.HemisphereLight(0xfff8ec, 0x686050, 2), light);
      const fill = new THREE.DirectionalLight(0xffffff, 1.5);
      fill.position.set(-4, 2, -3);
      scene.add(fill);
      let frame = 0, ready = false;
      const request = () => {
        if (frame || disposed || !ready) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (disposed || document.hidden) return;
          renderer.render(scene, camera);
          node.dataset.pose = camera.position.toArray().join(",");
        });
      };
      const resize = () => {
        const w = node.clientWidth, h = node.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        request();
      };
      const zoom = (factor: number) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance));
        camera.position.copy(controls.target).add(offset);
        controls.update();
        request();
      };
      const reset = () => {
        controls.target.set(0, 0, 0);
        camera.position.copy(home);
        controls.update();
        request();
      };
      const key = (event: KeyboardEvent) => {
        const delta: Record<string, [number, number]> = { ArrowLeft: [-.15, 0], ArrowRight: [.15, 0], ArrowUp: [0, -.15], ArrowDown: [0, .15] };
        if (delta[event.key]) {
          const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
          spherical.theta += delta[event.key][0];
          spherical.phi += delta[event.key][1];
          spherical.makeSafe();
          camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
          controls.update();
        } else if (event.key === "+" || event.key === "=") zoom(.8);
        else if (event.key === "-") zoom(1.25);
        else if (event.key === "Home") reset();
        else return;
        event.preventDefault(); event.stopPropagation(); request();
      };
      const contain = (event: Event) => event.stopPropagation();
      const lost = (event: Event) => { event.preventDefault(); if (!disposed) setStatus("error"); };
      let releaseAsset: (() => void) | undefined;
      const observer = new ResizeObserver(resize);
      observer.observe(node);
      controls.addEventListener("change", request);
      canvas.addEventListener("keydown", key);
      canvas.addEventListener("webglcontextlost", lost);
      for (const name of ["touchstart", "touchmove", "touchend", "pointerdown", "wheel"]) canvas.addEventListener(name, contain, { passive: true });
      document.addEventListener("visibilitychange", request);
      let released = false;
      release = () => {
        if (released) return;
        released = true;
        actions.current = null;
        cancelAnimationFrame(frame);
        observer.disconnect();
        controls.dispose();
        canvas.removeEventListener("keydown", key);
        canvas.removeEventListener("webglcontextlost", lost);
        document.removeEventListener("visibilitychange", request);
        scene.clear();
        releaseAsset?.();
        renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      };
      resize();
      const asset = await acquireMuseumArtifact(src);
      if (disposed) { asset.release(); return; }
      releaseAsset = asset.release;
      const gltf = { scene: asset.model };
      const bounds = new THREE.Box3().setFromObject(gltf.scene);
      if (bounds.isEmpty()) throw new Error("Empty model");
      const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
      gltf.scene.position.sub(bounds.getCenter(new THREE.Vector3()));
      scene.add(gltf.scene);
      const vertical = THREE.MathUtils.degToRad(camera.fov);
      const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
      const distance = radius / Math.sin(Math.min(vertical, horizontal) / 2) * 1.15;
      home.set(0, distance * .2, distance);
      controls.minDistance = radius * 1.2;
      controls.maxDistance = distance * 4;
      home.setLength(THREE.MathUtils.clamp(home.length() * .8 ** initialZoomSteps, controls.minDistance, controls.maxDistance));
      camera.near = Math.max(.001, radius / 100);
      camera.far = distance * 12;
      camera.updateProjectionMatrix();
      actions.current = { zoom, reset };
      ready = true; reset(); setStatus("ready");
    })().catch(error => {
      release?.();
      if (!disposed) { node.dataset.modelError = String(error); setStatus("error"); }
    });
    return () => { disposed = true; release?.(); };
  }, [src, vi, title, initialZoomSteps, attempt]);
  return <ExpandableMedia title={title ?? (vi ? "Hiện vật 3D" : "3D artifact")} className="kd-expandable-model">{(expanded, toggle) => <div className="kd-model" data-model-state={status}>
    <div ref={host} className="kd-model-canvas" />
    {status !== "ready" && <div className="kd-model-status" role="status">
      {status === "loading" ? (vi ? "Đang tải mô hình 3D…" : "Loading 3D model…") : <>
        <p>{vi ? "Chưa tải được mô hình. Bạn có thể thử lại hoặc xem ảnh tư liệu." : "Model unavailable. Retry or view the photograph."}</p>
        <button type="button" onClick={() => setAttempt(n => n + 1)}>{vi ? "Thử lại" : "Retry"}</button>
      </>}
    </div>}
    <div className="kd-model-controls" role="group" aria-label={vi ? "Điều khiển mô hình 3D" : "3D controls"}>
      <span>{vi ? "Kéo để xoay · Hai ngón tay để phóng" : "Drag to rotate · Pinch to zoom"}</span>
      <button type="button" disabled={status !== "ready"} onClick={() => actions.current?.zoom(.8)} aria-label={vi ? "Phóng to mô hình" : "Zoom in model"}><Plus /></button>
      <button type="button" disabled={status !== "ready"} onClick={() => actions.current?.zoom(1.25)} aria-label={vi ? "Thu nhỏ mô hình" : "Zoom out model"}><Minus /></button>
      <button type="button" disabled={status !== "ready"} onClick={() => actions.current?.reset()} aria-label={vi ? "Đặt lại góc nhìn mô hình" : "Reset model view"}><RotateCcw /></button>
      <button type="button" data-action="expand-media" aria-pressed={expanded} onClick={toggle} aria-label={vi ? expanded ? "Thu nhỏ mô hình" : "Mở rộng mô hình" : expanded ? "Collapse model" : "Expand model"}>{expanded ? <Minimize /> : <Maximize />}</button>
    </div>
  </div>}</ExpandableMedia>;
}
