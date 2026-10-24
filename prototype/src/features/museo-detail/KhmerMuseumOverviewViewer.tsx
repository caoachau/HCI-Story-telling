import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { khmerPlaces } from "./khmerPlaces";
import {
  khmerOverviewHighlights,
  khmerOverviewSources,
  khmerOverviewStories,
  khmerOverviewVisitReasons,
  type KhmerOverviewTopic,
} from "./khmerOverview";
import {
  overviewGroups,
  overviewViewerLeads,
  overviewViewerMedia,
  overviewViewerMetadata,
  type OverviewLanguage,
} from "./khmerOverviewExhibition";
import {
  museumEase,
  museumMotionReduced,
  museumSmooth,
  useMuseumReducedMotion,
} from "./museumMotion";

const number = (value: number) => String(value).padStart(2, "0");
const mercator = ([latitude, longitude]: [number, number]) => {
  const radians = (latitude * Math.PI) / 180;
  return [
    ((longitude + 180) / 360) * 2 ** 17,
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) *
      2 ** 17,
  ];
};
const centre = mercator(khmerPlaces[0].coordinates!);
const start = [Math.floor(centre[0]) - 1, Math.floor(centre[1]) - 1];

function OverviewMap({ lang }: { lang: OverviewLanguage }) {
  const [selected, setSelected] = useState("entrance");
  return (
    <div
      className="md-overview-map"
      aria-label={
        lang === "vi"
          ? "Bản đồ Bảo tàng Khmer, Ao Bà Om và Chùa Âng"
          : "Map of the Khmer museum, Ba Om Pond and Ang Pagoda"
      }
    >
      <div className="md-overview-map-plane">
        <div className="md-overview-map-tiles" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <img
              key={index}
              alt=""
              draggable={false}
              src={`${import.meta.env.BASE_URL}map-tiles/esri-13192/17/${start[1] + Math.floor(index / 3)}/${start[0] + (index % 3)}.jpg`}
            />
          ))}
        </div>
        {khmerPlaces
          .filter((place) => place.coordinates)
          .map((place) => {
            const point = mercator(place.coordinates!);
            return (
              <button
                type="button"
                key={place.id}
                className={`md-overview-map-marker${selected === place.id ? " is-selected" : ""}`}
                data-overview-place={place.id}
                data-latitude={place.coordinates![0]}
                data-longitude={place.coordinates![1]}
                style={{
                  left: `${((point[0] - start[0]) / 3) * 100}%`,
                  top: `${((point[1] - start[1]) / 3) * 100}%`,
                }}
                aria-pressed={selected === place.id}
                onClick={() => setSelected(place.id)}
              >
                <MapPin aria-hidden="true" />
                <span>
                  {place.id === "entrance"
                    ? lang === "vi"
                      ? "Bảo tàng Khmer"
                      : "Khmer Museum"
                    : place.title[lang]}
                </span>
              </button>
            );
          })}
      </div>
      <span className="md-overview-map-attribution">Esri</span>
    </div>
  );
}

// The native dialog provides the focus trap and makes all map/section controls inert.
// Flight images stay inside its top layer, including the reverse closing transition.
export function KhmerOverviewViewer({
  initialTopic,
  origin,
  lang,
  close,
}: {
  initialTopic: KhmerOverviewTopic;
  origin?: HTMLElement;
  lang: OverviewLanguage;
  close: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef(
    origin ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null),
  );
  const context = useRef<gsap.Context | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const flight = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const backdropPress = useRef(false);
  const busy = useRef(false);
  const reduced = useMuseumReducedMotion(dialog);
  const [reading, setReading] = useState({
    topic: initialTopic,
    photoIndex: 0,
    revision: 0,
    direction: 1,
    change: "topic",
  });
  const [zoomed, setZoomed] = useState(false);
  const [failedPhoto, setFailedPhoto] = useState(false);
  const story = khmerOverviewStories[reading.topic];
  const gallery = overviewViewerMedia[reading.topic];
  const photo = gallery[reading.photoIndex];
  const group = overviewGroups.find((entry) =>
    entry.topics.includes(reading.topic),
  )!;
  const index = group.topics.indexOf(reading.topic);
  const previous =
    group.topics[(index - 1 + group.topics.length) % group.topics.length];
  const next = group.topics[(index + 1) % group.topics.length];
  const metadata = overviewViewerMetadata[reading.topic];
  const summary =
    overviewViewerLeads[reading.topic]?.[lang] ??
    [...khmerOverviewHighlights, ...khmerOverviewVisitReasons].find(
      (entry) => entry.id === reading.topic,
    )?.text[lang] ??
    (lang === "vi"
      ? "Từ kiến trúc đến hiện vật, tìm hiểu ký ức và đời sống của cộng đồng Khmer Nam Bộ."
      : "Explore Southern Khmer memory and everyday life through architecture and museum objects.");
  const shortTitle = (topic: KhmerOverviewTopic) =>
    [...khmerOverviewHighlights, ...khmerOverviewVisitReasons].find(
      (entry) => entry.id === topic,
    )?.title[lang] ?? khmerOverviewStories[topic].title[lang];

  function makeFlight(source: HTMLImageElement, from: DOMRect, to: DOMRect) {
    const element = dialog.current!;
    const bounds = element.getBoundingClientRect();
    const shell = document.createElement("div");
    shell.className = "md-overview-flight";
    shell.setAttribute("aria-hidden", "true");
    const image = source.cloneNode(false) as HTMLImageElement;
    image.removeAttribute("class");
    image.removeAttribute("style");
    image.alt = "";
    image.draggable = false;
    shell.append(image);
    element.append(shell);
    gsap.set(shell, {
      left: from.left - bounds.left,
      top: from.top - bounds.top,
      width: from.width,
      height: from.height,
      borderRadius: 8,
    });
    flight.current = shell;
    return {
      shell,
      target: {
        left: to.left - bounds.left,
        top: to.top - bounds.top,
        width: to.width,
        height: to.height,
        borderRadius: 12,
      },
    };
  }

  useLayoutEffect(() => {
    const element = dialog.current!;
    const root = element.closest<HTMLElement>(".md-root")!;
    closing.current = false;
    busy.current = false;
    element.showModal();
    const panel = element.querySelector<HTMLElement>(".md-overview-panel")!;
    context.current = gsap.context(() => {
      if (museumMotionReduced(element)) {
        element.dataset.viewerMotion = "ready";
        gsap.set(element, {
          "--overview-backdrop-opacity": 0.72,
          "--overview-backdrop-blur": "10px",
        });
        gsap.set(root, { "--overview-background-opacity": 0.35 });
        return;
      }
      busy.current = true;
      element.dataset.viewerMotion = "opening";
      const image = element.querySelector<HTMLImageElement>(
        ".md-overview-main-image",
      );
      const thumbnail = trigger.current?.querySelector<HTMLImageElement>("img");
      const thumbnailBounds = thumbnail?.getBoundingClientRect();
      const canShare =
        image &&
        thumbnail?.complete &&
        thumbnail.naturalWidth > 0 &&
        thumbnailBounds &&
        thumbnailBounds.width > 0 &&
        thumbnailBounds.top >= 0 &&
        thumbnailBounds.bottom <= innerHeight;
      const shared = canShare
        ? makeFlight(thumbnail, thumbnailBounds, image.getBoundingClientRect())
        : null;
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          element.dataset.viewerMotion = "ready";
        },
      });
      timeline.current = tl;
      tl.fromTo(
        panel,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.48, ease: museumEase },
        0,
      )
        .to(
          element,
          {
            "--overview-backdrop-opacity": 0.72,
            "--overview-backdrop-blur": "10px",
            duration: 0.55,
          },
          0,
        )
        .to(root, { "--overview-background-opacity": 0.35, duration: 0.4 }, 0)
        .fromTo(
          ".md-overview-viewer-eyebrow",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.18 },
          0.38,
        )
        .fromTo(
          ".md-overview-title-mask>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.25, ease: museumEase },
          0.45,
        )
        .fromTo(
          ".md-overview-lead",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.22 },
          0.55,
        )
        .fromTo(
          ".md-overview-metadata",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.18 },
          0.63,
        )
        .fromTo(
          ".md-overview-prose-details,.md-overview-gallery-caption,.md-overview-thumbnails",
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          0.6,
        )
        .fromTo(
          ".md-overview-viewer-nav",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.15 },
          0.7,
        );
      if (shared) {
        gsap.set(image, { opacity: 0 });
        tl.to(
          shared.shell,
          { ...shared.target, duration: 0.52, ease: museumSmooth },
          0,
        )
          .set(image, { opacity: 1 }, 0.52)
          .call(
            () => {
              shared.shell.remove();
              flight.current = null;
            },
            [],
            0.52,
          );
      }
    }, element);
    return () => {
      timeline.current?.kill();
      context.current?.revert();
      flight.current?.remove();
      flight.current = null;
      if (element.open) element.close();
      if (trigger.current?.isConnected && !trigger.current.closest("[hidden]"))
        trigger.current.focus({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    if (!reduced) return;
    const current = timeline.current;
    // Finish after React's commit, so a navigation callback can safely flush
    // its next story even when the user changes motion preferences mid-flight.
    queueMicrotask(() => {
      if (dialog.current?.isConnected && current === timeline.current)
        current?.progress(1);
    });
  }, [reduced]);

  useLayoutEffect(() => {
    if (reading.revision === 0) return;
    const element = dialog.current!;
    const stage = element.querySelector<HTMLElement>(
      ".md-overview-visual-stage",
    )!;
    stage.scrollTo(0, 0);
    const content = element.querySelector<HTMLElement>(".md-overview-reading")!;
    if (reading.change === "topic") {
      content.scrollTop = 0;
      const body = element.querySelector<HTMLElement>(".md-overview-viewer-body");
      if (body) body.scrollTop = 0;
    }
    if (museumMotionReduced(element)) {
      context.current?.add(() => {
        gsap.set(stage, { opacity: 1, x: 0, scale: 1 });
        gsap.set(content, { opacity: 1 });
        gsap.set(".md-overview-title-mask>span", { yPercent: 0 });
        gsap.set(".md-overview-gallery-caption", { opacity: 1 });
      });
      busy.current = false;
      element.dataset.viewerMotion = "ready";
      return;
    }
    context.current?.add(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          element.dataset.viewerMotion = "ready";
        },
      });
      timeline.current = tl;
      tl.fromTo(
        stage,
        {
          opacity: 0,
          x: reading.change === "topic" ? reading.direction * 24 : 0,
          scale: reading.change === "photo" ? 1.025 : 1,
        },
        { opacity: 1, x: 0, scale: 1, duration: 0.38, ease: museumEase },
      );
      if (reading.change === "topic")
        tl.fromTo(
          ".md-overview-title-mask>span",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.38, ease: museumEase },
          0,
        ).fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.06);
      tl.fromTo(
        ".md-overview-gallery-caption",
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        0.12,
      );
    });
  }, [reading.revision]);

  function change(
    topic: KhmerOverviewTopic,
    photoIndex: number,
    direction: number,
    kind: "topic" | "photo",
  ) {
    if (
      busy.current ||
      closing.current ||
      (topic === reading.topic && photoIndex === reading.photoIndex)
    )
      return;
    const element = dialog.current!;
    const commit = () => {
      flushSync(() => {
        setZoomed(false);
        setFailedPhoto(false);
        setReading((current) => ({
          topic,
          photoIndex,
          direction,
          change: kind,
          revision: current.revision + 1,
        }));
      });
    };
    if (museumMotionReduced(element)) {
      commit();
      return;
    }
    busy.current = true;
    element.dataset.viewerMotion = "changing";
    context.current?.add(() => {
      const tl = gsap.timeline({ onComplete: commit });
      timeline.current = tl;
      tl.to(".md-overview-visual-stage", {
        opacity: 0,
        x: kind === "topic" ? direction * -24 : 0,
        scale: kind === "photo" ? 1.025 : 1,
        duration: 0.16,
        ease: "power1.out",
      });
      if (kind === "topic")
        tl.to(".md-overview-reading", { opacity: 0, duration: 0.16 }, 0);
    });
  }

  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    timeline.current?.kill();
    flight.current?.remove();
    flight.current = null;
    const element = dialog.current!;
    if (museumMotionReduced(element)) {
      close();
      return;
    }
    element.dataset.viewerMotion = "closing";
    const root = element.closest<HTMLElement>(".md-root")!;
    context.current?.add(() => {
      const image = element.querySelector<HTMLImageElement>(
        ".md-overview-main-image",
      );
      const thumbnail = trigger.current?.querySelector<HTMLImageElement>("img");
      const bounds = thumbnail?.getBoundingClientRect();
      // Return to the actual original thumbnail only when it is still on screen
      // and the original photograph is selected; other stories fade away cleanly.
      const canShare =
        reading.topic === initialTopic &&
        reading.photoIndex === 0 &&
        !zoomed &&
        image?.complete &&
        thumbnail?.complete &&
        bounds &&
        bounds.width > 0 &&
        bounds.height > 0 &&
        bounds.left >= 0 &&
        bounds.right <= innerWidth &&
        bounds.top >= 0 &&
        bounds.bottom <= innerHeight;
      const shared = canShare
        ? makeFlight(image, image.getBoundingClientRect(), bounds)
        : null;
      if (shared) gsap.set(image, { opacity: 0 });
      const tl = gsap.timeline({ onComplete: close });
      timeline.current = tl;
      tl.to(
        ".md-overview-panel",
        { scale: 0.97, opacity: 0, duration: 0.45, ease: museumSmooth },
        0,
      )
        .to(
          element,
          {
            "--overview-backdrop-opacity": 0,
            "--overview-backdrop-blur": "0px",
            duration: 0.5,
          },
          0,
        )
        .to(root, { "--overview-background-opacity": 1, duration: 0.5 }, 0);
      if (shared)
        tl.to(
          shared.shell,
          {
            ...shared.target,
            borderRadius: 8,
            duration: 0.5,
            ease: museumSmooth,
          },
          0,
        );
    });
  }

  return (
    <dialog
      ref={dialog}
      className="md-dialog md-dialog-overview md-overview-viewer"
      aria-labelledby="md-dialog-title"
      data-motion-reduced={reduced}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onPointerDown={(event) => {
        backdropPress.current =
          event.target === event.currentTarget ||
          (event.target instanceof Element &&
            event.target.classList.contains("md-overview-backdrop"));
      }}
      onClick={(event) => {
        if (
          backdropPress.current &&
          (event.target === event.currentTarget ||
            (event.target instanceof Element &&
              event.target.classList.contains("md-overview-backdrop")))
        )
          requestClose();
        backdropPress.current = false;
      }}
    >
      <div className="md-overview-backdrop" aria-hidden="true" />
      <article
        className="md-overview-panel md-khmer-story"
        lang={lang}
        data-overview-story={reading.topic}
      >
        <header className="md-overview-viewer-header">
          <span className="md-eyebrow md-overview-viewer-eyebrow">
            {group.title[lang]}
            <span>
              {number(index + 1)} / {number(group.topics.length)}
            </span>
          </span>
          <button
            type="button"
            className="md-dialog-close md-overview-close"
            aria-label={
              lang === "vi"
                ? "Đóng thông tin bảo tàng"
                : "Close museum information"
            }
            onClick={requestClose}
            autoFocus
          >
            <X />
          </button>
        </header>
        <div className="md-overview-viewer-body">
          <div className="md-overview-visual">
            <div
              className={`md-overview-visual-stage${zoomed ? " is-zoomed" : ""}`}
              data-media-kind={photo.kind}
            >
              {photo.kind === "map" ? (
                <OverviewMap lang={lang} />
              ) : (
                <img
                  key={photo.src}
                  className="md-story-photo md-overview-main-image"
                  src={photo.src}
                  alt={photo.caption[lang]}
                  draggable={false}
                  onError={() => setFailedPhoto(true)}
                />
              )}
              {failedPhoto && (
                <p className="md-overview-photo-error" role="status">
                  {lang === "vi"
                    ? "Không tải được ảnh. Bạn vẫn có thể đọc bài hoặc chọn ảnh khác."
                    : "This photograph could not load. You can still read the story or choose another image."}
                </p>
              )}
            </div>
            <div className="md-overview-visual-controls">
              <button
                type="button"
                className="md-round"
                data-overview-gallery="previous"
                aria-label={lang === "vi" ? "Ảnh trước" : "Previous image"}
                onClick={() =>
                  change(
                    reading.topic,
                    (reading.photoIndex - 1 + gallery.length) % gallery.length,
                    -1,
                    "photo",
                  )
                }
              >
                <ChevronLeft />
              </button>
              <span aria-live="polite">
                {number(reading.photoIndex + 1)} / {number(gallery.length)}
              </span>
              <button
                type="button"
                className="md-round"
                data-overview-gallery="next"
                aria-label={lang === "vi" ? "Ảnh tiếp theo" : "Next image"}
                onClick={() =>
                  change(
                    reading.topic,
                    (reading.photoIndex + 1) % gallery.length,
                    1,
                    "photo",
                  )
                }
              >
                <ChevronRight />
              </button>
              {photo.kind === "photo" && (
                <button
                  type="button"
                  className="md-round md-overview-zoom"
                  data-action="overview-zoom"
                  aria-label={
                    zoomed
                      ? lang === "vi"
                        ? "Thu nhỏ ảnh"
                        : "Zoom out"
                      : lang === "vi"
                        ? "Phóng to ảnh để xem chi tiết"
                        : "Zoom in to inspect the photograph"
                  }
                  aria-pressed={zoomed}
                  onClick={() => {
                    if (!busy.current) setZoomed((value) => !value);
                  }}
                >
                  {zoomed ? <ZoomOut /> : <ZoomIn />}
                </button>
              )}
            </div>
            <div className="md-overview-gallery-caption" aria-live="polite">
              <strong>{photo.title[lang]}</strong>
              <p>{photo.caption[lang]}</p>
              <a
                className="md-khmer-photo-credit"
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {photo.credit[lang]} <ArrowRight aria-hidden="true" />
              </a>
            </div>
            <div
              className="md-overview-thumbnails"
              aria-label={
                lang === "vi"
                  ? "Chọn ảnh hoặc bản đồ"
                  : "Choose an image or map"
              }
            >
              {gallery.map((item, position) => (
                <button
                  type="button"
                  key={`${reading.topic}-${position}`}
                  data-overview-image={position}
                  aria-label={`${number(position + 1)} · ${item.title[lang]}`}
                  aria-pressed={position === reading.photoIndex}
                  onClick={() =>
                    change(
                      reading.topic,
                      position,
                      position > reading.photoIndex ? 1 : -1,
                      "photo",
                    )
                  }
                >
                  {item.kind === "map" ? (
                    <span className="md-overview-map-thumbnail">
                      <MapPin aria-hidden="true" />
                      {lang === "vi" ? "Bản đồ" : "Map"}
                    </span>
                  ) : (
                    <img src={item.src} alt="" draggable={false} />
                  )}
                  <span className="md-overview-thumbnail-number">
                    {number(position + 1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div
            className="md-overview-reading"
            tabIndex={0}
            aria-label={
              lang === "vi"
                ? "Nội dung câu chuyện, cuộn để đọc tiếp"
                : "Story content, scroll to read more"
            }
          >
            <h2 className="md-overview-title-mask" id="md-dialog-title">
              <span>{story.title[lang]}</span>
            </h2>
            <p className="md-overview-lead">{summary}</p>
            <dl className="md-overview-metadata">
              <div>
                <dt>{lang === "vi" ? "Chủ đề" : "Subject"}</dt>
                <dd>{metadata.subject[lang]}</dd>
              </div>
              <div>
                <dt>
                  {lang === "vi" ? "Không gian liên quan" : "Related space"}
                </dt>
                <dd>{metadata.space[lang]}</dd>
              </div>
              <div>
                <dt>{lang === "vi" ? "Tư liệu" : "Media"}</dt>
                <dd>
                  {photo.kind === "map"
                    ? lang === "vi"
                      ? "Bản đồ vị trí · Ảnh tư liệu"
                      : "Location map · Archive photographs"
                    : lang === "vi"
                      ? "Ảnh tư liệu · Hiện vật và không gian"
                      : "Archive photographs · Objects and spaces"}
                </dd>
              </div>
            </dl>
            <div className="md-overview-prose-details">
              <div className="md-khmer-story-prose">
                {story.paragraphs.map((paragraph, position) => (
                  <p key={position}>{paragraph[lang]}</p>
                ))}
                {story.sections?.map((section, position) => (
                  <section key={position}>
                    <h3>{section.title[lang]}</h3>
                    <p>{section.text[lang]}</p>
                  </section>
                ))}
              </div>
              <footer className="md-khmer-story-sources">
                <strong>
                  {lang === "vi" ? "TÌM HIỂU THÊM" : "FURTHER READING"}
                </strong>
                {story.sources.map((source) => (
                  <a
                    key={source}
                    href={khmerOverviewSources[source].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {khmerOverviewSources[source].title}
                    <ArrowRight aria-hidden="true" />
                  </a>
                ))}
              </footer>
            </div>
          </div>
        </div>
        <nav
          className="md-overview-viewer-nav"
          aria-label={
            lang === "vi"
              ? "Chuyển câu chuyện trong nhóm"
              : "Browse stories in this group"
          }
        >
          <button
            type="button"
            data-overview-navigation="previous"
            title={shortTitle(previous)}
            onClick={() => change(previous, 0, -1, "topic")}
          >
            <ArrowLeft aria-hidden="true" />
            <span>
              <small>{lang === "vi" ? "Mục trước" : "Previous story"}</small>
              <strong>{shortTitle(previous)}</strong>
            </span>
          </button>
          <span className="md-overview-topic-count" aria-live="polite">
            {number(index + 1)}
            <span> / {number(group.topics.length)}</span>
          </span>
          <button
            type="button"
            data-overview-navigation="next"
            title={shortTitle(next)}
            onClick={() => change(next, 0, 1, "topic")}
          >
            <span>
              <small>{lang === "vi" ? "Mục tiếp theo" : "Next story"}</small>
              <strong>{shortTitle(next)}</strong>
            </span>
            <ArrowRight aria-hidden="true" />
          </button>
        </nav>
      </article>
    </dialog>
  );
}
