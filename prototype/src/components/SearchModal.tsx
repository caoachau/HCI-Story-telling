import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { HERITAGE_SITES, HeritageSite } from '../data/heritageSites';
import { formatCoordinates } from '../utils/geoCoordinates';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSite: (site: HeritageSite) => void;
  lang: 'vi' | 'en';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSite,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categoryName = (category: HeritageSite['category']) => {
    if (lang === 'vi') return category;
    const labels: Record<HeritageSite['category'], string> = {
      'Làng nghề truyền thống': 'Traditional craft village',
      'Di sản kiến trúc': 'Architectural heritage',
      'Danh thắng & Sinh thái': 'Scenic and ecological site',
      'Không gian diễn xướng': 'Performance space',
    };
    return labels[category];
  };

  const results = useMemo(() => {
    if (!searchTerm.trim()) return HERITAGE_SITES;
    const term = searchTerm.toLowerCase();
    return HERITAGE_SITES.filter(
      (site) =>
        site.name.toLowerCase().includes(term) ||
        site.englishName.toLowerCase().includes(term) ||
        site.province.toLowerCase().includes(term) ||
        site.category.toLowerCase().includes(term) ||
        site.tagline.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:pt-20 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#121622] border border-amber-500/40 rounded-3xl p-5 shadow-2xl relative space-y-4">
        {/* Search input header */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'vi'
                ? 'Tìm kiếm địa danh di sản, chùa chiền, làng nghề, sinh thái...'
                : 'Search heritage sites, pagodas, villages, ecology...'
            }
            className="flex-1 bg-transparent text-stone-100 placeholder-stone-500 text-sm focus:outline-none font-sans"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-stone-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="p-8 text-center text-stone-500 font-mono text-xs">
              {lang === 'vi' ? 'Không tìm thấy địa điểm di sản phù hợp' : 'No matching heritage sites found'}
            </div>
          ) : (
            results.map((site) => {
              const coords = formatCoordinates(site.lat, site.lng);
              return (
                <div
                  key={site.id}
                  onClick={() => {
                    onSelectSite(site);
                    onClose();
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-white/5 cursor-pointer transition-all group"
                >
                  <img
                    src={site.heroImage}
                    alt={site.name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-serif font-bold text-amber-100 group-hover:text-amber-300 transition-colors truncate">
                        {lang === 'vi' ? site.name : site.englishName}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                        {categoryName(site.category)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{site.province}</p>
                    <span className="text-[10px] font-mono text-stone-500">{coords.decimal}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
