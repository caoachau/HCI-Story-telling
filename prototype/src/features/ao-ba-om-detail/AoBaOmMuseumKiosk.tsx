import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Compass,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Globe,
  Accessibility,
  X,
  ArrowUp,
  MapPin,
  Calendar,
  Users,
  Award,
  BookOpen,
} from 'lucide-react';
import type { AoLanguage, SiteZone } from './types';
import { Section1EditorialHero } from './Section1EditorialHero';
import { Section2InteractiveSiteMap } from './Section2InteractiveSiteMap';
import { Section3ProgressiveTimeline } from './Section3ProgressiveTimeline';
import { Section4LivingCommunityExhibition } from './Section4LivingCommunityExhibition';
import { Section5LegacyEnduringValues } from './Section5LegacyEnduringValues';
import { Panorama360Modal } from '../../components/Panorama360Modal';
import { QRCodeModal } from '../../components/QRCodeModal';
import { HERITAGE_SITES } from '../../data/heritageSites';
import { soundscape } from '../../services/soundscape';
import { initLenis, destroyLenis } from './motion/useMotion';
import './motion/cinematic.css';

gsap.registerPlugin(ScrollTrigger);

interface AoBaOmMuseumKioskProps {
  initialLang?: AoLanguage;
  onClose?: () => void;
  isStandalone?: boolean;
}

export const AoBaOmMuseumKiosk: React.FC<AoBaOmMuseumKioskProps> = ({
  initialLang = 'vi',
  onClose,
  isStandalone = false,
}) => {
  const [lang, setLang] = useState<AoLanguage>(initialLang);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReduceMotion, setIsReduceMotion] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [activePanoramaZone, setActivePanoramaZone] = useState<SiteZone | null>(null);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('section-1-overview');
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const aoBaOmSite = HERITAGE_SITES.find((s) => s.id === 'ao-ba-om') || HERITAGE_SITES[0];

  // ─── Init Lenis smooth scroll ───
  useEffect(() => {
    if (isReduceMotion) return;
    const lenis = initLenis();
    return () => destroyLenis();
  }, [isReduceMotion]);

  // ─── Scroll progress bar + FAB visibility + auto-hide header ───
  useEffect(() => {
    let frame: number | null = null;
    const updateScroll = () => {
      frame = null;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
      // Updating this one style avoids rerendering all five sections per frame.
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${progress})`;
      setHasScrolled(scrollTop > 0);
      setShowFab(scrollTop > window.innerHeight * 0.5);
      
      // Auto-hide header on scroll down, show on scroll up
      if (scrollTop > lastScrollY.current && scrollTop > 200) {
        setHeaderVisible(false);
      } else if (scrollTop < lastScrollY.current || scrollTop <= 200) {
        setHeaderVisible(true);
      }
      lastScrollY.current = scrollTop;
    };

    const handleScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    // Lazy image loading can change the document height without a resize event.
    const layoutObserver = new ResizeObserver(handleScroll);
    layoutObserver.observe(document.body);
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      layoutObserver.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  // ─── Section overlap transitions (GSAP) ───
  useEffect(() => {
    if (isReduceMotion) return;

    const sections = document.querySelectorAll('.kiosk-section');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, i) => {
      if (i === sections.length - 1) return; // Don't overlap the last section

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(section, {
            scale: 1 - p * 0.06,
            filter: `brightness(${1 - p * 0.3})`,
          });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach(t => t.kill());
  }, [isReduceMotion]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Soundscape Handler
  const toggleSound = () => {
    const playing = soundscape.toggle('temple_bell');
    setIsSoundPlaying(playing);
  };

  // Smooth Scroll Helper
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: isReduceMotion ? 'auto' : 'smooth' });
    }
  };

  // Intersection observer to track active section while scrolling
  useEffect(() => {
    const sectionIds = [
      'section-1-overview',
      'section-2-map',
      'section-3-timeline',
      'section-4-community',
      'section-5-legacy',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { threshold: [0.3] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'section-1-overview', icon: BookOpen, labelVi: '1. Tổng quan', labelEn: '1. Overview' },
    { id: 'section-2-map', icon: MapPin, labelVi: '2. Bản đồ', labelEn: '2. Site Map' },
    { id: 'section-3-timeline', icon: Calendar, labelVi: '3. Thời gian', labelEn: '3. Timeline' },
    { id: 'section-4-community', icon: Users, labelVi: '4. Cộng đồng', labelEn: '4. Community' },
    { id: 'section-5-legacy', icon: Award, labelVi: '5. Di sản', labelEn: '5. Legacy' },
  ];

  return (
    <div
      className={`min-h-screen bg-[#07090e] text-[#f4efe6] font-sans antialiased relative selection:bg-amber-500/30 selection:text-amber-200 ${
        isLargeText ? 'text-lg' : ''
      } ${isHighContrast ? 'contrast-125 brightness-110' : ''}`}
    >
      {/* ═══ SCROLL PROGRESS BAR ═══ */}
      <div
        ref={progressBarRef}
        className="kiosk-scroll-progress"
      />

      {/* ═══ FILM GRAIN OVERLAY ═══ */}
      <div className="kiosk-grain" />

      {/* ═══ AMBIENT NEON MIST ═══ */}
      <div className="kiosk-neon-mist" />

      {/* ═══ HEADER: Cinematic Glassmorphism Navigation ═══ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 kiosk-header-bar px-4 sm:px-8 py-3 flex items-center justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{ top: hasScrolled ? '3px' : '0' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40 transition-transform duration-300 hover:scale-110">
            <Compass className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/80 font-bold flex items-center gap-1.5">
              <span>{lang === 'vi' ? 'BÀN TƯƠNG TÁC BẢO TÀNG' : 'MUSEUM KIOSK DISPLAY'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ animation: 'kiosk-tag-pulse 2s ease-in-out infinite' }} />
            </div>
            <h1 className="text-sm sm:text-base font-serif font-bold text-white/95 tracking-wide">
              {lang === 'vi' ? 'Ao Bà Om · Kể Chuyện Số' : 'Ao Ba Om · Digital Story'}
            </h1>
          </div>
        </div>

        {/* 5-Section Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-0.5 p-1 bg-white/5 border border-white/6 rounded-2xl text-xs font-mono backdrop-blur-lg">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSectionId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border text-xs transition-all duration-300 cursor-pointer ${
              isSoundPlaying
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/10'
                : 'bg-white/5 border-white/8 text-stone-400 hover:bg-white/8 hover:text-white'
            }`}
            title={lang === 'vi' ? 'Âm thanh' : 'Sound'}
          >
            {isSoundPlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/8 hover:border-amber-400/30 text-xs font-mono text-stone-300 transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:text-white"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          <button
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className={`p-2.5 rounded-xl border text-xs transition-all duration-300 cursor-pointer ${
              isAccessibilityOpen
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                : 'bg-white/5 border-white/8 text-stone-400 hover:bg-white/8'
            }`}
          >
            <Accessibility className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-amber-400/30 text-stone-400 hover:text-white transition-all duration-300 cursor-pointer hidden sm:flex items-center justify-center"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="kiosk-magnetic-btn kiosk-magnetic-btn--primary !py-2 !px-3 !text-xs ml-1"
            >
              <X className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Đóng' : 'Close'}</span>
            </button>
          )}
        </div>
      </header>

      {/* ═══ ACCESSIBILITY POPOVER ═══ */}
      {isAccessibilityOpen && (
        <div className="fixed top-20 right-6 z-50 w-72 kiosk-glass p-5 space-y-4" style={{ animation: 'fadeInDown 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              {lang === 'vi' ? 'Trợ năng Kiosk' : 'Accessibility'}
            </span>
            <button onClick={() => setIsAccessibilityOpen(false)} className="text-stone-500 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { label: lang === 'vi' ? 'Cỡ chữ lớn' : 'Larger text', active: isLargeText, toggle: () => setIsLargeText(!isLargeText) },
              { label: lang === 'vi' ? 'Tương phản cao' : 'High contrast', active: isHighContrast, toggle: () => setIsHighContrast(!isHighContrast) },
              { label: lang === 'vi' ? 'Giảm chuyển động' : 'Reduce motion', active: isReduceMotion, toggle: () => setIsReduceMotion(!isReduceMotion) },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.toggle}
                className="flex items-center justify-between w-full p-3 rounded-xl bg-white/4 hover:bg-white/8 border border-white/6 cursor-pointer text-xs font-mono transition-all duration-200"
              >
                <span className="text-stone-300">{item.label}</span>
                <span className={`font-bold ${item.active ? 'text-amber-400' : 'text-stone-600'}`}>
                  {item.active ? (lang === 'vi' ? 'BẬT' : 'ON') : (lang === 'vi' ? 'TẮT' : 'OFF')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ MAIN SECTIONS WITH OVERLAP TRANSITIONS ═══ */}
      <main className="w-full">
        <Section1EditorialHero
          lang={lang}
          onExploreMap={() => scrollToSection('section-2-map')}
          onExploreTimeline={() => scrollToSection('section-3-timeline')}
          isSoundPlaying={isSoundPlaying}
          onToggleSound={toggleSound}
        />

        <Section2InteractiveSiteMap
          lang={lang}
          onOpenPanorama={(zone) => setActivePanoramaZone(zone)}
        />

        <Section3ProgressiveTimeline lang={lang} />

        <Section4LivingCommunityExhibition lang={lang} />

        <Section5LegacyEnduringValues
          lang={lang}
          onOpenQRCode={() => setIsQRCodeOpen(true)}
          onReturnToMap={() => {
            if (onClose) onClose();
            else scrollToSection('section-1-overview');
          }}
        />
      </main>

      {/* ═══ BACK TO TOP FAB ═══ */}
      <button
        onClick={() => scrollToSection('section-1-overview')}
        className={`kiosk-fab-top transition-all duration-500 ${
          showFab ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        title="Về đầu trang"
      >
        <ArrowUp className="w-5 h-5 font-bold" />
      </button>

      {/* ═══ MODALS ═══ */}
      {activePanoramaZone && (
        <Panorama360Modal
          lang={lang}
          siteName={lang === 'vi' ? activePanoramaZone.name.vi : activePanoramaZone.name.en}
          photoUrl={activePanoramaZone.image}
          caption={lang === 'vi' ? activePanoramaZone.summary.vi : activePanoramaZone.summary.en}
          onClose={() => setActivePanoramaZone(null)}
        />
      )}

      {isQRCodeOpen && (
        <QRCodeModal
          site={aoBaOmSite}
          lang={lang}
          onClose={() => setIsQRCodeOpen(false)}
        />
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
