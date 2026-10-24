/* Interaction and accessibility checks for the shared-screen Cồn Chim experience. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const profile = path.join(root, '.browser-profile', 'kt01-' + process.pid + '-' + Date.now());
const audit = process.argv.includes('--audit');
const fourK = process.argv.includes('--4k');
const dev = audit || process.argv.includes('--dev');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
let browser, socket, server, sequence = 0;
const pending = new Map(), errors = [], requests = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(Error('Timeout: ' + method)); }, 45000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function page(expression) {
  const result = await cdp('Runtime.evaluate', { expression:`(async()=>{${expression}})()`, awaitPromise:true, returnByValue:true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function wait(expression, label) {
  for (let i=0; i<100; i++) { if (await page('return Boolean(' + expression + ')')) return; await sleep(100); }
  throw Error('Timed out: ' + label);
}
async function check(expression, label) { assert.ok(await page('return Boolean(' + expression + ')'), label); console.log('PASS ' + label); }
async function shot(name) {
  await sleep(300);
  const { data } = await cdp('Page.captureScreenshot', { format:'png' });
  fs.writeFileSync(path.join(root, 'preview', 'con-chim-kt01-' + name + '.png'), Buffer.from(data, 'base64'));
}
const viewport = (width, height, deviceScaleFactor = 1) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor, mobile:false });
const click = selector => page(`{const el=document.querySelector(${JSON.stringify(selector)});el.focus({preventScroll:true});el.click();}`);
async function main() {
  fs.mkdirSync(profile, { recursive:true }); fs.mkdirSync(path.join(root, 'preview'), { recursive:true });
  let base = 'http://127.0.0.1:3000';
  if (!dev) {
    const dist = path.join(root, 'dist');
    server = http.createServer((req, res) => {
      const file = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
      if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); fs.createReadStream(file).pipe(res);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
  }
  browser = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'], { windowsHide:true, stdio:'ignore' });
  const portfile = path.join(profile, 'DevToolsActivePort');
  let port;
  for (let i=0; i<100; i++) {
    try { const value=fs.readFileSync(portfile, 'utf8').split('\n')[0]; if (/^\d+$/.test(value)) { port=value; break; } }
    catch (error) { if (!['ENOENT','EBUSY','EPERM'].includes(error.code)) throw error; }
    await sleep(100);
  }
  assert.ok(port, 'Chrome started');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(item => item.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once:true }));
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data), request = pending.get(message.id);
    if (request) { pending.delete(message.id); clearTimeout(request.timer); message.error ? request.reject(Error(JSON.stringify(message.error))) : request.resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
  });
  await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
  await viewport(fourK ? 3840 : 1440, fourK ? 2160 : 960);
  await cdp('Emulation.setEmulatedMedia', { features:[{name:'prefers-color-scheme',value:'light'}] });
  await cdp('Page.navigate', { url:base+'/con-chim.html' });
  await wait('document.querySelector("main")', 'main content'); await page('await document.fonts.ready'); await sleep(500);
  if (audit) { await shot(fourK ? '4k-before' : 'before'); console.log('Captured current page before redesign'); return; }
  await wait('document.querySelector(".cc-kiosk")', 'KT01 experience');
  if (fourK && !process.argv.includes('--host-only')) {
    const tap = async selector => {
      const point = await page(`const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}`);
      await cdp('Emulation.setTouchEmulationEnabled', {enabled:true});
      await cdp('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[point]});
      await cdp('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
      await cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
    };
    const fits = 'document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1 && document.documentElement.scrollWidth<=innerWidth+1';
    await check('document.querySelector(".cck-home").getBoundingClientRect().width>=3200', 'Native 4K uses the large viewport instead of a small central column');
    await check('[...document.querySelectorAll(".cck-interests button,.cck-primary,.cck-header nav button")].every(el=>el.getBoundingClientRect().height>=111)', 'Native 4K touch controls are at least 112 px high');
    await check(fits, 'Native 4K home fits without scrolling');
    await wait('document.querySelector(".cck-feature-photo [data-image-state=ready]")', '4K hero photo');
    await shot('4k-home');
    for (let i=1;i<=3;i++) {
      await tap('.cck-interests button:nth-child('+i+')');
      await check(fits, '4K home remains within the screen for interest '+i);
    }
    await tap('.cck-primary');
    await check('parseFloat(getComputedStyle(document.querySelector(".cck-summary")).fontSize)>=40', 'Native 4K summary uses 42 px text');
    await check('document.querySelector(".cck-reader").getBoundingClientRect().width>=2900 && document.querySelector(".cck-reader").getBoundingClientRect().height<=innerHeight', 'Native 4K reader scales with the screen');
    await wait('document.querySelector(".cck-reader-photo [data-image-state=ready]")', '4K reader photo');
    await shot('4k-reader');
    await tap('.cck-source-shortcut');
    await wait('document.querySelector("#cck-story-sources").open', 'sources open after touch');
    await check('document.querySelector("#cck-story-sources").open && parseFloat(getComputedStyle(document.querySelector(".cck-sources p")).fontSize)>=27', 'Source metadata stays readable and opens by touch at 4K');
    await tap('[aria-label="Về khám phá, đóng câu chuyện"]');
    await tap('.cck-header nav button:nth-child(2)');
    await check('getComputedStyle(document.querySelector(".cck-story-list")).gridTemplateColumns.split(" ").length===2 && document.querySelectorAll(".cck-story-card").length===6', '4K explorer presents six stories in two columns beside the diagram');
    await check(fits, 'All six stories and the diagram fit on the native 4K screen');
    await check('[...document.querySelectorAll(".cck-map-group button,.cck-story-card")].every(el=>{const r=el.getBoundingClientRect(),m=document.querySelector("main").getBoundingClientRect();return r.top>=m.top && r.bottom<=m.bottom})', 'All six diagram choices and story cards are reachable without scrolling');
    await wait('[...document.querySelectorAll(".cck-story-card .cck-image")].every(el=>el.dataset.imageState==="ready")', '4K story images');
    await shot('4k-explore');
    await tap('.cck-story-card:nth-child(6)');
    await check('document.querySelector("#cck-reader-title").textContent.includes("lời chào")', 'The sixth story opens directly by touch at 4K');
    await tap('[aria-label="Về khám phá, đóng câu chuyện"]');
    await tap('.cck-map-toggle');
    await check('getComputedStyle(document.querySelector(".cck-story-list")).gridTemplateColumns.split(" ").length===3', 'List-only 4K view uses three columns');
    await viewport(2560,1440); await click('.cck-header nav button:first-child');
    await check(fits, 'Intermediate 2560 × 1440 display fits without scrolling');
    await viewport(1920,1080,2); await click('.cck-header nav button:first-child');
    await check(fits+' && document.querySelector(".cck-interests button").getBoundingClientRect().height<120', '4K hardware with a 1920 CSS-px viewport avoids double scaling');
    await click('.cck-primary');
    await check('parseFloat(getComputedStyle(document.querySelector(".cck-summary")).fontSize)===21', '200% device scaling keeps the intended physical text size');
    await click('[aria-label="Về khám phá, đóng câu chuyện"]');
    await shot('4k-scaled-home');
    assert.deepEqual(errors, [], 'No 4K browser exceptions');
    console.log('PASS No uncaught browser exceptions at native or scaled 4K');
    return;
  }
  if (!process.argv.includes('--host-only')) {
  await shot('home');
  await check('document.querySelectorAll(".cck-interests button").length===3 && document.querySelector(".cck-feature h2").textContent.includes("bánh xèo")', 'Three interests and a real food story are available immediately');
  await check('[...document.querySelectorAll(".cck-interests button,.cck-primary,.cck-header nav button")].every(el=>el.getBoundingClientRect().height>=56)', 'Main kiosk targets are at least 56 CSS pixels high');
  await check('document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1', 'Home choices fit the 1440 × 960 screen');
  await cdp('Emulation.setTouchEmulationEnabled', {enabled:true});
  const touch = await page('const r=document.querySelector(".cck-interests button:nth-child(2)").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[touch]});
  await cdp('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
  await cdp('Emulation.setTouchEmulationEnabled', {enabled:false});
  await check('document.querySelector(".cck-feature h2").textContent.includes("ruộng lúa") && document.querySelectorAll(".cck-interests [aria-pressed=true]").length===1', 'Choosing landscape changes the photograph, question and story');
  await click('.cck-primary'); await wait('document.querySelector("[role=dialog]")', 'story reader');
  await check('document.querySelectorAll(".cck-summary li").length===3 && !document.querySelector(".cck-disclosure").open && document.querySelector("main").inert', 'Independent story opens with three summary points and an inert background');
  await check('document.activeElement.getAttribute("aria-label")==="Về khám phá, đóng câu chuyện"', 'Story opens with focus on the return control');
  await wait('document.querySelector(".cck-reader-photo [data-image-state=ready]")', 'reader photo');
  await shot('reader');
  await click('.cck-disclosure summary');
  await check('document.querySelector(".cck-disclosure").open && document.querySelector(".cck-invitation").textContent.includes("ruộng")', 'Longer text expands only on request');
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Tab',code:'Tab'});
  await check('document.activeElement.closest("#cck-story-sources")!==null', 'Keyboard can move from Read more to Sources without being sent back to Close');
  await click('.cck-source-shortcut');
  await wait('document.querySelector("#cck-story-sources").open', 'source disclosure');
  await check('document.querySelector("#cck-story-sources").open && document.querySelector(".cck-sources").textContent.includes("13/06/2022") && document.querySelector(".cck-sources time").dateTime==="2026-10-24"', 'One touch reveals the current story’s content source, photo source and review date');
  await check('document.querySelector(".cck-documentary a").href.includes("vtv.vn/video/") && !document.querySelector("video,iframe")', 'Documentary is a deliberate source link with no embedded or autoplay media');
  assert.ok(!requests.some(url=>/vtv\.vn|google\.com|youtube|googleapis|bvhttdl|baodongnai/.test(url)), 'No third-party source or media request before a visitor asks');
  console.log('PASS No third-party media or map downloads while browsing');
  await click('.cck-listen');
  await check('document.querySelector(".cck-audio-status").textContent.length>0', 'Listening reports progress or a clear device limitation');
  await page('window.speechSynthesis?.cancel()');
  await click('.cck-related');
  await check('document.querySelector("#cck-reader-title").textContent.includes("Một vòng cồn") && !document.querySelector("#cck-story-sources").open', 'Related story starts independently with its own summary and collapsed sources');
  await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape'});
  await wait('!document.querySelector("[role=dialog]")', 'reader closed');
  await check('!document.querySelector("main").inert && document.activeElement.classList.contains("cck-primary")', 'Escape returns focus to the original story control');
  await click('.cck-header nav button:nth-child(2)');
  await check('document.querySelectorAll(".cck-story-card").length===6 && document.querySelectorAll(".cck-map-group button").length===6', 'All stories are reachable independently through list and diagram');
  await wait('[...document.querySelectorAll(".cck-story-card .cck-image")].slice(0,3).every(el=>el.dataset.imageState==="ready")', 'visible story photos');
  await shot('explore');
  await click('.cck-filter button:nth-child(2)');
  await check('document.querySelectorAll(".cck-story-card").length===2 && document.querySelector(".cck-results").textContent.includes("món ăn")', 'Food filter narrows the list and announces the result');
  await click('.cck-map-toggle');
  await check('!document.querySelector("#cck-topic-map") && document.querySelectorAll(".cck-story-card").length===2', 'List remains fully usable with the diagram closed');
  await page('document.querySelector(".cck-story-card").focus();document.querySelector(".cck-story-card").click()');
  await click('.cck-source-shortcut');
  await check('document.querySelector(".cck-sources a").href.includes("baodongnai")', 'Opening another story presents that story’s source');
  await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  await check('document.activeElement.classList.contains("cck-story-card") && document.querySelector(".cck-opened") && document.querySelectorAll(".cck-story-card").length===2', 'Closing preserves the filtered list and restores its focus');

  // Simulate a kiosk with a Vietnamese voice without depending on host audio hardware.
  await page(`window.__speech={started:0,cancelled:0};Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'vi-VN'}],speak:u=>{window.__speech.started++;u.onstart?.()},cancel:()=>{window.__speech.cancelled++}}});`);
  await click('.cck-story-card'); await click('.cck-listen');
  await check('window.__speech.started===1 && document.querySelector(".cck-listen").getAttribute("aria-pressed")==="true"', 'Vietnamese summary starts only after pressing Listen');
  await click('.cck-related');
  await check('window.__speech.cancelled===1 && document.querySelector(".cck-listen").getAttribute("aria-pressed")==="false"', 'Changing story cancels the previous voice');
  await click('.cck-listen'); await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  await check('window.__speech.cancelled===2', 'Closing a story stops its voice');

  for (const [width,height] of [[1920,1080],[1280,720],[768,1024],[390,844],[320,720]]) {
    await viewport(width,height); await click('.cck-header nav button:first-child'); await sleep(100);
    await check('document.documentElement.scrollWidth<=innerWidth+1 && document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1', 'Home has no horizontal overflow at '+width+'px');
    if (width>=1280) await check('document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1', 'Kiosk home fits screen height at '+width+' × '+height);
    if (width>=1280) await check('document.querySelector(".cck-intro").getBoundingClientRect().bottom+8<=document.querySelector(".cck-feature").getBoundingClientRect().top','Opening introduction and story preview do not overlap at '+width+'px');
    await shot('home-'+width);
    await click('.cck-header nav button:nth-child(2)');
    await check('document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1', 'Explorer fits its frame at '+width+'px');
    await click('.cck-map-toggle');
    await click('.cck-story-card');
    await check('document.querySelector(".cck-reader").getBoundingClientRect().height<=innerHeight && document.querySelector(".cck-reader").scrollWidth<=innerWidth', 'Reader fits its frame at '+width+'px');
    if (width===390) await shot('reader-narrow');
    await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  }
  await viewport(1440,960); await click('.cck-header nav button:first-child');
  await cdp('Emulation.setEmulatedMedia', {features:[{name:'prefers-color-scheme',value:'dark'},{name:'prefers-reduced-motion',value:'reduce'}]});
  await check('getComputedStyle(document.body).backgroundColor==="rgb(26, 29, 24)" && getComputedStyle(document.querySelector(".cck-interests button")).transitionDuration==="0s"', 'The museum visual theme stays consistent across system preferences and honors reduced motion');
  await shot('dark');
  await cdp('Emulation.setEmulatedMedia', {features:[{name:'prefers-color-scheme',value:'light'}]});
  await click('.cck-primary');
  // Image failures cannot block the summary. Retry remounts the original local resource.
  await page('document.querySelector(".cck-reader-photo img").dispatchEvent(new Event("error"))');
  await check('document.querySelector(".cck-reader-photo [data-image-state=error]") && document.querySelectorAll(".cck-summary li").length===3', 'Image failure leaves the story readable');
  await click('.cck-reader-photo .cck-outline');
  await wait('document.querySelector(".cck-reader-photo [data-image-state=ready]")', 'image retry');
  await check('document.querySelector(".cck-reader-photo img").naturalWidth>0', 'Retry recovers the real image');
  await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  await click('.cck-header nav button:first-child'); await click('.cck-header nav button:nth-child(2)');
  await check('!document.querySelector(".cck-opened") && document.querySelectorAll(".cck-story-card").length===6', 'Home resets selections for the next visitor');
  }

  // Exercise the actual map host, including its updated quick-view entry point.
  await cdp('Page.navigate', {url:base+'/'});
  await wait('document.querySelector(".landmark-carousel-card[data-site-id=con-chim]")', 'map application');
  await click('.landmark-carousel-card[data-site-id=con-chim]');
  await sleep(500);
  // Open the selected place explicitly; automatic opening waits for map tiles.
  await page(`document.querySelector('[aria-label="Mở diễn giải di sản"]')?.click()`);
  await wait('document.querySelector("[data-action=show-location-details]") || document.querySelector(".cc-zip-detail iframe")', 'quick view or detail');
  await page('document.querySelector("[data-action=show-location-details]")?.click()');
  await wait('document.querySelector(".cc-zip-detail iframe")?.contentDocument?.querySelector(".cck-host")', 'embedded detail controls');
  const frame = code => page('const f=document.querySelector(".cc-zip-detail iframe"),d=f.contentDocument,w=f.contentWindow;'+code);
  const frameClick = selector => frame('d.querySelector('+JSON.stringify(selector)+').click()');
  await check('!document.querySelector(".cc-zip-detail [role=status]")', 'Host receives ready and removes its loading layer');
  const expandedAtStart = await frame(`return !!d.querySelector('[aria-label="Thoát toàn màn hình chi tiết"]')`);
  if (expandedAtStart) {
    await frameClick('[aria-label="Thoát toàn màn hình chi tiết"]');
    await wait(`document.querySelector('.cc-zip-detail iframe')?.contentDocument?.querySelector('[aria-label="Xem chi tiết toàn màn hình"]')`, 'collapsed host');
  }
  await frame('d.querySelector(".cck-interests button:nth-child(2)").click();w.__kt01Marker=true');
  await frameClick('[aria-label="Xem chi tiết toàn màn hình"]');
  await wait(`document.querySelector('.cc-zip-detail iframe')?.contentDocument?.querySelector('[aria-label="Thoát toàn màn hình chi tiết"]')`, 'expanded host');
  await check('document.querySelector(".cc-zip-detail iframe").contentWindow.__kt01Marker===true && document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".cck-feature h2").textContent.includes("ruộng lúa")', 'Expanding preserves the iframe and selected interest');
  if (fourK) await check('parseFloat(document.querySelector(".cc-zip-detail iframe").contentWindow.getComputedStyle(document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".cck-interests strong")).fontSize)>=45', 'Actual map host activates the native 4K layout in full screen');
  await shot(fourK ? '4k-integrated' : 'integrated');
  await frame('w.dispatchEvent(new w.MessageEvent("message",{origin:"https://untrusted.invalid",source:window,data:{channel:"con-chim-detail",type:"host-controls",controls:{actions:[]}}}))');
  await check(`document.querySelector('.cc-zip-detail iframe').contentDocument.querySelector('[aria-label="Đóng chi tiết Cồn Chim"]')`, 'Untrusted messages cannot replace host controls');
  await viewport(390,844);
  await frame('d.querySelector(".cck-host-more").click()');
  await check('document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".cck-host-menu").textContent.includes("Mã QR")', 'Narrow host keeps panorama and QR in an accessible menu');
  await frame('[...d.querySelectorAll(".cck-host-menu button")].find(el=>el.textContent.includes("Mã QR")).click()');
  await wait('document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".ccl-takeaway")', 'story-specific QR view');
  await check('document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".ccl-qr-unavailable") && !document.querySelector(".cc-zip-detail iframe").contentDocument.querySelector(".ccl-real-qr")', 'Local kiosk explains the missing public URL instead of showing an unusable QR');
  await frameClick('.ccl-close-all');
  await frameClick('[aria-label="Đóng chi tiết Cồn Chim"]');
  await wait('!document.querySelector(".cc-zip-detail")', 'close embedded detail');
  console.log('PASS Real host opens, expands, preserves state, opens QR and closes');
  assert.deepEqual(errors, [], 'No uncaught exceptions');
  console.log('PASS No uncaught browser exceptions');
}
main().catch(async error => { console.error(error); process.exitCode = 1; if (socket?.readyState===1) await shot('failure'); }).finally(async () => {
  if (socket?.readyState===1) await cdp('Browser.close').catch(()=>{});
  socket?.close(); server?.close(); await disposeBrowser(browser, profile);
});
