import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { restoredParams, updateRoute, useRememberedState } from '../../experience/state';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { khmerLegacyValues } from "./khmerLegacy";
import { khmerCulturePhotos, type CultureLanguage } from "./khmerCulture";
import type { MuseumSection } from "./useMuseumScreens";
import {
  legacyExhibitionBlocks,
  paginateLegacyBlocks,
  type LegacyBlock,
  type LegacyFrame,
} from "./legacyExhibition";
import { useLegacyViewerMotion } from "./useLegacyViewerMotion";

const number = (value: number) => String(value).padStart(2, "0");
function ExhibitionBlock({
  block,
  measure = false,
  onExplore,
}: {
  block: LegacyBlock;
  measure?: boolean;
  onExplore: () => void;
}) {
  return (
    <section
      className={`md-legacy-block md-legacy-block-${block.kind}`}
      data-measure-block={measure ? block.id : undefined}
      data-block-id={measure ? undefined : block.id}
      data-block-offset={measure ? undefined : (block.offset ?? 0)}
    >
      {block.title && <h4>{block.title}</h4>}
      {block.kind === "source" ? (
        <a
          className="md-story-source"
          href={block.target}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={measure ? -1 : undefined}
        >
          <span className="md-legacy-block-text">{block.text}</span>
          <ArrowUpRight />
        </a>
      ) : block.kind === "related" ? (
        <button
          type="button"
          data-legacy-explore={measure ? undefined : "related"}
          disabled={measure}
          onClick={onExplore}
        >
          <span className="md-legacy-block-text">{block.text}</span>
          <ArrowRight />
        </button>
      ) : (
        <p className="md-legacy-block-text">{block.text}</p>
      )}
    </section>
  );
}

export function KhmerLegacyExhibition({
  valueId,
  origin,
  lang,
  close,
  onSelect,
  onExplore,
}: {
  valueId: string;
  origin?: HTMLElement;
  lang: CultureLanguage;
  close: () => void;
  onSelect: (id: string) => void;
  onExplore: (section: MuseumSection, item: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    content = useRef<HTMLDivElement>(null),
    probe = useRef<HTMLDivElement>(null),
    backdropPress = useRef(false),
    swipe = useRef<{ x: number; y: number } | null>(null);
  const initial = restoredParams('bao-tang-khmer');
  const [id, setId] = useState(valueId),
    [photoIndex, setPhotoIndex] = useRememberedState(`museum:legacy:${valueId}:photo`, Math.max(0, Math.min((khmerLegacyValues.find(value => value.id === valueId)?.gallery.length || 1) - 1, Number(initial.get('photo')) || 0)), initial.has('photo')),
    [revision, setRevision] = useState(0),
    [photoFailed, setPhotoFailed] = useState(false);
  const validChapter = ['overview', 'photographs', 'context', ...(khmerLegacyValues.find(value => value.id === valueId)?.chapters.map(chapter => chapter.id) || [])].find(chapter => chapter === initial.get('chapter')) || 'overview';
  const [anchor, setAnchor] = useRememberedState(`museum:legacy:${valueId}:anchor`, {
    chapter: validChapter,
    id: initial.get('anchorId') || 'lead',
    offset: Math.max(0, Math.min(10000, Number(initial.get('anchorOffset')) || 0)),
  }, initial.has('chapter'));
  useEffect(() => { updateRoute({ value: id, photo: photoIndex, chapter: anchor.chapter, anchorId: anchor.id, anchorOffset: anchor.offset }, 'bao-tang-khmer'); }, [id, photoIndex, anchor.chapter, anchor.id, anchor.offset]);
  const index = Math.max(
      0,
      khmerLegacyValues.findIndex((value) => value.id === id),
    ),
    value = khmerLegacyValues[index],
    vi = lang === "vi";
  const blocks = useMemo(
    () => legacyExhibitionBlocks(value, lang, photoIndex),
    [value, lang, photoIndex],
  );
  const chapters = useMemo(
    () => [
      { id: "overview", title: vi ? "Tổng quan" : "Overview" },
      ...value.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title[lang],
      })),
      { id: "photographs", title: vi ? "Ảnh tư liệu" : "Photographs" },
      {
        id: "context",
        title: vi ? "Giá trị & Liên hệ" : "Values & Connections",
      },
    ],
    [value, lang],
  );
  const [frames, setFrames] = useState<LegacyFrame[]>(() =>
    chapters.map((chapter) => ({
      key: chapter.id,
      chapter: chapter.id,
      blocks: blocks.filter((block) => block.chapter === chapter.id),
    })),
  );
  const choices = frames
    .map((frame, index) => ({ frame, index }))
    .filter((item) => item.frame.chapter === anchor.chapter);
  const matching = choices.filter((item) =>
    item.frame.blocks.some(
      (block) => block.id === anchor.id && (block.offset ?? 0) <= anchor.offset,
    ),
  );
  const pageIndex = (matching.at(-1) ?? choices[0])?.index ?? 0,
    frame = frames[pageIndex];
  const chapter =
    chapters.find((item) => item.id === frame.chapter) ?? chapters[0];
  const photo = khmerCulturePhotos[value.gallery[photoIndex]];
  const { transition, requestClose, reduced } = useLegacyViewerMotion(
    dialog,
    origin,
    id,
    revision,
    close,
  );
  useLayoutEffect(() => {
    const element = content.current!,
      measure = probe.current!;
    measure.inert = true;
    let alive = true,
      raf = 0;
    const update = () => {
      if (!alive) return;
      const next = paginateLegacyBlocks(blocks, measure, element.clientHeight);
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
    window.addEventListener('heritage:preferences', schedule);
    update();
    void document.fonts.ready.then(schedule);
    return () => {
      alive = false;
      window.removeEventListener('heritage:preferences', schedule);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [blocks]);
  function selectFrame(target: LegacyFrame, direction = 1) {
    if (target.key === frame.key) return;
    transition(() => {
      const first = target.blocks[0];
      setAnchor({
        chapter: target.chapter,
        id: first.id,
        offset: first.offset ?? 0,
      });
      setRevision((previous) => previous + 1);
    }, direction);
  }
  function changePage(direction: number) {
    const target = frames[pageIndex + direction];
    if (target) selectFrame(target, direction);
  }
  function chooseChapter(chapterId: string) {
    const target = frames.find((item) => item.chapter === chapterId);
    if (target)
      selectFrame(target, frames.indexOf(target) > pageIndex ? 1 : -1);
  }
  function selectPhoto(next: number) {
    if (next === photoIndex) return;
    transition(
      () => {
        setPhotoIndex(next);
        setPhotoFailed(false);
        setRevision((previous) => previous + 1);
        if (anchor.chapter === "photographs")
          setAnchor({ chapter: "photographs", id: "photo-caption", offset: 0 });
      },
      next > photoIndex ? 1 : -1,
    );
  }
  function selectValue(next: number) {
    if (next < 0 || next >= khmerLegacyValues.length) return;
    transition(
      () => {
        const target = khmerLegacyValues[next];
        setId(target.id);
        setPhotoIndex(0);
        setPhotoFailed(false);
        setAnchor({ chapter: "overview", id: "lead", offset: 0 });
        const nextBlocks = legacyExhibitionBlocks(target, lang, 0);
        setFrames([
          {
            key: "overview",
            chapter: "overview",
            blocks: nextBlocks.filter((block) => block.chapter === "overview"),
          },
        ]);
        setRevision((previous) => previous + 1);
        onSelect(target.id);
        queueMicrotask(() =>
          dialog.current
            ?.querySelector<HTMLElement>("#md-dialog-title")
            ?.focus({ preventScroll: true }),
        );
      },
      next > index ? 1 : -1,
    );
  }
  function explore() {
    requestClose(() => onExplore(value.related.section, value.related.item));
  }
  const outside = (target: EventTarget | null) =>
    target === dialog.current ||
    (target instanceof HTMLElement &&
      target.classList.contains("md-legacy-viewer-backdrop"));
  return (
    <dialog
      ref={dialog}
      className="md-dialog md-dialog-legacy md-legacy-viewer"
      aria-labelledby="md-dialog-title"
      data-reduced-motion={reduced}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onPointerDown={(event) => {
        backdropPress.current = outside(event.target);
      }}
      onClick={(event) => {
        if (backdropPress.current && outside(event.target)) requestClose();
        backdropPress.current = false;
      }}
      onKeyDown={(event) => {
        if (
          (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
          !(event.target as HTMLElement).closest(
            "input,textarea,select,[data-photo-actions]",
          )
        ) {
          event.preventDefault();
          event.stopPropagation();
          changePage(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="md-legacy-viewer-backdrop" aria-hidden="true" />
      <article
        className="md-legacy-viewer-panel md-legacy-reading"
        data-legacy-story={id}
        data-page-count={frames.length}
        lang={lang}
      >
        <header className="md-legacy-viewer-header">
          <div>
            <span className="md-eyebrow">
              {vi ? "DẤU ẤN & GIÁ TRỊ DI SẢN" : "HERITAGE & LASTING VALUES"}
            </span>
            <h2
              className="md-legacy-viewer-title"
              id="md-dialog-title"
              tabIndex={-1}
            >
              <span>{value.title[lang]}</span>
            </h2>
          </div>
          <div className="md-legacy-value-navigation md-legacy-next">
            <button
              type="button"
              disabled={index === 0}
              aria-label={vi ? "Giá trị trước" : "Previous heritage value"}
              title={vi ? "Giá trị trước" : "Previous heritage value"}
              onClick={() => selectValue(index - 1)}
            >
              <ChevronLeft />
            </button>
            <span>{number(index + 1)} / 06</span>
            <button
              type="button"
              disabled={index === 5}
              aria-label={vi ? "Giá trị tiếp" : "Next heritage value"}
              title={vi ? "Giá trị tiếp" : "Next heritage value"}
              onClick={() => selectValue(index + 1)}
            >
              <ChevronRight />
            </button>
          </div>
          <button
            type="button"
            className="md-dialog-close md-legacy-viewer-close"
            aria-label={
              vi ? "Đóng triển lãm di sản" : "Close heritage exhibition"
            }
            onClick={() => requestClose()}
          >
            <X />
          </button>
        </header>
        <nav
          className="md-legacy-chapter-tabs"
          aria-label={vi ? "Các chương di sản" : "Heritage chapters"}
        >
          {chapters.map((item, chapterIndex) => (
            <button
              key={item.id}
              type="button"
              data-legacy-chapter-link={item.id}
              aria-current={frame.chapter === item.id ? "page" : undefined}
              onClick={() => chooseChapter(item.id)}
            >
              <small>{number(chapterIndex + 1)}</small>
              {item.title}
            </button>
          ))}
        </nav>
        <div
          className="md-legacy-viewer-page"
          data-legacy-chapter={frame.chapter}
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
              Math.abs(event.clientX - start.x) > 55 &&
              Math.abs(event.clientX - start.x) >
                Math.abs(event.clientY - start.y) * 1.5
            )
              changePage(event.clientX < start.x ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <div className="md-legacy-visual md-culture-gallery">
            <figure>
              <img
                className="md-legacy-main-image md-story-photo"
                src={photo.src}
                alt={photo.title[lang]}
                onLoad={() => setPhotoFailed(false)}
                onError={() => setPhotoFailed(true)}
                draggable={false}
              />
              {photoFailed && (
                <p className="md-legacy-photo-error" role="status">
                  {vi
                    ? "Ảnh chưa tải được. Bạn vẫn có thể đọc nội dung hoặc chọn ảnh khác."
                    : "The photograph could not load. Keep reading or choose another image."}
                </p>
              )}
              <figcaption>
                <span>{photo.title[lang]}</span>
                <a
                  href={photo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {photo.author}
                  <ArrowUpRight />
                </a>
              </figcaption>
            </figure>
            <div
              className="md-legacy-photo-thumbnails md-culture-story-photos"
              data-photo-actions
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  event.stopPropagation();
                  selectPhoto(
                    (photoIndex +
                      (event.key === "ArrowRight" ? 1 : -1) +
                      value.gallery.length) %
                      value.gallery.length,
                  );
                }
              }}
              aria-label={
                vi ? "Chọn ảnh tư liệu" : "Choose a documentary photograph"
              }
            >
              {value.gallery.map((photoId, imageIndex) => (
                <button
                  key={photoId}
                  type="button"
                  aria-pressed={imageIndex === photoIndex}
                  aria-label={khmerCulturePhotos[photoId].title[lang]}
                  onClick={() => selectPhoto(imageIndex)}
                >
                  <img
                    src={khmerCulturePhotos[photoId].src}
                    alt=""
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="md-legacy-reader">
            <div className="md-legacy-reader-heading">
              <span className="md-eyebrow">
                {number(
                  chapters.findIndex((item) => item.id === frame.chapter) + 1,
                )}{" "}
                / {number(chapters.length)}
              </span>
              <h3>{chapter.title}</h3>
            </div>
            <div className="md-legacy-content-shell">
              <div
                ref={content}
                className="md-legacy-content md-story-text"
                data-legacy-current-page
              >
                {frame.blocks.map((block) => (
                  <ExhibitionBlock
                    key={`${block.id}:${block.offset ?? 0}`}
                    block={block}
                    onExplore={explore}
                  />
                ))}
              </div>
              <div
                ref={probe}
                className="md-legacy-content md-legacy-measure"
                aria-hidden="true"
              >
                {blocks.map((block) => (
                  <ExhibitionBlock
                    key={block.id}
                    block={block}
                    measure
                    onExplore={explore}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <footer className="md-legacy-viewer-nav">
          <button
            type="button"
            data-legacy-page="previous"
            aria-label={vi ? "Trang trước" : "Previous page"}
            disabled={pageIndex === 0}
            onClick={() => changePage(-1)}
          >
            <ChevronLeft />
            <span>{vi ? "TRANG TRƯỚC" : "PREVIOUS PAGE"}</span>
          </button>
          <span
            className="md-legacy-page-count"
            role="status"
            aria-live="polite"
          >
            {number(pageIndex + 1)} / {number(frames.length)}
          </span>
          <button
            type="button"
            data-legacy-page="next"
            aria-label={vi ? "Trang tiếp" : "Next page"}
            disabled={pageIndex === frames.length - 1}
            onClick={() => changePage(1)}
          >
            <span>{vi ? "TRANG TIẾP" : "NEXT PAGE"}</span>
            <ChevronRight />
          </button>
        </footer>
      </article>
    </dialog>
  );
}
