import { useEffect } from 'react';
export function useReveal(){
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements=[...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}
    }),{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
    const update=()=>{
      const reduce=media.matches||document.documentElement.classList.contains('reduce-motion');
      elements.forEach(element=>{if(reduce){element.classList.add('is-revealed');element.classList.remove('reveal-wait');}else if(!element.classList.contains('is-revealed')){element.classList.add('reveal-wait');observer.observe(element);}});
    };
    update();
    const preferences=new MutationObserver(update);
    preferences.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
    media.addEventListener('change',update);
    return()=>{observer.disconnect();preferences.disconnect();media.removeEventListener('change',update);};
  },[]);
}
