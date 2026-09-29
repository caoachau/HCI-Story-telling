import React, { useState, useEffect } from 'react';
import { HeritageSite } from '../data/heritageSites';
import { soundscape, narrateStory, stopNarration } from '../services/soundscape';
import { formatCoordinates } from '../utils/geoCoordinates';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  BookOpen,
  Users,
  Compass,
  History,
  Box,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Eye,
  Camera,
  Layers,
  X,
  Expand,
  Shrink,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';

interface StorytellingPanelProps {
  site: HeritageSite;
  onOpenArtifactModal: () => void;
  lang: 'vi' | 'en';
  onToggleLang: () => void;
  onClose?: () => void;
  onOpenPanorama360?: () => void;
  onOpenQRCode?: () => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  isSidebarWide?: boolean;
  onToggleSidebarWide?: () => void;
  onSelectChapterCamera?: (cameraView: { lng: number; lat: number; zoom: number; pitch: number; bearing: number }) => void;
  onContentChange?: () => void;
}

export const StorytellingPanel: React.FC<StorytellingPanelProps> = ({
  site,
  onOpenArtifactModal,
  lang,
  onToggleLang,
  onClose,
  onOpenPanorama360,
  onOpenQRCode,
  isExpanded = false,
  onToggleExpanded,
  isSidebarWide = false,
  onToggleSidebarWide,
  onSelectChapterCamera,
  onContentChange,
}) => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'beforeAfter' | 'artisans' | 'trail' | 'media'>('chapters');
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [isSoundscapePlaying, setIsSoundscapePlaying] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  const handleSelectTab = (tab: typeof activeTab) => {
    if (tab !== activeTab) onContentChange?.();
    setActiveTab(tab);
  };

  // Stop narration & sync audio on site change
  useEffect(() => {
    stopNarration();
    setIsNarrating(false);
    setSelectedChapterIdx(0);
    setCurrentSubtitle('');
  }, [site]);

  // Ambient Soundscape toggle
  const handleToggleSoundscape = () => {
    const playing = soundscape.toggle(site.soundscapeType);
    setIsSoundscapePlaying(playing);
  };

  // Narration Voice toggle with live subtitle support
  const handleToggleNarration = () => {
    if (isNarrating) {
      stopNarration();
      setIsNarrating(false);
      setCurrentSubtitle('');
    } else {
      const chapter = site.chapters[selectedChapterIdx];
      const textToRead =
        lang === 'vi'
          ? `${chapter.title}. ${chapter.summary}. ${chapter.details}`
          : `${chapter.englishTitle}. ${chapter.englishSummary}. ${chapter.englishDetails}`;

      setIsNarrating(true);
      setCurrentSubtitle(lang === 'vi' ? chapter.summary : chapter.englishSummary);
      narrateStory(textToRead, lang === 'vi' ? 'vi-VN' : 'en-US', () => {
        setIsNarrating(false);
        setCurrentSubtitle('');
      });
    }
  };

  // Chapter camera transition
  const handleSelectChapter = (idx: number) => {
    if (idx !== selectedChapterIdx) onContentChange?.();
    setSelectedChapterIdx(idx);
    const chapter = site.chapters[idx];
    if (chapter.camera && onSelectChapterCamera) {
      onSelectChapterCamera(chapter.camera);
    }
  };

  const coords = formatCoordinates(site.lat, site.lng);

  return (
    <div className={`relative w-full h-full flex flex-col bg-[#11141c]/95 text-stone-200 overflow-visible shadow-2xl backdrop-blur-xl ${isExpanded ? 'border-0' : 'border-l border-white/10'}`}>
      {/* 1. Header Banner & Location Identity */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#181d28] to-[#11141c]">
        {/* Real Documentary Photography Hero Cover */}
        <div className={`relative w-full ${isExpanded ? 'h-56 md:h-64 lg:h-72' : 'h-44'} overflow-hidden group`}>
          <img
            src={site.heroImage}
            alt={lang === 'vi' ? site.name : site.englishName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141c] via-[#11141c]/40 to-transparent" />

          {/* Top floating control dock */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              {site.establishedCentury}
            </span>

            <div className="flex items-center gap-2">
              {onOpenQRCode && (
                <button
                  onClick={onOpenQRCode}
                  className="p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-stone-300 hover:text-amber-400 transition-colors shadow-lg"
                  title={lang === 'vi' ? 'Tiếp tục trên điện thoại (mã QR)' : 'Continue on your phone (QR code)'}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleToggleSoundscape}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg ${
                  isSoundscapePlaying
                    ? 'bg-amber-600/90 border-amber-400 text-white ring-2 ring-amber-400/40'
                    : 'bg-black/70 border-white/15 text-stone-300 hover:text-white'
                }`}
                title={lang === 'vi' ? 'Âm thanh môi trường di sản' : 'Heritage soundscape'}
              >
                {isSoundscapePlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleNarration}
                className={`p-2 rounded-xl backdrop-blur-md border transition-all shadow-lg ${
                  isNarrating
                    ? 'bg-amber-600/90 border-amber-400 text-white ring-2 ring-amber-400/40 animate-pulse'
                    : 'bg-black/70 border-white/15 text-stone-300 hover:text-white'
                }`}
                title={lang === 'vi' ? 'Thuyết minh âm thanh' : 'Audio narration'}
              >
                {isNarrating ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              {onToggleExpanded && (
                <button
                  onClick={onToggleExpanded}
                  className="rounded-xl border border-white/15 bg-black/70 p-2 text-stone-300 shadow-lg backdrop-blur-md transition-colors hover:bg-black/90 hover:text-amber-300"
                  title={isExpanded
                    ? (lang === 'vi' ? 'Thu nhỏ toàn màn hình' : 'Exit full screen')
                    : (lang === 'vi' ? 'Mở toàn màn hình' : 'Open full screen')}
                  aria-label={isExpanded
                    ? (lang === 'vi' ? 'Thu nhỏ toàn màn hình' : 'Exit full screen')
                    : (lang === 'vi' ? 'Mở toàn màn hình' : 'Open full screen')}
                  aria-pressed={isExpanded}
                >
                  {isExpanded ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/15 text-stone-300 hover:text-white transition-colors shadow-lg"
                  title={lang === 'vi' ? 'Đóng bảng kể chuyện' : 'Close story panel'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Photo caption badge */}
          <div className="absolute bottom-2 left-4 text-[10px] text-stone-400 font-mono drop-shadow bg-black/60 px-2 py-0.5 rounded border border-white/10">
            {lang === 'vi' ? site.heroImageCaption : site.englishName}
          </div>
        </div>

        {/* Title & Coordinates Info */}
        <div className={`relative ${isExpanded ? 'p-6 lg:px-10 pt-4' : 'p-5 pt-3'} space-y-1`}>
          {onToggleSidebarWide && (
            <button
              onClick={onToggleSidebarWide}
              className="absolute left-0 top-0 z-[90] flex h-10 w-10 -translate-x-[84%] -translate-y-1/2 items-center justify-center rounded-full border border-amber-400/70 bg-[#11141c] text-amber-300 shadow-[0_6px_20px_rgba(0,0,0,0.65)] transition-all hover:bg-amber-600 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-300"
              title={isSidebarWide
                ? (lang === 'vi' ? 'Thu gọn bảng diễn giải' : 'Narrow interpretation panel')
                : (lang === 'vi' ? 'Mở rộng bảng diễn giải sang trái' : 'Expand interpretation panel left')}
              aria-label={isSidebarWide
                ? (lang === 'vi' ? 'Thu gọn bảng diễn giải' : 'Narrow interpretation panel')
                : (lang === 'vi' ? 'Mở rộng bảng diễn giải sang trái' : 'Expand interpretation panel left')}
              aria-pressed={isSidebarWide}
            >
              {isSidebarWide ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>{site.province}</span>
            <span>·</span>
            <span>{coords.decimal}</span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 text-2xl font-serif font-bold text-amber-100 tracking-wide">
              {lang === 'vi' ? site.name : site.englishName}
            </h2>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-sans italic pt-1">
            {lang === 'vi' ? <>&ldquo;{site.tagline}&rdquo;</> : <>&ldquo;{site.englishName}&rdquo;</>}
          </p>

          {isExpanded && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4">
              {[
                [lang === 'vi' ? 'Loại hình' : 'Category', lang === 'vi' ? site.category : site.category],
                [lang === 'vi' ? 'Vùng văn hóa' : 'Cultural region', lang === 'vi' ? site.region : site.region],
                [lang === 'vi' ? 'Độ cao' : 'Elevation', `${site.elevationMeters} m`],
                [lang === 'vi' ? 'Tư liệu' : 'Archive', `${site.gallery.length} ${lang === 'vi' ? 'ảnh' : 'photos'}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">{label}</div>
                  <div className="mt-1 truncate text-xs font-medium text-amber-100" title={value}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Live Subtitle Banner (When narration is active) */}
        {isNarrating && currentSubtitle && (
          <div className="mx-5 mb-4 p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-xs text-amber-200 animate-in fade-in flex items-start gap-2 shadow-lg">
            <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-0.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400">{lang === 'vi' ? 'Phụ đề thuyết minh:' : 'Narration subtitles:'}</span>
              <p className="italic font-sans leading-relaxed">{currentSubtitle}</p>
            </div>
          </div>
        )}

        {/* 2. Navigation Tab Bar (Museum Story Modules) */}
        <div className={`story-tab-strip flex border-t border-white/10 ${isExpanded ? 'px-6 lg:px-10' : 'px-3'} bg-[#0d1017] overflow-x-auto`} role="tablist" aria-label={lang === 'vi' ? 'Các mục diễn giải' : 'Interpretation sections'}>
          <button
            onClick={() => handleSelectTab('chapters')}
            role="tab"
            aria-selected={activeTab === 'chapters'}
            className={`py-3 px-3 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'chapters'
                ? 'border-amber-400 text-amber-300 font-bold bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Chương Di Sản' : 'Heritage chapters'} ({site.chapters.length})</span>
          </button>

          <button
            onClick={() => handleSelectTab('beforeAfter')}
            role="tab"
            aria-selected={activeTab === 'beforeAfter'}
            className={`py-3 px-3 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'beforeAfter'
                ? 'border-amber-400 text-amber-300 font-bold bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Xưa ↔ Nay' : 'Past ↔ Present'}</span>
          </button>

          <button
            onClick={() => handleSelectTab('artisans')}
            role="tab"
            aria-selected={activeTab === 'artisans'}
            className={`py-3 px-3 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'artisans'
                ? 'border-amber-400 text-amber-300 font-bold bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Nghệ Nhân & 3D' : 'Artisans & 3D'}</span>
          </button>

          <button
            onClick={() => handleSelectTab('trail')}
            role="tab"
            aria-selected={activeTab === 'trail'}
            className={`py-3 px-3 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'trail'
                ? 'border-amber-400 text-amber-300 font-bold bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Lộ Trình Cộng Đồng' : 'Community route'}</span>
          </button>

          <button
            onClick={() => handleSelectTab('media')}
            role="tab"
            aria-selected={activeTab === 'media'}
            className={`py-3 px-3 text-xs font-mono flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
              activeTab === 'media'
                ? 'border-amber-400 text-amber-300 font-bold bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '360° & Tư Liệu' : '360° & Archive'}</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Body Content Area */}
      <div className={`flex-1 overflow-y-auto ${isExpanded ? 'p-6 lg:px-10 xl:px-16 space-y-8' : 'p-5 space-y-6'}`}>
        {/* TAB 1: CURATED CHAPTERS WITH CAMERA VIEWPOINTS */}
        {activeTab === 'chapters' && (
          <div className={isExpanded ? 'grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]' : 'space-y-5'}>
            {/* Chapter Stepper Buttons */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-1">
                <span>{lang === 'vi' ? 'TIẾN TRÌNH DIỄN GIẢI' : 'STORY PROGRESS'}</span>
                <span className="text-amber-400 font-bold">
                  0{selectedChapterIdx + 1} / 0{site.chapters.length}
                </span>
              </div>

              <div className={isExpanded ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-3 gap-2'}>
                {site.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectChapter(idx)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      selectedChapterIdx === idx
                        ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-md font-semibold'
                        : 'bg-black/30 border-white/10 text-stone-400 hover:bg-white/5 hover:text-stone-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-amber-400/80">0{idx + 1}</div>
                    <div className="truncate font-sans font-medium">{lang === 'vi' ? ch.title : ch.englishTitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Chapter Long-Form Article */}
            <article className="bg-[#141822]/80 border border-white/10 rounded-2xl p-6 lg:p-8 space-y-5 shadow-xl">
              <div className="border-b border-white/10 pb-3 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                    {lang === 'vi' ? 'Diễn giải chuyên sâu · Chương' : 'In-depth story · Chapter'} 0{selectedChapterIdx + 1}
                  </span>
                  <h3 className="text-xl font-serif text-amber-100 font-semibold mt-1">
                    {lang === 'vi' ? site.chapters[selectedChapterIdx].title : site.chapters[selectedChapterIdx].englishTitle}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 font-medium leading-relaxed">
                    {lang === 'vi' ? site.chapters[selectedChapterIdx].summary : site.chapters[selectedChapterIdx].englishSummary}
                  </p>
                </div>
              </div>

              {/* Real Chapter Documentary Image */}
              {site.chapters[selectedChapterIdx].photoUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 relative group">
                  <img
                    src={site.chapters[selectedChapterIdx].photoUrl}
                    alt={lang === 'vi' ? site.chapters[selectedChapterIdx].title : site.chapters[selectedChapterIdx].englishTitle}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-[11px] text-amber-200/90 font-mono flex items-center justify-between">
                    <span>{lang === 'vi' ? site.chapters[selectedChapterIdx].photoCaption : site.chapters[selectedChapterIdx].englishTitle}</span>
                    <span className="text-[10px] text-stone-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">{lang === 'vi' ? 'Ảnh tư liệu' : 'Archive photo'}</span>
                  </div>
                </div>
              )}

              {/* Quote / Proverb */}
              {site.chapters[selectedChapterIdx].quoteOrProverb && (
                <div className="bg-amber-900/15 border-l-2 border-amber-500 p-4 rounded-r-xl italic font-serif text-sm text-amber-200/90 leading-relaxed">
                  {site.chapters[selectedChapterIdx].quoteOrProverb}
                </div>
              )}

              {/* Main Reading Prose */}
              <div className="text-xs leading-relaxed text-stone-300 space-y-3 font-sans">
                <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-amber-400">
                  {lang === 'vi'
                    ? site.chapters[selectedChapterIdx].details
                    : site.chapters[selectedChapterIdx].englishDetails}
                </p>
              </div>

              {/* Chapter Next Action */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-stone-400 font-mono">{lang === 'vi' ? 'Thời gian đọc: ~3 phút' : 'Reading time: ~3 min'}</span>
                <button
                  onClick={() => {
                    const next = (selectedChapterIdx + 1) % site.chapters.length;
                    handleSelectChapter(next);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30"
                >
                  {lang === 'vi' ? 'Chương tiếp theo' : 'Next chapter'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          </div>
        )}

        {/* TAB 2: BEFORE / AFTER HISTORICAL COMPARISON */}
        {activeTab === 'beforeAfter' && (
          <div className="space-y-4">
            <BeforeAfterSlider
              lang={lang}
              pastImage={site.historicalComparison.pastImage}
              pastLabel={site.historicalComparison.pastLabel}
              pastYear={site.historicalComparison.pastYear}
              pastDescription={site.historicalComparison.pastDescription}
              presentImage={site.historicalComparison.presentImage}
              presentLabel={site.historicalComparison.presentLabel}
              presentDescription={site.historicalComparison.presentDescription}
            />
          </div>
        )}

        {/* TAB 3: ARTISANS & 3D ARTIFACT */}
        {activeTab === 'artisans' && (
          <div className="space-y-6">
            {/* 3D Artifact Callout Banner with Real Museum Photo */}
            <div className="bg-gradient-to-r from-amber-950/40 to-stone-900/60 border border-amber-600/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl">
              <img
                src={site.artifact.realImageUrl}
                alt={site.artifact.name}
                className="w-24 h-24 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">{lang === 'vi' ? 'Hiện vật tiêu biểu chuẩn bảo tàng' : 'Featured museum artifact'}</span>
                <h4 className="text-base font-serif text-amber-100 font-bold">{lang === 'vi' ? site.artifact.name : site.artifact.englishName}</h4>
                <p className="text-xs text-stone-400 mt-1">{site.artifact.material} · {site.artifact.era}</p>
                <p className="text-[11px] text-amber-200/80 font-mono mt-1 italic">{site.artifact.realImageCaption}</p>
              </div>
              <button
                onClick={onOpenArtifactModal}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-medium transition-all flex items-center gap-2 shadow-lg shrink-0 cursor-pointer"
              >
                <Box className="w-4 h-4" /> {lang === 'vi' ? 'Xem hiện vật 3D' : 'View 3D artifact'}
              </button>
            </div>

            {/* Living Artisans List */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
                {lang === 'vi' ? 'Nhân Chứng Sống & Bậc Thầy Di Sản Bản Địa' : 'Living Heritage Keepers'}
              </h4>
              <div className="space-y-4">
                {site.artisans.map((artisan, idx) => (
                  <div key={idx} className="bg-[#141822] border border-white/10 rounded-2xl p-5 space-y-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={artisan.avatarUrl}
                        alt={artisan.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-serif font-bold text-amber-200">{artisan.name}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-md">
                            {artisan.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400">{artisan.role} · {artisan.age} tuổi</p>
                        <p className="text-[11px] text-stone-500 font-mono">{artisan.village}</p>
                      </div>
                    </div>

                    <p className="text-xs italic font-serif text-amber-100/90 bg-black/30 p-3 rounded-xl border border-white/5">
                      &ldquo;{artisan.quote}&rdquo;
                    </p>

                    <div className="text-xs text-stone-300">
                      <span className="text-amber-500 font-medium">Đóng góp di sản: </span>
                      {artisan.contribution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMUNITY TRAIL & ETHICAL GUIDELINES */}
        {activeTab === 'trail' && (
          <div className="space-y-6">
            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141822] border border-white/10 rounded-xl p-4">
                <span className="text-[11px] font-mono text-stone-400">{lang === 'vi' ? 'Hộ dân tham gia sinh kế' : 'Households engaged'}</span>
                <div className="text-xl font-serif text-amber-300 font-bold mt-1">
                  {site.communityImpact.householdsEngaged} {lang === 'vi' ? 'hộ' : 'households'}
                </div>
              </div>
              <div className="bg-[#141822] border border-white/10 rounded-xl p-4">
                <span className="text-[11px] font-mono text-stone-400">{lang === 'vi' ? 'Thanh niên học truyền nghề' : 'Youth apprentices'}</span>
                <div className="text-xl font-serif text-sky-300 font-bold mt-1">
                  {site.communityImpact.youthApprentices} {lang === 'vi' ? 'nghệ nhân trẻ' : 'young artisans'}
                </div>
              </div>
            </div>

            {/* Preservation Rate Pledge */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300">{lang === 'vi' ? 'Cam kết bền vững cộng đồng: ' : 'Community sustainability pledge: '}</span>
                <span>{site.communityImpact.sustainablePledge}</span>
              </div>
            </div>

            {/* Step-by-Step Experience Trail with Real Stop Photos */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
                {lang === 'vi' ? 'Lộ Trình Trải Nghiệm Văn Hóa Có Trách Nhiệm' : 'Responsible Cultural Experience Route'}
              </h4>
              <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                {site.tourStops.map((stop) => (
                  <div key={stop.order} className="relative pl-10">
                    <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center">
                      {stop.order}
                    </div>
                    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-amber-200 text-sm">{stop.title}</span>
                        <span className="font-mono text-stone-400">{stop.timeMinutes} {lang === 'vi' ? 'phút' : 'min'}</span>
                      </div>

                      {/* Real Stop Thumbnail */}
                      <div className="w-full h-28 rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={stop.photoUrl}
                          alt={stop.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <p className="text-xs text-stone-300">{stop.activity}</p>
                      <div className="text-[11px] text-amber-400/90 italic flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{lang === 'vi' ? 'Quy ước văn hóa: ' : 'Cultural guideline: '}{stop.ethicalGuideline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 360° PANORAMA & ARCHIVE GALLERY */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* 360 Feature Action Banner */}
            <div className="bg-gradient-to-br from-amber-950/60 to-stone-900/80 border border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Không Gian 360° Tương Tác' : 'Interactive 360° Experience'}</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-amber-100">
                {lang === 'vi' ? 'Khám Phá Toàn Cảnh Di Tích Góc Rộng' : 'Explore the Heritage Site in 360°'}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                {lang === 'vi'
                  ? 'Trải nghiệm xoay chuyển 360 độ góc nhìn thực địa tại không gian di sản, cảm nhận trọn vẹn cảnh quan và kiến trúc bản địa.'
                  : 'Explore a full 360-degree view of the heritage site and experience its landscape and local architecture.'}
              </p>
              {onOpenPanorama360 && (
                <button
                  onClick={onOpenPanorama360}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> {lang === 'vi' ? 'Mở chế độ 360° toàn cảnh' : 'Open 360° panorama'}
                </button>
              )}
            </div>

            {/* Documentary Photo Gallery */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">
                {lang === 'vi' ? 'Bộ Sưu Tập Ảnh Tư Liệu' : 'Archive Photo Collection'} ({site.gallery.length} {lang === 'vi' ? 'tác phẩm' : 'photos'})
              </h4>
              <div className={isExpanded ? 'grid grid-cols-2 xl:grid-cols-3 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
                {site.gallery.map((item, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-black/40 space-y-2 pb-2">
                    <img
                      src={item.url}
                      alt={lang === 'vi' ? item.caption : site.englishName}
                      className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="px-3">
                      <p className="text-xs text-stone-300 line-clamp-2">{lang === 'vi' ? item.caption : site.englishName}</p>
                      <span className="text-[10px] font-mono text-stone-500">{item.credit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
