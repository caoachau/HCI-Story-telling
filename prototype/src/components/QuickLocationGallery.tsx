import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { QuickLanguage, QuickPhoto } from "../data/locationQuickContent";

export function QuickLocationGallery({
  photos,
  lang,
  reduced,
}: {
  photos: QuickPhoto[];
  lang: QuickLanguage;
  reduced: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const image = useRef<HTMLImageElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const outgoing = useRef<HTMLImageElement>(null);
  const animation = useRef<Animation | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const vi = lang === "vi",
    photo = photos[index];
  function select(next: number) {
    if (next === index) return;
    animation.current?.cancel();
    setPrevious(status === "ready" ? index : null);
    setStatus("loading");
    setIndex(next);
  }
  useLayoutEffect(() => {
    if (status !== "ready" || !image.current) return;
    if (reduced || previous === null) {
      if (visual.current) visual.current.dataset.galleryMotion = "idle";
      setPrevious(null);
      return;
    }
    visual.current!.dataset.galleryMotion = "changing";
    const old = outgoing.current?.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(1.025)" },
      ],
      { duration: 650, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
    );
    const current = image.current.animate(
      [
        { opacity: 0, transform: "scale(1.04)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" },
    );
    animation.current = current;
    void current.finished
      .then(() => {
        setPrevious(null);
        animation.current = null;
        if (visual.current) visual.current.dataset.galleryMotion = "idle";
      })
      .catch(() => {});
    return () => {
      current.cancel();
      old?.cancel();
    };
  }, [index, status, reduced]);
  useLayoutEffect(() => {
    if (reduced) return;
    const root = visual.current!,
      frame = root.querySelector<HTMLElement>(".lqv-photo")!,
      light = root.querySelector<HTMLElement>(".lqv-photo-light")!;
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    let raf = 0,
      px = 0,
      py = 0;
    const move = (event: PointerEvent) => {
      if (
        !media.matches ||
        event.pointerType !== "mouse" ||
        root.closest("[hidden]") ||
        ["opening", "changing-site", "entering-detail", "closing"].includes(
          root.closest<HTMLElement>(".lqv-root")?.dataset.quickMotion ?? "",
        )
      )
        return;
      const bounds = frame.getBoundingClientRect();
      px = event.clientX - bounds.left;
      py = event.clientY - bounds.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!image.current) return;
        image.current.style.translate = `${(px / bounds.width - 0.5) * 7}px ${(py / bounds.height - 0.5) * 5}px`;
        light.style.transform = `translate3d(${px - 120}px,${py - 120}px,0)`;
        light.style.opacity = "1";
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      image.current?.style.removeProperty("translate");
      light.style.opacity = "0";
    };
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      reset();
      frame.removeEventListener("pointermove", move);
      frame.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [reduced, index]);
  return (
    <div className="lqv-visual" ref={visual} data-photo-status={status}>
      <div
        className="lqv-photo"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            select(
              (index + (event.key === "ArrowRight" ? 1 : -1) + photos.length) %
                photos.length,
            );
          }
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType === "touch" &&
            !(event.target as HTMLElement).closest("button")
          )
            swipe.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (
            start &&
            Math.abs(event.clientX - start.x) > 45 &&
            Math.abs(event.clientX - start.x) >
              Math.abs(event.clientY - start.y) * 1.5
          )
            select(
              (index + (event.clientX < start.x ? 1 : -1) + photos.length) %
                photos.length,
            );
        }}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        <img
          key={photo.src}
          ref={image}
          src={photo.src}
          alt={photo.caption[lang]}
          title={`${photo.caption[lang]}${photo.credit ? ` · ${photo.credit}` : ""}`}
          draggable={false}
          data-quick-photo={index}
          onLoad={() => setStatus("ready")}
          onError={() => {
            setStatus("error");
            setPrevious(null);
          }}
          style={status === "ready" ? undefined : { opacity: 0 }}
        />
        {previous !== null && (
          <img
            ref={outgoing}
            className="lqv-photo-previous"
            src={photos[previous].src}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        )}
        <i className="lqv-photo-light" aria-hidden="true" />
        {status === "error" && (
          <div className="lqv-photo-fallback" role="status">
            <ImageOff />
            <span>
              {vi
                ? "Chưa tải được ảnh tư liệu"
                : "This photograph could not load"}
            </span>
            {photos.length > 1 && (
              <button
                type="button"
                onClick={() => select((index + 1) % photos.length)}
              >
                {vi ? "Chọn ảnh khác" : "Choose another photograph"}
              </button>
            )}
          </div>
        )}
        {status === "loading" && previous === null && (
          <span className="lqv-photo-loading" role="status">
            {vi ? "Đang tải ảnh…" : "Loading photograph…"}
          </span>
        )}
        {photos.length > 1 && (
          <div className="lqv-photo-controls">
            <span aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              aria-label={vi ? "Ảnh trước" : "Previous photograph"}
              onClick={() =>
                select((index - 1 + photos.length) % photos.length)
              }
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label={vi ? "Ảnh tiếp theo" : "Next photograph"}
              onClick={() => select((index + 1) % photos.length)}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
      <div className="lqv-photo-caption" aria-live="polite">
        <p>{photo.caption[lang]}</p>
        {photo.credit && (
          <span>
            {vi ? "Ảnh: " : "Photo: "}
            {photo.credit}
          </span>
        )}
      </div>
      {photos.length > 1 && (
        <div
          className="lqv-photo-thumbnails"
          role="group"
          aria-label={vi ? "Ảnh địa điểm" : "Location photographs"}
        >
          {photos.map((item, n) => (
            <button
              key={item.src}
              type="button"
              data-quick-thumbnail={n}
              aria-pressed={n === index}
              aria-label={`${vi ? "Xem ảnh" : "View photo"} ${n + 1}: ${item.caption[lang]}`}
              onClick={() => select(n)}
            >
              <img src={item.src} alt="" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
