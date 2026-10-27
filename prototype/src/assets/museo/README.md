# MUSEO reference artwork

The current page uses the Khmer museum photographs described in `src/features/museo-detail/khmerOverview.ts`, `khmerPlaces.ts`, `khmerHistory.ts` and `khmerCulture.ts`. Those modules retain captions and source links. Headings, navigation, buttons, filters, dialogs and galleries are React components.

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
