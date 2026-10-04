import React from 'react';
import {ArrowUpRight,Bike,Leaf,Utensils} from 'lucide-react';
import {TOURS} from '../data/conChimData';
const icons={bike:Bike,leaf:Leaf,food:Utensils};
export function ExploreMoreSection({index,onChange,compact,onOpenItinerary}:{index:number;onChange:(index:number)=>void;compact:boolean;onOpenItinerary:(tag?:string)=>void}){
  return <section id="experiences" className="cc-experiences cc-section" data-step={compact?index:0} aria-labelledby="cc-experiences-title"><div className="cc-container">
    <div className="cc-section-heading" data-reveal><h2 id="cc-experiences-title">Chọn một cách<br/><span>gặp Cồn Chim.</span></h2><p>Đi với gia đình, theo lối xanh hay hẹn nhau bên bếp. Bạn muốn bắt đầu từ đâu?</p></div>
    <div className="cc-experience-tabs" aria-label="Chọn trải nghiệm">{TOURS.map((tour,i)=><button key={tour.id} aria-pressed={index===i} onClick={()=>onChange(i)}>{tour.title}</button>)}</div>
    <div className="cc-experience-grid">{TOURS.map((tour,i)=>{const Icon=icons[tour.icon];return <article key={tour.id} className={`cc-experience-card cc-experience-${i}`} data-depth-card hidden={compact&&index!==i}><div className="cc-experience-image"><img src={tour.image} alt={tour.title} loading="lazy" style={{objectPosition:tour.id==='cuisine'?'75% center':'center'}}/></div><div className="cc-experience-copy"><span className="cc-experience-type"><Icon size={17}/> {tour.note}</span><h3>{tour.title}</h3><p>{tour.desc}</p><button className="cc-text-button" onClick={()=>onOpenItinerary(tour.id)}>Lên lịch trải nghiệm <ArrowUpRight size={19}/></button></div></article>;})}</div>
    <p className="cc-experience-note"><Leaf size={17}/> Hoạt động và thực đơn được hẹn cùng người đón khách trước chuyến đi.</p>
  </div></section>;
}
