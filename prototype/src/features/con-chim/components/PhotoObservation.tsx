import React, { useRef, useState } from 'react';
import { Eye, EyeOff, Minus, Plus } from 'lucide-react';
import type { DiscoveryStory } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';

export function PhotoObservation({story,selected,onSelect}:{story:DiscoveryStory;selected:string|undefined;onSelect:(id:string)=>void}) {
  const [zoom,setZoom]=useState(1),[labels,setLabels]=useState(true),[failed,setFailed]=useState(false),[ready,setReady]=useState(false),[attempt,setAttempt]=useState(0);
  const surface=useRef<HTMLDivElement>(null);
  const layer=STORY_LAYERS[story.id], point=layer.points.find(item=>item.id===selected)||layer.points[0];
  const resize=(next:number)=>{setZoom(Math.max(1,Math.min(2.5,next)));};
  return <div className="ccl-observation">
    <div className="ccl-observation-heading"><div><p className="cck-kicker">Quan sát ảnh theo tốc độ của bạn</p><h2 id="cck-reader-title">{story.title}</h2></div><div className="ccl-zoom-controls" aria-label="Điều khiển quan sát ảnh"><button type="button" aria-label="Thu nhỏ ảnh" disabled={zoom===1} onClick={()=>resize(zoom-.5)}><Minus size={24}/></button><output aria-live="polite">{Math.round(zoom*100)}%</output><button type="button" aria-label="Phóng to ảnh" disabled={zoom===2.5} onClick={()=>resize(zoom+.5)}><Plus size={24}/></button><button type="button" aria-pressed={labels} onClick={()=>setLabels(value=>!value)}>{labels?<EyeOff size={21}/>:<Eye size={21}/>}<span>{labels?'Ẩn chú giải':'Hiện chú giải'}</span></button></div></div>
    <div className="ccl-observation-layout"><div ref={surface} className="ccl-photo-surface" tabIndex={0} aria-label="Ảnh có thể phóng to và cuộn để quan sát">
      {!ready&&!failed&&<p className="ccl-photo-loading" role="status">Đang tải ảnh…</p>}
      {failed?<div className="ccl-photo-error" role="status"><p>Chưa tải được ảnh. Bạn vẫn có thể chọn chi tiết trong danh sách.</p><button type="button" className="cck-outline" onClick={()=>{setReady(false);setFailed(false);setAttempt(value=>value+1);}}>Thử tải lại ảnh</button></div>:<div className="ccl-photo-plane" style={{width:`${zoom*100}%`}}>
        <img key={attempt} src={story.photo.image} alt={story.photo.title} onLoad={()=>setReady(true)} onError={()=>{setFailed(true);setReady(false);}}/>
        {ready&&labels&&layer.points.map((item,index)=><button type="button" key={item.id} className="ccl-photo-point" style={{left:`${item.x}%`,top:`${item.y}%`}} aria-label={`Chi tiết ${index+1}: ${item.title}`} aria-pressed={point.id===item.id} onClick={()=>onSelect(item.id)}>{index+1}</button>)}
      </div>}
    </div><aside className="ccl-point-details"><p>Chọn trên ảnh hoặc trong danh sách. Khi phóng to, vuốt trên ảnh để xem phần khác.</p><div className="ccl-point-list">{layer.points.map((item,index)=><button type="button" key={item.id} aria-pressed={point.id===item.id} onClick={()=>onSelect(item.id)}><span>{index+1}</span>{item.title}</button>)}</div><div className="ccl-point-explanation" aria-live="polite"><span className="ccl-content-kind">Quan sát từ ảnh</span><h3>{point.title}</h3><p>{point.explanation}</p></div><p className="ccl-photo-credit">Ảnh: {story.photo.credit}. Điểm chạm là chú giải biên soạn từ những gì nhìn thấy trong ảnh.</p></aside></div>
  </div>;
}
