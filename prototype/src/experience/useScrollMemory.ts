import { useEffect, type RefObject } from 'react';

export function useScrollMemory(ref: RefObject<HTMLElement | null>, key: string, restoreFromStorage = true) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let saved: number | null = null;
    try { const raw = sessionStorage.getItem(`heritage:scroll:${key}`); if (raw !== null) saved = Number(raw); } catch { /* Start at the top. */ }
    let changed = false;
    const stopRestore = () => { changed = true; };
    const restore = () => { if (restoreFromStorage && !changed && saved !== null && Number.isFinite(saved)) element.scrollTop = saved; };
    const first = requestAnimationFrame(restore), second = window.setTimeout(restore, 400);
    const persist = () => { try { sessionStorage.setItem(`heritage:scroll:${key}`, String(element.scrollTop)); } catch { /* Reading still works. */ } };
    element.addEventListener('pointerdown', stopRestore, { passive: true });
    element.addEventListener('wheel', stopRestore, { passive: true });
    element.addEventListener('scroll', persist, { passive: true });
    return () => { persist(); cancelAnimationFrame(first); clearTimeout(second); element.removeEventListener('pointerdown', stopRestore); element.removeEventListener('wheel', stopRestore); element.removeEventListener('scroll', persist); };
  }, [ref, key, restoreFromStorage]);
}
