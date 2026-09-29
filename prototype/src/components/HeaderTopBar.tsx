import React from 'react';
import {
  Expand,
  Shrink,
  Home,
  ArrowLeft,
  Volume2,
  VolumeX,
  Info,
  Search,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  MoonStar,
} from 'lucide-react';
import type { LocalWeather } from '../services/localWeather';
import { weatherDescription } from '../services/localWeather';

interface HeaderTopBarProps {
  onHomeClick: () => void;
  onBackClick: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
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
  weather?: LocalWeather | null;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  onHomeClick,
  onBackClick,
  selectedCategory,
  onSelectCategory,
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
  weather,
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

      {/* Zone 2: Curatorial category filter and local weather */}
      <div className="hidden lg:flex items-center gap-3">
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
        <WeatherPill lang={lang} weather={weather} />
      </div>

      {/* Zone 3: Functional Interactive Actions (Sound, List Drawer, Lang, Kiosk) */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
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
          {isKioskFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

function WeatherPill({ lang, weather }: { lang: 'vi' | 'en'; weather?: LocalWeather | null }) {
  const code = weather?.weatherCode ?? 0;
  const WeatherIcon = !weather
    ? CloudSun
    : code >= 95
      ? CloudLightning
      : code >= 51
        ? CloudRain
        : code >= 3
          ? Cloud
          : weather.isDay
            ? (code <= 1 ? Sun : CloudSun)
            : MoonStar;
  const temperature = weather ? `${weather.temperature}°` : '—';
  const description = weatherDescription(code, lang);

  return (
    <div
      className="flex min-h-[40px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-stone-200 shadow-inner"
      title={`${description} · ${lang === 'vi' ? 'Trà Vinh, Việt Nam' : 'Trà Vinh, Vietnam'}`}
      aria-label={`${temperature} · ${lang === 'vi' ? 'Trà Vinh, Việt Nam' : 'Trà Vinh, Vietnam'}`}
    >
      <WeatherIcon className="h-4 w-4 text-amber-300" aria-hidden="true" />
      <span className="whitespace-nowrap font-medium">{temperature} | {lang === 'vi' ? 'Trà Vinh, Việt Nam' : 'Trà Vinh, Vietnam'}</span>
    </div>
  );
}
