import { preloadMuseumDetail } from "./museumPreload";

export type MuseumOpening = {
  element: HTMLDivElement;
  photograph: HTMLImageElement;
  title?: HTMLDivElement;
  light: HTMLDivElement;
  source: DOMRect;
  titleSource?: DOMRect;
  dispose: () => void;
};
let pending: MuseumOpening | null = null;
let pendingRoot: HTMLElement | null = null;

export function cancelMuseumOpening(root?: HTMLElement | null) {
  if (!root || root === pendingRoot) pending?.dispose();
}
/** Focus is immediate; the ready hero takes over on the next painted frame. */
export async function prepareMuseumOpening(
  root: HTMLElement,
  image: HTMLImageElement | null,
  open: () => void,
) {
  if (
    (document.querySelector(".md-root") &&
      !document.querySelector("[data-detail-prepared=true] .md-root")) ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    root.closest(".access-reduce-motion")
  ) {
    open();
    return;
  }
  if (pendingRoot === root) return;
  pending?.dispose();
  root.getAnimations({ subtree: true }).forEach((animation) => {
    if (Number.isFinite(animation.effect?.getComputedTiming().endTime))
      animation.finish();
  });
  const source =
    image?.closest(".lqv-photo")?.getBoundingClientRect() ??
    image?.getBoundingClientRect();
  if (
    !image?.complete ||
    !image.naturalWidth ||
    !source?.width ||
    !source.height
  ) {
    open();
    return;
  }
  const animations: Animation[] = [];
  const element = document.createElement("div");
  element.dataset.museumOpening = "thumbnail";
  element.setAttribute("aria-hidden", "true");
  element.inert = true;
  Object.assign(element.style, {
    position: "fixed",
    left: `${source.left}px`,
    top: `${source.top}px`,
    width: `${source.width}px`,
    height: `${source.height}px`,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: "80",
    background: "#100f0c",
    borderRadius: "8px",
    contain: "layout paint",
    transformOrigin: "0 0",
    willChange: "transform,opacity",
  });
  const photograph = image.cloneNode(false) as HTMLImageElement;
  photograph.removeAttribute("id");
  photograph.removeAttribute("class");
  photograph.style.removeProperty("translate");
  photograph.alt = "";
  photograph.draggable = false;
  const cover = Math.max(
    source.width / image.naturalWidth,
    source.height / image.naturalHeight,
  );
  Object.assign(photograph.style, {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${image.naturalWidth * cover}px`,
    height: `${image.naturalHeight * cover}px`,
    maxWidth: "none",
    display: "block",
    transform: "translate(-50%,-50%)",
    transformOrigin: "center",
    willChange: "transform",
  });
  const light = document.createElement("div");
  Object.assign(light.style, {
    position: "absolute",
    inset: "0",
    background:
      "linear-gradient(110deg,transparent 15%,#f1d49718 48%,transparent 75%)",
    transform: "translateX(-120%)",
    pointerEvents: "none",
    willChange: "transform",
  });
  element.append(photograph, light);
  document.body.append(element);
  const heading = root.querySelector<HTMLElement>(".lqv-title-block h2");
  const titleSource = heading?.getBoundingClientRect();
  let title: HTMLDivElement | undefined;
  if (heading && titleSource?.width) {
    title = document.createElement("div");
    title.textContent = heading.textContent;
    title.setAttribute("aria-hidden", "true");
    title.inert = true;
    const css = getComputedStyle(heading);
    Object.assign(title.style, {
      position: "fixed",
      left: `${titleSource.left}px`,
      top: `${titleSource.top}px`,
      width: `${titleSource.width}px`,
      font: css.font,
      lineHeight: css.lineHeight,
      letterSpacing: css.letterSpacing,
      color: css.color,
      zIndex: "81",
      pointerEvents: "none",
      transformOrigin: "0 0",
      willChange: "transform,opacity",
    });
    document.body.append(title);
  }
  const button = root.querySelector<HTMLButtonElement>(
    "[data-action=show-location-details]",
  )!;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  root.dataset.quickMotion = "entering-detail";
  let disposed = false;
  const bridge: MuseumOpening = {
    element,
    photograph,
    title,
    titleSource,
    light,
    source,
    dispose: () => {
      if (disposed) return;
      disposed = true;
      clearTimeout(timeout);
      animations.forEach((a) => a.cancel());
      element.remove();
      title?.remove();
      button.disabled = false;
      button.removeAttribute("aria-busy");
      if (root.dataset.quickMotion === "entering-detail")
        root.dataset.quickMotion = "ready";
      if (pending === bridge) {
        pending = null;
        pendingRoot = null;
      }
    },
  };
  const timeout = window.setTimeout(bridge.dispose, 15000);
  pending = bridge;
  pendingRoot = root;
  root
    .querySelectorAll<HTMLElement>(
      ".lqv-toolbar,.lqv-topics,.lqv-summary,.lqv-facts,.lqv-footer,.lqv-photo-caption,.lqv-gallery-strip,.lqv-category,.lqv-address,.lqv-highlights,.lqv-visit",
    )
    .forEach((node) => {
      animations.push(
        node.animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0.08, transform: "translateY(-5px)" },
          ],
          {
            duration: 180,
            easing: "cubic-bezier(.65,0,.35,1)",
            fill: "forwards",
          },
        ),
      );
    });
  await Promise.all([
    preloadMuseumDetail().catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, 180)),
  ]);
  if (
    disposed ||
    !root.isConnected ||
    root.closest("[hidden]") ||
    root.dataset.quickMotion === "closing"
  ) {
    bridge.dispose();
    return;
  }
  requestAnimationFrame(() => {
    if (!disposed) open();
  });
}
export function takeMuseumOpening() {
  return pending;
}
