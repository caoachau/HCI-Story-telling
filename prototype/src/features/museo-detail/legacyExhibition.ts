import {
  khmerLegacyConnections,
  khmerLegacySources,
  type KhmerLegacyValue,
} from "./khmerLegacy";
import { khmerCulturePhotos, type CultureLanguage } from "./khmerCulture";

export type LegacyBlock = {
  id: string;
  chapter: string;
  kind: "paragraph" | "source" | "related" | "note";
  text: string;
  title?: string;
  target?: string;
  offset?: number;
};
export type LegacyFrame = {
  key: string;
  chapter: string;
  blocks: LegacyBlock[];
};
export function legacyExhibitionBlocks(
  value: KhmerLegacyValue,
  lang: CultureLanguage,
  photoIndex: number,
): LegacyBlock[] {
  const photo = khmerCulturePhotos[value.gallery[photoIndex]];
  return [
    {
      id: "lead",
      chapter: "overview",
      kind: "paragraph",
      text: value.lead[lang],
    },
    ...value.chapters.flatMap((chapter) =>
      chapter.paragraphs.map(
        (paragraph, index): LegacyBlock => ({
          id: `${chapter.id}-${index}`,
          chapter: chapter.id,
          kind: "paragraph",
          title: index === 0 ? chapter.title[lang] : undefined,
          text: paragraph[lang],
        }),
      ),
    ),
    {
      id: "photo-caption",
      chapter: "photographs",
      kind: "note",
      title: photo.title[lang],
      text: photo.caption[lang],
    },
    {
      id: "photo-credit",
      chapter: "photographs",
      kind: "source",
      text: photo.author,
      target: photo.sourceUrl,
    },
    ...(value.id === "continuity"
      ? khmerLegacyConnections.map(
          (connection, index): LegacyBlock => ({
            id: `connection-${index}`,
            chapter: "context",
            kind: "note",
            title: connection.title[lang],
            text: connection.text[lang],
          }),
        )
      : []),
    {
      id: "takeaway",
      chapter: "context",
      kind: "note",
      title: lang === "vi" ? "Giá trị còn lại" : "What endures",
      text: value.takeaway[lang],
    },
    ...value.sources.map(
      (id): LegacyBlock => ({
        id: `source-${id}`,
        chapter: "context",
        kind: "source",
        text: khmerLegacySources[id].title[lang],
        target: khmerLegacySources[id].url,
      }),
    ),
    {
      id: "related",
      chapter: "context",
      kind: "related",
      title: lang === "vi" ? "Tiếp tục khám phá" : "Continue exploring",
      text: value.related.title[lang],
    },
  ];
}

/** Styled measurement, complete text, and stable word offsets across resizing. */
export function paginateLegacyBlocks(
  blocks: LegacyBlock[],
  probe: HTMLElement,
  available: number,
): LegacyFrame[] {
  const frames: LegacyFrame[] = [],
    capacity = Math.max(28, available - 3);
  const gap = parseFloat(getComputedStyle(probe).rowGap) || 12;
  for (const chapter of [...new Set(blocks.map((block) => block.chapter))]) {
    let current: LegacyBlock[] = [],
      used = 0;
    const push = () => {
      if (!current.length) return;
      frames.push({
        key: `${chapter}:${current[0].id}:${current[0].offset ?? 0}`,
        chapter,
        blocks: current,
      });
      current = [];
      used = 0;
    };
    for (const block of blocks.filter((item) => item.chapter === chapter)) {
      const node = probe.querySelector<HTMLElement>(
          `[data-measure-block="${block.id}"]`,
        )!,
        text = node.querySelector<HTMLElement>(".md-legacy-block-text")!;
      const original = text.textContent;
      const pieces: { block: LegacyBlock; height: number }[] = [];
      if (node.offsetHeight > capacity && block.text) {
        const words = block.text.split(/\s+/);
        let start = 0;
        while (start < words.length) {
          let low = 1,
            high = words.length - start;
          while (low < high) {
            const length = Math.ceil((low + high) / 2);
            text.textContent = words.slice(start, start + length).join(" ");
            if (node.offsetHeight <= capacity) low = length;
            else high = length - 1;
          }
          let length = low;
          if (start + length < words.length)
            for (
              let boundary = length;
              boundary >= Math.ceil(length * 0.65);
              boundary--
            ) {
              if (/[.!?;]$/.test(words[start + boundary - 1])) {
                length = boundary;
                break;
              }
            }
          text.textContent = words.slice(start, start + length).join(" ");
          pieces.push({
            block: { ...block, text: text.textContent, offset: start },
            height: node.offsetHeight,
          });
          start += length;
        }
        text.textContent = original;
      } else pieces.push({ block, height: node.offsetHeight });
      for (const piece of pieces) {
        if (current.length && used + piece.height + gap > capacity) push();
        used += piece.height + (current.length ? gap : 0);
        current.push(piece.block);
      }
    }
    push();
  }
  return frames;
}
