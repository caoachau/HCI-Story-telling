import { RefObject, useEffect, useRef } from 'react';
import { detailScrollBehavior, isDetailMotionReduced } from './motion';

export type ScreenSteps = Record<string, { index: number; count: number; go: (index: number) => void }>;

export function goToScreen(id: string) {
  document.dispatchEvent(new CustomEvent('cc:screen', { detail: id }));
}

/** One gesture advances one story. Long text can finish scrolling before advancing. */
export function useScreenNavigation(viewport: RefObject<HTMLElement | null>, steps: ScreenSteps) {
  const latest = useRef(steps);
  latest.current = steps;
  useEffect(() => {
    const root = viewport.current;
    if (!root) return;
    const screens = Array.from(root.children).filter((node): node is HTMLElement => node instanceof HTMLElement);
    let active = 0, lockedUntil = 0, wheelTotal = 0, wheelConsumed = false;
    let transitionVersion = 0, moving = false, destination = 0;
    let exitAnimation: Animation | null = null;
    let wheelTimer: ReturnType<typeof setTimeout>;
    let touchY = 0, touchX = 0, touchLastY = 0, touchTarget: Element | null = null, touchHandled = false;
    let touchReader: HTMLElement | null = null;
    const hasModal = () => !!document.querySelector('[data-detail-modal]');
    const screenTop = (index: number) => screens[index].getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop;
    const activate = (index: number) => {
      if (index === active && root.dataset.activeScreen === screens[index].id) return;
      active = index;
      screens.forEach((screen,i)=>screen.classList.toggle('is-current-screen',i===index));
      root.dataset.activeScreen = screens[index].id;
      document.dispatchEvent(new CustomEvent('cc:active-screen', { detail: screens[index].id }));
    };
    const moveTo = (index: number, focus = false, animate = true) => {
      if (!screens[index] || hasModal()) return;
      const version = ++transitionVersion;
      exitAnimation?.cancel();
      destination = index;
      const changed = index !== active;
      moving = changed;
      lockedUntil = performance.now() + (changed ? 450 : 100);
      const commit = () => {
        if (version !== transitionVersion) return;
        exitAnimation?.cancel();
        exitAnimation = null;
        moving = false;
        delete root.dataset.scrolling;
        if (hasModal()) return;
        root.scrollTo({ top: screenTop(index), behavior: 'instant' });
        activate(index);
        if (focus) screens[index].focus({ preventScroll: true });
      };
      if (!changed || !animate || isDetailMotionReduced()) { commit(); return; }
      root.dataset.scrolling = 'true';
      // Fade within the current screen, then enter the next complete screen.
      // Moving scrollTop through intermediate positions would expose two sections.
      exitAnimation = screens[active].animate([{opacity:1},{opacity:.12}],{
        duration:150,easing:'cubic-bezier(.4,0,1,1)',fill:'both',
      });
      exitAnimation.finished.then(commit).catch(()=>{});
    };
    const advance = (direction: number, focus = false) => {
      if (performance.now() < lockedUntil) return;
      const story = latest.current[screens[active].id];
      const next = story ? story.index + direction : -1;
      if (story && next >= 0 && next < story.count) {
        story.go(next);
        lockedUntil = performance.now() + 450;
        if (focus) requestAnimationFrame(() => {
          const heading = screens[active].querySelector<HTMLElement>('.cc-chapter:not([hidden]) h3,.cc-history-row:not([hidden]) h3,.cc-experience-card:not([hidden]) h3');
          if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
        });
      } else {
        const nextScreen = active + direction;
        if (nextScreen < 0 || nextScreen >= screens.length) return;
        const incoming = latest.current[screens[nextScreen].id];
        // Reading backwards starts at the last story, forwards at the first.
        incoming?.go(direction > 0 ? 0 : incoming.count - 1);
        moveTo(nextScreen, focus);
      }
    };
    const canMove = (node: HTMLElement, direction: number) => {
      const overflow = getComputedStyle(node).overflowY;
      return /auto|scroll/.test(overflow) && node.scrollHeight > node.clientHeight + 2 &&
        (direction > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 2 : node.scrollTop > 2);
    };
    const scrollReader = (target: Element | null, direction: number) => {
      for (let node = target; node && node !== root; node = node.parentElement) {
        if (!(node instanceof HTMLElement)) continue;
        if (canMove(node, direction)) return node;
      }
      const reader = screens[active].querySelector<HTMLElement>('.cc-chapters,.cc-history-window,.cc-experience-grid,[data-screen-reader]');
      return reader && canMove(reader, direction) ? reader : null;
    };
    const wheel = (event: WheelEvent) => {
      if (hasModal() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaY);
      if (!direction) return;
      const target = event.target as Element;
      const reader = scrollReader(target, direction);
      if (reader) {
        if (!reader.contains(target)) {
          event.preventDefault();
          reader.scrollBy({ top: event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? reader.clientHeight : 1), behavior: 'instant' });
        }
        return;
      }
      event.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelConsumed = false; wheelTotal = 0; }, 180);
      if (wheelConsumed || performance.now() < lockedUntil) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1);
      if (Math.sign(wheelTotal) !== direction) wheelTotal = 0;
      wheelTotal += delta;
      if (Math.abs(wheelTotal) < 32) return;
      wheelConsumed = true;
      advance(direction);
    };
    const touchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
      touchLastY = touchY;
      touchX = event.touches[0].clientX;
      touchTarget = event.target as Element;
      touchHandled = false;
      touchReader = null;
    };
    const touchMove = (event: TouchEvent) => {
      if (hasModal() || event.touches.length !== 1) return;
      const delta = touchY - event.touches[0].clientY;
      if (Math.abs(delta) < Math.abs(touchX - event.touches[0].clientX)) return;
      if (!touchHandled) touchReader ??= scrollReader(touchTarget, Math.sign(delta));
      if (touchReader) {
        if (!touchReader.contains(touchTarget)) {
          event.preventDefault();
          touchReader.scrollBy({ top: touchLastY - event.touches[0].clientY, behavior: 'instant' });
        }
        touchLastY = event.touches[0].clientY;
        return;
      }
      event.preventDefault();
      if (!touchHandled && Math.abs(delta) > 45) {
        touchHandled = true;
        advance(Math.sign(delta));
      }
    };
    const key = (event: KeyboardEvent) => {
      if (hasModal() || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : document.activeElement ?? root;
      if (target.closest('input,textarea,select,[contenteditable="true"],[role="slider"]')) return;
      if (event.key === ' ' && target.closest('button,a,[role="button"]')) return;
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1) : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
      if (direction) {
        const reader = scrollReader(target, direction);
        if (reader) {
          event.preventDefault();
          reader.scrollBy({ top: direction * (event.key.startsWith('Arrow') ? 40 : reader.clientHeight * 0.85), behavior: detailScrollBehavior() });
          return;
        }
        event.preventDefault();
        advance(direction, true);
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        moveTo(event.key === 'Home' ? 0 : screens.length - 1, true);
      }
    };
    const navigate = (id: string, animate = true) => {
      const target = document.getElementById(id || 'intro');
      const index = screens.findIndex(screen => screen === target || (target && screen.contains(target)));
      if (index >= 0) moveTo(index, false, animate);
    };
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || hasModal() || event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
      const id = link.getAttribute('href')!.slice(1);
      if (id && !document.getElementById(id)) return;
      event.preventDefault();
      navigate(id);
      if (link.classList.contains('cc-skip-link')) document.getElementById('overview')?.focus({ preventScroll: true });
      history.replaceState(null, '', id ? `#${id}` : location.pathname);
    };
    const request = (event: Event) => navigate((event as CustomEvent<string>).detail);
    const settled = (event: Event) => { if (event.target === root) lockedUntil = Math.max(lockedUntil, performance.now() + 100); };
    const hash = () => navigate(location.hash.slice(1));
    const observer = new IntersectionObserver(entries => {
      if (moving) return;
      const visible = entries.find(entry => entry.intersectionRatio >= 0.65);
      if (visible) activate(screens.indexOf(visible.target as HTMLElement));
    }, { root, threshold: [0.65] });
    screens.forEach(screen => { screen.tabIndex = -1; observer.observe(screen); });
    const resize = new ResizeObserver(() => {
      exitAnimation?.cancel();transitionVersion++;moving=false;delete root.dataset.scrolling;
      root.scrollTo({ top: screenTop(active), behavior: 'instant' });
    });
    resize.observe(root);
    activate(0);
    navigate(location.hash.slice(1), false);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stopExit = () => { if (isDetailMotionReduced() && moving) moveTo(destination,false,false); };
    const preferences = new MutationObserver(stopExit);
    preferences.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    preference.addEventListener('change', stopExit);
    root.addEventListener('wheel', wheel, { passive: false });
    root.addEventListener('touchstart', touchStart, { passive: true });
    root.addEventListener('touchmove', touchMove, { passive: false });
    root.addEventListener('scrollend', settled);
    document.addEventListener('keydown', key);
    document.addEventListener('click', click);
    document.addEventListener('cc:screen', request);
    window.addEventListener('hashchange', hash);
    return () => {
      clearTimeout(wheelTimer);
      transitionVersion++;
      exitAnimation?.cancel();delete root.dataset.scrolling;
      preferences.disconnect(); preference.removeEventListener('change', stopExit);
      observer.disconnect(); resize.disconnect();
      root.removeEventListener('wheel', wheel);
      root.removeEventListener('touchstart', touchStart);
      root.removeEventListener('touchmove', touchMove);
      root.removeEventListener('scrollend', settled);
      document.removeEventListener('keydown', key);
      document.removeEventListener('click', click);
      document.removeEventListener('cc:screen', request);
      window.removeEventListener('hashchange', hash);
    };
  }, [viewport]);
}
