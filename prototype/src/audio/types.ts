import type { SiteId } from '../experience/state';

export type AudioLanguage = 'vi' | 'en';
export interface AudioImage { src: string; caption: string; credit?: string; crop?: string; }
export interface AudioContent {
  id: string;
  siteId: SiteId;
  parentId?: string;
  title: string;
  description: string;
  paragraphs: string[];
  images: AudioImage[];
  sources?: { title: string; url: string }[];
  params: Record<string, string>;
  children: string[];
  audioUrl?: string | null;
}
export interface AudioCatalog { siteId: SiteId; rootId: string; items: AudioContent[]; }
export interface AudioTrack {
  id: string;
  siteId: SiteId;
  title: string;
  audioUrl: string;
  pageUrl: string;
  thumbnail?: string;
  description: string;
  demo: boolean;
  duration?: number;
}
export type PlaybackMode = 'single' | 'playlist';
export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';
export interface AudioState {
  mode: PlaybackMode;
  status: PlaybackStatus;
  tracks: AudioTrack[];
  index: number;
  currentTime: number;
  duration: number;
  rate: number;
  blocked: boolean;
}
