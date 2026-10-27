import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import image01 from '../../assets/den-tho-bac/overview-remake/01-photo-original.jpg';
import image02 from '../../assets/den-tho-bac/overview-remake/02-photo-original.jpeg';
import image03 from '../../assets/den-tho-bac/overview-remake/03-shrine-user.png';
import type { SectionId } from './content';
import { useChapterMotion, useMemorialMotionPreference } from './memorial-motion';

const INTERVAL=12000;
const SLIDES=[
  {id:'temple',image:image01,width:2048,height:1366,label:'Đền thờ Bác Hồ',title:'Từ lòng dân\nthành di sản',description:'Giữa không gian xanh ở Long Đức, ngôi đền lưu giữ lòng kính yêu và tưởng nhớ Bác Hồ.',alt:'Ảnh gốc mặt trước ngôi đền, hai lá cờ, cây xanh và lối lên phía trước.',cta:'Khám phá ngôi đền',story:'preservation'},
  {id:'early-temple',image:image02,width:2048,height:1536,label:'Mô hình ngôi đền xưa',title:'Dấu xưa\ncòn mãi',description:'Cổng gỗ, mái lá gợi lại ngôi đền thuở đầu và hành trình người dân Long Đức dựng xây, gìn giữ.',alt:'Ảnh gốc mô hình cổng gỗ, biển tên và ngôi đền mái lá giữa những hàng tre trong nhà trưng bày.',cta:'Theo dấu ngôi đền xưa',story:null},
  {id:'statue',image:image03,width:1774,height:887,label:'Tượng Bác Hồ',title:'Hình bóng Bác\ntrong lòng dân',description:'Bên tượng Bác và phù điêu hoa sen, lắng lại để hiểu tình cảm kính yêu của người dân.',alt:'Ảnh do người dùng cung cấp: tượng Bác Hồ, câu chữ trên phù điêu hoa sen và toàn bộ bệ tượng.',cta:'Lắng lại bên tượng Bác',story:'commemoration'},
] as const;
const imageDimensions=(slide:typeof SLIDES[number])=>({'--image-width':slide.width,'--image-height':slide.height} as React.CSSProperties);

type FrameBounds={width:number;height:number;navigationHeight:number};
type ArtworkStyle=React.CSSProperties & {'--statue-tab-inset'?:string;'--statue-photo-left'?:string;'--statue-pedestal-left'?:string};
function artworkFrame(slide:typeof SLIDES[number],bounds:FrameBounds):ArtworkStyle {
  if(!bounds.width||!bounds.height)return {};
  const {width,height}=bounds;
  const compact=width/height<=1.2;
  if(compact){
    const scale=Math.min(width/slide.width,height*.30/slide.height);
    return {backgroundSize:`${slide.width*scale}px ${slide.height*scale}px`,backgroundPosition:`${(width-slide.width*scale)/2}px 76px`};
  }
  if(slide.id==='statue'){
    // Keep the physical quotation and the complete pedestal above the footer.
    // A cover crop loses one of them on wide screens. These source coordinates
    // frame the original photograph without altering or stretching its pixels.
    const focusTop=80,focusBottom=790,pedestalRight=1080;
    const safeTop=Math.max(92,height*.09);
    const safeBottom=height-bounds.navigationHeight-Math.max(14,height*.02);
    const scale=Math.min(Math.max(width/slide.width,height/slide.height),(safeBottom-safeTop)/(focusBottom-focusTop),safeBottom/focusBottom);
    const imageWidth=slide.width*scale,imageHeight=slide.height*scale;
    const left=imageWidth>=width?(width-imageWidth)*.15:width-imageWidth,top=Math.max(0,safeTop-focusTop*scale);
    // Keep the third photo label and its progress line clear of the pedestal.
    const thirdTabLeft=width*(.06+.88*(.343+.364));
    const tabInset=Math.max(0,left+pedestalRight*scale+12-thirdTabLeft);
    return {backgroundColor:'#63310e',backgroundSize:`${imageWidth}px ${imageHeight}px`,backgroundPosition:`${left}px ${top}px`,'--statue-tab-inset':`${tabInset}px`,'--statue-photo-left':`${left}px`,'--statue-pedestal-left':`${left+844*scale}px`};
  }
  // Original camera files, untouched. Use the minimum uniform cover scale;
  // favour the lower part of each photograph over its ceiling/empty sky.
  // Never stretch, add side strips, or magnify the image during a transition.
  const scale=Math.max(width/slide.width,height/slide.height);
  const imageWidth=slide.width*scale,imageHeight=slide.height*scale;
  const placement={temple:{x:.5,y:.82},'early-temple':{x:.5,y:1}}[slide.id];
  return {backgroundSize:`${imageWidth}px ${imageHeight}px`,backgroundPosition:`${(width-imageWidth)*placement.x}px ${(height-imageHeight)*placement.y}px`};
}

interface Props {
  index:number; onSelect:(index:number)=>void;
  onNavigate:(section:SectionId)=>void; onOpen:(story:string)=>void;
  readerOpen:boolean; paused:boolean; onPauseChange:(paused:boolean)=>void; reduced:boolean;
  headingRef:React.RefObject<HTMLHeadingElement|null>;
}

export const useOverviewMotionPreference = useMemorialMotionPreference;

export function OverviewSlideshow({index,onSelect,onNavigate,onOpen,readerOpen,paused,onPauseChange,reduced,headingRef}:Props){
  const [hovered,setHovered]=useState(false),[focused,setFocused]=useState(false),[hidden,setHidden]=useState(document.hidden);
  const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading'),[retry,setRetry]=useState(0);
  const [scene,setScene]=useState({current:index,previous:null as number|null,revision:0});
  const [manual,setManual]=useState(false);
  const elapsed=useRef(0),tracks=useRef<(HTMLElement|null)[]>([]);
  const frame=useRef<HTMLDivElement>(null);
  const [bounds,setBounds]=useState<FrameBounds>({width:0,height:0,navigationHeight:0});
  const playing=!paused&&!hovered&&!focused&&!hidden&&!readerOpen&&!reduced&&status==='ready'&&scene.current===index;
  const motionRoot=useRef<HTMLElement>(null);
  useChapterMotion(motionRoot,'overview',scene.revision,status==='ready');
  const slide=SLIDES[scene.current];
  const placement=artworkFrame(slide,bounds);

  useLayoutEffect(()=>{
    const node=frame.current;if(!node)return;
    const measure=()=>{
      const rect=node.getBoundingClientRect();
      const navigation=node.closest('.db-kiosk')?.querySelector('.db-navigation');
      const next={width:rect.width,height:rect.height,navigationHeight:navigation?.getBoundingClientRect().height||0};
      setBounds(old=>Object.keys(next).every(key=>old[key as keyof FrameBounds]===next[key as keyof FrameBounds])?old:next);
    };
    measure();const observer=new ResizeObserver(measure);observer.observe(node);
    return()=>observer.disconnect();
  },[]);

  useEffect(()=>{
    elapsed.current=0;tracks.current.forEach(track=>{if(track)track.style.transform='scaleX(0)';});
    let cancelled=false;const image=new Image();image.fetchPriority='high';setStatus('loading');
    image.onload=async()=>{
      try{await image.decode();}catch{/* the load event established a usable image */}
      if(cancelled)return;
      setScene(old=>({current:index,previous:old.current===index?null:old.current,revision:old.revision+1}));setStatus('ready');
    };
    image.onerror=()=>{if(!cancelled)setStatus('error');};image.src=SLIDES[index].image;
    return()=>{cancelled=true;image.onload=null;image.onerror=null;};
  },[index,retry]);
  useEffect(()=>{
    if(scene.previous===null)return;
    const timer=window.setTimeout(()=>setScene(old=>({...old,previous:null})),1000);
    return()=>window.clearTimeout(timer);
  },[scene.revision,scene.previous]);
  useEffect(()=>{
    if(status!=='ready')return;
    const next=new Image();next.src=SLIDES[(index+1)%SLIDES.length].image;
  },[index,status]);
  // One clock drives the line and the slide change. Pausing keeps elapsed time;
  // image loading and hidden documents never consume the next photo's time.
  useEffect(()=>{
    if(!playing)return;
    let frame=0,last=performance.now();
    const tick=(now:number)=>{
      elapsed.current=Math.min(INTERVAL,elapsed.current+now-last);last=now;
      const track=tracks.current[index];if(track)track.style.transform=`scaleX(${elapsed.current/INTERVAL})`;
      if(elapsed.current>=INTERVAL){setManual(false);onSelect((index+1)%SLIDES.length);return;}
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
  },[playing,index,onSelect]);
  useEffect(()=>{
    const sync=()=>setHidden(document.hidden);document.addEventListener('visibilitychange',sync);
    return()=>document.removeEventListener('visibilitychange',sync);
  },[]);

  const choose=(next:number)=>{setManual(true);elapsed.current=0;const track=tracks.current[index];if(track)track.style.transform='scaleX(0)';onSelect(next);};
  const explore=()=>{if(slide.story)onOpen(slide.story);else onNavigate('history');};
  const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?SLIDES.length-1:(index+(event.key==='ArrowRight'?1:-1)+SLIDES.length)%SLIDES.length;
    choose(next);event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus({preventScroll:true});
  };
  const controlsHover=(event:React.PointerEvent)=>{if(event.pointerType==='mouse')setHovered(true);};

  return <section ref={motionRoot} className="db-overview db-overview-carousel" style={{...imageDimensions(slide),'--statue-tab-inset':placement['--statue-tab-inset']||'0px','--statue-photo-left':placement['--statue-photo-left']||'0px','--statue-pedestal-left':placement['--statue-pedestal-left']||'0px'} as React.CSSProperties} aria-labelledby="db-overview-title" aria-roledescription="trình chiếu" data-overview-index={scene.current} data-requested-index={index} data-playing={playing} data-reduced-motion={reduced} data-image-state={status}
    onFocusCapture={event=>{if((event.target as HTMLElement).matches('button:focus-visible,a:focus-visible'))setFocused(true);}}
    onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setFocused(false);}}>
    <h1 id="db-overview-title" ref={headingRef} tabIndex={-1} className="db-overview-sr">Đền thờ Bác Hồ · Long Đức, Trà Vinh</h1>
    <div className="db-overview-gallery"><div className="db-overview-frame" ref={frame}>
      {scene.previous!==null&&<div className="db-overview-image db-overview-image--out" data-scene={SLIDES[scene.previous].id} key={`out-${scene.revision}`} aria-hidden="true"><div className="db-overview-artwork" style={{backgroundImage:`url(${SLIDES[scene.previous].image})`,...artworkFrame(SLIDES[scene.previous],bounds)}}/></div>}
      <div className="db-overview-image db-overview-image--in" key={`in-${scene.revision}`} data-scene={slide.id} role="group" aria-roledescription="ảnh" aria-label={`${scene.current+1} / 3 · ${slide.label}`}><div className="db-overview-artwork" role="img" aria-label={slide.alt} style={{backgroundImage:`url(${slide.image})`,...placement}}/></div>
      <div className="db-overview-shade" aria-hidden="true"/>
      <article className="db-overview-copy" key={slide.id}>
        <p className="db-overview-story-label">Câu chuyện</p><span className="db-overview-story-number" aria-hidden="true">0{scene.current+1}</span>
        <h2>{slide.title.split('\n').map(line=><span key={line}>{line}</span>)}</h2><p className="db-overview-description">{slide.description}</p>
        <button type="button" className="db-overview-explore" disabled={status!=='ready'} onClick={explore} onPointerEnter={controlsHover} onPointerLeave={()=>setHovered(false)}>{slide.cta}<ArrowRight/></button>
      </article>
      <nav className="db-overview-image-tabs" aria-label="Chọn ảnh Tổng quan" onKeyDown={keyboard} onPointerEnter={controlsHover} onPointerLeave={()=>setHovered(false)}>
        {SLIDES.map((item,i)=><button key={item.id} type="button" data-overview-slide={i} data-auto-toggle={index===i&&!reduced?'':undefined} aria-pressed={index===i} aria-describedby={index===i&&!reduced?'db-overview-playback-hint':undefined} title={index===i&&!reduced?(paused?'Tiếp tục chuyển ảnh tự động':'Tạm dừng chuyển ảnh tự động'):item.label} onClick={()=>{if(index===i&&!reduced)onPauseChange(!paused);else{onPauseChange(false);choose(i);}}}><span className="db-overview-tab-heading"><b>0{i+1}</b><span className="db-overview-track" aria-hidden="true"><i ref={node=>{tracks.current[i]=node;}}/></span></span><span className="db-overview-tab-label">{item.label}</span></button>)}
      </nav>
      {status==='loading'&&<p className="db-overview-load" role="status">Đang mở ảnh…</p>}
      {status==='error'&&<div className="db-overview-load db-overview-load--error" role="status"><p>Chưa tải được ảnh này.</p><button type="button" onClick={()=>setRetry(n=>n+1)}>Thử tải lại</button><button type="button" onClick={()=>{const entry=SLIDES[index];if(entry.story)onOpen(entry.story);else onNavigate('history');}}>Mở câu chuyện<ArrowRight/></button></div>}
    </div></div>
    <p className="db-overview-sr" aria-live={manual?'polite':'off'} aria-atomic="true">Ảnh {scene.current+1} / 3. {slide.title}. {slide.description}</p>
    <p id="db-overview-playback-hint" className="db-overview-sr">Chạm lại ảnh đang chọn để tạm dừng hoặc tiếp tục chuyển ảnh tự động.</p>
  </section>;
}
