// Editorial content from the user's btvhkm.docx. Source links document the
// differing historical dates, collection counts and current locality name.
export const khmerOverviewSources = {
  locality: {
    title: "Cổng thông tin tỉnh Vĩnh Long",
    url: "https://vinhlong.gov.vn/Portals/0/Documents/DiaDanh/PDF/B%E1%BA%A3o%20t%C3%A0ng%20v%C4%83n%20h%C3%B3a%20d%C3%A2n%20t%E1%BB%99c%20Khmer.pdf?ver=Hm5_GnD7N35VYzuvIQrc0Q%3D%3D",
  },
  museum: {
    title: "Bảo tàng Lịch sử Quốc gia",
    url: "https://baotanglichsu.vn/VI/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html",
  },
  history: {
    title: "Thông tấn xã Việt Nam · 2022",
    url: "https://dantocmiennui.baotintuc.vn/bao-tang-van-hoa-dan-toc-khmer-tra-vinh-don-gan-9000-luot-khach-dip-le-hoi-ok-om-bok-post327654.html",
  },
  collections: {
    title: "Bộ Văn hóa, Thể thao và Du lịch · 2024",
    url: "https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-lay-van-hoa-khmer-lam-don-bay-cho-du-lich-20241106084309683.htm",
  },
};

type Copy = { vi: string; en: string };
const copy = (vi: string, en: string): Copy => ({ vi, en });
export type KhmerOverviewTopic =
  | "introduction"
  | "collections"
  | "identity"
  | "architecture"
  | "performing"
  | "everyday"
  | "route"
  | "learning"
  | "location";

export const khmerOverview = {
  eyebrow: copy("TỔNG QUAN · TRÀ VINH", "SITE OVERVIEW · TRÀ VINH"),
  title: { vi: ["BẢO TÀNG", "KHMER"], en: ["KHMER", "MUSEUM"] },
  fullName: copy(
    "Bảo tàng Văn hóa Dân tộc Khmer Trà Vinh",
    "Trà Vinh Museum of Khmer Culture",
  ),
  subtitle: copy(
    "KÝ ỨC VĂN HÓA KHMER NAM BỘ",
    "MEMORIES OF SOUTHERN KHMER CULTURE",
  ),
  description: copy(
    "Bảo tàng Văn hóa Dân tộc Khmer Trà Vinh lưu giữ những câu chuyện về tín ngưỡng, đời sống, làng nghề và nghệ thuật Khmer Nam Bộ. Nằm cạnh Ao Bà Om và Chùa Âng, nơi đây kết nối hiện vật với một không gian văn hóa còn tiếp nối.",
    "Trà Vinh Museum of Khmer Culture preserves stories of belief, everyday life, craftsmanship and the arts of southern Khmer communities. Beside Ba Om Pond and Ang Pagoda, its collections connect objects with the living cultural landscape around them.",
  ),
  preview: copy(
    "Từ kinh lá Buông đến dàn nhạc Ngũ âm, khám phá văn hóa Khmer trong không gian xanh bên Ao Bà Om và Chùa Âng.",
    "From palm-leaf manuscripts to the Pinpeat ensemble, discover Khmer culture beside Ba Om Pond and Ang Pagoda.",
  ),
  explore: copy("XEM TRƯNG BÀY", "VIEW COLLECTIONS"),
  readMore: copy("GIỚI THIỆU", "INTRODUCTION"),
  introCaption: copy("Văn hóa · Con người", "Culture · Community"),
  noteTitle: copy("DI SẢN KHMER NAM BỘ", "SOUTHERN KHMER HERITAGE"),
  note: copy(
    "Một bảo tàng, nhiều lớp ký ức về đời sống và bản sắc cộng đồng.",
    "One museum, many layers of community life and cultural identity.",
  ),
  noteAction: copy("CÂU CHUYỆN BẢO TÀNG", "THE MUSEUM'S STORY"),
  highlightsTitle: copy("ĐIỀU LÀM NÊN BẢN SẮC", "WHAT MAKES IT DISTINCTIVE"),
  visitTitle: copy("VÌ SAO NÊN KHÁM PHÁ", "WHY EXPLORE"),
  locationTitle: copy("TRÀ VINH", "TRÀ VINH"),
  locationLabel: copy("Nguyệt Hóa · Vĩnh Long", "Nguyệt Hóa · Vĩnh Long"),
  locationAction: copy("Xem vị trí bảo tàng", "View the museum location"),
};

export const khmerOverviewFacts = [
  {
    icon: "map",
    value: "~1 ha",
    label: copy("KHUÔN VIÊN", "MUSEUM GROUNDS"),
    text: copy(
      "Khoảng 10.000 m², rợp bóng cây xanh.",
      "Around 10,000 m² of leafy grounds.",
    ),
  },
  {
    icon: "building",
    value: ">1.700 m²",
    label: copy("DIỆN TÍCH SỬ DỤNG", "BUILDING FLOOR AREA"),
    text: copy(
      "Khối nhà hai tầng; trưng bày chính ở tầng lầu.",
      "Two storeys, with the main displays upstairs.",
    ),
  },
  {
    icon: "collection",
    value: "800+",
    label: copy("HIỆN VẬT & TƯ LIỆU", "OBJECTS & DOCUMENTS"),
    text: copy(
      "Ký ức về tín ngưỡng, lao động và nghệ thuật.",
      "Stories of belief, work and the arts.",
    ),
  },
  {
    icon: "people",
    value: copy("4 chủ đề", "4 themes"),
    label: copy("VĂN HÓA KHMER", "KHMER CULTURE"),
    text: copy(
      "Tâm linh, đời sống, làng nghề và nghệ thuật.",
      "Belief, daily life, crafts and performing arts.",
    ),
  },
] as const;

export const khmerOverviewHighlights = [
  {
    id: "identity",
    icon: "book",
    photo: "khmer-temple-model",
    title: copy("BẢN SẮC ĐƯỢC TRAO TRUYỀN", "A HERITAGE PASSED ON"),
    text: copy(
      "Tín ngưỡng, chữ viết và tri thức kết nối nhiều thế hệ Khmer.",
      "Belief, writing and knowledge connect Khmer generations.",
    ),
  },
  {
    id: "architecture",
    icon: "building",
    photo: "khmer-facade",
    title: copy("KIẾN TRÚC GIAO HÒA", "ARCHITECTURE IN DIALOGUE"),
    text: copy(
      "Đường nét Khmer truyền thống trong một công trình bảo tàng hiện đại.",
      "Traditional Khmer forms meet a modern museum building.",
    ),
  },
  {
    id: "performing",
    icon: "music",
    photo: "khmer-pinpeat",
    title: copy("NGHỆ THUẬT CÒN TIẾP NỐI", "ARTS THAT LIVE ON"),
    text: copy(
      "Ngũ âm, Rô-băm và Dù kê đưa hiện vật đến gần sân khấu, lễ hội.",
      "Pinpeat, Robam and Du ke connect objects with theatre and festivals.",
    ),
  },
] as const;

export const khmerOverviewVisitReasons = [
  {
    id: "everyday",
    icon: "people",
    photo: "khmer-tools",
    title: copy("HIỂU MỘT ĐỜI SỐNG", "UNDERSTAND EVERYDAY LIFE"),
    text: copy(
      "Từ nông ngư cụ đến trang phục, nhìn văn hóa qua những điều gần gũi.",
      "Explore culture through familiar tools, clothing and household objects.",
    ),
  },
  {
    id: "route",
    icon: "leaf",
    photo: "khmer-facade",
    title: copy("KẾT NỐI BA ĐIỂM ĐẾN", "THREE CONNECTED PLACES"),
    text: copy(
      "Bảo tàng, Ao Bà Om và Chùa Âng tạo nên một hành trình văn hóa.",
      "The museum, Ba Om Pond and Ang Pagoda form a shared cultural landscape.",
    ),
  },
  {
    id: "learning",
    icon: "compass",
    photo: "khmer-visitors",
    title: copy("HỌC TỪ NHỮNG HIỆN VẬT", "LEARN THROUGH OBJECTS"),
    text: copy(
      "Một không gian học tập và nghiên cứu về ký ức cộng đồng Khmer.",
      "A place to learn and research the memories of Khmer communities.",
    ),
  },
] as const;

export const khmerOverviewGallery = [
  {
    photo: "khmer-temple-model",
    title: copy("KHÔNG GIAN TÂM LINH", "SPIRITUAL LIFE"),
    caption: copy(
      "Mô hình chùa giúp tìm hiểu vai trò của Phật giáo Nam tông Khmer.",
      "A temple model introduces Khmer Theravada Buddhist life.",
    ),
    alt: copy(
      "Khách nghe thuyết minh bên mô hình chùa Khmer tại bảo tàng",
      "Visitors viewing a Khmer temple model at the museum",
    ),
  },
  {
    photo: "khmer-tools",
    title: copy("ĐỜI SỐNG THƯỜNG NHẬT", "EVERYDAY LIFE"),
    caption: copy(
      "Dụng cụ đánh bắt thủy sản gắn với sinh kế miền sông nước.",
      "Fishing implements tell stories of livelihoods in the delta.",
    ),
    alt: copy(
      "Các dụng cụ đánh bắt thủy sản được trưng bày tại Bảo tàng Văn hóa Khmer",
      "Traditional fishing implements displayed at the Khmer culture museum",
    ),
  },
  {
    photo: "khmer-pinpeat",
    title: copy("THANH ÂM NGŨ ÂM", "THE SOUND OF PINPEAT"),
    caption: copy(
      "Dàn nhạc lễ kết nối âm nhạc, sân khấu và đời sống cộng đồng.",
      "The ceremonial ensemble connects music, theatre and community life.",
    ),
    alt: copy(
      "Dàn nhạc Ngũ âm trong không gian trưng bày của bảo tàng",
      "A Pinpeat ensemble displayed inside the museum",
    ),
  },
  {
    photo: "khmer-visitors",
    title: copy("HIỆN VẬT VÀ CON NGƯỜI", "OBJECTS AND PEOPLE"),
    caption: copy(
      "Những câu chuyện thuyết minh mở ra ý nghĩa phía sau từng hiện vật.",
      "Guided interpretation reveals the stories behind the objects.",
    ),
    alt: copy(
      "Khách tham quan các mô hình và hiện vật tại bảo tàng",
      "Visitors exploring models and collections at the museum",
    ),
  },
];

type OverviewStory = {
  title: Copy;
  photo: string;
  paragraphs: Copy[];
  sections?: { title: Copy; text: Copy }[];
  sources: (keyof typeof khmerOverviewSources)[];
};
export const khmerOverviewStories: Record<KhmerOverviewTopic, OverviewStory> = {
  introduction: {
    title: copy(
      "Nơi lưu giữ ký ức văn hóa Khmer",
      "A home for Khmer cultural memories",
    ),
    photo: "khmer-facade",
    paragraphs: [
      copy(
        "Bảo tàng Văn hóa Dân tộc Khmer Trà Vinh là nơi sưu tầm, bảo quản, nghiên cứu và giới thiệu văn hóa Khmer Nam Bộ. Tín ngưỡng, chữ viết, sinh hoạt gia đình, lao động, nghề thủ công, âm nhạc và sân khấu cùng tạo nên một bức tranh về đời sống cộng đồng.",
        "The museum collects, conserves, researches and presents the culture of southern Khmer communities. Belief, writing, family life, work, crafts, music and theatre together create a portrait of community life.",
      ),
      copy(
        "Công trình được hình thành trong thập niên 1990. Một số tài liệu ghi mốc khánh thành năm 1995; các nguồn khác cho biết khởi công từ năm 1992 và bắt đầu phục vụ khách tham quan vào tháng 11/1997, dịp lễ Ok Om Bok. Những mốc này phản ánh các giai đoạn khác nhau trong quá trình hình thành bảo tàng.",
        "The museum took shape in the 1990s. Some accounts record an inauguration in 1995; others describe construction beginning in 1992 and opening to visitors in November 1997, during Ok Om Bok. These dates describe different stages of its development.",
      ),
      copy(
        "Khuôn viên khoảng 1 ha cần được phân biệt với hơn 1.700 m² diện tích sử dụng của tòa nhà hai tầng. Cây xanh và khoảng sân tạo bước chuyển nhẹ nhàng từ cảnh quan bên ngoài vào không gian trưng bày.",
        "The grounds cover around one hectare, distinct from the two-storey building's more than 1,700 m² of floor area. Trees and courtyards create a gentle transition from the surrounding landscape into the exhibitions.",
      ),
      copy(
        "Con số trên 800 hiện vật, hình ảnh và tư liệu thường xuất hiện trong các tài liệu giới thiệu. Thống kê công bố năm 2024 ghi nhận hơn 1.000 hiện vật đã được sưu tầm, hệ thống hóa và trưng bày. Số lượng có thể khác nhau theo thời điểm và phạm vi thống kê; không phải toàn bộ đều đồng thời được trưng bày.",
        "Museum introductions often mention over 800 objects, photographs and documents. A 2024 account reports more than 1,000 objects collected, documented and displayed. Counts vary with the date and scope of the inventory, and not everything is necessarily on display at once.",
      ),
    ],
    sources: ["locality", "history", "collections"],
  },
  collections: {
    title: copy(
      "Bốn chủ đề, một đời sống Khmer",
      "Four themes, one Khmer way of life",
    ),
    photo: "khmer-visitors",
    paragraphs: [
      copy(
        "Hành trình trưng bày có thể được đọc qua bốn chủ đề văn hóa cốt lõi. Hiện vật gắn với con người, từ thế giới tâm linh đến những công cụ rất bình dị trong đời sống. Một số tài liệu còn ghi nhận không gian chuyên đề về lịch sử và truyền thống đấu tranh của cộng đồng Khmer.",
        "The collections can be explored through four core cultural themes. Objects connect with people, from spiritual life to the most familiar everyday tools. Some accounts also describe a historical section on the Khmer community's struggles and contributions.",
      ),
    ],
    sections: [
      {
        title: copy(
          "01 · Tín ngưỡng và đời sống tâm linh",
          "01 · Belief and spiritual life",
        ),
        text: copy(
          "Mô hình chùa, không gian thờ Néak Tà, ghế thuyết pháp và các hình tượng Bà La Môn – Phật giáo giới thiệu nhiều lớp tín ngưỡng. Kinh lá Buông Satra lưu giữ chữ viết, lời giáo huấn và truyện kể, cho thấy mối liên hệ giữa tôn giáo và truyền thống tri thức.",
          "Temple models, Neak Ta worship, preaching seats and Hindu–Buddhist imagery introduce layers of belief. Satra palm-leaf manuscripts preserve writing, moral teachings and stories, connecting religion with traditions of knowledge.",
        ),
      },
      {
        title: copy("02 · Cuộc sống thường nhật", "02 · Everyday life"),
        text: copy(
          "Nông ngư cụ, vật dụng gia đình, trang phục và mô hình nhà ở kể về cách ăn, ở, lao động và thích ứng với môi trường đồng bằng. Những vật dụng bằng tre, gỗ hay gáo dừa còn thể hiện thị hiếu thẩm mỹ trong sinh hoạt thường ngày.",
          "Farming and fishing tools, household objects, clothing and house models describe living, working and adapting to the delta. Objects made from bamboo, wood and coconut shells also reveal everyday aesthetic traditions.",
        ),
      },
      {
        title: copy(
          "03 · Làng nghề và tri thức thủ công",
          "03 · Crafts and practical knowledge",
        ),
        text: copy(
          "Khung dệt, đồ đan lát, dụng cụ giã cốm dẹp và các sản phẩm điêu khắc, hội họa giới thiệu kỹ năng nghề nghiệp được truyền qua nhiều thế hệ. Bản sắc không chỉ hiện diện trong nghi lễ mà còn trong cách lựa chọn vật liệu, tạo hình và làm ra một vật dụng.",
          "Looms, woven objects, flattened-rice tools, carving and painting introduce skills passed between generations. Cultural identity is present in materials, forms and methods of making, as well as in ceremony.",
        ),
      },
      {
        title: copy(
          "04 · Nghệ thuật và lễ hội",
          "04 · Performing arts and festivals",
        ),
        text: copy(
          "Dàn nhạc Ngũ âm, mão, mặt nạ, trang phục và đạo cụ mở ra thế giới Rô-băm và Dù kê. Ghe Ngo nối không gian bảo tàng với lễ Ok Om Bok, đời sống phum sóc và tinh thần cộng đồng.",
          "Pinpeat instruments, crowns, masks, costumes and props introduce Robam and Du ke theatre. The Ngo boat connects the museum with Ok Om Bok, village life and community spirit.",
        ),
      },
    ],
    sources: ["museum", "history", "collections"],
  },
  identity: {
    title: copy(
      "Bản sắc được trao truyền",
      "A heritage passed between generations",
    ),
    photo: "khmer-temple-model",
    paragraphs: [
      copy(
        "Văn hóa Khmer Nam Bộ được gìn giữ trong chùa, phum sóc, gia đình, làng nghề và lễ hội. Bảo tàng tập hợp những dấu ấn ấy, giúp người xem nhận ra mối liên hệ giữa tín ngưỡng, ngôn ngữ và đời sống cộng đồng.",
        "Southern Khmer culture is sustained in temples, villages, families, crafts and festivals. The museum gathers these traces and helps visitors connect belief, language and community life.",
      ),
      copy(
        "Satra – văn tự và kinh sách trên lá Buông – là nhóm hiện vật tiêu biểu. Nội dung không chỉ có kinh Phật mà còn có lời huấn ca, giáo huấn về lối sống và truyện kể dân gian. Mỗi bản lá Buông đồng thời là dấu tích của chữ viết, kỹ thuật tạo lập văn bản và phương thức truyền tri thức.",
        "Satra palm-leaf manuscripts are an emblematic collection. Their contents include Buddhist texts, moral teachings and folk narratives. Each manuscript records writing, traditional bookmaking and the transmission of knowledge.",
      ),
      copy(
        "Các hình tượng Kâyno và Tết Pronam cho thấy trí tưởng tượng trong mỹ thuật Khmer, nơi con người, chim muông, thần linh và thiên nhiên hòa vào một thế giới biểu tượng phong phú. Quan sát hiện vật cũng là tìm hiểu cách cộng đồng nhận diện và trao truyền bản sắc.",
        "Figures such as Kayno and Tet Pronam reveal the imagination of Khmer art, where people, birds, divinities and nature share a rich symbolic world. Looking at objects is also a way to understand how identity is recognised and passed on.",
      ),
    ],
    sources: ["museum", "locality"],
  },
  architecture: {
    title: copy(
      "Kiến trúc: truyền thống trong một không gian mới",
      "Architecture: tradition in a modern setting",
    ),
    photo: "khmer-facade",
    paragraphs: [
      copy(
        "Tòa nhà kết hợp đường nét kiến trúc Khmer với chức năng của một bảo tàng hiện đại. Hệ mái cao, các mảng tam giác và hoa văn trang trí đưa khách tham quan vào bối cảnh văn hóa ngay từ mặt tiền công trình.",
        "The building combines Khmer architectural forms with the functions of a modern museum. High roofs, triangular forms and ornament introduce the cultural setting before visitors enter the collections.",
      ),
      copy(
        "Công trình gồm hai tầng. Tầng trệt gắn với hoạt động hành chính, nghiên cứu, bảo quản và đón tiếp; tầng lầu là không gian trưng bày chính. Khu cầu thang trung tâm và hồ bán nguyệt phía dưới tạo điểm nhấn cho sảnh.",
        "The building has two storeys. The ground floor supports administration, research, conservation and reception; the upper floor contains the main displays. The central staircase and semicircular pond form a distinctive feature of the hall.",
      ),
      copy(
        "Khoảng sân và cây xanh trong khuôn viên gần 1 ha tạo một không gian rợp mát, yên tĩnh. Cảnh quan không chỉ bao quanh tòa nhà mà còn góp phần định hình nhịp tham quan chậm rãi, từ thiên nhiên đến hiện vật.",
        "Courtyards and trees in the roughly one-hectare grounds create a shaded, quiet setting. The landscape contributes to the pace of a visit, guiding people from nature towards the collections.",
      ),
    ],
    sources: ["museum", "locality"],
  },
  performing: {
    title: copy(
      "Từ hiện vật đến thanh âm và sân khấu",
      "From objects to music and theatre",
    ),
    photo: "khmer-pinpeat",
    paragraphs: [
      copy(
        "Dàn nhạc Ngũ âm là một biểu tượng của âm nhạc Khmer, gắn với nghi lễ và sinh hoạt cộng đồng. Tên gọi liên hệ đến các nhóm chất liệu tạo âm: đồng, sắt, gỗ, da và hơi. Nhạc cụ không chỉ để ngắm nhìn mà còn gợi ra những thanh âm và không gian sử dụng của chúng.",
        "The Pinpeat ensemble is an emblem of Khmer music and ceremonial life. Its name relates to five groups of sound-producing materials: bronze, iron, wood, skin and breath. Instruments evoke the sounds and settings in which they are used.",
      ),
      copy(
        "Mão, mặt nạ, phục trang và đạo cụ giúp tìm hiểu Rô-băm, loại hình kịch múa có tính ước lệ và dấu ấn cung đình; cùng Dù kê, hình thức ca kịch phát triển trong môi trường dân gian. Hai loại hình cho thấy nghệ thuật vừa gìn giữ truyền thống vừa biến đổi theo đời sống xã hội.",
        "Crowns, masks, costumes and props introduce Robam, a stylised dance theatre with courtly traditions, and Du ke, a musical theatre rooted in popular life. Together they show how the arts preserve tradition while changing with society.",
      ),
      copy(
        "Ghe Ngo và các hiện vật liên quan đến Ok Om Bok đưa câu chuyện ra ngoài tủ kính, tới lễ hội, phum sóc và tinh thần tập thể. Các hoạt động trong không gian Ao Bà Om – Chùa Âng giúp người xem liên hệ hiện vật với một nền văn hóa còn sống.",
        "The Ngo boat and objects associated with Ok Om Bok extend the story towards festivals, villages and collective life. The surrounding Ba Om–Ang Pagoda landscape helps visitors connect the collections with a living culture.",
      ),
    ],
    sources: ["museum", "collections"],
  },
  everyday: {
    title: copy(
      "Những vật dụng kể chuyện đời thường",
      "Everyday objects tell their stories",
    ),
    photo: "khmer-tools",
    paragraphs: [
      copy(
        "Cày, phảng, nọc cấy, nôm, lọp và các dụng cụ lao động kể về cách cộng đồng Khmer thích ứng với ruộng lúa, sông rạch và sinh kế miền đồng bằng. Vật dụng bình dị cũng là tư liệu quan trọng về lịch sử đời sống.",
        "Ploughs, planting implements, baskets and fishing traps describe how Khmer communities adapted to rice fields, waterways and delta livelihoods. Familiar tools are important records of everyday history.",
      ),
      copy(
        "Trang phục, vật dụng sinh hoạt và mô hình nhà ở bổ sung câu chuyện về gia đình, cư trú và phong tục. Nhiều công cụ làm bằng tre, gỗ hay gáo dừa còn có chạm khắc, hoa văn, thể hiện sự chăm chút về hình thức ngay trong những việc thường ngày.",
        "Clothing, household objects and house models add stories of family, dwelling and custom. Bamboo, wooden and coconut-shell implements can carry carving and decoration, revealing care for form in ordinary work.",
      ),
      copy(
        "Khi đặt cạnh khung dệt, đồ đan lát và dụng cụ giã cốm dẹp, các hiện vật cho thấy kỹ năng lao động và tri thức thủ công được truyền từ thế hệ này sang thế hệ khác. Đây là cách đọc văn hóa từ những điều gần gũi nhất.",
        "Alongside looms, woven objects and flattened-rice tools, these collections reveal skills and practical knowledge passed between generations. They offer a way to read culture through the most familiar things.",
      ),
    ],
    sources: ["museum"],
  },
  route: {
    title: copy(
      "Bảo tàng · Ao Bà Om · Chùa Âng",
      "The museum · Ba Om Pond · Ang Pagoda",
    ),
    photo: "khmer-facade",
    paragraphs: [
      copy(
        "Bảo tàng nằm trong không gian văn hóa – sinh thái liền kề Ao Bà Om và Chùa Âng. Ba điểm đến bổ sung cho nhau: bảo tàng giới thiệu hiện vật và câu chuyện, chùa cho thấy đời sống Phật giáo Nam tông Khmer, còn ao và cây cổ thụ tạo bối cảnh cảnh quan.",
        "The museum, Ba Om Pond and Ang Pagoda share a cultural and ecological landscape. The museum presents objects and stories, the pagoda reveals Khmer Theravada Buddhist life, and the pond and old trees provide the landscape setting.",
      ),
      copy(
        "Những gì vừa nhìn thấy trong mô hình, hình ảnh và tủ trưng bày có thể được liên hệ với kiến trúc, tín ngưỡng và sinh hoạt bên ngoài. Vào những dịp lễ hội như Ok Om Bok, mối liên hệ giữa hiện vật và đời sống cộng đồng càng rõ nét.",
        "Models, images and display cases can be connected with the architecture, beliefs and activities outside. During festivals such as Ok Om Bok, the links between objects and community life become especially visible.",
      ),
      copy(
        "Ao Bà Om và Chùa Âng là những di tích, danh thắng cấp quốc gia. Trong quần thể này, bảo tàng đảm nhận vai trò lưu giữ, nghiên cứu và giới thiệu văn hóa, giúp chuyến tham quan có thêm chiều sâu về lịch sử và đời sống Khmer.",
        "Ba Om Pond and Ang Pagoda have national heritage designations. Within this landscape, the museum conserves, researches and presents culture, adding historical and social depth to a visit.",
      ),
    ],
    sources: ["museum", "locality"],
  },
  learning: {
    title: copy(
      "Hiểu Trà Vinh qua ký ức cộng đồng",
      "Understand Trà Vinh through community memories",
    ),
    photo: "khmer-visitors",
    paragraphs: [
      copy(
        "Bảo tàng là nguồn tư liệu trực quan cho việc học tập và nghiên cứu văn hóa, mỹ thuật, tôn giáo, dân tộc học và lịch sử địa phương. Đối tượng tham quan không chỉ là du khách mà còn có học sinh, sinh viên và người nghiên cứu.",
        "The museum provides visual material for studying culture, art, religion, ethnology and local history. Its visitors include travellers, school and university students, and researchers.",
      ),
      copy(
        "Một bản kinh lá Buông mở ra câu chuyện về chữ viết; chiếc mặt nạ dẫn tới sân khấu; khung dệt kể về nghề thủ công; Ghe Ngo nối với lễ hội và đời sống phum sóc. Cách kết nối hiện vật với con người giúp việc tham quan trở thành một cuộc tìm hiểu văn hóa.",
        "A palm-leaf manuscript opens a story about writing; a mask leads towards theatre; a loom describes craftsmanship; a Ngo boat connects with festivals and village life. Connecting objects with people turns a visit into an exploration of culture.",
      ),
      copy(
        "Các không gian chuyên đề về lịch sử cộng đồng còn giúp nhìn người Khmer như những chủ thể tham gia vào quá trình xây dựng và bảo vệ vùng đất Nam Bộ. Di sản vì thế vừa là ký ức được gìn giữ, vừa là tri thức để tiếp tục trao truyền.",
        "Historical sections recognise Khmer people as participants in the development and defence of southern Vietnam. Heritage becomes both preserved memory and knowledge to pass forward.",
      ),
    ],
    sources: ["museum", "history"],
  },
  location: {
    title: copy(
      "Vị trí và thông tin tham quan",
      "Location and visiting information",
    ),
    photo: "khmer-facade",
    paragraphs: [
      copy(
        "Bảo tàng thuộc không gian Văn hóa – Du lịch Ao Bà Om, phường Nguyệt Hóa, tỉnh Vĩnh Long, tại khu vực Trà Vinh. Địa chỉ trước sắp xếp hành chính thường được ghi là Khóm 4, Phường 8, thành phố Trà Vinh, cách trung tâm khoảng 5 km về phía tây nam.",
        "The museum is in the Ba Om cultural-tourism area, Nguyệt Hóa ward, Vĩnh Long province, in the Trà Vinh area. Before administrative reorganisation, its address was commonly recorded as Hamlet 4, Ward 8, Trà Vinh city, around five kilometres southwest of the centre.",
      ),
      copy(
        "Bảo tàng nằm gần Ao Bà Om và Chùa Âng, thuận tiện để kết hợp tìm hiểu hiện vật, kiến trúc Khmer và cảnh quan trong cùng một hành trình.",
        "The museum is close to Ba Om Pond and Ang Pagoda, making it possible to connect the collections, Khmer architecture and landscape in one visit.",
      ),
      copy(
        "Thông tin tham quan tham khảo trong tài liệu tổng hợp: buổi sáng 07:00–11:00, buổi chiều 13:00–17:00; vé vào cổng miễn phí. Có thể xem thông tin của đơn vị quản lý khi chuẩn bị lịch trình, nhất là vào dịp lễ hội.",
        "Visiting information in the compiled reference gives morning hours of 07:00–11:00 and afternoon hours of 13:00–17:00, with free admission. Consult the managing institution when planning a visit, especially during festivals.",
      ),
    ],
    sources: ["locality", "museum"],
  },
};

export const khmerOverviewPhotoCredits: Record<string, Copy> = {
  "khmer-facade": copy(
    "Ảnh: Cổng thông tin tỉnh Vĩnh Long / dulichtravinh.com.vn",
    "Photo: Vĩnh Long provincial portal / dulichtravinh.com.vn",
  ),
  "khmer-temple-model": copy(
    "Ảnh tư liệu: Bảo tàng Lịch sử Quốc gia",
    "Archive photograph: Vietnam National Museum of History",
  ),
  "khmer-tools": copy(
    "Ảnh tư liệu: Bảo tàng Lịch sử Quốc gia",
    "Archive photograph: Vietnam National Museum of History",
  ),
  "khmer-pinpeat": copy(
    "Ảnh tư liệu: Bảo tàng Lịch sử Quốc gia",
    "Archive photograph: Vietnam National Museum of History",
  ),
  "khmer-visitors": copy(
    "Ảnh tư liệu: Bảo tàng Lịch sử Quốc gia",
    "Archive photograph: Vietnam National Museum of History",
  ),
};
