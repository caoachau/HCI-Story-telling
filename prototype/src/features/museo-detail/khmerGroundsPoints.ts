import {
  khmerPlacePhotos,
  khmerPlaceSources,
  type PlaceLanguage,
} from "./khmerPlaces";
type Copy = Record<PlaceLanguage, string>;
const t = (vi: string, en: string): Copy => ({ vi, en });
export interface GroundsImage {
  /** Normalized viewport into the original photograph; original file stays intact. */
  crop?: { x: number; y: number; width: number; height: number };
  src: string;
  title: Copy;
  caption: Copy;
  credit: string;
  sourceUrl?: string;
  licenseUrl?: string;
  licenseName?: string;
  context?: boolean;
}
export interface GroundsPoint {
  /** Navigation hotspot, distinct from an object information marker. */
  targetEntryId?: string;
  showNumber?: boolean;
  /** Keep a navigation destination available in the photograph strip. */
  showInStrip?: boolean;
  id: string;
  number?: number;
  topicId?: string;
  markerKind?: "topic" | "exhibit";
  title: Copy;
  category: Copy;
  summary: Copy;
  /** Confirmed against the exact panorama and the three user-supplied views.
   * u/v are normalized image coordinates, not geographic bearings. */
  u: number;
  v: number;
  view: { yaw: number; pitch: number; fov: number };
  images: GroundsImage[];
  observe: Copy;
  sections: { title: Copy; text: Copy }[];
  sources: { title: Copy; url: string }[];
  floors?: ("ground" | "upper")[];
  placeId?: string;
}
const photo = (id: keyof typeof khmerPlacePhotos): GroundsImage => {
  const image = khmerPlacePhotos[id];
  return {
    src: image.src,
    title: image.title,
    caption: image.caption,
    credit: image.author,
    sourceUrl: khmerPlaceSources[image.source].url,
  };
};
const point = (
  item: Omit<GroundsPoint, "view">,
  fov: number,
): GroundsPoint => ({
  ...item,
  view: { yaw: item.u * 360, pitch: 90 - item.v * 180, fov },
});
export const khmerGroundsPoints: GroundsPoint[] = [
  point(
    {
      id: "museum-building",
      number: 1,
      placeId: "entrance",
      title: t("Tòa bảo tàng", "Museum building"),
      category: t("Kiến trúc", "Architecture"),
      summary: t(
        "Mái tam giác, hàng cột và khoảng sảnh mở tạo nên diện mạo của tòa nhà trưng bày hai tầng.",
        "Triangular roof lines, columns and an open entrance characterize the two-storey museum.",
      ),
      u: 0.495,
      v: 0.435,
      floors: ["ground", "upper"],
      images: [
        {
          src: new URL("../../assets/museo/khmer-building-original.jpg", import.meta.url).href,
          title: t("Mặt tiền giữa khuôn viên", "The facade in its grounds"),
          caption: t("Ảnh gốc 4.608 × 3.456 px, chụp ngày 17/03/2013. Cùng tòa bảo tàng trong panorama, ở góc nhìn và thời điểm khác.", "Original 4,608 × 3,456 photograph, taken on 17 March 2013. The same museum building from a different viewpoint and date."),
          credit: "Bùi Thụy Đào Nguyên · Wikimedia Commons · 2013",
          sourceUrl: "https://commons.wikimedia.org/wiki/File:B%E1%BA%A3o_t%C3%A0ng_Khmer_%E1%BB%9F_Tr%C3%A0_Vinh.jpg",
          licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
          licenseName: "CC BY-SA 3.0",
        },
        photo("facade"), photo("roof"),
      ],
      observe: t(
        "Đối chiếu đường mái, các ô tam giác và lối lên hai bên sảnh.",
        "Compare the roof, triangular openings and stairs beside the entrance.",
      ),
      sections: [
        {
          title: t(
            "Từ sân vào không gian trưng bày",
            "From courtyard to galleries",
          ),
          text: t(
            "Tòa nhà kết hợp kiến trúc Khmer với tổ chức không gian hiện đại. Khu đón tiếp và các chức năng làm việc nằm dưới; trưng bày chính ở tầng trên.",
            "The building combines Khmer architecture with modern spatial planning. Reception and working functions occupy the lower level; the main displays are upstairs.",
          ),
        },
        {
          title: t("Nhìn gần hơn", "Look closer"),
          text: t(
            "Quan sát nhịp cột và phần trang trí ở mặt tiền trước khi đi vào. Ảnh cận được chụp ở góc và thời điểm khác với panorama.",
            "Look at the column rhythm and facade decoration before entering. The detail photographs use different viewpoints and dates from the panorama.",
          ),
        },
      ],
      sources: [
        {
          title: t(
            "Bảo tàng Lịch sử Quốc gia · giới thiệu bảo tàng",
            "National Museum of History · museum introduction",
          ),
          url: khmerPlaceSources.archive.url,
        },
      ],
    },
    75,
  ),
  point(
    {
      id: "ngo-ba-si",
      number: 2,
      title: t("Ghe Ngo của chùa Pesey Vararam (chùa Ba Si)", "Ngo boat of Pesey Vararam (Ba Si Pagoda)"),
      category: t("Ghe Ngo · 1997", "Ngo boat · 1997"),
      summary: t("Chiếc ghe dài 28 m bằng gỗ sao, do nghệ nhân Kim Crụp chế tác năm 1997; chùa Ba Si bàn giao cho bảo tàng năm 2021.", "A 28-metre sao-wood boat made by artisan Kim Crup in 1997 and transferred from Ba Si Pagoda to the museum in 2021."),
      // Position identified by the user between the museum and the large tree.
      u: 0.621,
      v: 0.505,
      images: [
        {
          src: new URL("../../assets/museo/khmer-ba-si-boat-1.jpg", import.meta.url).href,
          title: t("Ghe Ngo chùa Ba Si", "Ba Si Pagoda's Ngo boat"),
          caption: t("Chiếc ghe Ngo được bảo quản dưới mái che tại bảo tàng. Ảnh tư liệu ở góc nhìn khác với ảnh 360°.", "The Ngo boat preserved under shelter at the museum, photographed from a different viewpoint to the panorama."),
          credit: "Huỳnh Như · Bảo tàng Vĩnh Long",
          sourceUrl: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188",
        },
        {
          src: new URL("../../assets/museo/khmer-ba-si-boat-2.jpg", import.meta.url).href,
          title: t("Bên trong lòng ghe", "Inside the hull"),
          caption: t("Góc nhìn dọc lòng ghe cho thấy các thanh ngang và cấu tạo thân ghe.", "A view along the hull showing its crosspieces and construction."),
          credit: "Huỳnh Như · Bảo tàng Vĩnh Long",
          sourceUrl: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188",
        },
        {
          src: new URL("../../assets/museo/khmer-ba-si-boat-4.jpg", import.meta.url).href,
          title: t("Hoa văn trên thân ghe", "Hull decoration"),
          caption: t("Các dải hoa văn và màu sắc trang trí trên thân ghe Ngo chùa Ba Si.", "Painted ornamental bands on the hull of Ba Si Pagoda's Ngo boat."),
          credit: "Huỳnh Như · Bảo tàng Vĩnh Long",
          sourceUrl: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188",
        },
      ],
      observe: t("Quan sát dáng ghe dài, lòng ghe và hoa văn Makara (Mkor) trên thân ghe.", "Observe the long hull, its interior and the Makara (Mkor) ornament."),
      sections: [
        { title: t("Thông tin hiện vật", "Object information"), text: t("Tên: Ghe Ngo chùa Pesey Vararam (chùa Ba Si). Niên đại: năm 1997. Chất liệu: gỗ sao. Kích thước: dài 28 m.", "Name: Ngo boat of Pesey Vararam (Ba Si Pagoda). Date: 1997. Material: sao wood. Length: 28 metres.") },
        { title: t("Người chế tác", "The maker"), text: t("Nghệ nhân Kim Crụp, người Sóc Trăng, thiết kế và chế tác chiếc ghe.", "Artisan Kim Crup, from Soc Trang, designed and built the boat.") },
        { title: t("Từ chùa Ba Si đến bảo tàng", "From Ba Si Pagoda to the museum"), text: t("Ghe có nguồn gốc từ chùa Ba Si, ấp Giồng Chùa, xã Phương Thạnh, huyện Càng Long, tỉnh Trà Vinh — địa danh theo hồ sơ nguồn gốc hiện vật. Năm 2021, chiếc ghe được bàn giao cho bảo tàng để bảo quản và trưng bày.", "The boat originated at Ba Si Pagoda, Giong Chua hamlet, Phuong Thanh commune, Cang Long district, Tra Vinh province, using the locality names in its provenance record. It was transferred to the museum for preservation and display in 2021.") },
        { title: t("Hoa văn Makara (Mkor)", "Makara (Mkor) ornament"), text: t("Hoa văn trang trí lấy cảm hứng từ linh vật thần thoại Makara (Mkor), thể hiện qua những đường nét cách điệu và màu sắc trên thân ghe.", "The painted decoration draws on the mythical Makara (Mkor), expressed through stylized lines and colours along the hull.") },
      ],
      sources: [{ title: t("Bảo tàng Vĩnh Long · Ghe Ngo chùa Ba Si · Bài, ảnh: Huỳnh Như", "Vinh Long Museum · Ba Si Ngo boat · Text and photographs: Huynh Nhu"), url: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/ghe-ngo-bieu-tuong-van-hoa-truyen-thong-cua-dong-bao-khmer-587188" }],
    },
    75,
  ),
  point(
    {
      id: "maha-son-thong",
      number: 3,
      placeId: "memorial",
      title: t("Tháp Maha Sơn Thông", "Maha Son Thong memorial"),
      category: t("Tưởng niệm", "Remembrance"),
      summary: t(
        "Tòa tháp trắng, đỏ giữa hàng cây tưởng niệm cụ Maha Sơn Thông (1910–1997).",
        "The white and red tower among the trees commemorates Maha Son Thong (1910–1997).",
      ),
      u: 0.687,
      v: 0.468,
      images: [
        {
          src: new URL("../../assets/museo/khmer-memorial-user-front.jpg", import.meta.url).href,
          title: t("Mặt trước tháp Maha Sơn Thông", "Maha Son Thong memorial front"),
          caption: t("Ảnh nhìn rõ các tầng mái trắng, đỏ, hoa văn và cửa vào tháp tưởng niệm.", "A clear view of the white and red tiers, ornament and entrance to the memorial."),
          credit: "Ảnh do người dùng cung cấp",
        },
        {
          src: new URL("../../assets/museo/khmer-memorial-user-garden.jpg", import.meta.url).href,
          title: t("Tháp giữa khuôn viên cây xanh", "The memorial in its garden"),
          caption: t("Góc nhìn toàn tháp giữa cây xanh, thể hiện dáng tháp và các bậc nền.", "The complete tower among the trees, showing its silhouette and stepped base."),
          credit: "Ảnh do người dùng cung cấp",
        },
        photo("khmerStele"), photo("viStele"),
      ],
      observe: t(
        "Tìm các tầng mái, hoa văn và văn bia bằng tiếng Khmer, tiếng Việt.",
        "Look for the roof tiers, ornament and Khmer and Vietnamese inscriptions.",
      ),
      sections: [
        {
          title: t("Một không gian tri ân", "A place of remembrance"),
          text: t(
            "Theo Bảo tàng Vĩnh Long, tháp được xây dựng năm 2012 trong khuôn viên bảo tàng, ghi nhận đóng góp của cụ Maha Sơn Thông cho cộng đồng và lịch sử cách mạng.",
            "Vinh Long Museum records that the memorial was built in 2012 within the museum grounds to honour his community and revolutionary contributions.",
          ),
        },
        {
          title: t("Đọc di sản qua văn bia", "Reading the inscriptions"),
          text: t(
            "Văn bia Khmer và Việt giới thiệu cuộc đời của cụ. Bộ ảnh cận giúp xem phần chữ và không gian tưởng niệm rõ hơn góc nhìn bị cây che trong panorama.",
            "Khmer and Vietnamese inscriptions introduce his life. The detail gallery reveals the inscriptions and memorial more clearly than the tree-obscured panorama view.",
          ),
        },
      ],
      sources: [
        {
          title: khmerPlaceSources.memorial.title,
          url: khmerPlaceSources.memorial.url,
        },
      ],
    },
    50,
  ),
  point(
    {
      id: "outdoor-instrument",
      number: 4,
      title: t("Nhạc cụ dạng thuyền", "Boat-shaped instrument"),
      category: t("Nhạc cụ ngoài trời", "Outdoor instrument"),
      summary: t(
        "Dãy thanh gõ đặt trên thân cong hai đầu, giữa bóng cây trong khuôn viên bảo tàng.",
        "A row of striking bars rests on an upturned boat-shaped body beneath the trees in the museum grounds.",
      ),
      u: 0.739,
      v: 0.581,
      images: [
        {
          src: new URL(
            "../../assets/museo/khmer-instrument-user-detail.jpg",
            import.meta.url,
          ).href,
          title: t("Nhạc cụ dạng thuyền trong khuôn viên", "Boat-shaped instrument in the grounds"),
          caption: t(
            "Ảnh cận rõ dãy thanh gõ, hai đầu thân cong, dùi gõ và phần chữ trên bệ.",
            "A close view of the bars, curved ends, mallets and inscription on the base.",
          ),
          credit: "Ảnh do người dùng cung cấp",
        },
      ],
      observe: t(
        "Quan sát các thanh gõ, hai chiếc dùi và dòng chữ kỷ niệm trên bệ.",
        "Look at the bars, two mallets and commemorative inscription on the base.",
      ),
      sections: [
        {
          title: t("Nhìn gần cấu tạo", "Look at its construction"),
          text: t(
            "Ảnh cận giúp thấy rõ hàng thanh gõ đặt trên thân dạng thuyền và hai chiếc dùi phía trên. Hãy so sánh độ dài, bề rộng và cách sắp các thanh để quan sát cấu tạo nhạc cụ.",
            "The close view shows bars arranged on a boat-shaped body, with two mallets above. Compare the lengths, widths and arrangement of the bars to explore the instrument’s construction.",
          ),
        },
        {
          title: t(
            "Dòng chữ trên bệ",
            "The inscription on the base",
          ),
          text: t(
            "Dòng chữ trên bệ nhắc tới kỷ niệm 30 năm tái lập tỉnh Trà Vinh, giai đoạn 05/1992–05/2022. Đây là thông tin đọc từ ảnh, chưa dùng để xác định nghệ nhân hoặc ngày chế tác nhạc cụ.",
            "The base inscription commemorates 30 years since Tra Vinh province was re-established, covering May 1992–May 2022. This visible inscription does not by itself establish the maker or production date.",
          ),
        },
      ],
      sources: [
        {
          title: t(
            "Google Maps · panorama có đúng vật thể ngoài sân",
            "Google Maps · panorama of this exact outdoor object",
          ),
          url: khmerPlaceSources.grounds360.url,
        },
        {
          title: t(
            "Bảo tàng Lịch sử Quốc gia · nhạc cụ Khmer",
            "National Museum of History · Khmer instruments",
          ),
          url: khmerPlaceSources.archive.url,
        },
      ],
    },
    50,
  ),
];
