import { InlineAudioActions } from "../../audio/InlineAudioActions";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CulturePhotoGallery } from "./KhmerMuseumCulture";
import { khmerCulturePhotos, type CultureLanguage } from "./khmerCulture";
import {
  khmerLegacyConnections,
  khmerLegacyGroups,
  khmerLegacySources,
  khmerLegacyValues,
  type LegacyFilter,
} from "./khmerLegacy";
import type { MuseumSection } from "./useMuseumScreens";
import { useLegacyMosaicMotion } from "./useLegacyMosaicMotion";

export function KhmerMuseumLegacy({
  active,
  lang,
  filter,
  selectedId,
  obscured = false,
  onFilter,
  onRead,
}: {
  active: boolean;
  lang: CultureLanguage;
  filter: LegacyFilter;
  selectedId?: string;
  obscured?: boolean;
  onFilter: (filter: LegacyFilter) => void;
  onRead: (id: string, origin?: HTMLElement) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (selectedId)
      setVisited((previous) =>
        previous.has(selectedId)
          ? previous
          : new Set([...previous, selectedId]),
      );
  }, [selectedId]);
  const motion = useLegacyMosaicMotion(root, filter, lang, active, obscured);
  const vi = lang === "vi";
  const values = khmerLegacyValues.filter(
    (value) => filter === "all" || value.group === filter,
  );
  return (
    <section
      ref={root}
      className="md-section md-exhibitions md-khmer-legacy"
      id="museo-exhibitions"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-exhibitions-title"
      lang={lang}
      data-reduced-motion={motion.reduced}
      data-obscured={obscured}
    >
      <img
        className="md-legacy-texture"
        src={khmerCulturePhotos.roof.src}
        alt=""
        aria-hidden="true"
      />
      <div className="md-legacy-light-sweep" aria-hidden="true" />
      <div className="md-exhibitions-content">
        <h2 id="md-exhibitions-title">
          <span className="md-legacy-title-part">
            <span>{vi ? "DẤU ẤN" : "HERITAGE"}</span>
          </span>{" "}
          <span className="md-legacy-title-part">
            <span>{vi ? "& GIÁ TRỊ DI SẢN" : "& LASTING VALUES"}</span>
          </span>
          <i className="md-legacy-title-rule" aria-hidden="true" />
        </h2>
        <p>
          {vi
            ? "Ngày nay nơi này còn để lại điều gì? Khám phá ký ức, tri thức và những giá trị được tiếp nối."
            : "What does this place leave us today? Discover its memory, knowledge and continuing cultural values."}
        </p>
        <div
          className="md-filters"
          role="group"
          aria-label={vi ? "Lọc giá trị di sản" : "Filter heritage values"}
        >
          {khmerLegacyGroups.map((group) => (
            <button
              type="button"
              key={group.id}
              data-legacy-filter={group.id}
              aria-pressed={filter === group.id}
              aria-controls="md-legacy-grid"
              className={filter === group.id ? "is-selected" : ""}
              onClick={() => {
                motion.prepareFilter(group.id);
                onFilter(group.id);
              }}
            >
              {group.title[lang]}{" "}
              <small>
                {
                  khmerLegacyValues.filter(
                    (value) => group.id === "all" || value.group === group.id,
                  ).length
                }
              </small>
            </button>
          ))}
          <i className="md-legacy-filter-indicator" aria-hidden="true" />
        </div>
        <p className="md-sr-only" role="status">
          {vi
            ? `${values.length} nhóm giá trị di sản`
            : `${values.length} heritage values`}
        </p>
        <div
          className="md-exhibition-grid"
          id="md-legacy-grid"
          data-count={values.length}
          onPointerMove={motion.pointerMove}
          onPointerLeave={motion.pointerLeave}
        >
          {values.map((value) => (
            <button
              type="button"
              className={`md-exhibition-card${selectedId === value.id ? " is-current" : ""}`}
              key={value.id}
              data-legacy-id={value.id}
              data-flip-id={`legacy-${value.id}`}
              data-legacy-group={value.group}
              data-explored={visited.has(value.id)}
              aria-haspopup="dialog"
              onClick={(event) => onRead(value.id, event.currentTarget)}
            >
              <img
                src={khmerCulturePhotos[value.gallery[0]].src}
                alt={khmerCulturePhotos[value.gallery[0]].title[lang]}
                loading="lazy"
              />
              <svg
                className="md-legacy-card-trace"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect
                  x=".5"
                  y=".5"
                  width="99"
                  height="99"
                  rx="2"
                  pathLength="400"
                />
              </svg>
              {visited.has(value.id) && (
                <span className="md-legacy-memory-tag">
                  {vi ? "Đã khám phá" : "Explored"}
                </span>
              )}
              <div>
                <h3>{value.title[lang]}</h3>
                <p>{value.summary[lang]}</p>
                {filter !== "all" && (
                  <p className="md-exhibition-detail">{value.lead[lang]}</p>
                )}
                <span className="md-small-arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function KhmerLegacyStory({
  valueId,
  lang,
  onRead,
  onExplore,
}: {
  valueId?: string;
  lang: CultureLanguage;
  onRead: (id: string) => void;
  onExplore: (section: MuseumSection, item: string) => void;
}) {
  const vi = lang === "vi";
  const index = Math.max(
    0,
    khmerLegacyValues.findIndex((value) => value.id === valueId),
  );
  const value = khmerLegacyValues[index];
  return (
    <article
      className="md-legacy-reading"
      data-legacy-story={value.id}
      lang={lang}
    >
      <span className="md-eyebrow">
        {vi ? "DẤU ẤN & GIÁ TRỊ DI SẢN" : "HERITAGE & LASTING VALUES"}
      </span>
      <h2 id="md-dialog-title" tabIndex={-1}>
        {value.title[lang]}
      </h2>
<InlineAudioActions lang={lang} id={`bao-tang-khmer:value:${value.id}`} />
      <CulturePhotoGallery key={value.id} ids={value.gallery} lang={lang} />
      <p className="md-legacy-lead">{value.lead[lang]}</p>
      <nav
        className="md-legacy-contents"
        aria-label={vi ? "Nội dung bài đọc" : "In this reading"}
      >
        {value.chapters.map((chapter, chapterIndex) => (
          <a
            key={chapter.id}
            href={`#md-legacy-${chapter.id}`}
            onClick={(event) => {
              event.preventDefault();
              const heading = document.getElementById(
                `md-legacy-${chapter.id}`,
              );
              heading?.scrollIntoView({ block: "start", behavior: "instant" });
              heading?.focus({ preventScroll: true });
            }}
          >
            <small>{String(chapterIndex + 1).padStart(2, "0")}</small>
            <span>{chapter.title[lang]}</span>
            <ArrowRight />
          </a>
        ))}
      </nav>
      <div className="md-khmer-story-prose md-story-text">
        {value.chapters.map((chapter) => (
          <section className="md-legacy-chapter" key={chapter.id}>
            <h3 id={`md-legacy-${chapter.id}`} tabIndex={-1}>
              {chapter.title[lang]}
            </h3>
            {chapter.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph[lang]}</p>
            ))}
          </section>
        ))}
      </div>
      {value.id === "continuity" && (
        <aside
          className="md-legacy-network"
          aria-label={
            vi
              ? "Mối liên hệ trong bảo tồn di sản"
              : "Connections in heritage conservation"
          }
        >
          <h3>{vi ? "Giữ những mối liên hệ" : "Keep the connections alive"}</h3>
          <ul>
            {khmerLegacyConnections.map((connection) => (
              <li key={connection.title.en}>
                <strong>{connection.title[lang]}</strong>
                <span>{connection.text[lang]}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <aside className="md-culture-question md-legacy-takeaway">
        <BookOpen />
        <div>
          <strong>{vi ? "GIÁ TRỊ CÒN LẠI" : "WHAT ENDURES"}</strong>
          <p>{value.takeaway[lang]}</p>
        </div>
      </aside>
      <footer className="md-khmer-story-sources">
        <strong>{vi ? "TƯ LIỆU ĐỐI CHIẾU" : "REFERENCE SOURCES"}</strong>
        {value.sources.map((id) => (
          <a
            className="md-story-source"
            key={id}
            href={khmerLegacySources[id].url}
            target="_blank"
            rel="noreferrer"
          >
            {khmerLegacySources[id].title[lang]}
            <ArrowRight />
          </a>
        ))}
      </footer>
      <div className="md-culture-related">
        <h3>{vi ? "TIẾP TỤC KHÁM PHÁ" : "CONTINUE EXPLORING"}</h3>
        <button
          type="button"
          data-legacy-explore={value.related.section}
          onClick={() => onExplore(value.related.section, value.related.item)}
        >
          {value.related.title[lang]}
          <ArrowRight />
        </button>
      </div>
      <nav
        className="md-legacy-next"
        aria-label={
          vi ? "Đọc nhóm giá trị khác" : "Read another heritage value"
        }
      >
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onRead(khmerLegacyValues[index - 1].id)}
        >
          <ChevronLeft />
          {vi ? "Giá trị trước" : "Previous value"}
        </button>
        <span>{String(index + 1).padStart(2, "0")} / 06</span>
        <button
          type="button"
          disabled={index === khmerLegacyValues.length - 1}
          onClick={() => onRead(khmerLegacyValues[index + 1].id)}
        >
          {vi ? "Giá trị tiếp" : "Next value"}
          <ChevronRight />
        </button>
      </nav>
    </article>
  );
}
