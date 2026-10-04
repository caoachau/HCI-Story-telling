# MUSEO / Bảo tàng văn hóa Khmer detail

Open `/bao-tang-khmer.html` directly, or choose Bảo tàng văn hóa Khmer in the map's landmark dock and select **Xem chi tiết**. Selecting any of the seven locations first opens `LocationQuickView`: the location's photograph, name, address, short introduction, heritage period, region and chapter highlights. Desktop uses a compact floating card; phones use a bottom sheet. The content scrolls inside the card while its toolbar and detail action remain visible. The desktop width toggle places the photo and content side by side when space allows. Vietnamese/English follows the host language, and failed photographs show a neutral fallback.

**Xem chi tiết** opens the selected location's existing page across the full viewport. Returning with the collapse control or Escape restores the quick card and keyboard focus to its detail action. The detail remains mounted while hidden, preserving selected screens, photos and filters. Closing the quick card or selecting another location releases it. The map keeps its dimensions throughout. QR, artifact and panorama utilities use `LocationUtilityDialog`, a native modal layer above fullscreen details with Escape and trigger-focus restoration.

The museum page is mounted only for `bao-tang-khmer`; its code and stylesheet load lazily after the detail action. Section two now presents the real Khmer culture museum using the user's `btvhkm.docx`. The other five sections retain the supplied Chauvet/prehistoric reference content pending their own content updates.

The six sections, in reference order:

1. Ancient Prehistory hero with Vietnamese chapter dock and four image tabs. Previous/next arrows change only the photograph and synchronize the selected tab and counter; the heading, subtitle and description stay fixed. Selecting a tab also changes only the photograph.
2. Khmer culture museum overview, four metrics, local satellite map, museum photo gallery, cultural highlights and visiting context.
3. Interactive site map with selectable markers, featured site and five site cards.
4. Human evolution timeline with five periods, changing period details and a separate topic list for each period.
5. Chauvet Cave gallery with six scenes, artwork details and a photo drawer that expands to the left.
6. Six exhibitions with category filters and collection dialogs.

The repeated MUSEO navigation headers have been removed from all six sections at the user's request; section content starts directly without reserving header space. Each section occupies one screen. Only the selected section is displayed; the other five remain mounted and hidden, preserving selected photos, periods and filters. The footer provides previous/next controls, six direct screen selectors and the host's QR, return-to-overview and close actions. Changes are immediate and never display parts of two sections together. Wheel/trackpad gestures and vertical swipes change screens outside nested collections, while Page Up/Page Down also navigate. Fullscreen hides the map's landmark dock, and resizing preserves the active screen.

The visual system follows the supplied dark reference: cream display type, stone artwork, warm copper controls and thin framed borders. Native CSS and existing Lucide icons are used. DESIGN_VARIANCE 4, MOTION_INTENSITY 3, VISUAL_DENSITY 7; no added automatic motion. Below 1000 px the screen composition becomes compact and the footer uses smaller controls. Reduced motion disables smooth scrolling.

The composition responds to both screen width and height, with the final sizing rules in `screen-layout.css`. The overview introduction reserves its full description and action height, with a gap before the facts strip. Low, wide windows place the supporting overview panels beside the introduction and keep the facts underneath both columns. Timeline rows remain proportional, the map and its site cards fill their available grid rows, and exhibition cards share the remaining grid height. Hero and cave-gallery artwork extend through the screen height. Three human-origins topics fill the hero's reading area, while a synchronized photo title, description and counter give context to the selected cave scene. Filtered exhibition cards expand to use their grid and display additional context.

All six sections fit the tested 1366 × 768, 1440 × 960, 1920 × 800, 1920 × 1080, 2560 × 1440, 768 × 960, 390 × 844 and 320 × 568 viewports without vertical section scrolling. Compact layouts keep the metric collection, overview panels, timeline milestones and site cards in horizontal strips. Phone timeline details and topics occupy horizontally browsable panels; tablets retain the side-by-side story and topic list. Long highlight lists scroll within their own panel. Short summaries and reading dialogs preserve access to complete content without reducing the primary body text below 10 px.

All six sections fill the available detail viewport width on desktop and mobile. The page has no maximum width or outer horizontal gutters; text and controls retain their internal spacing.

The overview facts strip follows `tong quan.png`: four metrics share the left panel, while the location map extends lower on the right. A thin, warm stone trim frames both panels, with softly rounded corners, subdued dividers and a diagonal step at the map's lower edge. On small screens, the metrics scroll horizontally beside the map.

Section two retains its existing introduction, stepped facts/map strip and three supporting panels. `KhmerMuseumOverview.tsx` isolates this section; `khmerOverview.ts` contains Vietnamese/English copy, metrics, nine reading topics, gallery captions and source credits. `khmer-overview.css` only adds the museum imagery treatment, Vietnamese accent spacing, location map and reading-dialog styles; `screen-layout.css` still owns the responsive grid and section dimensions. Content can be edited through the structured data without changing layout.

The four metrics distinguish approximately 1 ha of grounds from more than 1,700 m² of building floor area, then introduce 800+ objects/documents and four cultural themes. Expanded collection content covers beliefs and palm-leaf manuscripts, everyday life, crafts, music/theatre and festivals. Six highlight buttons cover cultural identity, architecture, performing arts, daily life, the museum–Ba Om–Ang Pagoda landscape and learning. The introduction and location map open their own expanded stories. Native dialogs retain Escape, trigger-focus restoration, internal scrolling and a visible close action on short screens. The introduction action opens a written account, replacing the reference's unrelated cave video.

The source document contains different historical dates and inventory scopes. The introduction attributes 1995 inauguration accounts and the 1992 construction/November 1997 visitor-opening account to their respective sources rather than asserting one date for all stages. It also distinguishes the frequently quoted 800+ collection figure from the 2024 account of over 1,000 collected/documented/displayed objects. Four cultural themes are an editorial organization, not a claim that the physical museum has exactly four rooms. Visiting hours and free admission are identified as information from the compiled document, not verified live opening status.

The map uses the museum's existing coordinates (9.9161668, 106.3049936) and nine existing cached Esri tiles. Its marker is registered to the actual centre; it introduces no invented geography. The current Nguyệt Hóa / Vĩnh Long locality follows the provincial government's museum document, while the reading dialog also records the former Ward 8 / Trà Vinh city address. This change is scoped to section two.

Five real museum photographs are stored locally: the facade from the Vĩnh Long provincial portal's museum PDF and four archive photographs from the Vietnam National Museum of History (fishing tools, temple model, Pinpeat ensemble and visitors). The gallery wraps through four photos with synchronized captions/counters and preserves its selection across screen changes. Photo bytes are preserved from the sources; images were not generated or altered. Credits and direct primary-source links appear in the reading dialogs and are recorded in `assets/CREDITS.md`.

Timeline topics belong to the selected period: Paleolithic has four, Homo erectus five, Neanderthals five, Homo sapiens six and Neolithic five. Tabs and both sets of period arrows synchronize the list, and choosing another period resets its list to the top. Three topics fit in the column; remaining topics scroll independently with a mouse, keyboard or touch, keeping the timeline screen selected. Each topic opens its own photo, expanded description, period context and primary-source link. The data lives in `eraHighlights.ts`, with Smithsonian Human Origins and British Museum references.

The round control beside the Chauvet Cave image opens a horizontal photo drawer to its left, replacing the speaker control. Exactly three of the six gallery photos fit in the drawer. Touch swiping, mouse dragging, horizontal trackpad scrolling, arrow buttons and keyboard arrows browse the remaining photos. Selecting a photo synchronizes the large cave image and the bottom gallery. The same round control collapses the drawer; Escape also collapses it and restores focus. The drawer stays within the section on phone layouts, and its reveal/scroll motion respects reduced-motion preferences.

The gallery control uses a compact translucent circle, a thin directional chevron and a single subdued border. Its next-scene preview has rounded, fading edges and uses the scene background photograph. The expanded panel shares the warm translucent treatment and anchors its right edge to the control. TypeScript lint, the production build and the existing drawer interaction checks pass after this appearance update, including three visible photos, arrows, dragging, keyboard navigation, phone swiping, synchronized selection and collapse.

The bottom photo strip in section five also supports holding and dragging left/right with a mouse, plus native touch swiping and horizontal trackpad scrolling. Its cursor changes from grab to grabbing during a drag, with snapping suspended until release. Dragging browses without selecting a photo; a click still updates the large image and synchronized gallery selection. Native image dragging is disabled. Interaction lives in the isolated `TourGalleryStrip.tsx` component.

EXPLORE SITE opens a centered detail dialog for all five locations, including Chauvet. On desktop it fills the viewport with 100 px margins at each side and 32 px above/below. Tablet and phone margins reduce to 24 px and 12 px. Every location includes a four-image gallery with synchronized arrows, thumbnails and captions, three overview paragraphs, three highlights, related context and source links. The content scrolls inside the dialog while its close button stays visible. Escape and BACK TO MAP restore the underlying map view. Dialog positioning also explicitly centers search, art and virtual-tour windows.

The site galleries add 12 locally stored Wikimedia Commons photographs. Captions distinguish replicas and collection illustrations; each downloaded photograph shows its author, source and license. Location copy cites the French and Spanish culture ministries, the Smithsonian Human Origins Program and Wits University. Detailed data and photo credits live in `siteDetails.ts` and `sitePhotoCredits.ts`.

The source contains images rather than video: WATCH INTRO, WATCH OVERVIEW and VIRTUAL TOUR open an interactive scene tour with an optional play/pause sequence. VIEW ALL in the map section opens search for local collections and sites. Dialogs use the native browser top layer, Escape and restored trigger focus.

Validation:

```powershell
npm run lint
npm run build
# With Vite running:
node tests/museo-detail-test.cjs
# Focused overview overlap regression, including low windows and landscape phones:
node tests/museo-detail-test.cjs --overview-only
# Khmer museum content, nine stories, photography and responsive reading dialogs:
node tests/museo-detail-test.cjs --khmer-overview-only
# Location selection, quick information and fullscreen detail flow:
node tests/museo-detail-test.cjs --quick-view-only
# Against a production preview:
$env:TEST_BASE_URL = 'http://127.0.0.1:4173'
node tests/museo-detail-test.cjs
```

Browser checks cover all six sections at eight viewport sizes, exclusive screen visibility, content fitting without outer scrolling, primary text and control bounds, non-overlapping hero and tour content, host actions inside the footer, wheel gestures, vertical phone swipes, nested highlight scrolling, keyboard paging, synchronized map selection, all 25 timeline topics and their dialogs, independent topic scrolling, galleries, bottom-strip mouse dragging in both directions and phone swiping, photo selection after dragging, synchronized photo captions, category filters, search and dialog focus. Host checks select all seven locations, open their existing fullscreen details, verify quick information and unobstructed detail actions at eight viewport sizes, change language/width, simulate a failed photo, open QR/artifact/panorama utilities, and check focus restoration and preserved museum state when returning/reopening. Screenshots are written to the ignored `preview/` directory; `node tests/museo-detail-test.cjs --layout-only` captures each section at every tested viewport.

The overview overlap regression (`--overview-only`) checks 19 viewport sizes, including low desktop windows and landscape phones. It verifies the description/action gap, both buttons' visibility and hit targets, complete metric descriptions, and fitting without section scrolling. Host checks open details from a widened quick card and return/reopen at 1440 × 600.

Khmer overview validation on 2026-10-04: TypeScript lint, production build, the full production browser suite and the 19-size overview regression pass. New checks cover all nine reading topics, four collection themes, actual image loading, gallery wrapping and state preservation, Vietnamese accent spacing, source credits, visiting-information qualifications, responsive dialog bounds and persistent close controls at five sizes. Integrated checks cover English overview copy and collection dialogs at 1440, 390 and 320 px. Concurrent browser runs use separate process-specific Chrome profiles.

Validation on 2026-10-04: TypeScript lint, production build and the complete production browser suite pass. The Lighthouse baseline measured before the latest screen-layout changes reported performance 91 and accessibility 100, FCP 2.1 s, LCP 3.1 s, CLS 0.021 and total blocking time 70 ms. The source fonts are compressed from 264 KB to 63 KB and the hero photograph, frame texture and display font are preloaded. Those performance measurements are local and vary with device/network conditions.
