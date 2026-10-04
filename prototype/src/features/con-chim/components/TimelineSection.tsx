import React,{useEffect,useRef} from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { MILESTONES, TimelineMilestone } from '../data/conChimData';
import { goToScreen } from '../utils/useScreenNavigation';
import './timeline.css';
import { MotionWords } from './MotionWords';

export function TimelineSection({ index, onChange, onPlayVideo }: {
  index: number;
  onChange: (index: number) => void;
  onPlayVideo: (item: TimelineMilestone) => void;
}) {
  const windowRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{windowRef.current?.scrollTo({top:0,behavior:'instant'});},[index]);
  return <section id="timeline" className="cc-timeline cc-section" data-step={index} aria-labelledby="cc-timeline-title">
    <div className="cc-history-stage">
      <div className="cc-history-bar">
        <h2 id="cc-timeline-title" className="cc-history-label">Dấu mốc Cồn Chim</h2>
        <nav className="cc-timeline-stations" aria-label="Chọn dấu mốc">
          {MILESTONES.map((item, i) => <button key={item.id} type="button" aria-controls={`cc-history-${item.id}`} aria-pressed={index === i} aria-current={index === i ? 'step' : undefined} onClick={() => onChange(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span> {item.date}
          </button>)}
        </nav>
        <span className="cc-history-progress" aria-label={`Dấu mốc ${index + 1} trên ${MILESTONES.length}`}>
          {String(index + 1).padStart(2, '0')} <span>/ {String(MILESTONES.length).padStart(2, '0')}</span>
        </span>
      </div>
      <div ref={windowRef} className="cc-history-window">
        <ol className="cc-history-track">
          {MILESTONES.map((item, i) => <li key={item.id} id={`cc-history-${item.id}`} className="cc-history-row" hidden={index !== i} aria-labelledby={`cc-history-title-${item.id}`}>
            <div className="cc-history-marker">
              <span className="cc-history-period">{item.date}</span>
              <span className="cc-history-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="cc-timeline-context cc-history-copy">
              <h3 id={`cc-history-title-${item.id}`}><MotionWords>{item.title}</MotionWords></h3>
              <p>{item.shortDesc}</p>
              <button type="button" className="cc-text-button" onClick={() => onPlayVideo(item)}>Đọc câu chuyện <ArrowUpRight size={18} /></button>
            </div>
            <figure className="cc-history-photo">
              <img src={item.image} alt={item.title} width={800} height={600} loading="lazy" style={{objectPosition:i===0?'35% center':'center'}} />
              <figcaption>{item.highlights[0]}</figcaption>
            </figure>
          </li>)}
        </ol>
      </div>
      <div className="cc-history-pagination">
        <button className="cc-icon-button" aria-label={index === 0 ? 'Về câu chuyện Cồn Chim' : 'Dấu mốc trước'} onClick={() => index === 0 ? goToScreen('overview') : onChange(index - 1)}><ChevronLeft size={20}/></button>
        <span>{index === 3 ? 'Tiếp theo: Những khoảnh khắc trên cồn' : `Dấu mốc ${index + 1} / 4`}</span>
        <button className="cc-icon-button" aria-label={index === 3 ? 'Sang hình ảnh Cồn Chim' : 'Dấu mốc tiếp theo'} onClick={() => index === 3 ? goToScreen('gallery') : onChange(index + 1)}><ChevronRight size={20}/></button>
      </div>
    </div>
  </section>;
}
