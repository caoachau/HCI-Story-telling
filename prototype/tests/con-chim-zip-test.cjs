/* Chrome/CDP integration checks; no additional dependencies. Start Vite first. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const profile = path.join(root, '.browser-profile', 'zip-' + Date.now());
let base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
let distServer;
const productionSmoke = process.argv.includes('--production-smoke');
const productionFull = process.argv.includes('--production-full');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let chrome, ws, id = 0;
const pending = new Map(), errors = [];
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  const timeout = setTimeout(() => { pending.delete(requestId); reject(Error('CDP timeout: ' + method)); }, 60000);
  pending.set(requestId, { resolve, reject, timeout }); ws.send(JSON.stringify({ id: requestId, method, params }));
});
async function raw(expression) {
  const result = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
const page = code => raw(`(async()=>{const d=document.querySelector('.cc-zip-detail iframe')?.contentDocument||document;const w=d.defaultView;${code}})()`);
async function wait(code, message, ms = 15000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { if (await page('return Boolean(' + code + ')')) return; await sleep(150); }
  throw Error('Timed out: ' + message);
}
async function check(code, label) { assert.ok(await page('return Boolean(' + code + ')'), label); console.log('PASS ' + label); }
async function shot(name) {
  const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(root, 'preview', 'con-chim-redesign-' + name + '.png'), Buffer.from(data, 'base64'));
}
const viewport = (width, height) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const clickText = (scope, text) => page(`const button=[...d.querySelectorAll(${JSON.stringify(scope)})].find(el=>el.getClientRects().length && el.textContent.includes(${JSON.stringify(text)}));if(!button)throw Error('Missing button: '+${JSON.stringify(text)});button.focus();button.click();`);
const escape = () => page("d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));");
async function main() {
  if (productionSmoke || productionFull) {
    const dist = path.join(root, 'dist');
    const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
    distServer = require('node:http').createServer((req, res) => {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(dist + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end('Not found'); return; }
      res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
      fs.createReadStream(file).pipe(res);
    });
    await new Promise(resolve => distServer.listen(0, '127.0.0.1', resolve));
    base = 'http://127.0.0.1:' + distServer.address().port;
  }
  fs.mkdirSync(profile, { recursive: true }); fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
  chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  const portfile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portfile); i++) await sleep(100);
  assert.ok(fs.existsSync(portfile), 'Chrome started');
  const port = fs.readFileSync(portfile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  ws.addEventListener('message', event => {
    const m = JSON.parse(event.data);
    if (m.id) { const p = pending.get(m.id); if (!p) return; pending.delete(m.id); clearTimeout(p.timeout); m.error ? p.reject(Error(JSON.stringify(m.error))) : p.resolve(m.result); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  });
  await cdp('Runtime.enable'); await cdp('Page.enable');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, {name:'prefers-color-scheme',value:'light'}] });
  await viewport(1440, 960);
  const host=async()=>{
    await viewport(1440,960);await cdp('Page.navigate',{url:base+'/'});
    await wait("d.querySelector('.landmark-carousel-card[data-site-id=\"con-chim\"]')",'map application',35000);
    await raw("document.querySelector('.landmark-carousel-card[data-site-id=\"con-chim\"]').click()");
    await wait("document.querySelector('.cc-zip-detail iframe') && d.querySelector('#overview') && !document.querySelector('.cc-zip-detail [role=status]')",'embedded detail ready',35000);
    await wait('d.querySelector(".cc-host-controls")','combined header controls');
    await check("d.querySelector('h1').innerText.includes('Cồn Chim')",'map opens redesigned Cồn Chim detail');
    await check('d.querySelectorAll("header").length===1 && !document.querySelector(".cc-zip-detail header") && !document.querySelector(".cc-zip-detail>div>strong")','navigation and host controls share one header');
    await check('Math.abs(document.querySelector(".cc-zip-detail iframe").getBoundingClientRect().top-document.querySelector(".cc-zip-detail").getBoundingClientRect().top)<2','no extra toolbar takes space above the iframe');
    await page('w.ccReloadMarker=true;w.location.reload()');
    await wait('!w.ccReloadMarker && d.querySelector(".cc-host-controls")','combined controls survive iframe reload');
    await shot('panel');
    await page("d.querySelector('[aria-label=\"Xem chi tiết toàn màn hình\"]').click()");
    await wait(`d.querySelector('[aria-label="Thoát toàn màn hình chi tiết"]')`,'expanded control updates');
    await check("!document.querySelector('.landmark-carousel') && w.innerWidth===window.innerWidth",'expanded detail fills viewport');
    await page("d.querySelector('.cc-scene-tabs button:nth-child(2)').click()");
    await page("d.querySelector('[aria-label=\"Thoát toàn màn hình chi tiết\"]').click()");
    await wait(`d.querySelector('[aria-label="Xem chi tiết toàn màn hình"]')`,'collapsed control updates');
    await page("d.querySelector('[aria-label=\"Xem chi tiết toàn màn hình\"]').click()");
    await wait(`d.querySelector('[aria-label="Thoát toàn màn hình chi tiết"]')`,'expanded control updates again');
    await check("d.querySelector('.cc-scene-tabs button:nth-child(2)').getAttribute('aria-pressed')==='true'",'resizing preserves selected scene without remount');
    await shot('integrated-desktop');
    await page("d.querySelector('.cc-header-plan').click()");await wait('d.querySelector("[role=dialog] form")','embedded plan');
    await check("d.activeElement.closest('[role=dialog]') && w.getComputedStyle(d.querySelector('header')).position==='fixed'",'embedded focus management and stylesheet work');
    await escape();
    for(const width of [390,320]){
      await viewport(width,844);await page("d.querySelector('.cc-screen-viewport').scrollTo({top:0,behavior:'instant'})");await sleep(250);
      await check(`d.querySelector('.cc-header').scrollWidth<=w.innerWidth && d.querySelector('.cc-host-controls [aria-label="Đóng chi tiết Cồn Chim"]').getBoundingClientRect().right<=w.innerWidth`,'combined header fits '+width+'px and keeps close reachable');
      await shot('integrated-mobile-'+width);
    }
    await page('d.querySelector(".cc-menu-button").click()');
    await check(`d.querySelector('.cc-host-menu-action[aria-label="Xem toàn cảnh Cồn Chim"]') && d.querySelector('.cc-host-menu-action[aria-label="Mở mã QR Cồn Chim"]')`,'mobile menu retains panorama and QR controls');
    await page("d.querySelector('.cc-host-menu-action[aria-label=\"Mở mã QR Cồn Chim\"]').click()");
    await wait("document.body.innerText.includes('Quét mã QR')",'host QR dialog');
    await wait(`d.querySelector('[aria-label="Xem chi tiết toàn màn hình"]')`,'QR returns to map and updates header');
    await check("!d.querySelector('[aria-label=\"Thoát toàn màn hình chi tiết\"]')",'QR returns to map and opens existing host flow');
    await raw("[...document.querySelectorAll('p')].find(el=>el.textContent.includes('Quét mã QR')).parentElement.parentElement.querySelector('button').click()");
    await page("d.querySelector('.cc-host-controls [aria-label=\"Đóng chi tiết Cồn Chim\"]').click()");
    await wait('!document.querySelector(".cc-zip-detail")','combined header closes detail');
  };
  if(productionSmoke){await host();assert.deepEqual(errors,[]);console.log('PASS built entry has no uncaught exceptions');return;}
  await cdp('Page.navigate',{url:base+'/con-chim.html'});
  await wait('d.querySelector("#heritage-iris")','detail page',45000);await page('await d.fonts.ready');await sleep(500);
  await check("['overview','map','timeline','gallery','experiences','heritage-iris'].every(id=>d.getElementById(id))",'approved section structure preserved');
  await check("!d.body.innerText.match(/Hạ Long|HALONG|START EXPLORING|CHAPTER|USD/) && d.querySelector('h1').innerText.includes('Cồn Chim')",'visible content is unified for Cồn Chim');
  await check('d.documentElement.scrollWidth<=w.innerWidth+1','desktop has no horizontal overflow');await shot('desktop');
  await page("d.querySelector('.cc-scene-tabs button:nth-child(3)').click()");
  await check("d.querySelector('.cc-hero-arch img.is-active').alt.includes('Bữa cơm')",'hero switches real destination scenes');
  await clickText('.cc-hero button','Bắt đầu khám phá');
  await check("d.querySelector('.cc-screen-viewport').scrollTop>0 && Math.abs(d.querySelector('.cc-overview-layout').getBoundingClientRect().top-d.querySelector('.cc-header').getBoundingClientRect().bottom)<4",'hero opens the story below the compact header');
  await clickText('.cc-chapter-tabs button','Bếp quê');
  await wait("d.querySelector('.cc-chapter-tabs button[aria-pressed=true]').innerText.includes('Bếp quê')",'cuisine chapter');
  await check("d.querySelector('.cc-chapter-photo.is-active').innerText.includes('gian bếp')",'chapter syncs photo and narrative');
  await shot('overview');
  await page("d.querySelector('#timeline').scrollIntoView()");
  await clickText('.cc-timeline-stations button','2025');
  await wait("d.querySelector('.cc-timeline-stations button[aria-pressed=true]').innerText.includes('2025')",'timeline station');
  await shot('timeline');
  await clickText('#cc-history-award .cc-timeline-context button','Đọc câu chuyện');
  await wait('d.querySelector("[role=dialog]")','milestone story');
  await check("d.querySelector('[role=dialog]').innerText.includes('ASEAN') && !d.querySelector('[role=dialog]').closest('[inert]') && d.querySelector('main').inert",'milestone opens factual story with background inert');
  await escape();await wait('!d.querySelector("[role=dialog]")','close story');
  await check("d.activeElement.innerText.includes('Đọc câu chuyện')",'Escape restores story focus');
  await page("d.querySelector('#gallery').scrollIntoView()");
  await shot('gallery');
  const before=await page("return d.querySelector('.cc-gallery-caption h3').innerText");
  await page("d.querySelector('#gallery [aria-label=\"Ảnh tiếp theo\"]').click()");
  assert.notEqual(await page("return d.querySelector('.cc-gallery-caption h3').innerText"),before);console.log('PASS gallery changes image and caption together');
  await page("d.querySelector('#gallery [aria-label=\"Trang ảnh tiếp theo\"]').click()");
  await check("d.querySelectorAll('.cc-gallery-thumbnails button').length===3 && d.querySelector('[aria-label=\"Trang ảnh tiếp theo\"]').disabled",'gallery pagination changes actual thumbnail set');
  await clickText('.cc-filter-tabs button','Ẩm thực');
  await check("d.querySelectorAll('.cc-gallery-thumbnails button').length===2 && d.querySelector('.cc-photo-counter').innerText.includes('02')",'food filter resets pagination and shows relevant photos');
  await clickText('#gallery button','Xem ảnh lớn');await wait('d.querySelector(".cc-lightbox")','photo lightbox');
  await check("d.activeElement.getAttribute('aria-label')==='Đóng cửa sổ'",'dialog receives focus');
  await clickText('[role=dialog] button','Yêu thích');
  await check("d.querySelector('.cc-favorite-button').getAttribute('aria-pressed')==='true' && JSON.parse(w.localStorage.getItem('con-chim-favorite-photos')).length===1",'favorite is persisted on device');
  const lightboxBefore=await page("return d.querySelector('.cc-lightbox h3').innerText");
  await page("d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}))");
  assert.notEqual(await page("return d.querySelector('.cc-lightbox h3').innerText"),lightboxBefore);console.log('PASS arrow keys navigate large photos');
  await escape();await wait('!d.querySelector("[role=dialog]")','close photo');
  await check("d.activeElement.innerText.includes('Xem ảnh lớn') && !d.querySelector('main').inert",'closing photo restores focus and page interactivity');
  await page("d.querySelector('#experiences').scrollIntoView();d.querySelectorAll('.cc-experience-card button')[2].focus();d.querySelectorAll('.cc-experience-card button')[2].click()");
  await wait('d.querySelector("[role=dialog] form")','cuisine plan');
  await check("d.querySelector('.cc-tour-options button[aria-pressed=true]').innerText.includes('bếp quê')",'experience preselects matching itinerary');
  await shot('plan');
  await page("d.querySelector('[role=dialog] form').requestSubmit()");
  await wait('d.querySelector(".cc-plan-result")','create actual itinerary');
  await check("d.querySelectorAll('.cc-plan-stops li').length===5 && JSON.parse(w.localStorage.getItem('con-chim-itinerary')).tour==='cuisine' && d.activeElement.matches('.cc-plan-result h4')",'plan creates stop list, persists preferences and focuses result');
  await check("!JSON.stringify(JSON.parse(w.localStorage.getItem('con-chim-itinerary'))).match(/phone|email|fullName/)",'saved plan excludes optional contact data');
  await clickText('[role=dialog] button','Chỉnh lại lịch trình');await wait('d.querySelector("[role=dialog] form")','edit plan');await escape();
  await page("d.querySelectorAll('.cc-experience-card button')[1].click()");
  await wait('d.querySelector("[role=dialog] form")','reopen plan');
  await check("d.querySelector('.cc-tour-options button[aria-pressed=true]').innerText.includes('lối xanh')",'reopening resets result and selects new experience');await escape();
  await page("d.querySelector('#heritage-iris').scrollIntoView();const p=d.querySelector('.cc-iris-petal');p.focus();p.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}))");
  await wait('d.querySelector(".cc-petal-modal")','keyboard iris');await shot('iris-modal');
  await clickText('[role=dialog] button','Đưa vào chuyến đi');
  await wait('d.querySelector("[role=dialog] form")','petal to plan');
  await check("d.activeElement.closest('[role=dialog]') && !d.querySelector('[role=dialog]').closest('[inert]')",'petal transitions into interactive plan');
  await escape();await check("d.activeElement.matches('.cc-iris-petal') && d.documentElement.style.overflow!== 'hidden'",'chained modal restores original focus and scrolling');
  await page("d.querySelector('.cc-screen-viewport').scrollTo({top:0,behavior:'instant'});d.querySelector('.cc-header-actions button').click()");
  await wait('d.querySelector(".cc-studio-modal textarea")','studio');
  await clickText('[role=dialog] button','Từ ý tưởng');
  await clickText('[role=dialog] button','9:16');
  await check("!d.querySelector('.cc-studio-image') && d.querySelector('.cc-studio-bottom button[aria-pressed=true]').innerText.includes('9:16')",'studio modes and aspect ratio work');
  await clickText('[role=dialog] button','Tạo chuyển động');
  await wait("d.querySelector('[role=alert]')",'unconfigured studio backend');
  await check("d.querySelector('[role=alert]').innerText.includes('chưa kết nối') && !d.querySelector('[role=dialog] video')",'studio reports unavailable service without fake output');await escape();
  for(const width of [390,320]){
    await viewport(width,844);await page("d.querySelector('.cc-screen-viewport').scrollTo({top:0,behavior:'instant'})");await sleep(200);
    await check('d.documentElement.scrollWidth<=w.innerWidth+1','no horizontal overflow at '+width+'px');
    await shot('mobile-'+width);
    await page('d.querySelector(".cc-menu-button").click()');
    await check("d.querySelector('.cc-menu-button').getAttribute('aria-expanded')==='true'",'mobile navigation opens');
    await clickText('.cc-mobile-nav button','Studio chuyển động');await wait('d.querySelector(".cc-studio-modal")','mobile studio');
    await check("d.querySelector('.cc-modal-window').getBoundingClientRect().height<=w.innerHeight-28 && d.querySelector('.cc-modal-window').scrollWidth<=d.querySelector('.cc-modal-window').clientWidth+1",'mobile dialog fits and scrolls inside viewport');await escape();
    await page("d.querySelector('#overview').scrollIntoView()");await shot('mobile-overview-'+width);
    await page("d.querySelector('#gallery').scrollIntoView()");await shot('mobile-gallery-'+width);
  }
  await viewport(1440,960);await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'},{name:'prefers-reduced-motion',value:'reduce'}]});
  await page("d.querySelector('.cc-screen-viewport').scrollTo({top:0,behavior:'instant'})");
  await check("w.getComputedStyle(d.body).backgroundColor==='rgb(19, 39, 30)' && w.getComputedStyle(d.querySelector('.cc-hero-arch img')).transitionDuration==='0s'",'dark theme and reduced motion use consistent tokens');
  await shot('dark');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'},{name:'prefers-reduced-motion',value:'no-preference'}]});
  await page("d.querySelector('#gallery').scrollIntoView()");await sleep(850);
  await check("w.getComputedStyle(d.querySelector('[data-reveal].is-revealed')).opacity==='1' && w.getComputedStyle(d.querySelector('.cc-hero-arch img')).transitionDuration!=='0s'",'scroll reveal and scene transitions work when motion is enabled');
  await host();
  assert.deepEqual(errors, [], 'no uncaught browser exceptions'); console.log('PASS no uncaught browser exceptions');
}
main().catch(async error => { console.error(error); console.error('Browser exceptions:', errors); if(ws?.readyState===1){ console.error(await raw('document.body.innerText.slice(0,1200)')); await shot('failure'); } process.exitCode = 1; }).finally(async () => { if(ws?.readyState===1) await cdp('Browser.close').catch(()=>{}); ws?.close(); distServer?.close(); await disposeBrowser(chrome, profile); });
