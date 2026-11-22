import type { GroundsPoint } from "./khmerGroundsPoints";
import { khmerPlacePhotos } from "./khmerPlaces";

export const craftTopicAreas = {
  "center-weaving": { yaw: 180, pitch: -8, fov: 80 },
  "main-display": { yaw: 194, pitch: -8, fov: 95 },
  "right-cabinet": { yaw: 4, pitch: -4, fov: 95 },
  "wood-carving": { yaw: 244, pitch: -6, fov: 105 },
} as const;

export type CraftTopicAreaId = keyof typeof craftTopicAreas;

type CraftTopic = {
  id: string;
  areaId: CraftTopicAreaId;
  parentId?: string;
  title: { vi: string; en: string };
  numbers: readonly number[];
  u: number;
  v: number;
  view?: { yaw: number; pitch: number; fov: number };
};

export const craftTopics: readonly CraftTopic[] = [
  { id: "fabric-weaving", areaId: "center-weaving", title: { vi: "Nghề dệt vải", en: "Fabric weaving" }, numbers: [1, 3, 4, 5, 6, 7, 8], u: .501, v: .555 },
  { id: "mat-weaving", areaId: "main-display", title: { vi: "Nghề dệt chiếu", en: "Mat weaving" }, numbers: [29, 30, 36, 37, 38, 39], u: .475, v: .535 },
  { id: "glass-painting", areaId: "main-display", title: { vi: "Nghề vẽ tranh trên kiếng", en: "Glass painting" }, numbers: [40, 41, 42, 43, 44, 45, 46], u: .550, v: .480 },
  { id: "basketry", areaId: "main-display", title: { vi: "Nghề đan lát", en: "Basketry" }, numbers: [31, 32, 33, 34, 47, 48, 9, 10, 12, 13, 25], u: .635, v: .530 },
  { id: "drum-making", areaId: "right-cabinet", title: { vi: "Nghề làm trống", en: "Drum making" }, numbers: [11, 14, 26], u: .970, v: .515 },
  { id: "palm-leaf-painting", areaId: "right-cabinet", title: { vi: "Nghề vẽ tranh trên lá buông", en: "Palm-leaf painting" }, numbers: [15, 16, 17, 18, 19, 20, 27], u: .018, v: .515 },
  { id: "crown-mask-making", areaId: "right-cabinet", title: { vi: "Nghề làm mão, mặt nạ", en: "Crown and mask making" }, numbers: [21, 22, 23, 24, 28], u: .096, v: .515 },
  { id: "wood-carving", areaId: "wood-carving", title: { vi: "Nghề chạm khắc gỗ", en: "Woodcarving" }, numbers: [], u: .555, v: .555, view: { yaw: 244, pitch: -6, fov: 105 } },
  { id: "wood-display-case", areaId: "wood-carving", parentId: "wood-carving", title: { vi: "Tủ trưng bày hiện vật chạm khắc gỗ", en: "Woodcarving display case" }, numbers: [], u: .500, v: .555, view: { yaw: 180, pitch: -7, fov: 78 } },
  { id: "wood-artworks", areaId: "wood-carving", parentId: "wood-carving", title: { vi: "Tác phẩm chạm khắc gỗ", en: "Woodcarving artworks" }, numbers: [], u: .855, v: .555, view: { yaw: 308, pitch: -7, fov: 82 } },
  { id: "wood-case-left", areaId: "wood-carving", parentId: "wood-display-case", title: { vi: "Hiện vật khu vực bên trái", en: "Left display exhibits" }, numbers: [49, 50, 51, 52, 53, 54, 55, 56, 71], u: .410, v: .550, view: { yaw: 148, pitch: -7, fov: 62 } },
  { id: "wood-case-center", areaId: "wood-carving", parentId: "wood-display-case", title: { vi: "Hiện vật khu vực trung tâm", en: "Center display exhibits" }, numbers: [57, 58, 59, 60, 61, 62, 63, 72], u: .515, v: .550, view: { yaw: 185, pitch: -7, fov: 62 } },
  { id: "wood-case-right", areaId: "wood-carving", parentId: "wood-display-case", title: { vi: "Hiện vật khu vực bên phải", en: "Right display exhibits" }, numbers: [64, 65, 66, 67, 68, 69, 70, 73, 74], u: .615, v: .550, view: { yaw: 221, pitch: -7, fov: 62 } },
  { id: "wood-artworks-left", areaId: "wood-carving", parentId: "wood-artworks", title: { vi: "Các hiện vật chạm khắc bên trái", en: "Left carved exhibits" }, numbers: [75, 76, 77, 78, 79], u: .825, v: .545, view: { yaw: 297, pitch: -7, fov: 62 } },
  { id: "wood-artworks-center", areaId: "wood-carving", parentId: "wood-artworks", title: { vi: "Tác phẩm chạm khắc trung tâm", en: "Central carved artwork" }, numbers: [80, 81, 82], u: .930, v: .545, view: { yaw: 335, pitch: -20, fov: 85 } },
];

const names: Record<number, [string, string]> = {
  29: ["Guồng quay sợi", "Spinning wheel"], 30: ["Chiếu dệt", "Woven mat"],
  31: ["Dụng cụ đan lát", "Woven implement"], 32: ["Vật dụng đan hình nón", "Conical woven object"],
  33: ["Đồ chứa lúa", "Rice container"], 34: ["Vật dụng đan hình hộp", "Box-shaped woven object"],
  36: ["Ảnh tư liệu dệt chiếu", "Mat-weaving photograph"], 37: ["Ảnh tư liệu thao tác dệt", "Weaving process photograph"],
  38: ["Ảnh tư liệu nguyên liệu dệt chiếu", "Mat-weaving materials photograph"], 39: ["Ảnh tư liệu nghề dệt chiếu", "Mat-weaving craft photograph"],
  40: ["Tranh trên kiếng · tác phẩm thứ nhất", "Glass painting · first work"],
  41: ["Tranh trên kiếng · tác phẩm thứ hai", "Glass painting · second work"],
  42: ["Tranh trên kiếng · tác phẩm thứ ba", "Glass painting · third work"],
  43: ["Tranh trên kiếng · tác phẩm thứ tư", "Glass painting · fourth work"],
  44: ["Ảnh tư liệu vẽ tranh trên kiếng", "Glass-painting photograph"],
  45: ["Ảnh tư liệu nghệ nhân vẽ tranh", "Painting artisan photograph"],
  46: ["Ảnh tư liệu thực hành vẽ tranh", "Painting process photograph"],
  47: ["Ảnh tư liệu nghề đan lát", "Basketry photograph"], 48: ["Ảnh tư liệu nghệ nhân đan lát", "Basketry artisan photograph"],
};
export function craftTopicExhibit(point: GroundsPoint): GroundsPoint {
  const topic = craftTopics.find(item => item.numbers.includes(point.number!));
  if (!topic) return point;
  const name = names[point.number!];
  const isCabinetPhotograph = point.number != null && point.number >= 25 && point.number <= 28;
  const title = name
    ? { vi: name[0], en: name[1] }
    : isCabinetPhotograph
      ? { vi: `Tư liệu hình ảnh ${point.number}`, en: `Photographic documentation ${point.number}` }
      : point.title;
  return { ...point, topicId: topic.id, markerKind: "exhibit", title, category: topic.title,
    images: point.images.map(image => ({ ...image, title })) };
}
export const craftTopicPoints: GroundsPoint[] = craftTopics.map(topic => ({
  id: `topic-${topic.id}`, topicId: topic.id, markerKind: "topic", title: topic.title, category: topic.title,
  u: topic.u, v: topic.v, view: topic.view ?? (topic.id === "basketry"
    ? { yaw: 282, pitch: -7, fov: 90 }
    : { yaw: topic.u * 360, pitch: 90 - topic.v * 180, fov: 65 }),
  summary: { vi: "Chọn hiện vật để khám phá câu chuyện của nghề.", en: "Choose an exhibit to explore this craft." },
  images: [], observe: { vi: "", en: "" }, sections: [], sources: [],
}));
export const craftProjectorPoint: GroundsPoint = {
  id: "hotspot_projector_weaving", topicId: "mat-weaving", markerKind: "exhibit",
  title: { vi: "Thiết bị trình chiếu – Nghề dệt chiếu", en: "Presentation equipment – Mat weaving" },
  category: craftTopics[0].title, u: .450, v: .690,
  view: { yaw: .450 * 360, pitch: 90 - .690 * 180, fov: 65 },
  summary: { vi: "Thiết bị phía dưới khu vực trưng bày nghề dệt chiếu, theo ảnh tham chiếu bạn cung cấp.", en: "Equipment beneath the mat-weaving display, identified from the supplied reference." },
  images: [{ src: khmerPlacePhotos.craftsRight360.src,
    title: { vi: "Thiết bị tại khu dệt chiếu", en: "Equipment in the weaving area" },
    caption: { vi: "Ảnh cắt từ panorama gốc.", en: "Detail from the original panorama." },
    credit: khmerPlacePhotos.craftsRight360.author, crop: { x: .32, y: .58, width: .22, height: .25 } }],
  observe: { vi: "Quan sát thiết bị và khung dệt trong ảnh gốc.", en: "Observe the equipment and loom in the original photograph." },
  sections: [], sources: [],
};
