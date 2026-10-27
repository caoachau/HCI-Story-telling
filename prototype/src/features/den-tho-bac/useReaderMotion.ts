import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { revealOnScroll, scrollContainer, useMemorialMotionPreference } from './memorial-motion';

export function useReaderMotion(dialog: RefObject<HTMLDialogElement | null>, onClosing: () => void) {
  const reduced = useMemorialMotionPreference();
  const origin = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const beforeClose = useRef(onClosing);
  beforeClose.current = onClosing;
  const context = useRef<gsap.Context | null>(null);
  const entrance = useRef<gsap.core.Tween | null>(null);
  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    origin.current = document.activeElement as HTMLElement;
    node.showModal();
    return () => { if (origin.current?.isConnected) origin.current.focus({ preventScroll: true }); };
  }, [dialog]);

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (closing.current) { node.close(); return; }
    node.dataset.readerPhase = reduced ? 'open' : 'opening';
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (reduced) return;
      entrance.current = gsap.fromTo(node, { opacity: 0, y: 6 }, {
        opacity: 1, y: 0, duration: .22, ease: 'power2.out',
        onComplete: () => { node.dataset.readerPhase = 'open'; },
      });
      media.add({ compact: '(max-width:900px)', full: '(min-width:0px)' }, () => {
        const items = [...node.querySelectorAll<HTMLElement>('.db-summary>li,.db-read-more,.db-reflect,.db-source-list>a')];
        if (!items.length) return;
        return revealOnScroll(items, scrollContainer(items[0]), .3);
      });
    }, node);
    context.current = ctx;
    return () => { media.revert(); ctx.revert(); context.current = null; entrance.current = null; };
  }, [dialog, reduced]);

  const close = useCallback(() => {
    const node = dialog.current;
    if (!node?.open || closing.current) return;
    closing.current = true;
    beforeClose.current();
    node.dataset.readerPhase = 'closing';
    entrance.current?.kill();
    if (reduced) { node.close(); return; }
    context.current?.add(() => {
      gsap.to(node, { opacity: 0, y: 6, duration: .16, overwrite: true, ease: 'power1.in', onComplete: () => node.close() });
    });
  }, [dialog, reduced]);
  return { close, reduced };
}

export function useReadingProgress(dialog: RefObject<HTMLDialogElement | null>, progress: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const node = dialog.current, bar = progress.current;
    const content = node?.querySelector<HTMLElement>('.db-reader-prose,.db-source-page');
    if (!node || !bar || !content) return;
    let pane: HTMLElement | null = null, frame = 0;
    const update = () => {
      const next = /(auto|scroll)/.test(getComputedStyle(content).overflowY) ? content : scrollContainer(content);
      if (next !== pane) { pane?.removeEventListener('scroll', schedule); pane = next; pane.addEventListener('scroll', schedule, { passive: true }); }
      const extent = pane.scrollHeight - pane.clientHeight;
      bar.hidden = extent < 2;
      const fraction = extent > 0 ? Math.min(1, Math.max(0, pane.scrollTop / extent)) : 0;
      bar.firstElementChild?.setAttribute('style', `transform:scaleX(${fraction})`);
      bar.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    };
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(schedule);
    resize.observe(node); resize.observe(content);
    [...content.children].forEach(element => resize.observe(element));
    node.addEventListener('toggle', schedule, true);
    node.addEventListener('load', schedule, true);
    update();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); pane?.removeEventListener('scroll', schedule);
      node.removeEventListener('toggle', schedule, true); node.removeEventListener('load', schedule, true);
    };
  }, [dialog, progress]);
}
