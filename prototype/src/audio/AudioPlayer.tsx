import { Headphones, Pause, Play, Square, RotateCcw, RotateCw, SkipBack, SkipForward, X } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import './audio-transport.css';
import { audioPlayer, formatAudioTime, useAudioPlayer } from './player';
import type { AudioLanguage, AudioTrack } from './types';

export function AudioPlayer({ lang, compact = false, inline = false, onClose }: { lang: AudioLanguage; compact?: boolean; inline?: boolean; onClose?: () => void }) {
  const state = useAudioPlayer();
  const track = state.tracks[state.index];
  const vi = lang === 'vi';
  if (!track) return null;
  const active = ['playing', 'buffering', 'loading'].includes(state.status);
  const status = state.status === 'loading' ? (vi ? 'Đang tải audio…' : 'Loading audio…') : state.status === 'buffering' ? (vi ? 'Đang đệm dữ liệu…' : 'Buffering…') : state.status === 'ended' ? (vi ? state.mode === 'playlist' ? 'Đã nghe hết danh sách' : 'Đã nghe xong' : state.mode === 'playlist' ? 'Playlist complete' : 'Finished') : state.blocked ? (vi ? 'Bấm phát để tiếp tục nghe' : 'Press play to continue') : '';
  return <section className={`ha-player${compact ? ' ha-player--mini' : ''}`} data-inline-player={inline} data-audio-status={state.status} aria-label={vi ? 'Trình phát audio' : 'Audio player'}>
    <div className="ha-player-heading"><Headphones aria-hidden="true" /><div><strong>{track.title}</strong><span>{state.mode === 'playlist' ? `${vi ? 'Danh sách phát' : 'Playlist'} · ${state.index + 1} / ${state.tracks.length}` : vi ? 'Nghe riêng nội dung' : 'Single track'}</span></div>{onClose && <button type="button" className="ha-player-close" onClick={onClose} aria-label={vi ? 'Dừng và đóng trình phát' : 'Stop and close player'} title={vi ? 'Đóng trình phát' : 'Close player'}><X /></button>}</div>
    <div className="ha-player-transport">
    <div className="ha-controls">
      {state.mode === 'playlist' && <button type="button" data-audio-action="previous" disabled={state.index === 0} onClick={() => audioPlayer.previous()} aria-label={vi ? 'Bài trước' : 'Previous track'}><SkipBack /></button>}
      <button type="button" data-audio-action="backward" disabled={!state.duration} onClick={() => audioPlayer.skip(-10)} aria-label={vi ? 'Tua lùi 10 giây' : 'Back 10 seconds'}><RotateCcw /><small>10</small></button>
      {!inline && <button type="button" className="ha-play" data-audio-action="toggle" onClick={() => audioPlayer.toggle()} aria-label={active ? (vi ? 'Tạm dừng audio' : 'Pause audio') : state.status === 'ended' ? (vi ? 'Đã dừng · Bấm nghe lại' : 'Stopped · Play again') : (vi ? 'Phát audio' : 'Play audio')}>{active ? <Pause /> : state.status === 'ended' ? <Square /> : <Play />}</button>}
      {!inline && <button type="button" data-audio-action="stop" onClick={() => audioPlayer.halt()} aria-label={vi ? 'Dừng audio' : 'Stop audio'}><Square /></button>}
      <button type="button" data-audio-action="forward" disabled={!state.duration} onClick={() => audioPlayer.skip(10)} aria-label={vi ? 'Tua tới 10 giây' : 'Forward 10 seconds'}><RotateCw /><small>10</small></button>
      {state.mode === 'playlist' && <button type="button" data-audio-action="next" disabled={state.index >= state.tracks.length - 1} onClick={() => audioPlayer.next()} aria-label={vi ? 'Bài tiếp theo' : 'Next track'}><SkipForward /></button>}
      <label className="ha-rate"><span>{vi ? 'Tốc độ' : 'Speed'}</span><select aria-label={vi ? 'Tốc độ phát audio' : 'Playback speed'} value={state.rate} onChange={event => audioPlayer.setRate(Number(event.target.value))}>{[.75, 1, 1.25, 1.5, 2].map(rate => <option key={rate} value={rate}>{rate}×</option>)}</select></label>
    </div>
    <div className="ha-progress"><div className="ha-seek-surface"><AudioWaveform src={track.audioUrl} progress={state.duration ? state.currentTime / state.duration : 0} /><input type="range" aria-label={vi ? 'Tiến độ audio' : 'Audio progress'} min="0" max={state.duration || 0} step="0.1" disabled={!state.duration || state.status === 'error'} value={Math.min(state.currentTime, state.duration || 0)} onChange={event => audioPlayer.seek(Number(event.target.value))} /></div><div className="ha-time"><time>{formatAudioTime(state.currentTime)}</time><time>{formatAudioTime(state.duration)}</time></div></div>
    </div>
    <p className="ha-status" role="status">{state.status === 'error' ? (vi ? 'Không thể tải audio. Kiểm tra kết nối rồi thử lại.' : 'Audio could not load. Check your connection and retry.') : status}</p>
    {state.status === 'error' && <div className="ha-actions"><button type="button" onClick={() => audioPlayer.retry()}>{vi ? 'Thử lại' : 'Retry'}</button>{state.mode === 'playlist' && state.index < state.tracks.length - 1 && <button type="button" onClick={() => audioPlayer.next()}>{vi ? 'Bỏ qua bài này' : 'Skip this track'}</button>}</div>}
  </section>;
}

export function AudioPlaylist({ tracks, lang }: { tracks: AudioTrack[]; lang: AudioLanguage }) {
  const state = useAudioPlayer();
  return <ol className="ha-playlist" aria-label={lang === 'vi' ? 'Danh sách phát' : 'Playlist'}>{tracks.map((track, index) => <li key={track.id}><button type="button" onClick={() => audioPlayer.playPlaylist(tracks, index)} aria-current={state.tracks[state.index]?.id === track.id ? 'true' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><span>{track.title}</span><Play aria-hidden="true" /></button></li>)}</ol>;
}
