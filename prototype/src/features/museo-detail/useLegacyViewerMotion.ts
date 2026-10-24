import { useLayoutEffect, useRef, type RefObject } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import {
  museumEase,
  museumSmooth,
  museumMotionReduced,
  useMuseumReducedMotion,
} from "./museumMotion";

export function useLegacyViewerMotion(
  dialog: RefObject<HTMLDialogElement | null>,
  origin: HTMLElement | undefined,
  valueId: string,
  revision: number,
  close: () => void,
) {
  const trigger = useRef(
    origin ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null),
  );
  const currentId = useRef(valueId);
  currentId.current = valueId;
  const context = useRef<gsap.Context | null>(null),
    timeline = useRef<gsap.core.Timeline | null>(null),
    flight = useRef<HTMLElement | null>(null);
  const busy = useRef(false),
    closing = useRef(false),
    direction = useRef(1),
    queued = useRef<{ commit: () => void; sign: number } | null>(null);
  const reduced = useMuseumReducedMotion(dialog);
  function targetCard() {
    return (
      dialog.current
        ?.closest(".md-root")
        ?.querySelector<HTMLElement>(
          `[data-legacy-id="${currentId.current}"]`,
        ) ?? trigger.current
    );
  }
  function visible(image?: HTMLImageElement | null) {
    if (!image?.isConnected || !image.complete || !image.naturalWidth)
      return false;
    const r = image.getBoundingClientRect();
    return (
      r.width > 0 &&
      r.height > 0 &&
      r.top >= 0 &&
      r.left >= 0 &&
      r.bottom <= innerHeight &&
      r.right <= innerWidth
    );
  }
  function imageFlight(source: HTMLImageElement, from: DOMRect, to: DOMRect) {
    const element = dialog.current!,
      bounds = element.getBoundingClientRect(),
      shell = document.createElement("div");
    shell.className = "md-legacy-image-flight";
    shell.inert = true;
    shell.setAttribute("aria-hidden", "true");
    const img = source.cloneNode(false) as HTMLImageElement;
    img.removeAttribute("style");
    img.removeAttribute("class");
    img.alt = "";
    img.draggable = false;
    shell.append(img);
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
        borderRadius: 6,
      },
    };
  }
  const finish = () => {
    busy.current = false;
    if (dialog.current) dialog.current.dataset.legacyViewerMotion = "ready";
    const next = queued.current;
    queued.current = null;
    if (next && !closing.current) transition(next.commit, next.sign);
  };
  useLayoutEffect(() => {
    const element = dialog.current!,
      root = element.closest<HTMLElement>(".md-root")!;
    closing.current = false;
    busy.current = false;
    element.showModal();
    element
      .querySelector<HTMLElement>("#md-dialog-title")!
      .focus({ preventScroll: true });
    context.current = gsap.context(() => {
      if (museumMotionReduced(element)) {
        gsap.set(element, {
          "--legacy-backdrop-opacity": 0.72,
          "--legacy-backdrop-blur": "8px",
        });
        gsap.set(root, { "--legacy-background-opacity": 0.28 });
        finish();
        return;
      }
      busy.current = true;
      element.dataset.legacyViewerMotion = "opening";
      const image = element.querySelector<HTMLImageElement>(
          ".md-legacy-main-image",
        )!,
        source = targetCard()?.querySelector<HTMLImageElement>("img");
      const shared =
        visible(source) && source!.src === image.src
          ? imageFlight(
              source!,
              source!.getBoundingClientRect(),
              image.getBoundingClientRect(),
            )
          : null;
      const tl = gsap.timeline({ onComplete: finish });
      timeline.current = tl;
      tl.fromTo(
        ".md-legacy-viewer-panel",
        { opacity: 0, scale: 0.975 },
        { opacity: 1, scale: 1, duration: 0.5, ease: museumEase },
        0,
      )
        .to(
          element,
          {
            "--legacy-backdrop-opacity": 0.72,
            "--legacy-backdrop-blur": "8px",
            duration: 0.55,
          },
          0,
        )
        .to(root, { "--legacy-background-opacity": 0.28, duration: 0.5 }, 0)
        .fromTo(
          ".md-legacy-viewer-title>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.4, ease: museumEase },
          0.35,
        )
        .fromTo(
          ".md-legacy-reader,.md-legacy-viewer-nav",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.08, ease: museumEase },
          0.4,
        );
      if (shared) {
        gsap.set(image, { opacity: 0 });
        tl.to(
          shared.shell,
          { ...shared.target, duration: 0.75, ease: museumSmooth },
          0,
        )
          .set(image, { opacity: 1 }, 0.75)
          .call(
            () => {
              shared.shell.remove();
              flight.current = null;
            },
            [],
            0.75,
          );
      }
    }, element);
    const settle = () => {
      const running = timeline.current;
      queueMicrotask(() => {
        if (element.isConnected && running === timeline.current)
          running?.progress(1);
      });
    };
    window.addEventListener("resize", settle);
    return () => {
      window.removeEventListener("resize", settle);
      queued.current = null;
      timeline.current?.kill();
      context.current?.revert();
      flight.current?.remove();
      flight.current = null;
      if (element.open) element.close();
      const card =
        root.querySelector<HTMLElement>(
          `[data-legacy-id="${currentId.current}"]`,
        ) ?? trigger.current;
      const target =
        card?.isConnected && !card.closest("[hidden]")
          ? card
          : root.querySelector<HTMLElement>(
              ".md-screen-dot[aria-current=step]",
            );
      target?.focus({ preventScroll: true });
    };
  }, []);
  useLayoutEffect(() => {
    if (!reduced) return;
    const running = timeline.current;
    queueMicrotask(() => {
      if (dialog.current?.isConnected && running === timeline.current)
        running?.progress(1);
    });
  }, [reduced]);
  useLayoutEffect(() => {
    if (!revision) return;
    context.current?.add(() => {
      const element = dialog.current!;
      if (museumMotionReduced(element)) {
        gsap.set(".md-legacy-viewer-page", { opacity: 1, x: 0 });
        finish();
        return;
      }
      const tl = gsap.timeline({ onComplete: finish });
      timeline.current = tl;
      tl.fromTo(
        ".md-legacy-viewer-page",
        { opacity: 0, x: direction.current * 22 },
        { opacity: 1, x: 0, duration: 0.42, ease: museumEase },
      );
    });
  }, [revision]);
  function transition(commit: () => void, sign = 1) {
    if (closing.current) return;
    if (busy.current) {
      queued.current = { commit, sign };
      return;
    }
    direction.current = sign;
    if (museumMotionReduced(dialog.current)) {
      flushSync(commit);
      return;
    }
    busy.current = true;
    dialog.current!.dataset.legacyViewerMotion = "changing";
    context.current?.add(() => {
      const tl = gsap.timeline({ onComplete: () => flushSync(commit) });
      timeline.current = tl;
      tl.to(".md-legacy-viewer-page", {
        opacity: 0,
        x: -22 * sign,
        duration: 0.16,
        ease: museumSmooth,
      });
    });
  }
  function requestClose(after?: () => void) {
    if (closing.current) return;
    closing.current = true;
    queued.current = null;
    timeline.current?.kill();
    flight.current?.remove();
    flight.current = null;
    const done = () => {
      close();
      after?.();
    };
    const element = dialog.current!;
    if (museumMotionReduced(element)) {
      done();
      return;
    }
    element.dataset.legacyViewerMotion = "closing";
    context.current?.add(() => {
      const image = element.querySelector<HTMLImageElement>(
          ".md-legacy-main-image",
        )!,
        source = targetCard()?.querySelector<HTMLImageElement>("img");
      const shared =
        visible(source) && image.complete && image.src === source!.src
          ? imageFlight(
              image,
              image.getBoundingClientRect(),
              source!.getBoundingClientRect(),
            )
          : null;
      if (shared) gsap.set(image, { opacity: 0 });
      const tl = gsap.timeline({ onComplete: done });
      timeline.current = tl;
      tl.to(
        ".md-legacy-viewer-panel",
        { opacity: 0, scale: 0.975, duration: 0.5, ease: museumSmooth },
        0,
      )
        .to(
          element,
          {
            "--legacy-backdrop-opacity": 0,
            "--legacy-backdrop-blur": "0px",
            duration: 0.5,
          },
          0,
        )
        .to(
          element.closest(".md-root"),
          { "--legacy-background-opacity": 1, duration: 0.5 },
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
  return { reduced, transition, requestClose };
}
