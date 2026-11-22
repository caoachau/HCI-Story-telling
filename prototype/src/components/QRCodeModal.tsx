import React from 'react';
import { X } from 'lucide-react';
import type { HeritageSite } from '../data/heritageSites';
import { ShareContent } from '../experience/ShareContent';
import { isSiteId } from '../experience/state';
import '../experience/experience.css';

interface Props { site: HeritageSite; lang: 'vi' | 'en'; onClose: () => void; }
export function QRCodeModal({ site, lang, onClose }: Props) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><article className="hx-body ha-qr-dialog relative max-h-[95dvh] w-full max-w-xl overflow-auto rounded-2xl">
    <button type="button" onClick={onClose} aria-label={lang === 'vi' ? 'Đóng mã QR' : 'Close QR code'} style={{ float: 'right' }}><X size={20} /></button>
    <p className="hx-kicker">{lang === 'vi' ? site.name : site.englishName}</p>
    {isSiteId(site.id) && <ShareContent siteId={site.id} lang={lang} />}
  </article></div>;
}
