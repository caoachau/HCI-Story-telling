import React, { useState } from 'react';
import { ExternalLink, ImageOff, RotateCcw } from 'lucide-react';
import { SOURCES, type Photo } from './content';

export function Picture({photo,eager=false,className='',width=1200,height=806,decoded=false}:{photo:Pick<Photo,'src'|'alt'|'position'>;eager?:boolean;className?:string;width?:number;height?:number;decoded?:boolean}){
  const [state,setState]=useState<'loading'|'ready'|'error'>(decoded?'ready':'loading');const[retry,setRetry]=useState(0);
  return <div className={`db-picture ${className}`} data-image-state={state} aria-busy={state==='loading'}>
    {state==='error'?<div className="db-image-status"><ImageOff/><p>Chưa tải được ảnh.</p><button type="button" onClick={()=>{setState('loading');setRetry(n=>n+1);}}><RotateCcw/>Thử lại</button></div>:<img key={retry} src={photo.src} alt={photo.alt} width={width} height={height} loading={eager?'eager':'lazy'} decoding="async" fetchPriority={eager?'high':'auto'} style={{objectPosition:photo.position||'center'}} onLoad={async event=>{const image=event.currentTarget;try{await image.decode();}catch{/* A completed load can still be displayed. */}if(image.isConnected)setState('ready');}} onError={()=>setState('error')}/>}
    {state==='loading'&&<span className="db-image-status" role="status">Đang tải ảnh…</span>}
  </div>;
}
export function Credit({photo}:{photo:Photo}){const url=photo.creditUrl||(photo.source?SOURCES[photo.source].url:undefined);return url?<a className="db-credit" href={url} target="_blank" rel="noopener noreferrer">Ảnh: {photo.credit}<ExternalLink/></a>:<span className="db-credit">Ảnh: {photo.credit}</span>;}
