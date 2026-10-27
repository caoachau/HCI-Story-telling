import React, { useRef } from 'react';
import { useChapterMotion } from './memorial-motion';
import { ChevronRight } from 'lucide-react';
import { WitnessPeopleIntro, WitnessPeopleScene } from './WitnessPeopleScene';
import { PortraitArchive, PortraitPeopleScene } from './PortraitPeopleScene';
import witnessBackground from '../../assets/den-tho-bac/people-user/witness-background-v1.webp';

interface Props {person:number;onSelect:(index:number)=>void;onOpen:(id:string)=>void;headingRef:React.RefObject<HTMLHeadingElement|null>;}

export function PeopleSection({person,onSelect,onOpen,headingRef}:Props){
  const motionRoot=useRef<HTMLElement>(null);
  useChapterMotion(motionRoot,'people',person);
  const portrait=person===1;
  const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{
    if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
    event.preventDefault();
    onSelect(event.key==='Home'?0:event.key==='End'?1:1-person);
  };
  return <section ref={motionRoot} className={`db-people db-people-shell db-people-${portrait?'portrait':'witness'}`} data-person-tab={portrait?'portrait':'witness'} aria-labelledby="db-people-title">
    {!portrait&&<div className="db-witness-backdrop" style={{backgroundImage:`url(${witnessBackground})`}} aria-hidden="true"/>}
    <header className="db-people-heading">
      <h1 ref={headingRef} id="db-people-title" tabIndex={-1}>Những người <span>giữ một niềm tin.</span></h1>
    </header>
    <div className="db-people-layout">
      <aside className="db-people-sidebar">
        <nav className="db-person-tabs db-people-tabs" aria-label="Chọn câu chuyện con người" onKeyDown={keyboard}>
          <button type="button" aria-pressed={!portrait} onClick={()=>onSelect(0)}>Người giữ đền<ChevronRight/></button>
          <button type="button" aria-pressed={portrait} onClick={()=>onSelect(1)}>Nét vẽ ký ức<ChevronRight/></button>
        </nav>
        {portrait?<PortraitArchive/>:<WitnessPeopleIntro onOpen={onOpen}/>}
      </aside>
      {portrait?<PortraitPeopleScene onOpen={onOpen}/>:<WitnessPeopleScene/>}
    </div>
  </section>;
}
