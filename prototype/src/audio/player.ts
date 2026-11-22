import { useSyncExternalStore } from 'react';
import { stopOtherAudio } from '../experience/state';
import type { AudioState, AudioTrack, PlaybackMode } from './types';

const initial: AudioState = { mode: 'single', status: 'idle', tracks: [], index: 0, currentTime: 0, duration: 0, rate: 1, blocked: false };
let state = initial;
let element: HTMLAudioElement | undefined;
let playRevision = 0;
let detach: (() => void) | undefined;
const subscribers = new Set<() => void>();
function update(patch: Partial<AudioState>) { state = { ...state, ...patch }; subscribers.forEach(listener => listener()); }
function getElement() {
  if (element) return element;
  element = document.createElement('audio');
  element.dataset.heritageAudio = 'shared';
  element.preload = 'metadata';
  element.loop = false;
  element.hidden = true;
  document.body.append(element);
  window.addEventListener('heritage:stop-audio', () => audioPlayer.pause());
  window.addEventListener('pagehide', () => audioPlayer.stop());
  document.addEventListener('play', event => {
    if (event.target instanceof HTMLMediaElement && event.target !== element) audioPlayer.pause();
  }, true);
  return element;
}
function takeAudioFocus() {
  window.dispatchEvent(new Event('heritage:stop-audio'));
  document.querySelectorAll<HTMLMediaElement>('audio,video').forEach(media => { if (media !== element) media.pause(); });
  stopOtherAudio();
}
async function attemptPlay() {
  const audio = getElement();
  const revision = ++playRevision;
  update({ status: 'loading', blocked: false });
  try {
    await audio.play();
    if (revision === playRevision && !audio.paused) update({ status: 'playing' });
  } catch (error) {
    if (revision !== playRevision) return;
    const blocked = error instanceof DOMException && error.name === 'NotAllowedError';
    update({ status: blocked ? 'paused' : 'error', blocked });
  }
}
function start(tracks: AudioTrack[], index: number, mode: PlaybackMode) {
  if (!tracks.length || index < 0 || index >= tracks.length) return;
  const audio = getElement();
  detach?.();
  ++playRevision;
  audio.pause();
  takeAudioFocus();
  update({ tracks, index, mode, currentTime: 0, duration: 0, blocked: false, status: 'loading' });
  // Always reset and reload, including different track IDs sharing demo.mp3.
  audio.src = tracks[index].audioUrl;
  audio.currentTime = 0;
  audio.playbackRate = state.rate;
  const events: Partial<Record<keyof HTMLMediaElementEventMap, EventListener>> = {
    loadedmetadata: () => { update({ duration: Number.isFinite(audio.duration) ? audio.duration : 0 }); audio.playbackRate = state.rate; },
    durationchange: () => update({ duration: Number.isFinite(audio.duration) ? audio.duration : 0 }),
    timeupdate: () => update({ currentTime: audio.currentTime }),
    playing: () => { if (!audio.paused) update({ status: 'playing', blocked: false }); },
    pause: () => { if (audio.paused && !audio.ended && ['playing', 'buffering'].includes(state.status)) update({ status: 'paused' }); },
    waiting: () => { if (!audio.paused) update({ status: 'buffering' }); },
    canplay: () => { if (state.status === 'buffering' && !audio.paused) update({ status: 'playing' }); },
    ended: () => {
      if (!audio.ended) return;
      if (state.mode === 'playlist' && state.index + 1 < state.tracks.length) start(state.tracks, state.index + 1, 'playlist');
      else update({ status: 'ended', currentTime: Number.isFinite(audio.duration) ? audio.duration : state.currentTime });
    },
    error: () => { ++playRevision; update({ status: 'error', blocked: false }); },
  };
  for (const [name, listener] of Object.entries(events)) audio.addEventListener(name, listener);
  detach = () => { for (const [name, listener] of Object.entries(events)) audio.removeEventListener(name, listener); };
  audio.load();
  void attemptPlay();
}
export const audioPlayer = {
  getState: () => state,
  playSingle(track: AudioTrack) { start([track], 0, 'single'); },
  playPlaylist(tracks: AudioTrack[], index = 0) { start(tracks, index, 'playlist'); },
  play() {
    if (!state.tracks.length) return;
    if (state.status === 'ended') { start(state.tracks, state.mode === 'playlist' ? 0 : state.index, state.mode); return; }
    if (state.status === 'error') { this.retry(); return; }
    takeAudioFocus();
    void attemptPlay();
  },
  pause() { ++playRevision; element?.pause(); if (state.tracks.length && !['error', 'ended'].includes(state.status)) update({ status: 'paused' }); },
  toggle() { if (['playing', 'loading', 'buffering'].includes(state.status)) this.pause(); else this.play(); },
  next() { if (state.mode === 'playlist') start(state.tracks, state.index + 1, 'playlist'); },
  previous() { if (state.mode === 'playlist') start(state.tracks, state.index - 1, 'playlist'); },
  select(index: number) { start(state.tracks, index, state.mode); },
  seek(time: number) {
    if (!element || !state.duration || !Number.isFinite(time)) return;
    element.currentTime = Math.max(0, Math.min(state.duration, time));
    update({ currentTime: element.currentTime, ...(state.status === 'ended' ? { status: 'paused' as const } : {}) });
  },
  skip(seconds: number) { this.seek(state.currentTime + seconds); },
  setRate(rate: number) { if (![.75, 1, 1.25, 1.5, 2].includes(rate)) return; if (element) element.playbackRate = rate; update({ rate }); },
  halt() { ++playRevision; element?.pause(); if (element) element.currentTime = 0; if (state.tracks.length) update({ status: 'ended', currentTime: 0, blocked: false }); },
  retry() { start(state.tracks, state.index, state.mode); },
  stop() { ++playRevision; detach?.(); detach = undefined; if (element) { element.pause(); element.removeAttribute('src'); element.load(); } update({ ...initial, rate: state.rate }); },
};
export function useAudioPlayer() {
  return useSyncExternalStore(listener => { subscribers.add(listener); return () => { subscribers.delete(listener); }; }, () => state, () => initial);
}
export function formatAudioTime(seconds: number) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}
