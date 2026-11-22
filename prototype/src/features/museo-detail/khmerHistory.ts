import { khmerPlacePhotos, khmerPlaceSources } from "./khmerPlaces";

export type HistoryLanguage = "vi" | "en";
type Copy = Record<HistoryLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const khmerHistorySources = {
  archive: {
    title: t(
      "Bảo tàng Lịch sử Quốc gia · 2014",
      "National Museum of History · 2014",
    ),
    url: "https://baotanglichsu.vn/vi/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html",
  },
  early: {
    title: t(
      "Bảo tàng Lịch sử Quốc gia · 2008",
      "National Museum of History · 2008",
    ),
    url: khmerPlaceSources.museum.url,
  },
  reopening: {
    title: t(
      "TTXVN · Bảo tàng hấp dẫn du khách, 17/11/2014",
      "VNA · Museum reopening report, 17 November 2014",
    ),
    url: "https://baotintuc.vn/bao-tang-van-hoa-khmer-tra-vinh-hap-dan-du-khach-post410057.html",
  },
  acquisition: {
    title: t(
      "Bảo tàng Lịch sử Quốc gia · Sưu tầm 326 hiện vật, 2014",
      "National Museum of History · 326 objects collected, 2014",
    ),
    url: "https://baotanglichsu.vn/en/Articles/3174/16389/tra-vinh-museum-collecting-326-artifacts-from-khmer-ancient-life.html",
  },
  visitors: {
    title: t(
      "TTXVN · Khách tham quan dịp Ok Om Bok, 10/11/2022",
      "VNA · Ok Om Bok museum visits, 10 November 2022",
    ),
    url: "https://dantocmiennui.baotintuc.vn/bao-tang-van-hoa-dan-toc-khmer-tra-vinh-don-gan-9000-luot-khach-dip-le-hoi-ok-om-bok-post327654.html",
  },
  memorial: {
    title: t(
      "Bảo tàng Vĩnh Long · Tháp Maha Sơn Thông, 2025",
      "Vinh Long Museum · Maha Son Thong memorial, 2025",
    ),
    url: khmerPlaceSources.memorial.url,
  },
  mdta: {
    title: t(
      "Hiệp hội Du lịch ĐBSCL · Các điểm tiêu biểu năm 2024",
      "Mekong Delta Tourism Association · Recognised destinations, 2024",
    ),
    url: "https://mdta.com.vn/cong-nhan-4-diem-du-lich-tieu-bieu-o-dbscl-nam-2024/",
  },
  award: {
    title: t(
      "Báo Trà Vinh · Công nhận điểm du lịch, 2024",
      "Tra Vinh newspaper · Destination recognition, 2024",
    ),
    url: "https://travinh.baovinhlong.vn/van-hoa-the-thao/tra-vinh-co-them-02-diem-du-lich-tieu-bieu-dong-bang-song-cuu-long-35960.html",
  },
  tour: {
    title: t(
      "Bộ VHTTDL · Tour Làng Văn hóa Du lịch Khmer, 2018",
      "Ministry of Culture · Khmer Cultural Tourism Village tour, 2018",
    ),
    url: "https://bvhttdl.gov.vn/Pages/chi-tiet.aspx?url=%2Ftra-vinh-khai-truong-tour-lang-van-hoa-du-lich-khmer-625209.htm",
  },
  event: {
    title: t(
      "Báo Văn Hóa · Văn hóa Khmer Trà Vinh khoe sắc, 11/11/2024",
      "Van Hoa newspaper · Khmer heritage exhibition, 11 November 2024",
    ),
    url: "https://baovanhoa.vn/van-hoa-du-lich-dan-toc-thieu-so/van-hoa-dan-toc-khmer-tra-vinh-khoe-sac-111304.html",
  },
  locality: {
    title: t(
      "Cổng Chính phủ · Nghị quyết 1687 về đơn vị hành chính, 2025",
      "Government portal · Resolution 1687 on administrative units, 2025",
    ),
    url: "https://xaydungchinhsach.chinhphu.vn/sap-xep-dvhc-danh-sach-124-xa-phuong-cua-tinh-vinh-long-moi-119250623091001322.htm",
  },
  education: {
    title: t(
      "Trường Chính trị Phạm Hùng · Tham quan, tìm hiểu bảo tàng, 2026",
      "Pham Hung Political School · Museum study visit, 2026",
    ),
    url: "https://tctph.vinhlong.gov.vn/node/275",
  },
  objects: {
    title: t(
      "VietNamNet · Hiện vật văn hóa Khmer, 2023",
      "VietNamNet · Khmer cultural objects, 2023",
    ),
    url: khmerPlaceSources.objects.url,
  },
} as const;
type SourceId = keyof typeof khmerHistorySources;

const urls = import.meta.glob("../../assets/museo/khmer-history-*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const archivePhoto = (
  file: string,
  title: Copy,
  caption: Copy,
  author: string,
  source: SourceId,
) => ({
  src: urls[`../../assets/museo/${file}`],
  title,
  caption,
  author,
  sourceUrl: khmerHistorySources[source].url,
});
const existingPhotos = Object.fromEntries(
  Object.entries(khmerPlacePhotos).map(([id, photo]) => [
    id,
    { ...photo, sourceUrl: khmerPlaceSources[photo.source].url },
  ]),
) as unknown as Record<
  keyof typeof khmerPlacePhotos,
  Omit<(typeof khmerPlacePhotos)[keyof typeof khmerPlacePhotos], "source"> & {
    sourceUrl: string;
  }
>;
export const khmerHistoryPhotos = {
  ...existingPhotos,
  music2008: archivePhoto(
    "khmer-history-music-2008.bmp",
    t("Dàn ngũ âm trong trưng bày năm 2008", "Pinpeat display in 2008"),
    t(
      "Ảnh tư liệu dàn ngũ âm đi kèm bài giới thiệu bảo tàng ngày 31/08/2008.",
      "Archive photograph of the Pinpeat ensemble accompanying the museum report of 31 August 2008.",
    ),
    "Bảo tàng Lịch sử Quốc gia · 2008",
    "early",
  ),
  tools2008: archivePhoto(
    "khmer-history-tools-2008.bmp",
    t(
      "Nông ngư cụ trong trưng bày năm 2008",
      "Agricultural and fishing implements in 2008",
    ),
    t(
      "Ảnh tư liệu các dụng cụ đan tre, bẫy và ngư cụ trong bài giới thiệu bảo tàng năm 2008.",
      "Archive photograph of woven implements, traps and fishing equipment in the 2008 museum report.",
    ),
    "Bảo tàng Lịch sử Quốc gia · 2008",
    "early",
  ),
  opening2024: archivePhoto(
    "khmer-history-opening-2024.jpg",
    t(
      "Khai mạc triển lãm ngày 11/11/2024",
      "Exhibition opening on 11 November 2024",
    ),
    t(
      "Các đại biểu cắt băng khai mạc triển lãm tại bảo tàng, gắn với Ngày Di sản Văn hóa Việt Nam và tuần lễ Ok Om Bok năm 2024.",
      "Ribbon cutting at the museum's exhibition marking Vietnam Cultural Heritage Day and the 2024 Ok Om Bok cultural week.",
    ),
    "Trúc Phương · Báo Văn Hóa, 2024",
    "event",
  ),
  exhibition2024: archivePhoto(
    "khmer-history-exhibition-2024.jpg",
    t("Tham quan triển lãm năm 2024", "Visiting the 2024 exhibition"),
    t(
      "Các đại biểu tìm hiểu hiện vật tại triển lãm khai mạc ngày 11/11/2024.",
      "Delegates studying objects at the exhibition opened on 11 November 2024.",
    ),
    "Trúc Phương · Báo Văn Hóa, 2024",
    "event",
  ),
  donors2024: archivePhoto(
    "khmer-history-donors-2024.jpg",
    t("Ghi nhận đóng góp hiến tặng hiện vật", "Recognising object donations"),
    t(
      "Trao giấy khen cho hai tập thể hiến tặng hiện vật cho ngành văn hóa tại sự kiện ngày 11/11/2024.",
      "Commendations for two groups donating objects to the provincial cultural sector, 11 November 2024.",
    ),
    "Trúc Phương · Báo Văn Hóa, 2024",
    "event",
  ),
};
export type HistoryPhotoId = keyof typeof khmerHistoryPhotos;
export interface HistoryTopic {
  id: string;
  date: Copy;
  title: Copy;
  summary: Copy;
  photo: HistoryPhotoId;
  paragraphs: Copy[];
  sources: SourceId[];
}
export interface HistoryPhase {
  id: string;
  title: Copy;
  range: string;
  subtitle: Copy;
  kicker: Copy;
  description: Copy;
  preview: Copy;
  photo: HistoryPhotoId;
  photoDate: Copy;
  facts: { label: Copy; value: Copy }[];
  topics: HistoryTopic[];
}
const story = (
  id: string,
  date: Copy,
  title: Copy,
  summary: Copy,
  photo: HistoryPhotoId,
  paragraphs: Copy[],
  sources: SourceId[],
): HistoryTopic => ({ id, date, title, summary, photo, paragraphs, sources });
const fact = (label: Copy, value: Copy) => ({ label, value });

export const khmerHistoryPhases: HistoryPhase[] = [
  {
    id: "formation",
    title: t("HÌNH THÀNH", "FOUNDATION"),
    range: "1992 – 1997",
    subtitle: t("Từ ý tưởng đến mở cửa", "From purpose to public opening"),
    kicker: t("MỘT NƠI GÌN GIỮ BẢN SẮC", "A HOME FOR KHMER HERITAGE"),
    description: t(
      "Từ nhu cầu gìn giữ văn hóa Khmer, bảo tàng được xây dựng năm 1992, khánh thành năm 1995 và bắt đầu phục vụ khách vào tháng 11/1997.",
      "Built to preserve Khmer culture, the museum began construction in 1992, was inaugurated in 1995 and started welcoming visitors in November 1997.",
    ),
    preview: t(
      "Ba mốc riêng: xây dựng, khánh thành và mở cửa phục vụ khách.",
      "Construction, inauguration and public opening: three separate dates.",
    ),
    photo: "facade",
    photoDate: t("MẶT TIỀN · ẢNH 2023", "FACADE · PHOTO 2023"),
    facts: [
      fact(t("Khởi công", "Construction"), t("1992", "1992")),
      fact(t("Khánh thành", "Inauguration"), t("1995", "1995")),
      fact(t("Phục vụ khách", "Public opening"), t("11/1997", "11/1997")),
      fact(t("Kiến trúc", "Building"), t("2 tầng", "2 floors")),
    ],
    topics: [
      story(
        "formation-purpose",
        t("ĐẦU THẬP NIÊN 1990", "EARLY 1990s"),
        t("Khởi nguồn bảo tồn", "The purpose of preservation"),
        t(
          "Tạo một nơi lưu giữ ký ức và đời sống văn hóa Khmer Nam Bộ.",
          "A place to preserve the memory and cultural life of southern Khmer communities.",
        ),
        "roof",
        [
          t(
            "Bảo tàng ra đời từ nhu cầu sưu tầm, gìn giữ và giới thiệu văn hóa của đồng bào Khmer tại Trà Vinh. Hiện vật được đặt trong quan hệ với đời sống, tín ngưỡng và nghệ thuật của cộng đồng.",
            "The museum grew from the need to collect, preserve and present Khmer culture in Tra Vinh. Objects are understood through the community's daily life, beliefs and arts.",
          ),
          t(
            "Trong bối cảnh Trà Vinh được tái lập vào đầu thập niên 1990, công trình góp thêm một thiết chế văn hóa chuyên đề cho địa phương. Năm 1992 là mốc xây dựng được TTXVN ghi nhận trong bài viết năm 2022.",
            "As Tra Vinh was re-established in the early 1990s, the project added a dedicated cultural institution to the province. A 2022 VNA report records 1992 as the construction milestone.",
          ),
          t(
            "Vị trí bên Ao Bà Om và Chùa Âng giúp câu chuyện bảo tàng gắn với một không gian văn hóa còn sống. Từ hiện vật trong phòng trưng bày, khách có thể tiếp tục tìm hiểu cảnh quan và sinh hoạt cộng đồng ở vùng lân cận.",
            "Its setting beside Ao Ba Om and Ang Pagoda connects the museum with a living cultural landscape. Visitors can move from objects in the galleries to the surrounding landscape and community life.",
          ),
        ],
        ["visitors", "archive"],
      ),
      story(
        "formation-construction",
        t("1992", "1992"),
        t("Bắt đầu xây dựng", "Construction begins"),
        t(
          "Khởi đầu hành trình xây dựng một bảo tàng chuyên đề văn hóa Khmer.",
          "The beginning of a dedicated museum of Khmer culture.",
        ),
        "facade",
        [
          t(
            "Theo TTXVN, Bảo Tàng Văn Hóa Dân Tộc Khmer được xây dựng năm 1992. Đây là điểm bắt đầu của tiến trình hình thành công trình, trước khi bảo tàng đi vào hoạt động phục vụ khách.",
            "VNA records that construction of the Khmer Ethnic Cultural Museum in Tra Vinh began in 1992. This marks the building's formation, before its public operation.",
          ),
          t(
            "Bảo tàng được đặt trong cụm văn hóa Ao Bà Om – Chùa Âng. Không gian cây xanh và kiến trúc Khmer tạo mối liên hệ giữa tòa nhà trưng bày với cảnh quan bên ngoài.",
            "The museum sits within the Ao Ba Om–Ang Pagoda cultural cluster. Trees and Khmer architectural details connect the exhibition building with its surroundings.",
          ),
          t(
            "Ảnh mặt tiền sử dụng ở đây được chụp năm 2023, cho thấy diện mạo công trình ở thời điểm đó. Mốc năm 1992 thuộc lịch sử xây dựng; ảnh này là tư liệu kiến trúc về sau.",
            "The facade photograph shown here was taken in 2023 and documents the building at that time. The 1992 date refers to construction history; this is a later architectural record.",
          ),
        ],
        ["visitors", "objects"],
      ),
      story(
        "formation-inauguration",
        t("1995", "1995"),
        t("Mốc khánh thành", "The inauguration milestone"),
        t(
          "Tư liệu Bảo tàng Lịch sử Quốc gia ghi nhận khánh thành năm 1995.",
          "The National Museum of History records inauguration in 1995.",
        ),
        "temple",
        [
          t(
            "Bài giới thiệu của Bảo tàng Lịch sử Quốc gia năm 2014 ghi nhận bảo tàng được khánh thành năm 1995. Timeline giữ mốc này riêng để phản ánh đúng cách các nguồn mô tả quá trình hình thành.",
            "A 2014 National Museum of History article records inauguration in 1995. The timeline keeps this milestone separate to reflect how the sources describe the museum's formation.",
          ),
          t(
            "Khánh thành công trình và bắt đầu hoạt động phục vụ khách được các tư liệu ghi bằng hai mốc khác nhau. TTXVN nêu thời điểm đưa vào hoạt động là tháng 11/1997.",
            "Sources give separate dates for inauguration and public operation. VNA reports that the museum began operating in November 1997.",
          ),
          t(
            "Việc đọc hai mốc cạnh nhau giúp hiểu lịch sử theo từng bước: xây dựng cơ sở, khánh thành và vận hành trưng bày. Tư liệu hiện có chưa giải thích đầy đủ khoảng thời gian giữa hai sự kiện.",
            "Reading the dates together shows successive steps: building, inauguration and operating the galleries. The available reports do not fully explain the interval between the latter two events.",
          ),
        ],
        ["archive", "visitors"],
      ),
      story(
        "formation-opening",
        t("THÁNG 11/1997", "NOVEMBER 1997"),
        t("Đón khách tham quan", "Welcoming the public"),
        t(
          "Bảo tàng bắt đầu hoạt động, đưa di sản Khmer đến gần công chúng.",
          "Public operation brings Khmer heritage to visitors.",
        ),
        "exhibition",
        [
          t(
            "Tháng 11/1997 là mốc bắt đầu hoạt động được TTXVN công bố trong bài viết ngày 10/11/2022. Từ đây, bảo tàng trở thành một địa chỉ tham quan và tìm hiểu văn hóa Khmer tại Trà Vinh.",
            "November 1997 is the start of operation reported by VNA on 10 November 2022. The museum became a destination for learning about Khmer culture in Tra Vinh.",
          ),
          t(
            "Hiện vật, mô hình và tư liệu giới thiệu những khía cạnh của đời sống vật chất, tinh thần và nghệ thuật. Nội dung trưng bày tiếp tục được sưu tầm và chỉnh lý qua các giai đoạn sau.",
            "Objects, models and documents introduce material life, spiritual traditions and the arts. The collections and displays continued to develop in later periods.",
          ),
          t(
            "Mốc mở cửa đánh dấu bước chuyển từ một công trình văn hóa sang hoạt động phục vụ công chúng. Ảnh phòng trưng bày đi kèm là tư liệu năm 2023, minh họa không gian bảo tàng ở thời điểm chụp.",
            "Public opening marks the transition from a cultural building to a visitor institution. The accompanying gallery photograph is from 2023 and illustrates the museum at that later date.",
          ),
        ],
        ["visitors", "objects"],
      ),
      story(
        "formation-architecture",
        t("CÔNG TRÌNH HAI TẦNG", "A TWO-STOREY BUILDING"),
        t("Dấu ấn kiến trúc Khmer", "Khmer architectural identity"),
        t(
          "Mái, hoa văn và lối lên tầng lầu tạo nên nhận diện của bảo tàng.",
          "The roof, ornament and upper-floor approach shape the museum's identity.",
        ),
        "roof",
        [
          t(
            "Tòa nhà hai tầng mang đường nét kiến trúc Khmer, với mái ngói, các chi tiết trang trí và lối lên tầng lầu. Diện mạo ấy đặt bảo tàng trong mạch kiến trúc của cụm Chùa Âng – Ao Bà Om.",
            "The two-storey building uses Khmer architectural forms, tiled roofs, decorative details and an approach to the upper floor. Its appearance belongs to the architectural setting of Ang Pagoda and Ao Ba Om.",
          ),
          t(
            "Bài giới thiệu năm 2008 mô tả tầng dưới dành cho hoạt động làm việc, tầng trên dành cho trưng bày. Phía trước có hồ bán nguyệt, góp phần tạo khoảng chuyển tiếp giữa sân và tòa nhà.",
            "The 2008 report describes offices on the ground floor and exhibitions upstairs. A semicircular pond in front forms a transition between the grounds and the building.",
          ),
          t(
            "Kiến trúc là phần mở đầu của trải nghiệm tham quan: trước khi bước vào bộ sưu tập, khách đã có thể quan sát màu sắc, cấu trúc mái và hoa văn. Ảnh đi kèm được chụp năm 2023.",
            "Architecture introduces the visit before the collections: colours, roof forms and ornament can be observed on arrival. The accompanying photograph dates from 2023.",
          ),
        ],
        ["early", "objects"],
      ),
    ],
  },
  {
    id: "preservation",
    title: t("LƯU GIỮ", "PRESERVATION"),
    range: "1997 – 2008",
    subtitle: t("Định hình các bộ sưu tập", "Shaping the collections"),
    kicker: t("HIỆN VẬT KỂ CHUYỆN CỘNG ĐỒNG", "OBJECTS TELL COMMUNITY STORIES"),
    description: t(
      "Những năm đầu hoạt động định hình câu chuyện tín ngưỡng, đời sống và nghệ thuật. Tư liệu năm 2008 mô tả ba phòng trưng bày trên tầng lầu.",
      "The early displays developed around belief, daily life and the arts. A 2008 report describes three exhibition rooms on the upper floor.",
    ),
    preview: t(
      "Ba phòng trong tư liệu 2008: tín ngưỡng, đời sống và nghệ thuật.",
      "The 2008 record: belief, daily life and arts across three rooms.",
    ),
    photo: "music2008",
    photoDate: t("DÀN NGŨ ÂM · TƯ LIỆU 2008", "PINPEAT · ARCHIVE 2008"),
    facts: [
      fact(t("Trưng bày 2008", "2008 displays"), t("3 phòng", "3 rooms")),
      fact(t("Tín ngưỡng", "Belief"), t("Chùa & nghi lễ", "Temples & ritual")),
      fact(t("Đời sống", "Daily life"), t("Nông & ngư cụ", "Farm & fishing")),
      fact(t("Nghệ thuật", "Arts"), t("Ngũ âm & múa", "Music & dance")),
    ],
    topics: [
      story(
        "preservation-rooms",
        t("TƯ LIỆU 2008", "2008 RECORD"),
        t("Ba phòng trưng bày đầu kỳ", "Three early exhibition rooms"),
        t(
          "Một lát cắt về cách tổ chức trưng bày trong giai đoạn đầu.",
          "A dated view of the organisation of the early galleries.",
        ),
        "tools2008",
        [
          t(
            "Bài viết ngày 31/08/2008 của Bảo tàng Lịch sử Quốc gia mô tả ba phòng trưng bày ở tầng trên. Đây là ghi nhận tại một thời điểm trong lịch sử hoạt động.",
            "The National Museum of History report dated 31 August 2008 describes three rooms upstairs. It provides a snapshot of a particular period in the museum's history.",
          ),
          t(
            "Phòng đầu giới thiệu tín ngưỡng và sinh hoạt chùa; phòng tiếp theo tập trung vào sản xuất, đời sống và chữ viết; phòng còn lại giới thiệu nghệ thuật, âm nhạc và sân khấu.",
            "The first room presented belief and temple life; the next covered production, everyday life and writing; the remaining room introduced art, music and theatre.",
          ),
          t(
            "Những nguồn về sau ghi nhận bốn phòng năm 2014 và năm phòng năm 2022. Các con số thuộc các lần giới thiệu khác nhau, cho thấy việc trưng bày được tiếp tục phát triển.",
            "Later reports describe four rooms in 2014 and five in 2022. These are records from different dates and show the continuing development of the displays.",
          ),
        ],
        ["early", "reopening", "visitors"],
      ),
      story(
        "preservation-belief",
        t("TRƯNG BÀY ĐẦU KỲ", "EARLY DISPLAYS"),
        t("Tín ngưỡng và sinh hoạt chùa", "Belief and temple life"),
        t(
          "Tượng, mô hình và vật dụng đưa khách đến với đời sống tinh thần Khmer.",
          "Sculpture, models and objects introduce Khmer spiritual life.",
        ),
        "temple",
        [
          t(
            "Trong mô tả năm 2008, phòng đầu tiên giới thiệu các khía cạnh tín ngưỡng và tôn giáo của người Khmer. Hiện vật liên quan đến ngôi chùa giúp người xem hiểu vai trò của không gian này trong cộng đồng.",
            "In the 2008 account, the first room introduced Khmer belief and religion. Objects associated with the pagoda helped visitors understand its place in community life.",
          ),
          t(
            "Mô hình, tượng và vật dụng được nhìn trong quan hệ với nghi lễ và sinh hoạt. Ngôi chùa cũng gắn với giáo dục, chữ viết và việc lưu truyền các giá trị văn hóa.",
            "Models, sculpture and implements are understood through ritual and daily practice. The pagoda also connects with education, writing and the transmission of cultural values.",
          ),
          t(
            "Mô hình chánh điện trong ảnh thuộc bài giới thiệu bảo tàng năm 2014. Đặt cạnh tư liệu 2008, ảnh giúp hình dung một chủ đề xuyên suốt của bộ sưu tập.",
            "The sanctuary model in the photograph accompanies the 2014 museum report. Read alongside the 2008 account, it illustrates a continuing collection theme.",
          ),
        ],
        ["early", "archive"],
      ),
      story(
        "preservation-daily",
        t("TRƯNG BÀY ĐẦU KỲ", "EARLY DISPLAYS"),
        t("Đời sống qua nông ngư cụ", "Daily life through working tools"),
        t(
          "Dụng cụ sản xuất lưu lại tri thức thích nghi với đồng ruộng và sông nước.",
          "Working tools preserve knowledge of fields and waterways.",
        ),
        "tools2008",
        [
          t(
            "Những nông ngư cụ trong tư liệu năm 2008 phản ánh công việc thường ngày của người Khmer Nam Bộ. Tre, gỗ và các vật liệu quen thuộc được tạo thành dụng cụ sản xuất, đánh bắt và sinh hoạt.",
            "Agricultural and fishing implements in the 2008 record reflect everyday work among southern Khmer communities. Bamboo, wood and familiar materials were shaped into tools for farming, fishing and domestic life.",
          ),
          t(
            "Giá trị của dụng cụ nằm cả ở kỹ thuật chế tác và cách sử dụng. Nhìn vào hình dáng, cách đan và cấu tạo, người xem có thể tìm hiểu tri thức nghề nghiệp được truyền qua nhiều thế hệ.",
            "The tools carry both making skills and knowledge of use. Their shapes, weaving and construction reveal practical knowledge transmitted across generations.",
          ),
          t(
            "Ảnh tư liệu giữ lại một cách bày hiện vật của giai đoạn đầu. Đây cũng là nền tảng để theo dõi những lần bổ sung sưu tập và chỉnh lý trưng bày sau này.",
            "The archive photograph preserves an early arrangement of the objects. It also provides a reference for understanding later collecting and gallery revisions.",
          ),
        ],
        ["early"],
      ),
      story(
        "preservation-arts",
        t("TƯ LIỆU 2008", "2008 RECORD"),
        t(
          "Ngũ âm và nghệ thuật diễn xướng",
          "Pinpeat and performing traditions",
        ),
        t(
          "Nhạc cụ, múa và sân khấu mở rộng câu chuyện từ vật dụng đến nghệ thuật.",
          "Instruments, dance and theatre extend the story into the arts.",
        ),
        "music2008",
        [
          t(
            "Tư liệu năm 2008 giới thiệu phòng nghệ thuật với nhạc cụ và các hình thức biểu diễn Khmer. Dàn ngũ âm là một điểm nhấn giúp khách hiểu mối liên hệ giữa âm nhạc, nghi lễ và sinh hoạt cộng đồng.",
            "The 2008 report describes an arts room with instruments and Khmer performance traditions. Pinpeat introduces the relationship between music, ritual and community life.",
          ),
          t(
            "Nhạc cụ trưng bày là vật thể, còn âm nhạc thuộc về thực hành của con người. Việc đặt chúng cạnh tư liệu về múa và sân khấu giúp câu chuyện nghệ thuật có thêm bối cảnh.",
            "Displayed instruments are physical objects, while music lives through human practice. Presenting them beside dance and theatre records adds context to the story of the arts.",
          ),
          t(
            "Ảnh dàn ngũ âm này là tư liệu năm 2008. Các hình ảnh nghệ thuật trong những lần giới thiệu về sau cho thấy chủ đề tiếp tục được giữ trong nội dung bảo tàng.",
            "This Pinpeat photograph dates from 2008. Later museum reports show that performing traditions remained an enduring exhibition theme.",
          ),
        ],
        ["early", "archive"],
      ),
      story(
        "preservation-memory",
        t("1997 – 2008", "1997 – 2008"),
        t("Từ vật dụng đến ký ức", "From objects to memory"),
        t(
          "Trang phục, chữ viết và nghề truyền thống làm rõ bối cảnh của hiện vật.",
          "Clothing, writing and crafts provide the context behind objects.",
        ),
        "clothing",
        [
          t(
            "Các trưng bày đầu kỳ đặt hiện vật trong đời sống Khmer: lao động, ăn mặc, chữ viết, tín ngưỡng và nghệ thuật. Cách tổ chức ấy giúp một món đồ trở thành điểm bắt đầu của câu chuyện cộng đồng.",
            "The early displays situated objects within Khmer life: work, dress, writing, belief and the arts. An individual object became an entry point into community history.",
          ),
          t(
            "Tư liệu năm 2008 nhắc đến trang phục và chữ viết bên cạnh nông ngư cụ. Những chủ đề này gợi mở việc lưu truyền tri thức, phong tục và kỹ năng giữa các thế hệ.",
            "The 2008 report mentions clothing and writing alongside agricultural and fishing implements. These themes reveal how knowledge, customs and skills pass between generations.",
          ),
          t(
            "Ảnh trang phục đi kèm được chụp năm 2023. Khi đối chiếu ảnh và bài giới thiệu ở các thời kỳ, người xem có thể nhận ra những chủ đề được bảo tàng tiếp tục gìn giữ.",
            "The clothing photograph shown here dates from 2023. Comparing photographs and reports from different periods reveals themes the museum continues to preserve.",
          ),
        ],
        ["early", "objects"],
      ),
    ],
  },
  {
    id: "renewal",
    title: t("ĐỔI MỚI", "RENEWAL"),
    range: "2012 – 2014",
    subtitle: t("Chỉnh lý và mở cửa trở lại", "Renewing and reopening"),
    kicker: t(
      "THÊM KHÔNG GIAN, THÊM CÂU CHUYỆN",
      "MORE SPACE FOR HERITAGE STORIES",
    ),
    description: t(
      "Tháp Maha Sơn Thông được xây dựng năm 2012. Sau gần hai năm nâng cấp, bảo tàng mở cửa trở lại khoảng tháng 10/2014 với nội dung trưng bày được chỉnh lý.",
      "The Maha Son Thong memorial was built in 2012. After nearly two years of improvements, the museum reopened around October 2014 with renewed displays.",
    ),
    preview: t(
      "Năm 2012 thêm tháp tưởng niệm; năm 2014 chỉnh lý và mở cửa trở lại.",
      "A 2012 memorial; renewed displays and reopening in 2014.",
    ),
    photo: "exhibition",
    photoDate: t("PHÒNG TRƯNG BÀY · ẢNH 2023", "GALLERY · PHOTO 2023"),
    facts: [
      fact(t("Tháp tưởng niệm", "Memorial"), t("2012", "2012")),
      fact(t("Mở lại", "Reopening"), t("Khoảng 10/2014", "Approx. 10/2014")),
      fact(t("Trưng bày 2014", "2014 displays"), t("4 phòng", "4 rooms")),
      fact(
        t("Dự án sưu tầm", "Collecting project"),
        t("326 hiện vật", "326 objects"),
      ),
    ],
    topics: [
      story(
        "renewal-memorial",
        t("2012", "2012"),
        t("Tháp Maha Sơn Thông", "Maha Son Thong memorial"),
        t(
          "Bổ sung không gian tưởng niệm trong khuôn viên bảo tàng.",
          "A memorial space added to the museum grounds.",
        ),
        "memorial",
        [
          t(
            "Theo bài viết của Bảo tàng Vĩnh Long năm 2025, tháp tưởng niệm cụ Maha Sơn Thông được xây dựng năm 2012 trong khuôn viên Bảo Tàng Văn Hóa Dân Tộc Khmer.",
            "Vinh Long Museum's 2025 article states that the Maha Son Thong memorial was built in 2012 within the grounds of the Khmer Ethnic Cultural Museum in Tra Vinh.",
          ),
          t(
            "Công trình lưu giữ ký ức về một vị lão thành cách mạng người Khmer. Bia và không gian tưởng niệm bổ sung một lớp lịch sử con người bên cạnh các trưng bày văn hóa.",
            "The monument preserves the memory of a Khmer revolutionary veteran. The inscriptions and memorial setting add a human history alongside the cultural displays.",
          ),
          t(
            "Ảnh đi kèm do Bảo tàng Vĩnh Long công bố năm 2025. Năm xây dựng của công trình và năm của tư liệu ảnh được ghi riêng để thuận tiện đối chiếu.",
            "The accompanying photograph was published by Vinh Long Museum in 2025. The construction year and photograph's publication date are recorded separately.",
          ),
        ],
        ["memorial"],
      ),
      story(
        "renewal-upgrade",
        t("KHOẢNG 2012 – 2014", "APPROX. 2012 – 2014"),
        t("Nâng cấp và chỉnh lý", "Upgrading and revising displays"),
        t(
          "Gần hai năm đầu tư cho công trình và nội dung trưng bày.",
          "Nearly two years of work on the building and its displays.",
        ),
        "roof",
        [
          t(
            "Bản tin TTXVN ngày 17/11/2014 cho biết bảo tàng đóng cửa gần hai năm để nâng cấp và chỉnh lý, với tổng kinh phí dự án trên 7 tỷ đồng.",
            "VNA's 17 November 2014 report states that the museum closed for nearly two years for improvements and gallery revisions, with total project funding of more than VND 7 billion.",
          ),
          t(
            "Hiệp hội Du lịch ĐBSCL ghi nhận riêng phần chỉnh lý trưng bày năm 2014 có kinh phí 3,36 tỷ đồng. Hai số liệu nói về các phạm vi đầu tư khác nhau.",
            "The Mekong Delta Tourism Association separately records VND 3.36 billion for the 2014 exhibition revision. The figures refer to different scopes of work.",
          ),
          t(
            "Đợt đầu tư tạo cơ hội sắp xếp lại hiện vật, mô hình và chủ đề. Khách được tiếp cận câu chuyện văn hóa theo không gian trưng bày được bổ sung và hoàn thiện.",
            "The investment allowed objects, models and themes to be reorganised. Visitors encountered cultural stories through improved and expanded displays.",
          ),
        ],
        ["reopening", "mdta"],
      ),
      story(
        "renewal-reopening",
        t("KHOẢNG THÁNG 10/2014", "AROUND OCTOBER 2014"),
        t("Mở cửa trở lại", "Opening again"),
        t(
          "Hơn 10.000 lượt khách sau hơn một tháng mở lại, theo bản tin năm 2014.",
          "More than 10,000 visits after over a month of reopening, according to the 2014 report.",
        ),
        "exhibition",
        [
          t(
            "Ngày 17/11/2014, TTXVN cho biết bảo tàng đã mở cửa trở lại hơn một tháng và đón trên 10.000 lượt khách. Từ thông tin này, thời điểm mở lại được ghi khoảng tháng 10/2014.",
            "On 17 November 2014, VNA reported that the museum had reopened for over a month and received more than 10,000 visits. This places reopening around October 2014.",
          ),
          t(
            "Mốc tháng 10 là ước lượng từ bản tin, chưa phải ngày khai trương chính xác. Số lượt khách phản ánh giai đoạn ngay sau đợt chỉnh lý, trong bối cảnh hoạt động văn hóa địa phương.",
            "October is an estimate from the report rather than an exact opening date. The visitor figure belongs to the period immediately following the gallery revision.",
          ),
          t(
            "Sự kiện mở lại nối hoạt động bảo tồn với nhu cầu tham quan và học hỏi. Các trưng bày về lao động, tín ngưỡng, phong tục và nghệ thuật trở lại phục vụ công chúng.",
            "Reopening connected preservation with public interest in visiting and learning. Displays of work, belief, customs and the arts again welcomed visitors.",
          ),
        ],
        ["reopening"],
      ),
      story(
        "renewal-four-rooms",
        t("TRƯNG BÀY NĂM 2014", "2014 DISPLAYS"),
        t("Bốn phòng, nhiều lớp văn hóa", "Four rooms of cultural stories"),
        t(
          "Hiện vật và mô hình tái hiện tín ngưỡng, lao động, phong tục và nghệ thuật.",
          "Objects and models present belief, work, customs and the arts.",
        ),
        "duke",
        [
          t(
            "Bản tin năm 2014 mô tả bảo tàng có bốn phòng trưng bày, giới thiệu hơn 800 hiện vật và tư liệu. Các chủ đề trải rộng từ đời sống vật chất đến sinh hoạt tinh thần.",
            "The 2014 report describes four exhibition rooms introducing more than 800 objects and documents. Themes range from material life to spiritual traditions.",
          ),
          t(
            "Mô hình nghi lễ, sân khấu và nghề truyền thống bổ sung bối cảnh cho hiện vật. Khách có thể tìm hiểu phong tục cưới hỏi, nghệ thuật Rô-băm, Dù-kê và những kỹ năng thủ công.",
            "Models of ceremonies, theatre and crafts provide context for the objects. Visitors can learn about wedding customs, Robam, Du-ke and traditional skills.",
          ),
          t(
            "Ảnh mô hình sân khấu Dù-kê sử dụng ở đây là tư liệu năm 2023. Số phòng và số hiện vật trong đoạn giới thiệu thuộc ghi nhận năm 2014, không dùng làm kiểm kê hiện tại.",
            "The Du-ke model photograph shown here dates from 2023. The room and object counts belong to the 2014 account and are not a current inventory.",
          ),
        ],
        ["reopening", "archive", "objects"],
      ),
      story(
        "renewal-collecting",
        t("2014", "2014"),
        t("Sưu tầm thêm 326 hiện vật", "Collecting 326 more objects"),
        t(
          "Dự án của Bảo tàng Tổng hợp Trà Vinh bổ sung tư liệu đời sống Khmer.",
          "A Tra Vinh General Museum project adds records of Khmer life.",
        ),
        "farm",
        [
          t(
            "Bảo tàng Lịch sử Quốc gia đưa tin năm 2014 về dự án sưu tầm 326 hiện vật đời sống Khmer của Bảo tàng Tổng hợp Trà Vinh, thực hiện trong khoảng hai năm.",
            "The National Museum of History reported in 2014 on Tra Vinh General Museum's approximately two-year project to collect 326 objects from Khmer life.",
          ),
          t(
            "Trong số này có 238 nông ngư cụ và 88 hiện vật thuộc nghệ thuật, điêu khắc. Nhóm hiện vật làm rõ kỹ năng sản xuất và sự phong phú của văn hóa vật chất Khmer.",
            "The group comprised 238 agricultural and fishing implements and 88 art and sculpture objects. They document working skills and the richness of Khmer material culture.",
          ),
          t(
            "Đây là số lượng của một dự án sưu tầm cấp bảo tàng tỉnh. Việc thu thập, lập hồ sơ, bảo quản và lựa chọn trưng bày là các bước khác nhau; tổng sưu tầm không đồng nghĩa toàn bộ đều được bày cùng lúc.",
            "This is the count for a provincial museum collecting project. Acquisition, documentation, conservation and display selection are distinct steps; the collecting total does not mean every object was displayed simultaneously.",
          ),
        ],
        ["acquisition"],
      ),
    ],
  },
  {
    id: "connection",
    title: t("KẾT NỐI", "CONNECTION"),
    range: "2016 – 2022",
    subtitle: t("Mở rộng và đón khách", "Extending stories and visits"),
    kicker: t(
      "BẢO TÀNG TRONG HÀNH TRÌNH DI SẢN",
      "THE MUSEUM IN A HERITAGE JOURNEY",
    ),
    description: t(
      "Bổ sung nội dung lịch sử từ năm 2016, kết nối tour văn hóa năm 2018 và phục hồi đón khách năm 2022. Bảo tàng trở thành một điểm dừng trong hành trình tìm hiểu di sản Khmer.",
      "History displays expanded from 2016, a cultural tour linked the site in 2018 and visits recovered in 2022. The museum became a stop on a broader Khmer heritage journey.",
    ),
    preview: t(
      "Từ trưng bày lịch sử đến tour văn hóa và mùa lễ hội Ok Om Bok.",
      "History displays, cultural tours and the Ok Om Bok festival.",
    ),
    photo: "pond",
    photoDate: t(
      "AO BÀ OM · ẢNH CẢNH QUAN 2025",
      "AO BA OM · LANDSCAPE PHOTO 2025",
    ),
    facts: [
      fact(t("Thêm lịch sử", "History added"), t("2016", "2016")),
      fact(t("Tour văn hóa", "Cultural tour"), t("2018", "2018")),
      fact(t("Trưng bày 2022", "2022 displays"), t("5 phòng", "5 rooms")),
      fact(
        t("Tuần lễ 2022", "Festival week 2022"),
        t("Gần 9.000 lượt", "Nearly 9,000 visits"),
      ),
    ],
    topics: [
      story(
        "connection-history",
        t("2016", "2016"),
        t("Bổ sung câu chuyện lịch sử", "Adding historical narratives"),
        t(
          "Trưng bày thêm lịch sử cận, hiện đại của đồng bào Khmer.",
          "Adding modern Khmer history to the displays.",
        ),
        "khmerStele",
        [
          t(
            "Theo Hiệp hội Du lịch ĐBSCL, năm 2016 bảo tàng được bổ sung trưng bày về lịch sử cận, hiện đại. Nội dung giúp đặt văn hóa Khmer trong dòng lịch sử địa phương.",
            "The Mekong Delta Tourism Association records the addition of modern history displays in 2016. This places Khmer culture within the province's historical development.",
          ),
          t(
            "Tư liệu lịch sử bổ sung câu chuyện về con người bên cạnh hiện vật tín ngưỡng, đời sống và nghệ thuật. Vai trò của cộng đồng được nhìn qua cả thực hành văn hóa và những đóng góp trong các giai đoạn lịch sử.",
            "Historical records add human stories alongside belief, daily life and the arts. Community life is understood through cultural practice and contributions across historical periods.",
          ),
          t(
            "Ảnh bia tháp Maha Sơn Thông được công bố năm 2025, minh họa không gian lưu giữ ký ức trong khuôn viên. Bài viết về việc bổ sung trưng bày năm 2016 được dẫn riêng bên dưới.",
            "The memorial inscription photograph was published in 2025 and illustrates a place of memory on the grounds. The source for the 2016 exhibition addition is linked separately below.",
          ),
        ],
        ["mdta", "memorial"],
      ),
      story(
        "connection-tour",
        t("THÁNG 11/2018", "NOVEMBER 2018"),
        t(
          "Tour Làng Văn hóa Du lịch Khmer",
          "Khmer Cultural Tourism Village tour",
        ),
        t(
          "Kết nối bảo tàng, Chùa Âng, Ao Bà Om với trải nghiệm văn hóa cộng đồng.",
          "Linking the museum, Ang Pagoda and Ao Ba Om with community culture.",
        ),
        "pagoda",
        [
          t(
            "Trong tuần lễ văn hóa, du lịch và lễ hội Ok Om Bok năm 2018, Trà Vinh khai trương tour Làng Văn hóa Du lịch Khmer. Bảo tàng là một điểm trong hành trình được Bộ VHTTDL giới thiệu.",
            "During the 2018 cultural, tourism and Ok Om Bok week, Tra Vinh launched the Khmer Cultural Tourism Village tour. The Ministry of Culture lists the museum as a stop.",
          ),
          t(
            "Hành trình kết nối Chùa Âng, Ao Bà Om và bảo tàng với ẩm thực, nghề truyền thống và sinh hoạt văn hóa. Kiến thức từ hiện vật được đặt cạnh trải nghiệm cảnh quan và đời sống.",
            "The journey links Ang Pagoda, Ao Ba Om and the museum with food, traditional crafts and cultural activities. Learning from objects is complemented by landscape and community experiences.",
          ),
          t(
            "Mốc 2018 ghi lại một bước kết nối điểm đến. Chương trình và khả năng tổ chức tour ở từng thời điểm cần được tìm hiểu qua đơn vị phục vụ khách.",
            "The 2018 milestone records the linking of these destinations. Current itineraries and tour availability depend on the visitor service provider.",
          ),
        ],
        ["tour"],
      ),
      story(
        "connection-recovery",
        t("TỪ THÁNG 4/2022", "FROM APRIL 2022"),
        t("Phục hồi hoạt động đón khách", "Visitor activity recovers"),
        t(
          "Các đoàn tham quan trở lại sau thời gian ảnh hưởng của dịch bệnh.",
          "Visitor groups return after the disruption of the pandemic.",
        ),
        "exhibition",
        [
          t(
            "Bài viết TTXVN tháng 11/2022 ghi nhận hoạt động đón khách phục hồi từ tháng 4/2022 sau thời gian chịu tác động của dịch COVID-19.",
            "VNA's November 2022 report records visitor activity recovering from April 2022 after disruption caused by COVID-19.",
          ),
          t(
            "Các đoàn học sinh, sinh viên, khách trong và ngoài nước đến tìm hiểu hiện vật và văn hóa Khmer. Mùa lễ hội địa phương tạo thêm dịp để công chúng tiếp cận bảo tàng.",
            "School pupils, students and visitors from Vietnam and abroad came to learn about Khmer culture and the objects. Local festivals offered further opportunities to visit.",
          ),
          t(
            "Các số liệu lượt khách được ghi theo giai đoạn báo cáo cụ thể. Chúng giúp nhìn lại quá trình phục hồi và mức quan tâm của công chúng trong năm 2022.",
            "Visitor figures are tied to specific reporting periods. They help describe recovery and public interest during 2022.",
          ),
        ],
        ["visitors"],
      ),
      story(
        "connection-five-rooms",
        t("TƯ LIỆU 2022", "2022 RECORD"),
        t("Năm phòng trong tư liệu 2022", "Five rooms in the 2022 record"),
        t(
          "Khoảng 300 hiện vật gốc và trên 100 hiện vật phục chế được giới thiệu.",
          "Around 300 original objects and over 100 reproductions were presented.",
        ),
        "chair",
        [
          t(
            "Bài TTXVN ngày 10/11/2022 mô tả bảo tàng có năm phòng trưng bày, với khoảng 300 hiện vật gốc và hơn 100 hiện vật phục chế.",
            "VNA's 10 November 2022 report describes five exhibition rooms, with around 300 original objects and more than 100 reproductions.",
          ),
          t(
            "Các hiện vật phản ánh đời sống vật chất và tinh thần, từ dụng cụ lao động đến tín ngưỡng và nghệ thuật. Mô hình bổ sung bối cảnh cho phong tục và sinh hoạt.",
            "The objects reflect material and spiritual life, from working tools to belief and the arts. Models provide context for customs and daily practices.",
          ),
          t(
            "Đây là số liệu về nội dung trưng bày tại thời điểm bài viết. Khi so với số lượng hiện vật, tư liệu sưu tầm, cần phân biệt phần đang giới thiệu với toàn bộ nguồn tư liệu của bảo tàng.",
            "These figures describe displays at the time of the report. Comparisons with collecting totals must distinguish the exhibited selection from the museum's broader holdings and documentation.",
          ),
        ],
        ["visitors"],
      ),
      story(
        "connection-festival",
        t("02 – 08/11/2022", "2 – 8 NOVEMBER 2022"),
        t(
          "Gần 9.000 lượt khách mùa lễ hội",
          "Nearly 9,000 festival-week visits",
        ),
        t(
          "Một tuần đón khách trong dịp lễ hội Ok Om Bok năm 2022.",
          "A week of museum visits during the 2022 Ok Om Bok festival.",
        ),
        "pond",
        [
          t(
            "Trong khoảng 2–8/11/2022, bảo tàng đón gần 9.000 lượt khách, trong đó có khoảng 500 lượt khách quốc tế, theo bản tin TTXVN.",
            "Between 2 and 8 November 2022, the museum recorded nearly 9,000 visits, including around 500 international visits, according to VNA.",
          ),
          t(
            "Lễ hội Ok Om Bok gắn hoạt động tham quan với không gian Ao Bà Om và văn hóa Khmer. Bảo tàng cung cấp bối cảnh để khách hiểu sâu hơn những phong tục và hình thức nghệ thuật gặp trong dịp lễ.",
            "Ok Om Bok connects museum visits with Ao Ba Om and Khmer culture. The museum provides context for customs and artistic practices encountered during the festival.",
          ),
          t(
            "Số lượt này thuộc riêng tuần lễ năm 2022. Ảnh Ao Bà Om đi kèm là tư liệu cảnh quan năm 2025, giúp hình dung không gian liên kết của điểm đến.",
            "The count refers specifically to the 2022 festival week. The accompanying Ao Ba Om photograph is a 2025 landscape record illustrating the destination's setting.",
          ),
        ],
        ["visitors"],
      ),
      story(
        "connection-learning",
        t("2016 – 2022", "2016 – 2022"),
        t("Một hành trình học hỏi", "A journey of learning"),
        t(
          "Đọc hiện vật trong mối liên hệ với ngôi chùa, cảnh quan và con người.",
          "Reading objects through temples, landscape and people.",
        ),
        "village",
        [
          t(
            "Việc mở rộng trưng bày lịch sử và kết nối tour văn hóa làm phong phú cách tiếp cận bảo tàng. Hiện vật được xem cùng bối cảnh xã hội, nghề nghiệp và sinh hoạt cộng đồng.",
            "Expanded history displays and the cultural tour enriched ways of approaching the museum. Objects could be read through social context, work and community practice.",
          ),
          t(
            "Mô hình đời sống và nghề truyền thống giúp giải thích cách một vật dụng được làm ra, sử dụng và lưu truyền. Khi tiếp tục tham quan Chùa Âng hay Ao Bà Om, khách có thêm liên hệ với văn hóa tại chỗ.",
            "Models of daily life and crafts explain how objects were made, used and passed on. Visits to Ang Pagoda or Ao Ba Om add connections with culture in its local setting.",
          ),
          t(
            "Bài viết năm 2022 ghi nhận nhiều nhóm khách đến bảo tàng. Hoạt động tham quan trở thành một cách đưa di sản đến gần người học và công chúng.",
            "The 2022 report records a range of visitor groups. Museum visits provide a way to bring heritage closer to learners and the wider public.",
          ),
        ],
        ["mdta", "tour", "visitors"],
      ),
    ],
  },
  {
    id: "continuity",
    title: t("PHÁT HUY", "CONTINUITY"),
    range: "2024 – 2026",
    subtitle: t("Di sản trong đời sống hôm nay", "Heritage in life today"),
    kicker: t("GÌN GIỮ ĐỂ TIẾP TỤC LAN TỎA", "PRESERVING AND SHARING HERITAGE"),
    description: t(
      "Được công nhận điểm du lịch tiêu biểu ĐBSCL năm 2024, bảo tàng tiếp tục triển lãm, tiếp nhận đóng góp và phục vụ học tập. Từ năm 2025, địa chỉ hành chính thuộc phường Nguyệt Hóa, tỉnh Vĩnh Long.",
      "Recognised as a notable Mekong Delta destination in 2024, the museum continues exhibitions and learning. From 2025, its administrative address is Nguyet Hoa ward, Vinh Long province.",
    ),
    preview: t(
      "Ghi nhận du lịch, triển lãm di sản và tiếp nối vai trò giáo dục cộng đồng.",
      "Tourism recognition, heritage exhibitions and public learning.",
    ),
    photo: "opening2024",
    photoDate: t(
      "KHAI MẠC TRIỂN LÃM · 11/11/2024",
      "EXHIBITION OPENING · 11/11/2024",
    ),
    facts: [
      fact(t("Điểm tiêu biểu", "Recognition"), t("27/03/2024", "27/03/2024")),
      fact(
        t("Triển lãm di sản", "Heritage exhibition"),
        t("11/11/2024", "11/11/2024"),
      ),
      fact(
        t("Địa giới mới", "New administration"),
        t("01/07/2025", "01/07/2025"),
      ),
      fact(
        t("Vai trò tiếp nối", "Continuing role"),
        t("Học tập · 2026", "Learning · 2026"),
      ),
    ],
    topics: [
      story(
        "continuity-recognition",
        t("27/03/2024", "27 MARCH 2024"),
        t(
          "Điểm du lịch tiêu biểu ĐBSCL",
          "A recognised Mekong Delta destination",
        ),
        t(
          "Ghi nhận giá trị điểm đến và trải nghiệm tìm hiểu văn hóa Khmer.",
          "Recognition of the destination's Khmer cultural experience.",
        ),
        "facade",
        [
          t(
            "Bảo Tàng Văn Hóa Dân Tộc Khmer được Hiệp hội Du lịch ĐBSCL công nhận điểm du lịch tiêu biểu năm 2024. Báo Trà Vinh ghi nhận quyết định số 08/QĐ-HHDL ngày 27/03/2024.",
            "The Khmer Ethnic Cultural Museum in Tra Vinh was recognised by the Mekong Delta Tourism Association in 2024. Tra Vinh newspaper records Decision 08/QD-HHDL dated 27 March 2024.",
          ),
          t(
            "Sự ghi nhận đặt bảo tàng trong mạng lưới điểm đến của vùng, bên cạnh giá trị bảo tồn và nghiên cứu. Du khách có thể kết nối trải nghiệm tại đây với Chùa Âng và Ao Bà Om.",
            "The recognition places the museum within the region's destination network, alongside its conservation and research value. Visitors can connect the museum with Ang Pagoda and Ao Ba Om.",
          ),
          t(
            "Cột mốc này thuộc hoạt động phát huy giá trị di sản qua du lịch. Nó tiếp nối các bước phát triển trưng bày và kết nối văn hóa ở những giai đoạn trước.",
            "This milestone concerns sharing heritage through tourism. It follows earlier developments in the galleries and cultural connections.",
          ),
        ],
        ["award", "mdta"],
      ),
      story(
        "continuity-exhibition",
        t("11/11/2024", "11 NOVEMBER 2024"),
        t("Di sản Khmer khoe sắc", "Khmer heritage on display"),
        t(
          "Khai mạc triển lãm gắn với Ngày Di sản Văn hóa Việt Nam và Ok Om Bok.",
          "An exhibition marking Vietnam Cultural Heritage Day and Ok Om Bok.",
        ),
        "opening2024",
        [
          t(
            "Sáng 11/11/2024, Sở VHTTDL Trà Vinh khai mạc trưng bày triển lãm tại bảo tàng. Hoạt động gắn với Ngày Di sản Văn hóa Việt Nam 23/11 và tuần lễ văn hóa, du lịch, lễ hội Ok Om Bok năm 2024.",
            "On 11 November 2024, Tra Vinh's cultural department opened an exhibition at the museum. It marked Vietnam Cultural Heritage Day on 23 November and the 2024 cultural, tourism and Ok Om Bok week.",
          ),
          t(
            "Triển lãm giới thiệu những giá trị văn hóa, phong tục và sinh hoạt truyền thống, tạo dịp để công chúng và thế hệ trẻ tìm hiểu di sản địa phương.",
            "The exhibition introduced cultural values, customs and traditional practices, giving the public and younger generations an opportunity to learn about local heritage.",
          ),
          t(
            "Ảnh khai mạc và tham quan do Trúc Phương chụp, được Báo Văn Hóa công bố cùng ngày. Tư liệu ghi lại một sự kiện cụ thể trong hoạt động phát huy di sản của bảo tàng.",
            "Opening and visitor photographs by Truc Phuong were published by Van Hoa newspaper that day. They document a specific event in the museum's public heritage activities.",
          ),
        ],
        ["event"],
      ),
      story(
        "continuity-donations",
        t("11/11/2024", "11 NOVEMBER 2024"),
        t("Cộng đồng cùng gìn giữ", "Community contributions"),
        t(
          "Hiến tặng hiện vật làm phong phú nguồn tư liệu của bảo tàng tỉnh.",
          "Donations enrich the provincial museum's collections.",
        ),
        "donors2024",
        [
          t(
            "Tại sự kiện ngày 11/11/2024, Bảo tàng Tổng hợp Trà Vinh tiếp nhận hiện vật do các nhà sưu tập trong và ngoài tỉnh hiến tặng. Những đóng góp được ngành văn hóa ghi nhận.",
            "At the event on 11 November 2024, Tra Vinh General Museum received objects donated by collectors from within and outside the province. The cultural department recognised these contributions.",
          ),
          t(
            "Hiến tặng kết nối công tác bảo tàng với cộng đồng và người lưu giữ hiện vật. Mỗi món đồ có thêm cơ hội được lập hồ sơ, bảo quản và nghiên cứu trong một thiết chế công cộng.",
            "Donations connect museum work with communities and object custodians. Each object gains an opportunity for documentation, conservation and research in a public institution.",
          ),
          t(
            "Bài báo nói về tiếp nhận của Bảo tàng Tổng hợp Trà Vinh; vị trí trưng bày từng hiện vật phụ thuộc quá trình chuyên môn sau đó. Ảnh ghi nhận hai tập thể được khen thưởng tại sự kiện.",
            "The report concerns acquisitions by Tra Vinh General Museum; the eventual display of individual objects depends on subsequent museum work. The photograph shows two groups receiving commendations.",
          ),
        ],
        ["event"],
      ),
      story(
        "continuity-address",
        t("TỪ 01/07/2025", "FROM 1 JULY 2025"),
        t("Địa chỉ hành chính mới", "A new administrative address"),
        t(
          "Phường Nguyệt Hóa, tỉnh Vĩnh Long; công trình vẫn tại cụm Ao Bà Om.",
          "Nguyet Hoa ward, Vinh Long province, within the Ao Ba Om cluster.",
        ),
        "roof",
        [
          t(
            "Sau sắp xếp đơn vị hành chính năm 2025, khu vực bảo tàng thuộc phường Nguyệt Hóa, tỉnh Vĩnh Long. Nghị quyết 1687/NQ-UBTVQH15 thành lập phường Nguyệt Hóa từ Phường 7, Phường 8 và xã Nguyệt Hóa trước đây.",
            "Following the 2025 administrative reorganisation, the museum area belongs to Nguyet Hoa ward in Vinh Long province. Resolution 1687/NQ-UBTVQH15 formed the ward from former Wards 7 and 8 and Nguyet Hoa commune.",
          ),
          t(
            "Trong tư liệu trước năm 2025, địa chỉ thường được ghi là Phường 8, thành phố Trà Vinh, tỉnh Trà Vinh. Hai cách ghi cần được đọc theo thời điểm của tài liệu.",
            "Sources before 2025 commonly give the address as Ward 8, Tra Vinh city, Tra Vinh province. The two address forms should be read according to the document's date.",
          ),
          t(
            "Vị trí tham quan vẫn gắn với Bảo Tàng Văn Hóa Dân Tộc Khmer, Chùa Âng và Ao Bà Om. Tên địa phương trong lịch sử tiếp tục giúp nhận diện nguồn gốc của điểm đến.",
            "The visit remains associated with the Khmer Ethnic Cultural Museum in Tra Vinh, Ang Pagoda and Ao Ba Om. Historical place names continue to identify the destination's origins.",
          ),
        ],
        ["locality"],
      ),
      story(
        "continuity-education",
        t("2026 · VAI TRÒ TIẾP NỐI", "2026 · A CONTINUING ROLE"),
        t("Không gian học tập về di sản", "A place for heritage learning"),
        t(
          "Tiếp tục lưu giữ, nghiên cứu và giới thiệu văn hóa đến người học.",
          "Continuing preservation, research and cultural learning.",
        ),
        "exhibition2024",
        [
          t(
            "Bảo tàng tiếp tục là nơi tìm hiểu văn hóa Khmer qua hiện vật, tư liệu và không gian trưng bày. Bài viết của Trường Chính trị Phạm Hùng năm 2026 ghi nhận hoạt động tham quan, nghiên cứu thực tế tại đây.",
            "The museum continues to introduce Khmer culture through objects, documents and displays. A 2026 report by Pham Hung Political School records a study visit to the museum.",
          ),
          t(
            "Giá trị giáo dục bắt đầu từ việc quan sát và đặt câu hỏi: vật dụng được làm ra như thế nào, gắn với phong tục nào và được lưu truyền ra sao. Những liên hệ ấy giúp di sản trở thành kiến thức gần gũi.",
            "Learning begins with observation and questions: how an object was made, which customs it relates to and how knowledge was passed on. These connections make heritage approachable.",
          ),
          t(
            "Ảnh tham quan triển lãm đi kèm ghi lại sự kiện năm 2024. Đặt cạnh hoạt động học tập được ghi nhận năm 2026, tư liệu cho thấy vai trò kết nối di sản với công chúng qua nhiều thời điểm.",
            "The accompanying exhibition photograph documents the 2024 event. Alongside the 2026 study visit report, it illustrates the museum's connection between heritage and the public across different dates.",
          ),
        ],
        ["education", "event"],
      ),
    ],
  },
];

export const khmerHistoryIntro = {
  eyebrow: t("LỊCH SỬ BẢO TÀNG", "MUSEUM HISTORY"),
  headline: t("HÌNH THÀNH", "FORMATION"),
  headlineSecond: t("& PHÁT TRIỂN", "& DEVELOPMENT"),
  description: t(
    "Từ năm 1992, bảo tàng gìn giữ, đổi mới và lan tỏa di sản văn hóa Khmer.",
    "A journey of preserving and sharing Khmer cultural heritage since 1992.",
  ),
};
