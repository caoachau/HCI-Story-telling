import { useNarration } from '../../../experience/narration';

export function useStoryVoice(text: string) {
  const voice = useNarration(text, 'vi-VN', `con-chim:${text.slice(0, 70)}`);
  return { state: voice.status === 'error' ? 'idle' as const : voice.status, message: voice.message || (voice.status === 'playing' ? 'Đang đọc bằng giọng tổng hợp của thiết bị.' : voice.status === 'paused' ? 'Đã tạm dừng. Chọn Tiếp tục nghe khi sẵn sàng.' : ''), play: voice.play, pause: voice.pause, stop: voice.stop };
}
