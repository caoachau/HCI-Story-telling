import jeep from '../../assets/den-tho-bac/war-artifacts-user/bac-23.avif';
import gun from '../../assets/den-tho-bac/war-artifacts-user/bac-24.avif';
import helicopter from '../../assets/den-tho-bac/war-artifacts-user/bac-25.avif';
import type { Photo } from './content';
import type { ReaderChapter } from './reader-content';

export const WAR_ARTIFACT_SOURCES = [
  { name: 'Tiền Phong · Cảnh Kỳ', title: 'Về thăm Đền thờ Bác', date: '01/05/2026', url: 'https://tienphong.vn/ve-tham-den-tho-bac-post1839811.tpo', note: 'Bài ảnh gốc có đúng ba hiện vật và chú thích về chiếc xe Jeep ngày 30/4/1975.' },
  { name: 'Báo Sài Gòn Giải Phóng', title: 'Bài 7: “Vợ” của… nhiều người', date: '09/10/2014', url: 'https://www.sggp.org.vn/bai-7-vo-cua-nhieu-nguoi-post19171.html', note: 'Phóng sự từ lời kể của những người tham gia, đối chiếu Huỳnh Chí Thiện, Mười Vân và sự kiện Tầm Phương đêm 12, rạng sáng 13/8/1969.' },
  { name: 'U.S. Army · Redstone Arsenal', title: 'Aviation Systems · Bell HU-1A/HU-1B', date: 'Tư liệu lịch sử hàng không', url: 'https://history.redstone.army.mil/avi-systems.html', note: 'Giải thích lịch sử tên gọi HU-1, UH-1 và biệt danh Huey. Đây là thông tin về dòng trực thăng, không phải hồ sơ số hiệu của hiện vật tại di tích.' },
] as const;

const credit = 'Cảnh Kỳ / Báo Tiền Phong';
const creditUrl = WAR_ARTIFACT_SOURCES[0].url;
export const WAR_ARTIFACT_SUMMARY = [
  'Xe Jeep được sử dụng trong ngày tiếp quản Dinh Tỉnh trưởng Vĩnh Bình, ngày 30 tháng 4 năm 1975.',
  'Khẩu pháo 105 mi li mét gắn với trận Tầm Phương đêm 12, rạng sáng 13 tháng 8 năm 1969.',
  'Theo biển trưng bày, trực thăng HU 1A gắn với trận Tân An ngày 19 tháng 5 năm 1964.',
];
export const WAR_ARTIFACT_PHOTOS: Record<string, Photo> = {
  'war-jeep': { src: jeep, alt: 'Xe Jeep nhìn chính diện dưới mái che; biển trước xe ghi việc tiếp quản Dinh Tỉnh trưởng Vĩnh Bình ngày 30 tháng 4 năm 1975.', caption: 'Xe Jeep gắn với việc tiếp quản Dinh Tỉnh trưởng Vĩnh Bình ngày 30/4/1975.', credit, creditUrl },
  'war-gun': { src: gun, alt: 'Khẩu pháo 105 mm nhìn từ phía trước, thấy nòng pháo, tấm chắn, hai bánh xe và biển giới thiệu về trận Tầm Phương.', caption: 'Khẩu pháo 105 mm và biển giới thiệu trận Tầm Phương đêm 12, rạng sáng 13/8/1969.', credit, creditUrl },
  'war-helicopter': { src: helicopter, alt: 'Trực thăng nhìn chính diện dưới mái che, thấy buồng lái, càng trượt và biển mang tên HU 1A ở phía trước.', caption: 'Trực thăng mang biển tên HU 1A tại khu trưng bày ngoài trời.', credit, creditUrl },
};

export const WAR_ARTIFACT_CHAPTERS: ReaderChapter[] = [
  {
    id: 'war-jeep', label: 'Xe Jeep', title: 'Chiếc xe trong ngày tiếp quản.', photo: WAR_ARTIFACT_PHOTOS['war-jeep'],
    facts: [{ label: 'Mốc sự kiện', value: '30/04/1975' }, { label: 'Địa điểm', value: 'Dinh Tỉnh trưởng Vĩnh Bình' }],
    paragraphs: [
      'Biển giới thiệu trước đầu xe ghi đây là chiếc Jeep được chính quyền cách mạng sử dụng khi tiếp quản Dinh Tỉnh trưởng Vĩnh Bình, tức Trà Vinh, ngày 30/4/1975. Bài ảnh của Tiền Phong cũng xác nhận mối liên hệ này.',
      'Chiếc xe giúp câu chuyện về ngày tiếp quản trở nên cụ thể: một phương tiện từng được sử dụng nay được giữ lại trong khuôn viên di tích. Dòng chữ đặt ngay trước xe là điểm bắt đầu để nối hiện vật với sự kiện.',
    ],
    look: ['Quan sát kính chắn gió, hai đèn tròn và phần đầu xe.', 'Đọc biển xanh phía trước để nối chiếc xe với mốc 30/4/1975.'],
    labelText: 'XE JEEP\nChính quyền cách mạng sử dụng tiếp quản Dinh Tỉnh trưởng Vĩnh Bình (Trà Vinh) ngày 30 tháng 04 năm 1975.',
    references: [WAR_ARTIFACT_SOURCES[0]],
  },
  {
    id: 'war-gun', label: 'Pháo 105 mm', title: 'Từ căn cứ Tầm Phương đến không gian lưu niệm.', photo: WAR_ARTIFACT_PHOTOS['war-gun'],
    facts: [{ label: 'Cỡ pháo trên biển', value: '105 mm' }, { label: 'Mốc sự kiện', value: 'Đêm 12–13/08/1969' }],
    paragraphs: [
      'Theo biển tại hiện vật, khẩu pháo được thu trong trận ở căn cứ pháo binh Tầm Phương, khi lực lượng vũ trang Trà Vinh phối hợp với cơ sở nội tuyến Huỳnh Chí Thiện. Biển ghi sự kiện diễn ra đêm 12, rạng sáng 13/8/1969 và thu được hai khẩu pháo 105 mm.',
      'Phóng sự của Sài Gòn Giải Phóng ghi lại cùng mốc thời gian, đồng thời kể về Mười Vân trong vai trò liên lạc với Huỳnh Chí Thiện. Bên cạnh khí tài được lưu giữ là câu chuyện về những con người làm công tác nội tuyến và kết nối lực lượng.',
    ],
    look: ['Theo dõi trục nòng pháo, tấm chắn phía trước và hai bánh xe.', 'Ảnh dọc giữ đầy đủ khẩu pháo lẫn biển ở chân bệ; mở phần đọc biển để xem chữ rõ hơn.'],
    labelText: 'Khẩu pháo 105mm\nTa thu được trong trận: Lực lượng vũ trang tỉnh Trà Vinh kết hợp cơ sở nội tuyến Huỳnh Chí Thiện, Trung úy pháo binh. Khởi nghĩa tại căn cứ pháo binh Tầm Phương đêm 12 rạng 13 sáng tháng 8 năm 1969, kết quả tiêu diệt và bắt sống được 32 tên địch thu toàn bộ vũ khí, có 02 khẩu pháo 105 mm.',
    references: [WAR_ARTIFACT_SOURCES[1]],
  },
  {
    id: 'war-helicopter', label: 'Trực thăng HU1A', title: 'Một hiện vật gợi lại trận Tân An.', photo: WAR_ARTIFACT_PHOTOS['war-helicopter'],
    facts: [{ label: 'Tên trên biển', value: 'HU 1A' }, { label: 'Mốc ghi trên biển', value: '19/05/1964 · Tân An' }],
    paragraphs: [
      'Biển trưng bày gọi hiện vật là trực thăng HU 1A của Mỹ và ghi Đại đội Bộ binh 509 tỉnh Trà Vinh bắn rơi trong trận đánh trực thăng vận ở Tân An ngày 19/5/1964. Tên và ngày trong mục này được dẫn theo biển ngay trước hiện vật.',
      'Tư liệu của U.S. Army cho biết HU-1 là tên gọi cũ của dòng trực thăng sau đổi thành UH-1 vào năm 1962; biệt danh Huey bắt nguồn từ cách gọi HU-1. Thông tin này giúp hiểu tên trên biển, còn câu chuyện cụ thể của hiện vật được đọc cùng phần thuyết minh tại di tích.',
    ],
    look: ['Quan sát hình dáng buồng lái, kính phía trước và đôi càng trượt.', 'Đọc tên HU 1A và mốc Tân An trong biển giới thiệu, rồi đối chiếu với tư liệu về dòng HU-1/UH-1.'],
    labelText: 'Chiếc Trực thăng HU 1A của Mỹ\nĐại đội Bộ binh 509 tỉnh Trà Vinh bắn rơi trong trận đánh trực thăng vận ở Tân An ngày 19 tháng 5 năm 1964. Kết quả trận này, ta tiêu diệt và bắt sống hơn 200 tên địch, thu được nhiều vũ khí, phương tiện chiến tranh, bắn rơi 03 chiếc trực thăng và 01 chiếc khu trục.',
    references: [WAR_ARTIFACT_SOURCES[2]],
  },
];
