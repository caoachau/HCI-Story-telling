import React from 'react';
import { ArrowLeft, ArrowRight, Check, ExternalLink } from 'lucide-react';
import type { ActivityPreview as ActivityData } from '../data/storyLayers';
import { ActivityStatus } from '../../../experience/EvidencePanels';

export function ActivityPreview({activity,step,onStep,material,onMaterial}:{activity:ActivityData;step:number;onStep:(step:number)=>void;material:number;onMaterial:(index:number)=>void}) {
  return <div className="ccl-activity"><p className="cck-kicker">Xem trước · Khoảng 2 phút đọc, tùy tốc độ</p><h2 id="cck-reader-title">{activity.title}</h2><p className="ccl-lead">{activity.introduction}</p>
    <div className="ccl-host-info"><strong>Ai hướng dẫn?</strong><p>{activity.host}</p></div>
    <ActivityStatus siteId="con-chim" lang="vi" />
    <h3>Bạn sẽ gặp những gì?</h3><div className="ccl-materials">{activity.materials.map((item,index)=><button type="button" key={item.title} aria-pressed={material===index} onClick={()=>onMaterial(index)}>{item.title}</button>)}</div><p className="ccl-material-detail" aria-live="polite">{activity.materials[material].explanation}</p>
    <h3>Một cách bắt đầu cho người mới</h3><div className="ccl-step-tabs" aria-label="Xem trước từng phần">{activity.steps.map((item,index)=><button type="button" key={item.title} aria-pressed={step===index} onClick={()=>onStep(index)}><span>{index+1}</span>{item.title}</button>)}</div>
    <div className="ccl-step" aria-live="polite"><p>Phần {step+1} / {activity.steps.length}</p><h3>{activity.steps[step].title}</h3><p>{activity.steps[step].explanation}</p></div>
    <div className="ccl-step-actions"><button type="button" className="cck-outline" disabled={step===0} onClick={()=>onStep(step-1)}><ArrowLeft size={19}/>Phần trước</button><button type="button" className="cck-outline" disabled={step===activity.steps.length-1} onClick={()=>onStep(step+1)}>Phần tiếp<ArrowRight size={19}/></button></div>
    <p className="ccl-activity-result"><Check size={22}/>{activity.result}</p><aside className="ccl-ask-host"><h3>Muốn tham gia, hãy hỏi trực tiếp</h3><p>{activity.ask}</p><p>Thời gian thực hành tùy hộ và buổi đón khách; phần xem trước này chưa phải lịch hẹn.</p></aside>
    <a className="ccl-activity-source" href={activity.source.url} target="_blank" rel="noopener noreferrer">Tư liệu về hoạt động tại Cồn Chim<ExternalLink size={16}/></a>
  </div>;
}
