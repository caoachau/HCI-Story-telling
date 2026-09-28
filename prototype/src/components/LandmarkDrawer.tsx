import React from 'react';
import { HERITAGE_SITES, HeritageSite } from '../data/heritageSites';
import { formatCoordinates } from '../utils/geoCoordinates';
import { X, Navigation, ChevronRight, Sparkles, MapPin } from 'lucide-react';

interface LandmarkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSite: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  lang: 'vi' | 'en';
  activeCategory: string;
}

export const LandmarkDrawer: React.FC<LandmarkDrawerProps> = ({
  isOpen,
  onClose,
  selectedSite,
  onSelectSite,
  lang,
  activeCategory,
}) => {
  if (!isOpen) return null;

  const categoryName = (category: HeritageSite['category']) => {
    if (lang === 'vi') return category;
    const labels: Record<HeritageSite['category'], string> = {
      'Làng nghề truyền thống': 'Traditional craft village',
      'Di sản kiến trúc': 'Architectural heritage',
      'Danh thắng & Sinh thái': 'Nature & ecology',
      'Không gian diễn xướng': 'Performing arts',
    };
    return labels[category];
  };

  const filteredSites = HERITAGE_SITES.filter((site) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'khmer') {
      return site.id === 'ao-ba-om' || site.id === 'chua-ang' || site.id === 'bao-tang-khmer' || site.id === 'chua-hang';
    }
    if (activeCategory === 'eco') {
      return site.id === 'con-chim' || site.id === 'bien-ba-dong';
    }
    if (activeCategory === 'history') {
      return site.id === 'den-tho-bac' || site.id === 'bao-tang-khmer';
    }
    return true;
  });

  return (
    <div className="fixed inset-y-16 left-0 w-full sm:w-[380px] md:w-[420px] bg-[#0f131a]/95 backdrop-blur-xl border-r border-white/10 z-50 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-left">
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500">
            {lang === 'vi' ? 'Hành Lang Di Sản Trà Vinh' : 'Trà Vinh Heritage Corridor'}
          </div>
          <h3 className="text-base md:text-lg font-serif font-bold text-amber-100">
            {lang === 'vi' ? '7 Cột Mốc Di Sản' : '7 Cultural Landmarks'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors border border-white/10"
          title={lang === 'vi' ? 'Đóng danh sách' : 'Close directory'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sites List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-white/5">
        {filteredSites.map((site, index) => {
          const isSelected = site.id === selectedSite.id;
          const coords = formatCoordinates(site.lat, site.lng);

          return (
            <div
              key={site.id}
              onClick={() => {
                onSelectSite(site);
                // On mobile, close drawer so user sees map; on large screens keep or let user close
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={`pt-3 first:pt-0 cursor-pointer group rounded-xl p-3 transition-all ${
                isSelected
                  ? 'bg-amber-950/60 border border-amber-500/50 shadow-lg'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Thumbnail Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#161a22]">
                  <img
                    src={site.heroImage}
                    alt={site.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-mono text-amber-300 font-bold">
                    0{index + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{site.province}</span>
                  </div>
                  <h4 className={`text-sm font-serif font-bold mt-0.5 truncate transition-colors ${
                    isSelected ? 'text-amber-200' : 'text-stone-100 group-hover:text-amber-300'
                  }`}>
                    {lang === 'vi' ? site.name : site.englishName}
                  </h4>
                  <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                    {lang === 'vi' ? site.tagline : `${site.province} · ${categoryName(site.category)}`}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-stone-400">
                    <span className="text-amber-300/80">{coords.dms}</span>
                    <span className="text-white/20">·</span>
                    <span>{site.elevationMeters} {lang === 'vi' ? 'm' : 'm above sea level'}</span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected ? 'text-amber-400 translate-x-1' : 'text-stone-500 group-hover:translate-x-1'
                }`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-white/10 bg-[#0a0d12] text-[11px] font-mono text-stone-400 flex items-center justify-between">
        <span>{lang === 'vi' ? 'Tọa độ WGS-84 / UTM 48N' : 'WGS-84 / UTM 48N coordinates'}</span>
        <span className="text-amber-400 font-semibold">
          {filteredSites.length} {lang === 'vi' ? 'Điểm đến' : 'sites'}
        </span>
      </div>
    </div>
  );
};
