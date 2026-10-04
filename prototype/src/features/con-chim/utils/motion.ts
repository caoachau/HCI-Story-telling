import { useEffect, useState } from 'react';

export const motionEase = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const isDetailMotionReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');
export const detailScrollBehavior = (): ScrollBehavior => isDetailMotionReduced() ? 'auto' : 'smooth';

/** The map's accessibility setting and the OS setting have equal priority. */
export function useReducedDetailMotion() {
  const [reduced, setReduced] = useState(isDetailMotionReduced);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(isDetailMotionReduced());
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    media.addEventListener('change', update);
    update();
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  return reduced;
}
