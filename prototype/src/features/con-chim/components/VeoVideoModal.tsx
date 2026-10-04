import React,{useEffect,useRef,useState} from 'react';
import {Film,Image as ImageIcon,Upload,ArrowRight,Download,RefreshCw,AlertCircle} from 'lucide-react';
import {PHOTOS} from '../data/conChimData';
import {Modal} from './Modal';
import {generateVeo} from '../utils/veoClient';
const samples=['Máy quay chậm lướt qua lối làng Cồn Chim, hàng dừa và ruộng xanh trong nắng sớm.','Góc máy tĩnh nhìn mặt nước Cổ Chiên gợn nhẹ, lá dừa lay trong gió.','Cận cảnh đôi tay làm bánh dân gian trong gian bếp quê, ánh sáng ấm và tự nhiên.'];
export function VeoVideoModal({isOpen,onClose}:{isOpen:boolean;onClose:()=>void}){
  const [mode,setMode]=useState<'image'|'text'>('image'),[image,setImage]=useState(PHOTOS[0].image),[prompt,setPrompt]=useState(samples[0]),[ratio,setRatio]=useState('16:9'),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[video,setVideo]=useState('');
  const request=useRef<AbortController|null>(null),file=useRef<HTMLInputElement>(null);
  useEffect(()=>{if(!isOpen){request.current?.abort();setBusy(false);}return()=>request.current?.abort();},[isOpen]);
  if(!isOpen)return null;
  const upload=async(event:React.ChangeEvent<HTMLInputElement>)=>{
    const selected=event.target.files?.[0];if(!selected)return;
    if(!['image/jpeg','image/png','image/webp'].includes(selected.type)||selected.size>10*1024*1024){setError('Chọn ảnh JPG, PNG hoặc WebP dưới 10 MB.');event.target.value='';return;}
    const reader=new FileReader();reader.onload=()=>{setImage(reader.result as string);setError('');};reader.onerror=()=>setError('Chưa đọc được ảnh đã chọn.');reader.readAsDataURL(selected);
  };
  const generate=async()=>{
    request.current?.abort();const controller=new AbortController();request.current=controller;setBusy(true);setError('');setVideo('');
    try{const result=await generateVeo({prompt:prompt.trim(),image:mode==='image'?image:undefined,aspectRatio:ratio,signal:controller.signal,onStatus:setStatus});if(!controller.signal.aborted)setVideo(result);}
    catch(err){if(!(err instanceof DOMException&&err.name==='AbortError'))setError(err instanceof Error?err.message:'Chưa tạo được video.');}
    finally{if(!controller.signal.aborted)setBusy(false);}
  };
  return <Modal title="Studio chuyển động Cồn Chim" onClose={onClose} wide className="cc-studio-modal"><div className="cc-modal-copy"><Film size={26} strokeWidth={1.2}/><h3>Để một góc cồn<br/>khẽ chuyển động.</h3><p>Chọn ảnh hoặc viết một ý tưởng để tạo đoạn phim lấy cảm hứng từ Cồn Chim.</p>
    <div className="cc-filter-tabs"><button className={mode==='image'?'is-active':''} aria-pressed={mode==='image'} onClick={()=>setMode('image')}><ImageIcon size={17}/>Từ hình ảnh</button><button className={mode==='text'?'is-active':''} aria-pressed={mode==='text'} onClick={()=>setMode('text')}><Film size={17}/>Từ ý tưởng</button></div>
    {mode==='image'&&<div className="cc-studio-image"><img src={image} alt="Ảnh được chọn để tạo chuyển động"/><div className="cc-studio-photo-options">{PHOTOS.slice(0,4).map(item=><button key={item.id} className={image===item.image?'is-active':''} aria-label={`Chọn ảnh ${item.title}`} aria-pressed={image===item.image} onClick={()=>setImage(item.image)}><img src={item.image} alt=""/></button>)}<button className="cc-icon-button" aria-label="Tải ảnh của bạn lên" onClick={()=>file.current?.click()}><Upload size={19}/></button><input ref={file} type="file" className="cc-sr-only" accept="image/jpeg,image/png,image/webp" onChange={upload}/></div></div>}
    <label className="cc-studio-prompt"><span>Bạn muốn thấy chuyển động gì?</span><textarea rows={3} value={prompt} onChange={event=>setPrompt(event.target.value)} maxLength={1200} placeholder="Mô tả cảnh và chuyển động mong muốn…"/></label>
    <div className="cc-studio-suggestions">{samples.map((item,i)=><button key={item} onClick={()=>setPrompt(item)}>Gợi ý {i+1}<ArrowRight size={13}/></button>)}</div>
    <div className="cc-studio-bottom"><div className="cc-filter-tabs" aria-label="Tỷ lệ video">{['16:9','9:16'].map(value=><button key={value} className={ratio===value?'is-active':''} aria-pressed={ratio===value} onClick={()=>setRatio(value)}>{value} {value==='16:9'?'Ngang':'Dọc'}</button>)}</div><button className="cc-button" disabled={busy||!prompt.trim()} onClick={generate}>{busy?<RefreshCw className="cc-spin" size={18}/>:<Film size={18}/>} {busy?'Đang tạo chuyển động…':'Tạo chuyển động'}</button></div>
    {busy&&<p role="status" className="cc-studio-status">{status}</p>}{error&&<p role="alert" className="cc-studio-error"><AlertCircle size={18}/>{error}</p>}
    {video&&<div className="cc-studio-result"><video src={video} controls playsInline className={ratio==='9:16'?'is-portrait':''}/><a href={video} download="con-chim.mp4" target="_blank" rel="noreferrer" className="cc-text-button"><Download size={18}/>Tải video</a></div>}
  </div></Modal>;
}
