import React, { useState } from 'react';
import { ImageOff, RefreshCw } from 'lucide-react';
import type { Photo } from '../data/conChimData';

export function DiscoveryImage({ photo, eager = false, retry = true, className = '' }: { photo: Photo; eager?: boolean; retry?: boolean; className?: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  return <div className={`cck-image ${className}`} data-image-state={state} aria-busy={state === 'loading'}>
    {state === 'loading' && <span className="cck-image-status" role="status">Đang tải ảnh…</span>}
    {state === 'error' ? <div className="cck-image-status" role="status"><ImageOff size={30}/><span>Chưa tải được ảnh. Bạn vẫn có thể đọc câu chuyện.</span>{retry && <button type="button" className="cck-outline" onClick={() => { setState('loading'); setAttempt(value => value + 1); }}><RefreshCw size={18}/>Thử tải lại ảnh</button>}</div> :
      <img key={attempt} src={eager ? photo.image : photo.thumbnail || photo.image} alt={photo.title} width={1000} height={750} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" style={{ objectPosition: photo.position || 'center' }} onLoad={() => setState('ready')} onError={() => setState('error')}/>
    }
  </div>;
}
