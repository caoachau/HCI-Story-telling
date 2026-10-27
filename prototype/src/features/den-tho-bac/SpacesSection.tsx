import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Focus } from 'lucide-react';
import siteMap from '../../assets/den-tho-bac/map-current-v2.webp';
import { MAP_DIMENSIONS, PHOTOS, SPACE_POINTS, type Photo } from './content';
import { Picture } from './MemorialMedia';
import { useChapterMotion } from './memorial-motion';

const MAP_PHOTO:Pick<Photo,'src'|'alt'>={src:siteMap,alt:'Toàn cảnh khu di tích Đền thờ Bác Hồ với tám điểm tham quan được đánh số 01 đến 08'};
export type SpacePanelView='list'|'summary';
interface Props {spot:number;onSelect:(index:number)=>void;view:SpacePanelView;onViewChange:(view:SpacePanelView)=>void;onOpen:(id:string)=>void;headingRef:React.RefObject<HTMLHeadingElement|null>;}
type Position={x:number;y:number};

export function SpacesSection({spot,onSelect,view,onViewChange,onOpen,headingRef}:Props){
  const point=SPACE_POINTS[spot],viewport=useRef<HTMLDivElement>(null);
  const list=useRef<HTMLElement>(null),panel=useRef<HTMLElement>(null),summaryHeading=useRef<HTMLHeadingElement>(null);
  const [zoom,setZoom]=useState(1),[pan,setPan]=useState<Position>({x:0,y:0}),[dragging,setDragging]=useState(false),[selection,setSelection]=useState(0);
  const [frame,setFrame]=useState({width:0,height:0});
  const gesture=useRef<{x:number;y:number;pan:Position}|null>(null);
  // The map has its own visible area beside the guide. Keep the photograph
  // and all markers together when that area changes size.
  const ratio=MAP_DIMENSIONS.width/MAP_DIMENSIONS.height;
  const imageWidth=Math.max(frame.width,frame.height*ratio),imageHeight=imageWidth/ratio;
  const imageLeft=(frame.width-imageWidth)/2,imageTop=(frame.height-imageHeight)/2;
  const clampPan=(next:Position,scale=zoom)=>{
    const scaledLeft=imageLeft+imageWidth*(1-scale)/2,scaledTop=imageTop+imageHeight*(1-scale)/2;
    return {x:imageWidth*scale<=frame.width?0:Math.max(frame.width-scaledLeft-imageWidth*scale,Math.min(-scaledLeft,next.x)),y:imageHeight*scale<=frame.height?0:Math.max(frame.height-scaledTop-imageHeight*scale,Math.min(-scaledTop,next.y))};
  };
  const centered=(index:number,scale:number)=>{
    const marker=SPACE_POINTS[index].markers[0];
    return clampPan({x:frame.width*.5-(imageLeft+imageWidth/2+(marker.x/100-.5)*imageWidth*scale),y:frame.height*.46-(imageTop+imageHeight/2+(marker.y/100-.5)*imageHeight*scale)},scale);
  };
  const focusWithinPanel=(element:HTMLElement|null)=>{element?.focus({preventScroll:true});if(element?.closest('.db-space-list')||matchMedia('(max-width:900px)').matches){const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('reduce-motion');element?.scrollIntoView({block:'nearest',behavior:reduced?'instant':'smooth'});}};
  const choose=(index:number,focusSummary=false)=>{onSelect(index);onViewChange('summary');setSelection(n=>n+1);if(zoom>1)setPan(centered(index,zoom));if(focusSummary)requestAnimationFrame(()=>focusWithinPanel(summaryHeading.current));};
  const showList=()=>{onViewChange('list');setZoom(1);setPan({x:0,y:0});requestAnimationFrame(()=>focusWithinPanel(list.current?.querySelector<HTMLButtonElement>(`[data-space-id="${point.id}"]`)||null));};
  const lookCloser=()=>{if(zoom>1){setZoom(1);setPan({x:0,y:0});return;}setZoom(1.5);setPan(centered(spot,1.5));};
  const finishDrag=()=>{gesture.current=null;setDragging(false);};
  const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();
    const isList=event.currentTarget===list.current;
    const focused=SPACE_POINTS.findIndex(p=>p.id===(event.target as HTMLElement).closest<HTMLButtonElement>('button')?.dataset.spaceId);
    const current=focused<0?spot:focused;
    const next=event.key==='Home'?0:event.key==='End'?SPACE_POINTS.length-1:Math.max(0,Math.min(SPACE_POINTS.length-1,current+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)));
    if(!isList)choose(next);
    const nextButton=event.currentTarget.querySelector<HTMLButtonElement>(`[data-space-id="${SPACE_POINTS[next].id}"]`);
    nextButton?.focus({preventScroll:true});
    if(isList)nextButton?.scrollIntoView({block:'nearest',inline:'nearest'});
  };
  useLayoutEffect(()=>{
    const element=viewport.current;if(!element)return;
    const measure=()=>{
      setFrame({width:element.clientWidth,height:element.clientHeight});
      setZoom(1);setPan({x:0,y:0});
    };
    measure();const observer=new ResizeObserver(measure);observer.observe(element);if(panel.current)observer.observe(panel.current);
    return()=>observer.disconnect();
  },[]);
  useChapterMotion(panel,'spaces',`${view}-${point.id}-${selection}`);
  const marker=point.markers[0];
  return <section className="db-spaces db-atlas" aria-labelledby="db-atlas-title" data-place-effect={point.effect}>
    <figure className="db-atlas-map">
      <div ref={viewport} className="db-atlas-viewport" data-dragging={dragging} data-zoom={zoom} style={{touchAction:zoom>1?'none':'pan-y'}}
        tabIndex={zoom>1?0:-1} role="group" aria-label="Ảnh sơ đồ tương tác. Khi nhìn gần, kéo ảnh hoặc dùng phím mũi tên để quan sát."
        onKeyDown={event=>{if(event.target!==event.currentTarget||zoom===1)return;const moves:Record<string,Position>={ArrowLeft:{x:40,y:0},ArrowRight:{x:-40,y:0},ArrowUp:{x:0,y:40},ArrowDown:{x:0,y:-40}};const delta=moves[event.key];if(delta){event.preventDefault();setPan(old=>clampPan({x:old.x+delta.x,y:old.y+delta.y}));}}}
        onPointerDown={event=>{if(zoom===1||(event.target as HTMLElement).closest('button,a'))return;gesture.current={x:event.clientX,y:event.clientY,pan};setDragging(true);event.currentTarget.setPointerCapture(event.pointerId);}}
        onPointerMove={event=>{const start=gesture.current;if(start)setPan(clampPan({x:start.pan.x+event.clientX-start.x,y:start.pan.y+event.clientY-start.y}));}}
        onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}>
        <div className="db-aerial-plane" role="group" aria-label="Tám điểm trên sơ đồ" onKeyDown={keyboard} style={{width:imageWidth,height:imageHeight,left:imageLeft,top:imageTop,transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`} as React.CSSProperties}>
          <Picture photo={MAP_PHOTO} width={MAP_DIMENSIONS.width} height={MAP_DIMENSIONS.height} eager/>
          {view==='summary'&&<div key={`${point.id}-${selection}`} className="db-map-focus" data-effect={point.effect} style={{left:marker.x+'%',top:marker.y+'%'}} aria-hidden="true"/>}
          {SPACE_POINTS.map((p,i)=><button type="button" className="db-map-point" key={p.id} data-space-id={p.id} data-space-code={p.code} data-label-side={p.labelSide} data-place-effect={p.effect} style={{left:p.markers[0].x+'%',top:p.markers[0].y+'%'}} aria-pressed={view==='summary'&&spot===i} aria-controls="db-atlas-panel-content" title={p.label} onClick={()=>choose(i)}><span className="db-map-point-code">{p.code}</span><span className="db-map-point-label">{p.short}</span></button>)}
        </div>
      </div>
    </figure>
    <aside ref={panel} className="db-space-detail db-atlas-panel" id="db-atlas-panel-content" data-panel-view={view} data-space-id={view==='summary'?point.id:undefined}>
      {view==='list'?<>
        <header className="db-atlas-title"><p>ĐỀN THỜ BÁC HỒ · LONG ĐỨC</p><h1 ref={headingRef} tabIndex={-1} id="db-atlas-title">Tám điểm dừng.</h1><p className="db-atlas-list-intro">Chọn một điểm để bắt đầu khám phá.</p></header>
        <nav ref={list} className="db-space-list" aria-label="Chọn điểm tham quan" onKeyDown={keyboard}>{SPACE_POINTS.map((p,i)=><button type="button" key={p.id} data-space-id={p.id} aria-controls="db-atlas-panel-content" onClick={()=>choose(i,true)}><span className="db-atlas-place-code">{p.code}</span><span className="db-atlas-place-label"><strong>{p.label}</strong><small>{p.category}</small></span><ArrowRight aria-hidden="true"/></button>)}</nav>
      </>:<>
      <header className="db-atlas-summary-header"><h1 ref={headingRef} tabIndex={-1} id="db-atlas-title" className="db-atlas-sr">Không gian di tích</h1><button type="button" className="db-atlas-back" data-action="show-space-list" onClick={showList}><ArrowLeft/>Tất cả 8 điểm</button></header>
      <div className="db-atlas-selection" key={`${point.id}-${selection}`} data-effect={point.effect}>
        <div className="db-atlas-selected-photo" style={{'--map-crop-left':`calc(50% - ${marker.x*3.2}%)`,'--map-crop-top':`calc(50% - ${marker.y*3.2*MAP_DIMENSIONS.height/MAP_DIMENSIONS.width}cqw)`} as React.CSSProperties}>
          <Picture key={point.photo==='siteplan'?point.id:point.photo} photo={PHOTOS[point.photo]} className={point.photo==='siteplan'?'db-atlas-map-crop':''} eager/>
          <span className="db-atlas-photo-label">{point.photo==='siteplan'?'Vị trí trên ảnh toàn cảnh':'Ảnh tư liệu về công trình'}</span>
          <button type="button" className="db-atlas-closeup" aria-pressed={zoom>1} onClick={lookCloser}><Focus/>{zoom>1?'Về tổng thể':'Nhìn gần'}</button>
        </div>
        <div id="db-space-description" aria-live="polite" aria-atomic="true"><p className="db-atlas-category"><span className="db-space-number">{point.code}</span>{point.category}</p><h2 ref={summaryHeading} tabIndex={-1}>{point.label}</h2><p>{point.text}</p><div className="db-atlas-observe"><h3>Nhìn kỹ một chút</h3><ul>{point.look.map((line,i)=><li key={line}><span>0{i+1}</span>{line}</li>)}</ul></div><div className="db-atlas-reflection"><span>Một câu hỏi mang theo</span><p>{point.question}</p></div></div>
      </div>
      <button type="button" className="db-button db-button-primary" data-action="open-space-details" onClick={()=>onOpen(point.story)}>Xem chi tiết<ArrowRight/></button>
      <div className="db-atlas-pagination"><button type="button" aria-label="Địa điểm trước" disabled={spot===0} onClick={()=>choose(spot-1)}><ArrowLeft/></button><button type="button" aria-label="Địa điểm tiếp theo" disabled={spot===SPACE_POINTS.length-1} onClick={()=>choose(spot+1)}><ArrowRight/></button></div>
      </>}
    </aside>
  </section>;
}
