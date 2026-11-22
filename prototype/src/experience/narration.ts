import { useEffect, useSyncExternalStore } from 'react';
import { activeSiteId, routeParams, stopOtherAudio, updateRoute, SITE_IDS } from './state';

interface NarrationState { status: 'idle' | 'playing' | 'paused' | 'error'; chunks: string[]; index: number; message: string; key: string; }
let state: NarrationState = { status: 'idle', chunks: [], index: 0, message: '', key: '' };
const listeners = new Set<() => void>();
let utterance: SpeechSynthesisUtterance | null = null;
let revision = 0;
let language = 'vi-VN';
let rate = 1;
function update(patch: Partial<NarrationState>) { state = { ...state, ...patch }; listeners.forEach(fn => fn()); }
function cancel() { revision++; const owned = utterance; if (owned) { owned.onend = null; owned.onerror = null; owned.onboundary = null; } utterance = null; if (owned) window.speechSynthesis?.cancel(); }
function reclaimNarrationFocus() {
  window.dispatchEvent(new CustomEvent('heritage:stop-audio', { detail: { except: 'speech' } }));
  stopOtherAudio();
}
function playChunk(index: number) {
  if (!state.chunks[index]) { update({ status: 'idle', index: 0 }); return; }
  if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') {
    update({ status: 'error', message: language.startsWith('vi') ? 'Thiết bị chưa hỗ trợ giọng đọc. Bản chữ vẫn dùng được.' : 'Speech is not supported. The transcript is available.' });
    return;
  }
  const token = ++revision;
  const speech = new SpeechSynthesisUtterance(state.chunks[index]);
  utterance = speech; speech.lang = language; speech.rate = rate;
  const voice = speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith(language.slice(0, 2)));
  if (voice) speech.voice = voice;
  speech.onstart = () => { if (token === revision) { update({ status: 'playing', index, message: '' }); saveProgress(index); } };
  speech.onend = () => { if (token === revision) { saveProgress(index + 1); playChunk(index + 1); } };
  speech.onerror = event => { if (token === revision && event.error !== 'canceled' && event.error !== 'interrupted') update({ status: 'error', message: language.startsWith('vi') ? 'Chưa phát được giọng đọc. Bạn vẫn có thể đọc bản chữ hoặc thử lại.' : 'Narration is unavailable. Read the transcript or try again.' }); };
  update({ status: 'playing', index });
  try { speechSynthesis.speak(speech); } catch { update({ status: 'error', message: 'Speech is unavailable on this device.' }); }
}
function saveProgress(index: number) {
  if (!state.key) return;
  try { sessionStorage.setItem(`heritage:audio:${state.key}`, String(index)); } catch { /* Transcript remains available. */ }
  const siteId = SITE_IDS.find(id => state.key.split(':').includes(id));
  if (siteId && activeSiteId() === siteId) updateRoute({ audioBlock: index, audioKey: state.key }, siteId);
}
export const narration = {
  play(text: string | string[], lang = 'vi-VN', key = 'current', speed = 1) {
    window.dispatchEvent(new Event('heritage:stop-audio'));
    cancel(); stopOtherAudio();
    const chunks = (Array.isArray(text) ? text : text.split(/\n+/)).flatMap(paragraph => paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map(value => value.trim()).filter(Boolean);
    language = lang; rate = speed;
    const previousKey = state.key;
    update({ chunks, key, message: '', index: previousKey === key ? state.index : 0 });
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== 'function') { update({ status: 'error', message: lang.startsWith('vi') ? 'Thiết bị chưa hỗ trợ giọng đọc. Bản chữ vẫn dùng được.' : 'Speech is not supported. The transcript is available.' }); return; }
    let index = state.index;
    if (previousKey !== key) try { index = Number(sessionStorage.getItem(`heritage:audio:${key}`) || 0); } catch { /* Start at the first sentence. */ }
    const linked = routeParams();
    if (linked.get('audioKey') === key) index = Number(linked.get('audioBlock') || 0);
    const target = Number.isInteger(index) && index < chunks.length ? Math.max(0, index) : 0;
    const token = revision;
    update({ status: 'playing', index: target });
    window.setTimeout(() => { if (revision === token && state.status === 'playing') playChunk(target); }, 30);
  },
  pause() { if (state.status === 'playing') { window.speechSynthesis?.pause(); saveProgress(state.index); update({ status: 'paused' }); } },
  resume() { if (state.status === 'paused') { reclaimNarrationFocus(); if (utterance) { window.speechSynthesis?.resume(); update({ status: 'playing' }); } else playChunk(state.index); } },
  stop() { saveProgress(state.index); cancel(); update({ status: 'idle' }); },
  restart() { reclaimNarrationFocus(); cancel(); saveProgress(0); if (state.chunks.length) playChunk(0); },
  seek(index: number) { if (index < 0 || index >= state.chunks.length) return; reclaimNarrationFocus(); cancel(); saveProgress(index); playChunk(index); },
};
const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };
export function useNarrationState() { return useSyncExternalStore(subscribe, () => state, () => state); }
export function useNarration(text: string, lang = 'vi-VN', key = 'current') {
  const current = useNarrationState();
  useEffect(() => () => { if (state.key === key) narration.stop(); }, [key, text, lang]);
  const active = current.key === key;
  return { ...current, status: active ? current.status : 'idle' as const, play: () => active && current.status !== 'idle' && current.status !== 'error' ? narration.stop() : narration.play(text, lang, key), pause: () => current.status === 'paused' ? narration.resume() : narration.pause(), stop: narration.stop };
}
document.addEventListener('visibilitychange', () => { if (document.hidden) narration.stop(); });
window.addEventListener('pagehide', narration.stop);
window.addEventListener('heritage:stop-audio', event => { if (!(event instanceof CustomEvent) || event.detail?.except !== 'speech') narration.stop(); });

