import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import {
  museumEase,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

export function usePlaceExplorerMotion(
  root: RefObject<HTMLElement | null>,
  selectedId: string,
  zone: string,
  active: boolean,
) {
  const ghost = useRef<HTMLElement | null>(null);
  const lastZone = useRef(zone);
  const reduced = useMuseumReducedMotion(root);
  function prepareChange(nextZone: string) {
    const element = root.current;
    if (!element || nextZone === zone || museumMotionReduced(element)) return;
    ghost.current?.remove();
    const copy = element
      .querySelector<HTMLElement>(".md-places-scene")!
      .cloneNode(true) as HTMLElement;
    copy.className = "md-places-scene-ghost";
    copy.style.opacity = "1";
    copy.inert = true;
    copy.setAttribute("aria-hidden", "true");
    copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    copy.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
      button.disabled = true;
      button.tabIndex = -1;
    });
    element.querySelector(".md-map-stage")!.append(copy);
    ghost.current = copy;
  }
  function preview(id?: string) {
    const element = root.current;
    if (!element) return;
    if (id) element.dataset.hotspotPreview = id;
    else delete element.dataset.hotspotPreview;
  }
  useLayoutEffect(() => {
    const element = root.current!;
    const overlay = ghost.current;
    if (!active) {
      overlay?.remove();
      ghost.current = null;
      return;
    }
    delete element.dataset.hotspotPreview;
    const changedChapter = lastZone.current !== zone;
    lastZone.current = zone;
    const context = gsap.context(() => {
      if (reduced || museumMotionReduced(element)) {
        overlay?.remove();
        if (ghost.current === overlay) ghost.current = null;
        element.dataset.placeSceneMotion = "ready";
        return;
      }
      element.dataset.placeSceneMotion = "changing";
      const tl = gsap.timeline({
        onComplete: () => {
          element.dataset.placeSceneMotion = "ready";
          overlay?.remove();
          if (ghost.current === overlay) ghost.current = null;
        },
      });
      if (changedChapter) {
        tl.fromTo(
          ".md-places-scene",
          { opacity: 0 },
          { opacity: 1, duration: 0.55 },
          0,
        )
          .fromTo(
            ".md-places-scene .md-memory-point",
            { opacity: 0, scale: 0.88 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.38,
              stagger: 0.035,
              ease: museumEase,
            },
            0.12,
          )
          .fromTo(
            ".md-site-strip>button",
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.03 },
            0.2,
          );
        if (overlay) tl.to(overlay, { opacity: 0, duration: 0.5 }, 0);
      }
      tl.fromTo(
        ".md-featured-photo",
        { opacity: 0.3, scale: 1.025 },
        { opacity: 1, scale: 1, duration: 0.5, ease: museumEase },
        0,
      )
        .fromTo(
          ".md-featured-title h3>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.42, ease: museumEase },
          0.1,
        )
        .fromTo(
          ".md-featured-content>.md-mono,.md-place-observe",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.32 },
          0.16,
        );
    }, element);
    const body = element.querySelector<HTMLElement>(".md-map-body")!,
      svg = element.querySelector<SVGSVGElement>(".md-places-spatial-link")!,
      path = svg.querySelector<SVGPathElement>("path")!;
    let raf = 0,
      draw = true;
    const connect = () => {
      const point = element.querySelector<HTMLElement>(
        `.md-places-scene [data-place-id="${selectedId}"]>.md-memory-point`,
      );
      if (!point) return;
      const r = point.getBoundingClientRect(),
        b = body.getBoundingClientRect(),
        panel = element
          .querySelector<HTMLElement>(".md-featured-site")!
          .getBoundingClientRect(),
        stage = element
          .querySelector<HTMLElement>(".md-map-stage")!
          .getBoundingClientRect();
      if (
        r.right <= stage.left ||
        r.left >= stage.right ||
        r.bottom <= stage.top ||
        r.top >= stage.bottom
      ) {
        svg.style.opacity = "0";
        return;
      }
      svg.style.opacity = "1";
      svg.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
      const x = r.left + r.width / 2 - b.left,
        y = r.top + r.height / 2 - b.top;
      const endX = panel.left - b.left + 2,
        endY = panel.top - b.top + panel.height * 0.38;
      path.setAttribute(
        "d",
        `M ${x} ${y} C ${x + (endX - x) * 0.55} ${y}, ${endX - 32} ${endY}, ${endX} ${endY}`,
      );
      if (draw && !museumMotionReduced(element))
        context.add(() => {
          const length = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            {
              strokeDashoffset: 0,
              duration: 0.5,
              delay: 0.14,
              ease: museumEase,
            },
          );
        });
      draw = false;
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(connect);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    const plan = element.querySelector<HTMLElement>(".md-places-topic-plan");
    plan?.addEventListener("scroll", schedule, { passive: true });
    connect();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      plan?.removeEventListener("scroll", schedule);
      context.revert();
      overlay?.remove();
      if (ghost.current === overlay) ghost.current = null;
    };
  }, [active, selectedId, zone, reduced]);
  return { prepareChange, preview, reduced };
}
