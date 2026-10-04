export type PlaceLanguage = "vi" | "en";
type Copy = Record<PlaceLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const khmerPlaceSources = {
  archive: {
    title: t(
      "B?o t?ng V?n h?a d?n t?c Khmer ? B?o t?ng L?ch s? Qu?c gia, 2014",
      "Khmer Cultural Museum ? National Museum of History, 2014",
    ),
    url: "https://baotanglichsu.vn/VI/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html",
  },
  objects: {
    title: t(
      "800 hiện vật, tư liệu cổ truyền · VietNamNet, 2023",
      "800 objects of Khmer heritage · VietNamNet, 2023",
    ),
    url: "https://vietnamnet.vn/800-hien-vat-tu-lieu-co-truyen-cua-dong-bao-khmer-o-tra-vinh-2203450.html",
  },
  museum: {
    title: t(
      "Thăm Bảo tàng Văn hóa Khmer · Bảo tàng Lịch sử Quốc gia, 2008",
      "Visiting the Khmer museum · National Museum of History, 2008",
    ),
    url: "https://baotanglichsu.vn/vi/Articles/1508/49946/tham-bao-tang-van-hoa-khmer-tai-tra-vinh.html",
  },
  memorial: {
    title: t(
      "Tháp tưởng niệm cụ Maha Sơn Thông · Bảo tàng Vĩnh Long, 2025",
      "Maha Son Thong memorial · Vinh Long Museum, 2025",
    ),
    url: "https://baotangvinhlong.vn/su-kien-noi-bat/thap-tuong-niem-cu-maha-son-thong-vi-lao-thanh-cach-mang-nguoi-khmer-587169",
  },
  pond: {
    title: t("Ao Bà Om · Du lịch Vĩnh Long", "Ao Ba Om · Vinh Long Tourism"),
    url: "https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay",
  },
  pagoda: {
    title: t(
      "Chùa Âng · Cục Du lịch Quốc gia Việt Nam",
      "Ang Pagoda · Vietnam National Authority of Tourism",
    ),
    url: "https://vietnamtourism.vn/en/index.php/tourism/items/1395",
  },
  archaeology: {
    title: t(
      "Bảo vật quốc gia và di chỉ Lưu Cừ II · Bảo tàng Vĩnh Long",
      "National treasures and Luu Cu II · Vinh Long Museum",
    ),
    url: "https://baotangvinhlong.vn/su-kien-noi-bat/vinh-long-tang-cuong-khai-thac-va-phat-huy-gia-tri-bao-vat-quoc-gia-587166",
  },
} as const;
type SourceKey = keyof typeof khmerPlaceSources;

const photoUrls = import.meta.glob(
  [
    "../../assets/museo/khmer-*.jpg",
    "../../assets/museo/khmer-*.png",
    "../../assets/ao-ba-om/*.webp",
  ],
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;
function photo(
  file: string,
  title: Copy,
  caption: Copy,
  source: SourceKey = "objects",
  author = "Hoàng Giám · VietNamNet, 2023",
) {
  const folder = file.endsWith(".webp") ? "ao-ba-om" : "museo";
  return {
    src: photoUrls[`../../assets/${folder}/${file}`],
    title,
    caption,
    source,
    author,
  };
}
export const khmerPlacePhotos = {
  facade: photo(
    "khmer-facade-2023.jpg",
    t("Mặt tiền bảo tàng", "The museum facade"),
    t(
      "Tòa nhà trưng bày với mái ngói đỏ, hoa văn Khmer và lối lên tầng lầu; ảnh tư liệu năm 2023.",
      "The exhibition building, red tiled roof, Khmer ornament and stairway, photographed in 2023.",
    ),
  ),
  roof: photo(
    "khmer-roof.jpg",
    t("Mái và lối lên tầng lầu", "Roof and upper-floor approach"),
    t(
      "Góc nhìn kiến trúc thể hiện mái tam giác, hoa văn và cầu thang ngoài trời của bảo tàng.",
      "An architectural view of the triangular roof, ornament and museum's exterior stairway.",
    ),
  ),
  exhibition: photo(
    "khmer-exhibition.jpg",
    t("Không gian tín ngưỡng", "Faith and belief displays"),
    t(
      "Ghế thuyết pháp và các tủ hiện vật trong không gian trưng bày của bảo tàng.",
      "The preaching chair and object cases in the museum's faith display.",
    ),
  ),
  drum: photo(
    "khmer-hall.jpg",
    t("Tái hiện múa Chhay-dăm", "Chhay-dam drum dance display"),
    t(
      "Mô hình người biểu diễn trống và múa Chhay-dăm trong trưng bày nghệ thuật.",
      "Mannequins depicting Chhay-dam drumming and dance in the performing-arts display.",
    ),
  ),
  village: photo(
    "khmer-village.jpg",
    t("Mô hình phum sóc", "A Khmer village model"),
    t(
      "Mô hình tái hiện không gian cư trú và sinh hoạt của cộng đồng Khmer.",
      "A model illustrating Khmer settlement and community life.",
    ),
  ),
  clothing: photo(
    "khmer-clothing.jpg",
    t("Trang phục truyền thống", "Traditional clothing"),
    t(
      "Trang phục phụ nữ Khmer được giới thiệu trong bộ sưu tập văn hóa vật chất.",
      "Khmer women's clothing in the material culture collection.",
    ),
  ),
  chair: photo(
    "khmer-preaching-chair.jpg",
    t("Ghế thuyết pháp", "The preaching chair"),
    t(
      "Chiếc ghế gỗ chạm khắc, trang trí màu vàng; bài tư liệu năm 2023 giới thiệu hiện vật có tuổi đời hơn 100 năm.",
      "An ornamented wooden preaching chair described as over 100 years old in the 2023 photo essay.",
    ),
  ),
  duke: photo(
    "khmer-duke.jpg",
    t("Sân khấu Dù kê", "Du ke theatre display"),
    t(
      "Mô hình sân khấu Dù kê và trang phục biểu diễn tại bảo tàng.",
      "The museum's Du ke theatre model and stage costumes.",
    ),
  ),
  boat: photo(
    "khmer-ngo-model.jpg",
    t("Mô hình Ghe Ngo", "Ngo boat model"),
    t(
      "Mô hình thu nhỏ được trưng bày trong nhà; ảnh này không thể hiện một chiếc ghe thật ngoài khuôn viên.",
      "A miniature displayed indoors, rather than a full-size boat in the grounds.",
    ),
  ),
  farm: photo(
    "khmer-farm-tools.jpg",
    t("Nông cụ và tri thức lao động", "Farming tools and knowledge"),
    t(
      "Guồng nước và dụng cụ sàng sảy lúa bằng gỗ trong trưng bày đời sống Khmer.",
      "A water wheel and wooden rice-processing equipment in the everyday-life display.",
    ),
  ),
  kitchen: photo(
    "khmer-kitchen.jpg",
    t("Gian bếp truyền thống", "The traditional kitchen"),
    t(
      "Không gian bếp được tái hiện bằng bếp đất, nồi và đồ dùng sinh hoạt.",
      "A reconstructed kitchen with earthen stoves, pots and household utensils.",
    ),
  ),
  fishing: photo(
    "khmer-fishing.jpg",
    t("Ngư cụ đan tre", "Woven fishing tools"),
    t(
      "Đồ dùng đánh bắt cho thấy kinh nghiệm sông nước và kỹ thuật đan của cư dân Khmer.",
      "Fishing equipment illustrates waterway knowledge and Khmer weaving skills.",
    ),
  ),
  sandstone: photo(
    "khmer-sandstone.jpg",
    t("Hiện vật sa thạch", "A sandstone object"),
    t(
      "Hiện vật tìm thấy tại Lưu Nghiệp Anh, được bài ảnh năm 2023 ghi niên đại thế kỷ VII–VIII. Không đồng nhất ảnh này với bảo vật Linga–Yoni Lưu Cừ II.",
      "An object from Luu Nghiep Anh, dated to the 7th–8th centuries in the 2023 essay. This photograph is not identified as the Luu Cu II national treasure.",
    ),
  ),
  buddha: photo(
    "khmer-buddha.jpg",
    t("Tượng Phật đá", "A stone Buddha"),
    t(
      "Tượng Phật được tư liệu ảnh năm 2023 giới thiệu có niên đại thế kỷ XIX.",
      "A Buddha statue dated to the 19th century in the 2023 photo essay.",
    ),
  ),
  mask: photo(
    "khmer-mask.jpg",
    t("Mặt nạ sân khấu", "Theatre masks"),
    t(
      "Mặt nạ cổ trong trưng bày nghệ thuật diễn xướng; chú ý hình khối và nét mặt nhân vật.",
      "Historic performance masks; look at the shape and character expressions.",
    ),
  ),
  ensemble: photo(
    "khmer-ensemble.jpg",
    t("Dàn nhạc ngũ âm", "The Pinpeat ensemble"),
    t(
      "Nhạc cụ ngũ âm trong không gian giáo dục và giới thiệu nghệ thuật tại bảo tàng.",
      "Pinpeat instruments in the museum's educational and performing-arts display.",
    ),
  ),
  temple: photo(
    "khmer-temple-model.jpg",
    t("Mô hình kiến trúc chùa Khmer", "A Khmer temple model"),
    t(
      "Ảnh tư liệu mô hình chùa trong trưng bày năm 2014; minh họa bối cảnh học tập và tín ngưỡng, không phải ảnh kinh lá buông.",
      "A temple model photographed in 2014, illustrating a setting for learning and belief, rather than a palm-leaf manuscript.",
    ),
    "museum",
    "Bảo tàng Lịch sử Quốc gia · tư liệu 2014",
  ),
  memorial: photo(
    "khmer-memorial.png",
    t("Tháp Maha Sơn Thông", "Maha Son Thong memorial"),
    t(
      "Tháp tưởng niệm trong khuôn viên bảo tàng với hai màu trắng, đỏ và hoa văn Khmer.",
      "The memorial in the museum grounds, with white and red finishes and Khmer ornament.",
    ),
    "memorial",
    "Huỳnh Như · Bảo tàng Vĩnh Long, 2025",
  ),
  khmerStele: photo(
    "khmer-memorial-khmer.png",
    t("Văn bia tiếng Khmer", "The Khmer inscription"),
    t(
      "Không gian tưởng niệm và phần văn bia tiếng Khmer bên trong tháp.",
      "The memorial interior and the Khmer inscription.",
    ),
    "memorial",
    "Huỳnh Như · Bảo tàng Vĩnh Long, 2025",
  ),
  viStele: photo(
    "khmer-memorial-vietnamese.png",
    t("Văn bia tiếng Việt", "The Vietnamese inscription"),
    t(
      "Phần văn bia tiếng Việt giới thiệu cuộc đời và những đóng góp của cụ Maha Sơn Thông.",
      "The Vietnamese inscription recounting Maha Son Thong's life and contributions.",
    ),
    "memorial",
    "Huỳnh Như · Bảo tàng Vĩnh Long, 2025",
  ),
  pond: photo(
    "pond.webp",
    t("Mặt nước Ao Bà Om", "Ao Ba Om pond"),
    t(
      "Ao Bà Om và không gian cây xanh của quần thể di tích liên hoàn.",
      "Ao Ba Om and the trees of the surrounding heritage landscape.",
    ),
    "pond",
    "Huỳnh Biển · Du lịch Vĩnh Long, 2025",
  ),
  roots: photo(
    "roots.webp",
    t("Rễ cổ thụ bên Ao Bà Om", "Ancient roots beside the pond"),
    t(
      "Những bộ rễ nổi tạo nên nét đặc trưng của cảnh quan Ao Bà Om.",
      "Exposed roots that characterize the Ao Ba Om landscape.",
    ),
    "pond",
    "Huỳnh Biển · Du lịch Vĩnh Long, 2025",
  ),
  pagoda: photo(
    "ang-pagoda.webp",
    t("Chùa Âng", "Ang Pagoda"),
    t(
      "Kiến trúc Khmer của chùa Âng, một điểm văn hóa và tín ngưỡng liên kết với bảo tàng.",
      "Khmer architecture at Ang Pagoda, a cultural and religious site near the museum.",
    ),
    "pagoda",
    "Cục Du lịch Quốc gia Việt Nam",
  ),
};
export type KhmerPlacePhoto = keyof typeof khmerPlacePhotos;
export const khmerPlaceZones = [
  {
    id: "landscape",
    title: t("Quần thể", "Heritage sites"),
    description: t(
      "Bảo tàng · Ao Bà Om · Chùa Âng",
      "Museum · Ao Ba Om · Ang Pagoda",
    ),
  },
  {
    id: "grounds",
    title: t("Khuôn viên", "Grounds"),
    description: t(
      "Kiến trúc, cây xanh và ký ức cộng đồng",
      "Architecture, trees and community memory",
    ),
  },
  {
    id: "ground",
    title: t("Tầng trệt", "Ground floor"),
    description: t(
      "Đón tiếp và lối lên khu trưng bày",
      "Welcome area and exhibition approach",
    ),
  },
  {
    id: "upper",
    title: t("Tầng lầu", "Upper floor"),
    description: t(
      "Tín ngưỡng · Đời sống · Nghề truyền thống · Nghệ thuật",
      "Belief · Everyday life · Crafts · Performing arts",
    ),
  },
] as const;
export type KhmerPlaceZone = (typeof khmerPlaceZones)[number]["id"];
export interface KhmerPlace {
  id: string;
  zone: KhmerPlaceZone;
  title: Copy;
  short: Copy;
  description: Copy;
  location: Copy;
  icon:
    | "building"
    | "leaf"
    | "water"
    | "boat"
    | "book"
    | "faith"
    | "craft"
    | "music"
    | "people"
    | "steps";
  tags: Copy[];
  paragraphs: Copy[];
  highlights: { title: Copy; text: Copy }[];
  gallery: KhmerPlacePhoto[];
  sources: SourceKey[];
  related: string[];
  position: [number, number];
  coordinates?: [number, number];
}
const highlight = (vi: string, en: string, textVi: string, textEn: string) => ({
  title: t(vi, en),
  text: t(textVi, textEn),
});
export const khmerPlaces: KhmerPlace[] = [
  {
    id: "entrance",
    zone: "landscape",
    title: t("Bảo tàng Văn hóa Khmer", "Khmer Cultural Museum"),
    location: t(
      "Trung tâm quần thể di tích",
      "At the heart of the heritage landscape",
    ),
    icon: "building",
    position: [64, 66],
    coordinates: [9.9161668, 106.3049936],
    short: t(
      "Điểm bắt đầu để tìm hiểu văn hóa Khmer Nam Bộ.",
      "Begin your exploration of Southern Khmer culture.",
    ),
    description: t(
      "Từ mặt tiền mái đỏ, bước vào hành trình kết nối kiến trúc, đời sống và nghệ thuật Khmer với Ao Bà Om và chùa Âng.",
      "Start at the red-roofed museum and connect Khmer architecture, everyday life and the arts with Ao Ba Om and Ang Pagoda.",
    ),
    tags: [
      t("Kiến trúc", "Architecture"),
      t("Bộ sưu tập", "Collections"),
      t("Kết nối", "Connections"),
    ],
    gallery: ["facade", "roof", "exhibition", "ensemble"],
    sources: ["objects", "museum"],
    related: ["architecture", "pond", "pagoda"],
    paragraphs: [
      t(
        "Bảo tàng nằm trong quần thể văn hóa gắn với Ao Bà Om và chùa Âng. Ba điểm bổ sung cho nhau: hiện vật giúp đọc lịch sử, cảnh quan gợi ký ức dân gian, còn ngôi chùa cho thấy đời sống tín ngưỡng đang tiếp diễn.",
        "The museum forms a cultural cluster with Ao Ba Om and Ang Pagoda. Objects explain history, the landscape carries folk memory, and the pagoda expresses an ongoing religious life.",
      ),
      t(
        "Tòa nhà gồm tầng trệt và tầng lầu, nằm giữa khuôn viên cây xanh khoảng một héc-ta. Trưng bày giới thiệu tôn giáo, đời sống, nghề truyền thống và nghệ thuật của người Khmer Nam Bộ.",
        "The two-storey building stands in approximately one hectare of green grounds. Displays introduce religion, daily life, traditional crafts and the arts of Southern Khmer communities.",
      ),
      t(
        "Hãy bắt đầu bằng việc quan sát mái và phù điêu mặt tiền, rồi chọn một chủ đề trên tầng lầu. Có thể tiếp nối chuyến tham quan bằng hai điểm gần kề trong cùng quần thể.",
        "Begin with the roof and facade relief, then choose an upper-floor topic. Continue the visit at the two nearby sites in the same heritage landscape.",
      ),
    ],
    highlights: [
      highlight(
        "Ba điểm, một câu chuyện",
        "Three places, one story",
        "Bảo tàng, ao và chùa kết nối tri thức, cảnh quan và tín ngưỡng.",
        "The museum, pond and pagoda connect knowledge, landscape and belief.",
      ),
      highlight(
        "Nhìn trước khi bước vào",
        "Look before entering",
        "Tìm các đường mái, hoa văn và cảnh múa Chhay-dăm ở mặt tiền.",
        "Look for roof lines, ornaments and Chhay-dam dancers on the facade.",
      ),
      highlight(
        "Chọn nhịp tham quan",
        "Choose your pace",
        "Đi từ kiến trúc đến hiện vật, rồi mở rộng ra cảnh quan bên ngoài.",
        "Move from architecture to objects, then into the surrounding landscape.",
      ),
    ],
  },
  {
    id: "pond",
    zone: "landscape",
    title: t("Ao Bà Om", "Ao Ba Om"),
    location: t(
      "Danh thắng bên quần thể bảo tàng",
      "The pond beside the museum landscape",
    ),
    icon: "water",
    position: [42, 27],
    coordinates: [9.9176081, 106.3040916],
    short: t(
      "Mặt nước, cổ thụ và huyền thoại dân gian Khmer.",
      "Water, ancient trees and Khmer folk memory.",
    ),
    description: t(
      "Những bộ rễ cổ thụ bên mặt nước tạo nên cảnh quan đặc trưng, gắn với truyền thuyết dân gian và lễ cúng Trăng Ok Om Bok.",
      "Ancient roots beside the water form a distinctive landscape linked to folk legend and the Ok Om Bok moon ceremony.",
    ),
    tags: [
      t("Cảnh quan", "Landscape"),
      t("Huyền thoại", "Folklore"),
      t("Lễ hội", "Festival"),
    ],
    gallery: ["pond", "roots", "pagoda", "boat"],
    sources: ["pond"],
    related: ["pagoda", "boat", "entrance"],
    paragraphs: [
      t(
        "Ao Bà Om là một danh thắng tiêu biểu của vùng Trà Vinh. Mặt nước và hàng cây lâu năm tạo không gian nghỉ chân, đồng thời là một phần ký ức văn hóa của cộng đồng Khmer.",
        "Ao Ba Om is a landmark of the Tra Vinh area. The water and mature trees offer a place to pause and carry the cultural memory of the Khmer community.",
      ),
      t(
        "Tên gọi của ao gắn với truyện kể dân gian về cuộc thi đào ao. Huyền thoại là một cách cộng đồng giải thích và truyền lại ý nghĩa của cảnh quan; không nên đọc như một biên niên sử xây dựng đã được xác định.",
        "The pond's name is linked to a folk tale about a pond-digging contest. This is a community's way of giving meaning to a landscape, rather than a verified construction chronology.",
      ),
      t(
        "Ao Bà Om gắn với sinh hoạt lễ hội Ok Om Bok và nghi thức cúng Trăng. Từ đây, có thể liên hệ với mô hình Ghe Ngo trong bảo tàng để hiểu thêm truyền thống lễ hội sông nước; địa điểm đua ghe cụ thể tùy chương trình tổ chức.",
        "Ao Ba Om is associated with Ok Om Bok and moon offerings. The museum's Ngo boat model adds context to waterway festival traditions; actual race venues depend on the event programme.",
      ),
    ],
    highlights: [
      highlight(
        "Rễ cây và mặt nước",
        "Roots and water",
        "Quan sát bộ rễ nổi, bóng cây và sự thay đổi của ánh sáng trên ao.",
        "Observe exposed roots, shade and changing light on the pond.",
      ),
      highlight(
        "Một cảnh quan biết kể chuyện",
        "A landscape of stories",
        "Huyền thoại dân gian trao cho địa điểm một lớp ý nghĩa cộng đồng.",
        "Folk stories give this place a layer of shared meaning.",
      ),
      highlight(
        "Nhịp lễ hội",
        "Festival rhythm",
        "Kết nối lễ cúng Trăng với cốm dẹp và văn hóa Ghe Ngo.",
        "Connect moon offerings with flattened rice and Ngo boat culture.",
      ),
    ],
  },
  {
    id: "pagoda",
    zone: "landscape",
    title: t("Chùa Âng", "Ang Pagoda"),
    location: t(
      "Angkorajapuri · gần Ao Bà Om",
      "Angkorajapuri · beside Ao Ba Om",
    ),
    icon: "faith",
    position: [29, 76],
    coordinates: [9.9157942, 106.3036199],
    short: t(
      "Không gian Phật giáo Nam tông và mỹ thuật Khmer.",
      "Theravada Buddhist life and Khmer art.",
    ),
    description: t(
      "Ngôi chùa Khmer cổ kính bổ sung cho trưng bày bảo tàng bằng kiến trúc, tín ngưỡng và truyền thống học tập trong cộng đồng.",
      "The historic Khmer pagoda complements the museum through architecture, faith and a tradition of community learning.",
    ),
    tags: [
      t("Nam tông", "Theravada"),
      t("Mỹ thuật", "Art"),
      t("Tri thức", "Learning"),
    ],
    gallery: ["pagoda", "temple", "pond", "roof"],
    sources: ["pagoda", "museum"],
    related: ["faith", "manuscripts", "architecture"],
    paragraphs: [
      t(
        "Chùa Âng, còn gọi là Angkorajapuri, là một điểm tín ngưỡng quan trọng trong quần thể. Không gian chùa cho thấy mối gắn bó giữa Phật giáo Nam tông, mỹ thuật và đời sống cộng đồng Khmer.",
        "Ang Pagoda, also known as Angkorajapuri, is an important religious place in the cluster. It reveals the relationship between Theravada Buddhism, art and Khmer community life.",
      ),
      t(
        "Hãy quan sát đường mái, các hình tượng trang trí và không gian chính điện. Tư liệu du lịch giới thiệu lịch sử lâu đời của chùa; những niên đại truyền thống nên được đọc cùng bối cảnh nguồn kể.",
        "Observe the roof lines, decorative figures and main sanctuary. Tourism accounts describe the pagoda's long history; traditional foundation dates should be read in the context of those accounts.",
      ),
      t(
        "Ngôi chùa còn là môi trường học chữ Khmer và truyền dạy tri thức. Câu chuyện về kinh lá buông, ghế thuyết pháp và kiến trúc chùa trong bảo tàng sẽ giúp chuyến tham quan ở đây có thêm chiều sâu.",
        "The pagoda is also a setting for Khmer literacy and knowledge transmission. Palm-leaf manuscripts, the preaching chair and temple models in the museum add context to a visit here.",
      ),
    ],
    highlights: [
      highlight(
        "Đọc đường mái",
        "Read the roof",
        "Đối chiếu hoa văn tại chùa với mái tòa nhà bảo tàng.",
        "Compare the pagoda ornament with the museum roof.",
      ),
      highlight(
        "Tín ngưỡng đang tiếp diễn",
        "An ongoing religious life",
        "Quan sát không gian thờ tự với sự tôn trọng sinh hoạt của chùa.",
        "Observe the sanctuary respectfully alongside everyday religious activity.",
      ),
      highlight(
        "Chùa và việc học",
        "The pagoda and learning",
        "Liên hệ vai trò giáo dục với chữ Khmer và kinh lá buông.",
        "Connect its educational role with Khmer writing and palm-leaf texts.",
      ),
    ],
  },
  {
    id: "architecture",
    zone: "grounds",
    title: t("Mái & hoa văn Khmer", "Khmer roof & ornament"),
    location: t("Tòa nhà trưng bày chính", "The main exhibition building"),
    icon: "building",
    position: [26, 28],
    short: t(
      "Đọc bản sắc Khmer từ mái ngói đến phù điêu.",
      "Read Khmer identity through roofs and reliefs.",
    ),
    description: t(
      "Mái ngói đỏ, hình tam giác, Neak và Kâyno đưa ngôn ngữ mỹ thuật Khmer vào một công trình bảo tàng hiện đại.",
      "Red tiles, triangular forms, Neak and Kayno bring Khmer visual language into a modern museum building.",
    ),
    tags: [
      t("Mái ngói", "Tiled roof"),
      t("Hoa văn", "Ornament"),
      t("Phù điêu", "Relief"),
    ],
    gallery: ["roof", "facade", "temple", "drum"],
    sources: ["objects", "museum"],
    related: ["pagoda", "faith", "performing"],
    paragraphs: [
      t(
        "Tòa nhà kết hợp công năng trưng bày hiện đại với mỹ thuật truyền thống Khmer Nam Bộ. Tài liệu tổng hợp giới thiệu kiến trúc sư Nguyễn Thế Truyền và nghệ nhân Lý Lết trong quá trình thiết kế, trang trí công trình.",
        "The building combines modern exhibition functions with Southern Khmer art. The supplied compilation credits architect Nguyen The Truyen and artisan Ly Let for its design and decoration.",
      ),
      t(
        "Các đường mái tam giác, ngói đỏ và hình tượng trang trí tạo nên diện mạo dễ nhận biết. Tư liệu về bảo tàng nhắc đến Kâyno dưới mái hiên; tài liệu tổng hợp còn gợi cách quan sát Neak và các hoa văn Khmer.",
        "Triangular roof lines, red tiles and decorative figures form its distinctive appearance. Museum accounts mention Kayno beneath the eaves; the supplied material also suggests looking for Neak and Khmer motifs.",
      ),
      t(
        "Phù điêu mặt tiền mô tả nhạc múa Chhay-dăm. Từ một chi tiết kiến trúc, người xem có thể đi tiếp đến bộ sưu tập nhạc cụ, mặt nạ và mô hình sân khấu ở tầng lầu.",
        "The facade relief depicts Chhay-dam music and dance. This architectural detail leads naturally to the instruments, masks and theatre models upstairs.",
      ),
    ],
    highlights: [
      highlight(
        "Từ xa đến gần",
        "From a distance to detail",
        "Nhìn tổng thể đường mái rồi mới đọc các chi tiết trang trí.",
        "Take in the roof silhouette before examining its ornament.",
      ),
      highlight(
        "Hình tượng và kết cấu",
        "Figures and structure",
        "Nhận ra cách hình tượng Khmer xuất hiện ở mái và hiên.",
        "Notice where Khmer figures appear on the roof and eaves.",
      ),
      highlight(
        "Âm nhạc trên mặt tiền",
        "Music on the facade",
        "Tìm nhịp chuyển động của đoàn múa Chhay-dăm trong phù điêu.",
        "Look for the rhythm of the Chhay-dam dancers in the relief.",
      ),
    ],
  },
  {
    id: "gardens",
    zone: "grounds",
    title: t("Khuôn viên cây xanh", "The green grounds"),
    location: t(
      "Không gian ngoài trời của bảo tàng",
      "The museum's outdoor setting",
    ),
    icon: "leaf",
    position: [70, 27],
    short: t(
      "Khoảng nghỉ giữa kiến trúc, hiện vật và ký ức.",
      "A pause between architecture, objects and memory.",
    ),
    description: t(
      "Khuôn viên khoảng một héc-ta tạo khoảng chuyển tiếp dịu mát giữa tòa nhà trưng bày, tháp tưởng niệm và quần thể di tích.",
      "Approximately one hectare of grounds provides a shaded transition between exhibitions, the memorial and nearby heritage sites.",
    ),
    tags: [
      t("Cây xanh", "Trees"),
      t("Ngoài trời", "Outdoors"),
      t("Quan sát", "Observe"),
    ],
    gallery: ["facade", "memorial", "roof"],
    sources: ["museum", "memorial"],
    related: ["memorial", "architecture", "pond"],
    paragraphs: [
      t(
        "Không gian cây xanh là phần mở đầu và cũng là khoảng nghỉ của hành trình tham quan. Từ bên ngoài có thể quan sát tỷ lệ công trình, sắc mái và mối liên hệ giữa bảo tàng với cảnh quan xung quanh.",
        "The green setting introduces the visit and offers a place to pause. From outside, observe the building's proportions, roof colours and relationship to its surroundings.",
      ),
      t(
        "Khuôn viên chứa những điểm có câu chuyện riêng, nổi bật là tháp tưởng niệm cụ Maha Sơn Thông. Từ câu chuyện của một con người, hành trình mở rộng đến những đóng góp của cộng đồng Khmer trong lịch sử hiện đại.",
        "The grounds contain distinct stories, notably the Maha Son Thong memorial. One person's story opens into the contributions of the Khmer community in modern history.",
      ),
      t(
        "Sau khi xem hiện vật trong nhà, hãy trở lại không gian ngoài trời để kết nối câu chuyện với đời sống cộng đồng. Có thể tiếp tục đến Ao Bà Om để quan sát mặt nước, bóng cây và một lớp ký ức dân gian khác của quần thể.",
        "Return outside after viewing the objects to connect the exhibits with community life. Continue to Ao Ba Om to observe the water, shade and another layer of folk memory in the heritage landscape.",
      ),
    ],
    highlights: [
      highlight(
        "Nhìn toàn cảnh",
        "Look at the whole setting",
        "Quan sát quan hệ giữa tòa nhà và khoảng sân cây xanh.",
        "Observe the relationship between the building and green open space.",
      ),
      highlight(
        "Một nhịp nghỉ",
        "A moment to pause",
        "Dùng khoảng ngoài trời để nối các chủ đề vừa khám phá.",
        "Use the outdoors to connect the themes you have explored.",
      ),
      highlight(
        "Điểm ký ức",
        "A place of memory",
        "Tháp tưởng niệm bổ sung câu chuyện về con người và lịch sử.",
        "The memorial adds a story of people and history.",
      ),
    ],
  },
  {
    id: "boat",
    zone: "grounds",
    title: t("Ghe Ngo & lễ hội", "Ngo boats & festivals"),
    location: t(
      "Chủ đề nối khuôn viên và trưng bày",
      "A theme linking grounds and displays",
    ),
    icon: "boat",
    position: [26, 72],
    short: t(
      "Từ mô hình Ghe Ngo đến sức mạnh cộng đồng.",
      "From a boat model to shared community effort.",
    ),
    description: t(
      "Mô hình Ghe Ngo gợi truyền thống đua thuyền, nhịp chèo tập thể và đời sống lễ hội của người Khmer Nam Bộ.",
      "The Ngo boat model evokes racing traditions, collective rowing and Southern Khmer festival life.",
    ),
    tags: [
      t("Ghe Ngo", "Ngo boat"),
      t("Ok Om Bok", "Ok Om Bok"),
      t("Cộng đồng", "Community"),
    ],
    gallery: ["boat", "pond", "drum", "ensemble"],
    sources: ["objects", "pond"],
    related: ["pond", "crafts", "performing"],
    paragraphs: [
      t(
        "Ghe Ngo là một biểu tượng nổi bật của lễ hội Khmer Nam Bộ. Tài liệu tổng hợp đặt chủ đề này trong hành trình khuôn viên; ảnh tư liệu hiện có xác nhận mô hình Ghe Ngo trưng bày trong nhà.",
        "Ngo boats are a prominent symbol of Southern Khmer festivals. The supplied guide includes this theme in the grounds route; the available photograph documents an indoor miniature.",
      ),
      t(
        "Hình dáng dài, hàng vị trí người chèo và các họa tiết trang trí cho thấy cả kỹ năng chế tác lẫn sự phối hợp tập thể. Khi quan sát mô hình, hãy thử hình dung nhịp chèo và vai trò của từng người trong đội.",
        "The long hull, rowing positions and decoration express both craftsmanship and collective coordination. Look at the model and imagine the rowing rhythm and each crew member's role.",
      ),
      t(
        "Câu chuyện liên hệ với Ok Om Bok, lễ cúng Trăng và đời sống sông nước. Không xác định Ao Bà Om là nơi diễn ra mọi cuộc đua Ghe Ngo; lịch và địa điểm thực tế cần theo chương trình lễ hội từng năm.",
        "The story connects with Ok Om Bok, moon offerings and waterway culture. Ao Ba Om is not identified here as the venue for every boat race; actual schedules and venues follow each year's programme.",
      ),
    ],
    highlights: [
      highlight(
        "Nhìn dáng ghe",
        "Observe the hull",
        "Đọc tỷ lệ thân ghe và cách bố trí người chèo trên mô hình.",
        "Look at hull proportions and rowing positions in the miniature.",
      ),
      highlight(
        "Nghề và mỹ thuật",
        "Craft and art",
        "Liên hệ hoa văn trên ghe với kỹ thuật chế tác truyền thống.",
        "Connect the boat ornament with traditional making skills.",
      ),
      highlight(
        "Một đội, một nhịp",
        "One crew, one rhythm",
        "Sự phối hợp là một phần ý nghĩa văn hóa của cuộc đua.",
        "Coordination is part of the cultural meaning of racing.",
      ),
    ],
  },
  {
    id: "memorial",
    zone: "grounds",
    title: t("Tháp Maha Sơn Thông", "Maha Son Thong memorial"),
    location: t("Trong khuôn viên bảo tàng", "Within the museum grounds"),
    icon: "building",
    position: [70, 72],
    short: t(
      "Không gian tri ân một nhân vật lịch sử Khmer.",
      "A place honouring a Khmer historical figure.",
    ),
    description: t(
      "Tháp trắng, đỏ và văn bia song ngữ kể về cuộc đời cụ Maha Sơn Thông (1910–1997), gắn ký ức cộng đồng với lịch sử hiện đại.",
      "The white and red tower and bilingual inscription commemorate Maha Son Thong (1910–1997), linking community memory with modern history.",
    ),
    tags: [
      t("Tưởng niệm", "Memory"),
      t("Song ngữ", "Bilingual"),
      t("Lịch sử", "History"),
    ],
    gallery: ["memorial", "khmerStele", "viStele", "facade"],
    sources: ["memorial"],
    related: ["gardens", "manuscripts", "entrance"],
    paragraphs: [
      t(
        "Tháp tưởng niệm cụ Maha Sơn Thông được xây dựng năm 2012 trong khuôn viên bảo tàng, theo tư liệu Bảo tàng Vĩnh Long. Công trình tôn vinh một vị lão thành cách mạng người Khmer và những đóng góp cho cộng đồng.",
        "According to Vinh Long Museum, the memorial was built in 2012 within the museum grounds. It honours a Khmer revolutionary elder and his contributions to the community.",
      ),
      t(
        "Cụ Maha Sơn Thông sống từ năm 1910 đến 1997. Danh xưng Maha gắn với quá trình học tập; cuộc đời cụ nối tri thức, hoạt động xã hội và lịch sử đấu tranh của đồng bào Khmer.",
        "Maha Son Thong lived from 1910 to 1997. The title Maha reflects learning; his life connects knowledge, social activity and Khmer communities' political history.",
      ),
      t(
        "Hai màu trắng, đỏ, hình tượng Naga và hoa văn Khmer tạo diện mạo cho tòa tháp. Văn bia tiếng Khmer và tiếng Việt giúp khách tham quan tiếp cận cùng một câu chuyện lịch sử qua hai ngôn ngữ.",
        "White and red finishes, Naga figures and Khmer ornament characterize the tower. Khmer and Vietnamese inscriptions make the same historical story accessible in two languages.",
      ),
    ],
    highlights: [
      highlight(
        "Hai ngôn ngữ",
        "Two languages",
        "So sánh bố cục văn bia Khmer và Việt trong bộ ảnh.",
        "Compare the Khmer and Vietnamese inscriptions in the gallery.",
      ),
      highlight(
        "Dấu ấn Khmer",
        "Khmer visual identity",
        "Quan sát hoa văn, Naga và màu sắc của công trình.",
        "Observe the ornament, Naga figures and building colours.",
      ),
      highlight(
        "Ký ức về con người",
        "Remembering a person",
        "Đọc di sản qua cuộc đời và đóng góp của một nhân vật cụ thể.",
        "Read heritage through one person's life and contributions.",
      ),
    ],
  },
  {
    id: "welcome",
    zone: "ground",
    title: t("Không gian đón tiếp", "The welcome area"),
    location: t(
      "Tầng trệt · khối chức năng",
      "Ground floor · visitor approach",
    ),
    icon: "people",
    position: [27, 50],
    short: t(
      "Điểm định hướng trước khi khám phá trưng bày.",
      "Orient your visit before exploring the displays.",
    ),
    description: t(
      "Tầng trệt kết hợp đón tiếp với các chức năng hành chính, nghiên cứu và bảo quản; khu trưng bày văn hóa chủ yếu nằm ở tầng lầu.",
      "The ground floor combines reception with administration, research and storage; the main cultural displays are upstairs.",
    ),
    tags: [
      t("Đón tiếp", "Welcome"),
      t("Định hướng", "Orientation"),
      t("Bảo quản", "Care"),
    ],
    gallery: ["facade", "roof", "exhibition"],
    sources: ["museum"],
    related: ["stairs", "faith", "daily-life"],
    paragraphs: [
      t(
        "Tư liệu Bảo tàng Lịch sử Quốc gia mô tả tầng trệt là khối chức năng của bảo tàng: văn phòng, nghiên cứu, bảo quản và đón tiếp. Vì vậy không coi mọi không gian ở tầng này là phòng trưng bày tự do cho khách.",
        "The National Museum of History describes the ground floor as housing offices, research, collection storage and reception. These functions should not all be treated as unrestricted exhibition rooms.",
      ),
      t(
        "Đây là lúc xác định chủ đề muốn tìm hiểu và lối lên tầng lầu. Có thể bắt đầu với tín ngưỡng, đời sống phum sóc, nghề truyền thống hoặc nghệ thuật diễn xướng.",
        "Use this point to choose a topic and find the upper-floor approach. Begin with belief, village life, traditional crafts or performing arts.",
      ),
      t(
        "Những công việc phía sau trưng bày giúp hiện vật được gìn giữ và câu chuyện được nghiên cứu. Một hiện vật đến với người xem qua nhiều bước sưu tầm, bảo quản và diễn giải; đó cũng là một phần giá trị của bảo tàng.",
        "Work behind the displays preserves objects and researches their stories. Collection, care and interpretation bring each object to visitors and form part of the museum's value.",
      ),
    ],
    highlights: [
      highlight(
        "Chọn một chủ đề",
        "Choose a topic",
        "Bốn mạch văn hóa giúp định hướng hành trình ở tầng lầu.",
        "Four cultural strands help organize an upstairs visit.",
      ),
      highlight(
        "Phía sau trưng bày",
        "Behind the displays",
        "Nghiên cứu và bảo quản là phần thiết yếu của một bảo tàng.",
        "Research and collection care are essential museum functions.",
      ),
      highlight(
        "Bắt đầu từ kiến trúc",
        "Start with architecture",
        "Mặt tiền và lối lên đã giới thiệu nhiều dấu ấn văn hóa Khmer.",
        "The facade and approach already introduce Khmer cultural motifs.",
      ),
    ],
  },
  {
    id: "stairs",
    zone: "ground",
    title: t("Cầu thang & hồ bán nguyệt", "Stairway & semicircular pond"),
    location: t(
      "Chuyển tiếp từ tầng trệt lên tầng lầu",
      "Transition to the upper-floor displays",
    ),
    icon: "steps",
    position: [71, 50],
    short: t(
      "Khoảng chuyển tiếp trước hành trình hiện vật.",
      "A transition before your object journey.",
    ),
    description: t(
      "Lối lên nối khu đón tiếp với trưng bày; tư liệu năm 2008 mô tả hồ cá bán nguyệt dưới chân cầu thang.",
      "The approach connects reception and exhibits; a 2008 account describes a semicircular fish pond at the stairway's base.",
    ),
    tags: [
      t("Lối lên", "Approach"),
      t("Mặt nước", "Water"),
      t("Kiến trúc", "Architecture"),
    ],
    gallery: ["roof", "facade", "exhibition"],
    sources: ["museum", "objects"],
    related: ["welcome", "architecture", "faith"],
    paragraphs: [
      t(
        "Cầu thang tổ chức sự chuyển tiếp từ tầng trệt lên không gian trưng bày ở tầng lầu. Thay vì xem đây chỉ là lối di chuyển, hãy quan sát đường mái, khoảng mở và các chi tiết trang trí quanh lối lên.",
        "The stairway organizes the transition from the ground floor to the upper displays. Look beyond circulation to the roof lines, openings and ornament around the approach.",
      ),
      t(
        "Bài viết năm 2008 ghi nhận một hồ cá bán nguyệt dưới chân cầu thang. Đây là mô tả tư liệu tại thời điểm bài viết; bộ ảnh hiện có không xác nhận riêng hình dáng hay tình trạng hiện nay của hồ.",
        "The 2008 article records a semicircular fish pond at the stairway's base. This is a historical description; the available photographs do not separately verify the pond's current form or condition.",
      ),
      t(
        "Sau khoảng chuyển tiếp này, hành trình tiếp tục bằng các nhóm tín ngưỡng, khảo cổ, chữ viết, đời sống và nghệ thuật. Chọn một hiện vật gây tò mò, rồi mở rộng sang các câu chuyện liên quan là một cách khám phá tự nhiên.",
        "Continue with belief, archaeology, writing, daily life and the arts. Choose an object that makes you curious, then follow its related stories.",
      ),
    ],
    highlights: [
      highlight(
        "Một điểm chuyển nhịp",
        "A change of pace",
        "Từ sân ngoài trời sang không gian đọc hiện vật trong nhà.",
        "Move from the outdoor setting into an object-reading space.",
      ),
      highlight(
        "Mặt nước trong tư liệu",
        "Water in the archive",
        "Hồ bán nguyệt được ghi nhận trong bài giới thiệu năm 2008.",
        "The semicircular pond is recorded in the 2008 account.",
      ),
      highlight(
        "Tiếp nối câu chuyện",
        "Continue the story",
        "Chọn một chủ đề tầng lầu để bắt đầu khám phá sâu hơn.",
        "Choose an upper-floor topic to begin a deeper exploration.",
      ),
    ],
  },
  {
    id: "faith",
    zone: "upper",
    title: t("Tôn giáo & tín ngưỡng", "Religion & belief"),
    location: t("Tầng lầu · chủ đề tín ngưỡng", "Upper floor · faith displays"),
    icon: "faith",
    position: [19, 23],
    short: t(
      "Phật giáo Nam tông trong đời sống Khmer.",
      "Theravada Buddhism in Khmer everyday life.",
    ),
    description: t(
      "Mô hình chùa, tượng Phật và không gian thuyết pháp giúp đọc mối liên hệ giữa tín ngưỡng, mỹ thuật và cộng đồng.",
      "Temple models, Buddha figures and the preaching chair reveal connections between belief, art and community.",
    ),
    tags: [
      t("Nam tông", "Theravada"),
      t("Tượng Phật", "Buddha"),
      t("Chùa Khmer", "Temples"),
    ],
    gallery: ["exhibition", "buddha", "temple", "chair"],
    sources: ["museum", "objects"],
    related: ["chair", "pagoda", "archaeology"],
    paragraphs: [
      t(
        "Tôn giáo và tín ngưỡng là một mạch trưng bày quan trọng. Phật giáo Nam tông gắn với sinh hoạt cộng đồng, học tập và nhiều hình thức mỹ thuật của người Khmer Nam Bộ.",
        "Religion and belief are an important exhibition strand. Theravada Buddhism connects community life, learning and many forms of Southern Khmer art.",
      ),
      t(
        "Mô hình kiến trúc chùa, tượng Phật và ghế thuyết pháp cho thấy các vật dụng không tách rời chức năng văn hóa của chúng. Những tài liệu tổng hợp còn giới thiệu tín ngưỡng Néak Tà như một lớp sinh hoạt dân gian bên cạnh Phật giáo.",
        "Temple models, Buddha statues and the preaching chair show objects alongside their cultural functions. The supplied guide also introduces Neak Ta belief as a folk practice alongside Buddhism.",
      ),
      t(
        "Có thể đối chiếu không gian trưng bày với chùa Âng gần bảo tàng. Quan sát chất liệu, tư thế tượng và cách tổ chức không gian thay vì chỉ ghi nhớ tên hiện vật.",
        "Compare the displays with nearby Ang Pagoda. Observe materials, figure postures and spatial organization rather than only memorizing object names.",
      ),
    ],
    highlights: [
      highlight(
        "Mỹ thuật có chức năng",
        "Art with a purpose",
        "Tượng và đồ thờ gắn với thực hành tín ngưỡng cụ thể.",
        "Figures and ritual objects relate to specific practices.",
      ),
      highlight(
        "Chùa và cộng đồng",
        "Pagoda and community",
        "Chùa đồng thời là môi trường gìn giữ chữ viết và tri thức.",
        "The pagoda also preserves writing and learning.",
      ),
      highlight(
        "Đọc bằng đối chiếu",
        "Learn by comparison",
        "Kết nối mô hình trong bảo tàng với kiến trúc chùa Âng.",
        "Connect museum models with Ang Pagoda's architecture.",
      ),
    ],
  },
  {
    id: "chair",
    zone: "upper",
    title: t("Ghế thuyết pháp", "The preaching chair"),
    location: t("Tầng lầu · chủ đề tín ngưỡng", "Upper floor · faith displays"),
    icon: "faith",
    position: [47, 18],
    short: t(
      "Hiện vật gỗ chạm khắc hơn một thế kỷ tuổi.",
      "An ornamented wooden object over a century old.",
    ),
    description: t(
      "Chiếc ghế dành cho hoạt động giảng kinh cho thấy sự gặp gỡ giữa kỹ thuật chạm khắc, mỹ thuật và truyền dạy tri thức.",
      "The chair used for preaching connects carving skills, religious art and the transmission of knowledge.",
    ),
    tags: [
      t("Chạm khắc", "Carving"),
      t("Giảng kinh", "Teaching"),
      t("100+ năm", "100+ years"),
    ],
    gallery: ["chair", "exhibition", "buddha"],
    sources: ["objects", "museum"],
    related: ["faith", "manuscripts", "crafts"],
    paragraphs: [
      t(
        "Ghế thuyết pháp là một điểm nhấn của bộ sưu tập. Tư liệu ảnh năm 2023 giới thiệu chiếc ghế có tuổi đời hơn 100 năm; tài liệu tổng hợp mô tả kỹ thuật chạm khắc gỗ và trang trí thếp vàng.",
        "The preaching chair is a collection highlight. The 2023 essay describes it as over 100 years old; the supplied guide describes carved wood and gilded decoration.",
      ),
      t(
        "Hiện vật gắn với việc giảng kinh của các vị sư. Chức năng này giúp giải thích vị trí cao, hình dáng và sự chăm chút dành cho phần trang trí.",
        "The object relates to monks' preaching. This function helps explain its elevated form and the attention given to its decoration.",
      ),
      t(
        "Hãy xem ảnh riêng của chiếc ghế rồi trở lại ảnh toàn cảnh phòng. Sự thay đổi góc nhìn giúp hiểu cả chi tiết thủ công và vai trò của hiện vật trong không gian trưng bày.",
        "View the individual chair photograph, then return to the wider gallery image. The change of scale reveals both craft detail and the object's role in the display.",
      ),
    ],
    highlights: [
      highlight(
        "Nhìn chất liệu",
        "Look at material",
        "Tìm những phần gỗ, màu trang trí và dấu vết thời gian.",
        "Look for wood, decorative finishes and traces of time.",
      ),
      highlight(
        "Nhìn công năng",
        "Look at function",
        "Liên hệ hình dáng của ghế với hoạt động giảng kinh.",
        "Relate the chair's form to its use in preaching.",
      ),
      highlight(
        "Nhìn trong bối cảnh",
        "Look in context",
        "Ảnh toàn cảnh đặt chiếc ghế bên cạnh các hiện vật tín ngưỡng.",
        "The wider image places the chair beside other religious objects.",
      ),
    ],
  },
  {
    id: "archaeology",
    zone: "upper",
    title: t("Dấu tích khảo cổ", "Archaeological traces"),
    location: t(
      "Tầng lầu · lịch sử và giao lưu văn hóa",
      "Upper floor · history and cultural exchange",
    ),
    icon: "building",
    position: [76, 23],
    short: t(
      "Đọc lịch sử qua sa thạch và hình tượng tôn giáo.",
      "Read history through sandstone and religious forms.",
    ),
    description: t(
      "Hiện vật khảo cổ và tượng đá gợi các lớp lịch sử, tín ngưỡng và giao lưu văn hóa ở vùng Trà Cú – Trà Vinh.",
      "Archaeological objects and stone figures evoke layers of history, belief and exchange in the Tra Cu–Tra Vinh area.",
    ),
    tags: [
      t("Sa thạch", "Sandstone"),
      t("Lưu Cừ", "Luu Cu"),
      t("Giao lưu", "Exchange"),
    ],
    gallery: ["sandstone", "buddha", "exhibition"],
    sources: ["objects", "archaeology"],
    related: ["faith", "chair", "manuscripts"],
    paragraphs: [
      t(
        "Tài liệu tổng hợp kết nối chủ đề khảo cổ với Lưu Cừ và sự giao thoa của các truyền thống tôn giáo. Bộ ảnh năm 2023 giới thiệu một hiện vật sa thạch tìm thấy ở Lưu Nghiệp Anh, ghi niên đại thế kỷ VII–VIII, và tượng Phật đá thế kỷ XIX.",
        "The supplied guide connects archaeology with Luu Cu and interacting religious traditions. The 2023 essay presents a sandstone object from Luu Nghiep Anh dated to the 7th–8th centuries and a 19th-century stone Buddha.",
      ),
      t(
        "Các hiện vật cần được đọc riêng theo xuất xứ và niên đại, thay vì gộp tất cả thành một bộ sưu tập cùng tuổi. Chất liệu, hình khối và chức năng tôn giáo là những đầu mối để nhận ra sự khác biệt.",
        "Read each object by its provenance and date rather than assigning one age to the whole collection. Material, shape and religious use provide clues to their differences.",
      ),
      t(
        "Linga–Yoni Lưu Cừ II là một câu chuyện liên quan của vùng, được công nhận bảo vật quốc gia năm 2016. Nguồn Bảo tàng Vĩnh Long xác định đơn vị lưu giữ là Bảo tàng tỉnh Vĩnh Long; trang này không khẳng định bảo vật đang trưng bày thường trực tại Bảo tàng Văn hóa Khmer.",
        "The Luu Cu II Linga–Yoni is a related regional story, recognized as a national treasure in 2016. Vinh Long Museum identifies the provincial museum as its custodian; this page does not claim it is permanently displayed at the Khmer Cultural Museum.",
      ),
    ],
    highlights: [
      highlight(
        "Mỗi hiện vật một niên đại",
        "Each object has its own date",
        "Đối chiếu tượng Phật thế kỷ XIX với hiện vật sa thạch sớm hơn.",
        "Compare the 19th-century Buddha with the earlier sandstone object.",
      ),
      highlight(
        "Xuất xứ quan trọng",
        "Provenance matters",
        "Phân biệt Lưu Nghiệp Anh, di chỉ Lưu Cừ II và nơi lưu giữ hiện vật.",
        "Distinguish Luu Nghiep Anh, Luu Cu II and the object's custodian.",
      ),
      highlight(
        "Các lớp tín ngưỡng",
        "Layers of belief",
        "Hình tượng tôn giáo giúp tìm hiểu quá trình giao lưu văn hóa.",
        "Religious forms help explain cultural exchange.",
      ),
    ],
  },
  {
    id: "manuscripts",
    zone: "upper",
    title: t("Chữ Khmer & kinh lá buông", "Khmer writing & palm-leaf texts"),
    location: t(
      "Tầng lầu · chủ đề tri thức",
      "Upper floor · knowledge traditions",
    ),
    icon: "book",
    position: [19, 69],
    short: t(
      "Chữ viết gìn giữ tri thức qua nhiều thế hệ.",
      "Writing carries knowledge across generations.",
    ),
    description: t(
      "Satra, chữ Khmer và truyền thống học tại chùa nối giáo lý, truyện dân gian và ký ức cộng đồng.",
      "Satra, Khmer writing and pagoda learning connect teachings, folk narratives and shared memory.",
    ),
    tags: [
      t("Chữ Khmer", "Khmer script"),
      t("Satra", "Satra"),
      t("Tri thức", "Knowledge"),
    ],
    gallery: ["temple", "exhibition", "chair"],
    sources: ["museum"],
    related: ["pagoda", "chair", "memorial"],
    paragraphs: [
      t(
        "Kinh lá buông, thường được nhắc đến với tên Satra, là một phương tiện lưu giữ văn bản trong văn hóa Khmer. Tài liệu tổng hợp giới thiệu giáo lý, truyện kể và tri thức dân gian như những mạch nội dung gắn với truyền thống này.",
        "Palm-leaf texts, often called Satra, are a medium for preserving Khmer writing. The supplied guide introduces religious teachings, narratives and folk knowledge associated with this tradition.",
      ),
      t(
        "Việc học chữ Khmer gắn với môi trường chùa và vai trò truyền dạy của các vị sư. Câu chuyện chữ viết vì thế liên hệ trực tiếp với mô hình chùa, ghế thuyết pháp và chủ đề tín ngưỡng.",
        "Khmer literacy is linked to pagoda learning and monks' teaching. The writing story therefore connects with temple models, the preaching chair and the faith theme.",
      ),
      t(
        "Bộ ảnh của điểm này minh họa bối cảnh truyền dạy tri thức qua mô hình chùa, không gian tín ngưỡng và ghế thuyết pháp. Từ đó có thể đối chiếu với văn bia song ngữ tại tháp Maha Sơn Thông, nơi chữ viết tiếp tục gìn giữ ký ức về con người.",
        "The gallery illustrates knowledge transmission through a temple model, faith displays and the preaching chair. Compare these with the bilingual memorial inscriptions, where writing preserves the memory of a person.",
      ),
    ],
    highlights: [
      highlight(
        "Vật liệu và tri thức",
        "Material and knowledge",
        "Lá buông là vật mang chữ, gắn kỹ thuật thủ công với việc lưu giữ văn bản.",
        "Palm leaves carry writing, connecting craft with textual preservation.",
      ),
      highlight(
        "Vai trò của chùa",
        "The pagoda's role",
        "Liên hệ học chữ, giảng kinh và đời sống cộng đồng.",
        "Connect literacy, preaching and community life.",
      ),
      highlight(
        "Ký ức song ngữ",
        "Bilingual memory",
        "Văn bia tại tháp Maha Sơn Thông là điểm đối chiếu về chữ Khmer và tiếng Việt.",
        "The memorial inscriptions offer a comparison of Khmer and Vietnamese writing.",
      ),
    ],
  },
  {
    id: "daily-life",
    zone: "upper",
    title: t("Đời sống phum sóc", "Life in the phum and soc"),
    location: t(
      "Tầng lầu · văn hóa vật chất",
      "Upper floor · material culture",
    ),
    icon: "people",
    position: [47, 60],
    short: t(
      "Gian bếp, trang phục và nông ngư cụ quen thuộc.",
      "Kitchens, clothing, farming and fishing tools.",
    ),
    description: t(
      "Mô hình phum sóc và đồ dùng thường ngày kể về lao động, gia đình và cách người Khmer thích nghi với môi trường Nam Bộ.",
      "Village models and everyday objects tell stories of work, family and adaptation to Southern Vietnam's environment.",
    ),
    tags: [
      t("Gian bếp", "Kitchen"),
      t("Nông ngư cụ", "Work tools"),
      t("Trang phục", "Clothing"),
    ],
    gallery: ["kitchen", "farm", "fishing", "clothing", "village"],
    sources: ["objects", "museum"],
    related: ["crafts", "boat", "performing"],
    paragraphs: [
      t(
        "Đời sống thường nhật được kể qua mô hình cư trú, gian bếp, trang phục và dụng cụ sản xuất. Phum sóc là không gian cộng đồng nơi lao động, sinh hoạt và các quan hệ gia đình cùng diễn ra.",
        "Everyday life is presented through settlement models, kitchens, clothing and work tools. The phum and soc are community settings where labour, domestic life and family relationships meet.",
      ),
      t(
        "Nông cụ bằng gỗ và ngư cụ đan tre cho thấy kinh nghiệm với ruộng đồng, nguồn nước và vật liệu sẵn có. Gian bếp đất đặt kỹ thuật ấy vào nhịp sống gia đình, gần gũi hơn một danh sách hiện vật riêng lẻ.",
        "Wooden farming tools and woven fishing equipment reveal knowledge of fields, water and local materials. The earthen kitchen places that knowledge within domestic routines.",
      ),
      t(
        "Bộ ảnh cho phép đi từ không gian chung đến chi tiết: xem mô hình làng, rồi quan sát gian bếp, đồ đánh bắt và trang phục. Tài liệu tổng hợp cũng gợi các nghi lễ gia đình như cưới hỏi, nhưng bộ ảnh hiện có không tái hiện đầy đủ một nghi lễ.",
        "Move from the village model to kitchen details, fishing tools and clothing. The supplied guide also discusses family ceremonies such as weddings; the available photographs do not reconstruct an entire ceremony.",
      ),
    ],
    highlights: [
      highlight(
        "Nhìn gian bếp",
        "Look at the kitchen",
        "Đọc hình dáng bếp đất và đồ dùng trong một không gian chung.",
        "Read the earthen stoves and utensils as a connected domestic space.",
      ),
      highlight(
        "Tri thức lao động",
        "Knowledge in work",
        "Công cụ cho biết cách xử lý lúa và khai thác môi trường sông nước.",
        "Tools reveal rice-processing skills and knowledge of waterways.",
      ),
      highlight(
        "Con người trong hiện vật",
        "People behind objects",
        "Hình dung người sử dụng và công việc gắn với mỗi đồ dùng.",
        "Imagine the user and task associated with each object.",
      ),
    ],
  },
  {
    id: "crafts",
    zone: "upper",
    title: t("Nghề truyền thống", "Traditional crafts"),
    location: t(
      "Tầng lầu · thủ công và tri thức dân gian",
      "Upper floor · craft and folk knowledge",
    ),
    icon: "craft",
    position: [76, 69],
    short: t(
      "Từ tre, gỗ và sợi đến đồ dùng, hoa văn.",
      "From bamboo, wood and fibres to tools and ornament.",
    ),
    description: t(
      "Đan lát, dệt, chế tác gỗ và làm cốm dẹp cho thấy mối liên hệ giữa vật liệu, kỹ năng và đời sống lễ hội.",
      "Weaving, woodwork and flattened-rice making connect materials, skills and festival life.",
    ),
    tags: [
      t("Đan lát", "Weaving"),
      t("Chế tác", "Making"),
      t("Cốm dẹp", "Flattened rice"),
    ],
    gallery: ["fishing", "farm", "clothing", "chair"],
    sources: ["museum", "objects"],
    related: ["daily-life", "chair", "boat"],
    paragraphs: [
      t(
        "Nghề truyền thống gắn với các vật liệu quen thuộc như tre, gỗ và sợi. Tài liệu tổng hợp giới thiệu dệt, đan lát, chế tác đồ dùng và chạm khắc như những mạch kỹ thuật của đời sống Khmer.",
        "Traditional crafts use familiar materials such as bamboo, wood and fibres. The supplied guide introduces weaving, tool making and carving as strands of Khmer practical knowledge.",
      ),
      t(
        "Ngư cụ đan tre, nông cụ gỗ, trang phục và ghế thuyết pháp cho thấy kỹ năng thủ công phục vụ nhiều mục đích khác nhau. Hãy nhìn các mối ghép, đường đan và hoa văn để nhận ra sự khác biệt giữa đồ lao động và đồ nghi lễ.",
        "Woven fishing equipment, wooden farm tools, clothing and the preaching chair show craft serving different purposes. Examine joints, weaving patterns and ornament to distinguish work tools from ceremonial objects.",
      ),
      t(
        "Cốm dẹp nối tri thức chế biến nông sản với lễ cúng Trăng Ok Om Bok. Cối, chày và nhịp lao động tập thể cho thấy đồ dùng thường ngày có thể trở thành một phần của nghi thức và ký ức lễ hội.",
        "Flattened rice connects food-processing knowledge with Ok Om Bok moon offerings. Mortars, pestles and shared labour show how everyday tools become part of ritual and festival memory.",
      ),
    ],
    highlights: [
      highlight(
        "Nhìn vật liệu",
        "Read the materials",
        "Tre, gỗ và sợi gợi cách sử dụng nguồn lực địa phương.",
        "Bamboo, wood and fibres reveal the use of local resources.",
      ),
      highlight(
        "Nhìn kỹ thuật",
        "Read the technique",
        "Chú ý đường đan, cách ghép và các phần chạm khắc.",
        "Notice weaving, joints and carved elements.",
      ),
      highlight(
        "Từ lao động đến lễ hội",
        "From work to festival",
        "Cốm dẹp và Ghe Ngo cho thấy kỹ thuật có đời sống văn hóa riêng.",
        "Flattened rice and Ngo boats give practical skills a cultural life.",
      ),
    ],
  },
  {
    id: "performing",
    zone: "upper",
    title: t("Nghệ thuật diễn xướng", "Performing arts"),
    location: t(
      "Tầng lầu · âm nhạc và sân khấu",
      "Upper floor · music and theatre",
    ),
    icon: "music",
    position: [47, 87],
    short: t(
      "Ngũ âm, Chhay-dăm, Rô băm và Dù kê.",
      "Pinpeat, Chhay-dam, Robam and Du ke.",
    ),
    description: t(
      "Nhạc cụ, mặt nạ và sân khấu mô hình giới thiệu một thế giới biểu diễn phong phú, gắn với nghi lễ và lễ hội Khmer.",
      "Instruments, masks and stage models introduce a rich performance world connected with Khmer ceremonies and festivals.",
    ),
    tags: [
      t("Ngũ âm", "Pinpeat"),
      t("Mặt nạ", "Masks"),
      t("Sân khấu", "Theatre"),
    ],
    gallery: ["ensemble", "drum", "duke", "mask"],
    sources: ["objects", "museum"],
    related: ["architecture", "boat", "daily-life"],
    paragraphs: [
      t(
        "Không gian nghệ thuật tập hợp nhạc cụ, trang phục, mặt nạ và mô hình sân khấu. Dàn nhạc ngũ âm, còn gọi là Pinpeat, gắn các chất liệu phát âm với những vai trò khác nhau trong hòa tấu.",
        "The performing-arts display brings together instruments, costumes, masks and stage models. The Pinpeat ensemble combines sounding materials with different musical roles.",
      ),
      t(
        "Chhay-dăm gợi nhịp trống và chuyển động cộng đồng; Rô băm sử dụng hình tượng nhân vật và mỹ thuật sân khấu; Dù kê kết hợp ca, diễn xuất và kể chuyện. Mỗi loại hình có ngôn ngữ biểu đạt riêng, không phải các tên gọi thay thế nhau.",
        "Chhay-dam evokes drum rhythm and communal movement; Robam uses theatrical characters and visual art; Du ke combines singing, acting and storytelling. These are distinct performance forms.",
      ),
      t(
        "Hãy xem toàn cảnh nhạc cụ, rồi chuyển sang mô hình múa, sân khấu Dù kê và mặt nạ. Chú ý hình dáng, chất liệu và trang phục để nhận ra cách âm nhạc, chuyển động và mỹ thuật sân khấu phối hợp trong từng loại hình.",
        "View the ensemble, then the dance display, Du ke stage and masks. Observe form, material and costume to understand how music, movement and theatrical art work together.",
      ),
    ],
    highlights: [
      highlight(
        "Chất liệu tạo âm",
        "Materials create sound",
        "Phân biệt trống, nhạc cụ gõ và hơi trong không gian ngũ âm.",
        "Distinguish drums, struck instruments and wind instruments.",
      ),
      highlight(
        "Mặt nạ kể nhân vật",
        "Masks tell character",
        "Quan sát nét mặt, màu sắc và hình khối sân khấu.",
        "Observe expressions, colours and theatrical shapes.",
      ),
      highlight(
        "Di sản trong sinh hoạt",
        "Heritage in practice",
        "Liên hệ nghệ thuật với lễ hội và đời sống của phum sóc.",
        "Connect the arts with festivals and village life.",
      ),
    ],
  },
];

export const normalizePlaceQuery = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
export function findKhmerPlace(id: string) {
  return khmerPlaces.find((place) => place.id === id) ?? khmerPlaces[0];
}
