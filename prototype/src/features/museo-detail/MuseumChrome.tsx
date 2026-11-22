import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Headphones, Home, Leaf, MapPin, QrCode, ScrollText, Shield, SlidersHorizontal, X } from 'lucide-react';
import QRCode from 'qrcode';
import { khmerIntroChapters } from './khmerIntro';
import type { MuseumSection } from './useMuseumScreens';
import { ShareContent } from '../../experience/ShareContent';

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
      const target = chapter.section;
      const selected = active === target;
      const Icon = icons[chapter.icon];
      return <button key={target} type="button" data-section={target} aria-current={selected ? 'page' : undefined}
        onClick={() => navigate(target)}><Icon aria-hidden="true" /><span>{chapter.title[lang]}</span></button>;
    })}
  </nav>;
}

export function MuseumTools({ lang, onClose }: {
  lang: 'vi' | 'en'; onClose?: () => void; onOpenQRCode?: () => void;
  onToggleExpanded?: () => void; isExpanded?: boolean;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const controls = useRef<HTMLDivElement>(null);
  const utilityHost = useRef<HTMLDivElement>(null);
  const utilityToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!utilitiesOpen) return;
    const host = utilityHost.current;
    const frame = requestAnimationFrame(() => host?.querySelector<HTMLButtonElement>('button')?.focus());
    const outside = (event: PointerEvent) => { if (!controls.current?.contains(event.target as Node)) setUtilitiesOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.querySelector('dialog[open]')) {
        event.preventDefault(); event.stopPropagation(); setUtilitiesOpen(false); utilityToggle.current?.focus();
      }
    };
    const choose = (event: MouseEvent) => { if ((event.target as Element).closest('button')) setUtilitiesOpen(false); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape, true);
    host?.addEventListener('click', choose);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape, true); host?.removeEventListener('click', choose); };
  }, [utilitiesOpen]);
  return <>
    <div ref={controls} className="md-host-controls md-detail-tools" data-collapsed={collapsed} role="group" aria-label={lang === 'vi' ? 'Điều khiển trang chi tiết' : 'Detail page controls'}>
      <div className="md-tools-reveal" inert={collapsed} aria-hidden={collapsed}>
      <div id="museum-control-buttons" className="md-tools-row">
      <button ref={utilityToggle} data-museum-tools-toggle type="button" className="md-utilities-toggle" aria-expanded={utilitiesOpen} aria-controls="museum-utilities" onClick={() => setUtilitiesOpen(value => !value)} title={lang === 'vi' ? 'Công cụ khám phá' : 'Exploration tools'}>
        <SlidersHorizontal aria-hidden="true" /><span>{lang === 'vi' ? 'Tiện ích' : 'Tools'}</span><ChevronDown className="md-utilities-chevron" aria-hidden="true" />
      </button>
      <button type="button" className="md-detail-tools-share" onClick={() => { setUtilitiesOpen(false); setQrOpen(true); }} aria-label={lang === 'vi' ? 'Mở mã QR bảo tàng' : 'Museum QR code'} title={lang === 'vi' ? 'QR toàn bộ bảo tàng' : 'Whole museum QR'}>
        <QrCode aria-hidden="true" /><span>{lang === 'vi' ? 'Mã QR' : 'QR code'}</span>
      </button>
      <button type="button" data-museum-listen aria-haspopup="dialog" onClick={() => {
        setUtilitiesOpen(false);
        window.dispatchEvent(new CustomEvent('heritage:open-tool', { detail: { siteId: 'bao-tang-khmer', panel: 'listen' } }));
      }} title={lang === 'vi' ? 'Nghe nội dung đang xem' : 'Listen to this content'} aria-label={lang === 'vi' ? 'Nghe và bản chữ' : 'Listen and transcript'}><Headphones aria-hidden="true" /></button>
      <button type="button" className="md-tools-close" onClick={onClose} disabled={!onClose} title={lang === 'vi' ? 'Đóng bảo tàng' : 'Close museum'} aria-label={lang === 'vi' ? 'Đóng chi tiết bảo tàng' : 'Close museum detail'}><X aria-hidden="true" /></button>
      </div>
      </div>
      <button type="button" className="md-tools-collapse" data-action="toggle-museum-tools" aria-expanded={!collapsed} aria-controls="museum-control-buttons" title={collapsed ? (lang === 'vi' ? 'Mở cụm điều khiển' : 'Show controls') : (lang === 'vi' ? 'Thu gọn sang phải' : 'Collapse to the right')} aria-label={collapsed ? (lang === 'vi' ? 'Mở cụm điều khiển' : 'Show controls') : (lang === 'vi' ? 'Thu gọn cụm điều khiển sang phải' : 'Collapse controls to the right')} onClick={() => { setUtilitiesOpen(false); setCollapsed(value => !value); }}>
        {collapsed ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
      </button>
      <div id="museum-utilities" className="md-utilities-menu" hidden={!utilitiesOpen}>
        <p>{lang === 'vi' ? 'CÔNG CỤ KHÁM PHÁ' : 'EXPLORATION TOOLS'}</p>
        <div ref={utilityHost} data-museum-tools-host />
      </div>
    </div>
    {qrOpen && <MuseumQRCode lang={lang} onClose={() => setQrOpen(false)} />}
  </>;
}

function MuseumQRCode({ lang, onClose }: { lang: 'vi' | 'en'; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const node = dialog.current!;
    node.showModal();
    return () => { if (node.open) node.close(); };
  }, []);
  return <dialog ref={dialog} className="md-qr-dialog ha-qr-dialog" aria-label={lang === 'vi' ? 'Tiếp tục trên điện thoại' : 'Continue on your phone'} onClose={event => { if (!event.currentTarget.open) onClose(); }}
    onKeyDown={event => event.stopPropagation()} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <button type="button" onClick={() => dialog.current?.close()} aria-label={lang === 'vi' ? 'Đóng mã QR' : 'Close QR code'}><X /></button>
    <div className="hx-body"><ShareContent siteId="bao-tang-khmer" lang={lang} searchOverride="listen=bao-tang-khmer" /></div>
  </dialog>;
}
