/** One override per stable content ID; never duplicate MP3 URLs in components. */
export const AUDIO_CONFIG: Record<string, { audioUrl: string | null }> = {
  // 'bao-tang-khmer:object:archaeology:sandstone': { audioUrl: '/audio/sandstone.mp3' },
};
export const DEMO_AUDIO_URL = `${import.meta.env.BASE_URL}audio/demo.mp3`;
// Safe default: demo is enabled in development, disabled in production builds.
export const AUDIO_DEMO_ENABLED = import.meta.env.VITE_AUDIO_DEMO_ENABLED === 'true'
  || (import.meta.env.VITE_AUDIO_DEMO_ENABLED === undefined && import.meta.env.DEV);

export function resolveAudio(content: { id: string; audioUrl?: string | null }, demoEnabled = AUDIO_DEMO_ENABLED) {
  const configured = AUDIO_CONFIG[content.id];
  const official = configured ? configured.audioUrl : content.audioUrl;
  if (official) return { audioUrl: official, demo: false };
  // An explicit null override disables audio for an individual content item.
  if (configured?.audioUrl === null) return null;
  return demoEnabled ? { audioUrl: DEMO_AUDIO_URL, demo: true } : null;
}
