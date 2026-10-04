import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";
import {
  findKhmerPlace,
  khmerPlaces,
  khmerPlacePhotos,
  khmerPlaceSources,
  khmerPlaceZones,
  normalizePlaceQuery,
  type KhmerPlaceZone,
  type PlaceLanguage,
} from "./khmerPlaces";

export function KhmerPlaceExplorer({
  placeId,
  lang,
  close,
  onSelect,
}: {
  placeId: string;
  lang: PlaceLanguage;
  close: () => void;
  onSelect: (id: string) => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const place = findKhmerPlace(placeId);
  const image = khmerPlacePhotos[place.gallery[photoIndex]];
  const vi = lang === "vi";
  const zone = khmerPlaceZones.find((item) => item.id === place.zone)!;
  const changePhoto = (step: number) =>
    setPhotoIndex(
      (index) => (index + step + place.gallery.length) % place.gallery.length,
    );
  return (
    <article
      className="md-site-explorer md-khmer-place-explorer"
      data-place-id={place.id}
    >
      <div className="md-site-topbar">
        <span className="md-eyebrow">
          {vi ? "KHÁM PHÁ ĐIỂM ĐẾN" : "EXPLORE A PLACE"}
        </span>
        <span className="md-site-location">
          <MapPin />
          {zone.title[lang]} ·{" "}
          {vi ? "Bảo tàng Văn hóa Khmer" : "Khmer Cultural Museum"}
        </span>
      </div>
      <div className="md-site-intro-grid">
        <div className="md-site-gallery">
          <figure className="md-site-image">
            <img
              className="md-site-main-image"
              src={image.src}
              alt={image.title[lang]}
            />
            <div className="md-site-gallery-controls">
              <button
                type="button"
                aria-label={
                  vi ? "Ảnh trước của điểm đến" : "Previous place photo"
                }
                onClick={() => changePhoto(-1)}
              >
                <ChevronLeft />
              </button>
              <span>
                {String(photoIndex + 1).padStart(2, "0")} /{" "}
                {String(place.gallery.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label={
                  vi ? "Ảnh tiếp theo của điểm đến" : "Next place photo"
                }
                onClick={() => changePhoto(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </figure>
          <div
            className="md-site-photo-caption"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>{image.title[lang]}</strong>
            <p>{image.caption[lang]}</p>
            <small>
              {vi ? "Ảnh tư liệu: " : "Archive photo: "}
              <a
                href={khmerPlaceSources[image.source].url}
                target="_blank"
                rel="noreferrer"
              >
                {image.author}
                <ArrowUpRight />
              </a>
            </small>
          </div>
          <div
            className="md-site-thumbnails"
            role="group"
            aria-label={vi ? "Ảnh tư liệu của điểm đến" : "Place photographs"}
          >
            {place.gallery.map((key, index) => (
              <button
                key={key}
                type="button"
                aria-label={`${vi ? "Xem ảnh" : "View photo"} ${index + 1}: ${khmerPlacePhotos[key].title[lang]}`}
                aria-pressed={photoIndex === index}
                onClick={() => setPhotoIndex(index)}
              >
                <img src={khmerPlacePhotos[key].src} alt="" loading="lazy" />
                <span>
                  {String(index + 1).padStart(2, "0")} ·{" "}
                  {khmerPlacePhotos[key].title[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="md-site-story">
          <span className="md-eyebrow">
            {zone.title[lang]} ·{" "}
            {vi ? "DI SẢN KHMER NAM BỘ" : "SOUTHERN KHMER HERITAGE"}
          </span>
          <h2 id="md-dialog-title">{place.title[lang]}</h2>
          <p className="md-site-subtitle">{place.description[lang]}</p>
          <dl className="md-site-facts">
            <div>
              <dt>{vi ? "Không gian" : "Setting"}</dt>
              <dd>{place.location[lang]}</dd>
            </div>
            <div>
              <dt>{vi ? "Gợi ý quan sát" : "Look for"}</dt>
              <dd>{place.tags.map((tag) => tag[lang]).join(" · ")}</dd>
            </div>
          </dl>
          <div className="md-site-paragraphs">
            {place.paragraphs.map((paragraph) => (
              <p key={paragraph.vi}>{paragraph[lang]}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="md-site-reading">
        <h3>{vi ? "Dừng lại, nhìn kỹ hơn" : "Pause and look closer"}</h3>
        <div className="md-site-highlight-grid">
          {place.highlights.map((item, index) => (
            <section key={item.title.vi}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{item.title[lang]}</h4>
              <p>{item.text[lang]}</p>
            </section>
          ))}
        </div>
        <div className="md-site-context">
          <section>
            <h3>{vi ? "Tiếp nối hành trình" : "Continue the journey"}</h3>
            <div className="md-place-related">
              {place.related.map((id) => {
                const related = findKhmerPlace(id);
                return (
                  <button
                    type="button"
                    data-related-place={id}
                    key={id}
                    onClick={() => onSelect(id)}
                  >
                    <img
                      src={khmerPlacePhotos[related.gallery[0]].src}
                      alt=""
                      loading="lazy"
                    />
                    <span>{related.title[lang]}</span>
                    <ArrowRight />
                  </button>
                );
              })}
            </div>
          </section>
          <aside aria-label={vi ? "Tư liệu tham khảo" : "Further reading"}>
            <h4>{vi ? "Đọc thêm từ nguồn tư liệu" : "Read the sources"}</h4>
            {place.sources.map((key) => (
              <a
                key={key}
                href={khmerPlaceSources[key].url}
                target="_blank"
                rel="noreferrer"
              >
                {khmerPlaceSources[key].title[lang]}
                <ArrowUpRight />
              </a>
            ))}
          </aside>
        </div>
        <div className="md-site-footer">
          <span>
            {place.gallery.length} {vi ? "ảnh tư liệu" : "archive photographs"}{" "}
            · {zone.title[lang]}
          </span>
          <button className="md-button" type="button" onClick={close}>
            <ArrowLeft />
            {vi ? "TRỞ VỀ KHÁM PHÁ" : "RETURN TO EXPLORATION"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function KhmerPlaceDirectory({
  lang,
  onSelect,
}: {
  lang: PlaceLanguage;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState<KhmerPlaceZone | "all">("all");
  const vi = lang === "vi";
  const results = khmerPlaces.filter(
    (place) =>
      (zone === "all" || place.zone === zone) &&
      normalizePlaceQuery(
        [
          place.title.vi,
          place.title.en,
          place.description.vi,
          place.description.en,
          ...place.tags.flatMap((tag) => [tag.vi, tag.en]),
        ].join(" "),
      ).includes(normalizePlaceQuery(query)),
  );
  return (
    <article className="md-place-directory">
      <span className="md-eyebrow">
        {vi ? "16 ĐIỂM · 4 KHU VỰC" : "16 PLACES · 4 AREAS"}
      </span>
      <h2 id="md-dialog-title">
        {vi ? "Chọn điểm khám phá" : "Choose a place to explore"}
      </h2>
      <p>
        {vi
          ? "Từ quần thể di tích đến những câu chuyện bên trong bảo tàng."
          : "From the heritage landscape to stories inside the museum."}
      </p>
      <label className="md-search-field">
        <Search />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            vi ? "Tìm tên điểm hoặc chủ đề…" : "Search places or topics…"
          }
          aria-label={vi ? "Tìm điểm khám phá" : "Search exploration points"}
        />
      </label>
      <div
        className="md-place-directory-filters"
        role="group"
        aria-label={vi ? "Lọc theo khu vực" : "Filter by area"}
      >
        <button
          type="button"
          aria-pressed={zone === "all"}
          onClick={() => setZone("all")}
        >
          {vi ? "Tất cả" : "All"}
        </button>
        {khmerPlaceZones.map((area) => (
          <button
            key={area.id}
            type="button"
            data-directory-zone={area.id}
            aria-pressed={zone === area.id}
            onClick={() => setZone(area.id)}
          >
            {area.title[lang]}
          </button>
        ))}
      </div>
      <p className="md-place-result-count" role="status">
        {results.length} {vi ? "điểm phù hợp" : "places found"}
      </p>
      <div className="md-place-directory-results">
        {results.map((place) => (
          <button
            key={place.id}
            type="button"
            data-directory-place={place.id}
            onClick={() => onSelect(place.id)}
          >
            <img
              src={khmerPlacePhotos[place.gallery[0]].src}
              alt=""
              loading="lazy"
            />
            <span>
              <small>
                {
                  khmerPlaceZones.find((area) => area.id === place.zone)!.title[
                    lang
                  ]
                }
              </small>
              <strong>{place.title[lang]}</strong>
              <p>{place.short[lang]}</p>
            </span>
            <ArrowRight />
          </button>
        ))}
      </div>
      {results.length === 0 && (
        <p className="md-place-empty">
          {vi
            ? "Chưa tìm thấy điểm phù hợp. Thử tên khác hoặc chọn một khu vực."
            : "No matching places. Try another name or choose an area."}
        </p>
      )}
    </article>
  );
}
