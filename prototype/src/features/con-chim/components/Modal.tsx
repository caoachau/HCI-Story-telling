import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { isDetailMotionReduced, motionEase, useReducedDetailMotion } from '../utils/motion';
export function Modal({title,onClose,children,wide=false,className='',origin}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean;className?:string;origin?:DOMRect|null}){
  const backdrop=useRef<HTMLDivElement>(null),panel=useRef<HTMLDivElement>(null);
  const animations=useRef<Animation[]>([]),closing=useRef(false),mounted=useRef(false),closeCallback=useRef(onClose);
  closeCallback.current=onClose;
  const reduced=useReducedDetailMotion();
  const startOrigin=useRef(origin);
  const restRect=useRef<DOMRect|null>(null);
  const originTransform=()=>{
    const source=startOrigin.current,target=restRect.current;
    if(!source||!target)return 'translateY(24px) scale(.975)';
    const x=source.x+source.width/2-target.x-target.width/2,y=source.y+source.height/2-target.y-target.height/2;
    return `translate(${x}px,${y}px) scale(${Math.max(.12,Math.min(.9,source.width/target.width))})`;
  };
  useEffect(()=>{
    mounted.current=true;
    return()=>{mounted.current=false;animations.current.forEach(animation=>animation.cancel());};
  },[]);
  useLayoutEffect(()=>{
    animations.current.forEach(animation=>animation.cancel());
    if(reduced||!backdrop.current?.animate||!panel.current)return;
    restRect.current=panel.current.getBoundingClientRect();
    const fade=backdrop.current.animate([{opacity:0},{opacity:1}],{duration:260,easing:motionEase,fill:'both'});
    const rise=panel.current.animate([{opacity:0,transform:originTransform()},{opacity:1,transform:'none'}],{duration:650,easing:motionEase,fill:'both'});
    animations.current=[fade,rise];
    rise.finished.then(()=>{fade.cancel();rise.cancel();}).catch(()=>{});
    return()=>{fade.cancel();rise.cancel();};
  },[reduced]);
  const close=()=>{
    if(closing.current)return;
    if(isDetailMotionReduced()||!panel.current?.animate||!backdrop.current){closeCallback.current();return;}
    closing.current=true;
    backdrop.current.dataset.closing='true';
    const opacity=getComputedStyle(backdrop.current).opacity,style=getComputedStyle(panel.current);
    animations.current.forEach(animation=>animation.cancel());
    const fade=backdrop.current.animate([{opacity},{opacity:0}],{duration:180,easing:'ease-out',fill:'both'});
    const fall=panel.current.animate([{opacity:style.opacity,transform:style.transform},{opacity:0,transform:originTransform()}],{duration:220,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});
    animations.current=[fade,fall];
    fall.finished.catch(()=>{}).then(()=>{if(mounted.current)closeCallback.current();});
  };
  return <div ref={backdrop} className="cc-modal" data-detail-modal role="dialog" aria-modal="true" aria-label={title} onClick={event=>{if(event.target===event.currentTarget)close();}}>
    <div ref={panel} className={`cc-modal-window ${wide?'cc-modal-wide':''} ${className}`}>
      <button type="button" className="cc-modal-close cc-icon-button" aria-label="Đóng cửa sổ" onClick={close}><X size={21}/></button>
      <h2 className="cc-sr-only">{title}</h2>{children}
    </div>
  </div>;
}
