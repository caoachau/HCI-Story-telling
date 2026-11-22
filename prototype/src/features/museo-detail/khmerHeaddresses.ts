import type { PlaceLanguage } from "./khmerPlaces";
const t = (vi: string, en: string): Record<PlaceLanguage, string> => ({ vi, en });

export const royalHeaddressesStory = {
  sections: [
    {
      title: t("Mão vua và vai nữ hoàng gia", "King and royal heroine"),
      text: t(
        "Với kiểu mão vua, hãy chú ý chóp cao và dáng vươn lên; với mão hoàng hậu, quan sát các tầng trang trí và vành ôm trán. Mão (Mkot), cùng phục trang và động tác, giúp khán giả đọc vai diễn. Cách gọi hai kiểu mão ở đây theo tư liệu mô hình được cung cấp; chưa đủ căn cứ để gán từng chiếc cho một nhân vật cụ thể.",
        "For the king’s type, look at the tall spire and upright silhouette; for the queen’s, compare the decorative tiers and forehead band. A headdress (Mkot), costume and movement help audiences read a role. The labels follow the supplied model information; they do not establish a specific character for each crown.",
      ),
    },
    {
      title: t("Từ mão đến câu chuyện Ream Kê", "From headdress to Reamker"),
      text: t(
        "Trong truyện Ream Kê, Preah Ream và nàng Sê-đa (Neang Seda) là hai nhân vật quan trọng. Sân khấu Khmer đưa truyện kể vào múa, âm nhạc và hóa trang. Chuyên đề của Bảo tàng Vĩnh Long giới thiệu cả mão, mặt nạ và trình diễn Rô-băm để nối hiện vật với vai diễn.",
        "Preah Ream and Neang Seda are important figures in the Reamker. Khmer theatre brings narrative into dance, music and costume. Vinh Long Museum presents headdresses, masks and Robam performance together to connect objects with their theatrical use.",
      ),
    },
    {
      title: t("Làm nên một chiếc mão", "Making a headdress"),
      text: t(
        "Tư liệu bảo tàng mô tả ba bước chính: tạo khuôn; bồi giấy hoặc vải; tạo hình, sơn màu và hoàn thiện hoa văn. Sự khéo léo còn nằm ở việc hiểu nhân vật và giữ dáng mão phù hợp với biểu diễn. Chất liệu, nghệ nhân và niên đại của mẫu 3D này cần được đối chiếu bằng hồ sơ riêng.",
        "Museum research describes three main stages: making a mould, building up paper or fabric layers, then shaping, painting and finishing ornament. The craft also requires an understanding of the character and performance. Materials, maker and date of this particular 3D example require its own object record.",
      ),
    },
    {
      title: t("Di sản sống trong bàn tay nghệ nhân", "A living craft"),
      text: t(
        "Nghề làm mão, mặt nạ của đồng bào Khmer được ghi danh di sản văn hóa phi vật thể quốc gia năm 2025. Giá trị của nghề đi cùng sự truyền dạy kỹ năng, tri thức về nhân vật và việc tiếp tục sử dụng đạo cụ trên sân khấu.",
        "Khmer headdress and mask making entered Vietnam’s national intangible cultural heritage list in 2025. Its value includes passing on skills and knowledge of characters, and keeping the objects in use on stage.",
      ),
    },
  ],
  sources: [
    { title: t("Bảo tàng Vĩnh Long · Nghề làm mão, mặt nạ", "Vinh Long Museum · Headdress and mask making"), url: "https://baotangvinhlong.vn/bai-viet-nghien-cuu-67150/doi-net-nghe-lam-mao-mu-mat-na-cua-dong-bao-khmer-o-tra-vinh-di-san-van-hoa-phi-vat-the-quoc-gia-587164" },
    { title: t("Bảo tàng Vĩnh Long · Từ hiện vật đến diễn xướng", "Vinh Long Museum · Objects and performance"), url: "https://baotangvinhlong.vn/su-kien-noi-bat/bao-tang-vinh-long-gioi-thieu-di-san-nghe-lam-mao-mat-na-cua-dong-bao-khmer-den-cong-chung-dak-l-587184" },
    { title: t("Văn học Nghệ thuật Đắk Lắk · Mão và sân khấu Khmer", "Dak Lak Arts · Khmer headdresses and theatre"), url: "https://vhnt.daklak.gov.vn/kham-pha-net-van-hoa-doc-dao-cua-dong-bao-khmer-2027.html" },
    { title: t("NAFA · Preah Ream trong truyện Reamker", "NAFA · Preah Ream in the Reamker"), url: "https://iseaa.nafa.edu.sg/resources/collections/artwork/preah-ream-and-krong-reap-battle-lanka" },
  ],
};
