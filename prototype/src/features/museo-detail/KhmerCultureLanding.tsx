import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioContentContext } from '../../audio/context';
import { ArrowRight, BookOpen, Flower2, X } from "lucide-react";
import { khmerCultureGroups, khmerCulturePhotos, khmerCultureSources, khmerCultureTopics, type CultureGroup, type CultureLanguage } from "./khmerCulture";
import { cultureGroupCovers, cultureGroupIntroductions, cultureGroupTopics } from "./khmerCultureCollections";
import { CultureExhibitView } from "./CultureExhibitView";

function CultureSources({ lang, group, close }: { lang: CultureLanguage; group?: CultureGroup; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const vi = lang === "vi";
  const sources = useMemo(() => {
    const entries = new Map<string, string>();
    for (const topic of khmerCultureTopics.filter(item => !group || item.group === group)) {
      for (const id of topic.sources) {
        const source = khmerCultureSources[id];
        entries.set(source.url, source.title[lang]);
      }
      for (const id of topic.gallery) {
        const photo = khmerCulturePhotos[id];
        if (!entries.has(photo.sourceUrl)) entries.set(photo.sourceUrl, photo.author);
      }
    }
    return [...entries];
  }, [group, lang]);
  useEffect(() => {
    const origin = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => { node?.close(); origin?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="khc-sources-dialog" aria-labelledby="khc-sources-title" onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); close(); }}>
    <header><div><span>{vi ? "DI SẢN SỐNG" : "LIVING HERITAGE"}</span><h2 id="khc-sources-title">{vi ? "Nguồn tư liệu" : "Documentary sources"}</h2></div><button type="button" onClick={close} aria-label={vi ? "Đóng nguồn tư liệu" : "Close sources"}><X /></button></header>
    <p>{vi ? "Các bài viết và ảnh tư liệu được dùng cho những câu chuyện trong trang này. Ảnh trong từng bài có chú thích và nguồn riêng." : "Articles and documentary photographs used in these stories. Individual photographs retain their captions and credits in the reader."}</p>
    <div>{sources.map(([url, title]) => <a key={url} href={url} target="_blank" rel="noreferrer"><BookOpen /><span>{title}</span><ArrowRight /></a>)}</div>
  </dialog>;
}

export function KhmerCultureHub({ lang, active, obscured = false, selectedId, onSelect, onRead }: {
  lang: CultureLanguage; active: boolean; obscured?: boolean; selectedId: string; onSelect: (id: string) => void; onRead: (id?: string) => void;
}) {
  const lastSelected = useRef(selectedId);
  const groupSelections = useRef<Partial<Record<CultureGroup, string>>>({});
  const [groupId, setGroupId] = useState<CultureGroup>();
  const [filter, setFilter] = useState("all");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const vi = lang === "vi";
  const topics = useMemo(() => groupId ? cultureGroupTopics(groupId, filter) : [], [groupId, filter]);
  const topic = topics.find(item => item.id === selectedId) ?? topics[0];
  useAudioContentContext(groupId && topic ? `bao-tang-khmer:culture:${topic.id}` : 'bao-tang-khmer:section:tour', active && !obscured);
  useEffect(() => {
    if (lastSelected.current === selectedId) return;
    lastSelected.current = selectedId;
    const next = khmerCultureTopics.find(item => item.id === selectedId);
    if (!next) return;
    groupSelections.current[next.group] = next.id;
    setGroupId(next.group);
    setFilter("all");
  }, [selectedId]);
  useEffect(() => { if (!active) setSourcesOpen(false); }, [active]);
  const chooseTopic = (id: string) => {
    const next = khmerCultureTopics.find(item => item.id === id);
    if (!next) return;
    lastSelected.current = id;
    groupSelections.current[next.group] = id;
    onSelect(id);
  };
  const chooseGroup = (id: CultureGroup) => {
    setGroupId(id);
    setFilter("all");
    chooseTopic(groupSelections.current[id] ?? { culture: "robam", activities: "okom", people: "thachsang" }[id]);
  };
  const chooseFilter = (id: string) => {
    if (!groupId) return;
    setFilter(id);
    const next = cultureGroupTopics(groupId, id);
    if (!next.some(item => item.id === selectedId) && next[0]) chooseTopic(next[0].id);
  };
  return <section id="museo-tour" className="md-section md-tour-section md-khmer-culture md-culture-hub" hidden={!active} tabIndex={-1} lang={lang} aria-labelledby="md-tour-title" data-culture-view={groupId ?? "home"} data-culture-filter={filter} data-culture-topic={selectedId} data-obscured={obscured}>
    {groupId && topic ? <CultureExhibitView groupId={groupId} filter={filter} topics={topics} topic={topic} lang={lang} active={active} chooseGroup={chooseGroup} chooseFilter={chooseFilter} chooseTopic={chooseTopic} onHome={() => setGroupId(undefined)} onSources={() => setSourcesOpen(true)} onDirectory={() => onRead()} onRead={() => onRead(topic.id)} /> : <div className="khc-frame">
      <header className="khc-header"><div className="khc-topline"><span className="khc-eyebrow">{vi ? "VĂN HÓA · HOẠT ĐỘNG · CON NGƯỜI" : "CULTURE · ACTIVITIES · PEOPLE"}</span><button className="khc-sources-button" type="button" onClick={() => setSourcesOpen(true)}><BookOpen /><span>{vi ? "Nguồn tư liệu" : "Sources"}</span></button></div><div className="khc-heading"><h2 id="md-tour-title">{vi ? "Di sản sống" : "Living heritage"}<span>{vi ? "của người Khmer." : "of the Khmer people."}</span></h2><p>{vi ? "Khám phá những giá trị văn hóa, sinh hoạt, tín ngưỡng và con người được gìn giữ, lan tỏa trong đời sống cộng đồng Khmer Nam Bộ." : "Discover the culture, everyday life, beliefs and people keeping heritage alive in Southern Khmer communities."}</p></div></header>
      <div className="khc-feature-grid" aria-label={vi ? "Khám phá ba nhóm di sản" : "Explore three heritage groups"}>{khmerCultureGroups.map(item => { const photo = khmerCulturePhotos[cultureGroupCovers[item.id]]; return <button key={item.id} className="khc-feature-card" type="button" data-culture-entry-group={item.id} onClick={() => chooseGroup(item.id)}><img src={photo.src} alt={photo.title[lang]} draggable={false} /><span className="khc-feature-copy"><strong>{item.title[lang]}</strong><span className="khc-feature-bottom"><span className="khc-feature-description">{cultureGroupIntroductions[item.id][lang]}</span><span className="khc-card-arrow"><ArrowRight /></span></span></span></button>; })}</div>
      <footer className="khc-footer"><Flower2 /><p>{vi ? `Cùng khám phá ${khmerCultureTopics.length} câu chuyện về di sản sống của người Khmer Nam Bộ.` : `Explore ${khmerCultureTopics.length} stories of Southern Khmer living heritage.`}</p><button type="button" data-action="culture-directory" onClick={() => onRead()}>{vi ? "Xem tất cả chủ đề" : "View all topics"}<ArrowRight /></button></footer>
    </div>}
    {sourcesOpen && <CultureSources lang={lang} group={groupId} close={() => setSourcesOpen(false)} />}
  </section>;
}
