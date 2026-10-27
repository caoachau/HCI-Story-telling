import {
  useLayoutEffect,
  useRef,
  type PointerEvent,
  type RefObject,
} from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { khmerLegacyValues, type LegacyFilter } from "./khmerLegacy";
import type { CultureLanguage } from "./khmerCulture";
import {
  museumEase,
  museumSmooth,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

gsap.registerPlugin(Flip);
export function useLegacyMosaicMotion(
  root: RefObject<HTMLElement | null>,
  filter: LegacyFilter,
  lang: CultureLanguage,
  active: boolean,
  obscured: boolean,
) {
  const reduced = useMuseumReducedMotion(root);
  const snapshot = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const beforeFilter = useRef(filter);
  const exitLayer = useRef<HTMLElement | null>(null);
  const sequence = useRef<gsap.core.Timeline | null>(null);
  const rearrange = useRef<gsap.core.Timeline | null>(null);
  const ambient = useRef<gsap.core.Timeline | null>(null);
  const pointerFrame = useRef(0);
  const pointerCard = useRef<HTMLElement | null>(null);
  const blocked = useRef(obscured);
  blocked.current = obscured;
  function pointerLeave() {
    cancelAnimationFrame(pointerFrame.current);
    const card = pointerCard.current;
    card?.style.removeProperty("--legacy-image-x");
    card?.style.removeProperty("--legacy-image-y");
    pointerCard.current = null;
    root.current?.style.removeProperty("--legacy-spot-opacity");
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType !== "mouse" ||
      reduced ||
      obscured ||
      !matchMedia("(min-width:1000px) and (hover:hover) and (pointer:fine)")
        .matches
    )
      return;
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-legacy-id]",
    );
    if (!card) {
      pointerLeave();
      return;
    }
    if (pointerCard.current !== card) pointerLeave();
    pointerCard.current = card;
    const bounds = card.getBoundingClientRect(),
      grid = event.currentTarget.getBoundingClientRect();
    const x = event.clientX,
      y = event.clientY;
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      card.style.setProperty(
        "--legacy-image-x",
        `${((x - bounds.left) / bounds.width - 0.5) * -10}px`,
      );
      card.style.setProperty(
        "--legacy-image-y",
        `${((y - bounds.top) / bounds.height - 0.5) * -8}px`,
      );
      root.current?.style.setProperty("--legacy-spot-x", `${x - grid.left}px`);
      root.current?.style.setProperty("--legacy-spot-y", `${y - grid.top}px`);
      root.current?.style.setProperty("--legacy-spot-opacity", ".055");
    });
  }
  function prepareFilter(next: LegacyFilter) {
    pointerLeave();
    const element = root.current;
    if (!element || next === filter) return;
    sequence.current?.progress(1);
    rearrange.current?.progress(1);
    exitLayer.current?.remove();
    exitLayer.current = null;
    const cards = [
      ...element.querySelectorAll<HTMLElement>("[data-legacy-id]"),
    ];
    snapshot.current = Flip.getState(cards);
    if (museumMotionReduced(element)) return;
    const area = element.getBoundingClientRect();
    const layer = document.createElement("div");
    layer.className = "md-legacy-exit-layer";
    layer.inert = true;
    layer.setAttribute("aria-hidden", "true");
    cards
      .filter((card) => next !== "all" && card.dataset.legacyGroup !== next)
      .forEach((card) => {
        const copy = card.cloneNode(true) as HTMLButtonElement,
          r = card.getBoundingClientRect();
        copy.className = "md-exhibition-card md-legacy-card-ghost";
        copy.removeAttribute("data-legacy-id");
        copy.removeAttribute("data-flip-id");
        copy.removeAttribute("style");
        copy
          .querySelectorAll("[id]")
          .forEach((node) => node.removeAttribute("id"));
        copy.disabled = true;
        copy.tabIndex = -1;
        copy.inert = true;
        Object.assign(copy.style, {
          left: `${r.left - area.left}px`,
          top: `${r.top - area.top}px`,
          width: `${r.width}px`,
          height: `${r.height}px`,
        });
        layer.append(copy);
      });
    element.append(layer);
    exitLayer.current = layer;
  }
  useLayoutEffect(() => {
    const element = root.current!,
      oldFilter = beforeFilter.current;
    beforeFilter.current = filter;
    const changed = oldFilter !== filter;
    const oldState = snapshot.current;
    snapshot.current = null;
    const ghosts = exitLayer.current;
    const cards = [
      ...element.querySelectorAll<HTMLElement>("[data-legacy-id]"),
    ];
    if (!active) {
      ghosts?.remove();
      exitLayer.current = null;
      pointerLeave();
      return;
    }
    const groups = element.querySelector<HTMLElement>(".md-filters")!,
      capsule = element.querySelector<HTMLElement>(
        ".md-legacy-filter-indicator",
      )!;
    const pillBox = (value: LegacyFilter) => {
      const box = groups
          .querySelector<HTMLElement>(`[data-legacy-filter="${value}"]`)!
          .getBoundingClientRect(),
        r = groups.getBoundingClientRect();
      return {
        x: box.left - r.left,
        y: box.top - r.top,
        width: box.width,
        height: box.height,
      };
    };
    gsap.set(capsule, pillBox(changed ? oldFilter : filter));
    let disposed = false;
    const capture = () => {
      if (!disposed) snapshot.current = Flip.getState(cards);
    };
    const context = gsap.context(() => {
      if (reduced || museumMotionReduced(element)) {
        gsap.set(capsule, pillBox(filter));
        ghosts?.remove();
        exitLayer.current = null;
        element.dataset.legacyMotion = "ready";
        capture();
        return;
      }
      element.dataset.legacyMotion = changed ? "rearranging" : "opening";
      const finish = () => {
        if (disposed) return;
        element.dataset.legacyMotion = "ready";
        ghosts?.remove();
        if (exitLayer.current === ghosts) exitLayer.current = null;
        capture();
      };
      if (changed) {
        gsap.to(capsule, {
          ...pillBox(filter),
          duration: 0.45,
          ease: museumEase,
        });
        if (ghosts)
          gsap.to(ghosts.children, {
            opacity: 0,
            y: filter === "history" ? 0 : 16,
            x: filter === "history" ? -18 : 0,
            scale: 0.94,
            duration: 0.28,
            ease: museumSmooth,
          });
        rearrange.current = Flip.from(oldState ?? Flip.getState(cards), {
          targets: cards,
          scale: true,
          absolute: false,
          duration: 0.65,
          ease: museumEase,
          prune: true,
          onEnter: (entering) =>
            gsap.fromTo(
              entering,
              { opacity: 0, y: filter === "continuity" ? 20 : 12, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                delay: 0.12,
                stagger: 0.04,
                ease: museumEase,
                clearProps: "opacity,transform",
              },
            ),
          onComplete: finish,
        });
      } else {
        const tl = gsap.timeline({ onComplete: finish });
        sequence.current = tl;
        tl.fromTo(
          ".md-legacy-title-part>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.5, stagger: 0.09, ease: museumEase },
          0,
        )
          .fromTo(
            ".md-legacy-title-rule",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.55, ease: museumEase },
            0.16,
          )
          .fromTo(
            ".md-exhibitions-content>p:not(.md-sr-only)",
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.35 },
            0.14,
          )
          .fromTo(
            groups,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, ease: museumEase },
            0.25,
          );
        const order =
          cards.length === 6
            ? [0, 1, 4, 2, 3, 5]
            : cards.map((_, index) => index);
        order.forEach((index, step) =>
          tl.fromTo(
            cards[index],
            { opacity: 0, y: 24, scale: 0.97, filter: "blur(3px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 0.7,
              ease: museumEase,
              clearProps: "opacity,transform,filter",
            },
            0.42 + step * 0.08,
          ),
        );
        const traces =
          cards.length === 6
            ? [0, 1, 2, 5, 4, 3]
            : cards.map((_, index) => index);
        traces.forEach((index, step) =>
          tl.fromTo(
            cards[index].querySelector(".md-legacy-card-trace"),
            { opacity: 0 },
            {
              opacity: 0.28,
              duration: 0.16,
              yoyo: true,
              repeat: 1,
              clearProps: "opacity",
            },
            1.6 + step * 0.1,
          ),
        );
        const footer = element
          .closest(".md-root")
          ?.querySelector(".md-footer>button[data-section=exhibitions]");
        if (footer)
          tl.fromTo(
            footer,
            { boxShadow: "0 0 0px #dfbb7900" },
            {
              boxShadow: "0 0 12px #dfbb7980",
              duration: 0.25,
              repeat: 1,
              yoyo: true,
              clearProps: "boxShadow",
            },
            1.05,
          );
      }
      ambient.current = gsap.timeline({ delay: changed ? 0 : 1.45 });
      ambient.current
        .fromTo(
          ".md-legacy-texture",
          { x: 0, scale: 1.02 },
          { x: -15, scale: 1.015, duration: 20, ease: "sine.inOut" },
          0,
        )
        .fromTo(
          ".md-legacy-light-sweep",
          { xPercent: -35, opacity: 0.02 },
          {
            xPercent: 35,
            opacity: 0.06,
            duration: 4,
            repeat: 1,
            yoyo: true,
            ease: "sine.inOut",
          },
          0.15,
        );
      if (blocked.current || document.hidden) ambient.current.pause();
    }, element);
    const visibility = () =>
      document.hidden || blocked.current
        ? ambient.current?.pause()
        : ambient.current?.resume();
    let lastWidth = element.clientWidth,
      lastHeight = element.clientHeight;
    const observer = new ResizeObserver(() => {
      if (
        lastWidth === element.clientWidth &&
        lastHeight === element.clientHeight
      )
        return;
      lastWidth = element.clientWidth;
      lastHeight = element.clientHeight;
      sequence.current?.progress(1);
      rearrange.current?.progress(1);
      gsap.set(capsule, pillBox(filter));
      capture();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      pointerLeave();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      context.revert();
      sequence.current = null;
      rearrange.current = null;
      ambient.current = null;
      ghosts?.remove();
      if (exitLayer.current === ghosts) exitLayer.current = null;
      element.dataset.legacyMotion = "ready";
    };
  }, [root, filter, lang, active, reduced]);
  useLayoutEffect(() => {
    if (!active || obscured || reduced) {
      pointerLeave();
      ambient.current?.pause();
      if (obscured) {
        sequence.current?.progress(1);
        rearrange.current?.progress(1);
      }
    } else if (!document.hidden) ambient.current?.resume();
  }, [active, obscured, reduced]);
  return { reduced, prepareFilter, pointerMove, pointerLeave };
}
