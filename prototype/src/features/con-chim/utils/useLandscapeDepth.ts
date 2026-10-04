import { RefObject, useEffect } from 'react';
import { useReducedDetailMotion } from './motion';

/** A small amount of depth follows the pointer and stops rendering at rest. */
export function useLandscapeDepth(element: RefObject<HTMLElement | null>) {
  const reduced = useReducedDetailMotion();
  useEffect(() => {
    const root = element.current;
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!root || reduced || !pointer.matches) return;
    let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0;
    const draw = () => {
      x += (targetX - x) * .09; y += (targetY - y) * .09;
      root.style.setProperty('--cc-depth-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--cc-depth-y', `${y.toFixed(2)}px`);
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .04 ? requestAnimationFrame(draw) : 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const move = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - .5) * 8;
      targetY = ((event.clientY - box.top) / box.height - .5) * 6;
      schedule();
    };
    const reset = () => { targetX = 0; targetY = 0; schedule(); };
    const active = (event: Event) => { if ((event as CustomEvent<string>).detail !== 'intro') reset(); };
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', reset);
    root.addEventListener('focusin', reset);
    document.addEventListener('cc:active-screen', active);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', reset); root.removeEventListener('focusin', reset);
      document.removeEventListener('cc:active-screen', active);
      root.style.removeProperty('--cc-depth-x'); root.style.removeProperty('--cc-depth-y');
    };
  }, [element, reduced]);
}
