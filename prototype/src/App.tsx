import React, { lazy, Suspense, use, useState, useEffect, useRef } from 'react';
import { HERITAGE_SITES, HeritageSite } from './data/heritageSites';
import { LandmarkCarousel } from './components/LandmarkCarousel';
import { HeaderTopBar } from './components/HeaderTopBar';
import { LandmarkDrawer } from './components/LandmarkDrawer';
import { LocationQuickView } from './components/LocationQuickView';
import { LocationUtilityDialog } from './components/LocationUtilityDialog';
import type { CameraManager, CameraChapterView } from './services/cameraManager';
import { soundscape } from './services/soundscape';
import { Clock3 } from 'lucide-react';
import { fetchLocalWeather, type LocalWeather } from './services/localWeather';
import { usePreferences, setPreferences } from './experience/preferences';
import { ExperienceTools } from './experience/ExperienceTools';
import { activateSiteRoute, isSiteId, routeParams, setEntryIssue, updateRoute, useRememberedState } from './experience/state';
import { isSiteInCategory } from './data/siteCategories';
import { narration } from './experience/narration';

const Earth3DViewer = lazy(() => import('./components/Earth3DViewer').then((module) => ({ default: module.Earth3DViewer })));
import { loadStorytellingPanel, peekStorytellingPanel } from './utils/museumPreload';
function StorytellingPanel(props: React.ComponentProps<typeof import('./components/StorytellingPanel').StorytellingPanel>) {
  const module = peekStorytellingPanel() ?? use(loadStorytellingPanel());
  return <module.StorytellingPanel {...props} />;
}
const Artifact3DModal = lazy(() => import('./components/Artifact3DModal').then((module) => ({ default: module.Artifact3DModal })));
const AboutProjectModal = lazy(() => import('./components/AboutProjectModal').then((module) => ({ default: module.AboutProjectModal })));
const Panorama360Modal = lazy(() => import('./components/Panorama360Modal').then((module) => ({ default: module.Panorama360Modal })));
const QRCodeModal = lazy(() => import('./components/QRCodeModal').then((module) => ({ default: module.QRCodeModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then((module) => ({ default: module.SearchModal })));
const AttractModeOverlay = lazy(() => import('./components/AttractModeOverlay').then((module) => ({ default: module.AttractModeOverlay })));

export default function App() {
  const prefs = usePreferences();
  const initial = routeParams();
  const initialSite = HERITAGE_SITES.find(site => site.id === initial.get('site'));
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(initialSite || HERITAGE_SITES[0]);
  const [hasUserSelectedSite, setHasUserSelectedSite] = useState<boolean>(!!initialSite);
  const [recenterRequestId, setRecenterRequestId] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [selectedCategory, setSelectedCategory] = useRememberedState<string>('map:category', 'all');
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [isKioskFullscreen, setIsKioskFullscreen] = useState<boolean>(false);
  const [isArtifactModalOpen, setIsArtifactModalOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState<boolean>(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [isAttractMode, setIsAttractMode] = useState<boolean>(false);
  const isReduceMotion = prefs.reduceMotion;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!!initialSite);
  const [isStoryExpanded, setIsStoryExpanded] = useState<boolean>(!!initialSite && initial.get('detail') === '1');
  const [hasOpenedStoryDetail, setHasOpenedStoryDetail] = useState(!!initialSite && initial.get('detail') === '1');
  const [hasPreparedMuseumDetail, setHasPreparedMuseumDetail] = useState(false);
  useEffect(() => { setHasPreparedMuseumDetail(false); }, [selectedSite.id, isSidebarOpen]);
  const [isStoryWide, setIsStoryWide] = useState<boolean>(false);
  const [isLandmarkCarouselCollapsed, setIsLandmarkCarouselCollapsed] = useState(!!initialSite);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState<boolean>(false);
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const lang = prefs.lang;
  const setLang = (value: 'vi' | 'en') => setPreferences({ lang: value });
  const [mapToolsHost, setMapToolsHost] = useState<HTMLDivElement | null>(null);
  const isLargeText = prefs.largeText;
  const isHighContrast = prefs.highContrast;
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [contentEpoch, setContentEpoch] = useState(0);
  const [weather, setWeather] = useState<LocalWeather | null>(null);

  const cameraManagerRef = useRef<CameraManager | null>(null);
  const storyDetailRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<number | null>(null);
  const setStoryPanelOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    setIsLandmarkCarouselCollapsed(open);
  };
  useEffect(() => { if (initial.get('site') && !initialSite) setEntryIssue({ vi: 'Không tìm thấy địa điểm trong liên kết. Bạn có thể chọn lại trên bản đồ.', en: 'The linked place was not found. Choose another place on the map.' }); }, []);
  useEffect(() => {
    updateRoute({ site: hasUserSelectedSite ? selectedSite.id : null, detail: hasUserSelectedSite && isStoryExpanded ? '1' : null, view: hasUserSelectedSite ? isStoryExpanded ? 'detail' : 'quick' : null }, hasUserSelectedSite ? selectedSite.id : undefined, !['con-chim', 'den-tho-bac'].includes(selectedSite.id));
  }, [selectedSite.id, hasUserSelectedSite, isStoryExpanded]);
  useEffect(() => { narration.stop(); }, [selectedSite.id, isSidebarOpen, isStoryExpanded]);

  useEffect(() => {
    const controller = new AbortController();
    const loadWeather = () => {
      fetchLocalWeather(controller.signal)
        .then(setWeather)
        .catch(() => {
          // Keep the header compact when the network is unavailable; the next
          // scheduled refresh will retry without interrupting map interaction.
        });
    };
    loadWeather();
    const refreshId = window.setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      controller.abort();
      window.clearInterval(refreshId);
    };
  }, []);

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

  // Reclaim the quick view after five minutes. A full-screen interpretation
  // remains open so a visitor's reading or slideshow is never cut short.
  useEffect(() => {
    if (!hasUserSelectedSite || !isSidebarOpen || (hasOpenedStoryDetail && isStoryExpanded)) return;
    const timer = window.setTimeout(() => {
      soundscape.stopSoundscape();
      setIsSoundPlaying(false);
      setHasUserSelectedSite(false);
      setStoryPanelOpen(false);
      setIsArtifactModalOpen(false);
      setIsPanoramaOpen(false);
      setIsQRCodeOpen(false);
      setIsListDrawerOpen(false);
      setIsSessionExpired(true);
      cameraManagerRef.current?.flyToOverview();
    }, 5 * 60 * 1000);
    return () => window.clearTimeout(timer);
  }, [hasUserSelectedSite, isSidebarOpen, selectedSite.id, contentEpoch, hasOpenedStoryDetail, isStoryExpanded]);

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

  useEffect(() => {
    if (!isSidebarOpen || !hasOpenedStoryDetail) return;
    if (isSidebarOpen && isStoryExpanded) {
      storyDetailRef.current?.focus({ preventScroll: true });
    } else {
      document.querySelector<HTMLButtonElement>('[data-action="show-location-details"]')?.focus({ preventScroll: true });
    }
  }, [isSidebarOpen, isStoryExpanded, hasOpenedStoryDetail]);

  // Site selection handler
  const handleSelectSite = (site: HeritageSite) => {
    setEntryIssue(null);
    // A click acknowledges the chosen place in the same React commit. Map
    // imagery and camera motion must never hold the information panel back.
    setStoryPanelOpen(true);
    if (hasUserSelectedSite && selectedSite.id === site.id) {
      // A repeated click is an explicit camera action even though React's
      // selected-site value stays the same. Keep the story panel in place.
      setRecenterRequestId((requestId) => requestId + 1);
      resetIdleTimer();
      return;
    }
    activateSiteRoute(site.id);
    setSelectedSite(site);
    setHasUserSelectedSite(true);
    setIsStoryExpanded(false);
    setHasOpenedStoryDetail(false);
    setIsStoryWide(false);
    // Keep the reading panel open while another destination takes focus.
    if (isSoundPlaying) {
      soundscape.playSoundscape(site.soundscapeType);
    }
    resetIdleTimer();
  };

  // Zooming/panning can select a story without starting a destination flight.
  const handleMapStoryFocus = (site: HeritageSite | null) => {
    if (!site) {
      setStoryPanelOpen(false);
      return;
    }
    setSelectedSite(site);
    if (selectedSite.id !== site.id) setHasOpenedStoryDetail(false);
    setHasUserSelectedSite(true);
    setStoryPanelOpen(true);
    setIsStoryExpanded(false);
    setIsStoryWide(false);
    if (isSoundPlaying && selectedSite.id !== site.id) {
      soundscape.playSoundscape(site.soundscapeType);
    }
  };

  // Home button action: resets to overview of all landmarks
  const handleHomeClick = () => {
    setHasOpenedStoryDetail(false);
    setHasUserSelectedSite(false);
    setStoryPanelOpen(false);
    setIsStoryExpanded(false);
    setIsStoryWide(false);
    setIsListDrawerOpen(false);
  };

  // Back button action: exits focused site back to full map
  const handleBackClick = () => {
    setHasOpenedStoryDetail(false);
    setHasUserSelectedSite(false);
    setStoryPanelOpen(false);
    setIsStoryExpanded(false);
    setIsStoryWide(false);
    cameraManagerRef.current?.flyToOverview();
  };

  // Chapter camera viewpoint transition handler
  const handleChapterCameraChange = (cam: CameraChapterView) => {
    cameraManagerRef.current?.flyToChapter(cam, viewMode);
  };

  return (
    <div className={`heritage-app flex flex-col w-screen h-screen overflow-hidden bg-[#0c0e14] text-[#f4efe6] select-none${isLargeText ? ' access-large-text' : ''}${isHighContrast ? ' access-high-contrast' : ''}${isReduceMotion ? ' access-reduce-motion' : ''}`}>
      {/* Full-bleed map: only the controls move when a story opens. */}
      <div className="heritage-map-viewport relative flex-1 flex overflow-hidden" data-story-open={isSidebarOpen} data-story-wide={isStoryWide} data-story-expanded={isStoryExpanded} data-landmarks-collapsed={isLandmarkCarouselCollapsed}>
      <HeaderTopBar
        onHomeClick={handleHomeClick}
        onBackClick={handleBackClick}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (!isSiteInCategory(selectedSite, cat)) handleHomeClick();
        }}
        isSoundPlaying={isSoundPlaying}
        onToggleSound={handleToggleSound}
        lang={lang}
        onToggleLang={() => setLang(lang === 'vi' ? 'en' : 'vi')}
        isKioskFullscreen={isKioskFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenAbout={() => setIsAboutOpen(true)}
        hasActiveSelection={hasUserSelectedSite}
        onOpenSearch={() => setIsSearchOpen(true)}
        weather={weather}
      />

        {/* Left & Center: 3D Topographic Table / 2D Map */}
        <div className="relative flex-1 h-full overflow-visible">
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
            onOpenStorytelling={() => setStoryPanelOpen(true)}
            isStorytellingOpen={isSidebarOpen}
            isOccluded={isSidebarOpen && isStoryExpanded}
            isLandmarksCollapsed={isLandmarkCarouselCollapsed}
            onToggleLandmarksCollapsed={() => setIsLandmarkCarouselCollapsed((collapsed) => !collapsed)}
            onMapStoryFocus={handleMapStoryFocus}
            onHomeClick={handleHomeClick}
            hasUserSelectedSite={hasUserSelectedSite}
            isReduceMotion={isReduceMotion}
            onToolsHostReady={setMapToolsHost}
            onRegisterCameraManager={(mgr) => {
              cameraManagerRef.current = mgr;
            }}
          />
          </Suspense>

        </div>
        {/* Overlay the story without changing the map's size or camera center. */}
        {isSidebarOpen && (
          <aside data-location-view={isStoryExpanded ? 'detail' : 'quick'} className={isStoryExpanded
            ? 'fixed inset-0 z-[70] shadow-2xl'
            : 'heritage-story-panel absolute inset-y-0 right-0 z-40 shadow-2xl'}>
            <div hidden={isStoryExpanded} className="h-full">
              <LocationQuickView
                key={selectedSite.id}
                site={selectedSite}
                lang={lang}
                onPrepareDetails={() => setHasPreparedMuseumDetail(true)}
                onViewDetails={() => {
                  setHasOpenedStoryDetail(true);
                  setIsStoryExpanded(true);
                  setContentEpoch((epoch) => epoch + 1);
                }}
                onClose={() => {
                  setStoryPanelOpen(false);
                  setIsStoryExpanded(false);
                  setIsStoryWide(false);
                  setHasOpenedStoryDetail(false);
                }}
                onOpenQRCode={() => setIsQRCodeOpen(true)}
              />
            </div>
            {(hasOpenedStoryDetail || (selectedSite.id === 'bao-tang-khmer' && hasPreparedMuseumDetail)) && <div
              ref={storyDetailRef}
              className="heritage-location-detail"
              data-detail-prepared={!hasOpenedStoryDetail || undefined}
              hidden={hasOpenedStoryDetail && !isStoryExpanded}
              inert={!isStoryExpanded}
              aria-hidden={!isStoryExpanded}
              tabIndex={-1}
              role="region"
              aria-label={lang === 'vi' ? `Chi tiết ${selectedSite.name}` : `${selectedSite.englishName} details`}
              onKeyDown={(event) => {
                if (event.key !== 'Escape' || document.querySelector('dialog[open]') || isArtifactModalOpen || isPanoramaOpen || isQRCodeOpen) return;
                event.preventDefault();
                setIsStoryExpanded(false);
              }}
            >
            <Suspense fallback={<div className="flex h-full items-center justify-center bg-[#11141c] text-sm text-stone-400" role="status">{lang === 'vi' ? 'Đang mở diễn giải…' : 'Loading story…'}</div>}>
            <StorytellingPanel
              key={selectedSite.id}
              site={selectedSite}
              onOpenArtifactModal={() => setIsArtifactModalOpen(true)}
              lang={lang}
              onToggleLang={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              onClose={() => {
                setStoryPanelOpen(false);
                setIsStoryExpanded(false);
                setIsStoryWide(false);
                setHasOpenedStoryDetail(false);
              }}
              onOpenPanorama360={() => setIsPanoramaOpen(true)}
              onOpenQRCode={() => setIsQRCodeOpen(true)}
              isExpanded={isStoryExpanded}
              onToggleExpanded={() => setIsStoryExpanded((expanded) => !expanded)}
              isSidebarWide={isStoryWide}
              onSelectChapterCamera={handleChapterCameraChange}
              onContentChange={() => setContentEpoch((epoch) => epoch + 1)}
            />
            </Suspense>
            </div>}
          </aside>
        )}
      {/* 3. Bottom Landmark Dock Carousel (Floating, compact, collapsible) */}
      <LandmarkCarousel
        selectedSite={selectedSite}
        onSelectSite={handleSelectSite}
        lang={lang}
        isStoryOpen={isSidebarOpen}
        isStoryExpanded={isStoryExpanded}
        isCollapsed={isLandmarkCarouselCollapsed || (isSidebarOpen && isStoryExpanded)}
        activeCategory={selectedCategory}
      />
      </div>

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
        <LocationUtilityDialog kind="artifact" label={lang === 'vi' ? 'Khám phá hiện vật 3D' : 'Explore 3D artifact'} onClose={() => setIsArtifactModalOpen(false)}>
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-sm text-stone-300" role="status">{lang === 'vi' ? 'Đang mở hiện vật 3D…' : 'Loading 3D artifact…'}</div>}>
        <Artifact3DModal
          artifact={selectedSite.artifact}
          lang={lang}
          onClose={() => setIsArtifactModalOpen(false)}
        />
        </Suspense>
        </LocationUtilityDialog>
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
          activeCategory={selectedCategory}
        />
        </Suspense>
      )}

      {/* 8. 360Â° Panorama Immersive View Modal */}
      {isPanoramaOpen && (
        <LocationUtilityDialog kind="panorama" label={lang === 'vi' ? 'Toàn cảnh 360°' : '360° panorama'} onClose={() => setIsPanoramaOpen(false)}>
        <Suspense fallback={null}>
        <Panorama360Modal
          lang={lang}
          siteName={lang === 'vi' ? selectedSite.name : selectedSite.englishName}
          photoUrl={selectedSite.heroImage}
          caption={lang === 'vi' ? selectedSite.heroImageCaption : selectedSite.englishName}
          onClose={() => setIsPanoramaOpen(false)}
        />
        </Suspense>
        </LocationUtilityDialog>
      )}

      {/* 9. QR Code Modal (Continue on Mobile) */}
      {isQRCodeOpen && (
        <LocationUtilityDialog kind="qr" label={lang === 'vi' ? 'Mã QR địa điểm' : 'Location QR code'} onClose={() => setIsQRCodeOpen(false)}>
        <Suspense fallback={null}>
        <QRCodeModal
          site={selectedSite}
          lang={lang}
          onClose={() => setIsQRCodeOpen(false)}
        />
        </Suspense>
        </LocationUtilityDialog>
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

    <ExperienceTools siteId={isSiteId(selectedSite.id) ? selectedSite.id : 'ao-ba-om'} dockHost={isSidebarOpen && isStoryExpanded ? null : mapToolsHost} hidden={isSidebarOpen && isStoryExpanded && ['con-chim', 'den-tho-bac'].includes(selectedSite.id)} />
    </div>
  );
}
