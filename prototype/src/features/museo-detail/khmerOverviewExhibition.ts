import { artwork } from "./data";
import { KHMER_MUSEUM_NAME } from "../../data/museumIdentity";
import { khmerHistoryPhotos } from "./khmerHistory";
import type { OverviewNarrationTopic } from "./khmerOverviewNarration";
import {
  khmerOverview,
  khmerOverviewGallery,
  khmerOverviewPhotoCredits,
  khmerOverviewSources,
  type KhmerOverviewTopic,
} from "./khmerOverview";

export type OverviewLanguage = "vi" | "en";
type Copy = Record<OverviewLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const overviewViewerLeads: Partial<Record<KhmerOverviewTopic, Copy>> = {
  introduction: t(
    "Một nơi lưu giữ hiện vật, câu chuyện và ký ức văn hóa của cộng đồng Khmer Nam Bộ giữa không gian Ao Bà Om.",
    "A home for Southern Khmer objects, stories and cultural memory within the Ba Om landscape.",
  ),
  collections: t(
    "Một hành trình nghe liền mạch: từ ký ức của cộng đồng đến những con số và bốn chủ đề trưng bày của bảo tàng.",
    "Explore Khmer culture through four connected themes: belief, everyday life, crafts and the performing arts.",
  ),
  dailyLife: t("Một gian bếp, chiếc nôm tre hay khung dệt đều kể về cách người Khmer sống, lao động và gắn bó với gia đình.", "A kitchen, bamboo trap or loom tells how Khmer people live, work and sustain family ties."),
  spiritual: t("Từ tượng Phật và ghế thuyết pháp đến tín ngưỡng Néak Tà, tìm hiểu những lớp ý nghĩa gắn với mái chùa Khmer.", "Explore the pagoda's layered meanings through Buddha images, a preaching chair and Neak Ta beliefs."),
  visit: t("Hiểu một đời sống, khám phá những hiện vật độc đáo và nối tiếp chuyến đi tới Chùa Âng, Ao Bà Om. Ba góc nhìn cùng nằm trong một bài thuyết minh.", "Understand everyday life, discover remarkable objects, and continue towards Ang Pagoda and Ba Om Pond in one narrated journey."),
  location: t(
    "Bắt đầu hành trình tại bảo tàng, rồi kết nối với mặt nước Ao Bà Om và kiến trúc Chùa Âng ở ngay bên cạnh.",
    "Begin at the museum, then connect your visit with nearby Ba Om Pond and the architecture of Ang Pagoda.",
  ),
};

export type OverviewMedia = {
  kind: "photo" | "map";
  src: string;
  title: Copy;
  caption: Copy;
  credit: Copy;
  sourceUrl: string;
};
function archive(id: string): OverviewMedia {
  const entry = khmerOverviewGallery.find((photo) => photo.photo === id);
  return {
    kind: "photo",
    src: artwork(id),
    title: entry?.title ?? khmerOverview.fullName,
    caption:
      entry?.alt ??
      t(
        "Mặt tiền bảo tàng giữa khuôn viên cây xanh.",
        "The museum facade in its leafy grounds.",
      ),
    credit: khmerOverviewPhotoCredits[id],
    sourceUrl:
      khmerOverviewSources[id === "khmer-facade" ? "locality" : "museum"].url,
  };
}
function photograph(id: keyof typeof khmerHistoryPhotos): OverviewMedia {
  const photo = khmerHistoryPhotos[id];
  return {
    kind: "photo",
    src: photo.src,
    title: photo.title,
    caption: photo.caption,
    credit: t(`Ảnh: ${photo.author}`, `Photo: ${photo.author}`),
    sourceUrl: photo.sourceUrl,
  };
}
const map: OverviewMedia = {
  kind: "map",
  src: "",
  title: t(
    "Ba điểm đến, một không gian văn hóa",
    "Three places, one cultural landscape",
  ),
  caption: t(
    "Bảo Tàng Văn Hóa Dân Tộc Khmer, Ao Bà Om và Chùa Âng trên cùng một bản đồ. Vị trí tham chiếu, không phải chỉ dẫn đường đi.",
    "The Khmer Ethnic Cultural Museum, Ba Om Pond and Ang Pagoda on one map. Location reference, rather than walking directions.",
  ),
  credit: t("Ảnh vệ tinh: Esri", "Satellite imagery: Esri"),
  sourceUrl:
    "https://www.esri.com/en-us/arcgis/products/arcgis-living-atlas/overview",
};
const photoEssay = (file: string, title: Copy, caption: Copy): OverviewMedia => ({
  kind: "photo",
  src: new URL(`../../assets/museo/khmer-overview-${file}-2017.jpg`, import.meta.url).href,
  title,
  caption,
  credit: t("Ảnh: Nguyễn Luân · Báo ảnh Việt Nam, 2017", "Photo: Nguyen Luan · Vietnam Pictorial, 2017"),
  sourceUrl: khmerOverviewSources.photoEssay.url,
});
const craftRoom = photoEssay("crafts", t("Không gian nghề truyền thống", "Traditional crafts display"), t("Khung dệt và hiện vật nghề truyền thống trong bảo tàng; ảnh tư liệu năm 2017.", "A loom and traditional craft objects in the museum, photographed in 2017."));
const beliefObject = photoEssay("belief", t("Điêu khắc trong trưng bày tín ngưỡng", "Sculpture in the belief display"), t("Hiện vật điêu khắc trong khu trưng bày tôn giáo và tín ngưỡng; ảnh tư liệu năm 2017.", "A sculpture in the religion and belief display, photographed in 2017."));
const woodCarving = photoEssay("carving", t("Điêu khắc gỗ Khmer", "Khmer woodcarving"), t("Các sản phẩm điêu khắc gỗ tại bảo tàng thể hiện kỹ thuật chạm và thế giới hình tượng Khmer.", "Woodcarvings in the museum introduce Khmer carving techniques and imagery."));
const fishingTrap = photoEssay("fishing", t("Chiếc nôm tre", "A bamboo fishing trap"), t("Nôm tre dùng úp bắt cá ở vùng nước nông; hiện vật được chụp tại bảo tàng năm 2017.", "A bamboo trap for catching fish in shallow water, photographed at the museum in 2017."));

export const overviewGroups: { title: Copy; topics: KhmerOverviewTopic[] }[] = [
  {
    title: t("Câu chuyện bảo tàng", "The museum story"),
    topics: ["introduction", "collections", "location"],
  },
  {
    title: khmerOverview.highlightsTitle,
    topics: ["identity", "architecture", "performing", "dailyLife", "spiritual"],
  },
  {
    title: khmerOverview.visitTitle,
    topics: ["visit"],
  },
  {
    title: t("Tìm hiểu thêm", "Explore further"),
    topics: ["everyday", "route", "learning"],
  },
];
export const overviewViewerMedia: Record<KhmerOverviewTopic, OverviewMedia[]> =
  {
    introduction: [
      archive("khmer-facade"),
      photograph("roof"),
      photograph("exhibition"),
      archive("khmer-visitors"),
    ],
    collections: [
      photograph("facade"),
      photograph("village"),
      craftRoom,
      photograph("chair"),
      photograph("ensemble"),
      photograph("clothing"),
    ],
    identity: [
      photograph("village"),
      archive("khmer-temple-model"),
      photograph("chair"),
      photograph("clothing"),
    ],
    architecture: [
      photograph("facade"),
      photograph("roof"),
      woodCarving,
      photograph("pagoda"),
    ],
    performing: [
      photograph("ensemble"),
      photograph("duke"),
      photograph("mask"),
      photograph("drum"),
    ],
    dailyLife: [
      photograph("kitchen"), photograph("village"), photograph("farm"),
      fishingTrap, craftRoom, photograph("fishing"), photograph("clothing"),
    ],
    spiritual: [
      photograph("chair"), archive("khmer-temple-model"),
      photograph("buddha"), beliefObject, photograph("pagoda"),
    ],
    visit: [
      photograph("kitchen"), photograph("farm"), fishingTrap, woodCarving,
      photograph("mask"), photograph("pagoda"), photograph("pond"), map,
    ],
    everyday: [
      archive("khmer-tools"),
      photograph("farm"),
      photograph("fishing"),
      photograph("kitchen"),
      photograph("clothing"),
    ],
    route: [
      map,
      archive("khmer-facade"),
      photograph("pond"),
      photograph("pagoda"),
    ],
    learning: [
      archive("khmer-visitors"),
      archive("khmer-temple-model"),
      photograph("ensemble"),
      photograph("village"),
    ],
    location: [
      map,
      archive("khmer-facade"),
      photograph("pond"),
      photograph("pagoda"),
    ],
  };

// Every album card reuses a photograph and its exact position in a story gallery.
// Opening it therefore presents the same photograph, transcript and narration.
function albumPhoto(topic: Exclude<OverviewNarrationTopic, "visit">, photoIndex: number) {
  const media = overviewViewerMedia[topic][photoIndex];
  return { ...media, topic, photoIndex, photo: `${topic}-${photoIndex}`, alt: media.caption };
}
export const khmerOverviewAlbum = [
  albumPhoto("architecture", 0),
  albumPhoto("identity", 0),
  albumPhoto("collections", 5),
  albumPhoto("dailyLife", 0),
  albumPhoto("dailyLife", 2),
  albumPhoto("dailyLife", 3),
  albumPhoto("dailyLife", 4),
  albumPhoto("performing", 0),
  albumPhoto("performing", 2),
  albumPhoto("spiritual", 0),
  albumPhoto("spiritual", 2),
  albumPhoto("architecture", 1),
].filter((item, index, all) => item.kind === "photo" && all.findIndex(other => other.src === item.src) === index);

export const overviewViewerMetadata: Record<
  KhmerOverviewTopic,
  { subject: Copy; space: Copy }
> = {
  introduction: {
    subject: t(
      "Ký ức · Sưu tập · Cộng đồng",
      "Memory · Collections · Community",
    ),
    space: KHMER_MUSEUM_NAME,
  },
  collections: {
    subject: t(
      "Tín ngưỡng · Đời sống · Nghề · Nghệ thuật",
      "Belief · Daily life · Crafts · Arts",
    ),
    space: t("Bốn chủ đề trưng bày", "Four exhibition themes"),
  },
  identity: {
    subject: t(
      "Tín ngưỡng · Chữ viết · Tri thức",
      "Belief · Writing · Knowledge",
    ),
    space: t("Chùa · Phum sóc · Gia đình", "Pagoda · Village · Family"),
  },
  architecture: {
    subject: t("Mái · Hoa văn · Không gian", "Roofs · Ornament · Space"),
    space: t("Tòa nhà trưng bày · Khuôn viên", "Exhibition building · Grounds"),
  },
  performing: {
    subject: t("Ngũ âm · Rô băm · Dù kê", "Pinpeat · Robam · Du Ke"),
    space: t("Trưng bày nghệ thuật diễn xướng", "Performing-arts exhibition"),
  },
  dailyLife: {
    subject: t("Gian bếp · Nông ngư cụ · Dệt chiếu · Gia đình", "Kitchen · Farming and fishing · Mat weaving · Family"),
    space: t("Đời sống và nghề truyền thống", "Everyday life and traditional crafts"),
  },
  spiritual: {
    subject: t("Phật giáo Nam tông · Ghế thuyết pháp · Néak Tà", "Theravada Buddhism · Preaching chair · Neak Ta"),
    space: t("Trưng bày tôn giáo và tín ngưỡng", "Religion and belief display"),
  },
  visit: {
    subject: t("Hiểu đời sống · Khám phá hiện vật · Kết nối ba điểm", "Understand life · Explore objects · Connect three places"),
    space: t("Bảo tàng · Chùa Âng · Ao Bà Om", "Museum · Ang Pagoda · Ba Om Pond"),
  },
  everyday: {
    subject: t(
      "Lao động · Sinh hoạt · Nghề thủ công",
      "Work · Daily life · Crafts",
    ),
    space: t("Trưng bày văn hóa vật chất", "Material culture exhibition"),
  },
  route: {
    subject: t(
      "Hiện vật · Cảnh quan · Kiến trúc",
      "Objects · Landscape · Architecture",
    ),
    space: t(
      "Bảo tàng · Ao Bà Om · Chùa Âng",
      "Museum · Ba Om Pond · Ang Pagoda",
    ),
  },
  learning: {
    subject: t("Quan sát · Tìm hiểu · Kết nối", "Observe · Learn · Connect"),
    space: t("Không gian giáo dục di sản", "Heritage learning space"),
  },
  location: {
    subject: t("Vị trí · Địa chỉ · Tham quan", "Location · Address · Visiting"),
    space: t(
      "Nguyệt Hóa · Vĩnh Long · Khu vực Trà Vinh",
      "Nguyet Hoa · Vinh Long · Tra Vinh area",
    ),
  },
};
