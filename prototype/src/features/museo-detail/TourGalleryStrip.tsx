import { useEffect, useRef, type PointerEvent } from "react";
import type { TourPhotoItem } from "./TourPhotoDrawer";

export function TourGalleryStrip({
  selectedScene,
  onSelect,
  items,
  lang,
  active,
  onPreview,
}: {
  selectedScene: number;
  onSelect: (index: number, origin?: HTMLButtonElement) => void;
  onPreview?: (index?: number) => void;
  items: TourPhotoItem[];
  lang: "vi" | "en";
  active: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = track.current;
    if (!active || !element) return;
    const reveal = () => {
      const card = element.children[selectedScene] as HTMLElement;
      if (!card) return;
      const box = card.getBoundingClientRect();
      const frame = element.getBoundingClientRect();
      if (box.left < frame.left)
        element.scrollLeft += box.left - frame.left - 4;
      if (box.right > frame.right)
        element.scrollLeft += box.right - frame.right + 4;
    };
    reveal();
    const observer = new ResizeObserver(reveal);
    observer.observe(element);
    return () => observer.disconnect();
  }, [active, items, selectedScene]);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    const element = event.currentTarget;
    element.removeAttribute("data-dragging");
    if (element.hasPointerCapture(event.pointerId))
      element.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      ref={track}
      className="md-gallery-strip"
      role="region"
      aria-label={
        lang === "vi"
          ? "Ảnh di sản. Nắm kéo hoặc vuốt ngang để xem các chủ đề."
          : "Heritage gallery. Drag or swipe horizontally to browse topics."
      }
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          const photo = event.currentTarget.firstElementChild;
          if (!photo) return;
          const step =
            photo.getBoundingClientRect().width +
            parseFloat(getComputedStyle(event.currentTarget).columnGap);
          event.currentTarget.scrollBy({
            left: step * (event.key === "ArrowLeft" ? -1 : 1),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          });
        }
      }}
      onPointerDown={(event) => {
        onPreview?.();
        drag.current =
          event.pointerType === "mouse" && event.button === 0
            ? {
                pointerId: event.pointerId,
                startX: event.clientX,
                scrollLeft: event.currentTarget.scrollLeft,
                moved: false,
              }
            : null;
      }}
      onPointerMove={(event) => {
        const active = drag.current;
        if (
          !active ||
          active.pointerId !== event.pointerId ||
          !(event.buttons & 1)
        )
          return;
        const distance = event.clientX - active.startX;
        if (!active.moved && Math.abs(distance) < 6) return;
        active.moved = true;
        const element = event.currentTarget;
        element.setPointerCapture(event.pointerId);
        element.setAttribute("data-dragging", "true");
        element.scrollLeft = active.scrollLeft - distance;
      }}
      onPointerUp={endDrag}
      onPointerCancel={(event) => {
        endDrag(event);
        drag.current = null;
      }}
      onLostPointerCapture={(event) =>
        event.currentTarget.removeAttribute("data-dragging")
      }
      onClickCapture={(event) => {
        // Browsing with the mouse must not select the photo beneath its release.
        if (drag.current?.moved && event.detail > 0) {
          event.preventDefault();
          event.stopPropagation();
          drag.current = null;
        }
      }}
    >
      {items.map((scene, index) => (
        <button
          key={scene.id}
          type="button"
          className={selectedScene === index ? "is-selected" : ""}
          data-culture-photo={scene.id}
          aria-label={`${lang === "vi" ? "Xem" : "View"} ${scene.name}`}
          aria-pressed={selectedScene === index}
          onClick={(event) => onSelect(index, event.currentTarget)}
          onMouseEnter={() => onPreview?.(index)}
          onMouseLeave={() => onPreview?.()}
          onFocus={() => onPreview?.(index)}
          onBlur={() => onPreview?.()}
        >
          <img src={scene.photo} alt="" loading="lazy" draggable={false} />
          <span>{scene.name}</span>
        </button>
      ))}
    </div>
  );
}
