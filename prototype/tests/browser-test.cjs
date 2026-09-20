/* End-to-end checks with installed Chrome and the DevTools protocol. No npm dependencies. */
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const assert = require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const chrome=process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const profile=path.join(root,'.browser-profile',String(Date.now()));
const preview=path.join(root,'preview');
fs.mkdirSync(profile,{recursive:true});fs.mkdirSync(preview,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const popupVisible="Boolean(document.querySelector('.detail-panel') && !document.querySelector('.detail-panel').hidden && getComputedStyle(document.querySelector('.detail-panel')).display !== 'none')";
const worldTransform="getComputedStyle(document.querySelector('.map-world')).transform";
const worldScale=`new DOMMatrixReadOnly(${worldTransform}).a`;
let proc,ws,seq=0;const pending=new Map();const errors=[];

async function run(){
  proc=spawn(chrome,['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-extensions','--disable-sync','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  let launchError;proc.on('error',e=>launchError=e);
  const portfile=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<100&&!fs.existsSync(portfile);i++){if(launchError)throw launchError;await sleep(100);}
  assert.ok(fs.existsSync(portfile),'Chrome starts and exposes DevTools');
  const port=fs.readFileSync(portfile,'utf8').split('\n')[0];
  const targets=await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page=targets.find(t=>t.type==='page');
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',e=>{const msg=JSON.parse(e.data);if(msg.id){const task=pending.get(msg.id);if(task){pending.delete(msg.id);clearTimeout(task.timer);msg.error?task.reject(new Error(JSON.stringify(msg.error))):task.resolve(msg.result);}}else if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text+': '+(msg.params.exceptionDetails.exception?.description||''));});
  await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Network.enable');
  // Map imagery and story content must load without a network connection.
  await cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await viewport(1440,960);
  await cdp('Page.navigate',{url:pathToFileURL(path.join(root,'index.html')).href});
  await stage('overview');await ready();
  assert.equal(await evaluate('[...document.images].filter(img=>!img.complete || !img.naturalWidth).length'),0,'map assets load offline');
  assert.equal(await evaluate("Boolean(document.querySelector('.welcome, [data-action=start]'))"),false,'opens directly on the map');
  const placeCount=await evaluate("document.querySelectorAll('.marker').length");
  assert.ok(placeCount>=6,'all destinations are available');
  await evaluate("window.mapNodes={world:document.querySelector('.map-world'),canvas:document.querySelector('.map-canvas'),marker:document.querySelector('.marker[data-id=ao]'),tile:document.querySelector('.place-tile[data-id=ao]')}");
  await shot('01-fly-overview');
  await click('[data-action=filter][data-id=nature]');
  assert.equal(await evaluate("document.querySelectorAll('.marker').length"),placeCount,'filter preserves marker DOM');
  const natureCount=await evaluate("document.querySelectorAll('.marker:not([hidden])').length");
  assert.ok(natureCount>0 && natureCount<placeCount,'nature filter hides other markers');
  assert.equal(await evaluate("document.querySelectorAll('.place-tile:not([hidden])').length"),natureCount,'filter also updates the destination list');
  assert.ok(await evaluate("!document.querySelector('.marker[data-id=ao]').hidden && document.querySelector('.marker[data-id=ang]').hidden"),'nature includes the pond and excludes the temple');
  await sameMap();await click('[data-action=filter][data-id=all]');
  assert.equal(await evaluate("document.querySelectorAll('.marker:not([hidden])').length"),placeCount);
  await shot('02-ban-do');

  // Observe the real stages and CSS transforms, including repeated input.
  await evaluate(`window.flightStages=[]; window.flightObserver=new MutationObserver(()=>{
    const stage=document.querySelector('.map-screen')?.dataset.stage;
    if(stage && window.flightStages.at(-1)?.stage!==stage)window.flightStages.push({stage,time:performance.now(),popup:${popupVisible}});
  });window.flightObserver.observe(document.querySelector('.map-screen'),{attributes:true,attributeFilter:['data-stage']});`);
  await click('.place-tile[data-id=ao]');await stage('selected');
  assert.equal(await evaluate(popupVisible),false,'selection does not open the popup');
  await sleep(80);await click('.marker[data-id=ao]');await stage('preparing');
  assert.equal(await evaluate(popupVisible),false,'preparation does not open the popup');
  await stage('flying');await sleep(150);
  const intermediateScale=await evaluate(worldScale);
  assert.ok(intermediateScale>1.01,'the map smoothly scales during flight');
  assert.equal(await evaluate(popupVisible),false,'popup stays hidden while moving');
  await click('.marker[data-id=ao]');await sameMap();await stage('focused');
  assert.equal(await evaluate(popupVisible),false,'camera settles before the popup appears');
  const focusedScale=await evaluate(worldScale);
  assert.ok(focusedScale>2,'camera zooms into the selected place');
  assert.ok(intermediateScale<focusedScale-.01,'flight includes an intermediate transform');
  const target=await evaluate(`(()=>{const c=document.querySelector('.map-canvas').getBoundingClientRect();const marker=document.querySelector('.marker[data-id=ao]');const p=(marker.querySelector('.pin-dot')||marker).getBoundingClientRect();return {dx:Math.abs((p.left+p.right-c.left-c.right)/2),dy:Math.abs((p.top+p.bottom-c.top-c.bottom)/2),width:c.width,height:c.height}})()`);
  assert.ok(target.dx<target.width*.15 && target.dy<target.height*.15,`selected target is near the viewport center: ${JSON.stringify(target)}`);
  await stage('popup');await waitFor(popupVisible);
  const stages=await evaluate('window.flightObserver.disconnect();window.flightStages');
  assert.deepEqual(stages.map(x=>x.stage),['selected','preparing','flying','focused','popup'],'duplicate input does not restart the flight');
  assert.ok(stages.slice(0,-1).every(x=>!x.popup),'no popup appears before arrival');
  assert.ok(stages[1].time-stages[0].time>=220,'selection highlight remains visible');
  assert.ok(stages[2].time-stages[1].time>=130,'preparation has a deliberate pause');
  assert.ok(stages[3].time-stages[2].time>=950,'flight is animated, not an instant transform');
  assert.ok(stages[4].time-stages[3].time>=200,'arrival has a pause before the popup');
  await shot('03-ao-ba-om');await sameMap();
  const focusedTransform=await evaluate(worldTransform);
  await click('[data-action=close-place]');await stage('focused');await waitFor(`!${popupVisible}`);
  assert.equal(await evaluate(worldTransform),focusedTransform,'closing the popup preserves the camera');
  await shot('03-fly-focused');
  await click('.marker[data-id=ao]');await stage('popup');await waitFor(popupVisible);
  assert.equal(await evaluate(worldTransform),focusedTransform,'selected marker reopens the popup without another flight');

  await click('[data-action=intro]');await click('.dock [data-action=back]');await stage('popup');await waitFor(popupVisible);
  assert.equal(await evaluate(worldTransform),focusedTransform,'Back from the story introduction restores the focused map');
  assert.ok(await evaluate("document.activeElement === document.querySelector('#place-title')"),'Back from the story returns keyboard focus to the restored popup title');
  await click('[data-action=panorama]');await click('[data-action=hotspot][data-id=roots]');
  assert.ok(await evaluate('document.querySelector("dialog").open'));
  await click('dialog [data-action=close-dialog]');
  await click('.panorama-top [data-action=back]');await stage('popup');await waitFor(popupVisible);
  assert.equal(await evaluate(worldTransform),focusedTransform,'Back from panorama restores the focused map');
  await click('[data-action=intro]');await click('[data-action=choose]');await shot('04-chon-cau-chuyen');
  await click('[data-action=branch][data-id=legend]');await click('[data-action=next]');
  assert.ok(await evaluate("document.querySelector('[data-action=reveal]') !== null"));
  await click('.story-content [data-action=reveal]');
  assert.ok(await evaluate("document.querySelector('[data-action=reveal]') === null"));
  await shot('05-cau-chuyen');
  await click('[data-action=next]');await click('[data-action=panorama]');
  const panBefore=await evaluate("document.querySelector('.panorama-world').style.getPropertyValue('--pan')");
  await click('[data-action=pan-right]');
  assert.notEqual(await evaluate("document.querySelector('.panorama-world').style.getPropertyValue('--pan')"),panBefore);
  await click('.panorama-top [data-action=back]');
  assert.ok(await evaluate("document.querySelector('.story-progress small').textContent.includes('03')"));
  await click('[data-action=next]');await click('[data-action=answer][data-id="1"]');
  assert.ok(await evaluate("document.querySelector('.feedback.wrong') !== null"));
  await click('[data-action=finish]');
  assert.ok(await evaluate("document.querySelector('.complete-stats').textContent.includes('1')"));
  await click('[data-action=choose]');await click('[data-action=branch][data-id=culture]');
  await click('[data-action=next]');await click('[data-action=next]');await click('[data-action=next]');
  await click('[data-action=answer][data-id="1"]');
  assert.ok(await evaluate("document.querySelector('.quiz-option.correct[aria-pressed=true]') !== null"));
  await click('[data-action=finish]');
  assert.ok(await evaluate("document.querySelector('.complete-stats').textContent.includes('2')"));

  await click('.dock [data-action=map]');await stage('overview');await openPlace();
  await key('Escape');await stage('focused');await waitFor(`!${popupVisible}`);
  const returnStart=await evaluate(worldScale);
  await key('Escape');await stage('returning');await sleep(150);
  assert.ok(await evaluate(worldScale)<returnStart,'Escape animates the camera back');
  await stage('overview');
  assert.ok(Math.abs(await evaluate(worldScale)-1)<.001,'overview restores the original transform');
  await openPlace();await click('.dock [data-action=back]');await stage('returning');await stage('overview');
  await openPlace();await click('.dock [data-action=map]');await stage('returning');await stage('overview');

  // Cancelling and ending a session invalidate every queued stage callback.
  await click('.place-tile[data-id=ao]');await stage('flying');await sleep(150);
  await click('.dock [data-action=map]');await stage('overview');await sleep(2200);
  assert.equal(await evaluate(popupVisible),false,'cancelled flight cannot resurrect its popup');
  assert.equal(await evaluate("document.querySelector('.map-screen').dataset.stage"),'overview');
  await click('.place-tile[data-id=ao]');await stage('selected');
  await click('[data-action=end]');await click('[data-action=confirm-end]');await stage('overview');await sleep(2200);
  assert.equal(await evaluate(popupVisible),false,'reset cancels queued flight callbacks');
  assert.equal(await evaluate("document.querySelector('.map-screen').dataset.stage"),'overview');

  // Changing the motion preference must preserve a destination chosen during return.
  await openPlace();await click('.place-tile[data-id=ang]');await stage('returning');
  await click('[data-action=access]');
  assert.equal(await evaluate("document.querySelector('.map-screen').dataset.stage"),'returning','motion preference is changed while the automatic return is still running');
  await click('[data-action=pref][data-id=reduced]');await click('dialog [data-action=close-dialog]');
  await stage('popup');await waitFor(popupVisible);
  assert.equal(await evaluate("document.querySelector('#place-title').textContent"),'Chùa Âng','reducing motion during return still opens the requested next destination');
  await sleep(1200);
  assert.equal(await evaluate("document.querySelector('#place-title')?.textContent"),'Chùa Âng','the cancelled return callback cannot replace the requested popup');
  await click('[data-action=end]');await click('[data-action=confirm-end]');await stage('overview');

  await click('[data-action=access]');await click('[data-action=font][data-id=large]');
  await click('[data-action=pref][data-id=contrast]');await click('[data-action=pref][data-id=reduced]');
  assert.ok(await evaluate("document.body.classList.contains('large-text') && document.body.classList.contains('high-contrast') && document.body.classList.contains('reduced-motion')"));
  await click('dialog [data-action=close-dialog]');await click('.place-tile[data-id=ao]');
  assert.equal(await evaluate("document.querySelector('.map-screen').dataset.stage"),'popup','reduced motion skips timed flight stages');
  assert.ok(await evaluate(popupVisible));
  await click('.dock [data-action=map]');
  assert.equal(await evaluate("document.querySelector('.map-screen').dataset.stage"),'overview','reduced motion also skips the return animation');
  await click('[data-action=end]');await click('[data-action=confirm-end]');await stage('overview');
  assert.ok(await evaluate("!document.body.classList.contains('large-text') && !document.body.classList.contains('high-contrast') && !document.body.classList.contains('reduced-motion')"),'ending a session resets preferences');
  await click('[data-action=journey]');
  assert.equal(await evaluate("document.querySelectorAll('dialog .setting-row').length"),2);
  assert.equal(await evaluate("document.querySelectorAll('dialog .setting-row .tag .icon').length"),0,'ending a session clears completed stories');
  await click('dialog [data-action=close-dialog]');

  // Time advances on unchanged content; opening overlays does not extend the deadline.
  await evaluate('window.contentStart=Date.now()');
  await openPlace();
  await evaluate('window.realNow=Date.now; window.testNow=window.contentStart+299000; Date.now=()=>window.testNow;');
  await click('[data-action=help]');assert.ok(await evaluate('document.querySelector("dialog").open'));
  await evaluate('window.testNow=window.contentStart+301000');await sleep(400);await stage('overview');
  assert.equal(await evaluate('document.querySelector("dialog").open'),false,'five-minute expiry closes overlays and returns to overview');
  await evaluate('Date.now=window.realNow');

  await viewport(1920,1080);await shot('06-ban-do-1920');await mapFits('1920');
  await viewport(1366,768);await shot('07-ban-do-1366');await mapFits('1366');await markersFit('1366');
  await openPlace();await shot('09-chi-tiet-1366');
  assert.ok(await evaluate("document.querySelector('.detail-content .actions').getBoundingClientRect().bottom <= document.querySelector('.detail-panel').getBoundingClientRect().bottom"),'1366: detail action is reachable');
  await click('.dock [data-action=map]');await stage('overview');
  await viewport(390,844);await shot('08-xem-tren-dien-thoai');
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'),false,'mobile map has no horizontal overflow');
  await markersFit('mobile');
  await openPlace();await shot('10-popup-dien-thoai');
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'),false,'mobile popup has no horizontal overflow');
  await pointerClick('.map-popup-host [data-action=intro]');
  assert.ok(await evaluate("Boolean(document.querySelector('.story-screen [data-action=choose]'))"),'mobile popup story action works after scrolling into view and an actual pointer click');
  await click('[data-action=choose]');
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'),false,'mobile story has no horizontal overflow');
  await ready();
  assert.equal(await evaluate('[...document.images].filter(img=>!img.complete || !img.naturalWidth).length'),0,'images load offline');
  assert.deepEqual(errors,[],'no browser runtime errors');
  console.log('PASS: offline map entry, persistent DOM/filter, fly stages and camera, delayed popup, repeated input, close/reopen, animated return, cancellation/reset, Escape, reduced motion, story/panorama restore, both stories, reveal, quiz, preferences, five-minute deadline, 1920/1366/mobile layouts.');
  console.log('Screenshots: '+preview);
}
function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},15000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));});}
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
async function viewport(width,height){await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});}
async function waitFor(expression){for(let i=0;i<200;i++){if(await evaluate(`Boolean(${expression})`))return;await sleep(50);}throw new Error('Not found: '+expression);}
async function stage(name){await waitFor(`document.querySelector('.map-screen')?.dataset.stage === ${JSON.stringify(name)}`);}
async function ready(){await evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))');await sleep(550);}
async function click(selector){await waitFor(`document.querySelector(${JSON.stringify(selector)})`);await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);await sleep(60);}
async function pointerClick(selector){
  await waitFor(`document.querySelector(${JSON.stringify(selector)})`);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',inline:'nearest',behavior:'instant'})`);await sleep(80);
  const point=await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)}),r=el.getBoundingClientRect(),panel=el.closest('.detail-panel')?.getBoundingClientRect(),dock=document.querySelector('.dock')?.getBoundingClientRect();const left=Math.max(0,r.left,panel?.left||0),right=Math.min(innerWidth,r.right,panel?.right||innerWidth),top=Math.max(0,r.top,panel?.top||0),bottom=Math.min(innerHeight,r.bottom,panel?.bottom||innerHeight,dock?.top||innerHeight);const x=(left+right)/2,y=(top+bottom)/2;return {x,y,visible:right>left&&bottom>top,hit:el.contains(document.elementFromPoint(x,y))};})()`);
  assert.ok(point.visible&&point.hit,`pointer target is visible and unobscured: ${selector} ${JSON.stringify(point)}`);
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x,y:point.y,button:'left',clickCount:1});await sleep(60);
}
async function key(key){await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key,code:key,windowsVirtualKeyCode:27,nativeVirtualKeyCode:27});await sleep(60);}
async function openPlace(){await click('.place-tile[data-id=ao]');await stage('popup');await waitFor(popupVisible);await sleep(500);}
async function sameMap(){assert.ok(await evaluate("window.mapNodes.world===document.querySelector('.map-world') && window.mapNodes.canvas===document.querySelector('.map-canvas') && window.mapNodes.marker===document.querySelector('.marker[data-id=ao]') && window.mapNodes.tile===document.querySelector('.place-tile[data-id=ao]')"),'filtering and flight preserve the map, canvas, marker and tile elements');}
async function mapFits(label){assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'),false,`${label}: map has no horizontal overflow`);assert.ok(await evaluate("document.querySelector('.places-strip').getBoundingClientRect().bottom <= document.querySelector('.dock').getBoundingClientRect().top"),`${label}: location controls above dock`);}
async function markersFit(label){
  const geometry=await evaluate(`(()=>{const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};return {stage:document.querySelector('.map-screen').dataset.stage,canvas:rect(document.querySelector('.map-canvas')),parts:[...document.querySelectorAll('.marker:not([hidden])')].flatMap(marker=>['.marker-content','.marker-label'].map(selector=>({id:marker.dataset.id,part:selector,...rect(marker.querySelector(selector))})))}})()`);
  assert.equal(geometry.stage,'overview',`${label}: marker geometry is checked in overview`);
  const c=geometry.canvas;
  for(const part of geometry.parts)assert.ok(part.left>=c.left-2&&part.right<=c.right+2&&part.top>=c.top-2&&part.bottom<=c.bottom+2,`${label}: ${part.id} ${part.part} stays inside the map: ${JSON.stringify(part)}`);
  for(let i=0;i<geometry.parts.length;i++)for(let j=i+1;j<geometry.parts.length;j++){
    const a=geometry.parts[i],b=geometry.parts[j];if(a.id===b.id)continue;
    const overlapX=Math.min(a.right,b.right)-Math.max(a.left,b.left),overlapY=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
    assert.ok(overlapX<=2||overlapY<=2,`${label}: ${a.id} ${a.part} and ${b.id} ${b.part} do not overlap: ${overlapX.toFixed(1)} x ${overlapY.toFixed(1)}px`);
  }
}
async function shot(name){await ready();const r=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(preview,name+'.png'),Buffer.from(r.data,'base64'));}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(ws?.readyState===1){try{await cdp('Browser.close');}catch{}ws.close();}if(proc)proc.kill();});
