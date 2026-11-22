/* Spatial chapters and the native, viewport-paginated exhibition viewer. */
module.exports = async function placeChecks(api, motion = false) {
  const { viewport, section, click, check, evaluate, wait, escape, shot, sleep, cdp } = api;
  const areas = {
    landscape: ['entrance', 'memorial'],
    grounds: ['entrance', 'entrance', 'architecture', 'memorial'],
    ground: ['welcome', 'welcome', 'stairs'],
    upper: ['faith', 'archaeology', 'manuscripts', 'daily-life', 'crafts', 'performing'],
  };
  const sceneReady = "document.getElementById('museo-map').dataset.placeSceneMotion==='ready'";
  const ready = "document.querySelector('.md-place-viewer')?.dataset.placeViewerMotion==='ready'";
  const closed = "!document.querySelector('.md-place-viewer')";
  const fit = "const d=document.querySelector('.md-place-viewer'),p=document.querySelector('.md-place-viewer-panel'),c=document.querySelector('.md-place-content:not(.md-place-measure)'),r=c.getBoundingClientRect(),v=d.getBoundingClientRect();v.left>=11&&v.top>=11&&v.right<=innerWidth-11&&v.bottom<=innerHeight-11&&d.scrollWidth<=d.clientWidth+1&&p.scrollHeight<=p.clientHeight+1&&c.scrollHeight<=c.clientHeight+1&&[...c.children].every(b=>{const x=b.getBoundingClientRect();return x.top>=r.top-1&&x.bottom<=r.bottom+1})";
  const area = async zone => { await click('[data-place-zone="'+zone+'"]'); await wait(sceneReady,'spatial chapter finishes'); };
  const open = async (zone,id) => {
    if(await evaluate("document.querySelector('.md-place-viewer')!==null")) { await escape(); await wait(closed,'previous viewer closes'); }
    await area(zone);
    const selector=zone==='ground'?'.kd-strip [data-entry-card="'+id+'"]':'.kd-strip [data-place-id="'+id+'"]';
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus();document.querySelector(${JSON.stringify(selector)}).click()`);
    await click('[data-action=explore-khmer-place]');
    await wait(ready,id+' exhibition opens');
    await wait("document.querySelector('.md-site-main-image').complete&&document.querySelector('.md-site-main-image').naturalWidth>0",id+' photograph loads');
  };
  const page = async selector => { await click(selector); await wait(ready,'exhibition page finishes'); await sleep(35); };
  await viewport(1440,960); await section('map');
  if(motion) {
    await cdp('Emulation.setFocusEmulationEnabled',{enabled:true});
    await evaluate("document.documentElement.classList.remove('reduce-motion','heritage-reduce-motion')");
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await wait("document.getElementById('museo-map').dataset.reducedMotion==='false'&&"+sceneReady,'normal motion preference is applied');
    await area('landscape');
    await click('.kd-strip [data-place-id=entrance]');
    await check("!document.querySelector('dialog')&&!document.querySelector('.md-memory-pulse,.md-places-topic')",'site selection updates its introduction without invented spatial animation');
    await click('[data-action=explore-khmer-place]');
    await wait(ready,'shared image opening');
    await check("!document.querySelector('.md-place-image-flight')&&getComputedStyle(document.querySelector('.md-place-viewer-backdrop')).backdropFilter==='blur(10px)'",'existing story viewer retains its contained image transition');
    await click('[data-place-page="next"]');
    await check("document.querySelector('.md-place-viewer').dataset.placeViewerMotion==='changing'",'page navigation starts a contained horizontal transition');
    await wait(ready,'exhibition transition'); await check(fit,'animated page finishes without clipped content');
    await page('[data-place-chapter-link="overview"]');
    await escape();
    await check("document.querySelector('.md-place-viewer').dataset.placeViewerMotion==='closing'&&!!document.querySelector('.md-place-image-flight')",'close reverses the image transition');
    await wait(closed,'reverse image closes');
    await check("document.activeElement===document.querySelector('[data-action=explore-khmer-place]')&&!document.querySelector('.md-place-image-flight')",'closing removes the shared image and restores trigger focus');
    await click('[data-action=explore-khmer-place]'); await escape(); await wait(closed,'Escape during opening');
    await check("!document.querySelector('.md-place-image-flight')&&getComputedStyle(document.querySelector('.md-scroll')).opacity==='1'",'interrupted opening cleans up the image and background');
    await open('upper','manuscripts'); await click('[data-place-page="next"]');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await wait(ready,'live reduced motion settles');
    await check("document.querySelector('.md-place-viewer').dataset.reducedMotion==='true'&&getComputedStyle(document.querySelector('.md-place-viewer-page')).opacity==='1'&&!document.querySelector('.md-place-image-flight')",'live reduced motion resolves the current page and reveals its content');
    await check(fit,'reduced-motion page stays within its frame'); await escape(); await wait(closed,'reduced motion closes immediately');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await viewport(390,844);await open('upper','manuscripts');await page('[data-place-chapter-link="gallery"]');
    await check(fit,'portrait phone gallery fits during normal motion');await shot('places-motion-phone');
    const before=await evaluate("document.querySelector('.md-place-page-count').textContent");
    const y=await evaluate("const r=document.querySelector('.md-place-viewer-image').getBoundingClientRect();r.top+r.height/2");
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
    await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:280,y}]});
    for(let step=1;step<=6;step++){await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:280-step*30,y}]});await sleep(25);}
    await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await wait(ready,'horizontal exhibition swipe');
    await check(`document.querySelector('.md-place-page-count').textContent!==${JSON.stringify(before)}&&!document.getElementById('museo-map').hidden`,'horizontal phone swipe turns a page while retaining section three');
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
    await viewport(667,375);await sleep(100);await check(fit,'short landscape remains paginated after resizing an open exhibition');await shot('places-motion-landscape');
    await escape();await wait(closed,'phone exhibition closes');await section('overview');
    await check("!document.querySelector('.md-memory-pulse')",'hidden spatial section has no active ambient motion');
    await shot('places-motion-finished'); return;
  }
  await area('landscape');
  await check("document.querySelectorAll('[data-place-zone]').length===4&&!document.querySelector('.md-places-geo-pin,.md-places-tiles,.md-places-topic')",'four discovery tabs use photographs and lists without guessed coordinates');
  for(const [zone,ids] of Object.entries(areas)) {
    await area(zone);
    await check(`JSON.stringify([...document.querySelectorAll('.kd-strip [data-place-id]')].map(b=>b.dataset.placeId))===${JSON.stringify(JSON.stringify(ids))}`,zone+' displays only its own selection cards');
  }
  const readAll = async label => {
    await page('[data-place-chapter-link="overview"]');
    const total=await evaluate("Number(document.querySelector('.md-place-viewer-panel').dataset.pageCount)");
    const collected={}; let related=0,sources=0;
    for(let n=0;n<total;n++) {
      await check(fit,label+' page '+(n+1)+' fits without vertical scrolling');
      const blocks=await evaluate("[...document.querySelectorAll('.md-place-content:not(.md-place-measure) [data-block-id]')].map(b=>({id:b.dataset.blockId,text:b.querySelector('.md-place-block-text').textContent}))");
      for(const b of blocks)collected[b.id]=(collected[b.id]||'')+' '+b.text;
      related+=await evaluate("document.querySelectorAll('[data-related-place]').length");
      sources+=await evaluate("document.querySelectorAll('.md-place-content:not(.md-place-measure) .md-place-block-source a').length");
      if(n<total-1)await page('[data-place-page="next"]');
    }
    await check("document.querySelector('[data-place-page=next]').disabled&&document.querySelectorAll('.md-place-viewer-page').length===1",label+' finishes at its last page with one visible frame');
    if(!['story-0','story-1','story-2','insight-0','insight-1','insight-2'].every(id=>collected[id]?.length>20))throw Error(label+' lost a story or observation prompt: '+JSON.stringify(Object.keys(collected)));
    if(related!==3||sources<1)throw Error(label+' lost related places or primary source links');
    return Object.values(collected).join(' ');
  };
  for(const [zone,ids] of Object.entries(areas))for(const id of ids) {
    await open(zone,id);
    const text=await readAll(id);
    if(id==='archaeology'&&(!text.includes('Bảo tàng tỉnh Vĩnh Long')||!text.includes('không khẳng định')))throw Error('Regional treasure custody distinction was lost');
    await page('[data-place-chapter-link="gallery"]');
    const count=await evaluate("Number(document.querySelector('.md-place-photo-count').textContent.split('/')[1])");
    for(let n=0;n<count;n++) {
      await wait("document.querySelector('.md-site-main-image').complete&&document.querySelector('.md-site-main-image').naturalWidth>0",id+' gallery image');
      await check(`document.querySelectorAll('.md-site-thumbnails button').length===3&&document.querySelector('[data-place-photo="${n}"]').getAttribute('aria-pressed')==='true'&&document.querySelector('.md-place-visual-credit a').href.startsWith('https://')&&document.querySelector('.md-site-main-image').alt.length>5`,id+' gallery photograph '+(n+1)+' has a three-photo window, title and credit');
      await page('[aria-label="Ảnh tiếp theo của điểm đến"]');
    }
    await check("document.querySelector('[data-place-photo=\"0\"]').getAttribute('aria-pressed')==='true'",id+' gallery wraps to its first photograph');
    await escape(); await wait(closed,id+' closes');
    await check("document.activeElement===document.querySelector('[data-action=explore-khmer-place]')",id+' restores focus to the introduction action');
  }
  await open('upper','archaeology'); await page('[data-place-chapter-link="context"]');
  await click('[data-related-place="manuscripts"]');await wait(ready,'related exhibition');
  await check("document.querySelectorAll('.md-place-viewer').length===1&&document.querySelector('.md-place-viewer-panel').dataset.placeId==='manuscripts'&&document.querySelector('.kd-detail').dataset.selectedPlace==='manuscripts'",'related stories update the same native viewer and its background selection');
  for(const [w,h] of [[1920,1080],[1366,768],[1440,600],[1024,768],[768,1024],[390,844],[320,568],[844,390],[667,375],[1920,500]]) {
    await viewport(w,h);await sleep(100);await readAll(w+'x'+h+' manuscript');
    await check("const b=document.querySelector('.md-dialog-close'),r=b.getBoundingClientRect();b.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",w+'x'+h+' close control remains reachable');
    await page('[data-place-chapter-link="gallery"]');await check(fit,w+'x'+h+' gallery fits');
    await check("const a=document.querySelector('.md-place-viewer-image').getBoundingClientRect(),b=document.querySelector('.md-place-gallery-strip').getBoundingClientRect(),v=document.querySelector('.md-place-viewer-visual').getBoundingClientRect();a.height>16&&b.bottom<=v.bottom+1",w+'x'+h+' gallery keeps its main photograph and controls visible');
    if([1920,390,320,844,667].includes(w))await shot('places-viewer-'+w+'x'+h);
  }
  await escape();await wait(closed,'responsive viewer closes');
  await viewport(1440,960);await open('grounds','architecture');
  await page('[data-place-chapter-link="context"]');
  await click('[data-related-place="faith"]');await wait(ready,'related place across chapters');
  await escape();await wait(closed,'related place closes');
  await check("document.activeElement===document.querySelector('[data-action=explore-khmer-place]')",'cross-chapter reading restores focus to the current rail when its original card is replaced');
  await open('upper','faith');
  await page('[data-place-chapter-link="overview"]');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await wait(ready,'keyboard page');
  await check("document.querySelector('.md-place-viewer-page').dataset.placeChapter==='observe'",'right arrow changes exhibition pages without changing the museum section');
  await evaluate("document.querySelector('.md-dialog-close').focus()");
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await check("!!document.activeElement.closest('.md-place-viewer')",'native Tab navigation stays inside the exhibition');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:5,y:5,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:5,y:5,button:'left',clickCount:1});
  await wait(closed,'outside click closes exhibition');
  await viewport(1440,960);await section('map');await click('.kd-directory');
  await wait("document.querySelector('.md-dialog-places')?.open",'directory opens');
  await check("document.querySelectorAll('.md-place-directory-results button').length===16",'directory still lists all sixteen places');
  await click('[data-directory-zone="upper"]');
  await check("document.querySelectorAll('.md-place-directory-results button').length===7",'directory filters the seven upstairs topics');
  await evaluate("const i=document.querySelector('.md-search-field input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(i,'ngu am');i.dispatchEvent(new Event('input',{bubbles:true}))");
  await wait("document.querySelectorAll('.md-place-directory-results button').length===1",'unaccented search');
  await click('[data-directory-place="performing"]');await wait("!document.querySelector('dialog')",'directory selection');
  await check("document.querySelector('.kd-detail').dataset.selectedPlace==='performing'",'directory selection updates the spatial chapter');
  for(const [w,h] of [[1920,1080],[1440,600],[1024,768],[768,1024],[390,844],[320,568],[844,390],[667,375]]) {
    await viewport(w,h); await section('map');
    for(const zone of Object.keys(areas)) {
      await area(zone);
      await check("const s=document.getElementById('museo-map');s.scrollWidth<=s.clientWidth+1&&document.querySelectorAll('.kd-tabs [role=tab]').length===4",w+'x'+h+' '+zone+' fills one screen with reachable preview controls');
    }
    await shot('places-chapters-'+w+'x'+h);
  }
  await viewport(1440,960);await area('landscape');await shot('desktop-map');
};
