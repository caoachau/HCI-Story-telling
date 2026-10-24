import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import {
  museumEase,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

export const museumScreens = [
  { id: "hero", vi: "Giới thiệu", en: "Introduction" },
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
  const [activeSection, setActiveSection] = useState<MuseumSection>("hero");
  const current = useRef<MuseumSection>("hero");
  const reduced = useMuseumReducedMotion(viewport);
  const animation = useRef<gsap.core.Tween | null>(null);
  const sweepAnimation = useRef<gsap.core.Tween | null>(null);
  const transitioning = useRef(false);
  const desired = useRef<MuseumSection>("hero");
  const queued = useRef<MuseumSection | null>(null);
  const entering = useRef(false);
  const restoreFocus = useRef(false);
  const hasShownScreen = useRef(false);
  const showRef = useRef<(section: MuseumSection) => void>(() => {});
  const wheel = useRef({ last: 0, changed: 0, distance: 0 });
  const touch = useRef<{
    x: number;
    y: number;
    atTop: boolean;
    atBottom: boolean;
  } | null>(null);

  const showSection = useCallback(
    (section: MuseumSection, focus = false) => {
      desired.current = section;
      const element = viewport.current;
      const outgoing = element?.querySelector<HTMLElement>(
        `#museo-${current.current}`,
      );
      if (focus) restoreFocus.current = true;
      if (transitioning.current) {
        queued.current = section;
        return;
      }
      if (current.current === section) {
        if (focus) outgoing?.focus({ preventScroll: true });
        restoreFocus.current = false;
        return;
      }
      restoreFocus.current ||= !!outgoing?.contains(document.activeElement);
      const commit = () => {
        current.current = section;
        setActiveSection(section);
        onContentChange?.();
      };
      if (!outgoing || !element || museumMotionReduced(element) || !visible) {
        commit();
        return;
      }
      transitioning.current = true;
      element.dataset.roomMotion = "leaving";
      element.setAttribute("aria-busy", "true");
      const compact = element.clientWidth < 1000;
      const sweep = element.querySelector(".md-room-sweep");
      if (sweep) {
        sweepAnimation.current?.kill();
        sweepAnimation.current = gsap.fromTo(
          sweep,
          { xPercent: -110, opacity: 1 },
          {
            xPercent: 210,
            duration: compact ? 0.55 : 0.85,
            ease: museumEase,
            onComplete: () => {
              gsap.set(sweep, { opacity: 0 });
            },
          },
        );
      }
      animation.current = gsap.to(outgoing, {
        scale: 0.985,
        opacity: 0.35,
        duration: compact ? 0.16 : 0.26,
        ease: museumEase,
        onComplete: () => {
          entering.current = true;
          flushSync(commit);
        },
      });
    },
    [onContentChange, viewport, visible],
  );
  showRef.current = showSection;

  useLayoutEffect(() => {
    const section = viewport.current?.querySelector<HTMLElement>(
      `#museo-${activeSection}`,
    );
    if (!section) return;
    // A freshly mounted screen is already at zero. Assigning scrollTop here
    // forces the whole new container-query layout during the opening commit.
    if (hasShownScreen.current) section.scrollTop = 0;
    hasShownScreen.current = true;
    if (restoreFocus.current) {
      section.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
    if (!entering.current) return;
    entering.current = false;
    const element = viewport.current!;
    element.dataset.roomMotion = "entering";
    const outgoing = element.querySelectorAll<HTMLElement>(
      ".md-section[hidden]",
    );
    gsap.set(outgoing, { clearProps: "transform,opacity" });
    animation.current = gsap.fromTo(
      section,
      { opacity: 0, y: element.clientWidth < 1000 ? 24 : 44 },
      {
        opacity: 1,
        y: 0,
        duration: element.clientWidth < 1000 ? 0.4 : 0.56,
        ease: museumEase,
        clearProps: "transform,opacity",
        onComplete: () => {
          transitioning.current = false;
          element.dataset.roomMotion = "idle";
          element.setAttribute("aria-busy", "false");
          const next = queued.current;
          queued.current = null;
          if (next) showRef.current(next);
        },
      },
    );
  }, [activeSection, viewport]);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element || (!reduced && visible)) return;
    animation.current?.kill();
    sweepAnimation.current?.kill();
    transitioning.current = false;
    entering.current = false;
    queued.current = null;
    element.dataset.roomMotion = "idle";
    element.setAttribute("aria-busy", "false");
    gsap.set(element.querySelectorAll(".md-section"), {
      clearProps: "transform,opacity",
    });
    gsap.set(element.querySelector(".md-room-sweep"), { opacity: 0 });
    if (current.current !== desired.current) {
      current.current = desired.current;
      setActiveSection(desired.current);
    }
  }, [reduced, visible, viewport]);

  useEffect(
    () => () => {
      animation.current?.kill();
      sweepAnimation.current?.kill();
    },
    [],
  );

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
    const onWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        !event.deltaY
      )
        return;
      if (transitioning.current) {
        event.preventDefault();
        return;
      }
      const section = active();
      if (!section) return;
      const now = performance.now();
      const previous = wheel.current.last;
      wheel.current.last = now;
      let nested = event.target instanceof HTMLElement ? event.target : null;
      while (nested && nested !== section && nested !== element) {
        if (
          nested.scrollHeight > nested.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(nested).overflowY)
        )
          return;
        nested = nested.parentElement;
      }
      // A nested collection always owns its wheel; suppress gesture tails only
      // when the gesture would move between entire museum rooms.
      if (
        wheel.current.changed &&
        (now - wheel.current.changed < 900 || now - previous < 160)
      ) {
        event.preventDefault();
        return;
      }
      const atEdge =
        event.deltaY > 0
          ? section.scrollTop + section.clientHeight >= section.scrollHeight - 2
          : section.scrollTop <= 1;
      if (!atEdge) {
        wheel.current.distance = 0;
        wheel.current.changed = 0;
        return;
      }
      event.preventDefault();
      if (
        now - previous > 160 ||
        Math.sign(wheel.current.distance) !== Math.sign(event.deltaY)
      )
        wheel.current.distance = 0;
      wheel.current.distance +=
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? section.clientHeight
            : 1);
      if (Math.abs(wheel.current.distance) < 35) return;
      move(Math.sign(event.deltaY));
      wheel.current.changed = now;
      wheel.current.distance = 0;
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
    element.addEventListener("wheel", onWheel, { passive: false });
    keyboardTarget.addEventListener("keydown", onKeyDown);
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchend", onTouchEnd, { passive: true });
    element.addEventListener("touchcancel", onTouchCancel, { passive: true });
    return () => {
      element.removeEventListener("wheel", onWheel);
      keyboardTarget.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchend", onTouchEnd);
      element.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [viewport, enabled, visible, showSection]);

  return { activeSection, showSection };
}
