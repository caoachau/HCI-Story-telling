# Location information viewer

All seven map destinations share this viewer, preserving each location's name, address, photographs, captions, credits, Vietnamese/English content, QR code and full-story route.

The photograph fills the upper area with a static readability gradient behind the title and toolbar. The lower sheet is opaque black (`#080808`), with the complete caption, three information tabs and measured reading pages. Gold `#f2c77f`, matching the selected map marker's number, replaces the former red on the selected tab, underline, thumbnail border, address pin and full-story button. The button uses dark `#38270e` text for contrast.

The window, title and photographs appear, change destinations and close immediately. Gallery images have no zoom, pan, crossfade, floating motion, hover lighting or tooltips. Selecting an image still works through thumbnails, arrows, keyboard or swipe, with native loading/error recovery. Map-marker artwork also remains still: no floating, hover lift, selected enlargement or pulsing rings. Map camera positioning and the selected-place labels remain functional.

Only explicit tab/page changes animate the reading text and selected-tab indicator. Controls provide pressed-state feedback; images do not receive hover effects. Reduced motion still suppresses these control transitions. Closing restores keyboard focus. Museum preloading remains; opening its full story no longer clones or flies the location photograph. The full detail page handles its own existing intro.

The responsive layout, captions, existing destination data, QR, six-section detail navigation and pagination remain unchanged. No photography or content was generated.

Validation (set `TEST_BASE_URL` to the production preview):

- `node tests/location-quick-reference-test.cjs`: all seven locations, both languages, captions, controls, QR, full-story link and responsive layouts to 4K.
- `node tests/museo-detail-test.cjs --quick-window-motion-only`: static opening/replacement, image hover and selection, still map artwork, gold accents, tab/page transitions, reduced motion, swipe, keyboard and focus restoration.
- `node tests/museo-detail-test.cjs --opening-only`: direct cold/warm full-story navigation without an animated image clone, mobile resize, close and reduced motion.
- `node tests/museo-detail-test.cjs --quick-window-only`: complete reading content across languages and screen sizes.

Screenshots: `preview/museo-side-panel-gold-static-desktop.png`, `preview/museo-quick-reference-den-tho-bac-*.png` and `preview/museo-side-panel-mobile.png`.

Validation for this revision: TypeScript and production build passed; 110 shared-viewer layout/content checks, 12 static-image/control checks and 8 direct-opening lifecycle checks passed. All seven destinations and both languages were covered; screenshots include desktop, 4K and phones. The opening checks reported no missing local assets or browser exceptions.
