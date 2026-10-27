/* Exercise the four supplied activity photographs and their reading routes. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const loaded=()=>wait('[...document.querySelectorAll(".db-activity-photo")].length===4&&[...document.querySelectorAll(".db-activity-photo img")].every(img=>img.complete&&img.naturalWidth>0)','four activity photographs');
  for(const [width,height] of [[1920,1080],[3840,2160],[1280,720],[1920,900],[2560,1080],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=activities');await loaded();await settle();
    await shot('activities-'+width+'x'+height);
    await check('document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1&&('+width+'<1280||document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1)','Activity chapter fits the desktop and has no horizontal overflow at '+width+'x'+height);
    await check('[...document.querySelectorAll(".db-date-card")].every((card,i)=>{const id=["opening","birthday","remembrance","visit"][i],img=card.querySelector("img");return card.dataset.activity===id&&img.src.includes("/"+id+"-")&&getComputedStyle(img).filter==="none"})','All four user photos remain sharp and mapped to the right occasion at '+width);
    if(width>=1280){
      await check('(()=>{const cards=[...document.querySelectorAll(".db-date-card")].map(el=>el.getBoundingClientRect());return cards.every((r,i)=>Math.abs(r.top-cards[0].top)<1&&Math.abs(r.bottom-cards[0].bottom)<1&&(!i||r.left>=cards[i-1].right))&&[...document.querySelectorAll(".db-date-number")].every(el=>el.getBoundingClientRect().bottom<document.querySelector(".db-visit-note").getBoundingClientRect().top)})()','Four equal photo columns and large dates share one row at '+width);
      await check('[...document.querySelectorAll("main button,.db-detail-tools button")].every(button=>{const r=button.getBoundingClientRect();return r.height>=44&&r.top>=0&&r.bottom<document.querySelector(".db-navigation").getBoundingClientRect().top&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','Story buttons and utilities stay visible above the footer at '+width);
      await check('(()=>{const tools=document.querySelector(".db-detail-tools").getBoundingClientRect(),range=document.createRange();range.selectNodeContents(document.querySelector(".db-section-heading>p"));const paragraph=range.getBoundingClientRect(),heading=document.querySelector(".db-section-heading h1").getBoundingClientRect();return paragraph.top>=tools.bottom-1&&(heading.right<tools.left||heading.top>tools.bottom)})()','Heading and introductory copy avoid the floating tools at '+width);
    }else{
      await page('document.querySelector(".db-date-card:last-child button").scrollIntoView({block:"center"})');
      await check('(()=>{const button=document.querySelector(".db-date-card:last-child button"),r=button.getBoundingClientRect();return r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})()','Last occasion stays reachable in the narrow layout at '+width);
    }
  }
  await viewport(1920,1080);await open('?section=activities');await loaded();await settle();
  for(const [id,day,title] of [['opening','26','Nhớ ngày ngôi đền mở cửa'],['birthday','19','Dâng Bác những việc làm tốt'],['remembrance','02','Lắng lại trong miền ký ức'],['visit','03','Ba điều bạn có thể bắt đầu']]){
    const button='[data-activity='+id+'] .db-date-invitation button';await click(button);await wait('document.querySelector("dialog")?.matches(":modal")','activity reader opens');
    await wait('document.querySelector(".db-reader-photo img")?.complete&&document.querySelector(".db-reader-photo img")?.naturalWidth>0','reader photograph');
    await check('document.querySelector("#db-reader-title").textContent==='+JSON.stringify(title)+'&&document.querySelector(".db-reader-photo img").src.includes("/'+id+'-")&&document.querySelectorAll(".db-reader-chapter").length>=3&&document.querySelector(".db-listen")','Occasion '+day+' opens its own story, supplied image and optional narration');
    await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','reader closes');
    await check('document.activeElement===document.querySelector('+JSON.stringify(button)+')','Closing occasion '+day+' restores its original reading action');
  }
  await click('.db-visit-note button');await wait('document.querySelector("dialog[open]")','visitor guidance opens');
  await check('document.querySelector("#db-reader-title").textContent==="Ba điều bạn có thể bắt đầu"','Visitor guidance opens the practical three-step story');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','visitor guidance closes');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  const point=await page('const r=document.querySelector("[data-activity=remembrance] button").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await wait('document.querySelector("dialog[open]")','native touch opens story');
  await check('document.querySelector("#db-reader-title").textContent==="Lắng lại trong miền ký ức"','Native touch opens the correct activity');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','touch reader closes');await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await open('?section=activities');await loaded();
  await check('[...document.querySelectorAll(".db-date-card")].every(el=>getComputedStyle(el).animationName==="none")','Reduced motion disables all four scene entrances');
  await cdp('Emulation.setEmulatedMedia',{features:[]});await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.setBlockedURLs',{urls:['*birthday-*.webp']});await open('?section=activities');
  await wait('document.querySelector("[data-activity=birthday] .db-picture").dataset.imageState==="error"','photo error state');await settle();
  await check('(()=>{const retry=document.querySelector("[data-activity=birthday] .db-image-status button"),r=retry.getBoundingClientRect();return document.querySelector("[data-activity=birthday] h2").textContent.length>0&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===retry})()','Failed photo keeps its story and a usable retry action');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('[data-activity=birthday] .db-image-status button');await loaded();console.log('PASS Retrying restores the supplied birthday photograph');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser errors');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
