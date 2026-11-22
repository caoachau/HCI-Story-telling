import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";

// Positions on the unchanged panorama, following the user's numbered reference.
// The display case wraps across the left/right image seam.
const positions: [number, number, number, number, number][] = [
  [1, .900, .646, .035, .15],
  [2, .961, .615, .035, .23],
  [3, .028, .634, .052, .055],
  [4, .080, .623, .060, .055],
  [5, .016, .568, .020, .065],
  [6, .047, .594, .022, .034],
  [7, .043, .524, .023, .095],
  [8, .065, .567, .018, .060],
  [9, .115, .558, .050, .17],
  [10, .139, .604, .030, .075],
  [11, .901, .460, .057, .25],
  [12, .969, .396, .060, .105],
  [13, .094, .414, .052, .105],
  [14, .132, .470, .038, .235],
  [15, .482, .600, .120, .32],
];

export const khmerFaithRightPoints: GroundsPoint[] = positions.map(([originalNumber, u, v, width, height]) => {
  const number = originalNumber + 3;
  const title = number === 18
    ? { vi: "Con ngựa · 18", en: "Horse · 18" }
    : { vi: `Hiện vật ${String(number).padStart(2, "0")}`, en: `Exhibit ${String(number).padStart(2, "0")}` };
  const caption = { vi: "Góc ảnh từ phòng tín ngưỡng, tôn giáo — bên phải.", en: "View from the right side of the belief and religion room." };
  return {
    id: `faith-right-object-${originalNumber}`, number, u, v, title,
    category: { vi: "Tín ngưỡng, tôn giáo", en: "Belief and religion" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.faithRight360.src, title, caption,
      credit: khmerPlacePhotos.faithRight360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});
