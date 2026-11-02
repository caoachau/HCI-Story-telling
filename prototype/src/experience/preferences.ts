import { useSyncExternalStore } from 'react';

export interface Preferences { lang: 'vi' | 'en'; largeText: boolean; highContrast: boolean; reduceMotion: boolean; }
const KEY = 'heritage:preferences:v1';
const EVENT = 'heritage:preferences';
const defaults: Preferences = { lang: 'vi', largeText: false, highContrast: false, reduceMotion: matchMedia('(prefers-reduced-motion: reduce)').matches };
let current: Preferences = defaults;
try {
  const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
  current = { ...defaults, ...Object.fromEntries(Object.entries(stored).filter(([key, value]) => key === 'lang' ? value === 'vi' || value === 'en' : key in defaults && typeof value === 'boolean')) };
} catch { /* Preferences still work in memory when device storage is disabled. */ }
const queryLang = new URLSearchParams(location.search).get('lang');
if (queryLang === 'vi' || queryLang === 'en') current = { ...current, lang: queryLang };

export function preferences() { return current; }
export function setPreferences(patch: Partial<Preferences>) {
  const next = { ...current };
  for (const key of ['largeText', 'highContrast', 'reduceMotion'] as const) if (typeof patch[key] === 'boolean') next[key] = patch[key]!;
  if (patch.lang === 'vi' || patch.lang === 'en') next.lang = patch.lang;
  if (JSON.stringify(current) === JSON.stringify(next)) return;
  current = next;
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* Session-only preferences. */ }
  applyPreferences();
  window.dispatchEvent(new Event(EVENT));
}
export function applyPreferences() {
  document.documentElement.lang = current.lang;
  try { const url = new URL(location.href); url.searchParams.set('lang', current.lang); history.replaceState(null, '', url); } catch { /* Preferences do not depend on history support. */ }
  document.documentElement.classList.toggle('heritage-large-text', current.largeText);
  document.documentElement.classList.toggle('heritage-high-contrast', current.highContrast);
  document.documentElement.classList.toggle('reduce-motion', current.reduceMotion);
  document.documentElement.classList.toggle('heritage-reduce-motion', current.reduceMotion);
}
const subscribe = (notify: () => void) => { window.addEventListener(EVENT, notify); return () => window.removeEventListener(EVENT, notify); };
export function usePreferences() { return useSyncExternalStore(subscribe, preferences, preferences); }
window.addEventListener('storage', event => {
  if (event.key !== KEY || !event.newValue) return;
  try { setPreferences(JSON.parse(event.newValue)); } catch { /* Ignore malformed device data. */ }
});
applyPreferences();

