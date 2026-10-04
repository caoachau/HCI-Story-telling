import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Heart, Maximize2 } from 'lucide-react';
import { PHOTOS, Photo } from '../data/conChimData';
import { Modal } from './Modal';
import { ImageSequence } from './ImageSequence';
import { MotionWords } from './MotionWords';
import { usePhotoSwipe } from '../utils/usePhotoSwipe';

const categories = ['Tất cả', 'Thiên nhiên', 'Ẩm thực', 'Cộng đồng'];
export function GallerySection() {
  const spotlight=useRef<HTMLButtonElement>(null),origin=useRef<DOMRect|null>(null);
  const [category, setCategory] = useState('Tất cả'), [index, setIndex] = useState(0), [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Photo | null>(null), [status, setStatus] = useState('');
  const [displayedId, setDisplayedId] = useState(PHOTOS[0].id), [direction, setDirection] = useState(1), [lightboxDirection, setLightboxDirection] = useState(1);
  const [lightboxPhotoId, setLightboxPhotoId] = useState(PHOTOS[0].id);
  const [liked, setLiked] = useState<string[]>(() => {
    try { const value = JSON.parse(localStorage.getItem('con-chim-favorite-photos') || '[]'); return Array.isArray(value) ? value.filter(id => PHOTOS.some(photo => photo.id === id)) : []; }
    catch { return []; }
  });
  const filtered = useMemo(() => PHOTOS.filter(photo => category === 'Tất cả' || photo.category === category), [category]);
  const photo = PHOTOS.find(item => item.id === displayedId) || filtered[0], pages = Math.ceil(filtered.length / 6);
  const displayedIndex = Math.max(0, filtered.findIndex(item => item.id === displayedId));
  const lightboxPhoto = PHOTOS.find(item => item.id === lightboxPhotoId)!;
  const lightboxPhotos = selected && filtered.some(item => item.id === selected.id) ? filtered : PHOTOS;
  const openPhoto = (item: Photo,source:HTMLElement|null=spotlight.current) => { origin.current=source?.getBoundingClientRect()??null;setLightboxPhotoId(item.id); setSelected(item); };
  const choose = (next: string) => { setDirection(1); setCategory(next); setIndex(0); setPage(0); };
  const next = (step: number) => { setDirection(step); setIndex(value => (value + step + filtered.length) % filtered.length); };
  const lightboxNext = (step: number) => {
    if (!selected) return;
    setLightboxDirection(step);
    setSelected(value => {
      if (!value) return value;
      const position = lightboxPhotos.findIndex(item => item.id === value.id);
      return lightboxPhotos[(position + step + lightboxPhotos.length) % lightboxPhotos.length];
    });
  };
  const swipe = usePhotoSwipe(next), lightboxSwipe = usePhotoSwipe(lightboxNext);
  useEffect(() => {
    if (!selected) return;
    const key = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof Element && event.target.closest('input,textarea,select'))) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); lightboxNext(event.key === 'ArrowRight' ? 1 : -1); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [selected, lightboxPhotos]);
  const favorite = () => {
    if (!selected) return;
    const updated = liked.includes(lightboxPhoto.id) ? liked.filter(id => id !== lightboxPhoto.id) : [...liked, lightboxPhoto.id];
    setLiked(updated);
    try { localStorage.setItem('con-chim-favorite-photos', JSON.stringify(updated)); setStatus(updated.includes(lightboxPhoto.id) ? 'Đã lưu ảnh yêu thích trên thiết bị.' : 'Đã bỏ yêu thích ảnh.'); }
    catch { setStatus('Ảnh yêu thích được giữ trong phiên này.'); }
  };
  return <section id="gallery" className="cc-gallery cc-section" aria-labelledby="cc-gallery-title">
    <div className="cc-container" data-screen-reader>
      <div className="cc-gallery-top" data-reveal>
        <div className="cc-section-heading"><h2 id="cc-gallery-title">Giữ lại một chút<br/><span>Cồn Chim.</span></h2><p>Những góc xanh, những cuộc gặp và một bữa cơm còn nhớ.</p></div>
        <div className="cc-filter-tabs" aria-label="Lọc ảnh">{categories.map(item => <button key={item} className={category === item ? 'is-active' : ''} aria-pressed={category === item} onClick={() => choose(item)}>{item}</button>)}</div>
      </div>
      <div className="cc-gallery-showcase" style={{ '--cc-photo-direction': direction } as React.CSSProperties}>
        <div className="cc-gallery-caption">
          <span className="cc-photo-counter">{String(displayedIndex + 1).padStart(2, '0')} <span>/ {String(filtered.length).padStart(2, '0')}</span></span>
          <div className="cc-gallery-photo-copy" key={photo.id}><h3><MotionWords>{photo.title}</MotionWords></h3><p>{photo.caption}</p><button className="cc-text-button" onClick={() => openPhoto(photo)}>Xem ảnh lớn <ArrowUpRight size={18}/></button></div>
          <div className="cc-gallery-arrows"><button className="cc-icon-button" aria-label="Ảnh trước" onClick={() => next(-1)}><ChevronLeft size={21}/></button><button className="cc-icon-button" aria-label="Ảnh tiếp theo" onClick={() => next(1)}><ChevronRight size={21}/></button></div>
        </div>
        <button ref={spotlight} className="cc-gallery-spotlight" data-depth-card data-scroll-depth="back" {...swipe} onClick={() => openPhoto(photo)} aria-label={`Phóng lớn: ${photo.title}`} aria-describedby="cc-gallery-swipe-hint"><ImageSequence photos={filtered} index={index} direction={direction} onDisplayed={setDisplayedId}/><span className="cc-image-expand"><Maximize2 size={22}/></span></button>
        <span id="cc-gallery-swipe-hint" className="cc-sr-only">Vuốt ngang hoặc dùng nút mũi tên để chuyển ảnh.</span>
        <div className="cc-gallery-pebbles">{[PHOTOS[0], PHOTOS[3], PHOTOS[4]].map(item => <button key={item.id} className={category === item.category ? 'is-active' : ''} onClick={() => choose(item.category)} aria-label={`Xem ảnh ${item.category}`}><img src={item.image} alt="" loading="lazy" style={{ objectPosition: item.position || 'center' }}/><span>{item.category}<ArrowRight size={16}/></span></button>)}</div>
      </div>
      <div className="cc-gallery-collection-head"><h3>Khoảnh khắc trên cồn <span>{filtered.length} ảnh</span></h3><div><button className="cc-icon-button" aria-label="Trang ảnh trước" disabled={page === 0} onClick={() => setPage(value => value - 1)}><ChevronLeft size={18}/></button><span>{page + 1} / {pages}</span><button className="cc-icon-button" aria-label="Trang ảnh tiếp theo" disabled={page === pages - 1} onClick={() => setPage(value => value + 1)}><ChevronRight size={18}/></button></div></div>
      <div className="cc-gallery-thumbnails" key={category + page}>{filtered.slice(page * 6, page * 6 + 6).map((item, i) => <button key={item.id} style={{ '--cc-thumb-index': i } as React.CSSProperties} onClick={event => openPhoto(item,event.currentTarget)} aria-label={`Xem ảnh: ${item.title}`}><img src={item.image} alt={item.title} loading="lazy" style={{ objectPosition: item.position || 'center' }}/>{liked.includes(item.id) && <Heart className="cc-thumb-heart" size={18} fill="currentColor"/>}</button>)}</div>
      <span role="status" className="cc-sr-only">{status}</span>
    </div>
    {selected && <Modal title={lightboxPhoto.title} onClose={() => setSelected(null)} wide className="cc-lightbox" origin={origin.current}>
      <div className="cc-lightbox-image" {...lightboxSwipe}><ImageSequence photos={lightboxPhotos} index={Math.max(0, lightboxPhotos.findIndex(item => item.id === selected.id))} direction={lightboxDirection} onDisplayed={setLightboxPhotoId} contain/><button className="cc-icon-button cc-lightbox-prev" aria-label="Ảnh lớn trước" onClick={() => lightboxNext(-1)}><ChevronLeft size={24}/></button><button className="cc-icon-button cc-lightbox-next" aria-label="Ảnh lớn tiếp theo" onClick={() => lightboxNext(1)}><ChevronRight size={24}/></button></div>
      <div className="cc-lightbox-copy"><div key={lightboxPhoto.id} className="cc-lightbox-photo-copy"><h3>{lightboxPhoto.title}</h3><p>{lightboxPhoto.caption}</p><a href={lightboxPhoto.source} target="_blank" rel="noreferrer" className="cc-photo-credit">Ảnh: {lightboxPhoto.credit} <ArrowUpRight size={13}/></a></div><button className={`cc-favorite-button ${liked.includes(lightboxPhoto.id) ? 'is-active' : ''}`} aria-pressed={liked.includes(lightboxPhoto.id)} onClick={favorite}><Heart size={19} fill={liked.includes(lightboxPhoto.id) ? 'currentColor' : 'none'}/>{liked.includes(lightboxPhoto.id) ? 'Đã yêu thích' : 'Yêu thích'}</button></div>
    </Modal>}
  </section>;
}
