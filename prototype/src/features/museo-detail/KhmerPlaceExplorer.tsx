import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";
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
        {vi ? `${khmerPlaces.length} ĐIỂM · ${khmerPlaceZones.length} KHU VỰC` : `${khmerPlaces.length} PLACES · ${khmerPlaceZones.length} AREAS`}
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
