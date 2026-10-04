import React,{useEffect,useRef,useState} from 'react';
import {Header} from './components/Header';
import {TravelGuideHero} from './components/TravelGuideHero';
import {OverviewSection} from './components/OverviewSection';
import {TimelineSection} from './components/TimelineSection';
import {GallerySection} from './components/GallerySection';
import {ExploreMoreSection} from './components/ExploreMoreSection';
import {HeroSection} from './components/HeroSection';
import {Footer} from './components/Footer';
import {ItineraryModal} from './components/ItineraryModal';
import {VideoModal} from './components/VideoModal';
import {VeoVideoModal} from './components/VeoVideoModal';
import {TimelineMilestone} from './data/conChimData';
import {goToScreen,useScreenNavigation} from './utils/useScreenNavigation';
import {useDetailMotion} from './utils/useDetailMotion';
import {useReveal} from './utils/useReveal';

export default function App(){
  const [itinerary,setItinerary]=useState(false),[tour,setTour]=useState('village'),[milestone,setMilestone]=useState<TimelineMilestone|null>(null),[studio,setStudio]=useState(false);
  const viewport=useRef<HTMLElement>(null);
  const [chapter,setChapter]=useState(0),[history,setHistory]=useState(0),[experience,setExperience]=useState(0);
  const [compact,setCompact]=useState(()=>window.matchMedia('(max-width:767px)').matches);
  useEffect(()=>{const query=window.matchMedia('(max-width:767px)');const update=()=>setCompact(query.matches);query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
  useScreenNavigation(viewport,{
    overview:{index:chapter,count:4,go:setChapter},
    timeline:{index:history,count:4,go:setHistory},
    experiences:{index:compact?experience:0,count:compact?3:1,go:setExperience},
  });
  useReveal();
  useDetailMotion(viewport);
  const openPlan=(tag?:string)=>{setTour(tag||'village');setItinerary(true);};
  return <div className="cc-page">
    <a className="cc-skip-link" href="#overview">Đến câu chuyện Cồn Chim</a>
    <Header onOpenItinerary={()=>openPlan()} onOpenVeoModal={()=>setStudio(true)}/>
    <main ref={viewport} className="cc-screen-viewport" aria-label="Khám phá Cồn Chim theo từng màn hình">
      <TravelGuideHero onStartExploring={()=>goToScreen('overview')}/>
      <OverviewSection index={chapter} onChange={setChapter} onOpenItinerary={openPlan}/>
      <TimelineSection index={history} onChange={setHistory} onPlayVideo={setMilestone}/>
      <GallerySection/>
      <ExploreMoreSection index={experience} onChange={setExperience} compact={compact} onOpenItinerary={openPlan}/>
      <HeroSection onOpenItinerary={openPlan}/>
      <Footer/>
    </main>
    <ItineraryModal isOpen={itinerary} initialTour={tour} onClose={()=>setItinerary(false)}/>
    <VideoModal milestone={milestone} onClose={()=>setMilestone(null)}/>
    <VeoVideoModal isOpen={studio} onClose={()=>setStudio(false)}/>
  </div>;
}
