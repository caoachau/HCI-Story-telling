import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin } from 'lucide-react';
import { HERITAGE_SITES, HeritageSite } from '../data/heritageSites';

interface LandmarkCarouselProps {
  selectedSite: HeritageSite;
  onSelectSite: (site: HeritageSite) => void;
  lang: 'vi' | 'en';
  isStoryOpen?: boolean;
  isStoryExpanded?: boolean;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

const shortCategory = (site: HeritageSite, lang: 'vi' | 'en') => {
  const categories: Record<HeritageSite['category'], [string, string]> = {
    'Danh thắng & Sinh thái': ['Cảnh quan', 'Landscape'],
    'Di sản kiến trúc': ['Kiến trúc', 'Architecture'],
    'Làng nghề truyền thống': ['Làng nghề', 'Craft village'],
    'Không gian diễn xướng': ['Văn hóa', 'Culture'],
  };
  return categories[site.category][lang === 'vi' ? 0 : 1];
};

export const LandmarkCarousel: React.FC<LandmarkCarouselProps> = ({
  selectedSite,
  onSelectSite,
  lang,
  isStoryOpen = false,
  isStoryExpanded = false,
  isCollapsed,
  onToggleCollapsed,
}) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const savedScrollLeftRef = useRef(0);
  const dragRef = useRef({ pointerId: -1, startX: 0, startScrollLeft: 0, lastX: 0, lastTime: 0, velocity: 0, moved: false });
  const glideFrameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollState, setScrollState] = useState({ left: 0, max: 0 });

  const updateScrollState = () => {
    const strip = stripRef.current;
    if (!strip) return;
    savedScrollLeftRef.current = strip.scrollLeft;
    setScrollState({
      left: strip.scrollLeft,
      max: Math.max(0, strip.scrollWidth - strip.clientWidth),
    });
  };

  const stopGlide = () => {
    if (glideFrameRef.current !== null) {
      window.cancelAnimationFrame(glideFrameRef.current);
      glideFrameRef.current = null;
    }
  };

  const glideAfterDrag = (pointerVelocity: number) => {
    const strip = stripRef.current;
    if (!strip || Math.abs(pointerVelocity) < 0.08) {
      setIsDragging(false);
      return;
    }
    const start = strip.scrollLeft;
    const max = Math.max(0, strip.scrollWidth - strip.clientWidth);
    const target = Math.min(max, Math.max(0, start - pointerVelocity * 190));
    if (Math.abs(target - start) < 1) {
      setIsDragging(false);
      return;
    }
    const duration = 420;
    let startedAt = 0;
    const step = (time: number) => {
      if (!startedAt) startedAt = time;
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      strip.scrollLeft = start + (target - start) * eased;
      if (progress < 1) {
        glideFrameRef.current = window.requestAnimationFrame(step);
      } else {
        glideFrameRef.current = null;
        setIsDragging(false);
      }
    };
    glideFrameRef.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollLeft = savedScrollLeftRef.current;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(strip);
    updateScrollState();
    return () => {
      observer.disconnect();
      if (glideFrameRef.current !== null) window.cancelAnimationFrame(glideFrameRef.current);
    };
  }, [isCollapsed]);

  useEffect(() => {
    const strip = stripRef.current;
    const card = strip?.querySelector<HTMLElement>(`[data-site-id="${selectedSite.id}"]`);
    if (!strip || !card) return;
    const stripRect = strip.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    if (cardRect.left < stripRect.left || cardRect.right > stripRect.right) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [selectedSite.id, isCollapsed]);

  const moveByCard = (direction: -1 | 1) => {
    const strip = stripRef.current;
    const card = strip?.querySelector<HTMLElement>('.landmark-carousel-card');
    if (!strip || !card) return;
    stopGlide();
    setIsDragging(false);
    const gap = Number.parseFloat(window.getComputedStyle(strip).columnGap) || 0;
    strip.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Touchscreens use the browser's momentum scrolling. Mouse and pen drag
    // are handled here so a click on a card still selects it normally.
    if (event.pointerType === 'touch') {
      stopGlide();
      setIsDragging(false);
      return;
    }
    if (event.button !== 0) return;
    const strip = stripRef.current;
    if (!strip) return;
    stopGlide();
    setIsDragging(false);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: strip.scrollLeft,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      moved: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const strip = stripRef.current;
    const drag = dragRef.current;
    if (!strip || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (!drag.moved && Math.abs(distance) > 6) {
      drag.moved = true;
      strip.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }
    if (drag.moved) {
      const elapsed = Math.max(1, event.timeStamp - drag.lastTime);
      const velocity = (event.clientX - drag.lastX) / elapsed;
      drag.velocity = drag.velocity * 0.55 + velocity * 0.45;
      drag.lastX = event.clientX;
      drag.lastTime = event.timeStamp;
      strip.scrollLeft = drag.startScrollLeft - distance;
    }
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const strip = stripRef.current;
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    if (strip?.hasPointerCapture(event.pointerId)) strip.releasePointerCapture(event.pointerId);
    suppressClickRef.current = drag.moved;
    dragRef.current.pointerId = -1;
    if (drag.moved && !cancelled) glideAfterDrag(event.timeStamp - drag.lastTime > 85 ? 0 : drag.velocity);
    else setIsDragging(false);
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  };

  const selectedIndex = HERITAGE_SITES.findIndex((site) => site.id === selectedSite.id) + 1;

  const toggleCollapsed = () => {
    stopGlide();
    setIsDragging(false);
    onToggleCollapsed();
  };

  return (
    <nav
      className={`landmark-carousel absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto ${isCollapsed ? 'is-collapsed' : ''} ${isStoryExpanded ? 'z-[80]' : isStoryOpen ? 'z-[50]' : 'z-20'}`}
      aria-label={lang === 'vi' ? 'Chọn cột mốc di sản' : 'Choose a heritage site'}
    >
      <div className="landmark-carousel-header">
        <div className="landmark-carousel-heading">
          <span className="landmark-carousel-heading-icon"><MapPin aria-hidden="true" size={15} /></span>
          <span>{lang === 'vi' ? 'Hành trình di sản' : 'Heritage journey'}</span>
          <span className="landmark-carousel-total">{HERITAGE_SITES.length.toString().padStart(2, '0')}</span>
        </div>
        <div className="landmark-carousel-actions">
          {!isCollapsed && (
            <>
              <span className="landmark-carousel-counter">
                {selectedIndex.toString().padStart(2, '0')} <span>/ {HERITAGE_SITES.length.toString().padStart(2, '0')}</span>
              </span>
              <button type="button" onClick={() => moveByCard(-1)} disabled={scrollState.left <= 1} aria-label={lang === 'vi' ? 'Xem cột mốc trước' : 'Previous sites'}>
                <ChevronLeft aria-hidden="true" size={17} />
              </button>
              <button type="button" onClick={() => moveByCard(1)} disabled={scrollState.left >= scrollState.max - 1} aria-label={lang === 'vi' ? 'Xem cột mốc tiếp' : 'Next sites'}>
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </>
          )}
          <button type="button" className="landmark-carousel-toggle" onClick={toggleCollapsed} aria-expanded={!isCollapsed} aria-label={isCollapsed ? (lang === 'vi' ? 'Hiện các cột mốc' : 'Show heritage sites') : (lang === 'vi' ? 'Thu gọn các cột mốc' : 'Hide heritage sites')}>
            <span>{isCollapsed ? (lang === 'vi' ? 'Mở' : 'Show') : (lang === 'vi' ? 'Thu gọn' : 'Hide')}</span>
            {isCollapsed ? <ChevronUp aria-hidden="true" size={15} /> : <ChevronDown aria-hidden="true" size={15} />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
      <div
        ref={stripRef}
        className={`landmark-strip landmark-strip-three ${isDragging ? 'is-dragging' : ''}`}
        role="group"
        aria-label={lang === 'vi' ? 'Các cột mốc' : 'Heritage sites'}
        onScroll={updateScrollState}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={(event) => finishDrag(event, true)}
        onClickCapture={(event) => {
          if (suppressClickRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        {HERITAGE_SITES.map((site, index) => {
          const isSelected = site.id === selectedSite.id;
          return (
            <button
              key={site.id}
              type="button"
              data-site-id={site.id}
              onClick={() => onSelectSite(site)}
              aria-pressed={isSelected}
              draggable={false}
              className={`landmark-carousel-card ${isSelected ? 'is-selected' : ''}`}
            >
              <span className="landmark-carousel-image-wrap">
                <img src={site.heroImage} alt="" loading="lazy" draggable={false} />
              </span>
              <span className="landmark-carousel-copy">
                <span className="landmark-carousel-meta">
                  <span>{(index + 1).toString().padStart(2, '0')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{shortCategory(site, lang)}</span>
                </span>
                <span className="landmark-carousel-name">{lang === 'vi' ? site.name : site.englishName}</span>
              </span>
              <span className="landmark-carousel-active-mark" aria-hidden="true" />
            </button>
          );
        })}
      </div>
      )}
    </nav>
  );
};
