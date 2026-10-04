import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Compass, MapPin, Sparkles, ArrowDown, ChevronRight, Award, Play, Pause } from 'lucide-react';
import { AO_BA_OM_OVERVIEW } from './aoBaOm5PartsData';
import { useHeroEntrance, useMagnetic } from './motion/useMotion';
import type { AoLanguage } from './types';

interface Section1EditorialHeroProps {
  lang: AoLanguage;
  onExploreMap: () => void;
  onExploreTimeline?: () => void;
  isSoundPlaying?: boolean;
  onToggleSound?: () => void;
}

export const Section1EditorialHero: React.FC<Section1EditorialHeroProps> = ({
  lang,
  onExploreMap,
  onExploreTimeline,
  isSoundPlaying = false,
  onToggleSound,
}) => {
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const heroRef = useHeroEntrance();
  const spotlightRef = useRef<HTMLDivElement>(null);

  /* ── Cursor spotlight on hero ── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = spotlightRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--spot-x', `${x}%`);
    el.style.setProperty('--spot-y', `${y}%`);
  }, []);

  const toggleNarration = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingNarration) {
        window.speechSynthesis.cancel();
        setIsPlayingNarration(false);
      } else {
        window.speechSynthesis.cancel();
        const text = lang === 'vi' 
          ? AO_BA_OM_OVERVIEW.audioNarration.transcriptVi 
          : AO_BA_OM_OVERVIEW.audioNarration.transcriptEn;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'vi' ? 'vi-VN' : 'en-US';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingNarration(false);
        utterance.onerror = () => setIsPlayingNarration(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingNarration(true);
      }
    }
  };

  const marqueeText = lang === 'vi'
    ? 'DI TÍCH LỊCH SỬ VĂN HÓA CẤP QUỐC GIA  ·  AO BÀ OM  ·  SRAH KU (ស្រះគូ)  ·  TRÀ VINH  ·  KINH – KHMER – HOA  ·  LỄ HỘI OK OM BOK  ·'
    : 'NATIONAL HISTORIC & CULTURAL RELIC  ·  AO BA OM  ·  SRAH KU  ·  TRA VINH  ·  VIET-KHMER-CHINESE HERITAGE  ·  OK OM BOK FESTIVAL  ·';

  return (
    <section
      id="section-1-overview"
      ref={(el) => {
        // Merge refs
        (heroRef as any).current = el;
        (spotlightRef as any).current = el;
      }}
      className="kiosk-section kiosk-spotlight relative min-h-screen flex flex-col justify-between bg-[#07090e] text-[#f4efe6] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* ═══ BACKGROUND LAYER: Hero Image with Parallax ═══ */}
      <div className="absolute inset-0 z-0" data-hero-bg>
        <img
          src={AO_BA_OM_OVERVIEW.heroImage}
          alt={lang === 'vi' ? AO_BA_OM_OVERVIEW.name.vi : AO_BA_OM_OVERVIEW.name.en}
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.55) contrast(1.12) saturate(1.1)' }}
        />
        {/* Cinematic gradients — dark edges, warm center */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_45%,_transparent_30%,_rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* ═══ AMBIENT DECORATION LAYER ═══ */}
      <div className="absolute inset-0 z-[1] pointer-events-none" data-hero-decor>
        {/* Floating warm orb */}
        <div className="kiosk-orb kiosk-orb--warm" style={{ width: 500, height: 500, top: '-10%', left: '-5%' }} />
        {/* Floating cool orb */}
        <div className="kiosk-orb kiosk-orb--cool" style={{ width: 400, height: 400, bottom: '5%', right: '-8%' }} />
      </div>

      {/* ═══ DECORATIVE: Flying Birds Silhouette ═══ */}
      <div className="absolute top-16 right-16 lg:right-28 pointer-events-none opacity-30 z-[2] hidden sm:block" data-hero-decor>
        <svg className="w-40 h-28 text-amber-200/60" viewBox="0 0 160 110" fill="currentColor">
          <path d="M 125,25 Q 133,16 141,25 Q 149,16 157,25 Q 149,20 141,23 Q 133,20 125,25 Z" />
          <path d="M 75,20 Q 85,8 95,20 Q 105,8 115,20 Q 105,14 95,17 Q 85,14 75,20 Z" opacity="0.8" />
          <path d="M 45,45 Q 57,30 69,45 Q 81,30 93,45 Q 81,37 69,41 Q 57,37 45,45 Z" />
        </svg>
      </div>

      {/* ═══ TOP STRIP: Section Tag + Accreditation ═══ */}
      <div className="relative z-10 pt-8 sm:pt-12 px-6 sm:px-12 lg:px-16" data-hero-side>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="kiosk-section-tag">
            <span className="tag-dot" />
            <span>{lang === 'vi' ? 'PHẦN 01 · TỔNG QUAN DI TÍCH' : 'PART 01 · HERITAGE OVERVIEW'}</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-950/30 border border-amber-500/20 text-amber-200/90 text-xs font-serif tracking-wide backdrop-blur-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'vi' ? AO_BA_OM_OVERVIEW.rankTag.vi : AO_BA_OM_OVERVIEW.rankTag.en}</span>
          </div>
        </div>
        <div className="kiosk-divider" />
      </div>

      {/* ═══ MAIN CONTENT: Editorial Grid ═══ */}
      <div className="relative z-10 flex-1 px-6 sm:px-12 lg:px-16 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        
        {/* LEFT: Side Metadata Column */}
        <div className="lg:col-span-4 space-y-6" data-hero-side>
          {/* Coordinates */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-stone-300/90 uppercase bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{AO_BA_OM_OVERVIEW.coordinates}</span>
          </div>

          {/* Geographic overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-amber-400/80 font-semibold">
              {lang === 'vi' ? 'TỔNG QUAN ĐỊA LÝ & QUY MÔ' : 'GEOGRAPHIC OVERVIEW'}
            </h3>
            <p className="text-sm font-serif text-stone-300 leading-relaxed">
              {lang === 'vi' ? AO_BA_OM_OVERVIEW.location.vi : AO_BA_OM_OVERVIEW.location.en}
            </p>
          </div>

          {/* Quick Specs — Glassmorphism cards */}
          <div className="grid grid-cols-2 gap-3" data-hero-side>
            {AO_BA_OM_OVERVIEW.specs.map((spec, idx) => (
              <div
                key={idx}
                className="kiosk-glass p-3 group hover:border-amber-500/30 transition-colors duration-400"
              >
                <span className="block text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1 group-hover:text-amber-400/70 transition-colors">
                  {lang === 'vi' ? spec.label.vi : spec.label.en}
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-amber-100/90 font-serif">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Audio Narration */}
          <div className="pt-1" data-hero-side>
            <button
              onClick={toggleNarration}
              className={`kiosk-magnetic-btn w-full justify-between text-xs ${
                isPlayingNarration
                  ? 'kiosk-magnetic-btn--primary'
                  : 'kiosk-magnetic-btn--ghost'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isPlayingNarration ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-left leading-tight">
                  {isPlayingNarration
                    ? (lang === 'vi' ? 'Đang phát...' : 'Playing...')
                    : (lang === 'vi' ? 'Nghe thuyết minh' : 'Audio Guide')}
                </span>
              </div>
              <span className={`text-[9px] tracking-widest ${isPlayingNarration ? 'text-black/60' : 'text-amber-400/60'}`}>
                AI VOICE
              </span>
            </button>

            {isPlayingNarration && (
              <div className="mt-3 p-3.5 kiosk-glass text-xs text-amber-100/80 font-serif leading-relaxed">
                "{lang === 'vi' ? AO_BA_OM_OVERVIEW.audioNarration.transcriptVi : AO_BA_OM_OVERVIEW.audioNarration.transcriptEn}"
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Oversized Title + Editorial Lead */}
        <div className="lg:col-span-8 space-y-6">
          {/* Khmer folk name tag */}
          <div className="text-sm font-mono tracking-[0.25em] text-amber-400/80 uppercase font-semibold" data-hero-tagline>
            {lang === 'vi' ? AO_BA_OM_OVERVIEW.folkNames.vi : AO_BA_OM_OVERVIEW.folkNames.en}
          </div>

          {/* OVERSIZED BRUTALIST HEADING with line-mask reveal */}
          <div data-hero-heading>
            {lang === 'vi' ? (
              <>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">
                    <span className="heading-accent">Quần Thể</span>
                  </h1>
                </div>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">Di Tích</h1>
                </div>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">
                    Danh Thắng
                  </h1>
                </div>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">
                    <span className="heading-accent">Ao Bà Om</span>
                  </h1>
                </div>
              </>
            ) : (
              <>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">
                    <span className="heading-accent">Ao Ba Om</span>
                  </h1>
                </div>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">Heritage</h1>
                </div>
                <div className="line-mask">
                  <h1 className="kiosk-heading-oversized">
                    <span className="heading-accent">Complex</span>
                  </h1>
                </div>
              </>
            )}
          </div>

          {/* Lead paragraph */}
          <p
            className="font-serif text-base sm:text-lg text-stone-300/90 leading-relaxed max-w-3xl"
            data-hero-lead
          >
            {lang === 'vi' ? AO_BA_OM_OVERVIEW.leadParagraph.vi : AO_BA_OM_OVERVIEW.leadParagraph.en}
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4" data-hero-cta>
            <button
              onClick={onExploreMap}
              className="kiosk-magnetic-btn kiosk-magnetic-btn--primary"
            >
              <Compass className="w-4.5 h-4.5" />
              <span>{lang === 'vi' ? 'Khám phá Bản đồ & 6 Phân khu' : 'Explore Map & 6 Zones'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreTimeline || (() => {
                const el = document.getElementById('section-3-timeline');
                el?.scrollIntoView({ behavior: 'smooth' });
              })}
              className="kiosk-magnetic-btn kiosk-magnetic-btn--ghost cursor-pointer"
              data-hero-cta
            >
              <span>{lang === 'vi' ? 'Dòng thời gian' : 'Timeline'}</span>
              <ArrowDown className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM: Slow Marquee Cultural Ticker ═══ */}
      <div className="relative z-10 border-t border-white/6 bg-black/40 backdrop-blur-sm overflow-hidden">
        <div className="kiosk-marquee py-3">
          <div className="kiosk-marquee-track text-xs font-mono tracking-[0.3em] text-stone-500/70 uppercase">
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
