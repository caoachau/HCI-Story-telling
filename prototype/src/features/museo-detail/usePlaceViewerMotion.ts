import { useLayoutEffect, useRef, type RefObject } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import {
  museumEase,
  museumMotionReduced,
  museumSmooth,
  useMuseumReducedMotion,
} from "./museumMotion";

export function usePlaceViewerMotion(
  dialog: RefObject<HTMLDialogElement | null>,
  origin: HTMLElement | undefined,
  revision: number,
  close: () => void,
) {
  const trigger = useRef(
    origin ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null),
  );
  const context = useRef<gsap.Context | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const flight = useRef<HTMLElement | null>(null);
  const busy = useRef(false);
  const closing = useRef(false);
  const direction = useRef(1);
  const reduced = useMuseumReducedMotion(dialog);
  function imageFlight(source: HTMLImageElement, from: DOMRect, to: DOMRect) {
    const element = dialog.current!,
      bounds = element.getBoundingClientRect();
    const shell = document.createElement("div");
    shell.className = "md-place-image-flight";
    shell.setAttribute("aria-hidden", "true");
    const image = source.cloneNode(false) as HTMLImageElement;
    image.removeAttribute("class");
    image.removeAttribute("style");
    image.alt = "";
    image.draggable = false;
    shell.append(image);
    element.append(shell);
    flight.current = shell;
    gsap.set(shell, {
      left: from.left - bounds.left,
      top: from.top - bounds.top,
      width: from.width,
      height: from.height,
      borderRadius: 8,
    });
    return {
      shell,
      target: {
        left: to.left - bounds.left,
        top: to.top - bounds.top,
        width: to.width,
        height: to.height,
        borderRadius: 12,
      },
    };
  }
  function sourceImage() {
    return (
      trigger.current?.querySelector<HTMLImageElement>("img") ??
      trigger.current
        ?.closest(".md-khmer-places")
        ?.querySelector<HTMLImageElement>(".md-featured-photo")
    );
  }
  function visible(image?: HTMLImageElement | null) {
    if (!image?.isConnected || !image.complete || !image.naturalWidth)
      return false;
    const r = image.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.left >= 0 &&
      r.top >= 0 &&
      r.right <= innerWidth &&
      r.bottom <= innerHeight
    );
  }
  useLayoutEffect(() => {
    const element = dialog.current!,
      root = element.closest<HTMLElement>(".md-root")!;
    busy.current = false;
    closing.current = false;
    element.showModal();
    context.current = gsap.context(() => {
      if (museumMotionReduced(element)) {
        gsap.set(element, {
          "--place-backdrop-opacity": 0.72,
          "--place-backdrop-blur": "10px",
        });
        gsap.set(root, { "--place-background-opacity": 0.35 });
        element.dataset.placeViewerMotion = "ready";
        return;
      }
      busy.current = true;
      element.dataset.placeViewerMotion = "opening";
      const image = element.querySelector<HTMLImageElement>(
          ".md-site-main-image",
        )!,
        source = sourceImage();
      const shared =
        visible(source) && source!.src === image.src
          ? imageFlight(
              source!,
              source!.getBoundingClientRect(),
              image.getBoundingClientRect(),
            )
          : null;
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          element.dataset.placeViewerMotion = "ready";
        },
      });
      timeline.current = tl;
      tl.fromTo(
        ".md-place-viewer-panel",
        { scale: 0.97, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.45, ease: museumEase },
        0,
      )
        .to(
          element,
          {
            "--place-backdrop-opacity": 0.72,
            "--place-backdrop-blur": "10px",
            duration: 0.5,
          },
          0,
        )
        .to(root, { "--place-background-opacity": 0.35, duration: 0.45 }, 0)
        .fromTo(
          ".md-place-reader-title>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.28, ease: museumEase },
          0.4,
        )
        .fromTo(
          ".md-place-content:not(.md-place-measure)",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25 },
          0.49,
        )
        .fromTo(
          ".md-place-viewer-nav,.md-place-visual-credit",
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          0.55,
        );
      if (shared) {
        gsap.set(image, { opacity: 0 });
        tl.to(
          shared.shell,
          { ...shared.target, duration: 0.5, ease: museumSmooth },
          0,
        )
          .set(image, { opacity: 1 }, 0.5)
          .call(
            () => {
              shared.shell.remove();
              flight.current = null;
            },
            [],
            0.5,
          );
      }
    }, element);
    return () => {
      timeline.current?.kill();
      context.current?.revert();
      flight.current?.remove();
      flight.current = null;
      if (element.open) element.close();
      const target =
        trigger.current?.isConnected && !trigger.current.closest("[hidden]")
          ? trigger.current
          : (root.querySelector<HTMLElement>(
              ".md-site-strip button.is-selected",
            ) ??
            root.querySelector<HTMLElement>(
              "[data-action=explore-khmer-place]",
            ));
      target?.focus({ preventScroll: true });
    };
  }, []);
  useLayoutEffect(() => {
    if (!reduced) return;
    const current = timeline.current;
    queueMicrotask(() => {
      if (dialog.current?.isConnected && current === timeline.current)
        current?.progress(1);
    });
  }, [reduced]);
  useLayoutEffect(() => {
    if (!revision) return;
    const element = dialog.current!;
    if (!element.contains(document.activeElement))
      element
        .querySelector<HTMLElement>(".md-place-reader-title")
        ?.focus({ preventScroll: true });
    context.current?.add(() => {
      if (museumMotionReduced(element)) {
        gsap.set(".md-place-viewer-page", { opacity: 1, x: 0 });
        gsap.set(".md-place-reader-title>span", { yPercent: 0 });
        element.dataset.placeViewerMotion = "ready";
        busy.current = false;
        return;
      }
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          element.dataset.placeViewerMotion = "ready";
        },
      });
      timeline.current = tl;
      tl.fromTo(
        ".md-place-viewer-page",
        { opacity: 0, x: direction.current * 24 },
        { opacity: 1, x: 0, duration: 0.42, ease: museumEase },
      ).fromTo(
        ".md-place-reader-title>span",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.4, ease: museumEase },
        0.08,
      );
    });
  }, [revision]);
  function transition(commit: () => void, sign = 1) {
    if (busy.current || closing.current) return;
    direction.current = sign;
    if (museumMotionReduced(dialog.current)) {
      flushSync(commit);
      return;
    }
    busy.current = true;
    dialog.current!.dataset.placeViewerMotion = "changing";
    context.current?.add(() => {
      const tl = gsap.timeline({ onComplete: () => flushSync(commit) });
      timeline.current = tl;
      tl.to(".md-place-viewer-page", {
        opacity: 0,
        x: sign * -24,
        duration: 0.16,
        ease: "power1.out",
      });
    });
  }
  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    timeline.current?.kill();
    flight.current?.remove();
    flight.current = null;
    const element = dialog.current!;
    if (museumMotionReduced(element)) {
      close();
      return;
    }
    element.dataset.placeViewerMotion = "closing";
    context.current?.add(() => {
      const image = element.querySelector<HTMLImageElement>(
          ".md-site-main-image",
        )!,
        source = sourceImage();
      const shared =
        visible(source) && image.complete && image.src === source!.src
          ? imageFlight(
              image,
              image.getBoundingClientRect(),
              source!.getBoundingClientRect(),
            )
          : null;
      if (shared) gsap.set(image, { opacity: 0 });
      const tl = gsap.timeline({ onComplete: close });
      timeline.current = tl;
      tl.to(
        ".md-place-viewer-panel",
        { opacity: 0, scale: 0.97, duration: 0.45, ease: museumSmooth },
        0,
      )
        .to(
          element,
          {
            "--place-backdrop-opacity": 0,
            "--place-backdrop-blur": "0px",
            duration: 0.5,
          },
          0,
        )
        .to(
          element.closest(".md-root"),
          { "--place-background-opacity": 1, duration: 0.5 },
          0,
        );
      if (shared)
        tl.to(
          shared.shell,
          {
            ...shared.target,
            borderRadius: 8,
            duration: 0.5,
            ease: museumSmooth,
          },
          0,
        );
    });
  }
  return { transition, requestClose, reduced };
}
