/* Motion integration: real scroll panes, rapid selection, touch, reduced motion,
   image readiness, reader focus and on-demand WebGL lifetime. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs');
const source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const idle=()=>wait('!document.querySelector("[data-motion-state=running],[data-reader-phase=opening],[data-reader-phase=closing]")','motion settled');
  const pictures=()=>wait('[...document.querySelectorAll("main img")].every(i=>i.complete&&i.naturalWidth>0)','chapter images');
  const sections=['overview','history','spaces','people','activities','values'];
  const select=async section=>{await click('[data-section-target='+section+']');await pictures();await settle();await idle();};
  const baseline=process.argv.includes('--baseline');
  const frames=path.join(root,'preview',baseline?'motion-before':'motion-after');fs.mkdirSync(frames,{recursive:true});
  const capture=async name=>{const result=await cdp('Page.captureScreenshot',{format:'jpeg',quality:72});fs.writeFileSync(path.join(frames,name+'.jpg'),Buffer.from(result.data,'base64'));};
  await viewport(1920,1080);await open();await pictures();await settle();await idle();
  if(baseline){
    for(const section of sections){
      await select(section);
      const selector={overview:'[data-overview-slide]',history:'[data-milestone]',spaces:'.db-map-point',people:'.db-person-tabs button',values:'[data-value-page]'}[section];
      const count=selector?await page('return document.querySelectorAll('+JSON.stringify(selector)+').length'):1;
      for(let i=0;i<count;i++){
        if(selector)await page('document.querySelectorAll('+JSON.stringify(selector)+')['+i+'].click()');
        await sleep(170);await capture(section+'-'+i+'-moving');
        await pictures();await settle();await sleep(800);await capture(section+'-'+i+'-rest');
      }
    }
    console.log('PASS Baseline before/mid/end references for every chapter selection');return;
  }
  for(const section of sections){
    await select(section);
    await check('document.querySelector("main [data-motion-owner=gsap]")&&document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1','Scoped motion and unchanged horizontal fit: '+section);
    await capture(section+'-desktop');
  }
  await select('overview');
  await page('document.querySelectorAll("[data-overview-slide]")[2].click();document.querySelectorAll("[data-overview-slide]")[1].click();document.querySelectorAll("[data-overview-slide]")[2].click()');
  await wait('document.querySelector(".db-overview-carousel").dataset.overviewIndex==="2"&&document.querySelector(".db-overview-carousel").dataset.imageState==="ready"','last overview selection');await idle();
  await check('document.querySelectorAll(".db-overview-artwork[role=img]").length===1&&getComputedStyle(document.querySelector(".db-overview-artwork[role=img]")).transform==="none"','Rapid overview selection retains a single unwarped photo');

  // Hold the prefetched 1970 image: copy must stay with its displayed photo.
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');
  const held=[];const intercept=event=>{const message=JSON.parse(event.data);if(message.method==='Fetch.requestPaused')held.push(message.params.requestId);};
  socket.addEventListener('message',intercept);await cdp('Fetch.enable',{patterns:[{urlPattern:'*1970-background*'}]});
  await open('?section=history');await wait('document.querySelector(".db-history-photo-art").dataset.imageState==="ready"','first history image');await idle();
  await click('[data-milestone="1970"]');await sleep(150);
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="1969"&&document.querySelector(".db-history-photo-art").dataset.artYear==="1969"','A pending history image keeps the previous year and copy together');
  await click('[data-milestone="1971"]');await wait('document.querySelector(".db-history-stage").dataset.historyYear==="1971"','latest history image');
  for(const requestId of held)await cdp('Fetch.continueRequest',{requestId});await cdp('Fetch.disable');socket.removeEventListener('message',intercept);await sleep(800);
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="1971"&&document.querySelector(".db-history-photo-art").dataset.artYear==="1971"','Late decode cannot restore an obsolete history selection');

  await viewport(1280,720);await select('overview');await click('[data-overview-slide="0"]');await idle();
  await wait('!document.querySelector(".db-overview-explore").disabled','overview action');
  await page('window.readerOrigin=document.querySelector(".db-overview-explore");readerOrigin.focus();readerOrigin.click()');
  await wait('document.querySelector("dialog")?.open','reader opens');await idle();
  await check('document.querySelector("dialog").contains(document.activeElement)','Reader retains native modal focus');
  await page('document.querySelectorAll(".db-read-more").forEach(d=>d.open=true)');await sleep(350);
  await page('const pane=document.querySelector(".db-reader-prose");pane.scrollTop=pane.scrollHeight');await sleep(350);
  await check('!document.querySelector(".db-reader-progress").hidden&&Number(document.querySelector(".db-reader-progress").getAttribute("aria-valuenow"))>=99','Reading progress follows the desktop prose pane');
  await viewport(390,844);await sleep(350);
  await page('const pane=document.querySelector(".db-reader-prose");pane.scrollTop=pane.scrollHeight');await sleep(350);
  await check('Number(document.querySelector(".db-reader-progress").getAttribute("aria-valuenow"))>=99&&!document.querySelector(".db-photo-mode")','Mobile reader follows its text scroller and uses the normal photograph');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await wait('!document.querySelector("dialog")','reader closes');await check('document.activeElement===readerOrigin','Reader returns focus after its exit');

  await select('activities');await check('document.querySelectorAll("[data-reveal-state=waiting]").length>0','Mobile activities wait until their actual scroll pane reaches them');
  await page('document.querySelector(".db-date-card:last-child button").focus()');await sleep(60);
  await check('document.querySelector(".db-date-card:last-child").dataset.revealState==="shown"','Keyboard focus reveals an offscreen activity immediately');
  await page('document.querySelector("main").scrollTop=document.querySelector("main").scrollHeight');await sleep(650);
  await check('getComputedStyle(document.querySelector(".db-date-card:last-child")).opacity==="1"','Scrolled activity is fully visible');await capture('activities-mobile');
  await check('document.querySelector(".db-visit-note>p").clientWidth>innerWidth/2','Mobile visitor guidance keeps a readable line length');

  await viewport(1920,1080);await select('people');
  await click('.db-person-tabs button:last-child');
  await page('document.documentElement.classList.add("reduce-motion")');await sleep(80);
  await check('document.querySelector("[data-motion-owner=gsap]").dataset.motionState==="reduced"&&getComputedStyle(document.querySelector(".db-person-copy h2")).opacity==="1"','Host reduced motion cancels an entrance and leaves the full copy visible');
  await page('document.documentElement.classList.remove("reduce-motion")');await idle();
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const section of sections){await select(section);await check('document.querySelector("main [data-motion-state=reduced]")','OS reduced motion respected: '+section);}
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});

  // The large touch kiosk uses all primary actions without a mouse-only mode.
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:10});await viewport(3840,2160);await select('overview');
  await click('.db-overview-explore');await wait('document.querySelector("dialog")?.open','touch reader');await idle();
  await check('matchMedia("(pointer:coarse)").matches&&!document.querySelector(".db-photo-mode")&&!document.querySelector(".db-photo-frame")','4K touch kiosk keeps the photograph and avoids pointer tilt');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','touch reader closes');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});await viewport(1280,720);await select('overview');
  await click('.db-overview-explore');await wait('document.querySelector(".db-photo-mode")','fine-pointer frame action');await idle();
  await click('.db-photo-mode');await wait('document.querySelector(".db-photo-frame")?.dataset.frameState==="ready"','on-demand frame rendered');await sleep(500);
  const before=await page('return document.querySelector(".db-photo-frame").dataset.renderCount');await sleep(250);
  assert.equal(await page('return document.querySelector(".db-photo-frame").dataset.renderCount'),before,'Frame has no idle render loop');
  const rect=await page('return document.querySelector(".db-reader-photo").getBoundingClientRect().toJSON()');
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:rect.right-12,y:rect.top+12});await sleep(500);
  await check('Number(document.querySelector(".db-photo-frame").dataset.renderCount)>'+Number(before),'Pointer movement renders the frame on demand');await capture('reader-frame');
  await page('document.querySelector(".db-photo-frame canvas").getContext("webgl2").getExtension("WEBGL_lose_context").loseContext()');
  await wait('!document.querySelector(".db-photo-frame")','context loss fallback');
  await check('getComputedStyle(document.querySelector(".db-reader-photo>.db-picture")).opacity==="1"','Context loss restores the original accessible photograph');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','frame reader closes');

  await select('people');await click('.db-person-tabs button:last-child');
  await page('window.retired=document.querySelector(".db-people");document.querySelector("[data-section-target=spaces]").click()');await sleep(30);
  await page('window.afterRemoval=0;window.removalObserver=new MutationObserver(()=>afterRemoval++);removalObserver.observe(retired,{attributes:true,subtree:true})');await sleep(900);
  await check('afterRemoval===0&&!retired.isConnected','Unmounted chapter no longer receives animation writes');
  await page('removalObserver.disconnect()');
  for(let i=0;i<12;i++){await select(i%2?'activities':'people');}
  await check('document.querySelectorAll("main [data-motion-owner=gsap]").length===1&&!document.querySelector("canvas")','Repeated navigation leaves only the active chapter and no frame canvas');
  assert.deepEqual(errors,[]);console.log('PASS Motion lifecycle has no browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));
// Reuse the real map entry/exit flow and verify preference delivery across the
// iframe boundary, including a preference change during an entrance.
const hostStart=source.indexOf("  if(!process.argv.includes('--skip-host')){");
const hostEnd=source.indexOf("  assert.deepEqual(errors,[],'No browser exceptions')",hostStart);
if(hostStart<0||hostEnd<hostStart)throw Error('Host harness boundaries changed');
const host=source.slice(hostStart,hostEnd).replace(
  "    await frame('d.querySelector(\"[data-section-target=spaces]\").click();w.__memorialState=true');",
  String.raw`
    await frame('d.querySelector("[data-section-target=people]").click()');
    await page('document.querySelector(".heritage-app").classList.add("access-reduce-motion")');
    await wait('document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("[data-motion-state=reduced]")','host preference reaches the actual frame');
    await check('getComputedStyle(document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector(".db-person-copy h2")).opacity==="1"','Host reduced motion reveals the iframe copy immediately');
    await page('document.querySelector(".heritage-app").classList.remove("access-reduce-motion")');
    await wait('!document.querySelector(".dbk-host-detail iframe").contentDocument.documentElement.classList.contains("reduce-motion")','host restores motion');
    await frame('d.querySelector("[data-section-target=spaces]").click();w.__memorialState=true');
  `).replace(
    "    await check('document.querySelector(\"[data-location-view=quick]\")','Collapsing",
    "    await wait('document.querySelector(\"[data-location-view=quick]\")','collapse reaches quick view');\n    await check('document.querySelector(\"[data-location-view=quick]\")','Collapsing"
  );
runner._compile(source.slice(0,begin)+body+host+"\n  assert.deepEqual(errors,[],'No browser exceptions in map integration');\n"+source.slice(end),file);
