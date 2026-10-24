import type { HeritageSite } from "./heritageSites";
import museumFacade from "../assets/museo/khmer-facade-2023.jpg";
import museumExhibition from "../assets/museo/khmer-exhibition.jpg";
import museumDrums from "../assets/museo/khmer-hall.jpg";

export type QuickLanguage = "vi" | "en";
type Copy = Record<QuickLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });
const explorationThemes: Record<string, Copy> = {
  "bao-tang-khmer": t(
    "Kiến trúc · Hiện vật · Văn hóa Khmer",
    "Architecture · Objects · Khmer culture",
  ),
  "ao-ba-om": t(
    "Cảnh quan · Cây cổ thụ · Lễ hội",
    "Landscape · Old trees · Festivals",
  ),
  "chua-ang": t(
    "Kiến trúc · Mỹ thuật · Phật giáo Nam tông",
    "Architecture · Art · Theravada Buddhism",
  ),
  "chua-hang": t(
    "Cổng chùa · Thiên nhiên · Điêu khắc gỗ",
    "Gateway · Nature · Wood carving",
  ),
  "den-tho-bac": t(
    "Lịch sử · Tư liệu · Ký ức địa phương",
    "History · Documents · Local memory",
  ),
  "con-chim": t(
    "Ruộng vườn · Đời sống · Du lịch cộng đồng",
    "Farmland · Everyday life · Community tourism",
  ),
  "bien-ba-dong": t(
    "Bờ biển · Đụn cát · Đời sống ven bờ",
    "Shoreline · Sand dunes · Coastal life",
  ),
};
export type QuickPhoto = { src: string; caption: Copy; credit: string };
type QuickEditorial = { introduction: Copy; visit: Copy };

// Short visitor introductions draw on the existing location stories. The museum
// uses the reviewed detail-page content instead of older placeholder claims.
const editorial: Record<string, QuickEditorial> = {
  "bao-tang-khmer": {
    introduction: t(
      "Khám phá đời sống, tín ngưỡng và nghệ thuật Khmer Nam Bộ qua kiến trúc, hiện vật và tư liệu. Bảo tàng nằm bên Ao Bà Om và Chùa Âng, tạo nên một hành trình văn hóa liên hoàn.",
      "Explore Southern Khmer life, beliefs and arts through architecture, objects and documents. Beside Ao Ba Om and Ang Pagoda, the museum forms part of a connected cultural landscape.",
    ),
    visit: t(
      "Bắt đầu từ kiến trúc bên ngoài, tìm hiểu các chủ đề trưng bày rồi kết nối chuyến đi với Ao Bà Om và Chùa Âng. Không chạm vào hiện vật; hỏi nhân viên trước khi chụp ảnh trong phòng trưng bày.",
      "Start with the building, explore the exhibition themes, then connect your visit with Ao Ba Om and Ang Pagoda. Do not touch exhibits; ask staff before photographing displays.",
    ),
  },
  "ao-ba-om": {
    introduction: t(
      "Mặt nước, những bộ rễ cổ thụ và câu chuyện bà Om làm nên một không gian cảnh quan gắn bó với văn hóa Khmer. Đây cũng là điểm kết nối với Chùa Âng và Bảo tàng Văn hóa Khmer.",
      "Water, exposed tree roots and the legend of Lady Om create a landscape closely connected with Khmer culture. The pond also links a visit to Ang Pagoda and the Khmer Cultural Museum.",
    ),
    visit: t(
      "Tản bộ quanh hồ, quan sát bộ rễ từ lối đi và giữ gìn không gian chung. Tránh trèo lên rễ cây; mang rác ra khỏi khu vực tham quan.",
      "Walk around the pond and observe the roots from the paths. Avoid climbing on tree roots and take your litter away.",
    ),
  },
  "chua-ang": {
    introduction: t(
      "Ngôi chùa Khmer bên Ao Bà Om kết nối kiến trúc, mỹ thuật và đời sống Phật giáo Nam tông. Những tầng mái, hoa văn và không gian cây xanh mở ra câu chuyện về văn hóa cộng đồng.",
      "This Khmer pagoda beside Ao Ba Om connects architecture, art and Theravada Buddhist life. Its roof forms, ornament and shaded grounds tell a story of community culture.",
    ),
    visit: t(
      "Mặc trang phục lịch sự, giữ yên lặng trong không gian thờ tự và làm theo hướng dẫn tại chùa. Xin phép trước khi chụp ảnh người đang hành lễ.",
      "Dress respectfully, keep quiet in worship spaces and follow the pagoda’s guidance. Ask permission before photographing people at prayer.",
    ),
  },
  "chua-hang": {
    introduction: t(
      "Cổng chùa gợi hình một hang đá, khuôn viên rợp cây và nghệ thuật điêu khắc gỗ tạo nên nét riêng của Wat Kompongnicrôth. Khám phá mối liên hệ giữa không gian chùa, thiên nhiên và bàn tay người thợ.",
      "A cave-like gateway, shaded grounds and wood carving distinguish Wat Kompongnicrôth. Discover the relationship between the pagoda, its natural setting and the work of craftspeople.",
    ),
    visit: t(
      "Tham quan nhẹ nhàng, giữ khoảng cách với chim trong khuôn viên. Hỏi trước khi vào xưởng hoặc chụp ảnh quá trình làm việc của người thợ.",
      "Visit quietly and keep your distance from birds in the grounds. Ask before entering a workshop or photographing craftspeople at work.",
    ),
  },
  "den-tho-bac": {
    introduction: t(
      "Không gian tưởng niệm tại Long Đức gắn với câu chuyện người dân xây dựng và gìn giữ đền thờ Chủ tịch Hồ Chí Minh. Kiến trúc, tư liệu và cảnh quan cùng kể lại ký ức của địa phương.",
      "This Long Duc memorial is connected with the story of residents building and protecting a temple to President Ho Chi Minh. Architecture, documents and landscape preserve local memory.",
    ),
    visit: t(
      "Giữ tác phong trang nghiêm tại khu tưởng niệm. Dành thời gian đọc bảng thông tin và tìm hiểu câu chuyện lịch sử trước khi tham quan cảnh quan xung quanh.",
      "Be respectful in the memorial spaces. Read the interpretation panels and explore the historical story before walking through the surrounding grounds.",
    ),
  },
  "con-chim": {
    introduction: t(
      "Một hành trình miệt vườn giữa sông Cổ Chiên, nơi cảnh quan ruộng vườn và sinh hoạt của cư dân tạo nên trải nghiệm du lịch cộng đồng. Khám phá cách sống thuận thiên qua những câu chuyện địa phương.",
      "A garden-islet journey on the Co Chien River, where farmland and residents’ everyday lives shape community tourism. Explore a way of living with nature through local stories.",
    ),
    visit: t(
      "Liên hệ đơn vị đón khách trước chuyến đi để thống nhất lịch trình và phương tiện. Tôn trọng không gian sinh hoạt của cư dân, hạn chế đồ nhựa dùng một lần.",
      "Contact the local visitor operator before travelling to arrange your itinerary and transport. Respect residents’ homes and reduce single-use plastics.",
    ),
  },
  "bien-ba-dong": {
    introduction: t(
      "Bờ biển, những đụn cát và hàng phi lao tạo nên cảnh quan duyên hải Ba Động. Khám phá câu chuyện địa danh và mối liên hệ giữa biển, gió cùng đời sống ven bờ.",
      "The shoreline, sand dunes and casuarina trees shape Ba Dong’s coastal landscape. Explore the place name and connections between the sea, wind and coastal life.",
    ),
    visit: t(
      "Theo dõi thời tiết và biển báo tại bãi biển trước khi xuống nước. Không vào khu vực hạn chế; thu gom rác sau khi tham quan và tôn trọng cảnh quan ven biển.",
      "Check the weather and beach signs before entering the water. Stay out of restricted areas, take your litter away and respect the coastal landscape.",
    ),
  },
};

const museumHighlights = [
  {
    title: t(
      "Kiến trúc trong quần thể di sản",
      "Architecture in a heritage landscape",
    ),
    summary: t(
      "Tòa nhà hai tầng mang ngôn ngữ kiến trúc Khmer, kết nối cảnh quan Ao Bà Om và Chùa Âng.",
      "A two-storey building with Khmer architectural forms, connected with the Ao Ba Om and Ang Pagoda landscape.",
    ),
  },
  {
    title: t("Hiện vật và ký ức cộng đồng", "Objects and community memory"),
    summary: t(
      "Tìm hiểu tín ngưỡng, chữ viết, đời sống và nghề truyền thống qua hiện vật cùng tư liệu trưng bày.",
      "Explore beliefs, writing, everyday life and traditional crafts through objects and exhibition documents.",
    ),
  },
  {
    title: t("Âm nhạc và nghệ thuật diễn xướng", "Music and performing arts"),
    summary: t(
      "Nhạc ngũ âm, trống Chhay-dăm và các hình thức sân khấu giúp đọc thêm một lớp văn hóa Khmer.",
      "Pinpeat music, Chhay-dam drums and theatre offer another way to understand Khmer culture.",
    ),
  },
];

const englishPhotoCaptions: Record<string, string[]> = {
  "ao-ba-om": [
    "The water and tree-lined banks of Ao Ba Om",
    "Exposed roots of the old trees beside the pond",
    "Moon worship at the 2024 Ok Om Bok festival",
  ],
  "chua-ang": [
    "The main hall and roof forms of Ang Pagoda",
    "Architectural ornament at Ang Pagoda",
    "Ang Pagoda gateway",
  ],
  "chua-hang": ["The main hall of Hang Pagoda"],
  "den-tho-bac": [
    "The President Ho Chi Minh Temple in Tra Vinh",
    "The fish pond in the Long Duc memorial grounds",
  ],
  "con-chim": [
    "Cycling through Con Chim’s fields and gardens",
    "Visitors exploring farming at Con Chim in 2019",
    "A meal in a rural kitchen at Con Chim",
  ],
  "bien-ba-dong": [
    "The Ba Dong shoreline in Tra Vinh",
    "A documentary view of Ba Dong Beach",
  ],
};

export function quickLocationContent(site: HeritageSite, lang: QuickLanguage) {
  const copy = editorial[site.id];
  const museum = site.id === "bao-tang-khmer";
  const highlights = museum
    ? museumHighlights.map((item) => ({
        title: item.title[lang],
        summary: item.summary[lang],
      }))
    : site.chapters.slice(0, 3).map((item) => ({
        title: lang === "vi" ? item.title : item.englishTitle,
        summary: lang === "vi" ? item.summary : item.englishSummary,
      }));
  const photos: QuickPhoto[] = museum
    ? [
        {
          src: museumFacade,
          caption: t(
            "Kiến trúc Bảo tàng Văn hóa Khmer",
            "Khmer Cultural Museum architecture",
          ),
          credit: "Hoàng Giám · VietNamNet · 2023",
        },
        {
          src: museumExhibition,
          caption: t(
            "Không gian trưng bày tín ngưỡng",
            "Beliefs in the exhibition",
          ),
          credit: "Hoàng Giám · VietNamNet · 2023",
        },
        {
          src: museumDrums,
          caption: t(
            "Trưng bày nghệ thuật Chhay-dăm",
            "Chhay-dam performing arts display",
          ),
          credit: "Hoàng Giám · VietNamNet · 2023",
        },
      ]
    : site.gallery
        .filter(
          (photo) =>
            !photo.url.includes("unsplash.com") &&
            !(site.id === "chua-hang" && photo.url.includes("Ao%20B")),
        )
        .map((photo, index) => ({
          src: photo.url,
          caption: t(
            photo.caption,
            englishPhotoCaptions[site.id]?.[index] ?? site.englishName,
          ),
          credit: photo.credit,
        }));
  if (!photos.some((photo) => photo.src === site.heroImage) && !museum)
    photos.unshift({
      src: site.heroImage,
      caption: t(site.heroImageCaption, site.englishName),
      credit: "",
    });
  return {
    exploration: explorationThemes[site.id]?.[lang] ?? site.tagline,
    summary:
      copy?.introduction[lang] ??
      (lang === "vi"
        ? site.chapters[0]?.summary
        : site.chapters[0]?.englishSummary) ??
      site.tagline,
    visit: copy?.visit[lang] ?? "",
    period: museum
      ? "1992–1997"
      : lang === "vi"
        ? site.establishedCentury
        : site.establishedCentury
            .replace("Năm", "Year")
            .replace("Thế kỷ", "Century")
            .replace("thế kỷ", "century")
            .replace("Du lịch cộng đồng từ năm", "Community tourism since")
            .replace("Khai phá", "Settlement"),
    periodLabel: museum
      ? lang === "vi"
        ? "Giai đoạn hình thành"
        : "Formation period"
      : lang === "vi"
        ? "Dấu mốc"
        : "Heritage period",
    periodNote: museum
      ? lang === "vi"
        ? "Các mốc xây dựng, khánh thành và mở cửa được phân biệt trong trang chi tiết."
        : "Construction, inauguration and visitor-opening accounts are distinguished in the detail page."
      : "",
    region:
      lang === "en" && site.region === "Đồng bằng Sông Cửu Long"
        ? "Mekong Delta"
        : site.region,
    highlights,
    photos: photos.slice(0, 4),
  };
}
