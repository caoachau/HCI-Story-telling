import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import {
  khmerHistoryPhases,
  khmerHistoryPhotos,
  type HistoryLanguage,
} from "./khmerHistory";
import {
  museumEase,
  museumSmooth,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

/** Each period is one composition. Decorative outgoing layers never own focus. */
export function useHistoryTimelineMotion(
  root: RefObject<HTMLElement | null>,
  selected: number,
  lang: HistoryLanguage,
  active: boolean,
) {
  const reduced = useMuseumReducedMotion(root);
  const direction = useRef<number | undefined>(undefined);
  const previous = useRef<{
    index: number;
    title: string;
    range: string;
    photo: string;
  } | null>(null);
  useLayoutEffect(() => {
    const element = root.current!;
    const phase = khmerHistoryPhases[selected];
    const before = previous.current;
    previous.current = {
      index: selected,
      title: phase.title[lang],
      range: phase.range,
      photo: khmerHistoryPhotos[phase.photo].src,
    };
    const sign =
      direction.current ??
      (Math.sign(selected - (before?.index ?? selected)) || 1);
    direction.current = undefined;
    element.dataset.historyMotion = "ready";
    if (!active) return;

    const track = element.querySelector<HTMLElement>(".md-era-track")!;
    const rail = element.querySelector<HTMLElement>(".md-history-rail")!;
    const progress = element.querySelector<HTMLElement>(
      ".md-history-progress",
    )!;
    const dots = [...element.querySelectorAll<HTMLElement>(".md-history-dot")];
    const image = element.querySelector<HTMLImageElement>(".md-era-scene")!;
    const changing = !!before && before.index !== selected;
    const still = reduced || museumMotionReduced(element);
    const ghosts: HTMLElement[] = [];
    let disposed = false,
      contentFinished = still,
      imageFinished = still;
    const finish = () => {
      if (!disposed && contentFinished && imageFinished)
        element.dataset.historyMotion = "ready";
    };
    const removeGhost = (node: HTMLElement | undefined) => node?.remove();
    const textGhost = (selector: string, text: string, className: string) => {
      const node = document.createElement("span");
      node.className = className;
      node.textContent = text;
      node.setAttribute("aria-hidden", "true");
      node.inert = true;
      element.querySelector(selector)!.append(node);
      ghosts.push(node);
      return node;
    };
    const distanceTo = (index: number) => {
      const first = dots[0].getBoundingClientRect();
      const dot = dots[index].getBoundingClientRect();
      return dot.left + dot.width / 2 - first.left - first.width / 2;
    };
    const measure = (animate: boolean) => {
      const bounds = track.getBoundingClientRect();
      const first = dots[0].getBoundingClientRect();
      const last = dots.at(-1)!.getBoundingClientRect();
      const railWidth = last.left + last.width / 2 - first.left - first.width / 2;
      rail.style.left = `${first.left + first.width / 2 - bounds.left + track.scrollLeft}px`;
      rail.style.top = `${first.top + first.height / 2 - bounds.top}px`;
      rail.style.width = `${railWidth}px`;
      // Progress ends at the selected dot, including after resizing or scrolling.
      const target = distanceTo(selected);
      if (!animate) {
        gsap.killTweensOf(progress);
        progress.style.width = `${target}px`;
      }
      return target;
    };
    const target = measure(!still);
    let oldTitle: HTMLElement | undefined,
      oldYear: HTMLElement | undefined,
      oldImage: HTMLImageElement | undefined;
    if (!still && changing) {
      oldTitle = textGhost(
        ".md-history-title-mask",
        before.title,
        "md-history-title-previous",
      );
      oldYear = textGhost(
        ".md-history-year-mask",
        before.range,
        "md-history-year-previous",
      );
      if (before.photo !== image.getAttribute("src")) {
        oldImage = image.cloneNode(false) as HTMLImageElement;
        oldImage.src = before.photo;
        oldImage.alt = "";
        oldImage.className = "md-era-scene md-history-image-previous";
        oldImage.removeAttribute("style");
        oldImage.setAttribute("aria-hidden", "true");
        oldImage.inert = true;
        image.parentElement!.append(oldImage);
        ghosts.push(oldImage);
      }
    }
    const context = gsap.context(() => {
      if (still) return;
      element.dataset.historyMotion = changing ? "changing" : "opening";
      const sequence = gsap.timeline({
        onComplete: () => {
          contentFinished = true;
          finish();
        },
      });
      sequence.fromTo(
        progress,
        {
          width: changing ? distanceTo(before.index) : 0,
        },
        { width: target, duration: 0.65, ease: museumSmooth },
        0,
      );
      if (!changing) {
        sequence.fromTo(
          ".md-evolution-copy,.md-evolution-note",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, ease: museumEase, stagger: 0.07 },
          0,
        );
      }
      if (oldTitle)
        sequence.to(
          oldTitle,
          {
            yPercent: -110 * sign,
            duration: 0.3,
            ease: museumSmooth,
            onComplete: () => removeGhost(oldTitle),
          },
          0.08,
        );
      if (oldYear)
        sequence.to(
          oldYear,
          {
            yPercent: -110 * sign,
            duration: 0.36,
            ease: museumSmooth,
            onComplete: () => removeGhost(oldYear),
          },
          0.06,
        );
      sequence
        .fromTo(
          ".md-history-year-current",
          { yPercent: 110 * sign },
          { yPercent: 0, duration: 0.48, ease: museumEase },
          0.18,
        )
        .fromTo(
          ".md-history-title-current",
          { yPercent: 110 * sign },
          { yPercent: 0, duration: 0.5, ease: museumEase },
          0.2,
        )
        .fromTo(
          ".md-era-kicker,.md-era-description,.md-era-preview",
          { opacity: 0, y: 7 },
          {
            opacity: 1,
            y: 0,
            duration: 0.36,
            stagger: 0.025,
            ease: museumEase,
          },
          0.27,
        )
        .fromTo(
          ".md-era-facts>div",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            stagger: 0.045,
            ease: museumEase,
          },
          0.39,
        )
        .fromTo(
          ".md-era-highlights-heading,.md-era-highlights-list>button:nth-child(-n+3)",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.025, ease: museumEase },
          0.48,
        )
        .fromTo(
          ".md-africa-caption",
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          0.42,
        );
    }, element);

    const revealImage = () => {
      if (disposed || still) return;
      context.add(() => {
        const fade = gsap.timeline({
          delay: changing ? 0.18 : 0,
          onComplete: () => {
            oldImage?.remove();
            imageFinished = true;
            finish();
          },
        });
        fade.fromTo(
          image,
          { opacity: oldImage ? 0 : 0.65, scale: 1.025 },
          { opacity: 1, scale: 1, duration: 0.62, ease: museumEase },
        );
        if (oldImage) fade.to(oldImage, { opacity: 0, duration: 0.6 }, 0);
      });
    };
    const failedImage = () => {
      oldImage?.remove();
      imageFinished = true;
      finish();
    };
    if (!still) {
      if (image.complete) {
        if (image.naturalWidth > 0) revealImage();
        else failedImage();
      } else {
        image.addEventListener("load", revealImage, { once: true });
        image.addEventListener("error", failedImage, { once: true });
      }
    }
    // Resizing changes the geometry, not the active story. The line follows the actual dots.
    let frame = 0,
      lastWidth = track.clientWidth,
      lastHeight = track.clientHeight;
    const observer = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth && track.clientHeight === lastHeight)
        return;
      lastWidth = track.clientWidth;
      lastHeight = track.clientHeight;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => measure(false));
    });
    observer.observe(track);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      image.removeEventListener("load", revealImage);
      image.removeEventListener("error", failedImage);
      context.revert();
      ghosts.forEach((node) => node.remove());
      element.dataset.historyMotion = "ready";
    };
  }, [root, selected, lang, active, reduced]);
  return {
    reduced,
    setDirection: (value: number) => {
      direction.current = value || 1;
    },
  };
}
