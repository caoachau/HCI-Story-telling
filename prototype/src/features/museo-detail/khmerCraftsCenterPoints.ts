import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";
import { craftTopicExhibit, craftTopicPoints } from "./khmerCraftTopics";

// User annotations, with exhibit 02 corrected to the freestanding carved figure.
const positions: [number, number, number, number, number][] = [
  [1, .501, .650, .150, .200],
  [2, .277, .555, .042, .135],
  [3, .437, .535, .030, .085],
  [4, .565, .556, .030, .050],
  [5, .437, .500, .030, .080],
  [6, .501, .535, .085, .085],
  [7, .501, .462, .075, .070],
  [8, .565, .507, .030, .080],
];

const centerPoints: GroundsPoint[] = positions.map(([number, u, v, width, height]) => {
  const title = { vi: `Hiện vật ${String(number).padStart(2, "0")}`, en: `Exhibit ${String(number).padStart(2, "0")}` };
  const caption = { vi: "Góc ảnh từ phòng ngành nghề truyền thống — trung tâm.", en: "View from the center of the traditional occupations room." };
  return {
    id: `crafts-center-object-${number}`, number, u, v, title,
    category: { vi: "Ngành nghề truyền thống", en: "Traditional occupations" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.craftsCenter360.src, title, caption,
      credit: khmerPlacePhotos.craftsCenter360.author,
      crop: { x: u - width / 2, y: v - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});

export const khmerCraftsCenterPoints: GroundsPoint[] = [
  ...centerPoints.map(craftTopicExhibit),
  ...craftTopicPoints.filter(point => point.topicId === "fabric-weaving"),
];
