import { AO_BA_OM_OVERVIEW, SITE_ZONES, TIMELINE_EPOCHS, CULTURAL_PEOPLE, CULTURAL_ACTIVITIES, UNTOLD_STORIES, SACRED_ARTIFACTS, HERITAGE_LEGACY } from '../features/ao-ba-om-detail/aoBaOm5PartsData';
import type { AudioCatalog, AudioContent, AudioLanguage } from './types';

export function aoAudioCatalog(lang: AudioLanguage): AudioCatalog {
  const siteId = 'ao-ba-om';
  const root: AudioContent = { id: siteId, siteId, title: AO_BA_OM_OVERVIEW.name[lang], description: AO_BA_OM_OVERVIEW.leadParagraph[lang], paragraphs: [AO_BA_OM_OVERVIEW.leadParagraph[lang]], images: [{ src: AO_BA_OM_OVERVIEW.heroImage, caption: AO_BA_OM_OVERVIEW.name[lang] }], params: { entry: 'ao-kiosk', section: 'section-1-overview' }, children: [] };
  const items = [root];
  function add(key: string, parentId: string, title: string, description: string, paragraphs: string[], image: string, params: Record<string, string>) {
    const item: AudioContent = { id: `${siteId}:${key}`, siteId, parentId, title, description, paragraphs, images: [{ src: image, caption: title }], params: { entry: 'ao-kiosk', ...params }, children: [] };
    items.push(item); items.find(parent => parent.id === parentId)?.children.push(item.id); return item.id;
  }
  const map = add('section:map', siteId, lang === 'vi' ? 'Không gian di tích' : 'Heritage spaces', '', [], root.images[0].src, { section: 'section-2-map' });
  for (const zone of SITE_ZONES) add(`zone:${zone.id}`, map, zone.name[lang], zone.summary[lang], [zone.functionHistory[lang], zone.architecture[lang], zone.eventsAndStories[lang], zone.artifacts[lang]].filter(Boolean), zone.image, { section: 'section-2-map', place: zone.id });
  const history = add('section:history', siteId, lang === 'vi' ? 'Lịch sử và ký ức' : 'History and memory', '', [], root.images[0].src, { section: 'section-3-timeline' });
  for (const epoch of TIMELINE_EPOCHS) {
    const phase = add(`phase:${epoch.id}`, history, epoch.epochName[lang], epoch.description[lang], [epoch.historicalContext[lang]], epoch.cards[0]?.image ?? root.images[0].src, { section: 'section-3-timeline', phase: epoch.id });
    for (const card of epoch.cards) add(`history:${card.id}`, phase, card.title[lang], card.summary[lang], [card.details[lang]], card.image, { section: 'section-3-timeline', phase: epoch.id, topic: card.id });
  }
  const community = add('section:community', siteId, lang === 'vi' ? 'Con người và đời sống văn hóa' : 'People and cultural life', '', [], CULTURAL_PEOPLE[0]?.image ?? root.images[0].src, { section: 'section-4-community' });
  for (const person of CULTURAL_PEOPLE) add(`person:${person.id}`, community, person.name, person.role[lang], [person.community[lang], person.story[lang], person.quote[lang]], person.image, { section: 'section-4-community', person: person.id });
  for (const activity of CULTURAL_ACTIVITIES) add(`activity:${activity.id}`, community, activity.title[lang], activity.description[lang], [activity.timeOccurrence[lang], activity.culturalMeaning[lang]], activity.image, { section: 'section-4-community', topic: activity.id });
  for (const story of UNTOLD_STORIES) add(`story:${story.id}`, community, story.title[lang], story.narrator[lang], [story.oralHistory[lang], story.significance[lang]], story.image, { section: 'section-4-community', story: story.id });
  for (const object of SACRED_ARTIFACTS) add(`object:${object.id}`, community, object.name[lang], object.specialStory[lang], [object.originEra, object.material[lang], object.specialStory[lang], object.todayContinuity[lang]], object.image, { section: 'section-4-community', object: object.id });
  const legacy = add('section:legacy', siteId, lang === 'vi' ? 'Giá trị di sản' : 'Heritage values', '', [], root.images[0].src, { section: 'section-5-legacy' });
  for (const [key, value] of Object.entries(HERITAGE_LEGACY)) {
    if ('content' in value) add(`value:${key}`, legacy, value.title[lang], value.content[lang], ['bullets' in value ? value.bullets.map((text: Record<AudioLanguage, string>) => text[lang]).join('\n') : value.achievements.map((text: Record<AudioLanguage, string>) => text[lang]).join('\n')], root.images[0].src, { section: 'section-5-legacy', value: key });
  }
  return { siteId, rootId: siteId, items };
}
