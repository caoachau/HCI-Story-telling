import React from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { DiscoveryStory } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';

export function StoryQuestions({story,selected,onSelect}:{story:DiscoveryStory;selected:string|undefined;onSelect:(id:string|undefined)=>void}) {
  const layer=STORY_LAYERS[story.id];
  return <div className="ccl-questions">
    <p className="cck-kicker">Hỏi sâu · Phần mở rộng tùy chọn</p><h2 id="cck-reader-title">{story.title}</h2>
    <p className="ccl-lead">Chọn một điều bạn muốn hiểu. Bạn có thể bỏ qua bất kỳ câu hỏi nào.</p>
    <div className="ccl-question-list">{layer.questions.map(question=><section key={question.id}>
      <h3><button type="button" data-question-id={question.id} aria-expanded={selected===question.id} aria-controls={`ccl-answer-${question.id}`} onClick={()=>onSelect(selected===question.id?undefined:question.id)}>{question.title}<ChevronDown size={22}/></button></h3>
      <div id={`ccl-answer-${question.id}`} hidden={selected!==question.id}><span className="ccl-content-kind">{question.kind}</span><p>{question.answer}</p>{question.source&&<a href={question.source.url} target="_blank" rel="noopener noreferrer">{question.source.publisher} · {question.source.published}<ExternalLink size={16}/></a>}</div>
    </section>)}</div>
    {layer.caseStudy&&<aside className="ccl-case"><h3>{layer.caseStudy.title}</h3><p>{layer.caseStudy.body}</p><a href={layer.caseStudy.source.url} target="_blank" rel="noopener noreferrer">Đọc ghi nhận gốc · {layer.caseStudy.source.published}<ExternalLink size={16}/></a></aside>}
    <div className="ccl-observe-prompt"><h3>Một điều để quan sát</h3><p>{layer.observe}</p></div>
  </div>;
}
