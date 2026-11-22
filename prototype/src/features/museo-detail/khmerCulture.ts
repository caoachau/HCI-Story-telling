import { khmerHistoryPhotos, khmerHistorySources } from "./khmerHistory";
import festival from "../../assets/ao-ba-om/festival-2024.webp";
import lanterns from "../../assets/ao-ba-om/floating-lanterns-2024.webp";

export type CultureLanguage = "vi" | "en";
type Copy = Record<CultureLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const khmerCultureSources = {
  museum: khmerHistorySources.archive,
  event: khmerHistorySources.event,
  memorial: khmerHistorySources.memorial,
  satra: {
    title: t(
      "Bộ VHTTDL · Văn học dân gian, 2022",
      "Ministry of Culture · Folk literature, 2022",
    ),
    url: "https://bvhttdl.gov.vn/bao-ton-phat-huy-gia-tri-van-hoc-dan-gian-cua-cac-dan-toc-thieu-so-tinh-tra-vinh-20220719111950316.htm",
  },
  customs: {
    title: t(
      "Bộ VHTTDL · Văn hóa Khmer và du lịch, 2024",
      "Ministry of Culture · Khmer culture and tourism, 2024",
    ),
    url: "https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-lay-van-hoa-khmer-lam-don-bay-cho-du-lich-20241106084309683.htm",
  },
  chapey: {
    title: t(
      "Cục Di sản văn hóa · Chầm riêng Chà pây",
      "Department of Cultural Heritage · Chamrieng Chapey",
    ),
    url: "https://dsvh.gov.vn/nghe-thuat-cham-rieng-cha-pay-cua-nguoi-khmer-tinh-tra-vinh-3153",
  },
  duke: {
    title: t(
      "Cục Di sản văn hóa · Sân khấu Dù kê",
      "Department of Cultural Heritage · Du Ke theatre",
    ),
    url: "https://dsvh.gov.vn/nghe-thuat-san-khau-du-ke-1038",
  },
  masks: {
    title: t(
      "Báo Văn Hóa · Chế tác mão, mặt nạ, 13/12/2023",
      "Van Hoa · Crown and mask making, 13 December 2023",
    ),
    url: "https://baovanhoa.vn/doi-song-van-hoa/nghe-thuat-che-tac-mao-mat-na-cua-nguoi-khmer-o-tra-vinh-64038.html",
  },
  lam: {
    title: t(
      "Ủy ban Nhà nước về người Việt Nam ở nước ngoài · Lâm Phên, 2010",
      "SCOV · Artisan Lam Phen, 2010",
    ),
    url: "https://scov.gov.vn/dat-nuoc-con-nguoi/con-nguoi-viet-nam/nghe-nhan-lam-phen-nguoi-giu-hon-van-hoa-khmer.html",
  },
  young: {
    title: t(
      "TTXVN · Nghệ nhân Thạch Huỳnh Thươne, 05/06/2021",
      "VNA · Artisan Thach Huynh Thuone, 5 June 2021",
    ),
    url: "https://dantocmiennui.baotintuc.vn/nghe-nhan-tre-khat-khao-bao-ton-van-hoa-khmer-post304563.html",
  },
  teaching: {
    title: t(
      "Đại học Trà Vinh · Sơn Cao Thắng và sinh viên, 2025",
      "Tra Vinh University · Son Cao Thang and students, 2025",
    ),
    url: "https://cce.tvu.edu.vn/tien-si-dien-trai-truyen-cam-hung-van-hoa-khmer-cho-sinh-vien/",
  },
  festival: {
    title: t(
      "Cục Du lịch Quốc gia Việt Nam · Đêm Ok Om Bok, 2024",
      "Vietnam National Authority of Tourism · Ok Om Bok night, 2024",
    ),
    url: "https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/",
  },
  boat: {
    title: t(
      "Bảo tàng Vĩnh Long · Ghe Ngo và văn hóa cộng đồng",
      "Vinh Long Museum · Ngo boats and community culture",
    ),
    url: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188",
  },
  gongs: {
    title: t(
      "Bộ VHTTDL · Triển lãm cồng chiêng, 24/04/2025",
      "Ministry of Culture · Gong exhibition, 24 April 2025",
    ),
    url: "https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-khai-mac-trien-lam-van-hoa-cong-chieng-tay-nguyen-xua-va-nay-20250424160636406.htm",
  },
  food: {
    title: t(
      "Báo Trà Vinh · Bánh ống, bánh dừa",
      "Tra Vinh Newspaper · Tube cakes and coconut cakes",
    ),
    url: "https://www.baotravinh.vn/van-hoa-the-thao/banh-ong-banh-dua-giu-lua-cho-nghe-truyen-thong-24921.html",
  },
};
type SourceId = keyof typeof khmerCultureSources;
const assets = import.meta.glob("../../assets/museo/khmer-culture-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const photo = (
  file: string,
  title: Copy,
  caption: Copy,
  author: string,
  source: SourceId,
) => ({
  src: assets[`../../assets/museo/${file}`],
  title,
  caption,
  author,
  sourceUrl: khmerCultureSources[source].url,
});
export const khmerCulturePhotos = {
  ...khmerHistoryPhotos,
  userMask: {
    src: assets["../../assets/museo/khmer-culture-user-reference.jpg"],
    crop: [330, 72, 550, 455] as const,
    title: t("Mặt nạ sân khấu · Ảnh minh họa", "Theatre mask · Illustration"),
    caption: t("Mặt nạ sân khấu với mão cao và các sắc vàng, đỏ, trắng; hình minh họa trong mẫu giao diện do bạn cung cấp.", "A theatrical mask with a tall crown and gold, red and white colouring; an illustration from the layout supplied by the user."),
    author: "Ảnh minh họa do bạn cung cấp",
    sourceUrl: assets["../../assets/museo/khmer-culture-user-reference.jpg"],
  },
  lam: photo(
    "khmer-culture-lam-phen.jpg",
    t("Nghệ nhân Lâm Phên bên nhạc cụ", "Artisan Lam Phen with an instrument"),
    t(
      "Lâm Phên chế tác nhạc cụ. Ảnh trong bài giới thiệu ngày 12/05/2010; nguồn không ghi tên người chụp.",
      "Lam Phen making an instrument. Photograph in the 12 May 2010 profile; the source does not identify the photographer.",
    ),
    "SCOV · 2010",
    "lam",
  ),
  sang: photo(
    "khmer-culture-thach-sang.jpg",
    t("Thạch Sang hướng dẫn chế tác mặt nạ", "Thach Sang teaching mask making"),
    t(
      "Nghệ nhân ưu tú Thạch Sang hướng dẫn học viên chế tác mão và mặt nạ, tư liệu tháng 12/2023.",
      "Artisan Thach Sang teaching crown and mask making, December 2023 report.",
    ),
    "Thịnh Phúc · Báo Văn Hóa, 2023",
    "masks",
  ),
  training: photo(
    "khmer-culture-training-2023.jpg",
    t(
      "Lớp truyền dạy mão và mặt nạ năm 2023",
      "Crown and mask workshop in 2023",
    ),
    t(
      "Lớp truyền dạy có 54 học viên là chư tăng và thanh thiếu niên Khmer, theo bài ngày 13/12/2023. Đây là hoạt động truyền nghề trong cộng đồng.",
      "Monks and young Khmer learners at a 54-participant workshop documented on 13 December 2023. This is community craft training.",
    ),
    "Thịnh Phúc · Báo Văn Hóa, 2023",
    "masks",
  ),
  thuone: photo(
    "khmer-culture-thuone-2021.avif",
    t(
      "Thạch Huỳnh Thươne và các sản phẩm thủ công",
      "Thach Huynh Thuone and his craftwork",
    ),
    t(
      "Nghệ nhân Thạch Huỳnh Thươne cùng mão, mặt nạ do anh chế tác. Ảnh trong phóng sự TTXVN ngày 05/06/2021.",
      "Artisan Thach Huynh Thuone with his handmade crowns and masks, VNA report of 5 June 2021.",
    ),
    "An Hiếu · TTXVN, 2021",
    "young",
  ),
  chapey: photo(
    "khmer-culture-chapey.jpg",
    t("Tư liệu Chầm riêng Chà pây", "Chamrieng Chapey archive photograph"),
    t(
      "Ảnh trình diễn và không gian nghi lễ trong hồ sơ Chầm riêng Chà pây của Cục Di sản văn hóa. Nguồn không ghi ngày chụp và tên người chụp.",
      "Performance and ritual setting in the Department of Cultural Heritage's Chapey record. The source does not give a photograph date or photographer.",
    ),
    "Cục Di sản văn hóa · ảnh hồ sơ",
    "chapey",
  ),
  gongs: photo(
    "khmer-culture-gongs-2025.jpg",
    t(
      "Khai mạc triển lãm cồng chiêng năm 2025",
      "Gong exhibition opening in 2025",
    ),
    t(
      "Đại biểu dự khai mạc triển lãm Văn hóa Cồng chiêng Tây Nguyên tại bảo tàng ngày 24/04/2025. Đây là triển lãm giao lưu vùng miền.",
      "Delegates at the Central Highlands gong exhibition opening at the museum on 24 April 2025, an interregional cultural exchange.",
    ),
    "Bộ VHTTDL · tư liệu 2025",
    "gongs",
  ),
  highlands: photo(
    "khmer-culture-highlands-performance-2025.jpg",
    t(
      "Giao lưu của Đoàn Nghệ thuật tỉnh Đắk Lắk",
      "Performance by the Dak Lak arts troupe",
    ),
    t(
      "Tiết mục giao lưu của Đoàn Nghệ thuật tỉnh Đắk Lắk tại lễ khai mạc triển lãm ngày 24/04/2025, trước sảnh bảo tàng.",
      "The Dak Lak arts troupe performing at the exhibition opening on 24 April 2025, in front of the museum.",
    ),
    "Báo Trà Vinh · Bộ VHTTDL, 2025",
    "gongs",
  ),
  khmerDance: photo(
    "khmer-culture-khmer-dance-2025.jpg",
    t(
      "Đoàn Nghệ thuật Khmer Ánh Bình Minh biểu diễn",
      "The Khmer Anh Binh Minh troupe performing",
    ),
    t(
      "Tiết mục múa giao lưu của Đoàn Nghệ thuật Khmer Ánh Bình Minh, tỉnh Trà Vinh, tại lễ khai mạc triển lãm ngày 24/04/2025.",
      "A dance by the Khmer Anh Binh Minh troupe of Tra Vinh at the exhibition opening on 24 April 2025.",
    ),
    "Báo Trà Vinh · Bộ VHTTDL, 2025",
    "gongs",
  ),
  festival: {
    src: festival,
    title: t(
      "Đêm lễ hội Ok Om Bok năm 2024",
      "Ok Om Bok festival night in 2024",
    ),
    caption: t(
      "Tư liệu đêm Ok Om Bok tại khu văn hóa Ao Bà Om năm 2024; ảnh lễ hội trong quần thể, không phải hoạt động trong phòng trưng bày.",
      "The 2024 Ok Om Bok night at the Ao Ba Om cultural grounds; a festival in the wider complex, rather than inside an exhibition room.",
    ),
    author: "Cục Du lịch Quốc gia Việt Nam · 2024",
    sourceUrl: khmerCultureSources.festival.url,
  },
  lanterns: {
    src: lanterns,
    title: t(
      "Hoa đăng trong đêm Ok Om Bok 2024",
      "Lanterns on Ok Om Bok night, 2024",
    ),
    caption: t(
      "Hoa đăng trong đêm lễ hội năm 2024 tại Ao Bà Om, tư liệu Cục Du lịch Quốc gia Việt Nam.",
      "Lanterns at Ao Ba Om during the 2024 festival night, Vietnam National Authority of Tourism archive.",
    ),
    author: "Cục Du lịch Quốc gia Việt Nam · 2024",
    sourceUrl: khmerCultureSources.festival.url,
  },
};
export type CulturePhotoId = keyof typeof khmerCulturePhotos;
export const khmerCultureGroups = [
  {
    id: "culture",
    title: t("Văn hóa", "Culture"),
    description: t(
      "Từ tín ngưỡng, chữ viết đến nghệ thuật và đời sống thường ngày.",
      "Beliefs, writing, performing arts and everyday life.",
    ),
  },
  {
    id: "activities",
    title: t("Hoạt động", "Activities"),
    description: t(
      "Lễ hội cộng đồng và những cuộc gặp gỡ tại bảo tàng.",
      "Community celebrations and encounters at the museum.",
    ),
  },
  {
    id: "people",
    title: t("Con người", "People"),
    description: t(
      "Những bàn tay, tiếng đàn và thế hệ gìn giữ ký ức Khmer.",
      "The hands, voices and generations preserving Khmer memory.",
    ),
  },
] as const;
export type CultureGroup = (typeof khmerCultureGroups)[number]["id"];
export interface CultureTopic {
  id: string;
  group: CultureGroup;
  title: Copy;
  summary: Copy;
  context: Copy;
  gallery: CulturePhotoId[];
  paragraphs: Copy[];
  question: Copy;
  sources: SourceId[];
}
const topic = (
  id: string,
  group: CultureGroup,
  title: Copy,
  summary: Copy,
  context: Copy,
  gallery: CulturePhotoId[],
  paragraphs: Copy[],
  question: Copy,
  sources: SourceId[],
): CultureTopic => ({
  id,
  group,
  title,
  summary,
  context,
  gallery,
  paragraphs,
  question,
  sources,
});
const region = t("DI SẢN TRONG CỘNG ĐỒNG", "HERITAGE IN THE COMMUNITY");
const museum = t("HIỆN VẬT VÀ TRƯNG BÀY", "OBJECTS AND DISPLAYS");
export const khmerCultureTopics: CultureTopic[] = [
  topic(
    "pagoda",
    "culture",
    t("Chùa và đời sống tinh thần", "Pagodas and spiritual life"),
    t(
      "Chùa Nam tông là nơi học chữ, thực hành tín ngưỡng và trao truyền văn hóa Khmer.",
      "Theravada pagodas sustain Khmer learning, belief and cultural transmission.",
    ),
    region,
    ["pagoda", "temple", "buddha"],
    [
      t(
        "Trong đời sống Khmer Nam Bộ, ngôi chùa gắn với Phật giáo Nam tông, việc học chữ và sinh hoạt của phum sóc. Những câu chuyện, âm nhạc và kỹ năng được truyền qua quan hệ giữa sư sãi, gia đình và người học.",
        "In southern Khmer life, Theravada pagodas connect religious practice, literacy and village life. Monks, families and learners pass on stories, music and skills.",
      ),
      t(
        "Tín ngưỡng Neak Tà thể hiện một lớp văn hóa dân gian về vị thần bảo hộ. Khi tìm hiểu, cần phân biệt tập tục địa phương với giáo lý Phật giáo, đồng thời tôn trọng cách thực hành của từng cộng đồng.",
        "Neak Ta guardian beliefs belong to a layer of local folk culture. They should be understood alongside, and distinguished from, Buddhist teachings and each community's practices.",
      ),
      t(
        "Bảo tàng giới thiệu thế giới tinh thần ấy qua tượng, mô hình kiến trúc và hiện vật. Chùa Âng gần bảo tàng là một không gian tôn giáo đang được cộng đồng sử dụng; ảnh mô hình trong trưng bày có bối cảnh khác với ảnh ngôi chùa.",
        "The museum introduces this spiritual world through statues, architectural models and objects. Nearby Ang Pagoda is an active religious space; an exhibition model and the pagoda photograph represent different settings.",
      ),
    ],
    t(
      "Ngôi chùa còn giữ những vai trò nào ngoài việc hành lễ?",
      "What roles does a pagoda have beyond religious ceremonies?",
    ),
    ["customs", "museum"],
  ),
  topic(
    "satra",
    "culture",
    t("Satra: ký ức trên lá buông", "Satra: memory on palm leaves"),
    t(
      "Chữ Khmer trên lá buông lưu giữ tri thức, truyện kể và những lời dạy qua nhiều thế hệ.",
      "Khmer writing on palm leaves preserves knowledge, stories and teachings across generations.",
    ),
    museum,
    ["exhibition", "buddha", "temple"],
    [
      t(
        "Satra là một dạng văn bản chữ Khmer được ghi trên lá buông. Nội dung có thể liên quan đến tôn giáo, truyện kể, phong tục và tri thức; không nên đồng nhất toàn bộ Satra với một loại kinh duy nhất.",
        "Satra are Khmer texts inscribed on palm leaves. They may concern religion, stories, customs and knowledge, rather than a single category of scripture.",
      ),
      t(
        "Bài của Bộ VHTTDL năm 2022 ghi nhận bảo tàng sưu tầm, lưu trữ Satra từ năm 1995. Hiện vật gốc được bảo quản, trong khi nội dung văn học dân gian có thể được viết lại thành sách để phục vụ học tập.",
        "A 2022 Ministry report records Satra collecting at the museum since 1995. Original objects are conserved, while folk-literature content has also been reproduced in books for learning.",
      ),
      t(
        "Câu chuyện Satra nối vật liệu, chữ viết và người đọc. Việc gìn giữ lá buông bảo vệ dấu vết của văn bản, còn việc đọc, dịch và truyền lại nội dung giúp tri thức tiếp tục đến với cộng đồng.",
        "Satra connects material, writing and readers. Conserving palm leaves protects the physical text, while reading, translating and sharing its contents keeps knowledge accessible to communities.",
      ),
    ],
    t(
      "Giữ một văn bản gốc và truyền lại nội dung của nó khác nhau thế nào?",
      "How does conserving a manuscript differ from passing on its contents?",
    ),
    ["satra"],
  ),
  topic(
    "robam",
    "culture",
    t("Rôbăm và nghệ thuật mặt nạ", "Robam and the art of masks"),
    t(
      "Mão, mặt nạ và động tác múa cùng kể câu chuyện trên sân khấu Khmer.",
      "Crowns, masks and dance movements tell stories on the Khmer stage.",
    ),
    t("TRƯNG BÀY · THỰC HÀNH CỘNG ĐỒNG", "DISPLAY · COMMUNITY PRACTICE"),
    ["userMask", "mask", "sang", "training"],
    [
      t(
        "Rôbăm kết hợp múa, âm nhạc và nhân vật trong những tích truyện, trong đó có truyền thống Reamker. Mão và mặt nạ góp phần thể hiện tính cách nhân vật, đi cùng phục trang và ngôn ngữ động tác.",
        "Robam brings dance, music and characters together in narrative traditions including Reamker. Crowns and masks express character alongside costume and movement.",
      ),
      t(
        "Chế tác cần hiểu nhân vật và kỹ thuật tạo hình: tạo khuôn, bồi giấy hoặc vải, rồi sơn và trang trí. Một mặt nạ được trưng bày còn chứa câu chuyện của người làm, diễn viên và người truyền nghề.",
        "Making a mask requires knowledge of characters and techniques: moulding, layering paper or fabric, painting and decoration. A displayed mask also carries its maker's, performer's and teacher's stories.",
      ),
      t(
        "Ảnh hiện vật tại bảo tàng và lớp học trong cộng đồng năm 2023 nối đồ vật với kỹ năng đang được trao truyền. Quan sát người thợ làm khuôn và hướng dẫn học viên giúp hiểu thêm công sức phía sau một chiếc mặt nạ.",
        "Museum objects and the 2023 community workshop connect displays with transmitted skills. Watching a maker shape a mould and teach learners reveals the work behind a finished mask.",
      ),
    ],
    t(
      "Chi tiết nào trên mặt nạ giúp bạn nhận ra tính cách nhân vật?",
      "Which mask details suggest a character's personality?",
    ),
    ["masks", "satra"],
  ),
  topic(
    "duke",
    "culture",
    t("Dù kê: câu chuyện trên sân khấu", "Du Ke: stories on stage"),
    t(
      "Tiếng hát, đối thoại và diễn xuất tạo nên một hình thức sân khấu giàu giao thoa văn hóa.",
      "Song, dialogue and acting form a theatre shaped by cultural exchange.",
    ),
    museum,
    ["duke", "clothing", "mask"],
    [
      t(
        "Dù kê là nghệ thuật sân khấu của người Khmer Nam Bộ, kết hợp lời ca, âm nhạc, đối thoại và diễn xuất. Quá trình phát triển phản ánh sự tiếp xúc văn hóa trong vùng, với những ảnh hưởng được người Khmer tiếp nhận và sáng tạo lại.",
        "Du Ke is a southern Khmer theatre combining song, music, dialogue and acting. Its development reflects regional cultural contact and influences reworked through Khmer creativity.",
      ),
      t(
        "Truyện kể và văn học dân gian là chất liệu để xây dựng kịch bản. Nghệ thuật được gìn giữ qua đoàn diễn, tác giả, người dạy và khán giả, bên cạnh việc bảo quản phục trang hay nhạc cụ.",
        "Folk narratives provide material for scripts. Troupes, writers, teachers and audiences sustain the art alongside the conservation of costumes and instruments.",
      ),
      t(
        "Bảo tàng giới thiệu phục trang và hiện vật sân khấu. Các ảnh trong chủ đề là ảnh trưng bày, giúp nhận diện đồ vật trước khi tìm hiểu cách chúng được sử dụng trong biểu diễn.",
        "The museum introduces stage costumes and objects. This topic's photographs depict displays, helping identify objects before exploring how performers use them.",
      ),
    ],
    t(
      "Một bộ phục trang thay đổi ý nghĩa ra sao khi bước lên sân khấu?",
      "How does a costume's meaning change when it enters the stage?",
    ),
    ["duke", "museum", "satra"],
  ),
  topic(
    "pinpeat",
    "culture",
    t("Ngũ âm và nhịp trống Chhaydăm", "Pinpeat and Chhay Dam rhythms"),
    t(
      "Nhạc cụ, người diễn và nghi lễ cùng tạo nên thế giới âm thanh Khmer.",
      "Instruments, performers and ceremonies shape Khmer musical life.",
    ),
    museum,
    ["ensemble", "drum", "music2008"],
    [
      t(
        "Dàn ngũ âm, thường gọi Pinpeat, được giới thiệu qua năm nhóm âm sắc gắn với chất liệu đồng, sắt, gỗ, da và hơi. Tên gọi nhấn mạnh sự hòa hợp của âm sắc, không có nghĩa dàn nhạc chỉ gồm năm nhạc cụ.",
        "Pinpeat is described through five tonal families associated with bronze, iron, wood, skin and breath. The name concerns tonal combinations, rather than exactly five instruments.",
      ),
      t(
        "Chhaydăm gắn với trống, tiết tấu và động tác biểu diễn trong sinh hoạt lễ hội. Nhạc ngũ âm và múa trống có cách tổ chức, chức năng riêng; cần quan sát từng loại nhạc cụ và bối cảnh sử dụng.",
        "Chhay Dam combines drums, rhythm and movement in festive life. Pinpeat and drum dance have distinct organisation and functions; each instrument should be read in its performance context.",
      ),
      t(
        "Ảnh bảo tàng năm 2023 và ảnh tư liệu năm 2008 cho thấy cách nhạc cụ được giới thiệu qua các thời kỳ. Mô hình người diễn trong trưng bày giúp hình dung động tác, còn kỹ năng âm nhạc được truyền trong cộng đồng.",
        "Museum photographs from 2023 and 2008 show changing presentations of instruments. Display figures suggest gestures, while musical skills are transmitted in the community.",
      ),
    ],
    t(
      "Vật liệu của nhạc cụ góp phần tạo âm sắc như thế nào?",
      "How do instrument materials contribute to their sound?",
    ),
    ["museum", "lam"],
  ),
  topic(
    "chapey",
    "culture",
    t("Chầm riêng Chà pây", "Chamrieng Chapey"),
    t(
      "Một người vừa đàn vừa ca kể, ứng tác từ tích truyện và đời sống.",
      "A solo performer plays, sings and improvises stories drawn from tales and daily life.",
    ),
    region,
    ["chapey", "ensemble", "exhibition"],
    [
      t(
        "Chầm riêng Chà pây là hình thức ca kể độc xướng với đàn Chà pây. Nghệ nhân có thể dựa vào tích truyện hoặc ứng tác từ hiện thực đời sống, gửi gắm kinh nghiệm và lời dạy qua tiếng đàn, lời ca.",
        "Chamrieng Chapey is solo sung storytelling accompanied by the Chapey lute. Performers draw on tales or improvise from life, sharing experience and teachings through music and verse.",
      ),
      t(
        "Cục Di sản văn hóa ghi nhận loại hình này được đưa vào Danh mục di sản văn hóa phi vật thể quốc gia năm 2013. Tính truyền miệng khiến việc học từ nghệ nhân và ghi chép tư liệu có ý nghĩa đặc biệt.",
        "The Department of Cultural Heritage records its inclusion in the national intangible heritage list in 2013. Oral transmission gives learning from practitioners and documentation particular importance.",
      ),
      t(
        "Một bài ca kể được tạo nên từ cả vốn truyện và sự linh hoạt của người diễn. Hiểu Chà pây cần chú ý tiếng đàn, lời ca và cách nghệ nhân đối thoại với đời sống, bên cạnh hình dáng nhạc cụ.",
        "Sung storytelling draws on both narrative knowledge and a performer's flexibility. Understanding Chapey involves its sound, words and engagement with life, as well as the instrument's form.",
      ),
    ],
    t(
      "Vì sao cùng một tích truyện có thể được ca kể theo nhiều cách?",
      "Why can the same tale be sung in different ways?",
    ),
    ["chapey"],
  ),
  topic(
    "clothing",
    "culture",
    t("Trang phục và bản sắc", "Dress and identity"),
    t(
      "Cách mặc kể về sinh hoạt, nghi lễ và nghệ thuật, không chỉ về hoa văn.",
      "Clothing speaks of daily life, ceremonies and performance, as well as decoration.",
    ),
    museum,
    ["clothing", "duke", "village"],
    [
      t(
        "Trang phục Khmer thay đổi theo hoàn cảnh: lao động, đến chùa, ngày hội, lễ cưới hay biểu diễn. Màu sắc, cách quấn và phụ kiện cần được đọc trong đúng bối cảnh sử dụng.",
        "Khmer dress varies with work, pagoda visits, festivals, weddings and performance. Colour, wrapping and accessories should be understood in their particular settings.",
      ),
      t(
        "Phòng trưng bày đặt phục trang bên cạnh các hình thức nghệ thuật và sinh hoạt. Khi xem một bộ đồ sân khấu, không nên xem đó là cách ăn mặc hằng ngày của toàn bộ cộng đồng.",
        "Displays connect dress to performing arts and everyday practices. A theatrical costume should not be taken as the daily clothing of the whole community.",
      ),
      t(
        "Ảnh các bộ trang phục trong bảo tàng giúp quan sát chất liệu và hình dáng. Những người may, mặc và truyền lại cách sử dụng làm nên đời sống của hiện vật ngoài tủ trưng bày.",
        "Museum costume photographs invite attention to material and form. Makers, wearers and those passing on their use sustain an object's life beyond its case.",
      ),
    ],
    t(
      "Bạn sẽ chọn chi tiết nào để phân biệt trang phục sinh hoạt và biểu diễn?",
      "Which details distinguish daily clothing from performance costumes?",
    ),
    ["museum", "customs"],
  ),
  topic(
    "wedding",
    "culture",
    t("Lễ cưới và lời chúc gắn kết", "Wedding customs and shared blessings"),
    t(
      "Nghi thức buộc chỉ cổ tay gửi gắm lời chúc của gia đình và cộng đồng.",
      "Wrist-thread tying conveys blessings from family and community.",
    ),
    museum,
    ["village", "clothing", "exhibition"],
    [
      t(
        "Trong phong tục cưới Khmer, nghi thức buộc chỉ cổ tay cho đôi trẻ thể hiện lời chúc và sự gắn kết. Lễ cưới có nhiều bước, có thể khác nhau theo gia đình và địa phương.",
        "In Khmer wedding customs, tying threads around the couple's wrists expresses blessings and connection. Ceremonial steps may vary between families and localities.",
      ),
      t(
        "Tư liệu của Bộ VHTTDL năm 2024 giới thiệu việc tái hiện lễ cưới ở bảo tàng. Trưng bày giúp người xem nhận diện nghi thức, trong khi ý nghĩa đầy đủ còn nằm ở quan hệ giữa người thân và cộng đồng.",
        "A 2024 Ministry report describes a wedding reconstruction at the museum. Displays introduce ritual actions, whose fuller meaning lies in relationships among relatives and community members.",
      ),
      t(
        "Qua mô hình và phục trang trong trưng bày, người xem có thể hình dung không gian sinh hoạt và tìm hiểu ý nghĩa của nghi thức. Những lời kể từ gia đình bổ sung cho hiện vật bằng ký ức về người thân và ngày cưới.",
        "Display models and costumes introduce everyday settings and ritual meanings. Family stories add memories of relatives and weddings to what objects alone can convey.",
      ),
    ],
    t(
      "Một lời chúc được thể hiện bằng hành động có ý nghĩa gì?",
      "What can a blessing expressed through an action convey?",
    ),
    ["customs"],
  ),
  topic(
    "crafts",
    "culture",
    t("Đan lát và nghề thủ công", "Weaving and craft skills"),
    t(
      "Tre, cói và bàn tay người thợ nối vật dụng thường ngày với tri thức địa phương.",
      "Bamboo, sedge and skilled hands connect everyday objects with local knowledge.",
    ),
    museum,
    ["fishing", "tools2008", "kitchen"],
    [
      t(
        "Đan lát, dệt chiếu và chế tác đồ dùng là những kỹ năng gắn với nguyên liệu sẵn có và nhu cầu sinh hoạt. Một vật dụng được tạo nên qua lựa chọn nguyên liệu, xử lý, kết cấu và kinh nghiệm sử dụng.",
        "Basketry, mat weaving and household craft respond to local materials and everyday needs. Objects emerge from material selection, preparation, construction and experience of use.",
      ),
      t(
        "Các làng nghề được nhắc tới trong tài liệu như Cà Hom – Bến Bạ, Giồng Đình và Trà Tro cho thấy nghề thủ công gắn với cộng đồng cụ thể. Đồ nghề trong bảo tàng mở ra câu chuyện rộng hơn về lao động và truyền nghề.",
        "Craft communities named in the supplied material, including Ca Hom – Ben Ba, Giong Dinh and Tra Tro, place skills in specific local settings. Museum tools open wider stories about work and transmission.",
      ),
      t(
        "Bộ ảnh tập trung vào dụng cụ đan và đồ dùng trưng bày. Kỹ thuật làm nghề cần được học từ người thực hành, không thể suy ra đầy đủ chỉ từ hình dáng một hiện vật.",
        "The photographs focus on woven implements and displayed household objects. Full craft techniques are learned from practitioners, rather than inferred from an object's shape alone.",
      ),
    ],
    t(
      "Dấu vết nào trên đồ dùng cho thấy kinh nghiệm của người làm?",
      "Which traces on an object reveal its maker's experience?",
    ),
    ["museum", "lam"],
  ),
  topic(
    "livelihood",
    "culture",
    t("Nông ngư cụ và đời sống", "Farming, fishing and daily life"),
    t(
      "Dụng cụ làm ruộng, đánh bắt và bếp nhà lưu lại nhịp sống của vùng đất.",
      "Farm tools, fishing implements and household kitchens preserve regional ways of life.",
    ),
    museum,
    ["farm", "fishing", "kitchen"],
    [
      t(
        "Nông ngư cụ phản ánh cách cư dân thích nghi với đất, nước và mùa vụ. Hình dáng của một dụng cụ liên quan đến công việc, môi trường và cách sử dụng được truyền qua thực hành.",
        "Farming and fishing tools reflect adaptation to land, water and seasons. Their forms relate to tasks, environments and uses learned through practice.",
      ),
      t(
        "Tại bảo tàng, nhóm dụng cụ lao động và đồ gia dụng giúp đưa câu chuyện văn hóa về đời sống thường ngày. Các hiện vật có thể là đồ sưu tầm hoặc phục chế; thông tin này cần được đọc theo nhãn của từng hiện vật.",
        "Working tools and household objects bring museum stories into everyday life. Objects may be collected originals or reconstructions; their status should be read from individual labels.",
      ),
      t(
        "Quan sát từ công cụ sản xuất đến bếp nhà cho thấy sự liên hệ giữa lao động, thức ăn và sinh hoạt gia đình. Đó cũng là cách nhìn di sản qua kinh nghiệm của những người sử dụng đồ vật.",
        "Looking from production tools to the household kitchen connects work, food and family life. It also reads heritage through the experience of an object's users.",
      ),
    ],
    t(
      "Một đồ dùng kể được những gì về môi trường sống của chủ nhân?",
      "What can an implement tell us about its user's environment?",
    ),
    ["museum", "lam"],
  ),
  topic(
    "food",
    "culture",
    t("Cốm dẹp và hương vị ngày hội", "Flat rice and festive flavours"),
    t(
      "Từ hạt lúa, chày cối đến món bánh, ẩm thực gắn với mùa vụ và nghề gia đình.",
      "Rice, mortars and cakes connect food to harvests and family crafts.",
    ),
    region,
    ["kitchen", "farm", "festival"],
    [
      t(
        "Cốm dẹp gắn với lễ Ok Om Bok và văn hóa nông nghiệp. Hạt lúa, chày cối và cách chế biến tạo nên mối nối giữa mùa vụ, lễ vật và bữa ăn của cộng đồng.",
        "Flat green rice accompanies Ok Om Bok and agricultural culture. Grain, mortars and preparation connect harvests, offerings and community meals.",
      ),
      t(
        "Bánh ống, bánh dừa và những món làm từ gạo cho thấy nghề chế biến được tiếp nối trong gia đình. Tư liệu về nghề làm bánh ở Trà Vinh bổ sung góc nhìn sinh kế bên cạnh ý nghĩa lễ hội.",
        "Tube cakes, coconut cakes and rice-based foods show skills passed on within families. Reports on Tra Vinh cake making add a livelihood perspective to festive meanings.",
      ),
      t(
        "Bếp và công cụ trong trưng bày giúp tìm hiểu hành trình từ nguyên liệu đến món ăn. Kinh nghiệm chế biến, hương vị và ký ức ăn cùng người thân là phần di sản được tiếp nối ngoài không gian bảo tàng.",
        "Displayed kitchens and tools introduce the journey from ingredients to food. Preparation skills, flavours and memories of shared meals continue this heritage beyond the museum.",
      ),
    ],
    t(
      "Một món ăn có thể lưu giữ ký ức mùa vụ và gia đình ra sao?",
      "How can food preserve memories of harvests and family life?",
    ),
    ["food", "festival"],
  ),
  topic(
    "ngo",
    "culture",
    t("Ghe Ngo: sức mạnh tập thể", "Ngo boats: collective strength"),
    t(
      "Từ nghề đóng ghe đến nhịp chèo, mỗi chiếc ghe gắn với chùa và cộng đồng.",
      "From boat building to rowing rhythm, each Ngo boat connects pagoda and community.",
    ),
    museum,
    ["boat", "temple", "festival"],
    [
      t(
        "Ghe Ngo vừa là sản phẩm thủ công, vừa gắn với sinh hoạt tập thể và lễ hội Khmer. Việc chế tác, bảo quản và tập luyện đòi hỏi sự phối hợp của nhiều người.",
        "Ngo boats are craft objects connected to collective life and Khmer festivals. Making, maintaining and training with them requires many people's cooperation.",
      ),
      t(
        "Một chiếc ghe thường gắn với cộng đồng chùa và đội chèo. Ý nghĩa của ghe nằm ở kỹ thuật, trang trí và cả nhịp phối hợp giữa các thành viên, vượt ra ngoài hình dáng chiếc thuyền.",
        "A boat often belongs to a pagoda community and rowing team. Its meaning lies in technique, decoration and coordinated movement, extending beyond its physical form.",
      ),
      t(
        "Mô hình ghe Ngo trưng bày trong nhà giúp quan sát hình dáng chiếc ghe trong không gian nhỏ. Từ mô hình ấy, câu chuyện mở rộng đến người đóng ghe, đội chèo và cộng đồng cùng gìn giữ biểu tượng này.",
        "The indoor Ngo boat model makes its form visible at a smaller scale. It opens a wider story about builders, rowers and the community preserving this symbol.",
      ),
    ],
    t(
      "Vì sao chiếc ghe là di sản của một tập thể?",
      "Why is a Ngo boat the heritage of a collective?",
    ),
    ["boat", "museum"],
  ),
  topic(
    "okom",
    "activities",
    t("Ok Om Bok: mùa trăng, mùa hội", "Ok Om Bok: moon and harvest"),
    t(
      "Lễ cúng trăng nối lòng biết ơn mùa vụ với hoa đăng và sinh hoạt cộng đồng.",
      "Moon offerings connect harvest gratitude with lanterns and community gatherings.",
    ),
    t("AO BÀ OM · TƯ LIỆU 2024", "AO BA OM · 2024 ARCHIVE"),
    ["festival", "lanterns", "opening2024"],
    [
      t(
        "Ok Om Bok, còn gọi lễ cúng trăng, gắn với rằm tháng Mười âm lịch và lời cảm tạ mùa màng. Cốm dẹp và các lễ vật mang ý nghĩa của văn hóa nông nghiệp Khmer.",
        "Ok Om Bok, the moon offering festival, is associated with the tenth lunar month's full moon and gratitude for harvests. Flat rice and offerings express Khmer agricultural culture.",
      ),
      t(
        "Trong quần thể Ao Bà Om, ngày hội có hoa đăng và những hoạt động cộng đồng. Đua ghe Ngo là một phần sinh hoạt lễ hội trong vùng, nhưng từng hoạt động có địa điểm và chương trình riêng.",
        "At the Ao Ba Om complex, festival gatherings include lanterns and community activities. Ngo boat racing belongs to regional celebrations, with its own venues and programmes.",
      ),
      t(
        "Bộ ảnh ghi lại mùa hội năm 2024, từ đêm lễ tại Ao Bà Om đến triển lãm cùng dịp ở bảo tàng. Đặt hai không gian bên nhau cho thấy mối nối giữa ký ức được lưu giữ và sinh hoạt được cộng đồng tiếp nối.",
        "The photographs document the 2024 season, from Ao Ba Om's festival night to the museum exhibition. Together they connect preserved memory with practices continued by the community.",
      ),
    ],
    t(
      "Điều gì nối lễ vật trong bảo tàng với một ngày hội đang sống?",
      "What connects a displayed offering with a living celebration?",
    ),
    ["festival", "event"],
  ),
  topic(
    "newyear",
    "activities",
    t("Chol Chnam Thmay", "Chol Chnam Thmay"),
    t(
      "Tết năm mới là dịp gặp gỡ, đến chùa và cầu mong những điều tốt lành.",
      "The Khmer New Year brings reunions, pagoda visits and wishes for wellbeing.",
    ),
    region,
    ["pagoda", "buddha", "clothing"],
    [
      t(
        "Chol Chnam Thmay là Tết năm mới của người Khmer, thường vào giữa tháng Tư dương lịch. Gia đình sum họp, đến chùa và tham gia những nghi thức theo truyền thống địa phương.",
        "Chol Chnam Thmay is the Khmer New Year, usually in mid-April. Families gather, visit pagodas and take part in locally observed traditions.",
      ),
      t(
        "Tục đắp núi cát và các nghi thức ở chùa được tài liệu giới thiệu như những cách gửi gắm ước nguyện. Thời gian và hình thức cụ thể cần đọc theo thông tin của cộng đồng tổ chức.",
        "Sand-mound building and pagoda ceremonies express wishes in the supplied material. Exact dates and practices depend on the organising community.",
      ),
      t(
        "Chùa Âng gần bảo tàng giúp đặt câu chuyện ngày Tết vào không gian văn hóa của quần thể. Khi tham quan nơi hành lễ, tìm hiểu quy tắc ứng xử và cách cộng đồng sử dụng không gian sẽ giúp chuyến đi thêm ý nghĩa.",
        "Nearby Ang Pagoda places the new-year story within the complex's cultural setting. Learning its etiquette and how the community uses the space enriches a visit.",
      ),
    ],
    t(
      "Ngày đầu năm tạo mối nối giữa gia đình và ngôi chùa như thế nào?",
      "How does the new year connect households and their pagoda?",
    ),
    ["customs", "satra"],
  ),
  topic(
    "dolta",
    "activities",
    t("Sen Dolta: nhớ về nguồn cội", "Sen Dolta: remembering ancestors"),
    t(
      "Lễ tưởng nhớ tổ tiên nhắc về lòng biết ơn và sự gắn kết giữa các thế hệ.",
      "Ancestor remembrance expresses gratitude and ties between generations.",
    ),
    region,
    ["pagoda", "village", "buddha"],
    [
      t(
        "Sen Dolta gắn với việc tưởng nhớ tổ tiên và những người đã khuất. Đây là dịp con cháu bày tỏ lòng biết ơn, sum họp và thực hiện nghi thức trong gia đình, ở chùa.",
        "Sen Dolta remembers ancestors and departed relatives. Descendants express gratitude, gather and observe ceremonies at home and in pagodas.",
      ),
      t(
        "Câu chuyện của lễ nằm ở sự tiếp nối giữa các thế hệ, qua việc chuẩn bị lễ vật, lời kể và cách thực hành được học từ người thân. Tập tục có thể khác nhau theo gia đình và địa phương.",
        "Its story lies in continuity through offerings, narratives and practices learned from relatives. Customs may differ between households and localities.",
      ),
      t(
        "Trưng bày sinh hoạt và tín ngưỡng giúp người xem đặt lễ Sen Dolta trong đời sống gia đình. Một nghi lễ trở nên gần gũi hơn khi được nhìn cùng những câu chuyện về cha mẹ, ông bà và quê hương.",
        "Everyday-life and belief displays place Sen Dolta within family life. The ceremony becomes more accessible alongside stories about parents, grandparents and home.",
      ),
    ],
    t(
      "Ký ức gia đình được truyền lại qua nghi lễ như thế nào?",
      "How do ceremonies transmit family memory?",
    ),
    ["customs", "satra"],
  ),
  topic(
    "kathina",
    "activities",
    t("Kathina: lễ dâng y", "Kathina: robe offering"),
    t(
      "Lễ dâng y sau mùa an cư thể hiện quan hệ giữa Phật tử và tăng đoàn.",
      "Robes offered after the rains retreat express ties between laypeople and the monastic community.",
    ),
    region,
    ["pagoda", "temple", "buddha"],
    [
      t(
        "Kathina là lễ dâng y trong truyền thống Phật giáo Nam tông, gắn với thời gian sau mùa an cư. Phật tử cùng chuẩn bị và dâng vật phẩm trong không gian chùa.",
        "Kathina is a Theravada robe offering associated with the period after the rains retreat. Laypeople prepare and offer gifts in pagoda settings.",
      ),
      t(
        "Lễ dâng y cho thấy vai trò cộng đồng của ngôi chùa: người góp vật phẩm, người tổ chức và người tham dự cùng tạo nên một sinh hoạt văn hóa tôn giáo.",
        "The ceremony reveals the pagoda's community role, bringing donors, organisers and participants together in religious and cultural life.",
      ),
      t(
        "Ảnh ngôi chùa và hiện vật giúp đặt lễ dâng y vào bối cảnh tín ngưỡng trong vùng. Từ một vật phẩm, người xem có thể tìm hiểu thêm về lòng thành, sự đóng góp và quan hệ giữa Phật tử với tăng đoàn.",
        "Pagoda and object photographs place robe offerings within regional religious life. An offered object opens questions about devotion, contribution and ties between laypeople and the monastic community.",
      ),
    ],
    t(
      "Một nghi lễ được cộng đồng cùng chuẩn bị có sức gắn kết gì?",
      "How can a collectively prepared ceremony strengthen ties?",
    ),
    ["customs"],
  ),
  topic(
    "exhibition2024",
    "activities",
    t("Di sản Khmer khoe sắc", "Khmer heritage on display"),
    t(
      "Triển lãm ngày 11/11/2024 nối bảo tàng với tuần lễ văn hóa và ngày hội Ok Om Bok.",
      "The 11 November 2024 exhibition connected the museum with cultural week and Ok Om Bok.",
    ),
    t("TẠI BẢO TÀNG · 11/11/2024", "AT THE MUSEUM · 11 NOV 2024"),
    ["opening2024", "exhibition2024", "donors2024"],
    [
      t(
        "Ngày 11/11/2024, bảo tàng khai mạc triển lãm nhân Ngày Di sản Văn hóa Việt Nam và tuần lễ văn hóa, du lịch gắn với Ok Om Bok. Hiện vật và tư liệu đưa câu chuyện Khmer đến với khách tham quan trong mùa hội.",
        "On 11 November 2024 the museum opened an exhibition marking Vietnam Cultural Heritage Day and the cultural-tourism week associated with Ok Om Bok.",
      ),
      t(
        "Báo Văn Hóa ghi lại hoạt động cắt băng, tham quan và ghi nhận đóng góp hiến tặng hiện vật. Bộ ảnh cho thấy triển lãm là kết quả của cả công tác chuyên môn lẫn sự đồng hành của cộng đồng.",
        "Van Hoa documented the opening, visits and recognition of donations. The photographs show exhibition work supported by both museum professionals and community contributions.",
      ),
      t(
        "Ba ảnh trong chủ đề đều thuộc sự kiện ngày 11/11/2024, do Trúc Phương ghi nhận. Đây là tư liệu về một hoạt động đã diễn ra, được tách khỏi thông tin lịch tham quan hiện tại.",
        "All three photographs document the 11 November 2024 event and are credited to Truc Phuong. They record a past activity rather than a current visit schedule.",
      ),
    ],
    t(
      "Người hiến tặng đã đóng góp gì cho câu chuyện của bảo tàng?",
      "How do donors contribute to a museum's story?",
    ),
    ["event"],
  ),
  topic(
    "gongs2025",
    "activities",
    t("Giao lưu cồng chiêng Tây Nguyên", "Central Highlands gong exchange"),
    t(
      "Triển lãm năm 2025 mở cuộc gặp gỡ giữa di sản Khmer và văn hóa các vùng miền.",
      "A 2025 exhibition created an encounter between Khmer heritage and other regional cultures.",
    ),
    t(
      "TẠI BẢO TÀNG · 24/04 – 25/05/2025",
      "AT THE MUSEUM · 24 APR – 25 MAY 2025",
    ),
    ["khmerDance", "highlands", "gongs"],
    [
      t(
        "Triển lãm Văn hóa Cồng chiêng Tây Nguyên – Xưa và Nay khai mạc tại bảo tàng ngày 24/04/2025, với sự phối hợp của Bảo tàng tỉnh Đắk Lắk và đơn vị bảo tàng Trà Vinh. Tư liệu ghi nhận hơn 100 hình ảnh, hiện vật và tài liệu.",
        "The Central Highlands Gong Culture exhibition opened here on 24 April 2025, through cooperation between Dak Lak and Tra Vinh museums, with over 100 images, objects and documents.",
      ),
      t(
        "Khai mạc có giao lưu giữa Đoàn Nghệ thuật tỉnh Đắk Lắk và Đoàn Nghệ thuật Khmer Ánh Bình Minh. Cồng chiêng Tây Nguyên được giới thiệu với nguồn gốc và chủ thể riêng, không được đồng nhất với nhạc ngũ âm Khmer.",
        "The opening featured Dak Lak performers and the Khmer Anh Binh Minh troupe. Central Highlands gong traditions retain their own communities and origins, distinct from Khmer Pinpeat.",
      ),
      t(
        "Triển lãm được công bố diễn ra đến ngày 25/05/2025. Ba ảnh trong chủ đề đều ghi nhận lễ khai mạc và các tiết mục giao lưu năm 2025, trước sảnh bảo tàng; đây là tư liệu về hoạt động đã diễn ra.",
        "The announced exhibition ran until 25 May 2025. All three photographs document its 2025 opening and exchange performances in front of the museum, recording a past activity.",
      ),
    ],
    t(
      "Giao lưu văn hóa giúp nhận ra nét chung và nét riêng như thế nào?",
      "How does cultural exchange reveal shared and distinctive qualities?",
    ),
    ["gongs"],
  ),
  topic(
    "maha",
    "people",
    t("Cụ Maha Sơn Thông", "Maha Son Thong"),
    t(
      "Tháp tưởng niệm trong khuôn viên nối ký ức về một trí thức Khmer với lịch sử địa phương.",
      "The grounds' memorial connects a Khmer intellectual's memory with regional history.",
    ),
    t("THÁP TƯỞNG NIỆM · KHUÔN VIÊN BẢO TÀNG", "MEMORIAL · MUSEUM GROUNDS"),
    ["memorial", "viStele", "khmerStele"],
    [
      t(
        "Cụ Maha Sơn Thông (1910–1997) là một lão thành cách mạng người Khmer. Danh xưng Maha gắn với nền tảng học vấn trong truyền thống Khmer, giúp mở một góc nhìn về mối liên hệ giữa tri thức, văn hóa và hoạt động xã hội.",
        "Maha Son Thong (1910–1997) was a Khmer revolutionary veteran. The Maha title connects to learning in Khmer tradition, opening a perspective on knowledge, culture and social engagement.",
      ),
      t(
        "Tháp tưởng niệm trong khuôn viên được xây năm 2012, theo bài giới thiệu của Bảo tàng Vĩnh Long. Văn bia và kiến trúc là những điểm để tìm hiểu cuộc đời được cộng đồng tưởng nhớ.",
        "The grounds' memorial was built in 2012, according to Vinh Long Museum. Its inscriptions and architecture introduce a life remembered by the community.",
      ),
      t(
        "Bộ ảnh của Huỳnh Như năm 2025 ghi lại tháp và văn bia tiếng Việt, tiếng Khmer. Hai ngôn ngữ giúp ký ức về cụ đến với nhiều người đọc, đồng thời thể hiện sự gắn bó giữa lịch sử và bản sắc cộng đồng.",
        "Huynh Nhu's 2025 photographs show the memorial and its Vietnamese and Khmer inscriptions. Two languages share his memory with more readers and connect history with community identity.",
      ),
    ],
    t(
      "Hai ngôn ngữ trên văn bia giúp ký ức được chia sẻ ra sao?",
      "How do two languages on a memorial share its memory?",
    ),
    ["memorial"],
  ),
  topic(
    "lamphen",
    "people",
    t("Lâm Phên: bàn tay gìn giữ", "Lam Phen: preserving through craft"),
    t(
      "Người chế tác nhạc cụ và phục dựng hiện vật giúp kỹ năng sống bước vào bảo tàng.",
      "An instrument maker and object restorer connects living skills with museum displays.",
    ),
    t("NGHỆ NHÂN · TƯ LIỆU 2010", "ARTISAN · 2010 PROFILE"),
    ["lam", "ensemble", "temple"],
    [
      t(
        "Lâm Phên lớn lên trong gia đình làm nghề xây dựng chùa tại Ba Se A. Ông học nghề từ cha, rồi tích lũy kỹ năng mộc, chế tác nhạc cụ, mão và mặt nạ qua nhiều trải nghiệm.",
        "Lam Phen grew up in a temple-building family in Ba Se A. Learning from his father, he developed woodworking, instrument, crown and mask-making skills.",
      ),
      t(
        "Tư liệu năm 2010 ghi nhận ông tham gia chế tạo, phục chế nhiều hiện vật và mô hình cho bảo tàng. Đóng góp ấy nối kỹ thuật của người thợ với việc giải thích đời sống Khmer cho khách tham quan.",
        "A 2010 report records his involvement in making and restoring objects and models for the museum. His contribution connects craft techniques with interpreting Khmer life for visitors.",
      ),
      t(
        "Ảnh Lâm Phên bên nhạc cụ năm 2010 giới thiệu công việc người thợ; dàn nhạc và mô hình trong bảo tàng mở rộng bối cảnh của nghề. Di sản được gìn giữ qua cả sản phẩm hoàn chỉnh lẫn kinh nghiệm chế tác được truyền lại.",
        "The 2010 instrument-making photograph introduces Lam Phen's work, while museum ensembles and models show the wider craft setting. Heritage survives through finished objects and transmitted making skills.",
      ),
    ],
    t(
      "Phục dựng một hiện vật cần tri thức nào ngoài việc làm giống hình dáng?",
      "What knowledge does reconstruction require beyond reproducing form?",
    ),
    ["lam"],
  ),
  topic(
    "thachsang",
    "people",
    t("Thạch Sang: truyền lại nghề", "Thach Sang: passing on the craft"),
    t(
      "Từ khuôn mặt nạ đến lớp học, kinh nghiệm được trao cho chư tăng và người trẻ.",
      "From mask moulds to workshops, experience passes to monks and young learners.",
    ),
    t("NGHỆ NHÂN · LỚP TRUYỀN DẠY 2023", "ARTISAN · 2023 WORKSHOP"),
    ["sang", "training", "mask"],
    [
      t(
        "Nghệ nhân ưu tú Thạch Sang được tư liệu Báo Văn Hóa giới thiệu với vai trò truyền dạy chế tác mão, mặt nạ và nghệ thuật truyền thống Khmer. Nghề đòi hỏi sự kiên trì và hiểu biết về nhân vật sân khấu.",
        "Van Hoa presents artisan Thach Sang as a teacher of crowns, masks and Khmer performing traditions. The craft requires patience and knowledge of theatrical characters.",
      ),
      t(
        "Bài ngày 13/12/2023 ghi nhận lớp truyền dạy có 54 học viên, gồm chư tăng và thanh thiếu niên Khmer. Người học được hướng dẫn kỹ thuật cơ bản và trao đổi kinh nghiệm với nghệ nhân.",
        "The 13 December 2023 report records 54 learners, including monks and young Khmer participants, receiving practical instruction and exchanging experience with artisans.",
      ),
      t(
        "Ảnh Thịnh Phúc ghi lại người dạy và lớp học năm 2023. Đặt cạnh hiện vật trưng bày, những khoảnh khắc hướng dẫn cho thấy kỹ năng được trao từ người này sang người khác qua quan sát, thực hành và chỉnh sửa.",
        "Thinh Phuc photographed the teacher and workshop in 2023. Alongside displayed objects, these teaching moments show skills passing between people through observation, practice and correction.",
      ),
    ],
    t(
      "Người học cần hiểu câu chuyện nhân vật trước khi làm mặt nạ ra sao?",
      "Why should a learner understand a character before making its mask?",
    ),
    ["masks"],
  ),
  topic(
    "thachmau",
    "people",
    t("Thạch Mâu và tiếng đàn Chà pây", "Thach Mau and the Chapey lute"),
    t(
      "Tư liệu di sản lưu lại vai trò của người nghệ nhân trong nghệ thuật ca kể truyền miệng.",
      "Heritage records preserve an artisan's role in oral sung storytelling.",
    ),
    t("NGHỆ NHÂN · HỒ SƠ DI SẢN", "ARTISAN · HERITAGE RECORD"),
    ["chapey", "exhibition", "ensemble"],
    [
      t(
        "Hồ sơ của Cục Di sản văn hóa nhắc đến nghệ nhân Thạch Mâu, sinh năm 1934, tại Chông Bát, Tân Hiệp, Trà Cú theo địa danh trong tư liệu. Ông nắm giữ khả năng đàn, ca kể và ứng tác Chầm riêng Chà pây.",
        "The heritage record names Thach Mau, born in 1934, from Chong Bat, Tan Hiep, Tra Cu as identified in the archive. It records his Chapey playing, singing and improvisation.",
      ),
      t(
        "Câu chuyện cho thấy một loại hình truyền miệng cần người thực hành để nối tiếp. Việc học không chỉ là thuộc lời mà còn là cách đàn, cách kể và đáp ứng từng hoàn cảnh trình diễn.",
        "His story shows how oral traditions depend on practitioners. Learning involves playing, storytelling and responding to performance situations, beyond memorising words.",
      ),
      t(
        "Hồ sơ di sản lưu lại tri thức và đóng góp của nghệ nhân ở thời điểm khảo sát. Việc ghi chép, học trực tiếp và khuyến khích người trẻ cùng tham gia giúp những câu chuyện của người ca kể tiếp tục được biết đến.",
        "Heritage records preserve practitioners' knowledge and contributions at the survey period. Documentation, direct learning and young people's participation help keep their storytelling known.",
      ),
    ],
    t(
      "Ghi âm một bài diễn có thay thế được việc học trực tiếp từ nghệ nhân?",
      "Can recording a performance replace learning directly from its practitioner?",
    ),
    ["chapey"],
  ),
  topic(
    "youngmakers",
    "people",
    t("Thế hệ trẻ tiếp nối", "A new generation of makers"),
    t(
      "Thạch Huỳnh Thươne và người thầy Sơn Cao Thắng nối nghề truyền thống với việc học và sáng tạo.",
      "Thach Huynh Thuone and teacher Son Cao Thang connect tradition with learning and creativity.",
    ),
    t("NGHỆ NHÂN · GIẢNG DẠY VÀ SÁNG TẠO", "ARTISANS · TEACHING AND CREATION"),
    ["thuone", "mask", "boat"],
    [
      t(
        "Phóng sự TTXVN năm 2021 giới thiệu Thạch Huỳnh Thươne với những sản phẩm mão, mặt nạ và mô hình văn hóa Khmer. Việc học ở Đại học Trà Vinh giúp anh tìm hiểu và theo đuổi nghề thủ công truyền thống.",
        "A 2021 VNA report introduces Thach Huynh Thuone's crowns, masks and Khmer cultural miniatures. Studies at Tra Vinh University helped him pursue traditional craft.",
      ),
      t(
        "Bài do Đại học Trà Vinh đăng năm 2025 ghi lại vai trò của Sơn Cao Thắng trong giảng dạy, nghiên cứu và hướng dẫn sinh viên. Mối liên hệ thầy trò đặt nghề truyền thống vào một môi trường học tập và sáng tạo mới.",
        "A 2025 university profile documents Son Cao Thang's teaching, research and student mentorship. This relationship places traditional skills within new learning and creative settings.",
      ),
      t(
        "Ảnh Thươne và sản phẩm của anh năm 2021, do An Hiếu chụp, cho thấy hướng sáng tạo từ nghề thủ công. Những chủ đề như ngôi chùa, nhạc cụ và ghe Ngo có thể trở thành cách kể di sản gần gũi với người trẻ.",
        "An Hieu's 2021 photograph of Thuone and his work shows creativity emerging from craft. Pagodas, instruments and Ngo boats can become subjects that make heritage accessible to young people.",
      ),
    ],
    t(
      "Một mô hình nhỏ có thể giúp người trẻ học di sản như thế nào?",
      "How can a miniature help young people learn about heritage?",
    ),
    ["young", "teaching"],
  ),
  topic(
    "keepers",
    "people",
    t("Những người giữ ký ức", "The people keeping memory"),
    t(
      "Cán bộ bảo tàng, người hiến tặng, thầy cô và khách tham quan cùng tiếp nối câu chuyện hiện vật.",
      "Museum staff, donors, teachers and visitors all continue the stories of objects.",
    ),
    t("BẢO TÀNG · CỘNG ĐỒNG · GIÁO DỤC", "MUSEUM · COMMUNITY · LEARNING"),
    ["exhibition2024", "donors2024", "training"],
    [
      t(
        "Một hiện vật đến với công chúng qua nhiều công việc: sưu tầm, kiểm kê, bảo quản, trưng bày và thuyết minh. Người giữ đồ vật và người kể chuyện cùng góp phần làm ký ức trở nên dễ tiếp cận.",
        "Objects reach the public through collecting, inventory, conservation, display and interpretation. Their custodians and storytellers make memory accessible.",
      ),
      t(
        "Người hiến tặng đóng góp hiện vật và bối cảnh sử dụng; thầy cô và học sinh mang thêm câu hỏi đến bảo tàng. Nghệ nhân và chư tăng tiếp nối những kỹ năng, chữ viết, âm nhạc trong đời sống cộng đồng.",
        "Donors contribute objects and their histories; teachers and students bring questions. Artisans and monks continue skills, writing and music in community life.",
      ),
      t(
        "Ảnh triển lãm và ghi nhận hiến tặng năm 2024, cùng lớp học năm 2023, cho thấy nhiều cách cùng gìn giữ di sản. Một câu hỏi của khách tham quan, một đồ vật được trao tặng hay một kỹ năng được truyền lại đều mở thêm câu chuyện.",
        "Exhibition and donation photographs from 2024 and the 2023 workshop show different ways to preserve heritage. A visitor's question, a donated object or a transmitted skill each opens another story.",
      ),
    ],
    t(
      "Bạn muốn hỏi người giữ một hiện vật câu chuyện gì?",
      "What would you ask the custodian of an object?",
    ),
    ["event", "masks", "satra"],
  ),
];
