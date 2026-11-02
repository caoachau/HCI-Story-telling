import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Accessibility, BookOpen, HelpCircle, Headphones, QrCode, X } from 'lucide-react';
import { HERITAGE_SITES } from '../data/heritageSites';
import { quickLocationContent } from '../data/locationQuickContent';
import { CONTENT_EVIDENCE, confirmedAccess } from './content';
import { HistoricalEvidence, LocalRules, ObjectEvidence, PeopleEvidence } from './EvidencePanels';
import { MediaReader } from './MediaReader';
import { ShareContent } from './ShareContent';
import { narration, useNarrationState } from './narration';
import { usePreferences, setPreferences } from './preferences';
import { entryIssue, setEntryIssue, routeParams, updateRoute, useRememberedState, type SiteId } from './state';
import './experience.css';

type Panel = 'menu' | 'help' | 'story' | 'settings' | 'share' | 'listen' | null;
function useReaderToolsHost() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const refresh = () => {
      const candidates = [...document.querySelectorAll<HTMLElement>('dialog[open]:not(.hx-dialog), [role=dialog][aria-modal=true]:not(.hx-dialog)')].filter(value => !value.closest('.hx-dialog') && value.getClientRects().length);
      const quick = document.querySelector<HTMLElement>('.lqv-root');
      const quickPanel = quick?.closest<HTMLElement>('.heritage-story-panel');
      const compactQuick = quick && quickPanel && getComputedStyle(quickPanel).position === 'fixed' ? quick : null;
      setHost(candidates.at(-1) || compactQuick);
    };
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'hidden', 'aria-hidden'] });
    window.addEventListener('resize', refresh);
    refresh();
    return () => { observer.disconnect(); window.removeEventListener('resize', refresh); };
  }, []);
  return host;
}
function Dialog({ title, close, children }: { title: string; close: () => void; children: React.ReactNode }) {
  const root = useRef<HTMLDialogElement>(null);
  useEffect(() => { const origin = document.activeElement as HTMLElement | null; root.current?.showModal(); return () => { root.current?.close(); if (origin?.isConnected) origin.focus({ preventScroll: true }); }; }, []);
  return <dialog ref={root} className="hx-dialog" onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); event.stopPropagation(); close(); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }} aria-label={title}><header><h2>{title}</h2><button type="button" onClick={close} aria-label={document.documentElement.lang === 'vi' ? 'Đóng công cụ' : 'Close tools'}><X size={20} /></button></header><div className="hx-body">{children}</div></dialog>;
}

export function StoryOverview({ siteId, lang }: { siteId: SiteId; lang: 'vi' | 'en' }) {
  const site = HERITAGE_SITES.find(value => value.id === siteId)!;
  const content = quickLocationContent(site, lang);
  const evidence = CONTENT_EVIDENCE[siteId];
  const access = confirmedAccess(siteId);
  const vi = lang === 'vi';
  type CoreTab = 'summary' | 'sources' | 'visit' | 'object';
  const initial = routeParams();
  const [tab, setTab] = useRememberedState<CoreTab>(`${siteId}:coreTab`, ['summary', 'sources', 'visit', 'object'].includes(initial.get('coreTab') || '') ? initial.get('coreTab') as CoreTab : 'summary', initial.has('coreTab'));
  useEffect(() => { updateRoute({ coreTab: tab }, siteId); }, [tab, siteId]);
  const unknown = vi ? 'Chưa có thông tin xác nhận' : 'Confirmation is not available';
  const readText = `${evidence.question[lang]}\n${content.summary}\n${evidence.meaning[lang]}`;
  return <section data-story-overview={siteId}>
    <p className="hx-kicker">{vi ? 'Câu chuyện · Phần cốt lõi' : 'Story · Core interpretation'}</p>
    <h2>{vi ? site.name : site.englishName}</h2>
    <div className="hx-actions" role="group" aria-label={vi ? 'Chọn phần tìm hiểu' : 'Choose a reading section'}>{([
      ['summary', vi ? 'Nắm ý chính' : 'Key ideas'], ['sources', vi ? 'Nguồn và người kể' : 'Sources and storytellers'], ['object', vi ? 'Hiểu hiện vật' : 'Understanding objects'], ['visit', vi ? 'Ghé thăm' : 'Visiting'],
    ] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={tab === value} onClick={() => { narration.stop(); setTab(value); }}>{label}</button>)}</div>
    {tab === 'summary' && <>
      <p><strong>{evidence.question[lang]}</strong></p><p>{content.summary}</p><p><strong>{vi ? 'Điều cần nhớ' : 'Takeaway'}:</strong> {evidence.meaning[lang]}</p>
      <p>{vi ? 'Đọc khoảng 1–3 phút. Bạn có thể dừng ở ý chính hoặc chọn tìm hiểu thêm.' : 'About 1–3 minutes. Finish with the key idea or choose to explore further.'}</p>
      <button type="button" className="hx-primary" onClick={() => narration.play(readText, vi ? 'vi-VN' : 'en-US', `core:${siteId}:${lang}`)}>{vi ? 'Nghe ý chính' : 'Listen to key ideas'}</button>
      <h3>{vi ? 'Tìm hiểu thêm' : 'Explore further'}</h3>{content.highlights.map(item => <details key={item.title}><summary>{item.title}</summary><p>{item.summary}</p></details>)}
      <MediaReader siteId={siteId} lang={lang} />
    </>}
    {tab === 'sources' && <>
      <p className="hx-notice">{evidence.kind[lang]}</p>
      <dl><dt>{vi ? 'Người cung cấp lời kể' : 'Recorded storyteller'}</dt><dd>{evidence.community.narrator || unknown}</dd><dt>{vi ? 'Ngày ghi nhận' : 'Recording date'}</dt><dd>{evidence.community.recordedAt || unknown}</dd><dt>{vi ? 'Quyền dùng bản kể' : 'Recording permission'}</dt><dd>{evidence.community.permissionReference || unknown}</dd><dt>{vi ? 'Người rà soát địa phương' : 'Local reviewer'}</dt><dd>{evidence.community.reviewer || unknown}</dd><dt>{vi ? 'Phiên bản biên soạn' : 'Editorial version'}</dt><dd>28/10/2026</dd></dl>
      <h3>{vi ? 'Tài liệu tham khảo' : 'References'}</h3>{evidence.sources.length ? evidence.sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>{source.published && <> · <time>{source.published}</time></>}</p>) : <p>{vi ? 'Nguồn riêng cho mục này đang được bổ sung. Không coi bản biên soạn là hồ sơ hiện vật đã xác minh.' : 'References for this section are being prepared. Editorial interpretation is not a verified object record.'}</p>}
      <p>{vi ? 'Giọng đọc trên giao diện là tổng hợp từ bản chữ. Không gán giọng đọc này thành lời kể của cư dân.' : 'Interface narration is synthesized from the written text. It is not a recording of a resident.'}</p>
      <PeopleEvidence siteId={siteId} lang={lang} />
      <HistoricalEvidence siteId={siteId} lang={lang} />
    </>}
    {tab === 'object' && <>
      <ObjectEvidence siteId={siteId} lang={lang} />
      <h3>{vi ? 'Từ chi tiết đến đời sống' : 'From detail to everyday life'}</h3>
      <p>{vi ? 'Chọn một hiện vật hoặc chi tiết đang nhìn thấy. Ba câu hỏi sau giúp bạn nối điều quan sát với bối cảnh.' : 'Choose an object or visible detail. These questions connect observation with context.'}</p>
      <dl><dt>{vi ? 'Ai sử dụng?' : 'Who uses it?'}</dt><dd>{vi ? 'Tìm vai trò người thực hành trong bài nguồn; không suy danh tính từ ảnh minh họa.' : 'Look for the practitioner’s role in the source; do not infer identity from an illustrative image.'}</dd><dt>{vi ? 'Dùng thế nào?' : 'How is it used?'}</dt><dd>{vi ? 'Quan sát hình dáng, chất liệu, thao tác và không gian sử dụng. Đối chiếu với lời giải thích có nguồn của đúng hiện vật.' : 'Observe form, material, actions and setting. Check the explanation against a source about that particular object.'}</dd><dt>{vi ? 'Vì sao gìn giữ?' : 'Why preserve it?'}</dt><dd>{evidence.meaning[lang]}</dd></dl>
      <p className="hx-notice">{vi ? 'Mô hình và ảnh trong prototype không thay thế hồ sơ giám định. Tên người dùng, niên đại, xuất xứ và lý do trưng bày chỉ được xác nhận khi có hồ sơ tương ứng.' : 'Prototype models and images do not replace an object record. Users, dates, provenance and display rationale require evidence specific to the object.'}</p>
    </>}
    {tab === 'visit' && <>
      <p>{content.visit}</p><dl><dt>{vi ? 'Lối vào' : 'Entrance'}</dt><dd>{access?.entrance || unknown}</dd><dt>{vi ? 'Điểm nghỉ' : 'Rest areas'}</dt><dd>{access?.rest || unknown}</dd><dt>{vi ? 'Lối đi không bậc' : 'Step-free access'}</dt><dd>{access?.stepFree || unknown}</dd><dt>{vi ? 'Người xác nhận / Ngày' : 'Verified by / Date'}</dt><dd>{access ? `${access.reviewer} · ${access.reviewedAt}` : unknown}</dd></dl>{access?.source && <a href={access.source.url} target="_blank" rel="noopener noreferrer">{access.source.label}</a>}
      <LocalRules siteId={siteId} lang={lang} />
      <a href={`https://www.google.com/maps/search/?api=1&query=${site.lat},${site.lng}`} target="_blank" rel="noopener noreferrer">{vi ? 'Xem vị trí trên Google Maps' : 'View the location on Google Maps'}</a>
      <h3>{vi ? 'Ghé thăm với sự tôn trọng' : 'Visit respectfully'}</h3><ul><li>{vi ? 'Hỏi người phụ trách về khu vực được vào và thời điểm phù hợp.' : 'Ask the site host which areas may be entered and when.'}</li><li>{vi ? 'Xin phép trước khi chụp, ghi âm, quay phim hoặc tham gia thao tác.' : 'Ask before taking photographs, recording or joining an activity.'}</li><li>{vi ? 'Bạn có thể chỉ quan sát; chỉ thử thao tác khi được người hướng dẫn đồng ý.' : 'You may choose to observe; only try an activity when the host agrees.'}</li></ul><p className="hx-notice">{vi ? 'Đây là gợi ý ứng xử chung, không thay thế nội quy đã được địa phương xác nhận. Lịch, giá và người đón cần hỏi trực tiếp tại điểm.' : 'These are general suggestions, not locally approved regulations. Confirm schedules, fees and the current host at the site.'}</p>
    </>}
  </section>;
}

function visibleReadingText() {
  const areas = ['dialog[open]:not(.hx-dialog)', '.hx-english main', '.cck-reader-content', '.db-reader-prose', '.md-dialog-content', '.heritage-location-detail:not([hidden])', '.cc-kiosk main', '.db-kiosk main', '.md-section:not([hidden])', '.lqv-reader'];
  const area = areas.map(selector => document.querySelector<HTMLElement>(selector)).find(element => element && element.getClientRects().length);
  if (!area) return '';
  return [...area.querySelectorAll<HTMLElement>('h1,h2,h3,p,li')].filter(element => element.getClientRects().length && !element.closest('nav,footer,.hx-tools,button,[hidden],[inert],[aria-hidden=true]')).map(element => element.innerText.trim()).filter(Boolean).join('\n').slice(0, 24000);
}

export function ExperienceTools({ siteId, hidden = false, dockHost = null }: { siteId: SiteId; hidden?: boolean; dockHost?: HTMLElement | null }) {
  const readerHost = useReaderToolsHost();
  const prefs = usePreferences();
  const vi = prefs.lang === 'vi';
  const [panel, setPanel] = useState<Panel>(() => routeParams().get('tools') === 'story' ? 'story' : null);
  const returnPanel = useRef<Panel>(null);
  const [reading, setReading] = useState('');
  const [issue, setIssue] = useState(entryIssue);
  const voice = useNarrationState();
  const site = HERITAGE_SITES.find(value => value.id === siteId)!;
  const name = vi ? site.name : site.englishName;
  useEffect(() => { const refresh = () => setIssue(entryIssue()); window.addEventListener('heritage:entry-issue', refresh); refresh(); return () => window.removeEventListener('heritage:entry-issue', refresh); }, []);
  useEffect(() => { const help = (event: KeyboardEvent) => { if (event.key === 'F1') { event.preventDefault(); setPanel('help'); } }; window.addEventListener('keydown', help); return () => window.removeEventListener('keydown', help); }, []);
  useEffect(() => { if (hidden) setPanel(null); }, [hidden]);
  const open = (next: Panel) => { returnPanel.current = next === 'share' && panel ? panel : null; if (next === 'story') updateRoute({ tools: 'story' }, siteId); if (next === 'listen') setReading(visibleReadingText() || `${name}\n${quickLocationContent(site, prefs.lang).summary}`); setPanel(next); };
  const title = panel === 'menu' ? (vi ? 'Công cụ khám phá' : 'Exploration tools') : panel === 'help' ? (vi ? 'Hướng dẫn khám phá' : 'How to explore') : panel === 'settings' ? (vi ? 'Tùy chỉnh trải nghiệm' : 'Experience settings') : panel === 'listen' ? (vi ? 'Nghe và bản chữ' : 'Narration and transcript') : panel === 'share' ? (vi ? 'Mang nội dung theo' : 'Take content with you') : (vi ? 'Câu chuyện và tư liệu' : 'Stories and references');
  const close = () => { narration.stop(); const target = returnPanel.current; returnPanel.current = null; if (!target) updateRoute({ tools: null }, siteId); setPanel(target); };
  if (hidden) return null;
  const toolButtons = <>
    <button type="button" onClick={() => open('help')} title={vi ? 'Hướng dẫn' : 'Help'} aria-label={vi ? 'Hướng dẫn' : 'Help'} aria-haspopup="dialog" aria-expanded={panel === 'help'}><HelpCircle size={20} /><span>{vi ? 'Hướng dẫn' : 'Help'}</span></button>
    <button type="button" onClick={() => open('story')} title={vi ? 'Câu chuyện và nguồn' : 'Story and sources'} aria-label={vi ? 'Câu chuyện và nguồn' : 'Story and sources'} aria-haspopup="dialog" aria-expanded={panel === 'story'}><BookOpen size={20} /><span>{vi ? 'Câu chuyện và nguồn' : 'Story and sources'}</span></button>
    <button type="button" onClick={() => open('listen')} title={vi ? 'Nghe và bản chữ' : 'Listen and transcript'} aria-label={vi ? 'Nghe và bản chữ' : 'Listen and transcript'} aria-haspopup="dialog" aria-expanded={panel === 'listen'}><Headphones size={20} /><span>{vi ? 'Nghe và bản chữ' : 'Listen and transcript'}</span></button>
    <button type="button" onClick={() => open('share')} title={vi ? 'Chia sẻ đúng phần đang xem' : 'Share the current content'} aria-label={vi ? 'Chia sẻ đúng phần đang xem' : 'Share the current content'} aria-haspopup="dialog" aria-expanded={panel === 'share'}><QrCode size={20} /><span>{vi ? 'Mang theo / Chia sẻ' : 'Take with you / Share'}</span></button>
    <button type="button" onClick={() => open('settings')} title={vi ? 'Ngôn ngữ và trợ năng' : 'Language and accessibility'} aria-label={vi ? 'Ngôn ngữ và trợ năng' : 'Language and accessibility'} aria-haspopup="dialog" aria-expanded={panel === 'settings'}><Accessibility size={20} /><span>{vi ? 'Ngôn ngữ và trợ năng' : 'Language and accessibility'}</span></button>
  </>;
  const docked = !!dockHost && !readerHost;
  const toolbar = <nav className={`hx-tools ${readerHost ? 'hx-tools--reader' : docked ? 'hx-tools--docked' : ''}`} aria-label={vi ? 'Công cụ khám phá dùng chung' : 'Exploration tools'}>{readerHost ? <button type="button" aria-label={vi ? 'Mở công cụ khám phá' : 'Open exploration tools'} onClick={() => open('menu')}><Accessibility size={18} /><span>{vi ? 'Công cụ' : 'Tools'}</span></button> : toolButtons}</nav>;
  const contents = <>
    {issue && <aside className="hx-route-notice" role="alert"><p>{issue[prefs.lang]}</p><button onClick={() => setEntryIssue(null)}>{vi ? 'Đã hiểu' : 'Dismiss'}</button></aside>}
    {['playing', 'paused'].includes(voice.status) && <aside className={`hx-audio-strip ${readerHost ? 'hx-audio-strip--reader' : ''}`} aria-label={vi ? 'Điều khiển giọng đọc' : 'Narration controls'}><button onClick={() => voice.status === 'paused' ? narration.resume() : narration.pause()}>{voice.status === 'paused' ? (vi ? 'Tiếp tục nghe' : 'Resume') : (vi ? 'Tạm dừng' : 'Pause')}</button><button onClick={narration.stop}>{vi ? 'Dừng' : 'Stop'}</button><button onClick={narration.restart}>{vi ? 'Nghe lại' : 'Restart'}</button><span>{voice.index + 1} / {voice.chunks.length}</span></aside>}
    {!docked && toolbar}
    {panel && <Dialog title={title} close={close}>
      {panel === 'menu' && <nav className="hx-tool-menu">{toolButtons}</nav>}
      {panel === 'help' && <><ol><li><strong>{vi ? 'Chọn điều bạn muốn biết.' : 'Choose what interests you.'}</strong><p>{vi ? 'Chạm địa điểm, thẻ hoặc tìm theo tên. Trong trang địa điểm, chọn khu, chủ đề hoặc câu chuyện.' : 'Select a place or card, or search by name. Then choose an area, theme or story.'}</p></li><li><strong>{vi ? 'Nắm ý chính rồi tự chọn độ sâu.' : 'Start with the key idea, then choose your depth.'}</strong><p>{vi ? 'Bạn có thể đọc, nghe, chọn ảnh/chi tiết hoặc hỏi sâu. Không cần xem hết mọi phần.' : 'Read, listen, select images or details, or explore questions. You do not need to finish every section.'}</p></li><li><strong>{vi ? 'Quay lại, đổi chuyện hoặc mang theo.' : 'Go back, choose another story or take it with you.'}</strong><p>{vi ? 'Đóng cửa sổ để về phần trước. Dùng QR hoặc liên kết để mở lại đúng phần. Nếu không có điện thoại, tiếp tục đọc trên màn hình này.' : 'Close a window to return. Use QR or a link to reopen the selected content. You may continue on this screen without a phone.'}</p></li></ol><button onClick={close}>{vi ? 'Bắt đầu khám phá' : 'Start exploring'}</button></>}
      {panel === 'settings' && <><label>{vi ? 'Ngôn ngữ' : 'Language'}<select aria-label={vi ? 'Ngôn ngữ nội dung' : 'Content language'} value={prefs.lang} onChange={event => setPreferences({ lang: event.target.value as 'vi' | 'en' })}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label>{([
        ['largeText', vi ? 'Cỡ chữ lớn' : 'Larger text'], ['highContrast', vi ? 'Tương phản cao' : 'High contrast'], ['reduceMotion', vi ? 'Giảm chuyển động' : 'Reduce motion'],
      ] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={prefs[key]} onChange={event => setPreferences({ [key]: event.target.checked })} />{label}</label>)}</>}
      {panel === 'story' && <><StoryOverview siteId={siteId} lang={prefs.lang} /><div className="hx-actions"><button onClick={() => open('share')}>{vi ? 'Mang theo / Gửi cho người khác' : 'Take with you / Share'}</button></div></>}
      {panel === 'share' && <ShareContent siteId={siteId} lang={prefs.lang} />}
      {panel === 'listen' && <><p>{vi ? 'Giọng tổng hợp đọc bản chữ của nội dung đang xem. Chọn một câu trong bản chữ để nghe từ đó.' : 'Synthetic narration reads the current written content. Select a sentence to listen from that point.'}</p><div className="hx-actions"><button onClick={() => narration.play(reading, vi ? 'vi-VN' : 'en-US', `reading:${siteId}:${reading.slice(0, 70)}`)}>{vi ? 'Phát / Tiếp tục từ câu đã lưu' : 'Play / Resume saved sentence'}</button><button disabled={!['playing', 'paused'].includes(voice.status)} onClick={() => voice.status === 'paused' ? narration.resume() : narration.pause()}>{voice.status === 'paused' ? (vi ? 'Tiếp tục' : 'Resume') : (vi ? 'Tạm dừng' : 'Pause')}</button><button onClick={narration.stop}>{vi ? 'Dừng' : 'Stop'}</button><button disabled={!voice.chunks.length} onClick={narration.restart}>{vi ? 'Nghe lại từ đầu' : 'Restart'}</button></div>{voice.message && <p role="status">{voice.message}</p>}{voice.chunks.length && voice.key.startsWith(`reading:${siteId}`) ? <ol className="hx-transcript">{voice.chunks.map((chunk, index) => <li key={index} aria-current={index === voice.index}><button onClick={() => narration.seek(index)}>{chunk}</button></li>)}</ol> : <div className="hx-transcript">{reading.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>}</>}
    </Dialog>}
  </>;
  return readerHost ? createPortal(contents, readerHost) : <>{contents}{docked && createPortal(toolbar, dockHost)}</>;
}

