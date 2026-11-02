import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { restoredParams, updateRoute, useRememberedState } from '../experience/state';

export type QuickReaderBlock = {
  id: string;
  heading?: string;
  text?: string;
  className?: string;
  node?: ReactNode;
};

function Block({ block }: { block: QuickReaderBlock }) {
  return (
    <article
      className={`lqv-reader-block ${block.className ?? ""}`}
      data-quick-block={block.id}
    >
      {block.heading && <h4>{block.heading}</h4>}
      {block.text && <p>{block.text}</p>}
      {block.node}
    </article>
  );
}

/** Measure actual type and available height; preserve every word across pages. */
function paginate(
  blocks: QuickReaderBlock[],
  probe: HTMLElement,
  height: number,
) {
  const capacity = Math.max(32, height - 3),
    gap = 12;
  const pages: QuickReaderBlock[][] = [];
  let page: QuickReaderBlock[] = [],
    used = 0;
  const push = (block: QuickReaderBlock, size: number) => {
    if (page.length && used + gap + size > capacity) {
      pages.push(page);
      page = [];
      used = 0;
    }
    used += (page.length ? gap : 0) + size;
    page.push(block);
  };
  for (const [index, block] of blocks.entries()) {
    const source = probe.children[index] as HTMLElement;
    const fullHeight = source.offsetHeight;
    if (fullHeight <= capacity || !block.text) {
      push(block, fullHeight);
      continue;
    }
    const clone = source.cloneNode(true) as HTMLElement;
    probe.append(clone);
    const paragraph = clone.querySelector("p")!;
    const heading = clone.querySelector("h4");
    const words = block.text.trim().split(/\s+/);
    let offset = 0;
    while (offset < words.length) {
      if (offset) heading?.remove();
      let lo = 0,
        hi = words.length - offset;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        paragraph.textContent = words.slice(offset, offset + mid).join(" ");
        if (clone.offsetHeight <= capacity) lo = mid;
        else hi = mid - 1;
      }
      if (!lo && !offset && heading?.isConnected) {
        paragraph.textContent = "";
        push({ ...block, text: undefined }, clone.offsetHeight);
        heading.remove();
        continue;
      }
      const length = Math.max(1, lo);
      const text = words.slice(offset, offset + length).join(" ");
      paragraph.textContent = text;
      push(
        {
          ...block,
          id: `${block.id}:${offset}`,
          heading: offset || !heading?.isConnected ? undefined : block.heading,
          text,
        },
        clone.offsetHeight,
      );
      offset += length;
    }
    clone.remove();
  }
  if (page.length) pages.push(page);
  return pages.length ? pages : [[]];
}

export function QuickLocationReader({
  blocks,
  active,
  lang,
  reduced,
  memoryKey = 'reader',
}: {
  blocks: QuickReaderBlock[];
  active: boolean;
  lang: "vi" | "en";
  reduced: boolean;
  memoryKey?: string;
}) {
  const [pages, setPages] = useState<QuickReaderBlock[][]>([blocks]);
  const siteId = memoryKey.split(':')[0];
  const initial = restoredParams(siteId);
  const explicitPage = initial.has('quickPage') && initial.get('quickTab') === memoryKey.split(':')[1];
  const [page, setPage] = useRememberedState(`${memoryKey}:page`, Math.max(0, Math.min(100, Number(initial.get('quickPage')) || 0)), explicitPage);
  useEffect(() => { if (active) updateRoute({ quickPage: page }, siteId, !['con-chim', 'den-tho-bac'].includes(siteId)); }, [page, active, siteId]);
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const previous = useRef<HTMLDivElement>(null);
  const nodes = useRef(blocks);
  nodes.current = blocks;
  const plan = useRef("");
  useLayoutEffect(() => {
    if (!active) return;
    let alive = true,
      frame = 0;
    const measure = () => {
      if (!alive || !body.current?.clientHeight) return;
      const next = paginate(
        nodes.current,
        probe.current!,
        body.current.clientHeight,
      );
      const key = next
        .map((parts) =>
          parts.map((part) => `${part.id}:${part.text ?? ""}`).join("|"),
        )
        .join("/");
      if (key === plan.current) return;
      plan.current = key;
      setPages(next);
      setOutgoing(null);
      setPage((current) => Math.min(current, next.length - 1));
    };
    measure();
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(body.current!);
    window.addEventListener('heritage:preferences', schedule);
    void document.fonts.ready.then(() => {
      if (alive) measure();
    });
    return () => {
      alive = false;
      window.removeEventListener('heritage:preferences', schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [active, lang]);
  useLayoutEffect(() => {
    if (outgoing === null || !active || reduced || !previous.current) {
      setOutgoing(null);
      return;
    }
    root.current!.dataset.readerMotion = "changing";
    const direction = Math.sign(page - outgoing),
      easing = "cubic-bezier(.16,1,.3,1)";
    const old = previous.current.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: `translateX(${-direction * 18}px)` },
      ],
      { duration: 200, easing, fill: "forwards" },
    );
    const incoming = body.current!.animate(
      [
        { opacity: 0, transform: `translateX(${direction * 20}px)` },
        { opacity: 1, transform: "none" },
      ],
      { duration: 500, delay: 60, easing, fill: "backwards" },
    );
    void incoming.finished
      .then(() => {
        setOutgoing(null);
        if (root.current) root.current.dataset.readerMotion = "idle";
      })
      .catch(() => {});
    return () => {
      old.cancel();
      incoming.cancel();
      if (root.current) root.current.dataset.readerMotion = "idle";
    };
  }, [page, outgoing, active, reduced, pages]);
  const change = (next: number) => {
    if (next === page) return;
    setOutgoing(reduced ? null : page);
    setPage(next);
  };
  return (
    <div
      className="lqv-reader"
      ref={root}
      data-reader-page={page}
      data-reader-pages={pages.length}
    >
      <div className="lqv-reader-body" ref={body}>
        {(pages[page] ?? pages[0]).map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </div>
      {outgoing !== null && pages[outgoing] && (
        <div
          className="lqv-reader-outgoing"
          ref={previous}
          aria-hidden="true"
          inert
        >
          {pages[outgoing].map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </div>
      )}
      <div className="lqv-reader-measure" ref={probe} aria-hidden="true" inert>
        {blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </div>
      <div className="lqv-page-navigation">
        <span aria-live="polite">
          {String(page + 1).padStart(2, "0")} /{" "}
          {String(pages.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label={
            lang === "vi"
              ? "Trang thông tin trước"
              : "Previous information page"
          }
          disabled={page === 0}
          onClick={() => change(page - 1)}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          aria-label={
            lang === "vi"
              ? "Trang thông tin tiếp theo"
              : "Next information page"
          }
          disabled={page === pages.length - 1}
          onClick={() => change(page + 1)}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
