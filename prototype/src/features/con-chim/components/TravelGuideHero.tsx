import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,Compass,Pause,Play,Leaf,Wheat} from 'lucide-react';
import {HERO_SCENES,PHOTOS} from '../data/conChimData';
import {MotionWords} from './MotionWords';
import {ImageSequence} from './ImageSequence';
import {useReducedDetailMotion} from '../utils/motion';
import {useLandscapeDepth} from '../utils/useLandscapeDepth';
export function TravelGuideHero({onStartExploring}:{onStartExploring:()=>void}){
  const [scene,setScene]=useState(0),[playing,setPlaying]=useState(true),[engaged,setEngaged]=useState(false),[visible,setVisible]=useState(!document.hidden),[active,setActive]=useState(true);
  const hero=useRef<HTMLElement>(null);
  const [interacted,setInteracted]=useState(false);
  const reduced=useReducedDetailMotion();
  useLandscapeDepth(hero);
  useEffect(()=>{
    const screen=(event:Event)=>setActive((event as CustomEvent<string>).detail==='intro');
    const visibility=()=>setVisible(!document.hidden);
    document.addEventListener('cc:active-screen',screen);
    document.addEventListener('visibilitychange',visibility);
    return()=>{document.removeEventListener('cc:active-screen',screen);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  useEffect(()=>{
    const start=()=>setInteracted(true);
    document.addEventListener('pointerdown',start,{once:true,passive:true});
    document.addEventListener('keydown',start,{once:true});
    return()=>{document.removeEventListener('pointerdown',start);document.removeEventListener('keydown',start);};
  },[]);
  useEffect(()=>{
    if(!playing||!interacted||engaged||!visible||!active||reduced)return;
    const timer=window.setTimeout(()=>setScene(value=>(value+1)%HERO_SCENES.length),7200);
    return()=>window.clearTimeout(timer);
  },[scene,playing,interacted,engaged,visible,active,reduced]);
  return <section ref={hero} id="intro" className="cc-hero" aria-labelledby="cc-hero-title">
    <div className="cc-hero-copy cc-container">
      <p className="cc-hero-location"><Compass size={15}/> Sông Cổ Chiên · Miền Tây</p>
      <h1 id="cc-hero-title"><span className="cc-hero-title-line"><MotionWords>Cồn Chim</MotionWords></span><span className="cc-hero-subtitle">Về miền thuận thiên.</span></h1>
      <p className="cc-hero-description">Một ngày giữa ruộng vườn, con nước và những tấm lòng người quê.</p>
      <button className="cc-button cc-button-large" onClick={onStartExploring}>Bắt đầu khám phá <ArrowRight size={19}/></button>
    </div>
    <Leaf className="cc-hero-leaf" strokeWidth={0.6} aria-hidden="true"/>
    <Wheat className="cc-hero-wheat" strokeWidth={0.6} aria-hidden="true"/>
    <div className="cc-hero-landscape">
      <div className="cc-hero-arch"><ImageSequence photos={HERO_SCENES} index={scene} priority/></div>
      <div className="cc-hero-orbit cc-hero-orbit-left"><img src={PHOTOS[7].image} width={170} height={170} alt="Cồn Chim nằm giữa dòng sông Cổ Chiên"/></div>
      <div className="cc-hero-orbit cc-hero-orbit-right"><img src={PHOTOS[3].image} style={{objectPosition:'78% center'}} width={130} height={130} alt="Hoạt động làm bánh trong gian bếp quê"/></div>
      <div className="cc-scene-tabs" aria-label="Chọn cảnh Cồn Chim" onPointerEnter={()=>setEngaged(true)} onPointerLeave={()=>setEngaged(false)} onFocusCapture={()=>setEngaged(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setEngaged(false);}}>{['Cồn giữa dòng sông','Bên con nước','Bữa cơm người quê'].map((label,index)=><button key={label} type="button" aria-pressed={scene===index} onClick={()=>{setPlaying(false);setScene(index);}} className={scene===index?'is-active':''}>{label}<span>{String(index+1).padStart(2,'0')}</span></button>)}{!reduced&&<button className="cc-scene-playback" type="button" aria-label={playing?'Tạm dừng chuyển cảnh tự động':'Bật chuyển cảnh tự động'} aria-pressed={playing} title={playing?'Tạm dừng chuyển cảnh':'Tự động chuyển cảnh'} onClick={()=>setPlaying(value=>!value)}>{playing?<Pause size={14}/>:<Play size={14}/>}</button>}</div>
    </div>
  </section>;
}
