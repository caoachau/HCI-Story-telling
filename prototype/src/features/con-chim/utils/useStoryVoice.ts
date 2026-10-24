import { useCallback, useEffect, useRef, useState } from 'react';

export function useStoryVoice(text: string) {
  const [state,setState] = useState<'idle'|'playing'|'paused'>('idle');
  const [message,setMessage] = useState('');
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const stop = useCallback(() => {
    if (utterance.current) { utterance.current.onstart = null; utterance.current.onend = null; utterance.current.onerror = null; utterance.current = null; window.speechSynthesis?.cancel(); }
    setState('idle');
  },[]);
  useEffect(() => {
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange',hide); window.addEventListener('pagehide',stop);
    return () => { document.removeEventListener('visibilitychange',hide); window.removeEventListener('pagehide',stop); stop(); };
  },[stop]);
  const play = () => {
    if (state !== 'idle') { stop(); setMessage('Đã dừng đọc.'); return; }
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { setMessage('Thiết bị chưa hỗ trợ giọng đọc. Bạn vẫn có thể đọc tóm tắt.'); return; }
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith('vi'));
    if (!voice) { setMessage('Thiết bị chưa có giọng đọc tiếng Việt. Bạn vẫn có thể đọc tóm tắt.'); return; }
    try {
      const speech = new SpeechSynthesisUtterance(text);
      speech.voice = voice; speech.lang = 'vi-VN'; speech.rate = .95;
      speech.onstart = () => { setState('playing'); setMessage('Đang đọc bản tóm tắt bằng giọng tổng hợp của thiết bị.'); };
      speech.onend = () => { utterance.current = null; setState('idle'); setMessage('Đã nghe xong bản tóm tắt.'); };
      speech.onerror = () => { utterance.current = null; setState('idle'); setMessage('Chưa phát được giọng đọc. Bạn có thể thử lại hoặc đọc tóm tắt.'); };
      utterance.current = speech; setState('playing'); setMessage('Đang chuẩn bị giọng đọc…'); window.speechSynthesis.speak(speech);
    } catch { stop(); setMessage('Chưa phát được giọng đọc. Bạn vẫn có thể đọc tóm tắt.'); }
  };
  const pause = () => {
    try {
      if (state === 'playing') { window.speechSynthesis.pause(); setState('paused'); setMessage('Đã tạm dừng. Chọn Tiếp tục nghe khi bạn sẵn sàng.'); }
      else if (state === 'paused') { window.speechSynthesis.resume(); setState('playing'); setMessage('Đang tiếp tục đọc bản tóm tắt.'); }
    } catch { setMessage('Thiết bị chưa tạm dừng được. Bạn có thể chọn Dừng nghe.'); }
  };
  return {state,message,play,pause,stop};
}
