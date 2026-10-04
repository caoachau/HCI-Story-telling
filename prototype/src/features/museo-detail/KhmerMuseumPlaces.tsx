import { useEffect, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Hammer,
  Landmark,
  Leaf,
  MapPin,
  Music2,
  Sailboat,
  Users,
  Waves,
} from "lucide-react";
import {
  findKhmerPlace,
  khmerPlaces,
  khmerPlacePhotos,
  khmerPlaceZones,
  type KhmerPlace,
  type PlaceLanguage,
} from "./khmerPlaces";

export const placeIcons = {
  building: Landmark,
  leaf: Leaf,
  water: Waves,
  boat: Sailboat,
  book: BookOpen,
  faith: Landmark,
  craft: Hammer,
  music: Music2,
  people: Users,
  steps: Footprints,
};
const mercator = ([latitude, longitude]: [number, number]) => {
  const radians = (latitude * Math.PI) / 180;
  return [
    ((longitude + 180) / 360) * 2 ** 17,
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) *
      2 ** 17,
  ];
};
const museumPosition = mercator(khmerPlaces[0].coordinates!);
const tileStart = [
  Math.floor(museumPosition[0]) - 1,
  Math.floor(museumPosition[1]) - 1,
];

function HeritageMap({
  active,
  lang,
  selected,
  onSelect,
}: {
  active: boolean;
  lang: PlaceLanguage;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="md-places-terrain"
      aria-label={
        lang === "vi"
          ? "Bản đồ quần thể Bảo tàng – Ao Bà Om – Chùa Âng"
          : "Map of the museum, Ao Ba Om and Ang Pagoda"
      }
    >
      <div className="md-places-map-plane">
        <div className="md-places-tiles" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <img
              key={index}
              src={`/map-tiles/esri-13192/17/${tileStart[1] + Math.floor(index / 3)}/${tileStart[0] + (index % 3)}.jpg`}
              alt=""
              loading={active ? "eager" : "lazy"}
              draggable={false}
            />
          ))}
        </div>
        {khmerPlaces
          .filter((place) => place.coordinates)
          .map((place) => {
            const coordinates = mercator(place.coordinates!);
            return (
              <button
                key={place.id}
                type="button"
                className={`md-map-pin md-places-geo-pin${selected === place.id ? " is-selected" : ""}`}
                style={{
                  left: `${((coordinates[0] - tileStart[0]) / 3) * 100}%`,
                  top: `${((coordinates[1] - tileStart[1]) / 3) * 100}%`,
                }}
                data-place-id={place.id}
                data-latitude={place.coordinates![0]}
                data-longitude={place.coordinates![1]}
                aria-label={place.title[lang]}
                aria-pressed={selected === place.id}
                onClick={() => onSelect(place.id)}
              >
                <span />
                <strong>
                  {place.id === "entrance"
                    ? lang === "vi"
                      ? "Bảo tàng Khmer"
                      : "Khmer Museum"
                    : place.title[lang]}
                </strong>
              </button>
            );
          })}
      </div>
      <small className="md-places-map-credit">
        Esri · {lang === "vi" ? "Ảnh vệ tinh" : "Satellite imagery"}
      </small>
    </div>
  );
}

function TopicPlan({
  places,
  lang,
  selected,
  onSelect,
}: {
  places: KhmerPlace[];
  lang: PlaceLanguage;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="md-places-topic-plan"
      role="group"
      aria-label={
        lang === "vi"
          ? "Sơ đồ khám phá theo chủ đề"
          : "Thematic exploration diagram"
      }
    >
      <img
        className="md-places-plan-photo"
        src={
          khmerPlacePhotos[places[0].zone === "upper" ? "exhibition" : "facade"]
            .src
        }
        alt=""
        loading="lazy"
      />
      <svg
        className="md-places-plan-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={places.map((place) => place.position.join(",")).join(" ")}
        />
      </svg>
      {places.map((place) => {
        const Icon = placeIcons[place.icon];
        return (
          <button
            key={place.id}
            type="button"
            className={`md-places-topic${selected === place.id ? " is-selected" : ""}`}
            style={{
              left: `${place.position[0]}%`,
              top: `${place.position[1]}%`,
            }}
            data-place-id={place.id}
            aria-label={place.title[lang]}
            aria-pressed={selected === place.id}
            onClick={() => onSelect(place.id)}
          >
            <span>
              <Icon />
            </span>
            <strong>{place.title[lang]}</strong>
          </button>
        );
      })}
    </div>
  );
}

export function KhmerMuseumPlaces({
  lang,
  active,
  selectedId,
  onSelect,
  onExplore,
  onDirectory,
}: {
  lang: PlaceLanguage;
  active: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onExplore: (id: string) => void;
  onDirectory: () => void;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const place = findKhmerPlace(selectedId);
  const zone = khmerPlaceZones.find((item) => item.id === place.zone)!;
  const index = khmerPlaces.indexOf(place);
  const vi = lang === "vi";
  useEffect(() => {
    if (!active) return;
    const track = strip.current;
    const card = track?.querySelector<HTMLButtonElement>(
      `[data-place-id="${selectedId}"]`,
    );
    if (!track || !card) return;
    const cardRect = card.getBoundingClientRect(),
      trackRect = track.getBoundingClientRect();
    if (cardRect.left < trackRect.left || cardRect.right > trackRect.right)
      track.scrollTo({
        left:
          track.scrollLeft +
          cardRect.left -
          trackRect.left -
          (trackRect.width - cardRect.width) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [active, selectedId]);
  return (
    <section
      className={`md-section md-map-section md-framed md-khmer-places md-places-zone-${place.zone}`}
      id="museo-map"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-map-title"
    >
      <div className="md-frame">
        <div className="md-map-body">
          <div className="md-map-stage">
            {place.zone === "landscape" ? (
              <HeritageMap
                active={active}
                lang={lang}
                selected={place.id}
                onSelect={onSelect}
              />
            ) : (
              <TopicPlan
                places={khmerPlaces.filter((item) => item.zone === place.zone)}
                lang={lang}
                selected={place.id}
                onSelect={onSelect}
              />
            )}
            <div className="md-map-copy">
              <span className="md-eyebrow">
                {vi ? "KHÁM PHÁ BẢO TÀNG" : "EXPLORE THE MUSEUM"}
              </span>
              <h2 className="md-display" id="md-map-title">
                {vi ? (
                  <>
                    KHÔNG GIAN
                    <br /> DI SẢN
                  </>
                ) : (
                  <>
                    HERITAGE
                    <br /> SPACES
                  </>
                )}
              </h2>
              <p className="md-eyebrow">{zone.description[lang]}</p>
              <p className="md-mono">
                {vi
                  ? "Chọn một điểm để khám phá kiến trúc, hiện vật và những câu chuyện văn hóa Khmer."
                  : "Choose a place to explore Khmer architecture, objects and cultural stories."}
              </p>
            </div>
            <div className="md-places-zone-navigation">
              <span className="md-places-plan-note">
                {place.zone === "landscape"
                  ? vi
                    ? "3 điểm di tích liên kết"
                    : "3 connected heritage sites"
                  : vi
                    ? "Sơ đồ chủ đề · không phải mặt bằng đo đạc"
                    : "Thematic diagram · not a measured floor plan"}
              </span>
              <div
                className="md-places-zones"
                role="group"
                aria-label={
                  vi ? "Chọn khu vực khám phá" : "Choose an exploration area"
                }
              >
                {khmerPlaceZones.map((item) => (
                  <button
                    key={item.id}
                    data-place-zone={item.id}
                    type="button"
                    aria-pressed={item.id === place.zone}
                    onClick={() =>
                      onSelect(
                        khmerPlaces.find((point) => point.zone === item.id)!.id,
                      )
                    }
                  >
                    <span>{item.title[lang]}</span>
                    <small>
                      {
                        khmerPlaces.filter((point) => point.zone === item.id)
                          .length
                      }
                    </small>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <article className="md-featured-site" data-selected-place={place.id}>
            <img
              className="md-featured-photo"
              src={khmerPlacePhotos[place.gallery[0]].src}
              alt={khmerPlacePhotos[place.gallery[0]].title[lang]}
              loading={active ? "eager" : "lazy"}
            />
            <div className="md-featured-top">
              <span className="md-eyebrow">
                {vi ? "ĐIỂM KHÁM PHÁ" : "FEATURED PLACE"}
              </span>
              <div>
                <button
                  className="md-round"
                  type="button"
                  aria-label={vi ? "Điểm trước" : "Previous place"}
                  onClick={() =>
                    onSelect(
                      khmerPlaces[
                        (index + khmerPlaces.length - 1) % khmerPlaces.length
                      ].id,
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <button
                  className="md-round md-round-filled"
                  type="button"
                  aria-label={vi ? "Điểm tiếp theo" : "Next place"}
                  onClick={() =>
                    onSelect(khmerPlaces[(index + 1) % khmerPlaces.length].id)
                  }
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div
              className="md-featured-content"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="md-featured-title">
                <div>
                  <h3>{place.title[lang]}</h3>
                  <span className="md-eyebrow">
                    {zone.title[lang]} ·{" "}
                    {vi ? "Văn hóa Khmer" : "Khmer culture"}
                  </span>
                </div>
                <small>
                  {String(index + 1).padStart(2, "0")} / {khmerPlaces.length}
                </small>
              </div>
              <p className="md-mono md-site-long-description">
                {place.description[lang]}
              </p>
              <p className="md-mono md-site-preview">{place.short[lang]}</p>
              <div className="md-place-observe">
                <span className="md-eyebrow">
                  {vi ? "GỢI Ý QUAN SÁT" : "LOOK CLOSER"}
                </span>
                <p>{place.highlights[0].text[lang]}</p>
              </div>
              <div className="md-featured-tags">
                {place.tags.map((tag, tagIndex) => {
                  const Icon =
                    tagIndex === 0
                      ? placeIcons[place.icon]
                      : tagIndex === 1
                        ? BookOpen
                        : MapPin;
                  return (
                    <span key={tag.vi}>
                      <Icon />
                      {tag[lang]}
                    </span>
                  );
                })}
              </div>
              <button
                className="md-button"
                type="button"
                data-action="explore-khmer-place"
                onClick={() => onExplore(place.id)}
              >
                {vi ? "XEM CHI TIẾT" : "EXPLORE PLACE"}
                <ArrowRight />
              </button>
            </div>
          </article>
        </div>
        <div className="md-notable-sites">
          <h3 className="md-eyebrow">
            {vi ? (
              <>
                ĐIỂM
                <br />
                NỔI BẬT
              </>
            ) : (
              <>
                NOTABLE
                <br />
                PLACES
              </>
            )}
          </h3>
          <div
            className="md-site-strip"
            ref={strip}
            tabIndex={0}
            role="group"
            aria-label={
              vi
                ? "16 điểm khám phá · cuộn ngang để xem thêm"
                : "16 exploration points · scroll horizontally for more"
            }
          >
            {khmerPlaces.map((item) => (
              <button
                key={item.id}
                type="button"
                data-place-id={item.id}
                className={item.id === place.id ? "is-selected" : ""}
                aria-pressed={item.id === place.id}
                onClick={() => onSelect(item.id)}
              >
                <img
                  src={khmerPlacePhotos[item.gallery[0]].src}
                  alt=""
                  loading="lazy"
                  draggable={false}
                />
                <strong>{item.title[lang]}</strong>
                <small>
                  {
                    khmerPlaceZones.find((area) => area.id === item.zone)!
                      .title[lang]
                  }
                </small>
              </button>
            ))}
          </div>
          <button className="md-view-all" type="button" onClick={onDirectory}>
            {vi ? "TẤT CẢ 16 ĐIỂM" : "ALL 16 PLACES"}
            <ArrowRight />
            <span className="md-round">
              <ChevronRight />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
