import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { TourPhotoDrawer } from "./TourPhotoDrawer";
import { TourGalleryStrip } from "./TourGalleryStrip";
import {
  khmerCultureGroups,
  khmerCulturePhotos,
  khmerCultureSources,
  khmerCultureTopics,
  type CultureLanguage,
  type CulturePhotoId,
} from "./khmerCulture";
import { useCultureMotion } from "./useCultureMotion";

export function KhmerMuseumCulture({
  lang,
  active,
  obscured = false,
  selectedId,
  onSelect,
  onRead,
}: {
  lang: CultureLanguage;
  active: boolean;
  obscured?: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onRead: (id?: string) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const vi = lang === "vi";
  const topic =
    khmerCultureTopics.find((item) => item.id === selectedId) ??
    khmerCultureTopics[0];
  const group = khmerCultureGroups.find((item) => item.id === topic.group)!;
  const topics = useMemo(
    () => khmerCultureTopics.filter((item) => item.group === topic.group),
    [topic.group],
  );
  const selected = topics.findIndex((item) => item.id === topic.id);
  const selectedPhoto = khmerCulturePhotos[topic.gallery[0]];
  const items = useMemo(
    () =>
      topics.map((item) => ({
        id: item.id,
        name: item.title[lang],
        photo: khmerCulturePhotos[item.gallery[0]].src,
        background: khmerCulturePhotos[item.gallery[0]].src,
      })),
    [topics, lang],
  );
  const motion = useCultureMotion(root, topic.id, lang, active, obscured);
  const choose = (
    index: number,
    origin?: HTMLButtonElement,
    direction?: number,
  ) => {
    motion.prepare(
      topics[index].id,
      origin,
      direction ?? Math.sign(index - selected),
    );
    onSelect(topics[index].id);
  };
  const move = (direction: number) =>
    choose(
      (selected + direction + topics.length) % topics.length,
      undefined,
      direction,
    );

  return (
    <section
      ref={root}
      className="md-section md-tour-section md-khmer-culture"
      id="museo-tour"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-tour-title"
      lang={lang}
      data-culture-topic={topic.id}
      data-reduced-motion={motion.reduced}
      data-obscured={obscured}
    >
      <div className="md-tour-frame">
        <div className="md-culture-camera">
          <img
            className="md-tour-art is-alternate"
            src={selectedPhoto.src}
            alt={selectedPhoto.title[lang]}
            loading="lazy"
          />
        </div>
        <div className="md-culture-curtain" aria-hidden="true" />
        <div className="md-culture-light" aria-hidden="true" />
        <div className="md-tour-copy">
          <span className="md-eyebrow">
            {vi
              ? "VĂN HÓA · HOẠT ĐỘNG · CON NGƯỜI"
              : "CULTURE · ACTIVITIES · PEOPLE"}
          </span>
          <h2 className="md-display" id="md-tour-title">
            <span className="md-culture-title-line">
              <span className="md-culture-title-text">
                {vi ? "DI SẢN" : "LIVING"}
              </span>
            </span>
            <span className="md-culture-title-line">
              <span className="md-culture-title-text">
                {vi ? "SỐNG" : "HERITAGE"}
              </span>
            </span>
          </h2>
          <p className="md-tour-location">
            {vi
              ? "Bảo tàng văn hóa Khmer · Trà Vinh"
              : "Khmer Culture Museum · Tra Vinh"}
          </p>
          <p className="md-culture-intro">
            {vi
              ? "Từ hiện vật đến đời sống: lễ hội, nghề truyền thống và những con người tiếp nối ký ức Khmer."
              : "From objects to life: celebrations, traditional skills and the people carrying Khmer memory forward."}
          </p>
          <div
            className="md-culture-groups"
            role="group"
            aria-label={vi ? "Nhóm chủ đề di sản" : "Heritage topic groups"}
          >
            {khmerCultureGroups.map((item) => (
              <button
                type="button"
                key={item.id}
                data-culture-group={item.id}
                aria-pressed={topic.group === item.id}
                onClick={() => {
                  const next = khmerCultureTopics.find(
                    (entry) => entry.group === item.id,
                  )!.id;
                  motion.prepare(next);
                  onSelect(next);
                }}
              >
                {item.title[lang]}{" "}
                <small>
                  {
                    khmerCultureTopics.filter(
                      (entry) => entry.group === item.id,
                    ).length
                  }
                </small>
              </button>
            ))}
            <i className="md-culture-lens-indicator" aria-hidden="true" />
          </div>
          <div className="md-tour-ctas">
            <button
              type="button"
              className="md-button md-button-primary"
              data-action="culture-read"
              onClick={() => onRead(topic.id)}
            >
              <BookOpen />
              {vi ? "ĐỌC CHỦ ĐỀ" : "READ THIS STORY"}
              <ArrowRight />
            </button>
            <button
              type="button"
              className="md-button"
              data-action="culture-directory"
              onClick={() => onRead()}
            >
              <Images />
              {vi ? "TÌM CHỦ ĐỀ" : "ALL TOPICS"}
            </button>
          </div>
        </div>
        <a
          className="md-culture-photo-credit"
          href={selectedPhoto.sourceUrl}
          target="_blank"
          rel="noreferrer"
          title={selectedPhoto.caption[lang]}
        >
          <Images />
          <span>{selectedPhoto.author}</span>
          <ArrowRight />
        </a>
        <TourPhotoDrawer
          items={items}
          lang={lang}
          selectedScene={selected}
          onSelect={choose}
        />
        <TourGalleryStrip
          items={items}
          lang={lang}
          active={active}
          selectedScene={selected}
          onSelect={choose}
          onPreview={(index) =>
            motion.preview(index === undefined ? undefined : topics[index].id)
          }
        />
        <div
          className="md-tour-scene-caption"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="md-culture-caption-top">
            <span className="md-eyebrow">
              <span className="md-culture-index-mask">
                <span className="md-culture-index-current">
                  {String(selected + 1).padStart(2, "0")}
                </span>
              </span>{" "}
              /{" "}
              <span className="md-culture-total-mask">
                <span className="md-culture-total-current">
                  {String(topics.length).padStart(2, "0")}
                </span>
              </span>{" "}
              · {group.title[lang]}
            </span>
            <div>
              <button
                type="button"
                className="md-round"
                aria-label={vi ? "Chủ đề trước" : "Previous topic"}
                onClick={() => move(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className="md-round"
                aria-label={vi ? "Chủ đề tiếp theo" : "Next topic"}
                onClick={() => move(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <h3 className="md-culture-story-mask">
            <span className="md-culture-story-current">
              {topic.title[lang]}
            </span>
          </h3>
          <p>{topic.summary[lang]}</p>
          <span className="md-culture-context">{topic.context[lang]}</span>
        </div>
        <div className="md-culture-rail-progress" aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}

export function CulturePhotoGallery({
  ids,
  lang,
}: {
  ids: CulturePhotoId[];
  lang: CultureLanguage;
}) {
  const [selected, setSelected] = useState(0);
  const photo = khmerCulturePhotos[ids[selected]];
  return (
    <div className="md-culture-gallery">
      <figure>
        <img
          className="md-story-photo"
          src={photo.src}
          alt={photo.title[lang]}
        />
        <figcaption>
          <span>{photo.caption[lang]}</span>
          <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
            {photo.author}
            <ArrowRight />
          </a>
        </figcaption>
      </figure>
      <div
        className="md-culture-story-photos"
        aria-label={
          lang === "vi" ? "Chọn ảnh tư liệu" : "Choose a documentary photograph"
        }
      >
        {ids.map((id, index) => (
          <button
            type="button"
            key={id}
            aria-label={khmerCulturePhotos[id].title[lang]}
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <img src={khmerCulturePhotos[id].src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function KhmerCultureStory({
  topicId,
  lang,
  onRead,
}: {
  topicId?: string;
  lang: CultureLanguage;
  onRead: (id: string) => void;
}) {
  const vi = lang === "vi";
  const topic = khmerCultureTopics.find((item) => item.id === topicId);
  const [query, setQuery] = useState("");
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase();
  const related = topic
    ? khmerCultureTopics
        .filter((item) => item.group === topic.group && item.id !== topic.id)
        .slice(0, 3)
    : [];
  return (
    <article
      className="md-culture-reading"
      data-culture-story={topic?.id ?? "directory"}
      lang={lang}
    >
      {topic ? (
        <CulturePhotoGallery key={topic.id} ids={topic.gallery} lang={lang} />
      ) : null}
      <span className="md-eyebrow">
        {vi
          ? "VĂN HÓA · HOẠT ĐỘNG · CON NGƯỜI"
          : "CULTURE · ACTIVITIES · PEOPLE"}
      </span>
      <h2 id="md-dialog-title" tabIndex={-1}>
        {topic?.title[lang] ??
          (vi ? "Những câu chuyện di sản sống" : "Stories of living heritage")}
      </h2>
      {topic ? (
        <>
          <p className="md-culture-reading-context">{topic.context[lang]}</p>
          <div className="md-khmer-story-prose md-story-text">
            {topic.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph[lang]}</p>
            ))}
          </div>
          <aside className="md-culture-question">
            <BookOpen />
            <div>
              <strong>{vi ? "CÙNG QUAN SÁT" : "LOOK A LITTLE CLOSER"}</strong>
              <p>{topic.question[lang]}</p>
            </div>
          </aside>
          <footer className="md-khmer-story-sources">
            <strong>{vi ? "TƯ LIỆU ĐỐI CHIẾU" : "REFERENCE SOURCES"}</strong>
            {topic.sources.map((id) => (
              <a
                className="md-story-source"
                key={id}
                href={khmerCultureSources[id].url}
                target="_blank"
                rel="noreferrer"
              >
                {khmerCultureSources[id].title[lang]}
                <ArrowRight />
              </a>
            ))}
          </footer>
          <div className="md-culture-related">
            <h3>{vi ? "TIẾP TỤC KHÁM PHÁ" : "CONTINUE EXPLORING"}</h3>
            {related.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onRead(item.id)}
              >
                {item.title[lang]}
                <ArrowRight />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="md-story-text">
            {vi
              ? "Bảo tàng lưu giữ và giải thích di sản; lễ hội, nghề và nghệ thuật còn được thực hành tại chùa, phum sóc, gia đình và sân khấu trong vùng. Chọn một chủ đề để đọc câu chuyện, xem ảnh và nguồn tư liệu."
              : "The museum preserves and interprets heritage. Celebrations, crafts and arts are also practised in pagodas, villages, homes and regional stages. Choose a topic to read its story, photographs and references."}
          </p>
          <label className="md-culture-search">
            <span>{vi ? "Tìm trong 24 chủ đề" : "Search 24 topics"}</span>
            <input
              type="search"
              value={query}
              placeholder={
                vi
                  ? "Lễ hội, nghệ nhân, nhạc cụ…"
                  : "Celebrations, artisans, instruments…"
              }
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          {khmerCultureGroups.map((group) => {
            const entries = khmerCultureTopics.filter(
              (item) =>
                item.group === group.id &&
                normalize(`${item.title[lang]} ${item.summary[lang]}`).includes(
                  normalize(query),
                ),
            );
            return entries.length ? (
              <section className="md-culture-directory-group" key={group.id}>
                <h3>
                  {group.title[lang]} <small>{entries.length}</small>
                </h3>
                <p>{group.description[lang]}</p>
                <div>
                  {entries.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      data-culture-entry={item.id}
                      onClick={() => onRead(item.id)}
                    >
                      <img
                        src={khmerCulturePhotos[item.gallery[0]].src}
                        alt=""
                        loading="lazy"
                      />
                      <span>
                        <strong>{item.title[lang]}</strong>
                        <small>{item.context[lang]}</small>
                      </span>
                      <ArrowRight />
                    </button>
                  ))}
                </div>
              </section>
            ) : null;
          })}
          {!khmerCultureTopics.some((item) =>
            normalize(`${item.title[lang]} ${item.summary[lang]}`).includes(
              normalize(query),
            ),
          ) && (
            <p role="status">
              {vi
                ? "Chưa tìm thấy chủ đề. Thử từ khóa khác."
                : "No topics found. Try another search."}
            </p>
          )}
        </>
      )}
    </article>
  );
}
