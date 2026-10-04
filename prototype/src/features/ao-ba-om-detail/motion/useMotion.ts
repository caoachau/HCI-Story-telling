import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ─── Smooth Scroll (Lenis) ─── */
let lenisInstance: Lenis | null = null;
// Keep one callback so closing/reopening the detail cannot accumulate tickers.
const updateLenis = (time: number) => lenisInstance?.raf(time * 1000);

export function initLenis() {
  if (lenisInstance) return lenisInstance;
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 1.5,
    infinite: false,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function destroyLenis() {
  gsap.ticker.remove(updateLenis);
  if (lenisInstance) {
    lenisInstance.off('scroll', ScrollTrigger.update);
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

/* ─── Reveal on scroll (clip-path mask + scale) ─── */
export function useReveal(options?: {
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const { direction = 'up', duration = 1, delay = 0, stagger = 0 } = options || {};

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration,
      delay,
      ease: 'power4.out',
    };

    switch (direction) {
      case 'up': fromVars.y = 60; break;
      case 'down': fromVars.y = -60; break;
      case 'left': fromVars.x = 60; break;
      case 'right': fromVars.x = -60; break;
    }

    if (stagger > 0) {
      const children = el.children;
      gsap.from(children, {
        ...fromVars,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      gsap.from(el, {
        ...fromVars,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

/* ─── Image mask reveal (premium clip-path + inner scale) ─── */
export function useImageReveal(options?: { duration?: number; delay?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const { duration = 1.3, delay = 0 } = options || {};
    const img = el.querySelector('img, video');

    gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });
    if (img) gsap.set(img, { scale: 1.15 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      delay,
    });

    tl.to(el, {
      clipPath: 'inset(0% 0 0 0)',
      duration,
      ease: 'power4.out',
    });

    if (img) {
      tl.to(img, {
        scale: 1,
        duration: duration * 1.2,
        ease: 'power3.out',
      }, '<');
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return wrapperRef;
}

/* ─── Parallax depth layer ─── */
export function useParallax(speed: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

/* ─── Split text line reveal ─── */
export function useSplitLineReveal(options?: { stagger?: number; duration?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const { stagger = 0.08, duration = 0.9 } = options || {};
    const lines = el.querySelectorAll('.line-mask > *');

    if (lines.length === 0) return;

    gsap.from(lines, {
      yPercent: 110,
      rotateX: -8,
      opacity: 0,
      duration,
      stagger,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      transformOrigin: 'bottom center',
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

/* ─── Section depth overlap transition ─── */
export function useSectionOverlap() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.to(el, {
      scale: 0.94,
      filter: 'brightness(0.7)',
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}

/* ─── Hero entrance timeline ─── */
export function useHeroEntrance() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ delay: 0.2 });

    // Background image
    const bg = el.querySelector('[data-hero-bg]');
    if (bg) {
      tl.from(bg, { scale: 1.15, duration: 1.8, ease: 'power3.out' }, 0);
    }

    // Heading lines
    const headingLines = el.querySelectorAll('[data-hero-heading] .line-mask > *');
    if (headingLines.length) {
      tl.from(headingLines, {
        yPercent: 120,
        rotateX: -10,
        opacity: 0,
        duration: 1.0,
        stagger: 0.08,
        ease: 'power4.out',
        transformOrigin: 'bottom center',
      }, 0.3);
    }

    // Subtitle / tagline
    const tagline = el.querySelector('[data-hero-tagline]');
    if (tagline) {
      tl.from(tagline, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      }, 0.5);
    }

    // Lead paragraph
    const lead = el.querySelector('[data-hero-lead]');
    if (lead) {
      tl.from(lead, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.65);
    }

    // CTAs
    const ctas = el.querySelectorAll('[data-hero-cta]');
    if (ctas.length) {
      tl.from(ctas, {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      }, 0.75);
    }

    // Side metadata
    const sideBlocks = el.querySelectorAll('[data-hero-side]');
    if (sideBlocks.length) {
      tl.from(sideBlocks, {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
      }, 0.4);
    }

    // Decorative elements
    const decor = el.querySelectorAll('[data-hero-decor]');
    if (decor.length) {
      tl.from(decor, {
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.9);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return containerRef;
}

/* ─── Magnetic hover for buttons/elements ─── */
export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return ref;
}

/* ─── Scroll-controlled image zoom ─── */
export function useScrollZoom(maxScale: number = 1.08) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const img = el.querySelector('img');
    if (!img) return;

    gsap.fromTo(img, 
      { scale: 1 },
      {
        scale: maxScale,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, []);

  return ref;
}
