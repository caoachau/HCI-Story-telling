import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";

// User's center-view references: stage 01, ensemble 02, annotated 03–09,
// The opposite-wall references continue through 27; the mask group is 28.
const positions: [number, number, number, number, number][] = [
  [1, .495, .490, .150, .170],
  [2, .500, .650, .230, .260],
  [3, .618, .530, .038, .130],
  [4, .584, .456, .035, .060],
  [5, .632, .472, .030, .060],
  [6, .671, .500, .065, .135],
  [7, .714, .529, .035, .130],
  [8, .790, .505, .065, .110],
  [9, .763, .595, .080, .170],
  [19, .092, .583, .120, .105],
  [11, .166, .530, .060, .080],
  [12, .196, .517, .035, .085],
  [13, .080, .496, .025, .055],
  [14, .077, .391, .070, .105],
  [15, .140, .417, .040, .075],
  [16, .165, .429, .030, .065],
  [17, .183, .440, .023, .055],
  [18, .272, .525, .040, .130],
  [10, .300, .546, .035, .040],
  [20, .334, .546, .025, .040],
  [21, .289, .510, .018, .060],
  [22, .303, .526, .018, .035],
  [23, .304, .493, .018, .045],
  [24, .320, .516, .018, .045],
  [25, .335, .510, .018, .055],
  [26, .315, .464, .035, .050],
  [27, .364, .535, .045, .150],
  [28, .867, .555, .095, .120],
];

export const khmerArtsCenterPoints: GroundsPoint[] = [...positions].sort((a, b) => a[0] - b[0]).map(([number, u, v, width, height]) => {
  const title = number === 1 ? { vi: "Sân khấu", en: "Stage" }
    : number === 2 ? { vi: "Cụm nhạc cụ", en: "Musical instruments" }
    : number === 28 ? { vi: "Ba mặt nạ", en: "Three masks" }
    : { vi: `Hiện vật ${String(number).padStart(2, "0")}`, en: `Exhibit ${String(number).padStart(2, "0")}` };
  const caption = { vi: "Góc ảnh từ phòng văn hóa nghệ thuật — trung tâm.", en: "View from the center of the culture and arts room." };
  return {
    id: `arts-center-object-${number}`, number, u, v, title,
    category: { vi: "Văn hóa nghệ thuật", en: "Culture and arts" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.artsCenter360.src, title, caption,
      credit: khmerPlacePhotos.artsCenter360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});
