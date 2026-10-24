import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from "lucide-react";
import {
  khmerHistoryIntro,
  khmerHistoryPhases,
  khmerHistoryPhotos,
  khmerHistorySources,
  type HistoryLanguage,
  type HistoryPhotoId,
} from "./khmerHistory";
import { useHistoryTimelineMotion } from "./useHistoryTimelineMotion";

type ReadHistory = (phaseId?: string, topicId?: string) => void;

export function KhmerMuseumHistory({
  lang,
  active,
  selectedPhase,
  onSelect,
  onRead,
}: {
  lang: HistoryLanguage;
  active: boolean;
  selectedPhase: number;
  onSelect: (index: number) => void;
  onRead: ReadHistory;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const phase = khmerHistoryPhases[selectedPhase];
  const photo = khmerHistoryPhotos[phase.photo];
  const vi = lang === "vi";
  const motion = useHistoryTimelineMotion(root, selectedPhase, lang, active);
  const select = (index: number, direction?: number) => {
    motion.setDirection(direction ?? Math.sign(index - selectedPhase));
    onSelect(index);
  };
  const move = (direction: number) =>
    select(
      (selectedPhase + direction + khmerHistoryPhases.length) %
        khmerHistoryPhases.length,
      direction,
    );
  useEffect(() => {
    if (!active) return;
    const element = track.current;
    const card = element?.querySelector<HTMLElement>(".is-selected");
    if (!element || !card) return;
    const reveal = () => {
      const rect = element.getBoundingClientRect();
      const box = card.getBoundingClientRect();
      if (box.left < rect.left) element.scrollLeft += box.left - rect.left - 8;
      if (box.right > rect.right)
        element.scrollLeft += box.right - rect.right + 8;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(element);
    return () => observer.disconnect();
  }, [selectedPhase, active]);

  return (
    <section
      ref={root}
      className="md-section md-timeline md-framed md-khmer-history"
      id="museo-timeline"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-timeline-title"
      lang={lang}
      data-reduced-motion={motion.reduced}
    >
      <div className="md-frame">
        <div className="md-evolution-top">
          <img
            className="md-evolution-art"
            src={khmerHistoryPhotos.roof.src}
            alt={khmerHistoryPhotos.roof.title[lang]}
            loading="lazy"
          />
          <div className="md-evolution-copy">
            <span className="md-eyebrow">
              {khmerHistoryIntro.eyebrow[lang]}
            </span>
            <h2 className="md-display" id="md-timeline-title">
              <span>{khmerHistoryIntro.headline[lang]}</span>
              <span>{khmerHistoryIntro.headlineSecond[lang]}</span>
            </h2>
            <p className="md-mono">{khmerHistoryIntro.description[lang]}</p>
            <button
              className="md-play-link"
              type="button"
              data-action="history-introduction"
              onClick={() => onRead()}
            >
              <span>
                <BookOpen />
              </span>
              {vi ? "ĐỌC HÀNH TRÌNH" : "READ THE JOURNEY"}
            </button>
          </div>
          <aside className="md-evolution-note">
            <span>1992 — 2026</span>
            <strong>34</strong>
            <span>{vi ? "NĂM GÌN GIỮ" : "YEARS PRESERVING"}</span>
            <span>{vi ? "& LAN TỎA DI SẢN" : "& SHARING HERITAGE"}</span>
            <small>
              {vi ? "05 GIAI ĐOẠN · 26 CÂU CHUYỆN" : "05 PERIODS · 26 STORIES"}
            </small>
          </aside>
        </div>
        <div
          ref={track}
          className="md-era-track"
          aria-label={
            vi
              ? "Các giai đoạn phát triển bảo tàng"
              : "Museum development timeline"
          }
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 4
                  : (selectedPhase +
                      (event.key === "ArrowRight" ? 1 : -1) +
                      5) %
                    5;
            select(next, event.key === "ArrowLeft" ? -1 : 1);
            track.current
              ?.querySelector<HTMLButtonElement>(
                `[data-history-phase="${khmerHistoryPhases[next].id}"]`,
              )
              ?.focus({ preventScroll: true });
          }}
        >
          {khmerHistoryPhases.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-history-phase={item.id}
              className={
                selectedPhase === index
                  ? "is-selected"
                  : index < selectedPhase
                    ? "is-past"
                    : "is-future"
              }
              aria-pressed={selectedPhase === index}
              onClick={() => select(index)}
            >
              <span className="md-era-photo">
                <img
                  src={khmerHistoryPhotos[item.photo].src}
                  alt=""
                  loading="lazy"
                />
              </span>
              <i className="md-history-dot" aria-hidden="true" />
              <strong>{item.title[lang]}</strong>
              <span>{item.range}</span>
              <small>{item.subtitle[lang]}</small>
            </button>
          ))}
          <button
            type="button"
            className="md-round"
            aria-label={vi ? "Giai đoạn tiếp theo" : "Next period"}
            onClick={() => move(1)}
          >
            <ChevronRight />
          </button>
          <div className="md-history-rail" aria-hidden="true">
            <i className="md-history-progress" />
          </div>
        </div>
        <div className="md-era-detail" data-history-detail={phase.id}>
          <div className="md-era-story">
            <img
              className="md-era-scene"
              src={photo.src}
              alt={photo.title[lang]}
              loading="lazy"
            />
            <div className="md-era-detail-copy">
              <div className="md-era-pagination">
                <span>0{selectedPhase + 1} / 05</span>
                <button
                  type="button"
                  className="md-round"
                  aria-label={vi ? "Giai đoạn trước" : "Previous period"}
                  onClick={() => move(-1)}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  className="md-round"
                  aria-label={
                    vi ? "Chi tiết giai đoạn tiếp theo" : "Next period detail"
                  }
                  onClick={() => move(1)}
                >
                  <ChevronRight />
                </button>
              </div>
              <h3 className="md-display md-history-title-mask">
                <span className="md-history-title-current">
                  {phase.title[lang]}
                </span>
              </h3>
              <p className="md-eyebrow md-history-year-mask">
                <span className="md-history-year-current">{phase.range}</span>
              </p>
              <p className="md-eyebrow md-era-kicker">{phase.kicker[lang]}</p>
              <p className="md-mono md-era-description">
                {phase.description[lang]}
              </p>
              <p className="md-mono md-era-preview">
                {phase.preview[lang]}{" "}
                <button type="button" onClick={() => onRead(phase.id)}>
                  {vi ? "Đọc thêm" : "Read more"} <ArrowRight />
                </button>
              </p>
              <div className="md-era-facts">
                {phase.facts.map((fact, index) => {
                  return (
                    <div key={fact.label[lang]}>
                      <span
                        className="md-history-fact-number"
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                      <strong>{fact.label[lang]}</strong>
                      <small>{fact.value[lang]}</small>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="md-africa-caption"
              type="button"
              onClick={() => onRead(phase.id)}
              aria-label={
                vi
                  ? "Đọc giai đoạn và nguồn ảnh tư liệu"
                  : "Read this period and photograph credits"
              }
              title={phase.photoDate[lang]}
            >
              <Landmark />
              <span>
                <strong>{vi ? "ẢNH TƯ LIỆU" : "ARCHIVE PHOTO"}</strong>
                <small>{phase.photoDate[lang]}</small>
              </span>
            </button>
          </div>
          <aside
            className="md-era-highlights"
            aria-label={
              vi
                ? `Câu chuyện giai đoạn ${phase.range}`
                : `Stories from ${phase.range}`
            }
          >
            <div className="md-era-highlights-heading">
              <span>{phase.title[lang]}</span>
              <small>
                {phase.topics.length} {vi ? "CÂU CHUYỆN" : "STORIES"}
              </small>
            </div>
            <div
              key={phase.id}
              className="md-era-highlights-list"
              role="region"
              aria-label={
                vi
                  ? `Danh sách câu chuyện ${phase.range}, cuộn để xem thêm`
                  : `${phase.range} stories, scroll for more`
              }
              tabIndex={0}
            >
              {phase.topics.map((topic, index) => (
                <button
                  key={topic.id}
                  data-topic-id={topic.id}
                  type="button"
                  onClick={() => onRead(phase.id, topic.id)}
                >
                  <img
                    src={khmerHistoryPhotos[topic.photo].src}
                    alt=""
                    loading="lazy"
                  />
                  <span className="md-history-story-copy">
                    <em className="md-history-story-number" aria-hidden="true">
                      0{index + 1}
                    </em>
                    <strong>{topic.title[lang]}</strong>
                    <small>
                      <time>{topic.date[lang]}</time> · {topic.summary[lang]}
                    </small>
                  </span>
                  <span className="md-small-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
        <p
          className="md-history-announcement"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {phase.title[lang]} · {phase.range}
        </p>
      </div>
    </section>
  );
}

function HistoryPhotoGallery({
  ids,
  lang,
}: {
  ids: HistoryPhotoId[];
  lang: HistoryLanguage;
}) {
  const [selected, setSelected] = useState(0);
  const photo = khmerHistoryPhotos[ids[selected]];
  return (
    <div className="md-history-gallery">
      <figure>
        <img
          className="md-story-photo"
          src={photo.src}
          alt={photo.title[lang]}
        />
        <figcaption>
          <span>{photo.caption[lang]}</span>
          <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
            {photo.author} <ArrowRight />
          </a>
        </figcaption>
      </figure>
      {ids.length > 1 && (
        <div
          className="md-history-photo-strip"
          aria-label={
            lang === "vi"
              ? "Chọn ảnh tư liệu"
              : "Choose a documentary photograph"
          }
        >
          {ids.map((id, index) => (
            <button
              type="button"
              key={id}
              aria-label={khmerHistoryPhotos[id].title[lang]}
              aria-pressed={selected === index}
              onClick={() => setSelected(index)}
            >
              <img src={khmerHistoryPhotos[id].src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function KhmerHistoryStory({
  phaseId,
  topicId,
  lang,
}: {
  phaseId?: string;
  topicId?: string;
  lang: HistoryLanguage;
}) {
  const phase = khmerHistoryPhases.find((item) => item.id === phaseId);
  const topic = phase?.topics.find((item) => item.id === topicId);
  const vi = lang === "vi";
  const gallery = [
    ...new Set<HistoryPhotoId>(
      topic
        ? [
            topic.photo,
            phase!.photo,
            ...phase!.topics.map((item) => item.photo),
          ]
        : phase
          ? [phase.photo, ...phase.topics.map((item) => item.photo)]
          : ["facade", "music2008", "opening2024"],
    ),
  ].slice(0, 3);
  const sources = [
    ...new Set(
      topic
        ? topic.sources
        : phase
          ? phase.topics.flatMap((item) => item.sources)
          : ([
              "visitors",
              "archive",
              "early",
              "reopening",
              "mdta",
              "event",
            ] as const),
    ),
  ];
  return (
    <article
      className="md-history-reading"
      lang={lang}
      data-history-story={topic?.id ?? phase?.id ?? "introduction"}
    >
      <HistoryPhotoGallery ids={gallery} lang={lang} />
      <span className="md-eyebrow">
        {phase?.title[lang] ?? khmerHistoryIntro.eyebrow[lang]}
      </span>
      <h2 id="md-dialog-title">
        {topic?.title[lang] ??
          (phase
            ? `${phase.title[lang]} · ${phase.range}`
            : vi
              ? "Lịch sử hình thành & phát triển"
              : "Formation and development")}
      </h2>
      <p className="md-history-reading-date">
        {topic?.date[lang] ?? phase?.range ?? "1992 – 2026"}
      </p>
      <div className="md-khmer-story-prose md-story-text">
        {topic ? (
          topic.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph[lang]}</p>
          ))
        ) : (
          <>
            <p>
              {phase?.description[lang] ?? khmerHistoryIntro.description[lang]}
            </p>
            <p>
              {vi
                ? "Các mốc dưới đây được đọc theo từng giai đoạn. Số phòng, số hiện vật và lượt khách thuộc thời điểm của tư liệu; mỗi ảnh có chú thích và nguồn riêng."
                : "Read the milestones as successive periods. Room counts, objects and visits belong to their reporting dates; each photograph has its own caption and source."}
            </p>
            <ol className="md-history-chronology">
              {phase
                ? phase.topics.map((item) => (
                    <li key={item.id}>
                      <time>{item.date[lang]}</time>
                      <h3>{item.title[lang]}</h3>
                      <p>{item.summary[lang]}</p>
                    </li>
                  ))
                : khmerHistoryPhases.map((item) => (
                    <li key={item.id}>
                      <time>{item.range}</time>
                      <h3>{item.title[lang]}</h3>
                      <p>{item.description[lang]}</p>
                    </li>
                  ))}
            </ol>
          </>
        )}
      </div>
      <footer className="md-khmer-story-sources">
        <strong>{vi ? "TƯ LIỆU ĐỐI CHIẾU" : "REFERENCE SOURCES"}</strong>
        {sources.map((id) => (
          <a
            className="md-story-source"
            key={id}
            href={khmerHistorySources[id].url}
            target="_blank"
            rel="noreferrer"
          >
            {khmerHistorySources[id].title[lang]} <ArrowRight />
          </a>
        ))}
      </footer>
    </article>
  );
}
