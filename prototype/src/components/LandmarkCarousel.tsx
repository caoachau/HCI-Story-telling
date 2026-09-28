import React, { useState } from 'react';
import { HERITAGE_SITES, HeritageSite } from '../data/heritageSites';
import { ChevronUp, ChevronDown, Sparkles, MapPin } from 'lucide-react';

interface LandmarkCarouselProps {
  selectedSite: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  lang: 'vi' | 'en';
}

export const LandmarkCarousel: React.FC<LandmarkCarouselProps> = ({
  selectedSite,
  onSelectSite,
  lang,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-[95vw] md:max-w-4xl transition-all duration-300">
      {/* Floating Glass Dock Container */}
      <div className="bg-[#0f131c]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2 flex flex-col items-center">
        {/* Toggle Bar */}
        <div className="w-full flex items-center justify-between px-2 pb-1 border-b border-white/5 text-[11px] font-mono text-stone-400">
          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{lang === 'vi' ? '7 Cột Mốc Di Sản Trà Vinh' : '7 Trà Vinh Heritage Sites'}</span>
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-stone-400 hover:text-white px-2 py-0.5 rounded-lg hover:bg-white/5 transition-colors"
            title={isExpanded
              ? (lang === 'vi' ? 'Thu gọn thanh chọn' : 'Collapse landmark list')
              : (lang === 'vi' ? 'Mở rộng thanh chọn' : 'Expand landmark list')}
          >
            <span>{isExpanded
              ? (lang === 'vi' ? 'Thu gọn' : 'Collapse')
              : (lang === 'vi' ? 'Xem dải cột mốc' : 'Show landmarks')}</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Horizontal Mini-Card Strip */}
        {isExpanded && (
          <div className="flex items-center gap-2 overflow-x-auto w-full pt-2 max-w-full px-1 scrollbar-none">
            {HERITAGE_SITES.map((site, index) => {
              const isSelected = site.id === selectedSite.id;
              return (
                <button
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  className={`shrink-0 flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-950/70 border-amber-500 text-white shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-300 hover:border-white/20'
                  }`}
                >
                  <img
                    src={site.heroImage}
                    alt={site.name}
                    className="w-8 h-8 rounded-lg object-cover shrink-0 border border-white/10"
                    loading="lazy"
                  />
                  <div className="min-w-0 pr-1">
                    <div className="text-[9px] font-mono text-amber-400/90 leading-none">
                      0{index + 1}
                    </div>
                    <div className="text-xs font-serif font-bold text-amber-100 truncate max-w-[130px] leading-snug mt-0.5">
                      {lang === 'vi' ? site.name : site.englishName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
