import React from 'react';
import {ArrowUpRight,Check} from 'lucide-react';
import {TimelineMilestone} from '../data/conChimData';
import {Modal} from './Modal';
export function VideoModal({milestone,onClose}:{milestone:TimelineMilestone|null;onClose:()=>void}){
  if(!milestone)return null;
  return <Modal title={milestone.title} onClose={onClose}><img className="cc-story-image" src={milestone.image} alt={milestone.title}/><div className="cc-modal-copy"><span className="cc-story-date">{milestone.date}</span><h3>{milestone.title}</h3><p>{milestone.detailDesc}</p><div className="cc-story-highlights">{milestone.highlights.map(item=><span key={item}><Check size={17}/>{item}</span>)}</div>{milestone.source&&<a className="cc-text-button" href={milestone.source} target="_blank" rel="noreferrer">Đọc nguồn tư liệu <ArrowUpRight size={17}/></a>}</div></Modal>;
}
