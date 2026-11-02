import { DISCOVERY_STORIES } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';

export type ReaderMode = 'read' | 'questions' | 'observe' | 'activity' | 'takeaway';
export interface StoryContext { mode: Exclude<ReaderMode,'takeaway'>; question?: string; point?: string; step?: number; }
export interface StoryLinkState extends StoryContext { storyId: string; portable: boolean; }

export function readStoryLink(search: string): StoryLinkState | null {
  const params = new URLSearchParams(search), storyId = params.get('story') || '';
  if (!DISCOVERY_STORIES.some(story => story.id === storyId)) return null;
  const layer = STORY_LAYERS[storyId];
  const mode = params.get('mode') === 'observe' ? 'observe' : params.get('mode') === 'questions' ? 'questions' : params.get('mode') === 'activity' && layer.activity ? 'activity' : 'read';
  const question = layer.questions.some(item => item.id === params.get('question')) ? params.get('question')! : undefined;
  const point = layer.points.some(item => item.id === params.get('point')) ? params.get('point')! : undefined;
  const step = Number(params.get('step'));
  return { storyId, portable:params.get('portable') === '1', mode, question, point, step:layer.activity && Number.isInteger(step) && step >= 0 && step < layer.activity.steps.length ? step : 0 };
}

export function publicStoryLink(storyId: string, context: StoryContext, currentUrl: string, configuredUrl = import.meta.env.VITE_CON_CHIM_PUBLIC_URL || ''): string | null {
  if (!DISCOVERY_STORIES.some(story => story.id === storyId)) return null;
  try {
    const target = configuredUrl ? new URL(configuredUrl) : new URL('con-chim.html', import.meta.env.VITE_PUBLIC_URL || currentUrl);
    const hostname = target.hostname.toLowerCase();
    // The kiosk cannot give visitors a useful link to its own loopback address.
    if (!['https:','http:'].includes(target.protocol) || target.username || target.password || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '[::1]' || hostname === '0.0.0.0' || hostname.startsWith('127.')) return null;
    target.search = ''; target.hash = '';
    target.searchParams.set('story', storyId); target.searchParams.set('portable','1');
    if (context.mode !== 'read') target.searchParams.set('mode',context.mode);
    if (context.mode === 'questions' && context.question) target.searchParams.set('question',context.question);
    if (context.mode === 'observe' && context.point) target.searchParams.set('point',context.point);
    if (context.mode === 'activity' && context.step) target.searchParams.set('step',String(context.step));
    return target.toString();
  } catch { return null; }
}
