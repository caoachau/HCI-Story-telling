import templeFront from '../../assets/den-tho-bac/overview-remake/01-photo-original.jpg';
import templeModel from '../../assets/den-tho-bac/overview-remake/02-photo-original.jpeg';
import statue from '../../assets/den-tho-bac/overview-remake/03-photo-original.jpg';
import portraitArchive from '../../assets/den-tho-bac/portrait-user/ho-chi-minh-portrait-updated.webp';
import { PHOTOS, type Photo, type Story } from './content';
import { WAR_ARTIFACT_CHAPTERS } from './war-artifacts-content';
import { GROUNDS_CHAPTERS } from './grounds-content';
import { BOAT_CHAPTERS } from './boat-content';
import { REMAINING_SPACE_DETAILS } from './remaining-spaces-content';

export interface ReaderChapter {
  id: string;
  label: string;
  title: string;
  paragraphs: string[];
  photo: Photo;
  facts?: { label: string; value: string }[];
  look?: string[];
  lookLabel?: string;
  labelText?: string;
  references?: readonly { name: string; title: string; date: string; url: string; note: string }[];
}

const supplied = 'Ảnh do người dùng cung cấp';
const images: Record<string, Photo> = {
  ...PHOTOS,
  front: { src: templeFront, alt: 'Mặt trước ngôi đền giữa hàng cây và khoảng sân.', caption: 'Ngôi đền trong không gian cây xanh.', credit: supplied },
  model: { src: templeModel, alt: 'Mô hình cổng gỗ và ngôi đền mái lá trong nhà trưng bày.', caption: 'Mô hình gợi lại ngôi đền thuở đầu trong nhà trưng bày.', credit: supplied },
  statue: { src: statue, alt: 'Tượng Bác Hồ ngồi cầm báo trước phù điêu hoa sen.', caption: 'Tượng Bác Hồ và phù điêu hoa sen trong không gian tưởng niệm.', credit: supplied },
  archive: { src: portraitArchive, alt: 'Ảnh tư liệu chân dung Bác Hồ trên bàn thờ.', caption: 'Chân dung Bác Hồ · Ảnh tư liệu được cung cấp.', credit: supplied },
};

function contextImages(story: Story): Photo[] {
  let keys = ['front', 'model', 'aerial'];
  if (story.id === 'witness') keys = ['witness', 'history-1970', 'front'];
  else if (story.id === 'portrait') keys = ['artist', 'archive', 'front'];
  else if (/birthday|commemoration/.test(story.id)) keys = ['ceremony', 'activity-birthday', 'statue'];
  else if (/remembrance/.test(story.id) && !story.id.startsWith('history-')) keys = ['statue', 'witness', 'ceremony'];
  else if (/visit|learning|garden|pond|camping|map-guide/.test(story.id)) keys = ['siteplan', 'activity-visit', 'front'];
  else if (/stilt/.test(story.id)) keys = ['stilt', 'history-2012', 'siteplan'];
  else if (story.id.startsWith('history-')) keys = ['model', 'witness', 'front'];
  else if (story.id.startsWith('map-')) keys = ['siteplan', 'aerial', 'front'];
  const candidates = [images[story.photo], ...keys.map(key => images[key]), images.front, images.model, images.aerial];
  return candidates.filter((photo, index, all) => photo && all.findIndex(other => other?.src === photo.src) === index).slice(0, 3);
}

// The original account is divided into continuous reading sections. Dates,
// quotations, source links and the original lead/detail are retained verbatim.
export function readerChapters(story: Story): ReaderChapter[] {
  if (REMAINING_SPACE_DETAILS[story.id]) return REMAINING_SPACE_DETAILS[story.id].chapters;
  if (story.id === 'map-boat') return BOAT_CHAPTERS;
  if (story.id === 'map-artifacts') return WAR_ARTIFACT_CHAPTERS;
  if (story.id === 'map-camping') return GROUNDS_CHAPTERS;
  if (story.id === 'preservation') return [
    { id: 'today', label: 'Ngôi đền hôm nay', title: 'Giữ lại một không gian ký ức.', paragraphs: [story.summary[0], story.lead], photo: images.front },
    { id: 'traces', label: 'Dấu tích được gìn giữ', title: 'Những dấu mốc còn lại.', paragraphs: [story.summary[1], story.detail], photo: images['history-1989'] },
    { id: 'stories', label: 'Ký ức và con người', title: 'Câu chuyện được kể tiếp.', paragraphs: [story.summary[2]], photo: images.model },
    { id: 'landscape', label: 'Không gian di tích', title: 'Nhìn lại một nơi chốn.', paragraphs: [images.siteplan.caption], photo: images.siteplan },
  ];
  const photos = contextImages(story);
  const sentences = story.detail.match(/[^.!?]+(?:[.!?]+|$)/gu)?.map(text => text.trim()).filter(Boolean) || [story.detail];
  const split = Math.max(1, Math.ceil(sentences.length / 2));
  return story.summary.map((title, index) => ({
    id: `${story.id}-${index + 1}`,
    label: ['Điểm bắt đầu', 'Câu chuyện phía sau', 'Điều mang theo'][index] || 'Tìm hiểu thêm',
    title,
    paragraphs: index === 0 ? [story.lead] : index === 1 ? sentences.slice(0, split) : sentences.slice(split),
    photo: photos[index % photos.length],
  }));
}
