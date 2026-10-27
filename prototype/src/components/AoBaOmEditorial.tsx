import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  Headphones,
  Layers,
  Leaf,
  MapPin,
  Mic,
  MicOff,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  QrCode,
  Shrink,
  Trees,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { HeritageSite } from "../data/heritageSites";
import { getEsriTileUrl } from "../services/esriImagery";
import {
  AO_SOURCES,
  aoPhotos,
  aoSections,
  legendScenes,
  observations,
} from "./aoBaOmContent";
import type { AoLanguage, AoSection, AoText } from "./aoBaOmContent";
import legendImage from "../assets/ao-ba-om/lantern-legend.webp";
import "./conChimFonts.css";
import "./aoBaOmFonts.css";
import "./aoBaOmEditorial.css";

interface Props {
  site: HeritageSite;
  lang: AoLanguage;
  onToggleLang: () => void;
  isExpanded: boolean;
  isSidebarWide: boolean;
  onToggleExpanded?: () => void;
  onToggleSidebarWide?: () => void;
  onClose?: () => void;
  onOpenQRCode?: () => void;
  onOpenPanorama360?: () => void;
  onOpenArtifactModal: () => void;
  onToggleSoundscape: () => void;
  isSoundscapePlaying: boolean;
  onToggleNarration: () => void;
  isNarrating: boolean;
  subtitle: string;
  onContentChange?: () => void;
}

function PondMap({ site, lang }: { site: HeritageSite; lang: AoLanguage }) {
  const [failed, setFailed] = useState(false);
  const z = 16;
  const x = ((site.lng + 180) / 360) * 2 ** z;
  const y =
    ((1 - Math.asinh(Math.tan((site.lat * Math.PI) / 180)) / Math.PI) / 2) *
    2 ** z;
  return (
    <figure className="ao-pond-map">
      <div
        className="ao-map-image"
        role="img"
        aria-label={
          lang === "vi"
            ? "Ảnh vệ tinh vị trí Ao Bà Om"
            : "Satellite view of Ao Bà Om"
        }
      >
        {failed ? (
          <span className="ao-map-unavailable">
            <MapPin size={28} />
            {lang === "vi"
              ? "Xem vị trí bằng nút chỉ đường bên dưới"
              : "Use the directions link below to see the location"}
          </span>
        ) : (
          <>
            <div className="ao-tiles">
              {Array.from({ length: 9 }, (_, i) => (
                <img
                  src={getEsriTileUrl(
                    Math.floor(x) - 1 + (i % 3),
                    Math.floor(y) - 1 + Math.floor(i / 3),
                    z,
                  )}
                  alt=""
                  key={i}
                  loading="lazy"
                  width="256"
                  height="256"
                  onError={() => setFailed(true)}
                />
              ))}
            </div>
            <span
              className="ao-map-pin"
              style={{
                left: `${((1 + (x % 1)) / 3) * 100}%`,
                top: `${((1 + (y % 1)) / 3) * 100}%`,
              }}
            >
              <MapPin size={28} fill="currentColor" />
            </span>
          </>
        )}
      </div>
      <figcaption>Esri, Maxar, Earthstar Geographics</figcaption>
    </figure>
  );
}

export function AoBaOmEditorial({
  site,
  lang,
  onToggleLang,
  isExpanded,
  isSidebarWide,
  onToggleExpanded,
  onToggleSidebarWide,
  onClose,
  onOpenQRCode,
  onOpenPanorama360,
  onOpenArtifactModal,
  onToggleSoundscape,
  isSoundscapePlaying,
  onToggleNarration,
  isNarrating,
  subtitle,
  onContentChange,
}: Props) {
  const vi = lang === "vi";
  const t = (value: AoText) => value[lang];
  const root = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const [section, setSection] = useState<AoSection>("overview");
  const [observation, setObservation] = useState(0);
  const [scene, setScene] = useState(0);
  const [brochureOpen, setBrochureOpen] = useState(true);
  const [gallery, setGallery] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [saved, setSaved] = useState(() => {
    try {
      return localStorage.getItem("heritage-saved-ao-ba-om") === "true";
    } catch {
      return false;
    }
  });
  const [savedMessage, setSavedMessage] = useState("");
  const isDialogOpen = lightbox !== null;
  const wrap = (index: number) => (index + aoPhotos.length) % aoPhotos.length;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;
  const scrollMotion = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.querySelector(".access-reduce-motion")
      ? "instant"
      : "smooth";

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setSection(
              entry.target.getAttribute("data-ao-section") as AoSection,
            );
        });
      },
      { root: container, rootMargin: "-5% 0px -80% 0px", threshold: 0 },
    );
    container
      .querySelectorAll("[data-ao-section]")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const current = nav.current?.querySelector<HTMLElement>("[aria-current]");
    if (current && nav.current)
      nav.current.scrollTo({
        left: current.offsetLeft - nav.current.offsetLeft - 14,
        behavior: scrollMotion(),
      });
  }, [section]);
  useEffect(() => {
    const modal = dialog.current;
    if (!isDialogOpen || !modal) return;
    const previous = document.activeElement as HTMLElement | null;
    modal.showModal();
    return () => {
      modal.close();
      previous?.focus({ preventScroll: true });
    };
  }, [isDialogOpen]);

  function goTo(id: AoSection) {
    const target = root.current?.querySelector<HTMLElement>(
      `[data-ao-section="${id}"]`,
    );
    if (target)
      root.current?.scrollTo({
        top: target.offsetTop,
        behavior: scrollMotion(),
      });
    setSection(id);
    onContentChange?.();
  }
  function external(action?: () => void) {
    if (isExpanded) onToggleExpanded?.();
    action?.();
  }
  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    try {
      localStorage.setItem("heritage-saved-ao-ba-om", String(next));
      setSavedMessage(
        vi
          ? next
            ? "Đã lưu Ao Bà Om trên thiết bị."
            : "Đã bỏ lưu Ao Bà Om."
          : next
            ? "Ao Bà Om saved on this device."
            : "Ao Bà Om removed from saved places.",
      );
    } catch {
      setSavedMessage(
        vi
          ? "Đã ghi nhớ trong phiên này. Trình duyệt không cho phép lưu trên thiết bị."
          : "Kept for this session. Device storage is unavailable.",
      );
    }
  }
  const changePhoto = (direction: number) =>
    setGallery((current) => wrap(current + direction));

  return (
    <div
      className={`ao-shell ${isExpanded ? "ao-expanded" : ""} ${isSidebarWide ? "ao-wide" : ""}`}
      lang={lang}
      onPointerDown={() => onContentChange?.()}
      onKeyDown={() => onContentChange?.()}
    >
      <header className="ao-header">
        <button
          type="button"
          className="ao-back"
          onClick={onClose}
          aria-label={
            vi ? "Ký ức bản địa: Về bản đồ" : "Local memories: Back to map"
          }
          title={vi ? "Về bản đồ" : "Back to map"}
        >
          <ArrowLeft size={18} />
          <span>{vi ? "Ký ức bản địa" : "Local memories"}</span>
        </button>
        <div className="ao-header-name">Ao Bà Om</div>
        <div
          className="ao-tools"
          role="group"
          aria-label={vi ? "Công cụ khám phá" : "Explore tools"}
        >
          <button
            type="button"
            className="ao-lang"
            onClick={onToggleLang}
            aria-label={
              vi ? "VI: Switch to English" : "EN: Chuyển sang tiếng Việt"
            }
            title={vi ? "Switch to English" : "Chuyển sang tiếng Việt"}
          >
            {lang.toUpperCase()}
          </button>
          <button
            type="button"
            onClick={onToggleNarration}
            aria-pressed={isNarrating}
            aria-label={vi ? "Thuyết minh" : "Narration"}
            title={vi ? "Thuyết minh" : "Narration"}
          >
            {isNarrating ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <button
            type="button"
            onClick={onToggleSoundscape}
            aria-pressed={isSoundscapePlaying}
            aria-label={vi ? "Âm thanh không gian" : "Ambient sound"}
            title={vi ? "Âm thanh không gian" : "Ambient sound"}
          >
            {isSoundscapePlaying ? (
              <Volume2 size={17} />
            ) : (
              <VolumeX size={17} />
            )}
          </button>
          {onOpenQRCode && (
            <button
              type="button"
              onClick={() => external(onOpenQRCode)}
              aria-label={vi ? "Mở mã QR" : "Open QR code"}
              title={vi ? "Mở mã QR" : "Open QR code"}
            >
              <QrCode size={17} />
            </button>
          )}
          {onToggleExpanded && (
            <button
              type="button"
              onClick={onToggleExpanded}
              aria-label={
                isExpanded
                  ? vi
                    ? "Thu nhỏ"
                    : "Exit full screen"
                  : vi
                    ? "Toàn màn hình"
                    : "Full screen"
              }
              title={
                isExpanded
                  ? vi
                    ? "Thu nhỏ"
                    : "Exit full screen"
                  : vi
                    ? "Toàn màn hình"
                    : "Full screen"
              }
            >
              {isExpanded ? <Shrink size={18} /> : <Expand size={18} />}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              className="ao-close"
              onClick={onClose}
              aria-label={vi ? "Đóng" : "Close"}
              title={vi ? "Đóng" : "Close"}
            >
              <X size={19} />
            </button>
          )}
        </div>
      </header>
      <nav
        className="ao-navigation"
        ref={nav}
        aria-label={vi ? "Các phần của Ao Bà Om" : "Ao Bà Om sections"}
      >
        {aoSections.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => goTo(item.id)}
            aria-current={section === item.id ? "location" : undefined}
          >
            {t(item.name)}
          </button>
        ))}
      </nav>
      {!isExpanded && onToggleSidebarWide && (
        <button
          type="button"
          className="ao-edge"
          onClick={onToggleSidebarWide}
          aria-label={
            isSidebarWide
              ? vi
                ? "Thu gọn bảng"
                : "Narrow panel"
              : vi
                ? "Mở rộng bảng"
                : "Widen panel"
          }
        >
          {isSidebarWide ? (
            <PanelRightOpen size={18} />
          ) : (
            <PanelRightClose size={18} />
          )}
        </button>
      )}

      <main
        className="ao-scroll"
        ref={root}
        aria-label={vi ? "Câu chuyện Ao Bà Om" : "The story of Ao Bà Om"}
      >
        <section
          className="ao-hero"
          data-ao-section="overview"
          aria-labelledby="ao-title"
        >
          <div className="ao-hero-copy">
            <span className="ao-eyebrow">
              {vi ? "Danh thắng / Trà Vinh" : "Cultural landscape / Trà Vinh"}
            </span>
            <h1 id="ao-title">Ao Bà Om</h1>
            <p>
              {vi
                ? "Mặt nước lặng. Tán cây già. Những câu chuyện vẫn được kể."
                : "Still water. Ancient trees. Stories that live on."}
            </p>
            <div className="ao-hero-actions">
              <button
                type="button"
                className="ao-button"
                onClick={() => goTo("landscape")}
              >
                {vi ? "Bắt đầu khám phá" : "Begin exploring"}
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="ao-listen"
                onClick={onToggleNarration}
                aria-pressed={isNarrating}
              >
                <Headphones size={17} />
                {isNarrating
                  ? vi
                    ? "Dừng nghe"
                    : "Stop listening"
                  : vi
                    ? "Nghe thuyết minh"
                    : "Listen to the story"}
              </button>
            </div>
          </div>
          <figure className="ao-hero-visual">
            <button
              type="button"
              onClick={() => setLightbox(0)}
              aria-label={
                vi ? "Phóng lớn ảnh Ao Bà Om" : "Enlarge the pond photograph"
              }
            >
              <img
                src={aoPhotos[0].src}
                alt={t(aoPhotos[0].title)}
                width="1680"
                height="1134"
                fetchPriority="high"
              />
            </button>
            <figcaption>
              <span>
                {vi
                  ? "Ao Vuông, một tên gọi khác của Ao Bà Om."
                  : "Ao Vuông, the Square Pond, is another name for Ao Bà Om."}
              </span>
              <a href={aoPhotos[0].source} target="_blank" rel="noreferrer">
                {vi ? "Nguồn ảnh" : "Photo source"}
                <ArrowUpRight size={12} />
              </a>
            </figcaption>
          </figure>
          <div className="ao-intro">
            <span className="ao-intro-heading">
              {vi
                ? "Một nơi chốn, nhiều lớp ký ức."
                : "One place, many layers of memory."}
            </span>
            <p>
              {vi
                ? "Ao Bà Om là cuộc gặp giữa cảnh quan tự nhiên và văn hóa Khmer. Hãy bắt đầu từ một gốc cây, rồi đi tiếp vào những câu chuyện quanh mặt nước."
                : "Ao Bà Om brings together a living landscape and Khmer culture. Begin with a tree, then follow the stories around the water."}
            </p>
            <button
              type="button"
              onClick={toggleSaved}
              className="ao-save"
              aria-pressed={saved}
            >
              {saved ? <Check size={18} /> : <Bookmark size={18} />}
              <span>
                {saved
                  ? vi
                    ? "Đã lưu địa điểm"
                    : "Place saved"
                  : vi
                    ? "Lưu địa điểm"
                    : "Save this place"}
              </span>
            </button>
            <span className="ao-sr" role="status">
              {savedMessage}
            </span>
          </div>
        </section>

        <section
          className="ao-landscape ao-section"
          data-ao-section="landscape"
          aria-labelledby="ao-landscape-title"
        >
          <div className="ao-landscape-heading">
            <Trees size={29} strokeWidth={1.3} />
            <h2 id="ao-landscape-title">
              {vi ? "Dáng hình của thời gian." : "The shapes of time."}
            </h2>
            <p>
              {vi
                ? "Chọn một điểm trên ảnh để nhìn gần hơn cảnh quan quanh ao."
                : "Select a point on the photograph to explore the landscape."}
            </p>
            <div className="ao-observation" aria-live="polite">
              <span className="ao-observation-label">
                {t(observations[observation].note)}
              </span>
              <h3>{t(observations[observation].title)}</h3>
              <p>{t(observations[observation].body)}</p>
            </div>
            <div
              className="ao-observation-tabs"
              aria-label={
                vi ? "Chọn chi tiết cảnh quan" : "Select a landscape detail"
              }
            >
              {observations.map((item, index) => (
                <button
                  type="button"
                  key={item.title.en}
                  aria-pressed={observation === index}
                  onClick={() => setObservation(index)}
                >
                  {t(item.title)}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          </div>
          <figure className="ao-root-study">
            <div className="ao-root-image">
              <img
                src={aoPhotos[1].src}
                alt={t(aoPhotos[1].title)}
                loading="lazy"
                width="1680"
                height="945"
              />
              {observations.map((item, index) => (
                <button
                  type="button"
                  key={item.title.en}
                  className={`ao-hotspot ${observation === index ? "is-active" : ""}`}
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  onClick={() => setObservation(index)}
                  aria-label={t(item.title)}
                  aria-pressed={observation === index}
                >
                  <Plus size={19} />
                </button>
              ))}
            </div>
            <figcaption>
              <span>
                {vi
                  ? "Quan sát: cây, rễ và mặt nước tại Ao Bà Om."
                  : "Observation: trees, roots and water at Ao Bà Om."}
              </span>
              <a href={aoPhotos[1].source} target="_blank" rel="noreferrer">
                {vi ? "Ảnh: Huỳnh Biển" : "Photo: Huỳnh Biển"}
                <ArrowUpRight size={12} />
              </a>
            </figcaption>
          </figure>
        </section>

        <section
          className="ao-legend ao-section"
          data-ao-section="legend"
          aria-labelledby="ao-legend-title"
        >
          <div className="ao-section-heading">
            <span className="ao-eyebrow">
              {vi ? "Truyền thuyết dân gian" : "A folk tradition"}
            </span>
            <h2 id="ao-legend-title">
              {vi
                ? "Chuyện kể dưới một ngọn đèn."
                : "A story beneath a lantern."}
            </h2>
            <p>
              {vi
                ? "Một cách kể về tên gọi Ao Bà Om, được lưu truyền trong cộng đồng."
                : "One of the stories passed down about the name Ao Bà Om."}
            </p>
          </div>
          <div className="ao-legend-stage">
            <figure className="ao-legend-art">
              <div>
                <img
                  src={legendImage}
                  alt={
                    vi
                      ? "Minh họa AI cho truyền thuyết: ngọn đèn treo trên cây bên ao trong đêm"
                      : "AI illustration of the folk legend: a lantern hangs in a tree by the pond at night"
                  }
                  loading="lazy"
                  width="1536"
                  height="1024"
                />
                <button
                  type="button"
                  className={`ao-lantern ${scene === 1 ? "is-active" : ""}`}
                  onClick={() => setScene(1)}
                  aria-label={
                    vi
                      ? "Khám phá ánh đèn trong truyền thuyết"
                      : "Discover the lantern in the legend"
                  }
                  aria-pressed={scene === 1}
                >
                  <Plus size={18} />
                </button>
              </div>
              <figcaption>
                {vi
                  ? "Minh họa truyền thuyết bằng AI; không phải ảnh tư liệu lịch sử."
                  : "AI illustration of a folk legend; not a historical photograph."}
              </figcaption>
            </figure>
            <article className="ao-story-card">
              <Moon size={22} strokeWidth={1.3} />
              <div key={scene} className="ao-story-text" aria-live="polite">
                <h3>{t(legendScenes[scene].title)}</h3>
                <p>{t(legendScenes[scene].body)}</p>
              </div>
              <div
                className="ao-story-tabs"
                role="group"
                aria-label={
                  vi ? "Các phần truyền thuyết" : "Parts of the legend"
                }
              >
                {legendScenes.map((item, index) => (
                  <button
                    type="button"
                    key={item.tab.en}
                    onClick={() => setScene(index)}
                    aria-pressed={scene === index}
                  >
                    {t(item.tab)}
                  </button>
                ))}
              </div>
              <a
                className="ao-source"
                href={AO_SOURCES.landscape}
                target="_blank"
                rel="noreferrer"
              >
                {vi ? "Đọc nguồn câu chuyện" : "Read the source"}
                <ArrowUpRight size={13} />
              </a>
            </article>
          </div>
        </section>

        <section
          className="ao-culture ao-section"
          data-ao-section="culture"
          aria-labelledby="ao-culture-title"
        >
          <div className="ao-culture-title">
            <h2 id="ao-culture-title">
              {vi
                ? "Khi mặt ao đón trăng."
                : "When the pond welcomes the moon."}
            </h2>
            <p>
              {vi
                ? "Ok Om Bok gắn với lễ cúng trăng và đời sống tinh thần của cộng đồng Khmer."
                : "Ok Om Bok connects moon worship with the spiritual life of the Khmer community."}
            </p>
          </div>
          <figure className="ao-festival-photo">
            <button
              type="button"
              onClick={() => setLightbox(3)}
              aria-label={
                vi
                  ? "Phóng lớn ảnh lễ cúng trăng"
                  : "Enlarge the moon worship photograph"
              }
            >
              <img
                src={aoPhotos[3].src}
                alt={t(aoPhotos[3].title)}
                width="1024"
                height="575"
                loading="lazy"
              />
            </button>
            <figcaption>{t(aoPhotos[3].title)}</figcaption>
          </figure>
          <figure className="ao-lantern-photo">
            <button
              type="button"
              onClick={() => setLightbox(4)}
              aria-label={
                vi
                  ? "Phóng lớn ảnh hoa đăng"
                  : "Enlarge the floating lanterns photograph"
              }
            >
              <img
                src={aoPhotos[4].src}
                alt={t(aoPhotos[4].title)}
                width="1024"
                height="685"
                loading="lazy"
              />
            </button>
            <figcaption>{t(aoPhotos[4].title)}</figcaption>
          </figure>
          <div className="ao-culture-copy">
            <span className="ao-date-note">
              {vi ? "Tư liệu lễ hội 2024" : "From the 2024 festival"}
            </span>
            <h3>
              {vi
                ? "Một cuộc gặp của cộng đồng."
                : "A gathering of the community."}
            </h3>
            <p>
              {vi
                ? "Lễ hội tại Ao Bà Om có hoạt động tái hiện lễ cúng trăng, diễu hành và thả hoa đăng. Những hình ảnh này ghi lại lễ hội năm 2024."
                : "The festival at Ao Bà Om included a presentation of moon worship, a procession and floating lanterns. These photographs document the 2024 gathering."}
            </p>
            <a
              className="ao-source"
              href={AO_SOURCES.festival}
              target="_blank"
              rel="noreferrer"
            >
              {vi
                ? "Tư liệu từ Cục Du lịch Quốc gia Việt Nam"
                : "Vietnam National Authority of Tourism"}
              <ArrowUpRight size={13} />
            </a>
            <button
              type="button"
              className="ao-text-link"
              onClick={() => external(onOpenArtifactModal)}
            >
              {vi ? "Khám phá thuyền Ngo 3D" : "Explore the Ngo boat in 3D"}
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        <section
          className="ao-visit ao-section"
          data-ao-section="visit"
          aria-labelledby="ao-visit-title"
        >
          <div className="ao-visit-heading">
            <div>
              <h2 id="ao-visit-title">
                {vi
                  ? "Một vòng ao. Một khoảng chậm."
                  : "A walk around the pond. Time to pause."}
              </h2>
              <p>
                {vi
                  ? "Mở tờ gấp để chuẩn bị cho buổi dạo bộ của bạn."
                  : "Open the foldout and plan your own unhurried walk."}
              </p>
            </div>
            <button
              type="button"
              className="ao-fold-toggle"
              onClick={() => setBrochureOpen(!brochureOpen)}
              aria-expanded={brochureOpen}
              aria-controls="ao-brochure"
            >
              <Layers size={18} />
              {brochureOpen
                ? vi
                  ? "Gấp tờ hướng dẫn"
                  : "Fold the guide"
                : vi
                  ? "Mở tờ hướng dẫn"
                  : "Unfold the guide"}
            </button>
          </div>
          <div
            className={`ao-brochure ${brochureOpen ? "is-open" : "is-folded"}`}
            id="ao-brochure"
          >
            <article
              className="ao-fold-panel ao-fold-left"
              inert={!brochureOpen}
              aria-hidden={!brochureOpen}
            >
              <span className="ao-fold-label">
                {vi ? "Dừng dưới tán cây" : "Pause beneath the trees"}
              </span>
              <img
                src={aoPhotos[1].src}
                alt=""
                loading="lazy"
                width="1680"
                height="945"
              />
              <h3>
                {vi ? "Đi chậm, nhìn gần." : "Walk slowly. Look closely."}
              </h3>
              <p>
                {vi
                  ? "Dạo theo bờ ao, tìm bóng mát dưới hàng sao, dầu. Mang theo nước uống và tránh leo lên những bộ rễ."
                  : "Follow the water’s edge and find shade beneath the trees. Bring drinking water and avoid climbing on the roots."}
              </p>
              <div className="ao-fold-tip">
                <Leaf size={17} />
                {vi
                  ? "Giữ cây nguyên vẹn, mang rác về đúng chỗ."
                  : "Leave the trees intact and dispose of litter properly."}
              </div>
            </article>
            <article className="ao-fold-panel ao-fold-center">
              <span className="ao-fold-label">
                {vi ? "Điểm bắt đầu" : "Your starting point"}
              </span>
              <h3>Ao Bà Om</h3>
              <PondMap site={site} lang={lang} />
              <a
                className="ao-button"
                href={directions}
                target="_blank"
                rel="noreferrer"
              >
                {vi ? "Chỉ đường đến ao" : "Directions to the pond"}
                <ArrowUpRight size={17} />
              </a>
              <p>
                {vi
                  ? "Kiểm tra lối vào và điều kiện tham quan trước chuyến đi."
                  : "Check access and visiting arrangements before you travel."}
              </p>
            </article>
            <article
              className="ao-fold-panel ao-fold-right"
              inert={!brochureOpen}
              aria-hidden={!brochureOpen}
            >
              <span className="ao-fold-label">
                {vi ? "Ghé thăm lân cận" : "Explore nearby"}
              </span>
              <img
                src={aoPhotos[2].src}
                alt={t(aoPhotos[2].title)}
                loading="lazy"
                width="1200"
                height="750"
              />
              <h3>{vi ? "Qua Chùa Âng." : "Continue to Ang Pagoda."}</h3>
              <p>
                {vi
                  ? "Nối tiếp buổi dạo bằng một điểm văn hóa Khmer cạnh ao. Mặc trang phục lịch sự và giữ yên lặng trong không gian thờ tự."
                  : "Continue to the Khmer cultural landmark beside the pond. Dress respectfully and keep quiet in places of worship."}
              </p>
              <a
                className="ao-text-link"
                href="https://www.google.com/maps/search/?api=1&query=Ch%C3%B9a+%C3%82ng+Tr%C3%A0+Vinh"
                target="_blank"
                rel="noreferrer"
              >
                {vi ? "Tìm Chùa Âng" : "Find Ang Pagoda"}
                <ArrowUpRight size={15} />
              </a>
            </article>
          </div>
          <div className="ao-visit-bottom">
            <span>
              <Compass size={16} />
              {vi
                ? "Đi bộ nhẹ nhàng, tôn trọng không gian văn hóa."
                : "Walk gently and respect the cultural setting."}
            </span>
            {onOpenPanorama360 && (
              <button
                type="button"
                className="ao-text-link"
                onClick={() => external(onOpenPanorama360)}
              >
                {vi ? "Xem toàn cảnh 360°" : "Explore the 360° view"}
                <ArrowUpRight size={17} />
              </button>
            )}
          </div>
        </section>

        <section
          className="ao-archive ao-section"
          data-ao-section="archive"
          aria-labelledby="ao-archive-title"
        >
          <div className="ao-section-heading">
            <h2 id="ao-archive-title">
              {vi ? "Những góc nhìn còn ở lại." : "Views to remember."}
            </h2>
            <p>
              {vi
                ? "Một tuyển tập ảnh về cảnh quan và sinh hoạt văn hóa quanh ao."
                : "A small collection of landscapes and cultural life around the pond."}
            </p>
          </div>
          <div
            className="ao-coverflow"
            role="region"
            aria-label={vi ? "Thư viện ảnh Ao Bà Om" : "Ao Bà Om photo gallery"}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                changePhoto(event.key === "ArrowLeft" ? -1 : 1);
              }
            }}
            onPointerDown={(event) => {
              swipe.current = { x: event.clientX, y: event.clientY };
              swiped.current = false;
            }}
            onPointerUp={(event) => {
              if (swipe.current) {
                const dx = event.clientX - swipe.current.x,
                  dy = event.clientY - swipe.current.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                  swiped.current = true;
                  changePhoto(dx < 0 ? 1 : -1);
                }
              }
              swipe.current = null;
            }}
            onPointerCancel={() => {
              swipe.current = null;
            }}
          >
            {aoPhotos.map((photo, index) => {
              let offset = index - gallery;
              if (offset > 2) offset -= aoPhotos.length;
              if (offset < -2) offset += aoPhotos.length;
              return (
                <button
                  type="button"
                  key={photo.src}
                  className={`ao-archive-card ${offset === 0 ? "is-selected" : ""}`}
                  style={
                    {
                      "--ao-offset": offset,
                      "--ao-distance": Math.abs(offset),
                      zIndex: 5 - Math.abs(offset),
                    } as React.CSSProperties
                  }
                  tabIndex={offset === 0 ? 0 : -1}
                  onClick={(event) => {
                    if (event.detail === 0 || !swiped.current) {
                      if (index === gallery) setLightbox(index);
                      else setGallery(index);
                    }
                  }}
                  aria-label={`${t(photo.title)}. ${index === gallery ? (vi ? "Phóng lớn ảnh" : "Enlarge photo") : vi ? "Chọn ảnh" : "Select photo"}`}
                >
                  <img
                    src={photo.src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                  />
                  <span>{t(photo.title)}</span>
                </button>
              );
            })}
          </div>
          <div className="ao-archive-controls">
            <button
              type="button"
              className="ao-circle"
              onClick={() => changePhoto(-1)}
              aria-label={vi ? "Ảnh trước" : "Previous photo"}
            >
              <ArrowLeft size={19} />
            </button>
            <div className="ao-archive-caption" aria-live="polite">
              <strong>{t(aoPhotos[gallery].title)}</strong>
              <a
                href={aoPhotos[gallery].source}
                target="_blank"
                rel="noreferrer"
              >
                {aoPhotos[gallery].credit}
                <ArrowUpRight size={12} />
              </a>
            </div>
            <button
              type="button"
              className="ao-circle"
              onClick={() => changePhoto(1)}
              aria-label={vi ? "Ảnh sau" : "Next photo"}
            >
              <ArrowRight size={19} />
            </button>
          </div>
          <div
            className="ao-photo-selector"
            aria-label={vi ? "Chọn ảnh theo chủ đề" : "Choose a photograph"}
          >
            {aoPhotos.map((photo, index) => (
              <button
                type="button"
                key={photo.src}
                onClick={() => setGallery(index)}
                aria-label={`${vi ? "Ảnh" : "Photo"} ${index + 1}: ${t(photo.title)}`}
                aria-pressed={index === gallery}
              >
                <span />
              </button>
            ))}
          </div>
        </section>
        <footer className="ao-footer">
          <div>
            <span>Ao Bà Om</span>
            <p>
              {vi
                ? "Giữ lại một câu chuyện. Để lại một dấu chân nhẹ."
                : "Keep a story. Leave a gentle footprint."}
            </p>
          </div>
          <button
            type="button"
            className="ao-text-link"
            onClick={() => goTo("overview")}
          >
            {vi ? "Về đầu trang" : "Back to top"}
            <ArrowUp size={17} />
          </button>
        </footer>
      </main>
      {isNarrating && subtitle && (
        <div className="ao-subtitle" aria-live="polite">
          <Headphones size={18} />
          <span>{subtitle}</span>
        </div>
      )}
      {lightbox !== null &&
        createPortal(
          <dialog
            ref={dialog}
            className="ao-lightbox"
            aria-label={
              vi ? "Ảnh tư liệu Ao Bà Om" : "Ao Bà Om archive photograph"
            }
            onCancel={() => setLightbox(null)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setLightbox(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                setLightbox(
                  wrap(lightbox + (event.key === "ArrowLeft" ? -1 : 1)),
                );
              }
            }}
          >
            <button
              type="button"
              className="ao-lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label={vi ? "Đóng ảnh" : "Close photo"}
            >
              <X size={25} />
            </button>
            <button
              type="button"
              className="ao-lightbox-prev"
              onClick={() => setLightbox(wrap(lightbox - 1))}
              aria-label={vi ? "Ảnh trước" : "Previous photo"}
            >
              <ChevronLeft size={28} />
            </button>
            <figure>
              <img
                src={aoPhotos[lightbox].src}
                alt={t(aoPhotos[lightbox].title)}
              />
              <figcaption>
                <strong>{t(aoPhotos[lightbox].title)}</strong>
                <a
                  href={aoPhotos[lightbox].source}
                  target="_blank"
                  rel="noreferrer"
                >
                  {aoPhotos[lightbox].credit}
                  <ArrowUpRight size={12} />
                </a>
              </figcaption>
            </figure>
            <button
              type="button"
              className="ao-lightbox-next"
              onClick={() => setLightbox(wrap(lightbox + 1))}
              aria-label={vi ? "Ảnh sau" : "Next photo"}
            >
              <ChevronRight size={28} />
            </button>
          </dialog>,
          document.body,
        )}
    </div>
  );
}
