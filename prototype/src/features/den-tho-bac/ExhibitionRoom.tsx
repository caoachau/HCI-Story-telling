import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Grid2X2, Minus, Plus, RotateCcw } from 'lucide-react';
import { EXHIBITION_PHOTOS, EXHIBITION_STOPS, EXHIBITION_TOUR, exhibitionPhoto, type ExhibitionPhoto } from './exhibition-content';
import { useReaderGallery } from './useReaderGallery';
import { MAP_REFERENCE } from './content';
import { routeParams, updateRoute } from '../../experience/state';

const chapters = EXHIBITION_STOPS.map(stop => ({ ...stop, paragraphs: [stop.lead, stop.detail], photo: exhibitionPhoto(stop.photos[0]) }));
const number = (value: number) => String(value).padStart(2, '0');
const tourNumbers = new Map(EXHIBITION_TOUR.map((item, index) => [item.number, index + 1]));
type Selection = { stop: number; photo: number };

function useExhibitionPhoto(requested: ExhibitionPhoto) {
  const [displayed, setDisplayed] = useState(requested), [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    const image = new Image();
    setStatus('loading');
    image.onload = async () => {
      try { await image.decode(); } catch { /* A successful load remains usable. */ }
      if (current) { setDisplayed(requested); setStatus('ready'); }
    };
    image.onerror = () => { if (current) setStatus('error'); };
    image.src = requested.src;
    return () => { current = false; image.onload = null; image.onerror = null; };
  }, [requested, attempt]);
  return { displayed, status, retry: () => setAttempt(value => value + 1) };
}

export function ExhibitionRoom({ prose }: { prose: React.RefObject<HTMLElement | null> }) {
  // Explicit selections jump to their section immediately. Native reading
  // scrolls continuously; a new section replaces the image only at its boundary.
  const [first] = useState<Selection>(() => {
    const number = Number(routeParams().get('photo'));
    const stop = EXHIBITION_STOPS.findIndex(item => item.photos.includes(number));
    return stop >= 0 ? { stop, photo: EXHIBITION_STOPS[stop].photos.indexOf(number) } : { stop: 0, photo: 0 };
  });
  const { active, select } = useReaderGallery(prose, chapters, true, 'map-exhibition', first.stop);
  const [selection, setSelection] = useState<Selection>(first);
  const [allPhotos, setAllPhotos] = useState(false), [zoom, setZoom] = useState(1);
  const requested = exhibitionPhoto(EXHIBITION_STOPS[selection.stop].photos[selection.photo]);
  useEffect(() => { updateRoute({ photo: requested.number }, 'den-tho-bac'); }, [requested.number]);
  const { displayed, status, retry } = useExhibitionPhoto(requested);
  const displayedIndex = EXHIBITION_TOUR.findIndex(item => item.number === displayed.number);
  const selectedIndex = EXHIBITION_TOUR.findIndex(item => item.number === requested.number);
  const stop = EXHIBITION_STOPS[selection.stop];
  const stage = useRef<HTMLDivElement>(null), filmstrip = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);

  useEffect(() => { setSelection(old => old.stop === active ? old : { stop: active, photo: 0 }); }, [active]);
  useEffect(() => { setZoom(1); stage.current?.scrollTo({ top: 0, left: 0 }); }, [requested]);
  useEffect(() => {
    const next = EXHIBITION_TOUR[displayedIndex + 1];
    if (next) { const image = new Image(); image.src = exhibitionPhoto(next.number).src; }
  }, [displayedIndex]);
  useEffect(() => {
    const list = filmstrip.current, selected = list?.querySelector<HTMLElement>('[aria-pressed=true]');
    if (list && selected) list.scrollTo({ left: Math.max(0, selected.offsetLeft - list.offsetLeft - list.clientWidth / 2 + selected.clientWidth / 2), behavior: 'instant' });
  }, [selection, allPhotos]);

  const choose = (stopIndex: number, photoIndex = 0) => {
    setSelection({ stop: stopIndex, photo: photoIndex });
    select(stopIndex);
    setAllPhotos(false);
  };
  const move = (delta: number) => {
    const next = EXHIBITION_TOUR[selectedIndex + delta];
    if (next) choose(next.stop, next.photo);
  };
  const endDrag = () => { drag.current = null; };

  return <div className="db-exhibition-layout" data-exhibition-stop={selection.stop} data-exhibition-selected={requested.number}>
    <article ref={prose} className="db-reader-prose db-exhibition-prose" tabIndex={0} aria-label="Hành trình khám phá nhà trưng bày; cuộn để chuyển chủ đề">
      <div className="db-exhibition-intro">
        <p className="db-exhibition-kicker">Nhà trưng bày · Đền thờ Bác Hồ</p>
        <h3>Một không gian.<br /><em>Nhiều điều để nhớ.</em></h3>
        <p>Đi từ góc nhìn bao quát đến từng bức ảnh, trang tư liệu và hiện vật. Chọn một chủ đề hoặc cuộn xuống để tiếp tục hành trình.</p>
        <div className="db-exhibition-facts"><span><strong>93</strong> ảnh thực tế</span><span><strong>08</strong> chủ đề khám phá</span></div>
        <nav className="db-exhibition-route" aria-label="Tám chủ đề trong nhà trưng bày">
          {EXHIBITION_STOPS.map((item, index) => <button key={item.id} type="button" aria-current={selection.stop === index ? 'step' : undefined} data-exhibition-route={index} onClick={() => choose(index)}><span>{number(index + 1)}</span>{item.label}<ArrowRight aria-hidden="true" /></button>)}
        </nav>
      </div>
      {EXHIBITION_STOPS.map((item, index) => <section key={item.id} className="db-reader-chapter db-exhibition-chapter" data-reader-chapter={item.id} data-reader-chapter-index={index} data-active={selection.stop === index} aria-labelledby={`db-exhibition-stop-${index}`}>
        <p className="db-reader-chapter-label"><span>{number(index + 1)}</span><span aria-hidden="true">/</span>{item.label}</p>
        <h3 id={`db-exhibition-stop-${index}`}>{item.title}</h3>
        <p className="db-exhibition-setting">{item.setting}</p>
        <p>{item.lead}</p><p>{item.detail}</p>
        <div className="db-exhibition-observe"><h4>Nhìn kỹ một chút</h4><ul>{item.look.map(line => <li key={line}>{line}</li>)}</ul></div>
        <div className="db-exhibition-photo-heading"><h4>Các góc nhìn trong chủ đề</h4><span>{item.photos.length} ảnh</span></div>
        <div className="db-exhibition-contact-sheet" role="group" aria-label={`Ảnh chủ đề ${item.label}`}>
          {item.photos.map((id, photoIndex) => <PhotoThumbnail key={id} photo={exhibitionPhoto(id)} selected={requested.number === id} onClick={() => choose(index, photoIndex)} />)}
        </div>
      </section>)}
      <div className="db-exhibition-outro"><h3>Bạn muốn nhìn lại điều gì?</h3><p>Một chi tiết trong mô hình, một gương mặt, hay một hiện vật nhỏ? Quay lại chủ đề bạn quan tâm và dành thêm một chút thời gian cho câu chuyện ấy.</p><button type="button" onClick={() => { setAllPhotos(true); }}><Grid2X2 aria-hidden="true" />Xem toàn bộ 93 ảnh</button></div>
      <details className="db-read-more" id="db-reader-sources"><summary>Nguồn bộ ảnh & cách sắp xếp</summary><p>Toàn bộ 93 ảnh do người thực hiện chụp tại nhà trưng bày và cung cấp cho trang giới thiệu. Các ảnh được giữ nguyên, gồm cả những góc rộng và cận cảnh của cùng một mảng trưng bày.</p><p>Tám chủ đề là lộ trình biên tập theo những gì nhìn thấy trong bộ ảnh. Hãy đọc nhãn thuyết minh hiện có trong ảnh để tìm hiểu tên gọi và bối cảnh của từng tư liệu, hiện vật.</p><p><a href={MAP_REFERENCE.url} target="_blank" rel="noopener noreferrer">Xem vị trí nhà trưng bày trên sơ đồ khu di tích</a></p></details>
    </article>

    <aside className="db-exhibition-media" aria-label="Ảnh nhà trưng bày" aria-busy={status === 'loading'} data-exhibition-displayed={displayed.number} data-image-state={status}>
      <div className="db-exhibition-media-bar"><div><span>Góc nhìn {number(selection.stop + 1)}</span><strong>{stop.label}</strong></div><button type="button" className="db-exhibition-all" aria-pressed={allPhotos} onClick={() => setAllPhotos(value => !value)}><Grid2X2 aria-hidden="true" /><span>{allPhotos ? 'Về ảnh đang xem' : 'Toàn bộ 93 ảnh'}</span></button></div>
      {allPhotos ? <div className="db-exhibition-all-photos" tabIndex={0} aria-label="Toàn bộ 93 ảnh theo tám chủ đề">
        {EXHIBITION_STOPS.map((item, index) => <section key={item.id}><h3><span>{number(index + 1)}</span>{item.label}<small>{item.photos.length} ảnh</small></h3><div className="db-exhibition-contact-sheet">{item.photos.map((id, photoIndex) => <PhotoThumbnail key={id} photo={exhibitionPhoto(id)} selected={requested.number === id} onClick={() => choose(index, photoIndex)} />)}</div></section>)}
      </div> : <>
        <figure className="db-exhibition-figure">
          <div ref={stage} className="db-exhibition-photo-stage" tabIndex={0} role="group" aria-label={zoom > 1 ? 'Ảnh đã phóng; kéo hoặc cuộn để quan sát' : 'Ảnh trọn khung; dùng phím trái, phải để đổi ảnh'} data-zoom={zoom}
            onKeyDown={event => { if (zoom === 1 && event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
            onDoubleClick={() => setZoom(value => value === 1 ? 2 : 1)}
            onPointerDown={event => { if (zoom <= 1 || event.pointerType !== 'mouse') return; const element = event.currentTarget; drag.current = { x: event.clientX, y: event.clientY, left: element.scrollLeft, top: element.scrollTop }; element.setPointerCapture(event.pointerId); }}
            onPointerMove={event => { const start = drag.current; if (start) { event.currentTarget.scrollLeft = start.left + start.x - event.clientX; event.currentTarget.scrollTop = start.top + start.y - event.clientY; } }} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}>
            <div className="db-exhibition-photo-plane" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><img src={displayed.src} alt={displayed.alt} width={displayed.width} height={displayed.height} draggable={false} decoding="async" /></div>
          </div>
          <div className="db-exhibition-zoom" role="group" aria-label="Phóng ảnh để đọc tư liệu"><button type="button" aria-label="Thu nhỏ ảnh" disabled={zoom === 1} onClick={() => setZoom(value => Math.max(1, value - .5))}><Minus /></button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button type="button" aria-label="Phóng lớn ảnh" disabled={zoom === 3} onClick={() => setZoom(value => Math.min(3, value + .5))}><Plus /></button><button type="button" aria-label="Xem trọn ảnh" disabled={zoom === 1} onClick={() => { setZoom(1); stage.current?.scrollTo({ top: 0, left: 0 }); }}><RotateCcw /></button></div>
          {status === 'error' && <div className="db-exhibition-error" role="status"><p>Chưa mở được ảnh đã chọn.</p><button type="button" onClick={retry}>Thử lại</button></div>}
          <figcaption aria-live="polite">{displayed.caption}</figcaption>
        </figure>
        <div className="db-exhibition-pagination"><button type="button" aria-label="Ảnh trước trong hành trình" disabled={selectedIndex === 0} onClick={() => move(-1)}><ArrowLeft /><span>Ảnh trước</span></button><span aria-live="polite"><strong>{number(displayedIndex + 1)}</strong> / {EXHIBITION_PHOTOS.length}<small>Ảnh thực tế tại nhà trưng bày</small></span><button type="button" aria-label="Ảnh tiếp theo trong hành trình" disabled={selectedIndex === EXHIBITION_TOUR.length - 1} onClick={() => move(1)}><span>Ảnh tiếp</span><ArrowRight /></button></div>
        <nav ref={filmstrip} className="db-exhibition-filmstrip" aria-label={`Các ảnh của chủ đề ${stop.label}`} onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? stop.photos.length - 1 : Math.max(0, Math.min(stop.photos.length - 1, selection.photo + (event.key === 'ArrowRight' ? 1 : -1)));
          filmstrip.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus({ preventScroll: true }); choose(selection.stop, next);
        }}>{stop.photos.map((id, index) => <PhotoThumbnail key={id} photo={exhibitionPhoto(id)} selected={requested.number === id} onClick={() => choose(selection.stop, index)} />)}</nav>
      </>}
    </aside>
  </div>;
}

function PhotoThumbnail({ photo, selected, onClick }: { photo: ExhibitionPhoto; selected: boolean; onClick: () => void }) {
  return <button type="button" className="db-exhibition-thumb" data-exhibition-photo={photo.number} aria-label={`Ảnh ${tourNumbers.get(photo.number)}: ${photo.caption}`} title={photo.caption} aria-pressed={selected} onClick={onClick}><img src={photo.src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" /><span>{number(tourNumbers.get(photo.number)!)}</span></button>;
}
