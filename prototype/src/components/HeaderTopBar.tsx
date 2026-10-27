import React, { useLayoutEffect, useRef } from 'react';
import { Expand, Shrink, Home, ArrowLeft, Volume2, VolumeX, Info, Search, Sun, CloudSun, Cloud, CloudRain, CloudLightning, MoonStar } from 'lucide-react';
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
  weather?: LocalWeather | null;
}

export const HeaderTopBar: React.FC<HeaderTopBarProps> = ({
  onHomeClick, onBackClick, selectedCategory, onSelectCategory, isSoundPlaying,
  onToggleSound, lang, onToggleLang, isKioskFullscreen, onToggleFullscreen,
  onOpenAbout, hasActiveSelection, onOpenSearch, weather,
}) => {
  const headerRef = useRef<HTMLElement>(null);
  // Measure the available map space, without changing the map canvas or camera.
  useLayoutEffect(() => {
    const header = headerRef.current, viewport = header?.parentElement;
    const tools = header?.querySelector<HTMLElement>('.heritage-header-tools');
    if (!header || !viewport || !tools) return;
    const measure = () => {
      const width = header.clientWidth;
      viewport.dataset.mapChromeLayout = width >= 1120 ? 'wide' : width >= 620 ? 'compact' : 'narrow';
      viewport.style.setProperty('--map-header-bottom', `${header.offsetTop + header.offsetHeight}px`);
      viewport.style.setProperty('--map-tools-width', `${tools.getBoundingClientRect().width}px`);
      viewport.style.setProperty('--map-tools-bottom', `${header.offsetTop + tools.offsetTop + tools.offsetHeight}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(tools);
    measure();
    return () => {
      observer.disconnect();
      delete viewport.dataset.mapChromeLayout;
      viewport.style.removeProperty('--map-header-bottom');
      viewport.style.removeProperty('--map-tools-width');
      viewport.style.removeProperty('--map-tools-bottom');
    };
  }, []);

  const categories = [
    { id: 'all', label: lang === 'vi' ? 'Tất cả' : 'All sites' },
    { id: 'khmer', label: lang === 'vi' ? 'Văn hóa Khmer' : 'Khmer culture' },
    { id: 'eco', label: lang === 'vi' ? 'Du lịch cộng đồng' : 'Community tourism' },
    { id: 'history', label: lang === 'vi' ? 'Di tích lịch sử' : 'Historic sites' },
  ];
  const soundLabel = isSoundPlaying
    ? (lang === 'vi' ? 'Tắt âm thanh di sản' : 'Turn heritage audio off')
    : (lang === 'vi' ? 'Bật âm thanh không gian di sản' : 'Turn ambient heritage audio on');
  const homeLabel = lang === 'vi' ? 'Về toàn cảnh di sản' : 'Return to overview';
  const backLabel = lang === 'vi' ? 'Quay lại toàn cảnh' : 'Back to map';
  const searchLabel = lang === 'vi' ? 'Tìm kiếm di sản' : 'Search sites';
  const aboutLabel = lang === 'vi' ? 'Thông tin dự án' : 'About the project';
  const fullLabel = lang === 'vi' ? 'Toàn màn hình' : 'Toggle fullscreen';

  return (
    <header ref={headerRef} className="heritage-header">
      <div className="heritage-header-row">
        <div className="heritage-brand-group">
          <button type="button" className="map-icon-button" onClick={onHomeClick} title={homeLabel} aria-label={homeLabel}><Home aria-hidden="true" /></button>
          <button type="button" className="map-icon-button heritage-back" onClick={onBackClick} disabled={!hasActiveSelection} title={backLabel} aria-label={backLabel}><ArrowLeft aria-hidden="true" /></button>
          <a className="heritage-wordmark" href="#" onClick={event => { event.preventDefault(); onHomeClick(); }}>
            <strong>{lang === 'vi' ? 'Ký ức bản địa' : 'Local memories'}</strong>
            <span>{lang === 'vi' ? 'Di sản Trà Vinh' : 'Trà Vinh heritage'}</span>
          </a>
        </div>
        <nav className="heritage-category-tabs" aria-label={lang === 'vi' ? 'Lọc chủ đề di sản' : 'Filter heritage themes'}>
          {categories.map(category => (
            <button key={category.id} type="button" data-category={category.id} aria-pressed={selectedCategory === category.id}
              onClick={() => onSelectCategory(category.id)}>{category.label}</button>
          ))}
        </nav>
        <div className="heritage-header-tools">
          <WeatherPill lang={lang} weather={weather} />
          <div className="heritage-utility-actions" role="group" aria-label={lang === 'vi' ? 'Tiện ích' : 'Utilities'}>
            {onOpenSearch && <button type="button" className="map-icon-button" onClick={onOpenSearch} title={searchLabel} aria-label={searchLabel}><Search aria-hidden="true" /></button>}
            <button type="button" className="map-icon-button" onClick={onToggleSound} title={soundLabel} aria-label={soundLabel} aria-pressed={isSoundPlaying}>
              {isSoundPlaying ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
            </button>
            <button type="button" className="map-icon-button heritage-language" onClick={onToggleLang}
              title={lang === 'vi' ? 'Chuyển sang English' : 'Chuyển sang tiếng Việt'}
              aria-label={lang === 'vi' ? 'Chuyển sang English' : 'Switch to Vietnamese'}>{lang === 'vi' ? 'VI' : 'EN'}</button>
            <button type="button" className="map-icon-button" onClick={onOpenAbout} title={aboutLabel} aria-label={aboutLabel}><Info aria-hidden="true" /></button>
            <button type="button" className="map-icon-button" onClick={onToggleFullscreen} title={fullLabel} aria-label={fullLabel} aria-pressed={isKioskFullscreen}>
              {isKioskFullscreen ? <Shrink aria-hidden="true" /> : <Expand aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

function WeatherPill({ lang, weather }: { lang: 'vi' | 'en'; weather?: LocalWeather | null }) {
  const code = weather?.weatherCode ?? 0;
  const WeatherIcon = !weather ? CloudSun : code >= 95 ? CloudLightning : code >= 51 ? CloudRain
    : code >= 3 ? Cloud : weather.isDay ? (code <= 1 ? Sun : CloudSun) : MoonStar;
  const temperature = weather ? `${weather.temperature}°` : '—';
  const place = lang === 'vi' ? 'Trà Vinh, Việt Nam' : 'Trà Vinh, Vietnam';
  const label = weather ? `${temperature} · ${weatherDescription(code, lang)} · ${place}`
    : `${place} · ${lang === 'vi' ? 'Chưa có dữ liệu thời tiết' : 'Weather unavailable'}`;
  return (
    <div className="heritage-weather" title={label} aria-label={label}>
      <WeatherIcon aria-hidden="true" /><strong>{temperature}</strong><span>{place}</span>
    </div>
  );
}
