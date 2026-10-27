/** Opening a full museum story keeps the location photograph static. */
module.exports = async function ({viewport,click,check,evaluate,wait,escape,shot,sleep,cdp,base}) {
  const quick=async()=>{
    await cdp('Page.navigate',{url:base+'/'});
    await wait("document.querySelector('.landmark-carousel-card[data-site-id=bao-tang-khmer]')",'host location',45000);
    await click('.landmark-carousel-card[data-site-id=bao-tang-khmer]');
    await wait("document.querySelector('.lqv-photo>img')?.complete&&document.querySelector('.lqv-photo>img')?.naturalWidth>0",'static location image',45000);
  };
  const ready=()=>wait("['ready','reduced'].includes(document.querySelector('#museo-hero')?.dataset.introMotion)&&document.querySelector('.md-root').getBoundingClientRect().width===innerWidth",'full story ready',20000);
  await cdp('Emulation.setFocusEmulationEnabled',{enabled:true});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await viewport(1440,960);await quick();
  await check("document.querySelector('.lqv-hero').getAnimations({subtree:true}).length===0",'cold quick view has a static photograph');
  await click('[data-action=show-location-details]');
  await check("!document.querySelector('[data-museum-opening]')",'full-story click does not create an animated photo clone');
  await ready();
  await check("document.querySelectorAll('.md-root').length===1&&document.querySelectorAll('.md-section:not([hidden])').length===1",'cold click opens one complete museum screen');
  await shot('direct-museum-opening-desktop');

  await quick();
  await evaluate("document.querySelector('[data-action=show-location-details]').focus()");
  await wait("document.querySelector('[data-detail-prepared=true] .md-root')",'prepared museum',15000);
  await evaluate("window.__preparedRoot=document.querySelector('.md-root');void 0");
  await check("const d=document.querySelector('[data-detail-prepared=true]');d.inert&&d.getAttribute('aria-hidden')==='true'&&getComputedStyle(d).opacity==='0'",'preloading remains invisible and inert');
  await click('[data-action=show-location-details]');await viewport(390,844);await ready();
  await check("document.querySelector('.md-root')===window.__preparedRoot&&!document.querySelector('[data-museum-opening]')",'warm click reuses the prepared screen without a flying image');
  await shot('direct-museum-opening-mobile');

  await quick();
  await evaluate("document.querySelector('[data-action=show-location-details]').focus()");
  await click('.lqv-close');await sleep(500);
  await check("!document.querySelector('.lqv-root')&&!document.querySelector('.heritage-location-detail')&&!document.querySelector('[data-museum-opening]')",'closing the quick window cannot open a late full story');

  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await quick();await click('[data-action=show-location-details]');await ready();
  await check("document.querySelector('#museo-hero').dataset.introMotion==='reduced'&&!document.querySelector('[data-museum-opening]')",'reduced motion keeps direct full-story navigation');
};
