import {
  findKhmerPlace,
  khmerPlacePhotos,
  khmerPlaceSources,
  type KhmerPlace,
  type PlaceLanguage,
} from "./khmerPlaces";

export const placeChapters = [
  "overview",
  "observe",
  "gallery",
  "context",
] as const;
export type PlaceChapter = (typeof placeChapters)[number];
export const placeChapterLabels: Record<
  PlaceChapter,
  Record<PlaceLanguage, string>
> = {
  overview: { vi: "Tổng quan", en: "Overview" },
  observe: { vi: "Quan sát", en: "Look closer" },
  gallery: { vi: "Ảnh tư liệu", en: "Photographs" },
  context: { vi: "Liên hệ", en: "Connections" },
};
export type PlaceBlock = {
  id: string;
  chapter: PlaceChapter;
  kind: "paragraph" | "fact" | "insight" | "caption" | "related" | "source";
  text: string;
  title?: string;
  target?: string;
  offset?: number;
};
export type PlaceFrame = {
  key: string;
  chapter: PlaceChapter;
  blocks: PlaceBlock[];
};

export function placeExhibitionBlocks(
  place: KhmerPlace,
  lang: PlaceLanguage,
  photoIndex: number,
): PlaceBlock[] {
  const image = khmerPlacePhotos[place.gallery[photoIndex]];
  return [
    {
      id: "introduction",
      chapter: "overview",
      kind: "paragraph",
      text: place.description[lang],
    },
    {
      id: "setting",
      chapter: "overview",
      kind: "fact",
      title: lang === "vi" ? "Không gian" : "Setting",
      text: place.location[lang],
    },
    {
      id: "themes",
      chapter: "overview",
      kind: "fact",
      title: lang === "vi" ? "Gợi ý quan sát" : "Look for",
      text: place.tags.map((tag) => tag[lang]).join(" · "),
    },
    ...place.paragraphs.map(
      (paragraph, index): PlaceBlock => ({
        id: `story-${index}`,
        chapter: "observe",
        kind: "paragraph",
        text: paragraph[lang],
      }),
    ),
    ...place.highlights.map(
      (highlight, index): PlaceBlock => ({
        id: `insight-${index}`,
        chapter: "observe",
        kind: "insight",
        title: highlight.title[lang],
        text: highlight.text[lang],
      }),
    ),
    {
      id: `caption-${photoIndex}`,
      chapter: "gallery",
      kind: "caption",
      title: image.title[lang],
      text: image.caption[lang],
    },
    ...place.related.map(
      (id): PlaceBlock => ({
        id: `related-${id}`,
        chapter: "context",
        kind: "related",
        target: id,
        text: findKhmerPlace(id).title[lang],
      }),
    ),
    ...place.sources.map(
      (id): PlaceBlock => ({
        id: `source-${id}`,
        chapter: "context",
        kind: "source",
        target: id,
        text: khmerPlaceSources[id].title[lang],
      }),
    ),
  ];
}

// Measure real styled content rather than guessing character counts. Paragraphs
// that exceed one frame are split at word/sentence boundaries, never truncated.
export function paginatePlaceBlocks(
  blocks: PlaceBlock[],
  probe: HTMLElement,
  available: number,
): PlaceFrame[] {
  const frames: PlaceFrame[] = [];
  const capacity = Math.max(28, available - 2);
  const gap = parseFloat(getComputedStyle(probe).rowGap) || 12;
  for (const chapter of placeChapters) {
    let current: PlaceBlock[] = [],
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
      )!;
      const text = node.querySelector<HTMLElement>(".md-place-block-text");
      const initialText = text?.textContent ?? "";
      const pieces: { block: PlaceBlock; height: number }[] = [];
      if (node.offsetHeight > capacity && text && block.text) {
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
          if (start + length < words.length) {
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
          }
          const fragment = words.slice(start, start + length).join(" ");
          text.textContent = fragment;
          pieces.push({
            block: { ...block, text: fragment, offset: start },
            height: node.offsetHeight,
          });
          start += length;
        }
        text.textContent = initialText;
      } else pieces.push({ block, height: node.offsetHeight });
      for (const piece of pieces) {
        const height = piece.height + (current.length ? gap : 0);
        if (current.length && used + height > capacity) push();
        used += piece.height + (current.length ? gap : 0);
        current.push(piece.block);
      }
    }
    push();
  }
  return frames;
}
