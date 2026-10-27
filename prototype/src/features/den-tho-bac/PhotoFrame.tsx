import { useEffect, useRef, useState } from 'react';

// Loaded only after the visitor explicitly chooses the exhibition frame.
// Touch screens and reduced motion keep the original HTML photograph.
export function usePhotoFrameAvailable(reduced: boolean) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const media = matchMedia('(hover:hover) and (pointer:fine) and (min-width:901px)');
    const sync = () => setAvailable(media.matches && !reduced);
    media.addEventListener('change', sync); sync();
    return () => media.removeEventListener('change', sync);
  }, [reduced]);
  return available;
}

export function PhotoFrame({ onUnavailable }: { onUnavailable: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const unavailable = useRef(onUnavailable); unavailable.current = onUnavailable;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const node = host.current, surface = node?.parentElement;
    const image = surface?.querySelector<HTMLImageElement>('.db-picture>img');
    if (!node || !surface || !image) return;
    let disposed = false;
    let release: (() => void) | undefined;
    void (async () => {
      const THREE = await import('three');
      await image.decode();
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      node.append(renderer.domElement);
      const texture = new THREE.Texture(image);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      const backing = new THREE.MeshBasicMaterial({ color: '#171717', toneMapped: false });
      const geometry = new THREE.PlaneGeometry(1, 1);
      const photo = new THREE.Mesh(geometry, material);
      const border = new THREE.Mesh(geometry, backing);
      border.position.z = -.008;
      const group = new THREE.Group(); group.add(border, photo);
      const scene = new THREE.Scene(); scene.add(group);
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 10);
      camera.position.z = 3.2;
      let frame = 0, targetX = 0, targetY = 0, last = 0, rendered = 0;
      const draw = (now: number) => {
        frame = 0;
        if (disposed || document.hidden) return;
        const dt = Math.min(50, last ? now - last : 16); last = now;
        const amount = 1 - Math.exp(-dt / 65);
        group.rotation.x += (targetX - group.rotation.x) * amount;
        group.rotation.y += (targetY - group.rotation.y) * amount;
        renderer.render(scene, camera);
        node.dataset.renderCount = String(++rendered);
        if (Math.abs(targetX - group.rotation.x) + Math.abs(targetY - group.rotation.y) > .0001) request();
      };
      const request = () => { if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw); };
      const resize = () => {
        const width = surface.clientWidth, height = surface.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height; camera.updateProjectionMatrix();
        const viewHeight = 2 * Math.tan(35 * Math.PI / 360) * camera.position.z;
        const ratio = image.naturalWidth / image.naturalHeight;
        const photoHeight = Math.min(viewHeight, viewHeight * camera.aspect / ratio) * .94;
        photo.scale.set(photoHeight * ratio, photoHeight, 1);
        border.scale.set(photoHeight * ratio + .025, photoHeight + .025, 1);
        request();
      };
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const rect = surface.getBoundingClientRect();
        const limit = 2 * Math.PI / 180;
        targetY = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * limit;
        targetX = -Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * limit;
        request();
      };
      const reset = () => { targetX = 0; targetY = 0; request(); };
      const visibility = () => {
        cancelAnimationFrame(frame); frame = 0; last = 0;
        targetX = targetY = 0; group.rotation.set(0, 0, 0); request();
      };
      const lost = (event: Event) => { event.preventDefault(); if (!disposed) unavailable.current(); };
      const observer = new ResizeObserver(resize); observer.observe(surface);
      surface.addEventListener('pointermove', pointer);
      surface.addEventListener('pointerleave', reset);
      document.addEventListener('visibilitychange', visibility);
      renderer.domElement.addEventListener('webglcontextlost', lost);
      release = () => {
        cancelAnimationFrame(frame); observer.disconnect();
        surface.removeEventListener('pointermove', pointer); surface.removeEventListener('pointerleave', reset);
        document.removeEventListener('visibilitychange', visibility);
        renderer.domElement.removeEventListener('webglcontextlost', lost);
        geometry.dispose(); material.dispose(); backing.dispose(); texture.dispose();
        renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      };
      resize();
      renderer.render(scene, camera);
      setReady(true);
    })().catch(() => { release?.(); if (!disposed) unavailable.current(); });
    return () => { disposed = true; release?.(); };
  }, []);
  return <div ref={host} className="db-photo-frame" data-frame-state={ready ? 'ready' : 'loading'} aria-hidden="true"/>;
}
