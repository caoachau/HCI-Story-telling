import type { Mesh, Object3D, Texture } from "three";

// Keep decoded panoramas across tab changes; failed requests remain retryable.
const panoramas = new Map<string, { image: HTMLImageElement; promise: Promise<HTMLImageElement> }>();
export function loadMuseumPanorama(src: string, priority: "high" | "low" = "high"): Promise<HTMLImageElement> {
  const existing = panoramas.get(src);
  if (existing) {
    if (priority === "high") existing.image.fetchPriority = "high";
    panoramas.delete(src); panoramas.set(src, existing); return existing.promise;
  }
  const image = new Image();
  image.decoding = "async";
  image.fetchPriority = priority;
  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      if (image.naturalWidth !== image.naturalHeight * 2) { reject(new Error("Invalid spherical panorama")); return; }
      void image.decode().then(() => resolve(image), reject);
    };
    image.onerror = () => reject(new Error("Panorama unavailable"));
    image.src = src;
  }).catch(error => { if (panoramas.get(src)?.promise === pending) panoramas.delete(src); throw error; });
  panoramas.set(src, { image, promise: pending });
  while (panoramas.size > 2) panoramas.delete(panoramas.keys().next().value!);
  return pending;
}

/** Fetch during the overview instead of waiting for a panorama tab click. */
export function warmMuseumPanoramas() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  for (const src of [
    new URL("../../assets/museo/khmer-grounds-360.jpg", import.meta.url).href,
    new URL("../../assets/museo/khmer-ground-test-360.jpg", import.meta.url).href,
  ]) void loadMuseumPanorama(src, "low").catch(() => {});
  void import("three").catch(() => {});
}

type Artifact = { source: Promise<Object3D>; users: number; used: number };
const artifacts = new Map<string, Artifact>();
let used = 0;
function disposeArtifact(root: Object3D) {
  const textures = new Set<Texture>();
  root.traverse(object => {
    const mesh = object as Mesh;
    mesh.geometry?.dispose();
    for (const material of Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []) {
      for (const value of Object.values(material)) if ((value as Texture | null)?.isTexture) textures.add(value as Texture);
      material.dispose();
    }
  });
  for (const texture of textures) {
    (texture.source.data as { close?: () => void } | undefined)?.close?.();
    texture.dispose();
  }
}
function trimArtifacts() {
  while (artifacts.size > 2) {
    const candidate = [...artifacts].filter(([, value]) => !value.users).sort((a, b) => a[1].used - b[1].used)[0];
    if (!candidate) return;
    artifacts.delete(candidate[0]);
    void candidate[1].source.then(disposeArtifact, () => {});
  }
}
/** Each viewer owns its transform and GPU context; cached geometry is shared
 * until eviction, so opening the story or reselecting a model never reparses it. */
export async function acquireMuseumArtifact(src: string) {
  let entry = artifacts.get(src);
  if (!entry) {
    const source = import("three/addons/loaders/GLTFLoader.js").then(({ GLTFLoader }) => new GLTFLoader().loadAsync(src)).then(gltf => gltf.scene);
    entry = { source, users: 0, used: ++used };
    artifacts.set(src, entry);
  }
  const cached = entry;
  cached.users++; cached.used = ++used;
  let released = false;
  const release = () => { if (released) return; released = true; cached.users--; cached.used = ++used; trimArtifacts(); };
  try {
    const source = await cached.source;
    trimArtifacts();
    return { model: source.clone(true), release };
  } catch (error) {
    if (artifacts.get(src) === cached) artifacts.delete(src);
    release();
    throw error;
  }
}
