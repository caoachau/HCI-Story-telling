/* Validate optimized assets and scroll progress in the built application. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const profile = path.join(root, '.browser-profile', 'assets-' + Date.now());
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2', '.svg':'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.resolve(dist, '.' + new URL(req.url, 'http://localhost').pathname.replace(/^\/$/, '/index.html'));
  if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
let chrome, socket, base, id = 0;
const pending = new Map(), errors = [], missing = [];
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(Error(method + ' timeout')); }, 30000);
    pending.set(requestId, { resolve, reject, timer }); socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description);
  return result.result.value;
}
async function wait(expression, label) {
  for (let i = 0; i < 200; i++) { if (await evaluate(expression)) return; await sleep(150); }
  throw Error('Timed out: ' + label);
}
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port;
  fs.mkdirSync(profile, { recursive: true });
  chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio:'ignore' });
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
  assert.ok(fs.existsSync(portFile), 'Chrome started');
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const task = pending.get(message.id); if (!task) return;
      pending.delete(message.id); clearTimeout(task.timer);
      message.error ? task.reject(Error(JSON.stringify(message.error))) : task.resolve(message.result);
    } else if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    // Chrome probes favicon.ico even when the page declares no favicon.
    else if (message.method === 'Network.responseReceived' && message.params.response.url.startsWith(base) && message.params.response.status >= 400 && new URL(message.params.response.url).pathname !== '/favicon.ico') missing.push(message.params.response.url);
  });
  await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
  await cdp('Emulation.setDeviceMetricsOverride', { width:1440, height:960, deviceScaleFactor:2, mobile:false });
  await cdp('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion', value:'reduce'}] });
  await cdp('Page.navigate', { url:base + '/' });
  await wait("document.querySelectorAll('.heritage-marker__image').length===7 && [...document.querySelectorAll('.heritage-marker__image')].every(image=>image.complete&&image.naturalWidth===640)", 'seven optimized landmark images');
  assert.ok(await evaluate("[...document.querySelectorAll('.heritage-marker')].every(marker=>marker.dataset.imageKind==='cutout')"));
  console.log('PASS seven 640px WebP cutouts render on the map at DPR 2');
  await cdp('Page.navigate', { url:base + '/ao-ba-om.html' });
  await wait("document.querySelectorAll('.kiosk-section').length===5", 'Ao Ba Om sections');
  for (const section of ['section-1-overview', 'section-2-map', 'section-3-timeline', 'section-4-community', 'section-5-legacy']) {
    await evaluate(`document.getElementById(${JSON.stringify(section)}).scrollIntoView({behavior:'instant'})`);
    await sleep(350);
  }
  await wait("[...document.images].filter(image=>image.src.startsWith(location.origin)&&image.getBoundingClientRect().bottom>0&&image.getBoundingClientRect().top<innerHeight).every(image=>image.complete&&image.naturalWidth>0)", 'visible local Ao Ba Om assets');
  await wait("Math.abs(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.kiosk-scroll-progress')).transform).a-scrollY/(document.documentElement.scrollHeight-innerHeight))<0.01", 'progress settles after lazy image layout');
  const progress = await evaluate("({actual:new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.kiosk-scroll-progress')).transform).a,expected:scrollY/(document.documentElement.scrollHeight-innerHeight),width:document.querySelector('.kiosk-scroll-progress').getBoundingClientRect().width})");
  assert.ok(progress.expected>0 && Math.abs(progress.actual-progress.expected)<0.01, 'Progress bar tracks scroll position: ' + JSON.stringify(progress));
  assert.ok(progress.width>0, 'Progress bar has visible width');
  await evaluate("document.getElementById('section-2-map').scrollIntoView({behavior:'instant'});[...document.querySelectorAll('#section-2-map button')].find(button=>button.textContent.includes('Xưa')).click()");
  await sleep(400);
  await wait("[...document.querySelectorAll('#section-2-map img')].filter(image=>image.getClientRects().length).every(image=>image.complete&&image.naturalWidth>0)", 'before and after WebP assets');
  await evaluate("window.scrollTo({top:0,behavior:'instant'})"); await sleep(200);
  assert.ok(await evaluate("getComputedStyle(document.querySelector('.kiosk-scroll-progress')).transform.startsWith('matrix(0,')"), 'Progress returns to zero');
  assert.deepEqual(missing, [], 'No missing local assets');
  assert.deepEqual(errors, [], 'No browser exceptions');
  console.log('PASS Ao Ba Om five sections, before/after assets, scroll progress, no missing files or browser exceptions');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { if(socket?.readyState===1) await cdp('Browser.close').catch(()=>{}); socket?.close(); server.close(); await disposeBrowser(chrome, profile); });
