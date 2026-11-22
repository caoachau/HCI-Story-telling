import type { KhmerPlacePhoto } from "./khmerPlaces";

const tiles = import.meta.glob("../../assets/museo/khmer-complex-tour/*/*.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export interface ComplexTourScene {
  id: string;
  preview: KhmerPlacePhoto;
  view: { yaw: number; pitch: number; fov: number };
  source: string;
  credit: string;
  image: { kind: "sphere"; src: string } | { kind: "cube"; faces: string[][] };
}

function cube(id: string): ComplexTourScene["image"] {
  // Three.js cube face order: +X, -X, +Y, -Y, +Z, -Z.
  // Tiles retain their original row/column order; no perspective photos are stretched.
  return { kind: "cube", faces: ["r", "l", "u", "d", "f", "b"].map(face =>
    [1, 2].flatMap(row => [1, 2].map(col => tiles[`../../assets/museo/khmer-complex-tour/${id}/${face}-${row}-${col}.jpg`])),
  ) };
}

export const khmerComplexScenes: ComplexTourScene[] = [
  {
    id: "entrance", preview: "grounds360", view: { yaw: 180, pitch: 7.739648039236371, fov: 75 },
    source: "https://www.google.com/maps/?q=9.9161668,106.3049936",
    credit: "Google Maps · Ảnh 360° do người dùng cung cấp",
    image: { kind: "sphere", src: new URL("../../assets/museo/khmer-grounds-360.jpg", import.meta.url).href },
  },
  {
    id: "pagoda", preview: "pagoda", view: { yaw: 112.817, pitch: -3.472, fov: 85 },
    source: "https://chuaang.tinhdoanvinhlong.vn/?startscene=scene_12_CONG_CHINH_DIEN",
    credit: "Tour VR360 Chùa Âng · Tỉnh Đoàn Trà Vinh",
    image: cube("pagoda"),
  },
  {
    id: "pond", preview: "pond", view: { yaw: 99.406, pitch: 3.618, fov: 85 },
    source: "https://chuaang.tinhdoanvinhlong.vn/?startscene=scene_6_1_AO_BA_OM",
    credit: "Tour VR360 Chùa Âng · Tỉnh Đoàn Trà Vinh",
    image: cube("pond"),
  },
];
