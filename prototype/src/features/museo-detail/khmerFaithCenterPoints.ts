import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";

const positions: [number, string, string, number, number, number, number][] = [
  [1, "Ghế", "Chair", .504, .565, .092, .22],
  [2, "Nền xanh", "Blue backdrop", .480, .450, .115, .11],
  [3, "Chùa", "Pagoda", .645, .520, .058, .12],
];

export const khmerFaithCenterPoints: GroundsPoint[] = positions.map(([number, vi, en, u, v, width, height]) => {
  const title = { vi, en };
  const caption = { vi: "Góc ảnh từ phòng tín ngưỡng, tôn giáo — trung tâm.", en: "View from the center of the belief and religion room." };
  return {
    id: `faith-center-object-${number}`, number, u, v, title,
    category: { vi: "Tín ngưỡng, tôn giáo", en: "Belief and religion" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.faithCenter360.src, title, caption,
      credit: khmerPlacePhotos.faithCenter360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});
