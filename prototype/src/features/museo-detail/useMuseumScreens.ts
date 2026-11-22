import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { restoredParams, updateRoute, useRememberedState } from '../../experience/state';
import { gsap } from "gsap";
import {
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

export const museumScreens = [
  { id: "overview", vi: "Tổng quan", en: "Site overview" },
  { id: "map", vi: "Bản đồ", en: "Interactive map" },
  { id: "timeline", vi: "Lịch sử", en: "History" },
  { id: "tour", vi: "Văn hóa", en: "Living heritage" },
  { id: "exhibitions", vi: "Di sản", en: "Heritage values" },
] as const;

export type MuseumSection = (typeof museumScreens)[number]["id"];

export function useMuseumScreens(
  viewport: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onContentChange?: () => void,
  visible = true,
) {
  const initial = restoredParams('bao-tang-khmer');
  const first = museumScreens.find(screen => screen.id === initial.get('section'))?.id || 'overview';
  const [rememberedSection, setActiveSection] = useRememberedState<MuseumSection | 'hero'>('museum:section', first, initial.has('section'));
  // Old links and saved sessions may still name the removed introductory screen.
  const activeSection = museumScreens.find(screen => screen.id === rememberedSection)?.id ?? 'overview';
  useEffect(() => { if (rememberedSection !== activeSection) setActiveSection(activeSection); }, [rememberedSection, activeSection]);
  const current = useRef<MuseumSection>(activeSection);
  const reduced = useMuseumReducedMotion(viewport);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const transitioning = useRef(false);
  const desired = useRef<MuseumSection>(activeSection);
  useEffect(() => { updateRoute({ section: activeSection }, 'bao-tang-khmer'); }, [activeSection]);
  const queued = useRef<MuseumSection | null>(null);
  const previous = useRef<MuseumSection | null>(null);
  const outgoingNode = useRef<HTMLElement | null>(null);
  const restoreFocus = useRef(false);
  const showRef = useRef<(section: MuseumSection) => void>(() => {});
  const touch = useRef<{ x: number; y: number; atTop: boolean; atBottom: boolean } | null>(null);

  const clearOutgoing = useCallback(() => {
    const node = outgoingNode.current;
    if (!node) return;
    node.hidden = node.id !== `museo-${current.current}`;
    node.inert = false;
    node.removeAttribute("aria-hidden");
    delete node.dataset.roomOutgoing;
    gsap.set(node, { clearProps: "opacity,transform,willChange" });
    outgoingNode.current = null;
  }, []);

  const showSection = useCallback((section: MuseumSection, focus = false) => {
    desired.current = section;
    if (focus) restoreFocus.current = true;
    if (transitioning.current) { queued.current = section; return; }
    const element = viewport.current;
    const outgoing = element?.querySelector<HTMLElement>(`#museo-${current.current}`);
    if (current.current === section) {
      if (focus) outgoing?.focus({ preventScroll: true });
      restoreFocus.current = false;
      return;
    }
    restoreFocus.current ||= !!outgoing?.contains(document.activeElement);
    const animate = !!outgoing && !!element && !museumMotionReduced(element) && visible;
    previous.current = animate ? current.current : null;
    transitioning.current = animate;
    if (element && animate) {
      element.dataset.roomMotion = "entering";
      element.setAttribute("aria-busy", "true");
    }
    // Commit both retained rooms together, then crossfade in layout effect.
    // There is no fade-to-black, scale step or full-screen dark sweep.
    current.current = section;
    flushSync(() => setActiveSection(section));
    onContentChange?.();
  }, [onContentChange, viewport, visible]);
  showRef.current = showSection;

  useLayoutEffect(() => {
    const element = viewport.current;
    const section = element?.querySelector<HTMLElement>(`#museo-${activeSection}`);
    if (!element || !section) return;
    if (section.scrollTop) section.scrollTop = 0;
    if (restoreFocus.current) {
      section.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
    const before = previous.current;
    previous.current = null;
    if (!before) return;
    const outgoing = element.querySelector<HTMLElement>(`#museo-${before}`);
    if (!outgoing) { transitioning.current = false; element.dataset.roomMotion = "idle"; element.setAttribute("aria-busy", "false"); return; }
    outgoingNode.current = outgoing;
    // Keep the actual previous room painted, but outside focus and reading order.
    outgoing.hidden = false;
    outgoing.inert = true;
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.dataset.roomOutgoing = "true";
    const duration = element.clientWidth < 1000 ? .38 : .48;
    gsap.set(outgoing, { opacity: 1, willChange: "opacity" });
    gsap.set(section, { opacity: 0, y: 8, willChange: "opacity,transform" });
    animation.current = gsap.timeline({
      onComplete: () => {
        clearOutgoing();
        gsap.set(section, { clearProps: "opacity,transform,willChange" });
        transitioning.current = false;
        element.dataset.roomMotion = "idle";
        element.setAttribute("aria-busy", "false");
        const next = queued.current;
        queued.current = null;
        if (next) showRef.current(next);
      },
    })
      .to(section, { opacity: 1, y: 0, duration, ease: "power2.inOut" }, 0)
      .to(outgoing, { opacity: 0, duration: duration * .45, ease: "power1.in" }, duration * .55);
  }, [activeSection, clearOutgoing, viewport]);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element || (!reduced && visible)) return;
    animation.current?.kill();
    clearOutgoing();
    transitioning.current = false;
    previous.current = null;
    queued.current = null;
    element.dataset.roomMotion = "idle";
    element.setAttribute("aria-busy", "false");
    gsap.set(element.querySelectorAll(".md-section"), { clearProps: "opacity,transform,willChange" });
    if (current.current !== desired.current) {
      current.current = desired.current;
      setActiveSection(desired.current);
    }
  }, [reduced, visible, viewport, clearOutgoing]);

  useEffect(() => () => { animation.current?.kill(); clearOutgoing(); }, [clearOutgoing]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || !enabled || !visible) return;
    const keyboardTarget = element.parentElement ?? element;
    const active = () =>
      element.querySelector<HTMLElement>(`#museo-${current.current}`);
    const move = (direction: number) => {
      const index = museumScreens.findIndex(
        (screen) => screen.id === current.current,
      );
      const next = museumScreens[index + direction];
      if (next) showSection(next.id);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea, select, [contenteditable=true]")
      )
        return;
      if (event.key === "PageDown" || event.key === "PageUp") {
        event.preventDefault();
        move(event.key === "PageDown" ? 1 : -1);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      const section = active();
      if (event.touches.length !== 1 || !section) {
        touch.current = null;
        return;
      }
      let nested = event.target instanceof HTMLElement ? event.target : null;
      while (nested && nested !== section && nested !== element) {
        if (
          nested.scrollHeight > nested.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(nested).overflowY)
        ) {
          touch.current = null;
          return;
        }
        nested = nested.parentElement;
      }
      touch.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        atTop: section.scrollTop <= 1,
        atBottom:
          section.scrollTop + section.clientHeight >= section.scrollHeight - 2,
      };
    };
    const onTouchEnd = (event: TouchEvent) => {
      const start = touch.current;
      touch.current = null;
      if (!start || !event.changedTouches[0]) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dy) < 70 || Math.abs(dy) < Math.abs(dx) * 1.4) return;
      if (dy < 0 && start.atBottom) move(1);
      if (dy > 0 && start.atTop) move(-1);
    };
    const onTouchCancel = () => {
      touch.current = null;
    };
    keyboardTarget.addEventListener("keydown", onKeyDown);
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      keyboardTarget.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [viewport, enabled, visible, showSection]);

  return { activeSection, showSection };
}
