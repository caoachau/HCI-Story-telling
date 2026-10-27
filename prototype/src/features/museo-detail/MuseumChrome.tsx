import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Expand, Home, Leaf, MapPin, QrCode, ScrollText, Shield, Shrink, X } from 'lucide-react';
import QRCode from 'qrcode';
import { khmerIntroChapters } from './khmerIntro';
import type { MuseumSection } from './useMuseumScreens';

const icons = { home: Home, pin: MapPin, scroll: ScrollText, leaf: Leaf, shield: Shield };

export function MuseumFooter({ active, lang, navigate }: {
  active: MuseumSection; lang: 'vi' | 'en'; navigate: (section: MuseumSection) => void;
}) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    root.current?.querySelector('[aria-current="page"]')?.scrollIntoView({
      block: 'nearest', inline: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, [active]);
  return <nav ref={root} className="md-footer" aria-label={lang === 'vi' ? 'Các phần của trang bảo tàng' : 'Museum chapters'}>
    {khmerIntroChapters.map(chapter => {
      const target = chapter.section === 'overview' ? 'hero' : chapter.section;
      const selected = active === target || (target === 'hero' && active === 'overview');
      const Icon = icons[chapter.icon];
      return <button key={target} type="button" data-section={target} aria-current={selected ? 'page' : undefined}
        onClick={() => navigate(target)}><Icon aria-hidden="true" /><span>{chapter.title[lang]}</span></button>;
    })}
  </nav>;
}

export function MuseumTools({ lang, onClose, onOpenQRCode, onToggleExpanded, isExpanded }: {
  lang: 'vi' | 'en'; onClose?: () => void; onOpenQRCode?: () => void;
  onToggleExpanded?: () => void; isExpanded?: boolean;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(!!document.fullscreenElement);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const update = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const expanded = isExpanded ?? fullscreen;
  const toggle = () => {
    if (onToggleExpanded) { onToggleExpanded(); return; }
    const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    void action.catch(() => setNotice(lang === 'vi' ? 'Chưa mở được chế độ toàn màn hình.' : 'Fullscreen is unavailable.'));
  };
  return <>
    <div className="md-host-controls md-detail-tools" role="group" aria-label={lang === 'vi' ? 'Điều khiển trang chi tiết' : 'Detail page controls'}>
      <button type="button" className="md-detail-tools-share" onClick={() => onOpenQRCode ? onOpenQRCode() : setQrOpen(true)} aria-label={lang === 'vi' ? 'Mở mã QR bảo tàng' : 'Museum QR code'}>
        <QrCode aria-hidden="true" /><span>{lang === 'vi' ? 'Mã QR' : 'QR code'}</span>
      </button>
      <button type="button" onClick={toggle} aria-label={expanded ? (lang === 'vi' ? 'Thu nhỏ chi tiết bảo tàng' : 'Exit fullscreen museum detail') : (lang === 'vi' ? 'Mở rộng chi tiết bảo tàng' : 'Expand museum detail')} aria-pressed={expanded}>
        {expanded ? <Shrink aria-hidden="true" /> : <Expand aria-hidden="true" />}
      </button>
      <button type="button" onClick={onClose} disabled={!onClose} aria-label={lang === 'vi' ? 'Đóng chi tiết bảo tàng' : 'Close museum detail'}><X aria-hidden="true" /></button>
    </div>
    {notice && <p className="md-fullscreen-notice" role="status">{notice}</p>}
    {qrOpen && <MuseumQRCode lang={lang} onClose={() => setQrOpen(false)} />}
  </>;
}

function MuseumQRCode({ lang, onClose }: { lang: 'vi' | 'en'; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [code, setCode] = useState('');
  const [failed, setFailed] = useState(false);
  const url = new URL('bao-tang-khmer.html', document.baseURI).href;
  useLayoutEffect(() => {
    const node = dialog.current!;
    node.showModal();
    return () => { if (node.open) node.close(); };
  }, []);
  useEffect(() => {
    let cancelled = false;
    void QRCode.toDataURL(url, { width: 512, margin: 2, errorCorrectionLevel: 'M' })
      .then(value => { if (!cancelled) setCode(value); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [url]);
  return <dialog ref={dialog} className="md-qr-dialog" aria-labelledby="md-qr-title" onClose={onClose}
    onKeyDown={event => event.stopPropagation()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <button type="button" onClick={() => dialog.current?.close()} aria-label={lang === 'vi' ? 'Đóng mã QR' : 'Close QR code'}><X /></button>
    <h2 id="md-qr-title">{lang === 'vi' ? 'Tiếp tục trên điện thoại' : 'Continue on your phone'}</h2>
    <p>{lang === 'vi' ? 'Quét mã để mở trang Bảo tàng Văn hóa Khmer.' : 'Scan to open the Khmer Culture Museum.'}</p>
    <div className="md-qr-image">{code ? <img src={code} alt={lang === 'vi' ? 'Mã QR trang bảo tàng' : 'Museum page QR code'} />
      : <p role="status">{failed ? (lang === 'vi' ? 'Dùng liên kết bên dưới để mở trang.' : 'Use the link below to open the page.') : (lang === 'vi' ? 'Đang tạo mã QR…' : 'Creating QR code…')}</p>}</div>
    <a href={url}>{url}</a>
  </dialog>;
}
