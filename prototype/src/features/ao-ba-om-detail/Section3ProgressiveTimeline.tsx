import React, { useState, useRef } from 'react';
import {
  History,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Filter,
} from 'lucide-react';
import { TIMELINE_EPOCHS } from './aoBaOm5PartsData';
import type { TimelineEpoch, TimelineSubCard, AoLanguage } from './types';

interface Section3ProgressiveTimelineProps {
  lang: AoLanguage;
}

export const Section3ProgressiveTimeline: React.FC<Section3ProgressiveTimelineProps> = ({ lang }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<TimelineSubCard | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredEpochs = selectedTag === 'all'
    ? TIMELINE_EPOCHS
    : TIMELINE_EPOCHS.filter((epoch) => epoch.tag === selectedTag);

  return (
    <section id="section-3-timeline" className="kiosk-section relative min-h-screen bg-[#0e1017] text-[#f4efe6] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 flex flex-col justify-between select-none overflow-hidden">
      {/* Ambient Neon Mists */}
      <div className="kiosk-neon-mist top-1/4 -left-32 bg-amber-600/10 pointer-events-none" />
      <div className="kiosk-neon-mist -bottom-32 right-1/4 bg-amber-400/8 pointer-events-none" />
      
      {/* Background Decorative Historical Map Grid & Timeline Axis */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header: Section Identity & Category Filters */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
              {lang === 'vi' ? 'PHẦN 03 · DÒNG THỜI GIAN HÌNH THÀNH DI TÍCH' : 'PART 03 · CHRONOLOGICAL PROGRESSIVE TIMELINE'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-50">
            {lang === 'vi' ? 'Dòng Chảy Lịch Sử & Biến Cố Qua Các Thế Kỷ' : 'Historical Currents & Epochal Transformations'}
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-400 max-w-3xl mt-1">
            {lang === 'vi'
              ? 'Chuyển động tịnh tiến qua 5 giai đoạn: Khởi nguồn huyền sử → Các cột mốc chính → Sự kiện nổi bật & Biến cố → Sự thay đổi qua thời gian → Giai đoạn bảo tồn & phát huy giá trị.'
              : 'Linear chronological progression through 5 eras: Origins → Key Milestones → Historic Events & Crises → Transformations → Preservation Today.'}
          </p>
        </div>

        {/* Tag Filters (5 required categories) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'all' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? 'Toàn bộ dòng chảy' : 'All Epochs'}
          </button>
          <button
            onClick={() => setSelectedTag('origin')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'origin' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? '1. Khởi nguồn' : '1. Origin'}
          </button>
          <button
            onClick={() => setSelectedTag('milestone')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'milestone' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? '2. Cột mốc chính' : '2. Milestones'}
          </button>
          <button
            onClick={() => setSelectedTag('historical_event')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'historical_event' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? '3. Sự kiện nổi bật' : '3. Events'}
          </button>
          <button
            onClick={() => setSelectedTag('transformation')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'transformation' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? '4. Thay đổi thời gian' : '4. Evolution'}
          </button>
          <button
            onClick={() => setSelectedTag('preservation')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTag === 'preservation' ? 'bg-amber-500 text-black font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            {lang === 'vi' ? '5. Bảo tồn & Phát huy' : '5. Preservation'}
          </button>
        </div>
      </div>

      {/* Navigation Arrow Controls for Horizontal Scrolling */}
      <div className="relative z-10 flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90">
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'vi' ? 'Kéo ngang hoặc dùng nút mũi tên để tịnh tiến thời gian' : 'Swipe horizontally or use arrows to navigate linear timeline'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTimeline('left')}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-amber-400 text-stone-200 transition-all cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTimeline('right')}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black border border-white/10 hover:border-amber-400 text-stone-200 transition-all cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Progressive Horizontal Timeline Track (Matching Slice 3) */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 flex-1 overflow-x-auto py-8 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-black/40"
      >
        <div className="relative flex items-center min-w-max px-8 gap-16 sm:gap-24">
          
          {/* Continuous Gold Horizon Timeline Line running through center */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-600/30 via-amber-400 to-amber-600/30 z-0 shadow-[0_0_12px_rgba(245,158,11,0.5)]" />

          {/* Epoch Groups along the timeline */}
          {filteredEpochs.map((epoch, epochIdx) => (
            <div key={epoch.id} className="relative z-10 flex flex-col items-center">
              
              {/* Oversized Brutalist Era Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl sm:text-9xl font-mono font-black text-amber-500/[0.04] select-none pointer-events-none tracking-tighter whitespace-nowrap z-0">
                {epoch.timeSpan}
              </div>

              {/* Epoch Anchor Node on Timeline Bar */}
              <div className="relative z-10 flex flex-col items-center my-8">
                {/* Milestone Node Disc */}
                <div className="w-6 h-6 rounded-full bg-amber-400 border-4 border-[#0e1017] shadow-[0_0_16px_rgba(245,158,11,0.8)] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
                {/* Epoch Header Badge */}
                <div className="mt-3 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[11px] font-mono uppercase text-amber-200 tracking-wider backdrop-blur-sm whitespace-nowrap shadow-lg">
                  {lang === 'vi' ? epoch.tagLabel.vi : epoch.tagLabel.en} · <span className="font-bold text-white">{epoch.timeSpan}</span>
                </div>
                <span className="text-xs font-serif text-stone-300 mt-1 max-w-[260px] text-center font-medium">
                  {lang === 'vi' ? epoch.headline.vi : epoch.headline.en}
                </span>
              </div>

              {/* Connected Sub-Cards (Branching Up & Down matching Slice 3) */}
              <div className="relative z-10 flex items-center gap-8">
                {epoch.cards.map((card) => {
                  const isTop = card.position === 'top';

                  return (
                    <div
                      key={card.id}
                      className={`relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-1.5 ${
                        isTop ? '-order-1 mb-8' : 'order-1 mt-8'
                      }`}
                    >
                      {/* Vertical Connector Branch Line */}
                      <div
                        className={`w-0.5 bg-gradient-to-b from-amber-400 to-amber-600/40 ${
                          isTop ? 'h-10 order-last mt-2' : 'h-10 order-first mb-2'
                        }`}
                      />

                      {/* Timeline Event Card (Exact visual style of Slice 3: Vintage archival image, bold title, time badge) */}
                      <div
                        onClick={() => setSelectedCard(card)}
                        className="w-72 sm:w-80 bg-[#161a24]/90 hover:bg-[#1c2230] border border-white/10 hover:border-amber-400/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer group transition-all duration-300 backdrop-blur-sm"
                      >
                        {/* Vintage Archival Image with Warm Monochromatic Filter */}
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                          <img
                            src={card.image}
                            alt={lang === 'vi' ? card.title.vi : card.title.en}
                            className="w-full h-full object-cover filter grayscale contrast-125 brightness-95 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 border border-white/20 text-[10px] font-mono text-amber-300 backdrop-blur-sm">
                            {card.timeTag}
                          </div>
                        </div>

                        {/* Card Content Body */}
                        <div className="p-4 space-y-1.5">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors leading-snug">
                            {lang === 'vi' ? card.title.vi : card.title.en}
                          </h4>
                          <p className="text-xs font-serif text-stone-300 line-clamp-2 leading-relaxed">
                            {lang === 'vi' ? card.summary.vi : card.summary.en}
                          </p>
                          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-amber-400/80">
                            <span>{lang === 'vi' ? 'Chạm để xem chi tiết' : 'Tap to expand details'}</span>
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Milestone Summary Status */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'vi' ? 'Hơn 10 thế kỷ định hình và bảo tồn Quần thể Ao Bà Om' : 'Over 10 centuries shaping and preserving Ao Ba Om'}</span>
        </div>
        <div className="text-amber-300">
          <span>{filteredEpochs.length} {lang === 'vi' ? 'Giai đoạn lịch sử' : 'Historical Epochs'}</span>
        </div>
      </div>

      {/* Expanded Milestone Detail Modal */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl bg-[#141822] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
                {selectedCard.timeTag}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 pt-2">
                {lang === 'vi' ? selectedCard.title.vi : selectedCard.title.en}
              </h3>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
              <img
                src={selectedCard.image}
                alt={lang === 'vi' ? selectedCard.title.vi : selectedCard.title.en}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-3 right-3 text-xs font-serif text-stone-300 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                {lang === 'vi' ? selectedCard.caption.vi : selectedCard.caption.en}
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-3">
              <p className="text-sm font-serif text-amber-200/90 font-medium leading-relaxed">
                {lang === 'vi' ? selectedCard.summary.vi : selectedCard.summary.en}
              </p>
              <p className="text-xs sm:text-sm font-serif text-stone-300 leading-relaxed border-t border-white/10 pt-3">
                {lang === 'vi' ? selectedCard.details.vi : selectedCard.details.en}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                {lang === 'vi' ? 'Đóng chi tiết' : 'Close Details'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
