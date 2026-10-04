import pond from "../assets/ao-ba-om/pond.webp";
import roots from "../assets/ao-ba-om/roots.webp";
import pagoda from "../assets/ao-ba-om/ang-pagoda.webp";
import festival from "../assets/ao-ba-om/festival-2024.webp";
import lanterns from "../assets/ao-ba-om/floating-lanterns-2024.webp";

export type AoLanguage = "vi" | "en";
export type AoText = { vi: string; en: string };
export const words = (vi: string, en: string): AoText => ({ vi, en });
export const AO_SOURCES = {
  landscape:
    "https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay",
  pagoda: "https://vietnamtourism.vn/en/index.php/tourism/items/1395",
  festival:
    "https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/",
};
export const aoPhotos = [
  {
    src: pond,
    title: words(
      "Một khoảng lặng bên Ao Vuông",
      "A quiet moment beside the square pond",
    ),
    credit: "Huỳnh Biển / Trung tâm Xúc tiến Du lịch Vĩnh Long",
    source: AO_SOURCES.landscape,
  },
  {
    src: roots,
    title: words("Những bộ rễ trồi bên bờ ao", "Exposed roots beside the pond"),
    credit: "Huỳnh Biển / Trung tâm Xúc tiến Du lịch Vĩnh Long",
    source: AO_SOURCES.landscape,
  },
  {
    src: pagoda,
    title: words(
      "Chùa Âng trong không gian di sản",
      "Ang Pagoda in the heritage landscape",
    ),
    credit: "TITC / Cục Du lịch Quốc gia Việt Nam",
    source: AO_SOURCES.pagoda,
  },
  {
    src: festival,
    title: words(
      "Tái hiện lễ cúng trăng năm 2024",
      "A presentation of the moon worship ceremony, 2024",
    ),
    credit: "Ngân Linh / Cổng TTĐT Trà Vinh",
    source: AO_SOURCES.festival,
  },
  {
    src: lanterns,
    title: words(
      "Thả hoa đăng tại lễ hội năm 2024",
      "Floating lanterns at the 2024 festival",
    ),
    credit: "Ngân Linh / Cổng TTĐT Trà Vinh",
    source: AO_SOURCES.festival,
  },
];
export const aoSections = [
  { id: "overview", name: words("Tổng quan", "Overview") },
  { id: "landscape", name: words("Dấu ấn tự nhiên", "Living landscape") },
  { id: "legend", name: words("Truyền thuyết", "The legend") },
  { id: "culture", name: words("Văn hóa Khmer", "Khmer culture") },
  { id: "visit", name: words("Dạo quanh ao", "Plan a walk") },
  { id: "archive", name: words("Tư liệu ảnh", "Photo archive") },
] as const;
export type AoSection = (typeof aoSections)[number]["id"];
export const observations = [
  {
    title: words("Bộ rễ trồi", "Sculptural roots"),
    body: words(
      "Những bộ rễ nổi uốn thành vòm và hốc, tạo nên hình dáng đặc biệt của cây quanh ao. Hãy quan sát gần, nhưng không trèo lên rễ.",
      "Exposed roots form arches and hollows, giving the trees their distinctive shapes. Look closely, without climbing on the roots.",
    ),
    note: words(
      "Chạm để quan sát một chi tiết",
      "Select a detail to look closer",
    ),
    x: 41,
    y: 73,
  },
  {
    title: words("Tán sao, dầu", "The forest canopy"),
    body: words(
      "Những thân cây cao và tán lá rộng tạo bóng mát cho lối đi quanh ao. Cảnh quan này là một phần làm nên bản sắc của Ao Bà Om.",
      "Tall trunks and broad crowns shade the paths around the pond. This living canopy is an essential part of Ao Bà Om’s character.",
    ),
    note: words("Một khoảng xanh để dừng chân", "A green space to pause"),
    x: 21,
    y: 19,
  },
  {
    title: words("Mặt nước Ao Vuông", "The square pond"),
    body: words(
      "Ao Bà Om còn được gọi là Ao Vuông. Mặt nước và vành đai cây xanh tạo thành một không gian gắn với đời sống, ký ức địa phương.",
      "Ao Bà Om is also called the Square Pond. The water and surrounding trees form a landscape woven into local life and memory.",
    ),
    note: words(
      "Nhìn từ bờ ao dưới tán cây",
      "Looking out from beneath the trees",
    ),
    x: 68,
    y: 43,
  },
];
export const legendScenes = [
  {
    title: words("Cuộc thi bên bờ ao", "A contest beside the pond"),
    tab: words("Cuộc thi", "The contest"),
    body: words(
      "Một cách kể dân gian nói rằng nam và nữ trong vùng thi đào ao. Nhóm phụ nữ do bà Om dẫn dắt; hai bên hẹn kết thúc khi sao mai xuất hiện.",
      "One folk account tells of a pond-digging contest between women and men. Om led the women; both sides agreed to stop when the morning star appeared.",
    ),
  },
  {
    title: words("Một ngọn đèn, một kế hay", "A lantern and a clever plan"),
    tab: words("Ánh đèn", "The lantern"),
    body: words(
      "Trong dị bản này, bà Om treo đèn lên cây. Nhóm nam tưởng sao mai đã mọc nên dừng lại, còn nhóm nữ tiếp tục công việc và giành phần thắng.",
      "In this version, Om hung a lantern in a tree. The men mistook it for the morning star and stopped, while the women kept working and won.",
    ),
  },
  {
    title: words("Tên người ở lại cùng ao", "A name that stayed"),
    tab: words("Tên gọi", "The name"),
    body: words(
      "Theo câu chuyện, tên ao gắn với người phụ nữ đã dẫn dắt cuộc thi. Đây là truyền thuyết được lưu truyền, không phải niên sử xác định thời điểm hình thành ao.",
      "The story links the pond’s name to the woman who led the contest. It is a folk tradition, rather than a historical record of when the pond was created.",
    ),
  },
];
