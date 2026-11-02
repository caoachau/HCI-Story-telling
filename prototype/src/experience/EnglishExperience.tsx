import { useEffect, useMemo, useRef, useState } from 'react';
import { DISCOVERY_STORIES } from '../features/con-chim/data/kt01Stories';
import { STORY_LAYERS } from '../features/con-chim/data/storyLayers';
import { STORIES, PHOTOS, SOURCES } from '../features/den-tho-bac/content';
import { readerChapters } from '../features/den-tho-bac/reader-content';
import { EXHIBITION_TOUR, exhibitionPhoto } from '../features/den-tho-bac/exhibition-content';
import { CON_CHIM_EN, CON_CHIM_LAYERS_EN, MEMORIAL_EN, type EnglishCopy } from './englishStories';
import { narration, useNarration } from './narration';
import { restoredParams, setEntryIssue, updateRoute, useRememberedState, type SiteId } from './state';
import { ShareContent } from './ShareContent';
import { StoryOverview } from './ExperienceTools';
import { ActivityStatus } from './EvidencePanels';
import { useScrollMemory } from './useScrollMemory';

interface Item { id: string; copy: EnglishCopy; photo: string; credit: string; sources: { label: string; url: string }[]; }
const conChimItems: Item[] = DISCOVERY_STORIES.map(story => ({ id: story.id, copy: CON_CHIM_EN[story.id], photo: story.photo.image, credit: story.photo.credit, sources: [{ label: story.source.publisher, url: story.source.url }, { label: 'Photo source', url: story.photo.source }] }));
const memorialItems: Item[] = STORIES.map(story => ({ id: story.id, copy: MEMORIAL_EN[story.id], photo: (PHOTOS[story.photo] || PHOTOS.front).src, credit: (PHOTOS[story.photo] || PHOTOS.front).credit, sources: story.sources.map(key => ({ label: SOURCES[key].name, url: SOURCES[key].url })) }));

export function EnglishExperience({ siteId }: { siteId: 'con-chim' | 'den-tho-bac' }) {
  const items = siteId === 'con-chim' ? conChimItems : memorialItems;
  const initial = useMemo(() => restoredParams(siteId), [siteId]);
  const groups = siteId === 'con-chim' ? [
    { id: 'home', label: 'Introduction', ids: items.map(item => item.id) },
    { id: 'overview', label: 'Overview', ids: items.map(item => item.id) },
    { id: 'explore', label: 'Explore stories', ids: items.map(item => item.id) },
    { id: 'history', label: 'The island’s story', ids: ['ruong-ao', 'ngay-dau'] },
    { id: 'community', label: 'People and everyday life', ids: ['nguoi-dan', 'mam-com', 'duong-lang'] },
    { id: 'experiences', label: 'Experiences', ids: ['banh-xeo', 'mam-com'] },
  ] : [
    { id: 'overview', label: 'Overview', ids: ['map-guide', 'beginning', 'opening', 'preservation'] },
    { id: 'history', label: 'History', ids: items.filter(item => item.id.startsWith('history-')).map(item => item.id) },
    { id: 'spaces', label: 'Places', ids: items.filter(item => item.id.startsWith('map-') && item.id !== 'map-guide').map(item => item.id) },
    { id: 'people', label: 'People and memory', ids: ['witness', 'portrait'] },
    { id: 'activities', label: 'Remembrance', ids: items.filter(item => item.id.startsWith('activity-')).map(item => item.id) },
    { id: 'values', label: 'Heritage values', ids: ['preservation', 'commemoration', 'learning'] },
  ];
  const [section, setSection] = useState(groups.find(group => group.id === initial.get('section'))?.id || groups[0].id);
  const [id, setId] = useState(items.some(item => item.id === initial.get('story')) ? initial.get('story')! : groups.find(group => group.id === section)!.ids[0]);
  const [mode, setMode] = useState(['read', 'questions', 'observe', 'activity', 'takeaway'].includes(initial.get('mode') || '') ? initial.get('mode')! : 'read');
  const [query, setQuery] = useState('');
  const [failed, setFailed] = useState(false), [attempt, setAttempt] = useState(0), [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(Math.max(0, Math.min(2, Number(initial.get('step')) || 0)));
  const [photo, setPhoto] = useState(EXHIBITION_TOUR.some(value => value.number === Number(initial.get('photo'))) ? Number(initial.get('photo')) : 1);
  const [chapter, setChapter] = useState(Math.max(0, Number(initial.get('chapter')) || 0));
  const [question, setQuestion] = useState(initial.get('question') || '');
  const [point, setPoint] = useState(initial.get('point') || '');
  const [labels, setLabels] = useState(true);
  const [interest, setInterest] = useState(['all', 'food', 'landscape', 'local'].includes(initial.get('filter') || '') ? initial.get('filter')! : 'all');
  const [extra, setExtra] = useState(false);
  const [note, setNote] = useState(''), [message, setMessage] = useState('');
  const root = useRef<HTMLElement>(null);
  const item = items.find(item => item.id === id) || items[0];
  const originalStory = siteId === 'den-tho-bac' ? STORIES.find(story => story.id === id) : undefined;
  const imageChapters = originalStory ? readerChapters(originalStory) : [];
  const imageSrc = siteId === 'den-tho-bac' && id === 'map-exhibition' ? exhibitionPhoto(photo).src : imageChapters[Math.min(chapter, imageChapters.length - 1)]?.photo.src || item.photo;
  const voice = useNarration(`${item.copy.title}\n${item.copy.question}\n${item.copy.summary.join('\n')}\n${item.copy.detail}`, 'en-US', `${siteId}:${id}:en`);
  const selectedGroup = groups.find(group => group.id === section)!;
  const visible = items.filter(value => selectedGroup.ids.includes(value.id) && (siteId !== 'con-chim' || interest === 'all' || DISCOVERY_STORIES.find(story => story.id === value.id)?.interest === interest) && `${value.copy.title} ${value.copy.question}`.toLowerCase().includes(query.trim().toLowerCase()));
  const index = items.indexOf(item);
  useScrollMemory(root, `${siteId}:english:${id}:${mode}`);
  useEffect(() => { updateRoute({ section, story: id, mode: mode === 'takeaway' ? 'read' : mode, step: mode === 'activity' ? step : null, question: mode === 'questions' ? question : null, point: mode === 'observe' ? point : null, ...(siteId === 'con-chim' ? { filter: interest } : { photo: id === 'map-exhibition' ? photo : null, chapter }) }, siteId); }, [section, id, mode, step, question, point, interest, photo, chapter, siteId]);
  useEffect(() => { if (initial.get('story') && !items.some(item => item.id === initial.get('story'))) setEntryIssue({ vi: 'Không tìm thấy câu chuyện trong liên kết. Hãy chọn lại từ danh sách.', en: 'The linked story was not found. Choose another story from the list.' }); }, []);
  useEffect(() => { setFailed(false); setZoom(1); setExtra(false); setMessage(''); try { setNote(localStorage.getItem(`con-chim-note:${id}`) || ''); } catch { setNote(''); } }, [id]);
  const choose = (next: string) => { narration.stop(); setEntryIssue(null); setId(next); setMode('read'); if (next !== id) { setPhoto(1); setChapter(0); } root.current?.scrollTo({ top: 0, behavior: 'instant' }); };
  const back = () => { narration.stop(); if (parent !== window) parent.postMessage({ channel: siteId === 'con-chim' ? 'con-chim-detail' : 'den-tho-bac-detail', type: 'host-action', action: 'close' }, location.origin); else location.assign(new URL('index.html', location.href).href); };
  const activity = siteId === 'con-chim' && !!STORY_LAYERS[id]?.activity;
  const layer = siteId === 'con-chim' ? STORY_LAYERS[id] : undefined;
  const englishLayer = CON_CHIM_LAYERS_EN[id];
  const steps = [
    ['Meet the host and say you are new', 'Ask whether the host can show you one suitable action. Watching is also a valid choice.'],
    ['Observe first and ask questions', 'Watch how tools are held and where it is safe to stand. Ask again whenever something is unclear.'],
    ['Try only the action offered', 'Follow the host’s pace and request help when needed. This is an encounter, not a scored competition.'],
  ];
  return <div className="hx-english" lang="en">
    <header className="hx-english-header"><button onClick={back}>Back to map</button><strong>{siteId === 'con-chim' ? 'Cồn Chim · Life with nature' : 'Hồ Chí Minh Memorial · Long Đức'}</strong><span>English interpretation</span><button type="button" onClick={() => { if (parent !== window) parent.postMessage({ channel: siteId === 'con-chim' ? 'con-chim-detail' : 'den-tho-bac-detail', type: 'host-action', action: 'expand' }, location.origin); else { const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); void action.catch(() => setMessage('Fullscreen is unavailable on this device.')); } }}>Toggle fullscreen</button></header>
    <nav className="hx-english-sections" aria-label="Choose an exploration section">{groups.map(group => <button key={group.id} aria-current={section === group.id ? 'page' : undefined} onClick={() => { setSection(group.id); choose(group.ids[0]); }}>{group.label}</button>)}</nav>
    <div className="hx-english-layout"><aside><label>Find a story<input type="search" value={query} onChange={event => setQuery(event.target.value)} /></label>{siteId === 'con-chim' && <label>Interests<select value={interest} onChange={event => setInterest(event.target.value)}><option value="all">All stories</option><option value="food">Food</option><option value="landscape">Landscape</option><option value="local">Local people</option></select></label>}<p role="status">{visible.length} stories</p>{visible.map(value => <button key={value.id} aria-pressed={id === value.id} onClick={() => choose(value.id)}>{value.copy.title}</button>)}{!visible.length && <p>No matching story. Change the words or choose another section.</p>}</aside>
      <main ref={root} className="hx-body" tabIndex={-1}>
        <p className="hx-kicker">Story · About 1–3 minutes · Additional reading is optional</p><h1>{item.copy.title}</h1><p><strong>{item.copy.question}</strong></p>
        <div className="hx-actions" role="group" aria-label="Choose how to explore">{[['read', 'Key ideas'], ['questions', 'Questions'], ['observe', 'Observe the image'], ...(activity ? [['activity', 'Preview an activity']] : []), ['takeaway', 'Take this story with you']].map(([value, label]) => <button key={value} aria-pressed={mode === value} onClick={() => { narration.stop(); setMode(value); }}>{label}</button>)}</div>
        {mode === 'takeaway' ? <ShareContent siteId={siteId} lang="en" /> : mode === 'observe' ? <section><div className="hx-actions"><button disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}>Zoom out</button><span>{Math.round(zoom * 100)}%</span><button disabled={zoom >= 2.5} onClick={() => setZoom(value => Math.min(2.5, value + .25))}>Zoom in</button><button onClick={() => setZoom(1)}>Whole image</button><button aria-pressed={labels} onClick={() => setLabels(value => !value)}>Image labels</button></div><div className="hx-english-photo" tabIndex={0} aria-label="Scrollable image for observation">{!failed ? <div style={{ width: `${zoom * 100}%`, position: 'relative' }}><img key={attempt} src={imageSrc} alt={item.copy.title} onError={() => setFailed(true)} style={{ width: '100%', display: 'block' }} />{labels && layer?.points.map((value, i) => <button key={value.id} style={{ position: 'absolute', left: `${value.x}%`, top: `${value.y}%`, minWidth: 44, borderRadius: '50%', background: '#fff' }} aria-label={englishLayer.points[value.id][0]} aria-pressed={point === value.id} onClick={() => setPoint(value.id)}>{i + 1}</button>)}</div> : <div role="status"><p>The image could not load. The written story remains available.</p><button onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>Retry image</button></div>}</div><p>Image credit: {item.credit}</p>{siteId === 'den-tho-bac' && <div className="hx-actions">{id === 'map-exhibition' ? <><button disabled={EXHIBITION_TOUR.findIndex(value => value.number === photo) <= 0} onClick={() => { const index = EXHIBITION_TOUR.findIndex(value => value.number === photo); setPhoto(EXHIBITION_TOUR[Math.max(0, index - 1)].number); }}>Previous photograph</button><span>{photo} / 93</span><button disabled={EXHIBITION_TOUR.findIndex(value => value.number === photo) >= EXHIBITION_TOUR.length - 1} onClick={() => { const index = EXHIBITION_TOUR.findIndex(value => value.number === photo); setPhoto(EXHIBITION_TOUR[Math.min(EXHIBITION_TOUR.length - 1, index + 1)].number); }}>Next photograph</button></> : <><button disabled={chapter === 0} onClick={() => setChapter(value => Math.max(0, value - 1))}>Previous view</button><span>{Math.min(chapter + 1, imageChapters.length)} / {imageChapters.length}</span><button disabled={chapter >= imageChapters.length - 1} onClick={() => setChapter(value => Math.min(imageChapters.length - 1, value + 1))}>Next view</button></>}</div>}{layer ? <><div className="hx-actions">{layer.points.map(value => <button key={value.id} aria-pressed={point === value.id} onClick={() => setPoint(value.id)}>{englishLayer.points[value.id][0]}</button>)}</div><p>{englishLayer.points[point]?.[1] || 'Choose a detail on the image or in the list.'}</p></> : <><p>{item.copy.question}</p><p>{item.copy.detail}</p></>}</section> : mode === 'activity' && activity ? <section><h2>Preview before joining</h2><ActivityStatus siteId={siteId} lang="en" /><p>Confirm the current host, timing and available activity at the reception point. These are suggestions for a first visit, not a booking or an approved operating schedule.</p><h3>What to ask about</h3><ul><li>Ingredients available on the day</li><li>Tools and a safe place to stand</li><li>One action suitable for a beginner</li></ul><div className="hx-actions">{steps.map((value, i) => <button key={value[0]} aria-pressed={step === i} onClick={() => setStep(i)}>Step {i + 1}</button>)}</div><h3>{steps[step][0]}</h3><p>{steps[step][1]}</p><div className="hx-actions"><button disabled={step === 0} onClick={() => setStep(value => value - 1)}>Previous step</button><button disabled={step === 2} onClick={() => setStep(value => value + 1)}>Next step</button></div><a href={STORY_LAYERS[id].activity!.source.url} target="_blank" rel="noopener noreferrer">Activity reference</a></section> : <>
          {mode === 'questions' ? <section><h2>Questions to explore</h2>{layer ? layer.questions.map(value => <section key={value.id}><button type="button" aria-expanded={question === value.id} onClick={() => setQuestion(question === value.id ? '' : value.id)}>{englishLayer.questions[value.id][0]}</button>{question === value.id && <div><p>{englishLayer.questions[value.id][1]}</p><small>{value.kind === 'Gợi ý hỏi trực tiếp' ? 'A suggested question for a host; not recorded testimony.' : 'Interpretation from a published reference.'}</small>{value.source && <p><a href={value.source.url} target="_blank" rel="noopener noreferrer">Read the reference</a></p>}</div>}</section>) : <><h3>{item.copy.question}</h3><p>{item.copy.detail}</p></>}<p>You can use these questions to begin a conversation with the current host.</p></section> : <><ul>{item.copy.summary.map(value => <li key={value}>{value}</li>)}</ul><div className="hx-actions"><button onClick={voice.play}>{voice.status === 'playing' || voice.status === 'paused' ? 'Stop narration' : 'Listen to this story'}</button><button disabled={!['playing', 'paused'].includes(voice.status)} onClick={voice.pause}>{voice.status === 'paused' ? 'Resume' : 'Pause'}</button></div>{voice.message && <p role="status">{voice.message}</p>}<details open={extra} onToggle={event => setExtra(event.currentTarget.open)}><summary>Read further</summary><p>{item.copy.detail}</p></details></>}
          <details><summary>References, image and recording</summary><p>Editorial interpretation based on the references below. Speech is synthesized from the written English text. It is not a recording of a resident or witness.</p><p>Image credit: {item.credit}</p>{item.sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></p>)}<p>English editorial version: 28 October 2026. A local content and permission review has not been recorded.</p></details>
          {siteId === 'con-chim' && initial.get('portable') === '1' && <details><summary>Your optional note</summary><label>Something you would like to remember<textarea maxLength={500} rows={4} value={note} onChange={event => setNote(event.target.value)} /></label><p>{note.length}/500 characters · Saved only on this device when you choose Save.</p><div className="hx-actions"><button onClick={() => { try { if (note.trim()) localStorage.setItem(`con-chim-note:${id}`, note); else localStorage.removeItem(`con-chim-note:${id}`); setMessage('Saved on this device. Nothing was sent.'); } catch { setMessage('Device storage is unavailable. You can copy your note.'); } }}>Save note</button><button onClick={() => { try { localStorage.removeItem(`con-chim-note:${id}`); setNote(''); setMessage('Note removed.'); } catch { setMessage('The note could not be removed. Please retry.'); } }}>Delete note</button></div><p role="status">{message}</p></details>}
        </>}
        <div className="hx-actions"><button onClick={() => choose(items[(index - 1 + items.length) % items.length].id)}>Previous story</button><button onClick={() => choose(items[(index + 1) % items.length].id)}>Next story</button></div>
        <details><summary>Visiting, evidence and accessibility information</summary><StoryOverview siteId={siteId} lang="en" /></details>
      </main></div>
  </div>;
}
