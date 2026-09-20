/* End-to-end checks with installed Chrome and the DevTools protocol. No npm dependencies. */
const {spawn} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const assert = require('node:assert/strict');
const root='F:/TTNM-HCI/prototype';
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
  const frameDir=path.join(root,'..','.reference-assets','fly-capture');fs.mkdirSync(frameDir,{recursive:true});
  const start=performance.now();let selected=false;
  for(let i=0;i<45;i++){
    const delay=start+i*100-performance.now();if(delay>0)await sleep(delay);
    if(i===8&&!selected){await evaluate("document.querySelector('.marker[data-id=ao]').click()");selected=true;}
    const frame=await cdp('Page.captureScreenshot',{format:'jpeg',quality:85,captureBeyondViewport:false});
    fs.writeFileSync(path.join(frameDir,String(i).padStart(3,'0')+'.jpg'),Buffer.from(frame.data,'base64'));
  }
  console.log('Captured fly sequence: '+frameDir);
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
