import React from 'react';
import { Sparkles, Compass, Hand, Navigation } from 'lucide-react';

interface AttractModeOverlayProps {
  onWakeUp: () => void;
  lang: 'vi' | 'en';
}

export const AttractModeOverlay: React.FC<AttractModeOverlayProps> = ({ onWakeUp, lang }) => {
  return (
    <div
      onClick={onWakeUp}
      onTouchStart={onWakeUp}
      className="fixed inset-0 z-40 bg-gradient-to-t from-black/80 via-transparent to-black/60 backdrop-blur-[1px] flex flex-col items-center justify-between p-12 cursor-pointer select-none animate-in fade-in duration-700"
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-2 pt-6">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono uppercase tracking-widest shadow-xl">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>{lang === 'vi' ? 'Bảo Tàng & Trung Tâm Thông Tin Du Lịch Tỉnh Trà Vinh' : 'Trà Vinh Museum & Visitor Information Center'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 drop-shadow-2xl text-center">
          {lang === 'vi' ? 'Kể Chuyện Di Sản Số & Du Lịch Cộng Đồng' : 'Digital Heritage Stories & Community Tourism'}
        </h1>
        <p className="text-sm font-sans text-stone-300 max-w-xl text-center">
          {lang === 'vi'
            ? 'Khám phá không gian địa lý văn hóa Kinh – Khmer – Hoa qua bản đồ số tương tác WGS-84'
            : 'Explore Kinh, Khmer, and Hoa cultural landscapes on an interactive WGS-84 map'}
        </p>
      </div>

      {/* Center Prompt */}
      <div className="flex flex-col items-center gap-4 animate-bounce duration-1000">
        <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/80 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
          <Hand className="w-9 h-9 text-amber-300" />
        </div>
        <div className="px-6 py-2.5 rounded-2xl bg-[#0f131c]/90 border border-amber-500/40 text-amber-200 text-sm font-mono tracking-widest uppercase shadow-2xl">
          {lang === 'vi' ? 'Chạm vào màn hình để bắt đầu khám phá' : 'Touch the screen to begin exploring'}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="text-stone-400 text-xs font-mono flex items-center gap-2 pb-4">
        <Navigation className="w-4 h-4 text-amber-400" />
        <span>{lang === 'vi'
          ? '7 Cột Mốc Di Sản Văn Hóa · Ảnh Viễn Thám Vệ Tinh Độ Phân Giải Cao'
          : '7 Cultural Heritage Sites · High-resolution Satellite Imagery'}</span>
      </div>
    </div>
  );
};
