import React, { type RefObject } from 'react';
import { ArrowRight, ChevronLeft, Leaf, MapPin, ScrollText, Users, Utensils } from 'lucide-react';
import { HERO_BANNER } from '../data/conChimData';
import { DiscoveryImage } from './DiscoveryImage';

export function ConChimOverview({headingRef,onBack,onChoose,onExplore}:{headingRef:RefObject<HTMLHeadingElement|null>;onBack:()=>void;onChoose:(id:string)=>void;onExplore:()=>void}) {
  return <section className="cck-overview" aria-labelledby="cck-overview-title" data-content-section="overview">
    <div className="cck-overview-hero">
      <DiscoveryImage photo={HERO_BANNER} eager/>
      <div className="cck-overview-shade" aria-hidden="true"/>
      <div className="cck-overview-copy"><button type="button" className="cck-back" onClick={onBack}><ChevronLeft/>01 / 05 · Tổng quan</button><h1 id="cck-overview-title" ref={headingRef} tabIndex={-1}>Một cù lao.<br/>Một nếp sống.</h1><p>Giữa dòng Cổ Chiên, cảnh quan, món ăn và những mái nhà cùng kể câu chuyện sống thuận thiên.</p><button type="button" className="cck-primary" onClick={onExplore}>Chọn điểm khám phá<ArrowRight/></button></div>
      <a className="cck-overview-photo-credit" href={HERO_BANNER.source} target="_blank" rel="noopener noreferrer">Ảnh: {HERO_BANNER.credit}<ArrowRight/></a>
    </div>
    <div className="cck-overview-facts" aria-label="Ba cách khám phá Cồn Chim">
      <button type="button" onClick={()=>onChoose('banh-xeo')}><Utensils/><span><strong>Ghé một gian bếp</strong><small>Món quê nối với nguyên liệu và người làm ra nó.</small></span><ArrowRight/></button>
      <button type="button" onClick={()=>onChoose('ruong-ao')}><Leaf/><span><strong>Nhìn nhịp con nước</strong><small>Ruộng lúa, ao nuôi và câu chuyện sinh kế.</small></span><ArrowRight/></button>
      <button type="button" onClick={()=>onChoose('nguoi-dan')}><Users/><span><strong>Gặp người ở cồn</strong><small>Mỗi hộ góp một thế mạnh để cùng đón khách.</small></span><ArrowRight/></button>
    </div>
    <div className="cck-overview-bottom"><div><h2>Câu chuyện bắt đầu<br/>từ đời sống.</h2><p>Chọn đọc nhanh, nghe tóm tắt hoặc hỏi sâu một chi tiết. Bạn không cần xem theo thứ tự.</p></div><div className="cck-overview-links"><button type="button" onClick={()=>onChoose('ngay-dau')}><ScrollText/><span><strong>Những ngày đầu làm du lịch</strong><small>Ngày ra mắt 9/9/2019 và hành trình đón khách.</small></span><ArrowRight/></button><button type="button" onClick={onExplore}><MapPin/><span><strong>Tự chọn một câu chuyện</strong><small>Món ăn, cảnh quan hoặc câu chuyện địa phương.</small></span><ArrowRight/></button><a href={HERO_BANNER.source} target="_blank" rel="noopener noreferrer">Ảnh toàn cảnh: {HERO_BANNER.credit}<ArrowRight/></a></div></div>
  </section>;
}
