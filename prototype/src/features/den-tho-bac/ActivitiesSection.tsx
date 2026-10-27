import React, { useRef } from 'react';
import { useChapterMotion } from './memorial-motion';
import { ArrowRight, Flower2 } from 'lucide-react';
import { ACTIVITIES, ACTIVITY_PHOTOS } from './activity-content';
import { Picture } from './MemorialMedia';

interface Props {
  onOpen:(id:string)=>void;
  headingRef:React.RefObject<HTMLHeadingElement|null>;
}

export function ActivitiesSection({onOpen,headingRef}:Props) {
  const motionRoot=useRef<HTMLElement>(null);
  useChapterMotion(motionRoot,'activities','entry');
  return <section ref={motionRoot} className="db-activities db-activities-exhibition" aria-labelledby="db-activities-title">
    <header className="db-section-heading">
      <div><h1 ref={headingRef} id="db-activities-title" tabIndex={-1}>Những dịp <span>trở về.</span></h1></div>
      <p>Tưởng nhớ, lắng nghe và học hỏi. Những ngày dưới đây gợi nhắc ý nghĩa, không thay thế lịch tổ chức thực tế.</p>
    </header>
    <div className="db-calendar">
      {ACTIVITIES.map((item,index)=><article className={`db-date-card db-date-card-${index}`} data-activity={item.id} key={item.id} aria-labelledby={`db-activity-title-${item.id}`}>
        <Picture className="db-activity-photo" photo={ACTIVITY_PHOTOS[item.story]} width={item.width} height={item.height} eager/>
        <div className="db-activity-copy">
          <span className="db-date-tag">{item.tag}</span>
          <h2 id={`db-activity-title-${item.id}`}>{item.title}</h2>
          <p>{item.copy}</p>
          <div className="db-date-invitation"><span>{item.detail}</span><button type="button" aria-label={`Tìm hiểu: ${item.title}`} onClick={()=>onOpen(item.story)}><ArrowRight/></button></div>
        </div>
        <div className="db-date-number"><strong>{item.day}</strong><span>{item.month}</span></div>
      </article>)}
    </div>
    <div className="db-visit-note"><Flower2/><p>Khi đến viếng: trang phục lịch sự, nói vừa đủ nghe, nhường lối và tôn trọng người đang tưởng niệm.</p><button className="db-text-button" type="button" onClick={()=>onOpen('activity-visit')}>Xem gợi ý tham quan<ArrowRight/></button></div>
  </section>;
}
