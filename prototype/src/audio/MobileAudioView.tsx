import { ListenButton } from "./ListenButton";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Headphones, Play, QrCode } from 'lucide-react';
import { audioPageUrl, audioTrack, contentPlaylist } from './catalog';
import { audioPlayer, useAudioPlayer } from './player';
import { useAudioContent } from './useAudioContent';
import { AudioPlayer } from './AudioPlayer';
import { AudioImage } from './AudioImage';
import { AudioQRDialog } from './AudioQRDialog';
import { HERITAGE_SITES } from '../data/heritageSites';
import { preferences } from '../experience/preferences';
import type { SiteId } from '../experience/state';
import type { AudioContent } from './types';
import '../components/conChimFonts.css';
import './audio.css';

export default function MobileAudioView({ siteId }: { siteId: SiteId }) {
  const lang = preferences().lang;
  const vi = lang === 'vi';
  const { catalog, content, params, error, retry } = useAudioContent(siteId, lang);
  const state = useAudioPlayer();
  const [qr, setQr] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const layout = useRef<HTMLDivElement>(null);
  const playerHost = useRef<HTMLDivElement>(null);
  const session = state.tracks.length > 0;
  const previousId = useRef<string | undefined>(undefined);
  const site = HERITAGE_SITES.find(item => item.id === siteId)!;
  useEffect(() => {
    if (!content) return;
    document.title = `${content.title} · ${vi ? 'Nghe và khám phá' : 'Listen and explore'}`;
    if (previousId.current && previousId.current !== content.id) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      heading.current?.focus({ preventScroll: true });
    }
    previousId.current = content.id;
  }, [content?.id, vi]);
  useLayoutEffect(() => {
    const host = playerHost.current, root = layout.current;
    if (!host || !root) return;
    const measure = () => root.style.setProperty('--ha-player-height', `${host.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(host); measure();
    return () => { observer.disconnect(); root.style.removeProperty('--ha-player-height'); };
  }, [session, content?.id]);
  if (!catalog || !content) return <main className="ha-mobile"><p role="status">{error ? (vi ? 'Chưa tải được nội dung.' : 'Content unavailable.') : vi ? 'Đang mở nội dung…' : 'Loading content…'}</p>{error && <button onClick={retry}>{vi ? 'Thử lại' : 'Retry'}</button>}</main>;
  const parent = catalog.items.find(item => item.id === content.parentId);
  const root = catalog.items.find(item => item.id === catalog.rootId)!;
  const children = content.children.map(id => catalog.items.find(item => item.id === id)).filter((item): item is AudioContent => !!item);
  const siblings = parent?.children.map(id => catalog.items.find(item => item.id === id)).filter((item): item is AudioContent => !!item) ?? [];
  const position = siblings.findIndex(item => item.id === content.id);
  const track = audioTrack(content, lang);
  const playlist = contentPlaylist(catalog, content, lang);
  const listed = children.length ? playlist.map(track => catalog.items.find(item => item.id === track.id)).filter((item): item is AudioContent => !!item) : [];
  const playingId = state.tracks[state.index]?.id;
  const go = (item: AudioContent) => {
    history.pushState(null, '', audioPageUrl(item, lang, true, location.href, params));
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  const link = (item: AudioContent) => audioPageUrl(item, lang, true, location.href, params);
  const follow = (event: React.MouseEvent<HTMLAnchorElement>, item: AudioContent) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) { event.preventDefault(); go(item); } };
  return <div ref={layout} className={`ha-mobile${session ? ' ha-mobile--playing' : ''}`} data-audio-page={content.id}>
    <header className="ha-mobile-header"><a href={link(parent ?? root)} onClick={event => follow(event, parent ?? root)}><ArrowLeft /><span>{parent ? parent.title : vi ? 'Ký Ức Bản Địa' : 'Local Memories'}</span></a><button type="button" onClick={() => setQr(true)} aria-label={vi ? 'Mã QR nội dung này' : 'QR code for this content'}><QrCode /></button></header>
    <main>
      <figure className="ha-hero"><AudioImage key={content.id} image={content.images[0]} />{content.images[0]?.credit && <figcaption>{content.images[0].credit}</figcaption>}</figure>
      <div className="ha-introduction"><p className="ha-eyebrow">{vi ? site.name : site.englishName}</p><h1 ref={heading} tabIndex={-1}>{content.title}</h1><p>{content.description}</p>
        {(children.length ? playlist.length > 0 : track) && <ListenButton className="ha-primary" tracks={children.length ? playlist : track ? [track] : []} mode={children.length ? "playlist" : "single"} lang={lang} label={children.length ? vi ? "Nghe toàn bộ" : "Listen to all" : vi ? "Nghe thuyết minh" : "Listen"} />}
        {!playlist.length && <p className="ha-demo">{vi ? 'Audio đang được cập nhật. Bạn vẫn có thể xem ảnh và đọc nội dung.' : 'Audio is being prepared. Photographs and written content remain available.'}</p>}
      </div>
      {children.length > 0 ? <section className="ha-contents"><h2>{vi ? 'Danh sách audio · Theo thứ tự tham quan' : 'Audio list · In visit order'}</h2><ol>{(listed.length ? listed : children).map((child, index) => {
        const childTrack = audioTrack(child, lang);
        const childPlaylist = contentPlaylist(catalog, child, lang);
        const activePlaylist = state.mode === 'playlist' && state.tracks.some(track => track.id === child.id);
        return <li key={child.id} data-audio-item={child.id} className={playingId === child.id ? 'is-playing' : ''}><a href={link(child)} onClick={event => follow(event, child)} className="ha-content-link"><div className="ha-thumbnail"><AudioImage image={child.images[0]} lazy /></div><div><span className="ha-item-number">{String(index + 1).padStart(2, '0')}</span><h3>{child.title}</h3><p>{child.description}</p>{child.children.length > 0 && <small>{childPlaylist.length} {vi ? 'nội dung nghe' : 'audio tracks'}</small>}</div></a>{(child.children.length ? childPlaylist.length > 0 : childTrack) && <button type="button" data-audio-quick-play={child.id} aria-label={`${vi ? 'Nghe' : 'Play'} ${child.title}`} onClick={() => {
          if (activePlaylist) audioPlayer.select(state.tracks.findIndex(track => track.id === child.id));
          else if (child.children.length) audioPlayer.playPlaylist(childPlaylist);
          else if (childTrack) audioPlayer.playSingle(childTrack);
        }}><Play /></button>}</li>;
      })}</ol></section> : <article className="ha-transcript"><h2>{vi ? 'Câu chuyện và hiện vật' : 'The story behind the object'}</h2>{content.paragraphs.map((text, index) => <p key={index}>{text}</p>)}{content.images.length > 1 && <section className="ha-related"><h2>{vi ? 'Ảnh liên quan' : 'Related photographs'}</h2>{content.images.slice(1).filter((image, index, all) => image.src !== content.images[0]?.src && all.findIndex(other => other.src === image.src) === index).map(image => <figure key={image.src}><AudioImage image={image} lazy /><figcaption>{image.caption}{image.credit && <small>{image.credit}</small>}</figcaption></figure>)}</section>}{!!content.sources?.length && <details className="ha-sources"><summary>{vi ? 'Nguồn tư liệu' : 'Sources'}</summary>{content.sources.map(source => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ExternalLink /></a></p>)}</details>}</article>}
      <nav className="ha-page-nav" aria-label={vi ? 'Chuyển nội dung' : 'Browse content'}>{position > 0 && <a href={link(siblings[position - 1])} onClick={event => follow(event, siblings[position - 1])}><ArrowLeft />{vi ? 'Nội dung trước' : 'Previous'}</a>}{position >= 0 && position < siblings.length - 1 && <a href={link(siblings[position + 1])} onClick={event => follow(event, siblings[position + 1])}>{vi ? 'Tiếp theo' : 'Next'}<ArrowRight /></a>}</nav>
      {!children.length && parent && <section className="ha-contents"><h2>{vi ? 'Danh sách audio của phần này' : 'Audio in this section'}</h2><ol>{contentPlaylist(catalog, parent, lang).map((item, index, tracks) => { const entry = catalog.items.find(entry => entry.id === item.id)!; return <li key={item.id} className={playingId === item.id ? 'is-playing' : ''}><a className="ha-content-link" href={link(entry)} onClick={event => follow(event, entry)}><div className="ha-thumbnail"><AudioImage image={entry.images[0]} lazy /></div><div><span className="ha-item-number">{index + 1}</span><h3>{item.title}</h3></div></a><button type="button" aria-label={`${vi ? 'Nghe' : 'Play'} ${item.title}`} onClick={() => audioPlayer.playPlaylist(tracks, index)}><Play /></button></li>; })}</ol></section>}
      <footer className="ha-mobile-footer">{parent && <a href={link(parent)} onClick={event => follow(event, parent)}>{vi ? 'Xem tất cả nội dung' : 'All content'}</a>}<a href={audioPageUrl(content, lang, false, location.href, params)} onClick={() => audioPlayer.stop()}>{vi ? 'Xem website đầy đủ' : 'Open full website'}<ExternalLink /></a></footer>
    </main>
    {session && <div ref={playerHost} className="ha-mobile-player"><AudioPlayer lang={lang} compact onClose={() => audioPlayer.stop()} /></div>}
    {qr && <AudioQRDialog siteId={siteId} lang={lang} search={params.toString()} onClose={() => setQr(false)} />}
  </div>;
}
