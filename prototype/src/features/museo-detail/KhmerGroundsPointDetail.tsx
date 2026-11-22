import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import type { GroundsPoint } from "./khmerGroundsPoints";
import type { PlaceLanguage } from "./khmerPlaces";
import type { GroundsImage } from "./khmerGroundsPoints";

export function GroundsPointImage({
  image,
  lang,
}: {
  image: GroundsImage;
  lang: PlaceLanguage;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image.src]);
  return failed ? (
    <div className="kd-missing">
      {lang === "vi" ? "Chưa tải được ảnh" : "Image unavailable"}
    </div>
  ) : image.crop ? (
    <svg className="kd-point-crop" style={{ width: "100%", height: "100%" }} viewBox={`${image.crop.x * 6144} ${image.crop.y * 3072} ${image.crop.width * 6144} ${image.crop.height * 3072}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={image.title[lang]}>
      <image href={image.src} width="6144" height="3072" onError={() => setFailed(true)} />
      {image.crop.x < 0 && <image href={image.src} x="-6144" width="6144" height="3072" onError={() => setFailed(true)} />}
    </svg>
  ) : (
    <img
      src={image.src}
      alt={image.title[lang]}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}

export function KhmerGroundsPointDetail({
  point,
  lang,
  close,
  onFloor,
}: {
  point: GroundsPoint;
  lang: PlaceLanguage;
  close: () => void;
  onFloor: (id: "ground" | "upper") => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const image = point.images[index],
    vi = lang === "vi";
  useEffect(() => {
    const origin = document.activeElement as HTMLElement | null,
      node = dialog.current;
    node?.showModal();
    return () => {
      node?.close();
      if (origin?.isConnected) origin.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => setFailed(false), [index]);
  const move = (direction: number) =>
    setIndex(
      (index) =>
        (index + direction + point.images.length) % point.images.length,
    );
  return (
    <dialog
      ref={dialog}
      className="kd-point-dialog"
      data-ground-point-detail={point.id}
      aria-labelledby="kd-point-detail-title"
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        close();
      }}
    >
      <header>
        <span>
          {vi ? "KHUÔN VIÊN" : "GROUNDS"}{" "}
          {point.number !== undefined && <b>{String(point.number).padStart(2, "0")}</b>}
        </span>
        <button
          type="button"
          autoFocus
          onClick={close}
          aria-label={
            vi
              ? "Đóng chi tiết điểm trong khuôn viên"
              : "Close grounds point detail"
          }
        >
          <X />
        </button>
      </header>
      <div className="kd-point-detail-body">
        <div className="kd-point-visual">
          <figure>
            {failed ? (
              <div className="kd-missing">
                {vi
                  ? "Chưa tải được ảnh. Hãy xem nguồn bên dưới."
                  : "Image unavailable. Open the source below."}
              </div>
            ) : (
              <GroundsPointImage image={image} lang={lang} />
            )}
            <figcaption>
              <span className="kd-point-image-kind">
                {image.context
                  ? vi
                    ? "ẢNH ĐỐI CHIẾU"
                    : "COMPARISON IMAGE"
                  : vi
                    ? "ẢNH VẬT THỂ"
                    : "SUBJECT PHOTOGRAPH"}
              </span>
              <strong>{image.title[lang]}</strong>
              <p>{image.caption[lang]}</p>
              <small>{image.credit}</small>
              {image.sourceUrl && (
                <a href={image.sourceUrl} target="_blank" rel="noreferrer">
                  {vi ? "Nguồn ảnh" : "Image source"} <ExternalLink size={14} />
                </a>
              )}
              {image.licenseUrl && (
                <a href={image.licenseUrl} target="_blank" rel="noreferrer">
                  {image.licenseName ?? "Giấy phép ảnh"}
                </a>
              )}
            </figcaption>
          </figure>
          <div className="kd-point-gallery-controls">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={point.images.length < 2}
              aria-label={vi ? "Ảnh cận trước" : "Previous detail photo"}
            >
              <ArrowLeft />
            </button>
            <span>
              {index + 1} / {point.images.length}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={point.images.length < 2}
              aria-label={vi ? "Ảnh cận tiếp theo" : "Next detail photo"}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
        <article>
          <span className="kd-kicker">{point.category[lang]}</span>
          <h2 id="kd-point-detail-title">{point.title[lang]}</h2>
          <p className="kd-point-lead">{point.summary[lang]}</p>
          <div className="kd-point-observe">
            <h3>{vi ? "Nhìn gần hơn" : "Look closer"}</h3>
            <p>{point.observe[lang]}</p>
          </div>
          {point.sections.map((section) => (
            <section key={section.title.vi}>
              <h3>{section.title[lang]}</h3>
              <p>{section.text[lang]}</p>
            </section>
          ))}
          {point.floors && (
            <div className="kd-floor-links">
              {point.floors.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    close();
                    onFloor(id);
                  }}
                >
                  {id === "ground"
                    ? vi
                      ? "Tầng trệt"
                      : "Ground floor"
                    : vi
                      ? "Tầng lầu"
                      : "Upper floor"}
                  <ArrowRight />
                </button>
              ))}
            </div>
          )}
          <details className="kd-point-sources">
            <summary>
              {vi ? "Tư liệu & nguồn tham khảo" : "References & sources"}
            </summary>
            {point.sources.map((source) => (
              <a
                href={source.url}
                key={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title[lang]} <ExternalLink size={14} />
              </a>
            ))}
          </details>
          <button className="kd-action" type="button" onClick={close}>
            <ArrowLeft />
            {vi ? "Về ảnh 360° đang xem" : "Back to this panorama"}
          </button>
        </article>
      </div>
    </dialog>
  );
}
