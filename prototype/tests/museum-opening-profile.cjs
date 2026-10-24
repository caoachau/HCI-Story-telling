const fs = require("node:fs");
const path = require("node:path");
module.exports = async function ({
  viewport,
  click,
  evaluate,
  wait,
  sleep,
  cdp,
  base,
}) {
  await cdp("Emulation.setFocusEmulationEnabled", { enabled: true });
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await viewport(1440, 960);
  await cdp("Network.setCacheDisabled", { cacheDisabled: true });
  const results = [];
  for (const rate of [1, 4]) {
    await cdp("Emulation.setCPUThrottlingRate", { rate });
    await cdp("Page.navigate", { url: base + "/" });
    await wait(
      "document.querySelector('.landmark-carousel-card[data-site-id=bao-tang-khmer]')",
      "host landmark",
      45000,
    );
    await click(".landmark-carousel-card[data-site-id=bao-tang-khmer]");
    await wait(
      "document.querySelector('[data-action=show-location-details]')&&document.querySelector('.lqv-photo>img')?.complete",
      "museum quick photograph",
      45000,
    );
    await wait(
      "document.querySelector('.lqv-root').dataset.quickMotion==='ready'",
      "quick introduction settles",
    );
    await sleep(350);
    if (process.env.PROFILE_WAIT_PREPARED) {
      await wait(
        "document.querySelector('[data-detail-prepared=true] .md-root')",
        "warm first screen",
        15000,
      );
      await sleep(150);
    }
    const preparedAtClick = await evaluate(
      "Boolean(document.querySelector('[data-detail-prepared=true] .md-root'))",
    );
    await cdp("Performance.enable");
    const before = (await cdp("Performance.getMetrics")).metrics;
    if (process.env.PROFILE_READS)
      await evaluate(`window.__openingReads=[];window.__openingReadRestores=[];
      const log=(name,node,fn)=>{const t=performance.now(),r=fn(),d=performance.now()-t;if(d>5)window.__openingReads.push({name,ms:d,node:node?.className?.baseVal??node?.className,stack:new Error().stack});return r};
      for(const [proto,name] of [[Element.prototype,'clientWidth'],[Element.prototype,'scrollTop'],[HTMLElement.prototype,'offsetWidth'],[HTMLElement.prototype,'offsetHeight']]){const d=Object.getOwnPropertyDescriptor(proto,name);if(!d)continue;Object.defineProperty(proto,name,{...d,get(){return log(name,this,()=>d.get.call(this))},set:d.set?function(v){return log(name+'=',this,()=>d.set.call(this,v))}:undefined});window.__openingReadRestores.push(()=>Object.defineProperty(proto,name,d))}
      const original=Element.prototype.getBoundingClientRect;Element.prototype.getBoundingClientRect=function(){return log('bounds',this,()=>original.call(this))};window.__openingReadRestores.push(()=>Element.prototype.getBoundingClientRect=original);
      const css=window.getComputedStyle;window.getComputedStyle=function(n,p){return log('computedStyle',n,()=>css.call(this,n,p))};window.__openingReadRestores.push(()=>window.getComputedStyle=css);
    `);
    await evaluate(`window.__openingProfile={start:performance.now(),frames:[],tasks:[],longFrames:[],stages:[],active:true};
      const profile=window.__openingProfile;let previous=profile.start;
      const record=t=>{if(!profile.active)return;profile.frames.push(t-previous);previous=t;const root=document.querySelector('.md-root');if(root&&!root.closest('[data-detail-prepared=true],[hidden]')&&!profile.mount){profile.mount=t-profile.start;profile.nodes=root.querySelectorAll('*').length;profile.images=root.querySelectorAll('img').length}if(document.querySelector('#museo-hero')?.dataset.introMotion==='ready'&&!profile.ready)profile.ready=t-profile.start;requestAnimationFrame(record)};requestAnimationFrame(record);
      for(const type of ['longtask','long-animation-frame'])if(PerformanceObserver.supportedEntryTypes.includes(type)){const observer=new PerformanceObserver(list=>list.getEntries().forEach(e=>profile[type==='longtask'?'tasks':'longFrames'].push({start:e.startTime-profile.start,duration:e.duration,blocking:e.blockingDuration,render:e.renderStart?e.startTime+e.duration-e.renderStart:0,scripts:e.scripts?.map(s=>({duration:s.duration,forcedLayout:s.forcedStyleAndLayoutDuration,source:s.sourceURL,position:s.sourceCharPosition,invoker:s.invoker}))})));observer.observe({type,buffered:false});(profile.observers??=[]).push(observer)}
      document.querySelector('[data-action=show-location-details]').click();`);
    await wait(
      "document.querySelector('#museo-hero')&&['ready','reduced'].includes(document.querySelector('#museo-hero').dataset.introMotion)",
      "museum entrance finishes",
      45000,
    );
    await sleep(180);
    const raw = await evaluate(
      "window.__openingProfile.active=false;window.__openingProfile.observers?.forEach(o=>o.disconnect());({...window.__openingProfile,observers:undefined})",
    );
    const after = (await cdp("Performance.getMetrics")).metrics;
    const frames = raw.frames
      .filter((x, index) => index > 0 && x > 0)
      .sort((a, b) => a - b);
    const metrics = Object.fromEntries(
      after
        .filter((x) => /Duration|Count/.test(x.name))
        .map((x) => [
          x.name,
          Number(
            (
              x.value - (before.find((y) => y.name === x.name)?.value ?? 0)
            ).toFixed(5),
          ),
        ]),
    );
    const result = {
      rate,
      preparedAtClick,
      clickToMount: raw.mount,
      clickToReady: raw.ready,
      nodesAtMount: raw.nodes,
      imagesAtMount: raw.images,
      frames: {
        count: frames.length,
        p95: frames[Math.floor(frames.length * 0.95)],
        max: frames.at(-1),
        over33: frames.filter((x) => x > 33.4).length,
        over50: frames.filter((x) => x > 50).length,
      },
      longTasks: raw.tasks,
      longAnimationFrames: raw.longFrames,
      slowReads: process.env.PROFILE_READS
        ? await evaluate(
            "window.__openingReadRestores.forEach(f=>f());window.__openingReads",
          )
        : undefined,
      metrics,
    };
    results.push(result);
    console.log(JSON.stringify(result, null, 2));
  }
  const name = process.env.PROFILE_LABEL || "current";
  fs.writeFileSync(
    path.resolve(__dirname, "../preview/museum-opening-" + name + ".json"),
    JSON.stringify({ base, results }, null, 2),
  );
  await cdp("Emulation.setCPUThrottlingRate", { rate: 1 });
};
