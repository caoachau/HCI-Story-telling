/* One supplied image, researched diorama content, independent native reading. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const rootPath=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(rootPath,'docs/den-tho-bac-boat-manifest.json'),'utf8'));
const data=fs.readFileSync(path.join(rootPath,manifest.asset));
if(crypto.createHash('sha256').update(data).digest('hex')!==manifest.sha256)throw Error('Supplied image changed');
if(fs.existsSync(manifest.sourceFile)&&!data.equals(fs.readFileSync(manifest.sourceFile)))throw Error('Image differs from attachment');
console.log('PASS Supplied canoe image retains its exact bytes');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector(".db-reader--boat")?.open&&document.querySelector(".db-reader-media")?.dataset.imageState==="ready"','boat reader');await settle();};
  const at=async index=>{await wait('document.querySelector(".db-reader-layout").dataset.activeReaderChapter==="'+index+'"','boat topic '+index);};
  for(const [width,height] of [[1404,790],[1920,1080],[1280,720],[3840,2160],[768,1024],[390,844],[320,720],[844,390]]){
    await viewport(width,height);await open('?section=spaces&story=map-boat');await ready();
    await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),l=d.querySelector(".db-reader-layout"),p=d.querySelector(".db-reader-prose");return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&l.scrollWidth<=l.clientWidth+1&&p.clientHeight>70&&p.scrollHeight>p.clientHeight&&d.contains(document.activeElement)})()','Boat reader and scrolling prose fit '+width+'x'+height);
    await check('document.querySelectorAll("[data-reader-chapter]").length===3&&document.querySelectorAll(".db-reader-topics button").length===3&&!document.querySelector(".db-reader-thumbnails img")&&!document.querySelector(".db-reader-photo-counter")&&document.querySelector(".db-reader-heading>p").textContent==="1 ảnh · 3 nội dung"','One photograph has three reading topics, without duplicated photos at '+width);
    await check('(()=>{const img=document.querySelector(".db-reader-photo img"),shell=document.querySelector(".db-reader-photo-shell").getBoundingClientRect(),caption=document.querySelector(".db-reader-gallery-photo>figcaption").getBoundingClientRect();return img.naturalWidth===1448&&img.naturalHeight===1086&&img.src.includes("boat-supplied")&&getComputedStyle(img).objectFit==="contain"&&caption.top>=shell.bottom-1})()','Full supplied image keeps its ratio and caption beneath it at '+width);
    await page('window.boatPhoto=document.querySelector(".db-reader-photo img");window.boatMedia=document.querySelector(".db-reader-media").getBoundingClientRect().toJSON()');
    for(const index of [1,2,0]){await click('[data-reader-thumbnail="'+index+'"]');await at(index);}
    await check('document.querySelector(".db-reader-photo img")===boatPhoto&&["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-reader-media").getBoundingClientRect()[k]-boatMedia[k])<1)','Photograph stays mounted and fixed while reading all topics at '+width);
    if(width===1404||width===390||width===844)await shot('boat-'+width+'x'+height);
  }
  await viewport(1404,790);await open('?story=map-boat');await ready();
  await check('document.querySelector(".db-artifact-facts").textContent.includes("Tiểu cảnh · Mô hình")&&document.querySelector("[data-reader-chapter=boat-scene]").textContent.includes("13/09/2024")','Content identifies the diorama and dates its press reference');
  await click('.db-reader-photo-expand');
  await page('const p=document.querySelector(".db-reader-photo");p.scrollLeft=80;p.scrollTop=40;window.boatZoomImage=p.querySelector("img");window.boatPan={x:p.scrollLeft,y:p.scrollTop}');
  await click('[data-reader-thumbnail="1"]');await at(1);
  await check('document.querySelector(".db-reader-photo.is-zoomed img")===boatZoomImage&&Math.abs(document.querySelector(".db-reader-photo").scrollLeft-boatPan.x)<1&&Math.abs(document.querySelector(".db-reader-photo").scrollTop-boatPan.y)<1','Zoom and panning survive topic changes without reloading the photograph');
  await click('.db-reader-photo-expand');
  // Put keyboard focus on the reading index before exercising its shortcuts.
  await page('document.querySelector("[data-reader-thumbnail=\\"1\\"]").focus()');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await at(2);
  await check('document.activeElement.dataset.readerThumbnail==="2"','Horizontal topic index responds to ArrowRight');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});await at(0);
  await page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")[2];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-24');await at(2);
  await check('document.querySelector("[data-reader-thumbnail=\\"2\\"]").getAttribute("aria-current")==="step"','Native prose scrolling updates the reading index');
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','boat sources');
  await check('document.querySelectorAll(".db-boat-source-list>a").length===3&&document.querySelector(".db-boat-source-list a[href*=baocamau]")&&document.querySelector(".db-boat-source-list a[href*=baotangvinhlong]")&&document.querySelector("a[href*=map-current-marked-v2]")','Three research references and the original eight-point map are available');
  await check('document.querySelector(".db-boat-source-list>p").textContent.includes("chưa xác định")&&document.querySelector(".db-boat-source-list>a:last-child p").textContent.includes("chiếc thuyền khác")','Sources distinguish the model, unconfirmed provenance and the separate museum boat');
  await page('window.__boatVoice="";Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:class{constructor(text){this.text=text}}});Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[{lang:"vi-VN"}],speak:u=>{__boatVoice=u.text;u.onstart?.()},cancel:()=>{}}})');
  await click('.db-listen');await check('__boatVoice.includes("tiểu cảnh")&&__boatVoice.includes("nguyên khối")','Narration reads the researched summary');await click('.db-listen');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');await cdp('Network.setBlockedURLs',{urls:['*boat-supplied*']});
  await open('?story=map-boat');await wait('document.querySelector(".db-reader-media")?.dataset.imageState==="error"','blocked boat image');
  await check('document.querySelectorAll("[data-reader-chapter]").length===3&&document.querySelector(".db-reader-gallery-error button")','All content remains readable when the photograph fails');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-reader-gallery-error button');await ready();
  await check('document.querySelector(".db-reader-photo img").complete&&document.querySelector(".db-reader-photo img").naturalWidth===1448','Retry restores the supplied image');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await open('?section=spaces');await settle();await click('.db-space-list [data-space-id=boat]');
  await wait('document.querySelector(".db-atlas-panel").dataset.spaceId==="boat"&&document.querySelector(".db-atlas-selected-photo img")?.complete','boat summary');
  await check('document.querySelector(".db-atlas-selected-photo img").src.includes("boat-supplied")&&document.querySelector("#db-space-description").textContent.includes("Tiểu cảnh")','Point 05 uses the attachment for its preview and relevant introduction');
  await click('[data-action=open-space-details]');await ready();await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','close boat');
  await check('document.activeElement.matches("[data-action=open-space-details]")','Escape restores focus to the point 05 action');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await viewport(390,844);await open('?story=map-boat');await ready();await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const target=await page('const r=document.querySelector("[data-reader-thumbnail=\\"1\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(1);
  await check('getComputedStyle(document.querySelector(".db-reader-gallery-photo")).animationName==="none"','Touch reading index respects reduced motion');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
