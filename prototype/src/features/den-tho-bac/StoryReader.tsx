import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ExternalLink, Maximize2, Volume2, VolumeX, X } from 'lucide-react';
import { MAP_REFERENCE, PHOTO_PROVENANCE, REVIEWED, SOURCES, type Photo, type SourceKey, type Story } from './content';
import { Credit, Picture } from './MemorialMedia';
import { useReaderMotion, useReadingProgress } from './useReaderMotion';
import { PhotoFrame, usePhotoFrameAvailable } from './PhotoFrame';
import { readerChapters } from './reader-content';
import { useDecodedChapter, useReaderGallery } from './useReaderGallery';
import { ExhibitionRoom } from './ExhibitionRoom';
import { WAR_ARTIFACT_SOURCES } from './war-artifacts-content';
import { GROUNDS_SOURCES } from './grounds-content';
import { BOAT_SOURCES } from './boat-content';
import { REMAINING_SPACE_DETAILS } from './remaining-spaces-content';
import { narration, useNarrationState } from '../../experience/narration';
import { useScrollMemory } from '../../experience/useScrollMemory';
import { routeParams } from '../../experience/state';

function useVoice() {
  const voice = useNarrationState();
  const speaking = voice.status === 'playing' || voice.status === 'paused';
  const stop = narration.stop;
  const speak = (text: string) => {
    if (speaking) stop();
    else narration.play(text, 'vi-VN', `den-tho-bac:${text.slice(0, 70)}`);
  };
  useEffect(() => () => narration.stop(), []);
  return { speaking, message: voice.message, speak, stop };
}

const number = (index: number) => String(index + 1).padStart(2, '0');

export function StoryReader({ story, onClose, sourcesOnly = false }: { story?: Story; onClose: () => void; sourcesOnly?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null), progress = useRef<HTMLDivElement>(null), prose = useRef<HTMLElement>(null);
  const voice = useVoice();
  useScrollMemory(prose, `den-tho-bac:${story?.id || 'sources'}`, !routeParams().has('chapter'));
  const { close, reduced } = useReaderMotion(dialog, voice.stop);
  useReadingProgress(dialog, progress);
  const keys = story?.sources || Object.keys(SOURCES) as SourceKey[];
  const openSources = () => {
    const sources = dialog.current?.querySelector<HTMLDetailsElement>('#db-reader-sources');
    if (!sources || !prose.current) return;
    sources.open = true;
    requestAnimationFrame(() => {
      const pane = prose.current;
      if (!pane) return;
      pane.scrollTo({ top: pane.scrollTop + sources.getBoundingClientRect().top - pane.getBoundingClientRect().top - 16, behavior: reduced ? 'instant' : 'smooth' });
      sources.querySelector<HTMLElement>('summary')?.focus({ preventScroll: true });
    });
  };
  const exhibition = story?.id === 'map-exhibition';
  const artifacts = story?.id === 'map-artifacts';
  const grounds = story?.id === 'map-camping';
  const boat = story?.id === 'map-boat';
  const spaceDetail = story && REMAINING_SPACE_DETAILS[story.id];
  return <dialog ref={dialog} className={`db-reader db-reader--gallery ${sourcesOnly ? 'db-reader--sources' : ''} ${exhibition ? 'db-reader--exhibition' : ''} ${artifacts ? 'db-reader--artifacts' : ''} ${grounds ? 'db-reader--grounds' : ''} ${boat ? 'db-reader--boat' : ''} ${spaceDetail ? 'db-reader--space-researched' : ''}`} data-reader-story={story?.id} aria-labelledby="db-reader-title" onClose={onClose}
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
    <header className="db-reader-bar">
      <span className="db-reader-context">{sourcesOnly ? 'Tư liệu · Đối chiếu' : story?.eyebrow}</span>
      <div className="db-reader-heading"><p>{sourcesOnly ? 'Nguồn tư liệu' : exhibition ? '93 ảnh · 8 chủ đề' : artifacts ? '3 hiện vật · 3 câu chuyện' : grounds ? '5 ảnh · 5 góc nhìn' : boat ? '1 ảnh · 3 nội dung' : spaceDetail ? `${spaceDetail.chapters.length} ảnh · ${spaceDetail.chapters.length} góc nhìn` : 'Câu chuyện · Khám phá'}</p><h2 id="db-reader-title">{sourcesOnly ? 'Mỗi câu chuyện, một cơ sở để tìm hiểu.' : story?.title}</h2></div>
      <button type="button" className="db-round" aria-label="Đóng cửa sổ, quay lại nội dung" onClick={close} autoFocus><X /></button>
    </header>
    <div ref={progress} className="db-reader-progress" role="progressbar" aria-label="Tiến độ đọc" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} hidden><i /></div>
    {sourcesOnly ? <div className="db-source-page"><p className="db-eyebrow">Đọc cùng nguồn gốc</p><p>Nội dung được biên soạn ngắn cho màn hình tương tác. Chọn bài gốc để xem thêm bối cảnh, ngày ghi nhận và hình ảnh.</p><SourceList keys={keys} /><div className="db-map-reference"><p>{MAP_REFERENCE.note}</p><a href={MAP_REFERENCE.url} target="_blank" rel="noopener noreferrer">{MAP_REFERENCE.label}<ExternalLink /></a></div><div className="db-source-note"><BookOpen /><p>Ảnh hiện nay chỉ minh họa không gian di tích, không thay thế ảnh lịch sử. Các mốc trên màn hoạt động là dịp gợi nhắc; hãy hỏi nơi đón khách về lịch thực tế.</p></div><small>Đối chiếu nội dung: {REVIEWED} · Không có bản ghi giọng nói nhân chứng trong bản trải nghiệm này.</small></div>
      : exhibition ? <ExhibitionRoom prose={prose} /> : story && <ReaderStory story={story} prose={prose} reduced={reduced} />}
    <footer className="db-reader-footer">
      {sourcesOnly ? <span>Đối chiếu nội dung: {REVIEWED}</span> : <button type="button" className="db-text-button db-reader-sources" onClick={openSources}><BookOpen />Nguồn tư liệu<ExternalLink /></button>}
      <p className="db-voice-status" role="status">{voice.message}</p>
      <div className="db-reader-footer-actions">
        {story && !sourcesOnly && <button type="button" className="db-listen" aria-pressed={voice.speaking} onClick={() => voice.speak(story.title + '. ' + story.summary.join('. '))}>{voice.speaking ? <VolumeX /> : <Volume2 />}{voice.speaking ? 'Dừng nghe' : 'Nghe tóm tắt'}</button>}
        <button type="button" className="db-reader-close" onClick={close}>Đóng</button>
      </div>
    </footer>
  </dialog>;
}

function ReaderStory({ story, prose, reduced }: { story: Story; prose: React.RefObject<HTMLElement | null>; reduced: boolean }) {
  const chapters = useMemo(() => readerChapters(story), [story]);
  const spaceDetail = REMAINING_SPACE_DETAILS[story.id];
  const research = spaceDetail?.sources || (story.id === 'map-boat' ? BOAT_SOURCES : story.id === 'map-artifacts' ? WAR_ARTIFACT_SOURCES : story.id === 'map-camping' ? GROUNDS_SOURCES : undefined);
  const researchNote = spaceDetail?.sourceNote || (story.id === 'map-boat'
    ? 'Hình minh họa do người dùng cung cấp. Hai bài báo xác nhận tiểu cảnh tại đền; tài liệu bảo tàng giải thích loại thuyền độc mộc. Các nguồn này chưa xác định tác giả, năm chế tác, chất liệu, nhân vật phía sau hay chuyến đi cụ thể được tái hiện. Không có cơ sở để giới thiệu đây là chiếc thuyền nguyên gốc Bác từng sử dụng.'
    : story.id === 'map-camping' ? 'Bộ năm ảnh do người dùng cung cấp, giữ nguyên ảnh gốc. Nguồn bên dưới đối chiếu bối cảnh cảnh quan và lịch sử khu di tích; chú thích riêng từng ảnh được biên soạn theo những gì quan sát được.' : 'Ba ảnh được người dùng cung cấp, giữ nguyên dấu ảnh Tiền Phong. Thông tin riêng của hiện vật dẫn theo biển giới thiệu trong ảnh; tư liệu bên dưới bổ sung bối cảnh.');
  const singleImage = chapters.every(item => item.photo.src === chapters[0].photo.src);
  const { active, select } = useReaderGallery(prose, chapters, reduced, story.id);
  const { displayed, status, attempt, retry } = useDecodedChapter(chapters, singleImage ? 0 : active);
  const frameAvailable = usePhotoFrameAvailable(reduced);
  const chapter = chapters[displayed];
  const thumbnails = useRef<HTMLElement>(null);
  useEffect(() => {
    const list = thumbnails.current, selected = list?.querySelector<HTMLElement>('[aria-current=step]');
    if (!list || !selected) return;
    const item = selected.getBoundingClientRect(), box = list.getBoundingClientRect();
    if (item.top < box.top || item.bottom > box.bottom) list.scrollTo({ top: selected.offsetTop - list.offsetTop, behavior: 'instant' });
  }, [active]);
  return <div className="db-reader-layout" data-active-reader-chapter={active}>
    <article ref={prose} className="db-reader-prose" tabIndex={0} aria-label={singleImage ? 'Nội dung câu chuyện; cuộn để đọc, ảnh toàn cảnh giữ nguyên bên cạnh' : 'Nội dung câu chuyện; cuộn để xem ảnh tương ứng'}>
      {chapters.map((item, index) => <section key={item.id} id={`db-reader-chapter-${index}`} className="db-reader-chapter" data-reader-chapter={item.id} data-reader-chapter-index={index} data-active={active === index} aria-labelledby={`db-reader-chapter-title-${index}`}>
        <p className="db-reader-chapter-label"><span>{number(index)}</span><span aria-hidden="true">/</span>{item.label}</p>
        <h3 id={`db-reader-chapter-title-${index}`}>{item.title}</h3>
        {item.facts && <dl className="db-artifact-facts">{item.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}
        {item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className={paragraph === story.lead ? 'db-lead' : undefined}>{paragraph}</p>)}
        {item.look && <div className="db-artifact-observe"><h4>{item.lookLabel || 'Nhìn kỹ hiện vật'}</h4><ul>{item.look.map(line => <li key={line}>{line}</li>)}</ul></div>}
        {item.labelText && <details className="db-artifact-label"><summary>Đọc biển giới thiệu<Maximize2 aria-hidden="true" /></summary><p>{item.labelText}</p><a href={item.photo.src} target="_blank" rel="noopener noreferrer">Đối chiếu ảnh gốc<ExternalLink /></a></details>}
        {item.references && <div className="db-artifact-references" aria-label="Nguồn đối chiếu nội dung">{item.references.map(reference => <a key={reference.url} href={reference.url} target="_blank" rel="noopener noreferrer">{reference.name}<ExternalLink /></a>)}</div>}
      </section>)}
      <div className="db-reflect"><span>Một câu hỏi mang theo</span><p>{story.question}</p></div>
      <details className="db-read-more" id="db-reader-sources"><summary>Nguồn tư liệu & hình ảnh<ExternalLink /></summary><SourceList keys={story.sources} />{research && <div className={`db-source-list db-reader-research-sources ${spaceDetail ? 'db-spaces-source-list' : story.id === 'map-boat' ? 'db-boat-source-list' : story.id === 'map-artifacts' ? 'db-artifact-source-list' : 'db-grounds-source-list'}`}><p>{researchNote}</p>{research.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.name}<small>{source.date}</small></span><strong>{source.title}</strong><p>{source.note}</p><ExternalLink /></a>)}</div>}{story.reference && <p className="db-map-reference">{story.reference.note}<br /><a href={story.reference.url} target="_blank" rel="noopener noreferrer">{story.reference.label}<ExternalLink /></a></p>}<p>Đối chiếu: {research ? '27/10/2026' : REVIEWED}.</p></details>
    </article>
    <aside className={`db-reader-media ${singleImage ? 'db-reader-media--single' : ''}`} aria-label={singleImage ? 'Ảnh toàn cảnh tiểu cảnh và mục lục nội dung' : 'Ảnh theo nội dung đang đọc'} aria-busy={status === 'loading'} data-image-state={status} data-displayed-chapter={displayed}>
      <div className="db-reader-gallery-stage">
        <ReaderPhoto key={`${chapter.id}-${attempt}`} photo={chapter.photo} index={displayed} count={singleImage ? 1 : chapters.length} frameAvailable={frameAvailable} decoded={status==='ready'||(!singleImage&&displayed!==active)} />
        {status === 'error' && <div className="db-reader-gallery-error" role="status">{singleImage ? 'Chưa mở được ảnh toàn cảnh.' : `Chưa mở được ảnh mục ${number(active)}.`}<button type="button" onClick={retry}>Thử lại</button></div>}
        {!singleImage && <div className="db-reader-gallery-track" aria-hidden="true">{chapters.map((item, index) => <i key={item.id} data-active={index === displayed} />)}</div>}
      </div>
      <nav ref={thumbnails} className={singleImage ? 'db-reader-topics' : 'db-reader-thumbnails'} aria-label={singleImage ? 'Mục lục nội dung thuyền độc mộc' : 'Chọn ảnh và mục nội dung'} onKeyDown={event => {
        if (!(singleImage ? ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'] : ['ArrowUp', 'ArrowDown', 'Home', 'End']).includes(event.key)) return;
        event.preventDefault();
        const current = Number((event.target as HTMLElement).closest<HTMLElement>('[data-reader-thumbnail]')?.dataset.readerThumbnail || active);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? chapters.length - 1 : Math.max(0, Math.min(chapters.length - 1, current + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1)));
        event.currentTarget.querySelector<HTMLElement>(`[data-reader-thumbnail="${next}"]`)?.focus({ preventScroll: true }); select(next);
      }}>
        {chapters.map((item, index) => <button key={item.id} type="button" data-reader-thumbnail={index} aria-current={active === index ? 'step' : undefined} aria-controls={`db-reader-chapter-${index}`} aria-label={`${singleImage ? 'Mục' : 'Ảnh'} ${number(index)} — ${item.label}`} onClick={() => select(index)}><span>{number(index)}</span>{singleImage ? <strong>{item.label}</strong> : <img key={`${item.id}-${attempt}`} src={item.photo.src} alt="" loading="eager" decoding="async" onError={event => { event.currentTarget.style.visibility = 'hidden'; }} />}</button>)}
      </nav>
    </aside>
  </div>;
}

function ReaderPhoto({ photo, index, count, frameAvailable, decoded }: { photo: Photo; index: number; count: number; frameAvailable: boolean; decoded: boolean }) {
  const [zoom, setZoom] = useState(false), [depth, setDepth] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  return <figure className="db-reader-gallery-photo">
    <div ref={shell} className="db-reader-photo-shell">
      <div className={`db-reader-photo ${zoom ? 'is-zoomed' : ''}`} data-photo-size={photo.displayWidth ? 'reference' : undefined} style={photo.displayWidth ? { '--reader-photo-max-width': `${photo.displayWidth}px` } as React.CSSProperties : undefined}><Picture photo={photo} eager decoded={decoded} />{depth && frameAvailable && !zoom && <PhotoFrame onUnavailable={() => setDepth(false)} />}</div>
      {photo.marker && !zoom && <ReaderMapMarker marker={photo.marker} shell={shell} />}
      {count > 1 && <span className="db-reader-photo-counter" aria-label={`Ảnh ${index + 1} trên ${count}`}>{number(index)} / {String(count).padStart(2, '0')}</span>}
      <button type="button" className="db-reader-photo-expand" aria-label={zoom ? 'Thu ảnh về khung' : 'Phóng ảnh để quan sát'} aria-pressed={zoom} onClick={() => { setZoom(!zoom); setDepth(false); }}><Maximize2 /></button>
    </div>
    <figcaption>{photo.caption}<Credit photo={photo} /></figcaption>
    {frameAvailable && !zoom && !photo.marker && <button type="button" className="db-text-button db-photo-mode" aria-pressed={depth} onClick={() => setDepth(!depth)}>{depth ? 'Xem ảnh phẳng' : 'Xem trong khung trưng bày'}</button>}
    {frameAvailable && !zoom && photo.marker && <span className="db-photo-mode" aria-hidden="true" />}
  </figure>;
}

function ReaderMapMarker({ marker, shell }: { marker: NonNullable<Photo['marker']>; shell: React.RefObject<HTMLDivElement | null> }) {
  const [position, setPosition] = useState<React.CSSProperties>();
  useEffect(() => {
    const box = shell.current;
    if (!box) return;
    const measure = () => {
      const scale = Math.min(box.clientWidth / marker.imageWidth, box.clientHeight / marker.imageHeight);
      const width = marker.imageWidth * scale, height = marker.imageHeight * scale;
      setPosition({ left: (box.clientWidth - width) / 2 + width * marker.x / 100, top: (box.clientHeight - height) / 2 + height * marker.y / 100 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(box); measure();
    return () => observer.disconnect();
  }, [marker, shell]);
  return position && <span className="db-reader-map-marker" style={position} role="img" aria-label={`Vị trí ${marker.code} – ${marker.label}`} data-reader-map-marker={marker.code}>{marker.code}</span>;
}

function SourceList({ keys }: { keys: SourceKey[] }) {
  return <div className="db-source-list">{keys.length === Object.keys(SOURCES).length && <p className="db-history-source-note">{PHOTO_PROVENANCE}</p>}{keys.map(key => { const source = SOURCES[key]; return <a key={key} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.name}<small>{source.date}</small></span><strong>{source.title}</strong><p>{source.note}</p><ExternalLink /></a>; })}</div>;
}
