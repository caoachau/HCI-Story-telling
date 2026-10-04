import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { artwork, scenes } from "./data";

export function TourPhotoDrawer({
  selectedScene,
  onSelect,
}: {
  selectedScene: number;
  onSelect: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [firstVisible, setFirstVisible] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const drag = useRef<{
    pointerId: number;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  } | null>(null);

  const updatePosition = () => {
    const element = track.current;
    const photo = element?.firstElementChild;
    if (!element || !photo) return;
    const step =
      photo.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap);
    setFirstVisible(
      Math.max(
        0,
        Math.min(scenes.length - 3, Math.round(element.scrollLeft / step)),
      ),
    );
  };

  useEffect(() => {
    const element = track.current;
    if (!expanded || !element) return;
    const revealSelected = () => {
      const photo = element.children[selectedScene] as HTMLElement;
      const left = photo.offsetLeft - element.offsetLeft;
      const right = left + photo.offsetWidth;
      if (
        left < element.scrollLeft ||
        right > element.scrollLeft + element.clientWidth + 1
      ) {
        element.scrollTo({
          left: left < element.scrollLeft ? left : right - element.clientWidth,
          behavior: "instant",
        });
      }
      updatePosition();
    };
    revealSelected();
    let observedWidth = element.clientWidth;
    const observer = new ResizeObserver(() => {
      if (element.clientWidth !== observedWidth) {
        observedWidth = element.clientWidth;
        revealSelected();
      } else {
        updatePosition();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded, selectedScene]);

  const move = (direction: number) => {
    const element = track.current;
    const photo = element?.firstElementChild;
    if (!element || !photo) return;
    const step =
      photo.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap);
    element.scrollTo({
      left:
        Math.max(0, Math.min(scenes.length - 3, firstVisible + direction)) *
        step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    element.removeAttribute("data-dragging");
    if (element.hasPointerCapture(event.pointerId))
      element.releasePointerCapture(event.pointerId);
  };

  return (
    <>
      {!expanded && (
        <div className="md-tour-next-preview" aria-hidden="true">
          <img
            src={artwork(
              scenes[(selectedScene + 1) % scenes.length].background,
            )}
            alt=""
            loading="lazy"
          />
        </div>
      )}
      <button
        ref={toggle}
        className="md-tour-gallery-toggle"
        type="button"
        aria-expanded={expanded}
        aria-controls="md-tour-photo-panel"
        aria-label={
          expanded ? "Collapse cave gallery" : "Expand cave gallery to the left"
        }
        title={expanded ? "Collapse gallery" : "Expand gallery"}
        onClick={() => setExpanded((value) => !value)}
        onKeyDown={(event) => {
          if (expanded && event.key === "Escape") {
            event.stopPropagation();
            setExpanded(false);
          }
        }}
      >
        {expanded ? <ChevronRight /> : <ChevronLeft />}
      </button>
      <div
        id="md-tour-photo-panel"
        className="md-tour-photo-panel"
        role="region"
        aria-label="Expandable cave gallery"
        hidden={!expanded}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.stopPropagation();
            setExpanded(false);
            toggle.current?.focus({ preventScroll: true });
          }
        }}
      >
        <div className="md-tour-photo-heading">
          <span>CAVE GALLERY</span>
          <small>{scenes.length} PHOTOS</small>
        </div>
        <div
          ref={track}
          className="md-tour-photo-track"
          tabIndex={expanded ? 0 : -1}
          aria-label="Cave photos. Swipe or use the arrow buttons to browse."
          onScroll={updatePosition}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse" || event.button !== 0) {
              drag.current = null;
              return;
            }
            drag.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              scrollLeft: event.currentTarget.scrollLeft,
              moved: false,
            };
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
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.setAttribute("data-dragging", "true");
            event.currentTarget.scrollLeft = active.scrollLeft - distance;
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={(event) =>
            event.currentTarget.removeAttribute("data-dragging")
          }
          onClickCapture={(event) => {
            if (drag.current?.moved) {
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
              className="md-tour-photo-card"
              aria-label={`View ${scene.name}`}
              aria-pressed={selectedScene === index}
              onClick={() => onSelect(index)}
            >
              <img
                src={artwork(scene.background)}
                alt=""
                loading="lazy"
                draggable={false}
              />
              <span>{scene.name}</span>
            </button>
          ))}
        </div>
        <div className="md-tour-photo-controls">
          <button
            type="button"
            aria-label="Previous cave photos"
            disabled={firstVisible === 0}
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </button>
          <span aria-live="polite">
            {String(firstVisible + 1).padStart(2, "0")} -{" "}
            {String(firstVisible + 3).padStart(2, "0")} /{" "}
            {String(scenes.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label="Next cave photos"
            disabled={firstVisible === scenes.length - 3}
            onClick={() => move(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}
