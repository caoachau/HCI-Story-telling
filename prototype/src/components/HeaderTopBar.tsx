import React from 'react';
import {
  Maximize2,
  Minimize2,
  Home,
  ArrowLeft,
  Volume2,
  VolumeX,
  Globe,
  Map as MapIcon,
  Layers,
  Sparkles,
  Info,
  List,
  Search,
  Eye,
} from 'lucide-react';

interface HeaderTopBarProps {
  onHomeClick: () => void;
  onBackClick: () => void;
  viewMode: '3d' | '2d';
  onToggleViewMode: (mode: '3d' | '2d') => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isListDrawerOpen: boolean;
  onToggleListDrawer: () => void;
  isSoundPlaying: boolean;
  onToggleSound: () => void;
  lang: 'vi' | 'en';
  onToggleLang: () => void;
  isKioskFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAbout: () => void;
  hasActiveSelection: boolean;
  onOpenSearch?: () => void;
  isReduceMotion?: boolean;
  onToggleReduceMotion?: () => void;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  onHomeClick,
  onBackClick,
  viewMode,
  onToggleViewMode,
  selectedCategory,
  onSelectCategory,
  isListDrawerOpen,
  onToggleListDrawer,
  isSoundPlaying,
  onToggleSound,
  lang,
  onToggleLang,
  isKioskFullscreen,
  onToggleFullscreen,
  onOpenAbout,
  hasActiveSelection,
  onOpenSearch,
  isReduceMotion,
  onToggleReduceMotion,
}) => {
  const categories = [
    { id: 'all', label: lang === 'vi' ? 'Tất Cả' : 'All Sites' },
    { id: 'khmer', label: lang === 'vi' ? 'Văn Hóa Khmer' : 'Khmer Culture' },
    { id: 'eco', label: lang === 'vi' ? 'Du Lịch Cộng Đồng' : 'Community Tourism' },
    { id: 'history', label: lang === 'vi' ? 'Di Tích Lịch Sử' : 'Historical Sites' },
  ];

  return (
    <header className="w-full h-16 bg-[#0a0c11]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-6 flex items-center justify-between z-40 select-none">
      {/* Zone 1: Brand & Core Navigation Controls (Home, Back) */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Home Button */}
        <button
          onClick={onHomeClick}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-amber-300 transition-colors border border-white/10 flex items-center justify-center min-w-[40px] min-h-[40px]"
          title={lang === 'vi' ? 'Về toàn cảnh di sản' : 'Return to Overview'}
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Back Button */}
        <button
          onClick={onBackClick}
          disabled={!hasActiveSelection}
          className={`p-2.5 rounded-xl transition-colors border flex items-center justify-center min-w-[40px] min-h-[40px] ${
            hasActiveSelection
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
              : 'bg-white/5 border-white/5 text-stone-600 cursor-not-allowed'
          }`}
          title={lang === 'vi' ? 'Quay lại toàn cảnh' : 'Back to map'}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

        {/* Brand Single Text Element Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onHomeClick();
          }}
          className="text-base md:text-lg font-serif font-bold tracking-tight text-amber-100 hover:text-amber-200 transition-colors whitespace-nowrap truncate max-w-[200px] md:max-w-none"
        >
          {lang === 'vi' ? 'Diễn Giải Di Sản Du Lịch Cộng Đồng' : 'Community Heritage Interpretation'}
        </a>
      </div>

      {/* Zone 2: Curatorial Category Filter & 2D/3D Mode (Centered, clean segmented control) */}
      <div className="hidden lg:flex items-center gap-3">
        {/* 2D / 3D Mode Switcher */}
        <div className="bg-[#121620] p-1 rounded-xl border border-white/10 flex items-center shadow-inner">
          <button
            onClick={() => onToggleViewMode('3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === '3d'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '3D Sa Bàn Số' : '3D Terrain'}</span>
          </button>
          <button
            onClick={() => onToggleViewMode('2d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
              viewMode === '2d'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '2D Mặt Bằng' : '2D Map'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="bg-[#121620] p-1 rounded-xl border border-white/10 flex items-center shadow-inner">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone 3: Functional Interactive Actions (Sound, List Drawer, Lang, Kiosk) */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
        {/* Mobile 2D/3D toggle */}
        <button
          onClick={() => onToggleViewMode(viewMode === '3d' ? '2d' : '3d')}
          className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 min-w-[40px] min-h-[40px] flex items-center justify-center text-xs font-mono font-bold text-amber-400"
          title={lang === 'vi' ? 'Chuyển chế độ 2D / 3D' : 'Switch between 2D and 3D'}
        >
          {viewMode === '3d' ? '3D' : '2D'}
        </button>

        {/* Search Modal Trigger */}
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-amber-300 transition-colors border border-white/10 flex items-center justify-center min-w-[40px] min-h-[40px]"
            title={lang === 'vi' ? 'Tìm kiếm di sản' : 'Search Sites'}
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Landmark List Drawer Toggle */}
        <button
          onClick={onToggleListDrawer}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-1.5 min-h-[40px] ${
            isListDrawerOpen
              ? 'bg-amber-600 text-stone-950 border-amber-400 font-semibold shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border-white/10'
          }`}
          title={lang === 'vi' ? 'Danh sách 7 địa điểm' : 'Site Directory'}
        >
          <List className="w-4 h-4" />
          <span className="hidden md:inline">{lang === 'vi' ? 'Điểm Đến' : 'Sites'}</span>
        </button>

        {/* Ambient Soundscape Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl transition-all border min-w-[40px] min-h-[40px] flex items-center justify-center ${
            isSoundPlaying
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 animate-pulse'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-400 hover:text-stone-200'
          }`}
          title={isSoundPlaying
            ? (lang === 'vi' ? 'Tắt âm thanh di sản' : 'Turn heritage audio off')
            : (lang === 'vi' ? 'Bật âm thanh không gian di sản' : 'Turn ambient heritage audio on')}
        >
          {isSoundPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Language Switch */}
        <button
          onClick={onToggleLang}
          className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-amber-300 text-xs font-mono font-semibold transition-all min-h-[40px] flex items-center justify-center"
          title={lang === 'vi' ? 'Chuyển sang English' : 'Switch to Vietnamese'}
        >
          {lang === 'vi' ? 'VI' : 'EN'}
        </button>

        {/* About Project Modal */}
        <button
          onClick={onOpenAbout}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-amber-300 transition-colors min-w-[40px] min-h-[40px] hidden sm:flex items-center justify-center"
          title={lang === 'vi' ? 'Thông tin đề tài nghiên cứu diễn giải di sản' : 'About the heritage interpretation project'}
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Kiosk Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          title={lang === 'vi' ? 'Toàn màn hình kiosk triển lãm' : 'Toggle exhibition kiosk fullscreen'}
        >
          {isKioskFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
