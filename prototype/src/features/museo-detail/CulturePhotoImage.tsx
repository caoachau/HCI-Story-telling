import { khmerCulturePhotos, type CulturePhotoId, type CultureLanguage } from "./khmerCulture";
import { useId } from "react";

/** Display only the photograph inside the user's supplied layout, without its UI. */
export function CulturePhotoImage({ id, className = "", decorative = false, lang = "vi", fit = "cover" }: { id: CulturePhotoId; className?: string; decorative?: boolean; lang?: CultureLanguage; fit?: "cover" | "contain" }) {
  const photo = khmerCulturePhotos[id];
  const clipId = useId();
  if ("crop" in photo) return <svg className={className} viewBox={photo.crop.join(" ")} preserveAspectRatio={fit === "contain" ? "xMidYMid meet" : "xMidYMid slice"} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : photo.title[lang]} aria-hidden={decorative || undefined} data-culture-image={id}>
    <defs><clipPath id={clipId}><rect x={photo.crop[0]} y={photo.crop[1]} width={photo.crop[2]} height={photo.crop[3]} /></clipPath></defs>
    <image href={photo.src} x="0" y="0" width="1280" height="720" clipPath={`url(#${clipId})`} />
  </svg>;
  return <img className={className} src={photo.src} alt={decorative ? "" : photo.title[lang]} draggable={false} data-culture-image={id} />;
}
