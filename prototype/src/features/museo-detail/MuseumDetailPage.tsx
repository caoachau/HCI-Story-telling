import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Diamond,
  Expand,
  Flame,
  Globe2,
  Hand,
  Home,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Mountain,
  Pause,
  Play,
  QrCode,
  ScrollText,
  Search,
  Shield,
  Shrink,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { artwork, eras, exhibitions, scenes } from "./data";
import { KhmerMuseumPlaces } from "./KhmerMuseumPlaces";
import { KhmerPlaceExplorer, KhmerPlaceDirectory } from "./KhmerPlaceExplorer";
import {
  khmerPlaces,
  khmerPlacePhotos,
  normalizePlaceQuery,
} from "./khmerPlaces";
import { TourPhotoDrawer } from "./TourPhotoDrawer";
import { TourGalleryStrip } from "./TourGalleryStrip";
import { KhmerMuseumOverview, KhmerOverviewStory } from "./KhmerMuseumOverview";
import type { KhmerOverviewTopic } from "./khmerOverview";
import {
  museumScreens,
  useMuseumScreens,
  type MuseumSection,
} from "./useMuseumScreens";
import "./museo.css";
import "./screen-layout.css";
import "./khmer-overview.css";
import "./khmer-places.css";

type Section = MuseumSection;
type Modal = {
  kind:
    | "search"
    | "visit"
    | "tour"
    | "story"
    | "place"
    | "place-index"
    | "overview";
  overviewTopic?: KhmerOverviewTopic;
  placeId?: string;
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

function RoundButton({
  children,
  label,
  onClick,
  filled = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  filled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`md-round${filled ? " md-round-filled" : ""}`}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  );
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
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      if (element?.open) element.close();
      trigger.current?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(
      () => setScene((value) => (value + 1) % scenes.length),
      4000,
    );
    return () => window.clearInterval(interval);
  }, [playing]);
  const results = [
    ...khmerPlaces.map((place) => ({
      name: place.title[lang],
      description: place.short[lang],
      section: "map" as Section,
      photo: khmerPlacePhotos[place.gallery[0]].src,
      item: place.id,
    })),
    ...exhibitions.map((item) => ({
      name: item.title,
      description: item.description,
      section: "exhibitions" as Section,
      photo: artwork(item.photo),
      item: item.title,
    })),
  ].filter((item) =>
    normalizePlaceQuery(`${item.name} ${item.description}`).includes(
      normalizePlaceQuery(query),
    ),
  );
  return (
    <dialog
      className={`md-dialog${modal.kind === "tour" ? " md-dialog-tour" : ""}${modal.kind === "place" ? " md-dialog-site md-khmer-place-dialog" : ""}${modal.kind === "place-index" ? " md-dialog-site md-dialog-places" : ""}${modal.kind === "overview" ? " md-dialog-overview" : ""}`}
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
            ["overview", "place", "place-index"].includes(modal.kind) &&
            lang === "vi"
              ? "Đóng thông tin bảo tàng"
              : "Close dialog"
          }
          onClick={close}
        >
          <X />
        </button>
        {modal.kind === "place" && (
          <KhmerPlaceExplorer
            placeId={modal.placeId ?? "entrance"}
            lang={lang}
            close={close}
            onSelect={(id) => {
              close();
              navigate("map", id);
            }}
          />
        )}
        {modal.kind === "place-index" && (
          <KhmerPlaceDirectory
            lang={lang}
            onSelect={(id) => {
              close();
              navigate("map", id);
            }}
          />
        )}
        {modal.kind === "overview" && (
          <KhmerOverviewStory
            topic={modal.overviewTopic ?? "introduction"}
            lang={lang}
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
        {modal.kind === "tour" && (
          <>
            <span className="md-eyebrow">CHAUVET CAVE</span>
            <h2 id="md-dialog-title">Virtual tour</h2>
            <img
              className="md-tour-dialog-photo"
              src={artwork(scenes[scene].background)}
              alt={scenes[scene].description}
            />
            <div className="md-tour-dialog-caption">
              <div>
                <h3>{scenes[scene].name}</h3>
                <p>{scenes[scene].description}</p>
              </div>
              <span>{String(scene + 1).padStart(2, "0")} / 06</span>
            </div>
            <div className="md-tour-dialog-controls">
              <RoundButton
                label="Previous tour scene"
                onClick={() =>
                  setScene(
                    (value) => (value + scenes.length - 1) % scenes.length,
                  )
                }
              >
                <ChevronLeft />
              </RoundButton>
              <button
                className="md-button"
                type="button"
                aria-pressed={playing}
                onClick={() => setPlaying(!playing)}
              >
                {playing ? <Pause /> : <Play />}
                {playing ? "PAUSE TOUR" : "PLAY TOUR"}
              </button>
              <RoundButton
                label="Next tour scene"
                onClick={() => setScene((value) => (value + 1) % scenes.length)}
              >
                <ChevronRight />
              </RoundButton>
            </div>
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
  isSidebarWide,
  onToggleExpanded,
  onToggleSidebarWide,
  onOpenQRCode,
  onContentChange,
}: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedPlaceId, setSelectedPlaceId] = useState("entrance");
  const [selectedEra, setSelectedEra] = useState(0);
  const [selectedScene, setSelectedScene] = useState(0);
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState<Modal | null>(null);
  const { activeSection, showSection } = useMuseumScreens(
    viewport,
    !modal,
    onContentChange,
  );
  const screenIndex = museumScreens.findIndex(
    (screen) => screen.id === activeSection,
  );
  const vi = lang === "vi";
  const changed = () => onContentChange?.();
  const navigate = (section: Section, item?: string) => {
    if (item && section === "map") {
      const place = khmerPlaces.find(
        (point) => point.id === item || point.title[lang] === item,
      );
      if (place) setSelectedPlaceId(place.id);
    }
    if (item && section === "exhibitions") setFilter("All");
    showSection(section);
  };
  const openModal = (value: Modal) => {
    changed();
    setModal(value);
  };
  const era = eras[selectedEra];
  const filteredExhibitions = exhibitions.filter(
    (item) => filter === "All" || item.category === filter,
  );
  const heroSlides = [
    {
      photo: "hero-skull",
      alt: "Ancient fossil skull on dark volcanic stone",
    },
    {
      photo: "exhibition-tools",
      alt: "Prehistoric stone tools",
    },
    {
      photo: "exhibition-environment",
      alt: "Prehistoric landscape and early human habitats",
    },
    {
      photo: "exhibition-legacy",
      alt: "Ancient landscape illuminated by warm sunlight",
    },
  ];
  const showStory = (title: string, text: string, photo: string) =>
    openModal({ kind: "story", title, text, photo });
  const setHero = (value: number) => {
    changed();
    setHeroSlide((value + heroSlides.length) % heroSlides.length);
  };
  return (
    <div className="md-root" aria-label="Bảo tàng văn hóa Khmer · MUSEO">
      <a
        className="md-skip-link"
        href="#museo-overview"
        onClick={(event) => {
          event.preventDefault();
          navigate("overview");
          requestAnimationFrame(() =>
            viewport.current
              ?.querySelector<HTMLElement>("#museo-overview")
              ?.focus({ preventScroll: true }),
          );
        }}
      >
        Skip to site overview
      </a>
      <div className="md-scroll" ref={viewport}>
        <main className="md-main" lang="en">
          <section
            className="md-section md-hero md-framed"
            id="museo-hero"
            hidden={activeSection !== "hero"}
            tabIndex={-1}
            aria-label="Ancient prehistory"
          >
            <div className="md-frame">
              <img
                className="md-hero-art"
                src={artwork(heroSlides[heroSlide].photo)}
                alt={heroSlides[heroSlide].alt}
                fetchPriority="high"
              />
              <div className="md-hero-copy">
                <h1 className="md-display">
                  ANCIENT
                  <br />
                  PRE
                  <br />
                  HISTORY
                </h1>
                <p className="md-eyebrow">HUMANITY BEFORE HISTORY</p>
                <p className="md-mono md-hero-description">
                  Explore the origins of humankind through real artifacts,
                  <br className="md-desktop-break" /> immersive reconstructions
                  and interactive stories. Discover
                  <br className="md-desktop-break" /> how early humans lived,
                  adapted and shaped the world.
                </p>
                <button
                  className="md-play-link"
                  type="button"
                  onClick={() => navigate("overview")}
                >
                  <span>
                    <Play fill="currentColor" />
                  </span>
                  LEARN MORE
                </button>
              </div>
              <nav
                className="md-chapter-dock"
                lang="vi"
                aria-label="Các phần của trang"
              >
                {(
                  [
                    {
                      icon: Home,
                      label: "GIỚI THIỆU CHUNG",
                      section: "overview",
                    },
                    { icon: MapPin, label: "ĐIỂM THAM QUAN", section: "map" },
                    {
                      icon: ScrollText,
                      label: "DÒNG CHẢY LỊCH SỬ",
                      section: "timeline",
                    },
                    {
                      icon: Leaf,
                      label: "VĂN HÓA & CẢNH QUAN",
                      section: "tour",
                    },
                    {
                      icon: Shield,
                      label: "GIÁ TRỊ NỔI BẬT",
                      section: "exhibitions",
                    },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.section}
                    type="button"
                    onClick={() => navigate(item.section)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div
                className="md-hero-context"
                aria-label="Ways to explore human origins"
              >
                {[
                  {
                    photo: "era-paleolithic",
                    title: "Fossil evidence",
                    text: "Meet the people behind the human story.",
                  },
                  {
                    photo: "stone-tool",
                    title: "Stone technology",
                    text: "Explore the ideas behind early toolmaking.",
                  },
                  {
                    photo: "bison-art",
                    title: "Cave expression",
                    text: "Look closer at art, marks and imagination.",
                  },
                ].map((item) => (
                  <article key={item.title}>
                    <img src={artwork(item.photo)} alt="" loading="lazy" />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="md-hero-arrows">
                <RoundButton
                  label="Previous hero slide"
                  onClick={() => setHero(heroSlide - 1)}
                >
                  <ChevronLeft />
                </RoundButton>
                <RoundButton
                  label="Next hero slide"
                  filled
                  onClick={() => setHero(heroSlide + 1)}
                >
                  <ChevronRight />
                </RoundButton>
              </div>
              <nav className="md-hero-bottom" aria-label="Featured themes">
                <span className="md-slide-count">
                  0{heroSlide + 1} / 04
                  <i />
                </span>
                {[
                  "THE FIRST HUMANS",
                  "TOOLS AND INNOVATION",
                  "LIFE AND ENVIRONMENT",
                  "LEGACY TODAY",
                ].map((title, index) => (
                  <button
                    key={title}
                    type="button"
                    aria-pressed={heroSlide === index}
                    onClick={() => setHero(index)}
                  >
                    {title}
                  </button>
                ))}
              </nav>
            </div>
          </section>

          <KhmerMuseumOverview
            lang={lang}
            active={activeSection === "overview"}
            onRead={(overviewTopic) =>
              openModal({ kind: "overview", overviewTopic })
            }
            onContentChange={changed}
          />

          <KhmerMuseumPlaces
            lang={lang}
            active={activeSection === "map"}
            selectedId={selectedPlaceId}
            onSelect={(id) => {
              changed();
              setSelectedPlaceId(id);
            }}
            onExplore={(placeId) => openModal({ kind: "place", placeId })}
            onDirectory={() => openModal({ kind: "place-index" })}
          />

          <section
            className="md-section md-timeline md-framed"
            id="museo-timeline"
            hidden={activeSection !== "timeline"}
            tabIndex={-1}
            aria-labelledby="md-timeline-title"
          >
            <div className="md-frame">
              <div className="md-evolution-top">
                <img
                  src={artwork("evolution-skull")}
                  className="md-evolution-art"
                  alt="Ancient human skull and prehistoric painted figures"
                  loading="lazy"
                />
                <div className="md-evolution-copy">
                  <span className="md-eyebrow">HUMAN EVOLUTION</span>
                  <h2 className="md-display" id="md-timeline-title">
                    <span className="md-journey-lead">A JOURNEY</span>
                    <span className="md-journey-line">
                      THROUGH <span>TIME</span>
                    </span>
                  </h2>
                  <p className="md-mono">
                    From early hominins to modern humans, explore <br />
                    the key milestones, environments and innovations <br />
                    that shaped our species.
                  </p>
                  <button
                    className="md-play-link"
                    type="button"
                    onClick={() => openModal({ kind: "tour" })}
                  >
                    <span>
                      <Play fill="currentColor" />
                    </span>
                    WATCH OVERVIEW
                  </button>
                </div>
                <aside className="md-evolution-note">
                  PEOPLE
                  <br />
                  PLACES
                  <br />
                  CLIMATE
                  <br />
                  INNOVATION
                  <hr />A DEEPER
                  <br />
                  UNDERSTANDING
                  <br />
                  OF WHAT
                  <br />
                  MAKES US HUMAN.
                </aside>
              </div>
              <div
                className="md-era-track"
                aria-label="Human evolution timeline"
              >
                {eras.map((item, index) => (
                  <button
                    key={item.name}
                    className={selectedEra === index ? "is-selected" : ""}
                    type="button"
                    aria-pressed={selectedEra === index}
                    onClick={() => {
                      changed();
                      setSelectedEra(index);
                    }}
                  >
                    <span className="md-era-photo">
                      <img src={artwork(item.photo)} alt="" loading="lazy" />
                    </span>
                    <strong>{item.name}</strong>
                    <span>{item.range}</span>
                    <small>{item.subtitle}</small>
                  </button>
                ))}
                <RoundButton
                  label="Next period"
                  onClick={() => {
                    changed();
                    setSelectedEra((selectedEra + 1) % eras.length);
                  }}
                >
                  <ChevronRight />
                </RoundButton>
              </div>
              <div className="md-era-detail">
                <div className="md-era-story">
                  <img
                    className="md-era-scene"
                    src={artwork(era.scene)}
                    alt={era.subtitle}
                    loading="lazy"
                  />
                  <div className="md-era-detail-copy">
                    <div className="md-era-pagination">
                      <span>0{selectedEra + 1} / 05</span>
                      <RoundButton
                        label="Previous period"
                        onClick={() => {
                          changed();
                          setSelectedEra(
                            (selectedEra + eras.length - 1) % eras.length,
                          );
                        }}
                      >
                        <ChevronLeft />
                      </RoundButton>
                      <RoundButton
                        label="Next period detail"
                        onClick={() => {
                          changed();
                          setSelectedEra((selectedEra + 1) % eras.length);
                        }}
                      >
                        <ChevronRight />
                      </RoundButton>
                    </div>
                    <h3 className="md-display">{era.name}</h3>
                    <p className="md-eyebrow">{era.range}</p>
                    <p className="md-eyebrow md-era-kicker">{era.kicker}</p>
                    <p className="md-mono md-era-description">
                      {era.description}
                    </p>
                    <p className="md-mono md-era-preview">
                      {era.preview}{" "}
                      <button
                        type="button"
                        onClick={() =>
                          showStory(era.name, era.description, era.scene)
                        }
                      >
                        Read more <ArrowRight />
                      </button>
                    </p>
                    <div className="md-era-facts">
                      {[
                        {
                          icon: Compass,
                          title: (
                            <>
                              FIRST STONE
                              <br />
                              TOOLS
                            </>
                          ),
                          text: "~2.6M BCE",
                        },
                        {
                          icon: Flame,
                          title: (
                            <>
                              CONTROL
                              <br />
                              OF FIRE
                            </>
                          ),
                          text: "~1M BCE",
                        },
                        {
                          icon: Users,
                          title: (
                            <>
                              SMALL
                              <br />
                              GROUPS
                            </>
                          ),
                          text: "HUNTER-GATHERERS",
                        },
                        {
                          icon: Globe2,
                          title: (
                            <>
                              CHANGING
                              <br />
                              CLIMATE
                            </>
                          ),
                          text: "ICE AGES",
                        },
                      ].map((item, index) => (
                        <div key={index}>
                          <item.icon />
                          <strong>{item.title}</strong>
                          <small>{item.text}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md-africa-caption">
                    <Mountain />
                    <span>
                      <strong>AFRICA</strong>
                      <small>RIFT VALLEY, ~1.8M BCE</small>
                    </span>
                  </div>
                </div>
                <aside
                  className="md-era-highlights"
                  aria-label={`${era.name} highlights`}
                >
                  <div className="md-era-highlights-heading">
                    <span>{era.name}</span>
                    <small>{era.highlights.length} TOPICS</small>
                  </div>
                  <div
                    key={era.name}
                    className="md-era-highlights-list"
                    role="region"
                    aria-label={`${era.name} topic list`}
                    tabIndex={0}
                  >
                    {era.highlights.map((item) => (
                      <button
                        key={item.id}
                        data-topic-id={item.id}
                        type="button"
                        onClick={() =>
                          openModal({
                            kind: "story",
                            title: item.title,
                            text: item.detail,
                            photo: item.photo,
                            context: era.name.toUpperCase(),
                            source: item.source,
                          })
                        }
                      >
                        <img src={artwork(item.photo)} alt="" loading="lazy" />
                        <span>
                          <strong>{item.title}</strong>
                          <small>{item.text}</small>
                        </span>
                        <span className="md-small-arrow">+</span>
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section
            className="md-section md-tour-section"
            id="museo-tour"
            hidden={activeSection !== "tour"}
            tabIndex={-1}
            aria-labelledby="md-tour-title"
          >
            <div className="md-tour-frame">
              <img
                className={`md-tour-art${selectedScene ? " is-alternate" : ""}`}
                src={artwork(scenes[selectedScene].background)}
                alt={scenes[selectedScene].description}
                loading="lazy"
              />
              <div className="md-tour-copy">
                <h2 id="md-tour-title">CHAUVET CAVE</h2>
                <p className="md-tour-location">
                  France <span>|</span> ~36,000 years ago
                </p>
                <p>
                  One of the world’s oldest known cave art sites, showcasing
                  extraordinary paintings of animals and human figures. A
                  glimpse into the symbolic world of early humans.
                </p>
                <div className="md-tour-ctas">
                  <button
                    className="md-button md-button-primary"
                    type="button"
                    onClick={() => openModal({ kind: "tour" })}
                  >
                    <Play fill="currentColor" />
                    VIRTUAL TOUR <ChevronRight />
                  </button>
                  <button
                    className="md-button"
                    type="button"
                    onClick={() =>
                      showStory(
                        "The art of Chauvet",
                        "Animal figures, handprints and abstract marks offer a glimpse into the symbolic world of early humans. Explore the painted walls and the stories they preserve.",
                        "bison-art",
                      )
                    }
                  >
                    <BookOpen />
                    EXPLORE ART
                  </button>
                </div>
              </div>
              <TourPhotoDrawer
                selectedScene={selectedScene}
                onSelect={(index) => {
                  changed();
                  setSelectedScene(index);
                }}
              />
              <TourGalleryStrip
                selectedScene={selectedScene}
                onSelect={(index) => {
                  changed();
                  setSelectedScene(index);
                }}
              />
              <div className="md-tour-scene-caption" aria-live="polite">
                <span className="md-eyebrow">
                  {String(selectedScene + 1).padStart(2, "0")} / 06 · CAVE
                  GALLERY
                </span>
                <h3>{scenes[selectedScene].name}</h3>
                <p>{scenes[selectedScene].description}</p>
              </div>
            </div>
          </section>

          <section
            className="md-section md-exhibitions"
            id="museo-exhibitions"
            hidden={activeSection !== "exhibitions"}
            tabIndex={-1}
            aria-labelledby="md-exhibitions-title"
          >
            <div className="md-exhibitions-content">
              <h2 id="md-exhibitions-title">EXHIBITIONS</h2>
              <p>
                Step into key moments of human history through <br />
                curated exhibits, real artifacts and immersive experiences.
              </p>
              <div className="md-filters" aria-label="Filter exhibitions">
                {["All", "Origins", "Tools", "Culture", "Environment"].map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={filter === category}
                      className={filter === category ? "is-selected" : ""}
                      onClick={() => {
                        changed();
                        setFilter(category);
                      }}
                    >
                      {category.toUpperCase()}
                    </button>
                  ),
                )}
              </div>
              <div
                className="md-exhibition-grid"
                data-count={filteredExhibitions.length}
              >
                {filteredExhibitions.map((item) => (
                  <button
                    className="md-exhibition-card"
                    type="button"
                    key={item.title}
                    onClick={() =>
                      showStory(item.title, item.detail, item.photo)
                    }
                  >
                    <img src={artwork(item.photo)} alt="" loading="lazy" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      {filter !== "All" && (
                        <p className="md-exhibition-detail">{item.detail}</p>
                      )}
                      <span className="md-small-arrow">
                        <ArrowRight />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <nav
        className="md-screen-nav"
        lang={lang}
        aria-label={vi ? "Chuyển màn hình" : "Museum screens"}
      >
        <button
          className="md-screen-previous"
          type="button"
          aria-label={vi ? "Màn hình trước" : "Previous screen"}
          disabled={screenIndex === 0}
          onClick={() => navigate(museumScreens[screenIndex - 1].id)}
        >
          <ChevronLeft />
        </button>
        <div className="md-screen-progress">
          <span className="md-screen-label" aria-live="polite">
            {String(screenIndex + 1).padStart(2, "0")} / 06{" "}
            <span>
              {vi
                ? museumScreens[screenIndex].vi
                : museumScreens[screenIndex].en}
            </span>
          </span>
          <div className="md-screen-dots">
            {museumScreens.map((screen, index) => (
              <button
                key={screen.id}
                className="md-screen-dot"
                type="button"
                data-section={screen.id}
                aria-label={`${vi ? "Màn hình" : "Screen"} ${index + 1}: ${vi ? screen.vi : screen.en}`}
                aria-current={activeSection === screen.id ? "step" : undefined}
                title={vi ? screen.vi : screen.en}
                onClick={() => navigate(screen.id)}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <button
          className="md-screen-next"
          type="button"
          aria-label={vi ? "Màn hình tiếp theo" : "Next screen"}
          disabled={screenIndex === museumScreens.length - 1}
          onClick={() => navigate(museumScreens[screenIndex + 1].id)}
        >
          <ChevronRight />
        </button>
      </nav>
      {(onClose || onToggleExpanded || onToggleSidebarWide || onOpenQRCode) && (
        <div
          className="md-host-controls"
          lang={lang}
          aria-label={vi ? "Điều khiển trang chi tiết" : "Detail page controls"}
        >
          {onOpenQRCode && (
            <button
              type="button"
              onClick={onOpenQRCode}
              aria-label={vi ? "Mở mã QR bảo tàng" : "Museum QR code"}
              title={vi ? "Mã QR" : "QR code"}
            >
              <QrCode />
            </button>
          )}
          {onToggleSidebarWide && (
            <button
              type="button"
              onClick={onToggleSidebarWide}
              aria-label={
                vi
                  ? "Đổi độ rộng chi tiết bảo tàng"
                  : "Change museum detail width"
              }
              aria-pressed={isSidebarWide}
              title={vi ? "Đổi độ rộng" : "Change width"}
            >
              <BookOpen />
            </button>
          )}
          {onToggleExpanded && (
            <button
              type="button"
              onClick={onToggleExpanded}
              aria-label={
                isExpanded
                  ? vi
                    ? "Thu nhỏ chi tiết bảo tàng"
                    : "Exit fullscreen museum detail"
                  : vi
                    ? "Mở rộng chi tiết bảo tàng"
                    : "Expand museum detail"
              }
              title={vi ? "Toàn màn hình" : "Fullscreen"}
            >
              {isExpanded ? <Shrink /> : <Expand />}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={vi ? "Đóng chi tiết bảo tàng" : "Close museum detail"}
              title={vi ? "Về bản đồ Trà Vinh" : "Back to Trà Vinh map"}
            >
              <X />
            </button>
          )}
        </div>
      )}
      {modal && (
        <MuseumDialog
          lang={lang}
          modal={modal}
          close={() => setModal(null)}
          navigate={navigate}
        />
      )}
    </div>
  );
}
