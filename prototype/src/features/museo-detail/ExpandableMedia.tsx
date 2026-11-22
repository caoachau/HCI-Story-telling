import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize, Minimize } from "lucide-react";
import type { PlaceLanguage } from "./khmerPlaces";
import "./expandable-media.css";

/** A stable portal surface keeps the same canvas, camera and loaded model. */
export function ExpandableMedia({ title, className = "", children }: {
  title: string; className?: string; children: (expanded: boolean, toggle: () => void) => ReactNode;
}) {
  const slot = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLElement | null>(null);
  const [surface] = useState(() => document.createElement("div"));
  const [expanded, setExpanded] = useState(false);
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: innerWidth, height: innerHeight });
  useLayoutEffect(() => {
    surface.className = "md-media-surface";
    slot.current?.append(surface);
    return () => { surface.remove(); };
  }, [surface]);
  useLayoutEffect(() => {
    if (!expanded) return;
    const node = dialog.current!;
    const anchor = slot.current!;
    const target = anchor.closest(".kd-frame,.khc-frame") ?? anchor.closest(".md-root")?.querySelector(".md-main");
    const measure = () => {
      const rect = target?.getBoundingClientRect();
      setBounds(rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : { left: 0, top: 0, width: innerWidth, height: innerHeight });
    };
    measure();
    node.append(surface);
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setExpanded(false);
    };
    node.addEventListener("keydown", escape, true);
    node.showModal();
    const observer = new ResizeObserver(measure);
    if (target) observer.observe(target);
    window.addEventListener("resize", measure);
    surface.querySelector<HTMLElement>("[data-action='expand-media']")?.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      node.removeEventListener("keydown", escape, true);
      window.removeEventListener("resize", measure);
      if (anchor.isConnected) anchor.append(surface);
      else surface.remove();
      node.close();
      const trigger = origin.current;
      queueMicrotask(() => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }); });
    };
  }, [expanded, surface]);
  const toggle = () => {
    if (!expanded) origin.current = document.activeElement as HTMLElement | null;
    setExpanded(value => !value);
  };
  return <>
    <div ref={slot} className={`md-expandable-media ${className}`} data-media-expanded={expanded} />
    {createPortal(children(expanded, toggle), surface)}
    {expanded && createPortal(<dialog ref={dialog} className="md-media-expanded" style={bounds} aria-label={title} onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); event.stopPropagation(); setExpanded(false); }} />, document.body)}
  </>;
}

export function ExpandablePhoto({ title, lang, className = "", children }: { title: string; lang: PlaceLanguage; className?: string; children: ReactNode | ((expanded: boolean) => ReactNode) }) {
  return <ExpandableMedia title={title} className={`md-expandable-photo ${className}`}>{(expanded, toggle) => <div className="md-expandable-photo-content">
    {typeof children === "function" ? children(expanded) : children}
    <button type="button" className="md-photo-expand-button" data-action="expand-media" aria-pressed={expanded} aria-label={lang === "vi" ? expanded ? "Thu nhỏ ảnh hiện vật" : "Mở rộng ảnh hiện vật" : expanded ? "Collapse artifact image" : "Expand artifact image"} onClick={toggle}>{expanded ? <Minimize /> : <Maximize />}</button>
  </div>}</ExpandableMedia>;
}
