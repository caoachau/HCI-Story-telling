/* Exercise the real six-screen detail page, native reading layer and map host. */
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {disposeBrowser}=require('./browser-artifacts.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist'),profile=path.join(root,'.browser-profile','den-tho-bac-'+process.pid+'-'+Date.now());
const pending=new Map(),errors=[],requests=[];let sequence=0,browser,socket,server,base;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cdp=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method));},30000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});
async function page(code){const r=await cdp('Runtime.evaluate',{expression:`(async()=>{${code}})()`,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function wait(code,label){for(let i=0;i<150;i++){if(await page('return !!('+code+')'))return;await sleep(100);}throw Error('Timeout: '+label);}
async function check(code,label){const ok=await page('return !!('+code+')');if(!ok){console.log('LAYOUT',await page('return [...document.querySelectorAll("main,main>section,.db-intro-copy,.db-intro-art,.db-overview-strip,.db-kiosk,.db-atlas-map,.db-atlas-viewport,.db-aerial-plane")].map(el=>({tag:el.className,width:el.clientWidth,height:el.clientHeight,scroll:el.scrollHeight,top:el.getBoundingClientRect().top,left:el.getBoundingClientRect().left,bottom:el.getBoundingClientRect().bottom,transform:el.style.transform}))'));if(label.includes('markers'))console.log('MARKERS',await page('return [...document.querySelectorAll(".db-map-point")].map(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {code:el.dataset.spaceCode,x:r.x,y:r.y,width:r.width,hit:hit?.closest("button")?.dataset.spaceCode||hit?.className||hit?.tagName}})'));}assert.ok(ok,label);console.log('PASS '+label);}
const click=selector=>page(`const el=document.querySelector(${JSON.stringify(selector)});el.focus({preventScroll:true});el.click();`);
const viewport=(width,height)=>cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
async function shot(name){await sleep(320);const r=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(root,'preview','den-tho-bac-'+name+'.png'),Buffer.from(r.data,'base64'));}
async function open(query=''){await cdp('Page.navigate',{url:base+'/den-tho-bac.html'+query});await wait('document.querySelector(".db-kiosk")','detail page');await page('await document.fonts.ready');}
async function settle(){await page('await Promise.all(document.getAnimations().map(a=>a.finished.catch(()=>{})))');await wait('!document.querySelector("[data-motion-state=running],[data-reader-phase=opening],[data-reader-phase=closing]")','scoped motion finished');}
async function main(){
  fs.mkdirSync(profile,{recursive:true});fs.mkdirSync(path.join(root,'preview'),{recursive:true});
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2','.json':'application/json'};
  server=http.createServer((req,res)=>{const file=path.resolve(dist,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}`;
  browser=spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  let port;for(let i=0;i<150;i++){try{const p=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];if(/^\d+$/.test(p)){port=p;break;}}catch(e){if(!['EBUSY','ENOENT','EPERM'].includes(e.code))throw e;}await sleep(100);}assert.ok(port,'Chrome started');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json`)).json();socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
  socket.addEventListener('message',e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);});
  await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Network.enable');
  const sections=['overview','history','spaces','people','activities','values'];
  for(const [width,height] of (process.argv.includes('--flows-only')||process.argv.includes('--map-only')?[]:[[1920,1080],[3840,2160],[1280,720],[768,1024],[390,844],[320,720]])){
    await viewport(width,height);await open();
    for(const section of sections){
      await click('[data-section-target='+section+']');
      await wait('[...document.querySelectorAll("main img")].every(i=>i.complete&&i.naturalWidth>0)','section photographs');
      await settle();
      await check('document.querySelector(".db-kiosk").dataset.section==="'+section+'"&&document.querySelectorAll(".db-navigation [aria-current=page]").length===1&&document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1',section+' is independent and has no horizontal overflow at '+width);
      await check('!document.querySelector(".db-topbar")&&document.querySelector("main").getBoundingClientRect().top===0&&document.querySelectorAll(".db-detail-tools button").length===3&&[...document.querySelectorAll(".db-detail-tools button")].every(button=>{const r=button.getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=0&&r.right<=innerWidth&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','Header removed and three floating tools remain touchable for '+section+' at '+width);
      if(width>=1280){
        await check('document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1','Fixed '+section+' screen fits at '+width);
        await check('[...document.querySelectorAll("main button")].every(el=>{const r=el.getBoundingClientRect(),m=document.querySelector("main").getBoundingClientRect();return r.top>=m.top-1&&r.bottom<=m.bottom+1})','All '+section+' controls stay within the visible screen at '+width);
      }
      if(width===1920||width===3840||width===1280)await shot(width+'-'+section);
    }
  }
  if(!process.argv.includes('--map-only')){
  await viewport(1920,1080);await open();
  await click('[data-section-target=history]');
  await check('document.querySelectorAll("[data-milestone]").length===7&&[...document.querySelectorAll("[data-milestone]")].every((el,i,all)=>{const r=el.getBoundingClientRect(),first=all[0].getBoundingClientRect();return Math.abs(r.top-first.top)<1&&(!i||r.left>all[i-1].getBoundingClientRect().right-1)})','All seven milestones form one horizontal timeline');
  const years=['1969','1970','1971','1971\u20131972','1975','1989','2012'];
  const sceneAnimations=new Set();
  for(const [width,height] of [[1920,1080],[3840,2160],[1280,720]]){
    await viewport(width,height);
    for(const year of years){
      await click('[data-milestone="'+year+'"]');
      await wait('document.querySelector(".db-history-photo-art").dataset.imageState==="ready"&&document.querySelector(".db-history-photo-art").dataset.artYear==='+JSON.stringify(year),'selected artwork is decoded');
      await wait('[...document.querySelectorAll("main img")].every(i=>i.complete&&i.naturalWidth>0)','selected scene photograph');
      await settle();
      await check('document.querySelector(".db-history-stage").dataset.historyYear==="'+year+'"&&document.querySelector(".db-history-date>span").textContent==="'+year+'"&&document.querySelectorAll("[data-milestone][aria-pressed=true]").length===1&&!document.querySelector("dialog")','Selecting '+year+' changes the scene directly at '+width);
      await check('(()=>{const art=document.querySelector(".db-history-visual").getBoundingClientRect(),stage=document.querySelector(".db-history-stage").getBoundingClientRect(),img=document.querySelector(".db-history-art-layer--in>img");return img.naturalWidth>=2000&&img.currentSrc.includes("/assets/")&&art.left>=stage.left&&art.right<=stage.right&&art.top>=stage.top&&art.bottom<=stage.bottom&&Math.abs(art.width/art.height-1335/526)<.01})()','Supplied photographic year is presented in full without stretching at '+width+' for '+year);
      await check('document.querySelector(".db-history-axis").getBoundingClientRect().height<=innerHeight*.14&&document.querySelector(".db-era-detail").getBoundingClientRect().right<document.querySelector(".db-history-visual").getBoundingClientRect().left','Timeline, introduction and photographic year have separate space for '+year+' at '+width);
      await check('document.querySelector(".db-era-detail").getBoundingClientRect().bottom<document.querySelector(".db-history-axis").getBoundingClientRect().top&&[...document.querySelectorAll(".db-history-stage button")].every(el=>{const r=el.getBoundingClientRect(),m=document.querySelector(".db-history-stage").getBoundingClientRect();return r.top>=m.top&&r.bottom<=m.bottom})','Scene text and touch controls fit above the timeline for '+year+' at '+width);
      if(width===1920)sceneAnimations.add(await page('return getComputedStyle(document.querySelector(".db-history-art-layer--in")).animationName'));
      if(width===1920){await click('.db-history-read');await wait('document.querySelector("dialog[open]")','every date has its own reader');await check('document.querySelectorAll(".db-reader-chapter").length>=3&&document.querySelector(".db-reader-bar>span").textContent.length>0','Three-point story is available for '+year);await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','date story closed');}
      if(width===1920)await shot('history-'+year);
    }
  }
  assert.equal(sceneAnimations.size,7,'Each milestone has a distinct scene entrance');assert.ok(!sceneAnimations.has('none'),'Scene entrances are active');console.log('PASS Seven different finite scene transitions');
  await viewport(1920,1080);
  await check('document.querySelector(".db-history-axis>.db-round:last-child").disabled','The final milestone has a clear endpoint');
  await click('.db-history-axis>.db-round:first-child');
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="1989"','Previous milestone changes the scene');
  await click('.db-history-axis>.db-round:last-child');
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="2012"','Next milestone changes the scene');
  await click('[data-milestone="1969"]');
  await check('document.querySelector(".db-history-axis>.db-round:first-child").disabled','The first milestone has a clear endpoint');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39,nativeVirtualKeyCode:39});
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="1970"&&document.activeElement.dataset.milestone==="1970"','Arrow keys move both selection and focus along the timeline');
  for(const year of ['1989','1970','2012','1969','2012']){await click('[data-milestone="'+year+'"]');await sleep(30);}
  await wait('document.querySelector(".db-history-photo-art").dataset.artYear==="2012"&&document.querySelector(".db-history-photo-art").dataset.imageState==="ready"','rapid selection keeps the last requested image');
  await check('document.querySelector(".db-history-stage").dataset.historyYear==="2012"','Rapid touches never restore an older scene');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.setBlockedURLs',{urls:['*1975-*.webp']});
  await click('[data-milestone="1975"]');await wait('document.querySelector(".db-history-photo-art").dataset.imageState==="error"','history artwork error state');
  await check('document.querySelector(".db-era-detail h2").textContent.includes("hòa bình")&&document.querySelector(".db-history-art-status--error button")','A failed scene keeps its story and offers an image retry');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-history-art-status--error button');
  await wait('document.querySelector(".db-history-photo-art").dataset.imageState==="ready"&&document.querySelector(".db-history-photo-art").dataset.artYear==="1975"','history artwork recovers after retry');
  await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  await click('[data-milestone="2012"]');
  await click('.db-history-read');
  await wait('document.querySelector("dialog[open]")','historical read button opens its story');
  await check('document.querySelector("dialog").textContent.includes("97%")','The read button opens the selected milestone story');await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','scene reader close completed');
  await check('document.querySelector(".db-era-detail").textContent.includes("97%")','Timeline selection changes the actual story');
  await click('.db-era-detail .db-button');await wait('document.querySelector("dialog[open]")','reader');
  await check('document.querySelectorAll(".db-reader-chapter").length>=3&&!document.querySelector(".db-read-more").open','Reader has continuous sections and sources available on request');
  await page(`window.__voice={speak:0,cancel:0};Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(t){this.text=t}}});Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'vi-VN'}],speak:u=>{window.__voice.speak++;u.onstart?.()},cancel:()=>window.__voice.cancel++}});`);
  await click('.db-listen');await check('window.__voice.speak===1&&document.querySelector(".db-listen").getAttribute("aria-pressed")==="true"','Narration starts only when requested');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await wait('!document.querySelector("dialog[open]")','close by Escape');
  await wait('!document.querySelector("dialog")','reader unmount after native close');
  await check('window.__voice.cancel>=2','Escape stops the device narration');
  await check('document.activeElement.closest(".db-era-detail")','Escape restores the original reading control');
  await viewport(390,844);await click('[data-milestone="1969"]');await sleep(350);await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35,nativeVirtualKeyCode:35});
  await wait('(()=>{const nav=document.querySelector(".db-timeline").getBoundingClientRect(),item=document.querySelector("[data-milestone][aria-pressed=true]").getBoundingClientRect();return item.left>=nav.left-1&&item.right<=nav.right+1})()','narrow timeline scrolls its selected milestone into view');
  await check('document.activeElement.dataset.milestone==="2012"&&document.querySelector("main").scrollWidth<=innerWidth','Narrow-screen keyboard navigation keeps the selected date visible');
  await viewport(1920,1080);
  for(const [section,target] of [['overview','.db-overview-image--in'],['history','.db-history-stage'],['spaces','.db-atlas-panel'],['people','.db-person-copy'],['activities','.db-date-card-2'],['values','.db-value-spread']]){
    await click('[data-section-target='+section+']');await check('getComputedStyle(document.querySelector('+JSON.stringify(target)+')).animationName!=="none"','The '+section+' chapter has its own entrance');await settle();
  }
  }else{await viewport(1920,1080);await open('?section=history');await click('[data-milestone="2012"]');}
  await click('[data-section-target=spaces]');await settle();
  await check('document.querySelector(".db-atlas-panel").dataset.panelView==="list"&&document.querySelectorAll(".db-space-list button").length===8&&!document.querySelector(".db-atlas-selection")','The sidebar starts with only the eight destination choices');
  await shot('spaces-eight-item-list');
  for(const id of ['temple','exhibition','reception','artifacts','boat','stilt-house','camping','pond']){
    await click('.db-space-list [data-space-id='+id+']');await wait('document.querySelector(".db-atlas-panel").dataset.panelView==="summary"&&document.querySelector(".db-atlas-panel").dataset.spaceId==="'+id+'"','selected card becomes a summary');
    await wait('document.activeElement===document.querySelector(".db-atlas-selection h2")','focus enters the selected summary');
    await check('!document.querySelector(".db-space-list")&&!document.querySelector("dialog")&&document.querySelectorAll(".db-map-point").length===8','Selecting the '+id+' card hides the other sidebar choices without opening a popup');
    if(id==='artifacts'){
      await click('[data-action=open-space-details]');await wait('document.querySelector("dialog")?.matches(":modal")','explicit details action opens a modal');
      await check('document.querySelectorAll(".db-reader-chapter").length>=3','The details popup starts with its complete information visible');await shot('spaces-expanded-popup');
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await wait('!document.querySelector("dialog")','details popup closes');
      await check('document.querySelector(".db-atlas-panel").dataset.spaceId==="artifacts"&&!document.querySelector(".db-space-list")&&document.activeElement.matches("[data-action=open-space-details]")','Closing details preserves the summary and returns focus to its action');
    }
    await click('[data-action=show-space-list]');await wait('document.querySelectorAll(".db-space-list button").length===8&&document.activeElement.dataset.spaceId==="'+id+'"','back returns to the selected destination card');
    await check('document.querySelector(".db-atlas-panel").dataset.panelView==="list"&&!document.querySelector(".db-atlas-selection")&&document.querySelector(".db-atlas-viewport").dataset.zoom==="1"','Back from '+id+' restores the eight-item list and full map');
  }
  await click('[data-section-target=spaces]');await click('.db-map-point:nth-of-type(2)');
  await check('document.querySelector(".db-space-detail h2").textContent.includes("Nhà trưng bày")','A photo hotspot updates its matching explanation');
  await check('document.querySelectorAll(".db-map-point").length===8&&!document.querySelector(".db-space-list")&&document.querySelector(".db-atlas-panel").dataset.panelView==="summary"&&[...document.querySelectorAll(".db-map-point")].map(el=>el.dataset.spaceCode).join(",")==="01,02,03,04,05,06,07,08"','Selecting one location replaces the eight-item sidebar with its summary');
  await check('[...document.querySelectorAll(".db-map-point")].every(button=>{const r=button.getBoundingClientRect(),c=button.querySelector(".db-map-point-code").getBoundingClientRect();return c.left>=r.left&&c.right<=r.right&&c.top>=r.top&&c.bottom<=r.bottom&&Math.abs(c.x+c.width/2-r.x-r.width/2)<1&&Math.abs(c.y+c.height/2-r.y-r.height/2)<1})','All eight numbers are centered inside their touch markers');
  const placeAnimations=new Set();
  const placeStories={temple:'Đền thờ Chủ tịch',exhibition:'Nhà trưng bày thân thế',reception:'Nhà đón tiếp khách',artifacts:'hiện vật chiến tranh',boat:'thuyền độc mộc','stilt-house':'Mô hình Nhà sàn',camping:'vui chơi, cắm trại',pond:'Hồ sen'};
  for(const id of ['temple','exhibition','reception','artifacts','boat','stilt-house','camping','pond']){
    await click('.db-map-point[data-space-id='+id+']');
    await check('document.querySelector(".db-atlas-panel").dataset.spaceId==="'+id+'"&&!document.querySelector(".db-space-list")&&document.querySelector(".db-map-point[data-space-id='+id+']").getAttribute("aria-pressed")==="true"&&document.querySelector(".db-space-number").textContent===document.querySelector(".db-map-point[data-space-id='+id+']").dataset.spaceCode','The '+id+' marker and full sidebar summary show the same selection');
    await settle();placeAnimations.add(await page('return getComputedStyle(document.querySelector(".db-atlas-selection")).animationName'));
    await check('document.querySelectorAll(".db-atlas-observe li").length===2','The '+id+' location has its own observation prompts');
    await click('.db-space-detail>.db-button');await wait('document.querySelector("dialog[open]")','selected location story');
    await check('document.querySelector("#db-reader-title").textContent.includes('+JSON.stringify(placeStories[id])+')&&document.querySelectorAll(".db-reader-chapter").length>=3&&document.querySelector(".db-reflect p").textContent.length>15&&document.querySelector(".db-map-reference a")&&document.querySelectorAll(".db-reader-chapter").length>=3','The '+id+' details popup opens the full information, question and supplied source');
    await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','location reader close completed');
    await shot('map-'+id);
  }
  assert.equal(placeAnimations.size,8,'Eight distinct location transitions');assert.ok(!placeAnimations.has('none'));console.log('PASS Every map location has a distinct finite entrance');
  await check('document.querySelector(".db-atlas-pagination>button:last-child").disabled','The last location has a clear endpoint');
  await click('[aria-label="Địa điểm trước"]');await check('document.querySelector(".db-space-number").textContent==="07"','Previous location follows the provided map sequence');
  await click('[aria-label="Địa điểm tiếp theo"]');await check('document.querySelector(".db-space-number").textContent==="08"','Next location follows the provided map sequence');
  for(const [width,height] of [[3840,2160],[1920,1080],[1280,720],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);
    await wait('(()=>{const p=document.querySelector(".db-aerial-plane"),v=document.querySelector(".db-atlas-viewport");return parseFloat(p.style.width)>=v.clientWidth-1&&Math.abs(parseFloat(p.style.width)-Math.max(v.clientWidth,v.clientHeight*1672/941))<1})()','map covers its frame after resize');
    await page('await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
    await check('[...document.querySelectorAll(".db-map-point")].every(el=>{const r=el.getBoundingClientRect(),p=document.querySelector(".db-atlas-viewport").getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.top>=p.top&&r.bottom<=p.bottom&&r.width>=44&&r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===el})','All eight map markers remain visible and directly touchable at '+width);
    if(width>=1280){
      await check('(()=>{const p=document.querySelector(".db-aerial-plane").getBoundingClientRect(),v=document.querySelector(".db-atlas-viewport").getBoundingClientRect(),guide=document.querySelector(".db-atlas-panel").getBoundingClientRect(),img=document.querySelector(".db-aerial-plane img");return Math.abs(p.width/p.height-1672/941)<.001&&p.left<=v.left+1&&p.right>=v.right-1&&p.top<=v.top+1&&p.bottom>=v.bottom-1&&Math.abs(v.right-guide.left)<1&&img.naturalWidth===1672&&img.naturalHeight===941})()','The clean supplied map fills the complete left area without distortion at '+width);
      await check('(()=>{const p=document.querySelector(".db-aerial-plane").getBoundingClientRect();return [["01",49.274,15.361],["02",61.454,16.559],["03",82.545,35.192],["04",69.267,44.325],["05",75.704,62.736],["06",72.977,86.644],["07",28.351,64.055],["08",46.142,81.307]].every(([code,x,y])=>{const r=document.querySelector(".db-map-point[data-space-code=\\\""+code+"\\\"]").getBoundingClientRect();return Math.abs(r.x+r.width/2-(p.x+x/100*p.width))<1&&Math.abs(r.y+r.height/2-(p.y+y/100*p.height))<1})})()','All eight image coordinates stay registered to the supplied reference at '+width);
      for(const id of ['temple','exhibition','reception','artifacts','boat','stilt-house','camping','pond']){await click('.db-map-point[data-space-id='+id+']');await settle();await check('document.querySelector(".db-space-detail>.db-button").getBoundingClientRect().bottom<=document.querySelector(".db-space-detail").getBoundingClientRect().bottom&&document.querySelector(".db-space-detail").scrollHeight<=document.querySelector(".db-space-detail").clientHeight+1&&document.querySelector(".db-atlas-selection").clientHeight>200','The '+id+' full-height summary remains readable and actionable at '+width);}
    }
  }
  await viewport(1920,1080);
  await wait('parseFloat(document.querySelector(".db-aerial-plane").style.width)>=document.querySelector(".db-atlas-viewport").clientWidth-1','desktop map restored');await page('await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  await click('.db-atlas-closeup');await check('document.querySelector(".db-atlas-viewport").dataset.zoom==="1.5"','Look closer focuses the selected location');await click('.db-atlas-closeup');await check('document.querySelector(".db-atlas-viewport").dataset.zoom==="1"','Look closer returns to the full map');
  await click('.db-atlas-closeup');
  await check('document.querySelector(".db-atlas-viewport").dataset.zoom==="1.5"','Look closer enlarges the actual map');
  const dragStart=await page('const r=document.querySelector(".db-atlas-viewport").getBoundingClientRect();return {x:r.x+r.width*.4,y:r.y+r.height*.8};');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...dragStart,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:dragStart.x+100,y:dragStart.y-55,button:'left',buttons:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:dragStart.x+100,y:dragStart.y-55,button:'left',clickCount:1});
  await check('!document.querySelector(".db-aerial-plane").style.transform.startsWith("translate(0px, 0px)")&&document.querySelector(".db-atlas-viewport").dataset.dragging==="false"','Dragging a zoomed photo pans it and ends the gesture');
  for(let i=0;i<6;i++)await click('[aria-label="Địa điểm trước"]');await settle();
  await check('(()=>{const p=document.querySelector(".db-map-point[data-space-id=exhibition]").getBoundingClientRect(),v=document.querySelector(".db-atlas-viewport").getBoundingClientRect();return p.left>=v.left&&p.right<=v.right&&p.top>=v.top&&p.bottom<=v.bottom})()','Selecting a place from the guide brings its zoomed marker into view');
  await shot('spaces-zoomed');await click('.db-atlas-closeup');
  await check('document.querySelector(".db-atlas-viewport").dataset.zoom==="1"&&document.querySelector(".db-aerial-plane").style.transform==="translate(0px, 0px) scale(1)"','Reset restores the full photo and correct marker coordinates');
  await click('[data-section-target=people]');await click('.db-person-tabs button:last-child');await check('document.querySelector(".db-person-copy h2").textContent.includes("Phong Ba")','People choices open their own documentary story');
  await click('[data-section-target=history]');await check(`document.querySelector('[data-milestone="2012"]').getAttribute('aria-pressed')==='true'`,'Moving between sections preserves the historical choice');
  await click('[data-detail-action=sources]');await check('document.querySelectorAll(".db-source-list>a").length===5','Source layer lists the five real references');await shot('sources');await click('.db-reader-bar button');
  assert.ok(!requests.some(u=>/youtube|googleapis|unsplash|vtv.vn/.test(u)),'No remote media or placeholder photos load while exploring');console.log('PASS No remote media or placeholder photos load while exploring');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'},{name:'prefers-reduced-motion',value:'reduce'}]});await open();
  await check('getComputedStyle(document.body).backgroundColor==="rgba(0, 0, 0, 0)"&&getComputedStyle(document.documentElement).backgroundColor==="rgb(247, 246, 240)"&&getComputedStyle(document.querySelector("main>section")).animationName==="none"','Bright exhibition remains stable in dark system mode and respects reduced motion');
  await click('[data-section-target=history]');await click('.db-era-detail .db-button');await page('document.querySelector(".db-reader-photo img").src="/deliberately-missing.jpg"');await wait('document.querySelector(".db-reader-photo [data-image-state=error]")','image failure');await check('document.querySelectorAll(".db-reader-chapter").length>=3','An image failure leaves the story readable');await click('.db-image-status button');await wait('document.querySelector(".db-reader-photo [data-image-state=ready]")','image retry');await click('.db-reader-bar button');
  for(const [width,height] of [[3840,2160],[1280,720],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=history&story=stilt-house');await wait('document.querySelector("dialog")?.matches(":modal")','native modal reading layer');
    await check('document.querySelector("dialog").getBoundingClientRect().height<=innerHeight&&document.querySelector(".db-reader-bar").scrollWidth<=document.querySelector(".db-reader-bar").clientWidth+1&&document.querySelector(".db-reader-layout").scrollWidth<=document.querySelector(".db-reader-layout").clientWidth+1','Reading layer and controls fit at '+width);
    await click('.db-reader-photo-expand');await check('document.querySelector(".db-reader-photo").scrollWidth>document.querySelector(".db-reader-photo").clientWidth','Photo enlargement exposes a real pan area at '+width);
    if(width===3840||width===390)await shot(width+'-reader');await click('.db-reader-bar button');
  }
  await viewport(3840,2160);await open();await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  const tap=async selector=>{const point=await page(`const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};`);await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  await tap('[data-section-target=history]');await wait('document.querySelector(".db-kiosk").dataset.section==="history"','touch history navigation');await tap('[data-milestone="2012"]');await check('document.querySelector(".db-history-stage").dataset.historyYear==="2012"','Native 4K touch selects the actual horizontal milestone');await tap('.db-era-detail .db-button');await wait('document.querySelector("dialog[open]")','touch opens selected story');await tap('.db-reader-bar button');await wait('!document.querySelector("dialog")','touch closes story');
  await tap('[data-section-target=spaces]');await wait('document.querySelector(".db-kiosk").dataset.section==="spaces"','touch navigation');await tap('.db-map-point:nth-of-type(2)');await check('document.querySelector(".db-space-detail h2").textContent.includes("Nhà trưng bày")','Native 4K touch reaches the correct section and photo hotspot');
  for(const id of ['temple','exhibition','reception','artifacts','boat','stilt-house','camping','pond']){await tap('.db-map-point[data-space-id='+id+']');await check('document.querySelector(".db-atlas-panel").dataset.spaceId==="'+id+'"&&!document.querySelector(".db-space-list")','Native 4K touch shows only the '+id+' summary');}
  await tap('[data-action=show-space-list]');await wait('document.querySelectorAll(".db-space-list button").length===8','touch restores list');
  await tap('.db-space-list [data-space-id=artifacts]');await wait('document.querySelector(".db-atlas-panel").dataset.spaceId==="artifacts"','touch expands one destination card');
  await tap('[data-action=open-space-details]');await wait('document.querySelector("dialog")?.matches(":modal")','touch opens full destination information');await tap('.db-reader-bar button');await wait('!document.querySelector("dialog")','touch closes destination popup');
  await check('document.querySelector(".db-atlas-panel").dataset.spaceId==="artifacts"&&!document.querySelector(".db-space-list")','Native 4K list, summary and popup retain the same destination');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  if(!process.argv.includes('--skip-host')){
    await cdp('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{const start=window.setTimeout.bind(window),stop=window.clearTimeout.bind(window);window.__sessionTimers=new Set();window.setTimeout=(fn,ms,...args)=>{const id=start(fn,ms,...args);if(ms===300000)window.__sessionTimers.add(id);return id;};window.clearTimeout=id=>{window.__sessionTimers.delete(id);stop(id);};})()`});
    await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/'});await wait('document.querySelector(".landmark-carousel-card[data-site-id=den-tho-bac]")','map destination');await click('.landmark-carousel-card[data-site-id=den-tho-bac]');await sleep(500);await page(`document.querySelector('[aria-label="Mở diễn giải di sản"]')?.click()`);await wait('document.querySelector("[data-action=show-location-details]")||document.querySelector(".dbk-host-detail iframe")','quick-view entry');await page('document.querySelector("[data-action=show-location-details]")?.click()');
    await wait('document.querySelector(".dbk-host-detail iframe")?.contentDocument?.querySelector(".db-kiosk")','new integrated detail');await wait('!document.querySelector(".dbk-host-detail [role=status]")','host ready');
    const frame=code=>page('const f=document.querySelector(".dbk-host-detail iframe"),d=f.contentDocument,w=f.contentWindow;'+code);
    await sleep(300);
    await check('window.__sessionTimers.size===0','A full-screen story is not interrupted by the quick-view five-minute timeout');
    await check('(()=>{const f=document.querySelector(".dbk-host-detail iframe"),d=f.contentDocument,r=f.getBoundingClientRect(),m=d.querySelector("main").getBoundingClientRect(),p=d.querySelector(".db-overview-frame").getBoundingClientRect();return r.left===0&&r.top===0&&r.width===innerWidth&&r.height===innerHeight&&m.top===0&&Math.abs(p.width-m.width)<1&&Math.abs(p.height-m.height)<1&&!d.querySelector(".db-topbar")&&d.querySelectorAll(".db-detail-tools button").length===3})()','The integrated overview fills the viewport with three floating tools');
    await frame('d.querySelector("[data-section-target=spaces]").click();w.__memorialState=true');await frame('d.querySelector("[data-detail-action=fullscreen]").click()');await sleep(300);
    await check('document.querySelector("[data-location-view=quick]")','Collapsing the detail returns to the actual quick view');
    await check('window.__sessionTimers.size===1','The quick view still arms its five-minute reset');
    await page('document.querySelector("[data-action=show-location-details]").click()');await wait('document.querySelector("[data-location-view=detail]")','reopen full detail');await sleep(300);
    await check('document.querySelector(".dbk-host-detail iframe").contentWindow.__memorialState===true&&document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector(".db-kiosk").dataset.section==="spaces"','Map host changes size without remounting or losing the section');await shot('integrated');
    await check('window.__sessionTimers.size===0','Reopening full-screen cancels the quick-view reset');
    await frame('d.querySelector("[data-detail-action=close]").click()');await wait('!document.querySelector(".dbk-host-detail")','close integrated detail');console.log('PASS Map host opens, receives readiness, preserves state and closes');
  }
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS No uncaught browser exceptions');
}
main().catch(async e=>{console.error(e);process.exitCode=1;if(socket?.readyState===1)await shot('failure');}).finally(async()=>{if(socket?.readyState===1)await cdp('Browser.close').catch(()=>{});socket?.close();server?.close();await disposeBrowser(browser,profile);});
