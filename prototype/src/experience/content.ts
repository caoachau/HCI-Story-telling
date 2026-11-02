import type { SiteId } from './state';

export type Copy = { vi: string; en: string };
const t = (vi: string, en: string): Copy => ({ vi, en });
export interface SourceRecord { label: string; url: string; published?: string; }
export interface ObjectRecord { name: Copy; usedBy: Copy; use: Copy; displayReason: Copy; source: SourceRecord; reviewer: string; reviewedAt: string; }
export interface PersonRecord { id: string; name: Copy; role: Copy; account: Copy; portrait?: string; source: SourceRecord; permissionReference: string; reviewer: string; reviewedAt: string; }
export interface ActivityRecord { host: Copy; contact: Copy; schedule: Copy; conditions: Copy; source: SourceRecord; reviewer: string; reviewedAt: string; }
export interface LocalRule { action: Copy; reason: Copy; scope: Copy; source: SourceRecord; approvedBy: string; approvedAt: string; }
export interface HistoricalPair { id: string; past: { image: string; label: Copy; year: string; description: Copy; source: SourceRecord; rights: string }; present: { image: string; label: Copy; description: Copy; source: SourceRecord; rights: string }; reviewer: string; reviewedAt: string; }
export interface ApprovedMedia {
  id: string; title: Copy; url: string; transcript: Copy; captions: { vi: string; en: string };
  narrator: string; recordedAt: string; permissionReference: string; reviewer: string; reviewedAt: string;
  source: SourceRecord;
}
export interface ContentEvidence {
  question: Copy; meaning: Copy; kind: Copy; sources: SourceRecord[];
  access: { entrance: string | null; rest: string | null; stepFree: string | null; reviewer: string | null; reviewedAt: string | null; source?: SourceRecord };
  community: { narrator: string | null; recordedAt: string | null; permissionReference: string | null; reviewer: string | null };
  media: ApprovedMedia[];
  objects?: Record<string, ObjectRecord>;
  people?: PersonRecord[];
  activity?: ActivityRecord;
  localRules?: LocalRule[];
  historicalPairs?: HistoricalPair[];
}
const unconfirmedAccess = { entrance: null, rest: null, stepFree: null, reviewer: null, reviewedAt: null };
const unrecorded = { narrator: null, recordedAt: null, permissionReference: null, reviewer: null };
const editorial = t('Bản biên soạn từ tư liệu; giọng đọc tổng hợp', 'Editorial interpretation from reference material; synthetic narration');

/** Unknown evidence remains null. Adding a source is not permission to invent a
 * narrator, a quotation, an accessible entrance or an operating schedule. */
export const CONTENT_EVIDENCE: Record<SiteId, ContentEvidence> = {
  'ao-ba-om': {
    question: t('Vì sao một ao nước trở thành nơi lưu giữ câu chuyện và sinh hoạt văn hóa?', 'How can a pond hold both local stories and cultural practices?'),
    meaning: t('Quan sát cảnh quan, đối chiếu tính chất truyền thuyết và tìm mối liên hệ với đời sống Khmer quanh ao.', 'Observe the landscape, distinguish legend from documented history, and connect the pond with Khmer cultural life.'),
    kind: t('Cảnh quan, truyền thuyết và văn hóa; phân biệt từng loại tư liệu', 'Landscape, legend and culture; distinguish the evidence for each'),
    sources: [{ label: 'Nguồn cảnh quan / Landscape reference', url: 'https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay' }, { label: 'Lễ hội Ok Om Bok 2024 / Festival report', url: 'https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'chua-ang': {
    question: t('Các chi tiết kiến trúc gắn với thực hành văn hóa và tín ngưỡng như thế nào?', 'How do architectural details relate to cultural and religious practices?'),
    meaning: t('Đi từ điều nhìn thấy đến câu hỏi về công dụng, bối cảnh và người sử dụng không gian.', 'Move from a visible detail to questions about its use, setting and the people who use the space.'),
    kind: editorial,
    sources: [{ label: 'Cục Du lịch Quốc gia Việt Nam / Viet Nam National Authority of Tourism', url: 'https://vietnamtourism.vn/en/index.php/tourism/items/1395' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'bao-tang-khmer': {
    question: t('Hiện vật giúp hiểu đời sống của người Khmer ra sao?', 'How do museum objects help us understand Khmer life?'),
    meaning: t('Nối hình dáng và công dụng hiện vật với người sử dụng, hoàn cảnh và lý do gìn giữ.', 'Connect an object’s form and use with its users, context and reasons for preservation.'),
    kind: editorial,
    sources: [{ label: 'Bảo tàng Lịch sử quốc gia / National Museum of History', url: 'https://baotanglichsu.vn/VI/Articles/3096/16337/bao-tang-van-hoa-dan-toc-khmer-tinh-tra-vinh.html' }, { label: 'VietNamNet · Tư liệu ảnh / Photo report', url: 'https://vietnamnet.vn/800-hien-vat-tu-lieu-co-truyen-cua-dong-bao-khmer-o-tra-vinh-2203450.html' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'chua-hang': {
    question: t('Không gian chùa, bàn tay người thực hành và cảnh quan liên hệ với nhau thế nào?', 'How do the temple setting, the work of practitioners and the landscape relate?'),
    meaning: t('Quan sát chi tiết trước, rồi hỏi người am hiểu về công dụng và bối cảnh của chính chi tiết đó.', 'Observe a detail first, then ask a knowledgeable person about that particular detail’s use and context.'),
    kind: editorial, sources: [], access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'den-tho-bac': {
    question: t('Điều gì khiến một công trình trở thành không gian ký ức của người địa phương?', 'What makes a building a place of memory for local people?'),
    meaning: t('Kết nối lịch sử xây dựng, ký ức về việc gìn giữ và những cách tưởng niệm tại di tích.', 'Connect the building’s history, accounts of its protection and practices of remembrance at the site.'),
    kind: editorial,
    sources: [{ label: 'Cục Du lịch Quốc gia Việt Nam / National tourism reference', url: 'https://www.dulichvn.org.vn/index.php/item/chuyen-xay-giu-den-tho-bac-ho-trong-khang-chien-51088', published: '2022-09-05' }, { label: 'Báo Công an nhân dân / Documentary report', url: 'https://cand.vn/Tieu-diem-van-hoa/den-tho-bac-ho-o-tra-vinh-tam-long-sat-son-cua-nhan-dan-nam-bo-i691437/', published: '2023-05-02' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'con-chim': {
    question: t('Một món ăn hoặc một cảnh quan cho biết điều gì về đời sống trên cồn?', 'What can food or a landscape tell us about life on the island?'),
    meaning: t('Món ăn, ruộng ao và cuộc gặp với người dân giúp nối trải nghiệm với sinh kế và nhịp sống địa phương.', 'Food, fields, ponds and encounters with residents connect a visit with local livelihoods and daily rhythms.'),
    kind: editorial,
    sources: [{ label: 'Bộ Văn hóa, Thể thao và Du lịch / Ministry report', url: 'https://bvhttdl.gov.vn/ra-mat-diem-du-lich-cong-dong-dau-tien-tai-tra-vinh-20190910165212562.htm', published: '2019-09-10' }, { label: 'Ẩm thực Cồn Chim / Food and local life', url: 'https://vietnamtourism.vn/index.php/news/items/26137', published: '2023-02-28' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
  'bien-ba-dong': {
    question: t('Cảnh quan ven biển gợi mở những câu chuyện nào về vùng đất?', 'What stories of a place can a coastal landscape reveal?'),
    meaning: t('Quan sát những lớp cảnh quan và phân biệt ảnh địa điểm với hình minh họa trước khi liên hệ đến đời sống ven biển.', 'Observe the layers of the landscape and distinguish site photographs from illustrative images before interpreting coastal life.'),
    kind: editorial,
    sources: [{ label: 'Cục Du lịch Quốc gia Việt Nam / National tourism reference', url: 'https://vietnamtourism.vn/index.php/tourism/items/1948' }],
    access: { ...unconfirmedAccess }, community: { ...unrecorded }, media: [],
  },
};

export function approvedMedia(siteId: SiteId) {
  return CONTENT_EVIDENCE[siteId].media.filter(media => media.id && validMediaLocation(media.url) && bilingual(media.title) && bilingual(media.transcript) && validMediaLocation(media.captions.vi) && validMediaLocation(media.captions.en) && reviewed(media.narrator, media.recordedAt) && media.permissionReference.trim() && reviewed(media.reviewer, media.reviewedAt) && validReference(media.source));
}

export function validMediaLocation(value: string) {
  try { return !!value.trim() && ['http:', 'https:'].includes(new URL(value, location.href).protocol); } catch { return false; }
}

export function validReference(source: SourceRecord | undefined) {
  try { return !!source?.label.trim() && ['http:', 'https:'].includes(new URL(source.url).protocol); } catch { return false; }
}
const bilingual = (copy: Copy | undefined) => !!copy?.vi?.trim() && !!copy?.en?.trim();
const reviewed = (name: string | undefined | null, date: string | undefined | null) => !!name?.trim() && !!date && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date;
export function approvedObjects(siteId: SiteId) { return Object.entries(CONTENT_EVIDENCE[siteId].objects || {}).filter(([, value]) => bilingual(value.name) && bilingual(value.usedBy) && bilingual(value.use) && bilingual(value.displayReason) && validReference(value.source) && reviewed(value.reviewer, value.reviewedAt)); }
export function approvedPeople(siteId: SiteId) { return (CONTENT_EVIDENCE[siteId].people || []).filter(value => value.id && bilingual(value.name) && bilingual(value.role) && bilingual(value.account) && validReference(value.source) && value.permissionReference.trim() && reviewed(value.reviewer, value.reviewedAt)); }
export function approvedActivity(siteId: SiteId) { const value = CONTENT_EVIDENCE[siteId].activity; return value && bilingual(value.host) && bilingual(value.contact) && bilingual(value.schedule) && bilingual(value.conditions) && validReference(value.source) && reviewed(value.reviewer, value.reviewedAt) ? value : null; }
export function approvedRules(siteId: SiteId) { return (CONTENT_EVIDENCE[siteId].localRules || []).filter(value => bilingual(value.action) && bilingual(value.reason) && bilingual(value.scope) && validReference(value.source) && reviewed(value.approvedBy, value.approvedAt)); }
export function confirmedAccess(siteId: SiteId) { const value = CONTENT_EVIDENCE[siteId].access; return reviewed(value.reviewer, value.reviewedAt) && validReference(value.source) ? value : null; }
export function approvedComparisons(siteId: SiteId) { return (CONTENT_EVIDENCE[siteId].historicalPairs || []).filter(value => validMediaLocation(value.past.image) && validMediaLocation(value.present.image) && value.past.image !== value.present.image && value.past.year.trim() && value.past.rights.trim() && value.present.rights.trim() && bilingual(value.past.label) && bilingual(value.present.label) && bilingual(value.past.description) && bilingual(value.present.description) && validReference(value.past.source) && validReference(value.present.source) && reviewed(value.reviewer, value.reviewedAt)); }

