import { ListenButton } from "./ListenButton";
import { Headphones, Play } from 'lucide-react';
import { AudioPlayer, AudioPlaylist } from './AudioPlayer';
import { audioTrack, contentPlaylist } from './catalog';
import { audioPlayer, useAudioPlayer } from './player';
import { useAudioContent } from './useAudioContent';
import { ShareContent } from '../experience/ShareContent';
import type { SiteId } from '../experience/state';
import type { AudioLanguage } from './types';
import './audio.css';

export function AudioPanel({ siteId, lang }: { siteId: SiteId; lang: AudioLanguage }) {
  const { catalog, content, error, retry } = useAudioContent(siteId, lang);
  const state = useAudioPlayer();
  const vi = lang === 'vi';
  if (!catalog || !content) return <p role="status">{error ? <>{vi ? 'Chưa tải được nội dung. ' : 'Content unavailable. '}<button onClick={retry}>{vi ? 'Thử lại' : 'Retry'}</button></> : vi ? 'Đang tải danh sách nghe…' : 'Loading audio content…'}</p>;
  const playlist = contentPlaylist(catalog, content, lang);
  const track = audioTrack(content, lang);
  const group = content.children.length > 0;
  const parent = catalog.items.find(item => item.id === content.parentId);
  const parentPlaylist = parent ? contentPlaylist(catalog, parent, lang) : [];
  return <section className="ha-panel">
    <p className="ha-eyebrow">{vi ? 'NGHE VÀ KHÁM PHÁ' : 'LISTEN AND EXPLORE'}</p>
    <h3>{content.title}</h3><p>{content.description}</p>
    <div className="ha-actions">{(group ? playlist.length > 0 : track) && <ListenButton className="ha-primary" tracks={group ? playlist : track ? [track] : []} mode={group ? "playlist" : "single"} lang={lang} label={group ? vi ? "Nghe to?n b?" : "Listen to all" : vi ? "Nghe n?i dung" : "Listen"} />}{!group && parent && parentPlaylist.length > 1 && <button type="button" data-audio-action="listen-group" onClick={() => audioPlayer.playPlaylist(parentPlaylist)}>{vi ? 'Nghe toàn bộ' : 'Listen to all'} · {parent.title}</button>}</div>
    {!playlist.length && <p>{vi ? 'Nội dung thuyết minh đang được cập nhật. Bạn vẫn có thể đọc và quét QR.' : 'Narration is being prepared. Reading and QR sharing remain available.'}</p>}
    {state.tracks.length > 0 && <AudioPlayer lang={lang} onClose={() => audioPlayer.stop()} />}
    {group && playlist.length > 0 && <><h4>{vi ? 'Danh sách phát' : 'Playlist'}</h4><AudioPlaylist tracks={playlist} lang={lang} /></>}
    <details className="ha-panel-qr"><summary>{vi ? 'Mã QR · Tiếp tục nghe trên điện thoại' : 'QR code · Continue on your phone'}</summary><ShareContent siteId={siteId} lang={lang} /></details>
  </section>;
}
