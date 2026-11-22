const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const overview=()=>wait('document.querySelector("#museo-overview")&&!document.querySelector("#museo-overview").hidden','retained overview');
  const go=async query=>{await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html'+query});await overview();};
  await viewport(1920,1080);await go('');
  await check('!document.querySelector("#museo-hero,.md-khmer-intro")&&document.querySelectorAll(".md-section:not([hidden])").length===1&&document.querySelector(".md-footer [aria-current=page]").dataset.section==="overview"','Opening the museum goes directly to its single overview');
  await check('!document.querySelector(".md-unesco-note")','The entire floating introduction card is removed from the overview photograph');
  await check('document.querySelectorAll(".md-remarkable-row").length===5&&[...document.querySelectorAll(".md-overview-row-number")].map(el=>el.textContent).join(",")==="01,02,03,04,05"&&!document.querySelector(".md-remarkable-row>svg")','All five distinctive-story cards remain available with numbers 01 through 05 instead of icons');
  for(const [width,height] of [[1920,1080],[1280,720],[390,844]]){
    await viewport(width,height);await sleep(150);
    await page('document.querySelector(".md-remarkable-list").scrollTop=0');await sleep(100);
    await check('(()=>{const list=document.querySelector(".md-remarkable-list"),r=list.getBoundingClientRect(),rows=[...list.querySelectorAll(".md-remarkable-row")].map(el=>el.getBoundingClientRect());return rows.slice(0,3).every(row=>row.top>=r.top-1&&row.bottom<=r.bottom+1)&&rows[3].top>=r.bottom-1&&list.scrollHeight>list.clientHeight})()','Exactly the first three stories are visible before scrolling at '+width);
    await page('const list=document.querySelector(".md-remarkable-list");list.scrollTop=list.scrollHeight');await sleep(100);
    await check('(()=>{const list=document.querySelector(".md-remarkable-list"),r=list.getBoundingClientRect();return [...list.querySelectorAll(".md-remarkable-row")].slice(3).every(el=>{const row=el.getBoundingClientRect();return row.top>=r.top-1&&row.bottom<=r.bottom+1})})()','Scrolling reveals both story 04 and story 05 at '+width);
    await page('document.querySelector(".md-remarkable-list").scrollTop=0');
  }
  await viewport(1920,1080);
  await check('!document.querySelector(".md-visit-heading .ha-inline-actions")&&document.querySelectorAll(".md-visit-row .md-small-arrow").length===3','Each visit-reason card has an arrow; heading audio and QR actions are removed');
  await check('[...document.querySelectorAll(".md-visit-row")].map(el=>el.dataset.overviewTopic).join(",")==="everyday,learning,route"&&document.querySelector(".md-visit-row[data-overview-topic=learning] strong").textContent==="HỌC TỪ NHỮNG HIỆN VẬT"','Visit reasons place learning second and the three destinations last');
  await wait('document.querySelector(".md-entrance-art")?.naturalWidth>0','overview photograph');await shot('single-overview');
  const gallery=[];
  const total=await page('return Number(document.querySelector(".md-chamber-caption>div>small").textContent.split("/")[1])');
  assert.ok(total>=7,'Album includes photographs from all current overview stories');
  for(let i=0;i<total;i++){
    await wait('document.querySelector(".md-chamber>img")?.naturalWidth>0','gallery photograph '+i);
    const card=await page('const c=document.querySelector(".md-chamber");return {id:c.dataset.overviewSlide,topic:c.dataset.overviewAlbumTopic,src:c.querySelector("img").src,title:c.querySelector(".md-chamber-caption strong").textContent,caption:c.querySelector(".md-chamber-caption>span>small").textContent,alt:c.querySelector("img").alt}');
    gallery.push(card);
    const hit=await page('const b=document.querySelector(".md-chamber-open"),r=b.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,hit:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)===b}');
    assert.ok(hit.hit,'Photograph is directly touchable');
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:hit.x,y:hit.y,button:'left',clickCount:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:hit.x,y:hit.y,button:'left',clickCount:1});
    await wait('document.querySelector(".md-overview-viewer")?.open','album opens corresponding story');
    await wait('document.querySelector(".md-overview-main-image")?.naturalWidth>0','selected detail photograph');
    assert.equal(await page('return document.querySelector("[data-overview-story]").dataset.overviewStory'),card.topic,'Selected photograph opens its matching story');
    assert.equal(await page('return document.querySelector(".md-overview-main-image").src'),card.src,'Detail initially shows the exact selected photograph');
    assert.equal(await page('return document.querySelector(".md-overview-reading [data-inline-audio]").dataset.inlineAudio'),'bao-tang-khmer:overview:'+card.topic,'Detail has the corresponding narration');
    await click('.md-overview-close');await wait('!document.querySelector(".md-overview-viewer")','close album story');
    await check('document.activeElement===document.querySelector(".md-chamber-open")','Closing returns focus to the selected album photograph');
    await click('[data-action=overview-next-photo]');
  }
  assert.equal(new Set(gallery.map(card=>card.src)).size,total,'Every displayed card has a distinct photograph');
  for(const topic of ['collections','identity','architecture','performing','dailyLife','spiritual'])assert.ok(gallery.some(card=>card.topic===topic),topic+' has a related album photograph');
  assert.ok(gallery.every(card=>card.topic!=='visit'),'Central album excludes the separate visit-reasons section');
  assert.ok(gallery.every(card=>card.caption.length>15&&card.alt.length>10),'Every picture has its matching description and accessible name');
  assert.equal(await page('return document.querySelector(".md-chamber").dataset.overviewSlide'),gallery[0].id,'Next wraps to the first card');
  await click('[data-action=overview-previous-photo]');assert.equal(await page('return document.querySelector(".md-chamber").dataset.overviewSlide'),gallery.at(-1).id,'Previous wraps to the last card');
  await click('[data-action=overview-next-photo]');console.log('PASS Distinct detail photographs, matching stories and narration, captions and both carousel directions');
  await click('.md-overview-ctas [data-overview-topic=collections]');await wait('document.querySelector(".md-overview-viewer")?.open','museum story');
  await check('document.querySelector("[data-overview-story=collections]")','The main exhibition button opens the combined museum story');
  await click('.md-overview-close');await wait('!document.querySelector(".md-overview-viewer")','close story');await overview();
  await page('document.querySelector("#museo-overview").focus()');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'PageUp',code:'PageUp',windowsVirtualKeyCode:33});await overview();
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});await wait('document.querySelector("#museo-map")&&!document.querySelector("#museo-map").hidden','next screen');
  await click('.md-footer [data-section=overview]');await overview();
  await viewport(1920,1080);
  for(const section of ['overview','map','timeline','tour','exhibitions']){
    await click('.md-footer [data-section='+section+']');
    await wait('!document.querySelector("#museo-'+section+'").hidden','selected screen '+section);
    for(const deltaY of [700,-700]){
      await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:650,y:120,deltaX:0,deltaY});await sleep(250);
      await check('document.querySelector(".md-footer [aria-current=page]").dataset.section==="'+section+'"','Mouse wheel does not change screens on '+section+' ('+deltaY+')');
    }
  }
  await click('.md-footer [data-section=overview]');await overview();
  const scrollTarget=await page('const el=document.querySelector(".md-remarkable-list");el.scrollTop=0;const r=el.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',...scrollTarget,deltaX:0,deltaY:400});await sleep(600);
  await check('document.querySelector(".md-remarkable-list").scrollTop>0&&document.querySelector(".md-footer [aria-current=page]").dataset.section==="overview"','Mouse wheel still scrolls the story list within its current screen');
  await check('document.querySelectorAll(".md-footer button").length===5&&!document.querySelector(".md-footer [data-section=hero]")','Footer returns directly to Overview; keyboard navigation has no introductory stop');
  await go('?section=hero');await wait('new URLSearchParams(location.search).get("section")==="overview"','old introduction link migrated');console.log('PASS Old introduction URLs open the retained overview');
  await page('sessionStorage.removeItem("heritage:route:bao-tang-khmer");sessionStorage.setItem("heritage:state:museum:section",JSON.stringify("hero"))');
  await go('');await wait('JSON.parse(sessionStorage.getItem("heritage:state:museum:section"))==="overview"','old session migrated');console.log('PASS A saved introductory session cannot reopen the removed screen');
  for(const [width,height] of [[1280,720],[390,844]]){
    await viewport(width,height);await sleep(150);await check('document.querySelector(".md-root").scrollWidth<=innerWidth+1&&!document.querySelector("#museo-overview").hidden','Retained overview fits at '+width);await shot('single-overview-'+width);
  }
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&place=pagoda'});await wait('document.querySelector("#museo-map")?.dataset.zone==="landscape"','direct discovery link');
  await check('document.querySelector(".kd-detail").dataset.selectedPlace==="pagoda"&&!document.querySelector("#museo-hero")','Existing deep links still reach the requested discovery point');
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS Single overview, retained story, footer, keyboard, old routes and saved sessions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
