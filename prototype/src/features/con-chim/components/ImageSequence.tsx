import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motionEase, useReducedDetailMotion } from '../utils/motion';

type SequencePhoto = { id: string; image: string; title: string; position?: string };
interface Props {
  photos: SequencePhoto[];
  index: number;
  direction?: number;
  priority?: boolean;
  contain?: boolean;
  onDisplayed?: (id: string) => void;
}

/** Decode before replacing the visible photograph, including during rapid input. */
export function ImageSequence({ photos, index, direction = 1, priority = false, contain = false, onDisplayed }: Props) {
  const requested = photos[index % photos.length];
  const [layers, setLayers] = useState<{ current: SequencePhoto; previous: SequencePhoto | null }>({ current: requested, previous: null });
  const [loading, setLoading] = useState(false), [error, setError] = useState(false);
  const [inView, setInView] = useState(priority);
  const container = useRef<HTMLSpanElement>(null);
  const current = useRef<HTMLImageElement>(null), previous = useRef<HTMLImageElement>(null);
  const reduced = useReducedDetailMotion();
  const travel = useRef(direction);
  travel.current = direction;

  useEffect(() => {
    if (requested.id === layers.current.id) { setLoading(false); return; }
    let disposed = false;
    setLoading(true); setError(false);
    const image = new Image();
    const show = async () => {
      try { await image.decode(); } catch { /* Loaded images can still paint if decode is unavailable. */ }
      if (disposed) return;
      setLayers(value => value.current.id === requested.id ? value : { current: requested, previous: value.current });
      setLoading(false);
    };
    image.onload = () => { void show(); };
    image.onerror = () => { if (!disposed) { setLoading(false); setError(true); } };
    image.src = requested.image;
    return () => { disposed = true; image.onload = null; image.onerror = null; };
  }, [requested.id, requested.image, layers.current.id]);

  useEffect(() => {
    onDisplayed?.(layers.current.id);
  }, [layers.current.id, onDisplayed]);

  useEffect(() => {
    if (priority || !container.current) return;
    const observer = new IntersectionObserver(entries => setInView(entries[0].isIntersecting), { threshold: .1 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!inView || document.hidden) return;
    // Let the opening image and fonts arrive first. Warm neighbors only on screen.
    const timer = window.setTimeout(() => {
      const neighbors = [photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]];
      neighbors.forEach(photo => { const image = new Image(); image.fetchPriority = 'low'; image.src = photo.image; });
    }, priority ? 1200 : 150);
    return () => window.clearTimeout(timer);
  }, [photos, index, inView, priority]);

  useLayoutEffect(() => {
    if (reduced || !layers.previous || !current.current?.animate) return;
    const offset = travel.current * (contain ? 20 : 3);
    const unit = contain ? 'px' : '%';
    const incoming = current.current.animate([
      { opacity: 0, transform: `translate3d(${offset}${unit},0,0) scale(${contain ? .985 : 1.055})` },
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
    ], { duration: 820, easing: motionEase, fill: 'both' });
    const outgoing = previous.current?.animate([
      { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' },
      { opacity: 0, transform: `translate3d(${-offset / 2}${unit},0,0) scale(1.015)` },
    ], { duration: 650, easing: motionEase, fill: 'both' });
    incoming.finished.then(() => { incoming.cancel(); outgoing?.cancel(); }).catch(() => {});
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stop = () => { incoming.cancel(); outgoing?.cancel(); };
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', stop);
    return () => { stop(); media.removeEventListener('change', stop); document.removeEventListener('visibilitychange', visibility); };
  }, [layers, reduced, contain]);

  return <span ref={container} className={`cc-image-sequence ${contain ? 'cc-image-contain' : ''}`} aria-busy={loading}>
    {layers.previous && <img ref={previous} className="cc-sequence-previous" src={layers.previous.image} alt="" aria-hidden="true" draggable={false} style={{ objectPosition: layers.previous.position || 'center' }} />}
    <img ref={current} key={layers.current.id} className="cc-sequence-current is-active" src={layers.current.image} alt={layers.current.title} draggable={false} fetchPriority={priority ? 'high' : 'auto'} loading={priority ? 'eager' : 'lazy'} decoding="async" style={{ objectPosition: layers.current.position || 'center' }} onLoad={() => setError(false)} onError={() => setError(true)} />
    {loading && <span className="cc-sr-only" role="status">Đang tải ảnh…</span>}
    {error && <span className="cc-image-error" role="status">Chưa tải được ảnh này. Chọn ảnh khác để tiếp tục.</span>}
  </span>;
}
