import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { takeMuseumOpening } from "../../utils/museumOpening";
import { museumEase, useMuseumReducedMotion } from "./museumMotion";

export function useKhmerIntroMotion(
  ref: RefObject<HTMLElement | null>,
  visible: boolean,
  photo: { revision: number; direction: number },
) {
  const reduced = useMuseumReducedMotion(ref);
  const opening = useRef<gsap.core.Timeline | null>(null);
  const photoRevision = useRef(photo.revision);
  const [interactive, setInteractive] = useState(false);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !visible) return;
    const bridge = takeMuseumOpening();
    root.dataset.introMotion = reduced ? "reduced" : "opening";
    if (reduced) {
      bridge?.dispose();
      setInteractive(true);
      return;
    }
    setInteractive(false);
    // Stage without geometry reads. Paint the new shell before initializing
    // GSAP, so its first style reads do not block React's entire map commit.
    const starts: {
      node: HTMLElement | SVGElement;
      style: Partial<CSSStyleDeclaration>;
    }[] = [];
    const stage = (selector: string, style: Partial<CSSStyleDeclaration>) => {
      root
        .querySelectorAll<HTMLElement | SVGElement>(selector)
        .forEach((node) => starts.push({ node, style }));
    };
    stage(".md-intro-background", {
      opacity: bridge ? ".55" : ".7",
      transform: `translate3d(0,${bridge ? 0 : 16}px,0) scale(${bridge ? 1.01 : 1.04})`,
    });
    stage(".md-intro-shade", { opacity: bridge ? ".7" : "0" });
    stage(".md-khmer-ornament", { opacity: "0" });
    stage(".md-khmer-ornament path", { strokeDashoffset: "1" });
    stage(".md-title-line", { transform: "translate3d(0,115%,0)" });
    stage(
      ".md-hero-copy>.md-eyebrow,.md-hero-description,.md-hero-copy>.md-play-link",
      { opacity: "0", transform: "translate3d(0,8px,0)" },
    );
    stage(".md-hero-context article", {
      opacity: "0",
      transform: "translate3d(0,18px,0)",
    });
    stage(".md-chapter-dock", {
      opacity: "0",
      transform: "translate3d(0,32px,0) scale(.96)",
    });
    stage(".md-hero-arrows,.md-hero-bottom", { opacity: "0" });
    const baseline = starts.map(({ node }) => {
      const original = node.getAttribute("style");
      return { node, original };
    });
    const restore = () =>
      baseline.forEach(({ node, original }) =>
        original === null
          ? node.removeAttribute("style")
          : node.setAttribute("style", original),
      );
    starts.forEach(({ node, style }) => Object.assign(node.style, style));
    const settle = () => opening.current?.progress(1);
    const visibility = () => {
      if (document.hidden) settle();
    };
    window.addEventListener("resize", settle);
    document.addEventListener("visibilitychange", visibility);
    let ctx: gsap.Context | undefined;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const compact = root.clientWidth < 1000;
        const factor = bridge ? (compact ? 0.7 : 0.82) : compact ? 0.72 : 1;
        ctx = gsap.context(() => {
          // Refresh the percent position when a previously visited hero reopens.
          gsap.set(".md-title-line", { y: 0, yPercent: 115 });
          const timeline = gsap.timeline({
            defaults: { ease: museumEase, immediateRender: false },
            onComplete: () => {
              root.dataset.introMotion = "ready";
              restore();
              bridge?.dispose();
              setInteractive(true);
            },
          });
          opening.current = timeline;
          timeline.fromTo(
            ".md-intro-background",
            {
              scale: bridge ? 1.01 : 1.04,
              y: bridge ? 0 : 16,
              opacity: bridge ? 0.55 : 0.7,
            },
            {
              scale: 1,
              y: 0,
              opacity: 1,
              duration: factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.28 : 0,
          );
          timeline.fromTo(
            ".md-intro-shade",
            { opacity: bridge ? 0.7 : 0 },
            { opacity: 1, duration: 0.9 * factor, clearProps: "opacity" },
            0,
          );
          timeline.fromTo(
            ".md-khmer-ornament",
            { opacity: 0 },
            { opacity: 0.085, duration: 0.6 * factor },
            bridge ? 0.64 : 0.12 * factor,
          );
          timeline.fromTo(
            ".md-khmer-ornament path",
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: bridge ? 0.4 : 1.35 * factor,
              stagger: bridge ? 0.02 : 0.025,
            },
            bridge ? 0.64 : 0.12 * factor,
          );
          timeline.to(
            ".md-title-line",
            {
              y: 0,
              yPercent: 0,
              duration: bridge ? 0.42 : 0.62 * factor,
              stagger: bridge ? 0.05 : 0.09 * factor,
              clearProps: "transform",
            },
            bridge ? 0.42 : 0.34 * factor,
          );
          timeline.fromTo(
            ".md-hero-copy>.md-eyebrow",
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: bridge ? 0.3 : 0.5 * factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.52 : 0.76 * factor,
          );
          timeline.fromTo(
            ".md-hero-description",
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: bridge ? 0.35 : 0.5 * factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.6 : 0.9 * factor,
          );
          timeline.fromTo(
            ".md-hero-copy>.md-play-link",
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: bridge ? 0.3 : 0.45 * factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.68 : 1.02 * factor,
          );
          timeline.fromTo(
            ".md-hero-context article",
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: bridge ? 0.35 : 0.45 * factor,
              stagger: bridge ? 0.05 : 0.1 * factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.7 : 1.12 * factor,
          );
          timeline.fromTo(
            ".md-chapter-dock",
            { opacity: 0, y: 32, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: bridge ? 0.36 : 0.52 * factor,
              clearProps: "transform,opacity",
            },
            bridge ? 0.78 : 1.34 * factor,
          );
          timeline.fromTo(
            ".md-hero-arrows,.md-hero-bottom",
            { opacity: 0 },
            {
              opacity: 1,
              duration: bridge ? 0.25 : 0.35 * factor,
              clearProps: "opacity",
            },
            bridge ? 0.84 : 1.5 * factor,
          );
          if (bridge) {
            const rect = root
              .querySelector(".md-frame")!
              .getBoundingClientRect();
            bridge.element.dataset.museumOpening = "expanding";
            const sx = rect.width / bridge.source.width,
              sy = rect.height / bridge.source.height;
            const imageWidth = parseFloat(bridge.photograph.style.width),
              imageHeight = parseFloat(bridge.photograph.style.height);
            const crop = { scaleX: 1, scaleY: 1 };
            timeline.to(
              bridge.element,
              {
                x: rect.left - bridge.source.left,
                y: rect.top - bridge.source.top,
                scaleX: sx,
                scaleY: sy,
                duration: 0.62,
              },
              0,
            );
            // Counter the changing crop without stretching the documentary image.
            timeline.to(
              crop,
              {
                scaleX: sx,
                scaleY: sy,
                duration: 0.62,
                onUpdate: () => {
                  const cover = Math.max(
                    (bridge.source.width * crop.scaleX) / imageWidth,
                    (bridge.source.height * crop.scaleY) / imageHeight,
                  );
                  bridge.photograph.style.transform = `translate(-50%,-50%) scale(${cover / crop.scaleX},${cover / crop.scaleY})`;
                },
              },
              0,
            );
            timeline.to(bridge.light, { xPercent: 240, duration: 0.6 }, 0.12);
            if (bridge.title && bridge.titleSource) {
              const target = root
                .querySelector("#md-intro-title")!
                .getBoundingClientRect();
              timeline.to(
                bridge.title,
                {
                  x: target.left - bridge.titleSource.left,
                  y: target.top - bridge.titleSource.top,
                  opacity: 0,
                  duration: 0.54,
                },
                0.06,
              );
            }
            timeline.to(
              bridge.element,
              { opacity: 0, duration: 0.24, onComplete: bridge.dispose },
              0.48,
            );
          }
        }, root);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", settle);
      document.removeEventListener("visibilitychange", visibility);
      ctx?.revert();
      restore();
      opening.current = null;
      if (bridge)
        requestAnimationFrame(() => {
          if (!root.isConnected || root.closest("[hidden]")) bridge.dispose();
        });
      root.dataset.introMotion = "ready";
    };
  }, [ref, visible, reduced]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (
      !root ||
      !visible ||
      reduced ||
      photoRevision.current === photo.revision
    ) {
      photoRevision.current = photo.revision;
      return;
    }
    photoRevision.current = photo.revision;
    opening.current?.progress(1);
    root.dataset.photoMotion = "changing";
    const ctx = gsap.context(() => {}, root);
    ctx.add(() => {
      const ghost = root.querySelector<HTMLImageElement>(".md-hero-outgoing")!;
      const image = root.querySelector<HTMLImageElement>(
        ".md-hero-art:not(.md-hero-outgoing)",
      )!;
      const foreground = root.querySelector(".md-hero-foreground")!;
      const compact = root.clientWidth < 1000;
      const duration = compact ? 0.46 : 0.72;
      gsap.set(ghost, { display: "block", opacity: 0.85, x: 0 });
      gsap.set([image, foreground], { opacity: 0 });
      let alive = true;
      const reveal = () => {
        if (!alive) return;
        ctx.add(() => {
          gsap
            .timeline({
              defaults: { ease: museumEase },
              onComplete: () => {
                root.dataset.photoMotion = "idle";
                gsap.set(ghost, { display: "none" });
              },
            })
            .to(ghost, { x: -photo.direction * 36, opacity: 0, duration }, 0)
            .fromTo(
              image,
              { x: photo.direction * 36, scale: 1.025 },
              {
                x: 0,
                scale: 1,
                opacity: compact ? 0.8 : 0.85,
                duration,
                clearProps: "transform,opacity",
              },
              0,
            )
            .to(foreground, { opacity: 1, duration, clearProps: "opacity" }, 0)
            .fromTo(
              ".md-slide-count i>b",
              { scaleX: 0 },
              { scaleX: 1, duration },
              0,
            );
        });
      };
      if (image.complete && image.naturalWidth) reveal();
      else image.addEventListener("load", reveal, { once: true });
      image.addEventListener("error", reveal, { once: true });
      return () => {
        alive = false;
        image.removeEventListener("load", reveal);
        image.removeEventListener("error", reveal);
      };
    });
    return () => {
      ctx.revert();
      root.dataset.photoMotion = "idle";
    };
  }, [ref, visible, reduced, photo.revision, photo.direction]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !visible || reduced || !interactive) return;
    const media = gsap.matchMedia();
    media.add(
      "(hover: hover) and (pointer: fine) and (min-width: 1000px)",
      () => {
        const architecture = root.querySelector(".md-intro-architecture")!;
        const foreground = root.querySelector(".md-intro-foreground-layer")!;
        const light = root.querySelector<HTMLElement>(".md-cursor-light")!;
        const ax = gsap.quickTo(architecture, "x", {
          duration: 1,
          ease: museumEase,
        });
        const ay = gsap.quickTo(architecture, "y", {
          duration: 1,
          ease: museumEase,
        });
        const fx = gsap.quickTo(foreground, "x", {
          duration: 1.25,
          ease: museumEase,
        });
        const fy = gsap.quickTo(foreground, "y", {
          duration: 1.25,
          ease: museumEase,
        });
        const lx = gsap.quickTo(light, "x", {
          duration: 0.7,
          ease: museumEase,
        });
        const ly = gsap.quickTo(light, "y", {
          duration: 0.7,
          ease: museumEase,
        });
        const opacity = gsap.quickTo(light, "opacity", { duration: 0.45 });
        const move = (event: PointerEvent) => {
          if (
            event.pointerType !== "mouse" ||
            document.hidden ||
            root.dataset.introMotion === "opening"
          )
            return;
          const rect = root.getBoundingClientRect();
          const x = event.clientX - rect.left,
            y = event.clientY - rect.top;
          const dx = (x / rect.width - 0.5) * 2,
            dy = (y / rect.height - 0.5) * 2;
          ax(dx * 4);
          ay(dy * 4);
          fx(dx * 10);
          fy(dy * 10);
          lx(x - 230);
          ly(y - 230);
          opacity(1);
        };
        const reset = () => {
          ax(0);
          ay(0);
          fx(0);
          fy(0);
          opacity(0);
        };
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", reset);
        document.addEventListener("visibilitychange", reset);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", reset);
          document.removeEventListener("visibilitychange", reset);
        };
      },
      root,
    );
    return () => media.revert();
  }, [ref, visible, reduced, interactive]);

  useLayoutEffect(() => {
    const root = ref.current,
      dock = root?.querySelector<HTMLElement>(".md-chapter-dock");
    if (!root || !dock || !visible || !interactive) return;
    const ctx = gsap.context(() => {}, root);
    const indicator = dock.querySelector<HTMLElement>(".md-dock-glow")!;
    const move = (button: HTMLButtonElement) =>
      ctx.add(() => {
        gsap.to(indicator, {
          x: button.offsetLeft,
          width: button.offsetWidth,
          opacity: 1,
          duration: reduced ? 0 : 0.55,
          ease: museumEase,
          overwrite: true,
        });
      });
    const select = (event: Event) => {
      const button =
        event.target instanceof Element ? event.target.closest("button") : null;
      if (button && dock.contains(button)) move(button);
    };
    const reset = () => {
      const button =
        dock.querySelector<HTMLButtonElement>("[data-dock-selected=true]") ??
        dock.querySelector<HTMLButtonElement>("button")!;
      move(button);
    };
    const resize = new ResizeObserver(reset);
    resize.observe(dock);
    reset();
    dock.addEventListener("pointerover", select);
    dock.addEventListener("focusin", select);
    dock.addEventListener("pointerleave", reset);
    dock.addEventListener("focusout", reset);
    return () => {
      resize.disconnect();
      dock.removeEventListener("pointerover", select);
      dock.removeEventListener("focusin", select);
      dock.removeEventListener("pointerleave", reset);
      dock.removeEventListener("focusout", reset);
      ctx.revert();
    };
  }, [ref, visible, reduced, interactive]);

  return { reduced, finishOpening: () => opening.current?.progress(1) };
}
