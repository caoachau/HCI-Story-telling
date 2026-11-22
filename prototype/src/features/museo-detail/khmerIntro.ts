import type { CultureLanguage, CulturePhotoId } from "./khmerCulture";
import type { MuseumSection } from "./useMuseumScreens";

type Copy = Record<CultureLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const khmerIntro = {
  title: {
    vi: ["Bảo Tàng", "Văn Hóa Dân Tộc", "Khmer"],
    en: ["Khmer", "Ethnic Cultural", "Museum"],
  },
  subtitle: t(
    "KÝ ỨC KHMER NAM BỘ · TRÀ VINH",
    "SOUTHERN KHMER MEMORY · TRA VINH",
  ),
  description: t(
    "Khám phá hiện vật, nghệ thuật và con người gìn giữ ký ức Khmer bên Ao Bà Om.",
    "Discover objects, arts and the people sustaining Khmer memory beside Ao Ba Om.",
  ),
  action: t("KHÁM PHÁ BẢO TÀNG", "EXPLORE THE MUSEUM"),
};

export const khmerIntroSlides: { id: CulturePhotoId; title: Copy }[] = [
  { id: "facade", title: t("KIẾN TRÚC KHMER", "KHMER ARCHITECTURE") },
  { id: "exhibition", title: t("HIỆN VẬT & KÝ ỨC", "OBJECTS & MEMORY") },
  { id: "drum", title: t("NGHỆ THUẬT KHMER", "KHMER ARTS") },
  { id: "sang", title: t("DI SẢN TIẾP NỐI", "HERITAGE CONTINUES") },
];

export const khmerIntroChapters: {
  section: MuseumSection;
  icon: "home" | "pin" | "scroll" | "leaf" | "shield";
  title: Copy;
}[] = [
  { section: "overview", icon: "home", title: t("TỔNG QUAN", "OVERVIEW") },
  { section: "map", icon: "pin", title: t("ĐIỂM KHÁM PHÁ", "PLACES") },
  {
    section: "timeline",
    icon: "scroll",
    title: t("LỊCH SỬ PHÁT TRIỂN", "HISTORY"),
  },
  {
    section: "tour",
    icon: "leaf",
    title: t("VĂN HÓA & CON NGƯỜI", "CULTURE & PEOPLE"),
  },
  {
    section: "exhibitions",
    icon: "shield",
    title: t("GIÁ TRỊ DI SẢN", "HERITAGE VALUES"),
  },
];

export const khmerIntroContext: {
  id: string;
  photo: CulturePhotoId;
  title: Copy;
  text: Copy;
  section: MuseumSection;
  item: string;
}[] = [
  {
    id: "landscape",
    photo: "pond",
    title: t("KHÔNG GIAN DI SẢN", "HERITAGE LANDSCAPE"),
    text: t(
      "Ao Bà Om, chùa Âng và bảo tàng.",
      "Ao Ba Om, Ang Pagoda, museum.",
    ),
    section: "map",
    item: "pond",
  },
  {
    id: "arts",
    photo: "mask",
    title: t("HIỆN VẬT & NGHỆ THUẬT", "OBJECTS & ARTS"),
    text: t(
      "Mặt nạ, âm nhạc và sân khấu Khmer.",
      "Masks, music and Khmer theatre.",
    ),
    section: "tour",
    item: "robam",
  },
  {
    id: "people",
    photo: "sang",
    title: t("CON NGƯỜI TIẾP NỐI", "PEOPLE & CONTINUITY"),
    text: t(
      "Nghệ nhân và những thế hệ giữ nghề.",
      "Artisans passing on skills.",
    ),
    section: "tour",
    item: "thachsang",
  },
];
