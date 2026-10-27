import lakeside from '../../assets/den-tho-bac/grounds-user/01-lakeside.jpg';
import walk from '../../assets/den-tho-bac/grounds-user/02-tree-lined-walk.jpg';
import shade from '../../assets/den-tho-bac/grounds-user/03-shaded-path.jpg';
import bamboo from '../../assets/den-tho-bac/grounds-user/04-bamboo.webp';
import building from '../../assets/den-tho-bac/grounds-user/05-building-reference.jpg';
import type { Photo } from './content';
import type { ReaderChapter } from './reader-content';

export const GROUNDS_SOURCES = [
  { name: 'Cổng thông tin tỉnh Vĩnh Long', title: 'Địa danh · Đền thờ Bác Hồ', date: 'Tài liệu giới thiệu điểm đến', url: 'https://vinhlong.gov.vn/du-khach-old/diadanh_test', note: 'Đối chiếu quy mô 5,4 ha của toàn khu di tích, các công trình, công viên, hồ sen, cây xanh và lũy tre.' },
  { name: 'Báo Nhân Dân', title: 'Đền thờ Bác Hồ ở Trà Vinh', date: '01/02/2008', url: 'https://nhandan.vn/den-tho-bac-ho-o-tra-vinh-post485616.html', note: 'Tư liệu về quá trình chọn địa điểm và dựng đền; bài viết nhắc đến nền đất cao có lũy tre bao bọc.' },
] as const;

const credit = 'Người dùng cung cấp';
export const GROUNDS_PHOTOS: Record<string, Photo> = {
  'grounds-lakeside': { src: lakeside, alt: 'Đường dạo ven mặt nước uốn theo lan can trắng, bên phải là thảm cỏ và những tán cây rộng.', caption: 'Đường dạo ven mặt nước dưới những tán cây trong khuôn viên.', credit },
  'grounds-walk': { src: walk, alt: 'Lối đi thẳng giữa hai hàng cây, dọc bên phải có ghế nghỉ và những hàng cây được cắt tỉa.', caption: 'Hàng cây, lối đi và ghế nghỉ tạo thành một khoảng dừng trong khuôn viên.', credit },
  'grounds-shade': { src: shade, alt: 'Một thân cây lớn với nhiều nhánh rễ bên cạnh đường dạo cong, thảm cỏ và cột đèn.', caption: 'Góc đường dạo dưới tán cây lớn, với những nhánh rễ nhìn rõ ở phía trước.', credit },
  'grounds-bamboo': { src: bamboo, alt: 'Những khóm tre cao mọc thành bụi trong khuôn viên cây xanh, bên dưới là thảm cỏ và khoảng đất dưới tán.', caption: 'Những khóm tre giữa không gian cây xanh của bộ ảnh khuôn viên.', credit },
  'grounds-building': { src: building, alt: 'Ảnh tham khảo một công trình mái ngói, cột gỗ và khoảng sân có cây xanh, chậu cảnh.', caption: 'Góc nhìn công trình và sân cây xanh trong bộ ảnh được cung cấp.', credit, displayWidth: 384 },
};

export const GROUNDS_SUMMARY = [
  'Khuôn viên kết nối các công trình bằng đường dạo, cây xanh và những khoảng mở bên mặt nước.',
  'Hàng cây, ghế nghỉ và tán lá tạo nên những điểm dừng giữa hành trình tham quan.',
  'Năm góc nhìn dẫn từ đường ven hồ, lối đi, tán cây lớn và khóm tre đến công trình trong cảnh quan.',
];

export const GROUNDS_CHAPTERS: ReaderChapter[] = [
  {
    id: 'grounds-lakeside', label: 'Đường dạo ven hồ', title: 'Mở đầu bằng một khoảng xanh bên mặt nước.', photo: GROUNDS_PHOTOS['grounds-lakeside'],
    facts: [{ label: 'Quy mô toàn khu di tích', value: '5,4 ha' }, { label: 'Góc nhìn', value: 'Cây xanh · Lối đi · Mặt nước' }],
    paragraphs: [
      'Ảnh mở đầu cho thấy đường dạo uốn theo mặt nước, lan can trắng và những tán cây rộng. Nhìn từ đây, có thể nhận ra cách cây xanh và khoảng mở bên hồ cùng tạo nên cảnh quan của khuôn viên.',
      'Tài liệu giới thiệu trên Cổng thông tin tỉnh Vĩnh Long ghi toàn khu di tích rộng 5,4 ha, có các công trình tưởng niệm, nhà trưng bày, cây xanh và mặt nước. Khuôn viên là phần cảnh quan nối các điểm dừng trong hành trình tham quan.',
    ],
    lookLabel: 'Dừng lại quan sát', look: ['Dõi theo đường cong của lan can và lối đi để thấy chiều sâu của cảnh quan.', 'So sánh khoảng trời, mặt nước và bóng tán cây trong cùng một khung ảnh.'],
    references: [GROUNDS_SOURCES[0]],
  },
  {
    id: 'grounds-walk', label: 'Lối đi & ghế nghỉ', title: 'Đi chậm giữa hai hàng cây.', photo: GROUNDS_PHOTOS['grounds-walk'],
    paragraphs: [
      'Hai hàng cây dẫn mắt theo lối đi thẳng; những chiếc ghế nằm sát bên đường. Cách sắp đặt này giúp người xem nhận biết một khoảng dạo bộ và nghỉ chân trong khuôn viên.',
      'Từ góc nhìn này, hãy để ý nhịp của thân cây, những dải cây thấp và khoảng nắng trên mặt đường. Đó là những chi tiết nhỏ làm cho hành trình giữa các công trình trở nên dễ cảm nhận hơn.',
    ],
    lookLabel: 'Dừng lại quan sát', look: ['Nhìn cách ghế nghỉ được đặt dọc lối đi và cạnh khoảng xanh.', 'Tìm điểm xa cuối hàng cây để cảm nhận chiều sâu của con đường.'],
  },
  {
    id: 'grounds-shade', label: 'Dưới tán cây lớn', title: 'Một góc đường dạo được tán lá ôm lấy.', photo: GROUNDS_PHOTOS['grounds-shade'],
    paragraphs: [
      'Thân cây và những nhánh rễ chiếm phần gần của ảnh; phía sau là đường dạo cong, thảm cỏ và cột đèn. Góc chụp dọc làm nổi bật mối liên hệ giữa một cây lớn với khoảng đi bộ bên dưới.',
      'Bạn có thể bắt đầu nhìn từ gốc cây, lần theo các nhánh lên tán lá, rồi trở lại lối đi ở phía xa. Cùng với ảnh ven hồ, góc nhìn này cho thấy khuôn viên có cả khoảng mở và những đoạn đường được che bởi bóng cây.',
    ],
    lookLabel: 'Dừng lại quan sát', look: ['Quan sát đường nét của thân cây, rễ và các lớp lá phía trên.', 'So sánh lối đi cong trong ảnh này với đường thẳng ở góc nhìn trước.'],
  },
  {
    id: 'grounds-bamboo', label: 'Những khóm tre', title: 'Giữ lại một nét gần gũi của làng quê.', photo: GROUNDS_PHOTOS['grounds-bamboo'],
    paragraphs: [
      'Những khóm tre mọc thành bụi, đan thân và tán lá vào các lớp cây xung quanh. Khoảng cỏ, đất dưới tán và ánh sáng xuyên qua lá tạo nên một góc nhìn khác với đường dạo ven hồ.',
      'Trong bài viết về lịch sử dựng đền, Báo Nhân Dân nhắc đến địa điểm được chọn trên nền đất cao có lũy tre bao bọc. Tư liệu ấy thêm bối cảnh cho hình ảnh tre trong cảnh quan và mối liên hệ giữa ngôi đền với không gian làng quê.',
    ],
    lookLabel: 'Dừng lại quan sát', look: ['Nhìn từ chân bụi tre lên các thân và tán lá để nhận ra nhiều tầng xanh.', 'Tìm các khoảng sáng, khoảng trống và lối nhìn xuyên giữa những khóm tre.'],
    references: [GROUNDS_SOURCES[1]],
  },
  {
    id: 'grounds-building', label: 'Công trình & cảnh quan', title: 'Nhìn công trình cùng khoảng sân quanh nó.', photo: GROUNDS_PHOTOS['grounds-building'],
    paragraphs: [
      'Góc ảnh nhỏ trong bộ ảnh đặt công trình cạnh khoảng sân, cây xanh và chậu cảnh. Ảnh bổ sung cách nhìn kiến trúc trong mối liên hệ với không gian bên ngoài, thay vì chỉ chú ý riêng phần mái hay mặt đứng.',
      'Khép lại năm góc nhìn, thử nhớ lại đường dạo, ghế nghỉ, mặt nước, tán cây và khóm tre. Những thành phần ấy giúp bạn hình dung khuôn viên như một phần của trải nghiệm tham quan, nơi có thể đi chậm và nhìn lại cảnh quan giữa các điểm dừng.',
    ],
    lookLabel: 'Dừng lại quan sát', look: ['Đặt mái, cột và khoảng sân vào cùng một góc nhìn.', 'Chọn một trong năm ảnh để quay lại quan sát kỹ hơn trước khi tiếp tục hành trình.'],
  },
];
