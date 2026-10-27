import boat from '../../assets/den-tho-bac/boat-user/boat-supplied.png';
import type { Photo } from './content';
import type { ReaderChapter } from './reader-content';

export const BOAT_SOURCES = [
  { name: 'Báo Cà Mau · Loan Phương', title: 'Trọn lòng yêu kính Bác', date: '13/09/2024', url: 'https://baocamau.vn/tron-long-yeu-kinh-bac-a34420.html', note: 'Bài viết có ảnh và chú thích xác định tiểu cảnh Bác Hồ trên thuyền độc mộc trong khuôn viên đền.' },
  { name: 'Báo Vĩnh Long', title: 'Về thăm Ðền thờ Bác Hồ ở Trà Vinh', date: '09/05/2018', url: 'https://baovinhlong.com.vn/nhip-song-dong-bang/201805/ve-tham-en-tho-bac-ho-o-tra-vinh-2892694/index.htm', note: 'Ghi nhận mô hình Bác Hồ với thuyền độc mộc là một hạng mục của khu di tích.' },
  { name: 'Bảo tàng Vĩnh Long', title: 'Thuyền độc mộc', date: '19/03/2026', url: 'https://baotangvinhlong.vn/hien-vat-tieu-bieu/thuyen-doc-moc-587180', note: 'Tham khảo cách chế tác và ý nghĩa của loại thuyền độc mộc. Hiện vật trong bài của bảo tàng là một chiếc thuyền khác, không phải tiểu cảnh tại đền.' },
] as const;

export const BOAT_PHOTO: Photo = {
  src: boat,
  alt: 'Tiểu cảnh Bác Hồ cầm sào đứng trên thuyền độc mộc, phía sau có một nhân vật khác, xung quanh là phông đá và cây xanh.',
  caption: 'Tiểu cảnh Bác Hồ trên thuyền độc mộc giữa không gian cây xanh của đền.',
  credit: 'Người dùng cung cấp',
};

export const BOAT_SUMMARY = [
  'Trong khuôn viên Đền thờ Bác Hồ có tiểu cảnh tái hiện hình tượng Bác trên thuyền độc mộc, được Báo Cà Mau giới thiệu năm 2024.',
  'Thuyền độc mộc là loại thuyền được đục từ một thân cây gỗ lớn nguyên khối, gắn với đời sống sông nước.',
  'Quan sát dáng người cầm sào, lòng thuyền và phông đá để cảm nhận cách tiểu cảnh kể chuyện bằng hình ảnh.',
];

export const BOAT_CHAPTERS: ReaderChapter[] = [
  {
    id: 'boat-scene', label: 'Tiểu cảnh tại đền', title: 'Bác Hồ trên thuyền độc mộc.', photo: BOAT_PHOTO,
    facts: [{ label: 'Hình thức trưng bày', value: 'Tiểu cảnh · Mô hình' }, { label: 'Không gian', value: 'Khuôn viên Đền thờ Bác Hồ' }],
    paragraphs: [
      'Giữa những tán cây, hình tượng Bác Hồ đứng cầm sào trên chiếc thuyền dài; phía sau là một nhân vật khác. Phông đá và cây xanh bao quanh đưa người xem vào khung cảnh của tiểu cảnh.',
      'Bài viết của Báo Cà Mau ngày 13/09/2024 giới thiệu hình ảnh này là tiểu cảnh Bác Hồ trên thuyền độc mộc trong khuôn viên đền. Trước đó, Báo Vĩnh Long năm 2018 cũng ghi nhận mô hình này trong các hạng mục của khu di tích.',
    ],
    references: [BOAT_SOURCES[0], BOAT_SOURCES[1]],
  },
  {
    id: 'boat-craft', label: 'Hiểu về độc mộc', title: 'Một thân gỗ, một con thuyền.', photo: BOAT_PHOTO,
    paragraphs: [
      'Theo Bảo tàng Vĩnh Long, thuyền độc mộc được chế tác bằng cách đục một thân cây gỗ lớn nguyên khối thành lòng thuyền. Người thợ cần kinh nghiệm để chọn gỗ và tạo dáng cho phương tiện đi lại trên sông nước.',
      'Loại thuyền này gợi nhắc kỹ thuật thủ công và sự gắn bó của con người với môi trường tự nhiên. Từ cách hiểu ấy, hãy nhìn lại lòng thuyền thuôn dài trong tiểu cảnh để nhận ra hình dáng của loại phương tiện được tái hiện.',
    ],
    lookLabel: 'Nhìn vào thân thuyền',
    look: ['Dõi theo đường viền từ mũi đến đuôi và khoảng rỗng bên trong.', 'Chú ý dáng thuyền liền khối mà mô hình thể hiện.'],
    references: [BOAT_SOURCES[2]],
  },
  {
    id: 'boat-observe', label: 'Cùng quan sát', title: 'Đọc tiểu cảnh từ mũi đến đuôi.', photo: BOAT_PHOTO,
    paragraphs: [
      'Bắt đầu từ nhân vật phía trước: chiếc mũ, tư thế đứng và cây sào là những chi tiết dễ nhận ra. Sau đó, đưa mắt theo thân thuyền đến nhân vật ở phía sau để cảm nhận chiều dài và chiều sâu của bố cục.',
      'Phông đá phía sau, hàng cây và đường viền đá cuội tạo nên bối cảnh cho hai nhân vật. Bạn có thể phóng ảnh để nhìn từng chi tiết, rồi thu lại toàn cảnh để thấy mối liên hệ giữa con người, chiếc thuyền và cảnh quan.',
    ],
    lookLabel: 'Ba điểm dừng cho ánh nhìn',
    look: ['Hình tượng Bác Hồ và tư thế cầm sào ở phía trước.', 'Lòng thuyền dài nối hai nhân vật trong cùng một bố cục.', 'Phông đá và cây xanh bao quanh tiểu cảnh.'],
  },
];
