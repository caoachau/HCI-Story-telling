import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TourPhotoItem {
  id: string;
  name: string;
  photo: string;
  background: string;
}

export function TourPhotoDrawer({
  selectedScene,
  onSelect,
  items,
  lang,
  topicTitle,
}: {
  selectedScene: number;
  onSelect: (index: number, origin?: HTMLButtonElement) => void;
  items: TourPhotoItem[];
  lang: "vi" | "en";
  topicTitle: string;
}) {
  const vi = lang === "vi";
  const [expanded, setExpanded] = useState(false);
  const [firstVisible, setFirstVisible] = useState(0);
  const visibleCount = Math.min(3, items.length);
  const lastStart = Math.max(0, items.length - visibleCount);
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
        Math.min(lastStart, Math.round(element.scrollLeft / step)),
      ),
    );
  };

  useEffect(() => {
    const element = track.current;
    if (!expanded || !element) return;
    const revealSelected = () => {
      const photo = element.children[selectedScene] as HTMLElement;
      if (!photo) return;
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
  }, [expanded, selectedScene, items]);

  const move = (direction: number) => {
    const element = track.current;
    const photo = element?.firstElementChild;
    if (!element || !photo) return;
    const step =
      photo.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap);
    element.scrollTo({
      left:
        Math.max(0, Math.min(lastStart, firstVisible + direction)) *
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
            src={items[(selectedScene + 1) % items.length].background}
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
          expanded
            ? vi
              ? "Thu gọn ảnh liên quan"
              : "Collapse related photographs"
            : vi
              ? `Xem ảnh liên quan: ${topicTitle}`
              : `Related photographs: ${topicTitle}`
        }
        title={
          expanded
            ? vi
              ? "Thu gọn ảnh liên quan"
              : "Collapse gallery"
            : vi
              ? "Ảnh liên quan đến chủ đề"
              : "Related topic photographs"
        }
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
        aria-label={
          vi ? `Ảnh liên quan: ${topicTitle}` : `Related photographs: ${topicTitle}`
        }
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
          <span>{vi ? "ẢNH LIÊN QUAN" : "RELATED PHOTOGRAPHS"}</span>
          <small>
            {items.length} {vi ? "ẢNH" : "PHOTOS"}
          </small>
        </div>
        <p className="md-culture-related-title">{topicTitle}</p>
        <div
          ref={track}
          className="md-tour-photo-track"
          style={{ gridAutoColumns: `calc((100% - ${Math.max(0, visibleCount - 1)} * var(--md-photo-gap)) / ${visibleCount || 1})` }}
          tabIndex={expanded ? 0 : -1}
          aria-label={
            vi
              ? "Chọn một ảnh liên quan để xem trên ảnh nền."
              : "Select a related photograph to display in the background."
          }
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
          {items.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className="md-tour-photo-card"
              data-culture-photo={scene.id}
              aria-label={`${vi ? "Xem" : "View"} ${scene.name}`}
              aria-pressed={selectedScene === index}
              onClick={(event) => onSelect(index, event.currentTarget)}
            >
              <img
                src={scene.background}
                alt=""
                loading="lazy"
                draggable={false}
              />
              <span>{scene.name}</span>
            </button>
          ))}
        </div>
        {items.length > visibleCount && <div className="md-tour-photo-controls">
          <button
            type="button"
            aria-label={vi ? "Ảnh trước" : "Previous heritage photos"}
            disabled={firstVisible === 0}
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </button>
          <span aria-live="polite">
            {String(firstVisible + 1).padStart(2, "0")} -{" "}
            {String(Math.min(items.length, firstVisible + visibleCount)).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            aria-label={vi ? "Ảnh tiếp theo" : "Next heritage photos"}
            disabled={firstVisible >= lastStart}
            onClick={() => move(1)}
          >
            <ChevronRight />
          </button>
        </div>}
      </div>
    </>
  );
}
