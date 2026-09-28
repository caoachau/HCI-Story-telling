import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { HERITAGE_SITES, HeritageSite } from './data/heritageSites';
import { LandmarkCarousel } from './components/LandmarkCarousel';
import { HeaderTopBar } from './components/HeaderTopBar';
import { LandmarkDrawer } from './components/LandmarkDrawer';
import type { CameraManager, CameraChapterView } from './services/cameraManager';
import { soundscape } from './services/soundscape';
import { PanelRightClose, BookOpen, Accessibility, X, Clock3 } from 'lucide-react';

const Earth3DViewer = lazy(() => import('./components/Earth3DViewer').then((module) => ({ default: module.Earth3DViewer })));
const StorytellingPanel = lazy(() => import('./components/StorytellingPanel').then((module) => ({ default: module.StorytellingPanel })));
const Artifact3DModal = lazy(() => import('./components/Artifact3DModal').then((module) => ({ default: module.Artifact3DModal })));
const AboutProjectModal = lazy(() => import('./components/AboutProjectModal').then((module) => ({ default: module.AboutProjectModal })));
const Panorama360Modal = lazy(() => import('./components/Panorama360Modal').then((module) => ({ default: module.Panorama360Modal })));
const QRCodeModal = lazy(() => import('./components/QRCodeModal').then((module) => ({ default: module.QRCodeModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then((module) => ({ default: module.SearchModal })));
const AttractModeOverlay = lazy(() => import('./components/AttractModeOverlay').then((module) => ({ default: module.AttractModeOverlay })));

export default function App() {
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(HERITAGE_SITES[0]);
  const [hasUserSelectedSite, setHasUserSelectedSite] = useState<boolean>(false);
  const [recenterRequestId, setRecenterRequestId] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [isKioskFullscreen, setIsKioskFullscreen] = useState<boolean>(false);
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState<boolean>(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [isAttractMode, setIsAttractMode] = useState<boolean>(false);
  const [isReduceMotion, setIsReduceMotion] = useState<boolean>(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState<boolean>(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [contentEpoch, setContentEpoch] = useState(0);

  const cameraManagerRef = useRef<CameraManager | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'vi'
      ? 'Ký Ức Bản Địa · Diễn Giải Di Sản Trà Vinh'
      : 'Indigenous Memories · Trà Vinh Heritage Interpretation';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = lang === 'vi'
        ? 'Khám phá bảy điểm di sản Trà Vinh qua bản đồ 3D, câu chuyện cộng đồng và hiện vật số.'
        : 'Explore seven heritage sites in Trà Vinh through a 3D map, community stories and digital artifacts.';
    }
    const socialTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (socialTitle) {
      socialTitle.content = lang === 'vi'
        ? 'Ký Ức Bản Địa · Diễn Giải Di Sản Trà Vinh'
        : 'Indigenous Memories · Trà Vinh Heritage Interpretation';
    }
    const socialDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (socialDescription && description) socialDescription.content = description.content;
  }, [lang]);

  // Fullscreen Toggle for Kiosk Displays
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsKioskFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsKioskFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsKioskFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keep the kiosk's five-minute content limit: time is tied to the open
  // interpretation panel, not to pointer or keyboard activity.
  useEffect(() => {
    if (!hasUserSelectedSite || !isSidebarOpen) return;
    const timer = window.setTimeout(() => {
      soundscape.stopSoundscape();
      setIsSoundPlaying(false);
      setHasUserSelectedSite(false);
      setIsSidebarOpen(false);
      setIsArtifactModalOpen(false);
      setIsPanoramaOpen(false);
      setIsQRCodeOpen(false);
      setIsListDrawerOpen(false);
      setIsSessionExpired(true);
      cameraManagerRef.current?.flyToOverview();
    }, 5 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [hasUserSelectedSite, isSidebarOpen, selectedSite.id, contentEpoch]);

  // Museum Kiosk Attract Mode Idle Detection (75s inactivity)
  const resetIdleTimer = () => {
    if (isAttractMode) {
      setIsAttractMode(false);
      cameraManagerRef.current?.stopAttractMode();
    }
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      if (!isAutoTouring && !isSidebarOpen && !hasUserSelectedSite) {
        setIsAttractMode(true);
        cameraManagerRef.current?.startAttractMode();
      }
    }, 75000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'touchstart', 'pointerdown'];
    const handleActivity = () => resetIdleTimer();

    events.forEach((ev) => window.addEventListener(ev, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [isAutoTouring, isSidebarOpen, hasUserSelectedSite, isAttractMode]);

  // Ambient sound toggle
  const handleToggleSound = () => {
    const playing = soundscape.toggle(selectedSite.soundscapeType);
    setIsSoundPlaying(playing);
  };

  // Site selection handler
  const handleSelectSite = (site: HeritageSite) => {
    if (hasUserSelectedSite && selectedSite.id === site.id) {
      // A repeated click is an explicit camera action even though React's
      // selected-site value stays the same. Keep the story panel in place.
      setRecenterRequestId((requestId) => requestId + 1);
      resetIdleTimer();
      return;
    }
    setSelectedSite(site);
    setHasUserSelectedSite(true);
    // Close sidebar during flight so user experiences unobstructed cinematic flight
    setIsSidebarOpen(false);
    if (isSoundPlaying) {
      soundscape.playSoundscape(site.soundscapeType);
    }
    resetIdleTimer();
  };

  // Zooming/panning can select a story without starting a destination flight.
  const handleMapStoryFocus = (site: HeritageSite | null) => {
    if (!site) {
      setIsSidebarOpen(false);
      return;
    }
    setSelectedSite(site);
    setHasUserSelectedSite(true);
    setIsSidebarOpen(true);
    if (isSoundPlaying && selectedSite.id !== site.id) {
      soundscape.playSoundscape(site.soundscapeType);
    }
  };

  // Home button action: resets to overview of all landmarks
  const handleHomeClick = () => {
    setHasUserSelectedSite(false);
    setIsSidebarOpen(false);
    setIsListDrawerOpen(false);
  };

  // Back button action: exits focused site back to full map
  const handleBackClick = () => {
    setHasUserSelectedSite(false);
    setIsSidebarOpen(false);
    cameraManagerRef.current?.flyToOverview();
  };

  // Chapter camera viewpoint transition handler
  const handleChapterCameraChange = (cam: CameraChapterView) => {
    cameraManagerRef.current?.flyToChapter(cam, viewMode);
  };

  return (
    <div className={`heritage-app flex flex-col w-screen h-screen overflow-hidden bg-[#0c0e14] text-[#f4efe6] select-none${isLargeText ? ' access-large-text' : ''}${isHighContrast ? ' access-high-contrast' : ''}`}>
      {/* 1. Header Top Bar */}
      <HeaderTopBar
        onHomeClick={handleHomeClick}
        onBackClick={handleBackClick}
        viewMode={viewMode}
        onToggleViewMode={(mode) => setViewMode(mode)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        isListDrawerOpen={isListDrawerOpen}
        onToggleListDrawer={() => setIsListDrawerOpen(!isListDrawerOpen)}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        lang={lang}
        onToggleLang={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        isKioskFullscreen={isKioskFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenAbout={() => setIsAboutOpen(true)}
        hasActiveSelection={hasUserSelectedSite}
        onOpenSearch={() => setIsSearchOpen(true)}
        isReduceMotion={isReduceMotion}
        onToggleReduceMotion={() => setIsReduceMotion(!isReduceMotion)}
      />

      {/* 2. Main Full-Bleed Map Viewport Area */}
      <div className="heritage-map-viewport relative flex-1 flex overflow-hidden" data-story-open={isSidebarOpen}>
        {/* Left & Center: 3D Topographic Table / 2D Map */}
        <div className="relative flex-1 h-full overflow-hidden">
        <Suspense fallback={<div className="flex h-full items-center justify-center bg-[#10141d] text-sm text-stone-400" role="status">{lang === 'vi' ? 'Đang tải bản đồ di sản…' : 'Loading heritage map…'}</div>}>
          <Earth3DViewer
            selectedSite={selectedSite}
            onSelectSite={handleSelectSite}
            recenterRequestId={recenterRequestId}
            lang={lang}
            viewMode={viewMode}
            onToggleViewMode={(mode) => setViewMode(mode)}
            isAutoTouring={isAutoTouring}
            onToggleAutoTour={() => setIsAutoTouring(!isAutoTouring)}
            activeCategoryFilter={selectedCategory}
            onOpenStorytelling={() => setIsSidebarOpen(true)}
            isStorytellingOpen={isSidebarOpen}
            onMapStoryFocus={handleMapStoryFocus}
            onHomeClick={handleHomeClick}
            hasUserSelectedSite={hasUserSelectedSite}
            isReduceMotion={isReduceMotion}
            onRegisterCameraManager={(mgr) => {
              cameraManagerRef.current = mgr;
            }}
          />
          </Suspense>

          {/* Story panel and accessibility controls */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-20 right-[calc(var(--story-controls-offset)+1.5rem)] z-20 px-3 py-2 bg-[#10141d]/90 hover:bg-[#18202d] border border-white/10 hover:border-amber-500/50 rounded-xl text-stone-200 hover:text-amber-300 shadow-xl transition-all flex items-center gap-2 text-xs font-mono cursor-pointer"
            title={isSidebarOpen
              ? (lang === 'vi' ? 'Thu gọn bảng diễn giải' : 'Close heritage story')
              : (lang === 'vi' ? 'Mở bảng diễn giải di sản' : 'Open heritage story')}
            aria-label={isSidebarOpen
              ? (lang === 'vi' ? 'Thu gọn diễn giải di sản' : 'Close heritage interpretation')
              : (lang === 'vi' ? 'Mở diễn giải di sản' : 'Open heritage interpretation')}
          >
            {isSidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <BookOpen className="h-4 w-4 text-amber-400" />}
            <span className="hidden sm:inline">
              {isSidebarOpen
                ? (lang === 'vi' ? 'Thu gọn' : 'Close story')
                : (lang === 'vi' ? 'Diễn giải di sản' : 'Heritage story')}
            </span>
          </button>

          <button
            onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
            className="absolute top-20 right-[calc(var(--story-controls-offset)+1.5rem)] sm:right-[calc(var(--story-controls-offset)+11rem)] z-20 p-2.5 bg-[#10141d]/90 hover:bg-[#18202d] border border-white/10 hover:border-amber-500/50 rounded-xl text-stone-200 hover:text-amber-300 shadow-xl transition-all"
            title={lang === 'vi' ? 'Tùy chỉnh trợ năng' : 'Accessibility settings'}
            aria-label={lang === 'vi' ? 'Tùy chỉnh trợ năng' : 'Accessibility settings'}
            aria-expanded={isAccessibilityOpen}
          >
            <Accessibility className="h-4 w-4" />
          </button>

          {isAccessibilityOpen && (
            <section className="absolute top-32 right-[calc(var(--story-controls-offset)+1.5rem)] z-30 w-72 rounded-2xl border border-amber-500/30 bg-[#10141d]/95 p-4 shadow-2xl backdrop-blur" aria-label={lang === 'vi' ? 'Tùy chỉnh trợ năng' : 'Accessibility settings'}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-amber-100">{lang === 'vi' ? 'Trợ năng' : 'Accessibility'}</h2>
                <button onClick={() => setIsAccessibilityOpen(false)} className="rounded-lg p-1 text-stone-400 hover:bg-white/10 hover:text-white" aria-label={lang === 'vi' ? 'Đóng trợ năng' : 'Close accessibility settings'}><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-2 text-xs">
                <button onClick={() => setIsLargeText(!isLargeText)} aria-pressed={isLargeText} className="flex min-h-10 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-left hover:bg-white/5">
                  <span>{lang === 'vi' ? 'Cỡ chữ lớn' : 'Larger text'}</span><span className="text-amber-300">{isLargeText ? (lang === 'vi' ? 'Bật' : 'On') : (lang === 'vi' ? 'Tắt' : 'Off')}</span>
                </button>
                <button onClick={() => setIsHighContrast(!isHighContrast)} aria-pressed={isHighContrast} className="flex min-h-10 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-left hover:bg-white/5">
                  <span>{lang === 'vi' ? 'Tương phản cao' : 'High contrast'}</span><span className="text-amber-300">{isHighContrast ? (lang === 'vi' ? 'Bật' : 'On') : (lang === 'vi' ? 'Tắt' : 'Off')}</span>
                </button>
                <button onClick={() => setIsReduceMotion(!isReduceMotion)} aria-pressed={isReduceMotion} className="flex min-h-10 w-full items-center justify-between rounded-xl border border-white/10 px-3 text-left hover:bg-white/5">
                  <span>{lang === 'vi' ? 'Giảm chuyển động' : 'Reduce motion'}</span><span className="text-amber-300">{isReduceMotion ? (lang === 'vi' ? 'Bật' : 'On') : (lang === 'vi' ? 'Tắt' : 'Off')}</span>
                </button>
              </div>
            </section>
          )}
        </div>
        {/* Overlay the story without changing the map's size or camera center. */}
        {isSidebarOpen && (
          <aside className="heritage-story-panel absolute inset-y-0 right-0 z-40 shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            <Suspense fallback={<div className="flex h-full items-center justify-center bg-[#11141c] text-sm text-stone-400" role="status">{lang === 'vi' ? 'Đang mở diễn giải…' : 'Loading story…'}</div>}>
            <StorytellingPanel
              site={selectedSite}
              onOpenArtifactModal={() => setIsArtifactModalOpen(true)}
              lang={lang}
              onToggleLang={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              onClose={() => setIsSidebarOpen(false)}
              onOpenPanorama360={() => setIsPanoramaOpen(true)}
              onOpenQRCode={() => setIsQRCodeOpen(true)}
              onSelectChapterCamera={handleChapterCameraChange}
              onContentChange={() => setContentEpoch((epoch) => epoch + 1)}
            />
            </Suspense>
          </aside>
        )}
      </div>

      {/* 3. Bottom Landmark Dock Carousel (Floating, compact, collapsible) */}
      <LandmarkCarousel
        selectedSite={selectedSite}
        onSelectSite={handleSelectSite}
        lang={lang}
      />

      {/* 4. Slide-Over Landmark Directory Drawer (7 Sites) */}
      <LandmarkDrawer
        isOpen={isListDrawerOpen}
        onClose={() => setIsListDrawerOpen(false)}
        selectedSite={selectedSite}
        onSelectSite={handleSelectSite}
        lang={lang}
        activeCategory={selectedCategory}
      />

      {/* 5. 3D Artifact Interactive Inspector Modal */}
      {isArtifactModalOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-sm text-stone-300" role="status">{lang === 'vi' ? 'Đang mở hiện vật 3D…' : 'Loading 3D artifact…'}</div>}>
        <Artifact3DModal
          artifact={selectedSite.artifact}
          lang={lang}
          onClose={() => setIsArtifactModalOpen(false)}
        />
        </Suspense>
      )}

      {/* 6. About Curatorial Project Modal */}
      {isAboutOpen && (
        <Suspense fallback={null}>
        <AboutProjectModal lang={lang} onClose={() => setIsAboutOpen(false)} />
        </Suspense>
      )}

      {/* 7. Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectSite={handleSelectSite}
          lang={lang}
        />
        </Suspense>
      )}

      {/* 8. 360Â° Panorama Immersive View Modal */}
      {isPanoramaOpen && (
        <Suspense fallback={null}>
        <Panorama360Modal
          lang={lang}
          siteName={lang === 'vi' ? selectedSite.name : selectedSite.englishName}
          photoUrl={selectedSite.heroImage}
          caption={lang === 'vi' ? selectedSite.heroImageCaption : selectedSite.englishName}
          onClose={() => setIsPanoramaOpen(false)}
        />
        </Suspense>
      )}

      {/* 9. QR Code Modal (Continue on Mobile) */}
      {isQRCodeOpen && (
        <Suspense fallback={null}>
        <QRCodeModal
          site={selectedSite}
          lang={lang}
          onClose={() => setIsQRCodeOpen(false)}
        />
        </Suspense>
      )}

      {/* 10. Museum Attract Mode Overlay */}
      {isAttractMode && (
        <Suspense fallback={null}>
        <AttractModeOverlay
          lang={lang}
          onWakeUp={() => {
            setIsAttractMode(false);
            cameraManagerRef.current?.stopAttractMode();
          }}
        />
        </Suspense>
      )}

      {isSessionExpired && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="session-expired-title">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#11141c] p-7 text-center shadow-2xl">
            <Clock3 className="mx-auto mb-4 h-8 w-8 text-amber-300" />
            <h2 id="session-expired-title" className="mb-2 font-serif text-2xl text-amber-100">{lang === 'vi' ? 'Lượt khám phá đã kết thúc' : 'Your visit has ended'}</h2>
            <p className="mb-6 text-sm leading-relaxed text-stone-300">{lang === 'vi' ? 'Bản đồ đã trở về toàn cảnh. Bạn có thể bắt đầu hành trình mới bất cứ lúc nào.' : 'The map has returned to the overview. You can begin a new journey at any time.'}</p>
            <button onClick={() => setIsSessionExpired(false)} className="min-h-11 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500">{lang === 'vi' ? 'Tiếp tục khám phá' : 'Continue exploring'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
