import { useEffect, useRef } from 'react';
import { ArrowRight, Clock3, Hand, Info } from 'lucide-react';
import './sessionExpiredDialog.css';

export function SessionExpiredDialog({ lang, onStart }: { lang: 'vi' | 'en'; onStart: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const vi = lang === 'vi';

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => { dialog?.close(); };
  }, []);

  return (
    <dialog ref={dialogRef} className="session-welcome" aria-labelledby="session-expired-title"
      aria-describedby="session-expired-description session-expired-next-step"
      onCancel={event => { event.preventDefault(); onStart(); }}>
      <p className="session-welcome-status"><Clock3 size={16} aria-hidden="true" />
        {vi ? 'Lượt khám phá trước đã kết thúc' : 'The previous visit has ended'}
      </p>
      <h2 id="session-expired-title">{vi ? 'Khám phá những câu chuyện di sản Trà Vinh' : 'Discover Trà Vinh’s heritage stories'}</h2>
      <p id="session-expired-description" className="session-welcome-description">
        {vi ? 'Khám phá văn hóa, con người và đời sống qua những câu chuyện địa phương.' : 'Explore culture, people and everyday life through local stories.'}
      </p>
      <p id="session-expired-next-step" className="session-welcome-next-step">
        {vi ? 'Bắt đầu lượt mới, rồi chọn một địa điểm trên bản đồ hoặc thẻ ảnh để đọc và nghe câu chuyện.' : 'Start a new visit, then choose a place on the map or a photo card to read and listen to its story.'}
      </p>
      <button type="button" className="session-welcome-start" onClick={onStart} autoFocus>
        <Hand size={21} aria-hidden="true" />
        <span>{vi ? 'Chạm để khám phá' : 'Touch to explore'}</span>
        <ArrowRight size={20} aria-hidden="true" />
      </button>
      <p className="session-welcome-help"><Info size={16} aria-hidden="true" />
        <span>{vi ? 'Hướng dẫn sử dụng có tại nút thông tin (i) trên bản đồ.' : 'Find the instructions under the information (i) button on the map.'}</span>
      </p>
    </dialog>
  );
}
