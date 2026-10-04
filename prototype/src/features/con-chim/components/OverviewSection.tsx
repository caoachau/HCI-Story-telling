import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowUpRight,ChevronLeft,ChevronRight,MapPin,Leaf,Utensils,Users,Compass} from 'lucide-react';
import {CHAPTERS,mapLink,site} from '../data/conChimData';
import {getEsriTileUrl} from '../../../services/esriImagery';
import {goToScreen} from '../utils/useScreenNavigation';
import {MotionWords} from './MotionWords';
function IsletMap(){
  const [failed,setFailed]=useState(false);
  const zoom=15,scale=2**zoom,x=(site.lng+180)/360*scale,lat=site.lat*Math.PI/180,y=(1-Math.asinh(Math.tan(lat))/Math.PI)/2*scale;
  return <div className="cc-islet-map">
    {!failed&&<div className="cc-map-tiles">{Array.from({length:9},(_,i)=><img key={i} src={getEsriTileUrl(Math.floor(x)-1+i%3,Math.floor(y)-1+Math.floor(i/3),zoom)} alt="" width={256} height={256} loading="lazy" onError={()=>setFailed(true)}/>)}</div>}
    <span className="cc-map-compass"><Compass size={24}/> BẮC</span>
    <span className="cc-map-pin" style={{left:`${(1+x%1)/3*100}%`,top:`${(1+y%1)/3*100}%`}}><MapPin size={30} fill="currentColor"/><strong>Cồn Chim</strong></span>
    <div className="cc-map-card"><span className="cc-map-label">Giữa dòng Cổ Chiên</span><h3>Hẹn bạn trên cồn.</h3><p>{failed?'Mở bản đồ để tìm vị trí và chuẩn bị đường đi.':'Ảnh vệ tinh giúp bạn hình dung vị trí thật của cồn.'}</p><a href={mapLink} target="_blank" rel="noreferrer" className="cc-text-button">Mở đường đi <ArrowUpRight size={17}/></a></div>
    <small className="cc-map-attribution">Esri · Maxar · Earthstar Geographics</small>
  </div>;
}
export function OverviewSection({index,onChange,onOpenItinerary}:{index:number;onChange:(index:number)=>void;onOpenItinerary:(tag?:string)=>void}){
  const left=useRef<HTMLDivElement>(null);
  const icon=[MapPin,Leaf,Utensils,Users],chapter=CHAPTERS[index];
  const go=onChange;
  useEffect(()=>{
    left.current?.scrollTo({top:0,behavior:'instant'});
  },[index]);
  return <section id="overview" className="cc-overview" data-step={index} aria-labelledby="cc-overview-title">
    <h2 id="cc-overview-title" className="cc-sr-only">Câu chuyện Cồn Chim</h2>
    <div className="cc-overview-layout">
      <div className="cc-chapter-side">
        <div className="cc-chapter-tabs" aria-label="Các chương Cồn Chim">{CHAPTERS.map((item,i)=>{const Icon=icon[i];return <button key={item.id} type="button" aria-pressed={index===i} onClick={()=>go(i)} className={index===i?'is-active':''}><Icon size={16}/><span>{item.label}</span></button>;})}</div>
        <div ref={left} className="cc-chapters" tabIndex={0} aria-label={`Câu chuyện ${index+1} trên 4: ${chapter.label}`}>
          {CHAPTERS.map((item,i)=><article key={item.id} className="cc-chapter" hidden={index!==i}><div><span className="cc-chapter-count">Câu chuyện {String(i+1).padStart(2,'0')} / 04</span><h3><MotionWords>{item.title}</MotionWords></h3><p className="cc-chapter-intro">{item.intro}</p><p>{item.body}</p><div className="cc-chapter-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div>
            <div>{item.tour==='map'?<a href={mapLink} target="_blank" rel="noreferrer" className="cc-text-button">{item.action}<ArrowUpRight size={18}/></a>:<button className="cc-text-button" onClick={()=>onOpenItinerary(item.tour)}>{item.action}<ArrowRight size={18}/></button>}
              <div className="cc-chapter-step"><span>{i<3?'Còn một câu chuyện phía sau.':'Tiếp theo: Dấu mốc Cồn Chim.'}</span><button className="cc-icon-button" aria-label={i<3?'Đọc chương tiếp theo':'Sang dấu mốc Cồn Chim'} onClick={()=>i<3?go(i+1):goToScreen('timeline')}><ArrowRight size={20}/></button></div></div>
          </article>)}
        </div>
        <div className="cc-chapter-pagination"><button className="cc-icon-button" aria-label={index===0?'Về đầu trang':'Chương trước'} onClick={()=>index===0?goToScreen('intro'):go(index-1)}><ChevronLeft size={18}/></button><span>{chapter.label} · {index+1}/4</span><button className="cc-icon-button" aria-label={index===3?'Sang dấu mốc Cồn Chim':'Chương tiếp theo'} onClick={()=>index===3?goToScreen('timeline'):go(index+1)}><ChevronRight size={18}/></button></div>
      </div>
      <div id="map" className="cc-chapter-visual">
        <div className={`cc-overview-map-layer ${index===0?'is-active':''}`} inert={index!==0}><IsletMap/></div>
        {CHAPTERS.slice(1).map((item,i)=><div key={item.id} className={`cc-chapter-photo ${index===i+1?'is-active':''}`} inert={index!==i+1}><img src={item.image} alt={item.title} loading="lazy" style={{objectPosition:item.id==='cuisine'?'75% center':'center'}}/><div className="cc-chapter-photo-caption"><span>{item.label}</span><h3>{item.id==='nature'?'Đi chậm một vòng cồn.':item.id==='cuisine'?'Chuyện ngon từ gian bếp nhỏ.':'Người quê, tấm lòng rộng.'}</h3><button className="cc-button cc-button-photo" onClick={()=>onOpenItinerary(item.tour)}>Đưa vào lịch trình <ArrowRight size={17}/></button></div></div>)}
      </div>
    </div>
  </section>;
}
