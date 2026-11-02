import { useEffect, useRef, useState } from 'react';
import { approvedMedia } from './content';
import type { SiteId } from './state';
import { routeParams, stopOtherAudio, updateRoute } from './state';
import { narration } from './narration';

export function MediaReader({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const media = approvedMedia(siteId);
  const [selected, setSelected] = useState(() => routeParams().get('media') || '');
  const item = media.find(value => value.id === selected) || media[0];
  const player = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0), [captionFailed, setCaptionFailed] = useState(false);
  useEffect(() => { const stop = () => player.current?.pause(); document.addEventListener('visibilitychange', stop); window.addEventListener('heritage:stop-audio', stop); return () => { stop(); document.removeEventListener('visibilitychange', stop); window.removeEventListener('heritage:stop-audio', stop); }; }, []);
  useEffect(() => { setFailed(false); setCaptionFailed(false); if (item) updateRoute({ media: item.id }, siteId); return () => { player.current?.pause(); }; }, [siteId, item?.id, lang]);
  if (!media.length) return <p className="hx-notice">{lang === 'vi' ? 'Chưa có bản ghi hình/giọng kể được xác nhận quyền dùng tại mục này. Bản đọc và nguồn tư liệu vẫn sẵn có.' : 'No recording with confirmed usage permission is available here yet. Written interpretation and references remain available.'}</p>;
  return <section>{media.length > 1 && <label>{lang === 'vi' ? 'Chọn bản ghi' : 'Choose a recording'}<select value={item.id} onChange={event => { player.current?.pause(); setSelected(event.target.value); }}>{media.map(value => <option key={value.id} value={value.id}>{value.title[lang]}</option>)}</select></label>}<h3>{item.title[lang]}</h3>{!failed ? <video key={`${item.id}:${lang}:${attempt}`} ref={player} controls preload="metadata" onPlay={() => { narration.stop(); stopOtherAudio(); }} onError={() => setFailed(true)} crossOrigin="anonymous"><source src={item.url} /><track default kind="captions" srcLang={lang} src={item.captions[lang]} label={lang === 'vi' ? 'Tiếng Việt' : 'English'} onError={() => setCaptionFailed(true)} /></video> : <div role="status"><p>{lang === 'vi' ? 'Chưa tải được video. Bạn có thể đọc bản chữ.' : 'The video could not load. You can read the transcript.'}</p><button onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>{lang === 'vi' ? 'Tải lại' : 'Retry'}</button></div>}{captionFailed && <p role="status">{lang === 'vi' ? 'Chưa tải được phụ đề. Bản chữ đầy đủ ở bên dưới.' : 'Captions could not load. The full transcript is below.'}</p>}<details open={failed || captionFailed}><summary>{lang === 'vi' ? 'Bản chữ / Phụ đề' : 'Transcript / Captions'}</summary><p>{item.transcript[lang]}</p></details><p>{item.narrator} · {item.recordedAt}</p><p><a href={item.source.url} target="_blank" rel="noopener noreferrer">{item.source.label}</a> · {item.reviewer} · {item.reviewedAt}</p></section>;
}

