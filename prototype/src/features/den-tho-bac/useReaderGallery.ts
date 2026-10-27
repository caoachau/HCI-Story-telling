import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { ReaderChapter } from './reader-content';

export function useReaderGallery(prose: RefObject<HTMLElement | null>, chapters: ReaderChapter[], reduced: boolean) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const pane = prose.current;
    if (!pane) return;
    const sections = [...pane.querySelectorAll<HTMLElement>('[data-reader-chapter]')];
    let frame = 0;
    const measure = () => {
      const box = pane.getBoundingClientRect(), last = sections.at(-1), end = pane.lastElementChild;
      if (last && end) {
        // Leave exactly enough room for the final section to reach the same
        // reading line, even on 4K screens with a short account.
        const lastTop = last.getBoundingClientRect().top - box.top + pane.scrollTop;
        const contentBottom = end.getBoundingClientRect().bottom - box.top + pane.scrollTop;
        const tail = `${Math.max(0, Math.ceil(lastTop + pane.clientHeight - 24 - contentBottom))}px`;
        if (pane.style.getPropertyValue('--reader-tail-space') !== tail) pane.style.setProperty('--reader-tail-space', tail);
      }
      const line = box.top + 32;
      let next = 0;
      sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= line) next = index; });
      if (pane.scrollTop > 0 && pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 2) next = sections.length - 1;
      setActive(old => old === next ? old : next);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(pane); sections.forEach(section => observer.observe(section));
    pane.addEventListener('scroll', schedule, { passive: true });
    pane.addEventListener('toggle', schedule, true);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); pane.removeEventListener('scroll', schedule); pane.removeEventListener('toggle', schedule, true); pane.style.removeProperty('--reader-tail-space'); };
  }, [prose, chapters]);

  const select = useCallback((index: number) => {
    const pane = prose.current, section = pane?.querySelector<HTMLElement>(`[data-reader-chapter-index="${index}"]`);
    if (!pane || !section) return;
    pane.scrollTo({ top: pane.scrollTop + section.getBoundingClientRect().top - pane.getBoundingClientRect().top - 24, behavior: reduced ? 'instant' : 'smooth' });
  }, [prose, reduced]);
  return { active, select };
}

export function useDecodedChapter(chapters: ReaderChapter[], requested: number) {
  const [displayed, setDisplayed] = useState(0);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const revision = useRef(0);
  useEffect(() => {
    const token = ++revision.current;
    const image = new Image();
    setStatus('loading');
    image.onload = async () => {
      try { await image.decode(); } catch { /* A completed load is usable. */ }
      if (revision.current !== token) return;
      setDisplayed(requested); setStatus('ready');
    };
    image.onerror = () => { if (revision.current === token) setStatus('error'); };
    image.src = chapters[requested].photo.src;
    return () => { revision.current++; image.onload = null; image.onerror = null; };
  }, [chapters, requested, attempt]);
  useEffect(() => {
    const pending = chapters.map(chapter => { const image = new Image(); image.src = chapter.photo.src; return image; });
    return () => { pending.forEach(image => { image.onload = null; image.onerror = null; }); };
  }, [chapters]);
  return { displayed, status, attempt, retry: () => setAttempt(old => old + 1) };
}
