import React, { useState, useRef, useCallback } from 'react';
import { History, Eye, Sliders, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  lang: 'vi' | 'en';
  pastImage: string;
  pastLabel: string;
  pastYear: string;
  pastDescription: string;
  presentImage: string;
  presentLabel: string;
  presentDescription: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  lang,
  pastImage,
  pastLabel,
  pastYear,
  pastDescription,
  presentImage,
  presentLabel,
  presentDescription,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'split' | 'blend'>('split');
  const [blendOpacity, setBlendOpacity] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (offsetX / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="bg-[#121620] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold">
            {lang === 'vi' ? 'Đối chiếu lịch sử: Xưa ↔ Nay' : 'Historical Comparison: Past ↔ Present'}
          </span>
        </div>

        <div className="flex items-center bg-black/40 border border-white/10 p-0.5 rounded-lg text-xs font-mono">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'split' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Trượt cắt' : 'Swipe'}
          </button>
          <button
            onClick={() => setViewMode('blend')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'blend' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Hòa sắc' : 'Blend'}
          </button>
        </div>
      </div>

      {/* Main Comparison Canvas */}
      {viewMode === 'split' ? (
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden select-none cursor-ew-resize border border-white/10 bg-black"
        >
          {/* Present Image (Full background) */}
          <img
            src={presentImage}
            alt={presentLabel}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Past Image (Clipped overlay) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={pastImage}
              alt={pastLabel}
              className="absolute inset-0 w-full h-full object-cover max-w-none filter sepia-[0.35] contrast-105"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              }}
            />
          </div>

          {/* Draggable Vertical Divider Bar */}
          <div
            className="absolute inset-y-0 w-1 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] flex items-center justify-center -translate-x-1/2"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-stone-950 flex items-center justify-center shadow-lg text-[10px] text-stone-950 font-bold">
              ↔
            </div>
          </div>

          {/* Badges on images */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-amber-300 border border-amber-500/30">
            {pastYear} · {pastLabel}
          </div>
          <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
            {lang === 'vi' ? 'Hiện Nay' : 'Present'} · {presentLabel}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-white/10 bg-black">
            {/* Base Present Image */}
            <img
              src={presentImage}
              alt={presentLabel}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Blend Overlay Past Image */}
            <img
              src={pastImage}
              alt={pastLabel}
              className="absolute inset-0 w-full h-full object-cover filter sepia-[0.4] transition-opacity duration-150"
              style={{ opacity: blendOpacity / 100 }}
            />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono">
              <span className="text-amber-300">{lang === 'vi' ? 'Tư liệu cổ' : 'Archive'}: {blendOpacity}%</span>
              <span className="text-emerald-300">{lang === 'vi' ? 'Hiện thực' : 'Present'}: {100 - blendOpacity}%</span>
            </div>
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-3 px-2">
            <span className="text-xs font-mono text-stone-400">{lang === 'vi' ? 'Hiện đại' : 'Present'}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={blendOpacity}
              onChange={(e) => setBlendOpacity(Number(e.target.value))}
              className="flex-1 accent-amber-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono text-amber-400">{lang === 'vi' ? 'Ảnh cổ' : 'Archive'} {pastYear}</span>
          </div>
        </div>
      )}

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
          <span className="text-amber-400 font-mono font-semibold">{pastYear}: {pastLabel}</span>
          <p className="text-stone-400 leading-relaxed">{pastDescription}</p>
        </div>
        <div className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-1">
          <span className="text-emerald-400 font-mono font-semibold">{lang === 'vi' ? 'Hiện nay: ' : 'Present: '}{presentLabel}</span>
          <p className="text-stone-400 leading-relaxed">{presentDescription}</p>
        </div>
      </div>
    </div>
  );
};
