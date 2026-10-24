import { useLayoutEffect, useRef, useState, type RefObject } from "react";

export function useLocationQuickMotion(
  root: RefObject<HTMLElement | null>,
  onClose: () => void,
  siteId: string,
) {
  const callback = useRef(onClose);
  callback.current = onClose;
  const closing = useRef(false);
  const animations = useRef<Animation[]>([]);
  const snapshots = useRef<{
    siteId: string;
    title: HTMLElement;
    gallery: HTMLElement;
  } | null>(null);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useLayoutEffect(() => {
    const element = root.current!;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const media = matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const reduce =
        media.matches || !!element.closest(".access-reduce-motion");
      element.dataset.reducedMotion = String(reduce);
      setReduced(reduce);
      if (reduce) {
        animations.current.forEach((animation) => animation.cancel());
        element
          .getAnimations({ subtree: true })
          .forEach((animation) => animation.cancel());
        document
          .querySelectorAll("[data-quick-map-pulse], [data-quick-site-ghost]")
          .forEach((node) => node.remove());
        element.dataset.quickMotion = "ready";
        if (closing.current) callback.current();
      }
    };
    const observer = new MutationObserver(update);
    const host = element.closest(".heritage-app");
    if (host)
      observer.observe(host, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", update);
    update();
    element.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      animations.current.forEach((animation) => animation.cancel());
      element.style.removeProperty("transform-origin");
      if (
        element.contains(document.activeElement) ||
        document.activeElement === document.body
      ) {
        const target =
          trigger?.isConnected &&
          trigger !== document.body &&
          trigger.tabIndex >= 0 &&
          !trigger.closest("[hidden]")
            ? trigger
            : document.querySelector<HTMLElement>(
                `.landmark-carousel-card[data-site-id="${element.dataset.siteId}"]`,
              );
        target?.focus({ preventScroll: true });
      }
    };
  }, []);
  useLayoutEffect(() => {
    const element = root.current!;
    const previous = snapshots.current;
    const replacement = previous && previous.siteId !== siteId;
    const title = element.querySelector<HTMLElement>(".lqv-title-block")!;
    const gallery = element.querySelector<HTMLElement>(".lqv-visual")!;
    const ghosts: HTMLElement[] = [];
    let alive = true,
      frame = 0;
    const capture = () => {
      snapshots.current = {
        siteId,
        title: title.cloneNode(true) as HTMLElement,
        gallery: gallery.cloneNode(true) as HTMLElement,
      };
    };
    const scheduleCapture = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(capture);
    };
    capture();
    element.addEventListener("load", scheduleCapture, true);
    const resize = new ResizeObserver(scheduleCapture);
    resize.observe(element);
    const reduce =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !!element.closest(".access-reduce-motion");
    element.style.transformOrigin = "100% 50%";
    if (!reduce) {
      element.dataset.quickMotion = replacement ? "changing-site" : "opening";
      const easing = "cubic-bezier(.16,1,.3,1)";
      animations.current = [];
      if (!replacement)
        animations.current.push(
          element.animate(
            [
              { opacity: 0, transform: "translateX(70px) scale(.985)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 720, easing },
          ),
        );
      if (replacement) {
        for (const [clone, node, isTitle] of [
          [previous.title, title, true],
          [previous.gallery, gallery, false],
        ] as const) {
          clone.removeAttribute("id");
          clone
            .querySelectorAll("[id]")
            .forEach((n) => n.removeAttribute("id"));
          clone.inert = true;
          clone.setAttribute("aria-hidden", "true");
          clone.dataset.quickSiteGhost = "true";
          clone
            .querySelectorAll<HTMLImageElement>(".lqv-photo>img")
            .forEach((img) => (img.style.opacity = "1"));
          clone
            .querySelectorAll(".lqv-photo-previous")
            .forEach((n) => n.remove());
          Object.assign(clone.style, {
            position: "absolute",
            left: `${node.offsetLeft}px`,
            top: `${node.offsetTop}px`,
            width: `${node.offsetWidth}px`,
            height: `${node.offsetHeight}px`,
            pointerEvents: "none",
            zIndex: "8",
          });
          element.append(clone);
          ghosts.push(clone);
          const out = clone.animate(
            isTitle
              ? [
                  { opacity: 1, clipPath: "inset(0)" },
                  { opacity: 0, clipPath: "inset(0 0 100% 0)" },
                ]
              : [
                  { opacity: 1, transform: "none" },
                  { opacity: 0, transform: "translateX(-20px)" },
                ],
            { duration: 250, easing, fill: "forwards" },
          );
          animations.current.push(out);
        }
      }
      [
        title,
        gallery,
        element.querySelector<HTMLElement>(".lqv-tabs")!,
        element.querySelector<HTMLElement>(".lqv-information")!,
        element.querySelector<HTMLElement>(".lqv-footer")!,
      ].forEach((node, index) => {
        animations.current.push(
          node.animate(
            [
              {
                opacity: 0,
                ...(replacement && index === 0
                  ? { clipPath: "inset(0 0 100% 0)" }
                  : {}),
                transform: replacement
                  ? "translateX(20px)"
                  : "translateY(10px)",
              },
              {
                opacity: 1,
                transform: "none",
                ...(replacement && index === 0 ? { clipPath: "inset(0)" } : {}),
              },
            ],
            {
              duration: replacement ? 530 : 400,
              delay: 60 + index * 55,
              easing,
              fill: "backwards",
            },
          ),
        );
      });
      const marker = document.querySelector<HTMLElement>(
        `.heritage-marker[data-site-id="${siteId}"]`,
      );
      const anchor = marker?.getBoundingClientRect();
      if (anchor?.width && anchor.top < innerHeight && anchor.bottom > 0) {
        const pulse = document.createElement("div");
        pulse.setAttribute("aria-hidden", "true");
        pulse.inert = true;
        pulse.dataset.quickMapPulse = "true";
        Object.assign(pulse.style, {
          position: "fixed",
          left: `${anchor.left + anchor.width / 2 - 24}px`,
          top: `${anchor.bottom - 24}px`,
          width: "48px",
          height: "48px",
          border: "1px solid #e3ad4d",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: "39",
        });
        document.body.append(pulse);
        ghosts.push(pulse);
        animations.current.push(
          pulse.animate(
            [
              { opacity: 0.8, transform: "scale(.65)" },
              { opacity: 0, transform: "scale(2.8)" },
            ],
            { duration: 720, easing },
          ),
        );
      }
      void Promise.all(
        animations.current.map((animation) => animation.finished),
      )
        .then(() => {
          ghosts.forEach((node) => node.remove());
          if (
            alive &&
            !closing.current &&
            element.dataset.quickMotion !== "entering-detail"
          )
            element.dataset.quickMotion = "ready";
          if (alive) capture();
        })
        .catch(() => {});
    } else element.dataset.quickMotion = "ready";
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      element.removeEventListener("load", scheduleCapture, true);
      animations.current.forEach((animation) => animation.cancel());
      ghosts.forEach((node) => node.remove());
    };
  }, [siteId]);
  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    const element = root.current!;
    animations.current.forEach((animation) => animation.cancel());
    if (reduced || element.closest(".access-reduce-motion")) {
      callback.current();
      return;
    }
    element.dataset.quickMotion = "closing";
    const animation = element.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateX(36px) scale(.985)" },
      ],
      { duration: 280, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" },
    );
    animations.current = [animation];
    const shade = document.querySelector(".lqv-map-shade");
    if (shade)
      animations.current.push(
        shade.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 280,
          easing: "ease-out",
          fill: "forwards",
        }),
      );
    void animation.finished.then(() => callback.current()).catch(() => {});
  }
  return { reduced, requestClose };
}
