import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";

// Keep 01–02; former table-and-chairs marker 07 becomes 03.
const positions: [string, number, number, number, number, number][] = [
  ["1", 1, .510, .600, .145, .180],
  ["2", 2, .510, .490, .060, .160],
  ["3", 3, .708, .580, .115, .130],
];

export const khmerDailyCenterPoints: GroundsPoint[] = positions.map(([id, number, u, v, width, height]) => {
  const title = number === 3 ? { vi: "Bộ bàn ghế", en: "Table and chairs" }
    : { vi: `Hiện vật ${String(number).padStart(2, "0")}`, en: `Exhibit ${String(number).padStart(2, "0")}` };
  const caption = { vi: "Góc ảnh từ phòng văn hóa cuộc sống đời thường — trung tâm.", en: "View from the center of the everyday culture exhibition." };
  return {
    id: `daily-center-object-${id}`, number, u, v, title,
    category: { vi: "Văn hóa cuộc sống đời thường", en: "Everyday culture" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.dailyCenter360.src, title, caption,
      credit: khmerPlacePhotos.dailyCenter360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});
