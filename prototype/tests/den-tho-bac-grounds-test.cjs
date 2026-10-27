/* Five supplied originals, guided landscape reading and native modal behavior. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const rootPath=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(rootPath,'docs/den-tho-bac-grounds-manifest.json'),'utf8'));
if(manifest.photos.length!==5)throw Error('Expected five supplied photographs');
for(const item of manifest.photos){
  const data=fs.readFileSync(path.join(rootPath,'src/assets/den-tho-bac/grounds-user',item.asset));
  if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('Changed image: '+item.asset);
  const original=path.join(manifest.sourceFolder,item.original);
  if(fs.existsSync(original)&&!data.equals(fs.readFileSync(original)))throw Error('Original differs: '+item.original);
}
console.log('PASS All five supplied photographs retain their original bytes');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector(".db-reader--grounds")?.open&&document.querySelector(".db-reader-media").dataset.imageState==="ready"','grounds reader');await settle();};
  const at=async index=>{await wait('document.querySelector(".db-reader-media").dataset.displayedChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.imageState==="ready"&&document.querySelector(".db-reader-photo img")?.complete','grounds photo '+index);};
  const files=['01-lakeside','02-tree-lined-walk','03-shaded-path','04-bamboo','05-building-reference'],widths=[1280,600,382,2560,192];
  for(const [width,height] of [[1404,790],[1920,1080],[1280,720],[768,1024],[390,844],[320,720],[844,390],[3840,2160]]){
    await viewport(width,height);await open('?section=spaces&story=map-camping');await ready();
    await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),l=d.querySelector(".db-reader-layout");return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&l.scrollWidth<=l.clientWidth+1&&d.contains(document.activeElement)})()','Grounds reader fits at '+width+'x'+height);
    await check('document.querySelectorAll("[data-reader-chapter]").length===5&&document.querySelectorAll("[data-reader-thumbnail]").length===5&&document.querySelector(".db-artifact-observe h4").textContent==="Dừng lại quan sát"','Five landscape sections have five photos and appropriate prompts at '+width);
    await page('window.groundsMediaBefore=document.querySelector(".db-reader-media").getBoundingClientRect().toJSON()');
    for(const index of [0,1,2,3,4]){
      await click('[data-reader-thumbnail="'+index+'"]');await at(index);
      await check('document.querySelector(".db-reader-photo img").currentSrc.includes("'+files[index]+'")&&document.querySelector(".db-reader-photo img").naturalWidth==='+widths[index]+'&&getComputedStyle(document.querySelector(".db-reader-photo img")).objectFit==="contain"','Full original landscape '+index+' displays at '+width);
    }
    await check('["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-reader-media").getBoundingClientRect()[k]-groundsMediaBefore[k])<1)','Photo position stays fixed as landscape content scrolls at '+width);
    await check('document.querySelector(".db-reader-photo[data-photo-size=reference] img").getBoundingClientRect().width<=384.5','Small reference photograph is not stretched across the full image column at '+width);
    await click('[data-reader-thumbnail="0"]');await at(0);
    if([1404,390].includes(width))await shot('grounds-'+width+'x'+height+'-lakeside');
  }
  await viewport(1404,790);await open('?section=spaces&story=map-camping');await ready();
  await check('document.querySelector(".db-artifact-facts dt").textContent.includes("toàn khu di tích")&&document.querySelector(".db-artifact-facts dd").textContent==="5,4 ha"','Area is clearly attributed to the whole heritage site');
  await page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")[1];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-80');await sleep(150);
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter==="0"','First image stays until its text reaches the next landscape section');
  for(const index of [1,2,3,4,2,0]){
    await page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")['+index+'];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-24');await at(index);
  }
  console.log('PASS Native forward and reverse prose scrolling select the correct landscape image');
  await click('.db-reader-photo-expand');
  await check('document.querySelector(".db-reader-photo").scrollWidth>document.querySelector(".db-reader-photo").clientWidth','Landscape photograph can be enlarged and panned');
  await click('.db-reader-photo-expand');await click('[data-reader-thumbnail="3"]');await at(3);await shot('grounds-bamboo');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35});await at(4);
  await check('document.activeElement.dataset.readerThumbnail==="4"&&(()=>{const n=document.querySelector(".db-reader-thumbnails").getBoundingClientRect(),b=document.activeElement.getBoundingClientRect();return b.top>=n.top-1&&b.bottom<=n.bottom+1})()','Keyboard End reveals and selects the fifth photograph');
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','grounds sources');
  await check('document.querySelectorAll(".db-grounds-source-list>a").length===2&&document.querySelector(".db-grounds-source-list a[href*=vinhlong]")&&document.querySelector(".db-grounds-source-list a[href*=nhandan]")','Official context, historical source and photograph provenance remain available');
  await page('window.__groundsVoice="";Object.defineProperty(window,"SpeechSynthesisUtterance",{configurable:true,value:class{constructor(text){this.text=text}}});Object.defineProperty(window,"speechSynthesis",{configurable:true,value:{getVoices:()=>[{lang:"vi-VN"}],speak:u=>{__groundsVoice=u.text;u.onstart?.()},cancel:()=>{}}})');
  await click('.db-listen');await check('__groundsVoice.includes("Khuôn viên")&&__groundsVoice.includes("khóm tre")','Narration summarizes the landscape content');await click('.db-listen');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');await cdp('Network.setBlockedURLs',{urls:['*04-bamboo*']});
  await open('?story=map-camping');await ready();await click('[data-reader-thumbnail="3"]');await wait('document.querySelector(".db-reader-media").dataset.imageState==="error"','blocked landscape');
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter!=="3"&&document.querySelector(".db-reader-photo img").complete&&document.querySelector(".db-reader-photo img").naturalWidth>0&&document.querySelectorAll("[data-reader-chapter]").length===5','Image failure keeps the previous usable photograph and all five accounts');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-reader-gallery-error button');await at(3);console.log('PASS Retry restores the original bamboo photograph');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await open('?section=spaces');await settle();await click('.db-space-list [data-space-id=camping]');
  await wait('document.querySelector(".db-atlas-panel").dataset.spaceId==="camping"&&document.querySelector(".db-atlas-selected-photo img")?.complete','grounds summary');
  await check('document.querySelector(".db-atlas-selected-photo img").src.includes("01-lakeside")&&document.querySelector("#db-space-description").textContent.includes("5 góc nhìn")','Point 07 uses the supplied lakeside cover and landscape overview');
  await click('[data-action=open-space-details]');await ready();await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','close grounds');
  await check('document.activeElement.matches("[data-action=open-space-details]")','Escape restores focus to the original point 07 action');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await viewport(390,844);await open('?story=map-camping');await ready();await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const target=await page('const r=document.querySelector("[data-reader-thumbnail=\\"1\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(1);
  await check('getComputedStyle(document.querySelector(".db-reader-gallery-photo")).animationName==="none"','Phone touch selects landscape photos with reduced motion');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
