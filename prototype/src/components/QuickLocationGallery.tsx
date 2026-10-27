import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { QuickLanguage, QuickPhoto } from "../data/locationQuickContent";

export function QuickLocationGallery({
  photos,
  lang,
  onPhotoChange,
}: {
  photos: QuickPhoto[];
  lang: QuickLanguage;
  onPhotoChange: (photo: QuickPhoto) => void;
}) {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const image = useRef<HTMLImageElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const vi = lang === "vi",
    photo = photos[index];
  useLayoutEffect(() => {
    onPhotoChange(photo);
  }, [photo, onPhotoChange]);
  function select(next: number) {
    if (next === index) return;
    setStatus("loading");
    setIndex(next);
  }
  useLayoutEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) setStatus("ready");
  }, [photo.src]);
  return (
    <div className="lqv-visual" data-photo-status={status} data-gallery-motion="idle">
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
          draggable={false}
          data-quick-photo={index}
          onLoad={() => setStatus("ready")}
          onError={() => {
            setStatus("error");
          }}
          style={status === "ready" ? undefined : { opacity: 0 }}
        />
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
        {status === "loading" && (
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
