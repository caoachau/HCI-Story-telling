import { HERITAGE_SITES } from '../data/heritageSites';
import { quickLocationContent } from '../data/locationQuickContent';
import { resolveAudio } from './config';
import type { AudioCatalog, AudioContent, AudioLanguage, AudioTrack } from './types';
import type { SiteId } from '../experience/state';

export async function loadAudioCatalog(siteId: SiteId, lang: AudioLanguage): Promise<AudioCatalog> {
  if (siteId === 'bao-tang-khmer') return (await import('./museumCatalog')).museumAudioCatalog(lang);
  if (siteId === 'ao-ba-om') return (await import('./aoCatalog')).aoAudioCatalog(lang);
  const site = HERITAGE_SITES.find(item => item.id === siteId)!;
  const quick = quickLocationContent(site, lang);
  const root: AudioContent = { id: siteId, siteId, title: lang === 'vi' ? site.name : site.englishName, description: quick.summary, paragraphs: [quick.summary, quick.visit].filter(Boolean), images: quick.photos.map(photo => ({ src: photo.src, caption: photo.caption[lang], credit: photo.credit })), params: {}, children: [] };
  const items: AudioContent[] = [root];
  const add = (item: AudioContent) => { items.push(item); items.find(parent => parent.id === item.parentId)?.children.push(item.id); };
  if (siteId === 'con-chim') {
    const { INTERESTS, DISCOVERY_STORIES } = await import('../features/con-chim/data/kt01Stories');
    const english = lang === 'en' ? (await import('../experience/englishStories')).CON_CHIM_EN : undefined;
    for (const group of INTERESTS) {
      const parentId = `${siteId}:group:${group.id}`;
      add({ ...root, id: parentId, parentId: root.id, title: lang === 'vi' ? group.label : { food: 'Food', landscape: 'Landscape', local: 'Local stories' }[group.id], description: lang === 'vi' ? group.description : '', paragraphs: lang === 'vi' ? [group.description] : [], children: [], params: { section: 'explore', interest: group.id } });
      for (const story of DISCOVERY_STORIES.filter(item => item.interest === group.id)) {
        const copy = english?.[story.id];
        add({ id: `${siteId}:story:${story.id}`, siteId, parentId, title: copy?.title ?? story.title, description: copy?.question ?? story.teaser, paragraphs: copy ? [...copy.summary, copy.detail] : [...story.summary, story.detail, story.takeaway], images: [{ src: story.photo.image, caption: copy?.title ?? story.photo.caption, credit: story.photo.credit }], sources: [{ title: story.source.title, url: story.source.url }], params: { section: 'explore', interest: group.id, story: story.id }, children: [] });
      }
    }
  } else if (siteId === 'den-tho-bac') {
    const { SECTIONS, STORIES, PHOTOS, SOURCES } = await import('../features/den-tho-bac/content');
    const { readerChapters } = await import('../features/den-tho-bac/reader-content');
    const english = lang === 'en' ? (await import('../experience/englishStories')).MEMORIAL_EN : undefined;
    const sectionLabels = { overview: 'Overview', history: 'History', spaces: 'Memorial spaces', people: 'People and memory', activities: 'Commemorative activities', values: 'Heritage values' };
    for (const section of SECTIONS) add({ ...root, id: `${siteId}:section:${section.id}`, parentId: root.id, title: lang === 'vi' ? section.label : sectionLabels[section.id], children: [], params: { section: section.id } });
    for (const story of STORIES) {
      const section = story.id.startsWith('history-') || story.eyebrow.startsWith('Lịch sử') ? 'history' : story.id.startsWith('map-') || /^(Không gian|Sơ đồ|Khám phá|Thiên nhiên)/.test(story.eyebrow) ? 'spaces' : /witness|portrait/.test(story.id) ? 'people' : story.id.startsWith('activity-') || /birthday|commemoration|visit/.test(story.id) ? 'activities' : story.eyebrow.startsWith('Giá trị') ? 'values' : 'overview';
      const chapters = readerChapters(story);
      const image = PHOTOS[story.photo];
      const copy = english?.[story.id];
      add({ id: `${siteId}:story:${story.id}`, siteId, parentId: `${siteId}:section:${section}`, title: copy?.title ?? story.title, description: copy?.question ?? story.lead, paragraphs: copy ? [...copy.summary, copy.detail] : chapters.flatMap(chapter => [chapter.title, ...chapter.paragraphs]), images: chapters.length ? chapters.map(chapter => ({ src: chapter.photo.src, caption: copy?.title ?? chapter.photo.caption, credit: chapter.photo.credit })) : image ? [{ src: image.src, caption: copy?.title ?? image.caption, credit: image.credit }] : [], sources: story.sources.map(id => ({ title: SOURCES[id].title, url: SOURCES[id].url })), params: { section, story: story.id }, children: [] });
    }
    root.children = root.children.filter(id => items.find(item => item.id === id)?.children.length);
  } else {
    site.chapters.forEach((chapter, index) => add({ id: `${siteId}:chapter:${chapter.id ?? index}`, siteId, parentId: root.id, title: lang === 'vi' ? chapter.title : chapter.englishTitle, description: lang === 'vi' ? chapter.summary : chapter.englishSummary, paragraphs: [lang === 'vi' ? chapter.summary : chapter.englishSummary, lang === 'vi' ? chapter.details : chapter.englishDetails].filter(Boolean), images: [{ src: chapter.photoUrl || quick.photos[index % Math.max(1, quick.photos.length)]?.src || site.heroImage, caption: chapter.photoCaption || (lang === 'vi' ? chapter.title : chapter.englishTitle) }], params: { chapter: String(chapter.id ?? index) }, children: [] }));
  }
  return { siteId, rootId: root.id, items };
}

export function contentForRoute(catalog: AudioCatalog, params: URLSearchParams): AudioContent {
  const selected = catalog.items.find(item => item.id === params.get('listen'));
  if (selected) return selected;
  const root = catalog.items.find(item => item.id === catalog.rootId)!;
  // Only consider selectors belonging to the active screen, not remembered fields
  // from other screens (museum routes intentionally preserve all screen choices).
  const section = params.get('section');
  const keys = catalog.siteId === 'bao-tang-khmer'
    ? section === 'tour' ? ['culture', 'interest'] : section === 'map' ? ['object', 'point', 'place', 'tab'] : section === 'timeline' ? ['topic', 'phase'] : section === 'exhibitions' ? ['value'] : ['overview']
    : ['object', 'story', 'chapter', 'person', 'topic', 'place', 'phase', 'value', 'interest'];
  for (const key of keys) {
    const value = params.get(key);
    if (!value) continue;
    const result = catalog.items.find(item => item.params[key] === value && (!section || !item.params.section || item.params.section === section));
    if (result) return result;
  }
  return catalog.items.find(item => item.params.section === section && item.children.length) ?? root;
}

export function audioPageUrl(content: AudioContent, lang: AudioLanguage, audio = true, base = location.href, preserve?: URLSearchParams) {
  const pages: Partial<Record<SiteId, string>> = { 'bao-tang-khmer': 'bao-tang-khmer.html', 'den-tho-bac': 'den-tho-bac.html', 'con-chim': 'con-chim.html', 'ao-ba-om': 'ao-ba-om.html' };
  const target = new URL(pages[content.siteId] ?? 'index.html', base);
  // Keep caller-specific query data, while content-owned selectors win.
  if (preserve) target.search = preserve.toString();
  for (const key of ['section', 'reader', 'overview', 'place', 'tab', 'culture', 'interest', 'object', 'point', 'topic', 'phase', 'value', 'story', 'chapter']) target.searchParams.delete(key);
  for (const [key, value] of Object.entries(content.params)) target.searchParams.set(key, value);
  target.searchParams.set('site', content.siteId);
  target.searchParams.set('lang', lang);
  if (audio) { target.searchParams.set('view', 'audio'); target.searchParams.set('listen', content.id); }
  else { target.searchParams.delete('listen'); target.searchParams.set('view', 'detail'); target.searchParams.set('detail', '1'); }
  target.searchParams.delete('tools');
  target.searchParams.delete('audioBlock');
  target.searchParams.delete('audioKey');
  return target.href;
}

export function audioTrack(content: AudioContent, lang: AudioLanguage): AudioTrack | null {
  const resolved = resolveAudio(content);
  return resolved ? { id: content.id, siteId: content.siteId, title: content.title, description: content.description, thumbnail: content.images[0]?.src, pageUrl: audioPageUrl(content, lang), ...resolved } : null;
}

export function contentPlaylist(catalog: AudioCatalog, content: AudioContent, lang: AudioLanguage): AudioTrack[] {
  const ordered: AudioContent[] = [];
  const seen = new Set<string>();
  function visit(item: AudioContent) {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    // Groups without an official overview MP3 start directly with their children.
    if (!item.children.length) ordered.push(item);
    else {
      const track = resolveAudio(item, false);
      if (track) ordered.push(item);
      for (const id of item.children) { const child = catalog.items.find(entry => entry.id === id); if (child) visit(child); }
    }
  }
  visit(content);
  return ordered.map(item => audioTrack(item, lang)).filter((track): track is AudioTrack => !!track);
}
