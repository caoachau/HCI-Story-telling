import { useLayoutEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
export const museumEase = CustomEase.create("museum-out", ".16,1,.3,1");
export const museumSmooth = CustomEase.create("museum-smooth", ".65,0,.35,1");

export function museumMotionReduced(element?: Element | null) {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !!element?.closest(".access-reduce-motion, .reduce-motion")
  );
}

export function useMuseumReducedMotion(ref: RefObject<HTMLElement | null>) {
  const [reduced, setReduced] = useState(() => museumMotionReduced());
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(museumMotionReduced(ref.current));
    const observer = new MutationObserver(update);
    const host = ref.current?.closest(".heritage-app");
    if (host)
      observer.observe(host, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", update);
    update();
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, [ref]);
  return reduced;
}
