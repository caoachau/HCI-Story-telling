import React,{useEffect,useRef,useState} from 'react';
import {Leaf,Volume2,VolumeX,CalendarDays,Menu,X,Film,Compass,QrCode,Expand,Shrink,PanelRightOpen,PanelRightClose} from 'lucide-react';
import {soundscape} from '../utils/soundHelper';
import type {DetailHostAction,DetailHostControls} from '../utils/hostControls';
const links=[['Tổng quan','overview'],['Dấu mốc','timeline'],['Hình ảnh','gallery'],['Trải nghiệm','experiences'],['Góc khám phá','heritage-iris']];
export function Header({onOpenItinerary,onOpenVeoModal}:{onOpenItinerary:()=>void;onOpenVeoModal:()=>void}){
  const [open,setOpen]=useState(false),[audio,setAudio]=useState(false),[active,setActive]=useState(''),[status,setStatus]=useState('');
  const [hidden,setHidden]=useState(false);
  const [host,setHost]=useState<DetailHostControls|null>(null);
  const header=useRef<HTMLElement>(null);
  useEffect(()=>{
    const receive=(event:MessageEvent)=>{
      if(window.parent===window||event.origin!==window.location.origin||event.source!==window.parent||event.data?.channel!=='con-chim-detail'||event.data.type!=='host-controls')return;
      setHost(event.data.controls);
    };
    window.addEventListener('message',receive);
    if(window.parent!==window)window.parent.postMessage({channel:'con-chim-detail',type:'host-controls-request'},window.location.origin);
    return()=>window.removeEventListener('message',receive);
  },[]);
  useEffect(()=>{
    const current=(event:Event)=>{const id=(event as CustomEvent<string>).detail;setActive(id);if(id==='intro')setHidden(false);};
    document.addEventListener('cc:active-screen',current);
    const stop=()=>{if(soundscape.getStatus())soundscape.toggle();};
    window.addEventListener('pagehide',stop);
    return()=>{document.removeEventListener('cc:active-screen',current);stop();window.removeEventListener('pagehide',stop);};
  },[]);
  useEffect(()=>{
    let distance=0,touchX=0,touchY=0,touchActive=false;
    const blocked=()=>open||!!document.querySelector('[data-detail-modal]');
    const intent=(delta:number)=>{
      if(blocked())return;
      if(!delta)return;
      if(Math.sign(distance)!==Math.sign(delta))distance=0;
      distance+=delta;
      if(distance<=-2){distance=0;setHidden(false);}
      else if(distance>=10){
          distance=0;
          // Pointer scrolling releases any focus left on a header control.
          const focused=document.activeElement;
          if(focused instanceof HTMLElement&&header.current?.contains(focused))focused.blur();
          setHidden(true);
      }
    };
    const wheel=(event:WheelEvent)=>{if(!event.ctrlKey&&Math.abs(event.deltaY)>=Math.abs(event.deltaX))intent(event.deltaY*(event.deltaMode===1?16:1));};
    const start=(event:TouchEvent)=>{touchActive=event.touches.length===1;if(touchActive){distance=0;touchY=event.touches[0].clientY;touchX=event.touches[0].clientX;}};
    const touchIntent=({clientX,clientY}:Touch)=>{
      if(Math.abs(touchY-clientY)>Math.abs(touchX-clientX))intent(touchY-clientY);
      touchY=clientY;touchX=clientX;
    };
    const move=(event:TouchEvent)=>{
      if(event.touches.length!==1){touchActive=false;return;}
      if(touchActive)touchIntent(event.touches[0]);
    };
    // Browsers can defer touchmove for very short gestures until release.
    const end=(event:TouchEvent)=>{if(touchActive&&event.changedTouches.length===1)touchIntent(event.changedTouches[0]);touchActive=false;};
    const cancel=()=>{touchActive=false;};
    const key=(event:KeyboardEvent)=>{
      if(blocked()||event.ctrlKey||event.metaKey||event.altKey)return;
      const target=event.target instanceof Element?event.target:document.activeElement;
      if(target?.closest('input,textarea,select,[contenteditable="true"],.cc-header'))return;
      if(['ArrowUp','PageUp','Home'].includes(event.key))setHidden(false);
      if(['ArrowDown','PageDown'].includes(event.key))setHidden(true);
    };
    document.addEventListener('wheel',wheel,{passive:true,capture:true});
    document.addEventListener('touchstart',start,{passive:true,capture:true});
    document.addEventListener('touchmove',move,{passive:true,capture:true});
    document.addEventListener('touchend',end,{passive:true,capture:true});
    document.addEventListener('touchcancel',cancel,{passive:true,capture:true});
    document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('wheel',wheel,true);document.removeEventListener('touchstart',start,true);document.removeEventListener('touchmove',move,true);document.removeEventListener('touchend',end,true);document.removeEventListener('touchcancel',cancel,true);document.removeEventListener('keydown',key);};
  },[open]);
  const toggleAudio=()=>{try{setAudio(soundscape.toggle());setStatus('');}catch{setStatus('Thiết bị chưa hỗ trợ âm thanh.');}};
  const hostAction=(action:DetailHostAction)=>{setOpen(false);window.parent.postMessage({channel:'con-chim-detail',type:'host-action',action},window.location.origin);};
  const vi=host?.lang!=='en';
  const hostItems=[
    {action:'panorama' as const,label:vi?'Xem toàn cảnh Cồn Chim':'View Cồn Chim panorama',Icon:Compass,secondary:true},
    {action:'qr' as const,label:vi?'Mở mã QR Cồn Chim':'Open Cồn Chim QR code',Icon:QrCode,secondary:true},
    {action:'resize' as const,label:vi?(host?.isSidebarWide?'Thu hẹp chi tiết':'Mở rộng chi tiết'):'Resize details',Icon:host?.isSidebarWide?PanelRightClose:PanelRightOpen,secondary:true},
    {action:'expand' as const,label:vi?(host?.isExpanded?'Thoát toàn màn hình chi tiết':'Xem chi tiết toàn màn hình'):'Toggle full screen details',Icon:host?.isExpanded?Shrink:Expand,secondary:false},
    {action:'close' as const,label:vi?'Đóng chi tiết Cồn Chim':'Close Cồn Chim details',Icon:X,secondary:false},
  ].filter(item=>host?.actions.includes(item.action));
  const reveal=()=>{setHidden(false);requestAnimationFrame(()=>header.current?.querySelector<HTMLAnchorElement>('.cc-brand')?.focus({preventScroll:true}));};
  return <><header ref={header} className={`cc-header ${host?'has-host-controls':''} ${hidden?'is-hidden':''}`} inert={hidden} aria-hidden={hidden||undefined} onFocusCapture={()=>setHidden(false)}>
    <div className="cc-header-inner cc-container">
      <a href="#" className="cc-brand" aria-label="Cồn Chim, về đầu trang"><span className="cc-brand-mark"><Leaf size={23} strokeWidth={1.5}/></span><span><strong>Cồn Chim</strong><small>Miền sống thuận thiên</small></span></a>
      <nav className="cc-desktop-nav" aria-label="Mục lục">{links.map(([label,id])=><a key={id} className={active===id?'is-active':''} href={`#${id}`} aria-current={active===id?'location':undefined}>{label}</a>)}</nav>
      <div className="cc-header-actions">
        <button className="cc-icon-button" type="button" aria-label="Mở studio chuyển động" title="Studio chuyển động" onClick={onOpenVeoModal}><Film size={18}/></button>
        <button className="cc-icon-button cc-sound-button" type="button" aria-label={audio?'Tắt âm thanh thư giãn':'Bật âm thanh thư giãn'} aria-pressed={audio} onClick={toggleAudio}>{audio?<Volume2 size={18}/>:<VolumeX size={18}/>}</button>
        <button type="button" className="cc-button cc-header-plan" aria-label="Lên lịch trình Cồn Chim" onClick={onOpenItinerary}><CalendarDays size={16}/><span>Lịch trình</span></button>
        {hostItems.length>0&&<div className="cc-host-controls">{hostItems.map(({action,label,Icon,secondary})=><button key={action} type="button" className={`cc-icon-button ${secondary?'cc-host-secondary':''}`} aria-label={label} title={label} onClick={()=>hostAction(action)}><Icon size={16}/></button>)}</div>}
        <button className="cc-icon-button cc-menu-button" type="button" aria-label="Mở hoặc đóng điều hướng" aria-expanded={open} aria-controls={open?'cc-mobile-nav':undefined} onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
      </div>
    </div>
    {open&&<nav id="cc-mobile-nav" className="cc-mobile-nav" aria-label="Mục lục trên điện thoại">{links.map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}<button className="cc-text-button" onClick={()=>{setOpen(false);onOpenVeoModal();}}>Studio chuyển động <Film size={17}/></button><button className="cc-text-button" aria-pressed={audio} onClick={toggleAudio}>{audio?'Tắt âm thanh thư giãn':'Bật âm thanh thư giãn'} {audio?<Volume2 size={17}/>:<VolumeX size={17}/>}</button>{hostItems.filter(item=>item.secondary).map(({action,label,Icon})=><button key={action} type="button" className="cc-text-button cc-host-menu-action" onClick={()=>hostAction(action)} aria-label={label}>{label} <Icon size={17}/></button>)}</nav>}
    <span className="cc-sr-only" role="status">{status}</span>
  </header>{hidden&&<button className="cc-header-reveal" type="button" aria-label="Hiện thanh điều hướng" title="Hiện thanh điều hướng" onClick={reveal}><Menu size={16}/></button>}</>;
}
