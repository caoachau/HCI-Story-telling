import { PointerEvent, MouseEvent, useRef } from 'react';

export function usePhotoSwipe(onMove: (direction: number) => void) {
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  return {
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      swiped.current = false;
      if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('.cc-icon-button')) return;
      gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const start = gesture.current;
      if (!start) return;
      const x = event.clientX - start.x, y = event.clientY - start.y;
      if (Math.abs(y) > Math.abs(x) + 8) { gesture.current = null; return; }
      if (Math.abs(x) > 12 && Math.abs(x) > Math.abs(y) * 1.3) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      const start = gesture.current;
      gesture.current = null;
      if (!start) return;
      const x = event.clientX - start.x, y = event.clientY - start.y;
      if (Math.abs(x) >= 44 && Math.abs(x) > Math.abs(y) * 1.3) { swiped.current = true; onMove(x < 0 ? 1 : -1); }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    },
    onPointerCancel: () => { gesture.current = null; },
    onClickCapture: (event: MouseEvent<HTMLElement>) => {
      if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; }
    },
  };
}
