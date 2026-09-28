// Cache requested local map assets, never preload the whole pack at startup.
const revision = new URL(self.location.href).searchParams.get('revision') || 'v1';
const prefix = `heritage-map:${self.registration.scope}:`;
const cacheName = `${prefix}${revision}`;
const tilePath = new URL('map-tiles/', self.registration.scope).pathname;
const inFlight = new Map();

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(prefix) && name !== cacheName).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(tilePath)) return;
  if (!/\.(?:jpg|png)$/.test(url.pathname)) return;

  event.respondWith((async () => {
    let cache;
    try {
      cache = await caches.open(cacheName);
      const saved = await cache.match(request);
      if (saved) return saved;
    } catch { /* Storage can be unavailable; fall back to normal HTTP caching. */ }

    let pending = inFlight.get(request.url);
    if (!pending) {
      pending = fetch(request, { cache: 'force-cache' }).then((response) => {
        if (cache && response.ok) event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
        return response;
      }).finally(() => inFlight.delete(request.url));
      inFlight.set(request.url, pending);
    }
    return (await pending).clone();
  })());
});
