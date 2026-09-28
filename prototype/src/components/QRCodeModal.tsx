import React from 'react';
import { X, Smartphone, QrCode, Share2, Compass, ShieldCheck } from 'lucide-react';
import { HeritageSite } from '../data/heritageSites';

interface QRCodeModalProps {
  site: HeritageSite;
  lang: 'vi' | 'en';
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ site, lang, onClose }) => {
  const publicShareUrl = `${window.location.origin}/heritage/${site.id}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121622] border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Tiếp tục trên thiết bị di động' : 'Continue on mobile'}</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-amber-100">{lang === 'vi' ? site.name : site.englishName}</h3>
          <p className="text-xs text-stone-400">
            {lang === 'vi'
              ? 'Quét mã QR để mang theo hướng dẫn âm thanh, bản đồ đi bộ và câu chuyện di sản'
              : 'Scan the QR code for audio guidance, a walking map, and heritage stories'}
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl">
          {/* Stylized high-contrast QR SVG */}
          <div className="w-48 h-48 relative flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-stone-950"
              fill="currentColor"
            >
              {/* Outer boundary markers */}
              <rect x="0" y="0" width="30" height="30" rx="4" fill="black" />
              <rect x="5" y="5" width="20" height="20" rx="2" fill="white" />
              <rect x="9" y="9" width="12" height="12" rx="1" fill="#b45309" />

              <rect x="70" y="0" width="30" height="30" rx="4" fill="black" />
              <rect x="75" y="5" width="20" height="20" rx="2" fill="white" />
              <rect x="79" y="9" width="12" height="12" rx="1" fill="#b45309" />

              <rect x="0" y="70" width="30" height="30" rx="4" fill="black" />
              <rect x="5" y="75" width="20" height="20" rx="2" fill="white" />
              <rect x="9" y="79" width="12" height="12" rx="1" fill="#b45309" />

              {/* Data matrix pattern */}
              <rect x="36" y="6" width="6" height="6" rx="1" />
              <rect x="48" y="6" width="6" height="6" rx="1" />
              <rect x="60" y="6" width="6" height="6" rx="1" />
              <rect x="36" y="18" width="6" height="6" rx="1" />
              <rect x="48" y="18" width="6" height="6" rx="1" />
              <rect x="36" y="36" width="12" height="12" rx="2" fill="#b45309" />
              <rect x="52" y="36" width="6" height="6" rx="1" />
              <rect x="64" y="36" width="6" height="6" rx="1" />
              <rect x="18" y="48" width="6" height="6" rx="1" />
              <rect x="48" y="48" width="6" height="6" rx="1" />
              <rect x="60" y="48" width="6" height="6" rx="1" />
              <rect x="76" y="48" width="6" height="6" rx="1" />
              <rect x="36" y="60" width="6" height="6" rx="1" />
              <rect x="48" y="60" width="12" height="12" rx="2" />
              <rect x="64" y="60" width="6" height="6" rx="1" />
              <rect x="36" y="76" width="6" height="6" rx="1" />
              <rect x="52" y="76" width="6" height="6" rx="1" />
              <rect x="64" y="76" width="6" height="6" rx="1" />
              <rect x="76" y="76" width="6" height="6" rx="1" />
              <rect x="88" y="76" width="6" height="6" rx="1" />
            </svg>
          </div>
          <span className="text-[11px] font-mono text-stone-600 mt-2 font-semibold">
            {lang === 'vi' ? site.name : site.englishName} · Trà Vinh
          </span>
        </div>

        {/* Feature bullet list for visitors */}
        <div className="space-y-2 text-xs text-stone-300">
          <div className="flex items-center gap-2 p-2.5 bg-black/30 rounded-xl border border-white/5">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{lang === 'vi' ? 'Định vị GPS dẫn đường trực tiếp đến di tích' : 'GPS directions to the heritage site'}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-black/30 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{lang === 'vi' ? 'Nghe thuyết minh song ngữ không cần cài ứng dụng' : 'Listen to bilingual narration without installing an app'}</span>
          </div>
        </div>

        <div className="text-center pt-1">
          <span className="text-[11px] font-mono text-stone-500 break-all select-all">
            {publicShareUrl}
          </span>
        </div>
      </div>
    </div>
  );
};
