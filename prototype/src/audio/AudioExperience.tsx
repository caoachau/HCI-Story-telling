import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { activeSiteId, isSiteId, type SiteId } from '../experience/state';
import { usePreferences } from '../experience/preferences';
import { audioPlayer, useAudioPlayer } from './player';
import { AudioPlayer } from './AudioPlayer';
import './audio.css';

const MobileAudioView = lazy(() => import('./MobileAudioView'));
function AudioMiniPlayer() {
  const state = useAudioPlayer();
  const prefs = usePreferences();
  const [host, setHost] = useState<HTMLElement>(document.body);
  const [bottom, setBottom] = useState(14);
  const [panelOpen, setPanelOpen] = useState(false);
  const playing = state.tracks.length > 0;
  useEffect(() => {
    if (!playing) return;
    const measure = () => {
      const dialogs = [...document.querySelectorAll<HTMLElement>('dialog[open]')];
      const target = dialogs.at(-1) ?? document.body;
      setHost(target);
      const inline = [...document.querySelectorAll<HTMLElement>('.ha-inline-actions .ha-player')].some(node => node.getClientRects().length && !node.closest('[hidden]'));
      setPanelOpen(inline || target.matches('.ha-qr-dialog,.md-qr-dialog') || !!target.querySelector('.ha-panel .ha-player'));
      const footer = [...document.querySelectorAll<HTMLElement>('.md-footer,.db-navigation,.cck-navigation')].find(item => item.getClientRects().length);
      setBottom(footer ? Math.max(14, innerHeight - footer.getBoundingClientRect().top + 10) : 14);
    };
    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [playing]);
  if (!playing || panelOpen) return null;
  return createPortal(<div className="ha-kiosk-player" style={{ bottom }}><AudioPlayer lang={prefs.lang} compact onClose={() => audioPlayer.stop()} /></div>, host);
}

/** Adds an optional URL view to existing entry points; no new app or router. */
export function AudioExperience({ children, siteId }: { children: ReactNode; siteId?: SiteId }) {
  const [search, setSearch] = useState(location.search);
  const prefs = usePreferences();
  useEffect(() => {
    const sync = () => setSearch(location.search);
    window.addEventListener('popstate', sync);
    window.addEventListener('heritage:route', sync);
    return () => { window.removeEventListener('popstate', sync); window.removeEventListener('heritage:route', sync); };
  }, []);
  const params = new URLSearchParams(search);
  const selected = params.get('site');
  const id = isSiteId(selected) ? selected : siteId ?? activeSiteId();
  const mobile = params.get('view') === 'audio';
  // Follow content navigation, not the current track: automatic playlist
  // advancement must keep playing while choosing another page/card closes it.
  const section = params.get('section') ?? '';
  const selectors = section === 'map' ? ['tab', 'place', 'point', 'object']
    : section === 'tour' ? ['culture', 'interest']
    : section === 'timeline' || section === 'history' ? ['phase', 'topic', 'story']
    : section === 'exhibitions' || section === 'values' ? ['value', 'story']
    : ['story', 'chapter', 'overview', 'place'];
  const contentKey = JSON.stringify([id, prefs.lang, mobile, section, params.get('listen') ?? selectors.map(key => params.get(key))]);
  const previousContent = useRef(contentKey);
  useLayoutEffect(() => {
    if (previousContent.current !== contentKey && audioPlayer.getState().tracks.length) audioPlayer.stop();
    previousContent.current = contentKey;
  }, [contentKey]);
  useEffect(() => {
    document.documentElement.classList.toggle('heritage-audio-document', mobile);
    const playingSite = audioPlayer.getState().tracks[0]?.siteId;
    if (playingSite && playingSite !== id) audioPlayer.stop();
    return () => { document.documentElement.classList.remove('heritage-audio-document'); };
  }, [mobile, id]);
  if (mobile) return id ? <Suspense fallback={<main className="ha-mobile" role="status">{prefs.lang === 'vi' ? 'Đang mở nội dung nghe…' : 'Loading audio view…'}</main>}><MobileAudioView siteId={id} /></Suspense> : <main className="ha-mobile"><h1>{prefs.lang === 'vi' ? 'Chọn một địa điểm' : 'Choose a place'}</h1><a href={import.meta.env.BASE_URL}>{prefs.lang === 'vi' ? 'Về bản đồ di sản' : 'Open the heritage map'}</a></main>;
  return <>{children}<AudioMiniPlayer /></>;
}
