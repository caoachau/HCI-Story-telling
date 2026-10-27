import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { MILESTONES } from "./content";
import { HISTORY_SCENES as SCENES } from "./history-scenes";
import { useChapterMotion } from './memorial-motion';
import numeralFont from "../../assets/den-tho-bac/history-exact/numeral-font.json";

interface Props {
  milestone: number;
  onSelect: (index: number) => void;
  onOpen: (story: string) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}
// Reading shades measured separately from the unchanged background-only files.
const READING_SHADES = [
  [0.64, 0.64, 0.64, 0.46, 0.1, 0, 0, 0],
  [0.68, 0.71, 0.65, 0.5, 0.17, 0.2, 0.21, 0.15],
  [0.74, 0.74, 0.62, 0.35, 0.07, 0.04, 0.03, 0.02],
  [0.64, 0.64, 0.61, 0.35, 0.06, 0.04, 0.05, 0.05],
  [0.64, 0.64, 0.57, 0.25, 0.05, 0.06, 0.07, 0.03],
  [0.14, 0.1, 0.14, 0.13, 0.01, 0, 0.01, 0.06],
  [0.78, 0.74, 0.62, 0.39, 0.05, 0.03, 0, 0.12],
] as const;
const SHADE_STOPS = [0, 12, 24, 36, 48, 60, 72, 100] as const;
// Native font metrics retain the measured year bounds. Its real width axis
// keeps the digits separate without scaling or stretching their outlines.
const yearType = (index:number) => numeralFont.metrics[SCENES[index].year];
const photoStyle = (index: number) =>
  ({
    "--history-reading-shade": `linear-gradient(90deg,${READING_SHADES[index].map((alpha, i) => `rgba(0,0,0,${alpha}) ${SHADE_STOPS[i]}%`).join(",")})`,
    "--history-photo-aspect": SCENES[index].width / SCENES[index].height,
    "--history-photo-scale": 1,
    "--history-photo-top": "0%",
    "--year-left": SCENES[index].yearBounds.left,
    "--year-top": SCENES[index].yearBounds.top,
    "--year-width": SCENES[index].yearBounds.width,
    "--year-height": SCENES[index].yearBounds.height,
    "--year-size": yearType(index).sizePerHeight,
    "--year-font-width": yearType(index).widthAxis,
    "--history-copy-top": SCENES[index].layout === "large" ? 447 : 393,
    "--history-fact-top": [637, 585, 584, 587, 584, 637, 633][index],
    "--history-fact-bar": [31, 57, 57, 48, 57, 34, 46][index],
    "--history-read-top": [686, 661, 661, 656, 661, 694, 687][index],
  }) as React.CSSProperties;
// Keep the line endings of the supplied layouts; mobile may wrap them further.
const REFERENCE_LINES = [
  {
    lead: [
      "Sau khi Bác Hồ qua đời, người dân Long Đức lập bàn thờ",
      "tưởng nhớ và mong có một nơi thờ chung.",
    ],
    fact: [
      "Từ tình cảm trong mỗi gia đình, nguyện vọng xây đền dần hình thành.",
    ],
  },
  {
    lead: [
      "Sau thời gian gián đoạn bởi các cuộc càn quét,",
      "việc xây dựng đền được tiếp tục.",
    ],
    fact: [
      "Người dân cùng hoàn thiện ngôi đền nhỏ",
      "trong điều kiện chiến tranh.",
    ],
  },
  {
    lead: [
      "Sau gần 11 tháng vừa xây dựng vừa chiến đấu,",
      "ngôi đền khánh thành vào ngày 30 Tết Tân Hợi.",
    ],
    fact: [
      "Người dân cùng tề tựu, đánh dấu sự hoàn thành",
      "của ngôi đền đầu tiên.",
    ],
  },
  {
    lead: [
      "Ngôi đền bị đốt ngày 10/03/1971. Quân và dân Long Đức",
      "tiếp tục xây dựng lại, hoàn thành vào mùa xuân 1972.",
    ],
    fact: ["Việc xây dựng và bảo vệ đền tiếp tục giữa chiến tranh."],
  },
  {
    lead: [
      "Sau ngày đất nước thống nhất, ngôi đền được",
      "sửa chữa, tu bổ và từng bước tôn tạo.",
    ],
    fact: [
      "Không gian tưởng niệm được gìn giữ để truyền lại",
      "câu chuyện lịch sử cho các thế hệ sau.",
    ],
  },
  {
    lead: [
      "Đền thờ Bác Hồ được xếp hạng di tích lịch sử – văn hóa",
      "cấp quốc gia.",
    ],
    fact: [
      "Giá trị lịch sử của ngôi đền được ghi nhận",
      "và tiếp tục bảo tồn.",
    ],
  },
  {
    lead: [
      "Khu di tích được bổ sung Nhà sàn Bác Hồ, mở rộng",
      "không gian tham quan và tưởng niệm.",
    ],
    fact: [
      "Thêm một không gian để tìm hiểu cuộc đời",
      "và nếp sống giản dị của Bác.",
    ],
  },
] as const;
const referenceText = (lines: readonly string[]) =>
  lines.map((line, index) => (
    <React.Fragment key={line}>
      {index > 0 && (
        <>
          <span className="db-history-line-space"> </span>
          <br />
        </>
      )}
      {line}
    </React.Fragment>
  ));

function Artwork({ index, direction, onReady }: { index: number; direction: number; onReady: (index:number)=>void }) {
  const [layers, setLayers] = useState({
    current: index,
    previous: null as number | null,
    revision: 0,
  });
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    setState("loading");
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        /* onload already established a usable image */
      }
      if (cancelled) return;
      setLayers((old) => ({
        current: index,
        previous: old.current === index ? null : old.current,
        revision: old.revision + 1,
      }));
      setState("ready");
      onReady(index);
    };
    image.onerror = () => {
      if (!cancelled) setState("error");
    };
    image.src = SCENES[index].image;
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [index, retry, onReady]);
  useEffect(() => {
    if (layers.previous === null) return;
    const timer = window.setTimeout(
      () => setLayers((old) => ({ ...old, previous: null })),
      900,
    );
    return () => window.clearTimeout(timer);
  }, [layers.revision, layers.previous]);
  useEffect(() => {
    if (state !== "ready" || index === SCENES.length - 1) return;
    const next = new Image();
    next.src = SCENES[index + 1].image;
  }, [index, state]);
  return (
    <div
      className="db-history-photo-art"
      data-image-state={state}
      data-art-year={MILESTONES[layers.current].year}
      aria-busy={state === "loading"}
      style={{ "--history-direction": direction } as React.CSSProperties}
    >
      {layers.previous !== null && (
        <div
          className="db-history-art-layer db-history-art-layer--out"
          key={`out-${layers.revision}`}
          style={photoStyle(layers.previous)}
          aria-hidden="true"
        >
          <img src={SCENES[layers.previous].image} alt="" />
        </div>
      )}
      <div
        className="db-history-art-layer db-history-art-layer--in"
        key={`in-${layers.revision}`}
        style={photoStyle(layers.current)}
        data-effect={MILESTONES[layers.current].effect}
      >
        <img
          src={SCENES[layers.current].image}
          alt={SCENES[layers.current].alt}
          width={SCENES[layers.current].width}
          height={SCENES[layers.current].height}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {state === "error" && (
        <div
          className="db-history-art-status db-history-art-status--error"
          role="status"
        >
          <p>Chưa tải được ảnh mốc {SCENES[index].year}. {layers.current !== index && `Bạn đang xem mốc ${SCENES[layers.current].year}.`}</p>
          <button type="button" onClick={() => setRetry((n) => n + 1)}>
            Thử tải lại ảnh
          </button>
        </div>
      )}
    </div>
  );
}

export function HistorySection({
  milestone,
  onSelect,
  onOpen,
  headingRef,
}: Props) {
  const [displayed,setDisplayed]=useState({index:milestone,revision:0});
  const ready=useCallback((index:number)=>setDisplayed(old=>({index,revision:old.revision+1})),[]);
  const motionRoot=useRef<HTMLElement>(null);
  useChapterMotion(motionRoot,'history',displayed.revision,displayed.revision>0);
  const era = MILESTONES[displayed.index];
  const scene = SCENES[displayed.index];
  const [direction, setDirection] = useState(1);
  const timeline = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = timeline.current,
      selected = nav?.querySelector<HTMLElement>("[aria-pressed=true]");
    if (!nav || !selected || nav.scrollWidth <= nav.clientWidth) return;
    const reduced =
      matchMedia("(prefers-reduced-motion:reduce)").matches ||
      document.documentElement.classList.contains("reduce-motion");
    nav.scrollTo({
      left: selected.offsetLeft - (nav.clientWidth - selected.offsetWidth) / 2,
      behavior: reduced ? "instant" : "smooth",
    });
  }, [milestone]);
  const select = (next: number) => {
    if (next === milestone) return;
    setDirection(next > milestone ? 1 : -1);
    onSelect(next);
  };
  return (
    <section
      ref={motionRoot}
      className="db-history"
      data-requested-year={MILESTONES[milestone].year}
      aria-labelledby="db-history-title"
      data-history-layout={scene.layout}
      style={photoStyle(displayed.index)}
    >
      <div
        className="db-history-stage"
        id="db-history-scene"
        data-history-year={era.year}
        data-effect={era.effect}
      >
        <figure className="db-history-visual">
          <Artwork index={milestone} direction={direction} onReady={ready} />
          <figcaption>{scene.caption}</figcaption>
        </figure>
        <div className="db-history-shade" aria-hidden="true" />
        <header className="db-history-heading">
          <div>
            <h1 id="db-history-title" ref={headingRef} tabIndex={-1}>
              Lịch sử hình thành
            </h1>
            <p>Đền thờ Bác Hồ · Trà Vinh</p>
          </div>
          <div className="db-history-instruction">
            <span>Chạm một mốc để bước vào câu chuyện.</span>
          </div>
        </header>
        <p
          className="db-history-year"
          key={`year-${scene.year}`}
          aria-hidden="true"
        >
          <svg className="db-history-year-type" aria-hidden="true">
            <text x={`${yearType(displayed.index).xPerWidth * 100}%`} y={`${yearType(displayed.index).baselinePerHeight * 100}%`}>{scene.year}</text>
          </svg>
        </p>
        <article
          className="db-era-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            key={era.year}
            className="db-history-copy"
            data-effect={era.effect}
          >
            <p className="db-history-date">
              <span>{scene.date}</span>
              {"aside" in scene && <small>{scene.aside}</small>}
            </p>
            <h2>{scene.title}</h2>
            <p className="db-history-lead">
              {referenceText(REFERENCE_LINES[displayed.index].lead)}
            </p>
            <p className="db-history-fact">
              {referenceText(REFERENCE_LINES[displayed.index].fact)}
            </p>
          </div>
          <button
            type="button"
            className="db-button db-history-read"
            onClick={() => onOpen(`history-${scene.year}`)}
          >
            Đọc hoặc nghe câu chuyện
            <ArrowRight />
          </button>
        </article>
      </div>
      <div className="db-history-axis">
        <button
          type="button"
          className="db-round"
          aria-label="Mốc trước"
          disabled={milestone === 0}
          onClick={() => select(milestone - 1)}
        >
          <ChevronLeft />
        </button>
        <nav
          ref={timeline}
          className="db-timeline"
          aria-label="Dòng thời gian 1969 đến 2012"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? MILESTONES.length - 1
                  : Math.max(
                      0,
                      Math.min(
                        MILESTONES.length - 1,
                        milestone + (event.key === "ArrowRight" ? 1 : -1),
                      ),
                    );
            select(next);
            event.currentTarget
              .querySelector<HTMLButtonElement>(
                `[data-milestone="${MILESTONES[next].year}"]`,
              )
              ?.focus({ preventScroll: true });
          }}
        >
          {MILESTONES.map((item, i) => (
            <button
              type="button"
              key={item.year}
              data-milestone={item.year}
              aria-pressed={milestone === i}
              aria-controls="db-history-scene"
              aria-label={`${SCENES[i].year}: ${SCENES[i].title}`}
              onClick={() => select(i)}
            >
              <strong className="db-milestone-year">{SCENES[i].year}</strong>
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="db-round"
          aria-label="Mốc tiếp"
          disabled={milestone === MILESTONES.length - 1}
          onClick={() => select(milestone + 1)}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
