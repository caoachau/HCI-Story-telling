import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import {
  findKhmerPlace,
  khmerPlacePhotos,
  khmerPlaceSources,
  khmerPlaceZones,
  type PlaceLanguage,
} from "./khmerPlaces";
import {
  paginatePlaceBlocks,
  placeChapterLabels,
  placeChapters,
  placeExhibitionBlocks,
  type PlaceBlock,
  type PlaceChapter,
  type PlaceFrame,
} from "./placeExhibition";
import { usePlaceViewerMotion } from "./usePlaceViewerMotion";

const number = (value: number) => String(value).padStart(2, "0");

function ExhibitionBlock({
  block,
  lang,
  measure = false,
  onRelated,
}: {
  block: PlaceBlock;
  lang: PlaceLanguage;
  measure?: boolean;
  onRelated: (id: string) => void;
}) {
  if (block.kind === "related") {
    const related = findKhmerPlace(block.target!);
    return (
      <div
        className="md-place-block md-place-block-related"
        data-measure-block={measure ? block.id : undefined}
        data-block-id={!measure ? block.id : undefined}
      >
        <button
          type="button"
          disabled={measure}
          tabIndex={measure ? -1 : undefined}
          data-related-place={measure ? undefined : related.id}
          onClick={() => onRelated(related.id)}
        >
          <img
            src={khmerPlacePhotos[related.gallery[0]].src}
            alt=""
            draggable={false}
          />
          <span className="md-place-block-text">{block.text}</span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    );
  }
  if (block.kind === "source") {
    const source =
      khmerPlaceSources[block.target as keyof typeof khmerPlaceSources];
    return (
      <div
        className="md-place-block md-place-block-source"
        data-measure-block={measure ? block.id : undefined}
        data-block-id={!measure ? block.id : undefined}
      >
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={measure ? -1 : undefined}
        >
          <span className="md-place-block-text">{block.text}</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    );
  }
  return (
    <section
      className={`md-place-block md-place-block-${block.kind}`}
      data-measure-block={measure ? block.id : undefined}
      data-block-id={!measure ? block.id : undefined}
    >
      {block.title && <h3>{block.title}</h3>}
      <p className="md-place-block-text">{block.text}</p>
    </section>
  );
}

export function KhmerPlaceExhibition({
  placeId,
  origin,
  lang,
  close,
  onSelect,
}: {
  placeId: string;
  origin?: HTMLElement;
  lang: PlaceLanguage;
  close: () => void;
  onSelect: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const backdropPress = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const [currentId, setCurrentId] = useState(placeId);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [revision, setRevision] = useState(0);
  const [failedPhoto, setFailedPhoto] = useState(false);
  const [anchor, setAnchor] = useState({
    chapter: "overview" as PlaceChapter,
    id: "introduction",
    offset: 0,
  });
  const place = findKhmerPlace(currentId),
    vi = lang === "vi";
  const zone = khmerPlaceZones.find((item) => item.id === place.zone)!;
  const blocks = useMemo(
    () => placeExhibitionBlocks(place, lang, photoIndex),
    [place, lang, photoIndex],
  );
  const [frames, setFrames] = useState<PlaceFrame[]>(() =>
    placeChapters.map((chapter) => ({
      key: chapter,
      chapter,
      blocks: blocks.filter((block) => block.chapter === chapter),
    })),
  );
  const chapterFrames = frames
    .map((frame, index) => ({ frame, index }))
    .filter((item) => item.frame.chapter === anchor.chapter);
  const anchoredFrames = chapterFrames.filter((item) =>
    item.frame.blocks.some(
      (block) => block.id === anchor.id && (block.offset ?? 0) <= anchor.offset,
    ),
  );
  const pageIndex = (anchoredFrames.at(-1) ?? chapterFrames[0])?.index ?? 0;
  const frame = frames[pageIndex];
  const galleryPage = frame.chapter === "gallery";
  const imageIndex = galleryPage
    ? photoIndex
    : frame.chapter === "observe"
      ? Math.min(1, place.gallery.length - 1)
      : frame.chapter === "context"
        ? Math.min(2, place.gallery.length - 1)
        : 0;
  const image = khmerPlacePhotos[place.gallery[imageIndex]];
  const { transition, requestClose, reduced } = usePlaceViewerMotion(
    dialog,
    origin,
    revision,
    close,
  );

  useLayoutEffect(() => {
    const element = content.current!,
      measure = probe.current!;
    measure.inert = true;
    let raf = 0,
      alive = true;
    const update = () => {
      if (!alive) return;
      const next = paginatePlaceBlocks(blocks, measure, element.clientHeight);
      setFrames((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    update();
    void document.fonts.ready.then(schedule);
    return () => {
      alive = false;
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [blocks]);

  function selectFrame(target: PlaceFrame, direction = 1) {
    if (target.key === frame.key) return;
    transition(() => {
      const first = target.blocks[0];
      setAnchor({
        chapter: target.chapter,
        id: first.id,
        offset: first.offset ?? 0,
      });
      setFailedPhoto(false);
      setRevision((value) => value + 1);
    }, direction);
  }
  function changePage(step: number) {
    const target = frames[pageIndex + step];
    if (target) selectFrame(target, step);
  }
  function changePhoto(index: number) {
    if (index === photoIndex) return;
    transition(
      () => {
        setPhotoIndex(index);
        setAnchor({ chapter: "gallery", id: `caption-${index}`, offset: 0 });
        setFailedPhoto(false);
        setRevision((value) => value + 1);
      },
      index > photoIndex ? 1 : -1,
    );
  }
  function related(id: string) {
    transition(() => {
      setCurrentId(id);
      setPhotoIndex(0);
      setAnchor({ chapter: "overview", id: "introduction", offset: 0 });
      setFailedPhoto(false);
      setRevision((value) => value + 1);
      onSelect(id);
    });
  }
  const thumbnailStart = Math.max(
    0,
    Math.min(photoIndex - 1, place.gallery.length - 3),
  );
  const outside = (target: EventTarget | null, current: HTMLDialogElement) =>
    target === current ||
    (target instanceof Element &&
      target.classList.contains("md-place-viewer-backdrop"));
  return (
    <dialog
      ref={dialog}
      className="md-dialog md-dialog-site md-khmer-place-dialog md-place-viewer"
      aria-labelledby="md-dialog-title"
      data-reduced-motion={reduced}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onPointerDown={(event) => {
        backdropPress.current = outside(event.target, event.currentTarget);
      }}
      onClick={(event) => {
        if (backdropPress.current && outside(event.target, event.currentTarget))
          requestClose();
        backdropPress.current = false;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          if (
            (event.target as HTMLElement).closest(
              "input,textarea,select,[data-photo-actions]",
            )
          )
            return;
          event.preventDefault();
          event.stopPropagation();
          changePage(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="md-place-viewer-backdrop" aria-hidden="true" />
      <article
        className="md-site-explorer md-khmer-place-explorer md-place-viewer-panel"
        lang={lang}
        data-place-id={place.id}
        data-page-count={frames.length}
      >
        <header className="md-place-viewer-header">
          <div>
            <span className="md-eyebrow">
              {vi ? "KHÁM PHÁ ĐIỂM ĐẾN" : "EXPLORE A PLACE"}
            </span>
            <p>
              <MapPin aria-hidden="true" />
              {zone.title[lang]}
              <span> / </span>
              {placeChapterLabels[frame.chapter][lang]}
            </p>
          </div>
          <button
            type="button"
            className="md-dialog-close md-place-viewer-close"
            aria-label={vi ? "Đóng điểm khám phá" : "Close place exhibition"}
            autoFocus
            onClick={requestClose}
          >
            <X />
          </button>
        </header>
        <div
          className={`md-place-viewer-page${galleryPage ? " is-gallery" : ""}`}
          data-place-chapter={frame.chapter}
          onPointerDown={(event) => {
            if (
              event.pointerType === "touch" &&
              !(event.target as HTMLElement).closest("button,a")
            )
              swipe.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            const start = swipe.current;
            swipe.current = null;
            if (
              start &&
              Math.abs(event.clientX - start.x) > 50 &&
              Math.abs(event.clientX - start.x) >
                Math.abs(event.clientY - start.y) * 1.5
            )
              changePage(event.clientX < start.x ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <div className="md-place-viewer-visual">
            <figure className="md-place-viewer-image">
              <img
                key={image.src}
                className="md-site-main-image"
                src={image.src}
                alt={image.title[lang]}
                draggable={false}
                onError={() => setFailedPhoto(true)}
              />
              {failedPhoto && (
                <p className="md-place-photo-error" role="status">
                  {vi
                    ? "Không tải được ảnh. Bạn vẫn có thể đọc câu chuyện hoặc chọn ảnh khác."
                    : "This photograph could not load. You can still read the story or choose another photograph."}
                </p>
              )}
            </figure>
            <div className="md-site-photo-caption md-place-visual-credit">
              <strong>{image.title[lang]}</strong>
              <a
                href={khmerPlaceSources[image.source].url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {vi ? "Ảnh: " : "Photo: "}
                {image.author}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            {galleryPage && (
              <div className="md-place-gallery-strip" data-photo-actions>
                <button
                  type="button"
                  className="md-round"
                  aria-label={
                    vi ? "Ảnh trước của điểm đến" : "Previous place photo"
                  }
                  onClick={() =>
                    changePhoto(
                      (photoIndex - 1 + place.gallery.length) %
                        place.gallery.length,
                    )
                  }
                >
                  <ChevronLeft />
                </button>
                <div className="md-site-thumbnails">
                  {place.gallery
                    .slice(thumbnailStart, thumbnailStart + 3)
                    .map((key, index) => (
                      <button
                        key={key}
                        type="button"
                        data-place-photo={thumbnailStart + index}
                        aria-label={`${vi ? "Xem ảnh" : "View photo"} ${thumbnailStart + index + 1}: ${khmerPlacePhotos[key].title[lang]}`}
                        aria-pressed={photoIndex === thumbnailStart + index}
                        onClick={() => changePhoto(thumbnailStart + index)}
                      >
                        <img
                          src={khmerPlacePhotos[key].src}
                          alt=""
                          draggable={false}
                        />
                      </button>
                    ))}
                </div>
                <button
                  type="button"
                  className="md-round"
                  aria-label={
                    vi ? "Ảnh tiếp theo của điểm đến" : "Next place photo"
                  }
                  onClick={() =>
                    changePhoto((photoIndex + 1) % place.gallery.length)
                  }
                >
                  <ChevronRight />
                </button>
                <span className="md-place-photo-count" aria-live="polite">
                  {number(photoIndex + 1)} / {number(place.gallery.length)}
                </span>
              </div>
            )}
          </div>
          <div className="md-place-story">
            <h2
              className="md-place-reader-title"
              id="md-dialog-title"
              tabIndex={-1}
            >
              <span>{place.title[lang]}</span>
            </h2>
            <div className="md-place-reader-body">
              <div className="md-place-content" ref={content}>
                {frame.blocks.map((block) => (
                  <ExhibitionBlock
                    key={`${block.id}:${block.offset ?? 0}`}
                    block={block}
                    lang={lang}
                    onRelated={related}
                  />
                ))}
              </div>
              <div
                className="md-place-content md-place-measure"
                ref={probe}
                aria-hidden="true"
              >
                {blocks.map((block) => (
                  <ExhibitionBlock
                    key={block.id}
                    block={block}
                    lang={lang}
                    measure
                    onRelated={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="md-place-viewer-nav">
          <div
            className="md-place-chapters"
            role="group"
            aria-label={
              vi ? "Các chương của điểm khám phá" : "Exhibition chapters"
            }
          >
            {placeChapters.map((chapter) => (
              <button
                type="button"
                key={chapter}
                data-place-chapter-link={chapter}
                aria-pressed={chapter === frame.chapter}
                onClick={() =>
                  selectFrame(
                    frames.find((item) => item.chapter === chapter)!,
                    placeChapters.indexOf(chapter) >=
                      placeChapters.indexOf(frame.chapter)
                      ? 1
                      : -1,
                  )
                }
              >
                {placeChapterLabels[chapter][lang]}
              </button>
            ))}
          </div>
          <div className="md-place-page-controls">
            <button
              type="button"
              data-place-page="previous"
              disabled={pageIndex === 0}
              aria-label={vi ? "Trang trước" : "Previous exhibition page"}
              onClick={() => changePage(-1)}
            >
              <ArrowLeft aria-hidden="true" />
              <span>{vi ? "Trang trước" : "Previous"}</span>
            </button>
            <span className="md-place-page-count" aria-live="polite">
              {number(pageIndex + 1)}
              <span> / {number(frames.length)}</span>
            </span>
            <button
              type="button"
              data-place-page="next"
              disabled={pageIndex === frames.length - 1}
              aria-label={vi ? "Trang tiếp theo" : "Next exhibition page"}
              onClick={() => changePage(1)}
            >
              <span>{vi ? "Trang sau" : "Next"}</span>
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </footer>
        <span className="md-place-sr" role="status">
          {place.title[lang]} · {placeChapterLabels[frame.chapter][lang]} ·{" "}
          {vi ? "Trang" : "Page"} {pageIndex + 1} / {frames.length}
        </span>
      </article>
    </dialog>
  );
}
