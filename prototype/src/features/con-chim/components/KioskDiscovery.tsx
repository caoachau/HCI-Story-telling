import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Camera, Check, ChevronLeft, ChevronRight, Compass, Expand, Home, Leaf, Map, MapPin, MoreHorizontal, PanelRightClose, PanelRightOpen, QrCode, ScrollText, Shrink, Utensils, Users, X } from 'lucide-react';
import { HERO_BANNER, PHOTOS, mapLink } from '../data/conChimData';
import { DISCOVERY_STORIES, INTERESTS, type Interest } from '../data/kt01Stories';
import { useKioskHost } from '../utils/useKioskHost';
import { readStoryLink, type ReaderMode, type StoryContext } from '../utils/storyLinks';
import { DiscoveryImage } from './DiscoveryImage';
import { DiscoveryReader } from './DiscoveryReader';
import { ConChimOverview } from './ConChimOverview';
import { ConChimHistory, ConChimCommunity, ConChimExperiences } from './ConChimSections';
import { CONTENT_SECTIONS, COMMUNITY_TOPICS, EXPERIENCE_OPTIONS, HISTORY_STOPS, type ConChimView, type OpenStory } from '../data/sectionContent';
import '../discovery.css';
import '../storyLayers.css';
import '../sections.css';
import { restoredParams, setEntryIssue, updateRoute, useRememberedState } from '../../../experience/state';

const interestIcons = { food: Utensils, landscape: Camera, local: Users };
const openingPhotos = [PHOTOS[0], HERO_BANNER, PHOTOS[6]];
const openingTitles = ['Nhịp sống trên cồn', 'Giữa dòng Cổ Chiên', 'Bên gian bếp quê'];
export function KioskDiscovery() {
  const params = useMemo(() => restoredParams('con-chim'), []);
  const initialLink=useMemo(()=>readStoryLink('?' + params.toString()),[]);
  const validViews = ['home', ...CONTENT_SECTIONS.map(item => item.id)];
  const initialView = validViews.includes(params.get('section') || '') ? params.get('section') as ConChimView : 'home';
  const [view, setView] = useRememberedState<ConChimView>('con-chim:view', initialView, params.has('section'));
  const [interest, setInterest] = useRememberedState<Interest>('con-chim:interest', ['food','landscape','local'].includes(params.get('interest') || '') ? params.get('interest') as Interest : 'food', params.has('interest'));
  const [filter, setFilter] = useRememberedState<Interest | 'all'>('con-chim:filter', ['food','landscape','local','all'].includes(params.get('filter') || '') ? params.get('filter') as Interest | 'all' : 'all', params.has('filter'));
  const [storyId, setStoryId] = useState<string | null>(initialLink?.storyId||null);
  const [readerMode,setReaderMode]=useState<ReaderMode>(initialLink?.mode||'read');
  const [readerContext,setReaderContext]=useState<StoryContext|undefined>(initialLink||undefined);
  const [lastStoryId,setLastStoryId]=useState(initialLink?.storyId||'');
  const [opened, setOpened] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(true);
  const [hostMenu, setHostMenu] = useState(false);
  const [scene,setScene] = useRememberedState('con-chim:scene', 0);
  const [historyStop,setHistoryStop] = useRememberedState('con-chim:history', 0);
  const [communityTopic,setCommunityTopic] = useRememberedState('con-chim:community', 0);
  const [experience,setExperience] = useRememberedState('con-chim:experience', 0);
  const main = useRef<HTMLElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const { host, act } = useKioskHost();
  const story = DISCOVERY_STORIES.find(item => item.id === storyId);
  const featured = DISCOVERY_STORIES.find(item => item.interest === interest)!;
  const openingPhoto = openingPhotos[scene];
  const visible = DISCOVERY_STORIES.filter(item => filter === 'all' || item.interest === filter);
  const sectionIndex=CONTENT_SECTIONS.findIndex(section=>section.id===view);
  const sectionStory=view==='history'?HISTORY_STOPS[historyStop].storyId:view==='community'?COMMUNITY_TOPICS[communityTopic].id:view==='experiences'?EXPERIENCE_OPTIONS[experience].story.id:featured.id;
  const choose:OpenStory = (id,mode='read',context) => { setStoryId(id);setReaderMode(mode);setReaderContext(context);setLastStoryId(id);setOpened(previous => previous.includes(id) ? previous : [...previous, id]); };
  const hostAction=(action:typeof hostItems[number]['action'])=>{setHostMenu(false);if(action==='qr')choose(lastStoryId||sectionStory,'takeaway');else act(action);};
  const navigate = (next: ConChimView,reset=false) => {
    setView(next); setStoryId(null); setHostMenu(false);
    if(next!==view)setLastStoryId('');
    if (reset) { setInterest('food'); setFilter('all'); setOpened([]); setMapOpen(true);setLastStoryId('');setScene(0);setHistoryStop(0);setCommunityTopic(0);setExperience(0); }
    main.current?.scrollTo({ top:0, behavior:'instant' });
    requestAnimationFrame(() => heading.current?.focus({ preventScroll:true }));
  };
  useEffect(() => { document.title = 'Cồn Chim · Chọn điều bạn muốn khám phá'; }, []);
  useEffect(() => { if (params.get('story') && !initialLink) setEntryIssue({ vi: 'Không tìm thấy câu chuyện trong liên kết. Chọn một câu chuyện từ danh sách để tiếp tục.', en: 'The linked story was not found. Choose a story from the list to continue.' }); }, []);
  useEffect(() => {
    updateRoute({ section: view, interest, filter, story: storyId, ...(!storyId ? { mode: null, question: null, point: null, step: null } : {}) }, 'con-chim');
  }, [view, interest, filter, storyId]);
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => { if (event.key === 'Escape') setHostMenu(false); };
    document.addEventListener('keydown', closeMenu);
    return () => document.removeEventListener('keydown', closeMenu);
  }, []);
  const hostItems = [
    { action:'panorama' as const, label:'Xem toàn cảnh', Icon:Compass, secondary:true },
    { action:'qr' as const, label:'Mã QR Cồn Chim', Icon:QrCode, secondary:true },
    { action:'resize' as const, label:host?.isSidebarWide ? 'Thu hẹp chi tiết' : 'Mở rộng chi tiết', Icon:host?.isSidebarWide ? PanelRightClose : PanelRightOpen, secondary:true },
    { action:'expand' as const, label:host?.isExpanded ? 'Thoát toàn màn hình chi tiết' : 'Xem chi tiết toàn màn hình', Icon:host?.isExpanded ? Shrink : Expand, secondary:false },
    { action:'close' as const, label:'Đóng chi tiết Cồn Chim', Icon:X, secondary:false },
  ].filter(item => host?.actions.includes(item.action));
  return <div className="cc-kiosk" data-view={view}>
    <a className="cck-skip" href="#cck-content">Đến nội dung khám phá</a>
    <header className="cck-header">
      <button type="button" className="cck-brand" title="Về màn chính" onClick={() => navigate('home')}><span className="cck-brand-mark"><Leaf size={27} strokeWidth={1.5}/></span><span><strong>Cồn Chim</strong>{' '}<small>Miền sống thuận thiên</small></span></button>
      <nav aria-label="Khám phá Cồn Chim"><button type="button" aria-current={view === 'home' ? 'page' : undefined} onClick={() => navigate('home')}><Home size={20}/><span>Màn chính</span></button><button type="button" aria-current={view === 'explore' ? 'page' : undefined} onClick={() => navigate('explore')}><Map size={20}/><span>Điểm khám phá</span></button></nav>
      {hostItems.length > 0 && <div className="cck-host">{hostItems.map(({ action, label, Icon, secondary }) => <button type="button" key={action} className={secondary ? 'cck-host-secondary' : ''} title={label} aria-label={label} onClick={() => hostAction(action)}><Icon size={22}/></button>)}<button type="button" className="cck-host-more" aria-label="Thêm công cụ Cồn Chim" aria-expanded={hostMenu} aria-controls="cck-host-menu" onClick={() => setHostMenu(value => !value)}><MoreHorizontal size={24}/></button>{hostMenu && <div className="cck-host-menu" id="cck-host-menu">{hostItems.filter(item => item.secondary).map(({ action, label, Icon }) => <button type="button" key={action} onClick={() => hostAction(action)}><Icon size={21}/>{label}</button>)}</div>}</div>}
    </header>
    <main id="cck-content" ref={main} tabIndex={-1}>
      {view === 'home' ? <section className="cck-home" aria-labelledby="cck-home-title">
        <div className="cck-feature-photo"><DiscoveryImage key={openingPhoto.id} photo={openingPhoto} eager retry={false}/></div><div className="cck-hero-shade" aria-hidden="true"/>
        <div className="cck-welcome"><h1 id="cck-home-title" ref={heading} tabIndex={-1}><span>Cồn</span><span>Chim</span></h1><p className="cck-kicker">Miền sống thuận thiên · Giữa dòng Cổ Chiên</p><p className="cck-intro">Một món ngon, một góc cảnh đẹp.<br/>Chạm để tìm câu chuyện phía sau.</p></div>
        <div className="cck-feature" aria-live="polite" aria-atomic="true">
          <div className="cck-feature-caption"><span>{featured.place}</span><h2>{featured.title}</h2><p>{featured.question}</p><button type="button" className="cck-primary" onClick={() => choose(featured.id)}><span className="cck-arrow-disc"><ArrowRight size={24}/></span>Mở câu chuyện</button></div>
        </div>
        <div className="cck-interests" aria-label="Chọn điều bạn thích">{INTERESTS.map(item => { const preview=DISCOVERY_STORIES.find(story=>story.interest===item.id)!;return <button type="button" key={item.id} className={interest === item.id ? 'is-selected' : ''} aria-pressed={interest === item.id} onClick={() => setInterest(item.id)}><DiscoveryImage photo={preview.photo} retry={false}/><span><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRight size={20}/></button>; })}</div>
        <nav className="cck-chapter-dock" aria-label="Các phần khám phá Cồn Chim"><button type="button" onClick={()=>navigate('overview')}><Home/><span>Tổng quan</span></button><button type="button" onClick={()=>navigate('explore')}><MapPin/><span>Điểm khám phá</span></button><button type="button" onClick={()=>navigate('history')}><ScrollText/><span>Chuyện của cồn</span></button><button type="button" onClick={()=>navigate('community')}><Users/><span>Đời sống & con người</span></button><button type="button" onClick={()=>navigate('experiences')}><Utensils/><span>Trải nghiệm</span></button></nav>
        <div className="cck-scene-controls" aria-label="Chọn ảnh Cồn Chim"><span aria-live="polite">{String(scene+1).padStart(2,'0')} / {String(openingPhotos.length).padStart(2,'0')}</span><button type="button" aria-label="Ảnh mở đầu trước" onClick={()=>setScene(value=>(value+openingPhotos.length-1)%openingPhotos.length)}><ChevronLeft/></button><button type="button" aria-label="Ảnh mở đầu tiếp theo" onClick={()=>setScene(value=>(value+1)%openingPhotos.length)}><ChevronRight/></button></div>
        <nav className="cck-photo-tabs" aria-label="Các góc nhìn Cồn Chim"><span>{String(scene+1).padStart(2,'0')} / 03<i/></span>{openingTitles.map((title,index)=><button type="button" key={title} aria-pressed={scene===index} onClick={()=>setScene(index)}>{title}</button>)}</nav>
      </section> : view==='overview'?<ConChimOverview headingRef={heading} onBack={()=>navigate('home')} onChoose={choose} onExplore={()=>navigate('explore')}/>:view==='history'?<ConChimHistory headingRef={heading} selected={historyStop} onSelect={index=>{setHistoryStop(index);setLastStoryId('');}} onChoose={choose}/>:view==='community'?<ConChimCommunity headingRef={heading} selected={communityTopic} onSelect={index=>{setCommunityTopic(index);setLastStoryId('');}} onChoose={choose}/>:view==='experiences'?<ConChimExperiences headingRef={heading} selected={experience} onSelect={index=>{setExperience(index);setLastStoryId('');}} onChoose={choose}/>:<section className="cck-explore" aria-labelledby="cck-explore-title" data-content-section="explore">
        <div className="cck-explore-heading"><p className="cck-kicker">02 / 05 · Tự chọn hành trình</p><h1 id="cck-explore-title" ref={heading} tabIndex={-1}>Điểm khám phá.</h1><p>Chọn một món ăn, một góc cảnh hoặc một câu chuyện địa phương.</p></div>
        <div className="cck-filter" aria-label="Lọc câu chuyện theo sở thích">{[{ id:'all', label:'Tất cả' }, ...INTERESTS].map(item => <button type="button" key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id as Interest | 'all')}>{item.label}</button>)}<button type="button" className="cck-map-toggle" aria-expanded={mapOpen} aria-controls="cck-topic-map" onClick={() => setMapOpen(value => !value)}><Map size={20}/>{mapOpen ? 'Ẩn sơ đồ' : 'Mở sơ đồ'}</button></div>
        <p className="cck-results" role="status">{visible.length} câu chuyện{filter !== 'all' ? ` về ${INTERESTS.find(item => item.id === filter)?.label.toLowerCase()}` : ' để bạn tự chọn'}</p>
        <div className={`cck-explore-layout ${mapOpen ? '' : 'without-map'}`}>
          {mapOpen && <aside id="cck-topic-map" className="cck-topic-map" aria-label="Sơ đồ chủ đề Cồn Chim">
            <div className="cck-map-top"><h2>Sơ đồ câu chuyện</h2><p>Vị trí minh họa theo chủ đề, không dùng chỉ đường.</p></div>
            <div className="cck-map-canvas"><img className="cck-map-aerial" src={HERO_BANNER.image} alt="Toàn cảnh Cồn Chim, nền cho sơ đồ chủ đề minh họa"/><div className="cck-map-water">Sông Cổ Chiên</div>
              {INTERESTS.map(item => { const Icon = interestIcons[item.id]; const group = DISCOVERY_STORIES.filter(story => story.interest === item.id); return <div key={item.id} className={`cck-map-group cck-map-${item.id} ${filter !== 'all' && filter !== item.id ? 'is-muted' : ''}`}><h3><Icon size={18}/>{item.label}</h3>{group.map(story => <button type="button" key={story.id} onClick={() => choose(story.id)} aria-label={`${story.place}: mở câu chuyện ${story.title}`}><span>{story.place}</span><ArrowRight size={16}/></button>)}</div>; })}
            </div>
            <a className="cck-map-credit" href={HERO_BANNER.source} target="_blank" rel="noopener noreferrer">Ảnh nền: {HERO_BANNER.credit}</a>
            <a className="cck-map-link" href={mapLink} target="_blank" rel="noopener noreferrer"><MapPin size={20}/>Vị trí Cồn Chim trên Google Maps<ArrowRight size={18}/></a>
          </aside>}
          <div className="cck-story-list" aria-label="Danh sách câu chuyện">{visible.map(item => <button type="button" className="cck-story-card" key={item.id} onClick={() => choose(item.id)}><DiscoveryImage photo={item.photo} retry={false}/><span className="cck-card-copy"><span className="cck-card-place">{item.place}{opened.includes(item.id) && <span className="cck-opened"><Check size={14}/>Đã mở</span>}</span><strong>{item.title}</strong><span>{item.teaser}</span><span className="cck-card-action">Đọc ~1 phút hoặc nghe <ArrowRight size={18}/></span></span></button>)}</div>
        </div>
      </section>}
    </main>
    <footer className="cck-footer">{view==='home'?<a className="cck-opening-credit" href={openingPhoto.source} target="_blank" rel="noopener noreferrer">Ảnh: {openingPhoto.credit}<ArrowRight size={15}/></a>:<span className="ccs-section-counter">Cồn Chim<small>Miền sống thuận thiên</small></span>}<nav className="ccs-section-nav" aria-label="Chuyển giữa 5 phần Cồn Chim"><button type="button" className="ccs-section-arrow" aria-label="Phần trước" disabled={view==='home'} onClick={()=>navigate(sectionIndex===0?'home':CONTENT_SECTIONS[sectionIndex-1].id,false)}><ChevronLeft/></button><span className="ccs-nav-caption">{String(sectionIndex+2).padStart(2,'0')} / 06 <b>{view==='home'?'Giới thiệu':CONTENT_SECTIONS[sectionIndex]?.short}</b></span><button type="button" className="ccs-home-target" aria-label="Giới thiệu Cồn Chim" aria-current={view==='home'?'page':undefined} onClick={()=>navigate('home',false)}><span>Giới thiệu</span></button>{CONTENT_SECTIONS.map(section=><button type="button" key={section.id} data-section-target={section.id} title={section.label} aria-label={section.label} aria-current={view===section.id?'page':undefined} onClick={()=>navigate(section.id,false)}><span>{section.short}</span></button>)}<button type="button" className="ccs-section-arrow" aria-label="Phần tiếp theo" disabled={sectionIndex===CONTENT_SECTIONS.length-1} onClick={()=>navigate(CONTENT_SECTIONS[sectionIndex+1].id,false)}><ChevronRight/></button></nav><button type="button" className="ccl-entry-share" aria-label="Mang câu chuyện theo" onClick={()=>choose(lastStoryId||sectionStory,'takeaway')}><QrCode size={20}/><span>Mang câu chuyện theo</span></button></footer>
    {story && <DiscoveryReader key={`${story.id}:${readerMode}`} story={story} onClose={() => setStoryId(null)} onChoose={choose} initialMode={readerMode} initialContext={readerContext} portable={initialLink?.portable}/>}
  </div>;
}
