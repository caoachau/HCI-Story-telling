import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { HERITAGE_SITES, type HeritageSite } from '../data/heritageSites';
import { calculateDistanceKm } from '../utils/geoCoordinates';
import { isSiteInCategory } from '../data/siteCategories';

interface LandmarkCarouselProps {
  selectedSite: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  lang: 'vi' | 'en';
  isStoryOpen?: boolean;
  isStoryExpanded?: boolean;
  isCollapsed: boolean;
  activeCategory?: string;
}

const labels: Record<string, { vi: string; en: string; compact: { vi: string; en: string } }> = {
  'ao-ba-om': { vi: 'Danh thắng Ao Bà Om', en: 'Ba Om Pond', compact: { vi: 'Ao Bà Om', en: 'Ba Om Pond' } },
  'chua-ang': { vi: 'Chùa Âng (Angkor Rajaborey)', en: 'Ang Pagoda', compact: { vi: 'Chùa Âng', en: 'Ang Pagoda' } },
  'bao-tang-khmer': { vi: 'Bảo tàng Văn hóa Khmer', en: 'Khmer Culture Museum', compact: { vi: 'Bảo tàng Khmer', en: 'Khmer Museum' } },
  'chua-hang': { vi: 'Chùa Hang (Kompongnicrôth)', en: 'Hang Pagoda', compact: { vi: 'Chùa Hang', en: 'Hang Pagoda' } },
  'den-tho-bac': { vi: 'Đền thờ Bác Hồ Trà Vinh', en: 'Ho Chi Minh Memorial', compact: { vi: 'Đền thờ Bác Hồ', en: 'Ho Chi Minh' } },
  'con-chim': { vi: 'Du lịch cộng đồng Cồn Chim', en: 'Con Chim Community Tourism', compact: { vi: 'Cồn Chim', en: 'Con Chim' } },
  'bien-ba-dong': { vi: 'Biển Ba Động', en: 'Ba Dong Beach', compact: { vi: 'Ba Động', en: 'Ba Dong Beach' } },
};

export const LandmarkCarousel: React.FC<LandmarkCarouselProps> = ({
  selectedSite, onSelectSite, lang, isStoryOpen = false, isStoryExpanded = false,
  isCollapsed, activeCategory = 'all',
}) => {
  const dockRef = useRef<HTMLElement>(null);
  const isNearby = isStoryOpen && !isStoryExpanded;
  const available = useMemo(() => HERITAGE_SITES.filter(site => isSiteInCategory(site, activeCategory)), [activeCategory]);
  const sites = useMemo(() => {
    if (!isNearby) return available;
    // Keep the active destination and at most two actually nearby places.
    // A remote destination stays alone instead of suggesting a distant site.
    const nearest = available
      .filter(site => site.id !== selectedSite.id)
      .map(site => ({ site, distance: calculateDistanceKm(selectedSite.lat, selectedSite.lng, site.lat, site.lng) }))
      .filter(item => item.distance <= 5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    const ids = new Set([selectedSite.id, ...nearest.map(item => item.site.id)]);
    return available.filter(site => ids.has(site.id));
  }, [isNearby, selectedSite, available]);
  const visibleIds = useMemo(() => new Set(sites.map(site => site.id)), [sites]);

  useLayoutEffect(() => {
    const dock = dockRef.current, viewport = dock?.parentElement;
    if (!dock || !viewport) return;
    const measure = () => viewport.style.setProperty('--map-journey-height', `${dock.offsetHeight}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    measure();
    return () => { observer.disconnect(); viewport.style.removeProperty('--map-journey-height'); };
  }, []);

  const navigateCards = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const cards = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-site-id]:not([hidden])')];
    const index = cards.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    const columns = getComputedStyle(event.currentTarget).gridTemplateColumns.split(' ').length;
    const delta = event.key === 'ArrowUp' ? -columns : event.key === 'ArrowDown' ? columns : event.key === 'ArrowRight' ? 1 : -1;
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1
      : Math.max(0, Math.min(cards.length - 1, index + delta));
    cards[next].focus({ preventScroll: true });
  };

  return (
    <nav id="landmark-sites" ref={dockRef} className={`landmark-carousel ${isCollapsed ? 'is-collapsed' : ''} ${isNearby ? 'is-nearby' : ''} ${isStoryExpanded ? 'z-[80]' : isStoryOpen ? 'z-30' : 'z-20'}`}
      data-landmark-mode={isNearby ? 'nearby' : 'all'}
      aria-hidden={isCollapsed}
      inert={isCollapsed}
      style={{ '--visible-site-count': sites.length } as React.CSSProperties}
      aria-label={lang === 'vi' ? (isNearby ? 'Địa điểm đang xem và các điểm lân cận' : 'Chọn địa điểm di sản') : (isNearby ? 'Selected and nearby heritage sites' : 'Choose a heritage site')}>
      <div className="landmark-strip" role="group" hidden={isCollapsed}
        aria-label={lang === 'vi' ? 'Các địa điểm' : 'Heritage sites'} onKeyDown={navigateCards}>
        {available.map(site => {
          const name = lang === 'vi' ? site.name : site.englishName;
          const label = labels[site.id]?.[lang] ?? name;
          const compactLabel = labels[site.id]?.compact[lang] ?? label;
          return (
            <button key={site.id} type="button" data-site-id={site.id} onClick={() => onSelectSite(site)}
              hidden={!visibleIds.has(site.id)}
              aria-label={name} title={name} aria-pressed={site.id === selectedSite.id} draggable={false}
              className={`landmark-carousel-card ${site.id === selectedSite.id ? 'is-selected' : ''}`}>
              <span className="landmark-carousel-image-wrap"><img src={site.heroImage} alt="" loading="eager" fetchPriority="low" decoding="async" draggable={false} onLoad={event => { void event.currentTarget.decode().catch(() => {}); }} /></span>
              <span className="landmark-carousel-name" aria-hidden="true">{label}</span>
              <span className="landmark-carousel-short-name" aria-hidden="true">{compactLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
