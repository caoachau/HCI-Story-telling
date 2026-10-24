module.exports = async function ({
  viewport,
  section,
  click,
  check,
  evaluate,
  wait,
  escape,
  shot,
  sleep,
  cdp,
  base,
}) {
  await cdp("Emulation.setFocusEmulationEnabled", { enabled: true });
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await cdp("Network.setCacheDisabled", { cacheDisabled: true });
  const quick = async () => {
    await cdp("Page.navigate", { url: base + "/" });
    await wait(
      "document.querySelector('.landmark-carousel-card[data-site-id=bao-tang-khmer]')",
      "opening host",
      45000,
    );
    await click(".landmark-carousel-card[data-site-id=bao-tang-khmer]");
    await wait(
      "document.querySelector('.lqv-photo>img')?.complete&&document.querySelector('.lqv-photo>img')?.naturalWidth>0",
      "quick photograph",
      45000,
    );
  };
  const ready = async () => {
    await wait(
      "['ready','reduced'].includes(document.querySelector('#museo-hero')?.dataset.introMotion)&&!document.querySelector('[data-museum-opening]')",
      "clean opening finish",
      15000,
    );
  };
  await viewport(1440, 960);
  await quick();
  await evaluate(
    "window.__mapCanvas=document.querySelector('.maplibregl-canvas');window.__mapRect=window.__mapCanvas.getBoundingClientRect().toJSON()",
  );
  await click("[data-action=show-location-details]");
  await check(
    "document.querySelector('[data-action=show-location-details]').disabled&&document.querySelector('.lqv-root').dataset.quickMotion==='entering-detail'&&document.querySelectorAll('[data-museum-opening]').length===1",
    "cold click responds immediately and owns one transition",
  );
  await click("[data-action=show-location-details]");
  await wait(
    "document.querySelector('[data-museum-opening=expanding]')",
    "shared photograph starts",
  );
  await evaluate(`window.__flight=document.querySelector('[data-museum-opening]');window.__flightBox=['left','top','width','height'].map(k=>window.__flight.style[k]);window.__flightChecks=[];
    const record=()=>{const f=window.__flight;if(!f.isConnected)return;const i=f.querySelector('img'),r=i.getBoundingClientRect();window.__flightChecks.push({fixed:['left','top','width','height'].every((k,n)=>f.style[k]===window.__flightBox[n]),ratio:Math.abs(r.width/r.height-i.naturalWidth/i.naturalHeight),expanded:f.getBoundingClientRect().width>parseFloat(f.style.width)*1.2});requestAnimationFrame(record)};requestAnimationFrame(record);`);
  await shot("optimized-shared-opening");
  await ready();
  await check(
    "window.__flightChecks.length>5&&window.__flightChecks.every(f=>f.fixed&&f.ratio<.02)&&window.__flightChecks.some(f=>f.expanded)",
    "shared crop expands without animating box geometry or stretching its photograph",
  );
  await check(
    "document.querySelectorAll('.md-deferred-screen').length===5&&document.querySelectorAll('.md-root img').length===6",
    "opening loads one composed screen while all five other chapters remain available",
  );
  await check(
    "const m=document.querySelector('[data-map-occluded=true]');m.inert&&getComputedStyle(m).opacity==='0'&&document.querySelector('.maplibregl-canvas')===window.__mapCanvas&&window.__mapCanvas.getBoundingClientRect().width===window.__mapRect.width",
    "covered map pauses without remounting or changing its canvas dimensions",
  );
  await check(
    "!document.querySelector('.heritage-location-detail').inert&&document.querySelector('.heritage-location-detail').getAttribute('aria-hidden')==='false'&&getComputedStyle(document.querySelector('.md-title-line')).transform==='none'",
    "completed page is accessible and its title is fully visible",
  );
  await shot("optimized-opening-desktop");
  await section("timeline");
  await evaluate(
    "window.__visitedRoom=document.querySelector('#museo-timeline');document.querySelector('.heritage-location-detail').focus()",
  );
  await escape();
  await wait(
    "document.querySelector('.heritage-location-detail').hidden",
    "return to quick window",
  );
  await check(
    "document.querySelector('[data-map-occluded=false]')&&!document.querySelector('[data-map-occluded=false]').inert&&document.querySelector('.maplibregl-canvas')===window.__mapCanvas&&document.activeElement.dataset.action==='show-location-details'",
    "return resumes the same map and restores the detail trigger",
  );
  await click("[data-action=show-location-details]");
  await wait(
    "!document.querySelector('.heritage-location-detail').hidden&&!document.querySelector('#museo-timeline').hidden",
    "retained history screen",
  );
  await check(
    "document.querySelector('#museo-timeline')===window.__visitedRoom&&!document.querySelector('[data-museum-opening]')",
    "reopening retains the visited chapter without an unrelated intro overlay",
  );

  await quick();
  await evaluate(
    "document.querySelector('[data-action=show-location-details]').focus()",
  );
  await wait(
    "document.querySelector('[data-detail-prepared=true] .md-root')",
    "intent prepares first screen",
    15000,
  );
  await check(
    "const d=document.querySelector('[data-detail-prepared=true]');d.inert&&d.getAttribute('aria-hidden')==='true'&&getComputedStyle(d).opacity==='0'&&document.querySelector('.lqv-root').getBoundingClientRect().width>0",
    "prepared shell remains invisible, inert and behind readable quick information",
  );
  await evaluate(
    "window.__preparedRoot=document.querySelector('.md-root');void 0",
  );
  await click("[data-action=show-location-details]");
  await wait(
    "document.querySelector('[data-museum-opening=expanding]')",
    "warmed photo handoff",
  );
  await viewport(390, 844);
  await ready();
  await check(
    "document.querySelector('.md-root')===window.__preparedRoot&&document.querySelector('.md-root').getBoundingClientRect().width===innerWidth&&document.querySelector('.md-root').getBoundingClientRect().height===innerHeight&&document.querySelectorAll('.md-section:not([hidden])').length===1",
    "resizing during the handoff settles into one full mobile screen",
  );
  await check(
    "const s=document.querySelector('.md-section:not([hidden])');s.scrollHeight<=s.clientHeight+2&&s.scrollWidth<=s.clientWidth+2&&getComputedStyle(document.querySelector('.md-title-line')).transform==='none'",
    "mobile opening has no clipping, outer scroll or leftover masks",
  );
  await shot("optimized-opening-mobile");

  await quick();
  await click("[data-action=show-location-details]");
  await click(".lqv-close");
  await wait(
    "!document.querySelector('.lqv-root')&&!document.querySelector('[data-museum-opening]')",
    "canceled focus phase",
  );
  await sleep(500);
  await check(
    "!document.querySelector('.heritage-location-detail')&&Boolean(document.querySelector('.landmark-carousel'))",
    "closing during focus cancels preload handoff and leaves no late-opening page",
  );

  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await quick();
  await click("[data-action=show-location-details]");
  await ready();
  await check(
    "document.querySelector('#museo-hero').dataset.introMotion==='reduced'&&!document.querySelector('[data-museum-opening]')&&getComputedStyle(document.querySelector('.md-chapter-dock')).opacity==='1'",
    "reduced motion opens the complete page directly without a shared flight",
  );
};
