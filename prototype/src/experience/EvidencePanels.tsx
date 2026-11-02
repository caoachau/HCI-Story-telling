import { useState } from 'react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { approvedActivity, approvedComparisons, approvedObjects, approvedPeople, approvedRules } from './content';
import type { SiteId } from './state';
import { routeParams, updateRoute } from './state';

export function PeopleEvidence({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const people = approvedPeople(siteId);
  if (!people.length) return <p className="hx-notice">{lang === 'vi' ? 'Chưa có hồ sơ nhân vật và quyền dùng lời kể/hình ảnh được xác nhận cho mục này. Có thể đọc các bài nguồn; chưa gán lời kể trực tiếp hoặc ảnh minh họa thành chân dung một người.' : 'A reviewed person profile and permission to use their account or portrait are not available here yet. Source articles remain available; illustrative images are not assigned an identity or testimony.'}</p>;
  return <section>{people.map(person => <article key={person.id}><h3>{person.name[lang]}</h3><p>{person.role[lang]}</p>{person.portrait && <img src={person.portrait} alt={person.name[lang]} loading="lazy" />}<p>{person.account[lang]}</p><a href={person.source.url} target="_blank" rel="noopener noreferrer">{person.source.label}</a><small>{person.reviewer} · {person.reviewedAt}</small></article>)}</section>;
}

export function ObjectEvidence({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const records = approvedObjects(siteId);
  const [selected, setSelected] = useState(() => routeParams().get('object') || '');
  const item = records.find(([id]) => id === selected) || records[0];
  if (!item) return <p className="hx-notice">{lang === 'vi' ? 'Chưa có hồ sơ hiện vật riêng được rà soát đủ nguồn cho mục này. Các câu hỏi dưới đây giúp quan sát; không thay thế thông tin đã xác nhận của một hiện vật.' : 'An object-specific record with a complete source review is not available here yet. The prompts below support observation; they do not replace a verified object record.'}</p>;
  const [id, record] = item;
  return <section><label>{lang === 'vi' ? 'Chọn hiện vật' : 'Choose an object'}<select value={id} onChange={event => { setSelected(event.target.value); updateRoute({ object: event.target.value }, siteId); }}>{records.map(([key, value]) => <option key={key} value={key}>{value.name[lang]}</option>)}</select></label><h3>{record.name[lang]}</h3><dl><dt>{lang === 'vi' ? 'Ai sử dụng?' : 'Who uses it?'}</dt><dd>{record.usedBy[lang]}</dd><dt>{lang === 'vi' ? 'Dùng như thế nào?' : 'How is it used?'}</dt><dd>{record.use[lang]}</dd><dt>{lang === 'vi' ? 'Vì sao trưng bày?' : 'Why is it displayed?'}</dt><dd>{record.displayReason[lang]}</dd></dl><a href={record.source.url} target="_blank" rel="noopener noreferrer">{record.source.label}</a><p>{record.reviewer} · {record.reviewedAt}</p></section>;
}

export function ActivityStatus({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const record = approvedActivity(siteId);
  if (!record) return <p className="hx-notice">{lang === 'vi' ? 'Chưa có lịch đón, người hướng dẫn và điều kiện tham gia đã được xác nhận cho buổi hiện tại. Phần xem trước giúp hình dung hoạt động; hãy hỏi người đón khách trước khi tham gia.' : 'A current host, schedule and participation conditions have not been confirmed. This preview helps you understand an activity; check with the host before joining.'}</p>;
  return <section><h3>{lang === 'vi' ? 'Thông tin tham gia đã rà soát' : 'Reviewed participation information'}</h3><dl><dt>{lang === 'vi' ? 'Người hướng dẫn' : 'Host'}</dt><dd>{record.host[lang]}</dd><dt>{lang === 'vi' ? 'Liên hệ' : 'Contact'}</dt><dd>{record.contact[lang]}</dd><dt>{lang === 'vi' ? 'Thời gian' : 'Schedule'}</dt><dd>{record.schedule[lang]}</dd><dt>{lang === 'vi' ? 'Điều kiện' : 'Conditions'}</dt><dd>{record.conditions[lang]}</dd></dl><a href={record.source.url} target="_blank" rel="noopener noreferrer">{record.source.label}</a><small>{record.reviewer} · {record.reviewedAt}</small></section>;
}

export function LocalRules({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const values = approvedRules(siteId);
  if (!values.length) return <p className="hx-notice">{lang === 'vi' ? 'Các lưu ý hiện có là gợi ý ứng xử. Chưa có bộ nội quy riêng được đơn vị tại điểm xác nhận trong hồ sơ này.' : 'The current notes are respectful-visit suggestions. Site-approved regulations have not been recorded in this profile.'}</p>;
  return <section><h3>{lang === 'vi' ? 'Nội quy đã xác nhận' : 'Confirmed site rules'}</h3>{values.map((value, index) => <article key={index}><h4>{value.action[lang]}</h4><p>{value.reason[lang]}</p><p>{value.scope[lang]}</p><a href={value.source.url} target="_blank" rel="noopener noreferrer">{value.source.label}</a><small>{value.approvedBy} · {value.approvedAt}</small></article>)}</section>;
}

export function HistoricalEvidence({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const values = approvedComparisons(siteId);
  if (!values.length) return <p className="hx-notice">{lang === 'vi' ? 'Chưa có cặp ảnh lịch sử–hiện tại đủ nguồn và niên đại xác nhận cho mục này. Có thể quan sát từng ảnh; không suy ra lịch sử chỉ từ tên tệp hoặc hình ảnh tương tự.' : 'A historical–current pair with confirmed sources and dates is not available here yet. Individual images remain useful for observation; file names or similar views alone do not establish history.'}</p>;
  return <>{values.map(value => <section key={value.id}><BeforeAfterSlider lang={lang} pastImage={value.past.image} pastLabel={value.past.label[lang]} pastYear={value.past.year} pastDescription={value.past.description[lang]} presentImage={value.present.image} presentLabel={value.present.label[lang]} presentDescription={value.present.description[lang]} historicalVerified /><p><a href={value.past.source.url} target="_blank" rel="noopener noreferrer">{value.past.source.label}</a> · <a href={value.present.source.url} target="_blank" rel="noopener noreferrer">{value.present.source.label}</a></p><small>{value.reviewer} · {value.reviewedAt}</small></section>)}</>;
}
