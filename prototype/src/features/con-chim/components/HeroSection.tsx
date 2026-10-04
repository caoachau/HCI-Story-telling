import React,{useState} from 'react';
import {ArrowRight,Bike,Leaf,Utensils,Waves,Users,Wheat} from 'lucide-react';
import {HERO_PETALS,Petal} from '../data/conChimData';
import {Modal} from './Modal';
const paths=[
'M 240,0 L 1140,0 C 1120,100 1090,200 1050,310 A 255 255 0 0 0 770,360 C 700,220 500,90 240,0 Z',
'M 1140,0 L 1920,0 L 1920,270 C 1700,380 1420,460 1210,500 A 255 255 0 0 0 1050,310 C 1090,200 1120,100 1140,0 Z',
'M 1920,270 L 1920,780 L 1920,1080 L 1780,1080 C 1520,1020 1280,880 1150,710 A 255 255 0 0 0 1210,500 C 1420,460 1700,380 1920,270 Z',
'M 1780,1080 L 640,1080 C 740,980 820,900 890,790 A 255 255 0 0 0 1150,710 C 1280,880 1520,1020 1780,1080 Z',
'M 640,1080 L 0,1080 L 0,760 C 240,670 510,610 715,590 A 255 255 0 0 0 890,790 C 820,900 740,980 640,1080 Z',
'M 0,760 L 0,0 L 240,0 C 500,90 700,220 770,360 A 255 255 0 0 0 715,590 C 510,610 240,670 0,760 Z',
];
const positions=[[150,-50,1100,600],[1000,-30,1000,750],[1100,240,950,950],[420,590,1400,650],[-150,530,1100,620],[-150,-70,1000,950]];
const icons={bike:Bike,food:Utensils,leaf:Leaf,waves:Waves,people:Users,wheat:Wheat};
export function HeroSection({onOpenItinerary}:{onOpenItinerary:(tag?:string)=>void}){
  const [selected,setSelected]=useState<Petal|null>(null),[hover,setHover]=useState<string|null>(null);
  return <section id="heritage-iris" className="cc-iris cc-section" aria-labelledby="cc-iris-title"><div className="cc-container">
    <div className="cc-section-heading cc-heading-centered" data-reveal><h2 id="cc-iris-title">Những điều bình dị,<br/><span>ghép thành một miền thương.</span></h2><p>Chạm vào một góc ảnh, mở một câu chuyện của Cồn Chim.</p></div>
    <div className="cc-iris-canvas" data-reveal><svg viewBox="0 0 1920 1080" aria-label="Sáu góc khám phá Cồn Chim">
      <defs>{paths.map((path,i)=><clipPath key={i} id={`cc-petal-${i}`}><path d={path}/></clipPath>)}</defs>
      {HERO_PETALS.map((item,i)=><g key={item.id} role="button" tabIndex={0} aria-label={item.title} clipPath={`url(#cc-petal-${i})`} className={`cc-iris-petal ${hover===item.id?'is-active':''} ${hover&&hover!==item.id?'is-muted':''}`} onMouseEnter={()=>setHover(item.id)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(item.id)} onBlur={()=>setHover(null)} onClick={()=>setSelected(item)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(item);}}}>
        <image href={item.image} x={positions[i][0]} y={positions[i][1]} width={positions[i][2]} height={positions[i][3]} preserveAspectRatio="xMidYMid slice"/>
        <path d={paths[i]} fill="none" stroke="var(--cc-surface)" strokeWidth={14}/>
      </g>)}
      <circle cx={960} cy={540} r={248} fill="var(--cc-surface)"/>
    </svg><div className="cc-iris-center"><Leaf size={30} strokeWidth={1.2}/><strong>Cồn<br/>Chim</strong><span>{hover?HERO_PETALS.find(item=>item.id===hover)?.title:'Một miền sống thuận thiên'}</span></div><div className="cc-iris-mobile">{HERO_PETALS.map(item=><button key={item.id} onClick={()=>setSelected(item)}><img src={item.image} alt="" loading="lazy"/><span>{item.title}</span></button>)}</div></div>
    <div className="cc-iris-choices">{HERO_PETALS.map(item=>{const Icon=icons[item.icon];return <button key={item.id} onMouseEnter={()=>setHover(item.id)} onMouseLeave={()=>setHover(null)} onClick={()=>setSelected(item)} className={hover===item.id?'is-active':''}><Icon size={18}/><span>{item.title}</span></button>;})}</div>
    {selected&&<Modal title={selected.title} onClose={()=>setSelected(null)} className="cc-petal-modal"><img className="cc-story-image" src={selected.image} alt={selected.title}/><div className="cc-modal-copy"><h3>{selected.title}</h3><p>{selected.description}</p><button className="cc-button" onClick={()=>{const tour=selected.tour;setSelected(null);onOpenItinerary(tour);}}>Đưa vào chuyến đi <ArrowRight size={18}/></button></div></Modal>}
  </div></section>;
}
