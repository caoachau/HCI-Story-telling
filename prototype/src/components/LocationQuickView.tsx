import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Landmark,
  MapPin,
  PanelRightClose,
  PanelRightOpen,
  QrCode,
  Sparkles,
  X,
} from "lucide-react";
import type { HeritageSite } from "../data/heritageSites";
import "./locationQuickView.css";

const englishCategories: Record<HeritageSite["category"], string> = {
  "Di sản kiến trúc": "Architecture",
  "Danh thắng & Sinh thái": "Landscape & ecology",
  "Làng nghề truyền thống": "Traditional crafts",
  "Không gian diễn xướng": "Performing arts",
};

interface Props {
  site: HeritageSite;
  lang: "vi" | "en";
  isWide: boolean;
  onViewDetails: () => void;
  onClose: () => void;
  onToggleWidth: () => void;
  onOpenQRCode: () => void;
}

export function LocationQuickView({
  site,
  lang,
  isWide,
  onViewDetails,
  onClose,
  onToggleWidth,
  onOpenQRCode,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const vi = lang === "vi";
  const name = vi ? site.name : site.englishName;
  const highlights = site.chapters.slice(0, 3);
  const summary = vi
    ? site.chapters[0]?.summary || site.tagline
    : site.chapters[0]?.englishSummary || site.englishName;

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      className="lqv-root"
      data-site-id={site.id}
      aria-labelledby="location-quick-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <header className="lqv-toolbar">
        <span>{vi ? "THÔNG TIN ĐỊA ĐIỂM" : "LOCATION OVERVIEW"}</span>
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
            className="lqv-width-toggle"
            onClick={onToggleWidth}
            aria-label={
              vi ? "Đổi độ rộng thông tin nhanh" : "Change overview width"
            }
            aria-pressed={isWide}
            title={vi ? "Đổi độ rộng" : "Change width"}
          >
            {isWide ? <PanelRightClose /> : <PanelRightOpen />}
          </button>
          <button
            type="button"
            className="lqv-close"
            onClick={onClose}
            aria-label={
              vi ? "Đóng thông tin địa điểm" : "Close location overview"
            }
            title={vi ? "Đóng" : "Close"}
          >
            <X />
          </button>
        </div>
      </header>
      <div
        className="lqv-scroll"
        tabIndex={0}
        aria-label={vi ? "Thông tin nhanh" : "Quick information"}
      >
        <div className="lqv-layout">
          <div className="lqv-photo">
            {imageFailed ? (
              <div className="lqv-photo-fallback" role="img" aria-label={name}>
                <Landmark />
                <span>
                  {vi ? site.category : englishCategories[site.category]}
                </span>
              </div>
            ) : (
              <img
                src={site.heroImage}
                alt={name}
                onError={() => setImageFailed(true)}
              />
            )}
            <span className="lqv-category">
              {vi ? site.category : englishCategories[site.category]}
            </span>
          </div>
          <div className="lqv-content">
            <h2 id="location-quick-title">{name}</h2>
            <p className="lqv-address">
              <MapPin />
              {site.province}
            </p>
            <p className="lqv-summary">{summary}</p>
            <dl className="lqv-facts">
              <div>
                <dt>{vi ? "Dấu mốc" : "Heritage period"}</dt>
                <dd>{site.establishedCentury}</dd>
              </div>
              <div>
                <dt>{vi ? "Khu vực" : "Region"}</dt>
                <dd>{site.region}</dd>
              </div>
            </dl>
            {highlights.length > 0 && (
              <div className="lqv-highlights">
                <h3>{vi ? "Điểm nổi bật" : "Highlights"}</h3>
                <ul>
                  {highlights.map((chapter) => (
                    <li key={chapter.title}>
                      <Sparkles />
                      <p>{vi ? chapter.title : chapter.englishTitle}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="lqv-footer">
        <button
          type="button"
          data-action="show-location-details"
          onClick={onViewDetails}
        >
          {vi ? "Xem chi tiết" : "View details"}
          <ArrowUpRight />
        </button>
      </footer>
    </section>
  );
}
