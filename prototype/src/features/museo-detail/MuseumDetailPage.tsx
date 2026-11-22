import { useEffect, useRef, useState } from "react";
import { KHMER_MUSEUM_NAME } from "../../data/museumIdentity";
import { useAudioContentContext } from '../../audio/context';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Diamond,
  Hand,
  Landmark,
  Map,
  Mountain,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { artwork } from "./data";
import { KhmerMuseumHistory, KhmerHistoryStory } from "./KhmerMuseumHistory";
import { khmerHistoryPhases, khmerHistoryPhotos } from "./khmerHistory";
import { KhmerMuseumPlaces } from "./KhmerMuseumPlaces";
import { discoveryEntryForPlace, hasKhmerDiscoveryEntry } from "./khmerDiscovery";
import { KhmerPlaceDirectory } from "./KhmerPlaceExplorer";
import { KhmerPlaceExhibition } from "./KhmerPlaceExhibition";
import {
  khmerPlaces,
  khmerPlacePhotos,
  normalizePlaceQuery,
} from "./khmerPlaces";
import { KhmerMuseumCulture, KhmerCultureStory } from "./KhmerMuseumCulture";
import { khmerCulturePhotos, khmerCultureTopics } from "./khmerCulture";
import { KhmerMuseumLegacy, KhmerLegacyStory } from "./KhmerMuseumLegacy";
import { KhmerLegacyExhibition } from "./KhmerLegacyExhibition";
import { khmerLegacyValues, type LegacyFilter } from "./khmerLegacy";
import { KhmerMuseumOverview } from "./KhmerMuseumOverview";
import { KhmerOverviewViewer } from "./KhmerMuseumOverviewViewer";
import { khmerOverviewStories, type KhmerOverviewTopic } from "./khmerOverview";
import {
  useMuseumScreens,
  type MuseumSection,
} from "./useMuseumScreens";
import { MuseumFooter, MuseumTools } from "./MuseumChrome";
import { restoredParams, updateRoute, useRememberedState } from '../../experience/state';
import { takeMuseumOpening } from '../../utils/museumOpening';
import { warmMuseumPanoramas } from './museumMediaCache';
import "./museo.css";
import "../../components/conChimFonts.css";
import "./screen-layout.css";
import "./khmer-overview.css";
import "./khmer-places.css";
import "./khmer-history.css";
import "./khmer-culture.css";
import "./khmer-legacy.css";
import "./museum-motion.css";
import "./khmer-overview-viewer.css";
import "./khmer-place-exhibition.css";
import "./khmer-history-motion.css";
import "./khmer-culture-motion.css";
import "./khmer-legacy-motion.css";
import "./museum-chrome.css";
import "./khmer-legacy-exhibition.css";
import "./khmer-discovery.css";
import "./khmer-culture-hub.css";
import "./khmer-culture-exhibit.css";

type Section = MuseumSection;
type Modal = {
  kind:
    | "search"
    | "visit"
    | "story"
    | "place"
    | "place-index"
    | "overview"
    | "history"
    | "culture"
    | "legacy";
  legacyValueId?: string;
  legacyOrigin?: HTMLElement;
  cultureTopicId?: string;
  historyPhaseId?: string;
  historyTopicId?: string;
  overviewTopic?: KhmerOverviewTopic;
  overviewPhotoIndex?: number;
  overviewOrigin?: HTMLElement;
  placeId?: string;
  placeOrigin?: HTMLElement;
  title?: string;
  text?: string;
  photo?: string;
  context?: string;
  source?: { title: string; url: string };
};
interface Props {
  lang?: "vi" | "en";
  onClose?: () => void;
  isExpanded?: boolean;
  isSidebarWide?: boolean;
  onToggleExpanded?: () => void;
  onToggleSidebarWide?: () => void;
  onOpenQRCode?: () => void;
  onContentChange?: () => void;
}

function MuseumDialog({
  modal,
  close,
  navigate,
  lang,
}: {
  modal: Modal;
  close: () => void;
  navigate: (section: Section, item?: string) => void;
  lang: "vi" | "en";
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef(
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(false);
  const [cultureReading, setCultureReading] = useState(modal.cultureTopicId);
  const [legacyReading, setLegacyReading] = useState(modal.legacyValueId);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      if (element?.open) element.close();
      if (
        modal.kind === "legacy" &&
        (!trigger.current?.isConnected || trigger.current.closest("[hidden]"))
      ) {
        const target =
          document.querySelector<HTMLElement>(
            ".md-section:not([hidden]) .md-exhibition-card.is-current",
          ) ?? document.querySelector<HTMLElement>(".md-section:not([hidden])");
        target?.focus({ preventScroll: true });
      } else trigger.current?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (modal.kind !== "culture" && modal.kind !== "legacy") return;
    const element = dialog.current;
    if (element) element.scrollTop = 0;
    element
      ?.querySelector<HTMLElement>("#md-dialog-title")
      ?.focus({ preventScroll: true });
  }, [modal.kind, cultureReading, legacyReading]);
  const results = [
    ...khmerPlaces.map((place) => ({
      name: place.title[lang],
      description: place.short[lang],
      section: "map" as Section,
      photo: khmerPlacePhotos[place.gallery[0]].src,
      item: place.id,
    })),
    ...khmerHistoryPhases.flatMap((phase) =>
      phase.topics.map((topic) => ({
        name: topic.title[lang],
        description: `${topic.date[lang]} · ${topic.summary[lang]}`,
        section: "timeline" as Section,
        photo: khmerHistoryPhotos[topic.photo].src,
        item: phase.id,
      })),
    ),
    ...khmerCultureTopics.map((topic) => ({
      name: topic.title[lang],
      description: topic.summary[lang],
      section: "tour" as Section,
      photo: khmerCulturePhotos[topic.gallery[0]].src,
      item: topic.id,
    })),
    ...khmerLegacyValues.flatMap((value) => [
      {
        name: value.title[lang],
        description: value.summary[lang],
        section: "exhibitions" as Section,
        photo: khmerCulturePhotos[value.gallery[0]].src,
        item: value.id,
      },
      ...value.chapters.map((chapter) => ({
        name: chapter.title[lang],
        description: `${value.title[lang]} · ${chapter.paragraphs[0][lang]}`,
        section: "exhibitions" as Section,
        photo: khmerCulturePhotos[value.gallery[0]].src,
        item: value.id,
      })),
    ]),
  ].filter((item) =>
    normalizePlaceQuery(`${item.name} ${item.description}`).includes(
      normalizePlaceQuery(query),
    ),
  );
  return (
    <dialog
      className={`md-dialog${modal.kind === "place" ? " md-dialog-site md-khmer-place-dialog" : ""}${modal.kind === "place-index" ? " md-dialog-site md-dialog-places" : ""}${modal.kind === "overview" ? " md-dialog-overview" : ""}${modal.kind === "history" ? " md-dialog-overview md-dialog-history" : ""}${modal.kind === "culture" ? " md-dialog-overview md-dialog-culture" : ""}${modal.kind === "legacy" ? " md-dialog-overview md-dialog-legacy" : ""}`}
      ref={dialog}
      aria-labelledby="md-dialog-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="md-dialog-content">
        <button
          className="md-dialog-close"
          type="button"
          aria-label={
            [
              "overview",
              "place",
              "place-index",
              "history",
              "culture",
              "legacy",
            ].includes(modal.kind) && lang === "vi"
              ? "Đóng thông tin bảo tàng"
              : "Close dialog"
          }
          onClick={close}
        >
          <X />
        </button>
        {modal.kind === "place-index" && (
          <KhmerPlaceDirectory
            lang={lang}
            onSelect={(id) => {
              close();
              navigate("map", id);
            }}
          />
        )}
        {modal.kind === "history" && (
          <KhmerHistoryStory
            phaseId={modal.historyPhaseId}
            topicId={modal.historyTopicId}
            lang={lang}
          />
        )}
        {modal.kind === "culture" && (
          <KhmerCultureStory
            topicId={cultureReading}
            lang={lang}
            onRead={(id) => {
              if (!cultureReading) {
                close();
                navigate("tour", id);
                return;
              }
              navigate("tour", id);
              // The dialog stays open while selecting another reading topic.
              setCultureReading(id);
            }}
          />
        )}
        {modal.kind === "legacy" && (
          <KhmerLegacyStory
            valueId={legacyReading}
            lang={lang}
            onRead={(id) => {
              navigate("exhibitions", id);
              setLegacyReading(id);
            }}
            onExplore={(section, item) => {
              close();
              navigate(section, item);
            }}
          />
        )}
        {modal.kind === "search" && (
          <>
            <span className="md-eyebrow">
              {lang === "vi" ? "KHÁM PHÁ BẢO TÀNG" : "EXPLORE THE MUSEUM"}
            </span>
            <h2 id="md-dialog-title">
              {lang === "vi" ? "Tìm trong bảo tàng" : "Search the museum"}
            </h2>
            <label className="md-search-field">
              <Search />
              <input
                autoFocus
                type="search"
                aria-label={
                  lang === "vi"
                    ? "Tìm điểm đến và trưng bày"
                    : "Search places and exhibitions"
                }
                placeholder={
                  lang === "vi"
                    ? "Điểm đến, chủ đề, trưng bày…"
                    : "Places, topics, exhibitions…"
                }
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="md-search-results">
              {results.length ? (
                results.map((result) => (
                  <button
                    key={result.name}
                    type="button"
                    onClick={() => {
                      close();
                      navigate(result.section, result.item);
                    }}
                  >
                    <img src={result.photo} alt="" />
                    <span>
                      <strong>{result.name}</strong>
                      <small>{result.description}</small>
                    </span>
                    <ArrowRight />
                  </button>
                ))
              ) : (
                <p>
                  {lang === "vi"
                    ? "Chưa có kết quả. Thử tìm “Chùa Âng”, “ngũ âm” hoặc “hiện vật”."
                    : "No results. Try “Ang Pagoda”, “Pinpeat” or “objects”."}
                </p>
              )}
            </div>
          </>
        )}
        {modal.kind === "visit" && (
          <>
            <span className="md-eyebrow">MUSEO</span>
            <h2 id="md-dialog-title">Plan your visit</h2>
            {saved ? (
              <div className="md-visit-saved">
                <Landmark />
                <h3>Your visit is saved</h3>
                <p>
                  Explore the museum map and exhibitions while you prepare for
                  your visit.
                </p>
                <button
                  className="md-button md-button-primary"
                  type="button"
                  onClick={() => {
                    close();
                    navigate("map");
                  }}
                >
                  EXPLORE THE MAP <ArrowRight />
                </button>
              </div>
            ) : (
              <form
                className="md-visit-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const values = Object.fromEntries(
                    new FormData(event.currentTarget),
                  );
                  try {
                    localStorage.setItem("museo-visit", JSON.stringify(values));
                  } catch {
                    /* The visit can still be reviewed when storage is unavailable. */
                  }
                  setSaved(true);
                }}
              >
                <p>
                  Choose a day and the number of visitors for your museum visit.
                </p>
                <label>
                  Visit date
                  <input name="date" type="date" required />
                </label>
                <label>
                  Visitors
                  <select name="visitors" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <option key={number} value={number}>
                        {number} {number === 1 ? "visitor" : "visitors"}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="md-button md-button-primary" type="submit">
                  SAVE VISIT <ArrowRight />
                </button>
              </form>
            )}
          </>
        )}
        {modal.kind === "story" && (
          <>
            {modal.photo && (
              <img
                className="md-story-photo"
                src={artwork(modal.photo)}
                alt={modal.title || ""}
              />
            )}
            <span className="md-eyebrow">
              {modal.context || "EXPLORE THE COLLECTION"}
            </span>
            <h2 id="md-dialog-title">{modal.title}</h2>
            <p className="md-story-text">{modal.text}</p>
            {modal.source && (
              <a
                className="md-story-source"
                href={modal.source.url}
                target="_blank"
                rel="noreferrer"
              >
                {modal.source.title} <ArrowRight />
              </a>
            )}
          </>
        )}
      </div>
    </dialog>
  );
}

export function MuseumDetailPage({
  lang = "vi",
  onClose,
  isExpanded,
  onToggleExpanded,
  onOpenQRCode,
  onContentChange,
}: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = window.setTimeout(warmMuseumPanoramas, 650);
    return () => clearTimeout(timer);
  }, []);
  const initial = restoredParams('bao-tang-khmer');
  const placeId = khmerPlaces.find(place => place.id === initial.get('place'))?.id || 'entrance';
  const cultureId = khmerCultureTopics.find(topic => topic.id === initial.get('culture'))?.id || 'pagoda';
  const legacyId = khmerLegacyValues.find(value => value.id === initial.get('value'))?.id;
  const phaseIndex = Number(initial.get('phase'));
  const [selectedPlaceId, setSelectedPlaceId] = useRememberedState('museum:place', placeId, initial.has('place'));
  const [selectedHistoryPhase, setSelectedHistoryPhase] = useRememberedState('museum:phase', Number.isInteger(phaseIndex) && phaseIndex >= 0 && phaseIndex < khmerHistoryPhases.length ? phaseIndex : 0, initial.has('phase'));
  const [selectedCultureId, setSelectedCultureId] = useRememberedState('museum:culture', cultureId, initial.has('culture'));
  const [legacyFilter, setLegacyFilter] = useRememberedState<LegacyFilter>('museum:legacyFilter', 'all');
  const [selectedLegacyId, setSelectedLegacyId] = useRememberedState<string | undefined>('museum:value', legacyId, initial.has('value'));
  const [modal, setModal] = useState<Modal | null>(() => {
    const reader = initial.get('reader');
    if (reader === 'place') return { kind: 'place', placeId };
    if (reader === 'legacy' && legacyId) return { kind: 'legacy', legacyValueId: legacyId };
    if (reader === 'culture') return { kind: 'culture', cultureTopicId: cultureId };
    if (reader === 'history') { const phase = khmerHistoryPhases[Number.isInteger(phaseIndex) && phaseIndex >= 0 && phaseIndex < khmerHistoryPhases.length ? phaseIndex : 0]; return { kind: 'history', historyPhaseId: phase?.id, historyTopicId: phase?.topics.find(topic => topic.id === initial.get('topic'))?.id }; }
    if (reader === 'overview') return { kind: 'overview', overviewTopic: initial.get('overview') && initial.get('overview')! in khmerOverviewStories ? initial.get('overview') as KhmerOverviewTopic : 'introduction' };
    return null;
  });
  useEffect(() => { updateRoute({ place: selectedPlaceId, phase: selectedHistoryPhase, culture: selectedCultureId, value: selectedLegacyId, reader: modal?.kind, topic: modal?.historyTopicId }, 'bao-tang-khmer'); }, [selectedPlaceId, selectedHistoryPhase, selectedCultureId, selectedLegacyId, modal?.kind, modal?.historyTopicId]);
  const { activeSection, showSection } = useMuseumScreens(
    viewport,
    !modal,
    onContentChange,
    isExpanded !== false,
  );
  const modalPlace = modal?.placeId ?? selectedPlaceId;
  const audioPlaceEntry = discoveryEntryForPlace(modalPlace);
  const audioPlaceObject = audioPlaceEntry.entry.objects.find(object => object.placeId === modalPlace);
  const audioPlaceId = !hasKhmerDiscoveryEntry(modalPlace) ? `bao-tang-khmer:record:${modalPlace}`
    : audioPlaceObject ? `bao-tang-khmer:object:${audioPlaceEntry.entry.id}:${audioPlaceObject.id}`
    : `bao-tang-khmer:place:${audioPlaceEntry.tab.id}:${audioPlaceEntry.entry.id}`;
  const audioContentId = modal?.kind === 'overview' ? `bao-tang-khmer:overview:${modal.overviewTopic ?? 'introduction'}`
    : modal?.kind === 'place' ? audioPlaceId
    : modal?.kind === 'culture' ? `bao-tang-khmer:culture:${modal.cultureTopicId ?? selectedCultureId}`
    : modal?.kind === 'legacy' ? `bao-tang-khmer:value:${modal.legacyValueId ?? selectedLegacyId}`
    : modal?.kind === 'history' && modal.historyTopicId ? `bao-tang-khmer:history:${modal.historyTopicId}`
    : activeSection === 'overview' ? 'bao-tang-khmer'
    : `bao-tang-khmer:section:${activeSection}`;
  useAudioContentContext(audioContentId, activeSection !== 'map' && activeSection !== 'tour' || !!modal);
  // Open directly on the requested screen. Visited rooms retain their state.
  const [mountedScreens, setMountedScreens] = useState<Set<Section>>(
    () => new Set([activeSection]),
  );
  useEffect(() => { if (isExpanded !== false) takeMuseumOpening()?.dispose(); }, [isExpanded]);
  useEffect(() => {
    setMountedScreens((previous) =>
      previous.has(activeSection)
        ? previous
        : new Set([...previous, activeSection]),
    );
  }, [activeSection]);
  const vi = lang === "vi";
  const changed = () => onContentChange?.();
  const navigate = (section: Section, item?: string) => {
    if (item && section === "map") {
      const place = khmerPlaces.find(
        (point) => point.id === item || point.title[lang] === item,
      );
      if (place) {
        // Keep linked-site and unlocated-object stories accessible without
        // assigning them a viewpoint, room or floor that has not been supplied.
        if (!hasKhmerDiscoveryEntry(place.id)) {
          changed();
          setModal({ kind: "place", placeId: place.id });
          showSection(section);
          return;
        }
        setSelectedPlaceId(place.id);
      }
    }
    if (item && section === "exhibitions") {
      const value = khmerLegacyValues.find((entry) => entry.id === item);
      if (value) {
        setSelectedLegacyId(value.id);
        setLegacyFilter(value.group);
      }
    }
    if (item && section === "timeline") {
      const index = khmerHistoryPhases.findIndex((phase) => phase.id === item);
      if (index >= 0) setSelectedHistoryPhase(index);
    }
    if (
      item &&
      section === "tour" &&
      khmerCultureTopics.some((topic) => topic.id === item)
    )
      setSelectedCultureId(item);
    showSection(section);
  };
  const openModal = (value: Modal) => {
    changed();
    updateRoute({ chapter: null, photo: value.kind === 'overview' ? value.overviewPhotoIndex ?? null : null, anchorId: null, anchorOffset: null, ...(value.kind === 'overview' ? { overview: value.overviewTopic } : {}) }, 'bao-tang-khmer');
    if (value.placeId) setSelectedPlaceId(value.placeId);
    if (value.cultureTopicId) setSelectedCultureId(value.cultureTopicId);
    if (value.legacyValueId) setSelectedLegacyId(value.legacyValueId);
    setModal(value);
  };
  return (
    <div className="md-root" aria-label={KHMER_MUSEUM_NAME[lang]}>
      <a
        className="md-skip-link"
        href="#museo-overview"
        onClick={(event) => {
          event.preventDefault();
          showSection("overview", true);
        }}
      >
        {vi ? "Đến phần tổng quan bảo tàng" : "Skip to the museum overview"}
      </a>
      <div className="md-scroll" ref={viewport}>
        <main className="md-main" lang={lang}>
          {mountedScreens.has("overview") || activeSection === "overview" ? (
            <KhmerMuseumOverview
              lang={lang}
              active={activeSection === "overview" && isExpanded !== false}
              onRead={(overviewTopic, overviewOrigin, overviewPhotoIndex) =>
                openModal({ kind: "overview", overviewTopic, overviewOrigin, overviewPhotoIndex })
              }
              onContentChange={changed}
            />
          ) : (
            <section
              className="md-section md-deferred-screen"
              id="museo-overview"
              hidden
              aria-hidden="true"
            />
          )}

          {mountedScreens.has("map") || activeSection === "map" ? (
            <KhmerMuseumPlaces
              lang={lang}
              active={activeSection === "map" && isExpanded !== false}
              selectedId={selectedPlaceId}
              onSelect={(id) => {
                changed();
                setSelectedPlaceId(id);
              }}
              onExplore={(placeId, placeOrigin) =>
                openModal({ kind: "place", placeId, placeOrigin })
              }
              onDirectory={() => openModal({ kind: "place-index" })}
            />
          ) : (
            <section
              className="md-section md-deferred-screen"
              id="museo-map"
              hidden
              aria-hidden="true"
            />
          )}

          {mountedScreens.has("timeline") || activeSection === "timeline" ? (
            <KhmerMuseumHistory
              lang={lang}
              active={activeSection === "timeline" && isExpanded !== false}
              selectedPhase={selectedHistoryPhase}
              onSelect={(index) => {
                changed();
                setSelectedHistoryPhase(index);
              }}
              onRead={(historyPhaseId, historyTopicId) =>
                openModal({ kind: "history", historyPhaseId, historyTopicId })
              }
            />
          ) : (
            <section
              className="md-section md-deferred-screen"
              id="museo-timeline"
              hidden
              aria-hidden="true"
            />
          )}

          {mountedScreens.has("tour") || activeSection === "tour" ? (
            <KhmerMuseumCulture
              lang={lang}
              active={activeSection === "tour" && isExpanded !== false}
              obscured={Boolean(modal)}
              selectedId={selectedCultureId}
              onSelect={(id) => {
                changed();
                setSelectedCultureId(id);
              }}
              onRead={(id) =>
                openModal({ kind: "culture", cultureTopicId: id })
              }
            />
          ) : (
            <section
              className="md-section md-deferred-screen"
              id="museo-tour"
              hidden
              aria-hidden="true"
            />
          )}

          {mountedScreens.has("exhibitions") ||
          activeSection === "exhibitions" ? (
            <KhmerMuseumLegacy
              active={activeSection === "exhibitions" && isExpanded !== false}
              obscured={Boolean(modal)}
              lang={lang}
              filter={legacyFilter}
              selectedId={selectedLegacyId}
              onFilter={(value) => {
                changed();
                setLegacyFilter(value);
                setSelectedLegacyId(undefined);
              }}
              onRead={(id, legacyOrigin) => {
                setSelectedLegacyId(id);
                openModal({ kind: "legacy", legacyValueId: id, legacyOrigin });
              }}
            />
          ) : (
            <section
              className="md-section md-deferred-screen"
              id="museo-exhibitions"
              hidden
              aria-hidden="true"
            />
          )}
        </main>
      </div>
      <MuseumFooter active={activeSection} lang={lang} navigate={navigate} />
      <MuseumTools lang={lang} onClose={onClose} onOpenQRCode={onOpenQRCode} onToggleExpanded={onToggleExpanded} isExpanded={isExpanded} />
      {modal?.kind === "overview" ? (
        <KhmerOverviewViewer
          initialTopic={modal.overviewTopic ?? "introduction"}
          initialPhotoIndex={modal.overviewPhotoIndex}
          origin={modal.overviewOrigin}
          lang={lang}
          close={() => setModal(null)}
        />
      ) : modal?.kind === "place" ? (
        <KhmerPlaceExhibition
          placeId={modal.placeId ?? "entrance"}
          origin={modal.placeOrigin}
          lang={lang}
          close={() => setModal(null)}
          onSelect={(id) => {
            changed();
            if (hasKhmerDiscoveryEntry(id)) setSelectedPlaceId(id);
          }}
        />
      ) : modal?.kind === "legacy" ? (
        <KhmerLegacyExhibition
          valueId={modal.legacyValueId ?? "memory"}
          origin={modal.legacyOrigin}
          lang={lang}
          close={() => setModal(null)}
          onSelect={setSelectedLegacyId}
          onExplore={navigate}
        />
      ) : (
        modal && (
          <MuseumDialog
            lang={lang}
            modal={modal}
            close={() => setModal(null)}
            navigate={navigate}
          />
        )
      )}
    </div>
  );
}
