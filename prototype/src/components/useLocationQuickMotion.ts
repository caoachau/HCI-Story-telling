import { useLayoutEffect, useRef, useState, type RefObject } from "react";

/** A static location window; only explicit tab/page controls animate. */
export function useLocationQuickMotion(
  root: RefObject<HTMLElement | null>,
  onClose: () => void,
  siteId: string,
) {
  const callback = useRef(onClose);
  callback.current = onClose;
  const closing = useRef(false);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useLayoutEffect(() => {
    const element = root.current!;
    const trigger = document.activeElement instanceof HTMLElement
      ? document.activeElement : null;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const reduce = media.matches || !!element.closest(".access-reduce-motion");
      element.dataset.reducedMotion = String(reduce);
      setReduced(reduce);
      if (reduce) element.getAnimations({ subtree: true }).forEach(a => a.cancel());
    };
    const observer = new MutationObserver(update);
    const host = element.closest(".heritage-app");
    if (host) observer.observe(host, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", update);
    update();
    element.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      if (element.contains(document.activeElement) || document.activeElement === document.body) {
        const target = trigger?.isConnected && trigger !== document.body &&
          trigger.tabIndex >= 0 && !trigger.closest("[hidden]") ? trigger :
          document.querySelector<HTMLElement>(`.landmark-carousel-card[data-site-id="${element.dataset.siteId}"]`);
        target?.focus({ preventScroll: true });
      }
    };
  }, []);
  useLayoutEffect(() => {
    closing.current = false;
    root.current!.dataset.quickMotion = "ready";
  }, [root, siteId]);
  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    callback.current();
  }
  return { reduced, requestClose };
}
