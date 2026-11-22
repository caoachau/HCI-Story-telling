import { useEffect, useState } from 'react';
import { resumeUrl, type SiteId } from './state';
import { useAudioContent } from '../audio/useAudioContent';
import { audioPageUrl } from '../audio/catalog';
import { AudioImage } from '../audio/AudioImage';
import { isLocalNetworkUrl } from '../audio/shareAddress';

export function ShareContent({ siteId, lang, searchOverride }: { siteId: SiteId; lang: 'vi' | 'en'; searchOverride?: string }) {
  const { content, params, error: contentError, retry } = useAudioContent(siteId, lang, searchOverride);
  const publicBase = resumeUrl(siteId, undefined, searchOverride);
  // Share the canonical content URL, not desktop-only state or tracking params.
  const url = content && publicBase ? audioPageUrl(content, lang, true, publicBase) : null;
  const localNetwork = !!url && isLocalNetworkUrl(url);
  const previewUrl = content ? audioPageUrl(content, lang, true, location.href, params) : null;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const vi = lang === 'vi';
  useEffect(() => { setCopied(false); }, [url]);
  useEffect(() => {
    let active = true; setCode(''); setError('');
    if (url) void import('qrcode').then(module => module.toDataURL(url, { width: 512, margin: 4, errorCorrectionLevel: 'M' })).then(result => { if (active) setCode(result); }).catch(() => { if (active) setError(vi ? 'Chưa tạo được mã. Bạn có thể thử lại hoặc dùng liên kết.' : 'The QR code could not be created. Retry or use the link.'); });
    return () => { active = false; };
  }, [url, attempt, vi]);
  const copy = async () => { if (!url) return; try { await navigator.clipboard.writeText(url); setCopied(true); setError(''); } catch { setError(vi ? 'Chọn và sao chép liên kết bên dưới.' : 'Select and copy the link below.'); } };
  return <section className="hx-share" aria-label={vi ? 'Mang nội dung theo' : 'Take this content with you'}>
    <h2>{vi ? 'Xem và nghe trên điện thoại' : 'Read and listen on your phone'}</h2>
    {content && <p className="hx-share-content-title"><strong>{content.title}</strong></p>}
    {content?.images[0]?.src && <div className="ha-qr-thumbnail"><AudioImage image={content.images[0]} /></div>}
    <p>{vi ? 'Quét bằng camera điện thoại để mở đúng ảnh, bài giới thiệu và audio. Không cần tài khoản hay cài ứng dụng.' : 'Scan with your phone camera to open these photographs, written content and audio. No account or app is required.'}</p>
    {localNetwork && <aside className="ha-network-note" role="note"><strong>{vi ? 'QR thử nghiệm · Mạng nội bộ' : 'Test QR · Local network'}</strong><p>{vi ? 'Điện thoại cần nối cùng Wi-Fi với máy đang mở website. Máy tính phải tiếp tục chạy website; liên kết này chưa dùng được từ 4G/5G hoặc mạng khác.' : 'Connect your phone to the same Wi-Fi as this computer. Keep the website running. This link is not available over mobile data or another network.'}</p><p>{vi ? 'Nếu báo không thể truy cập: thử mở địa chỉ máy chủ bên dưới trên điện thoại trước.' : 'If the page is unreachable, try the server address below on your phone first.'}</p><a href={new URL(url!).origin} target="_blank" rel="noopener noreferrer">{new URL(url!).origin}</a></aside>}
    {!content && <p role="status">{contentError ? <>{vi ? 'Chưa tải được nội dung. ' : 'Content unavailable. '}<button type="button" onClick={retry}>{vi ? 'Thử lại' : 'Retry'}</button></> : vi ? 'Đang chuẩn bị nội dung…' : 'Preparing content…'}</p>}
    {url ? <>
      {code ? <img data-real-qr src={code} width="280" height="280" alt={vi ? 'Mã QR của nội dung đang xem' : 'QR code for the current content'} /> : <p role="status">{error || (vi ? 'Đang tạo mã QR…' : 'Creating QR code…')}</p>}
      {error && <p role="status">{error}</p>}
      {!code && <button type="button" onClick={() => setAttempt(value => value + 1)}>{vi ? 'Thử lại' : 'Retry'}</button>}
      <div className="hx-actions"><button type="button" onClick={copy}>{copied ? (vi ? 'Đã sao chép' : 'Copied') : (vi ? 'Sao chép liên kết' : 'Copy link')}</button>{code && <a href={code} download={`qr-${content?.id.replace(/[^a-z0-9-]/gi, '-')}.png`}>{vi ? 'Tải mã QR' : 'Download QR'}</a>}<a href={url} target="_blank" rel="noopener noreferrer">{vi ? 'Mở liên kết' : 'Open link'}</a></div>
      <label>{vi ? 'Liên kết có thể sao chép' : 'Copyable link'}<input readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>
    </> : content && <><p className="hx-notice" role="status">{vi ? 'Chưa có địa chỉ mà điện thoại truy cập được. Bạn vẫn có thể xem đầy đủ tại màn hình này.' : 'A phone-accessible address is not available yet. You can continue reading everything on this screen.'}</p>{previewUrl && <a href={previewUrl} target="_blank" rel="noopener noreferrer">{vi ? 'Xem thử giao diện nghe trên điện thoại' : 'Preview the mobile audio view'}</a>}</>}
  </section>;
}

