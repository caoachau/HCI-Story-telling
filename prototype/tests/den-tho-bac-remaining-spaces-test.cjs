/* Source image integrity, specific place identities and photo/prose pairing. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const rootPath=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(rootPath,'docs/den-tho-bac-remaining-spaces-manifest.json'),'utf8'));
if(manifest.photos.length!==8)throw Error('Expected eight verified web photographs');
for(const item of manifest.photos){
  const data=fs.readFileSync(path.join(rootPath,'src/assets/den-tho-bac/spaces-researched',item.asset));
  if(crypto.createHash('sha256').update(data).digest('hex')!==item.sha256||data.length!==item.bytes)throw Error('Changed source image '+item.asset);
  if(Math.max(...item.size)<1920||Math.min(...item.size)<1080)throw Error('Source image below intended resolution '+item.asset);
  if(!item.page.startsWith('https://')||!item.verification)throw Error('Missing provenance '+item.asset);
}
console.log('PASS Eight source images retain their exact bytes, resolution and provenance');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const ready=async()=>{await wait('document.querySelector(".db-reader--space-researched")?.open&&document.querySelector(".db-reader-media")?.dataset.imageState==="ready"','researched spaces reader');await settle();};
  const at=async index=>{await wait('document.querySelector(".db-reader-layout").dataset.activeReaderChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.displayedChapter==="'+index+'"&&document.querySelector(".db-reader-media").dataset.imageState==="ready"','space pairing '+index);};
  const entries=[
    {id:'map-temple',title:'Đền thờ',files:['temple-canopy','temple-front','temple-altar'],widths:[2048,2048,2048],sources:2},
    {id:'map-reception',title:'Nhà đón tiếp khách',files:['map-current-v2','entrance-context','aerial-context'],widths:[2560,1920,3840],sources:3},
    {id:'map-stilt-house',title:'Nhà sàn Bác Hồ',files:['stilt-front','stilt-side'],widths:[2048,1920],sources:3},
    {id:'map-pond',title:'Hồ sen',files:['pond-waterside','map-current-v2'],widths:[2048,2560],sources:2},
  ];
  for(const [width,height] of [[1404,790],[1920,1080],[3840,2160],[390,844],[320,720],[844,390]]){
    await viewport(width,height);
    for(const entry of entries){
      await open('?section=spaces&story='+entry.id);await ready();
      await check('(()=>{const d=document.querySelector("dialog"),r=d.getBoundingClientRect(),l=d.querySelector(".db-reader-layout"),p=d.querySelector(".db-reader-prose");return d.matches(":modal")&&r.left>=0&&r.top>=0&&r.right<=innerWidth&&r.bottom<=innerHeight&&l.scrollWidth<=l.clientWidth+1&&p.clientHeight>50&&p.scrollHeight>p.clientHeight&&document.querySelector("#db-reader-title").textContent==='+JSON.stringify(entry.title)+'})()','Specific place reader fits '+entry.id+' at '+width+'x'+height);
      await check('document.querySelectorAll("[data-reader-chapter]").length==='+entry.files.length+'&&document.querySelectorAll("[data-reader-thumbnail]").length==='+entry.files.length,'Place has the intended independent accounts and photos '+entry.id+' at '+width);
      await page('window.placeMediaBefore=document.querySelector(".db-reader-media").getBoundingClientRect().toJSON();window.placePhotoBefore=document.querySelector(".db-reader-photo-shell").getBoundingClientRect().toJSON()');
      for(let index=0;index<entry.files.length;index++){
        await click('[data-reader-thumbnail="'+index+'"]');await at(index);
        await wait('document.querySelector(".db-reader-photo img").complete&&document.querySelector(".db-reader-photo img").naturalWidth>0','decoded source photo');
        await check('document.querySelector(".db-reader-photo img").src.includes('+JSON.stringify(entry.files[index])+')&&document.querySelector(".db-reader-photo img").naturalWidth==='+entry.widths[index]+'&&getComputedStyle(document.querySelector(".db-reader-photo img")).objectFit==="contain"','Correct full source photograph '+entry.id+' / '+index+' at '+width);
        if(entry.files[index]==='map-current-v2'){
          const code=entry.id==='map-reception'?'03':'08';
          await wait('document.querySelector("[data-reader-map-marker=\\"'+code+'\\"]")','visible location');
          await check('(()=>{const m=document.querySelector("[data-reader-map-marker]"),r=m.getBoundingClientRect(),b=document.querySelector(".db-reader-photo-shell"),scale=Math.min(b.clientWidth/2560,b.clientHeight/1440),x='+ (code==='03'?76.528:40.554)+',y='+(code==='03'?30.337:63.455)+';const box=b.getBoundingClientRect();return Math.abs(r.x+r.width/2-(box.x+b.clientLeft+(b.clientWidth-2560*scale)/2+2560*scale*x/100))<2&&Math.abs(r.y+r.height/2-(box.y+b.clientTop+(b.clientHeight-1440*scale)/2+1440*scale*y/100))<2})()','Location '+code+' stays registered to the actual contained map at '+width);
        }
      }
      await check('["x","y","width","height"].every(k=>Math.abs(document.querySelector(".db-reader-media").getBoundingClientRect()[k]-placeMediaBefore[k])<1&&Math.abs(document.querySelector(".db-reader-photo-shell").getBoundingClientRect()[k]-placePhotoBefore[k])<1)','Media and photo frame stay fixed while reading '+entry.id+' at '+width);
      await click('[data-reader-thumbnail="0"]');await at(0);
      if(width===1404||width===390||width===844)await shot('remaining-'+entry.id+'-'+width+'x'+height);
    }
  }
  await viewport(1404,790);
  for(const entry of entries){
    await open('?story='+entry.id);await ready();
    const last=entry.files.length-1;
    await page('const p=document.querySelector(".db-reader-prose"),s=p.querySelectorAll("[data-reader-chapter]")['+last+'];p.scrollTop+=s.getBoundingClientRect().top-p.getBoundingClientRect().top-24');await at(last);
    await check('document.querySelector("[data-reader-thumbnail=\\"'+last+'\\"]").getAttribute("aria-current")==="step"','Native prose scrolling selects the matching photograph for '+entry.id);
    await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','place source list');
    await check('document.querySelectorAll(".db-spaces-source-list>a").length==='+entry.sources+'&&[...document.querySelectorAll(".db-spaces-source-list>a")].every(a=>a.target==="_blank"&&a.rel.includes("noopener"))&&document.querySelector("a[href*=map-current-marked-v2]")','Verified sources and original map remain accessible for '+entry.id);
  }
  await open('?story=map-reception');await ready();
  await click('[data-reader-thumbnail="1"]');await at(1);
  await check('document.querySelector(".db-reader-gallery-photo>figcaption").textContent.includes("không phải ảnh nhà đón tiếp")','Entrance is explicitly identified as context, never passed off as the reception building');
  await click('.db-reader-sources');await wait('document.querySelector("#db-reader-sources").open','reception limitations');
  await check('document.querySelector(".db-spaces-source-list>p").textContent.includes("Chưa tìm được ảnh cận cảnh")','Reception image verification limitation is documented beside its sources');
  await open('?story=map-stilt-house');await ready();
  await check('document.querySelector(".db-reader-prose").textContent.includes("Trà Vinh năm 2012")&&document.querySelector(".db-reader-prose").textContent.includes("97%")&&document.querySelector(".db-reader-prose").textContent.includes("không phải ảnh ngôi nhà nguyên bản")','Stilt-house account identifies the Trà Vinh replica and distinguishes Hanoi');
  await click('.db-reader-photo-expand');await check('document.querySelector(".db-reader-photo").scrollWidth>document.querySelector(".db-reader-photo").clientWidth','High-resolution place photograph has native zoom and pan');await click('.db-reader-photo-expand');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');await cdp('Network.setBlockedURLs',{urls:['*temple-altar*']});
  await open('?story=map-temple');await ready();await click('[data-reader-thumbnail="2"]');await wait('document.querySelector(".db-reader-media").dataset.imageState==="error"','unavailable altar photo');
  await check('document.querySelector(".db-reader-media").dataset.displayedChapter!=="2"&&document.querySelectorAll("[data-reader-chapter]").length===3&&document.querySelector(".db-reader-photo img").naturalWidth>0','Failed new source image retains a usable photo and all prose');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-reader-gallery-error button');await at(2);console.log('PASS Retry restores the source altar photograph');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  for(const [point,entry] of [['temple',entries[0]],['reception',entries[1]],['stilt-house',entries[2]],['pond',entries[3]]]){
    await open('?section=spaces');await settle();await click('.db-space-list [data-space-id="'+point+'"]');await click('[data-action=open-space-details]');await ready();
    await check('document.querySelector("dialog").dataset.readerStory==='+JSON.stringify(entry.id),'Map point opens its researched detail '+point);
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','close researched point');
    await check('document.activeElement.matches("[data-action=open-space-details]")','Focus returns to the point action '+point);
  }
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await viewport(390,844);await open('?story=map-pond');await ready();await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const target=await page('const r=document.querySelector("[data-reader-thumbnail=\\"1\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[target]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await at(1);
  await check('document.querySelector("[data-reader-map-marker=\\"08\\"]")&&getComputedStyle(document.querySelector(".db-reader-gallery-photo")).animationName==="none"','Phone touch selects the pond location with reduced motion');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
