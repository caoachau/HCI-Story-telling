import { PHOTOS, sources, type Photo } from './conChimData';

export type Interest = 'food' | 'landscape' | 'local';
export interface StorySource { title: string; publisher: string; url: string; published: string; }
export interface DiscoveryStory {
  id: string; interest: Interest; place: string; title: string; question: string;
  teaser: string; summary: string[]; detail: string; takeaway: string;
  invitation: string; photo: Photo; source: StorySource; related: string;
}
export const REVIEWED_AT = '24/10/2026';
export const INTERESTS: { id: Interest; label: string; description: string }[] = [
  { id: 'food', label: 'Món ăn', description: 'Ghé bếp quê, nghe chuyện món ngon' },
  { id: 'landscape', label: 'Cảnh quan', description: 'Ngắm cồn xanh, hiểu nhịp con nước' },
  { id: 'local', label: 'Câu chuyện địa phương', description: 'Gặp người dân, tìm hiểu nếp sống' },
];
const village: StorySource = {
  title: 'Cồn Chim, ốc đảo xanh giữa dòng Cổ Chiên của Trà Vinh',
  publisher: 'Báo Đồng Nai', url: sources.village, published: '21/04/2023',
};
const roots: StorySource = {
  title: 'Ra mắt điểm du lịch cộng đồng đầu tiên tại Trà Vinh',
  publisher: 'Bộ Văn hóa, Thể thao và Du lịch', url: sources.opening, published: '10/09/2019',
};
const nature: StorySource = {
  title: 'Du lịch Trà Vinh: Thuận thiên để phát triển bền vững',
  publisher: 'Bộ Văn hóa, Thể thao và Du lịch',
  url: 'https://bvhttdl.gov.vn/du-lich-tra-vinh-thuan-thien-de-phat-trien-ben-vung-20220610085916221.htm', published: '13/06/2022',
};
const meal: StorySource = {
  title: 'Trải nghiệm miền Tây hoang sơ ở Cồn Chim', publisher: 'Báo Người Lao Động',
  url: PHOTOS[2].source, published: '19/02/2022',
};
export const DISCOVERY_STORIES: DiscoveryStory[] = [
  {
    id: 'banh-xeo', interest: 'food', place: 'Gian bếp quê', title: 'Chiếc bánh xèo kể chuyện gì?',
    question: 'Món bánh này gắn với đời sống trên cồn như thế nào?',
    teaser: 'Từ nguyên liệu quanh nhà đến cách người dân đón một vị khách.',
    summary: ['Bánh xèo là một món dân dã được người dân giới thiệu với khách.', 'Nguyên liệu địa phương nối gian bếp với công việc nuôi trồng.', 'Ghé bếp cũng là dịp gặp người làm ra món ăn.'],
    detail: 'Các hộ dân khai thác thế mạnh riêng để cùng làm du lịch. Một hộ giới thiệu bánh, hộ khác đón khách dùng cơm hoặc tổ chức trò chơi. Món ăn mở ra cuộc trò chuyện về người làm ra nó.',
    takeaway: 'Một món ngon là lối vào câu chuyện sinh kế của người dân.',
    invitation: 'Nếu ghé bếp, thử hỏi chủ nhà: hôm nay nguyên liệu nào có sẵn trên cồn?',
    photo: PHOTOS[3], source: village, related: 'mam-com',
  },
  {
    id: 'mam-com', interest: 'food', place: 'Bữa cơm nhà', title: 'Ngồi lại bên mâm cơm quê',
    question: 'Có thể hiểu một vùng đất qua bữa ăn của người ở đó không?',
    teaser: 'Bữa cơm không chỉ có hương vị, còn có cuộc gặp với chủ nhà.',
    summary: ['Món ăn dân dã là một phần trải nghiệm cộng đồng ở Cồn Chim.', 'Mâm cơm mang hương vị sông nước và nguyên liệu địa phương.', 'Ngồi ăn cùng nhau tạo dịp nghe chuyện đời sống trên cồn.'],
    detail: 'Bài ghi nhận của Báo Người Lao Động giới thiệu trải nghiệm miền Tây ở Cồn Chim, trong đó có bữa ăn quê. Thay vì chỉ tìm tên món, bạn có thể hỏi về nguyên liệu, cách nấu và món quen thuộc của gia đình.',
    takeaway: 'Bữa cơm giúp chuyến tham quan trở thành một cuộc gặp.',
    invitation: 'Món ăn thực tế tùy mùa và hộ đón khách; hãy hỏi người phụ trách trước khi ghé.',
    photo: PHOTOS[2], source: meal, related: 'nguoi-dan',
  },
  {
    id: 'ruong-ao', interest: 'landscape', place: 'Ruộng lúa & ao nuôi', title: 'Vì sao ruộng lúa ở cạnh ao nuôi?',
    question: 'Cảnh xanh trước mắt có liên quan gì đến con nước?',
    teaser: 'Đằng sau một góc chụp đẹp là cách người dân sống thuận thiên.',
    summary: ['Trồng lúa và nuôi thủy sản gắn với điều kiện nước mặn, ngọt.', 'Cách làm này được giới thiệu bằng hình ảnh “con tôm ôm cây lúa”.', 'Cảnh quan cũng là nơi người dân làm việc và sinh sống.'],
    detail: '“Thuận thiên” là thích ứng việc sản xuất với tự nhiên. Nhìn ruộng và ao cùng nhau, bạn sẽ thấy cảnh đẹp gắn với sinh kế.',
    takeaway: 'Cảnh quan của cồn được tạo nên cùng nhịp sống và sản xuất.',
    invitation: 'Chụp ảnh từ lối đi, tránh bước vào ruộng hoặc khu vực sản xuất của hộ dân.',
    photo: PHOTOS[5], source: nature, related: 'duong-lang',
  },
  {
    id: 'duong-lang', interest: 'landscape', place: 'Lối nhỏ trên cồn', title: 'Một vòng cồn, một nhịp sống',
    question: 'Đi chậm một chút, bạn sẽ nhìn thấy thêm điều gì?',
    teaser: 'Theo lối nhỏ qua bóng dừa, ruộng vườn và những mái nhà.',
    summary: ['Đường làng nối những không gian sinh hoạt trên cồn.', 'Đi bộ hoặc đạp xe giúp quan sát cảnh quan gần gũi.', 'Nhường lối là cách tôn trọng nhịp sống thường ngày của chủ nhà.'],
    detail: 'Khi ngắm cảnh, thử chú ý một lối đi chung hoặc người đang làm việc. Bạn sẽ tìm được một góc nhìn khác cho bức ảnh.',
    takeaway: 'Khám phá cảnh đẹp cũng là học cách ghé thăm một nơi có người đang sống.',
    invitation: 'Muốn chụp chân dung hoặc bước vào sân nhà, hãy xin phép trước.',
    photo: PHOTOS[0], source: nature, related: 'ruong-ao',
  },
  {
    id: 'nguoi-dan', interest: 'local', place: 'Những mái nhà đón khách', title: 'Người dân cũng là người kể chuyện',
    question: 'Điều gì thay đổi khi chính chủ nhà dẫn bạn khám phá?',
    teaser: 'Mỗi hộ góp một thế mạnh để cùng đón khách đến cồn.',
    summary: ['Du lịch cộng đồng được xây dựng từ đời sống của người dân.', 'Các hộ giới thiệu những trải nghiệm khác nhau.', 'Một cuộc trò chuyện giúp bạn nhìn xa hơn cảnh đẹp.'],
    detail: 'Người dân được tập huấn để xây dựng trải nghiệm phù hợp với tập quán và đời sống. Câu chuyện do chủ nhà kể giúp bạn hiểu điều họ muốn gìn giữ.',
    takeaway: 'Người địa phương là chủ thể của trải nghiệm văn hóa.',
    invitation: 'Thử hỏi: điều gì ở Cồn Chim mà cô, chú muốn khách hiểu hơn?',
    photo: PHOTOS[4], source: roots, related: 'ngay-dau',
  },
  {
    id: 'ngay-dau', interest: 'local', place: 'Câu chuyện của cồn', title: 'Từ nếp sống quê đến lời chào khách',
    question: 'Cồn Chim bắt đầu làm du lịch cộng đồng như thế nào?',
    teaser: 'Một dấu mốc ngắn để hiểu hành trình đón khách của cồn.',
    summary: ['Tháng 5/2019, Cồn Chim thử nghiệm các tour cộng đồng.', 'Ngày 9/9/2019, điểm du lịch cộng đồng chính thức ra mắt.', 'Đời sống, cảnh quan và sản xuất địa phương là nền tảng.'],
    detail: 'Quá trình khảo sát và tập huấn giúp chuyển những sinh hoạt quen thuộc thành trải nghiệm đón khách. Đời sống cộng đồng vẫn là nền tảng.',
    takeaway: 'Câu chuyện du lịch bắt đầu từ những điều vốn có của cồn.',
    invitation: 'Đây là tư liệu lịch sử năm 2019; hoạt động đón khách hiện tại cần hỏi người phụ trách.',
    photo: PHOTOS[8], source: roots, related: 'nguoi-dan',
  },
];
export const DOCUMENTARY = { title: 'Về Cồn Chim sống thuận thiên', publisher: 'VTV', published: '15/12/2024', url: 'https://vtv.vn/video/thuan-thien-710682.htm' };
