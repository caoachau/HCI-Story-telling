import { RefObject, useEffect } from 'react';
import { isDetailMotionReduced, motionEase } from './motion';

/** Finite, interruptible choreography. No React updates or scroll work per frame. */
export function useDetailMotion(viewport: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = viewport.current;
    if (!root || !Element.prototype.animate) return;
    const page = root.closest<HTMLElement>('.cc-page')!;
    const running = new Map<Element, Animation>();
    const steps = new Map<Element, number>();
    let frame = 0;
    page.dataset.motionReady = 'true';

    const stop = (scope: Element = page) => {
      running.forEach((animation, element) => {
        if (scope === element || scope.contains(element)) { animation.cancel(); running.delete(element); }
      });
    };
    const reveal = (element: Element, delay = 0, duration = 680, x = 0, y = 20, scale = 1) => {
      if (!element.getClientRects().length || element.closest('[hidden]')) return;
      running.get(element)?.cancel();
      const style = getComputedStyle(element);
      const base = style.transform !== 'none' ? style.transform : '';
      const opacity = element.matches('.cc-hero-leaf,.cc-hero-wheat') ? style.opacity : '1';
      const animation = element.animate([
        { opacity: 0, transform: `translate3d(${x}px,${y}px,0) scale(${scale}) ${base}` },
        { opacity, transform: base || 'none' },
      ], { duration, delay, easing: motionEase, fill: 'both' });
      running.set(element, animation);
      // Releasing the effect restores CSS hover/focus and frees the compositor layer.
      animation.finished.then(() => {
        if (running.get(element) === animation) { animation.cancel(); running.delete(element); }
      }).catch(() => {});
    };
    const group = (scope: Element, selector: string, delay = 0, stagger = 45, duration = 680, x = 0, y = 20, scale = 1) => {
      [...scope.querySelectorAll(selector)].filter(element => element.getClientRects().length && !element.closest('[hidden]'))
        .forEach((element, index) => reveal(element, delay + index * stagger, duration, x, y, scale));
    };
    const words = (scope: Element, selector: string, delay = 100, direction = 1) => group(scope, selector, delay, 28, 720, 0, direction * 30);
    const unveil = (scope: Element, selector: string, delay = 80, duration = 1000, stagger = 0) => {
      [...scope.querySelectorAll(selector)].filter(element=>element.getClientRects().length&&!element.closest('[hidden]')).forEach((element,index)=>{
        const final=getComputedStyle(element).clipPath;
        const animation=element.animate([
          {clipPath:'polygon(0 0,0 0,0 14%,0 100%,0 100%)'},
          {clipPath:final==='none'?'polygon(0 0,100% 0,100% 14%,100% 100%,0 100%)':final},
        ],{duration,delay:delay+index*stagger,easing:motionEase,fill:'both'});
        running.set(element,animation);
        animation.finished.then(()=>{if(running.get(element)===animation){animation.cancel();running.delete(element);}}).catch(()=>{});
      });
    };
    const enter = (screen: HTMLElement, direction = 1, storyOnly = false) => {
      stop(screen);
      if (isDetailMotionReduced() || document.hidden) return;
      const y = direction * 22;
      switch (screen.id) {
        case 'intro':
          group(screen, '.cc-hero-location', 30, 0, 600, 0, 10);
          words(screen, '.cc-hero-title-line .cc-motion-word', 80);
          group(screen, '.cc-hero-subtitle,.cc-hero-description,.cc-hero-copy > .cc-button', 180, 70, 750, 0, 14);
          unveil(screen, '.cc-hero-arch', 100, 1150);
          group(screen, '.cc-hero-orbit', 320, 90, 900, 0, 16, .96);
          group(screen, '.cc-hero-people', 300, 0, 1100, 0, 30, .96);
          group(screen, '.cc-scene-tabs,.cc-hero-scroll', 480, 80, 650, 0, 8);
          break;
        case 'overview':
          if (!storyOnly) group(screen, '.cc-chapter-tabs,.cc-chapter-pagination', 50, 200, 600, 0, y / 2);
          group(screen, '.cc-chapter:not([hidden]) .cc-chapter-count', 30, 0, 600, 0, y);
          words(screen, '.cc-chapter:not([hidden]) .cc-motion-word', 100, direction);
          group(screen, '.cc-chapter:not([hidden]) p,.cc-chapter:not([hidden]) .cc-chapter-tags', 180, 40, 700, 0, y / 2);
          group(screen, '.cc-chapter:not([hidden]) > div:last-child', 260, 0, 700, 0, y / 2);
          if (!storyOnly) group(screen, '.cc-chapter-visual', 60, 0, 900, direction * 22, 0, 1.015);
          group(screen, '.cc-chapter-photo.is-active .cc-chapter-photo-caption > *', 240, 60, 750, 0, y);
          break;
        case 'timeline':
          if (!storyOnly) group(screen, '.cc-history-bar,.cc-history-pagination', 0, 200, 600, 0, y / 2);
          group(screen, '.cc-history-row:not([hidden]) .cc-history-marker', 30, 0, 850, 0, y, .96);
          words(screen, '.cc-history-row:not([hidden]) .cc-motion-word', 110, direction);
          group(screen, '.cc-history-row:not([hidden]) .cc-history-copy > p,.cc-history-row:not([hidden]) .cc-text-button', 220, 90, 750, 0, y);
          unveil(screen, '.cc-history-row:not([hidden]) .cc-history-photo', 70, 1050);
          group(screen, '.cc-history-row:not([hidden]) figcaption', 330, 0, 650, 0, 10);
          break;
        case 'gallery':
          group(screen, '.cc-gallery-top .cc-section-heading > *,.cc-filter-tabs', 30, 65, 750, 0, y);
          unveil(screen, '.cc-gallery-spotlight', 70, 1050);
          group(screen, '.cc-photo-counter,.cc-gallery-photo-copy > p,.cc-gallery-photo-copy > button,.cc-gallery-arrows', 170, 55, 700, 0, y);
          words(screen, '.cc-gallery-photo-copy .cc-motion-word', 150, direction);
          group(screen, '.cc-gallery-pebbles,.cc-gallery-collection-head,.cc-gallery-thumbnails', 240, 80, 700, 0, 10);
          break;
        case 'experiences':
          if (!storyOnly) group(screen, '.cc-section-heading > *,.cc-experience-tabs,.cc-experience-note', 20, 70, 650, 0, y);
          unveil(screen, '.cc-experience-card:not([hidden]) .cc-experience-image', 60, 950, 80);
          group(screen, '.cc-experience-card:not([hidden]) .cc-experience-copy', 180, 80, 700, 0, y / 2);
          break;
        case 'heritage-iris':
          group(screen, '.cc-section-heading > *', 20, 65, 750, 0, y);
          group(screen, '.cc-iris-petal,.cc-iris-mobile button', 120, 65, 900, 0, 0, .94);
          group(screen, '.cc-iris-center', 330, 0, 850, 0, 12, .95);
          group(screen, '.cc-iris-choices button', 380, 40, 650, 0, 10);
          break;
        case 'farewell':
          words(screen, '.cc-footer-message .cc-motion-word', 80);
          group(screen, '.cc-footer-message > p,.cc-footer-cta', 180, 80, 750, 0, y / 2);
          group(screen, '.cc-footer-people', 160, 0, 1100, 0, 24, .97);
          group(screen, '.cc-footer-links,.cc-footer-bottom', 280, 100, 750, 0, 10);
      }
    };
    let current = root.dataset.activeScreen || 'intro';
    const active = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const screen = document.getElementById(id);
      if (!screen || !root.contains(screen)) return;
      const previous = document.getElementById(current);
      const direction = previous && [...root.children].indexOf(previous) > [...root.children].indexOf(screen) ? -1 : 1;
      if (previous && previous !== screen) stop(previous);
      current = id;
      cancelAnimationFrame(frame);
      // Run after controlled story indices and hidden attributes have committed.
      frame = requestAnimationFrame(() => enter(screen, direction));
    };
    const mutations = new MutationObserver(records => {
      for (const record of records) {
        const screen = record.target as HTMLElement;
        const next = Number(screen.dataset.step), previous = steps.get(screen) ?? next;
        steps.set(screen, next);
        if (screen.id === current && previous !== next) enter(screen, next > previous ? 1 : -1, true);
      }
    });
    root.querySelectorAll<HTMLElement>('[data-step]').forEach(screen => steps.set(screen, Number(screen.dataset.step)));
    mutations.observe(root, { subtree: true, attributes: true, attributeFilter: ['data-step'] });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preferences = new MutationObserver(() => { if (isDetailMotionReduced()) stop(); });
    const reduce = () => { if (isDetailMotionReduced()) stop(); };
    preferences.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    media.addEventListener('change', reduce);
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', visibility);
    document.addEventListener('cc:active-screen', active);
    const initial = document.getElementById(current);
    if (initial) frame = requestAnimationFrame(() => enter(initial));
    return () => {
      cancelAnimationFrame(frame); stop(); mutations.disconnect(); preferences.disconnect();
      media.removeEventListener('change', reduce);
      document.removeEventListener('visibilitychange', visibility);
      document.removeEventListener('cc:active-screen', active);
      delete page.dataset.motionReady;
    };
  }, [viewport]);
}
