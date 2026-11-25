import {
  khmerPlacePhotos,
  type KhmerPlacePhoto,
  type KhmerPlaceZone,
  type PlaceLanguage,
} from "./khmerPlaces";
import { khmerGroundsPoints, type GroundsPoint } from "./khmerGroundsPoints";
import { royalHeaddressesStory } from "./khmerHeaddresses";
import { khmerFaithRightPoints } from "./khmerFaithRightPoints";
import { khmerFaithCenterPoints } from "./khmerFaithCenterPoints";
import { khmerFaithLeftPoints } from "./khmerFaithLeftPoints";
import { khmerCraftsCenterPoints } from "./khmerCraftsCenterPoints";
import { khmerCraftsDisplayPoints } from "./khmerCraftsDisplayPoints";
import { khmerCraftsRightPoints } from "./khmerCraftsRightPoints";
import { khmerArtsCenterPoints } from "./khmerArtsCenterPoints";
import { khmerDailyCenterPoints } from "./khmerDailyCenterPoints";
import { groupRoomPoints } from "./khmerRoomTopics";

export interface DiscoveryObject {
  id: string;
  photo: KhmerPlacePhoto;
  placeId?: string;
  model?: string;
  initialZoomSteps?: number;
  modelPreview?: boolean;
  story?: typeof royalHeaddressesStory;
}
export interface DiscoveryEntry {
  id: string;
  placeId: string;
  cover?: KhmerPlacePhoto;
  photos: KhmerPlacePhoto[];
  objects: DiscoveryObject[];
  title?: Record<PlaceLanguage, string>;
  viewpointTitle?: Record<PlaceLanguage, string>;
  trial?: boolean;
  panorama?: {
    src: string;
    yaw: number;
    pitch: number;
    fov: number;
    preview?: KhmerPlacePhoto;
    points?: GroundsPoint[];
    sceneGroup?: string;
    backEntryId?: string;
    viewpoints?: string[];
  };
  floors?: ("ground" | "upper")[];
}
export interface DiscoveryAerial {
  photo: KhmerPlacePhoto;
  /** Normalized coordinates on the original, uncropped image. Confirm before adding. */
  markers: {
    entryId: string;
    number: number;
    x: number;
    y: number;
    confirmed: true;
  }[];
}
export interface DiscoveryTab {
  id: KhmerPlaceZone;
  entries: DiscoveryEntry[];
  /** Floor landing preview; separate from confirmed display areas and their counts. */
  panoramaEntry?: DiscoveryEntry;
  /** Linked viewpoints inside a room, separate from the floor room list. */
  scenes?: DiscoveryEntry[];
  aerial?: DiscoveryAerial;
}
const entry = (
  id: string,
  cover: KhmerPlacePhoto | undefined,
  photos: KhmerPlacePhoto[] = [],
  objects: DiscoveryObject[] = [],
): DiscoveryEntry => ({ id, placeId: id, cover, photos, objects });
const object = (photo: KhmerPlacePhoto, placeId?: string): DiscoveryObject => ({
  id: photo,
  photo,
  placeId,
});
const stairRoomNames: Record<number, Record<PlaceLanguage, string>> = {
  2: { vi: "Phòng trưng bày truyền thống", en: "Traditional exhibition room" },
  3: { vi: "Phòng trưng bày chuyên đề", en: "Thematic exhibition room" },
  4: { vi: "Phòng trưng bày ngành nghề truyền thống", en: "Traditional occupations exhibition room" },
  5: { vi: "Phòng trưng bày tín ngưỡng, tôn giáo", en: "Belief and religion exhibition room" },
  6: { vi: "Phòng trưng bày văn hóa nghệ thuật", en: "Culture and arts exhibition room" },
  7: { vi: "Phòng trưng bày văn hóa cuộc sống đời thường", en: "Everyday culture exhibition room" },
};
const stairRoom = (number: number, u: number, v: number, crop: { x: number; y: number; width: number; height: number }): GroundsPoint => ({
  id: `stairs-door-${number}`, number, u, v,
  title: stairRoomNames[number],
  category: { vi: "Cầu thang", en: "Staircase" },
  summary: { vi: `Lối vào ${stairRoomNames[number].vi.replace(/^Phòng/, "phòng")}, nhìn từ khu vực cầu thang.`, en: `Entrance to the ${stairRoomNames[number].en.toLowerCase()}, viewed from the staircase.` },
  view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
  images: [{ src: khmerPlacePhotos.interiorStairs360.src, crop, title: stairRoomNames[number], caption: { vi: "Lối vào phòng, nhìn từ khu vực cầu thang.", en: "Room entrance viewed from the staircase." }, credit: khmerPlacePhotos.interiorStairs360.author }],
  observe: { vi: "Quan sát vị trí cửa trong ảnh 360° cầu thang.", en: "Observe the doorway in the staircase panorama." }, sections: [], sources: [],
});
const stairDetail = (number: number, u: number, v: number, title: Record<PlaceLanguage, string>, crop: { x: number; y: number; width: number; height: number }): GroundsPoint => ({
  id: `stairs-detail-${number}`, number, u, v, showNumber: true, title,
  category: { vi: "Chi tiết không gian cầu thang", en: "Staircase spatial detail" },
  summary: { vi: "Vị trí được đánh dấu theo ảnh tham chiếu bạn cung cấp.", en: "Position marked from the supplied reference image." },
  view: { yaw: u * 360, pitch: 90 - v * 180, fov: 70 },
  images: [{ src: khmerPlacePhotos.interiorStairs360.src, crop, title,
    caption: { vi: "Chi tiết lấy từ ảnh 360° cầu thang.", en: "Detail from the staircase panorama." },
    credit: khmerPlacePhotos.interiorStairs360.author }],
  observe: { vi: "Quan sát chi tiết tại vị trí được đánh dấu trong ảnh 360°.", en: "Observe the marked detail in the 360° panorama." },
  sections: [], sources: [],
});
const interiorStairs: DiscoveryEntry = {
  ...entry("interior-stairs", "interiorStairs360", ["interiorStairs360"]),
  placeId: "stairs",
  title: { vi: "Cầu thang", en: "Staircase" },
  trial: true,
  panorama: {
    src: khmerPlacePhotos.interiorStairs360.src, preview: "interiorStairs360", yaw: 180, pitch: -5, fov: 80, sceneGroup: "interior-tour", backEntryId: "interior-hall",
    points: [{
      id: "stairs-to-hall", number: 1, targetEntryId: "interior-hall", showNumber: true,
      title: { vi: "Quay về sảnh chính", en: "Back to main hall" },
      category: { vi: "Chuyển góc nhìn 360°", en: "Move to a 360° viewpoint" },
      summary: khmerPlacePhotos.interiorHall360.caption,
      // The lower hall is behind the camera, across the panorama seam.
      u: 0, v: .57, view: { yaw: 0, pitch: -12.6, fov: 80 },
      images: [{ src: khmerPlacePhotos.interiorHall360.src, title: khmerPlacePhotos.interiorHall360.title, caption: khmerPlacePhotos.interiorHall360.caption, credit: khmerPlacePhotos.interiorHall360.author }],
      observe: { vi: "Chạm để quay về sảnh chính.", en: "Touch to return to the main hall." }, sections: [], sources: [],
    },
      { ...stairRoom(2, .75, .555, { x: .723, y: .513, width: .054, height: .1 }), targetEntryId: "traditional-room", showNumber: true, showInStrip: true },
      { ...stairRoom(3, .25, .555, { x: .223, y: .513, width: .054, height: .1 }), targetEntryId: "thematic-room", showNumber: true, showInStrip: true },
      { ...stairRoom(4, .75, .438, { x: .723, y: .389, width: .054, height: .1 }), targetEntryId: "crafts-center", showNumber: true, showInStrip: true },
      { ...stairRoom(5, .5, .447, { x: .473, y: .399, width: .054, height: .1 }), targetEntryId: "faith-center", showNumber: true, showInStrip: true },
      { ...stairRoom(6, 0, .427, { x: -.027, y: .382, width: .054, height: .11 }), targetEntryId: "arts-center", showNumber: true, showInStrip: true },
      { ...stairRoom(7, .25, .438, { x: .223, y: .389, width: .054, height: .1 }), targetEntryId: "daily-center", showNumber: true, showInStrip: true },
      stairDetail(8, .844, .377, { vi: "Chi tiết mái cầu thang", en: "Staircase roof detail" }, { x: .824, y: .347, width: .04, height: .06 }),
      stairDetail(9, .875, .472, { vi: "Cột cầu thang · góc thứ nhất", en: "Staircase column · first view" }, { x: .855, y: .432, width: .04, height: .08 }),
      stairDetail(10, .125, .472, { vi: "Cột cầu thang · góc thứ hai", en: "Staircase column · second view" }, { x: .105, y: .432, width: .04, height: .08 }),
      stairDetail(11, .375, .472, { vi: "Cột cầu thang · góc thứ ba", en: "Staircase column · third view" }, { x: .355, y: .432, width: .04, height: .08 }),
    ],
  },
};
const hallCabinet = (number: number, u: number, v: number, crop: { x: number; y: number; width: number; height: number }): GroundsPoint => ({
  id: `hall-cabinet-${number}`, number, u, v,
  title: { vi: `Tủ trưng bày ${String(number).padStart(2, "0")}`, en: `Display case ${String(number).padStart(2, "0")}` },
  category: { vi: "Sảnh chính", en: "Main hall" },
  summary: { vi: "Tủ trưng bày được đánh dấu theo vị trí trong ảnh sảnh chính bạn cung cấp.", en: "Display case marked at its position in the supplied main-hall panorama." },
  view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
  images: [{ src: khmerPlacePhotos.interiorHall360.src, crop, title: { vi: `Tủ trưng bày ${number}`, en: `Display case ${number}` }, caption: { vi: "Góc ảnh lấy từ ảnh 360° sảnh chính.", en: "View from the supplied main-hall panorama." }, credit: khmerPlacePhotos.interiorHall360.author }],
  observe: { vi: "Quan sát hiện vật bên trong tủ kính.", en: "Observe the objects inside the glass display." }, sections: [], sources: [],
});
const interiorHall: DiscoveryEntry = {
  ...entry("interior-hall", "interiorHall360", ["interiorHall360"]),
  placeId: "welcome",
  title: { vi: "Sảnh chính", en: "Main hall" },
  trial: true,
  panorama: {
    src: khmerPlacePhotos.interiorHall360.src, preview: "interiorHall360", yaw: 180, pitch: -7, fov: 80, sceneGroup: "interior-tour",
    points: [{
      id: "hall-to-stairs", number: 1, targetEntryId: "interior-stairs", showNumber: true,
      title: { vi: "Đi đến cầu thang", en: "Go to the staircase" },
      category: { vi: "Chuyển góc nhìn 360°", en: "Move to a 360° viewpoint" },
      summary: khmerPlacePhotos.interiorStairs360.caption,
      u: .5, v: .49, view: { yaw: 180, pitch: 1.8, fov: 80 },
      images: [{ src: khmerPlacePhotos.interiorStairs360.src, title: khmerPlacePhotos.interiorStairs360.title, caption: khmerPlacePhotos.interiorStairs360.caption, credit: khmerPlacePhotos.interiorStairs360.author }],
      observe: { vi: "Chạm để đi đến cầu thang.", en: "Touch to go to the staircase." }, sections: [], sources: [],
    },
      hallCabinet(2, .232, .538, { x: .220, y: .485, width: .033, height: .085 }),
      hallCabinet(3, .405, .590, { x: .370, y: .525, width: .065, height: .155 }),
      hallCabinet(4, .593, .590, { x: .563, y: .525, width: .065, height: .155 }),
      hallCabinet(5, .752, .55, { x: .734, y: .493, width: .035, height: .105 }),
    ],
  },
};

const faithViewpoints = ["faith-center", "faith-left", "faith-right"];
const dailyViewpoints = ["daily-center", "daily-left", "daily-right"];
const craftsViewpoints = ["crafts-center", "crafts-left", "crafts-right"];
const artsViewpoints = ["arts-center", "arts-left", "arts-right"];
const interiorRooms = {
  faith: { number: 5, viewpoints: faithViewpoints },
  "daily-life": { number: 7, viewpoints: dailyViewpoints },
  crafts: { number: 4, viewpoints: craftsViewpoints },
  performing: { number: 6, viewpoints: artsViewpoints },
  traditional: { number: 2, viewpoints: ["traditional-room"] },
  thematic: { number: 3, viewpoints: ["thematic-room"] },
};
const interiorLink = (id: string, number: number, targetEntryId: string, photo: KhmerPlacePhoto, title: Record<PlaceLanguage, string>, u: number, v: number): GroundsPoint => ({
  id, number, targetEntryId, title, u, v,
  category: { vi: "Chuyển góc nhìn 360°", en: "Move to a 360° viewpoint" },
  summary: khmerPlacePhotos[photo].caption,
  view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 },
  images: [{ src: khmerPlacePhotos[photo].src, title: khmerPlacePhotos[photo].title, caption: khmerPlacePhotos[photo].caption, credit: khmerPlacePhotos[photo].author }],
  observe: { vi: "Chạm mũi tên để đi đến góc nhìn này.", en: "Touch the arrow to visit this viewpoint." }, sections: [], sources: [],
});
const interiorRoomScene = (room: keyof typeof interiorRooms, id: string, photo: KhmerPlacePhoto, side: Record<PlaceLanguage, string>, backEntryId: string, points: GroundsPoint[]): DiscoveryEntry => ({
  ...entry(id, photo, [photo]), placeId: room, trial: true,
  viewpointTitle: side,
  title: { vi: `${stairRoomNames[interiorRooms[room].number].vi} · ${side.vi}`, en: `${stairRoomNames[interiorRooms[room].number].en} · ${side.en}` },
  panorama: { src: khmerPlacePhotos[photo].src, preview: photo, yaw: id === "crafts-right" ? 194 : 180, pitch: -8, fov: id === "crafts-right" ? 95 : 80, sceneGroup: "interior-tour", backEntryId, viewpoints: interiorRooms[room].viewpoints, points: room === "crafts" ? points : groupRoomPoints(id.startsWith("traditional-") ? "traditional-room" : id.startsWith("thematic-") ? "thematic-room" : id, photo, points) },
});
const traditionalRoom: DiscoveryEntry = {
  ...interiorRoomScene("traditional", "traditional-room", "traditional360", { vi: "Toàn cảnh", en: "Panorama" }, "interior-stairs", [
    interiorLink("traditional-to-stairs", 1, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .60),
  ]),
  title: stairRoomNames[2],
};
const thematicRoom: DiscoveryEntry = {
  ...interiorRoomScene("thematic", "thematic-room", "thematic360", { vi: "Toàn cảnh", en: "Panorama" }, "interior-stairs", [
    interiorLink("thematic-to-stairs", 1, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .60),
  ]),
  title: stairRoomNames[3],
};
const faithScenes: DiscoveryEntry[] = [
  interiorRoomScene("faith", "faith-center", "faithCenter360", { vi: "Trung tâm", en: "Center" }, "interior-stairs", [
    ...khmerFaithCenterPoints,
    interiorLink("faith-center-to-left", 1, "faith-left", "faithLeft360", { vi: "Sang bên trái", en: "Go to the left" }, .36, .62),
    interiorLink("faith-center-to-right", 2, "faith-right", "faithRight360", { vi: "Sang bên phải", en: "Go to the right" }, .64, .62),
    interiorLink("faith-center-to-stairs", 3, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .61),
  ]),
  interiorRoomScene("faith", "faith-left", "faithLeft360", { vi: "Bên trái", en: "Left" }, "faith-center", [
    ...khmerFaithLeftPoints,
    interiorLink("faith-left-to-center", 1, "faith-center", "faithCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .70, .66),
  ]),
  interiorRoomScene("faith", "faith-right", "faithRight360", { vi: "Bên phải", en: "Right" }, "faith-center", [
    ...khmerFaithRightPoints,
    interiorLink("faith-right-to-center", 1, "faith-center", "faithCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .27, .66),
  ]),
];

const dailyScenes: DiscoveryEntry[] = [
  interiorRoomScene("daily-life", "daily-center", "dailyCenter360", { vi: "Trung tâm", en: "Center" }, "interior-stairs", [
    ...khmerDailyCenterPoints,
    interiorLink("daily-center-to-left", 1, "daily-left", "dailyLeft360", { vi: "Sang bên trái", en: "Go to the left" }, .36, .62),
    interiorLink("daily-center-to-right", 2, "daily-right", "dailyRight360", { vi: "Sang bên phải", en: "Go to the right" }, .64, .62),
    interiorLink("daily-center-to-stairs", 3, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .60),
  ]),
  interiorRoomScene("daily-life", "daily-left", "dailyLeft360", { vi: "Bên trái", en: "Left" }, "daily-center", [
    interiorLink("daily-left-to-center", 1, "daily-center", "dailyCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .29, .67),
  ]),
  interiorRoomScene("daily-life", "daily-right", "dailyRight360", { vi: "Bên phải", en: "Right" }, "daily-center", [
    interiorLink("daily-right-to-center", 1, "daily-center", "dailyCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .66, .65),
  ]),
];

const craftsScenes: DiscoveryEntry[] = [
  interiorRoomScene("crafts", "crafts-center", "craftsCenter360", { vi: "Trung tâm", en: "Center" }, "interior-stairs", [
    ...khmerCraftsCenterPoints,
    interiorLink("crafts-center-to-left", 1, "crafts-left", "craftsLeft360", { vi: "Sang bên trái", en: "Go to the left" }, .36, .62),
    interiorLink("crafts-center-to-right", 2, "crafts-right", "craftsRight360", { vi: "Sang bên phải", en: "Go to the right" }, .64, .62),
    interiorLink("crafts-center-to-stairs", 3, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .60),
  ]),
  interiorRoomScene("crafts", "crafts-left", "craftsLeft360", { vi: "Bên trái", en: "Left" }, "crafts-center", [
    ...khmerCraftsRightPoints,
    interiorLink("crafts-left-to-center", 1, "crafts-center", "craftsCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .27, .65),
  ]),
  interiorRoomScene("crafts", "crafts-right", "craftsRight360", { vi: "Bên phải", en: "Right" }, "crafts-center", [
    ...khmerCraftsDisplayPoints,
    interiorLink("crafts-right-to-center", 1, "crafts-center", "craftsCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .27, .64),
  ]),
];

const artsScenes: DiscoveryEntry[] = [
  interiorRoomScene("performing", "arts-center", "artsCenter360", { vi: "Trung tâm", en: "Center" }, "interior-stairs", [
    ...khmerArtsCenterPoints,
    interiorLink("arts-center-to-left", 1, "arts-left", "artsLeft360", { vi: "Sang bên trái", en: "Go to the left" }, .36, .62),
    interiorLink("arts-center-to-right", 2, "arts-right", "artsRight360", { vi: "Sang bên phải", en: "Go to the right" }, .64, .62),
    interiorLink("arts-center-to-stairs", 3, "interior-stairs", "interiorStairs360", { vi: "Quay về cầu thang", en: "Back to the staircase" }, 0, .60),
  ]),
  interiorRoomScene("performing", "arts-left", "artsLeft360", { vi: "Bên trái", en: "Left" }, "arts-center", [
    interiorLink("arts-left-to-center", 1, "arts-center", "artsCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .29, .65),
  ]),
  interiorRoomScene("performing", "arts-right", "artsRight360", { vi: "Bên phải", en: "Right" }, "arts-center", [
    interiorLink("arts-right-to-center", 1, "arts-center", "artsCenter360", { vi: "Về trung tâm phòng", en: "Back to the room center" }, .67, .66),
  ]),
];

/** Curated from existing captions and place records, not gallery proximity.
 * User-supplied aerial and panorama markers use image-relative coordinates. Exterior photos
 * never stand in for rooms. Upper-floor names are existing display topics,
 * not invented room numbers or a measured floor plan.
 */
export const khmerDiscoveryTabs: DiscoveryTab[] = [
  {
    id: "landscape",
    entries: [
      { ...entry("entrance", "facade"), floors: ["ground", "upper"] },
      entry("pagoda", "pagoda"),
      entry("pond", "pond"),
    ],
    aerial: {
      photo: "complexAerial",
      markers: [
        { entryId: "entrance", number: 1, x: .709, y: .607, confirmed: true },
        { entryId: "pagoda", number: 2, x: .350, y: .644, confirmed: true },
        { entryId: "pond", number: 3, x: .517, y: .185, confirmed: true },
      ],
    },
  },
  {
    id: "grounds",
    entries: [
      {
        ...entry("courtyard-360", "grounds360", ["grounds360"]),
        placeId: "entrance",
        panorama: {
          src: new URL(
            "../../assets/museo/khmer-grounds-360.jpg",
            import.meta.url,
          ).href,
          // Yaw is a texture-space angle, not a claimed geographical bearing.
          yaw: khmerGroundsPoints[0].view.yaw,
          pitch: khmerGroundsPoints[0].view.pitch,
          fov: 75,
          points: khmerGroundsPoints,
        },
      },
    ],
  },
  {
    id: "ground",
    panoramaEntry: interiorHall,
    entries: [
      interiorHall,
    ],
  },
  {
    id: "upper",
    panoramaEntry: interiorStairs,
    scenes: [...faithScenes, ...dailyScenes, ...craftsScenes, ...artsScenes],
    entries: [
      traditionalRoom,
      thematicRoom,
      entry(
        "faith",
        "exhibition",
        ["exhibition"],
        [object("chair", "chair"), object("buddha"), object("temple")],
      ),
      entry("archaeology", "sandstone", [], [{
        ...object("sandstone"),
        model: new URL("../../assets/museo/khmer-sandstone.glb", import.meta.url).href,
        initialZoomSteps: 3,
      }]),
      entry("manuscripts", undefined),
      entry(
        "daily-life",
        "kitchen",
        ["kitchen", "village"],
        [
          object("kitchen"),
          object("farm"),
          object("fishing"),
          object("clothing"),
        ],
      ),
      entry(
        "crafts",
        "fishing",
        [],
        [object("fishing"), object("farm"), object("clothing")],
      ),
      entry(
        "performing",
        "ensemble",
        ["ensemble", "drum"],
        [object("ensemble"), object("drum"), object("duke"), object("mask"), {
          ...object("royalHeaddresses"),
          model: new URL("../../assets/museo/khmer-royal-headdresses.glb", import.meta.url).href,
          modelPreview: true,
          story: royalHeaddressesStory,
        }],
      ),
    ],
  },
];

export const discoveryTabEntries = (tab: DiscoveryTab): DiscoveryEntry[] =>
  [...new Map([...(tab.panoramaEntry ? [tab.panoramaEntry] : []), ...tab.entries, ...(tab.scenes ?? [])].map(item => [item.id, item])).values()];

export function discoveryEntryForPlace(
  placeId: string,
  preferred?: KhmerPlaceZone,
) {
  const tabs = [...khmerDiscoveryTabs].sort(
    (a, b) => Number(b.id === preferred) - Number(a.id === preferred),
  );
  for (const tab of tabs) {
    if (tab.panoramaEntry?.panorama?.sceneGroup && tab.panoramaEntry.placeId === placeId)
      return { tab, entry: tab.panoramaEntry };
    const item = tab.entries.find(
      (item) =>
        ((!item.trial || !!item.panorama?.sceneGroup) && item.placeId === placeId) ||
        item.objects.some((object) => object.placeId === placeId),
    );
    if (item) return { tab, entry: item };
  }
  return {
    tab: khmerDiscoveryTabs[0],
    entry: khmerDiscoveryTabs[0].entries[0],
  };
}
export const discoveryPhoto = (key?: KhmerPlacePhoto) =>
  key ? khmerPlacePhotos[key] : undefined;

export const hasKhmerDiscoveryEntry = (placeId: string) =>
  khmerDiscoveryTabs.some((tab) =>
    tab.panoramaEntry?.placeId === placeId || tab.entries.some(
      (item) =>
        item.placeId === placeId ||
        item.objects.some((object) => object.placeId === placeId),
    ),
  );
