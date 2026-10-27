/* Browser coverage for the seven supplied reference scenes and native controls. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const years=['1969','1970','1971','1971\u20131972','1975','1989','2012'];
  const labels=['1969','1970','1971','1972','1975','1989','2012'];
  const dimensions=[[1672,941],[1672,941],[1672,941],[1672,941],[1672,941],[1671,941],[1671,941]];
  const referenceBounds={"1969": {"left": 55, "top": 98, "width": 784, "height": 284}, "1970": {"left": 40, "top": 153, "width": 553, "height": 210}, "1971": {"left": 39, "top": 154, "width": 513, "height": 208}, "1972": {"left": 39, "top": 154, "width": 570, "height": 209}, "1975": {"left": 39, "top": 154, "width": 576, "height": 208}, "1989": {"left": 53, "top": 94, "width": 732, "height": 268}, "2012": {"left": 46, "top": 101, "width": 789, "height": 275}};

  const loaded=year=>wait('document.querySelector(".db-history-photo-art").dataset.artYear==='+JSON.stringify(year)+'&&document.querySelector(".db-history-photo-art").dataset.imageState==="ready"','selected historical photograph');
  const select=async year=>{await click('[data-milestone="'+year+'"]');await loaded(year);await settle();};
  await cdp('Emulation.setPageScaleFactor',{pageScaleFactor:1});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const [width,height] of [[1672,941],[1774,887],[1920,1080],[3840,2160],[1280,720],[2560,1080],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=history');
    for(const [i,year] of years.entries()){
      await select(year);
      await check('(()=>{const img=document.querySelector(".db-history-art-layer--in img"),r=img.getBoundingClientRect(),s=getComputedStyle(img),expected='+JSON.stringify(dimensions[i])+';return img.naturalWidth===expected[0]&&img.naturalHeight===expected[1]&&img.currentSrc.includes("'+labels[i]+'-background-")&&s.objectFit==="cover"&&(innerWidth<=900||(Math.abs(r.width-innerWidth)<1&&Math.abs(r.height-innerHeight)<1))&&s.filter==="none"&&s.maskImage==="none"})()','Correct unchanged supplied background and full-screen framing for '+year+' at '+width);
      await check('document.querySelector(".db-history-year").textContent==="'+labels[i]+'"&&getComputedStyle(document.querySelector(".db-history-year")).color==="rgb(255, 255, 255)"&&document.querySelectorAll("[data-milestone][aria-pressed=true]").length===1&&document.querySelector("[data-milestone][aria-pressed=true]").textContent==="'+labels[i]+'"&&document.querySelectorAll(".db-navigation button").length===6&&document.querySelector("[data-section-target=history]").getAttribute("aria-current")==="page"','Native year, selected timeline and existing six-function footer for '+year+' at '+width);
      await check('!document.querySelector(".db-history-counter-plane,.db-milestone-dot,.db-history-ruler,.db-history-composition,.db-history-visual button")&&document.querySelector("main").scrollWidth<=innerWidth+1&&document.querySelector(".db-timeline").scrollWidth>=document.querySelector(".db-timeline").clientWidth','No old photographic-number cutout, blur counters, plus pins or horizontal page overflow for '+year+' at '+width);
      await check('(()=>{const year=document.querySelector(".db-history-year"),svg=year.querySelector("svg"),t=svg.querySelector("text"),s=getComputedStyle(t);return !year.querySelector("img,image,path,filter,mask")&&!svg.hasAttribute("viewBox")&&!t.hasAttribute("textLength")&&s.fontWeight==="750"&&s.fontSynthesis==="none"&&s.fontKerning==="none"&&s.fill==="rgb(255, 255, 255)"&&s.stroke==="none"&&s.filter==="none"&&s.maskImage==="none"&&s.transform==="none"&&s.textShadow==="none"&&Math.abs(parseFloat(s.fontSize)/year.clientHeight-parseFloat(getComputedStyle(year).getPropertyValue("--year-size")))<.02&&[...document.fonts].some(f=>f.family.includes("Memorial Year")&&f.weight==="750"&&f.status==="loaded")&&visualViewport.scale===1&&devicePixelRatio===1&&[t,svg,year].every(el=>getComputedStyle(el).zoom==="1"&&getComputedStyle(el).filter==="none"&&getComputedStyle(el).transform==="none")})()','Live loaded 750-weight font has no trace, texture, bitmap, blur or excess scaling at 100% zoom: '+year+' at '+width);
      if(width===1672){
        const b=referenceBounds[labels[i]];
        await check('(()=>{const y=document.querySelector(".db-history-year").getBoundingClientRect(),b='+JSON.stringify(b)+';return Math.abs(y.left-b.left)<1&&Math.abs(y.top-b.top)<1&&Math.abs(y.width-b.width)<1&&Math.abs(y.height-b.height)<1&&document.querySelector(".db-history-year-type text").textContent==="'+labels[i]+'"})()','Native font numerals preserve the measured bounds of the '+labels[i]+' layout');
        await check('(()=>{const read=document.querySelector(".db-history-read").getBoundingClientRect(),fact=document.querySelector(".db-history-fact").getBoundingClientRect();return Math.abs(read.top-'+[686,661,661,656,661,694,687][i]+')<1&&Math.abs(fact.top-'+[637,585,584,587,584,637,633][i]+')<1})()','Read action and annotation align to the supplied '+labels[i]+' layout');
        const centers=[223,427,632,836,1040,1245,1449];
        await check('(()=>{const centers='+JSON.stringify(centers)+';return [...document.querySelectorAll("[data-milestone]")].every((button,n)=>{const r=button.getBoundingClientRect();return Math.abs(r.x+r.width/2-centers[n])<2})&&getComputedStyle(document.querySelector("[data-milestone][aria-pressed=true] .db-milestone-year"),"::after").transform==="matrix(1, 0, 0, 1, 0, 0)"})()','All milestones use the shared 1970 timeline spacing and selected underline: '+labels[i]);
      }
      if(width>=1280){
        await check('(()=>{const s=document.querySelector(".db-history-stage").getBoundingClientRect(),c=document.querySelector(".db-era-detail").getBoundingClientRect(),y=document.querySelector(".db-history-year").getBoundingClientRect(),a=document.querySelector(".db-history-axis").getBoundingClientRect(),f=document.querySelector(".db-navigation").getBoundingClientRect();return s.left===0&&s.top===0&&Math.abs(s.width-innerWidth)<1&&Math.abs(s.height-innerHeight)<1&&c.bottom<a.top&&y.bottom<c.top&&Math.abs(a.bottom-f.top)<1&&document.querySelector("main").scrollHeight<=innerHeight+1})()','Year and story fit above the horizontal timeline and overlay footer for '+year+' at '+width);
        await check('[...document.querySelectorAll(".db-history-axis button,.db-history-read,.db-detail-tools button")].every(b=>{const r=b.getBoundingClientRect();return r.width>=43.9&&r.height>=43.9&&(b.disabled||document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===b)})','Touch targets remain visible and independently clickable for '+year+' at '+width);
      }
    }
  }
  await viewport(1672,941);await open('?section=history');
  for(const [i,year] of years.entries()){
    await select(year);await click('.db-history-read');await wait('document.querySelector("dialog[open]")','milestone reader');
    await check('document.querySelector(".db-reader-bar").textContent.includes("'+labels[i]+'")&&document.querySelector("dialog img").currentSrc.includes("'+labels[i]+'-background-")&&document.querySelectorAll(".db-reader-chapter").length>=3','Reader uses the corrected photo for '+year);
    await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','reader closed');
    await check('document.activeElement.matches(".db-history-read")&&document.querySelector(".db-history-stage").dataset.historyYear==='+JSON.stringify(year),'Closing the reader restores focus and milestone '+year);
  }
  await select('1969');await check('document.querySelector(".db-history-axis>.db-round:first-child").disabled','Timeline has a disabled first endpoint');
  await click('.db-history-axis>.db-round:last-child');await loaded('1970');await check('document.querySelector(".db-history-year").textContent==="1970"','Next advances to the corrected crowd photograph');
  await click('[data-milestone="1970"]');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39,nativeVirtualKeyCode:39});await loaded('1971');
  await check('document.activeElement.dataset.milestone==="1971"','Keyboard advances selection and focus');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35,nativeVirtualKeyCode:35});await loaded('2012');
  await check('document.querySelector(".db-history-axis>.db-round:last-child").disabled&&document.activeElement.dataset.milestone==="2012"','End reaches the disabled last endpoint');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36,nativeVirtualKeyCode:36});await loaded('1969');
  for(const y of ['1989','1970','2012','1971','1971\u20131972']){await click('[data-milestone="'+y+'"]');await sleep(25);}
  await loaded('1971\u20131972');await check('document.querySelector(".db-history-year").textContent==="1972"','Rapid selection keeps the last requested scene');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.setBlockedURLs',{urls:['*/1975-background-*.webp']});await select('1969');await click('[data-milestone="1975"]');
  await wait('document.querySelector(".db-history-photo-art").dataset.imageState==="error"','failed photo');await check('document.querySelector(".db-history-art-status--error button")&&document.querySelector(".db-history-year").textContent==="1969"&&document.querySelector(".db-history-photo-art").dataset.artYear==="1969"&&document.querySelector(".db-history").dataset.requestedYear==="1975"','Failed photograph offers retry while retaining the matching photograph and year');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-history-art-status--error button');await loaded('1975');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await click('[data-detail-action=sources]');await wait('document.querySelector("dialog[open]")','sources');await check('document.querySelectorAll(".db-source-list>a").length===5','Existing sources remain available');await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','sources closed');
  await click('[data-section-target=overview]');await click('[data-section-target=history]');await loaded('1975');await check('document.querySelector(".db-history-year").textContent==="1975"','Returning from another section preserves the milestone');
  await cdp('Emulation.setEmulatedMedia',{features:[]});const animations=new Set();
  for(const year of years){await select(year);animations.add(await page('return getComputedStyle(document.querySelector(".db-history-art-layer--in")).animationName'));}
  assert.equal(animations.size,7);assert.ok(!animations.has('none'));console.log('PASS Seven finite scene transitions');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await select('1969');await check('getComputedStyle(document.querySelector(".db-history-art-layer--in")).animationName==="none"','Reduced motion suppresses transitions');
  await viewport(3840,2160);await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  const point=await page('const r=document.querySelectorAll("[data-milestone]")[5].getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await loaded('1989');console.log('PASS Native touch selects the 1989 photograph at 4K');
  assert.deepEqual(errors,[]);console.log('PASS No browser errors');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
