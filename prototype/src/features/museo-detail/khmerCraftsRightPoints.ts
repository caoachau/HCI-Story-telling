import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";
import { craftTopicExhibit, craftTopicPoints } from "./khmerCraftTopics";

// Woodcarving display (49–82) reached through the left hotspot from the center.
const positions: [number, number, number, number, number][] = [
  [48, .369, .575, .020, .050],
  [49, .376, .612, .025, .030],
  [50, .400, .612, .025, .030],
  [51, .426, .612, .025, .030],
  [52, .385, .561, .025, .035],
  [53, .405, .573, .025, .030],
  [54, .432, .566, .025, .035],
  [55, .412, .530, .060, .050],
  [56, .450, .546, .025, .065],
  [57, .493, .577, .020, .035],
  [58, .565, .585, .025, .055],
  [59, .476, .535, .025, .075],
  [60, .501, .520, .035, .100],
  [61, .530, .533, .025, .075],
  [62, .553, .537, .025, .070],
  [63, .597, .610, .030, .040],
  [64, .597, .529, .020, .080],
  [65, .643, .610, .022, .050],
  [66, .584, .567, .025, .030],
  [67, .612, .550, .020, .065],
  [68, .620, .610, .020, .040],
  [69, .635, .546, .025, .035],
  [70, .410, .465, .045, .070],
  [71, .503, .448, .035, .090],
  [72, .593, .495, .075, .050],
  [73, .593, .433, .055, .070],
  [74, .810, .560, .025, .110],
  [75, .834, .510, .030, .180],
  [76, .870, .550, .025, .100],
  [77, .796, .463, .030, .100],
  [78, .868, .477, .025, .100],
  [79, .956, .595, .120, .045],
  [80, .900, .550, .030, .100],
  [81, .956, .500, .100, .220],
];

const woodcarvingPoints: GroundsPoint[] = positions.map(([reference, u, v, width, height]) => {
  const number = reference + 1;
  // Place crowded front-row labels below the objects while keeping their crops centered.
  const cropV = ({ 49: .589, 50: .590, 51: .595, 58: .557, 63: .581, 64: .548, 65: .580, 68: .582 } as Record<number, number>)[reference] ?? v;
  const title = { vi: `Hiện vật ${number}`, en: `Exhibit ${number}` };
  const caption = { vi: "Góc ảnh từ phòng ngành nghề truyền thống — bên trái.", en: "View from the left side of the traditional occupations room." };
  return {
    id: `crafts-right-object-${number}`, number, u, v, title,
    category: { vi: "Ngành nghề truyền thống", en: "Traditional occupations" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.craftsLeft360.src, title, caption,
      credit: khmerPlacePhotos.craftsLeft360.author,
      crop: { x: u - width / 2, y: cropV - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
});

const zodiacPoint: GroundsPoint = {
  id: "hotspot_zodiac_woodcarving",
  topicId: "wood-artworks-center",
  markerKind: "exhibit",
  title: { vi: "Tượng 12 con giáp", en: "Twelve zodiac statues" },
  category: { vi: "Nghề chạm khắc gỗ", en: "Woodcarving" },
  summary: { vi: "Cụm tượng đặt sát chân camera trong khu vực trưng bày tác phẩm chạm khắc gỗ.", en: "The statue group positioned near the camera in the woodcarving artwork area." },
  u: .900,
  v: .780,
  view: { yaw: 324, pitch: -50, fov: 72 },
  images: [{
    src: khmerPlacePhotos.craftsLeft360.src,
    title: { vi: "Tượng 12 con giáp", en: "Twelve zodiac statues" },
    caption: { vi: "Chi tiết tại vị trí đặt camera trong panorama gốc.", en: "Detail beside the camera position in the original panorama." },
    credit: khmerPlacePhotos.craftsLeft360.author,
    crop: { x: .705, y: .700, width: .200, height: .190 },
  }],
  observe: { vi: "Quan sát cụm tượng ở phần sàn ngay sát vị trí đặt camera.", en: "Observe the statue group on the floor beside the camera position." },
  sections: [],
  sources: [],
};

export const khmerCraftsRightPoints: GroundsPoint[] = [
  ...woodcarvingPoints.map(craftTopicExhibit),
  ...craftTopicPoints.filter(point => point.topicId?.startsWith("wood-")),
  zodiacPoint,
];
