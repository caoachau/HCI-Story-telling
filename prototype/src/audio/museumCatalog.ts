import { KHMER_MUSEUM_NAME } from '../data/museumIdentity';
import { artwork } from '../features/museo-detail/data';
import { khmerOverview, khmerOverviewStories, khmerOverviewSources } from '../features/museo-detail/khmerOverview';
import { overviewViewerMedia } from '../features/museo-detail/khmerOverviewExhibition';
import { khmerOverviewNarration, type OverviewNarrationTopic } from '../features/museo-detail/khmerOverviewNarration';
import { khmerPlaces, khmerPlacePhotos, khmerPlaceSources, khmerPlaceZones } from '../features/museo-detail/khmerPlaces';
import { khmerDiscoveryTabs, type DiscoveryObject } from '../features/museo-detail/khmerDiscovery';
import { khmerGroundsPoints } from '../features/museo-detail/khmerGroundsPoints';
import { khmerCultureGroups, khmerCulturePhotos, khmerCultureSources, type CulturePhotoId } from '../features/museo-detail/khmerCulture';
import { cultureGroupTopics, cultureGroupCovers, cultureGroupIntroductions } from '../features/museo-detail/khmerCultureCollections';
import { khmerHistoryPhases, khmerHistoryPhotos, khmerHistorySources } from '../features/museo-detail/khmerHistory';
import { khmerLegacyValues, khmerLegacySources } from '../features/museo-detail/khmerLegacy';
import type { AudioCatalog, AudioContent, AudioImage, AudioLanguage } from './types';

export function museumAudioCatalog(lang: AudioLanguage): AudioCatalog {
  const siteId = 'bao-tang-khmer';
  const items: AudioContent[] = [];
  const id = (key: string) => `${siteId}:${key}`;
  const photos = (keys: CulturePhotoId[]): AudioImage[] => keys.map(key => {
    const photo = khmerCulturePhotos[key];
    return { src: photo.src, caption: photo.caption[lang], credit: photo.author, crop: key === 'userMask' ? '330 72 550 455' : undefined };
  });
  const placePhotos = (keys: (keyof typeof khmerPlacePhotos)[]): AudioImage[] => keys.map(key => {
    const photo = khmerPlacePhotos[key];
    return { src: photo.src, caption: photo.caption[lang], credit: photo.author };
  });
  function add(key: string, parent: string | undefined, title: string, description: string, params: Record<string, string>, images: AudioImage[] = [], paragraphs: string[] = [], sources?: AudioContent['sources']) {
    const item: AudioContent = { id: key === 'root' ? siteId : id(key), siteId, parentId: parent === 'root' ? siteId : parent ? id(parent) : undefined, title, description, params, images, paragraphs, sources, children: [] };
    items.push(item);
    items.find(parent => parent.id === item.parentId)?.children.push(item.id);
    return item;
  }
  add('root', undefined, KHMER_MUSEUM_NAME[lang], khmerOverviewStories.introduction.paragraphs[0][lang], {}, placePhotos(['facade']), khmerOverviewStories.introduction.paragraphs.map(text => text[lang]));
  const labels = lang === 'vi' ? ['Tổng quan', 'Điểm khám phá', 'Lịch sử phát triển', 'Văn hóa · Hoạt động · Con người', 'Giá trị di sản'] : ['Overview', 'Discovery points', 'Museum history', 'Culture · Activities · People', 'Heritage values'];
  ['overview', 'map', 'timeline', 'tour', 'exhibitions'].forEach((section, index) => add(`section:${section}`, 'root', labels[index], '', { section }, placePhotos(['facade'])));
  for (const [key, story] of Object.entries(khmerOverviewStories)) {
    const narration = khmerOverviewNarration[key as OverviewNarrationTopic];
    const gallery = overviewViewerMedia[key as keyof typeof overviewViewerMedia].filter(media => media.kind === 'photo');
    const paragraphs = [...story.paragraphs.map(text => text[lang]), ...(story.sections?.flatMap(part => [part.title[lang], part.text[lang]]) ?? [])].filter(Boolean);
    const item = add(`overview:${key}`, narration ? 'section:overview' : undefined, story.title[lang], paragraphs.find(text => text.length > 80) ?? '', { section: 'overview', reader: 'overview', overview: key }, gallery.map(media => ({ src: media.src, caption: media.caption[lang], credit: media.credit[lang] })), paragraphs, story.sources.map(source => khmerOverviewSources[source]));
    if (narration && lang === 'vi') item.audioUrl = `${import.meta.env.BASE_URL}audio/khmer-overview/${narration.audioFile}`;
  }
  for (const tab of khmerDiscoveryTabs) {
    const zone = khmerPlaceZones.find(zone => zone.id === tab.id)!;
    add(`zone:${tab.id}`, 'section:map', zone.title[lang], zone.description[lang], { section: 'map', tab: tab.id }, placePhotos(tab.aerial ? [tab.aerial.photo] : tab.entries[0]?.cover ? [tab.entries[0].cover] : []));
    if (tab.id === 'grounds') {
      for (const point of khmerGroundsPoints) add(`point:${point.id}`, 'zone:grounds', point.title[lang], point.summary[lang], { section: 'map', tab: 'grounds', point: point.id, place: point.placeId ?? 'entrance' }, point.images.map(image => ({ src: image.src, caption: image.caption[lang], credit: image.credit })), point.sections.flatMap(section => [section.title[lang], section.text[lang]]), point.sources.map(source => ({ title: source.title[lang], url: source.url })));
      continue;
    }
    for (const entry of tab.entries.filter(item => !item.trial)) {
      const place = khmerPlaces.find(place => place.id === entry.placeId);
      if (!place) continue;
      const parent = `place:${tab.id}:${entry.id}`;
      add(parent, `zone:${tab.id}`, place.title[lang], place.short[lang], { section: 'map', tab: tab.id, place: place.id, reader: 'place' }, placePhotos(entry.cover ? [entry.cover, ...entry.photos.filter(key => key !== entry.cover)] : place.gallery), place.paragraphs.map(text => text[lang]), place.sources.map(key => ({ title: khmerPlaceSources[key].title[lang], url: khmerPlaceSources[key].url })));
      const objects: DiscoveryObject[] = [...entry.objects, ...entry.photos.filter(photo => !entry.objects.some(object => object.photo === photo)).map(photo => ({ id: photo, photo }))];
      for (const object of objects) {
        const photo = khmerPlacePhotos[object.photo];
        const objectPlace = object.placeId ? khmerPlaces.find(place => place.id === object.placeId) : undefined;
        add(`object:${entry.id}:${object.id}`, parent, photo.title[lang], photo.caption[lang], { section: 'map', tab: tab.id, place: entry.placeId, object: object.id }, placePhotos([object.photo]), object.story ? object.story.sections.flatMap(section => [section.title[lang], section.text[lang]]) : objectPlace ? objectPlace.paragraphs.map(text => text[lang]) : [photo.caption[lang]], object.story?.sources.map(source => ({ title: source.title[lang], url: source.url })));
      }
    }
  }
  const locatedPlaces = new Set(khmerDiscoveryTabs.flatMap(tab => tab.entries.filter(entry => !entry.trial).flatMap(entry => [entry.placeId, ...entry.objects.flatMap(object => object.placeId ? [object.placeId] : [])])));
  const remaining = khmerPlaces.filter(place => !locatedPlaces.has(place.id));
  if (remaining.length) {
    add('unlocated', 'section:map', lang === 'vi' ? 'Hiện vật và câu chuyện' : 'Objects and stories', '', { section: 'map' });
    for (const place of remaining) add(`record:${place.id}`, 'unlocated', place.title[lang], place.short[lang], { section: 'map', place: place.id, reader: 'place' }, placePhotos(place.gallery), place.paragraphs.map(text => text[lang]), place.sources.map(key => ({ title: khmerPlaceSources[key].title[lang], url: khmerPlaceSources[key].url })));
  }
  for (const [index, phase] of khmerHistoryPhases.entries()) {
    const parent = `phase:${phase.id}`;
    const photo = khmerHistoryPhotos[phase.photo];
    add(parent, 'section:timeline', phase.title[lang], phase.description[lang], { section: 'timeline', phase: String(index) }, [{ src: photo.src, caption: photo.caption[lang], credit: photo.author }], [phase.description[lang]]);
    for (const topic of phase.topics) {
      const photo = khmerHistoryPhotos[topic.photo];
      add(`history:${topic.id}`, parent, topic.title[lang], topic.summary[lang], { section: 'timeline', phase: String(index), topic: topic.id, reader: 'history' }, [{ src: photo.src, caption: photo.caption[lang], credit: photo.author }], topic.paragraphs.map(text => text[lang]), topic.sources.map(key => ({ title: khmerHistorySources[key].title[lang], url: khmerHistorySources[key].url })));
    }
  }
  for (const group of khmerCultureGroups) {
    add(`group:${group.id}`, 'section:tour', group.title[lang], cultureGroupIntroductions[group.id][lang], { section: 'tour', interest: group.id }, photos([cultureGroupCovers[group.id]]));
    for (const topic of cultureGroupTopics(group.id)) add(`culture:${topic.id}`, `group:${group.id}`, topic.title[lang], topic.summary[lang], { section: 'tour', culture: topic.id, interest: group.id, reader: 'culture' }, photos(topic.gallery), topic.paragraphs.map(text => text[lang]), topic.sources.map(key => ({ title: khmerCultureSources[key].title[lang], url: khmerCultureSources[key].url })));
  }
  for (const value of khmerLegacyValues) add(`value:${value.id}`, 'section:exhibitions', value.title[lang], value.summary[lang], { section: 'exhibitions', value: value.id, reader: 'legacy' }, photos(value.gallery), [value.lead[lang], ...value.chapters.flatMap(chapter => [chapter.title[lang], ...chapter.paragraphs.map(text => text[lang])]), value.takeaway[lang]], value.sources.map(key => ({ title: khmerLegacySources[key].title[lang], url: khmerLegacySources[key].url })));
  return { siteId, rootId: siteId, items };
}
