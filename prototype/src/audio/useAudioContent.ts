import { useEffect, useState } from 'react';
import { loadAudioCatalog, contentForRoute } from './catalog';
import { activeSiteId, rememberedRoute, routeParams, type SiteId } from '../experience/state';
import type { AudioCatalog, AudioLanguage } from './types';

const cache = new Map<string, Promise<AudioCatalog>>();
export function catalogFor(siteId: SiteId, lang: AudioLanguage) {
  const key = `${siteId}:${lang}`;
  if (!cache.has(key)) cache.set(key, loadAudioCatalog(siteId, lang).then(catalog => {
    // Group covers inherit a real photograph from their own contents.
    for (const item of [...catalog.items].reverse()) {
      item.images = item.images.filter(image => !!image.src);
      if (!item.images.length) { const child = item.children.map(id => catalog.items.find(entry => entry.id === id)).find(entry => entry?.images[0]?.src); if (child) item.images = [child.images[0]]; }
    }
    return catalog;
  }).catch(error => { cache.delete(key); throw error; }));
  return cache.get(key)!;
}
export function currentAudioParams(siteId: SiteId) {
  return activeSiteId() === siteId ? routeParams() : new URLSearchParams(rememberedRoute(siteId));
}
export function useAudioContent(siteId: SiteId, lang: AudioLanguage, searchOverride?: string) {
  const [catalog, setCatalog] = useState<AudioCatalog>();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState(() => searchOverride ?? currentAudioParams(siteId).toString());
  useEffect(() => {
    const sync = () => setSearch(searchOverride ?? currentAudioParams(siteId).toString());
    sync();
    window.addEventListener('heritage:route', sync);
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('heritage:route', sync); window.removeEventListener('popstate', sync); };
  }, [siteId, searchOverride]);
  useEffect(() => {
    let alive = true;
    setCatalog(undefined); setError(false);
    void catalogFor(siteId, lang).then(result => { if (alive) setCatalog(result); }).catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, [siteId, lang, attempt]);
  const params = new URLSearchParams(search);
  return { catalog, content: catalog ? contentForRoute(catalog, params) : undefined, params, error, retry: () => setAttempt(value => value + 1) };
}
