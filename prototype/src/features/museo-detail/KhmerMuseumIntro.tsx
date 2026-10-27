import { useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { khmerCulturePhotos, type CultureLanguage } from "./khmerCulture";
import {
  khmerIntro,
  khmerIntroContext,
  khmerIntroSlides,
} from "./khmerIntro";
import type { MuseumSection } from "./useMuseumScreens";
import { useKhmerIntroMotion } from "./useKhmerIntroMotion";

export function KhmerMuseumIntro({
  active,
  visible = true,
  lang,
  navigate,
  onChange,
}: {
  active: boolean;
  visible?: boolean;
  lang: CultureLanguage;
  navigate: (section: MuseumSection, item?: string) => void;
  onChange: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState({
    selected: 0,
    previous: 0,
    direction: 1,
    revision: 0,
  });
  const { selected } = slide;
  const { reduced, finishOpening } = useKhmerIntroMotion(
    root,
    active && visible,
    slide,
  );
  const vi = lang === "vi";
  const photo = khmerCulturePhotos[khmerIntroSlides[selected].id];
  const choose = (index: number) => {
    const next = (index + khmerIntroSlides.length) % khmerIntroSlides.length;
    if (next === selected) return;
    finishOpening();
    onChange();
    setSlide({
      selected: next,
      previous: selected,
      direction: index < selected ? -1 : 1,
      revision: slide.revision + 1,
    });
  };
  return (
    <section
      className="md-section md-hero md-framed md-khmer-intro"
      id="museo-hero"
      ref={root}
      data-reduced-motion={reduced}
      data-photo-motion="idle"
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-intro-title"
      lang={lang}
    >
      <div className="md-frame">
        <div className="md-intro-background">
          <div className="md-intro-architecture">
            <img
              className="md-hero-art"
              src={photo.src}
              alt={photo.title[lang]}
              fetchPriority={active ? "high" : "auto"}
            />
            <img
              className="md-hero-art md-hero-outgoing"
              src={khmerCulturePhotos[khmerIntroSlides[slide.previous].id].src}
              alt=""
              aria-hidden="true"
            />
          </div>
          <div className="md-intro-foreground-layer" aria-hidden="true">
            <img className="md-hero-foreground" src={photo.src} alt="" />
          </div>
        </div>
        <div className="md-intro-shade" aria-hidden="true" />
        <div className="md-film-grain" aria-hidden="true" />
        <div className="md-cursor-light" aria-hidden="true" />
        <div className="md-ambient-dust" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <i
              key={index}
              style={{
                left: `${58 + index * 4.1}%`,
                top: `${12 + ((index * 17) % 66)}%`,
                animationDelay: `${-index * 2.3}s`,
                animationDuration: `${22 + index * 2}s`,
              }}
            />
          ))}
        </div>
        {/* A contemporary line motif inspired by Khmer gable and lotus forms. */}
        <svg
          className="md-khmer-ornament"
          viewBox="0 0 300 480"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            pathLength="1"
            d="M150 20C150 95 92 140 92 200C92 256 126 290 150 304C174 290 208 256 208 200C208 140 150 95 150 20Z"
          />
          <path
            pathLength="1"
            d="M150 70C150 155 117 172 117 221C117 252 135 276 150 289C165 276 183 252 183 221C183 172 150 155 150 70Z"
          />
          <path
            pathLength="1"
            d="M150 308C106 308 57 268 46 225C31 298 77 360 150 366C223 360 269 298 254 225C243 268 194 308 150 308Z"
          />
          <path
            pathLength="1"
            d="M150 370C114 367 86 347 76 331C74 396 112 432 150 445C188 432 226 396 224 331C214 347 186 367 150 370Z"
          />
          <path
            pathLength="1"
            d="M56 452Q150 418 244 452M76 466Q150 439 224 466M150 303V455"
          />
        </svg>
        <div className="md-hero-copy">
          <h1 className="md-display" id="md-intro-title">
            {khmerIntro.title[lang].map((line) => (
              <span className="md-title-mask" key={line}>
                <span className="md-title-line">{line}</span>
              </span>
            ))}
          </h1>
          <p className="md-eyebrow">{khmerIntro.subtitle[lang]}</p>
          <p className="md-mono md-hero-description">
            {khmerIntro.description[lang]}
          </p>
          <button
            className="md-play-link"
            type="button"
            onClick={() => navigate("overview")}
          >
            <span>
              <ArrowRight />
            </span>
            <b className="md-cta-label">{khmerIntro.action[lang]}</b>
          </button>
        </div>
        <div
          className="md-hero-context"
          aria-label={
            vi
              ? "Ba hướng khám phá bảo tàng"
              : "Three ways to explore the museum"
          }
        >
          {khmerIntroContext.map((context) => (
            <article key={context.id}>
              <button
                type="button"
                data-intro-context={context.id}
                onClick={() => navigate(context.section, context.item)}
              >
                <img
                  src={khmerCulturePhotos[context.photo].src}
                  alt=""
                  loading="lazy"
                />
                <div>
                  <strong>{context.title[lang]}</strong>
                  <p>{context.text[lang]}</p>
                </div>
              </button>
            </article>
          ))}
        </div>
        <div className="md-hero-arrows">
          <button
            className="md-round"
            type="button"
            aria-label={vi ? "Ảnh trước" : "Previous hero photograph"}
            onClick={() => choose(selected - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            className="md-round md-round-filled"
            type="button"
            aria-label={vi ? "Ảnh tiếp theo" : "Next hero photograph"}
            onClick={() => choose(selected + 1)}
          >
            <ChevronRight />
          </button>
        </div>
        <nav
          className="md-hero-bottom"
          aria-label={
            vi ? "Chọn ảnh giới thiệu" : "Choose an introduction photograph"
          }
        >
          <span className="md-slide-count" aria-live="polite">
            <span className="md-photo-count">
              <span className="md-number-window">
                <b key={selected}>{String(selected + 1).padStart(2, "0")}</b>
              </span>
              {" / 04"}
            </span>
            <i>
              <b />
            </i>
          </span>
          {khmerIntroSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              data-intro-slide={slide.id}
              aria-pressed={selected === index}
              onClick={() => choose(index)}
            >
              {slide.title[lang]}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
