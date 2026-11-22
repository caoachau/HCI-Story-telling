import React from 'react';
import { Sparkles, Hand, Navigation, X } from 'lucide-react';

interface AttractModeOverlayProps {
  onWakeUp: () => void;
  lang: 'vi' | 'en';
}

export const AttractModeOverlay: React.FC<AttractModeOverlayProps> = ({ onWakeUp, lang }) => {
  return (
    <div
      onClick={onWakeUp}
      className="fixed inset-0 z-40 bg-gradient-to-t from-black/80 via-transparent to-black/60 backdrop-blur-[1px] flex flex-col items-center justify-between p-6 sm:p-12 cursor-pointer select-none animate-in fade-in duration-700"
    >
      <button type="button" onClick={event => { event.stopPropagation(); onWakeUp(); }}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#13181d] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        aria-label={lang === 'vi' ? 'Đóng màn hình chào' : 'Close welcome screen'}
        title={lang === 'vi' ? 'Đóng màn hình chào' : 'Close welcome screen'}><X size={20} aria-hidden="true" /></button>
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-2 pt-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl text-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{lang === 'vi' ? 'Bảo Tàng & Trung Tâm Thông Tin Du Lịch Tỉnh Trà Vinh' : 'Trà Vinh Museum & Visitor Information Center'}</span>
        </div>
        <h1 className="text-2xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-2xl text-center">
          {lang === 'vi' ? 'Khám phá những câu chuyện di sản Trà Vinh' : 'Discover Trà Vinh’s heritage stories'}
        </h1>
        <p className="text-sm font-sans text-stone-300 max-w-xl text-center">
          {lang === 'vi'
            ? 'Chạm vào một địa điểm trên bản đồ hoặc thẻ ảnh để đọc và nghe câu chuyện.'
            : 'Select a place on the map or a photo card to read and listen to its story.'}
        </p>
      </div>

      {/* Center Prompt */}
      <div className="flex flex-col items-center gap-4 animate-bounce duration-1000">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
          <Hand className="w-9 h-9 text-amber-300" />
        </div>
        <button type="button" onClick={event => { event.stopPropagation(); onWakeUp(); }} className="min-h-11 px-6 py-2.5 rounded-2xl bg-[#0f131c]/90 border border-amber-500/40 text-amber-200 text-sm font-mono tracking-widest uppercase shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">
          {lang === 'vi' ? 'Chạm vào màn hình để bắt đầu khám phá' : 'Touch the screen to begin exploring'}
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="text-stone-400 text-xs font-mono flex items-center gap-2 pb-4 text-center">
        <Navigation className="w-4 h-4 text-amber-400" />
        <span>{lang === 'vi'
          ? '7 địa điểm di sản · Câu chuyện về văn hóa, con người và đời sống'
          : '7 heritage sites · Stories of culture, people and everyday life'}</span>
      </div>
    </div>
  );
};
