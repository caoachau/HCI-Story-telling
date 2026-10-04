export type AoLanguage = 'vi' | 'en';

export interface SiteZone {
  id: string;
  code: string;
  name: { vi: string; en: string };
  category: 'water' | 'forest' | 'architecture' | 'museum' | 'festival' | 'entrance';
  summary: { vi: string; en: string };
  functionHistory: { vi: string; en: string }; // Nơi này là gì, từng được dùng để làm gì
  architecture: { vi: string; en: string };
  eventsAndStories: { vi: string; en: string };
  artifacts: { vi: string; en: string };
  coordinates: { x: number; y: number }; // percentage on interactive map canvas
  polygonPoints: string; // SVG polygon coordinates
  highlightColor: string;
  image: string;
  pastImage?: string;
  pastYear?: string;
  pastDescription?: { vi: string; en: string };
  has3DModel?: boolean;
  modelType?: 'boat' | 'roots' | 'temple' | 'pottery';
  has360View?: boolean;
  hotspots?: {
    id: string;
    label: { vi: string; en: string };
    x: number;
    y: number;
    description: { vi: string; en: string };
  }[];
}

export interface TimelineSubCard {
  id: string;
  title: { vi: string; en: string };
  timeTag: string;
  position: 'top' | 'bottom';
  offsetPercent: number; // position along the horizontal timeline
  image: string;
  caption: { vi: string; en: string };
  summary: { vi: string; en: string };
  details: { vi: string; en: string };
  categoryTag: 'origin' | 'milestone' | 'historical_event' | 'transformation' | 'preservation';
}

export interface TimelineEpoch {
  id: string;
  epochName: { vi: string; en: string };
  timeSpan: string;
  tag: 'origin' | 'milestone' | 'historical_event' | 'transformation' | 'preservation';
  tagLabel: { vi: string; en: string };
  headline: { vi: string; en: string };
  description: { vi: string; en: string };
  historicalContext: { vi: string; en: string };
  cards: TimelineSubCard[];
}

export interface CulturalPerson {
  id: string;
  name: string;
  role: { vi: string; en: string };
  community: { vi: string; en: string };
  story: { vi: string; en: string };
  quote: { vi: string; en: string };
  image: string;
  badge: { vi: string; en: string };
}

export interface CulturalActivity {
  id: string;
  title: { vi: string; en: string };
  timeOccurrence: { vi: string; en: string };
  type: 'festival' | 'ritual' | 'craft' | 'music';
  description: { vi: string; en: string };
  culturalMeaning: { vi: string; en: string };
  image: string;
}

export interface UntoldStory {
  id: string;
  title: { vi: string; en: string };
  narrator: { vi: string; en: string };
  oralHistory: { vi: string; en: string };
  significance: { vi: string; en: string };
  image: string;
}

export interface SacredArtifact {
  id: string;
  name: { vi: string; en: string };
  originEra: string;
  material: { vi: string; en: string };
  specialStory: { vi: string; en: string };
  todayContinuity: { vi: string; en: string };
  image: string;
}

export interface HeritageLegacyData {
  historicalValue: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
    bullets: { vi: string; en: string }[];
  };
  architecturalArtisticValue: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
    bullets: { vi: string; en: string }[];
  };
  culturalSpiritualValue: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
    bullets: { vi: string; en: string }[];
  };
  todayPresence: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
    bullets: { vi: string; en: string }[];
  };
  conservationAndContinuity: {
    title: { vi: string; en: string };
    content: { vi: string; en: string };
    achievements: { vi: string; en: string }[];
  };
  timelessMessage: {
    quote: { vi: string; en: string };
    author: { vi: string; en: string };
    subtext: { vi: string; en: string };
  };
}
