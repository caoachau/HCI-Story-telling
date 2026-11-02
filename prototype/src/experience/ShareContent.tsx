import { useEffect, useState } from 'react';
import { resumeUrl, type SiteId } from './state';

export function ShareContent({ siteId, lang, searchOverride }: { siteId: SiteId; lang: 'vi' | 'en'; searchOverride?: string }) {
  const [url, setUrl] = useState(() => resumeUrl(siteId, undefined, searchOverride));
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const vi = lang === 'vi';
  useEffect(() => { const sync = () => setUrl(resumeUrl(siteId, undefined, searchOverride)); sync(); window.addEventListener('heritage:route', sync); return () => window.removeEventListener('heritage:route', sync); }, [siteId, lang, searchOverride]);
  useEffect(() => {
    let active = true; setCode(''); setError('');
    if (url) void import('qrcode').then(module => module.toDataURL(url, { width: 512, margin: 4, errorCorrectionLevel: 'M' })).then(result => { if (active) setCode(result); }).catch(() => { if (active) setError(vi ? 'Chưa tạo được mã. Bạn có thể thử lại hoặc dùng liên kết.' : 'The QR code could not be created. Retry or use the link.'); });
    return () => { active = false; };
  }, [url, attempt, vi]);
  const copy = async () => { if (!url) return; try { await navigator.clipboard.writeText(url); setCopied(true); setError(''); } catch { setError(vi ? 'Chọn và sao chép liên kết bên dưới.' : 'Select and copy the link below.'); } };
  return <section className="hx-share" aria-label={vi ? 'Mang nội dung theo' : 'Take this content with you'}>
    <h2>{vi ? 'Tiếp tục trên điện thoại' : 'Continue on your phone'}</h2>
    <p>{vi ? 'Liên kết giữ địa điểm và phần nội dung đang chọn. Không cần tài khoản hay cài ứng dụng.' : 'The link keeps the selected place and content. No account or app installation is required.'}</p>
    {url ? <>
      {code ? <img data-real-qr src={code} width="280" height="280" alt={vi ? 'Mã QR của nội dung đang xem' : 'QR code for the current content'} /> : <p role="status">{error || (vi ? 'Đang tạo mã QR…' : 'Creating QR code…')}</p>}
      {error && <p role="status">{error}</p>}
      {!code && <button type="button" onClick={() => setAttempt(value => value + 1)}>{vi ? 'Thử lại' : 'Retry'}</button>}
      <div className="hx-actions"><button type="button" onClick={copy}>{copied ? (vi ? 'Đã sao chép' : 'Copied') : (vi ? 'Sao chép liên kết' : 'Copy link')}</button><a href={url} target="_blank" rel="noopener noreferrer">{vi ? 'Mở liên kết' : 'Open link'}</a></div>
      <label>{vi ? 'Liên kết có thể sao chép' : 'Copyable link'}<input readOnly value={url} onFocus={event => event.currentTarget.select()} /></label>
    </> : <p className="hx-notice" role="status">{vi ? 'Chưa có địa chỉ mà điện thoại truy cập được. Bạn vẫn có thể xem đầy đủ tại màn hình này.' : 'A phone-accessible address is not available yet. You can continue reading everything on this screen.'}</p>}
  </section>;
}

