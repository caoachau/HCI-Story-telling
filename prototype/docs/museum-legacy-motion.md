# Heritage mosaic and exhibition motion

Implemented from the two supplied heritage briefs. Open `/bao-tang-khmer.html` and select **Di sản** in the footer. The six value cards keep their existing full-bleed composition, photographs, bilingual copy, filters and related destinations.

## Mosaic

`useLegacyMosaicMotion.ts` uses the existing GSAP dependency and its Flip plugin. The whole title phrases pass through masks; a short bronze rule, subtitle and filters precede the six cards. Cards arrive in the order 1, 2, 5, 3, 4, 6 with restrained movement, scale and blur. After their entrance, one faint border wave follows 1, 2, 3, 6, 5, 4. The existing Khmer roof photograph supplies a very faint texture; its 20-second drift and one warm sweep pause while reading or when the document is hidden.

A shared cream capsule moves under the selected filter. Retained cards animate between measured positions with GSAP Flip; inert copies of removed cards fade out and are discarded. New cards enter separately. Rapid choices resolve to the latest filter. The screen clips decorative/animated overflow so it cannot produce a scrollbar that changes the grid width during entrance.

Fine-pointer desktop hover pans the selected photograph by at most five pixels, gently enlarges it, moves its title and arrow, traces the bronze border once, and dims neighboring cards. A low-opacity pointer light sits behind the grid. There is no tilt or particle effect. Filter counts are omitted at the narrowest widths to preserve the existing directly reachable five-filter row.

## Exhibition reader

`KhmerLegacyExhibition.tsx` opens a native modal dialog with approximately 100-pixel side margins on large desktops and compact margins on phones. The selected loaded photograph expands into the exhibition; closing returns it to the visible matching card. Flight copies are inert and removed after completion, interruption, rotation or reduced-motion changes.

The reader retains all four chapters and eight original paragraphs, three documentary photographs and their full captions/credits, references, lasting-value text, related destinations and the four continuity connections. Seven chapter tabs and previous/next page actions replace long vertical scrolling. `legacyExhibition.ts` measures styled text and splits oversized paragraphs at word/sentence boundaries without dropping words. The reading position uses stable block and word offsets when resizing. Long photograph captions remain available in **Ảnh tư liệu**. The last requested chapter wins during rapid navigation.

Left/Right and horizontal touch swipes advance complete reading pages. Left/Right inside the photo strip changes its photograph. Native dialog focus containment, Escape, safe outside-click handling, visible close/page controls, source links and focus restoration are preserved. Returning leaves a subtle **Đã khám phá** marker; filter and exploration state survive section changes and the existing map return flow.

## Accessibility and validation

System reduced motion and the map host's live `access-reduce-motion` preference remove animated movement, hover dimming and shared image flights while retaining all content and navigation. Hidden sections dispose their motion; open readers pause the background. Resize, closing and rapid choices clean up temporary nodes.

Run `npm run lint`, the production build, and `node tests/museo-detail-test.cjs --legacy-only` for complete content, related links, focus and responsive checks. `--legacy-motion-only` covers staggered entrance, actual card rearrangement, shared image expansion/reverse, hover, rapid choices, interruption, rotation, live preferences, memory and the map host. Use `TEST_BASE_URL` to point the same checks at the production preview. The full `tests/museo-detail-test.cjs` suite also covers the other five sections and English integration. These checks validate behavior and layout, not a measured frame-rate guarantee on every device.

Validation on 8 October 2026: TypeScript lint and production build pass. The complete production standalone/integrated suite passed 1,656 reported checks; the production normal-motion suite passed 26. The additional production `--legacy-mobile-only` suite passed five checks covering real keyboard page/photo navigation, retained reading position after rotation, page bounds and actual horizontal phone swipes. The final touch-action adjustment reserves horizontal gestures for the exhibition pager. All six original readings preserve every word, including references and continuity connections, across nine reader sizes from 320 × 568 to 1920 × 1080. No missing local assets or browser exceptions were recorded. Visual review includes desktop, narrow portrait and short landscape.
