import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";

// User-confirmed continuation after the horse (18); source-image coordinates.
// The first display case crosses the panorama seam.
const positions: [number, number, number, number, number][] = [
  [19, .912, .516, .030, .11],
  [20, .947, .568, .042, .050],
  [21, .991, .576, .025, .045],
  [22, .022, .551, .036, .055],
  [23, .056, .510, .026, .11],
  [24, .944, .431, .035, .080],
  [25, .021, .431, .045, .080],
  [26, .310, .575, .045, .070],
  [27, .375, .552, .065, .090],
  [28, .296, .443, .045, .075],
  [29, .346, .445, .035, .070],
  [30, .426, .443, .042, .080],
  [31, .466, .485, .035, .055],
  [32, .507, .493, .037, .050],
  [33, .552, .483, .030, .055],
  [34, .466, .401, .035, .065],
  [35, .552, .401, .030, .065],
];

export const khmerFaithLeftPoints: GroundsPoint[] = positions.map(([number, u, v, width, height]) => {
  const title = { vi: `Hiện vật ${number}`, en: `Exhibit ${number}` };
  const caption = { vi: "Góc ảnh từ phòng tín ngưỡng, tôn giáo — bên trái.", en: "View from the left side of the belief and religion room." };
  return {
    id: `faith-left-object-${number}`, number, u, v, title,
    category: { vi: "Tín ngưỡng, tôn giáo", en: "Belief and religion" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.faithLeft360.src, title, caption,
      credit: khmerPlacePhotos.faithLeft360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});
