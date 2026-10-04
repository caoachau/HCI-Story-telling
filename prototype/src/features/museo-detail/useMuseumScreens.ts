import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

export const museumScreens = [
  { id: "hero", vi: "Giới thiệu", en: "Introduction" },
  { id: "overview", vi: "Tổng quan", en: "Site overview" },
  { id: "map", vi: "Bản đồ", en: "Interactive map" },
  { id: "timeline", vi: "Lịch sử", en: "Human evolution" },
  { id: "tour", vi: "Khám phá", en: "Cave gallery" },
  { id: "exhibitions", vi: "Trưng bày", en: "Exhibitions" },
] as const;

export type MuseumSection = (typeof museumScreens)[number]["id"];

export function useMuseumScreens(
  viewport: RefObject<HTMLDivElement | null>,
  enabled: boolean,
  onContentChange?: () => void,
) {
  const [activeSection, setActiveSection] = useState<MuseumSection>("hero");
  const current = useRef<MuseumSection>("hero");
  const wheel = useRef({ last: 0, changed: 0, distance: 0 });
  const touch = useRef<{
    x: number;
    y: number;
    atTop: boolean;
    atBottom: boolean;
  } | null>(null);

  const showSection = useCallback(
    (section: MuseumSection) => {
      if (current.current === section) return;
      current.current = section;
      setActiveSection(section);
      onContentChange?.();
    },
    [onContentChange],
  );

  useEffect(() => {
    const section = viewport.current?.querySelector<HTMLElement>(
      `#museo-${activeSection}`,
    );
    if (section) section.scrollTop = 0;
  }, [activeSection, viewport]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || !enabled) return;
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
      const section = active();
      if (!section) return;
      const now = performance.now();
      const previous = wheel.current.last;
      wheel.current.last = now;
      // Consume the tail of one wheel/trackpad gesture after changing a screen.
      if (
        wheel.current.changed &&
        (now - wheel.current.changed < 650 || now - previous < 160)
      ) {
        event.preventDefault();
        return;
      }
      let nested = event.target instanceof HTMLElement ? event.target : null;
      while (nested && nested !== section && nested !== element) {
        if (
          nested.scrollHeight > nested.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(nested).overflowY)
        )
          return;
        nested = nested.parentElement;
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
  }, [viewport, enabled, showSection]);

  return { activeSection, showSection };
}
