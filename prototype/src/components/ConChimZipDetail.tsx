import React, { useEffect, useRef, useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import type { DetailHostControls } from '../features/con-chim/utils/hostControls';
import './conChimZipHost.css';

interface Props {
  lang: 'vi' | 'en';
  isExpanded: boolean;
  isSidebarWide: boolean;
  onToggleExpanded?: () => void;
  onToggleSidebarWide?: () => void;
  onClose?: () => void;
  onOpenQRCode?: () => void;
  onOpenPanorama360?: () => void;
  onContentChange?: () => void;
}

/** Isolates the approved FE layout, viewport and scrolling from the map application. */
export const ConChimZipDetail: React.FC<Props> = ({ lang, isExpanded, isSidebarWide, onToggleExpanded, onToggleSidebarWide, onClose, onOpenQRCode, onOpenPanorama360, onContentChange }) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const vi = lang === 'vi';
  const src = `${import.meta.env.BASE_URL}con-chim.html`;
  const openHostModal = (open: () => void) => {
    if (isExpanded) onToggleExpanded?.();
    open();
  };
  const syncHostControls = () => {
    const controls: DetailHostControls = { lang, isExpanded, isSidebarWide, actions: [] };
    if (onOpenPanorama360) controls.actions.push('panorama');
    if (onOpenQRCode) controls.actions.push('qr');
    if (!isExpanded && onToggleSidebarWide) controls.actions.push('resize');
    if (onToggleExpanded) controls.actions.push('expand');
    if (onClose) controls.actions.push('close');
    frame.current?.contentWindow?.postMessage({ channel: 'con-chim-detail', type: 'host-controls', controls }, window.location.origin);
  };
  const syncPreferences = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !!document.querySelector('.heritage-app.access-reduce-motion');
    frame.current?.contentWindow?.postMessage({ channel: 'con-chim-detail', type: 'preferences', reduceMotion }, window.location.origin);
  };

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.channel !== 'con-chim-detail') return;
      if (event.data.type === 'ready') { setReady(true); syncHostControls(); syncPreferences(); }
      if (event.data.type === 'host-controls-request') syncHostControls();
      if (event.data.type === 'interaction') onContentChange?.();
      if (event.data.type === 'host-action') {
        switch (event.data.action) {
          case 'panorama': if (onOpenPanorama360) openHostModal(onOpenPanorama360); break;
          case 'qr': if (onOpenQRCode) openHostModal(onOpenQRCode); break;
          case 'resize': if (!isExpanded) onToggleSidebarWide?.(); break;
          case 'expand': onToggleExpanded?.(); break;
          case 'close': onClose?.(); break;
        }
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [onContentChange, lang, isExpanded, isSidebarWide, onToggleExpanded, onToggleSidebarWide, onClose, onOpenQRCode, onOpenPanorama360]);

  useEffect(() => {
    if (!ready) return;
    syncHostControls();
  }, [ready, lang, isExpanded, isSidebarWide, onOpenPanorama360, onOpenQRCode, onToggleSidebarWide, onToggleExpanded, onClose]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 15000);
    return () => window.clearTimeout(timer);
  }, [attempt]);

  useEffect(() => {
    const root = document.querySelector('.heritage-app');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = syncPreferences;
    const observer = new MutationObserver(sync);
    if (root) observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    media.addEventListener('change', sync);
    sync();
    return () => { observer.disconnect(); media.removeEventListener('change', sync); };
  }, [ready]);

  return (
    <section className="cc-zip-detail flex h-full min-h-0 w-full flex-col bg-[#FAF7F2] text-[#0F3836]" aria-label={vi ? 'Chi tiết Cồn Chim' : 'Cồn Chim details'}>
      <div className="relative min-h-0 flex-1">
        <iframe key={attempt} ref={frame} src={src} title={vi ? 'Khám phá Cồn Chim' : 'Explore Cồn Chim'} className="block h-full w-full border-0" />
        {!ready && <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#FAF7F2] p-5 text-center text-sm">
          {onClose && <button className="cc-zip-loading-close" type="button" onClick={onClose} aria-label={vi ? 'Đóng chi tiết Cồn Chim' : 'Close Cồn Chim details'}><X size={18}/></button>}
          {slow ? (vi ? 'Chưa tải được giao diện chi tiết.' : 'The detail page has not loaded.') : (vi ? 'Đang mở Cồn Chim…' : 'Loading Cồn Chim…')}
          {slow && <button type="button" className="flex items-center gap-2 rounded bg-[#0F3836] px-4 py-2 text-white" onClick={() => { setReady(false); setSlow(false); setAttempt(value => value + 1); }}><RefreshCw size={16} />{vi ? 'Tải lại' : 'Retry'}</button>}
        </div>}
      </div>
    </section>
  );
};
