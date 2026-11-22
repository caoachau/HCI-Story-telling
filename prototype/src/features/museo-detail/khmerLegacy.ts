import {
  khmerCultureSources,
  type CultureLanguage,
  type CulturePhotoId,
} from "./khmerCulture";
import { khmerHistorySources } from "./khmerHistory";
import type { MuseumSection } from "./useMuseumScreens";

type Copy = Record<CultureLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });

export const khmerLegacyGroups = [
  { id: "all", title: t("Tất cả", "All") },
  { id: "history", title: t("Lịch sử", "History") },
  { id: "architecture", title: t("Kiến trúc", "Architecture") },
  { id: "culture", title: t("Văn hóa", "Culture") },
  { id: "continuity", title: t("Tiếp nối", "Continuity") },
] as const;
export type LegacyFilter = (typeof khmerLegacyGroups)[number]["id"];

export const khmerLegacySources = {
  museum: khmerHistorySources.archive,
  objects: khmerHistorySources.objects,
  memorial: khmerHistorySources.memorial,
  reopening: khmerHistorySources.reopening,
  event: khmerHistorySources.event,
  mdta: khmerHistorySources.mdta,
  education: khmerHistorySources.education,
  tour: khmerHistorySources.tour,
  satra: khmerCultureSources.satra,
  customs: khmerCultureSources.customs,
  masks: khmerCultureSources.masks,
  teaching: khmerCultureSources.teaching,
  chapey: khmerCultureSources.chapey,
  duke: khmerCultureSources.duke,
  boat: khmerCultureSources.boat,
  archaeology: {
    title: t(
      "Cục Di sản văn hóa · Bảo vật quốc gia đợt 5, 2016",
      "Department of Cultural Heritage · National Treasures, 2016",
    ),
    url: "https://dsvh.gov.vn/thu-tuong-chinh-phu-quyet-dinh-cong-nhan-bao-vat-quoc-gia-dot-5-nam-2016-1279",
  },
};
type SourceId = keyof typeof khmerLegacySources;
export interface LegacyChapter {
  id: string;
  title: Copy;
  paragraphs: Copy[];
}
export interface KhmerLegacyValue {
  id: string;
  group: Exclude<LegacyFilter, "all">;
  title: Copy;
  summary: Copy;
  lead: Copy;
  gallery: CulturePhotoId[];
  chapters: LegacyChapter[];
  takeaway: Copy;
  sources: SourceId[];
  related: { title: Copy; section: MuseumSection; item: string };
}
const chapter = (
  id: string,
  vi: string,
  en: string,
  paragraphs: Copy[],
): LegacyChapter => ({ id, title: t(vi, en), paragraphs });

export const khmerLegacyValues: KhmerLegacyValue[] = [
  {
    id: "memory",
    group: "history",
    title: t("Ký ức cộng đồng", "Community memory"),
    summary: t(
      "Đời sống Khmer từ những vật dụng nhỏ.",
      "Khmer life through everyday objects.",
    ),
    lead: t(
      "Bảo tàng giữ lại ký ức bằng những điều rất gần gũi: một nông cụ, chiếc giỏ, trang chữ, nhạc cụ hay câu chuyện về con người. Đặt cạnh nhau, chúng giúp người xem hiểu cộng đồng Khmer đã sống, lao động và gìn giữ bản sắc ra sao.",
      "The museum preserves memory through familiar things: a farming tool, a basket, a written page, an instrument and a person's story. Seen together, they reveal how Khmer communities have worked, lived and sustained their identity.",
    ),
    gallery: ["farm", "tools2008", "memorial"],
    chapters: [
      chapter(
        "ordinary-lives",
        "Lịch sử từ cuộc sống thường ngày",
        "History through everyday life",
        [
          t(
            "Nông ngư cụ, đồ dùng gia đình và sản phẩm thủ công đưa người lao động vào câu chuyện lịch sử. Cách đan một chiếc giỏ hay tạo ra dụng cụ đánh bắt chứa hiểu biết về vật liệu, mùa nước, môi trường và nhu cầu của từng gia đình.",
            "Farming and fishing implements, household objects and craftwork bring working people into history. Making a basket or a fishing tool involves knowledge of materials, water seasons, the environment and family needs.",
          ),
          t(
            "Giá trị của hiện vật nằm cả ở dấu vết sử dụng: ai đã làm, ai đã dùng và nó đi cùng sinh hoạt nào. Những câu hỏi ấy biến một vật quen thuộc thành tư liệu về cách sống của cả cộng đồng.",
            "An object's value also lies in its use: who made it, who used it and which routines it belonged to. These questions turn an ordinary item into evidence of a community's way of life.",
          ),
        ],
      ),
      chapter(
        "collective-record",
        "Từ ký ức riêng đến bộ sưu tập chung",
        "From personal memory to a shared collection",
        [
          t(
            "Khi hiện vật từ gia đình, phum sóc và chùa được sưu tầm, ghi nhận xuất xứ, bảo quản và trưng bày, những ký ức riêng có cơ hội gặp nhau. Bảo tàng trở thành nơi công chúng có thể quan sát, học hỏi và nghiên cứu các lớp văn hóa ấy.",
            "Collecting, documenting, conserving and exhibiting objects from families, villages and pagodas allows separate memories to meet. The museum makes these cultural layers available for observation, learning and research.",
          ),
          t(
            "Các bài giới thiệu ghi nhận quy mô bộ sưu tập ở những thời điểm khác nhau: VietNamNet năm 2023 nêu hơn 800 hiện vật; bài trên Cổng thông tin Bộ VHTTDL ngày 06/11/2024 nêu hơn 1.000 hiện vật đã được sưu tầm, hệ thống hóa và trưng bày. Đây là số liệu theo từng nguồn và thời điểm công bố.",
            "Reports describe the collection at different times: VietNamNet recorded more than 800 objects in 2023, while the Ministry of Culture's 6 November 2024 article reported over 1,000 collected, organised and exhibited objects. These figures belong to their respective sources and publication dates.",
          ),
        ],
      ),
      chapter(
        "historical-layers",
        "Những lớp lịch sử cần đọc đúng bối cảnh",
        "Reading historical layers in context",
        [
          t(
            "Công trình bảo tàng hình thành vào thập niên 1990, trong khi những câu chuyện mà nó giới thiệu có chiều sâu lâu dài hơn. Đời sống Khmer, Phật giáo Nam tông, dấu tích Bà-la-môn giáo và văn hóa Óc Eo cần được đọc theo niên đại, địa điểm và bối cảnh riêng.",
            "The museum building dates to the 1990s, while the histories it introduces reach further back. Khmer life, Theravada Buddhism, Brahmanical traces and Oc Eo culture should be understood through their own dates, places and contexts.",
          ),
          t(
            "Trong di sản khảo cổ của tỉnh, bộ Linga–Yoni niên đại thế kỷ V–VI được công nhận bảo vật quốc gia năm 2016. Hồ sơ của Cục Di sản văn hóa ghi nơi lưu giữ là Bảo tàng Tổng hợp Trà Vinh. Hiện vật này giúp mở rộng bối cảnh lịch sử vùng đất; nơi lưu giữ cần được phân biệt với Bảo Tàng Văn Hóa Dân Tộc Khmer.",
            "In the province's archaeological heritage, a fifth- to sixth-century Linga–Yoni was recognised as a National Treasure in 2016. The Department of Cultural Heritage identifies its custodian as Tra Vinh General Museum. It broadens the regional historical context, with custody distinct from the Khmer Ethnic Cultural Museum.",
          ),
        ],
      ),
      chapter(
        "people-memory",
        "Ký ức gắn với con người",
        "Memory connected to people",
        [
          t(
            "Tháp tưởng niệm Maha Sơn Thông trong khuôn viên, khánh thành năm 2012, bổ sung một điểm nhìn về đóng góp của người Khmer trong lịch sử cách mạng. Bia, ảnh và không gian tưởng niệm nối câu chuyện của một nhân vật với ký ức chung của cộng đồng.",
            "The Maha Son Thong memorial in the grounds, inaugurated in 2012, offers another perspective on Khmer contributions to revolutionary history. Inscriptions, photographs and remembrance connect an individual's story with collective memory.",
          ),
          t(
            "Cùng với nhân vật lịch sử, người hiến tặng hiện vật, nghệ nhân, người gìn giữ chữ viết và các gia đình cũng góp phần tạo nên ký ức bảo tàng. Lịch sử được làm đầy bằng nhiều tiếng nói và nhiều trải nghiệm sống.",
            "Historical figures are joined by donors, artisans, keepers of writing and families who contribute to the museum's memory. Many voices and lived experiences make this history richer.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Một hiện vật nhỏ có thể lưu giữ một đời người, một nghề và ký ức của cả phum sóc.",
      "A small object can hold a lifetime, a craft and the memory of an entire village.",
    ),
    sources: ["objects", "customs", "archaeology", "memorial"],
    related: {
      title: t(
        "Xem các cột mốc hình thành bảo tàng",
        "Explore the museum's historical milestones",
      ),
      section: "timeline",
      item: "formation",
    },
  },
  {
    id: "architecture",
    group: "architecture",
    title: t("Kiến trúc Khmer", "Khmer architecture"),
    summary: t(
      "Dáng mái, mỹ thuật và cảnh quan Khmer.",
      "Khmer roof forms, art and landscape.",
    ),
    lead: t(
      "Ngay trước khi bước vào phòng trưng bày, người xem đã gặp một lời giới thiệu về văn hóa Khmer qua hình khối, mái và trang trí của công trình. Kiến trúc gắn với cảnh quan xanh, tạo một không gian chuyển tiếp giữa bảo tàng và quần thể Ao Bà Om, chùa Âng.",
      "Before entering the galleries, visitors encounter Khmer culture through the building's form, roof and ornament. Its architecture meets the green landscape, creating a transition between the museum and the Ao Ba Om–Ang Pagoda complex.",
    ),
    gallery: ["roof", "facade", "exhibition"],
    chapters: [
      chapter(
        "modern-khmer",
        "Một công trình mới mang ngôn ngữ Khmer",
        "A modern building with a Khmer vocabulary",
        [
          t(
            "Bảo tàng gồm hai tầng, diện tích sử dụng hơn 1.700 m². Những đường mái vươn cao, bố cục cân xứng và chi tiết trang trí gợi liên hệ với mỹ thuật Khmer, đồng thời phục vụ chức năng tiếp đón, lưu giữ và trưng bày của một bảo tàng.",
            "The museum has two floors and more than 1,700 m² of usable space. Rising roof lines, symmetry and decorative details evoke Khmer aesthetics while supporting the reception, conservation and exhibition functions of a museum.",
          ),
          t(
            "Có thể quan sát công trình như một cách chuyển ngôn ngữ truyền thống sang nhu cầu hiện đại: hình thức quen thuộc giúp người xem nhận ra bản sắc, còn tổ chức không gian tạo điều kiện tìm hiểu hiện vật và câu chuyện văn hóa.",
            "The building translates a traditional vocabulary into modern needs: familiar forms express identity, while its spatial organisation supports encounters with objects and cultural stories.",
          ),
        ],
      ),
      chapter(
        "ornament",
        "Mái và trang trí như một lớp nghệ thuật",
        "Roof and ornament as an artistic layer",
        [
          t(
            "Khi quan sát mặt đứng và phần mái, hãy chú ý nhịp điệu lặp lại, đường nét hướng lên và cách trang trí tập trung tại các vị trí chuyển tiếp. Những yếu tố ấy tạo nên dáng vẻ công trình và mối liên hệ với truyền thống trang trí kiến trúc Khmer.",
            "Look at the facade and roof for repeated rhythms, upward lines and decoration at transitions. Together they give the building its character and connect it to Khmer architectural ornament.",
          ),
          t(
            "Trong trưng bày mỹ thuật Khmer, Kâyno và Tết Pronam được giới thiệu cùng tượng, chạm khắc và trang trí. Đọc những nhóm hiện vật này giúp người xem hiểu hơn mối quan hệ giữa hình tượng, kỹ thuật chế tác và ý nghĩa văn hóa.",
            "Khmer art displays introduce Kayno and Tet Pronam alongside sculpture, carving and ornament. These groups help visitors understand the relationships between imagery, craft techniques and cultural meaning.",
          ),
        ],
      ),
      chapter(
        "threshold",
        "Từ sân vườn đến phòng trưng bày",
        "From the garden to the galleries",
        [
          t(
            "Sân, cây xanh, lối tiếp cận và cầu thang tạo nhịp chuyển từ cảnh quan ngoài trời đến không gian đọc hiện vật. Bài giới thiệu năm 2014 của Bảo tàng Lịch sử Quốc gia ghi nhận hồ bán nguyệt dưới chân cầu thang trung tâm, một chi tiết góp phần làm mềm bố cục công trình.",
            "The forecourt, trees, approach and stairs create a gradual transition from outdoor landscape to the galleries. The National Museum of History's 2014 account describes a semicircular pond below the central stairs, softening the building's composition.",
          ),
          t(
            "Giá trị kiến trúc vì vậy có thể được cảm nhận qua cả trải nghiệm di chuyển: nhìn công trình từ xa, đến gần mái và chi tiết, rồi bước vào không gian trưng bày. Mỗi điểm nhìn bổ sung một lớp hiểu biết.",
            "Architectural value can also be felt through movement: seeing the building from a distance, approaching its roof and details, then entering the galleries. Each viewpoint adds a layer of understanding.",
          ),
        ],
      ),
      chapter(
        "landscape-setting",
        "Kiến trúc trong một quần thể văn hóa",
        "Architecture within a cultural landscape",
        [
          t(
            "Bảo tàng nằm trong mối liên hệ với Ao Bà Om và chùa Âng. Công trình, mặt nước, cây cổ thụ và không gian tín ngưỡng tạo nên những trải nghiệm bổ trợ: tìm hiểu qua hiện vật, quan sát kiến trúc, cảm nhận cảnh quan và đời sống cộng đồng.",
            "The museum is connected to Ao Ba Om and Ang Pagoda. Building, water, old trees and religious space provide complementary experiences: learning from objects, observing architecture and encountering landscape and community life.",
          ),
          t(
            "Gìn giữ dáng vẻ công trình cần đi cùng sự quan tâm đến sân vườn, tầm nhìn và môi trường chung. Cảnh quan giúp di sản kiến trúc tiếp tục có ý nghĩa trong trải nghiệm của người tham quan.",
            "Caring for the building also means caring for gardens, views and the shared environment. The landscape helps architectural heritage remain meaningful to visitors.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Công trình tự nó cũng là một lời giới thiệu về bản sắc, trước khi câu chuyện bắt đầu trong tủ trưng bày.",
      "The building introduces cultural identity before the stories in its display cases begin.",
    ),
    sources: ["museum", "objects", "tour"],
    related: {
      title: t(
        "Khám phá mặt tiền và không gian bảo tàng",
        "Explore the facade and museum spaces",
      ),
      section: "map",
      item: "architecture",
    },
  },
  {
    id: "identity",
    group: "culture",
    title: t("Tri thức & bản sắc", "Knowledge & identity"),
    summary: t(
      "Chữ viết, tín ngưỡng và nếp sống.",
      "Writing, belief and ways of living.",
    ),
    lead: t(
      "Những trang chữ, chiếc ghế thuyết pháp hay đồ dùng sinh hoạt mở ra câu chuyện về niềm tin, đạo lý và cách sống cùng nhau. Di sản để lại ở đây còn là tri thức: điều con người biết, cách họ ghi chép và cách họ trao lại cho thế hệ sau.",
      "Written pages, a preaching chair and household objects open stories about belief, ethics and living together. This heritage also holds knowledge: what people know, how they record it and how they pass it to later generations.",
    ),
    gallery: ["chair", "buddha", "village"],
    chapters: [
      chapter(
        "satra-knowledge",
        "Satra và hành trình của tri thức",
        "Satra and the journey of knowledge",
        [
          t(
            "Satra trên lá Buông gắn với truyền thống chữ viết Khmer. Chất liệu, cách khắc chữ, nội dung và người đọc đều là những phần của di sản. Văn bản có thể chuyên chở kinh, đạo lý và truyện kể; mỗi bản cần được tìm hiểu theo nội dung riêng.",
            "Palm-leaf Satra belongs to Khmer writing traditions. Material, inscription, content and readers are all part of this heritage. Texts can carry scriptures, ethics and narratives, with each manuscript understood through its particular content.",
          ),
          t(
            "Từ ghi chép đến gìn giữ, đọc và truyền lại là một chuỗi công việc cần kỹ năng. Bảo tồn văn bản vì thế đi cùng việc duy trì khả năng đọc chữ, giải nghĩa và hiểu bối cảnh sử dụng. Ảnh trong bộ tư liệu này giới thiệu bối cảnh tôn giáo và đời sống liên quan.",
            "Writing, preserving, reading and transmitting form a chain of skilled work. Manuscript conservation belongs alongside literacy, interpretation and knowledge of use. The photographs here show related religious and everyday contexts.",
          ),
        ],
      ),
      chapter(
        "belief-and-community",
        "Chùa, đạo lý và đời sống cộng đồng",
        "Pagodas, ethics and community life",
        [
          t(
            "Phật giáo Nam tông có vị trí quan trọng trong đời sống Khmer. Tượng Phật, đồ thờ và ghế thuyết pháp giúp người xem tìm hiểu hoạt động tín ngưỡng, mối quan hệ giữa người giảng và người nghe, cũng như việc trao truyền đạo lý.",
            "Theravada Buddhism has an important place in Khmer life. Buddha images, ritual objects and the preaching chair help visitors understand belief, the relationship between speaker and listeners, and the transmission of ethics.",
          ),
          t(
            "Chùa còn gắn với chữ viết, giáo dục, nghệ thuật và sinh hoạt chung. Khi nối hiện vật trong bảo tàng với không gian chùa Âng, người xem có thể hiểu thêm cách những giá trị tinh thần hiện diện trong đời sống.",
            "Pagodas are also connected to writing, education, art and shared activities. Relating museum objects to Ang Pagoda helps visitors understand how spiritual values remain present in everyday life.",
          ),
        ],
      ),
      chapter(
        "ways-of-living",
        "Tri thức trong lao động và sinh hoạt",
        "Knowledge in work and daily routines",
        [
          t(
            "Công cụ sản xuất, ngư cụ, đồ bếp, trang phục và mô hình phum sóc cho thấy kiến thức được tích lũy từ cuộc sống. Chọn vật liệu, chế tác, tổ chức nhà ở hay ứng xử với mùa nước đều phản ánh kinh nghiệm của cộng đồng.",
            "Production tools, fishing equipment, kitchenware, clothing and village models reveal knowledge accumulated through life. Material choices, making techniques, settlement patterns and responses to water seasons reflect community experience.",
          ),
          t(
            "Một chiếc ghe Ngo cũng gắn với kỹ thuật đóng thuyền, tổ chức đội và sự phối hợp tập thể. Nhìn hiện vật qua mối quan hệ với con người giúp nhận ra phần tri thức và tinh thần cộng đồng ở phía sau hình dáng của nó.",
            "A Ngo boat also involves boatbuilding, team organisation and collective coordination. Seeing an object in relation to people reveals the knowledge and community spirit behind its form.",
          ),
        ],
      ),
      chapter(
        "belonging",
        "Bản sắc, sự tự hào và hiểu biết lẫn nhau",
        "Identity, pride and mutual understanding",
        [
          t(
            "Nhìn thấy tiếng nói, chữ viết, nghề và ký ức của mình được giới thiệu trang trọng có thể khơi dậy sự gắn bó và tự hào. Với người trẻ, bảo tàng là một nơi để hỏi về nguồn cội và nhận ra văn hóa Khmer vẫn tiếp tục được thực hành hôm nay.",
            "Seeing one's language, writing, skills and memories presented with care can strengthen belonging and pride. For young people, the museum offers a place to ask about their roots and recognise Khmer culture as a continuing practice.",
          ),
          t(
            "Với du khách từ cộng đồng khác, các câu chuyện cụ thể giúp mở rộng hiểu biết về Khmer Nam Bộ: lao động, gia đình, chữ viết, tôn giáo và nghệ thuật cùng góp phần tạo nên bản sắc. Sự gặp gỡ qua di sản tạo cơ hội đối thoại giữa các cộng đồng.",
            "For visitors from other communities, specific stories broaden understanding of southern Khmer life. Work, family, writing, religion and art together shape identity, and encounters through heritage create opportunities for dialogue.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Giữ lại chữ viết và hiện vật cần đi cùng gìn giữ người đọc, người làm và những câu chuyện họ biết.",
      "Preserving writing and objects belongs alongside preserving readers, makers and the stories they know.",
    ),
    sources: ["museum", "satra", "objects", "boat"],
    related: {
      title: t(
        "Đọc thêm về Satra và chữ viết Khmer",
        "Read more about Satra and Khmer writing",
      ),
      section: "tour",
      item: "satra",
    },
  },
  {
    id: "artistry",
    group: "culture",
    title: t("Nghệ thuật & tay nghề", "Art & craftsmanship"),
    summary: t(
      "Tay nghề kết nối âm nhạc, sân khấu.",
      "Craftsmanship connects music and theatre.",
    ),
    lead: t(
      "Màu sắc của mặt nạ, nhịp ngũ âm và động tác múa tạo nên nhiều cách kể chuyện của người Khmer. Mỗi sản phẩm mang dấu ấn của tay nghề; mỗi cuộc trình diễn kết nối vật dụng, cơ thể, âm thanh và ký ức văn hóa.",
      "The colours of masks, Pinpeat rhythms and dance movements offer many ways of telling Khmer stories. Each crafted object carries skilled work, while each performance brings together objects, bodies, sound and cultural memory.",
    ),
    gallery: ["mask", "ensemble", "sang"],
    chapters: [
      chapter(
        "craft-language",
        "Mặt nạ và mão: hình tượng qua bàn tay",
        "Masks and crowns: imagery made by hand",
        [
          t(
            "Mặt nạ và mão trong nghệ thuật Khmer kết hợp tạo hình, lựa chọn màu sắc, trang trí và hiểu biết về nhân vật. Hình tượng Yeak hay Hanuman cần được đọc cùng câu chuyện sân khấu và cách sử dụng, để người xem hiểu ý nghĩa của từng dáng vẻ.",
            "Khmer masks and crowns combine modelling, colour, ornament and knowledge of characters. Figures such as Yeak and Hanuman are understood alongside theatrical stories and use, giving meaning to their appearance.",
          ),
          t(
            "Tư liệu năm 2023 ghi nhận nghệ nhân Thạch Sang hướng dẫn học viên chế tác mão, mặt nạ. Những buổi truyền dạy cho thấy kỹ năng được tiếp nối qua quan sát, làm thử, sửa và thực hành. Ảnh lớp học trong mục này là hoạt động truyền nghề của cộng đồng.",
            "A 2023 report documents artisan Thach Sang teaching crown and mask making. Such workshops show skills passed on through observation, making, correction and practice. The workshop photograph here records community craft training.",
          ),
        ],
      ),
      chapter(
        "sound-and-stage",
        "Âm nhạc và sân khấu như một cách kể chuyện",
        "Music and theatre as storytelling",
        [
          t(
            "Dàn ngũ âm, Rô băm, Dù kê và Chầm riêng Chà pây gắn với những hình thức biểu đạt khác nhau. Nhạc cụ, trang phục, mặt nạ, lời ca và động tác giúp chuyển tải truyện kể, cảm xúc, niềm tin và đạo lý trong những bối cảnh trình diễn cụ thể.",
            "Pinpeat, Robam, Du Ke and Chamrieng Chapey have distinct forms of expression. Instruments, costumes, masks, singing and movement convey narratives, emotions, beliefs and ethics within particular performance settings.",
          ),
          t(
            "Ở bảo tàng, hiện vật giúp nhận diện vật liệu và hình dáng. Để hiểu nghệ thuật đầy đủ hơn, cần nối chúng với người biểu diễn, người chế tác, người hướng dẫn và cộng đồng tiếp nhận. Âm thanh và chuyển động là phần quan trọng của ký ức nghệ thuật.",
            "Museum objects make materials and forms visible. Fuller understanding connects them with performers, makers, teachers and audiences. Sound and movement are important parts of artistic memory.",
          ),
        ],
      ),
      chapter(
        "everyday-craft",
        "Mỹ thuật hiện diện trong nhiều nghề",
        "Artistic skill across everyday crafts",
        [
          t(
            "Dệt chiếu, đan lát, chạm khắc, làm nhạc cụ và chế tác đồ dùng đều chứa kiến thức về vật liệu cùng khả năng tạo hình. Mỹ thuật hiện diện trong sản phẩm dùng mỗi ngày, trong lễ nghi và trên sân khấu.",
            "Mat weaving, basketry, carving, instrument making and household crafts combine material knowledge with shaping skills. Artistic expression appears in daily objects, ceremonies and the stage.",
          ),
          t(
            "Nghề dệt chiếu Cà Hom là một trong các chủ đề được giới thiệu tại triển lãm văn hóa Khmer tháng 11/2024. Một sản phẩm thủ công có thể mở ra câu chuyện về địa phương, gia đình, nguồn nguyên liệu và những người tiếp nối nghề.",
            "Ca Hom mat weaving was among the subjects of the November 2024 Khmer heritage exhibition. A craft product can open stories about place, family, materials and people carrying the skill forward.",
          ),
        ],
      ),
      chapter(
        "art-transmission",
        "Giữ một hệ sinh thái nghệ thuật",
        "Sustaining an artistic ecosystem",
        [
          t(
            "Một mặt nạ tiếp tục có đời sống khi còn người làm, người đeo, người kể chuyện, người đệm nhạc và người học. Mỗi mắt xích bổ trợ cho mắt xích khác. Bảo tồn sản phẩm cần đi cùng điều kiện thực hành và truyền nghề.",
            "A mask remains part of living culture when there are makers, wearers, storytellers, musicians and learners. These roles support one another. Caring for the object belongs alongside opportunities to practise and teach.",
          ),
          t(
            "Ghi nhận quy trình, lời kể của nghệ nhân và bối cảnh biểu diễn giúp người học hiểu cả kỹ thuật lẫn ý nghĩa. Nhờ vậy, tay nghề được trao lại cùng câu chuyện văn hóa mà sản phẩm chuyên chở.",
            "Documenting processes, artisans' accounts and performance settings helps learners understand technique and meaning together. Skills can then be passed on with the cultural stories they carry.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Tay nghề sống trong bàn tay người làm; nghệ thuật tiếp tục khi có người thực hành và người học.",
      "Craft lives in a maker's hands; art continues through practitioners and learners.",
    ),
    sources: ["museum", "masks", "chapey", "duke", "event"],
    related: {
      title: t(
        "Gặp những người tiếp nối nghề truyền thống",
        "Meet the people carrying traditional crafts forward",
      ),
      section: "tour",
      item: "youngmakers",
    },
  },
  {
    id: "living-landscape",
    group: "continuity",
    title: t("Quần thể di sản sống", "A living heritage landscape"),
    summary: t(
      "Bảo tàng, Ao Bà Om và chùa Âng.",
      "Museum, Ao Ba Om and Ang Pagoda.",
    ),
    lead: t(
      "Giá trị của điểm đến được mở rộng khi bước ra khỏi phòng trưng bày. Bảo tàng giải thích qua hiện vật; Ao Bà Om gợi câu chuyện cảnh quan và ký ức dân gian; chùa Âng gắn với tín ngưỡng và sinh hoạt cộng đồng. Ba không gian bổ trợ cho một trải nghiệm văn hóa liền mạch.",
      "The destination's value expands beyond the galleries. The museum explains through objects; Ao Ba Om evokes landscape and folk memory; Ang Pagoda connects belief with community life. These spaces complement one another in a connected cultural experience.",
    ),
    gallery: ["pond", "pagoda", "opening2024"],
    chapters: [
      chapter(
        "three-spaces",
        "Ba không gian, những lớp ý nghĩa bổ trợ",
        "Three spaces with complementary meanings",
        [
          t(
            "Có thể bắt đầu từ một nhóm hiện vật trong bảo tàng rồi tìm đến cảnh quan, kiến trúc hoặc sinh hoạt liên quan ở bên ngoài. Từ nhạc cụ đến sân khấu, từ đồ thờ đến chùa, từ mô hình đời sống đến phum sóc, mỗi bước nối một câu chuyện với bối cảnh của nó.",
            "A group of museum objects can lead to related landscapes, architecture or practices outside. Instruments connect to stages, ritual objects to pagodas and village models to lived settlements. Each step reconnects a story with its setting.",
          ),
          t(
            "Ao Bà Om, chùa Âng và bảo tàng tạo thành cụm điểm đến có thể tham quan kết hợp. Cách tiếp cận này giúp người xem tìm hiểu di sản qua cả hiện vật được giới thiệu và không gian cộng đồng đang sử dụng.",
            "Ao Ba Om, Ang Pagoda and the museum form a cluster that can be visited together. This approach reveals heritage through exhibited objects and spaces that communities continue to use.",
          ),
        ],
      ),
      chapter(
        "festival-context",
        "Lễ hội làm hiện vật gặp lại đời sống",
        "Festivals reconnect objects and life",
        [
          t(
            "Ok Om Bok, ghe Ngo, đèn và những sinh hoạt lễ hội mở ra mối liên hệ giữa trưng bày với thực hành cộng đồng. Ý nghĩa của hiện vật được làm rõ hơn khi người xem hiểu mùa lễ, người tham gia, niềm tin và sự phối hợp đằng sau hoạt động.",
            "Ok Om Bok, Ngo boats, lanterns and celebrations connect displays with community practice. Objects become more meaningful through understanding the festival season, participants, beliefs and coordination behind these activities.",
          ),
          t(
            "Nhiều lễ hội, nghề và nghệ thuật được giới thiệu tại bảo tàng thuộc đời sống Khmer rộng hơn trong vùng. Ảnh Ao Bà Om, chùa và lớp truyền nghề được ghi chú theo địa điểm, sự kiện và nguồn tư liệu, giúp nhận biết mối liên hệ văn hóa ấy.",
            "Many festivals, crafts and arts presented at the museum belong to wider regional Khmer life. Photographs of Ao Ba Om, pagodas and workshops are captioned by setting, event and source to make these cultural connections clear.",
          ),
        ],
      ),
      chapter(
        "exhibitions-today",
        "Trưng bày mở ra cuộc gặp gỡ mới",
        "Exhibitions create new encounters",
        [
          t(
            "Bên cạnh bộ sưu tập thường xuyên, các triển lãm chuyên đề tạo cơ hội nhìn di sản qua những chủ đề khác nhau. Tháng 11/2024, triển lãm văn hóa Khmer giới thiệu Ok Om Bok, Rô băm, Chầm riêng Chà pây, Đom Lơng Neak Tà và nghề dệt chiếu Cà Hom.",
            "Alongside the permanent collection, thematic exhibitions offer new perspectives. The November 2024 Khmer heritage exhibition introduced Ok Om Bok, Robam, Chamrieng Chapey, Dom Long Neak Ta and Ca Hom mat weaving.",
          ),
          t(
            "Những cuộc gặp giữa hiện vật, người giới thiệu và công chúng giúp kiến thức đi vào đối thoại. Người đã quen một truyền thống có thể bổ sung ký ức của mình; người lần đầu tiếp cận có thể đặt câu hỏi và khám phá thêm.",
            "Encounters between objects, interpreters and visitors turn knowledge into dialogue. People familiar with a tradition can contribute memories, while newcomers can ask questions and explore further.",
          ),
        ],
      ),
      chapter(
        "respectful-visit",
        "Trải nghiệm văn hóa đi cùng sự tôn trọng",
        "Experiencing culture with respect",
        [
          t(
            "Tham quan cụm di sản là dịp tìm hiểu đời sống của một cộng đồng đang tiếp tục thực hành văn hóa. Tôn trọng không gian tín ngưỡng, người tham gia lễ nghi, cảnh quan và lời kể của người địa phương giúp cuộc gặp gỡ có ý nghĩa hơn.",
            "Visiting this heritage cluster is an encounter with a community continuing its cultural practices. Respect for religious spaces, ritual participants, the landscape and local accounts makes that encounter more meaningful.",
          ),
          t(
            "Giá trị du lịch và giáo dục bổ trợ cho bảo tồn khi mang lại hiểu biết, khuyến khích gìn giữ môi trường và tạo cơ hội cho người thực hành văn hóa. Di sản tiếp tục có sức sống nhờ mối quan hệ giữa nơi chốn và con người.",
            "Tourism and education support conservation when they build understanding, encourage environmental care and create opportunities for cultural practitioners. Heritage remains alive through the relationship between places and people.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Từ một hiện vật, hãy tiếp tục tìm đến nơi chốn, con người và sinh hoạt đã làm nên ý nghĩa của nó.",
      "Let an object lead you to the places, people and practices that give it meaning.",
    ),
    sources: ["tour", "event", "customs", "boat"],
    related: {
      title: t(
        "Khám phá Ao Bà Om và quần thể liên hoàn",
        "Explore Ao Ba Om and the connected heritage cluster",
      ),
      section: "map",
      item: "pond",
    },
  },
  {
    id: "continuity",
    group: "continuity",
    title: t("Bảo tồn & tiếp nối", "Conservation & continuity"),
    summary: t(
      "Gìn giữ hôm nay, trao truyền mai sau.",
      "Care today, pass knowledge forward.",
    ),
    lead: t(
      "Di sản được gìn giữ qua nhiều công việc: sưu tầm, ghi chép, bảo quản, nghiên cứu, trưng bày và truyền dạy. Bảo tàng kết nối các công việc ấy với người xem. Giá trị để lại hôm nay còn nằm ở khả năng tiếp tục được hiểu, sử dụng và trao truyền trong tương lai.",
      "Heritage is sustained through collecting, documenting, conserving, researching, exhibiting and teaching. The museum connects this work with visitors. Its lasting value includes the possibility of continuing to understand, practise and transmit knowledge into the future.",
    ),
    gallery: ["sang", "donors2024", "khmerDance"],
    chapters: [
      chapter(
        "conservation-journey",
        "Một quá trình chăm sóc và làm mới",
        "A continuing process of care and renewal",
        [
          t(
            "Từ khi hình thành trong thập niên 1990, bảo tàng dần sưu tầm, hệ thống hóa và giới thiệu hiện vật. Đợt chỉnh lý trưng bày năm 2014 và việc bổ sung nội dung lịch sử hiện đại năm 2016 cho thấy cách diễn giải di sản được tiếp tục phát triển.",
            "Since its establishment in the 1990s, the museum has collected, organised and presented objects. The 2014 display revision and the addition of modern historical content in 2016 show interpretation continuing to evolve.",
          ),
          t(
            "Trước đây, nhiều tri thức được lưu giữ qua gia đình, chùa và phum sóc. Hôm nay, bảo tàng, triển lãm chuyên đề, hoạt động học tập và tư liệu nghiên cứu bổ sung những con đường tiếp cận. Các hình thức ấy có thể hỗ trợ nhau trong việc trao truyền ký ức.",
            "Families, pagodas and villages have long held cultural knowledge. Museums, thematic exhibitions, study activities and research records add further ways of accessing it. These forms can support one another in transmitting memory.",
          ),
        ],
      ),
      chapter(
        "people-and-skills",
        "Bảo tồn cùng người nắm giữ tri thức",
        "Conservation with knowledge holders",
        [
          t(
            "Giữ mặt nạ cần đi cùng người làm và người diễn; giữ Satra cần đi cùng người đọc; giữ nhạc cụ cần đi cùng người chế tác và người chơi. Lời kể, quy trình thực hành, thuật ngữ Khmer và quan hệ thầy trò là những phần cần được quan tâm cùng hiện vật.",
            "Caring for masks includes makers and performers; caring for Satra includes readers; caring for instruments includes makers and players. Accounts, working processes, Khmer terminology and relationships between teachers and learners deserve care alongside objects.",
          ),
          t(
            "Các lớp truyền nghề và hoạt động giáo dục giúp người trẻ bước vào mạng lưới ấy. Tư liệu về nghệ nhân, học viên và sinh viên cho thấy tiếp nối văn hóa là công việc của nhiều thế hệ cùng tham gia.",
            "Craft workshops and education allow young people to enter this network. Records of artisans, learners and students show cultural continuity as a shared effort across generations.",
          ),
        ],
      ),
      chapter(
        "education-and-research",
        "Một nguồn học liệu tiếp tục có giá trị",
        "A learning resource with lasting value",
        [
          t(
            "Người học có thể tiếp cận lịch sử, mỹ thuật, tôn giáo, chữ viết, lao động và sân khấu qua các nhóm hiện vật. Việc quan sát trực tiếp và đặt câu hỏi giúp kết nối kiến thức với trải nghiệm. Hoạt động tham quan học tập vẫn được ghi nhận trong tư liệu năm 2026.",
            "Learners can approach history, art, religion, writing, work and theatre through objects. Direct observation and questions connect knowledge with experience. Study visits are also documented in 2026 records.",
          ),
          t(
            "Năm 2024, bảo tàng được Hiệp hội Du lịch Đồng bằng sông Cửu Long công nhận là điểm du lịch tiêu biểu. Với nghiên cứu lâu dài, ảnh, hồ sơ hiện vật và lời kể bổ sung ngữ cảnh sử dụng, để các thế hệ sau có thể tiếp tục tìm hiểu những điều dễ bị thời gian làm mờ.",
            "In 2024, the Mekong Delta Tourism Association recognised the museum as a representative tourism destination. For long-term research, photographs, object records and personal accounts preserve contexts that time can gradually obscure.",
          ),
        ],
      ),
      chapter(
        "digital-future",
        "Hướng tiếp nối: ghi chép và số hóa có ngữ cảnh",
        "Looking ahead: documentation with context",
        [
          t(
            "Một hướng phát triển là ghi lại hiện vật cùng người làm, lời kể và cách sử dụng: chụp ảnh chi tiết, phỏng vấn, ghi âm, quay quy trình, số hóa văn bản hoặc xây dựng tư liệu 3D. Mỗi bản ghi cần có xuất xứ, thời điểm và sự tham gia của người nắm giữ tri thức.",
            "A possible direction is to document objects with makers, accounts and uses through detailed photographs, interviews, recordings, process films, manuscript digitisation or 3D records. Each record needs provenance, dates and the participation of knowledge holders.",
          ),
          t(
            "Các ý tưởng như quan sát mặt nạ 3D, đọc gần trang Satra hay tìm hiểu âm sắc từng nhạc cụ là gợi mở cho tương lai. Giá trị của công nghệ nằm ở việc làm rõ câu chuyện, hỗ trợ học hỏi và giữ kết nối với cộng đồng thực hành.",
            "Ideas such as examining a 3D mask, reading a Satra page closely or learning an instrument's timbre suggest future possibilities. Technology is valuable when it clarifies stories, supports learning and stays connected to practising communities.",
          ),
        ],
      ),
    ],
    takeaway: t(
      "Nơi này để lại hiện vật, tri thức, ký ức tập thể, truyền thống sống và cơ hội tiếp nối. Di sản tiếp tục khi có người hiểu, thực hành và trao lại.",
      "This place leaves objects, knowledge, collective memory, living traditions and opportunities for continuity. Heritage continues through people who understand, practise and pass it on.",
    ),
    sources: ["museum", "reopening", "masks", "teaching", "education", "mdta"],
    related: {
      title: t(
        "Xem hoạt động và những người giữ gìn di sản",
        "Explore activities and the people sustaining heritage",
      ),
      section: "tour",
      item: "thachsang",
    },
  },
];

export const khmerLegacyConnections = [
  {
    title: t("Hiện vật", "Objects"),
    text: t("Giữ dấu vết và chất liệu", "Preserve traces and materials"),
  },
  {
    title: t("Con người", "People"),
    text: t("Thực hành và trao truyền", "Practise and pass on"),
  },
  {
    title: t("Tri thức", "Knowledge"),
    text: t("Hiểu cách làm và ý nghĩa", "Understand methods and meaning"),
  },
  {
    title: t("Không gian", "Places"),
    text: t("Gắn với đời sống cộng đồng", "Connect with community life"),
  },
];
