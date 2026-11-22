import { useState } from 'react';
import { Headphones, QrCode } from 'lucide-react';
import { useAudioContent } from './useAudioContent';
import { audioTrack, contentPlaylist } from './catalog';
import { audioPlayer } from './player';
import { AudioQRDialog } from './AudioQRDialog';
import { AudioPlayer } from './AudioPlayer';
import { ListenButton, ownsAudio } from './ListenButton';
import { useAudioPlayer } from './player';
import type { AudioLanguage } from './types';
import type { SiteId } from '../experience/state';
export function InlineAudioActions({ lang, id, siteId = 'bao-tang-khmer' }: { lang: AudioLanguage; id?: string; siteId?: SiteId }) {
  const [open, setOpen] = useState(false);
  const state = useAudioPlayer();
  const { catalog, content, params } = useAudioContent(siteId, lang, id ? `listen=${encodeURIComponent(id)}` : undefined);
  if (!catalog || !content) return null;
  const tracks = contentPlaylist(catalog, content, lang), track = audioTrack(content, lang);
  const queue = content.children.length ? tracks : track ? [track] : [];
  const mode = content.children.length ? 'playlist' : 'single';
  return <div className="ha-inline-actions" data-inline-audio={content.id}>
    <div className="ha-inline-buttons">
    {queue.length > 0 && <ListenButton tracks={queue} mode={mode} lang={lang} />}
    <button type="button" onClick={() => setOpen(true)} aria-label={lang === 'vi' ? 'Mã QR phần này' : 'QR for this section'} title={lang === 'vi' ? 'Mã QR phần này' : 'QR for this section'}><QrCode /><span>QR</span></button>
    </div>
    {ownsAudio(queue, mode, state) && <AudioPlayer lang={lang} compact inline onClose={() => audioPlayer.stop()} />}
    {open && <AudioQRDialog siteId={siteId} lang={lang} search={params.toString()} onClose={() => setOpen(false)} />}
  </div>;
}
