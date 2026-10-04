/* Chrome/CDP checks for the reference museum page; start Vite first. */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { disposeBrowser } = require('./browser-artifacts.cjs');
const root = path.resolve(__dirname, '..');
const profile = path.join(root, '.browser-profile', 'museo-' + process.pid + '-' + Date.now());
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let chrome, ws, serial = 0;
const pending = new Map(), exceptions = [], missing = [];
const cdp = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++serial;
  const timeout = setTimeout(() => { pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 30000);
  pending.set(id, { resolve, reject, timeout });
  ws.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const result = await cdp('Runtime.evaluate', { expression: '{' + expression + '}', awaitPromise: true, returnByValue: true }).catch(error => { throw Error(error.message + '\nEvaluating: ' + expression); });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function wait(expression, label, timeout = 20000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) { if (await evaluate('Boolean(' + expression + ')')) return; await sleep(120); }
  throw Error('Timed out: ' + label);
}
async function check(expression, label) { assert.ok(await evaluate(expression), label); console.log('PASS ' + label); }
const viewport = (width, height = 960) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const escape = async () => { await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); };
async function shot(name) {
  await sleep(200);
  const result = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(root, 'preview', 'museo-' + name + '.png'), Buffer.from(result.data, 'base64'));
}
async function section(name) {
  await click('.md-screen-dot[data-section="' + name + '"]');
  await wait(`!document.getElementById('museo-${name}').hidden`, name + ' screen is active');
  await evaluate(`document.getElementById('museo-${name}').scrollTop=0`);
  await wait("[...document.querySelectorAll('.md-root img')].filter(img=>{const r=img.getBoundingClientRect();if(!r.width||!r.height||r.top>=innerHeight||r.bottom<=0||r.left>=innerWidth||r.right<=0)return false;const strip=img.closest('.md-site-strip');if(strip){const p=strip.getBoundingClientRect();return r.right>p.left&&r.left<p.right}return true}).every(img=>img.complete&&img.naturalWidth>0)", name + ' visible images');
}
async function quickViewChecks() {
  await viewport(1440, 960);
  await cdp('Page.navigate', { url: base + '/' });
  await wait("document.querySelectorAll('.landmark-carousel-card').length===7", 'host landmark dock', 35000);
  const mapSize = await evaluate("const r=document.querySelector('.heritage-map-viewport').getBoundingClientRect();({width:r.width,height:r.height})");
  const locations = ['ao-ba-om','chua-ang','chua-hang','den-tho-bac','con-chim','bien-ba-dong','bao-tang-khmer'];
  for (const id of locations) {
    const card = '.landmark-carousel-card[data-site-id="' + id + '"]';
    const name = await evaluate(`document.querySelector(${JSON.stringify(card)}).querySelector('.landmark-carousel-name').textContent`);
    await click(card);
    await wait(`document.querySelector('.lqv-root')?.dataset.siteId===${JSON.stringify(id)}`, id + ' quick information', 35000);
    await check(`document.querySelector('#location-quick-title').textContent===${JSON.stringify(name)} && document.querySelector('.lqv-summary').textContent.length>30 && document.querySelector('.lqv-address').textContent.length>5 && document.querySelectorAll('.lqv-highlights li').length>0`, id + ' shows its own name, address, summary and highlights');
    await check("!document.querySelector('.heritage-location-detail') && getComputedStyle(document.querySelector('.lqv-summary')).fontSize==='14px'", id + ' first opens readable quick information before loading details');
    if (id !== 'bao-tang-khmer') {
      await evaluate("document.querySelector('[data-action=\"show-location-details\"]').focus()");
      await click('[data-action="show-location-details"]');
      const detail = id==='ao-ba-om' ? '.ao-shell' : id==='bien-ba-dong' ? '.bd-shell' : id==='con-chim' ? '.cc-zip-detail' : '.heritage-location-detail h2';
      await wait(`document.querySelector(${JSON.stringify(detail)})`, id + ' full detail', 35000);
      await check("const r=document.querySelector('.heritage-location-detail').getBoundingClientRect();r.left===0 && r.top===0 && r.width===innerWidth && r.height===innerHeight && !document.querySelector('.landmark-carousel')", id + ' detail fills the viewport and hides the dock');
      if (id === 'chua-ang') {
        await click('.story-tab-strip button:nth-child(3)');
        await evaluate("const button=[...document.querySelectorAll('.heritage-location-detail button')].find(b=>b.textContent.includes('3D')&&!b.closest('[role=\"tablist\"]'));button.focus();button.click()");
        await wait("document.querySelector('[data-location-overlay=\"artifact\"]')?.open && document.querySelector('[data-location-overlay=\"artifact\"] canvas')",'fullscreen artifact viewer',35000);
        await check("document.querySelector('[data-location-overlay=\"artifact\"]').contains(document.elementFromPoint(innerWidth/2,innerHeight/2))",'artifact viewer renders above the fullscreen story');
        await escape();
        await check("!document.querySelector('.heritage-location-detail').hidden && document.activeElement.textContent.includes('3D')",'artifact Escape returns to its story trigger');
        await click('.story-tab-strip button:last-child');
        await evaluate("const button=[...document.querySelectorAll('.heritage-location-detail button')].find(b=>b.textContent.includes('Mở chế độ 360'));button.focus();button.click()");
        await wait("document.querySelector('[data-location-overlay=\"panorama\"]')?.open && document.querySelector('[data-location-overlay=\"panorama\"] h3')",'fullscreen panorama viewer');
        await check("const dialog=document.querySelector('[data-location-overlay=\"panorama\"]'),bar=dialog.querySelector('div>div').getBoundingClientRect();dialog.contains(document.elementFromPoint(innerWidth/2,innerHeight/2)) && bar.width===innerWidth",'panorama viewer fills the viewport above the fullscreen story');
        await escape();
        await check("!document.querySelector('.heritage-location-detail').hidden && document.activeElement.textContent.includes('360')",'panorama Escape returns to its story trigger');
      }
      await evaluate("document.querySelector('.heritage-location-detail').focus()");
      await escape();
      await wait("document.querySelector('.heritage-location-detail').hidden", id + ' returns to quick information');
      await check("document.activeElement.dataset.action==='show-location-details'", id + ' returns keyboard focus to View details');
      await click('.lqv-close');
    }
  }
  await check(`const r=document.querySelector('.heritage-map-viewport').getBoundingClientRect();r.width===${mapSize.width} && r.height===${mapSize.height}`, 'location selection does not resize the map');
  for (const [width,height] of [[1726,1406],[1440,960],[1024,768],[768,960],[640,400],[390,844],[320,568],[844,390]]) {
    await viewport(width,height); await sleep(180);
    await check("const card=document.querySelector('.lqv-root'),r=card.getBoundingClientRect(),body=document.querySelector('.lqv-scroll'),button=document.querySelector('[data-action=\"show-location-details\"]'),b=button.getBoundingClientRect();r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight && body.scrollWidth<=body.clientWidth+1 && b.bottom<=r.bottom && b.top>=r.top && button.contains(document.elementFromPoint(b.left+b.width/2,b.top+b.height/2))",width+'x'+height+' quick information fits and its detail action stays visible above the dock');
    await evaluate("document.querySelector('.lqv-scroll').scrollTop=10000");
    await check("const body=document.querySelector('.lqv-scroll'),last=document.querySelector('.lqv-highlights li:last-child').getBoundingClientRect();last.bottom<=body.getBoundingClientRect().bottom+1",width+'x'+height+' all quick information remains reachable within its own scroll area');
    await evaluate("document.querySelector('.lqv-scroll').scrollTop=0");
    if (width===1440 || width===390 || width===320) await shot('quick-location-'+width+'x'+height);
  }
  await viewport(390,844);
  await click('button[title="Tìm kiếm di sản"]');
  await wait("document.querySelector('input[placeholder^=\"Tìm kiếm địa danh\"]')",'host search above quick information');
  await evaluate("const input=document.querySelector('input[placeholder^=\"Tìm kiếm địa danh\"]'),list=input.parentElement.parentElement.querySelector('.overflow-y-auto');list.scrollTop=list.scrollHeight");
  await check("const input=document.querySelector('input[placeholder^=\"Tìm kiếm địa danh\"]'),list=input.parentElement.parentElement.querySelector('.overflow-y-auto'),last=list.lastElementChild,r=last.getBoundingClientRect();last.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",'host search results render above the phone quick card');
  await evaluate("document.querySelector('input[placeholder^=\"Tìm kiếm địa danh\"]').parentElement.querySelector('button:last-child').click()");
  await check("!document.querySelector('input[placeholder^=\"Tìm kiếm địa danh\"]') && document.querySelector('.lqv-root').getBoundingClientRect().height>0",'closing search leaves quick information available');
  await viewport(1440,960);
  const narrowWidth=await evaluate("document.querySelector('.lqv-root').clientWidth");
  await click('.lqv-width-toggle');
  await check(`document.querySelector('.lqv-root').clientWidth>${narrowWidth} && getComputedStyle(document.querySelector('.lqv-layout')).display==='grid'`,'wide quick view places its photo and content in two columns');
  await click('.lqv-width-toggle');
  await click('button[title="Chuyển sang English"]');
  await check("document.querySelector('.lqv-toolbar>span').textContent==='LOCATION OVERVIEW' && document.querySelector('.lqv-footer button').textContent.includes('View details') && document.querySelector('#location-quick-title').textContent.includes('Khmer') && document.querySelector('.lqv-summary').textContent.startsWith('One')",'quick information follows the selected language');
  await click('[data-action="show-location-details"]');
  await wait("document.querySelector('.md-root')",'English museum detail',35000);
  for(const [width,height] of [[1440,960],[390,844],[320,568]]) {
    await viewport(width,height); await section('overview');
    await check("document.getElementById('museo-overview').lang==='en' && document.getElementById('md-overview-title').textContent==='KHMERMUSEUM' && document.querySelector('.md-remarkable h3').textContent==='WHAT MAKES IT DISTINCTIVE'",width+'px museum overview follows the host English language');
    await check("const panel=document.querySelector('.md-overview-top').getBoundingClientRect(),facts=document.querySelector('.md-facts').getBoundingClientRect();[...document.querySelectorAll('.md-overview-ctas>button')].every(button=>{const r=button.getBoundingClientRect();return r.left>=panel.left && r.right<=panel.right && r.bottom+10<=facts.top && button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px English overview actions remain inside the screen and clickable');
    await click('[data-overview-topic="collections"]');
    await wait("document.querySelector('.md-dialog-overview')?.open",'English museum collection story');
    await check("document.querySelector('#md-dialog-title').textContent==='Four themes, one Khmer way of life' && document.querySelector('.md-khmer-story').lang==='en' && document.querySelector('.md-khmer-story-prose').innerText.includes('palm-leaf manuscripts')",width+'px collection dialog shows the full English content');
    await escape();
    await section('map'); await click('[data-place-zone="upper"]');
    await check("document.querySelector('.md-featured-title h3').textContent==='Religion & belief' && document.querySelector('[data-place-zone=\"upper\"]').textContent.includes('Upper floor')",width+'px Khmer place introductions follow the English host language');
    await click('[data-action="explore-khmer-place"]');
    await wait("document.querySelector('.md-khmer-place-dialog')?.open",'English Khmer place dialog');
    await check("document.querySelector('#md-dialog-title').textContent==='Religion & belief' && document.querySelector('.md-site-paragraphs').textContent.includes('Theravada') && document.querySelector('.md-site-photo-caption strong').textContent==='Faith and belief displays'",width+'px place story and photograph captions render in English');
    await escape();
  }
  await click('.md-host-controls button:nth-last-child(2)');
  await viewport(1440,960);
  await click('button[title="Switch to Vietnamese"]');
  await evaluate("document.querySelector('.lqv-photo img').dispatchEvent(new Event('error'))");
  await check("document.querySelector('.lqv-photo-fallback') && document.querySelector('#location-quick-title').textContent.includes('Khmer')",'a missing photo retains a complete usable location card');
  await evaluate("document.querySelector('.lqv-toolbar button:first-child').focus()");
  await click('.lqv-toolbar button:first-child');
  await wait("document.querySelector('[data-location-overlay=\"qr\"]')?.open && document.querySelector('[aria-label=\"Đóng mã QR\"]')",'quick-view QR dialog');
  await check("document.activeElement.closest('[data-location-overlay=\"qr\"]') && document.querySelector('[data-location-overlay=\"qr\"]').contains(document.elementFromPoint(innerWidth/2,innerHeight/2))",'QR receives focus and renders above the map');
  await escape();
  await check("!document.querySelector('[data-location-overlay=\"qr\"]') && document.activeElement===document.querySelector('.lqv-toolbar button:first-child')",'closing QR restores its quick-view trigger');
  await click('[data-action="show-location-details"]');
  await wait("document.querySelector('.md-root')", 'museum detail opens from quick information', 35000);
  await evaluate('document.fonts.ready');
  await check("const r=document.querySelector('.md-root').getBoundingClientRect();r.width===innerWidth && r.height===innerHeight && document.querySelectorAll('.md-host-controls button').length===3 && !document.querySelector('.landmark-carousel')",'museum opens full bleed with QR, return and close controls');
  await shot('integrated-fullscreen');
  await section('map'); await click('.md-site-strip button:nth-child(2)'); await click('.md-featured-content .md-button');
  await wait("document.querySelector('.md-dialog-site')?.open", 'integrated site explorer');
  await check("const r=document.querySelector('.md-dialog-site').getBoundingClientRect();Math.abs(r.left-100)<1 && Math.abs(r.right-(innerWidth-100))<1",'integrated site explorer keeps 100px desktop margins');
  await escape();
  await evaluate("document.querySelector('.md-host-controls button:first-child').focus()");
  await click('.md-host-controls button:first-child');
  await wait("document.querySelector('[data-location-overlay=\"qr\"]')?.open && document.querySelector('[aria-label=\"Đóng mã QR\"]')",'fullscreen QR dialog');
  await check("document.querySelector('[data-location-overlay=\"qr\"]').contains(document.elementFromPoint(innerWidth/2,innerHeight/2))",'QR renders above fullscreen details');
  await escape();
  await check("!document.querySelector('.heritage-location-detail').hidden && document.activeElement===document.querySelector('.md-host-controls button:first-child')",'closing fullscreen QR leaves the detail open and restores focus');
  await section('exhibitions'); await click('.md-filters button:nth-child(3)');
  await click('.md-host-controls button:nth-last-child(2)');
  await check("document.querySelector('.heritage-location-detail').hidden && document.activeElement.dataset.action==='show-location-details'",'return control restores quick information on the map');
  await click('[data-action="show-location-details"]');
  await check("!document.getElementById('museo-exhibitions').hidden && document.querySelector('.md-filters button:nth-child(3)').getAttribute('aria-pressed')==='true'",'reopening details preserves the current section and exhibition filter');
  for (const [width,height] of [[768,960],[390,844],[320,568]]) {
    await viewport(width,height); await section('overview');
    await check("const r=document.querySelector('.md-root').getBoundingClientRect(),screen=document.querySelector('.md-main>.md-section:not([hidden])');r.width===innerWidth && r.height===innerHeight && screen.scrollHeight<=screen.clientHeight+2 && screen.scrollWidth<=screen.clientWidth+2",width+'x'+height+' integrated museum fits one full screen');
    if (width===390) await shot('quick-location-full-mobile');
  }
  await evaluate("document.querySelector('.md-host-controls button:first-child').focus()");
  await click('.md-host-controls button:first-child');
  await wait("document.querySelector('[aria-label=\"Đóng mã QR\"]')",'mobile QR content');
  await check("const b=document.querySelector('[aria-label=\"Đóng mã QR\"]'),r=b.getBoundingClientRect();r.top>=0 && r.bottom<=innerHeight && b.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",'short phone QR keeps its close action visible');
  await escape(); await escape();
  await check("document.querySelector('.heritage-location-detail').hidden && document.activeElement.dataset.action==='show-location-details'",'Escape returns to quick information after closing a nested dialog');
  await click('.lqv-close');
  await check("!document.querySelector('.lqv-root') && !document.querySelector('.heritage-location-detail') && Boolean(document.querySelector('.landmark-carousel'))",'closing the quick view returns to the map and location dock');
}
async function overviewChecks() {
  for (const [width,height] of [[1920,1080],[1440,960],[1366,768],[1280,720],[1024,768],[1440,600],[1366,600],[1920,500],[1200,620],[1024,600],[949,347],[844,390],[700,400],[600,400],[512,390],[768,960],[390,844],[390,600],[320,568]]) {
    await viewport(width,height); await section('overview');
    const size=width+'x'+height;
    await check("const screen=document.getElementById('museo-overview'),copy=document.querySelector('.md-overview-copy').getBoundingClientRect(),facts=document.querySelector('.md-facts').getBoundingClientRect(),description=[...document.querySelectorAll('.md-overview-description,.md-overview-preview')].find(node=>node.getBoundingClientRect().height>0).getBoundingClientRect(),actions=document.querySelector('.md-overview-ctas').getBoundingClientRect();description.bottom<=actions.top && copy.bottom+10<=facts.top && screen.scrollHeight<=screen.clientHeight+2 && screen.scrollWidth<=screen.clientWidth+2",size+' overview description and actions fit above the facts within one screen');
    await check("const facts=document.querySelector('.md-facts').getBoundingClientRect();[...document.querySelectorAll('.md-overview-ctas>button')].every(button=>{const r=button.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return r.bottom+10<=facts.top && button.contains(hit)})",size+' both introduction actions remain visible and clickable');
    await check("const panel=document.querySelector('.md-fact-items').getBoundingClientRect();[...document.querySelectorAll('.md-fact>div')].every(node=>{const r=node.getBoundingClientRect();return r.top>=panel.top+3 && r.bottom<=panel.bottom-3})",size+' facts retain complete descriptions within their panel');
    if (width===1440 || width===949 || width===390) await shot('overview-'+size);
  }
  await viewport(1440,600);
  await cdp('Page.navigate', { url: base + '/' });
  await wait("document.querySelector('.landmark-carousel-card[data-site-id=\"bao-tang-khmer\"]')", 'museum location in host', 35000);
  await click('.landmark-carousel-card[data-site-id="bao-tang-khmer"]');
  await wait("document.querySelector('.lqv-root')", 'museum quick information', 35000);
  await click('.lqv-width-toggle');
  await click('[data-action="show-location-details"]');
  await wait("document.querySelector('.md-root')", 'museum detail opens in host', 35000);
  await evaluate('document.fonts.ready'); await section('overview');
  const embeddedIntroFits="const screen=document.getElementById('museo-overview'),copy=document.querySelector('.md-overview-copy').getBoundingClientRect(),facts=document.querySelector('.md-facts').getBoundingClientRect();copy.bottom+10<=facts.top && screen.scrollHeight<=screen.clientHeight+2 && [...document.querySelectorAll('.md-overview-ctas>button')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})";
  await check(embeddedIntroFits, 'short embedded museum keeps description and actions unobstructed');
  await shot('overview-short-embedded');
  await click('.md-host-controls button:nth-last-child(2)');
  await check("document.querySelector('.heritage-location-detail').hidden", 'short detail returns to quick information');
  await click('[data-action="show-location-details"]');
  await wait("document.querySelector('.md-root').getBoundingClientRect().width>=innerWidth-1", 'short detail expands');
  await check(embeddedIntroFits, 'short fullscreen museum keeps description and actions unobstructed');
  await shot('overview-short-fullscreen');
}
async function timelineChecks() {
  await viewport(1440); await section('timeline');
  const periods = [
    {name:'PALEOLITHIC', prefix:'paleolithic-', count:4, last:'paleolithic-archaeological-traces'},
    {name:'HOMO ERECTUS', prefix:'erectus-', count:5, last:'erectus-diet'},
    {name:'NEANDERTHALS', prefix:'neanderthal-', count:5, last:'neanderthal-symbols'},
    {name:'HOMO SAPIENS', prefix:'sapiens-', count:6, last:'sapiens-journeys'},
    {name:'NEOLITHIC', prefix:'neolithic-', count:5, last:'neolithic-polished-stone'},
  ];
  for (const [index, period] of periods.entries()) {
    await click('.md-era-track>button:nth-child(' + (index + 1) + ')');
    await check(`document.querySelector('.md-era-detail h3').innerText===${JSON.stringify(period.name)} && document.querySelector('.md-era-highlights-heading span').innerText===${JSON.stringify(period.name)}`, period.name + ' synchronizes detail and topic heading');
    await check(`const list=document.querySelector('.md-era-highlights-list'),rows=[...list.children];rows.length===${period.count} && rows.every(row=>row.dataset.topicId.startsWith(${JSON.stringify(period.prefix)})) && rows.at(-1).dataset.topicId===${JSON.stringify(period.last)} && list.scrollTop===0 && list.scrollHeight>list.clientHeight`, period.name + ' owns its complete topic list and starts at the top');
    const topics = await evaluate("[...document.querySelectorAll('.md-era-highlights-list>button')].map(row=>({id:row.dataset.topicId,title:row.querySelector('strong').textContent,summary:row.querySelector('small').textContent,photo:row.querySelector('img').src}))");
    for (const topic of topics) {
      const selector = '[data-topic-id="' + topic.id + '"]';
      await evaluate(`const row=document.querySelector(${JSON.stringify(selector)});row.focus();row.click()`);
      await wait("document.querySelector('dialog')?.open && document.querySelector('.md-story-photo')?.complete && document.querySelector('.md-story-photo').naturalWidth>0", topic.id + ' photo and detail open');
      await check(`document.querySelector('#md-dialog-title').textContent===${JSON.stringify(topic.title)} && document.querySelector('dialog .md-eyebrow').innerText===${JSON.stringify(period.name)} && document.querySelector('.md-story-photo').src===${JSON.stringify(topic.photo)} && document.querySelector('.md-story-text').textContent.length>${topic.summary.length} && document.querySelector('.md-story-source').href.startsWith('https://')`, topic.id + ' opens its own photograph, expanded information and source');
      await escape(); await wait("!document.querySelector('dialog')", topic.id + ' closes');
      assert.equal(await evaluate(`document.activeElement.dataset.topicId`), topic.id, 'topic dialog restores its trigger focus');
    }
    await evaluate("document.querySelector('.md-era-highlights-list').scrollTop=0");
    if (index === 3 || index === 4) await shot('timeline-' + period.prefix.slice(0,-1));
  }
  await click('[aria-label="Previous period"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='HOMO SAPIENS' && document.querySelectorAll('.md-era-highlights-list>button').length===6 && document.querySelector('.md-era-highlights-list').scrollTop===0", 'previous-period arrow also changes and resets the topic list');
  await click('[aria-label="Next period detail"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='NEOLITHIC' && document.querySelectorAll('.md-era-highlights-list>button').length===5", 'next-period arrow changes the topic list');
  await click('[aria-label="Next period"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='PALEOLITHIC'", 'timeline track arrow wraps its topic list');
  await click('.md-era-track>button:nth-child(4)');
  const threeTopics = "(()=>{const list=document.querySelector('.md-era-highlights-list'),rect=list.getBoundingClientRect();return [...list.children].filter(row=>{const box=row.getBoundingClientRect();return box.top>=rect.top-1&&box.bottom<=rect.bottom+1}).length===3})()";
  for (const [width,height] of [[1920,1080],[1440,960],[1366,768],[768,960],[390,844],[320,568]]) {
    await viewport(width,height); await section('timeline');
    await evaluate("const list=document.querySelector('.md-era-highlights-list');list.scrollIntoView({block:'end'});list.scrollTop=0");
    await check("const list=document.querySelector('.md-era-highlights-list'),aside=document.querySelector('.md-era-highlights');list.scrollHeight>list.clientHeight && list.scrollWidth<=list.clientWidth+1 && list.getBoundingClientRect().bottom<=aside.getBoundingClientRect().bottom+1 && document.querySelector('.md-scroll').scrollWidth<=document.querySelector('.md-scroll').clientWidth+1", width + 'px timeline list scrolls within its column without horizontal overflow');
    await check(threeTopics, width + 'px timeline shows three complete topics at a time');
    await evaluate("const list=document.querySelector('.md-era-highlights-list');list.scrollTop=list.scrollHeight");
    await check("const list=document.querySelector('.md-era-highlights-list'),last=list.lastElementChild.getBoundingClientRect();last.bottom<=list.getBoundingClientRect().bottom+1 && list.scrollTop>0", width + 'px last topic is reachable');
  }
  await viewport(1440); await section('timeline');
  await evaluate("document.querySelector('.md-era-highlights-list').scrollTop=0"); await sleep(700);
  const box = await evaluate("const rect=document.querySelector('.md-era-highlights-list').getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.top+rect.height/2})");
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:box.x,y:box.y,deltaX:0,deltaY:150});
  await wait("document.querySelector('.md-era-highlights-list').scrollTop>0", 'wheel scrolls the period topics');
  await check("!document.getElementById('museo-timeline').hidden && document.getElementById('museo-timeline').scrollTop===0", 'topic wheel keeps the timeline screen fixed');
  await evaluate("const list=document.querySelector('.md-era-highlights-list');list.scrollTop=list.scrollHeight");
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:box.x,y:box.y,deltaX:0,deltaY:150});
  await check("!document.getElementById('museo-timeline').hidden", 'wheel at the topic list end keeps the timeline screen');
  await viewport(390,844); await section('timeline');
  await evaluate("const list=document.querySelector('.md-era-highlights-list');list.scrollIntoView({block:'end'});list.scrollTop=0");
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  const touchBox = await evaluate("const rect=document.querySelector('.md-era-highlights-list').getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.bottom-20})");
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchBox]});
  for (let step=1;step<=6;step++) {
    await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchBox.x,y:touchBox.y-step*25}]});
    await sleep(30);
  }
  await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait("document.querySelector('.md-era-highlights-list').scrollTop>0", 'phone swipe scrolls more period topics');
  await check("!document.getElementById('museo-timeline').hidden", 'topic swipe keeps the timeline screen');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await shot('timeline-topics-mobile');
  await viewport(1440); await section('timeline');
  await click('.md-era-track>button:first-child'); await shot('desktop-timeline');
}
async function galleryStripChecks() {
  await viewport(1440); await section('tour');
  await click('.md-gallery-strip>button:first-child');
  await evaluate("document.querySelector('.md-gallery-strip').scrollLeft=0");
  await wait("document.querySelector('.md-gallery-strip').scrollLeft<1", 'bottom gallery starts at the first photo');
  const originalPhoto = await evaluate("document.querySelector('.md-tour-art').src");
  const stripBox = await evaluate("const track=document.querySelector('.md-gallery-strip'),rect=track.getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.top+rect.height/2,distance:Math.min(320,rect.width/3)})");
  const dragStrip = async (distance) => {
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:stripBox.x,y:stripBox.y,button:'left',buttons:1,clickCount:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:stripBox.x+Math.sign(distance)*12,y:stripBox.y,button:'left',buttons:1});
    await check("document.querySelector('.md-gallery-strip').hasAttribute('data-dragging') && getComputedStyle(document.querySelector('.md-gallery-strip button')).cursor==='grabbing'", 'bottom gallery shows the grabbing cursor during mouse drag');
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:stripBox.x+distance,y:stripBox.y,button:'left',buttons:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:stripBox.x+distance,y:stripBox.y,button:'left',buttons:0,clickCount:1});
  };
  await dragStrip(-stripBox.distance);
  await wait("document.querySelector('.md-gallery-strip').scrollLeft>50", 'dragging left browses later photos in the bottom gallery');
  await check("document.querySelector('.md-gallery-strip>button:first-child').getAttribute('aria-pressed')==='true' && !document.querySelector('.md-gallery-strip').hasAttribute('data-dragging') && !document.getElementById('museo-tour').hidden", 'releasing a drag keeps the selected photo and tour screen');
  assert.equal(await evaluate("document.querySelector('.md-tour-art').src"), originalPhoto, 'dragging does not change the large photo');
  await shot('tour-strip-drag');
  await dragStrip(stripBox.distance);
  await wait("document.querySelector('.md-gallery-strip').scrollLeft<1", 'dragging right returns to the first photos');
  const photoBox = await evaluate("const rect=document.querySelector('.md-gallery-strip>button:nth-child(3)').getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.top+rect.height/2})");
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...photoBox,button:'left',buttons:1,clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:photoBox.x+2,y:photoBox.y,button:'left',buttons:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:photoBox.x+2,y:photoBox.y,button:'left',buttons:0,clickCount:1});
  await check("document.querySelector('.md-gallery-strip>button:nth-child(3)').getAttribute('aria-pressed')==='true'", 'a mouse click with tiny movement still selects a photo after dragging');
  assert.notEqual(await evaluate("document.querySelector('.md-tour-art').src"), originalPhoto, 'clicking a bottom thumbnail updates the large photo');
  await viewport(390,844); await section('tour');
  await click('.md-gallery-strip>button:first-child');
  await evaluate("document.querySelector('.md-gallery-strip').scrollLeft=0");
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  const touchBox = await evaluate("const rect=document.querySelector('.md-gallery-strip').getBoundingClientRect();({x:rect.right-30,y:rect.top+rect.height/2})");
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touchBox]});
  for (let step=1;step<=6;step++) {
    await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:touchBox.x-step*30,y:touchBox.y}]});
    await sleep(30);
  }
  await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait("document.querySelector('.md-gallery-strip').scrollLeft>50", 'phone swipe browses the bottom photo strip');
  await check("document.querySelector('.md-gallery-strip>button:first-child').getAttribute('aria-pressed')==='true' && !document.getElementById('museo-tour').hidden", 'horizontal phone swipe keeps the selected photo and section');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await viewport(1440); await section('tour');
  await evaluate("document.querySelector('.md-gallery-strip').scrollLeft=0");
  await click('.md-gallery-strip>button:first-child');
}
async function khmerOverviewChecks() {
  await viewport(1440, 960); await section('overview');
  const rowBounds=await evaluate("[...document.querySelectorAll('.md-remarkable-row,.md-visit-row')].map(row=>{const r=row.getBoundingClientRect();return {right:r.right, width:r.width, scrollWidth:row.scrollWidth, clientWidth:row.clientWidth}})");
  assert.ok(rowBounds.every(row=>row.right<=1440-12&&row.scrollWidth<=row.clientWidth+1),'overview support rows fit their columns: '+JSON.stringify(rowBounds));
  await check("const screen=document.getElementById('museo-overview');screen.innerText.includes('BẢO TÀNG') && screen.innerText.includes('KHMER') && !/CHAUVET|FRANCE|UNESCO|36,000|8,500/i.test(screen.innerText) && screen.querySelector('.md-entrance-art').src.includes('khmer-facade')", 'section two contains Khmer museum copy and actual museum photography');
  await check("const facts=[...document.querySelectorAll('.md-fact strong')].map(node=>node.textContent);facts.join('|')==='~1 ha|>1.700 m²|800+|4 chủ đề' && document.querySelectorAll('.md-khmer-map-tiles img').length===9 && [...document.querySelectorAll('.md-khmer-map-tiles img')].every(img=>img.complete&&img.naturalWidth>0)", 'museum grounds, building, collections and themes accompany the local map');
  await check("const h=document.getElementById('md-overview-title').getBoundingClientRect(),eyebrow=document.querySelector('.md-overview-copy>.md-eyebrow').getBoundingClientRect();h.top-eyebrow.bottom>=10", 'Vietnamese display accents retain space below the overview label');
  const topics=['collections','introduction','identity','architecture','performing','everyday','route','learning','location'];
  for (const topic of topics) {
    const selector='[data-overview-topic="'+topic+'"]';
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`); await click(selector);
    await wait("document.querySelector('.md-dialog-overview')?.open",topic+' museum story opens');
    await wait("document.querySelector('.md-khmer-story>.md-story-photo').complete && document.querySelector('.md-khmer-story>.md-story-photo').naturalWidth>0", topic+' museum photograph');
    await check(`document.querySelector('[data-overview-story]').dataset.overviewStory===${JSON.stringify(topic)} && document.querySelector('#md-dialog-title').textContent.length>15 && document.querySelector('.md-khmer-story-prose').innerText.length>400 && document.querySelector('.md-khmer-photo-credit').textContent.includes('Ảnh') && document.activeElement.closest('dialog')!==null && [...document.querySelectorAll('.md-khmer-story-sources a')].every(link=>link.href.startsWith('https://')&&link.rel.includes('noreferrer'))`,topic+' opens expanded content, a credited image and source links with dialog focus');
    if (topic==='collections') await check("document.querySelectorAll('.md-khmer-story-prose>section').length===4 && /Satra/.test(document.querySelector('.md-khmer-story-prose').innerText) && /Ngũ âm/.test(document.querySelector('.md-khmer-story-prose').innerText)", 'collection details cover all four themes, palm-leaf manuscripts and Pinpeat');
    if (topic==='introduction') await check("const text=document.querySelector('.md-khmer-story-prose').innerText;['1992','1995','1997','2024','1.000'].every(value=>text.includes(value))", 'museum introduction explains the differing historical dates and collection counts');
    if (topic==='location') await check("const text=document.querySelector('.md-khmer-story-prose').innerText;['Nguyệt Hóa','Vĩnh Long','Phường 8','07:00–11:00','13:00–17:00','tham khảo'].every(value=>text.includes(value))", 'visiting details distinguish current and former addresses and identify reference hours');
    if (topic==='collections') await shot('khmer-collections-desktop');
    await escape(); await wait("!document.querySelector('dialog')",topic+' museum story closes');
    await check(`document.activeElement===document.querySelector(${JSON.stringify(selector)}) && !document.getElementById('museo-overview').hidden`,topic+' returns focus to its trigger and keeps the overview selected');
  }
  const photos=['khmer-temple-model','khmer-tools','khmer-pinpeat','khmer-visitors'];
  for (let index=0;index<5;index++) {
    await wait("document.querySelector('.md-chamber>img').complete && document.querySelector('.md-chamber>img').naturalWidth>0",'museum gallery photograph');
    await check(`document.querySelector('.md-chamber>img').src.includes(${JSON.stringify(photos[index%4])}) && document.querySelector('.md-chamber-caption>div>small').textContent==='${String(index%4+1).padStart(2,'0')} / 04' && document.querySelector('.md-chamber>img').alt.length>30`,'museum gallery synchronizes photographs, alt text and counter '+index);
    if (index<4) await click('[data-action="overview-next-photo"]');
  }
  await click('[data-action="overview-previous-photo"]');
  await check("document.querySelector('.md-chamber>img').src.includes('khmer-visitors') && document.querySelector('.md-chamber-caption strong').textContent==='HIỆN VẬT VÀ CON NGƯỜI'", 'previous museum photo wraps to the last photograph and its caption');
  await section('map'); await section('overview');
  await check("document.querySelector('.md-chamber>img').src.includes('khmer-visitors')", 'museum gallery selection persists when switching screens');
  await click('[data-action="overview-next-photo"]');
  for (const [width,height] of [[1440,960],[768,960],[390,844],[320,568],[844,390]]) {
    await viewport(width,height); await section('overview');
    await click('[data-overview-topic="collections"]');
    await wait("document.querySelector('.md-dialog-overview')?.open",'responsive museum story');
    await check("const dialog=document.querySelector('.md-dialog-overview'),r=dialog.getBoundingClientRect();r.left>=12 && r.right<=innerWidth-12 && r.top>=12 && r.bottom<=innerHeight-12 && dialog.scrollWidth<=dialog.clientWidth+1",width+'x'+height+' museum reading dialog fits the viewport');
    await evaluate("const dialog=document.querySelector('.md-dialog-overview');dialog.scrollTop=dialog.scrollHeight");
    await check("const button=document.querySelector('.md-dialog-close'),r=button.getBoundingClientRect();r.top>=0 && r.bottom<=innerHeight && button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",width+'x'+height+' museum story close action stays visible after scrolling');
    if(width===390) await shot('khmer-collections-mobile');
    await click('.md-dialog-close'); await wait("!document.querySelector('dialog')", 'responsive museum story closes');
  }
  await viewport(1440,960); await section('overview'); await shot('khmer-overview-desktop');
  await viewport(390,844); await shot('khmer-overview-mobile');
}
async function khmerPlacesChecks() {
  await viewport(1440,960); await section('map');
  await check("document.querySelectorAll('.md-site-strip button').length===16 && document.querySelectorAll('[data-place-zone]').length===4 && !document.querySelector('.md-world-map')", 'Khmer section has 16 points, four areas and no prehistoric world map');
  await check("const pins=[...document.querySelectorAll('.md-places-geo-pin')];pins.length===3 && pins.some(pin=>pin.dataset.placeId==='entrance'&&pin.dataset.latitude==='9.9161668'&&pin.dataset.longitude==='106.3049936') && document.querySelectorAll('.md-places-tiles img').length===9", 'heritage map uses registered museum coordinates and cached imagery');
  await click('.md-places-geo-pin[data-place-id="pond"]');
  await check("document.querySelector('.md-featured-title h3').textContent==='Ao Bà Om' && document.querySelector('.md-site-strip [data-place-id=\"pond\"]').getAttribute('aria-pressed')==='true'", 'map markers synchronize the feature and thumbnail selection');
  for (const [zone,count] of [['grounds',4],['ground',2],['upper',7]]) {
    await click('[data-place-zone="'+zone+'"]');
    await check(`document.querySelectorAll('.md-places-topic').length===${count} && document.querySelector('[data-place-zone="${zone}"]').getAttribute('aria-pressed')==='true' && document.querySelector('.md-places-plan-note').textContent.includes('không phải mặt bằng')`, zone+' shows a labelled thematic diagram with the right topics');
    await shot('khmer-places-'+zone);
    await click('.md-places-topic:last-of-type');
    await check("document.querySelector('.md-featured-site').dataset.selectedPlace===document.querySelector('.md-places-topic[aria-pressed=\"true\"]').dataset.placeId", zone+' diagram selection opens the corresponding introduction');
  }
  await click('.md-site-strip [data-place-id="entrance"]');
  await click('[aria-label="Điểm trước"]');
  await check("document.querySelector('.md-featured-site').dataset.selectedPlace==='performing' && document.querySelector('[data-place-zone=\"upper\"]').getAttribute('aria-pressed')==='true' && document.querySelector('.md-site-strip').scrollLeft>0", 'previous arrow wraps across areas and reveals the matching thumbnail');
  await click('[aria-label="Điểm tiếp theo"]');
  await check("document.querySelector('.md-featured-site').dataset.selectedPlace==='entrance' && document.querySelector('[data-place-zone=\"landscape\"]').getAttribute('aria-pressed')==='true'", 'next arrow wraps to the heritage map');
  const ids=await evaluate("[...document.querySelectorAll('.md-site-strip button')].map(button=>button.dataset.placeId)");
  const explore='[data-action="explore-khmer-place"]';
  for (const id of ids) {
    await click('.md-site-strip [data-place-id="'+id+'"]');
    const title=await evaluate("document.querySelector('.md-featured-title h3').textContent");
    await evaluate(`document.querySelector(${JSON.stringify(explore)}).focus();document.querySelector(${JSON.stringify(explore)}).click()`);
    await wait("document.querySelector('.md-khmer-place-dialog')?.open",id+' details');
    await check(`document.querySelector('#md-dialog-title').textContent===${JSON.stringify(title)} && document.querySelector('.md-site-paragraphs').children.length===3 && document.querySelector('.md-site-highlight-grid').children.length===3 && document.querySelectorAll('[data-related-place]').length===3 && document.activeElement.closest('dialog')!==null`,id+' has expanded content, observation prompts, related places and dialog focus');
    const count=await evaluate("document.querySelectorAll('.md-site-thumbnails button').length");
    assert.ok(count>=3);
    for(let n=1;n<=count;n++) {
      await click('.md-site-thumbnails button:nth-child('+n+')');
      await wait("document.querySelector('.md-site-main-image').complete && document.querySelector('.md-site-main-image').naturalWidth>0",id+' photograph '+n);
      await check("document.querySelector('.md-site-photo-caption strong').textContent.length>5 && document.querySelector('.md-site-photo-caption a').href.startsWith('https://')",id+' photo '+n+' has a caption and source');
    }
    await click('[aria-label="Ảnh tiếp theo của điểm đến"]');
    await check("document.querySelector('.md-site-thumbnails button:first-child').getAttribute('aria-pressed')==='true'",id+' gallery wraps forward');
    await click('[aria-label="Ảnh trước của điểm đến"]');
    await check("document.querySelector('.md-site-thumbnails button:last-child').getAttribute('aria-pressed')==='true'",id+' gallery wraps backwards');
    if(['memorial','performing','daily-life'].includes(id)) await shot('khmer-place-'+id);
    await escape();await wait("!document.querySelector('dialog')",id+' closes');
    await check(`document.activeElement===document.querySelector(${JSON.stringify(explore)})`,id+' restores focus to the detail action');
  }
  await click('.md-site-strip [data-place-id="archaeology"]');await click(explore);
  await check("document.querySelector('.md-site-paragraphs').textContent.includes('Bảo tàng tỉnh Vĩnh Long') && document.querySelector('.md-site-paragraphs').textContent.includes('không khẳng định')", 'archaeology distinguishes regional treasure custody from this museum display');
  await click('[data-related-place="manuscripts"]');await wait("!document.querySelector('dialog')",'related topic selected');
  await check("document.querySelector('.md-featured-site').dataset.selectedPlace==='manuscripts'",'related place returns to its synchronized introduction');
  await click('.md-view-all');await wait("document.querySelector('.md-dialog-places')?.open",'place directory');
  await check("document.querySelectorAll('.md-place-directory-results button').length===16",'directory lists all points');
  await click('[data-directory-zone="upper"]');
  await check("document.querySelectorAll('.md-place-directory-results button').length===7",'directory area filter selects seven upstairs topics');
  const enterQuery=async query=>evaluate(`const input=document.querySelector('.md-search-field input');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,${JSON.stringify(query)});input.dispatchEvent(new Event('input',{bubbles:true}));`);
  await enterQuery('ngu am');
  await wait("document.querySelectorAll('.md-place-directory-results button').length===1",'accent-insensitive Vietnamese search');
  await check("document.querySelector('.md-place-directory-results button').dataset.directoryPlace==='performing'",'unaccented query finds Pinpeat performing arts');
  await enterQuery('khongco123');
  await check("document.querySelector('.md-place-empty') && document.querySelectorAll('.md-place-directory-results button').length===0",'directory handles an empty search');
  await enterQuery('pinpeat');await wait("document.querySelectorAll('.md-place-directory-results button').length===1",'English keyword search');
  await click('[data-directory-place="performing"]');await wait("!document.querySelector('dialog')",'directory selected point');
  await check("document.querySelector('.md-featured-site').dataset.selectedPlace==='performing'",'directory selection updates area, feature and strip');
  await section('overview');await section('map');
  await check("document.querySelector('.md-featured-site').dataset.selectedPlace==='performing'",'selected place survives screen navigation');
  await click(explore);
  for (const [width,height] of [[1920,1080],[1440,600],[768,1024],[390,844],[320,568],[844,390]]) {
    await viewport(width,height);await sleep(150);
    await check("const r=document.querySelector('.md-dialog-site').getBoundingClientRect(),content=document.querySelector('.md-site-explorer');Math.abs(r.left-(innerWidth-r.right))<1 && r.left>=11 && r.top>=0 && r.bottom<=innerHeight+1 && content.scrollWidth<=content.clientWidth+1",width+'x'+height+' Khmer explorer is centred without overflow');
    if(width>=1024)await check("Math.abs(document.querySelector('.md-dialog-site').getBoundingClientRect().left-100)<1",width+'px explorer retains 100px side margins');
    await evaluate("const content=document.querySelector('.md-site-explorer');content.scrollTop=content.scrollHeight");
    await check("const r=document.querySelector('.md-dialog-close').getBoundingClientRect();r.top>=0 && r.bottom<=innerHeight && document.querySelector('.md-dialog-close').contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",width+'px close control remains reachable while reading');
    await evaluate("document.querySelector('.md-site-explorer').scrollTop=0");await shot('khmer-place-dialog-'+width);
  }
  await escape();
  for (const [width,height] of [[1440,600],[390,844],[320,568],[844,390],[667,375]]) {
    await viewport(width,height);await section('map');
    for(const id of ids) {
      await click('.md-site-strip [data-place-id="'+id+'"]');
      await check("const panel=document.querySelector('.md-featured-site').getBoundingClientRect(),cta=document.querySelector('[data-action=\"explore-khmer-place\"]').getBoundingClientRect(),tags=document.querySelector('.md-featured-tags').getBoundingClientRect(),copy=document.querySelector(innerWidth<1000?'.md-site-preview':'.md-site-long-description').getBoundingClientRect();cta.bottom<=panel.bottom+1&&copy.bottom<=tags.top+1&&tags.bottom<=cta.top+1",width+'x'+height+' '+id+' has readable copy and separate, reachable controls');
    }
  }
  for (const [width,height] of [[1920,1080],[1440,600],[1024,768],[768,1024],[390,844],[320,568],[844,390],[667,375]]) {
    await viewport(width,height);await section('map');
    for(const zone of ['landscape','grounds','ground','upper']) {
      await click('[data-place-zone="'+zone+'"]');await sleep(100);
      await check("const section=document.querySelector('.md-section:not([hidden])'),s=section.getBoundingClientRect(),panel=document.querySelector('.md-featured-site').getBoundingClientRect(),action=document.querySelector('[data-action=\"explore-khmer-place\"]').getBoundingClientRect();section.scrollHeight<=section.clientHeight+1&&section.scrollWidth<=section.clientWidth+1&&action.bottom<=panel.bottom+1&&action.right<=panel.right+1&&s.top>=0&&s.bottom<=innerHeight",width+'x'+height+' '+zone+' fits one full screen and keeps its detail action');
      await check("[...document.querySelectorAll('.md-places-topic,.md-places-geo-pin')].every(node=>{const r=node.getBoundingClientRect(),p=node.closest('.md-map-stage').getBoundingClientRect(),track=node.closest('.md-places-topic-plan');return r.top>=p.top-1&&r.bottom<=p.bottom+1&&(track&&getComputedStyle(track).overflowX==='auto'||r.left>=p.left-1&&r.right<=p.right+1)})",width+'x'+height+' '+zone+' keeps markers within the stage or its horizontal topic track');
      if (width<1000 && zone!=='landscape') {
        await evaluate("const track=document.querySelector('.md-places-topic-plan');track.scrollLeft=track.scrollWidth");
        await check("const track=document.querySelector('.md-places-topic-plan'),last=track.lastElementChild.getBoundingClientRect(),r=track.getBoundingClientRect();last.right<=r.right+1 && last.left>=r.left-1",width+'px '+zone+' last topic remains reachable by horizontal scrolling');
      }
    }
    await shot('khmer-places-fit-'+width+'x'+height);
  }
  await viewport(1440,960);await click('.md-site-strip [data-place-id="entrance"]');await section('map');await shot('desktop-map');
}

async function main() {
  fs.mkdirSync(profile, { recursive: true }); fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
  chrome = spawn(process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', ['--headless=new', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  const portfile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !fs.existsSync(portfile); i++) await sleep(100);
  assert.ok(fs.existsSync(portfile), 'Chrome started');
  const port = fs.readFileSync(portfile, 'utf8').split('\n')[0];
  const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  ws = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) { const entry = pending.get(message.id); if (!entry) return; pending.delete(message.id); clearTimeout(entry.timeout); message.error ? entry.reject(Error(JSON.stringify(message.error))) : entry.resolve(message.result); }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    // The existing host has no default favicon; validate the museum's explicit
    // icon and all other requested local resources without changing host branding.
    if (message.method === 'Network.responseReceived' && message.params.response.status === 404 && message.params.response.url.startsWith(base) && message.params.response.url !== base + '/favicon.ico') missing.push(message.params.response.url);
  });
  await cdp('Runtime.enable'); await cdp('Page.enable'); await cdp('Network.enable');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await viewport(1440);
  await cdp('Page.navigate', { url: base + '/bao-tang-khmer.html' });
  await wait("document.querySelectorAll('.md-section').length===6", 'six museum sections');
  await evaluate('document.fonts.ready');
  await wait("document.querySelector('.md-hero-art').complete", 'hero photograph');
  await shot('desktop-hero');
  if (process.argv.includes('--quick-view-only')) { await quickViewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--overview-only')) { await overviewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--khmer-overview-only')) { await khmerOverviewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--gallery-only')) { await galleryStripChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--timeline-only')) { await timelineChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--places-only')) { await khmerPlacesChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--capture-only')) {
    for (const name of ['overview', 'map', 'timeline', 'tour', 'exhibitions']) { await section(name); await shot('desktop-' + name); }
    return;
  }
  await check("['hero','overview','map','timeline','tour','exhibitions'].every(name=>document.getElementById('museo-'+name))", 'all six reference sections are present');
  const oneScreen = "(()=>{const viewport=document.querySelector('.md-scroll').getBoundingClientRect(),visible=[...document.querySelectorAll('.md-main>.md-section')].filter(section=>!section.hidden);if(visible.length!==1)return false;const rect=visible[0].getBoundingClientRect();return Math.abs(rect.top-viewport.top)<1&&Math.abs(rect.bottom-viewport.bottom)<1&&Math.abs(rect.left-viewport.left)<1&&Math.abs(rect.right-viewport.right)<1&&document.querySelector('.md-scroll').scrollTop===0})()";
  const primaryContentFits = "(()=>{const screen=document.querySelector('.md-section:not([hidden])');const pairs=[['.md-hero-copy','.md-frame'],['.md-hero-context','.md-frame'],['.md-overview-copy','.md-overview-top'],['.md-featured-content > .md-button','.md-featured-site'],['.md-map-copy','.md-map-stage'],['.md-evolution-copy','.md-evolution-top'],['.md-era-facts','.md-era-story'],['.md-tour-ctas','.md-tour-frame'],['.md-tour-scene-caption','.md-tour-frame'],['.md-gallery-strip','.md-tour-frame']];return pairs.every(([child,parent])=>{const c=screen.querySelector(child),p=screen.querySelector(parent);if(!c||!p)return true;const cr=c.getBoundingClientRect(),pr=p.getBoundingClientRect();return cr.top>=pr.top-2&&cr.bottom<=pr.bottom+2})})()";
  for (const [width, height] of [[1920,1080],[1440,960],[1366,768],[1920,800],[2560,1440],[768,960],[390,844],[320,568]]) {
    await viewport(width, height);
    for (const name of ['hero','overview','map','timeline','tour','exhibitions']) {
      await section(name);
      await check(oneScreen, width + 'px ' + name + ' occupies the viewport alone');
      await check("const section=document.querySelector('.md-main>.md-section:not([hidden])');section.scrollHeight<=section.clientHeight+2 && section.scrollWidth<=section.clientWidth+2", width + 'px ' + name + ' fits one screen without outer scrolling');
      await check(primaryContentFits, width + 'px ' + name + ' keeps headings, copy and controls inside their panels');
      await check("const controls=document.querySelector('.md-host-controls').getBoundingClientRect(),footer=document.querySelector('.md-screen-nav').getBoundingClientRect();controls.top>=footer.top && controls.bottom<=footer.bottom", width + 'px host controls stay in the footer');
      if (name === 'hero') await check("const copy=document.querySelector('.md-hero-copy').getBoundingClientRect(),context=document.querySelector('.md-hero-context').getBoundingClientRect(),dock=document.querySelector('.md-chapter-dock').getBoundingClientRect();copy.bottom+3<=context.top && context.bottom+3<=dock.top && document.querySelectorAll('.md-hero-context article').length===3", width + 'px introduction, related topics and chapter dock do not overlap');
      if (name === 'tour') await check("const copy=document.querySelector('.md-tour-copy').getBoundingClientRect(),caption=document.querySelector('.md-tour-scene-caption').getBoundingClientRect(),strip=document.querySelector('.md-gallery-strip').getBoundingClientRect();copy.bottom+3<=caption.top && caption.bottom+3<=strip.top", width + 'px tour copy, scene context and photo strip do not overlap');
      if (process.argv.includes('--layout-only')) await shot('fit-' + width + 'x' + height + '-' + name);
    }
    await shot('single-screen-exhibitions-' + width);
  }
  if (process.argv.includes('--layout-only')) { assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  await khmerOverviewChecks();
  await viewport(1440); await section('hero');
  await click('.md-screen-next');
  await check("!document.getElementById('museo-overview').hidden && document.querySelector('.md-screen-label').innerText.startsWith('02 / 06')", 'Next changes the complete screen and its footer');
  await click('.md-screen-previous');
  await check("!document.getElementById('museo-hero').hidden && document.querySelector('.md-screen-previous').disabled", 'Previous returns to the first screen without exposing its neighbor');
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:700,y:400,deltaX:0,deltaY:120});
  await wait("!document.getElementById('museo-overview').hidden",'wheel advances one complete screen');
  for(let i=0;i<4;i++) await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:700,y:400,deltaX:0,deltaY:60});
  await check("!document.getElementById('museo-overview').hidden", 'one wheel gesture does not skip several screens');
  await check(oneScreen, 'wheel changes never expose two sections');
  await evaluate("document.getElementById('museo-overview').focus()");
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'PageDown',code:'PageDown',windowsVirtualKeyCode:34});
  await check("!document.getElementById('museo-map').hidden", 'Page Down changes the screen');
  await viewport(320,568); await section('overview'); await sleep(700);
  const overviewPanelBox = await evaluate("const rect=document.querySelector('.md-overview-bottom>div:first-child').getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.top+rect.height/2})");
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',...overviewPanelBox,deltaX:0,deltaY:150});
  await wait("document.querySelector('.md-overview-bottom>div:first-child').scrollTop>0", 'long overview highlights scroll within their own panel');
  await check("!document.getElementById('museo-overview').hidden && document.getElementById('museo-overview').scrollTop===0", 'scrolling highlight details keeps the whole overview screen fixed');
  await check(oneScreen, 'internal scrolling never exposes the next section');
  await sleep(200);
  await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:160,y:80,deltaX:0,deltaY:150});
  await wait("!document.getElementById('museo-map').hidden", 'wheel outside a nested collection advances a whole screen');
  await viewport(390,844);
  await section('hero');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:170,y:430}]});
  for(let step=1;step<=6;step++) {
    await cdp('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:170,y:430-step*20}]});
    await sleep(25);
  }
  await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait("!document.getElementById('museo-overview').hidden",'vertical phone swipe advances one complete screen');
  await check(oneScreen, 'vertical swipe never exposes two sections');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await evaluate("document.querySelector('.md-screen-next').focus()");
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'PageUp',code:'PageUp',windowsVirtualKeyCode:33});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'PageUp',code:'PageUp',windowsVirtualKeyCode:33});
  await check("!document.getElementById('museo-hero').hidden", 'Page Up also works with footer focus');
  await viewport(1440); await section('hero');
  await check('document.fonts.check(\'900 18px "Museo Display"\') && document.fonts.check(\'14px "Museo Mono"\')', 'self-hosted compressed museum fonts load');
  await check("document.querySelector('.md-scroll').scrollWidth<=document.querySelector('.md-scroll').clientWidth+1", 'desktop has no horizontal page overflow');
  const initialHeroCopy = await evaluate("document.querySelector('.md-hero-copy').innerText");
  const initialHeroPhoto = await evaluate("document.querySelector('.md-hero-art').src");
  for (let index = 1; index <= 4; index++) {
    const previousPhoto = await evaluate("document.querySelector('.md-hero-art').src");
    await click('.md-hero-arrows button:last-child');
    await wait("document.querySelector('.md-hero-art').complete && document.querySelector('.md-hero-art').naturalWidth>0", 'next hero image loads');
    assert.notEqual(await evaluate("document.querySelector('.md-hero-art').src"), previousPhoto);
    assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"), initialHeroCopy);
    await check(`document.querySelectorAll('.md-hero-bottom button')[${index % 4}].getAttribute('aria-pressed')==='true' && document.querySelectorAll('.md-hero-bottom button[aria-pressed="true"]').length===1`, 'next hero image synchronizes its tab and keeps copy fixed, step ' + index);
  }
  assert.equal(await evaluate("document.querySelector('.md-hero-art').src"), initialHeroPhoto, 'next arrow wraps to the first image');
  await click('.md-hero-arrows button:first-child');
  await check("document.querySelector('.md-hero-bottom button:last-child').getAttribute('aria-pressed')==='true' && document.querySelector('.md-slide-count').innerText.includes('04 / 04')", 'previous hero arrow wraps to the last image and updates the counter');
  assert.notEqual(await evaluate("document.querySelector('.md-hero-art').src"), initialHeroPhoto);
  assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"), initialHeroCopy);
  await click('.md-hero-bottom button:nth-of-type(3)');
  await wait("document.querySelector('.md-hero-art').complete && document.querySelector('.md-hero-art').naturalWidth>0", 'selected hero image loads');
  await check("document.querySelector('.md-hero-art').src.includes('exhibition-environment') && document.querySelector('.md-hero-bottom button:nth-of-type(3)').getAttribute('aria-pressed')==='true'", 'hero tab selects its matching image');
  assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"), initialHeroCopy);
  await click('.md-hero-bottom button:first-of-type');
  assert.equal(await evaluate("document.querySelector('.md-hero-art').src"), initialHeroPhoto);
  await click('.md-chapter-dock button:nth-child(2)');
  await check("!document.getElementById('museo-map').hidden && document.getElementById('museo-hero').hidden", 'chapter dock selects the entire map screen');
  await khmerPlacesChecks();
  await section('overview'); await click('.md-chamber-caption button:last-child');
  await check("document.querySelector('.md-chamber-caption strong').innerText==='ĐỜI SỐNG THƯỜNG NHẬT'", 'museum gallery synchronizes image and caption');
  await click('.md-chamber-caption button:first-child'); await shot('desktop-overview');
  await timelineChecks();
  await viewport(390,844); await section('overview');
  await evaluate("const strip=document.querySelector('.md-overview-bottom');strip.scrollLeft=strip.scrollWidth");
  await check("const strip=document.querySelector('.md-overview-bottom'),last=strip.lastElementChild.getBoundingClientRect(),rect=strip.getBoundingClientRect();strip.scrollLeft>0 && last.right<=rect.right+1 && !document.getElementById('museo-overview').hidden", 'phone overview panels browse horizontally within one screen');
  await evaluate("const strip=document.querySelector('.md-fact-items');strip.scrollLeft=strip.scrollWidth");
  await check("const strip=document.querySelector('.md-fact-items');strip.scrollLeft>0 && strip.lastElementChild.getBoundingClientRect().right<=strip.getBoundingClientRect().right+1", 'all four compact overview metrics remain reachable');
  await section('timeline');
  await click('.md-era-preview button');
  await wait("document.querySelector('dialog')?.open", 'compact period overview opens');
  await check("document.querySelector('#md-dialog-title').textContent==='Paleolithic' && document.querySelector('.md-story-text').textContent.length>document.querySelector('.md-era-preview').textContent.length", 'Read more opens the full period description');
  await escape(); await wait("!document.querySelector('dialog')", 'compact period overview closes');
  await evaluate("const strip=document.querySelector('.md-era-detail');strip.scrollLeft=strip.scrollWidth");
  await check("const strip=document.querySelector('.md-era-detail'),topics=document.querySelector('.md-era-highlights').getBoundingClientRect();strip.scrollLeft>0 && topics.right<=strip.getBoundingClientRect().right+1 && !document.getElementById('museo-timeline').hidden", 'phone timeline topic panel is reachable with horizontal browsing');
  await viewport(1440);
  await section('tour');
  const oldPhoto = await evaluate("document.querySelector('.md-tour-art').src");
  await click('.md-gallery-strip>button:nth-child(3)');
  assert.notEqual(await evaluate("document.querySelector('.md-tour-art').src"), oldPhoto);
  console.log('PASS gallery selection changes the scene');
  await check("document.querySelector('.md-tour-scene-caption h3').textContent===document.querySelector('.md-gallery-strip>button:nth-child(3)').getAttribute('aria-label').slice(5)", 'tour photograph and added scene caption stay synchronized');
  await click('.md-gallery-strip>button:first-child'); await shot('desktop-tour');
  await galleryStripChecks();
  await check("!document.querySelector('.md-tour-audio') && document.querySelector('.md-tour-gallery-toggle').getAttribute('aria-expanded')==='false' && document.querySelector('.md-tour-photo-panel').hidden", 'speaker is replaced by a collapsed gallery control');
  await evaluate("document.querySelector('.md-tour-gallery-toggle').focus();document.querySelector('.md-tour-gallery-toggle').click()");
  await escape();
  await check("document.querySelector('.md-tour-photo-panel').hidden", 'Escape collapses the gallery immediately after opening');
  await click('.md-tour-gallery-toggle');
  await check("const panel=document.querySelector('.md-tour-photo-panel').getBoundingClientRect(),toggle=document.querySelector('.md-tour-gallery-toggle').getBoundingClientRect();!document.querySelector('.md-tour-photo-panel').hidden && panel.left<toggle.left && panel.right<=toggle.right", 'photo drawer expands to the left of its control');
  const threeDrawerPhotos = "(()=>{const track=document.querySelector('.md-tour-photo-track'),rect=track.getBoundingClientRect();const visible=[...track.children].filter(photo=>{const box=photo.getBoundingClientRect();return box.left>=rect.left-1 && box.right<=rect.right+1});return visible.length===3 && track.scrollWidth>track.clientWidth})()";
  await check(threeDrawerPhotos, 'drawer shows exactly three of its six photos');
  for (let index = 1; index <= 3; index++) {
    await click('.md-tour-photo-controls button:last-child');
    await wait(`document.querySelector('.md-tour-photo-controls span').innerText.startsWith('${String(index + 1).padStart(2, '0')}')`, 'drawer advances by one photo');
  }
  await check("document.querySelector('.md-tour-photo-controls button:last-child').disabled && document.querySelector('.md-tour-photo-controls span').innerText.includes('04 - 06 / 06')", 'all remaining photos can be reached and the end arrow disables');
  await wait(threeDrawerPhotos, 'gallery finishes sliding to its last three photos');
  await check(threeDrawerPhotos, 'last gallery position still shows three complete photos');
  await click('.md-tour-photo-card:last-child');
  await check("document.querySelector('.md-tour-photo-card:last-child').getAttribute('aria-pressed')==='true' && document.querySelector('.md-gallery-strip>button:last-child').getAttribute('aria-pressed')==='true' && document.querySelector('.md-tour-art').src.includes('exhibition-origins')", 'drawer selection synchronizes the large photograph and bottom gallery');
  await evaluate("document.querySelector('.md-tour-photo-track').scrollLeft=0");
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.startsWith('01')", 'drawer returns to its start for drag verification');
  const dragBox = await evaluate("const track=document.querySelector('.md-tour-photo-track'),rect=track.getBoundingClientRect();({x:rect.left+rect.width/2,y:rect.top+40,step:track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap)})");
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x: dragBox.x, y: dragBox.y, button: 'left', buttons: 1, clickCount: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: dragBox.x - 12, y: dragBox.y, button: 'left', buttons: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x: dragBox.x - dragBox.step, y: dragBox.y, button: 'left', buttons: 1 });
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x: dragBox.x - dragBox.step, y: dragBox.y, button: 'left', buttons: 0, clickCount: 1 });
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.startsWith('02')", 'mouse drag advances the gallery');
  await wait(threeDrawerPhotos, 'mouse drag snaps to three complete photos');
  await check("document.querySelector('.md-gallery-strip>button:last-child').getAttribute('aria-pressed')==='true'", 'dragging browses photos without selecting one');
  await evaluate("document.querySelector('.md-tour-photo-track').focus()");
  await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
  await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft', windowsVirtualKeyCode: 37 });
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.startsWith('01')", 'keyboard left arrow browses the gallery');
  for (const width of [1920, 1440, 768, 390, 320]) {
    await viewport(width, 960); await section('tour');
    await click('.md-tour-photo-card:first-child');
    await wait("document.querySelector('.md-tour-photo-track').scrollLeft<1", 'resized drawer starts at the first photo');
    await check(threeDrawerPhotos, width + 'px drawer shows exactly three photos');
    await check("const panel=document.querySelector('.md-tour-photo-panel').getBoundingClientRect(),frame=document.querySelector('.md-tour-frame').getBoundingClientRect();panel.left>=frame.left && panel.right<=frame.right && document.querySelector('.md-scroll').scrollWidth<=document.querySelector('.md-scroll').clientWidth+1", width + 'px drawer fits inside the section without horizontal page overflow');
    await shot('tour-drawer-' + width);
  }
  await viewport(390, 844); await section('tour');
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
  const touchBox = await evaluate("const rect=document.querySelector('.md-tour-photo-track').getBoundingClientRect();({x:rect.right-15,y:rect.top+40,distance:rect.width*0.55})");
  await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchBox.x, y: touchBox.y }] });
  for (let step = 1; step <= 6; step++) {
    await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchBox.x - touchBox.distance * step / 6, y: touchBox.y }] });
    await sleep(30);
  }
  await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await wait("document.querySelector('.md-tour-photo-track').scrollLeft>20", 'phone touch swipe browses remaining photos');
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
  await click('.md-tour-gallery-toggle');
  await check("document.querySelector('.md-tour-photo-panel').hidden && document.querySelector('.md-tour-gallery-toggle').getAttribute('aria-expanded')==='false'", 'collapse button hides the photo drawer');
  await click('.md-tour-gallery-toggle');
  await evaluate("document.querySelector('.md-tour-photo-track').focus()");
  await escape();
  await check("document.querySelector('.md-tour-photo-panel').hidden && document.activeElement===document.querySelector('.md-tour-gallery-toggle')", 'Escape collapses the drawer and restores control focus');
  await viewport(1440); await section('tour');
  await click('.md-gallery-strip>button:first-child');
  await evaluate("document.querySelector('.md-tour-ctas button:last-child').focus();document.querySelector('.md-tour-ctas button:last-child').click()");
  await wait("document.querySelector('dialog')?.open", 'art dialog opens');
  await check("document.activeElement.closest('dialog') && document.querySelector('dialog').innerText.includes('The art of Chauvet')", 'art dialog owns keyboard focus');
  await escape(); await wait("!document.querySelector('dialog')", 'Escape closes the art dialog');
  await check("document.activeElement===document.querySelector('.md-tour-ctas button:last-child')", 'dialog restores focus to its trigger');
  await click('.md-tour-ctas button:first-child'); await wait("document.querySelector('dialog')?.open", 'virtual tour opens');
  await click('.md-tour-dialog-controls button:last-child');
  await check("document.querySelector('.md-tour-dialog-caption h3').innerText==='The main chamber'", 'virtual tour advances to the next scene');
  await escape(); await section('exhibitions');
  await click('.md-filters>button:nth-child(3)');
  await check("document.querySelectorAll('.md-exhibition-card').length===1 && document.querySelector('.md-exhibition-card').innerText.includes('TOOLS')", 'Tools filter shows only the tools exhibition');
  await check("const card=document.querySelector('.md-exhibition-card').getBoundingClientRect(),grid=document.querySelector('.md-exhibition-grid').getBoundingClientRect();Math.abs(card.width-grid.width)<2 && document.querySelector('.md-exhibition-detail').textContent.length>50", 'a filtered exhibition fills the grid and shows additional context');
  await click('.md-filters>button:nth-child(5)');
  await check("document.querySelectorAll('.md-exhibition-card').length===2", 'Environment filter shows its two exhibitions');
  await click('.md-filters>button:first-child'); await shot('desktop-exhibitions');
  await section('map'); await click('.md-view-all'); await wait("document.querySelector('dialog')?.open", 'search opens');
  await evaluate("const input=document.querySelector('.md-search-field input');const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(input,'ngu am');input.dispatchEvent(new Event('input',{bubbles:true}));");
  await wait("document.querySelectorAll('.md-place-directory-results>button').length===1", 'directory search filters Khmer cultural topics');
  await escape();
  for (const width of [390, 320, 768]) {
    await viewport(width, 844); await section('hero'); await shot('hero-' + width);
    await check("document.querySelector('.md-scroll').scrollWidth<=document.querySelector('.md-scroll').clientWidth+1", width + 'px layout has no horizontal page overflow');
    await section('exhibitions'); await shot('exhibitions-' + width);
  }
  await quickViewChecks();
  assert.deepEqual(missing, [], 'No missing local assets');
  assert.deepEqual(exceptions, [], 'No browser exceptions');
  console.log('PASS standalone and integrated museum, no missing files or browser exceptions');
}
main().catch(async error => { console.error(error); console.error('Browser exceptions:', exceptions); if (ws?.readyState === 1) await shot('failure'); process.exitCode = 1; }).finally(async () => { if (ws?.readyState === 1) await cdp('Browser.close').catch(() => {}); ws?.close(); await disposeBrowser(chrome, profile); });
