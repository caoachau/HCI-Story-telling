import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, Clock, Eye, HelpCircle, Pause, Play, QrCode, Utensils, Volume2, X, ExternalLink } from 'lucide-react';
import { DISCOVERY_STORIES, DOCUMENTARY, INTERESTS, REVIEWED_AT, type DiscoveryStory } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';
import type { ReaderMode, StoryContext } from '../utils/storyLinks';
import { useStoryVoice } from '../utils/useStoryVoice';
import { ActivityPreview } from './ActivityPreview';
import { DiscoveryImage } from './DiscoveryImage';
import { PhotoObservation } from './PhotoObservation';
import { PortableNotes } from './PortableNotes';
import { StoryQuestions } from './StoryQuestions';
import { StoryTakeaway } from './StoryTakeaway';

interface Props {
  story:DiscoveryStory; onClose:()=>void; onChoose:(id:string)=>void;
  initialMode?:ReaderMode; initialContext?:StoryContext; portable?:boolean;
}
export function DiscoveryReader({story,onClose,onChoose,initialMode='read',initialContext,portable=false}:Props) {
  const layer=STORY_LAYERS[story.id];
  const [mode,setMode]=useState<ReaderMode>(initialMode);
  const [question,setQuestion]=useState(initialContext?.question);
  const [point,setPoint]=useState(initialContext?.point||layer.points[0].id);
  const [step,setStep]=useState(initialContext?.step||0),[material,setMaterial]=useState(0);
  const [shareContext,setShareContext]=useState<StoryContext>(initialContext||{mode:'read'});
  const backMode=useRef<Exclude<ReaderMode,'takeaway'>>('read');
  const content=useRef<HTMLDivElement>(null);
  const related=DISCOVERY_STORIES.find(item=>item.id===story.related)!;
  const storyIndex=DISCOVERY_STORIES.findIndex(item=>item.id===story.id);
  const previous=DISCOVERY_STORIES[(storyIndex+DISCOVERY_STORIES.length-1)%DISCOVERY_STORIES.length];
  const next=DISCOVERY_STORIES[(storyIndex+1)%DISCOVERY_STORIES.length];
  const voice=useStoryVoice(`${story.title}. ${story.summary.join(' ')} ${story.takeaway}`);
  const context:StoryContext={mode:mode==='takeaway'?shareContext.mode:mode,question,point,step};
  const visit=(next:ReaderMode)=>{
    voice.stop();setMode(next);
    requestAnimationFrame(()=>{content.current?.scrollTo({top:0,behavior:'instant'});const title=document.getElementById('cck-reader-title');title?.setAttribute('tabindex','-1');title?.focus({preventScroll:true});});
  };
  const share=()=>{if(mode==='takeaway')return;backMode.current=mode;setShareContext(context);visit('takeaway');};
  const back=()=>{if(mode==='read')onClose();else visit(mode==='takeaway'?backMode.current:'read');};
  useEffect(()=>{
    if(!portable)return;
    const selected=mode==='takeaway'?shareContext:context;
    const url=new URL(window.location.href);url.search='';url.searchParams.set('story',story.id);url.searchParams.set('portable','1');
    if(selected.mode!=='read')url.searchParams.set('mode',selected.mode);
    if(selected.mode==='questions'&&selected.question)url.searchParams.set('question',selected.question);
    if(selected.mode==='observe'&&selected.point)url.searchParams.set('point',selected.point);
    if(selected.mode==='activity'&&selected.step)url.searchParams.set('step',String(selected.step));
    try{window.history.replaceState(null,'',url);}catch{/* Reading still works if history is unavailable. */}
  },[portable,story.id,mode,question,point,step,shareContext]);
  const openSources=()=>{
    voice.stop();setMode('read');
    requestAnimationFrame(()=>{const section=content.current?.querySelector<HTMLDetailsElement>('#cck-story-sources');if(section){section.open=true;section.scrollIntoView({block:'nearest',behavior:'instant'});section.querySelector('summary')?.focus({preventScroll:true});}});
  };
  const titleLabel=INTERESTS.find(item=>item.id===story.interest)?.label;
  const fullWidth=mode==='observe'||mode==='takeaway';
  return <div className="cck-reader-backdrop" data-detail-modal role="dialog" aria-modal="true" aria-labelledby="cck-reader-title" onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <article className={`cck-reader ccl-reader ccl-mode-${mode}`}>
      <header className="cck-reader-bar"><button type="button" className="cck-outline" aria-label={mode==='read'?'Về khám phá, đóng câu chuyện':'Về câu chuyện'} onClick={back}>{mode==='read'?<X size={21}/>:<ArrowLeft size={21}/>}<span>{mode==='read'?'Về khám phá':'Về câu chuyện'}</span></button><span>{titleLabel} / {story.place}</span><div className="ccl-reader-utilities"><button type="button" className="cck-source-shortcut" aria-label="Nguồn tư liệu" onClick={openSources}><BookOpen size={20}/><span>Nguồn tư liệu</span></button><button type="button" className="ccl-share-button" aria-label="Mang câu chuyện theo" onClick={share}><QrCode size={21}/><span>Mang câu chuyện theo</span></button>{mode!=='read'&&<button type="button" className="ccl-close-all" aria-label="Đóng toàn bộ câu chuyện" onClick={onClose}><X size={24}/></button>}</div></header>
      {fullWidth?<div className="ccl-full-view" ref={content}>
        {mode==='observe'?<PhotoObservation story={story} selected={point} onSelect={setPoint}/>:<StoryTakeaway story={story} context={shareContext}/>}
      </div>:<div className="cck-reader-layout">
        <figure className="cck-reader-photo"><DiscoveryImage key={story.photo.id} photo={story.photo} eager/><figcaption>{story.photo.caption}<span>Ảnh: {story.photo.credit}</span><button type="button" className="ccl-photo-open" onClick={()=>visit('observe')}><Eye size={20}/>Phóng to & xem chi tiết</button></figcaption></figure>
        <div ref={content} className="cck-reader-content" tabIndex={0} aria-label="Nội dung câu chuyện">
          {mode==='questions'?<StoryQuestions story={story} selected={question} onSelect={setQuestion}/>:mode==='activity'&&layer.activity?<ActivityPreview activity={layer.activity} step={step} onStep={setStep} material={material} onMaterial={setMaterial}/>:<>
            <p className="cck-kicker">{story.place}</p><h2 id="cck-reader-title">{story.title}</h2><p className="cck-reader-question">{story.question}</p>
            <p className="ccl-duration"><Clock size={17}/>Đọc nhanh khoảng 1 phút · Phần mở rộng tùy chọn</p>
            <div className="cck-summary-heading"><h3>Nắm ý chính</h3><div className="ccl-audio-controls"><button type="button" className="cck-listen" aria-pressed={voice.state!=='idle'} onClick={voice.play}>{voice.state!=='idle'?<X size={19}/>:<Volume2 size={20}/>}<span>{voice.state!=='idle'?'Dừng nghe':'Nghe tóm tắt'}</span></button>{voice.state!=='idle'&&<button type="button" className="ccl-pause" onClick={voice.pause}>{voice.state==='paused'?<Play size={19}/>:<Pause size={19}/>}<span>{voice.state==='paused'?'Tiếp tục nghe':'Tạm dừng'}</span></button>}</div></div>
            <p className="cck-audio-status" role="status">{voice.message}</p><ul className="cck-summary">{story.summary.map(text=><li key={text}><Check size={19}/><span>{text}</span></li>)}</ul><p className="cck-takeaway">{story.takeaway}</p>
            <div className="ccl-read-actions" aria-label="Chọn cách tìm hiểu thêm"><button type="button" onClick={()=>visit('questions')}><HelpCircle size={20}/>Hỏi sâu</button><button type="button" onClick={()=>visit('observe')}><Eye size={20}/>Quan sát ảnh</button>{layer.activity&&<button type="button" onClick={()=>visit('activity')}><Utensils size={20}/>Xem trước hoạt động</button>}</div>
            <details className="cck-disclosure"><summary>Tìm hiểu thêm <ChevronDown size={21}/></summary><div><p>{story.detail}</p><p className="cck-invitation">{story.invitation}</p><div className="ccl-manners"><h3>Ghé thăm với sự tôn trọng</h3>{layer.manners.map(item=><div key={item.action}><strong>{item.action}</strong><p>{item.reason}</p></div>)}<small>Gợi ý ứng xử; hỏi người phụ trách về nội quy cụ thể tại nơi ghé.</small></div></div></details>
            <details id="cck-story-sources" className="cck-disclosure cck-sources"><summary>Nguồn tư liệu <ChevronDown size={21}/></summary><div><h3>Nội dung</h3><a href={story.source.url} target="_blank" rel="noopener noreferrer" onClick={voice.stop}>{story.source.title}<ExternalLink size={17}/></a><p>{story.source.publisher} · Đăng {story.source.published}</p><h3>Hình ảnh</h3><a href={story.photo.source} target="_blank" rel="noopener noreferrer" onClick={voice.stop}>{story.photo.credit}<ExternalLink size={17}/></a><p>Ảnh tư liệu; nguồn không ghi ngày chụp.</p><h3>Loại nội dung & đối chiếu</h3><p>Bản biên soạn từ tư liệu công khai. Các câu hỏi ghi rõ phần đối chiếu nguồn và phần gợi ý hỏi trực tiếp. Giọng nghe là tổng hợp từ bản tóm tắt.</p><p>Đối chiếu nội dung: <time dateTime="2026-10-24">{REVIEWED_AT}</time>. Chưa ghi nhận rà soát của người phụ trách tại địa phương.</p><p>Ảnh không được dùng để gán danh tính hoặc lời kể cho một người chưa được xác nhận.</p>{(story.id==='ruong-ao'||story.id==='duong-lang')&&<div className="cck-documentary"><h3>Xem thêm bằng hình ảnh</h3><a href={DOCUMENTARY.url} target="_blank" rel="noopener noreferrer" onClick={voice.stop}>Xem phóng sự trên VTV<ExternalLink size={17}/></a><p>{DOCUMENTARY.title} · {DOCUMENTARY.published}. Video mở ở trang VTV khi bạn chọn.</p></div>}</div></details>
            <div className="ccl-reflection-inline"><h3>Một điều để quan sát</h3><p>{layer.observe}</p></div>
            {portable&&<PortableNotes story={story}/>}
            <button type="button" className="cck-related" onClick={()=>onChoose(related.id)}><span>Khám phá câu chuyện liên quan<strong>{related.title}</strong></span><ArrowRight size={24}/></button>
          </>}
        </div>
      </div>}
      <footer className="cck-reader-nav" aria-label="Chuyển câu chuyện"><button type="button" onClick={()=>onChoose(previous.id)}><ArrowLeft size={21}/><span><small>Câu chuyện trước</small>{previous.title}</span></button><span>{String(storyIndex+1).padStart(2,'0')} / {String(DISCOVERY_STORIES.length).padStart(2,'0')}</span><button type="button" onClick={()=>onChoose(next.id)}><span><small>Câu chuyện tiếp theo</small>{next.title}</span><ArrowRight size={21}/></button></footer>
    </article>
  </div>;
}
