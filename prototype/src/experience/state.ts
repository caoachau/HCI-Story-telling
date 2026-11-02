import { useEffect, useState } from 'react';
import { preferences, setPreferences } from './preferences';

export const SITE_IDS = ['ao-ba-om', 'chua-ang', 'bao-tang-khmer', 'chua-hang', 'den-tho-bac', 'con-chim', 'bien-ba-dong'] as const;
export type SiteId = typeof SITE_IDS[number];
export const isSiteId = (id: unknown): id is SiteId => typeof id === 'string' && (SITE_IDS as readonly string[]).includes(id);
const ALLOWED = new Set(['site', 'detail', 'view', 'entry', 'tools', 'coreTab', 'object', 'media', 'anchorId', 'anchorOffset', 'topic', 'quickTab', 'quickPhoto', 'quickPage', 'section', 'story', 'mode', 'question', 'point', 'step', 'portable', 'tab', 'chapter', 'photo', 'place', 'phase', 'culture', 'value', 'person', 'scene', 'filter', 'interest', 'audioBlock', 'audioKey', 'reader', 'overview', 'spot', 'legacyFilter']);
const routes = new Map<string, string>();
const CHANNEL = 'heritage-experience-v1';
let installed = false;
let issue: { vi: string; en: string } | null = null;
export const entryIssue = () => issue;
export function setEntryIssue(value: { vi: string; en: string } | null) { issue = value; window.dispatchEvent(new Event('heritage:entry-issue')); }
const safeRead = (key: string) => { try { return sessionStorage.getItem(key); } catch { return null; } };
const safeWrite = (key: string, value: string) => { try { sessionStorage.setItem(key, value); } catch { /* Continue without persistence. */ } };
export function useRememberedState<T>(key: string, initial: T | (() => T), explicit = false) {
  const [value, setValue] = useState<T>(() => {
    if (explicit) return typeof initial === 'function' ? (initial as () => T)() : initial;
    try { const raw = safeRead(`heritage:state:${key}`); if (raw !== null) return JSON.parse(raw); } catch { /* Default for malformed state. */ }
    return typeof initial === 'function' ? (initial as () => T)() : initial;
  });
  useEffect(() => safeWrite(`heritage:state:${key}`, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}
export function routeParams() { return new URLSearchParams(location.search); }
export function activeSiteId(): SiteId | null {
  const selected = routeParams().get('site');
  if (isSiteId(selected)) return selected;
  const pages: Record<string, SiteId> = { 'con-chim.html': 'con-chim', 'den-tho-bac.html': 'den-tho-bac', 'bao-tang-khmer.html': 'bao-tang-khmer', 'ao-ba-om.html': 'ao-ba-om' };
  return pages[location.pathname.split('/').at(-1) || ''] || null;
}
export function updateRoute(patch: Record<string, string | number | boolean | undefined | null>, siteId?: string, persist = true) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(patch)) {
    if (!ALLOWED.has(key)) continue;
    if (value === undefined || value === null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, String(value).slice(0, 160));
  }
  if (['con-chim.html', 'den-tho-bac.html', 'bao-tang-khmer.html', 'ao-ba-om.html'].some(page => location.pathname.endsWith(page))) url.searchParams.set('view', 'detail');
  try { history.replaceState(null, '', url); } catch { /* Reading does not depend on browser history. */ }
  const id = siteId || url.searchParams.get('site');
  if (isSiteId(id) && persist) {
    routes.set(id, url.search);
    safeWrite(`heritage:route:${id}`, url.search);
    if (parent !== window) parent.postMessage({ channel: CHANNEL, type: 'route', siteId: id, search: url.search }, location.origin);
  }
  window.dispatchEvent(new Event('heritage:route'));
}
export function rememberedRoute(siteId: string) { return routes.get(siteId) ?? safeRead(`heritage:route:${siteId}`) ?? ''; }
export function activateSiteRoute(siteId: string) {
  const target = new URL(location.href);
  target.search = '';
  for (const [key, value] of new URLSearchParams(rememberedRoute(siteId))) if (ALLOWED.has(key) && !['site', 'detail', 'portable'].includes(key)) target.searchParams.set(key, value);
  target.searchParams.set('site', siteId);
  target.searchParams.set('lang', preferences().lang);
  try { history.replaceState(null, '', target); } catch { /* Selection still works without history support. */ }
}
export function restoredParams(siteId: string) {
  const current = routeParams();
  return ['section', 'story', 'tab', 'place', 'quickTab', 'quickPhoto', 'quickPage', 'chapter', 'photo', 'reader'].some(key => current.has(key)) ? current : new URLSearchParams(rememberedRoute(siteId));
}
export function detailSource(siteId: 'con-chim' | 'den-tho-bac') {
  const url = new URL(`${import.meta.env.BASE_URL}${siteId}.html`, location.href);
  for (const [key, value] of new URLSearchParams(rememberedRoute(siteId))) if (ALLOWED.has(key) && key !== 'site' && key !== 'detail') url.searchParams.set(key, value);
  url.searchParams.set('lang', preferences().lang);
  url.searchParams.set('view', 'detail');
  return url.pathname + url.search;
}
function childWindows() { return [...document.querySelectorAll('iframe')].map(frame => frame.contentWindow).filter(Boolean) as Window[]; }
function sendPreferences() {
  const message = { channel: CHANNEL, type: 'preferences', value: preferences() };
  childWindows().forEach(child => child.postMessage(message, location.origin));
  if (parent !== window) parent.postMessage(message, location.origin);
}
export function stopOtherAudio() {
  const message = { channel: CHANNEL, type: 'stop-audio' };
  childWindows().forEach(child => child.postMessage(message, location.origin));
  if (parent !== window) parent.postMessage(message, location.origin);
}
export function installExperienceBridge() {
  if (installed) return;
  installed = true;
  try { if (localStorage.getItem('heritage-saved-ao-ba-om') === 'true' && !savedStories().some(item => item.siteId === 'ao-ba-om')) setSavedPlace('ao-ba-om', 'Ao Bà Om', true); } catch { /* Legacy bookmarks remain untouched if storage is unavailable. */ }
  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.data?.channel !== CHANNEL) return;
    const fromParent = parent !== window && event.source === parent;
    if (!fromParent && !childWindows().includes(event.source as Window)) return;
    if (event.data.type === 'preferences') setPreferences(event.data.value || {});
    if (event.data.type === 'request-preferences') sendPreferences();
    if (event.data.type === 'stop-audio') {
      window.dispatchEvent(new Event('heritage:stop-audio'));
      if (!fromParent) childWindows().filter(child => child !== event.source).forEach(child => child.postMessage(event.data, location.origin));
    }
    if (event.data.type === 'route' && isSiteId(event.data.siteId) && typeof event.data.search === 'string') {
      const params = new URLSearchParams(event.data.search.slice(0, 3000));
      const clean = new URLSearchParams([...params].filter(([key]) => ALLOWED.has(key)));
      routes.set(event.data.siteId, '?' + clean.toString());
      safeWrite(`heritage:route:${event.data.siteId}`, '?' + clean.toString());
      window.dispatchEvent(new Event('heritage:route'));
    }
  });
  window.addEventListener('heritage:preferences', sendPreferences);
  document.addEventListener('load', event => { if (event.target instanceof HTMLIFrameElement) sendPreferences(); }, true);
  if (parent !== window) parent.postMessage({ channel: CHANNEL, type: 'request-preferences' }, location.origin);
}
export function resumeUrl(siteId: string, configured = import.meta.env.VITE_PUBLIC_URL || '', searchOverride?: string): string | null {
  if (!isSiteId(siteId)) return null;
  try {
    const base = new URL(configured || location.href);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(base.hostname) || base.hostname.endsWith('.localhost')) return null;
    const pages: Record<string, string> = { 'con-chim': 'con-chim.html', 'den-tho-bac': 'den-tho-bac.html', 'bao-tang-khmer': 'bao-tang-khmer.html' };
    const local = routeParams();
    const state = new URLSearchParams(searchOverride ?? rememberedRoute(siteId));
    if (searchOverride === undefined && (local.get('site') === siteId || location.pathname.endsWith(pages[siteId] || '__none__'))) for (const [key, value] of local) if (ALLOWED.has(key)) state.set(key, value);
    const page = state.get('view') === 'quick' ? 'index.html' : state.get('entry') === 'ao-kiosk' ? 'ao-ba-om.html' : pages[siteId] || 'index.html';
    const target = new URL(page, base);
    for (const [key, value] of state) if (ALLOWED.has(key)) target.searchParams.set(key, value);
    if (page === 'index.html') { target.searchParams.set('site', siteId); if (state.get('view') === 'quick') target.searchParams.delete('detail'); else target.searchParams.set('detail', '1'); }
    if (siteId === 'con-chim') target.searchParams.set('portable', '1');
    target.searchParams.set('lang', preferences().lang);
    return target.href;
  } catch { return null; }
}

export interface SavedStory { siteId: SiteId; title: string; search: string; savedAt: string; }
const SAVED = 'heritage:saved:v1';
export function savedStories(): SavedStory[] {
  try {
    const values = JSON.parse(localStorage.getItem(SAVED) || '[]');
    return Array.isArray(values) ? values.filter(value => isSiteId(value?.siteId) && typeof value.title === 'string' && typeof value.search === 'string').slice(0, 100) : [];
  } catch { return []; }
}
export function saveStory(siteId: SiteId, title: string) {
  const search = routeParams().get('site') === siteId ? location.search : rememberedRoute(siteId);
  const values = savedStories().filter(item => !(item.siteId === siteId && item.search === search));
  values.unshift({ siteId, title: title.slice(0, 200), search, savedAt: new Date().toISOString() });
  try { localStorage.setItem(SAVED, JSON.stringify(values.slice(0, 100))); window.dispatchEvent(new Event('heritage:saved')); return true; } catch { return false; }
}
export function removeSaved(item: SavedStory) {
  try { localStorage.setItem(SAVED, JSON.stringify(savedStories().filter(value => !(value.siteId === item.siteId && value.search === item.search)))); if (item.siteId === 'ao-ba-om' && item.search === '?site=ao-ba-om&detail=1&view=detail') localStorage.setItem('heritage-saved-ao-ba-om', 'false'); window.dispatchEvent(new Event('heritage:saved')); return true; } catch { return false; }
}
export function setSavedPlace(siteId: SiteId, title: string, enabled: boolean) {
  const search = `?site=${siteId}&detail=1&view=detail`;
  const values = savedStories().filter(item => !(item.siteId === siteId && item.search === search));
  if (enabled) values.unshift({ siteId, title, search, savedAt: new Date().toISOString() });
  try { localStorage.setItem(SAVED, JSON.stringify(values)); window.dispatchEvent(new Event('heritage:saved')); return true; } catch { return false; }
}
export function savedStoryUrl(item: SavedStory) {
  const url = new URL('index.html', location.href);
  const pages: Record<string, string> = { 'con-chim': 'con-chim.html', 'den-tho-bac': 'den-tho-bac.html', 'bao-tang-khmer': 'bao-tang-khmer.html' };
  const state = new URLSearchParams(item.search);
  const page = state.get('view') === 'quick' ? 'index.html' : state.get('entry') === 'ao-kiosk' ? 'ao-ba-om.html' : pages[item.siteId] || 'index.html';
  const target = new URL(page, url);
  for (const [key, value] of state) if (ALLOWED.has(key)) target.searchParams.set(key, value);
  target.searchParams.set('site', item.siteId); if (state.get('view') !== 'quick') target.searchParams.set('detail', '1'); target.searchParams.set('lang', preferences().lang);
  return target.href;
}

