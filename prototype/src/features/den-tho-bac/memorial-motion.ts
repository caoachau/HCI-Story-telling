import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useMemorialMotionPreference() {
  const read = () => matchMedia('(prefers-reduced-motion:reduce)').matches || document.documentElement.classList.contains('reduce-motion');
  const [reduced, setReduced] = useState(read);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion:reduce)');
    const sync = () => setReduced(read());
    const observer = new MutationObserver(sync);
    media.addEventListener('change', sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    sync();
    return () => { media.removeEventListener('change', sync); observer.disconnect(); };
  }, []);
  return reduced;
}

export function scrollContainer(element: HTMLElement): HTMLElement {
  let parent = element.parentElement;
  while (parent) {
    if (/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) return parent;
    parent = parent.parentElement;
  }
  return document.documentElement;
}

// A reveal belongs to its actual scroll pane. Focus always reveals the target,
// including content below the fold reached directly with the keyboard.
export function revealOnScroll(elements: HTMLElement[], scroller: HTMLElement, duration = .45) {
  const removers: (() => void)[] = [];
  const triggers: ScrollTrigger[] = [];
  for (const element of elements) {
    element.dataset.revealState = 'waiting';
    const tween = gsap.fromTo(element, { opacity: 0, y: 8 }, {
      opacity: 1, y: 0, duration, ease: 'power2.out', paused: true,
      onComplete: () => { element.dataset.revealState = 'shown'; },
    });
    const reveal = () => tween.play();
    const trigger = ScrollTrigger.create({
      trigger: element, scroller: scroller === document.documentElement ? undefined : scroller,
      start: 'top 96%', once: true, onEnter: reveal,
    });
    triggers.push(trigger);
    const focus = () => { tween.progress(1); trigger.kill(); };
    element.addEventListener('focusin', focus);
    removers.push(() => { element.removeEventListener('focusin', focus); delete element.dataset.revealState; });
  }
  let frame = 0;
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => triggers.forEach(trigger => trigger.refresh()));
  };
  const resize = new ResizeObserver(refresh);
  resize.observe(scroller);
  elements.forEach(element => resize.observe(element));
  scroller.addEventListener('load', refresh, true);
  scroller.addEventListener('toggle', refresh, true);
  refresh();
  return () => {
    cancelAnimationFrame(frame); resize.disconnect();
    scroller.removeEventListener('load', refresh, true);
    scroller.removeEventListener('toggle', refresh, true);
    triggers.forEach(trigger => trigger.kill());
    removers.forEach(remove => remove());
  };
}

type Chapter = 'overview' | 'history' | 'spaces' | 'people' | 'activities' | 'values';

export function useChapterMotion<T extends HTMLElement>(ref: RefObject<T | null>, chapter: Chapter, revision: string | number, ready = true) {
  const reduced = useMemorialMotionPreference();
  const entered = useRef(false);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.dataset.motionOwner = 'gsap';
    root.dataset.motionState = reduced ? 'reduced' : 'idle';
    if (!ready || reduced) return () => { delete root.dataset.motionOwner; delete root.dataset.motionState; };
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add({ compact: '(max-width:900px)', touch: '(pointer:coarse)', full: '(min-width:0px)' }, match => {
        const compact = !!match.conditions?.compact;
        const distance = compact || match.conditions?.touch ? 8 : 12;
        const select = (selector: string) => [...root.querySelectorAll<HTMLElement>(selector)];
        root.dataset.motionState = 'running';
        const timeline = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => { root.dataset.motionState = 'idle'; },
        });
        const enter = (selector: string, at = 0, duration = .5, stagger = .06, y = distance) => {
          const elements = select(selector);
          if (elements.length) timeline.fromTo(elements, { opacity: 0, y }, { opacity: 1, y: 0, duration, stagger, clearProps: 'opacity,transform' }, at);
        };
        let cleanup: (() => void) | undefined;
        if (chapter === 'overview') {
          const outgoing = select('.db-overview-image--out');
          if (outgoing.length) timeline.to(outgoing, { opacity: 0, duration: .9 }, 0);
          timeline.fromTo(select('.db-overview-image--in'), { opacity: 0 }, { opacity: 1, duration: .9 }, 0);
          enter('.db-overview-story-label,.db-overview-story-number', 0, .45, 0, 0);
          enter('.db-overview-copy h2>span', .05, .55, .07);
          enter('.db-overview-description', .16, .55);
          enter('.db-overview-explore', .23, .5);
        } else if (chapter === 'history') {
          enter('.db-history-year', 0, .5, 0, -Math.min(distance, 8));
          enter('.db-history-date,.db-history-copy h2,.db-history-lead,.db-history-fact,.db-history-read', .06, .45, .06, 8);
        } else if (chapter === 'spaces') {
          if (root.dataset.panelView === 'list') {
            enter('.db-atlas-title', 0, entered.current ? .23 : .4, 0, 0);
            enter('.db-space-list>button', .03, .23, .035, 0);
          } else {
            // The existing eight panel entrances own their parent's transform.
            // Only opacity of the inner copy is coordinated here.
            enter('.db-atlas-category,#db-space-description>h2,#db-space-description>p,.db-atlas-observe,.db-atlas-reflection', .05, .28, .045, 0);
          }
        } else if (chapter === 'people') {
          enter('.db-witness-photo,.db-portrait-photo,.db-portrait-archive', 0, .6, 0, 0);
          enter('.db-person-copy h2', .08, .5, 0, 8);
          enter('.db-witness-role,.db-portrait-role', .14, .45, 0, 8);
          enter('.db-witness-lead,.db-portrait-lead', .2, .45, 0, 8);
          enter('.db-witness-read,.db-portrait-action,.db-witness-question', .26, .45, .05, 8);
        } else if (chapter === 'activities') {
          enter('.db-section-heading', 0, .4, 0, 8);
          if (compact) cleanup = revealOnScroll(select('.db-date-card,.db-visit-note'), scrollContainer(root));
          else enter('.db-date-card', 0, .65, .07, match.conditions?.touch ? 8 : 16);
        } else if (chapter === 'values') {
          // Opacity only on the outside stage: WAAPI exclusively owns the leaf.
          enter('.db-value-book-stage', 0, .35, 0, 0);
          const finish = () => timeline.progress(1);
          root.addEventListener('pointerdown', finish, { once: true });
          root.addEventListener('keydown', finish, { once: true });
          cleanup = () => { root.removeEventListener('pointerdown', finish); root.removeEventListener('keydown', finish); };
        }
        entered.current = true;
        if (!timeline.duration()) root.dataset.motionState = 'idle';
        return () => { cleanup?.(); root.dataset.motionState = 'idle'; };
      });
    }, root);
    return () => {
      media.revert(); context.revert();
      delete root.dataset.motionOwner; delete root.dataset.motionState;
    };
  }, [ref, chapter, revision, ready, reduced]);
  return reduced;
}
