import { Headphones, Pause, Square } from 'lucide-react';
import { audioPlayer, useAudioPlayer } from './player';
import type { AudioLanguage, AudioTrack, PlaybackMode } from './types';
export function ownsAudio(tracks: AudioTrack[], mode: PlaybackMode, state: ReturnType<typeof audioPlayer.getState>) {
  return tracks.length > 0 && state.mode === mode && state.tracks.length === tracks.length && state.tracks.every((track, index) => track.id === tracks[index].id);
}
export function ListenButton({ tracks, mode, lang, className = '', label }: { tracks: AudioTrack[]; mode: PlaybackMode; lang: AudioLanguage; className?: string; label?: string }) {
  const state = useAudioPlayer(), current = ownsAudio(tracks, mode, state);
  const active = current && ['playing', 'buffering', 'loading'].includes(state.status), ended = current && state.status === 'ended';
  const text = active ? lang === 'vi' ? 'Tạm dừng' : 'Pause' : ended ? lang === 'vi' ? 'Dừng' : 'Stopped' : label ?? (lang === 'vi' ? 'Nghe' : 'Listen');
  return <button type="button" className={className} data-audio-action="start" aria-pressed={active} title={ended ? lang === 'vi' ? 'Bấm để nghe lại' : 'Play again' : undefined} disabled={!tracks.length} onClick={() => current ? audioPlayer.toggle() : mode === 'playlist' ? audioPlayer.playPlaylist(tracks) : audioPlayer.playSingle(tracks[0])}>{active ? <Pause /> : ended ? <Square /> : <Headphones />}{text}</button>;
}
