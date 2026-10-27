import { useLayoutEffect, useRef, type RefObject } from "react";
/** One active information page; temporary outgoing text is decorative and inert. */
export function useQuickPageMotion(
  root: RefObject<HTMLElement | null>,
  topic: string,
  highlight: number,
  reduced: boolean,
  siteId: string,
) {
  const previous = useRef({ topic, highlight, siteId });
  const indicator = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const element = root.current!,
      before = previous.current;
    previous.current = { topic, highlight, siteId };
    const tab = element.querySelector<HTMLElement>(
      `[data-quick-tab=${topic}]`,
    )!;
    const line = element.querySelector<HTMLElement>(".lqv-tab-indicator")!;
    const old = getComputedStyle(line).transform;
    indicator.current?.cancel();
    const transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
    line.style.transform = transform;
    const changingSite = element.dataset.quickMotion === "changing-site";
    if (!reduced && before.siteId === siteId && !changingSite && before.topic !== topic)
      indicator.current = line.animate([{ transform: old }, { transform }], {
        duration: 460,
        easing: "cubic-bezier(.16,1,.3,1)",
      });
    let initialResize = true;
    const resize = new ResizeObserver(() => {
      if (initialResize) {
        initialResize = false;
        return;
      }
      indicator.current?.cancel();
      line.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth})`;
    });
    resize.observe(element.querySelector(".lqv-tabs")!);
    const animations: Animation[] = [];
    let ghost: HTMLElement | undefined;
    const changed =
      before.siteId === siteId &&
      (before.topic !== topic ||
        (topic === "highlights" && before.highlight !== highlight));
    if (
      changed &&
      !reduced &&
      !changingSite &&
      element.dataset.quickMotion !== "closing"
    ) {
      const tabs = ["overview", "highlights", "visit"];
      const direction =
        before.topic === topic
          ? Math.sign(highlight - before.highlight)
          : Math.sign(tabs.indexOf(topic) - tabs.indexOf(before.topic));
      const page = element.querySelector<HTMLElement>(
        `[data-quick-section=${topic}]`,
      )!;
      const outgoing = element.querySelector<HTMLElement>(
        `[data-quick-section=${before.topic}]`,
      )!;
      ghost = outgoing.cloneNode(true) as HTMLElement;
      ghost.hidden = false;
      ghost.removeAttribute("id");
      ghost.removeAttribute("data-quick-section");
      ghost.removeAttribute("role");
      ghost
        .querySelectorAll("[id]")
        .forEach((node) => node.removeAttribute("id"));
      ghost.dataset.quickPageGhost = "true";
      ghost.setAttribute("aria-hidden", "true");
      ghost.inert = true;
      if (before.topic === topic)
        ghost
          .querySelectorAll<HTMLElement>("[data-quick-highlight]")
          .forEach((node) => {
            node.hidden =
              Number(node.dataset.quickHighlight) !== before.highlight;
          });
      page.parentElement!.append(ghost);
      element.dataset.quickPageMotion = "changing";
      const easing = "cubic-bezier(.16,1,.3,1)";
      animations.push(
        ghost.animate(
          [
            { opacity: 1, transform: "none" },
            { opacity: 0, transform: `translateX(${-direction * 20}px)` },
          ],
          { duration: 180, easing, fill: "forwards" },
        ),
      );
      animations.push(
        page.animate(
          [
            { opacity: 0, transform: `translateX(${direction * 24}px)` },
            { opacity: 1, transform: "none" },
          ],
          { duration: 460, delay: 90, easing, fill: "backwards" },
        ),
      );
      void Promise.all(animations.map((animation) => animation.finished))
        .then(() => {
          ghost?.remove();
          element.dataset.quickPageMotion = "idle";
        })
        .catch(() => {});
    } else element.dataset.quickPageMotion = "idle";
    return () => {
      resize.disconnect();
      indicator.current?.cancel();
      animations.forEach((animation) => animation.cancel());
      ghost?.remove();
      element.dataset.quickPageMotion = "idle";
    };
  }, [root, topic, highlight, reduced, siteId]);
}
