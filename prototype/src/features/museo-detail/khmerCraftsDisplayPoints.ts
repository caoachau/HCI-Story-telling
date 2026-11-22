import { khmerPlacePhotos } from "./khmerPlaces";
import type { GroundsPoint } from "./khmerGroundsPoints";
import { craftTopicExhibit, craftTopicPoints, craftProjectorPoint } from "./khmerCraftTopics";

// Reference numbers 04–43, shifted after the inserted center exhibit 03.
// Coordinates refer to the panorama showing the masks, drums and woven objects.
const positions: [number, number, number, number, number][] = [
  [4, .888, .568, .035, .040],
  [5, .930, .575, .030, .040],
  [6, .972, .580, .032, .040],
  [7, .897, .540, .025, .050],
  [8, .936, .548, .030, .035],
  [9, .977, .547, .025, .050],
  [10, .009, .555, .025, .060],
  [11, .036, .552, .040, .070],
  [12, .010, .625, .025, .040],
  [13, .052, .625, .025, .040],
  [14, .051, .598, .025, .040],
  [15, .031, .528, .025, .050],
  [16, .073, .547, .025, .075],
  [17, .091, .573, .025, .050],
  [18, .099, .526, .030, .080],
  [19, .117, .535, .035, .085],
  [20, .908, .460, .040, .070],
  [21, .970, .460, .045, .070],
  [22, .019, .463, .048, .075],
  [23, .086, .455, .045, .080],
  [24, .480, .566, .045, .085],
  [25, .535, .567, .050, .085],
  [26, .598, .570, .024, .065],
  [27, .616, .570, .024, .070],
  [28, .635, .552, .026, .100],
  [29, .660, .588, .026, .065],
  [30, .684, .578, .028, .090],
  [31, .444, .508, .032, .055],
  [32, .484, .508, .032, .055],
  [33, .444, .448, .032, .055],
  [34, .484, .448, .032, .055],
  [35, .516, .506, .018, .050],
  [36, .538, .506, .018, .050],
  [37, .560, .506, .018, .050],
  [38, .581, .506, .018, .050],
  [39, .516, .452, .020, .050],
  [40, .549, .453, .027, .050],
  [41, .578, .455, .018, .050],
  [42, .625, .463, .034, .060],
  [43, .662, .464, .040, .060],
];

export const khmerCraftsDisplayPoints: GroundsPoint[] = [...positions.map(([reference, u, v, width, height]): GroundsPoint => {
  const number = reference + 5;
  const cropV = ({ 12: .605, 13: .605, 14: .575 } as Record<number, number>)[reference] ?? v;
  const title = { vi: `Hiện vật ${String(number).padStart(2, "0")}`, en: `Exhibit ${String(number).padStart(2, "0")}` };
  const caption = { vi: "Góc ảnh trong phòng ngành nghề truyền thống.", en: "View inside the traditional occupations exhibition." };
  return {
    id: `crafts-display-object-${number}`, number, u, v, title,
    category: { vi: "Ngành nghề truyền thống", en: "Traditional occupations" },
    summary: caption,
    view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
    images: [{ src: khmerPlacePhotos.craftsRight360.src, title, caption,
      credit: khmerPlacePhotos.craftsRight360.author,
      crop: { x: u - width / 2, y: cropV - height / 2, width, height } }],
    observe: { vi: "Quan sát chi tiết trong ảnh trưng bày.", en: "Observe the details in the exhibition photograph." },
    sections: [], sources: [],
  };
}).map(craftTopicExhibit), ...craftTopicPoints.filter(point => point.topicId !== "fabric-weaving" && !point.topicId?.startsWith("wood-")), craftProjectorPoint];
