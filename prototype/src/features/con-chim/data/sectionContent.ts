import { MILESTONES, PHOTOS } from './conChimData';
import { DISCOVERY_STORIES } from './kt01Stories';
import type { ReaderMode, StoryContext } from '../utils/storyLinks';

export const CONTENT_SECTIONS = [
  { id:'overview', label:'Tổng quan', short:'Tổng quan' },
  { id:'explore', label:'Điểm khám phá', short:'Khám phá' },
  { id:'history', label:'Chuyện của cồn', short:'Chuyện của cồn' },
  { id:'community', label:'Đời sống & con người', short:'Con người' },
  { id:'experiences', label:'Trải nghiệm', short:'Trải nghiệm' },
] as const;
export type ContentSection = typeof CONTENT_SECTIONS[number]['id'];
export type ConChimView = 'home' | ContentSection;
export type OpenStory = (id:string,mode?:ReaderMode,context?:StoryContext)=>void;

const storyById = (id:string)=>DISCOVERY_STORIES.find(story=>story.id===id)!;
// Reuse the already sourced milestones. The seasonal starting point is not
// presented as a dated event, and the 2025 award is outside this short timeline.
export const HISTORY_STOPS = MILESTONES.slice(0,3).map((milestone,index)=>({
  ...milestone,
  detailDesc:index===1?'Tháng 5/2019, Cồn Chim thử nghiệm các tour cộng đồng. Quá trình khảo sát và tập huấn giúp chuyển những sinh hoạt quen thuộc thành trải nghiệm đón khách.':milestone.detailDesc,
  photo:PHOTOS.find(photo=>photo.image===milestone.image)!,
  storyId:index===0?'ruong-ao':'ngay-dau',
  source:storyById(index===0?'ruong-ao':'ngay-dau').source,
  kind:index===0?'Bối cảnh sinh kế':'Mốc lịch sử được ghi nhận',
}));
export const COMMUNITY_TOPICS = ['nguoi-dan','mam-com','duong-lang'].map(storyById);
export const EXPERIENCE_OPTIONS = [
  { id:'kitchen', story:storyById('banh-xeo'), title:'Ghé một gian bếp quê', description:'Quan sát một lượt, hỏi chuyện rồi thử phần được chủ nhà hướng dẫn.', action:'Xem trước hoạt động', mode:'activity' as const, result:'Hiểu một công việc trong bếp và cách bắt đầu khi chưa từng làm.' },
  { id:'meal', story:storyById('mam-com'), title:'Ngồi lại bên mâm cơm', description:'Từ một món quen đến câu chuyện về nguyên liệu và người nấu.', action:'Xem trước cách bắt đầu', mode:'activity' as const, result:'Biết nên trao đổi với chủ nhà về món ăn và buổi ghé thăm.' },
  { id:'village', story:storyById('duong-lang'), title:'Đi chậm qua đường làng', description:'Nhìn mái nhà, lối đi và nhịp sinh hoạt phía sau một góc cảnh đẹp.', action:'Quan sát lối đi', mode:'observe' as const, result:'Nhận ra chi tiết đời thường và cách dừng ngắm cảnh, nhường lối.' },
];
