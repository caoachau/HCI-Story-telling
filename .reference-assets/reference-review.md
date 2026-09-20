# Visual reference review

Read-only review of the user's supplied screenshots and recordings. No application edits.

## Trustworthy analysis artifacts

- `image-reference-sheet.jpg`: the nine supplied PNG screenshots.
- `video-0-sheet.jpg`: MP4 frames; timestamps valid (9.0 second Cồn Chim flight).
- `video-1-verified-sheet.jpg`: TOÀN CẢNH.webm, sequentially decoded using actual presentation timestamps; duration 54.575 seconds.
- `video-2-verified-sheet.jpg`: VID ĐỊA ĐIỂM +360 TẠI CHỔ.webm, sequentially decoded; duration 190.885 seconds.
- `ao-flight-verified-sheet.jpg`: Ao Bà Om arrival at half-second intervals.
- `ao-flight-144.0s.jpg` through `ao-flight-152.0s.jpg`: original full-resolution decoded frames. Names indicate requested sample time; actual time is the first available frame at/after that point (150.5s sample is 150.968s because timestamps have a gap).

Earlier `video-1-sheet.jpg`, `video-2-sheet.jpg`, `video-2b-sheet.jpg`, and `video-local-fly-sheet.jpg` were generated with OpenCV seeking. Their WebM timestamp labels are unreliable and must not be cited. These recorder WebMs have no usable frame-count/duration metadata, and OpenCV seek silently resets/advances unexpectedly. The verified sheets replace them.

## Exact useful sequence

In VID ĐỊA ĐIỂM +360 TẠI CHỔ.webm:

- 146.022s: selected Ao Bà Om; province overview remains visible.
- 146.533s: camera pans inward, rivers and coastline move toward frame edges.
- 147.012s: regional/city scale.
- 147.523s: neighborhood scale, surrounding street/building texture resolves.
- 148.000s: square pond and all local surroundings visible together. Chùa Âng appears below/southwest of the pond and the museum below/southeast in this view. This is a useful geography reference, but imagery is still loading and pixelated.
- 148.512s: pond takes much of frame, temple moves to lower edge.
- 149.026–152.028s: stable close aerial of pond, dense tree border, eastern approach road and lawns.

All sampled video frames contain browser chrome, Google controls, a top-right place card and yellow default pins. None is a fully clean background. The supplied Ao PNG is sharper and cleaner than the movie's destination frame.

## Recommendation

Use the original 2D overview's real river, coast, road and city geography as the base; anchor custom cultural markers to the source pin positions. Use the supplied local Ao screenshot for final detail, and the video sequence above to guide camera pace and progressive detail. Treat screenshot geography as fixed; do not generate new roads, buildings, shorelines or lake shape.

A literal 2.8x enlargement of the whole-province screenshot cannot reach pond-level detail: the footage crosses several map scales. For a true geographic continuous camera, register intermediate/local image layers in one coordinate world and use a much larger physical world zoom, with custom markers held at their intended visual sizes. If retaining the suggested 2.8x camera range, the honest destination is a closer regional map with an Ao detail treatment, not a geographically scaled pond covering the screen.

Use the original supplied photos/frames as evidence; avoid embedding the recording wholesale because its browser chrome, stock controls, immediate top-right tourist card and imagery-loading blocks conflict with the requested UI. Keep the popup timing independent from reference video behavior: the user's requested popup begins only after the camera settles.
