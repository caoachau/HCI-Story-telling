import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Landmark,
  Leaf,
  Map,
  MapPin,
  Music2,
  ScrollText,
  Users,
} from "lucide-react";
import { artwork } from "./data";
import {
  khmerOverview,
  khmerOverviewFacts,
  khmerOverviewGallery,
  khmerOverviewHighlights,
  khmerOverviewVisitReasons,
  type KhmerOverviewTopic,
} from "./khmerOverview";

const icons = {
  map: Map,
  building: Landmark,
  collection: ScrollText,
  people: Users,
  book: BookOpen,
  music: Music2,
  leaf: Leaf,
  compass: Compass,
};
type Language = "vi" | "en";

function MuseumLocation({
  lang,
  active,
  onRead,
}: {
  lang: Language;
  active: boolean;
  onRead: (origin: HTMLElement) => void;
}) {
  // Same coordinates as the museum landmark. Cached imagery shares the host's
  // Web Mercator projection; the marker sits at the actual map centre.
  const zoom = 17;
  const x = 104240.46700316443;
  const y = 61907.47406126229;
  const tiles = Array.from({ length: 9 }, (_, index) => ({
    row: Math.floor(y) - 1 + Math.floor(index / 3),
    column: Math.floor(x) - 1 + (index % 3),
  }));
  return (
    <button
      className="md-france-map md-khmer-location"
      type="button"
      data-overview-topic="location"
      aria-label={khmerOverview.locationAction[lang]}
      onClick={(event) => onRead(event.currentTarget)}
    >
      <span
        className="md-khmer-map-tiles"
        aria-hidden="true"
        style={{
          transform: `translate(-${((1 + (x % 1)) / 3) * 100}%, -${((1 + (y % 1)) / 3) * 100}%)`,
        }}
      >
        {tiles.map((tile) => (
          <img
            key={`${tile.row}-${tile.column}`}
            alt=""
            loading={active ? "eager" : "lazy"}
            src={`${import.meta.env.BASE_URL}map-tiles/esri-13192/${zoom}/${tile.row}/${tile.column}.jpg`}
          />
        ))}
      </span>
      <span className="md-khmer-map-title">
        {khmerOverview.locationTitle[lang]}
      </span>
      <MapPin className="md-khmer-map-pin" aria-hidden="true" />
      <span className="md-khmer-map-label">
        {khmerOverview.locationLabel[lang]}
      </span>
      <span className="md-khmer-map-credit">Esri</span>
    </button>
  );
}

export function KhmerMuseumOverview({
  lang,
  active,
  onRead,
  onContentChange,
}: {
  lang: Language;
  active: boolean;
  onRead: (topic: KhmerOverviewTopic, origin: HTMLElement) => void;
  onContentChange: () => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = khmerOverviewGallery[photoIndex];
  const changePhoto = (direction: number) => {
    onContentChange();
    setPhotoIndex(
      (index) =>
        (index + direction + khmerOverviewGallery.length) %
        khmerOverviewGallery.length,
    );
  };
  return (
    <section
      className="md-section md-overview md-overview--khmer"
      id="museo-overview"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-overview-title"
      lang={lang}
    >
      <div className="md-overview-top">
        <img
          className="md-entrance-art"
          src={artwork("khmer-facade")}
          alt={
            lang === "vi"
              ? "Mặt tiền Bảo tàng Văn hóa Dân tộc Khmer Trà Vinh giữa khuôn viên cây xanh"
              : "The Khmer culture museum's facade in its leafy grounds"
          }
          loading="lazy"
        />
        <div className="md-overview-copy">
          <span className="md-eyebrow">{khmerOverview.eyebrow[lang]}</span>
          <h2
            className="md-display"
            id="md-overview-title"
            aria-label={khmerOverview.fullName[lang]}
          >
            {khmerOverview.title[lang][0]}
            <br />
            {khmerOverview.title[lang][1]}
          </h2>
          <p className="md-eyebrow">{khmerOverview.subtitle[lang]}</p>
          <p className="md-overview-description">
            {khmerOverview.description[lang]}
          </p>
          <p className="md-overview-preview">{khmerOverview.preview[lang]}</p>
          <div className="md-overview-ctas">
            <button
              className="md-button md-button-primary"
              type="button"
              data-overview-topic="collections"
              onClick={(event) => onRead("collections", event.currentTarget)}
            >
              {khmerOverview.explore[lang]} <ArrowRight />
            </button>
            <button
              className="md-intro-link"
              type="button"
              data-overview-topic="introduction"
              onClick={(event) => onRead("introduction", event.currentTarget)}
            >
              <span className="md-play-disc">
                <BookOpen />
              </span>
              <span>
                <strong>{khmerOverview.readMore[lang]}</strong>
                <small>{khmerOverview.introCaption[lang]}</small>
              </span>
            </button>
          </div>
        </div>
        <aside className="md-unesco-note">
          <strong>{khmerOverview.noteTitle[lang]}</strong>
          <p>{khmerOverview.note[lang]}</p>
          <button
            type="button"
            onClick={(event) => onRead("introduction", event.currentTarget)}
          >
            {khmerOverview.noteAction[lang]} <ArrowRight />
          </button>
        </aside>
      </div>
      <div className="md-facts">
        <div className="md-fact-items">
          {khmerOverviewFacts.map((fact) => {
            const Icon = icons[fact.icon];
            return (
              <div className="md-fact" key={fact.icon}>
                <Icon aria-hidden="true" />
                <div>
                  <strong>
                    {typeof fact.value === "string"
                      ? fact.value
                      : fact.value[lang]}
                  </strong>
                  <span>{fact.label[lang]}</span>
                  <p>{fact.text[lang]}</p>
                </div>
              </div>
            );
          })}
        </div>
        <MuseumLocation
          lang={lang}
          active={active}
          onRead={(origin) => onRead("location", origin)}
        />
      </div>
      <div className="md-overview-bottom">
        <div className="md-remarkable">
          <h3>{khmerOverview.highlightsTitle[lang]}</h3>
          {khmerOverviewHighlights.map((item) => {
            const Icon = icons[item.icon];
            return (
              <button
                className="md-remarkable-row"
                key={item.id}
                type="button"
                data-overview-topic={item.id}
                onClick={(event) => onRead(item.id, event.currentTarget)}
              >
                <img src={artwork(item.photo)} alt="" loading="lazy" />
                <Icon aria-hidden="true" />
                <span>
                  <strong>{item.title[lang]}</strong>
                  <small>{item.text[lang]}</small>
                </span>
                <span className="md-small-arrow">
                  <ArrowRight />
                </span>
              </button>
            );
          })}
        </div>
        <div className="md-chamber">
          <img
            src={artwork(photo.photo)}
            alt={photo.alt[lang]}
            loading="lazy"
          />
          <div className="md-chamber-caption">
            <span>
              <strong>{photo.title[lang]}</strong>
              <small>{photo.caption[lang]}</small>
            </span>
            <div>
              <button
                className="md-round"
                type="button"
                data-action="overview-previous-photo"
                aria-label={
                  lang === "vi"
                    ? "Ảnh bảo tàng trước"
                    : "Previous museum photograph"
                }
                onClick={() => changePhoto(-1)}
              >
                <ChevronLeft />
              </button>
              <small aria-live="polite">
                {String(photoIndex + 1).padStart(2, "0")} /{" "}
                {String(khmerOverviewGallery.length).padStart(2, "0")}
              </small>
              <button
                className="md-round"
                type="button"
                data-action="overview-next-photo"
                aria-label={
                  lang === "vi"
                    ? "Ảnh bảo tàng tiếp theo"
                    : "Next museum photograph"
                }
                onClick={() => changePhoto(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
        <div className="md-why-visit">
          <h3>{khmerOverview.visitTitle[lang]}</h3>
          {khmerOverviewVisitReasons.map((item) => {
            const Icon = icons[item.icon];
            return (
              <button
                className="md-visit-row"
                key={item.id}
                type="button"
                data-overview-topic={item.id}
                onClick={(event) => onRead(item.id, event.currentTarget)}
              >
                <img src={artwork(item.photo)} alt="" loading="lazy" />
                <Icon aria-hidden="true" />
                <span>
                  <strong>{item.title[lang]}</strong>
                  <small>{item.text[lang]}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
