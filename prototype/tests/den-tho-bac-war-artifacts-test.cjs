/* Three original AVIFs, researched stories, plaques and native reader behavior. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const rootPath=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(rootPath,'docs/den-tho-bac-war-artifacts-manifest.json'),'utf8'));
for(const item of manifest.photos){
  const data=fs.readFileSync(path.join(rootPath,'src/assets/den-tho-bac/war-artifacts-user',item.file));
  if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256)throw Error('Changed image: '+item.file);
}
console.log('PASS All three AVIFs retain the supplied bytes and watermarks');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector(".db-reader--artifacts")?.open&&document.querySelector(".db-reader-media").dataset.imageState==="ready"','artifact reader');await settle();};
  const at=async index=>{await wait('document.querySelector(".db-reader-media").dataset.displayedChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.imageState==="ready"&&document.querySelector(".db-reader-photo img")?.complete','artifact '+index);};
  const scrollTo=async index=>page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")['+index+'];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-24');
  for(const [width,height] of [[1404,790],[1920,1080],[1280,720],[768,1024],[390,844],[320,720],[844,390],[3840,2160]]){
    await viewport(width,height);await open('?section=spaces&story=map-artifacts');await ready();
    await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),l=d.querySelector(".db-reader-layout");return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&l.scrollWidth<=l.clientWidth+1&&d.contains(document.activeElement)})()','Artifact reader and controls fit at '+width+'x'+height);
    await check('document.querySelectorAll("[data-reader-chapter]").length===3&&document.querySelectorAll(".db-artifact-facts dd").length===6&&document.querySelectorAll(".db-artifact-label").length===3','All three artifacts have event facts and readable plaques at '+width);
    await page('window.artifactMediaBefore=document.querySelector(".db-reader-media").getBoundingClientRect().toJSON()');
    for(const index of [0,1,2]){
      await click('[data-reader-thumbnail="'+index+'"]');await at(index);
      await check('document.querySelector(".db-reader-photo img").currentSrc.includes("bac-'+(23+index)+'")&&getComputedStyle(document.querySelector(".db-reader-photo img")).objectFit==="contain"&&document.querySelector(".db-reader-photo img").naturalWidth===1390','Original uncropped artifact '+index+' is shown at '+width);
      await check('document.querySelector(".db-reader-gallery-photo .db-credit").textContent.includes("Cảnh Kỳ")&&document.querySelector(".db-reader-gallery-photo .db-credit").href.includes("tienphong.vn/ve-tham-den-tho-bac-post1839811")','Original photograph attribution is linked at '+width+' for '+index);
    }
    await check('["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-reader-media").getBoundingClientRect()[k]-artifactMediaBefore[k])<1)','Images stay fixed while the researched content scrolls at '+width);
    if([1404,390].includes(width))await shot('war-artifacts-'+width+'x'+height+'-helicopter');
  }
  await viewport(1404,790);await open('?section=spaces&story=map-artifacts');await ready();
  await check('document.querySelector("[data-reader-chapter-index=\\"0\\"]").textContent.includes("30/04/1975")&&document.querySelector("[data-reader-chapter-index=\\"1\\"]").textContent.includes("12–13/08/1969")&&document.querySelector("[data-reader-chapter-index=\\"2\\"]").textContent.includes("Mốc ghi trên biển")','Local event dates retain their appropriate source attribution');
  await page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")[1];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-80');await sleep(150);
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter==="0"','Jeep remains until the next artifact section reaches the reading boundary');
  await scrollTo(1);await at(1);
  await click('[data-reader-chapter-index="1"] .db-artifact-label summary');
  await check('document.querySelector("[data-reader-chapter-index=\\"1\\"] .db-artifact-label").open&&document.querySelector("[data-reader-chapter-index=\\"1\\"] .db-artifact-label p").textContent.includes("Huỳnh Chí Thiện")','Visitors can read the 105 mm gun plaque as accessible text');
  await shot('war-artifacts-gun-plaque');
  await click('.db-reader-photo-expand');
  await check('document.querySelector(".db-reader-photo").scrollWidth>=document.querySelector(".db-reader-photo").clientWidth*1.9','Artifact enlargement gives a true 200 percent pan area');
  await click('.db-reader-photo-expand');await click('[data-reader-thumbnail="0"]');await at(0);await shot('war-artifacts-jeep');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35});await at(2);
  await check('document.activeElement.dataset.readerThumbnail==="2"','Keyboard End selects the helicopter and moves thumbnail focus');
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','artifact sources');
  await check('document.querySelectorAll(".db-artifact-source-list>a").length===3&&document.querySelector(".db-artifact-source-list a[href*=sggp]")&&document.querySelector(".db-artifact-source-list a[href*=redstone]")','Three researched sources remain available in the reader');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');await cdp('Network.setBlockedURLs',{urls:['*bac-24*']});
  await open('?section=spaces&story=map-artifacts');await ready();await click('[data-reader-thumbnail="1"]');await wait('document.querySelector(".db-reader-media").dataset.imageState==="error"','blocked AVIF');
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter==="0"&&document.querySelectorAll(".db-artifact-label").length===3','A failed AVIF retains the previous image and all plaque text');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-reader-gallery-error button');await at(1);
  console.log('PASS Retry opens the original portrait AVIF');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await open('?section=spaces');await settle();await click('.db-space-list [data-space-id=artifacts]');
  await wait('document.querySelector(".db-atlas-panel").dataset.spaceId==="artifacts"&&document.querySelector(".db-atlas-selected-photo img")?.complete','point 04 summary');
  await check('document.querySelector(".db-atlas-selected-photo img").src.includes("bac-23")&&document.querySelector("#db-space-description").textContent.includes("105 mm")','Point 04 now has the actual Jeep photograph and three-artifact overview');
  await click('[data-action=open-space-details]');await ready();await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','close reader');
  await check('document.activeElement.matches("[data-action=open-space-details]")','Escape returns focus to the original point 04 action');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await viewport(390,844);await open('?story=map-artifacts');await ready();
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const target=await page('const r=document.querySelector("[data-reader-thumbnail=\\"2\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(2);
  await check('getComputedStyle(document.querySelector(".db-reader-gallery-photo")).animationName==="none"','Phone touch and reduced motion preserve the correct artifact');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
