import cycling from '../../../assets/con-chim/cycling-2025.webp';
import pond from '../../../assets/con-chim/community-pond.webp';
import meal from '../../../assets/con-chim/islet-meal.webp';
import arrival from '../../../assets/con-chim/village-visit.webp';
import archive from '../../../assets/con-chim/con-chim-2019.webp';
import aerial from '../../../assets/con-chim/islet-aerial.webp';
import fields from '../../../assets/con-chim/rice-fields.webp';
import cooking from '../../../assets/con-chim/cooking.webp';
import kitchen from '../../../assets/con-chim/village-kitchen.webp';
import riverPanorama from '../../../assets/con-chim/river-panorama.webp';
import { HERITAGE_SITES } from '../../../data/heritageSites';

export const site = HERITAGE_SITES.find(item => item.id === 'con-chim')!;
export const mapLink = `https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`;
export const sources = {
  opening: 'https://bvhttdl.gov.vn/ra-mat-diem-du-lich-cong-dong-dau-tien-tai-tra-vinh-20190910165212562.htm',
  award: 'https://www.sggp.org.vn/tra-vinh-du-lich-cong-dong-con-chim-duoc-nhan-giai-thuong-du-lich-asean-2025-post780369.html',
  village: 'https://baodongnai.com.vn/dong-nai-cuoi-tuan/202304/con-chim-oc-dao-xanh-giua-dong-co-chien-cua-tra-vinh-3164132/',
};
export interface Photo { id: string; title: string; image: string; category: string; caption: string; credit: string; source: string; position?: string; }
export const PHOTOS: Photo[] = [
  { id:'cycling', title:'Một vòng cồn, một trời xanh', image:cycling, category:'Thiên nhiên', caption:'Lối nhỏ đưa người và xe qua ruộng vườn, ao nước và những mái nhà dưới bóng dừa.', credit:'Báo Sài Gòn Giải Phóng', source:sources.award },
  { id:'pond', title:'Ngồi bên con nước', image:pond, category:'Thiên nhiên', caption:'Một góc không gian xanh và sinh hoạt cộng đồng trên Cồn Chim.', credit:'Báo Dân tộc và Phát triển', source:'https://dantoctongiao.baodantoc.vn/xay-dung-nong-thon-moi-o-tra-vinh-tao-be-do-cho-san-pham-du-lich-xanh-1733295277220.htm' },
  { id:'meal', title:'Bữa cơm người quê', image:meal, category:'Ẩm thực', caption:'Bên mâm cơm chung, câu chuyện của người dân cũng trở thành một phần chuyến đi.', credit:'Báo Người Lao Động', source:'https://nld.com.vn/du-lich-xanh/trai-nghiem-mien-tay-hoang-so-o-con-chim-20220218214201686.htm' },
  { id:'cooking', title:'Thử tay đổ bánh xèo', image:cooking, category:'Ẩm thực', caption:'Cùng người dân tìm hiểu món bánh dân gian và những hương vị của gian bếp quê.', credit:'Báo Đồng Nai', source:sources.village, position:'72% center' },
  { id:'arrival', title:'Người ở đây đón bạn', image:arrival, category:'Cộng đồng', caption:'Những nụ cười ở lối vào điểm du lịch cộng đồng Cồn Chim.', credit:'Báo Đồng Nai', source:sources.village },
  { id:'fields', title:'Mùa xanh trên cồn', image:fields, category:'Thiên nhiên', caption:'Ruộng lúa, hàng dừa và một khoảng nghỉ giữa chuyến khám phá.', credit:'Báo Nhà báo & Công luận', source:'https://congluan.vn/du-lich-thich-ung-bien-doi-khi-hau-o-con-chim-10200965.html' },
  { id:'kitchen', title:'Ghé một gian bếp nhỏ', image:kitchen, category:'Cộng đồng', caption:'Những quán quê và lối đi bên ao làm nên nét gần gũi của hành trình.', credit:'Báo Người Lao Động', source:'https://nld.com.vn/du-lich-xanh/hap-dan-mo-hinh-du-lich-cong-dong-con-chim-20220226155035652.htm' },
  { id:'aerial', title:'Cù lao giữa dòng Cổ Chiên', image:aerial, category:'Thiên nhiên', caption:'Góc nhìn từ trên cao về cồn, những ô ruộng và dòng sông bao quanh.', credit:'Hitour', source:'https://hitour.vn/tin-tuc-du-lich-tra-vinh/diem-den-tra-vinh/con-chim-tra-vinh' },
  { id:'archive', title:'Cồn Chim những ngày đầu', image:archive, category:'Cộng đồng', caption:'Du khách tìm hiểu mô hình canh tác trong năm điểm du lịch cộng đồng ra mắt.', credit:'Phúc Sơn / TTXVN', source:sources.opening },
];
export const HERO_BANNER: Photo = {
  id:'river-panorama', title:'Toàn cảnh Cồn Chim giữa dòng sông Cổ Chiên', image:riverPanorama,
  category:'Thiên nhiên', caption:'Cồn Chim với ruộng vườn, ao nước và dòng Cổ Chiên bao quanh.',
  credit:'Vietcharm Travel', source:'https://vietcharmtravel.com/products/tra-vinh-khu-du-lich-con-chim', position:'center 78%',
};
export const HERO_SCENES = [HERO_BANNER, PHOTOS[1], PHOTOS[2]];
export interface Chapter { id:string; title:string; intro:string; body:string; image:string; label:string; tags:string[]; action:string; tour:string; }
export const CHAPTERS: Chapter[] = [
  {id:'islet', title:'Một cù lao nhỏ. Một cách sống khác.', intro:'Giữa dòng Cổ Chiên, Cồn Chim giữ lại nhịp sống ruộng vườn và sự mến khách của người miền Tây.', body:'Đến đây, bạn bước chậm qua đường làng, ghé một mái nhà và lắng nghe những câu chuyện từ chính người sống trên cồn.', image:aerial, label:'Cồn & sông', tags:['Sông Cổ Chiên','Du lịch cộng đồng'], action:'Tìm Cồn Chim trên bản đồ', tour:'map'},
  {id:'nature', title:'Nương theo con nước, sống cùng đất trời.', intro:'Ruộng lúa và ao nuôi cùng tồn tại trong nhịp mùa mặn, ngọt. Người dân gọi cách làm ấy là sống thuận thiên.', body:'Một vòng xe qua lối nhỏ là cách gần gũi để quan sát sinh kế, cây cối và cuộc sống thường ngày trên cồn.', image:cycling, label:'Thuận thiên', tags:['Ruộng vườn','Đạp xe'], action:'Thêm một vòng xe vào chuyến đi', tour:'nature'},
  {id:'cuisine', title:'Hương bếp quê, vị của một cuộc gặp.', intro:'Có những điều về một vùng đất chỉ hiểu được khi ngồi xuống bên mâm cơm của người dân.', body:'Ghé gian bếp, tìm hiểu món bánh dân gian và thưởng thức bữa ăn theo mùa. Món ăn và hoạt động được sắp xếp cùng người đón khách.', image:cooking, label:'Bếp quê', tags:['Bánh dân gian','Bữa cơm chung'], action:'Lên lịch ghé bếp quê', tour:'cuisine'},
  {id:'people', title:'Đi để gặp người, ở lại trong một câu chuyện.', intro:'Người dân vừa là chủ nhà, vừa là người dẫn bạn qua những điều bình dị nhất của Cồn Chim.', body:'Ghé thăm với sự tôn trọng, mang theo bình nước riêng và cùng giữ đường làng sạch. Một chuyến đi nhỏ có thể để lại điều tốt đẹp.', image:arrival, label:'Con người', tags:['Mến khách','Giữ cồn xanh'], action:'Tạo chuyến đi của bạn', tour:'village'},
];
export interface TimelineMilestone { id:string; date:string; title:string; shortDesc:string; detailDesc:string; image:string; highlights:string[]; source?:string; }
export const MILESTONES: TimelineMilestone[] = [
  {id:'roots', date:'Theo mùa', title:'Từ nhịp sống thuận thiên', shortDesc:'Đất, nước và mùa vụ tạo nên cách sống trên cồn.', detailDesc:'Người dân nương theo điều kiện mặn, ngọt để canh tác lúa và nuôi thủy sản. Sinh kế bản địa là nền tảng cho trải nghiệm cộng đồng.', image:fields, highlights:['Tìm hiểu sinh kế','Quan sát ruộng vườn','Lắng nghe người dân']},
  {id:'trial', date:'05.2019', title:'Những vị khách đầu tiên', shortDesc:'Các chuyến thử nghiệm mở đường cho một cách làm du lịch cộng đồng.', detailDesc:'Tháng 5/2019, Cồn Chim thử nghiệm 15 tour, đón hơn 600 lượt khách. Những sinh hoạt vốn thân quen bắt đầu trở thành câu chuyện chia sẻ với du khách.', image:archive, highlights:['Thử nghiệm tour cộng đồng','Người dân cùng làm du lịch'], source:sources.opening},
  {id:'opening', date:'09.2019', title:'Cồn Chim mở lời chào', shortDesc:'Ngày 9/9/2019, điểm du lịch cộng đồng chính thức ra mắt.', detailDesc:'Cồn Chim bước vào hành trình đón khách với cảnh quan ruộng vườn, sinh kế bản địa và văn hóa của vùng quê Nam Bộ.', image:arrival, highlights:['Chính thức ra mắt','Trải nghiệm văn hóa bản địa'], source:sources.opening},
  {id:'award', date:'2025', title:'Một câu chuyện vươn xa', shortDesc:'Du lịch cộng đồng Cồn Chim được ghi nhận tại Giải thưởng Du lịch ASEAN.', detailDesc:'Giải thưởng Du lịch Cộng đồng ASEAN 2025 ghi nhận hành trình làm du lịch của Cồn Chim. Điều cốt lõi vẫn là người dân, sinh kế và môi trường sống.', image:cycling, highlights:['Du lịch cộng đồng ASEAN 2025','Tiếp tục giữ cồn xanh'], source:sources.award},
];
export interface Tour { id:string; title:string; desc:string; image:string; icon:'bike'|'leaf'|'food'; note:string; stops:{time:string;title:string;body:string}[]; }
export const TOURS: Tour[] = [
  {id:'village', title:'Một ngày về cồn', desc:'Gặp người dân, đi qua đường làng và ngồi lại bên bữa cơm quê.', image:pond, icon:'leaf', note:'Chậm rãi · Cùng gia đình', stops:[{time:'08:30',title:'Qua sông, đến cồn',body:'Gặp người đón khách tại bến đã hẹn.'},{time:'09:00',title:'Đi một vòng đường làng',body:'Ghé không gian cộng đồng và nghe câu chuyện về cồn.'},{time:'10:30',title:'Ghé một gian bếp quê',body:'Tìm hiểu món bánh dân gian theo lịch đón khách.'},{time:'12:00',title:'Bữa cơm bên người dân',body:'Thưởng thức món địa phương đã hẹn trước.'},{time:'14:00',title:'Mang theo một kỷ niệm',body:'Nghỉ chân, chụp ảnh và trở về bến.'}]},
  {id:'nature', title:'Theo những lối xanh', desc:'Đạp xe giữa bóng dừa, tìm hiểu ruộng vườn và cách sống thuận thiên.', image:cycling, icon:'bike', note:'Khám phá · Ngoài trời', stops:[{time:'08:30',title:'Đón gió sông Cổ Chiên',body:'Gặp người hướng dẫn ở bến đã thống nhất.'},{time:'09:00',title:'Đạp xe qua ruộng vườn',body:'Đi chậm trên đường làng, nhường lối cho người dân.'},{time:'10:00',title:'Nghe chuyện mùa mặn, ngọt',body:'Tìm hiểu cách canh tác lúa và nuôi thủy sản.'},{time:'11:30',title:'Nghỉ dưới bóng dừa',body:'Dùng bữa hoặc đồ uống theo lịch đã hẹn.'},{time:'13:00',title:'Trở về bến',body:'Thu gom đồ dùng và rác trước khi rời cồn.'}]},
  {id:'cuisine', title:'Hẹn nhau bên bếp quê', desc:'Thử tay làm bánh, nghe chuyện gian bếp và thưởng thức hương vị miền Tây.', image:cooking, icon:'food', note:'Gần gũi · Ẩm thực', stops:[{time:'09:00',title:'Lời chào của chủ nhà',body:'Ghé gian bếp đã hẹn với người đón khách.'},{time:'09:30',title:'Thử tay làm bánh',body:'Tham gia hoạt động phù hợp với lịch của hộ dân.'},{time:'11:00',title:'Nghe chuyện món quê',body:'Tìm hiểu nguyên liệu và món ăn theo mùa.'},{time:'12:00',title:'Ngồi lại bên mâm cơm',body:'Thưởng thức thực đơn đã thống nhất trước.'},{time:'13:30',title:'Một khoảng nghỉ bên sông',body:'Ghé đường làng và trở về bến.'}]},
];
export interface Petal { id:string;title:string;description:string;image:string;icon:'bike'|'food'|'leaf'|'waves'|'people'|'wheat';tour:string; }
export const HERO_PETALS: Petal[] = [
  {id:'cycling',title:'Đạp xe đường làng',description:'Theo lối nhỏ dưới bóng dừa, đi chậm và nhường đường cho sinh hoạt của người dân.',image:cycling,icon:'bike',tour:'nature'},
  {id:'river',title:'Nghe nhịp con nước',description:'Ngồi bên ao, nhìn dòng sông và nghe người dân kể về mùa mặn, mùa ngọt.',image:pond,icon:'waves',tour:'village'},
  {id:'cooking',title:'Ghé gian bếp quê',description:'Tìm hiểu món bánh dân gian. Hoạt động cụ thể được hẹn cùng hộ dân trước chuyến đi.',image:cooking,icon:'food',tour:'cuisine'},
  {id:'fields',title:'Chạm vào mùa xanh',description:'Quan sát ruộng vườn và cách người dân nương theo tự nhiên để làm ăn.',image:fields,icon:'wheat',tour:'nature'},
  {id:'people',title:'Gặp người ở cồn',description:'Mỗi mái nhà có một câu chuyện. Lắng nghe, hỏi chuyện và xin phép trước khi chụp ảnh.',image:arrival,icon:'people',tour:'village'},
  {id:'meal',title:'Ngồi lại bên mâm cơm',description:'Một bữa cơm quê theo mùa và một cuộc gặp thân tình với người đón khách.',image:meal,icon:'leaf',tour:'cuisine'},
];
