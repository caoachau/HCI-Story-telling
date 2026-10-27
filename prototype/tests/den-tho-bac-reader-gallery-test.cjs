/* Real scroll position, sticky media, late decodes and native modal lifecycle. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector("dialog")?.open&&document.querySelector(".db-reader-media")?.dataset.imageState==="ready"','reader ready');await settle();};
  const scrollTo=async index=>{await page('const pane=document.querySelector(".db-reader-prose"),section=pane.querySelectorAll("[data-reader-chapter]")['+index+'];pane.scrollTo({top:pane.scrollTop+section.getBoundingClientRect().top-pane.getBoundingClientRect().top-24,behavior:"instant"})');};
  const at=async index=>{await wait('document.querySelector(".db-reader-layout").dataset.activeReaderChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.displayedChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.imageState==="ready"','matching section and photograph '+index);};
  if(!process.argv.includes('--entries-only')){
  for(const [width,height] of [[1404,790],[1920,1080],[1280,720],[3840,2160],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?story=preservation');await ready();
    await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),layout=d.querySelector(".db-reader-layout");return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&layout.scrollWidth<=layout.clientWidth+1&&d.contains(document.activeElement)})()','Native reader and columns fit at '+width+'x'+height);
    await check('document.querySelectorAll("[data-reader-chapter]").length===4&&document.querySelectorAll("[data-reader-thumbnail]").length===4&&document.querySelector(".db-reader-prose").scrollHeight>document.querySelector(".db-reader-prose").clientHeight','Four sections have four photos and an actual text scroller at '+width);
    await page('window.mediaBefore=document.querySelector(".db-reader-media").getBoundingClientRect().toJSON();window.photoBefore=document.querySelector(".db-reader-photo-shell").getBoundingClientRect().toJSON()');
    for(const index of [1,2,3,2,1,0]){await scrollTo(index);await at(index);}
    await check('["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-reader-media").getBoundingClientRect()[k]-mediaBefore[k])<1&&Math.abs(document.querySelector(".db-reader-photo-shell").getBoundingClientRect()[k]-photoBefore[k])<1)','Photograph stays fixed while prose scrolls forward and backward at '+width);
    if(width===1404){
      await page('const pane=document.querySelector(".db-reader-prose"),second=pane.querySelectorAll("[data-reader-chapter]")[1];pane.scrollTop+=second.getBoundingClientRect().top-pane.getBoundingClientRect().top-80');await sleep(150);
      await check('document.querySelector(".db-reader-layout").dataset.activeReaderChapter==="0"&&document.querySelector(".db-reader-media").dataset.displayedChapter==="0"','The first photograph stays until its text reaches the next section');
      await scrollTo(1);await at(1);
    }
    await click('[data-reader-thumbnail="3"]');await at(3);await check('document.querySelector("[data-reader-thumbnail=\\"3\\"]").getAttribute("aria-current")==="step"','Thumbnail scrolls to its matching text at '+width);
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});await at(0);
    await check('document.activeElement.dataset.readerThumbnail==="0"','Keyboard Home changes focus and reading section at '+width);
    if(width===1404||width===1920||width===390)await shot('reader-gallery-'+width+'x'+height);
  }
  await viewport(1920,1080);await open();await wait('document.querySelector(".db-overview-carousel").dataset.imageState==="ready"','overview');await settle();
  await page('window.readerOrigin=document.querySelector(".db-overview-explore");readerOrigin.focus();readerOrigin.click()');await ready();
  await click('.db-reader-photo-expand');await check('document.querySelector(".db-reader-photo").scrollWidth>document.querySelector(".db-reader-photo").clientWidth','Photo enlargement keeps a native pan area');await click('.db-reader-photo-expand');
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','inline sources');
  await check('document.querySelectorAll("#db-reader-sources .db-source-list>a").length>0&&document.querySelectorAll("#db-reader-sources .db-source-list>a").length<6','Sources remain available inside the story');
  await page('const pane=document.querySelector(".db-reader-prose");pane.scrollTop=pane.scrollHeight');await sleep(150);
  await check('Number(document.querySelector(".db-reader-progress").getAttribute("aria-valuenow"))>=99','Progress follows the prose scroll position');
  await page('window.__voice={speak:0,cancel:0};Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:class{constructor(text){this.text=text}}});Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[{lang:"vi-VN"}],speak:u=>{__voice.speak++;u.onstart?.()},cancel:()=>__voice.cancel++}})');
  await click('.db-listen');await check('__voice.speak===1&&document.querySelector(".db-listen").getAttribute("aria-pressed")==="true"','Narration starts only on request');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','Escape closes reader');
  await check('document.activeElement===readerOrigin&&__voice.cancel>=2','Escape stops narration and returns focus');
  await click('[data-detail-action=sources]');await wait('document.querySelector(".db-reader--sources")?.open','source reader');await check('document.querySelectorAll(".db-source-list>a").length===5','The shared source control keeps all five references');await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','sources close');

  }
  await viewport(1920,1080);
  // Every existing entry point must supply valid photo/text pairings.
  for(const story of ['history-1969','history-1970','history-1971','history-1972','history-1975','history-1989','history-2012','witness','portrait','activity-opening','activity-birthday','activity-remembrance','activity-visit','map-temple','map-exhibition','map-reception','map-artifacts','map-boat','map-stilt-house','map-camping','map-pond','learning']){
    await open('?story='+encodeURIComponent(story));
    if(story==='map-exhibition'){
      await wait('document.querySelector(".db-exhibition-media")?.dataset.imageState==="ready"','exhibition photo ready');
      await check('document.querySelectorAll("[data-reader-chapter]").length===8&&document.querySelectorAll(".db-exhibition-prose [data-exhibition-photo]").length===93','Exhibition entry opens all 93 original photos in eight topics');
      continue;
    }
    await ready();await wait('[...document.querySelectorAll("[data-reader-thumbnail] img")].every(img=>img.complete&&img.naturalWidth>0)','gallery thumbnails');await check('document.querySelectorAll("[data-reader-chapter]").length==='+ (story==='map-camping'?5:['map-stilt-house','map-pond'].includes(story)?2:3),'Valid gallery for '+story);
  }

  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');
  const held=[];const intercept=event=>{const message=JSON.parse(event.data);if(message.method==='Fetch.requestPaused')held.push(message.params.requestId);};
  socket.addEventListener('message',intercept);await cdp('Fetch.enable',{patterns:[{urlPattern:'*02-photo-original*'}]});
  await open('?story=preservation');await ready();await scrollTo(2);await sleep(200);
  await check('document.querySelector(".db-reader-layout").dataset.activeReaderChapter==="2"&&document.querySelector(".db-reader-media").dataset.displayedChapter==="0"','Slow photograph retains the previous usable photo');
  await scrollTo(1);await at(1);for(const requestId of held)await cdp('Fetch.continueRequest',{requestId});await cdp('Fetch.disable');socket.removeEventListener('message',intercept);await sleep(250);
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter==="1"','Late photo cannot replace the current reading section');
  await cdp('Network.clearBrowserCache');await cdp('Network.setBlockedURLs',{urls:['*02-photo-original*']});await open('?story=preservation');await ready();await scrollTo(2);
  await wait('document.querySelector(".db-reader-media").dataset.imageState==="error"','failed target');await check('document.querySelectorAll("[data-reader-chapter]").length===4&&document.querySelector(".db-reader-media").dataset.displayedChapter==="0"','Failed photo keeps text and previous photograph');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-reader-gallery-error button');await at(2);
  await wait('[...document.querySelectorAll("[data-reader-thumbnail] img")].every(img=>img.complete&&img.naturalWidth>0)','restored gallery thumbnails');
  await check('[...document.querySelectorAll("[data-reader-thumbnail] img")].every(img=>img.complete&&img.naturalWidth>0)','Retry restores the photograph and its thumbnail');
  await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await open('?story=preservation');await ready();await click('[data-reader-thumbnail="2"]');await at(2);
  await check('getComputedStyle(document.querySelector(".db-reader-gallery-photo")).animationName==="none"','Reduced motion keeps the section/photo connection without transitions');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:10});await viewport(3840,2160);await open('?story=preservation');await ready();
  const target=await page('const r=document.querySelector("[data-reader-thumbnail=\\"1\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(1);
  await check('!document.querySelector(".db-photo-mode")','Touch selects sections and keeps the native photograph');
  assert.deepEqual(errors,[]);console.log('PASS No browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
