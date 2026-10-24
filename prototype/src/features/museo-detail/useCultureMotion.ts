import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import {
  khmerCultureTopics,
  khmerCulturePhotos,
  type CultureLanguage,
} from "./khmerCulture";
import {
  museumEase,
  museumSmooth,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

type Intent = { id: string; bounds?: DOMRect; direction: number };
type Snapshot = {
  id: string;
  group: string;
  photo: string;
  title: string;
  index: string;
  total: string;
};

export function useCultureMotion(
  root: RefObject<HTMLElement | null>,
  id: string,
  lang: CultureLanguage,
  active: boolean,
  obscured: boolean,
) {
  const reduced = useMuseumReducedMotion(root);
  const previous = useRef<Snapshot | null>(null);
  const intent = useRef<Intent | null>(null);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const previewImage = useRef<HTMLImageElement | null>(null);
  const ambient = useRef<gsap.core.Tween | null>(null);
  const settle = useRef<(() => void) | null>(null);
  const blocked = useRef(obscured);
  blocked.current = obscured;
  const clearPreview = () => {
    clearTimeout(previewTimer.current);
    const node = previewImage.current;
    if (node) {
      gsap.killTweensOf(node);
      node.remove();
    }
    previewImage.current = null;
    if (root.current) delete root.current.dataset.culturePreview;
  };
  const preview = (next?: string) => {
    clearPreview();
    const element = root.current;
    if (
      !next ||
      next === id ||
      !active ||
      obscured ||
      museumMotionReduced(element) ||
      !element ||
      element.dataset.cultureMotion !== "ready"
    )
      return;
    previewTimer.current = setTimeout(() => {
      const topic = khmerCultureTopics.find((item) => item.id === next);
      if (!topic || !element.isConnected || element.hidden || blocked.current)
        return;
      const img = document.createElement("img");
      img.src = khmerCulturePhotos[topic.gallery[0]].src;
      img.alt = "";
      img.className = "md-culture-preview-image";
      img.setAttribute("aria-hidden", "true");
      img.inert = true;
      img.style.opacity = "0";
      previewImage.current = img;
      element.querySelector(".md-culture-camera")!.append(img);
      const show = () => {
        if (previewImage.current !== img || blocked.current) return;
        element.dataset.culturePreview = next;
        gsap.to(img, { opacity: 0.12, duration: 0.3, ease: museumEase });
      };
      if (img.complete && img.naturalWidth) show();
      else img.addEventListener("load", show, { once: true });
    }, 280);
  };
  const prepare = (next: string, origin?: HTMLElement, direction = 1) => {
    clearPreview();
    const button =
      origin ??
      root.current?.querySelector<HTMLElement>(
        `.md-gallery-strip [data-culture-photo="${next}"]`,
      );
    const photo = button?.querySelector<HTMLImageElement>("img");
    const bounds = photo?.getBoundingClientRect();
    const clip = button
      ?.closest(".md-gallery-strip,.md-tour-photo-track")
      ?.getBoundingClientRect();
    const visible =
      bounds &&
      bounds.width > 0 &&
      bounds.height > 0 &&
      bounds.right > 0 &&
      bounds.left < innerWidth &&
      (!clip || (bounds.right > clip.left + 8 && bounds.left < clip.right - 8));
    intent.current = {
      id: next,
      bounds:
        photo?.complete && photo.naturalWidth > 0 && visible
          ? bounds
          : undefined,
      direction: direction || 1,
    };
  };

  useLayoutEffect(() => {
    const element = root.current!;
    const topic = khmerCultureTopics.find((item) => item.id === id)!;
    const collection = khmerCultureTopics.filter(
      (item) => item.group === topic.group,
    );
    const before = previous.current;
    const current: Snapshot = {
      id,
      group: topic.group,
      photo: khmerCulturePhotos[topic.gallery[0]].src,
      title: topic.title[lang],
      index: String(collection.indexOf(topic) + 1).padStart(2, "0"),
      total: String(collection.length).padStart(2, "0"),
    };
    previous.current = current;
    const request = intent.current?.id === id ? intent.current : null;
    intent.current = null;
    clearPreview();
    element.dataset.cultureMotion = "ready";
    if (!active) return;
    const camera = element.querySelector<HTMLElement>(".md-culture-camera")!;
    const image = element.querySelector<HTMLImageElement>(".md-tour-art")!;
    const frame = element.querySelector<HTMLElement>(".md-tour-frame")!;
    const groups = element.querySelector<HTMLElement>(".md-culture-groups")!;
    const indicator = element.querySelector<HTMLElement>(
      ".md-culture-lens-indicator",
    )!;
    const gallery = element.querySelector<HTMLElement>(".md-gallery-strip")!;
    const progress = element.querySelector<HTMLElement>(
      ".md-culture-rail-progress i",
    )!;
    const changing = !!before && before.id !== id;
    const groupChanged = changing && before.group !== topic.group;
    const still = reduced || museumMotionReduced(element) || blocked.current;
    const direction = request?.direction ?? 1;
    const delay = groupChanged ? 0.2 : 0;
    const ghosts: HTMLElement[] = [];
    let disposed = false,
      settled = false,
      contentFinished = still,
      imageFinished = still;
    let sequence: gsap.core.Timeline | undefined,
      photograph: gsap.core.Timeline | undefined;
    const pauseAmbient = () => {
      if (blocked.current || document.hidden) ambient.current?.pause();
      else ambient.current?.resume();
    };
    const finish = () => {
      if (disposed || settled || !contentFinished || !imageFinished) return;
      element.dataset.cultureMotion = "ready";
      context.add(() => {
        ambient.current = gsap.fromTo(
          camera,
          { scale: 1, x: 0 },
          {
            scale: 1.025,
            x: -Math.min(12, frame.clientWidth * 0.008),
            duration: 12,
            ease: "sine.inOut",
          },
        );
        pauseAmbient();
      });
    };
    const textGhost = (selector: string, text: string, className: string) => {
      const node = document.createElement("span");
      node.textContent = text;
      node.className = className;
      node.inert = true;
      node.setAttribute("aria-hidden", "true");
      element.querySelector(selector)!.append(node);
      ghosts.push(node);
      return node;
    };
    let oldTitle: HTMLElement | undefined,
      oldIndex: HTMLElement | undefined,
      oldTotal: HTMLElement | undefined,
      oldImage: HTMLImageElement | undefined;
    if (!still && changing) {
      oldTitle = textGhost(
        ".md-culture-story-mask",
        before.title,
        "md-culture-story-previous",
      );
      oldIndex = textGhost(
        ".md-culture-index-mask",
        before.index,
        "md-culture-index-previous",
      );
      if (before.total !== current.total)
        oldTotal = textGhost(
          ".md-culture-total-mask",
          before.total,
          "md-culture-total-previous",
        );
      oldImage = document.createElement("img");
      oldImage.src = before.photo;
      oldImage.alt = "";
      oldImage.className = "md-culture-image-previous";
      oldImage.inert = true;
      oldImage.setAttribute("aria-hidden", "true");
      camera.append(oldImage);
      ghosts.push(oldImage);
    }
    const lens = (animate: boolean) => {
      const box = groups
        .querySelector<HTMLElement>(`[data-culture-group="${topic.group}"]`)!
        .getBoundingClientRect();
      const area = groups.getBoundingClientRect();
      const result = {
        x: box.left - area.left,
        y: box.top - area.top,
        width: box.width,
        height: box.height,
      };
      if (!animate) gsap.set(indicator, result);
      return result;
    };
    const targetLens = lens(!still);
    if (!still) {
      const oldButton = groups
        .querySelector<HTMLElement>(
          `[data-culture-group="${before?.group ?? topic.group}"]`,
        )!
        .getBoundingClientRect();
      const groupBox = groups.getBoundingClientRect();
      gsap.set(indicator, {
        x: oldButton.left - groupBox.left,
        y: oldButton.top - groupBox.top,
        width: oldButton.width,
        height: oldButton.height,
      });
    }
    const updateRail = () => {
      progress.style.width = `${Math.min(100, ((gallery.scrollLeft + gallery.clientWidth) / Math.max(1, gallery.scrollWidth)) * 100)}%`;
    };
    updateRail();
    element.style.setProperty(
      "--culture-position",
      `${((collection.indexOf(topic) + 1) / collection.length) * 100}%`,
    );
    const context = gsap.context(() => {
      if (still) return;
      element.dataset.cultureMotion = changing ? "changing" : "opening";
      sequence = gsap.timeline({
        onComplete: () => {
          contentFinished = true;
          finish();
        },
      });
      if (!changing) {
        sequence
          .fromTo(
            ".md-culture-curtain",
            { opacity: 0.35 },
            { opacity: 1, duration: 0.6 },
            0.25,
          )
          .fromTo(
            ".md-tour-copy>.md-eyebrow",
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4 },
            0.3,
          )
          .fromTo(
            ".md-culture-title-text",
            { yPercent: 115 },
            { yPercent: 0, duration: 0.65, stagger: 0.08, ease: museumEase },
            0.38,
          )
          .fromTo(
            ".md-tour-location,.md-culture-intro,.md-culture-groups,.md-tour-ctas",
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.09,
              ease: museumEase,
            },
            0.67,
          )
          .fromTo(
            ".md-tour-scene-caption,.md-gallery-strip",
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.1,
              ease: museumEase,
            },
            1.02,
          );
        gsap.set(indicator, targetLens);
      } else {
        sequence.to(
          indicator,
          { ...targetLens, duration: 0.45, ease: museumEase },
          0,
        );
        if (groupChanged) {
          sequence.fromTo(
            ".md-gallery-strip>button",
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.38,
              stagger: 0.025,
              ease: museumEase,
              clearProps: "opacity,transform",
            },
            0,
          );
        }
        if (oldIndex)
          sequence.to(
            oldIndex,
            {
              yPercent: -110 * direction,
              duration: 0.32,
              ease: museumSmooth,
              onComplete: () => oldIndex?.remove(),
            },
            0.06,
          );
        if (oldTotal)
          sequence.to(
            oldTotal,
            {
              yPercent: -110,
              duration: 0.32,
              ease: museumSmooth,
              onComplete: () => oldTotal?.remove(),
            },
            0.06,
          );
        if (oldTitle)
          sequence.to(
            oldTitle,
            {
              y: -18 * direction,
              opacity: 0,
              duration: 0.24,
              onComplete: () => oldTitle?.remove(),
            },
            0.08,
          );
        sequence
          .fromTo(
            ".md-culture-index-current,.md-culture-total-current",
            { yPercent: 110 * direction },
            { yPercent: 0, duration: 0.4, ease: museumEase },
            0.12,
          )
          .fromTo(
            ".md-culture-story-current",
            { y: 18 * direction, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.44, ease: museumEase },
            0.22,
          )
          .fromTo(
            ".md-tour-scene-caption>p,.md-culture-context",
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: 0.34,
              stagger: 0.05,
              ease: museumEase,
            },
            0.32,
          );
      }
    }, element);
    const revealImage = () => {
      if (disposed || settled || still) return;
      context.add(() => {
        photograph = gsap.timeline({
          delay,
          onComplete: () => {
            ghosts
              .filter((node) => node instanceof HTMLImageElement)
              .forEach((node) => node.remove());
            imageFinished = true;
            finish();
          },
        });
        if (!changing) {
          photograph.fromTo(
            image,
            {
              opacity: 0,
              scale: 1.07,
              x: Math.min(36, frame.clientWidth * 0.025),
              filter: "blur(5px)",
            },
            {
              opacity: 1,
              scale: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 1.1,
              ease: museumEase,
            },
          );
        } else if (request?.bounds && !groupChanged) {
          const bounds = frame.getBoundingClientRect();
          const flight = document.createElement("img");
          flight.src = current.photo;
          flight.alt = "";
          flight.className = "md-culture-image-flight";
          flight.inert = true;
          flight.setAttribute("aria-hidden", "true");
          camera.append(flight);
          ghosts.push(flight);
          gsap.set(image, { opacity: 0 });
          photograph
            .fromTo(
              flight,
              {
                left: request.bounds.left - bounds.left,
                top: request.bounds.top - bounds.top,
                width: request.bounds.width,
                height: request.bounds.height,
                borderRadius: 7,
              },
              {
                left: 0,
                top: 0,
                width: frame.clientWidth,
                height: frame.clientHeight,
                borderRadius: 0,
                duration: 0.75,
                ease: museumSmooth,
              },
            )
            .set(image, { opacity: 1, clearProps: "transform,filter" });
          if (oldImage)
            photograph.to(
              oldImage,
              { scale: 0.985, opacity: 0, duration: 0.65 },
              0,
            );
        } else {
          photograph.fromTo(
            image,
            { opacity: 0, x: 30 * direction, scale: 1.035 },
            { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: museumEase },
          );
          if (oldImage)
            photograph.to(
              oldImage,
              {
                opacity: 0,
                x: -30 * direction,
                scale: 0.985,
                duration: 0.65,
                ease: museumEase,
              },
              0,
            );
        }
      });
    };
    const failedImage = () => {
      oldImage?.remove();
      imageFinished = true;
      finish();
    };
    if (!still) {
      if (image.complete) {
        if (image.naturalWidth) revealImage();
        else failedImage();
      } else {
        image.addEventListener("load", revealImage, { once: true });
        image.addEventListener("error", failedImage, { once: true });
      }
    }
    settle.current = () => {
      settled = true;
      sequence?.progress(1);
      photograph?.progress(1);
      ghosts.forEach((node) => node.remove());
      gsap.set(image, { opacity: 1, clearProps: "transform,filter" });
      element.dataset.cultureMotion = "ready";
    };
    let previousWidth = frame.clientWidth,
      previousHeight = frame.clientHeight;
    const observer = new ResizeObserver(() => {
      if (
        frame.clientWidth === previousWidth &&
        frame.clientHeight === previousHeight
      )
        return;
      previousWidth = frame.clientWidth;
      previousHeight = frame.clientHeight;
      if (element.dataset.cultureMotion !== "ready") settle.current?.();
      lens(false);
      updateRail();
    });
    observer.observe(frame);
    gallery.addEventListener("scroll", updateRail, { passive: true });
    document.addEventListener("visibilitychange", pauseAmbient);
    return () => {
      disposed = true;
      clearPreview();
      observer.disconnect();
      gallery.removeEventListener("scroll", updateRail);
      document.removeEventListener("visibilitychange", pauseAmbient);
      image.removeEventListener("load", revealImage);
      image.removeEventListener("error", failedImage);
      context.revert();
      ghosts.forEach((node) => node.remove());
      ambient.current = null;
      settle.current = null;
      element.dataset.cultureMotion = "ready";
    };
  }, [root, id, lang, active, reduced]);
  useLayoutEffect(() => {
    if (!active || obscured || reduced) {
      clearPreview();
      ambient.current?.pause();
      if (obscured) settle.current?.();
    } else if (!document.hidden) ambient.current?.resume();
  }, [active, obscured, reduced]);
  return { reduced, prepare, preview };
}
