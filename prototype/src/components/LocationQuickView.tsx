import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowUpRight,
  Landmark,
  MapPin,
  Navigation,
  QrCode,
  ArrowRight,
  X,
} from "lucide-react";
import type { HeritageSite } from "../data/heritageSites";
import "./locationQuickView.css";
import { preloadMuseumDetail } from "../utils/museumPreload";
import {
  quickLocationContent,
  type QuickPhoto,
} from "../data/locationQuickContent";
import { QuickLocationGallery } from "./QuickLocationGallery";
import { useLocationQuickMotion } from "./useLocationQuickMotion";
import { useQuickPageMotion } from "./useQuickPageMotion";
import {
  QuickLocationReader,
  type QuickReaderBlock,
} from "./QuickLocationReader";

const englishCategories: Record<HeritageSite["category"], string> = {
  "Di sản kiến trúc": "Architecture",
  "Danh thắng & Sinh thái": "Landscape & ecology",
  "Làng nghề truyền thống": "Traditional crafts",
  "Không gian diễn xướng": "Performing arts",
};
type Topic = "overview" | "highlights" | "visit";
interface Props {
  site: HeritageSite;
  lang: "vi" | "en";
  onViewDetails: () => void;
  onPrepareDetails?: () => void;
  onClose: () => void;
  onOpenQRCode: () => void;
}
export function LocationQuickView({
  site,
  lang,
  onViewDetails,
  onPrepareDetails,
  onClose,
  onOpenQRCode,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [topic, setTopic] = useState<Topic>("overview");
  useLayoutEffect(() => setTopic("overview"), [site.id]);
  const prepareRef = useRef(onPrepareDetails);
  prepareRef.current = onPrepareDetails;
  const warmDetails = () => {
    if (site.id !== "bao-tang-khmer") return;
    const root = rootRef.current;
    void preloadMuseumDetail()
      .then(() => {
        if (
          root?.isConnected &&
          root.dataset.siteId === "bao-tang-khmer" &&
          !root.closest("[hidden]") &&
          !["entering-detail", "closing"].includes(
            root.dataset.quickMotion ?? "",
          )
        )
          prepareRef.current?.();
      })
      .catch(() => {});
  };
  const { reduced, requestClose } = useLocationQuickMotion(
    rootRef,
    onClose,
    site.id,
  );
  useQuickPageMotion(rootRef, topic, 0, reduced, site.id);
  const vi = lang === "vi",
    name = vi ? site.name : site.englishName;
  const content = useMemo(() => quickLocationContent(site, lang), [site, lang]);
  const [captionState, setCaptionState] = useState<{
    siteId: string;
    photo: QuickPhoto;
  } | null>(null);
  const onPhotoChange = useCallback(
    (photo: QuickPhoto) => {
      setCaptionState({ siteId: site.id, photo });
    },
    [site.id],
  );
  const caption =
    captionState?.siteId === site.id ? captionState.photo : content.photos[0];
  const topics: { id: Topic; label: string }[] = [
    { id: "overview", label: vi ? "Tổng quan" : "Overview" },
    { id: "highlights", label: vi ? "Điểm nổi bật" : "Highlights" },
    { id: "visit", label: vi ? "Tham quan" : "Visiting" },
  ];
  const blocks: Record<Topic, QuickReaderBlock[]> = {
    overview: [
      { id: "introduction", text: content.summary, className: "lqv-summary" },
      {
        id: "facts",
        node: (
          <>
            <dl className="lqv-facts">
              <div>
                <dt>{content.periodLabel}</dt>
                <dd>{content.period}</dd>
              </div>
              <div>
                <dt>{vi ? "Khu vực" : "Region"}</dt>
                <dd>{content.region}</dd>
              </div>
            </dl>
          </>
        ),
      },
      {
        id: "exploration",
        node: (
          <>
            <div className="lqv-explore-hints">
              <span>{vi ? "GỢI Ý KHÁM PHÁ" : "EXPLORE THIS PLACE"}</span>
              <p>{content.exploration}</p>
            </div>
          </>
        ),
      },
    ],
    highlights: content.highlights.map((item, index) => ({
      id: `highlight-${index}`,
      heading: item.title,
      text: item.summary,
      className: "lqv-highlight-story",
    })),
    visit: [
      {
        id: "guidance",
        heading: vi ? "Gợi ý cho chuyến tham quan" : "Before you visit",
        text: content.visit,
        className: "lqv-visit-description",
      },
      ...(content.periodNote
        ? [
            {
              id: "dates",
              text: content.periodNote,
              className: "lqv-period-note",
            },
          ]
        : []),
      {
        id: "map",
        node: (
          <a
            className="lqv-map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation aria-hidden="true" />
            <span>
              {vi ? "Xem vị trí trên bản đồ" : "Open location on a map"}
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
    ],
  };
  useEffect(() => {
    if (site.id !== "bao-tang-khmer") return;
    const root = rootRef.current;
    const timer = window.setTimeout(() => {
      if (
        root?.isConnected &&
        root.dataset.siteId === "bao-tang-khmer" &&
        !root.closest("[hidden]")
      )
        warmDetails();
    }, 1050);
    return () => {
      clearTimeout(timer);
    };
  }, [site.id]);
  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      className="lqv-root"
      data-site-id={site.id}
      data-reduced-motion={reduced}
      data-quick-topic={topic}
      lang={lang}
      aria-labelledby="location-quick-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          requestClose();
        }
      }}
    >
      <div className="lqv-scroll lqv-layout">
        <div className="lqv-hero">
          <header className="lqv-toolbar">
            <span>
              <Landmark aria-hidden="true" />
              {vi ? "THÔNG TIN ĐỊA ĐIỂM" : "LOCATION VIEWER"}
            </span>
            <div>
              <button
                type="button"
                onClick={onOpenQRCode}
                aria-label={vi ? "Mã QR địa điểm" : "Location QR code"}
                title={vi ? "Mã QR địa điểm" : "Location QR code"}
              >
                <QrCode />
              </button>
              <button
                type="button"
                className="lqv-close"
                onClick={requestClose}
                aria-label={
                  vi ? "Đóng thông tin địa điểm" : "Close location overview"
                }
                title={vi ? "Đóng" : "Close"}
              >
                <X />
              </button>
            </div>
          </header>
          <div className="lqv-title-block">
            <p className="lqv-category">
              {vi ? site.category : englishCategories[site.category]}
            </p>
            <h2 id="location-quick-title">{name}</h2>
            <p className="lqv-address">
              <MapPin aria-hidden="true" />
              {site.province}
            </p>
          </div>
          <QuickLocationGallery
            key={site.id}
            photos={content.photos}
            lang={lang}
            onPhotoChange={onPhotoChange}
          />
        </div>
        <div className="lqv-sheet">
          <i className="lqv-sheet-handle" aria-hidden="true" />
          <div className="lqv-photo-caption" aria-live="polite">
            <p>{caption.caption[lang]}</p>
            {caption.credit && (
              <span>
                {vi ? "Ảnh: " : "Photo: "}
                {caption.credit}
              </span>
            )}
          </div>
          <nav
            className="lqv-tabs"
            role="tablist"
            aria-label={
              vi ? "Mục thông tin địa điểm" : "Location information sections"
            }
            onKeyDown={(event) => {
              const index = topics.findIndex((item) => item.id === topic);
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? topics.length - 1
                    : event.key === "ArrowRight"
                      ? (index + 1) % topics.length
                      : event.key === "ArrowLeft"
                        ? (index + topics.length - 1) % topics.length
                        : -1;
              if (next < 0) return;
              event.preventDefault();
              setTopic(topics[next].id);
              rootRef.current
                ?.querySelector<HTMLButtonElement>(
                  `[data-quick-tab=${topics[next].id}]`,
                )
                ?.focus({ preventScroll: true });
            }}
          >
            <i className="lqv-tab-indicator" aria-hidden="true" />
            {topics.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`lqv-tab-${item.id}`}
                data-quick-tab={item.id}
                aria-selected={topic === item.id}
                aria-controls={`lqv-panel-${item.id}`}
                tabIndex={topic === item.id ? 0 : -1}
                onClick={() => setTopic(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="lqv-information">
            <div className="lqv-pages lqv-content">
              {topics.map((item) => (
                <section
                  key={item.id}
                  id={`lqv-panel-${item.id}`}
                  className={`lqv-page lqv-${item.id}`}
                  role="tabpanel"
                  aria-labelledby={`lqv-tab-${item.id}`}
                  data-quick-section={item.id}
                  hidden={topic !== item.id}
                  tabIndex={0}
                >
                  <QuickLocationReader
                    key={`${site.id}-${lang}-${item.id}`}
                    blocks={blocks[item.id]}
                    active={topic === item.id}
                    lang={lang}
                    reduced={reduced}
                  />
                </section>
              ))}
            </div>
          </div>
          <footer className="lqv-footer">
            <button
              type="button"
              data-action="show-location-details"
              onPointerEnter={warmDetails}
              onFocus={warmDetails}
              onClick={onViewDetails}
            >
              <span>
                {vi ? "XEM CÂU CHUYỆN ĐẦY ĐỦ" : "EXPLORE THE FULL STORY"}
              </span>
              <ArrowRight aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    </section>
  );
}
