import { useRef, type PointerEvent } from "react";
import { artwork, scenes } from "./data";

export function TourGalleryStrip({
  selectedScene,
  onSelect,
}: {
  selectedScene: number;
  onSelect: (index: number) => void;
}) {
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
      className="md-gallery-strip"
      role="region"
      aria-label="Cave gallery. Drag or swipe horizontally to browse photos."
      tabIndex={0}
      onPointerDown={(event) => {
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
      {scenes.map((scene, index) => (
        <button
          key={scene.name}
          type="button"
          className={selectedScene === index ? "is-selected" : ""}
          aria-label={`View ${scene.name}`}
          aria-pressed={selectedScene === index}
          onClick={() => onSelect(index)}
        >
          <img
            src={artwork(scene.photo)}
            alt={scene.name}
            loading="lazy"
            draggable={false}
          />
        </button>
      ))}
    </div>
  );
}
