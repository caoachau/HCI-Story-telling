/* Exercise full-screen stories, real gestures, resizing, and modal accessibility. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const profile = path.join(root, '.browser-profile', 'timeline-' + Date.now());
const dist = path.join(root, 'dist');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.woff2':'font/woff2' };
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(dist, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
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
  await sleep(800);
  const { data } = await cdp('Page.captureScreenshot', { format:'png' });
  fs.writeFileSync(path.join(root, 'preview', 'con-chim-screens-' + name + '.png'), Buffer.from(data, 'base64'));
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
  await cdp('Runtime.enable'); await cdp('Page.enable');

  await viewport(1440,960); await media();
  await cdp('Page.navigate', { url:base+'/con-chim.html' });
  await wait('d.querySelector(".cc-screen-viewport")?.dataset.activeScreen === "intro"','screen navigator');
  await page('await d.fonts.ready'); await sleep(650);
  const settled = async () => {
    await wait('!d.querySelector(".cc-screen-viewport").dataset.scrolling','screen transition completes');
    let before = -1;
    for(let i=0;i<25;i++) {
      await sleep(100);
      const top=await page('return d.querySelector(".cc-screen-viewport").scrollTop');
      if(top===before) { await sleep(150); return; }
      before=top;
    }
  };
  const go = async id => {
    await page(`d.dispatchEvent(new w.CustomEvent('cc:screen',{detail:${JSON.stringify(id)}}));`);
    await sleep(150); await settled();
  };
  const wheel = async (delta = 120) => {
    await cdp('Input.dispatchMouseEvent', { type:'mouseWheel', x:1100, y:400, deltaX:0, deltaY:delta });
    await sleep(550); await settled();
  };
  const aligned = async id => {
    await check(`(()=>{const v=d.querySelector('.cc-screen-viewport').getBoundingClientRect(),s=d.getElementById(${JSON.stringify(id)}).getBoundingClientRect();return Math.abs(v.top-s.top)<2 && Math.abs(v.bottom-s.bottom)<2 && d.querySelector('.cc-screen-viewport').dataset.activeScreen===${JSON.stringify(id)};})()`,id+' fills exactly the content viewport');
    await check('w.scrollY===0 && d.documentElement.scrollWidth<=w.innerWidth','document stays contained');
  };
  await check('d.querySelector(".cc-header").offsetHeight<=54 && !d.querySelector(".cc-header").classList.contains("is-hidden")','compact header is visible initially');
  await go('overview');
  const fullHeight=await page('return d.querySelector(".cc-screen-viewport").clientHeight');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1100,y:400,deltaX:0,deltaY:10}); await sleep(350);
  await check('d.querySelector(".cc-header").classList.contains("is-hidden") && d.querySelector(".cc-header").inert && d.querySelector(".cc-header").getBoundingClientRect().bottom<=1','downward wheel hides the header completely');
  assert.equal(await page('return d.querySelector(".cc-screen-viewport").clientHeight'),fullHeight,'header visibility preserves screen boundaries');
  await aligned('overview'); await shot('header-hidden');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1100,y:400,deltaX:0,deltaY:-1}); await sleep(40);
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1100,y:400,deltaX:0,deltaY:-1}); await sleep(350);
  await check('!d.querySelector(".cc-header").classList.contains("is-hidden") && d.querySelector("#overview").dataset.step==="0"','a light upward wheel reveals the header without changing the story');
  await aligned('overview'); await shot('header-visible');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:1100,y:400,deltaX:0,deltaY:10}); await sleep(350);
  await page('d.querySelector(".cc-header-reveal").click()'); await sleep(350);
  await check('!d.querySelector(".cc-header").classList.contains("is-hidden") && d.activeElement.matches(".cc-brand")','reveal button restores navigation and keyboard focus');
  for(const id of ['intro','overview','timeline','gallery','experiences','heritage-iris','farewell']) {
    await go(id); await aligned(id); await shot('desktop-'+id);
  }
  await go('intro');
  await page(`w.screenFrames=[];let remaining=40;const sample=()=>{const root=d.querySelector('.cc-screen-viewport'),v=root.getBoundingClientRect();w.screenFrames.push([...root.children].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>v.top+2 && r.top<v.bottom-2;}).length);if(--remaining)w.requestAnimationFrame(sample);};w.requestAnimationFrame(sample);`);
  await wheel(); await aligned('overview');
  await check('w.screenFrames.length===40 && Math.max(...w.screenFrames)===1','every transition frame contains one complete section');
  for(let i=0;i<4;i++) {
    await check(`d.querySelector('#overview').dataset.step==='${i}' && [...d.querySelectorAll('.cc-chapter')].filter(el=>!el.hidden).length===1`,'overview story '+(i+1)+' shown alone');
    await wheel();
  }
  await aligned('timeline');
  for(let i=0;i<4;i++) {
    await check(`d.querySelector('#timeline').dataset.step==='${i}' && [...d.querySelectorAll('.cc-history-row')].filter(el=>!el.hidden).length===1`,'timeline milestone '+(i+1)+' shown alone');
    await check('Math.abs(d.querySelector(".cc-history-bar").getBoundingClientRect().top-d.querySelector(".cc-header").getBoundingClientRect().bottom)<2','timeline header remains at the top');
    await wheel();
  }
  await aligned('gallery'); await wheel(-120); await aligned('timeline');
  await check('d.querySelector("#timeline").dataset.step==="3"','backwards reading resumes at last milestone');
  await wheel(-120); await check('d.querySelector("#timeline").dataset.step==="2"','reverse gesture reads previous milestone');
  await page('d.querySelector(".cc-timeline-stations button:last-child").click()');
  await page('d.querySelector("#cc-history-award button").focus({preventScroll:true});d.querySelector("#cc-history-award button").click()');
  await wait('d.querySelector("[role=dialog]")','milestone details');
  await check('d.querySelector("[role=dialog]").textContent.includes("ASEAN")','milestone opens its own sourced story');
  const scrollBefore=await page('return d.querySelector(".cc-screen-viewport").scrollTop');
  await wheel();
  assert.equal(await page('return d.querySelector(".cc-screen-viewport").scrollTop'),scrollBefore,'modal locks the story viewport');
  await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');
  await wait('!d.querySelector("[role=dialog]")','close story');
  await check('d.activeElement.closest("#cc-history-award")','closing story restores keyboard focus');
  await viewport(1000,800); await sleep(650); await aligned('timeline');
  await page('d.querySelector(".cc-timeline-stations button:nth-child(2)").click()');
  await check('d.querySelector("#timeline").dataset.step==="1"','milestone jump remains correct after resize');
  await shot('tablet');
  await viewport(2545,1285); await sleep(650);
  for(const id of ['intro','overview','timeline','gallery','experiences','heritage-iris']) { await go(id); await aligned(id); await shot('wide-'+id); }
  for(const width of [390,320]) {
    await viewport(width,844); await sleep(650);
    for(const id of ['intro','overview','timeline','gallery','experiences','heritage-iris','farewell']) {
      await go(id); await aligned(id); await shot('mobile-'+width+'-'+id);
    }
    await go('timeline');
    await page('d.querySelector(".cc-timeline-stations button:first-child").click()');
    await wait('d.querySelector("#timeline").dataset.step==="0"','first touch milestone');
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
    await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width-30,y:680}]});
    await sleep(80);
    await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width-30,y:470}]});
    await sleep(80);
    await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await sleep(650);
    await check('d.querySelector("#timeline").dataset.step==="1"','touch advances exactly one milestone at '+width);
    await check('d.querySelector(".cc-header").classList.contains("is-hidden")','upward finger swipe hides the header at '+width);
    await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:width-30,y:450}]}); await sleep(80);
    await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:width-30,y:460}]}); await sleep(80);
    await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]}); await sleep(350);
    await check('!d.querySelector(".cc-header").classList.contains("is-hidden") && d.querySelector(".cc-header").offsetHeight<=48 && d.querySelector("#timeline").dataset.step==="1"','light reverse touch restores compact mobile navigation without changing content');
    await go('experiences');
    await check('[...d.querySelectorAll(".cc-experience-card")].filter(el=>!el.hidden).length===1','mobile experiences show one complete choice');
    await page('d.querySelector(".cc-experience-tabs button:first-child").click()');
    for(let i=1;i<=3;i++) {
      await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"PageDown",bubbles:true,cancelable:true}))');
      await sleep(600); await settled();
      if(i<3) await check(`d.querySelectorAll('.cc-experience-tabs button')[${i}].getAttribute('aria-pressed')==='true' && d.querySelector('.cc-screen-viewport').dataset.activeScreen==='experiences'`,'read mobile experience '+(i+1)+' before leaving');
      else await aligned('heritage-iris');
    }
  }
  await viewport(390,540); await sleep(650); await go('overview');
  await page('d.querySelector(".cc-chapter-tabs button:first-child").click()'); await sleep(150);
  await check('d.querySelector(".cc-chapters").scrollHeight>d.querySelector(".cc-chapters").clientHeight','short viewport keeps long copy readable inside the section');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:350,y:490,deltaX:0,deltaY:80}); await sleep(350);
  await check('d.querySelector("#overview").dataset.step==="0" && d.querySelector(".cc-chapters").scrollTop>0','scrolling over the image finishes long text before changing the chapter');
  await page('const reader=d.querySelector(".cc-chapters");reader.scrollTop=reader.scrollHeight'); await sleep(200);
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:350,y:490,deltaX:0,deltaY:100}); await sleep(600);
  await check('d.querySelector("#overview").dataset.step==="1"','after reading the text the next gesture advances the chapter');
  await aligned('overview'); await shot('short-overview');
  await viewport(1440,650); await sleep(650); await go('gallery'); await aligned('gallery'); await shot('short-gallery');
  await viewport(1440,960); await media(true); await sleep(650); await go('timeline');
  await check('w.getComputedStyle(d.querySelector(".cc-history-row:not([hidden])")).animationName==="none"','OS reduced motion removes story animation');
  await check('w.getComputedStyle(d.querySelector(".cc-header")).transitionDuration==="0s"','reduced motion also disables the header slide');
  await page('d.documentElement.classList.add("reduce-motion")'); await media(); await sleep(300);
  await check('w.getComputedStyle(d.querySelector(".cc-history-row:not([hidden])")).animationName==="none"','host preference removes animation dynamically');
  await page('d.documentElement.classList.remove("reduce-motion")'); await media(false,true); await shot('dark');
  await go('intro');
  await page('d.dispatchEvent(new w.KeyboardEvent("keydown",{key:"PageDown",bubbles:true,cancelable:true}))'); await sleep(750);
  await aligned('overview');
  await check('d.activeElement.id==="overview"','keyboard progression moves focus into the new screen');
  await viewport(390,640);
  await cdp('Emulation.setScriptExecutionDisabled', { value:true });
  await cdp('Page.navigate', { url:base+'/con-chim.html' });
  await wait('d.querySelectorAll(".cc-history-fallback li").length===4','no JavaScript fallback');
  await page('d.querySelector(".cc-history-fallback li:last-child").scrollIntoView({behavior:"instant"})');
  await check('w.getComputedStyle(d.body).overflowY==="auto" && d.querySelector(".cc-history-fallback li:last-child").getBoundingClientRect().bottom<=w.innerHeight+2','all fallback milestones remain readable without JavaScript');
  await cdp('Emulation.setScriptExecutionDisabled', { value:false }); await media();
  await viewport(1440,960);
  await cdp('Page.navigate', { url:base+'/' });
  await wait('d.querySelector(".landmark-carousel-card[data-site-id=con-chim]")','map application');
  await page('d.querySelector(".landmark-carousel-card[data-site-id=con-chim]").click()');
  await wait('d.querySelector(".cc-screen-viewport")','embedded detail');
  await wait('d.querySelector(".cc-host-controls")','combined header controls');
  await check('Math.abs(document.querySelector(".cc-zip-detail iframe").getBoundingClientRect().top-document.querySelector(".cc-zip-detail").getBoundingClientRect().top)<2','one header leaves no extra host toolbar');
  await page(`d.querySelector('[aria-label="Xem chi tiết toàn màn hình"]').click()`);
  await wait('d.querySelector(".cc-screen-viewport")','expanded detail');
  await sleep(650); await go('timeline'); await aligned('timeline'); await shot('integrated');
  await check('document.defaultView.scrollY===0','host map stays stationary');
  assert.deepEqual(errors, [], 'no uncaught browser errors'); console.log('PASS no browser exceptions');

}
main().catch(async error => { console.error(error); console.error(await page("return {active:d.querySelector('.cc-screen-viewport')?.dataset.activeScreen,top:d.querySelector('.cc-screen-viewport')?.scrollTop,overview:d.getElementById('overview')?.getBoundingClientRect().top,step:d.getElementById('overview')?.dataset.step};")); await shot('failure'); process.exitCode=1; }).finally(async () => { if(socket?.readyState===1) await cdp('Browser.close').catch(()=>{}); socket?.close(); server.close(); await disposeBrowser(chrome, profile); });
