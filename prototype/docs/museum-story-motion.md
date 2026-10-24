# History and living-heritage motion

Implemented from the two supplied motion briefs without replacing the six-screen navigation, documentary content or existing readers. Open `/bao-tang-khmer.html` and select **Lịch sử** or **Văn hóa** in the footer. Both screens preserve their selected story when returning from the map.

## History

`KhmerMuseumHistory.tsx`, `useHistoryTimelineMotion.ts` and `khmer-history-motion.css` retain all five periods, 26 stories, dated facts, documentary captions and reference sources. The quieter architecture introduction takes 30% of the desktop composition, compared with 36% previously. The main spread allocates approximately 30% to text, 48% to its photograph and 22% to the story index. Compact screens retain their existing horizontally browsable detail panels.

The bronze timeline connects the actual centers of its five milestone dots, including in an overflowing phone track. A selected thumbnail rises seven pixels on desktop; completed photographs remain brighter than upcoming photographs. Its progress reaches the next milestone to mark the current chapter interval. This is chapter navigation, not a proportional calendar scale.

A period change takes about 855 ms: the progress line moves, the year rolls vertically, the whole title passes through a mask, the photograph crossfades, facts arrive individually, and the three visible index entries follow. Facts use small ruled documentary notes instead of four circular icons. Story rows have numbering, dated summaries, a photographic preview and an arrow; selection opens the existing complete reader. Left/Right, Home and End on the milestone track update both selection and focus. Compact selection reveals itself in the horizontal track.

Only outgoing title/year/photo copies are created. They are inert and hidden from assistive technology; their styles, tweens and nodes are disposed on interruption, screen changes, reduced-motion changes and unmount. The actual current year/title remain available to the accessibility tree. A live status announces the new phase.

## Culture

`KhmerMuseumCulture.tsx`, `useCultureMotion.ts` and `khmer-culture-motion.css` keep the original macro photograph, editorial heading, three content groups, story caption, draggable museum rail and three-photo expanding drawer. All 12 Culture, six Activities and six People topics remain intact, with their actual credited photographs and complete readings.

Opening takes about 1.57 seconds. The photograph settles from a 1.07 scale, five-pixel blur and small horizontal drift. The dark curtain develops next; the eyebrow, two whole heading lines, supporting text, lenses, actions, caption and rail enter in successive groups. Once settled, the camera moves only 12 pixels or less over 12 seconds and then stops. An eight-second warm-light breath stays at 2.5–6% opacity. No particles or new bitmap assets were added.

Hovering or focusing an inactive card waits 280 ms before offering a 12%-opacity photograph preview. This preview never changes the selected topic. Pointer leave, drag start, selection, reading, screen changes and reduced motion remove it. Card images, borders and labels provide short hover feedback.

Selecting a loaded, visible card captures the actual photograph bounds before React updates. A decorative copy expands from those bounds to the hero over 750 ms, below the fixed text/gradient layers. The current story number rolls, its old title moves up and the new title/description follow. Offscreen or unloaded origins use a directional photographic crossfade. The drawer can supply the same loaded-image origin. Rapid selection cancels the earlier transition and retains the final topic.

Content lenses move a shared cream indicator between the actual pill rectangles. Their collections enter first; the next hero starts after 200 ms. The old photo stays visible during that interval. The topic total rolls when a 12-item collection becomes a six-item collection. A thin rail line follows horizontal browsing, and the active card edge marks its index within the collection. Dragging continues to browse without selecting an image.

Camera and light pause while reading, and inactive screens release their GSAP motion. Camera motion also pauses when the document is hidden. Resizing or rotating during an image flight resolves the transition onto the responsive hero rather than leaving a displaced clone. The normal text/photograph layout does not animate its dimensions; only the detached image copy changes its box.

Both hooks use the existing GSAP dependency and `museumMotion.ts` easing/preferences. Live system reduced motion and the map host's accessibility preference resolve active transitions, remove decorative copies and show the final content immediately. Reduced motion also disables the new ambient and hover movement. Existing native dialogs retain Escape, source scrolling and trigger-focus restoration.

## Validation

Use `npm run lint` and the production build for static validation. `node tests/museo-detail-test.cjs --history-only` verifies all historical stories, facts, photographs, sources and responsive frames. `--culture-only` verifies all cultural readings, related stories, search, responsive geometry, dragging and the three-photo drawer. `--story-motion-only` exercises normal motion, interrupted navigation, keyboard selection, hover delay/cancellation, shared-image cleanup, lens movement, rail browsing, paused reading, live reduced motion, rotation and the integrated map-host preference. Set `TEST_BASE_URL=http://127.0.0.1:4173` to test the production preview.

Validation on 2026-10-08: TypeScript lint and the production build pass. The final production integration suite passed 1,404 reported checks, including English content, responsive history facts/readers, all culture topics and photographs, native drawer/rail interaction, six-screen geometry and return/reopen from the map. The separate production normal-motion suite passed 28 checks, including live host accessibility changes and rotation during an image transition. Earlier focused development suites passed 209 history and 197 culture checks. Reviewed captures include 1440 × 960, 390 × 844, 320 × 568 and 667 × 375. No missing local files or browser exceptions were recorded. These checks validate functionality and local geometry; they do not claim measured frame rate on every device.
