import React, { useRef, useState, useEffect } from 'react';
import { X, Compass, RotateCcw, Move, Sparkles } from 'lucide-react';

interface Panorama360ModalProps {
  lang: 'vi' | 'en';
  siteName: string;
  photoUrl: string;
  caption: string;
  onClose: () => void;
}

export const Panorama360Modal: React.FC<Panorama360ModalProps> = ({
  lang,
  siteName,
  photoUrl,
  caption,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.15) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    setRotation((prev) => (prev - delta * 0.25) % 360);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    setRotation((prev) => (prev - delta * 0.3) % 360);
    setStartX(e.touches[0].clientX);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col select-none animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="p-4 md:p-6 flex items-center justify-between border-b border-white/10 bg-[#0d1017]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
              {lang === 'vi' ? 'Không Gian Toàn Cảnh 360° Đắm Chìm' : 'Immersive 360° Panorama'}
            </div>
            <h3 className="text-base md:text-lg font-serif font-bold text-amber-100">{siteName}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1.5 ${
              isAutoRotating
                ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                : 'bg-white/5 border-white/10 text-stone-300 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'vi'
              ? (isAutoRotating ? 'Tự xoay: BẬT' : 'Tự xoay: TẮT')
              : (isAutoRotating ? 'Auto-rotate: ON' : 'Auto-rotate: OFF')}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-stone-200 hover:text-white transition-all"
            title={lang === 'vi' ? 'Đóng chế độ 360°' : 'Close 360° view'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Interactive 360 Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-[#080a0f] flex items-center justify-center"
      >
        {/* Seamless 360 Panorama Image Strip */}
        <div
          className="absolute inset-0 flex transition-transform duration-75"
          style={{
            transform: `translateX(-${(rotation % 100) * 10}px)`,
          }}
        >
          <img
            src={photoUrl}
            alt={siteName}
            className="w-full h-full object-cover scale-105 pointer-events-none"
            style={{
              filter: 'brightness(0.95) contrast(1.05)',
            }}
          />
        </div>

        {/* Center interaction hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-stone-300 text-xs font-mono flex items-center gap-2 shadow-2xl">
          <Move className="w-4 h-4 text-amber-400" />
          <span>{lang === 'vi'
            ? 'Kéo sang trái/phải để xoay góc nhìn 360° quang cảnh di tích'
            : 'Drag left or right to rotate the 360° heritage panorama'}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 bg-[#0d1017] text-xs font-mono text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-amber-200/90">{caption}</span>
        <span className="text-stone-500">{lang === 'vi' ? 'Góc quay' : 'Bearing'}: {Math.round(rotation)}°</span>
      </div>
    </div>
  );
};
