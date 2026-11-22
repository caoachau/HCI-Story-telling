import { InlineAudioActions } from "../../audio/InlineAudioActions";
import { useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { khmerCultureGroups, khmerCulturePhotos, khmerCultureSources, khmerCultureTopics, type CultureLanguage, type CulturePhotoId } from "./khmerCulture";
import { CulturePhotoImage } from "./CulturePhotoImage";
import { ExpandablePhoto } from "./ExpandableMedia";
export { KhmerCultureHub as KhmerMuseumCulture } from "./KhmerCultureLanding";

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
        <ExpandablePhoto title={photo.title[lang]} lang={lang} className="md-story-photo"><CulturePhotoImage id={ids[selected]} lang={lang} fit="contain" /></ExpandablePhoto>
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
            <CulturePhotoImage id={id} decorative lang={lang} />
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
<InlineAudioActions lang={lang} id={topic ? `bao-tang-khmer:culture:${topic.id}` : undefined} />
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
            <span>{vi ? `Tìm trong ${khmerCultureTopics.length} chủ đề` : `Search ${khmerCultureTopics.length} topics`}</span>
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
