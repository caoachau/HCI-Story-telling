import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowDown, ArrowLeft, ArrowRight, BookOpen, Compass, Expand,
  Mic, MicOff, PanelRightClose, PanelRightOpen, Shrink, Smartphone, Volume2, VolumeX, X,
} from 'lucide-react';
import type { HeritageSite } from '../data/heritageSites';
import { formatCoordinates } from '../utils/geoCoordinates';
import './baDongEditorial.css';

type Language = 'vi' | 'en';
type Photo = { src: string; title: string; enTitle: string; credit: string; illustrative?: boolean };

const photos: Photo[] = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Bi%E1%BB%83n_Ba_%C4%90%E1%BB%99ng%2C_Tr%C3%A0_Vinh.jpg',
    title: 'Bờ biển Ba Động', enTitle: 'Ba Dong coastline',
    credit: 'Baoothersks / Wikimedia Commons · CC BY 4.0',
  },
  {
    src: 'https://vietnamtourism.vn/imguploads/tourist/2014/TraVinh/BienBaDong/60Bienbadong01.jpg',
    title: 'Tư liệu cảnh quan Ba Động', enTitle: 'Ba Dong landscape archive',
    credit: 'Cục Du lịch Quốc gia Việt Nam',
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/CSIRO_ScienceImage_44_Casuarina_Tree_on_a_Beach.jpg',
    title: 'Phi lao ven biển · ảnh minh họa', enTitle: 'Coastal casuarina · illustrative photograph',
    credit: 'CSIRO / Wikimedia Commons · CC BY 3.0', illustrative: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1600&q=82',
    title: 'Điện gió · ảnh minh họa', enTitle: 'Wind energy · illustrative photograph',
    credit: 'Unsplash · ảnh minh họa', illustrative: true,
  },
];

const copy = {
  vi: {
    eyebrow: 'KHÁM PHÁ VÙNG TRÀ VINH  /  DI SẢN VEN BIỂN',
    heroLine: 'Nơi ba đụn cát gặp biển Đông.',
    heroBody: 'Một vùng bờ biển được ghi nhớ qua cát bồi, rừng phi lao và nhịp sống hướng ra khơi.',
    scroll: 'CUỘN ĐỂ KHÁM PHÁ', close: 'Đóng diễn giải', expand: 'Mở toàn màn hình', shrink: 'Thu nhỏ',
    wider: 'Mở rộng diễn giải sang trái', narrower: 'Thu gọn diễn giải',
    sound: 'Âm thanh không gian', voice: 'Nghe câu chuyện', phone: 'Xem trên điện thoại',
    introKicker: '01 — MỘT VÙNG BIỂN CÓ TÊN',
    introTitle: 'Một vùng biển được gọi tên từ ba đụn cát.',
    introLead: 'Ở Ba Động, câu chuyện của vùng đất bắt đầu ngay từ đường bờ.',
    introSmall: 'VỀ BA ĐỘNG', introSideTitle: 'Dấu ấn của cát, gió và biển.',
    introOne: 'Tên gọi Ba Động gắn với ba đụn cát tự nhiên nhấp nhô trên bãi biển. Khi thủy triều rút, đường bờ mở ra một cảnh quan khác: cát bồi, mặt nước rộng và những hàng phi lao nối dài.',
    introTwo: 'Đây cũng là nơi người dân sống cùng nhịp gió và nhịp biển. Cảnh quan không đứng yên; mỗi lớp cát, bóng cây và dấu chân đều góp vào ký ức của vùng duyên hải.',
    exhibitKicker: '02 — NHỮNG LỚP CẢNH QUAN',
    exhibitTitle: 'Đi qua Ba Động, từng lớp một.',
    exhibitBody: 'Chọn một lớp để nhìn gần hơn, rồi tiếp tục theo mạch câu chuyện bên dưới.',
    explore: 'KHÁM PHÁ',
    layerTitles: ['Ba đụn cát', 'Rừng phi lao', 'Biển & con người', 'Điện gió', 'Ba Động hôm nay'],
    layerDetails: [
      'Những đụn cát ven biển tạo nên tên gọi của vùng đất.',
      'Hàng cây phi lao làm nên một đường nét quen thuộc nơi bờ biển.',
      'Bãi biển gắn với nhịp sinh hoạt và ký ức của cộng đồng ven bờ.',
      'Những cánh turbine đưa thêm một nét mới vào câu chuyện của gió.',
      'Cảnh quan xưa và nay tiếp tục hiện diện trong cùng một khung nhìn.',
    ],
    chapter: 'CHƯƠNG', origin: 'NGUỒN GỐC TÊN GỌI',
    dunesTitle: 'Huyền thoại ba đụn cát.',
    dunesBody: 'Tương truyền, tên gọi Ba Động bắt nguồn từ ba đụn cát nổi lên dọc bờ biển. Giữa mỗi lần triều lên, triều xuống, những dải cát ấy là dấu hiệu giúp người ta nhận ra nơi này.',
    dunesQuote: 'Biển không chỉ vẽ nên đường bờ. Biển còn góp phần đặt tên cho vùng đất.',
    forestCategory: 'CẢNH QUAN VEN BIỂN', forestTitle: 'Một vành đai xanh giữa cát và biển.',
    forestBody: 'Đi sâu khỏi mép nước, hàng phi lao tạo nên nhịp chuyển từ bãi cát trống trải sang bóng râm. Tiếng gió đi qua tán cây là một phần khó tách rời khỏi ký ức về Ba Động.',
    forestWords: 'CÁT  /  GIÓ  /  BIỂN  /  PHI LAO',
    breakTitle: 'BA ĐỘNG HÔM NAY',
    breakBody: 'Một đường bờ nhiều lớp: thiên nhiên, đời sống và dấu ấn của thời đại mới.',
    windKicker: '04 — TỪ GIÓ BIỂN ĐẾN NĂNG LƯỢNG',
    windTitle: 'Gió vẫn kể một câu chuyện khác.',
    windBody: 'Gió từng định hình bãi cát và làm rì rào hàng phi lao. Hôm nay, hình ảnh điện gió còn gợi ra cách vùng duyên hải bước vào một thời kỳ mới. Đặt cạnh nhau, những lớp cảnh quan ấy cho thấy Ba Động luôn đang thay đổi.',
    then: 'TRƯỚC ĐÂY', now: 'HÔM NAY', thenText: 'Cát bồi, mặt biển, nhịp sống ven bờ.', nowText: 'Cùng đường bờ ấy, thêm dấu ấn của năng lượng gió.',
    brochureKicker: '05 — MANG THEO MỘT MẢNH KÝ ỨC', brochureTitle: 'Cuốn sách Ba Động.',
    bookIntroTitle: 'Một lời chào từ biển.',
    bookSeaTitle: 'Nhịp sống bên đường bờ.',
    bookTodayTitle: 'Một vùng biển đang tiếp tục.',
    bookEndingTitle: 'Câu chuyện vẫn còn mở.',
    bookTexts: [
      'Ba Động mở đầu bằng một đường bờ rộng, nơi cát bồi, gió và mặt nước cùng tạo nên cảnh quan.',
      'Ba đụn cát tự nhiên đã đi vào tên gọi của vùng biển. Mỗi lần triều rút, bờ cát lại hiện ra theo một dáng vẻ khác.',
      'Hàng phi lao tạo bóng mát trên cát. Tiếng gió đi qua tán cây trở thành một phần ký ức ven biển.',
      'Đường bờ không chỉ là nơi để ngắm nhìn. Đó còn là không gian sống, qua lại và ghi nhớ của người dân nơi đây.',
      'Từ ngọn gió quen thuộc, một cảnh quan năng lượng mới xuất hiện bên vùng duyên hải.',
      'Cát, cây, biển và gió vẫn ở lại trong cùng một câu chuyện, dù Ba Động tiếp tục đổi thay.',
    ],
    bookPrevious: 'Trang trước', bookNext: 'Trang sau',
    bookInstruction: 'Chạm vào trang hoặc vuốt ngang để lật sách',
    bookLarge: 'XEM LỚN', bookClose: 'Thu nhỏ sách',
    bookSpreadLabels: ['Mở đầu', 'Cát & phi lao', 'Biển & gió', 'Ba Động hôm nay'],
    archiveKicker: '06 — TƯ LIỆU HÌNH ẢNH', archiveTitle: 'Những khung hình còn ở lại.',
    archiveBody: 'Chạm vào ảnh để xem lớn. Ảnh minh họa được ghi rõ để phân biệt với tư liệu tại Ba Động.',
    imageLabel: 'MỞ ẢNH', illustration: 'ẢNH MINH HỌA',
    closing: 'Có những vùng đất được nhớ bằng cả cảnh quan và những câu chuyện chúng ta lưu giữ.',
    backMap: 'TRỞ LẠI BẢN ĐỒ', panorama: 'XEM TƯ LIỆU 360°', sources: 'ẢNH & TƯ LIỆU',
    sourceNote: 'Ảnh phi lao và điện gió dùng để minh họa chủ đề; không phải ảnh chụp tại Ba Động.',
    lightboxClose: 'Đóng ảnh', previous: 'Ảnh trước', next: 'Ảnh sau',
  },
  en: {
    eyebrow: 'EXPLORE THE TRA VINH REGION  /  COASTAL HERITAGE',
    heroLine: 'Where three sand dunes meet the sea.',
    heroBody: 'A coast remembered through shifting sand, casuarina trees and life facing the water.',
    scroll: 'SCROLL TO EXPLORE', close: 'Close interpretation', expand: 'Open full screen', shrink: 'Exit full screen',
    wider: 'Expand the story panel left', narrower: 'Narrow the story panel',
    sound: 'Ambient sound', voice: 'Listen to the story', phone: 'Continue on phone',
    introKicker: '01 — A COAST WITH A NAME',
    introTitle: 'A stretch of coast named after three sand dunes.',
    introLead: 'At Ba Dong, the story of place begins at the shoreline.',
    introSmall: 'ABOUT BA DONG', introSideTitle: 'The marks of sand, wind and sea.',
    introOne: 'The name Ba Dong refers to three natural dunes along the beach. As the tide recedes, the shore reveals a different landscape: deposited sand, open water and a line of casuarina trees.',
    introTwo: 'People here live with the rhythms of wind and sea. The landscape keeps changing; each layer of sand, tree shadow and footprint becomes part of the coastal memory.',
    exhibitKicker: '02 — LAYERS OF LANDSCAPE',
    exhibitTitle: 'Walk through Ba Dong, one layer at a time.',
    exhibitBody: 'Choose a layer for a closer look, then continue through the story below.',
    explore: 'EXPLORE',
    layerTitles: ['Three dunes', 'Casuarina', 'Sea & people', 'Wind energy', 'Ba Dong today'],
    layerDetails: [
      'The coastal dunes gave this place its name.',
      'Casuarina trees form a familiar line along the shore.',
      'The beach holds everyday life and coastal memories.',
      'Turbines add a new chapter to the story of wind.',
      'Past and present share the same view of the coast.',
    ],
    chapter: 'CHAPTER', origin: 'THE ORIGIN OF A NAME',
    dunesTitle: 'The story of three sand dunes.',
    dunesBody: 'Ba Dong is said to take its name from three dunes rising along the beach. Through the changing tides, these sand ridges made this shore recognizable.',
    dunesQuote: 'The sea shapes more than a shoreline. It helps give a place its name.',
    forestCategory: 'COASTAL LANDSCAPE', forestTitle: 'A green line between sand and sea.',
    forestBody: 'Beyond the waterline, casuarina trees mark the passage from exposed sand to shade. Wind moving through the trees is part of how Ba Dong is remembered.',
    forestWords: 'SAND  /  WIND  /  SEA  /  CASUARINA',
    breakTitle: 'BA DONG TODAY',
    breakBody: 'A layered coastline of nature, everyday life and a changing era.',
    windKicker: '04 — FROM SEA WIND TO ENERGY',
    windTitle: 'The wind tells another story.',
    windBody: 'Wind shaped the dunes and rustled through casuarina trees. Today, wind energy also suggests how the coast is entering a new era. Side by side, these layers show that Ba Dong is always changing.',
    then: 'THEN', now: 'NOW', thenText: 'Deposited sand, the sea, life on the shore.', nowText: 'The same coastline, with a new energy landscape.',
    brochureKicker: '05 — TAKE A MEMORY WITH YOU', brochureTitle: 'The Ba Dong storybook.',
    bookIntroTitle: 'A greeting from the sea.',
    bookSeaTitle: 'Life along the shore.',
    bookTodayTitle: 'A coast still unfolding.',
    bookEndingTitle: 'The story remains open.',
    bookTexts: [
      'Ba Dong begins with an open shoreline, where deposited sand, wind and water shape the landscape.',
      'Three natural dunes became part of the coast’s name. Each low tide reveals a different contour of sand.',
      'Casuarina trees shade the beach. Wind moving through their branches becomes part of coastal memory.',
      'The shoreline is more than a view. It is a place of daily life, movement and memory for local people.',
      'Familiar sea winds now also suggest a new energy landscape along the coast.',
      'Sand, trees, sea and wind remain in one story, even as Ba Dong continues to change.',
    ],
    bookPrevious: 'Previous page', bookNext: 'Next page',
    bookInstruction: 'Tap a page or swipe sideways to turn the pages',
    bookLarge: 'ENLARGE', bookClose: 'Close large book',
    bookSpreadLabels: ['Opening', 'Sand & trees', 'Sea & wind', 'Ba Dong today'],
    archiveKicker: '06 — IMAGE ARCHIVE', archiveTitle: 'Images that stay with us.',
    archiveBody: 'Open an image for a closer look. Illustrative photographs are identified separately from Ba Dong source images.',
    imageLabel: 'OPEN IMAGE', illustration: 'ILLUSTRATIVE IMAGE',
    closing: 'Some places are remembered through both their landscape and the stories we choose to keep.',
    backMap: 'RETURN TO THE MAP', panorama: 'VIEW 360° MATERIAL', sources: 'IMAGES & SOURCES',
    sourceNote: 'Casuarina and wind energy photos illustrate the themes and were not taken at Ba Dong.',
    lightboxClose: 'Close image', previous: 'Previous image', next: 'Next image',
  },
};

interface Props {
  site: HeritageSite;
  lang: Language;
  isExpanded: boolean;
  isSidebarWide: boolean;
  onToggleExpanded?: () => void;
  onToggleSidebarWide?: () => void;
  onClose?: () => void;
  onOpenQRCode?: () => void;
  onOpenPanorama360?: () => void;
  onOpenArtifactModal: () => void;
  onToggleSoundscape: () => void;
  isSoundscapePlaying: boolean;
  onToggleNarration: () => void;
  isNarrating: boolean;
  onContentChange?: () => void;
}

export const BaDongEditorial: React.FC<Props> = ({
  site, lang, isExpanded, isSidebarWide, onToggleExpanded, onToggleSidebarWide, onClose,
  onOpenQRCode, onOpenPanorama360, onOpenArtifactModal, onToggleSoundscape,
  isSoundscapePlaying, onToggleNarration, isNarrating, onContentChange,
}) => {
  const t = copy[lang];
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollActivity = useRef(0);
  const bookTouchStart = useRef<{ x: number; y: number } | null>(null);
  const bookSwipeAt = useRef(0);
  const bookFlipTimeout = useRef<number | null>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [bookIndex, setBookIndex] = useState(0);
  const [turningSheet, setTurningSheet] = useState<number | null>(null);
  const [turnDirection, setTurnDirection] = useState<-1 | 1>(1);
  const [isBookImmersive, setIsBookImmersive] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const coords = formatCoordinates(site.lat, site.lng);

  const bookPages = [
    { title: t.bookIntroTitle, body: t.bookTexts[0], photo: photos[0], tone: 'photo' },
    { title: t.dunesTitle, body: t.bookTexts[1], photo: photos[0], tone: 'paper' },
    { title: t.forestTitle, body: t.bookTexts[2], photo: photos[2], tone: 'photo' },
    { title: t.bookSeaTitle, body: t.bookTexts[3], photo: photos[1], tone: 'paper' },
    { title: t.windTitle, body: t.bookTexts[4], photo: photos[3], tone: 'photo' },
    { title: t.bookTodayTitle, body: t.bookTexts[5], photo: photos[0], tone: 'paper' },
  ];
  const turnBook = (direction: -1 | 1) => {
    if (bookFlipTimeout.current !== null) return;
    const next = Math.max(0, Math.min(3, bookIndex + direction));
    if (next !== bookIndex) {
      setTurnDirection(direction);
      setTurningSheet(direction === 1 ? bookIndex : bookIndex - 1);
      setBookIndex(next);
      onContentChange?.();
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 920;
      bookFlipTimeout.current = window.setTimeout(() => {
        setTurningSheet(null);
        bookFlipTimeout.current = null;
      }, duration);
    }
  };
  const renderBookPage = (page: typeof bookPages[number], pageNumber: number) => (
    <div className={`bd-book-page bd-book-page--${page.tone}`}>
      <div className="bd-book-page-heading"><span>BA ĐỘNG / TRÀ VINH</span><span>{String(pageNumber).padStart(2, '0')}</span></div>
      <div className="bd-book-page-photo"><img src={page.photo.src} alt={lang === 'vi' ? page.photo.title : page.photo.enTitle} loading="eager" /></div>
      <div className="bd-book-page-copy"><h3>{page.title}</h3><p>{page.body}</p>{page.photo.illustrative && <small>{t.illustration}</small>}</div>
      <div className="bd-book-page-footer"><span>{page.photo.credit}</span><span>{String(pageNumber).padStart(2, '0')}</span></div>
    </div>
  );

  useEffect(() => {
    return () => {
      if (bookFlipTimeout.current !== null) window.clearTimeout(bookFlipTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!isBookImmersive) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    readerRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsBookImmersive(false);
      if (event.key === 'Tab') {
        const dialog = readerRef.current?.closest('.bd-book-reader');
        const focusable = dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isBookImmersive]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((value) => value === null ? null : (value + 1) % photos.length);
      if (event.key === 'ArrowLeft') setLightbox((value) => value === null ? null : (value + photos.length - 1) % photos.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  const goTo = (id: string) => {
    scrollRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onContentChange?.();
  };
  const openExternalPanel = (action?: () => void) => {
    if (!action) return;
    if (isExpanded) onToggleExpanded?.();
    action();
    onContentChange?.();
  };
  const archiveImage = (photo: Photo, index: number, className = '') => (
    <button className={`bd-archive-photo ${className}`} key={photo.src} onClick={() => { setLightbox(index); onContentChange?.(); }} aria-label={`${t.imageLabel}: ${lang === 'vi' ? photo.title : photo.enTitle}`}>
      <img src={photo.src} alt={lang === 'vi' ? photo.title : photo.enTitle} loading="lazy" />
      <span className="bd-archive-caption"><span>{lang === 'vi' ? photo.title : photo.enTitle}</span><ArrowRight size={17} /></span>
    </button>
  );
  const renderBookScene = (immersive: boolean) => <>
    <div className={`bd-book-scene ${immersive ? 'bd-book-scene--immersive' : ''}`}
      ref={immersive ? readerRef : undefined}
      role="group" tabIndex={0} aria-label={`${t.brochureTitle} — ${t.bookInstruction}`}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse' || bookFlipTimeout.current !== null) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
        const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
        event.currentTarget.style.setProperty('--bd-tilt-x', `${(immersive ? -7 : -5) - vertical * (immersive ? 7 : 5)}deg`);
        event.currentTarget.style.setProperty('--bd-tilt-y', `${horizontal * (immersive ? 10 : 7)}deg`);
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.removeProperty('--bd-tilt-x');
        event.currentTarget.style.removeProperty('--bd-tilt-y');
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); turnBook(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); turnBook(-1); }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        bookTouchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
      }}
      onTouchEnd={(event) => {
        if (bookTouchStart.current === null) return;
        const touch = event.changedTouches[0];
        if (!touch) return;
        const distance = touch.clientX - bookTouchStart.current.x;
        const verticalDistance = touch.clientY - bookTouchStart.current.y;
        bookTouchStart.current = null;
        if (Math.abs(distance) > 45 && Math.abs(distance) > Math.abs(verticalDistance) * 1.2) {
          bookSwipeAt.current = Date.now();
          turnBook(distance < 0 ? 1 : -1);
        }
      }}>
      <div className="bd-book">
        <div className="bd-book-left-base"><img src={photos[0].src} alt="" loading="eager" /><div><span>TRÀ VINH · VIỆT NAM</span><strong>{lang === 'vi' ? 'BIỂN BA ĐỘNG' : 'BA DONG BEACH'}</strong><span>09°38′N / 106°33′E</span></div></div>
        <div className="bd-book-right-base"><span className="bd-book-end-label">BA ĐỘNG / {lang === 'vi' ? 'LỜI KẾT' : 'CLOSING NOTE'}</span><img src={photos[0].src} alt="" loading="eager" /><h3>{t.bookEndingTitle}</h3><p>“{t.closing}”</p><span className="bd-book-end-number">07</span></div>
        <div className="bd-book-spine" aria-hidden="true" />
        {[0, 1, 2].map((sheetIndex) => <div key={sheetIndex}
          className={`bd-book-sheet ${sheetIndex < bookIndex ? 'is-turned' : ''} ${turningSheet === sheetIndex ? turnDirection === 1 ? 'is-flipping-forward' : 'is-flipping-backward' : ''}`}
          style={{ zIndex: turningSheet === sheetIndex ? 5 : sheetIndex < bookIndex ? sheetIndex + 1 : 3 - sheetIndex }}
          aria-hidden={sheetIndex !== bookIndex && sheetIndex !== bookIndex - 1}>
          <div className="bd-book-face bd-book-front">{renderBookPage(bookPages[sheetIndex * 2], sheetIndex * 2 + 1)}</div>
          <div className="bd-book-face bd-book-back">{renderBookPage(bookPages[sheetIndex * 2 + 1], sheetIndex * 2 + 2)}</div>
        </div>)}
        <button className="bd-book-hit bd-book-hit-prev" onClick={() => { if (Date.now() - bookSwipeAt.current > 450) turnBook(-1); }} disabled={bookIndex === 0} aria-label={t.bookPrevious} />
        <button className="bd-book-hit bd-book-hit-next" onClick={() => { if (Date.now() - bookSwipeAt.current > 450) turnBook(1); }} disabled={bookIndex === 3} aria-label={t.bookNext} />
      </div>
    </div>
    <div className="bd-book-navigation">
      <button onClick={() => turnBook(-1)} disabled={bookIndex === 0} aria-label={t.bookPrevious}><ArrowLeft size={20}/><span>{t.bookPrevious}</span></button>
      <span className="bd-book-progress" aria-live="polite"><strong>{t.bookSpreadLabels[bookIndex]}</strong><span>{bookIndex + 1} / 4</span></span>
      <button onClick={() => turnBook(1)} disabled={bookIndex === 3} aria-label={t.bookNext}><span>{t.bookNext}</span><ArrowRight size={20}/></button>
    </div>
  </>;

  return <div className={`bd-shell ${isExpanded ? 'bd-expanded' : ''}`}>
    <div className="bd-scroll" ref={scrollRef} onScrollCapture={() => {
      const now = Date.now();
      if (now - lastScrollActivity.current > 30_000) {
        lastScrollActivity.current = now;
        onContentChange?.();
      }
    }}>
      <section className="bd-hero" id="bd-top">
        <img className="bd-hero-image" src={photos[0].src} alt={lang === 'vi' ? photos[0].title : photos[0].enTitle} fetchPriority="high" />
        <div className="bd-hero-shade" />
        <div className="bd-hero-top"><span className="bd-wordmark">BĐ<span> / </span>TRÀ VINH</span><span className="bd-top-index">09°38′N · 106°33′E</span></div>
        <div className="bd-hero-copy"><span className="bd-kicker bd-kicker-light">{t.eyebrow}</span><h1>{lang === 'vi' ? <>BIỂN<br />BA ĐỘNG</> : <>BA DONG<br />BEACH</>}</h1><p className="bd-hero-subtitle">{t.heroLine}</p><p className="bd-hero-desc">{t.heroBody}</p><span className="bd-hero-coordinate">{coords.decimal} · {lang === 'vi' ? 'VÙNG TRÀ VINH' : 'TRA VINH REGION'}</span></div>
        <button className="bd-scroll-cue" onClick={() => goTo('bd-intro')}>{t.scroll}<ArrowDown size={17} /></button>
        <span className="bd-photo-credit">© {photos[0].credit}</span>
      </section>

      <section className="bd-intro bd-section" id="bd-intro"><div className="bd-wrap">
        <header className="bd-section-intro"><span className="bd-kicker">{t.introKicker}</span><h2>{t.introTitle}</h2><p>{t.introLead}</p></header>
        <div className="bd-intro-grid"><article className="bd-intro-article"><span className="bd-kicker">{t.introSmall}</span><h3>{t.introSideTitle}</h3><p>{t.introOne}</p><p>{t.introTwo}</p><div className="bd-intro-rule"><span>BA ĐỘNG</span><span>01 — 06</span></div></article>
          <div className="bd-mosaic"><figure className="bd-mosaic-main"><img src={photos[0].src} alt={lang === 'vi' ? photos[0].title : photos[0].enTitle} loading="lazy" /><figcaption>{lang === 'vi' ? photos[0].title : photos[0].enTitle}</figcaption></figure><figure className="bd-mosaic-small"><img src={photos[2].src} alt={lang === 'vi' ? photos[2].title : photos[2].enTitle} loading="lazy" /><figcaption>{lang === 'vi' ? photos[2].title : photos[2].enTitle}</figcaption></figure><figure className="bd-mosaic-wide"><img src={photos[1].src} alt={lang === 'vi' ? photos[1].title : photos[1].enTitle} loading="lazy" /><figcaption>{lang === 'vi' ? photos[1].title : photos[1].enTitle}</figcaption></figure></div>
        </div>
      </div></section>

      <section className="bd-exhibition bd-section" id="bd-exhibition"><div className="bd-wrap"><span className="bd-kicker bd-kicker-light">{t.exhibitKicker}</span><div className="bd-exhibition-header"><h2>{t.exhibitTitle}</h2><p>{t.exhibitBody}</p></div>
        <div className="bd-layer-strip" role="group" aria-label={t.exhibitTitle}>
          {t.layerTitles.map((title, index) => <button
            key={title}
            className={`bd-layer ${activeLayer === index ? 'is-active' : ''}`}
            onClick={() => { setActiveLayer(index); onContentChange?.(); }}
            aria-pressed={activeLayer === index}
          >
            <img src={photos[[0, 2, 1, 3, 0][index]].src} alt="" loading="lazy" />
            <span className="bd-layer-shade" />
            <span className="bd-layer-number">0{index + 1}</span>
            {(index === 1 || index === 3) && <span className="bd-layer-illustration">{t.illustration}</span>}
            <span className="bd-layer-title">{title}</span>
            <span className="bd-layer-arrow"><ArrowRight size={20} /></span>
          </button>)}
        </div>
        <p className="bd-layer-detail"><span>0{activeLayer + 1} / 05</span>{t.layerDetails[activeLayer]}<button onClick={() => goTo(['bd-dunes','bd-forest','bd-archive','bd-wind','bd-closing'][activeLayer])}>{t.explore} <ArrowRight size={15}/></button></p>
      </div></section>

      <section className="bd-spread bd-section" id="bd-dunes"><div className="bd-wrap bd-spread-grid"><article className="bd-spread-text"><span className="bd-kicker">03 — {t.chapter} 01 / {t.origin}</span><h2>{t.dunesTitle}</h2><p>{t.dunesBody}</p><blockquote>“{t.dunesQuote}”</blockquote><span className="bd-page-number">01 / 03</span></article><figure className="bd-spread-image"><img src={photos[0].src} alt={lang === 'vi' ? photos[0].title : photos[0].enTitle} loading="lazy"/><figcaption>{lang === 'vi' ? photos[0].title : photos[0].enTitle} · {photos[0].credit}</figcaption></figure></div></section>

      <section className="bd-forest bd-section" id="bd-forest"><div className="bd-wrap bd-forest-grid"><figure className="bd-forest-image"><img src={photos[2].src} alt={lang === 'vi' ? photos[2].title : photos[2].enTitle} loading="lazy"/><figcaption>{lang === 'vi' ? photos[2].title : photos[2].enTitle} · {photos[2].credit}</figcaption></figure><article className="bd-forest-text"><span className="bd-kicker">{t.chapter} 02 / {t.forestCategory}</span><h2>{t.forestTitle}</h2><p>{t.forestBody}</p><span className="bd-forest-words">{t.forestWords}</span><span className="bd-page-number">02 / 03</span></article></div></section>

      <section className="bd-visual-break"><img src={photos[0].src} alt="" loading="lazy"/><div className="bd-visual-shade"/><div className="bd-visual-copy"><span className="bd-kicker bd-kicker-light">TRÀ VINH / BA ĐỘNG</span><h2>{t.breakTitle}</h2><p>{t.breakBody}</p></div></section>

      <section className="bd-wind bd-section" id="bd-wind"><div className="bd-wrap"><span className="bd-kicker">{t.windKicker}</span><h2>{t.windTitle}</h2><div className="bd-wind-grid"><figure><img src={photos[3].src} alt={lang === 'vi' ? photos[3].title : photos[3].enTitle} loading="lazy"/><figcaption>{lang === 'vi' ? photos[3].title : photos[3].enTitle} · {photos[3].credit}</figcaption></figure><article><p>{t.windBody}</p><div className="bd-timeline"><div><span>{t.then}</span><p>{t.thenText}</p></div><div><span>{t.now}</span><p>{t.nowText}</p></div></div><span className="bd-page-number">03 / 03</span></article></div></div></section>

      <section className="bd-brochure bd-section" id="bd-brochure"><div className="bd-wrap">
        <div className="bd-brochure-heading"><div><span className="bd-kicker">{t.brochureKicker}</span><h2>{t.brochureTitle}</h2></div><button className="bd-book-enlarge" disabled={turningSheet !== null} onClick={() => { setIsBookImmersive(true); onContentChange?.(); }}><Expand size={16}/>{t.bookLarge}</button></div>
        {!isBookImmersive && renderBookScene(false)}
      </div></section>

      <section className="bd-archive bd-section" id="bd-archive"><div className="bd-wrap"><span className="bd-kicker">{t.archiveKicker}</span><div className="bd-archive-heading"><h2>{t.archiveTitle}</h2><p>{t.archiveBody}</p></div><div className="bd-archive-grid">{photos.map((photo, index) => archiveImage(photo,index,`bd-archive-item-${index}`))}</div></div></section>

      <section className="bd-closing" id="bd-closing"><img src={photos[0].src} alt="" loading="lazy"/><div className="bd-closing-shade"/><div className="bd-closing-content"><span className="bd-kicker bd-kicker-light">TRÀ VINH  /  09°38′N</span><h2>{lang === 'vi' ? 'BIỂN BA ĐỘNG' : 'BA DONG BEACH'}</h2><p>“{t.closing}”</p><div className="bd-closing-actions"><button onClick={onClose}><Compass size={17}/>{t.backMap}</button>{onOpenPanorama360 && <button onClick={() => openExternalPanel(onOpenPanorama360)}><ArrowRight size={17}/>{t.panorama}</button>}</div></div>
        <details className="bd-closing-sources"><summary>{t.sources}</summary><div><a href="https://commons.wikimedia.org/wiki/File:Bi%E1%BB%83n_Ba_%C4%90%E1%BB%99ng,_Tr%C3%A0_Vinh.jpg" target="_blank" rel="noreferrer">Wikimedia Commons · Baoothersks · CC BY 4.0</a><a href="https://vietnamtourism.vn/index.php/tourism/items/1948" target="_blank" rel="noreferrer">Cục Du lịch Quốc gia Việt Nam</a><a href="https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_44_Casuarina_Tree_on_a_Beach.jpg" target="_blank" rel="noreferrer">CSIRO / Wikimedia Commons · CC BY 3.0</a><a href="https://images.unsplash.com/photo-1466611653911-95081537e5b7" target="_blank" rel="noreferrer">Unsplash · {lang === 'vi' ? 'ảnh điện gió minh họa' : 'illustrative wind energy photo'}</a><p>{t.sourceNote}</p></div></details>
      </section>
    </div>

    <div className="bd-controls"><button onClick={onToggleSoundscape} title={t.sound} aria-label={t.sound} aria-pressed={isSoundscapePlaying}>{isSoundscapePlaying ? <Volume2/> : <VolumeX/>}</button><button onClick={onToggleNarration} title={t.voice} aria-label={t.voice} aria-pressed={isNarrating}>{isNarrating ? <Mic/> : <MicOff/>}</button><button onClick={() => openExternalPanel(onOpenArtifactModal)} title={lang === 'vi' ? 'Tư liệu 3D' : '3D material'} aria-label={lang === 'vi' ? 'Tư liệu 3D' : '3D material'}><BookOpen/></button>{onOpenQRCode && <button onClick={() => openExternalPanel(onOpenQRCode)} title={t.phone} aria-label={t.phone}><Smartphone/></button>}{onToggleExpanded && <button onClick={onToggleExpanded} title={isExpanded ? t.shrink : t.expand} aria-label={isExpanded ? t.shrink : t.expand}>{isExpanded ? <Shrink/> : <Expand/>}</button>}{onClose && <button onClick={onClose} title={t.close} aria-label={t.close}><X/></button>}</div>
    {!isExpanded && onToggleSidebarWide && <button className="bd-edge-toggle" onClick={onToggleSidebarWide} title={isSidebarWide ? t.narrower : t.wider} aria-label={isSidebarWide ? t.narrower : t.wider} aria-pressed={isSidebarWide}>{isSidebarWide ? <PanelRightClose/> : <PanelRightOpen/>}</button>}
    {isBookImmersive && createPortal(<div className="bd-book-reader" role="dialog" aria-modal="true" aria-label={t.brochureTitle}>
      <div className="bd-book-reader-top"><span>BA ĐỘNG <span className="bd-book-reader-divider">/</span> {t.bookSpreadLabels[bookIndex]}</span><button onClick={() => setIsBookImmersive(false)} aria-label={t.bookClose}><Shrink size={18}/></button></div>
      <div className="bd-book-reader-content">{renderBookScene(true)}</div>
    </div>, document.body)}
    {lightbox !== null && createPortal(<div className="bd-lightbox" role="dialog" aria-modal="true" aria-label={lang === 'vi' ? photos[lightbox].title : photos[lightbox].enTitle} onClick={() => setLightbox(null)}><button className="bd-lightbox-close" onClick={() => setLightbox(null)} aria-label={t.lightboxClose}><X/></button><button className="bd-lightbox-prev" onClick={(event) => {event.stopPropagation();setLightbox((lightbox + photos.length - 1) % photos.length);}} aria-label={t.previous}><ArrowLeft/></button><figure onClick={(event) => event.stopPropagation()}><img src={photos[lightbox].src} alt={lang === 'vi' ? photos[lightbox].title : photos[lightbox].enTitle}/><figcaption>{lang === 'vi' ? photos[lightbox].title : photos[lightbox].enTitle}<small>{photos[lightbox].credit}</small></figcaption></figure><button className="bd-lightbox-next" onClick={(event) => {event.stopPropagation();setLightbox((lightbox + 1) % photos.length);}} aria-label={t.next}><ArrowRight/></button></div>, document.body)}
  </div>;
};
