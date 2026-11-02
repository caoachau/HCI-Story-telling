import { addProtocol } from 'maplibre-gl';
import { MAP_BLOCKS } from './mapBlocks.generated';
import { GOOGLE_IMAGERY, getGoogleTileUrl } from './googleImagery';
import { ESRI_IMAGERY, getEsriTileUrl } from './esriImagery';

export type BlockProvider = 'google' | 'esri';
const available = { google: new Set<string>(MAP_BLOCKS.google), esri: new Set<string>(MAP_BLOCKS.esri) };
const saved = new Map<string, ArrayBuffer>();
const pending = new Map<string, { controller: AbortController; promise: Promise<ArrayBuffer>; users: number }>();
const MAX_BYTES = 24 * 1024 * 1024;
let savedBytes = 0, registered = false;

function checkAbort(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
}
function fileUrl(provider: BlockProvider, key: string): string | null {
  return available[provider].has(key)
    ? `${import.meta.env.BASE_URL}map-tiles/blocks-v1/${provider}/${key}.bin?v=${MAP_BLOCKS.revision}` : null;
}

/** Bounded compressed cache; cancelling one consumer does not cancel another. */
async function readBlock(url: string, signal?: AbortSignal): Promise<ArrayBuffer> {
  checkAbort(signal);
  const cached = saved.get(url);
  if (cached) { saved.delete(url); saved.set(url, cached); return cached; }
  let entry = pending.get(url);
  if (!entry) {
    const controller = new AbortController();
    const promise = fetch(url, { signal: controller.signal, cache: 'force-cache' }).then(async response => {
      if (!response.ok) throw new Error(`Map block: HTTP ${response.status}`);
      const data = await response.arrayBuffer();
      while (savedBytes + data.byteLength > MAX_BYTES && saved.size) {
        const key = saved.keys().next().value!;
        savedBytes -= saved.get(key)!.byteLength; saved.delete(key);
      }
      if (data.byteLength <= MAX_BYTES) { saved.set(url, data); savedBytes += data.byteLength; }
      return data;
    }).finally(() => { if (pending.get(url)?.controller === controller) pending.delete(url); });
    entry = { controller, promise, users: 0 }; pending.set(url, entry);
  }
  entry.users++;
  let abort: (() => void) | undefined;
  try {
    return await (signal ? Promise.race([entry.promise, new Promise<never>((_, reject) => {
      abort = () => reject(new DOMException('Aborted', 'AbortError'));
      signal.addEventListener('abort', abort, { once: true });
    })]) : entry.promise);
  } finally {
    if (abort) signal?.removeEventListener('abort', abort);
    if (--entry.users === 0 && pending.get(url) === entry) {
      pending.delete(url); entry.controller.abort();
    }
  }
}

type BlockHeader = { tiles: string[]; images: Record<string, [number, number]> };

/** Native canvas raster assembly, preserving the original JPEG pixels and
 * geographic grid. One 1024px texture replaces sixteen 256px tile requests.
 */
async function decodeBlock(data: ArrayBuffer, z: number, x: number, y: number, signal: AbortSignal): Promise<ImageBitmap> {
  checkAbort(signal);
  const headerLength = new DataView(data).getUint32(0, true);
  const header: BlockHeader = JSON.parse(new TextDecoder().decode(new Uint8Array(data, 4, headerLength)));
  const images = new Map<string, ImageBitmap>();
  try {
    const results = await Promise.allSettled(Object.entries(header.images).map(async ([key, [offset, length]]) => {
      const image = await createImageBitmap(new Blob([data.slice(4 + headerLength + offset, 4 + headerLength + offset + length)], { type: 'image/jpeg' }));
      images.set(key, image);
    }));
    checkAbort(signal);
    const failed = results.find(result => result.status === 'rejected');
    if (failed?.status === 'rejected') throw failed.reason;
    const canvas = new OffscreenCanvas(1024, 1024), context = canvas.getContext('2d')!;
    for (let i = 0; i < 16; i++) {
      const key = header.tiles[i], image = images.get(key)!;
      const [sz, sy, sx] = key.split('/').map(Number), scale = 2 ** (z + 2 - sz);
      const dx = i % 4, dy = Math.floor(i / 4), size = image.width / scale;
      context.drawImage(image, (x * 4 + dx - sx * scale) * size, (y * 4 + dy - sy * scale) * size,
        size, size, dx * 256, dy * 256, 256, 256);
    }
    return canvas.transferToImageBitmap();
  } finally { images.forEach(image => image.close()); }
}

async function remoteBlock(provider: BlockProvider, z: number, x: number, y: number, signal: AbortSignal): Promise<ImageBitmap> {
  // No detailed local tiles exist for this block. Reuse the best shipped
  // parent for peripheral context, instead of starting 16 Internet requests
  // that would compete with the selected place's full-resolution imagery.
  const parent = provider === 'google' ? getGoogleTileUrl(x, y, z) : getEsriTileUrl(x, y, z);
  const local = /\/map-tiles\/[^/]+\/(\d+)\/(\d+)\/(\d+)\.jpg$/.exec(parent);
  if (local) {
    const response = await fetch(parent, { signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`Map parent: HTTP ${response.status}`);
    const sz = Number(local[1]), sy = Number(local[2]), sx = Number(local[3]);
    const scale = 2 ** (z - sz), size = 256 / scale;
    return createImageBitmap(await response.blob(), (x - sx * scale) * size, (y - sy * scale) * size, size, size,
      { resizeWidth: 1024, resizeHeight: 1024, resizeQuality: 'high' });
  }
  // Preserve navigation outside the entire local pack. All seven places use
  // their bundled original-resolution imagery above.
  const template = provider === 'google' ? GOOGLE_IMAGERY.tileUrls[0] : ESRI_IMAGERY.tileUrl;
  const images: ImageBitmap[] = [];
  const results = await Promise.allSettled(Array.from({ length: 16 }, async (_, i) => {
    const url = template.replace('{z}', String(z + 2)).replace('{x}', String(x * 4 + i % 4)).replace('{y}', String(y * 4 + Math.floor(i / 4)));
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Map imagery: HTTP ${response.status}`);
    images[i] = await createImageBitmap(await response.blob());
  }));
  try {
    checkAbort(signal);
    const failed = results.find(result => result.status === 'rejected');
    if (failed?.status === 'rejected') throw failed.reason;
    const canvas = new OffscreenCanvas(1024, 1024), context = canvas.getContext('2d')!;
    images.forEach((image, i) => context.drawImage(image, i % 4 * 256, Math.floor(i / 4) * 256, 256, 256));
    return canvas.transferToImageBitmap();
  } finally { images.forEach(image => image.close()); }
}

export function registerMapBlocks(): void {
  if (registered) return;
  addProtocol('heritage-block', async (request, controller) => {
    const match = /^heritage-block:\/\/(google|esri)\/(\d+)\/(\d+)\/(\d+)$/.exec(request.url);
    if (!match) throw new Error('Invalid map block');
    const [, provider, level, column, row] = match;
    const z = Number(level), x = Number(column), y = Number(row);
    const url = fileUrl(provider as BlockProvider, `${z}/${y}/${x}`);
    const data = url
      ? await decodeBlock(await readBlock(url, controller.signal), z, x, y, controller.signal)
      : await remoteBlock(provider as BlockProvider, z, x, y, controller.signal);
    if (controller.signal.aborted) { data.close(); checkAbort(controller.signal); }
    return { data };
  });
  registered = true;
}

/** Warm only local destination blocks; no speculative Internet requests. */
export async function prefetchMapBlocks(lng: number, lat: number, provider: BlockProvider, signal: AbortSignal): Promise<void> {
  const max = provider === 'google' ? 16 : 15;
  for (const z of [max - 1, max]) {
    checkAbort(signal);
    const x = Math.floor((lng + 180) / 360 * 2 ** z);
    const y = Math.floor((1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2 * 2 ** z);
    const url = fileUrl(provider, `${z}/${y}/${x}`);
    if (url) await readBlock(url, signal);
  }
}
