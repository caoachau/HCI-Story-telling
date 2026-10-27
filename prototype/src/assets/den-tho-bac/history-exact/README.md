# History reference set, 26 October 2026

> C?p nh?t d?n repo 27/10/2026: c?c b?n ?nh/bi?n th? kh?ng c?n d?ng ?? ???c x?a. Ph?n d??i gi? l?ch s? ngu?n v? c?ch x? l?; t?n t?p c? kh?ng c? ngh?a t?p v?n n?m trong repo. Danh s?ch x?a v? hash n?m ? `prototype/docs/cleanup-2026-10-27.json`. C?c ?nh hi?n d?ng v? b?n ??i chi?u ???c gi? c? l? do trong `prototype/scripts/asset-retention.json`.

The seven `*-background.png` files are unchanged copies of the user-supplied background-only images. `manifest.json` records source paths, dimensions and SHA-256 hashes. The seven `*-layout.png` files retain the corresponding complete layout references for comparison and are not imported by the application.

Runtime background encodings use lossless WebP. Their decoded RGB bytes are checked against the supplied PNGs; no pixels, colours, texture or subjects are altered. A separate native CSS reading shade is measured per scene to match the darker text area of each complete layout; the photograph itself has no blur or colour filter. The original PNG copies remain in this folder for provenance.

Year numerals render as genuine white SVG `<text>` using the bundled Roboto Flex digit font at weight 750. The font's variable width axis and per-year metrics in `numeral-font.json` fit the existing measured year boxes without bitmap tracing, CSS scaling, blur, noise, texture, masks or filters. `history-numerals-750.woff2` is a digits-only subset of Roboto Flex; its OFL license and source hash are retained alongside the asset. Date, title, paragraphs, read action, timeline, source/fullscreen/close tools and six-section footer remain native HTML controls. The year is decorative in the accessible tree; the same milestone is announced in the date and timeline label.

At the reference viewport (1672 x 941), year bounds come directly from the supplied images. Large layouts (1969, 1989, 2012) and compact layouts (1970, 1971, 1972, 1975) retain their story and header-tool arrangements. Following the later shared-timeline instruction, **all seven scenes use the 1970 timeline**: the same full-width distribution, top divider, 600-weight year labels, text-width red selected underline, circular arrows and strip height. No timeline styling depends on the scene layout. The footer boundary also keeps the 1970 height so the strip does not move vertically between milestones. The shared footer retains the user's latest 38% black fill and 8 px backdrop blur.

The original internal ID `1971–1972` remains stable; its displayed year is `1972`. Reader content, keyboard selection, arrows, native touch, reduced-motion preferences, failure/retry and saved chapter state remain connected.

Reference geometry is implemented in `HistorySection.tsx`, `history-scenes.ts` and `history.css`. `tests/den-tho-bac-history-test.cjs` exercises all seven scenes at nine viewport sizes and the existing reader/navigation/motion lifecycle. Comparison screenshots are in `preview/den-tho-bac-history-exact-*.png`.
