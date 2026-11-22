import { useEffect, useId, useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { AudioImage as ImageData } from './types';

export function AudioImage({ image, lazy = false }: { image?: ImageData; lazy?: boolean }) {
  const clip = useId();
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image?.src]);
  if (!image?.src || failed) return <div className="ha-image-empty"><ImageOff aria-hidden="true" /></div>;
  if (image.crop) {
    const [x, y, width, height] = image.crop.split(' ').map(Number);
    return <svg role="img" aria-label={image.caption} viewBox={image.crop} preserveAspectRatio="xMidYMid slice"><defs><clipPath id={clip}><rect x={x} y={y} width={width} height={height} /></clipPath></defs><image href={image.src} width="1280" height="720" clipPath={`url(#${clip})`} /></svg>;
  }
  return <img src={image.src} alt={image.caption} loading={lazy ? 'lazy' : 'eager'} onError={() => setFailed(true)} />;
}
