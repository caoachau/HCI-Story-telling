import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import photo01 from '../../assets/den-tho-bac/values-user/01-reference.webp';
import photo02 from '../../assets/den-tho-bac/values-user/02-reference.webp';
import photo03 from '../../assets/den-tho-bac/values-user/03-reference.webp';
import photo04 from '../../assets/den-tho-bac/values-user/04-reference.webp';
import room from '../../assets/den-tho-bac/values-user/exhibition-background-v1.webp';
import glassBook from '../../assets/den-tho-bac/values-user/glass-book-lossless.webp';
import { Picture } from './MemorialMedia';
import type { SectionId } from './content';
import { useChapterMotion } from './memorial-motion';

export const VALUE_PAGES=[
  {id:'affection',label:'Lòng kính yêu',title:['Niềm kính yêu','được gìn giữ.'],photo:photo01,caption:'Không gian thờ Bác trong khu di tích',copy:'Người dân Long Đức dựng đền để tưởng nhớ Bác Hồ. Ngôi đền gửi gắm lòng kính yêu và sự biết ơn của cộng đồng.',more:'Tình cảm ấy còn được gìn giữ qua những chuyến thăm và câu chuyện được kể lại.',action:'Tìm hiểu câu chuyện dựng đền',story:'beginning',section:null,question:'Chi tiết nào giúp bạn cảm nhận lòng kính yêu ấy?'},
  {id:'community',label:'Sức mạnh cộng đồng',title:['Một ngôi đền.','Nhiều tấm lòng.'],photo:photo02,caption:'Người dân trước ngôi đền xưa · Ảnh tư liệu được cung cấp',copy:'Ngôi đền gắn với sự góp sức của người dân và những người tham gia xây dựng, bảo vệ đền.',more:'Mỗi đóng góp nhắc rằng di sản được tạo nên và gìn giữ bằng sự chung tay.',action:'Gặp những người giữ đền',story:null,section:'people',question:'Bạn nhớ nhất điều gì về sự chung tay của cộng đồng?'},
  {id:'history',label:'Giá trị lịch sử',title:['Dấu tích giúp ta','hiểu một thời.'],photo:photo03,caption:'Tư liệu về quá trình xây dựng và bảo vệ đền',copy:'Hình ảnh, hiện vật và tư liệu giúp người xem tìm hiểu quá trình hình thành, xây dựng và bảo vệ đền.',more:'Đọc cùng nguồn và bối cảnh để hiểu câu chuyện rõ hơn.',action:'Xem dòng thời gian',story:null,section:'history',question:'Bạn muốn tìm hiểu thêm dấu mốc nào?'},
  {id:'continuity',label:'Tiếp nối hôm nay',title:['Hiểu để trân trọng.','Kể để tiếp nối.'],photo:photo04,caption:'Học sinh đến viếng Đền thờ Bác Hồ',copy:'Di sản được tiếp nối qua cách ta tìm hiểu, ứng xử và chia sẻ sau mỗi chuyến thăm.',more:'Giữ gìn không gian, tôn trọng người đang tưởng niệm và kể lại câu chuyện cùng nguồn tư liệu.',action:'Chọn điều muốn mang theo',story:'learning',section:null,question:'Sau chuyến thăm, bạn muốn kể lại điều gì?'},
] as const;

interface Props {
  index:number;
  onSelect:(index:number)=>void;
  onOpen:(id:string)=>void;
  onNavigate:(section:SectionId)=>void;
  headingRef:React.RefObject<HTMLHeadingElement|null>;
}

type ValuePage=typeof VALUE_PAGES[number];
type Turn={from:number;to:number;direction:1|-1;focus:boolean};
const TURN_DURATION=900;
// Normalized to one page. The shallow dips at the spine follow the supplied
// glass frame, including its inset inner edge and gently rounded outer corners.
// Both clipping and the visible stroke use this exact contour.
const RIGHT_LEAF_PATH='M 0 .022 C .034 .003 .085 .003 .15 .003 L .967 .003 C .986 .003 .997 .019 .997 .043 L .997 .957 C .997 .983 .986 .997 .967 .997 L .15 .997 C .085 .997 .034 .997 0 .978 C .005 .925 .009 .845 .009 .76 L .009 .24 C .009 .155 .005 .075 0 .022 Z';
const LEFT_LEAF_TRANSFORM='translate(1 0) scale(-1 1)';
const decodedPhotos=new Map<string,Promise<void>>();
function preparePhoto(src:string){
  const cached=decodedPhotos.get(src);if(cached)return cached;
  const ready=new Promise<void>((resolve,reject)=>{
    const image=new Image();image.decoding='async';
    image.onload=()=>image.decode().then(resolve,reject);
    image.onerror=()=>reject(new Error('Unable to load book photograph'));
    image.src=src;
  });
  decodedPhotos.set(src,ready);
  ready.catch(()=>{if(decodedPhotos.get(src)===ready)decodedPhotos.delete(src);});
  return ready;
}
function BookPhoto({page,decorative=false}:{page:ValuePage;decorative?:boolean}){
  return <figure className="db-value-book-photo"><div className="db-value-photo-crop">{decorative?<div className="db-picture"><img src={page.photo} alt="" width={1672} height={941}/></div>:<Picture key={page.id} photo={{src:page.photo,alt:page.caption+', theo hình trong mẫu giao diện được cung cấp.'}} width={1672} height={941} eager/>}</div><figcaption>{page.caption}</figcaption></figure>;
}
function BookCopy({page,decorative=false,turning=false,onAction}:{page:ValuePage;decorative?:boolean;turning?:boolean;onAction?:()=>void}){
  return <article className="db-value-book-copy" aria-labelledby={decorative?undefined:'db-value-page-title'}><p className="db-value-book-kicker">{page.label}</p><h2 id={decorative?undefined:'db-value-page-title'}>{page.title.map(line=><span key={line}>{line}</span>)}</h2><p className="db-value-book-lead">{page.copy}</p><p className="db-value-book-more">{page.more}</p>{decorative?<span className="db-value-book-action"><span>{page.action}</span><ArrowRight/></span>:<button className="db-value-book-action" type="button" disabled={turning} onClick={onAction}><span>{page.action}</span><ArrowRight/></button>}</article>;
}
function BookTurnFace({side,back=false,clipId,children}:{side:'left'|'right';back?:boolean;clipId:string;children:React.ReactNode}){
  return <div className={`db-value-turn-face ${back?'db-value-turn-back':'db-value-turn-front'}`} data-page-side={side}>
    <div className="db-value-turn-clip" style={{clipPath:`url(#${clipId})`}}>{children}</div>
    <svg className="db-value-turn-outline" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><path d={RIGHT_LEAF_PATH} transform={side==='left'?LEFT_LEAF_TRANSFORM:undefined}/></svg>
  </div>;
}
function useBookMotion(){
  const read=()=>matchMedia('(min-width:901px)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.documentElement.classList.contains('reduce-motion');
  const [enabled,setEnabled]=useState(read);
  useEffect(()=>{const wide=matchMedia('(min-width:901px)'),motion=matchMedia('(prefers-reduced-motion:reduce)'),sync=()=>setEnabled(read());wide.addEventListener('change',sync);motion.addEventListener('change',sync);const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});return()=>{wide.removeEventListener('change',sync);motion.removeEventListener('change',sync);observer.disconnect();};},[]);
  return enabled;
}

export function ValuesSection({index,onSelect,onOpen,onNavigate,headingRef}:Props){
  const motionRoot=useRef<HTMLElement>(null);
  useChapterMotion(motionRoot,'values','entry');
  const page=VALUE_PAGES[index]||VALUE_PAGES[0];
  const motion=useBookMotion(),motionEnabled=useRef(motion);motionEnabled.current=motion;
  const [turn,setTurn]=useState<Turn|null>(null);
  const [phase,setPhase]=useState<'idle'|'loading'|'turning'>('idle');
  const [failed,setFailed]=useState<Turn|null>(null);
  const tabs=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),sheet=useRef<HTMLDivElement>(null);
  const leafId=useId().replace(/:/g,'');
  const rightClipId=`${leafId}-leaf-right`,leftClipId=`${leafId}-leaf-left`;
  const leftPageRef=useRef<HTMLDivElement>(null),rightPageRef=useRef<HTMLDivElement>(null);
  const busy=useRef(false),mounted=useRef(true),animations=useRef<Animation[]>([]);
  const commit=useRef(onSelect);commit.current=onSelect;
  const restoreTabFocus=(next:number)=>requestAnimationFrame(()=>tabs.current?.querySelector<HTMLButtonElement>(`[data-value-page="${next}"]`)?.focus({preventScroll:true}));
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;for(const a of animations.current)a.cancel();};},[]);
  useLayoutEffect(()=>{
    if(!turn||!sheet.current||!stage.current||!leftPageRef.current||!rightPageRef.current)return;
    const options:KeyframeAnimationOptions={duration:TURN_DURATION,easing:'cubic-bezier(.42,0,.18,1)',fill:'both'};
    const rotation=sheet.current.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${turn.direction===1?-180:180}deg)`}],options);
    // Reveal only the uncovered content. Transparent glass can show the room,
    // but cannot show the previous page's text through the incoming photograph.
    // These continuous clip keyframes follow the same perspective/angle/easing
    // as the single rotating sheet; images and face content never change mid-turn.
    const perspective=parseFloat(getComputedStyle(stage.current).perspective);
    const halfWidth=stage.current.clientWidth/2;
    const leftMasks:Keyframe[]=[],rightMasks:Keyframe[]=[];
    for(let i=0;i<=60;i++){
      const progress=i/60,angle=progress*Math.PI;
      const projected=Math.min(100,100*Math.abs(Math.cos(angle))/(1-halfWidth/perspective*Math.sin(angle)));
      const incoming=progress<.5?projected:0,outgoing=progress>.5?projected:0;
      leftMasks.push({offset:progress,clipPath:`inset(0 ${turn.direction===1?outgoing:incoming}% 0 0)`});
      rightMasks.push({offset:progress,clipPath:`inset(0 0 0 ${turn.direction===1?incoming:outgoing}%)`});
    }
    const left=leftPageRef.current.animate(leftMasks,options),right=rightPageRef.current.animate(rightMasks,options);
    animations.current=[rotation,left,right];
    let disposed=false;
    rotation.finished.then(()=>{
      if(disposed||!mounted.current)return;
      commit.current(turn.to);setTurn(null);setPhase('idle');busy.current=false;
      if(turn.focus)restoreTabFocus(turn.to);
    }).catch(()=>{});
    const bounds=stage.current.getBoundingClientRect();
    const resize=new ResizeObserver(()=>{const next=stage.current?.getBoundingClientRect();if(next&&(Math.abs(next.width-bounds.width)>1||Math.abs(next.height-bounds.height)>1))for(const a of animations.current)a.finish();});
    resize.observe(stage.current);
    return()=>{disposed=true;resize.disconnect();for(const a of [rotation,left,right])a.cancel();animations.current=[];};
  },[turn]);
  useEffect(()=>{if(!motion)for(const a of animations.current)a.finish();},[motion]);
  useLayoutEffect(()=>{
    const nav=tabs.current;if(!nav)return;
    const sync=()=>{const selected=nav.querySelector<HTMLElement>('[aria-pressed=true]>span');if(!selected)return;const r=selected.getBoundingClientRect(),n=nav.getBoundingClientRect();nav.style.setProperty('--value-tab-left',`${r.left-n.left}px`);nav.style.setProperty('--value-tab-width',`${r.width}px`);nav.style.setProperty('--value-tab-top',`${r.bottom-n.top+6}px`);};
    sync();const observer=new ResizeObserver(sync);observer.observe(nav);const selected=nav.querySelector<HTMLElement>('[aria-pressed=true]>span');if(selected)observer.observe(selected);return()=>observer.disconnect();
  },[index]);
  useEffect(()=>{for(const neighbor of [(index+1)%4,(index+3)%4])void preparePhoto(VALUE_PAGES[neighbor].photo).catch(()=>{});},[index]);
  const choose=async(next:number,focus=false,explicitDirection?:1|-1)=>{
    const selected=(next+VALUE_PAGES.length)%VALUE_PAGES.length;if(busy.current||selected===index)return;
    const job:Turn={from:index,to:selected,direction:explicitDirection||(selected>index?1:-1),focus};
    busy.current=true;setFailed(null);setPhase('loading');
    try{
      await preparePhoto(VALUE_PAGES[selected].photo);if(!mounted.current)return;
      if(motionEnabled.current){setTurn(job);setPhase('turning');}
      else{commit.current(selected);setPhase('idle');busy.current=false;if(focus)restoreTabFocus(selected);}
    }catch{if(mounted.current){busy.current=false;setPhase('idle');setFailed(job);}}
  };
  const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();choose(event.key==='Home'?0:event.key==='End'?3:index+(event.key==='ArrowRight'?1:-1),true,event.key==='ArrowLeft'?-1:event.key==='ArrowRight'?1:undefined);
  };
  const oldPage=turn?VALUE_PAGES[turn.from]:page,target=turn?VALUE_PAGES[turn.to]:page;
  const photoPage=turn?.direction===-1?target:oldPage,copyPage=turn?.direction===1?target:oldPage;
  const action=()=>{if(!busy.current)page.story?onOpen(page.story):onNavigate(page.section!);};
  return <section ref={motionRoot} className="db-values db-values-book" data-value-id={page.id} data-turning={turn?'true':'false'} data-book-phase={phase} aria-labelledby="db-values-title">
    <div className="db-value-room" style={{backgroundImage:`url(${room})`}} aria-hidden="true"/>
    <h1 className="db-value-section-title" id="db-values-title" ref={headingRef} tabIndex={-1}>Giá trị di sản</h1>
    <div className="db-value-book" aria-busy={phase!=='idle'}>
      <div className="db-value-book-surface" aria-hidden="true"><img src={glassBook} alt="" width={1893} height={831} loading="eager" decoding="async" fetchPriority="high"/></div>
      <svg className="db-value-book-outline" viewBox="0 0 1764 700" preserveAspectRatio="none" aria-hidden="true"><path d="M27 3 Q2 3 2 28 V672 Q2 697 27 697 M1737 3 Q1762 3 1762 28 V672 Q1762 697 1737 697"/></svg>
      <div className="db-value-book-stage" ref={stage}>
        <svg className="db-value-leaf-definitions" width="0" height="0" aria-hidden="true"><defs>
          <clipPath id={rightClipId} clipPathUnits="objectBoundingBox"><path d={RIGHT_LEAF_PATH}/></clipPath>
          <clipPath id={leftClipId} clipPathUnits="objectBoundingBox"><path d={RIGHT_LEAF_PATH} transform={LEFT_LEAF_TRANSFORM}/></clipPath>
        </defs></svg>
        <div className="db-value-spread" data-turn-direction={turn?.direction}>
          <div className="db-value-page db-value-page-left" ref={leftPageRef} aria-hidden={turn?true:undefined}><BookPhoto page={photoPage}/></div>
          <div className="db-value-page db-value-page-right" ref={rightPageRef} aria-hidden={turn?true:undefined}><BookCopy page={copyPage} turning={phase!=='idle'} onAction={action}/></div>
        </div>
        <div className="db-value-turning-sheet" ref={sheet} data-direction={turn?.direction||1} hidden={!turn} aria-hidden="true">
          <BookTurnFace side={turn?.direction===-1?'left':'right'} clipId={turn?.direction===-1?leftClipId:rightClipId}>{turn&&(turn.direction===1?<BookCopy page={oldPage} decorative/>:<BookPhoto page={oldPage} decorative/>)}</BookTurnFace>
          <BookTurnFace back side={turn?.direction===-1?'right':'left'} clipId={turn?.direction===-1?rightClipId:leftClipId}>{turn&&(turn.direction===1?<BookPhoto page={target} decorative/>:<BookCopy page={target} decorative/>)}</BookTurnFace>
        </div>
      </div>
      {phase==='loading'&&<p className="db-value-load-status" role="status">Đang tải trang…</p>}
      {failed&&<div className="db-value-load-status" role="status">Chưa tải được trang mới. <button type="button" onClick={()=>choose(failed.to,failed.focus,failed.direction)}>Thử lại</button></div>}
      <div className="db-value-book-controls">
        <button type="button" className="db-value-page-arrow" aria-label="Trang giá trị trước" aria-disabled={phase!=='idle'} onClick={()=>choose(index-1,false,-1)}><ArrowLeft/></button>
        <nav ref={tabs} aria-label="Bốn giá trị di sản" onKeyDown={keyboard}>{VALUE_PAGES.map((item,i)=><button type="button" key={item.id} data-value-page={i} aria-pressed={index===i} aria-disabled={phase!=='idle'} onClick={()=>choose(i)}><span>{item.label}</span></button>)}<i className="db-value-tab-indicator" aria-hidden="true"/></nav>
        <button type="button" className="db-value-page-arrow" aria-label="Trang giá trị tiếp theo" aria-disabled={phase!=='idle'} onClick={()=>choose(index+1,false,1)}><ArrowRight/></button>
      </div>
    </div>
  </section>;
}
