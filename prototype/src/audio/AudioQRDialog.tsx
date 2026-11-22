import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ShareContent } from '../experience/ShareContent';
import type { SiteId } from '../experience/state';
import type { AudioLanguage } from './types';

export function AudioQRDialog({ siteId, lang, search, onClose }: { siteId: SiteId; lang: AudioLanguage; search?: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const origin = document.activeElement as HTMLElement | null;
    const node = ref.current!;
    node.showModal();
    return () => { node.close(); queueMicrotask(() => origin?.isConnected && origin.focus({ preventScroll: true })); };
  }, []);
  return <dialog ref={ref} className="ha-qr-dialog" aria-label={lang === 'vi' ? 'Mã QR nội dung' : 'Content QR code'} onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); onClose(); }}><button type="button" className="ha-dialog-close" onClick={onClose} aria-label={lang === 'vi' ? 'Đóng mã QR' : 'Close QR code'}><X /></button><ShareContent siteId={siteId} lang={lang} searchOverride={search} /></dialog>;
}
