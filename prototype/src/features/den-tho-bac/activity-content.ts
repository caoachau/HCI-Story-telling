import opening from '../../assets/den-tho-bac/activities-user/opening.webp';
import birthday from '../../assets/den-tho-bac/activities-user/birthday.webp';
import remembrance from '../../assets/den-tho-bac/activities-user/remembrance.webp';
import visit from '../../assets/den-tho-bac/activities-user/visit.webp';
import openingOriginal from '../../assets/den-tho-bac/activities-user/opening-original.jpg';
import birthdayOriginal from '../../assets/den-tho-bac/activities-user/birthday-original.jpg';
import remembranceOriginal from '../../assets/den-tho-bac/activities-user/remembrance-original.jpg';
import visitOriginal from '../../assets/den-tho-bac/activities-user/visit-original.jpg';
import type { Photo, Story } from './content';

const credit = 'Ảnh do người dùng cung cấp';
export const ACTIVITY_PHOTOS: Record<string, Photo> = {
  'activity-opening': {src:opening,alt:'Ảnh tư liệu đền mái lá và đông người đứng trước sân đền',caption:'Ngôi đền xưa trong ảnh tư liệu được cung cấp; chưa xác minh thời điểm chụp.',credit,position:'50% 50%'},
  'activity-birthday': {src:birthday,alt:'Bàn thờ với chân dung Bác Hồ, hoa, nến và lư hương',caption:'Không gian dâng hương trong ảnh được cung cấp, minh họa cho hoạt động tưởng niệm.',credit,position:'50% 50%'},
  'activity-remembrance': {src:remembrance,alt:'Một người khách đứng trước tượng Bác Hồ và phù điêu hoa sen',caption:'Khách tham quan trước tượng Bác Hồ trong ảnh được cung cấp.',credit,position:'62% 50%'},
  'activity-visit': {src:visit,alt:'Hồ sen, lan can trắng, hoa và những hàng cây trong khuôn viên di tích',caption:'Một khoảng xanh bên hồ sen trong ảnh được cung cấp.',credit,position:'78% 50%'},
};

export const ACTIVITIES = [
  {id:'opening',tag:'DẤU MỐC KHÁNH THÀNH',title:'Nhớ ngày ngôi đền mở cửa',copy:'Tìm lại câu chuyện khánh thành đầu tiên vào Tết Tân Hợi năm 1971.',day:'26',month:'THÁNG 01',story:'activity-opening',detail:'Một nơi để tưởng nhớ',width:550,height:371},
  {id:'birthday',tag:'NGÀY SINH CHỦ TỊCH HỒ CHÍ MINH',title:'Dâng Bác những việc làm tốt',copy:'Hiểu thêm ý nghĩa hoạt động dâng hoa, dâng hương và báo công qua tư liệu đã ghi nhận.',day:'19',month:'THÁNG 05',story:'activity-birthday',detail:'Một dịp để học hỏi',width:2048,height:1536},
  {id:'remembrance',tag:'QUỐC KHÁNH & TƯỞNG NHỚ BÁC',title:'Lắng lại trong miền ký ức',copy:'Chọn một câu chuyện về lòng kính yêu và sự gắn bó của người dân với ngôi đền.',day:'02',month:'THÁNG 09',story:'activity-remembrance',detail:'Một khoảng để tri ân',width:800,height:656},
  {id:'visit',tag:'MỖI CHUYẾN GHÉ THĂM',title:'Ba điều bạn có thể bắt đầu',copy:'Đọc một dấu mốc. Quan sát một chi tiết. Mang theo một câu hỏi.',day:'03',month:'ĐIỀU ĐỂ NHỚ',story:'activity-visit',detail:'Một hành trình tự chọn',width:2048,height:1365},
] as const;

const suppliedPhoto = (url:string) => ({url,label:'Xem ảnh gốc được cung cấp',note:'Ảnh do người dùng cung cấp ngày 25/10/2026. Chưa có hồ sơ xác minh tác giả và thời điểm chụp; không gán ngày hoạt động trên giao diện cho ngày chụp ảnh.'});

// Reuse the established historical account and visitor prompts. These are
// commemorative occasions, never an invented programme of upcoming events.
export const ACTIVITY_STORIES: Story[] = [
  {id:'activity-opening',eyebrow:'Hoạt động · Dấu mốc 26/01',title:'Nhớ ngày ngôi đền mở cửa',lead:'Lễ khánh thành đầu tiên đánh dấu sự hiện diện của một không gian tưởng nhớ Bác tại Long Đức.',photo:'activity-opening',summary:['Ngày khánh thành đầu tiên là 26/1/1971.','Ngôi đền ban đầu có quy mô nhỏ, mái lá và khung gỗ.','Người dân đến viếng, gửi gắm lòng tưởng nhớ Chủ tịch Hồ Chí Minh.'],detail:'Từ hình ảnh mái lá và những người đứng trước sân đền, hãy nối điều quan sát được với câu chuyện chung tay dựng đền. Thời điểm chụp ảnh chưa được xác minh; không coi đây là ảnh của lễ khánh thành ngày 26/1/1971 chỉ từ tên tệp. Mốc trên giao diện gợi nhắc sự kiện lịch sử, không thay thế lịch tổ chức tại di tích.',question:'Điều gì khiến một nơi chốn nhỏ trở thành ký ức chung?',sources:['profile','tourism'],reference:suppliedPhoto(openingOriginal)},
  {id:'activity-birthday',eyebrow:'Hoạt động · Dịp 19/05',title:'Dâng Bác những việc làm tốt',lead:'Dâng hoa, dâng hương và báo công là những hoạt động đã được ghi nhận tại di tích.',photo:'activity-birthday',summary:['Lắng lại trong không gian tưởng niệm và tìm hiểu ý nghĩa của việc dâng hương.','Tư liệu Đại học Trà Vinh ghi nhận hoạt động báo công tháng 5/2023.','Một việc làm tốt có thể là cách nối điều đã học với cuộc sống hằng ngày.'],detail:'Báo công là dịp nhìn lại những việc đã làm và những điều muốn tiếp tục cố gắng. Bạn có thể đọc tư liệu hoạt động được giới thiệu trong phần nguồn, rồi tự chọn một điều muốn học hỏi từ chuyến tham quan. Ngày 19/05 trên giao diện là dịp gợi nhắc; lịch phục vụ và hoạt động thực tế cần hỏi nơi đón tiếp.',question:'Sau chuyến tham quan, bạn muốn bắt đầu từ việc làm tốt nào?',sources:['tvu','local'],reference:suppliedPhoto(birthdayOriginal)},
  {id:'activity-remembrance',eyebrow:'Hoạt động · Dịp 02/09',title:'Lắng lại trong miền ký ức',lead:'Một khoảng dừng để tưởng nhớ Bác và tìm hiểu tình cảm người dân dành cho ngôi đền.',photo:'activity-remembrance',summary:['Quan sát một hình ảnh, một hiện vật hoặc một chi tiết trong không gian tưởng niệm.','Đọc câu chuyện xây dựng và bảo vệ đền trong bối cảnh lịch sử của địa phương.','Tư liệu ghi nhận hoạt động dâng hương, dâng hoa và báo công tại di tích.'],detail:'Thử bắt đầu bằng một phút quan sát trước tượng Bác, sau đó chọn một câu chuyện về ngôi đền hoặc người từng gìn giữ nơi này. Mỗi tư liệu có thời điểm ghi nhận riêng. Ảnh khách tham quan là hình minh họa được cung cấp, không được xác nhận là ảnh một buổi lễ ngày 02/09.',question:'Chi tiết nào khiến bạn muốn lắng lại và tìm hiểu thêm?',sources:['cand','local'],reference:suppliedPhoto(remembranceOriginal)},
  {id:'activity-visit',eyebrow:'Hoạt động · Mỗi chuyến ghé thăm',title:'Ba điều bạn có thể bắt đầu',lead:'Đọc một dấu mốc. Quan sát một chi tiết. Mang theo một câu hỏi.',photo:'activity-visit',summary:['Chọn một dấu mốc trong phần Lịch sử và đọc điều chính cần nhớ.','Dừng ở một chi tiết mình thích: mái đền, hiện vật, một tán cây hoặc mặt hồ.','Đặt một câu hỏi để đọc sâu, hỏi người thuyết minh hoặc kể tiếp cho người cùng đi.'],detail:'Bạn có thể bắt đầu từ bất kỳ điểm nào trên sơ đồ tám điểm tham quan. Hãy dành thời gian đọc chú thích trước khi diễn giải một bức ảnh hoặc hiện vật. Trong khu di tích, mặc lịch sự, nói vừa đủ nghe, giữ vệ sinh và tôn trọng người đang tưởng niệm. Nếu đi theo đoàn hoặc tổ chức hoạt động chung, hỏi nơi đón tiếp về nội quy và lịch thực tế.',question:'Bạn muốn mang theo câu hỏi nào sau chuyến ghé thăm?',sources:['tourism','cand'],reference:suppliedPhoto(visitOriginal)},
];
