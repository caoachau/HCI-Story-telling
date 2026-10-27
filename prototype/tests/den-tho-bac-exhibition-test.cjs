/* Original asset coverage, guided reading, all 93 photographs and modal access. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const assets=path.resolve(__dirname,'../src/assets/den-tho-bac/exhibition-user');
const manifest=JSON.parse(fs.readFileSync(path.join(assets,'manifest.json'),'utf8'));
if(manifest.photos.length!==93)throw Error('Expected all 93 supplied photographs');
for(const item of manifest.photos){
  const data=fs.readFileSync(path.join(assets,item.asset));
  if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('Changed photograph: '+item.asset);
  const original=path.join(manifest.source,item.file);
  if(fs.existsSync(original)&&!data.equals(fs.readFileSync(original)))throw Error('Source differs: '+item.file);
}
console.log('PASS All 93 JPEG assets retain their original bytes and SHA-256');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector(".db-reader--exhibition")?.open&&document.querySelector(".db-exhibition-media")?.dataset.imageState==="ready"','exhibition ready');await settle();};
  const at=async id=>{await wait('document.querySelector(".db-exhibition-media").dataset.exhibitionDisplayed==="'+id+'"&&document.querySelector(".db-exhibition-media").dataset.imageState==="ready"','selected exhibition photo '+id);};
  for(const [width,height] of [[1920,1080],[1440,900],[1280,720],[768,1024],[390,844],[320,720],[844,390],[667,375],[3840,2160]]){
    await viewport(width,height);await open('?section=spaces&story=map-exhibition');await ready();
    await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),l=d.querySelector(".db-exhibition-layout"),m=d.querySelector(".db-exhibition-media").getBoundingClientRect(),p=d.querySelector(".db-exhibition-prose").getBoundingClientRect(),f=d.querySelector(".db-reader-footer").getBoundingClientRect();return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&l.scrollWidth<=l.clientWidth+1&&m.left>=r.left&&m.right<=r.right&&m.bottom<=f.top+1&&p.bottom<=f.top+1&&p.height>80&&document.activeElement.closest("dialog")===d})()','Reading panes and modal controls fit at '+width+'x'+height);
    await check('document.querySelectorAll("[data-reader-chapter]").length===8&&document.querySelectorAll(".db-exhibition-prose [data-exhibition-photo]").length===93&&new Set([...document.querySelectorAll(".db-exhibition-prose [data-exhibition-photo]")].map(b=>b.dataset.exhibitionPhoto)).size===93','Eight topics include every supplied photograph once at '+width);
    await check('(()=>{const s=document.querySelector(".db-exhibition-photo-stage"),r=s.getBoundingClientRect(),img=s.querySelector("img");return r.width>100&&r.height>60&&img.complete&&img.naturalWidth>0&&getComputedStyle(img).objectFit==="contain"&&img.getBoundingClientRect().width<=r.width&&img.getBoundingClientRect().height<=r.height})()','Main photograph remains complete and readable at '+width);
    await page('window.exhibitionMediaBefore=document.querySelector(".db-exhibition-media").getBoundingClientRect().toJSON()');
    await click('[data-exhibition-route="3"]');await at(51);
    await check('["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-exhibition-media").getBoundingClientRect()[k]-exhibitionMediaBefore[k])<1)&&document.querySelector(".db-exhibition-prose").scrollTop>0','Photo stays in place while its content scrolls at '+width);
    if([1920,390,844].includes(width))await shot('exhibition-'+width+'x'+height);
  }
  await viewport(1440,900);await open('?section=spaces&story=map-exhibition');await ready();
  const first=[11,56,67,51,3,1,16,5];
  for(let index=0;index<first.length;index++){
    await page('const pane=document.querySelector(".db-exhibition-prose"),section=pane.querySelectorAll("[data-reader-chapter]")['+index+'];pane.scrollTop+=section.getBoundingClientRect().top-pane.getBoundingClientRect().top-24');
    await at(first[index]);
  }
  console.log('PASS Native prose scrolling selects the correct first photograph of all eight topics');
  await click('.db-exhibition-all');
  await check('document.querySelectorAll(".db-exhibition-all-photos [data-exhibition-photo]").length===93&&document.querySelectorAll(".db-exhibition-all-photos>section").length===8','All-photo view exposes all 93 images by topic');
  await click('.db-exhibition-all-photos [data-exhibition-photo="88"]');await at(88);
  await check('!document.querySelector(".db-exhibition-all-photos")&&document.querySelector(".db-exhibition-layout").dataset.exhibitionStop==="5"','Selecting a photograph opens its matching topic and large image');
  await click('button[aria-label="Phóng lớn ảnh"]');await click('button[aria-label="Phóng lớn ảnh"]');
  await check('document.querySelector(".db-exhibition-photo-stage").scrollWidth>document.querySelector(".db-exhibition-photo-stage").clientWidth&&document.querySelector(".db-exhibition-photo-stage").dataset.zoom==="2"','Zoom provides a real pan area for reading labels');
  await click('button[aria-label="Xem trọn ảnh"]');
  await check('document.querySelector(".db-exhibition-photo-stage").dataset.zoom==="1"','Reset restores the full uncropped photograph');
  await click('[data-exhibition-route="0"]');await at(11);
  const tour=await page('return [...document.querySelectorAll(".db-exhibition-prose [data-exhibition-photo]")].map(b=>Number(b.dataset.exhibitionPhoto))');
  for(const id of tour.slice(1)){
    await click('button[aria-label="Ảnh tiếp theo trong hành trình"]');await at(id);
    await check('document.querySelector(".db-exhibition-photo-stage img").complete&&document.querySelector(".db-exhibition-photo-stage img").naturalWidth>0&&document.querySelector(".db-exhibition-photo-stage img").currentSrc.includes("photo-'+String(id).padStart(3,'0')+'")','Photograph '+id+' decodes and opens in the guided sequence');
  }
  await check('document.querySelector("button[aria-label=\\"Ảnh tiếp theo trong hành trình\\"]").disabled&&document.querySelector(".db-exhibition-pagination strong").textContent==="93"','The 93-photo tour has a clear endpoint');
  await click('[data-exhibition-route="0"]');await at(11);
  await page('document.querySelector(".db-exhibition-filmstrip button").focus({preventScroll:true})');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35});await at(35);
  await check('document.activeElement.dataset.exhibitionPhoto==="35"','Filmstrip End moves focus and selects the last photo in its topic');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');
  await cdp('Network.setBlockedURLs',{urls:['*photo-093*']});
  await click('.db-exhibition-prose [data-exhibition-photo="93"]');await wait('document.querySelector(".db-exhibition-media").dataset.imageState==="error"','failed photograph');
  await check('document.querySelector(".db-exhibition-media").dataset.exhibitionDisplayed==="35"&&document.querySelectorAll("[data-reader-chapter]").length===8&&document.querySelector(".db-exhibition-error button")','A failed target preserves the last photograph and all reading content');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-exhibition-error button');await at(93);
  console.log('PASS Retry recovers the selected original photograph');
  await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','photo provenance');
  await check('document.querySelector("#db-reader-sources").textContent.includes("93 ảnh")&&document.querySelector("#db-reader-sources a[href*=map-current-marked]")','Photo provenance and the original site-map reference remain available');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','close exhibition');
  await open('?section=spaces');await settle();await click('.db-space-list [data-space-id=exhibition]');await wait('document.querySelector(".db-atlas-panel").dataset.spaceId==="exhibition"','exhibition summary');
  await wait('document.querySelector(".db-atlas-selected-photo img")?.complete&&document.querySelector(".db-atlas-selected-photo img").naturalWidth>0','map summary image decoded');
  await check('document.querySelector(".db-atlas-selected-photo img").src.includes("photo-011")&&document.querySelector("#db-space-description").textContent.includes("93 ảnh")','Map point 02 uses the supplied room photograph and new overview');
  await click('[data-action=open-space-details]');await ready();
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','Escape close');
  await check('document.activeElement.matches("[data-action=open-space-details]")','Closing restores focus to the original exhibition action');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await viewport(390,844);await open('?section=spaces&story=map-exhibition');await ready();
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await click('.db-exhibition-all');
  const target=await page('const b=document.querySelector(".db-exhibition-all-photos [data-exhibition-photo=\\"11\\"]"),r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(11);
  await check('!document.querySelector(".db-exhibition-all-photos")','Phone touch selects a photograph with reduced motion enabled');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
