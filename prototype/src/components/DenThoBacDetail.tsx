import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface Props {
  isExpanded:boolean;isSidebarWide:boolean;
  onToggleExpanded?:()=>void;onToggleSidebarWide?:()=>void;
  onClose?:()=>void;onContentChange?:()=>void;
}
const CHANNEL='den-tho-bac-detail';
/** Keep the new detail page's typography and viewport independent of the map. */
export function DenThoBacDetail({isExpanded,isSidebarWide,onToggleExpanded,onToggleSidebarWide,onClose,onContentChange}:Props){
  const frame=useRef<HTMLIFrameElement>(null);const[ready,setReady]=useState(false),[slow,setSlow]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{
    const controls=()=>{
      const actions:string[]=[];
      if(onClose)actions.push('close');if(onToggleExpanded)actions.push('expand');if(onToggleSidebarWide&&!isExpanded)actions.push('resize');
      frame.current?.contentWindow?.postMessage({channel:CHANNEL,type:'host-controls',controls:{isExpanded,isSidebarWide,actions}},location.origin);
    };
    const preferences=()=>frame.current?.contentWindow?.postMessage({channel:CHANNEL,type:'preferences',reduceMotion:matchMedia('(prefers-reduced-motion: reduce)').matches||!!document.querySelector('.heritage-app.access-reduce-motion')},location.origin);
    const receive=(event:MessageEvent)=>{
      if(event.origin!==location.origin||event.source!==frame.current?.contentWindow||event.data?.channel!==CHANNEL)return;
      if(event.data.type==='ready'){setReady(true);controls();preferences();}
      if(event.data.type==='host-controls-request')controls();
      if(event.data.type==='interaction')onContentChange?.();
      if(event.data.type==='host-action'){
        if(event.data.action==='close')onClose?.();
        if(event.data.action==='expand')onToggleExpanded?.();
        if(event.data.action==='resize'&&!isExpanded)onToggleSidebarWide?.();
      }
    };
    window.addEventListener('message',receive);const observer=new MutationObserver(preferences),root=document.querySelector('.heritage-app');if(root)observer.observe(root,{attributes:true,attributeFilter:['class']});const media=matchMedia('(prefers-reduced-motion: reduce)');media.addEventListener('change',preferences);controls();preferences();
    return()=>{window.removeEventListener('message',receive);observer.disconnect();media.removeEventListener('change',preferences);};
  },[isExpanded,isSidebarWide,onToggleExpanded,onToggleSidebarWide,onClose,onContentChange]);
  useEffect(()=>{const timer=setTimeout(()=>setSlow(true),15000);return()=>clearTimeout(timer);},[attempt]);
  return <section className="dbk-host-detail relative h-full min-h-0 w-full bg-[#f7f6f0]" aria-label="Chi tiết Đền thờ Bác Hồ"><iframe ref={frame} key={attempt} src={`${import.meta.env.BASE_URL}den-tho-bac.html`} title="Khám phá Đền thờ Bác Hồ tại Long Đức" className="block h-full w-full border-0"/>{!ready&&<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f7f6f0] p-6 text-center text-[#252923]" role="status">{onClose&&<button type="button" className="absolute right-5 top-5 rounded-full border border-stone-400 p-3" onClick={onClose} aria-label="Đóng chi tiết Đền thờ Bác"><X size={22}/></button>}<p>{slow?'Chưa tải được nội dung chi tiết.':'Đang mở miền ký ức Long Đức…'}</p>{slow&&<button type="button" className="flex items-center gap-2 rounded-full bg-[#b52322] px-5 py-3 text-white" onClick={()=>{setReady(false);setSlow(false);setAttempt(n=>n+1);}}><RefreshCw size={18}/>Thử mở lại</button>}</div>}</section>;
}
