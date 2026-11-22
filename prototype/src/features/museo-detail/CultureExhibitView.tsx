import { InlineAudioActions } from "../../audio/InlineAudioActions";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Flower2, Grid2X2, Hammer, Home, Landmark, Music2, Sparkles, Users } from "lucide-react";
import { CulturePhotoImage } from "./CulturePhotoImage";
import { ExpandablePhoto } from "./ExpandableMedia";
import { cultureCollections, cultureGroupTopics } from "./khmerCultureCollections";
import { cultureExhibitLabel } from "./khmerCultureLabels";
import { khmerCultureGroups, khmerCulturePhotos, type CultureGroup, type CultureLanguage, type CultureTopic } from "./khmerCulture";

const groupIcons = { culture: Landmark, activities: CalendarDays, people: Users };
const collectionIcons: Record<string, typeof Landmark> = { beliefs: Flower2, arts: Music2, crafts: Hammer, customs: Users, festivals: CalendarDays, museum: Landmark, artisans: Hammer, generations: Users, community: Users };

export function CultureExhibitView({ groupId, filter, topics, topic, lang, active, chooseGroup, chooseFilter, chooseTopic, onHome, onSources, onDirectory, onRead }: {
  groupId: CultureGroup; filter: string; topics: CultureTopic[]; topic: CultureTopic; lang: CultureLanguage; active: boolean;
  chooseGroup: (id: CultureGroup) => void; chooseFilter: (id: string) => void; chooseTopic: (id: string) => void;
  onHome: () => void; onSources: () => void; onDirectory: () => void; onRead: () => void;
}) {
  const vi = lang === "vi";
  const strip = useRef<HTMLDivElement>(null);
  const selected = topics.findIndex(item => item.id === topic.id);
  const group = khmerCultureGroups.find(item => item.id === groupId)!;
  const count = cultureGroupTopics(groupId).length;
  const label = cultureExhibitLabel(topic, lang);
  const photoId = topic.gallery[0];
  const photo = khmerCulturePhotos[photoId];
  const category = cultureCollections[groupId].find(item => item.topics.includes(topic.id));
  const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
  useEffect(() => {
    const track = strip.current;
    if (!track || !active) return;
    const reveal = () => {
      const card = track.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!card) return;
      const item = card.getBoundingClientRect(), bounds = track.getBoundingClientRect();
      if (item.left < bounds.left) track.scrollLeft += item.left - bounds.left - 4;
      if (item.right > bounds.right) track.scrollLeft += item.right - bounds.right + 4;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(track);
    return () => observer.disconnect();
  }, [topic.id, filter, active]);
  const move = (step: number) => {
    const next = selected + step;
    if (next >= 0 && next < topics.length) chooseTopic(topics[next].id);
  };
  return <div className="khc-frame khc-frame--exhibit">
    <div className="khc-exhibit-backdrop" aria-hidden="true"><CulturePhotoImage id="userMask" decorative /></div>
    <aside className="khc-exhibit-sidebar">
      <header className="khc-exhibit-heading"><span className="khc-eyebrow">{vi ? "VĂN HÓA · HOẠT ĐỘNG · CON NGƯỜI" : "CULTURE · ACTIVITIES · PEOPLE"}</span><h2 id="md-tour-title">{vi ? "DI SẢN SỐNG" : "LIVING HERITAGE"}<span>{vi ? "của người Khmer." : "of the Khmer people."}</span></h2></header>
      <div className="khc-groups khc-groups--vertical" role="group" aria-label={vi ? "Nhóm di sản" : "Heritage groups"}>{khmerCultureGroups.map(item => { const Icon = groupIcons[item.id]; return <button type="button" key={item.id} data-culture-group={item.id} aria-pressed={groupId === item.id} onClick={() => chooseGroup(item.id)}><Icon /><span>{item.title[lang]}</span><small>{cultureGroupTopics(item.id).length}</small></button>; })}</div>
      <div className="khc-exhibit-filter-section"><h3>{vi ? `CHỦ ĐỀ ${group.title.vi.toUpperCase()}` : `${group.title.en.toUpperCase()} TOPICS`}</h3><div className="khc-filters khc-filters--vertical" role="group" aria-label={vi ? "Lọc chủ đề" : "Filter topics"}>
        <button type="button" data-culture-filter="all" aria-pressed={filter === "all"} onClick={() => chooseFilter("all")}><Grid2X2 /><span>{vi ? "Tất cả" : "All topics"}</span><small>{count}</small></button>
        {cultureCollections[groupId].map(collection => { const Icon = collectionIcons[collection.id] ?? Sparkles; return <button type="button" key={collection.id} data-culture-filter={collection.id} aria-pressed={filter === collection.id} onClick={() => chooseFilter(collection.id)}><Icon /><span>{collection.title[lang]}</span><small>{cultureGroupTopics(groupId, collection.id).length}</small></button>; })}
      </div></div>
      <nav className="khc-exhibit-links" aria-label={vi ? "Khám phá thêm" : "Explore more"}><button type="button" onClick={onHome}><Home /><span>{vi ? "Về Di sản sống" : "Heritage home"}</span></button><button type="button" data-action="culture-directory" onClick={onDirectory}><BookOpen /><span>{vi ? "Tìm chủ đề" : "Find a topic"}</span></button></nav>
    </aside>
    <div className="khc-exhibit-content">
      <div className="khc-exhibit-toolbar"><button type="button" className="khc-sources-button" onClick={onSources}><BookOpen /><span>{vi ? "Nguồn tư liệu" : "Sources"}</span></button></div>
      <article className="khc-exhibit-stage" data-culture-preview={topic.id}>
        <figure className="khc-exhibit-photo"><ExpandablePhoto title={photo.title[lang]} lang={lang}>{expanded => <CulturePhotoImage key={photoId} id={photoId} lang={lang} className="khc-exhibit-art" fit={expanded ? "contain" : "cover"} />}</ExpandablePhoto><figcaption>{photoId === "userMask" ? vi ? "Ảnh minh họa do bạn cung cấp" : "User-supplied illustration" : photo.author}</figcaption></figure>
        <div className="khc-exhibit-label" aria-live="polite" aria-atomic="true"><span className="khc-exhibit-overline">{category?.title[lang] ?? group.title[lang]}<i />{String(selected + 1).padStart(2, "0")} / {topics.length}</span><h3>{label.title}</h3><p className="khc-exhibit-summary">{label.text}</p><div className="khc-exhibit-observe"><span>{vi ? "NHÌN GẦN HƠN" : "LOOK CLOSER"}</span><p>{label.question}</p></div><InlineAudioActions lang={lang} id={`bao-tang-khmer:culture:${topic.id}`} /><button type="button" className="khc-exhibit-read" data-action="culture-read" onClick={onRead}>{vi ? "Xem chi tiết" : "Explore the story"}<ArrowRight /></button></div>
      </article>
      <div className="khc-filmstrip" onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); } }}>
        <button type="button" className="khc-filmstrip-arrow" disabled={selected === 0} onClick={() => move(-1)} aria-label={vi ? "Chủ đề trước" : "Previous topic"}><ArrowLeft /></button>
        <div className="khc-thumbnails" ref={strip} role="group" aria-label={vi ? "Chọn ảnh để xem thông tin nhanh" : "Select an image for a quick introduction"}
          onPointerDown={event => { drag.current = event.pointerType === "mouse" && event.button === 0 ? { id: event.pointerId, x: event.clientX, left: event.currentTarget.scrollLeft, moved: false } : null; }}
          onPointerMove={event => { const gesture = drag.current; if (!gesture || gesture.id !== event.pointerId || !(event.buttons & 1)) return; const distance = event.clientX - gesture.x; if (!gesture.moved && Math.abs(distance) < 6) return; gesture.moved = true; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.scrollLeft = gesture.left - distance; }}
          onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => { drag.current = null; }}
          onClickCapture={event => { if (drag.current?.moved && event.detail > 0) { event.preventDefault(); event.stopPropagation(); drag.current = null; } }}>
          {topics.map(item => <button key={item.id} type="button" data-culture-card={item.id} aria-pressed={topic.id === item.id} onClick={() => chooseTopic(item.id)} aria-label={cultureExhibitLabel(item, lang).title}><CulturePhotoImage id={item.gallery[0]} lang={lang} decorative /><span>{cultureExhibitLabel(item, lang).title}</span></button>)}
        </div>
        <button type="button" className="khc-filmstrip-arrow" disabled={selected === topics.length - 1} onClick={() => move(1)} aria-label={vi ? "Chủ đề tiếp theo" : "Next topic"}><ArrowRight /></button>
      </div>
    </div>
  </div>;
}
