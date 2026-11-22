# MUSEO reference artwork

## Grounds photographs replaced on 14 November 2026

The user supplied three specific replacement images, all found on their Desktop and copied without editing:

- `khmer-instrument-user-detail.jpg` ← `496191035_1256918849769173_2348996142637233090_n.jpg`, 2048 × 1153. This replaces the panorama close view as the instrument point's cover and sole gallery image. The inscription on the base is described only as visible text; no maker or manufacturing date is inferred. The previous tentative Roneat association was removed.
- `khmer-memorial-user-front.jpg` ← `a25_20250920150027.jpg`, 800 × 1094. This is now the first image and cover for point 02, Maha Sơn Thông memorial.
- `khmer-memorial-user-garden.jpg` ← `t1.jfif`, 516 × 387. This is the second memorial image. JPEG bytes are unchanged despite the `.jpg` extension used in the project. Existing Khmer and Vietnamese inscription images follow these two photographs.

The three images use the credit “Ảnh do người dùng cung cấp”. No capture date, photographer or licence was established for these supplied copies, and the earlier Commons credit is not applied to them. Popup, thumbnail and right-hand introduction share each point's first image. Older original/Google Maps images documented below are retained as provenance, but are no longer used as the memorial or instrument point images.

## User-supplied aerial for the complex

- `khmer-complex-aerial.png`: copied unchanged from `C:/Users/ASUS/OneDrive/Máy tính/91c4e250-55bb-4218-ada5-a443e5b66fe4.png`, explicitly identified by the user as the Desktop image for the Complex tab. Dimensions 1695 × 928. SHA-256 of source and project copy: `2F0228D2F41802E426E30DBABD3EAD7139799EBCE04621119153357267C1ED3C`.
- Visually matched to the attachment: pond at the top, Ang Pagoda and its moat at lower left, Khmer Cultural Museum at lower right. Markers are stored against this exact image, with normalized coordinates in `khmerDiscovery.ts`; no image crop, colour adjustment or reconstruction was applied.
- Display update requested on 14 November 2026: the native kiosk viewport fits this unchanged image to its width and clips the lower trees, preserving its top edge. Marker coordinates continue to use the full source image. Portrait or exceptionally short viewports retain the complete image as needed; no replacement or edited raster was introduced.
- Source is recorded as the user's supplied image. No photographer, capture date or publication licence was established for this particular file, and none was invented. Online images found while looking for the attachment were not substituted.
- Site images, introductions and references reuse the existing museum, pond and pagoda records. Related cultural context photographs are kept separate from the galleries of the actual pagoda and pond.

## Royal headdresses model and interpretation

- `khmer-royal-headdresses.glb` is an unchanged copy of the user's `mao_vua_hoang_hau_chi_tiet.glb`, added to the performing-arts topic at their request. 41,234,180 bytes; SHA-256 `0007110ADA0658782B2B48E6F5BEE5D51D82A1D42CFFCE40057054496FD3F22B`. glTF 2.0, generator `Tripo`, one mesh, 226,394 position vertices and four embedded JPEG images; no required compression extension. No edits to model geometry or textures were made.
- `khmer-royal-headdresses-preview.png` is an 800 × 800 render of this exact GLB using the application's Three.js viewer. It is labelled **model preview**, not a museum photograph, and serves as the card cover and alternate view.
- `khmerHeaddresses.ts` contains the bilingual object story and linked references. Primary interpretation sources: Vinh Long Museum's research on headdress and mask making and its account of the Dak Lak exhibition; Dak Lak Arts' exhibition report; NAFA's Reamker collection interpretation. The upload itself establishes no museum accession, date, maker, physical materials or exact character identity.
- The Thai auction listing, Pinterest and unverified social-media material supplied as leads were not used to authenticate a Khmer object. No universal rule that a shorter crown must denote a queen is asserted. The names king/queen follow the user's information; the character names are explained as narrative context rather than verified identities for each modelled crown.

## Sandstone 3D model replaced on 14 November 2026

- `khmer-sandstone.glb` is an unchanged copy of the user's latest `C:/Users/ASUS/Downloads/be_da_sua_lai_chan_de.glb`, replacing `da_6_mat_theo_preview_mau.glb` for **Hiện vật sa thạch** at their request. The original source files remain untouched in Downloads.
- Current size: 20,752,180 bytes. SHA-256 of source and project copy: `45495d87aa17fc39145e049947dbb84041550605391d22b71479a5688adf9c7d`.
- glTF 2.0, one textured mesh and one embedded image; no external resources or required compression extensions. No geometry, texture or orientation edits were made. The viewer centres the object for display only. Inline and detail views resolve to the same model asset.
- The interface labels the model as user-supplied material and keeps the existing source photograph in a separate view. The upload is not independent evidence of historical provenance, dating or scan accuracy.
- `KhmerArtifactModel.tsx` uses the project's Three.js with GLTFLoader and OrbitControls. The GLB loads when its object is displayed in the main exploration frame (automatically for the photo-less archaeology display), or intentionally opened in detail. Renderer, controls, geometry and textures are released when the viewer leaves the frame or switches to photo mode. Opening a story defaults to its photograph and preserves the existing inline model camera.

## Grounds point photographs added on 13 November 2026

- `khmer-building-original.jpg`: unchanged original [Bảo tàng Khmer ở Trà Vinh.jpg](https://commons.wikimedia.org/wiki/File:B%E1%BA%A3o_t%C3%A0ng_Khmer_%E1%BB%9F_Tr%C3%A0_Vinh.jpg), 4608 × 3456, 4,022,817 bytes. Photograph by **Bùi Thụy Đào Nguyên**, 17 March 2013, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Direct download: `https://upload.wikimedia.org/wikipedia/commons/8/8b/B%E1%BA%A3o_t%C3%A0ng_Khmer_%E1%BB%9F_Tr%C3%A0_Vinh.jpg`. The same building in the panorama, photographed from a different angle/date. Original author, date and license are displayed in its gallery.
- `khmer-memorial-original.jpg`: unchanged original [Tháp Khmer.jpg](https://commons.wikimedia.org/wiki/File:Th%C3%A1p_Khmer.jpg), 4608 × 3456, 4,619,943 bytes. Photograph by **Bùi Thụy Đào Nguyên**, 17 March 2013, [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Direct download: `https://upload.wikimedia.org/wikipedia/commons/b/bf/Th%C3%A1p_Khmer.jpg`. Tower tiers, doorway, stepped base and location were compared with the supplied panorama and the museum's own memorial article. This adds an original-resolution view; the existing frontal view and inscriptions remain in the gallery.
- `khmer-instrument-close.jpg`: 1800 × 1000 perspective view delivered directly by the public Google Maps panorama image source, saved unchanged. Exact source is the public resource below with `=w1800-h1000-k-no-pi14.58-ya83.18-ro0-fo45`. Visually checked against the user's screenshot: same curved body, bars, supports and outdoor photograph wall. This replaces the 531 × 185 screenshot in the active gallery. Pixel dimensions are larger, but actual detail remains limited by the source panorama; no sharpening, AI reconstruction or upscaling was applied. No formal museum identification has been established; Roneat is described only as a visual association.
- `khmer-outdoor-instrument-user.png` is the original user screenshot, retained as provenance but no longer used by the point gallery.
- `khmer-instruments-comparison.jpg` is the previously downloaded indoor [Khmer style gong.JPG](https://commons.wikimedia.org/wiki/File:Khmer_style_gong.JPG), 2715 × 1797, **Tonbi ko**, 9 February 2015, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). It is no longer shown for the outdoor point because it depicts different instruments. No room or floor assignment was inferred from this photograph.
- The building point also reuses `facade` and `roof` from `khmerPlacePhotos`, credited to Hoàng Giám / [VietNamNet, 2023](https://vietnamnet.vn/800-hien-vat-tu-lieu-co-truyen-cua-dong-bao-khmer-o-tra-vinh-2203450.html). The [National Museum of History](https://baotanglichsu.vn/VI/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html) provides the architectural reference text.
- The memorial point reuses the tower and Khmer/Vietnamese inscription photographs already in the project. Their source is [Vinh Long Museum, Maha Sơn Thông memorial](https://baotangvinhlong.vn/su-kien-noi-bat/thap-tuong-niem-cu-maha-son-thong-vi-lao-thanh-cach-mang-nguoi-khmer-587169).
- All point images and captions are declared in `src/features/museo-detail/khmerGroundsPoints.ts`. Panorama marker positions are normalized coordinates on the original image and were visually checked against the user's three screenshots; they are not inferred geographic coordinates.

## Ground-floor 360° trial

`khmer-ground-test-360.jpg` is the user's uploaded 1280 × 640 Raya 360 export, copied unchanged. It is a separate trial in the Ground floor tab, not a documented museum room. The shared spherical viewer reads its own title, preview and upload credit, without borrowing the Google Maps attribution. Its low pixel dimensions limit sharpness when zooming; no AI upscaling or image reconstruction was applied.

## Museum grounds panorama supplied on 13 November 2026

- Panorama ID: `CIHM0ogKEICAgIC-1ISKKw`.
- Source: [Google Maps, museum courtyard](https://www.google.com/maps/@?api=1&map_action=pano&pano=CIHM0ogKEICAgIC-1ISKKw&heading=357.14067872652447&pitch=7.739648039236371&fov=90), supplied by the user for the Grounds tab.
- `khmer-grounds-360.jpg`: 8000 × 4000 JPEG, 2:1 spherical panorama. Saved directly from the public image resource embedded in that supplied link, using `=w8000-h4000-k-no`; not an AI reconstruction or screenshot with erased controls.
- `khmer-grounds-360-preview.jpg`: 900 × 600 perspective preview of the same image, using the supplied heading and pitch parameters.
- Public image resource: `https://lh3.googleusercontent.com/gpms-cs-s/AM4Q-U8-zwiEu4VuNHWs4bA4uEZn5pWkL0YE02VNZ2z4QHNM0DjkL0h2LSdrElHqyUCgsoZWBoVtjUAGqSzx1DENWvkdIJOU8LlJl07HpNmh6_cDU3mHuSHk_qCHd0TPKw8KC2Fc0-Md`.
- No photographer identity or capture date was established from the supplied link; do not invent either. The viewer does not embed Google's surrounding UI. The user requested removal of the floating Google Maps link, viewpoint label and previous/next counter from the Grounds panorama; source attribution remains in the point detail and this metadata.

The current page uses the Khmer museum photographs described in `src/features/museo-detail/khmerOverview.ts`, `khmerPlaces.ts`, `khmerHistory.ts` and `khmerCulture.ts`. Those modules retain captions and source links. Headings, navigation, buttons, filters, dialogs and galleries are React components.

### Complex tour: Ang Pagoda and Ao Ba Om (14 November 2026)

The user requested the public VR tour at `https://chuaang.tinhdoanvinhlong.vn/` as the source for a native three-location tour within the existing Complex tab. `khmer-complex-tour/pagoda/` and `khmer-complex-tour/pond/` retain 48 original JPEG tiles (4,279,750 bytes total), from `12_CONG_CHINH_DIEN.tiles` and `6_1_AO_BA_OM.tiles`. Their source scene names are `scene_12_CONG_CHINH_DIEN` and `scene_6_1_AO_BA_OM`.

Each scene has six complete 1024×1024 cube faces, each assembled for rendering from four original 512×512 tiles. The source shorthand `multires="512,1024,2048,…"` starts with tile size; the first image level is 1024 px. Source bytes are unchanged. These are genuine cube panoramas, not synthesized views. `khmer-complex-tour/sources.json` records every original URL, byte count and SHA256. Source attribution: Tour VR360 Chùa Âng / Tỉnh Đoàn Trà Vinh, as displayed by that site. No capture date, individual photographer or permissive license is claimed. The original tour links and credits remain in scene metadata and this asset documentation. At the user?s request, the floating source credit, destination title badge and route buttons are removed from the panorama itself. The existing museum Google Maps panorama is reused for the third capture location.

On 27 October 2026 the unused cave/prehistory demo photographs and its retired gallery code were removed. The overview lookup now imports only its five current images. `rock-texture.jpg` and `evolution-landscape.jpg` remain referenced by the shared stylesheet. The original extraction instructions below describe the older reference workflow; rerunning the full script also recreates retired assets.

Reproduce the extraction on Windows:

```powershell
./scripts/extract-museo-reference.ps1 -ReferenceDirectory 'path/to/reference/directory'
```

The script exports JPEGs at a maximum width of 1600 px. Source plates remain outside the repository. Removed files and hashes are recorded in `docs/cleanup-2026-10-27.json`.

`montserrat-black.ttf` (Montserrat, weight 900) and `space-mono.ttf` (Space Mono, regular) are the source Google Fonts, distributed under their included SIL Open Font License files. The page serves compressed WOFF subsets (63 KB combined) retaining Latin, Vietnamese and punctuation glyphs. The TTF masters are retained for future subsetting and do not ship in the build. Existing Lucide icons are used throughout the UI.

Reproduce font compression with FontTools:

```powershell
python -m fontTools.subset src/assets/museo/montserrat-black.ttf --unicodes=U+0000-024F,U+1E00-1EFF,U+2000-206F --layout-features='*' --flavor=woff --output-file=src/assets/museo/montserrat-black.woff
python -m fontTools.subset src/assets/museo/space-mono.ttf --unicodes=U+0000-024F,U+1E00-1EFF,U+2000-206F --layout-features='*' --flavor=woff --output-file=src/assets/museo/space-mono.woff
```

## Interior panorama route (21 November 2026)

Staircase room names and positions were supplied by the user: 01 Quay về sảnh chính; 02 Phòng trưng bày truyền thống; 03 Phòng trưng bày chuyên đề; 04 Phòng trưng bày ngành nghề truyền thống; 05 Phòng trưng bày tín ngưỡng, tôn giáo; 06 Phòng trưng bày văn hóa nghệ thuật (above 01); 07 Phòng trưng bày văn hóa cuộc sống đời thường. They are numbered independently from the main-hall display cases. Crop viewports reuse the original panorama; the arts-room crop wraps across its left/right seam without editing the source image.

The main hall belongs to the Ground-floor tab. The staircase capture is the default panorama for the Upper-floor tab. Its return-to-hall hotspot navigates back to Ground floor; its room markers keep their independent numbering. Scene transitions update the active tab and route together and preserve expanded mode. The previous reused upper-floor test panorama is no longer the landing scene. Existing upper-floor display records remain available.

User-supplied `sảnh chính.jpg` and `cầu thang.jpg` from `Downloads/drive-download-20261121T082058Z-1-001` are copied unchanged to `khmer-interior-hall-360.jpg` and `khmer-interior-stairs-360.jpg`. Both are 6144 × 3072 equirectangular panoramas. The ground-floor tab opens the main hall, with a navigation hotspot at normalized image position `(0.5, 0.49)` on the visible staircase. It opens the separate staircase capture; a return control restores the hall camera. Fullscreen stays open when changing scenes. These are user-supplied views, without inferred inventories or new exhibit-to-floor assignments. The remaining 14 photographs have not been assigned to floors or added to the route, per the user's clarification. The complex and grounds tabs are unchanged. Browser verification: `tests/khmer-interior-tour-test.cjs`.

## Ba Si Ngo boat photographs (16 November 2026)

`khmer-ba-si-boat-1.jpg`, `khmer-ba-si-boat-2.jpg` and `khmer-ba-si-boat-4.jpg` are unchanged photographs by Huỳnh Như, published by [Vinh Long Museum](https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188). Original files: `https://storage-vnportal.vnpt.vn/vlg-ubnd/3/102SAUTBTT/HUYNHNHU/{1,2,4}.jpg`. They show the actual Pesey Vararam/Ba Si boat, its interior and painted hull. No permissive licence is inferred. Captions and source links remain in `khmerGroundsPoints.ts`. The indoor miniature photograph remains a separate record. Marker 02 uses the position identified by the user in the existing panorama; the memorial and instrument are renumbered 03 and 04.

## Overview story photographs (15 November 2026)

Four documentary photographs were downloaded unchanged from [Vietnam Pictorial's museum photo essay](https://vietnam.vnanet.vn/vietnamese/tin-tuc/noi-bao-ton-van-hoa-dan-toc-khmer-153851.html), published 25 July 2017. Photographs: Nguyễn Luân; text: Sơn Nghĩa. Original watermarks remain. No permissive redistribution licence is claimed.

| Local file | Original source filename | Depiction |
| --- | --- | --- |
| `khmer-overview-crafts-2017.jpg` | `25072017085829740-04_BT-Khmer_resize.jpg` | Loom and traditional craft display |
| `khmer-overview-belief-2017.jpg` | `25072017085830629-08_BT-Khmer_resize.jpg` | Sculpture in the religion and belief display |
| `khmer-overview-carving-2017.jpg` | `25072017085831503-12_BT-Khmer_resize.jpg` | Museum woodcarving |
| `khmer-overview-fishing-2017.jpg` | `25072017085832486-15_BT-Khmer_resize.jpg` | Bamboo fishing trap |

All four original files use the URL prefix `https://imagevietnam.vnanet.vn/Upload/2017/7/25/`. Captions and credits are maintained in `khmerOverviewExhibition.ts`. These photographs illustrate the supplied narration; no unverified inventory identity or floor assignment is inferred. The central overview album selects documentary photographs from the exhibition introduction and five distinctive-story galleries, with duplicate sources removed. It excludes the separate visit-reasons section. Selecting a card opens the matching story at that photograph, including its narration and original source credit.

## Living-heritage reference illustration metadata

- `khmer-culture-user-reference.jpg`: unchanged JPEG supplied by the user on 14 November 2026, originally `1794630140193_182707632726786341_2992410667195687979_4793ba674c990534aa278b0bf366fca1.jpg` on Desktop, 1280 × 720.
- The supplied file is a layout mockup containing interface text and buttons. The native viewer crops only its mask photograph through an SVG viewport at `(330, 72, 550, 455)`, without changing the original file or baking the mockup controls into the application.
- Labelled as a user-supplied illustration in the preview and story gallery. Existing documentary photographs and their attribution remain available in the Robam gallery. No inventory identity, material, age or museum provenance is inferred from the illustration.
# Linked exhibition panoramas

The user assigned these unchanged 6144 × 3072 panoramas from
`C:/Users/ASUS/Downloads/drive-download-20261121T082058Z-1-001`:

| Staircase marker | Original file | Asset | Viewpoint |
| --- | --- | --- | --- |
| 02 · Truyền thống | `hienn vat chien tranh.jpg` | `khmer-traditional-360.jpg` | Single panorama |
| 03 · Chuyên đề | `chén.jpg` | `khmer-thematic-360.jpg` | Single panorama |
| 05 · Tín ngưỡng, tôn giáo | `ghế TP trung tâm.jpg` | `khmer-faith-center-360.jpg` | Center |
| 05 · Tín ngưỡng, tôn giáo | `ghế TP trái.jpg` | `khmer-faith-left-360.jpg` | Left |
| 05 · Tín ngưỡng, tôn giáo | `ghế TP phải.jpg` | `khmer-faith-right-360.jpg` | Right |
| 07 · Văn hóa cuộc sống đời thường | `cuoi trung tam.jpg` | `khmer-daily-center-360.jpg` | Center |
| 07 · Văn hóa cuộc sống đời thường | `cuoi trai.jpg` | `khmer-daily-left-360.jpg` | Left |
| 07 · Văn hóa cuộc sống đời thường | `cuoi phai.jpg` | `khmer-daily-right-360.jpg` | Right |
| 04 · Ngành nghề truyền thống | `nghề trung tâm.jpg` | `khmer-crafts-center-360.jpg` | Center |
| 04 · Ngành nghề truyền thống | `nghề trái.jpg` | `khmer-crafts-left-360.jpg` | Left |
| 04 · Ngành nghề truyền thống | `nghề phải.jpg` | `khmer-crafts-right-360.jpg` | Right |
| 06 · Văn hóa nghệ thuật | `nhạc cụ trung tâm.jpg` | `khmer-arts-center-360.jpg` | Center |
| 06 · Văn hóa nghệ thuật | `nhac cụ trái .jpg` | `khmer-arts-left-360.jpg` | Left |
| 06 · Văn hóa nghệ thuật | `nhạc cụ pphai.jpg` | `khmer-arts-right-360.jpg` | Right |

Markers 02 and 03 each open their single supplied panorama, with a hotspot and
button returning to the staircase. The other room markers enter their center.
Navigation hotspots link the center to the two sides, each side back to the center,
and the center back to the staircase. Each strip contains only that room's supplied viewpoints. Separate scene IDs retain
the correct image on refresh without counting viewpoints as additional rooms.
Existing exhibit records and exterior tours are preserved. Photo credit remains
user-supplied; the room assignment comes from the user's instructions.

The user's navigation clarification retains the original viewpoint assignment:
the center's Right hotspot opens `khmer-crafts-right-360.jpg` with 09–48;
the Left hotspot opens `khmer-crafts-left-360.jpg` with 49–82.
Photo keys, scene labels, thumbnails and crops follow that navigation.
Center has 01–08, with 02 on the freestanding carving and the inserted 03 on
the object in the left glass case. All subsequent exhibit numbers increase by one.

