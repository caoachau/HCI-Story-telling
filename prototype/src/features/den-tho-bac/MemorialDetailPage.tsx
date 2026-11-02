import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Expand, Flower2, Heart, History, Home, MapPin, Shrink, Users, X } from 'lucide-react';
import { SECTIONS, storyById, type SectionId } from './content';
import { HistorySection } from './HistorySection';
import { SpacesSection, type SpacePanelView } from './SpacesSection';
import { OverviewSlideshow, useOverviewMotionPreference } from './OverviewSlideshow';
import { PeopleSection } from './PeopleSection';
import { ActivitiesSection } from './ActivitiesSection';
import { ValuesSection, VALUE_PAGES } from './ValuesSection';
import { StoryReader } from './StoryReader';
import { restoredParams, setEntryIssue, updateRoute, useRememberedState } from '../../experience/state';
import { HISTORY_SCENES } from './history-scenes';

const sectionIcons = { home:Home, history:History, map:MapPin, people:Users, flower:Flower2, heart:Heart };
const CHANNEL='den-tho-bac-detail';
type HostAction='close'|'expand'|'resize';
interface Host {isExpanded:boolean;isSidebarWide:boolean;actions:HostAction[];}
function useHost(){
  const [host,setHost]=useState<Host|null>(null);
  useEffect(()=>{
    const receive=(event:MessageEvent)=>{
      if(window.parent===window||event.origin!==location.origin||event.source!==parent||event.data?.channel!==CHANNEL)return;
      if(event.data.type==='host-controls'&&Array.isArray(event.data.controls?.actions))setHost(event.data.controls);
      if(event.data.type==='preferences')document.documentElement.classList.toggle('reduce-motion',!!event.data.reduceMotion);
    };
    window.addEventListener('message',receive);
    const send=(type:string)=>{if(window.parent!==window)parent.postMessage({channel:CHANNEL,type},location.origin);};
    send('ready');send('host-controls-request');
    const interact=()=>send('interaction');document.addEventListener('pointerdown',interact,{passive:true});document.addEventListener('keydown',interact);
    return()=>{window.removeEventListener('message',receive);document.removeEventListener('pointerdown',interact);document.removeEventListener('keydown',interact);};
  },[]);
  return {host,act:(action:HostAction)=>{if(host?.actions.includes(action))parent.postMessage({channel:CHANNEL,type:'host-action',action},location.origin);}};
}
export function MemorialDetailPage(){
  const initial=restoredParams('den-tho-bac');const first=SECTIONS.find(s=>s.id===initial.get('section'))?.id||'overview';
  const numberParam=(key:string,max:number)=>{const n=Number(initial.get(key));return Number.isInteger(n)&&n>=0&&n<max?n:0;};
  const [section,setSection]=useRememberedState<SectionId>('den:section',first,initial.has('section')),[reader,setReader]=useState<string|null>(()=>initial.get('story')&&storyById(initial.get('story')!)?initial.get('story'):null);
  const [overview,setOverview]=useRememberedState('den:overview',numberParam('overview',3),initial.has('overview')),[milestone,setMilestone]=useRememberedState('den:milestone',numberParam('phase',HISTORY_SCENES.length),initial.has('phase')),[spot,setSpot]=useRememberedState('den:spot',numberParam('spot',8),initial.has('spot')),[person,setPerson]=useRememberedState('den:person',initial.get('person')==='portrait'?1:0,initial.has('person')),[value,setValue]=useRememberedState('den:value',Math.max(0,VALUE_PAGES.findIndex(page=>page.id===initial.get('value'))),initial.has('value')),[full,setFull]=useState(false),[notice,setNotice]=useState('');
  const [overviewPaused,setOverviewPaused]=useState(false);const reduced=useOverviewMotionPreference();
  const [spaceView,setSpaceView]=useState<SpacePanelView>('list');
  useEffect(()=>{if(initial.get('story')&&!storyById(initial.get('story')!))setEntryIssue({vi:'Không tìm thấy câu chuyện trong liên kết. Bạn có thể chọn lại nội dung tại đây.',en:'The linked story was not found. Choose another story here.'});},[]);
  useEffect(()=>{updateRoute({section,story:reader,overview,phase:milestone,spot,person:person===1?'portrait':'witness',value:VALUE_PAGES[value]?.id},'den-tho-bac');},[section,reader,overview,milestone,spot,person,value]);
  const heading=useRef<HTMLHeadingElement>(null),main=useRef<HTMLElement>(null);const {host,act}=useHost();
  const navigate=(next:SectionId)=>{setSection(next);setReader(null);setNotice('');const url=new URL(location.href);url.searchParams.set('section',next);url.searchParams.delete('story');history.replaceState(null,'',url);main.current?.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>heading.current?.focus({preventScroll:true}));};
  const open=(id:string)=>{setEntryIssue(null);if(id!==reader)updateRoute({chapter:null,photo:null},'den-tho-bac');setReader(id);};
  const chooseValue=(index:number)=>{setValue(index);const url=new URL(location.href);url.searchParams.set('value',VALUE_PAGES[index].id);history.replaceState(null,'',url);};
  const choosePerson=(index:number)=>{setPerson(index);const url=new URL(location.href);url.searchParams.set('person',index===1?'portrait':'witness');history.replaceState(null,'',url);main.current?.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>main.current?.querySelector<HTMLButtonElement>('.db-person-tabs button[aria-pressed=true]')?.focus({preventScroll:true}));};
  const close=()=>{if(host?.actions.includes('close'))act('close');else if(window.parent===window)window.location.assign(import.meta.env.BASE_URL);};
  const fullscreen=async()=>{if(host?.actions.includes('expand')){act('expand');return;}try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('Chưa mở được toàn màn hình trên thiết bị này.');}};
  useEffect(()=>{const sync=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync);},[]);
  return <div className="db-kiosk" data-section={section}>
    <a href="#db-main" className="db-skip">Đến nội dung</a>
    <div className="db-detail-tools" role="group" aria-label="Công cụ trang chi tiết"><button type="button" className="db-detail-tools__sources" data-detail-action="sources" aria-label="Nguồn tư liệu" title="Nguồn tư liệu" onClick={()=>setReader('sources')}><BookOpen/><span>Nguồn tư liệu</span></button><button type="button" className="db-detail-tools__action" data-detail-action="fullscreen" onClick={fullscreen} aria-label={host?.isExpanded||full?'Thu nhỏ toàn màn hình':'Mở toàn màn hình'}>{host?.isExpanded||full?<Shrink/>:<Expand/>}</button><button type="button" className="db-detail-tools__action" data-detail-action="close" aria-label="Đóng chi tiết Đền thờ Bác" disabled={window.parent!==window&&!host?.actions.includes('close')} onClick={close}><X/></button></div>
    <main id="db-main" ref={main} tabIndex={-1}>
      {section==='overview'&&<OverviewSlideshow index={overview} onSelect={setOverview} onNavigate={navigate} onOpen={open} readerOpen={reader!==null} paused={overviewPaused} onPauseChange={setOverviewPaused} reduced={reduced} headingRef={heading}/>}
      {section==='history'&&<HistorySection milestone={milestone} onSelect={setMilestone} onOpen={open} headingRef={heading}/>}
      {section==='spaces'&&<SpacesSection spot={spot} onSelect={setSpot} view={spaceView} onViewChange={setSpaceView} onOpen={open} headingRef={heading}/>}
      {section==='people'&&<PeopleSection person={person} onSelect={choosePerson} onOpen={open} headingRef={heading}/>}
      {section==='activities'&&<ActivitiesSection onOpen={open} headingRef={heading}/>}
      {section==='values'&&<ValuesSection index={value} onSelect={chooseValue} onOpen={open} onNavigate={next=>{if(next==='people')setPerson(0);navigate(next);}} headingRef={heading}/>}
    </main>
    <footer className="db-navigation"><nav aria-label="Các phần của Đền thờ Bác Hồ">{SECTIONS.map(s=>{const Icon=sectionIcons[s.icon];return <button type="button" key={s.id} data-section-target={s.id} aria-current={section===s.id?'page':undefined} onClick={()=>navigate(s.id)}><Icon/><span>{s.short}</span></button>;})}</nav></footer>
    <span className="db-fullscreen-status" role="status">{notice}</span>
    {reader&&<StoryReader key={reader} story={reader==='sources'?undefined:storyById(reader)} sourcesOnly={reader==='sources'} onClose={()=>setReader(null)}/>}
  </div>;
}
