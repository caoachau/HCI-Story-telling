# MUSEO reference artwork

The JPEG assets are regions extracted from the user-supplied museum reference plates in `Frame 55.png`, `Group 86.png`, `image 106.png` and `image 107.png`. The page uses those regions as photography, map artwork and artifact illustrations; headings, navigation, buttons, filters, dialogs and galleries are React components.

Reproduce the extraction on Windows:

```powershell
./scripts/extract-museo-reference.ps1 -ReferenceDirectory 'path/to/reference/directory'
```

The script retains the originals and exports JPEGs at a maximum width of 1600 px. The 38 illustrations are about 2.6 MB in total and are lazy loaded below the hero. Some source plates contain enlarged low-resolution artwork; those regions retain the supplied image quality.

The 12 `detail-*.jpg` photographs are additional Wikimedia Commons images for the Explore Site galleries. They are downloaded originals or Commons-served thumbnails, without image edits. Full attribution and license links are stored in `src/features/museo-detail/sitePhotoCredits.ts` and shown with the selected photograph. These files are separate from the reference extraction script.

`montserrat-black.ttf` (Montserrat, weight 900) and `space-mono.ttf` (Space Mono, regular) are the source Google Fonts, distributed under their included SIL Open Font License files. The page serves compressed WOFF subsets (63 KB combined) retaining Latin, Vietnamese and punctuation glyphs. The TTF masters are retained for future subsetting and do not ship in the build. Existing Lucide icons are used throughout the UI.

Reproduce font compression with FontTools:

```powershell
python -m fontTools.subset src/assets/museo/montserrat-black.ttf --unicodes=U+0000-024F,U+1E00-1EFF,U+2000-206F --layout-features='*' --flavor=woff --output-file=src/assets/museo/montserrat-black.woff
python -m fontTools.subset src/assets/museo/space-mono.ttf --unicodes=U+0000-024F,U+1E00-1EFF,U+2000-206F --layout-features='*' --flavor=woff --output-file=src/assets/museo/space-mono.woff
```
