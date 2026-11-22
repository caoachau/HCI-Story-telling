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
async function check(expression, label) {
  const passed=await evaluate(expression);
  if(!passed){
    await shot('failed-check');
    console.log('Active quick animations:',await evaluate("document.querySelector('.lqv-root')?.getAnimations({subtree:true}).map(a=>({name:a.animationName,state:a.playState,target:a.effect?.target?.className,pseudo:a.effect?.pseudoElement,timing:a.effect?.getComputedTiming()}))"));
    console.log('Failed check bounds:',await evaluate("[...document.querySelectorAll('.lqv-root,.lqv-information,.lqv-page:not([hidden]),.lqv-page:not([hidden])>*,.md-section:not([hidden]),.md-section:not([hidden]) .md-evolution-top,.md-section:not([hidden]) .md-evolution-copy,.md-section:not([hidden]) .md-era-story,.md-section:not([hidden]) .md-era-detail-copy,.md-section:not([hidden]) .md-era-facts')].map(el=>({class:el.className,rect:el.getBoundingClientRect().toJSON(),scrollHeight:el.scrollHeight,clientHeight:el.clientHeight}))"));
  }
  assert.ok(passed,label);console.log('PASS '+label);
}
const viewport = (width, height = 960) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
const escape = async () => { await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); };
async function shot(name) {
  await sleep(200);
  const result = await cdp('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(root, 'preview', 'museo-' + name + '.png'), Buffer.from(result.data, 'base64'));
}
async function section(name) {
  if(name==='overview') {
    await section('hero');
    await click('.md-hero-copy>.md-play-link');
  } else await click('.md-footer>button[data-section="' + name + '"]');
  await wait(`!document.getElementById('museo-${name}').hidden && !['leaving','entering'].includes(document.querySelector('.md-scroll').dataset.roomMotion)`, name + ' screen is active');
  if(name==='hero') await wait("document.getElementById('museo-hero').dataset.introMotion!=='opening'",'introductory reveal finishes');
  if(name==='map') await wait("document.getElementById('museo-map').dataset.placeSceneMotion==='ready'",'spatial chapter reveal finishes');
  await evaluate(`document.getElementById('museo-${name}').scrollTop=0`);
  await wait("[...document.querySelectorAll('.md-root img')].filter(img=>{const r=img.getBoundingClientRect();if(!r.width||!r.height||r.top>=innerHeight||r.bottom<=0||r.left>=innerWidth||r.right<=0)return false;const strip=img.closest('.md-site-strip');if(strip){const p=strip.getBoundingClientRect();return r.right>p.left&&r.left<p.right}return true}).every(img=>img.complete&&img.naturalWidth>0)", name + ' visible images');
}
async function quickWindowChecks(motion = false) {
  await require('./quick-window-checks.cjs')({viewport,cdp,base,wait,click,check,evaluate,shot,sleep,escape},motion);
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
    await check(`document.querySelector('#location-quick-title').textContent===${JSON.stringify(name)} && document.querySelector('.lqv-summary').textContent.length>30 && document.querySelector('.lqv-address').textContent.length>5 && document.querySelectorAll('.lqv-highlights .lqv-reader-measure h4').length>0`, id + ' shows its own name, address, summary and highlights');
    await check("(!document.querySelector('.heritage-location-detail')||document.querySelector('.heritage-location-detail')?.matches('[data-detail-prepared=true][inert][aria-hidden=true]')) && parseFloat(getComputedStyle(document.querySelector('.lqv-summary p')).fontSize)>=12", id + ' first opens readable quick information before showing details');
    if (id !== 'bao-tang-khmer') {
      await evaluate("document.querySelector('[data-action=\"show-location-details\"]').focus()");
      await click('[data-action="show-location-details"]');
      const detail = id==='ao-ba-om' ? '.ao-shell' : id==='bien-ba-dong' ? '.bd-shell' : id==='con-chim' ? '.cc-zip-detail' : id==='den-tho-bac' ? '.dbk-host-detail iframe' : '.heritage-location-detail h2';
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
  for (const [width,height] of [[1920,1080],[1440,960],[1024,768],[768,960]]) {
    await viewport(width,height); await sleep(300);
    await check("const panel=document.querySelector('.lqv-root').getBoundingClientRect(),dock=document.querySelector('.landmark-carousel'),d=dock.getBoundingClientRect();d.left>=0&&d.right+12<=panel.left&&[...dock.querySelectorAll('.landmark-carousel-actions button:not([disabled])')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px landmark navigation stays within the map beside the side panel');
    await click('.landmark-carousel-toggle'); await sleep(300);
    await check("const dock=document.querySelector('.landmark-carousel');dock.clientWidth<=285&&dock.classList.contains('is-collapsed')",width+'px collapsed landmark navigation remains compact');
    await click('.landmark-carousel-toggle'); await sleep(300);
    if (width===768) await shot('side-panel-tablet');
  }
  for (const [width,height] of [[1726,1406],[1440,960],[1024,768],[768,960],[640,400],[390,844],[320,568],[844,390]]) {
    await viewport(width,height); await sleep(180);
    await check("const card=document.querySelector('.lqv-root'),r=card.getBoundingClientRect(),body=document.querySelector('.lqv-scroll'),button=document.querySelector('[data-action=\"show-location-details\"]'),b=button.getBoundingClientRect();r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight && body.scrollWidth<=body.clientWidth+1 && b.bottom<=r.bottom && b.top>=r.top && button.contains(document.elementFromPoint(b.left+b.width/2,b.top+b.height/2))",width+'x'+height+' quick information fits and its detail action stays visible above the dock');
    await click('[data-quick-tab=highlights]');
    await sleep(60);
    while (await evaluate("!document.querySelector('.lqv-highlights .lqv-page-navigation button:last-child').disabled")) await click('.lqv-highlights .lqv-page-navigation button:last-child');
    await check("const body=document.querySelector('.lqv-highlights .lqv-reader-body'),rect=body.getBoundingClientRect();body.scrollHeight<=body.clientHeight+1&&[...body.children].every(child=>child.getBoundingClientRect().bottom<=rect.bottom+1)",width+'x'+height+' highlights remain reachable as complete separate pages');
    await click('[data-quick-tab=overview]');
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
  await check("const r=document.querySelector('.lqv-root').getBoundingClientRect();r.width>=420&&r.width<=560&&r.left>innerWidth*.65&&!document.querySelector('.lqv-width-toggle')",'quick information remains a right-side panel with most of the map available');
  await click('button[title="Chuyển sang English"]');
  await check("document.querySelector('.lqv-toolbar>span').textContent==='LOCATION VIEWER' && document.querySelector('.lqv-footer button').textContent.includes('EXPLORE THE FULL STORY') && document.querySelector('#location-quick-title').textContent.includes('Khmer') && document.querySelector('.lqv-summary').textContent.startsWith('Explore')",'quick information follows the selected language');
  await click('[data-action="show-location-details"]');
  await wait("document.querySelector('.md-root')",'English museum detail',35000);
  for(const [width,height] of [[1440,960],[390,844],[320,568]]) {
    await viewport(width,height); await section('hero');
    await check("document.getElementById('museo-hero').lang==='en'&&document.querySelector('#md-intro-title').textContent==='KHMERCULTUREMUSEUM'&&document.querySelector('.md-play-link').textContent.includes('EXPLORE THE MUSEUM')",width+'px introductory museum copy follows the host English language');
    const englishIntro=await evaluate("document.querySelector('.md-hero-copy').innerText");
    for(const id of ['facade','exhibition','drum','sang']) {
      await click('[data-intro-slide="'+id+'"]');
      await wait("document.querySelector('.md-hero-art').complete&&document.querySelector('.md-hero-art').naturalWidth>0",'English intro photograph');
      assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"),englishIntro);
      await check("const screen=document.getElementById('museo-hero'),frame=document.querySelector('.md-hero .md-frame').getBoundingClientRect(),copy=document.querySelector('.md-hero-copy').getBoundingClientRect(),context=document.querySelector('.md-hero-context').getBoundingClientRect(),dock=document.querySelector('.md-chapter-dock').getBoundingClientRect();screen.scrollHeight<=screen.clientHeight+1&&copy.bottom+3<=context.top&&context.bottom+3<=dock.top&&[...document.querySelectorAll('#museo-hero button')].every(button=>{const r=button.getBoundingClientRect();return r.top>=frame.top&&r.bottom<=frame.bottom&&button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px English intro '+id+' keeps complete copy and reachable controls');
    }
    await shot('intro-en-'+width+'x'+height);
    await section('overview');
    await check("document.getElementById('museo-overview').lang==='en' && document.getElementById('md-overview-title').textContent==='KHMERMUSEUM' && document.querySelector('.md-remarkable h3').textContent==='WHAT MAKES IT DISTINCTIVE'",width+'px museum overview follows the host English language');
    await check("const panel=document.querySelector('.md-overview-top').getBoundingClientRect(),facts=document.querySelector('.md-facts').getBoundingClientRect();[...document.querySelectorAll('.md-overview-ctas>button')].every(button=>{const r=button.getBoundingClientRect();return r.left>=panel.left && r.right<=panel.right && r.bottom+10<=facts.top && button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px English overview actions remain inside the screen and clickable');
    await click('[data-overview-topic="collections"]');
    await wait("document.querySelector('.md-dialog-overview')?.open",'English museum collection story');
    await check("document.querySelector('#md-dialog-title').textContent==='Four themes, one Khmer way of life' && document.querySelector('.md-khmer-story').lang==='en' && document.querySelector('.md-khmer-story-prose').innerText.includes('palm-leaf manuscripts')",width+'px collection dialog shows the full English content');
    await escape();
    await section('map'); await click('[data-place-zone="upper"]');
    await check("document.querySelector('.kd-detail h3').textContent==='Religion & belief' && document.querySelector('[data-place-zone=\"upper\"]').textContent.includes('Upper floor')",width+'px Khmer place introductions follow the English host language');
    await click('[data-action="explore-khmer-place"]');
    await wait("document.querySelector('.md-khmer-place-dialog')?.open",'English Khmer place dialog');
    await check("document.querySelector('#md-dialog-title').textContent==='Religion & belief' && document.querySelector('.md-place-content:not(.md-place-measure)').textContent.includes('Theravada') && document.querySelector('.md-site-photo-caption strong').textContent==='Faith and belief displays'",width+'px place story and photograph captions render in English');
    await escape();
    await section('timeline'); await click('[data-history-phase="renewal"]');
    await check("document.querySelector('.md-era-detail h3').textContent==='RENEWAL' && document.querySelector('.md-era-highlights-heading small').textContent==='5 STORIES' && document.querySelector('.md-era-facts').textContent.includes('326 objects')",width+'px history phase, facts and stories follow the English language');
    await click('[data-topic-id="renewal-memorial"]');
    await wait("document.querySelector('.md-dialog-history')?.open",'English museum history story');
    await check("document.querySelector('#md-dialog-title').textContent==='Maha Son Thong memorial' && document.querySelector('.md-history-reading').lang==='en' && document.querySelector('.md-story-text').textContent.includes('built in 2012') && document.querySelector('.md-history-gallery figcaption').textContent.includes('2025')",width+'px English history distinguishes milestone and photo dates');
    await escape();
    await check("const screen=document.getElementById('museo-timeline'),top=document.querySelector('.md-evolution-top').getBoundingClientRect(),copy=document.querySelector('.md-evolution-copy').getBoundingClientRect();copy.bottom<=top.bottom+1 && screen.scrollHeight<=screen.clientHeight+1",width+'px English history keeps its introduction within one screen');
    for(const phase of ['formation','preservation','renewal','connection','continuity']){
      await click('[data-history-phase="'+phase+'"]');
      await evaluate("document.querySelector('.md-era-detail').scrollLeft=0");
      await check("const story=document.querySelector('.md-era-story').getBoundingClientRect(),facts=document.querySelector('.md-era-facts').getBoundingClientRect(),caption=document.querySelector('.md-africa-caption').getBoundingClientRect(),heading=document.querySelector('.md-era-detail h3').getBoundingClientRect();facts.bottom<=story.bottom+1 && (innerWidth>=1000 || caption.bottom<=heading.top+1)",width+'px English phase '+phase+' keeps complete facts and its heading clear of the photo credit');
    }
    await section('tour');
    for(const group of ['culture','activities','people']) {
      await click('[data-culture-group="'+group+'"]');
      await check("document.getElementById('museo-tour').lang==='en'&&document.querySelector('#md-tour-title').textContent==='LIVINGHERITAGE'&&document.querySelector('[data-culture-group=\""+group+"\"]').getAttribute('aria-pressed')==='true'",width+'px English culture group '+group+' follows the host language');
      await check("const copy=document.querySelector('.md-tour-copy').getBoundingClientRect(),caption=document.querySelector('.md-tour-scene-caption').getBoundingClientRect(),strip=document.querySelector('.md-gallery-strip').getBoundingClientRect();copy.bottom+3<=caption.top&&caption.bottom+3<=strip.top&&[...document.querySelectorAll('.md-tour-ctas button,.md-culture-groups button')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px English culture controls and text fit one screen');
    }
    await click('.md-gallery-strip>[data-culture-photo="youngmakers"]');
    await click('[data-action="culture-read"]');
    await wait("document.querySelector('.md-dialog-culture')?.open",'English living heritage story');
    await check("document.querySelector('#md-dialog-title').textContent==='A new generation of makers'&&document.querySelector('.md-culture-reading').lang==='en'&&document.querySelector('.md-culture-gallery figcaption').textContent.includes('2021')&&document.querySelector('.md-story-text').textContent.includes('Son Cao Thang')",width+'px English culture story and photo dates render correctly');
    await escape();
    await section('exhibitions'); await click('[data-legacy-filter="all"]');
    await check("document.getElementById('museo-exhibitions').lang==='en'&&document.querySelector('#md-exhibitions-title').textContent==='HERITAGE & LASTING VALUES'&&document.querySelectorAll('[data-legacy-id]').length===6",width+'px English heritage values follow the host language');
    await check("const screen=document.getElementById('museo-exhibitions');screen.scrollHeight<=screen.clientHeight+1&&[...document.querySelectorAll('[data-legacy-id]')].every(card=>{const r=card.getBoundingClientRect();return [...card.querySelectorAll('h3,p')].every(node=>node.getBoundingClientRect().bottom<=r.bottom-3)})&&[...document.querySelectorAll('[data-legacy-filter]')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'px English heritage cards and filters remain complete and reachable');
    await click('[data-legacy-id="continuity"]');
    const englishLegacy=await require('./legacy-exhibition-checks.cjs').collectReading({click,evaluate,wait,check,sleep},width+'px English heritage reading');
    assert.ok(englishLegacy.includes('future possibilities'),'English reading keeps proposed digital context');
    await check("document.querySelector('.md-legacy-reading').lang==='en'&&document.querySelector('#md-dialog-title').textContent==='Conservation & continuity'&&document.querySelector('.md-culture-gallery figcaption').textContent.includes('2023')",width+'px English heritage reading preserves documentary photograph dates');
    await escape();
    await section('timeline'); await click('[data-history-phase="renewal"]');
  }
  await click('.md-host-controls button:nth-last-child(2)');
  await click('[data-action="show-location-details"]');
  await check("!document.getElementById('museo-timeline').hidden && document.querySelector('[data-history-detail]').dataset.historyDetail==='renewal'",'returning and reopening preserves the selected museum history phase');
  await section('tour');
  await click('.md-host-controls button:nth-last-child(2)');
  await click('[data-action="show-location-details"]');
  await check("!document.getElementById('museo-tour').hidden&&document.getElementById('museo-tour').dataset.cultureTopic==='youngmakers'&&document.querySelector('[data-culture-group=\"people\"]').getAttribute('aria-pressed')==='true'",'returning to the map and reopening preserves the culture topic and group');
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
  await section('map'); await click('[data-place-zone="landscape"]'); await click('.kd-strip button:nth-child(2)'); await click('[data-action=explore-khmer-place]');
  await wait("document.querySelector('.md-dialog-site')?.open", 'integrated site explorer');
  await check("const r=document.querySelector('.md-dialog-site').getBoundingClientRect();Math.abs(r.left-56)<1 && Math.abs(r.right-(innerWidth-56))<1",'integrated exhibition viewer keeps responsive desktop margins');
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
    {name:'HÌNH THÀNH', prefix:'formation-', count:5, last:'formation-architecture', facts:['1992','1995','11/1997','2 tầng']},
    {name:'LƯU GIỮ', prefix:'preservation-', count:5, last:'preservation-memory', facts:['3 phòng','Chùa & nghi lễ','Nông & ngư cụ','Ngũ âm & múa']},
    {name:'ĐỔI MỚI', prefix:'renewal-', count:5, last:'renewal-collecting', facts:['2012','Khoảng 10/2014','4 phòng','326 hiện vật']},
    {name:'KẾT NỐI', prefix:'connection-', count:6, last:'connection-learning', facts:['2016','2018','5 phòng','Gần 9.000 lượt']},
    {name:'PHÁT HUY', prefix:'continuity-', count:5, last:'continuity-education', facts:['27/03/2024','11/11/2024','01/07/2025','Học tập · 2026']},
  ];
  for (const [index, period] of periods.entries()) {
    await click('.md-era-track>button:nth-child(' + (index + 1) + ')');
    await check(`document.querySelector('.md-era-detail h3').innerText===${JSON.stringify(period.name)} && document.querySelector('.md-era-highlights-heading span').innerText===${JSON.stringify(period.name)}`, period.name + ' synchronizes detail and topic heading');
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.md-era-facts small')].map(item=>item.textContent)"), period.facts, period.name + ' owns its dated facts');
    await check(`const list=document.querySelector('.md-era-highlights-list'),rows=[...list.children];rows.length===${period.count} && rows.every(row=>row.dataset.topicId.startsWith(${JSON.stringify(period.prefix)})) && rows.at(-1).dataset.topicId===${JSON.stringify(period.last)} && list.scrollTop===0 && list.scrollHeight>list.clientHeight`, period.name + ' owns its complete topic list and starts at the top');
    const topics = await evaluate("[...document.querySelectorAll('.md-era-highlights-list>button')].map(row=>({id:row.dataset.topicId,title:row.querySelector('strong').textContent,summary:row.querySelector('small').textContent,photo:row.querySelector('img').src}))");
    for (const topic of topics) {
      const selector = '[data-topic-id="' + topic.id + '"]';
      await evaluate(`const row=document.querySelector(${JSON.stringify(selector)});row.focus();row.click()`);
      await wait("document.querySelector('dialog')?.open && document.querySelector('.md-story-photo')?.complete && document.querySelector('.md-story-photo').naturalWidth>0", topic.id + ' photo and detail open');
      await check(`document.querySelector('#md-dialog-title').textContent===${JSON.stringify(topic.title)} && document.querySelector('dialog .md-eyebrow').innerText===${JSON.stringify(period.name)} && document.querySelector('.md-story-photo').src===${JSON.stringify(topic.photo)} && document.querySelector('.md-story-text').textContent.length>${topic.summary.length} && document.querySelector('.md-story-source').href.startsWith('https://')`, topic.id + ' opens its own photograph, expanded information and source');
      await check("document.querySelectorAll('.md-history-reading .md-story-text>p').length===3 && document.querySelectorAll('.md-history-photo-strip>button').length===3 && document.querySelector('.md-history-gallery figcaption a').href.startsWith('https://')",topic.id + ' has three narrative paragraphs, three photographs and original photo credits');
      await click('.md-history-photo-strip>button:nth-child(2)');
      await wait("document.querySelector('.md-story-photo').complete && document.querySelector('.md-story-photo').naturalWidth>0",'alternate history photo loads');
      await check("document.querySelector('.md-history-photo-strip>button:nth-child(2)').getAttribute('aria-pressed')==='true' && document.querySelector('.md-history-gallery figcaption').textContent.length>50",topic.id + ' gallery synchronizes selection and caption');
      await click('.md-history-photo-strip>button:nth-child(3)');
      await wait("document.querySelector('.md-story-photo').complete && document.querySelector('.md-story-photo').naturalWidth>0",'third history photo loads');
      await escape(); await wait("!document.querySelector('dialog')", topic.id + ' closes');
      assert.equal(await evaluate(`document.activeElement.dataset.topicId`), topic.id, 'topic dialog restores its trigger focus');
    }
    await evaluate("document.querySelector('.md-era-highlights-list').scrollTop=0");
    if (index === 3 || index === 4) await shot('timeline-' + period.prefix.slice(0,-1));
  }
  await click('[aria-label="Giai đoạn trước"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='KẾT NỐI' && document.querySelectorAll('.md-era-highlights-list>button').length===6 && document.querySelector('.md-era-highlights-list').scrollTop===0", 'previous-period arrow also changes and resets the topic list');
  await click('[aria-label="Chi tiết giai đoạn tiếp theo"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='PHÁT HUY' && document.querySelectorAll('.md-era-highlights-list>button').length===5", 'next-period arrow changes the topic list');
  await click('[aria-label="Giai đoạn tiếp theo"]');
  await check("document.querySelector('.md-era-highlights-heading span').innerText==='HÌNH THÀNH'", 'timeline track arrow wraps its topic list');
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
  await click('[data-action="history-introduction"]');
  await wait("document.querySelector('dialog')?.open", 'written history introduction opens');
  await check("document.querySelectorAll('.md-history-chronology li').length===5 && document.querySelector('#md-dialog-title').textContent==='Lịch sử hình thành & phát triển'", 'history introduction presents all five phases');
  await escape();
  for (const [width,height] of [[1920,1080],[1440,960],[1366,768],[1280,600],[768,960],[390,844],[320,568],[844,390]]) {
    await viewport(width,height); await section('timeline');
    for (let phase=0;phase<5;phase++) {
      await click('.md-era-track>button:nth-child('+(phase+1)+')');
      await evaluate("document.querySelector('.md-era-detail').scrollLeft=0");
      await check("const screen=document.getElementById('museo-timeline'),top=document.querySelector('.md-evolution-top').getBoundingClientRect(),copy=document.querySelector('.md-evolution-copy').getBoundingClientRect(),story=document.querySelector('.md-era-story').getBoundingClientRect(),facts=document.querySelector('.md-era-facts').getBoundingClientRect();copy.bottom<=top.bottom+1 && facts.bottom<=story.bottom+1 && screen.scrollHeight<=screen.clientHeight+1 && screen.scrollWidth<=screen.clientWidth+1",width+'x'+height+' history phase '+phase+' keeps introduction and facts within one screen');
      await check("const detail=document.querySelector('.md-era-story').getBoundingClientRect();[...document.querySelectorAll('.md-era-facts strong,.md-era-facts small')].every(text=>{const r=document.createRange();r.selectNodeContents(text);const b=r.getBoundingClientRect();return b.bottom<=detail.bottom+1&&b.right<=detail.right+1})",width+'x'+height+' history phase '+phase+' keeps complete facts visible');
    }
    await click('.md-era-track>button:first-child');
    await click('[data-topic-id="formation-construction"]');
    await wait("document.querySelector('.md-dialog-history')?.open && document.querySelector('.md-story-photo').complete",'responsive history reading dialog');
    await check("const dialog=document.querySelector('.md-dialog-history'),d=dialog.getBoundingClientRect();d.left>=0&&d.right<=innerWidth&&d.top>=0&&d.bottom<=innerHeight&&dialog.scrollWidth<=dialog.clientWidth+1",width+'x'+height+' history reading dialog fits without horizontal overflow');
    await evaluate("const dialog=document.querySelector('.md-dialog-history');dialog.scrollTop=dialog.scrollHeight");
    await check("const button=document.querySelector('.md-dialog-close'),b=button.getBoundingClientRect();b.top>=0&&b.bottom<=innerHeight&&button.contains(document.elementFromPoint(b.left+b.width/2,b.top+b.height/2))",width+'x'+height+' history close action stays visible while reading sources');
    await escape();
    if(width===390||width===844)await shot('history-'+width+'x'+height);
  }
  await viewport(1440); await section('timeline'); await click('.md-era-track>button:first-child');
}
async function heritageDrawerChecks() {
  await viewport(1440);await section('tour');await click('[data-culture-group="people"]');
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
  await check("document.querySelector('.md-tour-photo-card:last-child').getAttribute('aria-pressed')==='true' && document.querySelector('.md-gallery-strip>button:last-child').getAttribute('aria-pressed')==='true' && document.querySelector('.md-tour-art').src===document.querySelector('.md-tour-photo-card:last-child img').src", 'drawer selection synchronizes the large photograph and bottom gallery');
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
  await viewport(1440);await section('tour');await click('.md-tour-gallery-toggle');
  await click('[data-culture-group="culture"]');
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.includes('01 - 03 / 12')",'expanded drawer resets to the 12-topic cultural collection');
  await check(threeDrawerPhotos,'switching groups keeps exactly three photographs in the expanded drawer');
  await click('.md-tour-photo-card:last-child');
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.includes('10 - 12 / 12')",'last topic in the larger collection is revealed');
  await check("document.querySelector('.md-tour-photo-controls button:last-child').disabled&&document.querySelector('.md-gallery-strip>button:last-child').getAttribute('aria-pressed')==='true'",'the 12-topic collection synchronises selection and disables its end arrow');
  await click('[data-culture-group="activities"]');
  await wait("document.querySelector('.md-tour-photo-controls span').innerText.includes('01 - 03 / 06')",'activity collection resets its drawer counter');
  await check(threeDrawerPhotos,'changing to activities preserves three visible photographs');
  await evaluate("document.querySelector('.md-tour-photo-track').focus()");await escape();
}
async function introChecks() {
  await viewport(1440,960);await section('hero');
  await check("document.querySelector('#museo-hero').lang==='vi'&&[...document.querySelectorAll('#md-intro-title>span')].map(node=>node.textContent).join(' ')==='BẢO TÀNG VĂN HÓA KHMER'&&!document.getElementById('museo-hero').textContent.match(/ANCIENT|PREHISTORY|Fossil|Stone technology|Cave expression/)",'introduction presents the Khmer museum and removes prehistoric reference copy');
  const fixedCopy=await evaluate("document.querySelector('.md-hero-copy').innerText");
  await click('[data-intro-slide="facade"]');
  const firstPhoto=await evaluate("document.querySelector('.md-hero-art').src");
  for(let index=1;index<=4;index++){
    const previous=await evaluate("document.querySelector('.md-hero-art').src");
    await click('.md-hero-arrows button:last-child');
    await wait("document.querySelector('.md-hero-art').complete&&document.querySelector('.md-hero-art').naturalWidth>0",'next museum introductory photograph');
    assert.notEqual(await evaluate("document.querySelector('.md-hero-art').src"),previous);
    assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"),fixedCopy);
    await check(`document.querySelectorAll('.md-hero-bottom button')[${index%4}].getAttribute('aria-pressed')==='true'&&document.querySelectorAll('.md-hero-bottom button[aria-pressed="true"]').length===1`,'introductory photograph '+index+' synchronizes its tab while the copy stays fixed');
  }
  assert.equal(await evaluate("document.querySelector('.md-hero-art').src"),firstPhoto,'introductory next arrow wraps to the museum facade');
  await click('.md-hero-arrows button:first-child');
  await check("document.querySelector('[data-intro-slide=\"sang\"]').getAttribute('aria-pressed')==='true'&&document.querySelector('.md-slide-count').textContent.includes('04 / 04')",'previous introductory arrow wraps to the transmission photograph');
  await evaluate("document.querySelector('[data-intro-slide=\"drum\"]').focus()");
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
  await wait("document.querySelector('[data-intro-slide=\"drum\"]').getAttribute('aria-pressed')==='true'",'keyboard Enter selects an introductory photograph');
  for(const [context,destination,id] of [['landscape','map','pond'],['arts','tour','robam'],['people','tour','thachsang']]) {
    await click('[data-intro-context="'+context+'"]');
    await wait(`!document.getElementById('museo-${destination}').hidden`,'introductory '+context+' destination');
    await check(destination==='map'?"document.querySelector('.md-featured-site').dataset.selectedPlace==='pond'":`document.getElementById('museo-tour').dataset.cultureTopic==='${id}'`,'introductory '+context+' opens its matching cultural place or story');
    await section('hero');
  }
  await check("document.querySelector('[data-intro-slide=\"drum\"]').getAttribute('aria-pressed')==='true'",'the selected introductory photograph survives section navigation');
  for(const [index,destination] of ['overview','map','timeline','tour','exhibitions'].entries()) {
    await click('.md-chapter-dock button:nth-of-type('+(index+1)+')');
    await check(`!document.getElementById('museo-${destination}').hidden&&document.querySelectorAll('.md-section:not([hidden])').length===1`,'introductory chapter opens the whole '+destination+' screen');
    await section('hero');
  }
  await click('.md-play-link');await check("!document.getElementById('museo-overview').hidden",'introductory explore action opens museum overview');
  const fit="const screen=document.getElementById('museo-hero'),frame=document.querySelector('.md-hero .md-frame').getBoundingClientRect(),copy=document.querySelector('.md-hero-copy').getBoundingClientRect(),context=document.querySelector('.md-hero-context').getBoundingClientRect(),dock=document.querySelector('.md-chapter-dock').getBoundingClientRect();screen.scrollHeight<=screen.clientHeight+1&&screen.scrollWidth<=screen.clientWidth+1&&copy.top>=frame.top&&copy.bottom<=frame.bottom&&context.bottom+3<=dock.top&&(copy.bottom+3<=context.top||copy.right+3<=context.left)&&[...document.querySelectorAll('#md-intro-title>span')].every(line=>line.scrollWidth<=line.clientWidth+1)&&[...document.querySelectorAll('#museo-hero button')].every(button=>{const r=button.getBoundingClientRect();return r.top>=frame.top&&r.bottom<=frame.bottom&&button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})";
  for(const [width,height] of [[1920,1080],[1440,960],[1366,768],[1280,600],[1920,500],[768,960],[390,844],[390,600],[320,568],[844,390],[667,375]]) {
    await viewport(width,height);await section('hero');
    for(const id of ['facade','exhibition','drum','sang']){
      await click('[data-intro-slide="'+id+'"]');
      await wait("document.querySelector('.md-hero-art').complete&&document.querySelector('.md-hero-art').naturalWidth>0",id+' intro photograph');
      await check(fit,width+'x'+height+' '+id+' introductory photograph keeps copy, chapters and controls within one screen');
      assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"),fixedCopy);
    }
    await click('[data-intro-slide="facade"]');await shot('intro-'+width+'x'+height);
  }
  await viewport(1440,960);await section('hero');await click('[data-intro-slide="facade"]');
}
async function legacyChecks() {
  await require('./legacy-exhibition-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,shot,sleep,cdp,base});
  await legacyResponsiveChecks();
}
async function legacyResponsiveChecks() {
  const fit="const screen=document.getElementById('museo-exhibitions'),r=screen.getBoundingClientRect(),grid=document.querySelector('.md-exhibition-grid').getBoundingClientRect();screen.scrollHeight<=screen.clientHeight+1&&screen.scrollWidth<=screen.clientWidth+1&&grid.bottom<=r.bottom+1&&[...document.querySelectorAll('[data-legacy-id]')].every(card=>{const c=card.getBoundingClientRect(),copy=card.querySelector('div').getBoundingClientRect(),title=card.querySelector('h3');return c.top>=grid.top-1&&c.bottom<=grid.bottom+1&&copy.top>=c.top-1&&copy.bottom<=c.bottom+1&&title.scrollWidth<=title.clientWidth+1&&[...card.querySelectorAll('h3,p')].filter(node=>node.getBoundingClientRect().height>0).every(node=>node.getBoundingClientRect().bottom<=c.bottom-3)&&card.contains(document.elementFromPoint(c.left+c.width/2,c.top+c.height/2))})";
  for(const [width,height] of [[1920,1080],[1366,768],[1280,600],[1920,500],[768,960],[390,844],[320,568],[844,390],[667,375]]) {
    await viewport(width,height);await section('exhibitions');
    for(const [filter,count] of [['all',6],['history',1],['architecture',1],['culture',2],['continuity',2]]) {
      await click('[data-legacy-filter="'+filter+'"]');
      await check("document.querySelectorAll('[data-legacy-id]').length==="+count,width+'x'+height+' '+filter+' shows the matching heritage values');
      await check(fit,width+'x'+height+' '+filter+' keeps complete cards within one full screen');
    }
    await click('[data-legacy-filter="all"]');await section('exhibitions');await shot('legacy-'+width+'x'+height);
    await check("[...document.querySelectorAll('[data-legacy-filter]')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})",width+'x'+height+' all five heritage filters are directly reachable');
    await click('[data-legacy-id="continuity"]');
    await check("const title=document.querySelector('#md-dialog-title').getBoundingClientRect(),dialog=document.querySelector('.md-dialog-legacy').getBoundingClientRect();title.top>=dialog.top&&title.bottom<=dialog.bottom",width+'x'+height+' reading title is visible immediately above its photographs');
    await check("const dialog=document.querySelector('.md-dialog-legacy'),r=dialog.getBoundingClientRect();r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&dialog.scrollWidth<=dialog.clientWidth+1",width+'x'+height+' heritage reading fits the viewport');
    await evaluate("const dialog=document.querySelector('.md-dialog-legacy');dialog.scrollTop=dialog.scrollHeight");
    await check("const button=document.querySelector('.md-dialog-close'),r=button.getBoundingClientRect();r.top>=0&&r.bottom<=innerHeight&&button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",width+'x'+height+' close button remains visible while reading');
    await escape();
  }
  await viewport(1440,960);await section('exhibitions');await click('[data-legacy-filter="all"]');
}
async function cultureChecks() {
  await viewport(1440); await section('tour');
  await check("const screen=document.getElementById('museo-tour');screen.innerText.includes('DI SẢN')&&!/CHAUVET|36,000|VIRTUAL TOUR|CAVE GALLERY/.test(screen.innerText)&&document.querySelectorAll('[data-culture-group]').length===3", 'section five presents three Khmer living-heritage groups');
  for(const [group,total] of [['culture',12],['activities',6],['people',6]]) {
    await click('[data-culture-group="'+group+'"]');
    await check("document.querySelectorAll('.md-gallery-strip>button').length==="+total+" && document.querySelector('[data-culture-group=\""+group+"\"]').getAttribute('aria-pressed')==='true' && document.querySelector('.md-gallery-strip>button:first-child').getAttribute('aria-pressed')==='true'", group+' switches the gallery and selects its first topic');
    const ids=await evaluate("[...document.querySelectorAll('.md-gallery-strip>button')].map(button=>button.dataset.culturePhoto)");
    for(const id of ids) {
      await click('.md-gallery-strip>[data-culture-photo="'+id+'"]');
      await wait("document.querySelector('.md-tour-art').complete&&document.querySelector('.md-tour-art').naturalWidth>0", id+' large documentary photograph');
      await check("const button=document.querySelector('.md-gallery-strip>[data-culture-photo=\""+id+"\"]');document.getElementById('museo-tour').dataset.cultureTopic==='"+id+"'&&button.getAttribute('aria-pressed')==='true'&&document.querySelector('.md-tour-scene-caption h3').textContent===button.querySelector('span').textContent&&document.querySelector('.md-tour-art').src===button.querySelector('img').src", id+' synchronises photograph, title and thumbnail');
      await evaluate("document.querySelector('[data-action=\"culture-read\"]').focus()");
      await click('[data-action="culture-read"]');
      await wait("document.querySelector('[data-culture-story=\""+id+"\"]') && document.querySelector('.md-culture-gallery .md-story-photo').complete && document.querySelector('.md-culture-gallery .md-story-photo').naturalWidth>0", id+' reading opens');
      await check("document.querySelectorAll('.md-culture-story-photos>button').length===3&&document.querySelectorAll('.md-culture-reading .md-story-text>p').length===3&&document.querySelectorAll('.md-culture-reading .md-story-source').length>0&&document.querySelector('.md-culture-question p').textContent.length>20&&document.activeElement.closest('dialog')!==null",id+' provides three photographs, a complete story, references and keyboard focus');
      for(let photo=2;photo<=3;photo++) {
        await click('.md-culture-story-photos>button:nth-child('+photo+')');
        await wait("document.querySelector('.md-culture-gallery .md-story-photo').complete&&document.querySelector('.md-culture-gallery .md-story-photo').naturalWidth>0",id+' gallery photograph '+photo);
        await check("document.querySelector('.md-culture-story-photos>button:nth-child("+photo+")').getAttribute('aria-pressed')==='true'&&document.querySelector('.md-culture-gallery .md-story-photo').src===document.querySelector('.md-culture-story-photos>button:nth-child("+photo+") img').src&&document.querySelector('.md-culture-gallery figcaption span').textContent.length>35&&document.querySelector('.md-culture-gallery figcaption a').href.startsWith('https://')", id+' photograph '+photo+' keeps its own caption and credit');
      }
      await escape();
      await check("!document.querySelector('dialog')&&document.activeElement===document.querySelector('[data-action=\"culture-read\"]')",id+' closes back to its reading control');
    }
  }
  await click('[data-action="culture-directory"]');
  await check("document.querySelectorAll('[data-culture-entry]').length===24&&document.querySelectorAll('.md-culture-directory-group').length===3", 'culture directory includes all 24 topics');
  await evaluate("const input=document.querySelector('.md-culture-search input');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'dan lat');input.dispatchEvent(new Event('input',{bubbles:true}))");
  await wait("document.querySelectorAll('[data-culture-entry]').length===1",'unaccented search matches Vietnamese capital D-stroke');
  await check("document.querySelector('[data-culture-entry]').dataset.cultureEntry==='crafts'",'craft search finds the correct cultural story');
  await evaluate("const input=document.querySelector('.md-culture-search input');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'no-matching-heritage-topic');input.dispatchEvent(new Event('input',{bubbles:true}))");
  await wait("document.querySelectorAll('[data-culture-entry]').length===0&&document.querySelector('.md-culture-reading [role=\"status\"]')",'empty culture search provides a helpful result message');
  await evaluate("const input=document.querySelector('.md-culture-search input');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(input,'lam phen');input.dispatchEvent(new Event('input',{bubbles:true}))");
  await wait("document.querySelectorAll('[data-culture-entry]').length===1",'culture directory searches without Vietnamese accents');
  await click('[data-culture-entry="lamphen"]');
  await wait("document.querySelector('[data-culture-story=\"lamphen\"]')&&document.querySelector('.md-culture-gallery .md-story-photo').complete",'directory opens its matching story');
  await check("document.getElementById('museo-tour').dataset.cultureTopic==='lamphen'&&document.querySelector('[data-culture-story=\"lamphen\"]')&&document.querySelector('#md-dialog-title')===document.activeElement",'directory selection updates the underlying topic and focuses the reading title');
  await click('.md-culture-related button:last-child');
  await check("document.querySelector('.md-culture-reading').dataset.cultureStory===document.getElementById('museo-tour').dataset.cultureTopic",'related stories update the dialog and gallery together');
  await escape();
  await section('timeline'); await section('tour');
  await check("document.getElementById('museo-tour').dataset.cultureTopic!=='pagoda'",'culture selection survives a section change');
  await cultureResponsiveChecks();
}
async function cultureResponsiveChecks() {
  const fit="const screen=document.getElementById('museo-tour'),frame=document.querySelector('.md-tour-frame').getBoundingClientRect(),copy=document.querySelector('.md-tour-copy').getBoundingClientRect(),caption=document.querySelector('.md-tour-scene-caption').getBoundingClientRect(),strip=document.querySelector('.md-gallery-strip').getBoundingClientRect();screen.scrollWidth<=screen.clientWidth+1&&screen.scrollHeight<=screen.clientHeight+1&&copy.top>=frame.top&&copy.bottom<=frame.bottom&&caption.top>=frame.top&&caption.bottom+3<=strip.top&&(copy.bottom+3<=caption.top||copy.right+3<=caption.left)&&[...document.querySelectorAll('.md-culture-groups button,.md-tour-ctas button')].every(button=>{const r=button.getBoundingClientRect();return button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))})";
  for(const [width,height] of [[1920,1080],[1366,768],[1280,600],[768,960],[390,844],[320,568],[844,390],[667,375]]) {
    await viewport(width,height); await section('tour');
    for(const [group,id] of [['culture','pinpeat'],['activities','gongs2025'],['people','youngmakers']]) {
      await click('[data-culture-group="'+group+'"]');await click('.md-gallery-strip>[data-culture-photo="'+id+'"]');
      await check(fit,width+'x'+height+' '+group+' fits one full screen with reachable controls');
    }
    await shot('culture-'+width+'x'+height);
    await click('[data-action="culture-read"]');
    await check("const dialog=document.querySelector('.md-dialog-culture'),r=dialog.getBoundingClientRect();r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&dialog.scrollWidth<=dialog.clientWidth+1",width+'x'+height+' culture reading fits the viewport');
    await evaluate("const dialog=document.querySelector('.md-dialog-culture');dialog.scrollTop=dialog.scrollHeight");
    await check("const button=document.querySelector('.md-dialog-close'),r=button.getBoundingClientRect();r.top>=0&&r.bottom<=innerHeight&&button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",width+'x'+height+' close action stays reachable while reading');
    await escape();
  }
  await viewport(1440);await section('tour');await click('[data-culture-group="culture"]');
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
    await wait("[...document.querySelectorAll('.md-overview-visual-stage img')].length>0 && [...document.querySelectorAll('.md-overview-visual-stage img')].every(img=>img.complete&&img.naturalWidth>0)", topic+' museum photograph or location map');
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
    await evaluate("const reader=document.querySelector(innerWidth<768?'.md-overview-viewer-body':'.md-overview-reading');reader.scrollTop=reader.scrollHeight");
    await check("const button=document.querySelector('.md-dialog-close'),r=button.getBoundingClientRect();r.top>=0 && r.bottom<=innerHeight && button.contains(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2))",width+'x'+height+' museum story close action stays visible after scrolling');
    if(width===390) await shot('khmer-collections-mobile');
    await click('.md-dialog-close'); await wait("!document.querySelector('dialog')", 'responsive museum story closes');
  }
  await viewport(1440,960); await section('overview'); await shot('khmer-overview-desktop');
  await viewport(390,844); await shot('khmer-overview-mobile');
}
async function khmerPlacesChecks(motion = false) {
  await require('./places-exhibition-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,shot,sleep,cdp},motion);
}
async function museumStoryMotionChecks() {
  await require('./museum-story-motion-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,shot,sleep,cdp,base});
}

async function overviewViewerChecks(motion = false) {
  const ready="document.querySelector('.md-overview-viewer')?.dataset.viewerMotion==='ready'";
  const mediaReady="[...document.querySelectorAll('.md-overview-visual-stage img')].every(img=>img.complete&&img.naturalWidth>0)";
  const next='[data-overview-navigation="next"]', previous='[data-overview-navigation="previous"]';
  const closed="!document.querySelector('.md-overview-viewer')";
  await viewport(1920,1080); await section('overview');
  if(motion)await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await click('[data-overview-topic="identity"]');
  if(motion){
    await check("document.querySelector('.md-overview-viewer').dataset.viewerMotion==='opening' && document.querySelectorAll('.md-overview-flight').length===1",'thumbnail opens in a shared image transition in the native dialog top layer');
    await sleep(160);
    await check("Number(getComputedStyle(document.querySelector('.md-overview-lead')).opacity)<.1 && Number(getComputedStyle(document.querySelector('.md-overview-panel')).opacity)>0",'opening prioritizes the visual before revealing the story');
    await shot('overview-viewer-opening');
  }
  await wait(ready,'overview viewer opening finishes'); await wait(mediaReady,'viewer image');
  await check("const d=document.querySelector('.md-overview-viewer'),r=d.getBoundingClientRect();r.x===100&&r.y===100&&r.width===1720&&r.height===880&&d.contains(document.elementFromPoint(960,540))",'1920x1080 viewer has 100px margins on all sides and owns pointer interaction');
  await check("const v=document.querySelector('.md-overview-visual').getBoundingClientRect(),r=document.querySelector('.md-overview-reading').getBoundingClientRect();Math.abs(v.width/r.width-1.5)<.01",'large desktop allocates sixty percent of the columns to the visual');
  await check("const stage=document.querySelector('.md-overview-visual-stage');stage.scrollWidth<=stage.clientWidth+1&&stage.scrollHeight<=stage.clientHeight+1",'unzoomed photograph has no accidental scrollbars');
  await check("Number(getComputedStyle(document.querySelector('.md-scroll')).opacity)<=.36 && getComputedStyle(document.querySelector('.md-overview-backdrop')).backdropFilter==='blur(10px)' && getComputedStyle(document.querySelector('.md-footer')).pointerEvents==='none' && document.querySelectorAll('.md-overview-metadata>div').length===3",'backdrop dims and blurs the section while the viewer presents three metadata entries');
  await shot('overview-viewer-identity-desktop');
  const title=await evaluate("document.querySelector('#md-dialog-title').textContent");
  for(let position=1;position<4;position++){
    await click('[data-overview-image="'+position+'"]');await wait(ready,'gallery transition');await wait(mediaReady,'selected image');
    await check(`document.querySelector('#md-dialog-title').textContent===${JSON.stringify(title)}&&document.querySelector('[data-overview-image="${position}"]').getAttribute('aria-pressed')==='true'&&document.querySelector('.md-overview-visual-controls>span').textContent==='0${position+1} / 04'&&document.querySelector('.md-khmer-photo-credit').href.startsWith('https://')`,'gallery image '+position+' updates its caption and credit while preserving the story');
  }
  await click('[data-overview-gallery="next"]');await wait(ready,'gallery wraps');
  await check("document.querySelector('[data-overview-image]').getAttribute('aria-pressed')==='true'",'gallery wraps back to the first photograph');
  await click('[data-action="overview-zoom"]');
  await check("const stage=document.querySelector('.md-overview-visual-stage');stage.classList.contains('is-zoomed')&&stage.scrollWidth>stage.clientWidth&&stage.scrollHeight>stage.clientHeight&&document.querySelector('[data-action=\"overview-zoom\"]').getAttribute('aria-pressed')==='true'",'photo zoom exposes native horizontal and vertical inspection');
  await evaluate("const stage=document.querySelector('.md-overview-visual-stage');stage.scrollTop=stage.scrollHeight;stage.scrollLeft=stage.scrollWidth");
  await click('[data-action="overview-zoom"]');
  await click(next);
  if(motion)await check("document.querySelector('.md-overview-viewer').dataset.viewerMotion==='changing'",'next topic transitions inside the existing viewer');
  await wait("document.querySelector('[data-overview-story]').dataset.overviewStory==='architecture'&&"+ready,'architecture story');
  await check("document.querySelectorAll('.md-overview-viewer').length===1&&document.querySelector('.md-overview-topic-count').textContent==='02 / 03'&&document.querySelector('.md-overview-reading').scrollTop===0&&!document.querySelector('.is-zoomed')",'topic navigation retains one dialog and resets image zoom and reading position');
  await click(next); await wait("document.querySelector('[data-overview-story]').dataset.overviewStory==='performing'&&"+ready,'performing story');
  await click(next); await wait("document.querySelector('[data-overview-story]').dataset.overviewStory==='identity'&&"+ready,'group wraps');
  await click(previous); await wait("document.querySelector('[data-overview-story]').dataset.overviewStory==='performing'&&"+ready,'group wraps in reverse');
  await click(next);await wait("document.querySelector('[data-overview-story]').dataset.overviewStory==='identity'&&"+ready,'original story');
  await escape();
  if(motion)await check("document.querySelector('.md-overview-viewer').dataset.viewerMotion==='closing'&&document.querySelectorAll('.md-overview-flight').length===1",'closing returns the selected original image to its thumbnail');
  await wait(closed,'viewer closes');
  await check("!document.querySelector('.md-overview-flight')&&document.activeElement===document.querySelector('[data-overview-topic=\"identity\"]')&&Number(getComputedStyle(document.querySelector('.md-scroll')).opacity)===1",'closing clears temporary image and dimming and restores the original trigger focus');
  if(motion){
    await click('[data-overview-topic="architecture"]');
    await escape();await wait(closed,'Escape during opening');
    await check("!document.querySelector('.md-overview-flight')&&document.querySelectorAll('.md-section:not([hidden])').length===1",'Escape during an opening leaves no temporary layer or hidden room');
    await click('[data-overview-topic="identity"]');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await wait(ready,'live reduced-motion preference');
    await check("document.querySelector('.md-overview-viewer').dataset.motionReduced==='true'&&!document.querySelector('.md-overview-flight')&&Number(getComputedStyle(document.querySelector('.md-overview-lead')).opacity)===1",'changing motion preferences completes the opening and leaves all text readable');
    await click(next);await check("document.querySelector('[data-overview-story]').dataset.overviewStory==='architecture'",'reduced motion changes topics immediately');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
    await wait("document.querySelector('.md-overview-viewer').dataset.motionReduced==='false'",'motion preference restored');
    await click('[data-overview-image="1"]');
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await wait("document.querySelector('[data-overview-image=\"1\"]').getAttribute('aria-pressed')==='true'&&"+ready,'preference change during gallery transition');
    await check("Number(getComputedStyle(document.querySelector('.md-overview-visual-stage')).opacity)===1&&Number(getComputedStyle(document.querySelector('.md-overview-reading')).opacity)===1",'reduced motion during image switching keeps the next image and story visible');
    await escape();await wait(closed,'reduced motion closes');
    console.log('PASS overview viewer normal-motion lifecycle');
    return;
  }
  for(const [initial,target] of [['introduction','collections'],['everyday','route']]){
    await click('[data-overview-topic="'+initial+'"]');await wait(ready,'other story group');
    await click(next);await check(`document.querySelector('[data-overview-story]').dataset.overviewStory===${JSON.stringify(target)}`,'next follows the '+initial+' story group');
    await escape();await wait(closed,'other group closes');
  }
  await click('[data-overview-topic="route"]');await wait(ready,'heritage route viewer');await wait(mediaReady,'satellite tiles');
  await check("document.querySelectorAll('.md-overview-map-marker').length===3&&document.querySelectorAll('.md-overview-map-tiles img').length===9&&document.querySelector('[data-overview-place=\"entrance\"]').dataset.latitude==='9.9161668'",'route visual uses the actual three registered locations on cached satellite imagery');
  await click('[data-overview-place="pond"]');await check("document.querySelector('[data-overview-place=\"pond\"]').getAttribute('aria-pressed')==='true'",'map marker selects the associated landmark');
  await shot('overview-viewer-route-desktop');
  await click('[data-overview-image="2"]');await check("document.querySelector('.md-overview-main-image')&&document.querySelector('.md-overview-gallery-caption>strong').textContent==='Mặt nước Ao Bà Om'",'the route switches between a real map and related landscape photographs');
  for(const [width,height] of [[390,844],[320,568],[844,390]]){
    await viewport(width,height);await click('[data-overview-image="0"]');await wait(mediaReady,'compact map imagery');
    await check("const stage=document.querySelector('.md-overview-visual-stage').getBoundingClientRect(),labels=[...document.querySelectorAll('.md-overview-map-marker>span')].map(node=>node.getBoundingClientRect());labels.every((r,i)=>r.left>=stage.left&&r.right<=stage.right&&r.top>=stage.top&&r.bottom<=stage.bottom&&labels.slice(i+1).every(other=>r.right<=other.left||r.left>=other.right||r.bottom<=other.top||r.top>=other.bottom))",width+'x'+height+' map labels fit the visual without overlapping each other');
    await shot('overview-viewer-map-'+width);
  }
  await escape();await wait(closed,'map viewer closes');
  for(const [width,height,inset] of [[1920,1080,100],[1366,768,64],[1024,768,32],[768,960,32],[390,844,12],[320,568,12],[844,390,12],[1920,500,32]]){
    await viewport(width,height);await section('overview');await click('[data-overview-topic="collections"]');await wait(ready,'responsive exhibition viewer');await wait(mediaReady,'responsive image');
    await check(`const d=document.querySelector('.md-overview-viewer'),r=d.getBoundingClientRect();r.left===${inset}&&r.top===${inset}&&r.right===innerWidth-${inset}&&r.bottom===innerHeight-${inset}&&d.scrollWidth<=d.clientWidth+1`,'viewer '+width+'x'+height+' uses responsive insets and has no horizontal overflow');
    await check("const d=document.querySelector('.md-overview-viewer');[...d.querySelectorAll('.md-overview-map-marker,.md-overview-thumbnails button,.md-overview-viewer-nav button,.md-overview-close')].every(node=>{const r=node.getBoundingClientRect(),p=d.getBoundingClientRect();return r.left>=p.left&&r.right<=p.right&&r.top>=p.top&&r.bottom<=p.bottom})",width+'x'+height+' all viewer controls stay inside its frame');
    if([1920,390,320,844].includes(width))await shot('overview-viewer-'+width+'x'+height);
    await evaluate("const reader=document.querySelector(innerWidth<768?'.md-overview-viewer-body':'.md-overview-reading');reader.scrollTop=reader.scrollHeight");
    await check("const link=document.querySelector('.md-khmer-story-sources>a:last-child'),r=link.getBoundingClientRect(),p=document.querySelector(innerWidth<768?'.md-overview-viewer-body':'.md-overview-reading').getBoundingClientRect();r.top>=p.top&&r.bottom<=p.bottom+1&&!document.getElementById('museo-overview').hidden",width+'x'+height+' complete reading and source links remain reachable without changing section');
    if(width===390){
      await click(next);
      await check("document.querySelector('[data-overview-story]').dataset.overviewStory==='location'&&document.querySelector('.md-overview-viewer-body').scrollTop===0",'next story resets the phone reading flow to its new visual and title');
    }
    await click('.md-overview-close');await wait(closed,'responsive viewer closes');
  }
  await viewport(1440,960);await section('overview');await click('[data-overview-topic="identity"]');
  const press=await evaluate("const r=document.querySelector('#md-dialog-title').getBoundingClientRect();({x:r.left+r.width/2,y:r.top+r.height/2})");
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...press,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:20,y:20,button:'left',clickCount:1});
  await check("document.querySelector('.md-overview-viewer')?.open",'selecting content and releasing outside does not dismiss the viewer');
  for(let count=0;count<18;count++)await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await check("document.querySelector('.md-overview-viewer').contains(document.activeElement)",'native dialog traps keyboard navigation within the exhibition');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:20,y:20,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:20,y:20,button:'left',clickCount:1});
  await wait(closed,'backdrop click closes');
  await check("!document.getElementById('museo-overview').hidden",'backdrop click dismisses the viewer while preserving its section');
}

async function motionChecks() {
  const hover=async selector=>{
    const p=await evaluate(`const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();({x:r.left+r.width/2,y:r.top+r.height/2})`);
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...p});
  };
  await viewport(1440,960);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await wait("document.getElementById('museo-hero').dataset.introMotion==='opening'",'cinematic opening starts');
  await wait("(()=>{const lines=[...document.querySelectorAll('.md-title-line')].map(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);return lines.length===3&&lines[0]+1<lines[2]&&Number(getComputedStyle(document.querySelector('.md-hero-context article')).opacity)===0})()",'staggered title reveal before preview content');
  await check("const lines=[...document.querySelectorAll('.md-title-line')].map(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);lines.length===3&&lines[0]+1<lines[2]&&Number(getComputedStyle(document.querySelector('.md-hero-context article')).opacity)===0",'title reveals by line before preview cards enter');
  await shot('motion-opening');
  await wait("document.getElementById('museo-hero').dataset.introMotion==='ready'",'cinematic opening completes',4000);
  await check("document.querySelector('.md-hero-copy').getBoundingClientRect().bottom+3<=document.querySelector('.md-hero-context').getBoundingClientRect().top&&getComputedStyle(document.querySelector('.md-title-line')).transform==='none'&&getComputedStyle(document.querySelector('.md-intro-background')).filter==='none'",'opening finishes with readable copy and no residual blur or transform');
  await check("document.querySelectorAll('.md-ambient-dust i').length===9&&Number(getComputedStyle(document.querySelector('.md-film-grain')).opacity)<=.02&&Number(getComputedStyle(document.querySelector('.md-khmer-ornament')).opacity)<=.1&&[...document.querySelectorAll('.md-khmer-ornament path')].every(el=>getComputedStyle(el).strokeDashoffset==='0px')",'grain, nine slow dust motes and the drawn ornament remain subtle');
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:1300,y:200});await sleep(1250);
  await check("const a=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.md-intro-architecture')).transform),f=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.md-intro-foreground-layer')).transform);Math.abs(a.m41)>1&&Math.abs(a.m41)<=4.1&&Math.abs(f.m41)>Math.abs(a.m41)&&Math.abs(f.m41)<=10.1&&getComputedStyle(document.querySelector('.md-hero-copy')).transform==='none'&&Number(getComputedStyle(document.querySelector('.md-cursor-light')).opacity)>.9",'mouse parallax moves photographic layers only and brings in warm cursor light');
  await hover('.md-play-link');await sleep(450);
  await check("new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.md-play-link>span')).transform).m11>1.1&&new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.md-cta-label'),'::after').transform).m11>.99",'CTA hover expands the circle and completes its fine underline');
  await hover('[data-intro-context=arts]');await sleep(650);
  await check("new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-intro-context=arts] img')).transform).m11>1.06&&Number(getComputedStyle(document.querySelector('.md-hero-context article:first-child')).opacity)<.76",'preview hover enlarges its image and gently dims its siblings');
  await hover('.md-chapter-dock button:nth-of-type(2)');await sleep(600);
  await check("const glow=document.querySelector('.md-dock-glow'),target=document.querySelector('.md-chapter-dock button:nth-of-type(2)');Math.abs(new DOMMatrixReadOnly(getComputedStyle(glow).transform).m41-target.offsetLeft)<1",'museum dock glow reaches the hovered destination');
  await evaluate("window.__dockMotionElement=document.querySelector('.md-dock-glow');window.__dockMotionX=new DOMMatrixReadOnly(getComputedStyle(window.__dockMotionElement).transform).m41");
  await hover('.md-chapter-dock button:nth-of-type(5)');await sleep(140);
  await check("const glow=document.querySelector('.md-dock-glow'),x=new DOMMatrixReadOnly(getComputedStyle(glow).transform).m41,target=document.querySelector('.md-chapter-dock button:nth-of-type(5)');glow===window.__dockMotionElement&&x>window.__dockMotionX&&x<target.offsetLeft",'dock indicator travels continuously instead of being replaced');
  const copy=await evaluate("document.querySelector('.md-hero-copy').innerText");
  await click('.md-hero-arrows button:last-child');
  await wait("document.getElementById('museo-hero').dataset.photoMotion==='changing'",'photo pan starts');
  await sleep(150);
  await check("getComputedStyle(document.querySelector('.md-hero-outgoing')).display==='block'&&Math.abs(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.md-hero-outgoing')).transform).m41)>0",'photo change pans and crossfades inside the background');
  assert.equal(await evaluate("document.querySelector('.md-hero-copy').innerText"),copy);
  await wait("document.getElementById('museo-hero').dataset.photoMotion==='idle'",'photo pan ends');
  await check("getComputedStyle(document.querySelector('.md-hero-outgoing')).display==='none'&&document.querySelector('[data-intro-slide=exhibition]').getAttribute('aria-pressed')==='true'",'photo transition clears its old image and synchronizes the tab');
  await click('.md-hero-arrows button:last-child');await click('.md-hero-arrows button:first-child');
  await wait("document.getElementById('museo-hero').dataset.photoMotion==='idle'",'rapid photo changes settle');
  await check("getComputedStyle(document.querySelector('.md-hero-art')).transform==='none'&&Number(getComputedStyle(document.querySelector('.md-hero-art')).opacity)>.79",'rapid photo direction changes leave a complete visible photograph');
  await evaluate("document.querySelector('.md-play-link').focus()");await click('.md-play-link');
  await check("document.querySelector('.md-scroll').dataset.roomMotion==='leaving'&&document.querySelectorAll('.md-section:not([hidden])').length===1&&!document.getElementById('museo-hero').hidden",'section transition begins with one outgoing screen');
  await wait("document.querySelector('.md-scroll').dataset.roomMotion==='entering'",'next room entrance starts');
  await check("document.querySelectorAll('.md-section:not([hidden])').length===1&&!document.getElementById('museo-overview').hidden&&document.activeElement===document.getElementById('museo-overview')",'room entrance shows only the new screen and restores keyboard focus');
  await wait("document.querySelector('.md-scroll').dataset.roomMotion==='idle'",'next room entrance finishes');
  await check("getComputedStyle(document.getElementById('museo-overview')).transform==='none'&&document.querySelector('.md-scroll').getAttribute('aria-busy')==='false'",'finished room transition releases controls and clears its transform');
  await section('hero');await evaluate("document.querySelector('.md-skip-link').focus()");await click('.md-skip-link');
  await wait("!document.getElementById('museo-overview').hidden&&document.querySelector('.md-scroll').dataset.roomMotion==='idle'",'skip link transition completes');
  await check("document.activeElement===document.getElementById('museo-overview')",'skip link focuses the overview after its animated entrance');
  await click('.md-footer>button[data-section=map]');await click('.md-footer>button[data-section=timeline]');await click('.md-footer>button[data-section=exhibitions]');
  await wait("!document.getElementById('museo-exhibitions').hidden&&document.querySelector('.md-scroll').dataset.roomMotion==='idle'",'rapid room requests settle at the latest destination');
  await check("document.querySelectorAll('.md-section:not([hidden])').length===1&&document.querySelector('.md-screen-dot[aria-current=step]').dataset.section==='exhibitions'&&document.querySelector('.md-screen-label').innerText.startsWith('06 / 06')",'queued navigation keeps one screen and the final progress number');
  await section('hero');await shot('motion-desktop');
  await viewport(390,844);await section('overview');
  const start=Date.now();await section('hero');
  assert.ok(Date.now()-start<2600,'compact room and introduction use shorter timings');
  await check("getComputedStyle(document.querySelector('.md-cursor-light')).display==='none'&&getComputedStyle(document.querySelector('.md-ambient-dust')).display==='none'&&getComputedStyle(document.querySelector('.md-intro-foreground-layer')).display==='none'",'phone disables cursor light, floating particles and foreground parallax');
  await shot('motion-phone');
  await viewport(844,390);await section('overview');await section('hero');await shot('motion-landscape');
  await check("document.getElementById('museo-hero').scrollHeight<=document.getElementById('museo-hero').clientHeight+1&&document.querySelector('.md-hero-copy').getBoundingClientRect().right<document.querySelector('.md-hero-context').getBoundingClientRect().left",'landscape motion preserves the compact two-column arrangement');
  await viewport(1440,960);await section('hero');
  await click('.md-footer>button[data-section=map]');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await wait("!document.getElementById('museo-map').hidden&&document.querySelector('.md-scroll').dataset.roomMotion==='idle'",'reduced motion immediately resolves an in-progress room transition');
  await section('hero');
  await check("document.getElementById('museo-hero').dataset.introMotion==='reduced'&&getComputedStyle(document.querySelector('.md-title-line')).transform==='none'&&getComputedStyle(document.querySelector('.md-chapter-dock')).opacity==='1'",'reduced motion leaves the full title and navigation visible without reveals');
  await click('.md-hero-arrows button:last-child');
  await check("document.getElementById('museo-hero').dataset.photoMotion==='idle'&&getComputedStyle(document.querySelector('.md-hero-outgoing')).display==='none'",'reduced motion changes photos immediately without a hidden ghost');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await cdp('Page.navigate',{url:base+'/'});
  await wait("document.querySelectorAll('.landmark-carousel-card').length===7",'host for shared photograph opening',35000);
  await click('.landmark-carousel-card[data-site-id=bao-tang-khmer]');
  await wait("document.querySelector('.lqv-root')&&document.querySelector('.lqv-photo>img')?.complete&&document.querySelector('.lqv-photo>img')?.naturalWidth>0",'museum quick photograph',35000);
  await click('[data-action=show-location-details]');
  await wait("(()=>{const bridge=document.querySelector('[data-museum-opening=expanding]');return bridge&&bridge.getAttribute('aria-hidden')==='true'&&getComputedStyle(bridge).pointerEvents==='none'})()",'quick photograph expands decoratively into hero without blocking controls',10000);
  console.log('PASS shared opening photograph expands without blocking controls');
  await wait("document.getElementById('museo-hero')?.dataset.introMotion==='ready'&&!document.querySelector('[data-museum-opening]')",'shared opening releases its temporary element',7000);
  await evaluate("document.querySelector('.heritage-app').classList.add('access-reduce-motion')");
  await wait("document.getElementById('museo-hero').dataset.reducedMotion==='true'",'host accessibility preference reaches museum motion');
  await section('overview');await section('hero');
  await check("document.getElementById('museo-hero').dataset.introMotion==='reduced'&&getComputedStyle(document.querySelector('.md-ambient-dust')).display==='none'",'host Reduce motion disables reveal and ambient effects');
  await evaluate("document.querySelector('.heritage-app').classList.remove('access-reduce-motion')");
  await wait("document.getElementById('museo-hero').dataset.introMotion==='ready'",'host cinematic preference resumes');
  await section('tour');
  await click('button[aria-label="Exit fullscreen museum detail"],button[aria-label="Thu nhỏ chi tiết bảo tàng"]');
  await wait("document.querySelector('.lqv-root').getBoundingClientRect().height>0",'return after animated museum');
  await click('[data-action=show-location-details]');
  await wait("!document.getElementById('museo-tour').hidden",'return preserves selected cultural screen');
  await check("!document.querySelector('[data-museum-opening]')&&document.querySelectorAll('.md-section:not([hidden])').length===1",'reopening another section preserves state without an unrelated hero overlay');
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
  if (process.argv.includes('--opening-profile')) { await require('./museum-opening-profile.cjs')({viewport,click,evaluate,wait,sleep,cdp,base}); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--opening-only')) { await require('./museum-opening-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,shot,sleep,cdp,base}); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); console.log('PASS opening lifecycle has no missing assets or browser exceptions'); return; }
  if (process.argv.includes('--motion-only')) { await motionChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); console.log('PASS cinematic motion has no missing assets or browser exceptions'); return; }
  if (process.argv.includes('--overview-viewer-motion-only')) { await overviewViewerChecks(true); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--overview-viewer-only')) { await overviewViewerChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  await shot('desktop-hero');
  if (process.argv.includes('--quick-window-motion-only')) { await quickWindowChecks(true); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--quick-window-only')) { await quickWindowChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--quick-view-only')) { await quickViewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--overview-only')) { await overviewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--khmer-overview-only')) { await khmerOverviewChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--culture-layout-only')) { await cultureResponsiveChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--culture-only')) { await cultureChecks(); await heritageDrawerChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--legacy-only')) { await legacyChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--intro-only')) { await introChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--legacy-capture-only')) {
    for(const [width,height] of [[1440,960],[320,568],[844,390]]) {
      await viewport(width,height);await section('exhibitions');
      await click('[data-legacy-filter="history"]');await section('exhibitions');await shot('legacy-single-'+width);
      await click('[data-legacy-filter="culture"]');await section('exhibitions');await shot('legacy-pair-'+width);
      await click('[data-legacy-filter="all"]');await click('[data-legacy-id="continuity"]');
      await wait("document.querySelector('.md-culture-gallery .md-story-photo').complete",'legacy reading image');
      await shot('legacy-reading-'+width);await escape();
    }
    assert.deepEqual(missing, []);assert.deepEqual(exceptions, []);return;
  }
  if (process.argv.includes('--gallery-only')) { await galleryStripChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--legacy-mobile-only')) { await require('./legacy-mobile-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,sleep,cdp}); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--legacy-motion-only')) { await require('./legacy-motion-checks.cjs')({viewport,section,click,check,evaluate,wait,escape,shot,sleep,cdp,base}); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--story-motion-only')) { await museumStoryMotionChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--timeline-only') || process.argv.includes('--history-only')) { await timelineChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--places-motion-only')) { await khmerPlacesChecks(true); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--places-only')) { await khmerPlacesChecks(); assert.deepEqual(missing, []); assert.deepEqual(exceptions, []); return; }
  if (process.argv.includes('--capture-only')) {
    for (const name of ['overview', 'map', 'timeline', 'tour', 'exhibitions']) { await section(name); await shot('desktop-' + name); }
    assert.deepEqual(missing, [], 'Development capture has no missing local assets');
    assert.deepEqual(exceptions, [], 'Development capture has no browser exceptions');
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
      await check("const controls=document.querySelector('.md-host-controls').getBoundingClientRect(),footer=document.querySelector('.md-footer').getBoundingClientRect();controls.top>=footer.top && controls.bottom<=footer.bottom", width + 'px host controls stay in the footer');
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
  await introChecks();
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
  await check("document.querySelector('#md-dialog-title').textContent==='HÌNH THÀNH · 1992 – 1997' && document.querySelector('.md-story-text').textContent.length>document.querySelector('.md-era-preview').textContent.length && document.querySelectorAll('.md-history-chronology li').length===5", 'Read more opens the full period description and dated events');
  await escape(); await wait("!document.querySelector('dialog')", 'compact period overview closes');
  await evaluate("const strip=document.querySelector('.md-era-detail');strip.scrollLeft=strip.scrollWidth");
  await check("const strip=document.querySelector('.md-era-detail'),topics=document.querySelector('.md-era-highlights').getBoundingClientRect();strip.scrollLeft>0 && topics.right<=strip.getBoundingClientRect().right+1 && !document.getElementById('museo-timeline').hidden", 'phone timeline topic panel is reachable with horizontal browsing');
  await cultureChecks();
  await heritageDrawerChecks();
  await legacyChecks();
  await section('map'); await click('.kd-directory'); await wait("document.querySelector('dialog')?.open", 'search opens');
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
