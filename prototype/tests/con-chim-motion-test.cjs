/* Exercise full-screen stories, real gestures, resizing, and modal accessibility. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const profile = path.join(root, '.browser-profile', 'motion-' + Date.now());
const dist = path.join(root, 'dist');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
let slowPhoto = '', delayedImages = [];
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(dist, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  const stream = () => { if (!res.destroyed) fs.createReadStream(file).pipe(res); };
  if (slowPhoto && name.includes(slowPhoto)) delayedImages.push(stream); else stream();
});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map(), errors = [];
let chrome, socket, nextId = 0;
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 30000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function page(code) {
  const result = await cdp('Runtime.evaluate', { expression:`(async()=>{const d=document.querySelector('.cc-zip-detail iframe')?.contentDocument||document;const w=d.defaultView;${code}})()`, awaitPromise:true, returnByValue:true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function wait(expression, label, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) { if (await page('return Boolean(' + expression + ')')) return; await sleep(100); }
  throw Error('Timed out: ' + label);
}
async function check(expression, label) { assert.ok(await page('return Boolean(' + expression + ')'), label); console.log('PASS ' + label); }
const viewport = (width, height) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor:1, mobile:false });
const media = (reduce = false, dark = false) => cdp('Emulation.setEmulatedMedia', { features:[{ name:'prefers-reduced-motion', value:reduce?'reduce':'no-preference' }, { name:'prefers-color-scheme', value:dark?'dark':'light' }] });
async function shot(name) {
  const { data } = await cdp('Page.captureScreenshot', { format:'png' });
  fs.writeFileSync(path.join(root, 'preview', 'con-chim-motion-' + name + '.png'), Buffer.from(data, 'base64'));
}

async function main() {
  fs.mkdirSync(profile, { recursive:true });
  fs.mkdirSync(path.join(root, 'preview'), { recursive:true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.TEST_BASE_URL || `http://127.0.0.1:${server.address().port}`;
  chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'], { windowsHide:true, stdio:'ignore' });
  const portfile = path.join(profile, 'DevToolsActivePort');
  for (let i=0; i<100 && !fs.existsSync(portfile); i++) await sleep(100);
  assert.ok(fs.existsSync(portfile), 'Chrome started');
  const port = fs.readFileSync(portfile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(item => item.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once:true }));
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id); if (!request) return;
      pending.delete(message.id); clearTimeout(request.timer);
      message.error ? request.reject(Error(JSON.stringify(message.error))) : request.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  });
  await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
  await viewport(1440,960); await media();
  await cdp('Page.navigate', { url:base+'/con-chim.html' });
  await wait('d.querySelector(".cc-page")?.dataset.motionReady === "true"','motion controller');
  await check('d.querySelector(".cc-hero-title-line .cc-motion-word").getAnimations().some(a=>a.playState==="running")','opening title animates actual words');
  await check('d.querySelector(".cc-hero-arch").getAnimations().some(a=>a.playState==="running")','hero photograph opens through an animated mask');
  await shot('opening');
  await sleep(1650);
  await check('d.querySelector(".cc-screen-viewport").getAnimations({subtree:true}).filter(a=>a.playState==="running" && a.timeline instanceof w.DocumentTimeline).length===0','finite opening releases every active animation');
  await check('d.querySelector("#cc-hero-title .cc-sr-only").textContent === "Cồn Chim" && w.getComputedStyle(d.querySelector(".cc-hero-title-line .cc-motion-word")).opacity==="1"','accessible title is readable after entrance');
  await shot('desktop-intro');
  await wait('d.querySelector(".cc-hero-arch .cc-sequence-current").complete && d.querySelector(".cc-hero-arch .cc-sequence-current").naturalWidth>0','real hero photograph loads');
  const stage=await page('const r=d.querySelector("#intro").getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}');
  const rest=await page('return w.getComputedStyle(d.querySelector(".cc-hero-arch .cc-image-sequence")).translate');
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:stage.x+stage.width*.7,y:stage.y+stage.height*.35});await sleep(450);
  await check(`w.getComputedStyle(d.querySelector('.cc-hero-arch .cc-image-sequence')).translate!==${JSON.stringify(rest)}`,'hero photograph responds with subtle pointer depth');
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:15,y:20});await sleep(1000);
  await check('Math.abs(parseFloat(d.querySelector("#intro").style.getPropertyValue("--cc-depth-x"))||0)<.1','pointer depth settles at rest');
  const go = async id => {
    await page(`d.dispatchEvent(new w.CustomEvent('cc:screen',{detail:${JSON.stringify(id)}}));`);
    await wait(`d.querySelector('.cc-screen-viewport').dataset.activeScreen===${JSON.stringify(id)}`,'navigate '+id);
  };
  const contained = async () => check('d.documentElement.scrollWidth<=w.innerWidth && w.scrollY===0','page fits viewport without horizontal overflow');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:1400,y:300,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:1400,y:300,button:'left',clickCount:1});
  const before = await page('return d.querySelector(".cc-hero-arch .cc-sequence-current").alt');
  await wait(`d.querySelector('.cc-hero-arch .cc-sequence-current').alt!==${JSON.stringify(before)}`,'ambient scene advances',9000);
  await check('!!d.querySelector(".cc-scene-playback[aria-pressed=true]")','ambient scenery has a pause control');
  await page('d.querySelector(".cc-scene-tabs button:first-child").click()');
  await check('!!d.querySelector(".cc-scene-playback[aria-pressed=false]")','manual scene selection pauses automatic changes');

  await page(`d.dispatchEvent(new w.CustomEvent('cc:screen',{detail:'timeline'}));d.dispatchEvent(new w.CustomEvent('cc:screen',{detail:'gallery'}));d.dispatchEvent(new w.CustomEvent('cc:screen',{detail:'experiences'}));`);
  await wait('d.querySelector(".cc-screen-viewport").dataset.activeScreen === "experiences"','latest navigation wins');
  await sleep(1400);
  await check('d.querySelector(".cc-screen-viewport").getAnimations({subtree:true}).filter(a=>a.playState==="running" && a.timeline instanceof w.DocumentTimeline).length===0','rapid navigation leaves no orphaned animations');
  await contained();
  await go('timeline'); await sleep(90);
  await check('d.querySelector(".cc-history-window").getAnimations({subtree:true}).some(a=>a.playState==="running")','timeline brings in photo and text');
  await page('d.documentElement.classList.add("reduce-motion")'); await sleep(120);
  await check('d.querySelector(".cc-screen-viewport").getAnimations({subtree:true}).filter(a=>a.playState==="running").length===0','host reduced-motion setting cancels in-flight effects');
  await page('d.documentElement.classList.remove("reduce-motion")');
  await go('gallery'); await sleep(1300);
  await page('d.querySelector(".cc-gallery-arrows button:last-child").click()');
  await wait('d.querySelector(".cc-gallery-spotlight .cc-sequence-current").alt === "Ngồi bên con nước"','gallery next photograph');
  await check('d.querySelector(".cc-gallery-spotlight .cc-sequence-current").getAnimations().some(a=>a.playState==="running")','photo transition runs on a decoded image');
  await sleep(950);
  await page('d.querySelector(".cc-gallery-spotlight").focus();d.querySelector(".cc-gallery-spotlight").click()');
  await wait('d.querySelector("[role=dialog]")','lightbox');
  await check('d.querySelector(".cc-modal-window").getAnimations().some(a=>a.effect.getKeyframes()[0].transform.includes("translate("))','lightbox expands from the selected photograph');
  await sleep(700);
  await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true,cancelable:true}))');
  await wait('d.querySelector(".cc-lightbox .cc-sequence-current").alt === "Bữa cơm người quê"','keyboard changes lightbox image');
  await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true,cancelable:true}))');
  await sleep(60);
  await check('!!d.querySelector("[data-detail-modal][data-closing]")','dialog stays mounted during closing animation');
  await wait('!d.querySelector("[role=dialog]")','animated dialog removal');
  await check('d.activeElement.matches(".cc-gallery-spotlight")','closing animation preserves focus restoration');
  const thumbnail=await page('const b=d.querySelector(".cc-gallery-thumbnails button"),r=b.getBoundingClientRect();b.focus();b.click();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await wait('d.querySelector("[role=dialog]")','thumbnail lightbox');
  const opening=await page('return d.querySelector(".cc-modal-window").getAnimations()[0].effect.getKeyframes()[0].transform');
  await sleep(750);
  const target=await page('const r=d.querySelector(".cc-modal-window").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  const offsets=opening.match(/translate\(\s*([-.\d]+)px,\s*([-.\d]+)px\s*\)/);
  assert.ok(offsets && Math.abs(target.x+Number(offsets[1])-thumbnail.x)<2 && Math.abs(target.y+Number(offsets[2])-thumbnail.y)<2,'thumbnail expansion begins at the clicked thumbnail center');
  console.log('PASS thumbnail expansion begins at the clicked thumbnail center');
  await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true,cancelable:true}))');
  await wait('!d.querySelector("[role=dialog]")','close thumbnail lightbox');
  await check('d.activeElement.matches(".cc-gallery-thumbnails button")','thumbnail lightbox returns focus to its source');
  await sleep(1000); await shot('desktop-gallery');

  if (!process.env.TEST_BASE_URL) {
    slowPhoto='islet-meal-';
    await cdp('Network.setCacheDisabled',{cacheDisabled:true}); await cdp('Network.clearBrowserCache');
    await cdp('Page.navigate',{url:base+'/con-chim.html?motion-load-check=1#gallery'});
    await wait('d.querySelector(".cc-screen-viewport")?.dataset.activeScreen==="gallery"','fresh gallery');
    await sleep(1300);
    await page('d.querySelector(".cc-gallery-arrows button:last-child").click();d.querySelector(".cc-gallery-arrows button:last-child").click()');
    await wait('d.querySelector(".cc-gallery-spotlight .cc-image-sequence").getAttribute("aria-busy")==="true"','slow image loading');
    await sleep(300);
    await check('d.querySelector(".cc-gallery-spotlight .cc-sequence-current").alt === "Một vòng cồn, một trời xanh" && d.querySelector(".cc-gallery-photo-copy h3 .cc-sr-only").textContent === "Một vòng cồn, một trời xanh"','slow decode keeps the previous image and matching caption');
    slowPhoto=''; delayedImages.splice(0).forEach(release=>release());
    await wait('d.querySelector(".cc-gallery-spotlight .cc-sequence-current").alt === "Bữa cơm người quê"','release slow photograph');
    await page('d.querySelector(".cc-gallery-arrows button:last-child").click();d.querySelector(".cc-gallery-arrows button:last-child").click();d.querySelector(".cc-gallery-arrows button:last-child").click()');
    await wait('d.querySelector(".cc-gallery-spotlight .cc-sequence-current").alt === "Mùa xanh trên cồn"','rapid photo input resolves to latest selection');
    await sleep(1000);
    await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  }
  await viewport(390,844); await sleep(650); await go('gallery'); await sleep(1200);
  const oldPhoto = await page('return d.querySelector(".cc-gallery-spotlight .cc-sequence-current").alt');
  const box = await page('const r=d.querySelector(".cc-gallery-spotlight").getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}');
  const x = Math.round(box.x + box.width*.8), y = Math.round(box.y + box.height*.5);
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]}); await sleep(60);
  await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-65,y}]}); await sleep(60);
  await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-145,y}]}); await sleep(60);
  await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait(`d.querySelector('.cc-gallery-spotlight .cc-sequence-current').alt!==${JSON.stringify(oldPhoto)}`,'mobile swipe changes photo');
  await check('!d.querySelector("[role=dialog]") && d.querySelector(".cc-screen-viewport").dataset.activeScreen==="gallery"','horizontal swipe avoids accidental lightbox or vertical navigation');
  await sleep(1000); await contained(); await shot('mobile-gallery');
  await viewport(320,640); await sleep(400); await go('intro'); await sleep(1300); await contained(); await shot('mobile-intro');
  await check('d.querySelector(".cc-scene-tabs").getBoundingClientRect().right<=w.innerWidth','scene tabs fit a narrow phone');
  await check('d.querySelector(".cc-brand").getBoundingClientRect().right<d.querySelector(".cc-header-actions").getBoundingClientRect().left && d.querySelector(".cc-header-actions").getBoundingClientRect().right<=w.innerWidth','mobile header controls have separate visible targets');
  await page('d.querySelector(".cc-menu-button").click()');
  await check('d.querySelector("#cc-mobile-nav").textContent.includes("âm thanh thư giãn")','mobile menu keeps the sound control available');
  await page('d.querySelector(".cc-menu-button").click()');
  await media(true); await sleep(200); await go('timeline');
  await check('d.querySelector(".cc-screen-viewport").getAnimations({subtree:true}).filter(a=>a.playState==="running").length===0 && !d.querySelector(".cc-scene-playback")','OS reduced motion disables choreography and autoplay');
  await media(false,true); await viewport(1440,960); await go('heritage-iris'); await sleep(1400); await contained(); await shot('dark-iris');
  assert.deepEqual(errors, [], 'no browser exceptions'); console.log('PASS no browser exceptions');
}
main().catch(async error => {
  console.error(error);
  try { console.error(await page('return {active:d.querySelector(".cc-screen-viewport")?.dataset.activeScreen,photo:d.querySelector(".cc-gallery-spotlight .cc-sequence-current")?.alt};')); await shot('failure'); } catch {}
  process.exitCode=1;
}).finally(async () => { delayedImages.splice(0).forEach(release=>release()); if(socket?.readyState===1) await cdp('Browser.close').catch(()=>{}); socket?.close(); server.close(); await disposeBrowser(chrome, profile); });
