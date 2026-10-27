import canopy from '../../assets/den-tho-bac/spaces-researched/temple-canopy.jpg';
import temple from '../../assets/den-tho-bac/spaces-researched/temple-front.jpg';
import altar from '../../assets/den-tho-bac/spaces-researched/temple-altar.jpg';
import pond from '../../assets/den-tho-bac/spaces-researched/pond-waterside.jpg';
import stiltFront from '../../assets/den-tho-bac/spaces-researched/stilt-front.jpg';
import stiltSide from '../../assets/den-tho-bac/spaces-researched/stilt-side.jpg';
import entrance from '../../assets/den-tho-bac/spaces-researched/entrance-context.jpg';
import aerial from '../../assets/den-tho-bac/spaces-researched/aerial-context.jpg';
import siteMap from '../../assets/den-tho-bac/map-current-v2.webp';
import coordinates from '../../assets/den-tho-bac/map-current-coordinates.json';
import type { Photo } from './content';
import type { ReaderChapter } from './reader-content';

const sources = {
  justice: { name: 'Báo Công lý', title: 'Đền thờ Bác Hồ: Biểu tượng tấm lòng trung kiên của đồng bào tỉnh Trà Vinh', date: '14/05/2023', url: 'https://congly.vn/den-tho-bac-ho-bieu-tuong-tam-long-trung-kien-cua-dong-bao-tinh-tra-vinh-378335.html', note: 'Ảnh có chú thích riêng cho nhà bao che, ngôi đền, bàn thờ, hồ và phiên bản nhà sàn tại Trà Vinh.' },
  inauguration: { name: 'Báo Nhân Dân', title: 'Chủ tịch Quốc hội dâng hương Đền thờ Bác Hồ và Nghĩa trang liệt sĩ tỉnh Trà Vinh', date: '29/04/2022', url: 'https://nhandan.vn/chu-tich-quoc-hoi-dang-huong-den-tho-bac-ho-va-nghia-trang-liet-si-tinh-tra-vinh-post695210.html', note: 'Đối chiếu việc dựng đền trong chiến tranh và khánh thành ngày 26/01/1971.' },
  local: { name: 'Báo Trà Vinh', title: 'Điểm đến của vùng đất Trà Vinh', date: '13/05/2023', url: 'https://travinh.baovinhlong.vn/xa-hoi/diem-den-cua-vung-dat-tra-vinh-28682.html', note: 'Giới thiệu nhà đón tiếp cùng các không gian tham quan trong khu di tích. Không cung cấp giờ phục vụ hoặc danh mục dịch vụ hiện hành.' },
  restoration: { name: 'Báo Thanh Niên · Hoàng Vũ', title: 'Trà Vinh khánh thành công trình tu bổ Khu di tích lịch sử Đền thờ Bác Hồ', date: '18/04/2022', url: 'https://thanhnien.vn/tra-vinh-khanh-thanh-cong-trinh-tu-bo-khu-di-tich-lich-su-den-tho-bac-ho-1851449836.htm', note: 'Tư liệu về đợt tu bổ, trong đó có cải tạo ao sen, sân vườn, cổng và hệ thống chiếu sáng.' },
  stilt: { name: 'Báo Nhân Dân · Nguyễn Văn Khởi', title: 'Đền thờ Bác Hồ, niềm tự hào của người dân Trà Vinh', date: '27/01/2025', url: 'https://nhandan.vn/den-tho-bac-ho-niem-tu-hao-cua-nguoi-dan-tra-vinh-post857901.html', note: 'Xác nhận phiên bản nhà sàn tại khu di tích Trà Vinh và thông tin tái hiện 97% so với nguyên bản ở Hà Nội.' },
  photoEssay: { name: 'Pháp Luật TP.HCM', title: 'Đền thờ Bác Hồ tại Trà Vinh: Biểu tượng lòng biết ơn của miền Nam', date: '30/01/2025', url: 'https://tuoitre.vn/plo/den-tho-bac-ho-tai-tra-vinh-bieu-tuong-long-biet-on-cua-mien-nam-post830292.html', note: 'Bài ảnh của Tuệ Anh – Quốc Vũ – Huỳnh Du; đối chiếu ảnh cổng, ảnh từ trên cao và góc nghiêng nhà sàn. Cổng và ảnh toàn khu chỉ dùng làm bối cảnh cho điểm đón tiếp.' },
} as const;

function mapMarker(code: string): NonNullable<Photo['marker']> {
  const point = coordinates.points.find(item => item.code === code)!;
  return { code, label: point.name, x: point.percent[0], y: point.percent[1], imageWidth: coordinates.size[0], imageHeight: coordinates.size[1] };
}

export const REMAINING_SPACE_PHOTOS: Record<string, Photo> = {
  'space-temple-canopy': { src: canopy, alt: 'Lối đi có hai hàng cây dẫn tới nhà bao che Đền thờ Bác Hồ ở Trà Vinh.', caption: 'Lối vào nhà bao che; ngôi đền nhỏ được gìn giữ bên trong.', credit: 'Báo Công lý · 14/05/2023', creditUrl: sources.justice.url },
  'space-temple-front': { src: temple, alt: 'Mặt trước ngôi đền nhỏ với cửa tôn xanh và biển Đền thờ Chủ tịch Hồ Chí Minh.', caption: 'Ngôi đền được phục dựng bên trong nhà bao che.', credit: 'Báo Công lý · 14/05/2023', creditUrl: sources.justice.url },
  'space-temple-altar': { src: altar, alt: 'Bàn thờ trong ngôi đền nhỏ, với chân dung Bác Hồ, hoa và đồ thờ.', caption: 'Bàn thờ Bác Hồ bên trong ngôi đền.', credit: 'Báo Công lý · 14/05/2023', creditUrl: sources.justice.url },
  'space-stilt-front': { src: stiltFront, alt: 'Mặt trước phiên bản nhà sàn tại Trà Vinh, với bậc lên, cột gỗ, lan can và cây cảnh.', caption: 'Mặt trước phiên bản nhà sàn Bác Hồ tại Trà Vinh.', credit: 'Báo Công lý · 14/05/2023', creditUrl: sources.justice.url },
  'space-stilt-side': { src: stiltSide, alt: 'Góc nghiêng nhà sàn trong khu di tích Trà Vinh cho thấy cầu thang, hàng hiên và khoảng gầm sàn.', caption: 'Cầu thang và hàng hiên nhìn từ bên hông phiên bản nhà sàn.', credit: 'Tuệ Anh – Quốc Vũ – Huỳnh Du / Pháp Luật TP.HCM', creditUrl: sources.photoEssay.url },
  'space-pond-waterside': { src: pond, alt: 'Mặt hồ trong khu di tích với cụm lá sen, lan can trắng, lối đi và cây xanh quanh bờ.', caption: 'Mặt hồ và đường dạo trong khu di tích tại Trà Vinh.', credit: 'Báo Công lý · 14/05/2023', creditUrl: sources.justice.url },
  'space-entrance-context': { src: entrance, alt: 'Cổng Đền thờ Chủ tịch Hồ Chí Minh tại Trà Vinh, dùng làm ảnh bối cảnh chuẩn bị tham quan.', caption: 'Cổng khu di tích · Ảnh bối cảnh, không phải ảnh nhà đón tiếp.', credit: 'Tuệ Anh – Quốc Vũ – Huỳnh Du / Pháp Luật TP.HCM', creditUrl: sources.photoEssay.url },
  'space-aerial-context': { src: aerial, alt: 'Ảnh từ trên cao nhìn thấy nhà bao che, nhà trưng bày, lối đi và cây xanh tại khu di tích Trà Vinh.', caption: 'Các công trình giữa cây xanh · Ảnh bối cảnh toàn khu di tích.', credit: 'Tuệ Anh – Quốc Vũ – Huỳnh Du / Pháp Luật TP.HCM', creditUrl: sources.photoEssay.url },
  'space-reception-location': { src: siteMap, alt: 'Sơ đồ ảnh toàn khu di tích với vị trí nhà đón tiếp khách được đánh dấu 03.', caption: 'Vị trí 03 – Nhà đón tiếp khách, theo sơ đồ được cung cấp.', credit: 'Sơ đồ do người dùng cung cấp · 26/10/2026', marker: mapMarker('03') },
  'space-pond-location': { src: siteMap, alt: 'Ảnh toàn khu di tích có đánh dấu 08 tại hồ sen, cho thấy đường bờ và các lối đi.', caption: 'Vị trí 08 – Hồ sen trong tổng thể khu di tích.', credit: 'Sơ đồ do người dùng cung cấp · 26/10/2026', marker: mapMarker('08') },
};

const templeChapters: ReaderChapter[] = [
  {
    id: 'temple-canopy', label: 'Từ lối vào', title: 'Ngôi đền nhỏ dưới mái che lớn.', photo: REMAINING_SPACE_PHOTOS['space-temple-canopy'],
    paragraphs: [
      'Hai hàng cây và những chậu cảnh dẫn mắt về công trình cuối lối đi. Phần mái lớn mà bạn nhìn thấy là nhà bao che; ngôi đền nhỏ nằm bên trong.',
      'Tư liệu của Báo Công lý cho biết mái bao che lấy hình dáng đóa sen cách điệu. Bên dưới, ngôi đền được phục dựng với quy mô 4 × 4 m, giữ dáng vẻ đơn sơ của công trình thuở đầu.',
    ],
    lookLabel: 'Nhận ra hai lớp công trình', look: ['Quan sát phần mái bao che ở cuối trục đường.', 'Đến ảnh tiếp theo để nhìn ngôi đền nhỏ bên trong.'], references: [sources.justice],
  },
  {
    id: 'temple-history', label: 'Ngôi đền được gìn giữ', title: 'Một nơi thờ Bác được dựng bằng lòng dân.', photo: REMAINING_SPACE_PHOTOS['space-temple-front'],
    facts: [{ label: 'Khởi công', value: '10/03/1970' }, { label: 'Khánh thành lần đầu', value: '26/01/1971' }],
    paragraphs: [
      'Đảng bộ, quân và dân Long Đức dựng đền trong điều kiện chiến tranh, chủ yếu thi công vào ban đêm. Ngày 26/01/1971, ngôi đền được khánh thành sau gần mười một tháng xây dựng.',
      'Ảnh mặt trước giúp nhìn rõ quy mô nhỏ của ngôi đền: khung cửa, những tấm tôn xanh và biển tên phía trên. Đặt ảnh này cạnh góc nhìn bên ngoài để hiểu vì sao công trình tưởng niệm cần một lớp bao che bảo vệ.',
    ], references: [sources.inauguration, sources.justice],
  },
  {
    id: 'temple-altar', label: 'Bên trong ngôi đền', title: 'Dừng lại trước chân dung Bác.', photo: REMAINING_SPACE_PHOTOS['space-temple-altar'],
    paragraphs: [
      'Bên trong là bàn thờ với chân dung Bác Hồ, hoa và đồ thờ. Góc chụp gần đưa người xem từ kiến trúc bên ngoài đến không gian tưởng niệm ở giữa ngôi đền.',
      'Hãy quan sát cách chân dung được đặt ở trung tâm và các đồ thờ bố trí phía trước. Đây là bàn thờ trong ngôi đền nhỏ; không gian tượng Bác ngồi trước phù điêu hoa sen thuộc phần nhà trưng bày khác trong khu di tích.',
    ], lookLabel: 'Nhìn trong không gian tưởng niệm', look: ['Tìm chân dung ở trục giữa bàn thờ.', 'Phóng ảnh để quan sát chi tiết, rồi thu lại toàn cảnh để thấy cách sắp đặt.'], references: [sources.justice],
  },
];

const receptionChapters: ReaderChapter[] = [
  {
    id: 'reception-location', label: 'Định vị điểm 03', title: 'Một điểm bắt đầu cho chuyến thăm.', photo: REMAINING_SPACE_PHOTOS['space-reception-location'],
    paragraphs: [
      'Nhà đón tiếp khách được đánh dấu 03 trên sơ đồ đang sử dụng. Dấu tròn trên ảnh giúp bạn nhận biết vị trí trong tổng thể các công trình trước khi chọn hành trình tham quan.',
      'Bài giới thiệu của Báo Trà Vinh nhắc đến nhà đón tiếp cùng hồ, công viên và các điểm tham quan của khu di tích. Khi đến nơi, bạn có thể hỏi thêm về việc giới thiệu di tích và cách sắp xếp chuyến thăm của mình.',
    ], lookLabel: 'Xác định trên ảnh', look: ['Tìm vòng tròn 03 và đối chiếu với các công trình xung quanh.', 'Dùng ảnh toàn cảnh để định hướng, rồi làm theo biển chỉ dẫn tại di tích.'], references: [sources.local],
  },
  {
    id: 'reception-prepare', label: 'Trước khi vào tham quan', title: 'Chuẩn bị những điều bạn muốn tìm hiểu.', photo: REMAINING_SPACE_PHOTOS['space-entrance-context'],
    paragraphs: [
      'Ảnh cổng giúp nhận diện khu di tích Đền thờ Chủ tịch Hồ Chí Minh tại Trà Vinh. Đây là ảnh bối cảnh lối vào, được đặt cạnh phần chuẩn bị chuyến thăm.',
      'Trước khi đi cùng đoàn, hãy hỏi nơi đón tiếp về thời gian tham quan, nội dung thuyết minh và điểm tập trung. Nếu muốn đọc kỹ tư liệu hoặc xem hiện vật, bạn có thể nêu trước chủ đề mình quan tâm.',
    ], lookLabel: 'Ba câu hỏi để bắt đầu', look: ['Hôm nay có thể nghe giới thiệu di tích ở đâu?', 'Nên ghé những điểm nào với thời gian mình có?', 'Đoàn cần tập trung và di chuyển theo hướng nào?'], references: [sources.photoEssay],
  },
  {
    id: 'reception-itinerary', label: 'Chọn hành trình', title: 'Từ một điểm dừng, mở ra nhiều câu chuyện.', photo: REMAINING_SPACE_PHOTOS['space-aerial-context'],
    paragraphs: [
      'Ảnh từ trên cao cho thấy các công trình được nối bằng lối đi giữa những tán cây. Bạn có thể bắt đầu với ngôi đền, tiếp tục đến nhà trưng bày, rồi dành thời gian cho nhà sàn và cảnh quan bên hồ.',
      'Báo Thanh Niên ghi nhận đợt tu bổ khánh thành ngày 18/04/2022 có các hạng mục sân vườn, ao sen, cổng và chiếu sáng. Đó là một phần quá trình chăm sóc không gian đón khách của khu di tích.',
    ], references: [sources.restoration, sources.photoEssay],
  },
];

const stiltChapters: ReaderChapter[] = [
  {
    id: 'stilt-replica', label: 'Phiên bản tại Trà Vinh', title: 'Nhà sàn của Bác được tái hiện ở miền Nam.', photo: REMAINING_SPACE_PHOTOS['space-stilt-front'],
    facts: [{ label: 'Địa điểm trong bộ ảnh', value: 'Khu di tích tại Trà Vinh' }, { label: 'Phiên bản được dựng', value: 'Năm 2012' }],
    paragraphs: [
      'Công trình trong ảnh là phiên bản nhà sàn được dựng tại khu di tích Trà Vinh năm 2012. Báo Nhân Dân giới thiệu mức độ tái hiện 97% so với nguyên bản nhà sàn Bác Hồ tại Hà Nội.',
      'Từ phía trước, bạn có thể nhìn bậc lên, hàng cột, lan can và khoảng trống bên dưới sàn. Cây cảnh và hàng hoa làm nổi bật dáng nhà giữa khuôn viên.',
    ], lookLabel: 'Nhận biết công trình', look: ['So sánh phần gầm sàn thoáng với tầng nhà phía trên.', 'Dõi theo hàng cột và lan can từ trái sang phải.'], references: [sources.stilt, sources.justice],
  },
  {
    id: 'stilt-architecture', label: 'Góc nhìn bên hông', title: 'Cầu thang, hàng hiên và khoảng gầm sàn.', photo: REMAINING_SPACE_PHOTOS['space-stilt-side'],
    paragraphs: [
      'Góc chụp bên hông làm rõ cầu thang nối hai tầng, mái nhô ra và hàng hiên quanh phía trước. Cách nhìn này bổ sung chiều sâu mà ảnh chính diện khó thể hiện hết.',
      'Hãy quan sát các đường ngang của mái, lan can và mặt sàn đối chiếu với những cột đứng. Hai góc chụp giúp hình dung cấu trúc của phiên bản tại Trà Vinh; đây không phải ảnh ngôi nhà nguyên bản ở Phủ Chủ tịch.',
    ], lookLabel: 'Nhìn từ hai góc', look: ['Tìm vị trí cầu thang trong ảnh nghiêng rồi đối chiếu ảnh mặt trước.', 'Quan sát khoảng gầm sàn, hàng hiên và cách mái che phủ công trình.'], references: [sources.photoEssay, sources.stilt],
  },
];

const pondChapters: ReaderChapter[] = [
  {
    id: 'pond-waterside', label: 'Nhìn từ bờ hồ', title: 'Một khoảng nước mở giữa những tán cây.', photo: REMAINING_SPACE_PHOTOS['space-pond-waterside'],
    paragraphs: [
      'Ảnh chụp từ bờ cho thấy mặt nước, những cụm lá sen và lan can trắng chạy theo lối dạo. Các tán cây phía xa tạo thành một lớp nền bao quanh khoảng mở của hồ.',
      'Hồ sen nằm trong cảnh quan công viên của khu di tích. Bài viết về đợt tu bổ năm 2022 của Báo Thanh Niên cũng ghi nhận hạng mục cải tạo ao sen, cho thấy cảnh quan này được chăm sóc cùng các công trình khác.',
    ], lookLabel: 'Dừng lại bên mặt nước', look: ['Tìm các cụm lá trên mặt hồ và bóng cây phía bờ đối diện.', 'Quan sát đường lan can để nhận ra hướng của lối đi.'], references: [sources.justice, sources.restoration],
  },
  {
    id: 'pond-layout', label: 'Nhìn trong tổng thể', title: 'Mặt hồ kết nối những khoảng xanh.', photo: REMAINING_SPACE_PHOTOS['space-pond-location'],
    paragraphs: [
      'Từ trên cao, đường bờ uốn cong và những nhánh lối đi hiện ra rõ hơn. Mốc 08 chỉ vị trí hồ sen trên sơ đồ ảnh đang dùng; các công trình và tán cây xung quanh giúp định hướng trong khu di tích.',
      'Đối chiếu hai góc nhìn: ảnh từ bờ giúp cảm nhận không gian gần, còn ảnh từ trên cao cho thấy hình dáng mặt hồ và sự liên hệ với khuôn viên. Những cụm lá nhìn thấy trong ảnh không đồng nghĩa với việc hoa sẽ nở vào mọi thời điểm.',
    ], lookLabel: 'Kết nối hai góc nhìn', look: ['Theo đường cong của bờ và các lối đi sát hồ.', 'Tìm lại hàng cây và lan can trong ảnh chụp từ mặt đất.'],
  },
];

interface SpaceDetail {
  chapters: ReaderChapter[];
  lead: string;
  summary: string[];
  sources: readonly { name: string; title: string; date: string; url: string; note: string }[];
  sourceNote: string;
}

export const REMAINING_SPACE_DETAILS: Record<string, SpaceDetail> = {
  'map-temple': {
    chapters: templeChapters, lead: 'Từ lối vào nhà bao che đến ngôi đền nhỏ và bàn thờ bên trong: ba góc nhìn để hiểu nơi tưởng niệm được người dân Long Đức gìn giữ.',
    summary: ['Nhà bao che lấy dáng đóa sen, bên trong gìn giữ ngôi đền nhỏ được phục dựng.', 'Ngôi đền được khởi công ngày 10/03/1970 và khánh thành lần đầu ngày 26/01/1971.', 'Ba ảnh đi từ trục lối vào đến mặt trước ngôi đền và bàn thờ Bác Hồ.'],
    sources: [sources.justice, sources.inauguration], sourceNote: 'Ba ảnh báo chí chụp tại khu di tích Trà Vinh. Phân biệt nhà bao che, ngôi đền nhỏ và bàn thờ bên trong; không thay ảnh bàn thờ bằng tượng Bác ở nhà trưng bày. Các ảnh phản ánh thời điểm đăng của nguồn, không phải ảnh nguyên gốc thời chiến.',
  },
  'map-reception': {
    chapters: receptionChapters, lead: 'Định vị nhà đón tiếp trên sơ đồ, chuẩn bị câu hỏi và chọn hành trình qua những công trình trong khu di tích.',
    summary: ['Mốc 03 xác định nhà đón tiếp khách trên sơ đồ được cung cấp.', 'Trước chuyến thăm, có thể hỏi nơi đón tiếp về thuyết minh, thời gian và điểm tập trung của đoàn.', 'Ảnh cổng và ảnh toàn khu được dùng làm bối cảnh cho việc chuẩn bị hành trình.'],
    sources: [sources.local, sources.restoration, sources.photoEssay], sourceNote: 'Chưa tìm được ảnh cận cảnh nhà đón tiếp có chú thích đủ để xác minh. Vì vậy, phần này dùng sơ đồ định vị đúng mốc 03; ảnh cổng và ảnh từ trên cao đều ghi rõ là bối cảnh. Câu hỏi tham quan là gợi ý biên soạn, không phải cam kết về dịch vụ hoặc giờ mở cửa hiện hành.',
  },
  'map-stilt-house': {
    chapters: stiltChapters, lead: 'Hai góc chụp rõ mặt trước và bên hông của phiên bản nhà sàn tại Trà Vinh, giúp quan sát cầu thang, hàng hiên và khoảng gầm sàn.',
    summary: ['Phiên bản nhà sàn được dựng trong khu di tích Trà Vinh năm 2012.', 'Báo Nhân Dân giới thiệu mức độ tái hiện 97% so với nguyên bản ở Hà Nội.', 'Hai góc nhìn làm rõ bậc lên, cột, cầu thang, hàng hiên và gầm sàn.'],
    sources: [sources.justice, sources.stilt, sources.photoEssay], sourceNote: 'Cả hai ảnh đều có chú thích nguồn xác định nhà sàn tại khu di tích Trà Vinh. Không dùng ảnh nguyên bản ở Hà Nội hoặc nhà sàn tại Cà Mau. Sử dụng mốc năm 2012; không khẳng định ngày khánh thành cụ thể khi các tài liệu ghi khác nhau.',
  },
  'map-pond': {
    chapters: pondChapters, lead: 'Nhìn hồ từ đường dạo rồi chuyển lên góc toàn cảnh để hiểu mặt nước, đường bờ và những khoảng xanh trong khu di tích.',
    summary: ['Hồ sen là một phần cảnh quan công viên trong khu di tích.', 'Ảnh chụp từ bờ cho thấy mặt nước, cụm lá sen, lan can và hàng cây.', 'Sơ đồ đánh dấu 08 giúp nhìn đường bờ và liên hệ với những lối đi xung quanh.'],
    sources: [sources.justice, sources.restoration], sourceNote: 'Ảnh bờ hồ lấy từ bài báo chụp tại đúng khu di tích Trà Vinh; góc từ trên cao dùng ảnh/sơ đồ đã được người dùng cung cấp. Không thay bằng ảnh sen ở hồ khác, không suy đoán độ sâu, kích thước hoặc lịch nở hoa.',
  },
};
