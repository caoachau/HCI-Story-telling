import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { artwork, sites } from "./data";
import { siteDetails } from "./siteDetails";
import { sitePhotoCredits } from "./sitePhotoCredits";

export function SiteExplorer({
  site,
  close,
}: {
  site: (typeof sites)[number];
  close: () => void;
}) {
  const detail = siteDetails[site.name];
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = detail.gallery[photoIndex];
  const credit = sitePhotoCredits[photo.photo];
  const changePhoto = (step: number) =>
    setPhotoIndex(
      (index) => (index + step + detail.gallery.length) % detail.gallery.length,
    );

  return (
    <article className="md-site-explorer">
      <div className="md-site-topbar">
        <span className="md-eyebrow">EXPLORE SITE</span>
        <span className="md-site-location">
          <MapPin /> {site.region}
        </span>
      </div>
      <div className="md-site-intro-grid">
        <div className="md-site-gallery">
          <figure className="md-site-image">
            <img
              className="md-site-main-image"
              src={artwork(photo.photo)}
              alt={photo.title}
            />
            <div className="md-site-gallery-controls">
              <button
                type="button"
                aria-label="Previous site photo"
                onClick={() => changePhoto(-1)}
              >
                <ChevronLeft />
              </button>
              <span>
                {String(photoIndex + 1).padStart(2, "0")} /{" "}
                {String(detail.gallery.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Next site photo"
                onClick={() => changePhoto(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </figure>
          <div
            className="md-site-photo-caption"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>{photo.title}</strong>
            <p>{photo.caption}</p>
            {credit && (
              <small>
                Photo:{" "}
                <a href={credit.source} target="_blank" rel="noreferrer">
                  {credit.author}
                </a>
                {" · "}
                <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
                  {credit.license}
                </a>
              </small>
            )}
          </div>
          <div
            className="md-site-thumbnails"
            role="group"
            aria-label={`Photographs of ${site.name}`}
          >
            {detail.gallery.map((image, index) => (
              <button
                type="button"
                key={image.photo}
                aria-pressed={index === photoIndex}
                aria-label={`View photo ${index + 1}: ${image.title}`}
                onClick={() => setPhotoIndex(index)}
              >
                <img src={artwork(image.photo)} alt="" loading="lazy" />
                <span>
                  {String(index + 1).padStart(2, "0")} · {image.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="md-site-story">
          <span className="md-eyebrow">{site.country} · HUMAN HERITAGE</span>
          <h2 id="md-dialog-title">{site.name}</h2>
          <p className="md-site-subtitle">{detail.subtitle}</p>
          <dl className="md-site-facts">
            {detail.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <div className="md-site-paragraphs">
            {detail.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="md-site-reading">
        <h3>Look closer</h3>
        <div className="md-site-highlight-grid">
          {detail.highlights.map((highlight, index) => (
            <section key={highlight.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h4>{highlight.title}</h4>
              <p>{highlight.text}</p>
            </section>
          ))}
        </div>
        <div className="md-site-context">
          <section>
            <h3>The wider story</h3>
            <p>{detail.context}</p>
          </section>
          <aside aria-label="Further reading">
            <h4>Continue exploring</h4>
            {detail.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                {source.title}
                <ArrowUpRight />
              </a>
            ))}
          </aside>
        </div>
        <div className="md-site-footer">
          <span>
            {detail.gallery.length} photographs · {site.region}
          </span>
          <button className="md-button" type="button" onClick={close}>
            <ArrowLeft /> BACK TO MAP
          </button>
        </div>
      </div>
    </article>
  );
}
