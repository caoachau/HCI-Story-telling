import { artwork } from "./data";
import { khmerHistoryPhotos } from "./khmerHistory";
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
    "Từ tín ngưỡng đến đời sống, nghề thủ công và nghệ thuật, mỗi hiện vật mở ra một cách hiểu văn hóa Khmer.",
    "Explore Khmer culture through four connected themes: belief, everyday life, crafts and the performing arts.",
  ),
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
    "Bảo tàng Khmer, Ao Bà Om và Chùa Âng trên cùng một bản đồ. Vị trí tham chiếu, không phải chỉ dẫn đường đi.",
    "The Khmer museum, Ba Om Pond and Ang Pagoda on one map. Location reference, rather than walking directions.",
  ),
  credit: t("Ảnh vệ tinh: Esri", "Satellite imagery: Esri"),
  sourceUrl:
    "https://www.esri.com/en-us/arcgis/products/arcgis-living-atlas/overview",
};

export const overviewGroups: { title: Copy; topics: KhmerOverviewTopic[] }[] = [
  {
    title: t("Câu chuyện bảo tàng", "The museum story"),
    topics: ["introduction", "collections", "location"],
  },
  {
    title: khmerOverview.highlightsTitle,
    topics: ["identity", "architecture", "performing"],
  },
  {
    title: khmerOverview.visitTitle,
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
      archive("khmer-visitors"),
      archive("khmer-temple-model"),
      archive("khmer-tools"),
      archive("khmer-pinpeat"),
      photograph("clothing"),
    ],
    identity: [
      archive("khmer-temple-model"),
      photograph("chair"),
      photograph("village"),
      photograph("clothing"),
    ],
    architecture: [
      archive("khmer-facade"),
      photograph("facade"),
      photograph("roof"),
      photograph("pagoda"),
    ],
    performing: [
      archive("khmer-pinpeat"),
      photograph("ensemble"),
      photograph("duke"),
      photograph("mask"),
      photograph("drum"),
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

export const overviewViewerMetadata: Record<
  KhmerOverviewTopic,
  { subject: Copy; space: Copy }
> = {
  introduction: {
    subject: t(
      "Ký ức · Sưu tập · Cộng đồng",
      "Memory · Collections · Community",
    ),
    space: t("Bảo tàng Văn hóa Dân tộc Khmer", "Khmer Culture Museum"),
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
