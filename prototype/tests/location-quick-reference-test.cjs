/* Visual and interaction checks for the shared, reference-based map location panel. */
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module");
const harnessPath = path.resolve(__dirname, "museo-detail-test.cjs");
let source = fs.readFileSync(harnessPath, "utf8").replace(/\r\n/g, "\n");
const anchor = "  await shot('desktop-hero');";
if (!source.includes(anchor)) throw Error("Browser harness entry changed");
const body = String.raw`
  await cdp('Page.navigate', {url: base + '/'});
  await wait("document.querySelectorAll('.landmark-carousel-card').length===7", 'seven destination cards', 45000);
  const ids=['den-tho-bac','bao-tang-khmer','ao-ba-om','chua-ang','chua-hang','con-chim','bien-ba-dong'];
  const openLocation=async id=>{
    await click('.landmark-carousel-card[data-site-id="'+id+'"]');
    await wait("document.querySelector('.lqv-root')?.dataset.siteId==='"+id+"'&&document.querySelector('.lqv-root').dataset.quickMotion==='ready'",id+' selected',45000);
    await wait("document.querySelector('.lqv-visual')?.dataset.photoStatus==='ready'",id+' photograph ready');
    await evaluate('document.fonts.ready');await sleep(100);
  };
  for(const id of ids){
    await viewport(1920,1080);await openLocation(id);
    await check("(()=>{const root=document.querySelector('.lqv-root'),hero=root.querySelector('.lqv-hero').getBoundingClientRect(),photo=root.querySelector('.lqv-photo').getBoundingClientRect(),title=root.querySelector('.lqv-title-block').getBoundingClientRect(),toolbar=root.querySelector('.lqv-toolbar').getBoundingClientRect(),sheet=root.querySelector('.lqv-sheet'),s=sheet.getBoundingClientRect(),style=getComputedStyle(sheet);return Math.abs(photo.width-hero.width)<1&&Math.abs(photo.height-hero.height)<1&&title.top>=photo.top&&title.bottom<photo.bottom&&toolbar.top>=photo.top&&toolbar.bottom<photo.bottom&&s.top<photo.bottom&&style.backgroundColor==='rgb(8, 8, 8)'&&style.backdropFilter==='none'&&style.opacity==='1'&&!!root.querySelector('.lqv-sheet .lqv-footer')})()",id+': full-width photo, overlaid title, opaque black content sheet');
    await check("(()=>{const root=document.querySelector('.lqv-root');return [...root.querySelectorAll('.lqv-toolbar button,.lqv-photo-controls button,.lqv-photo-thumbnails button,.lqv-tabs button,.lqv-footer button')].every(el=>{const r=el.getBoundingClientRect();return r.width&&r.height&&el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})})()",id+': all visible photo/header/tab/detail controls are reachable');
    for(const language of ['vi','en']){
      if(language==='en')await click('button[title="Chuyển sang English"]');
      for(const [w,h] of [[3840,2160],[1366,768],[390,844],[320,568],[667,375]]){
        await viewport(w,h);await sleep(80);
        const geometry=await evaluate("(()=>{const root=document.querySelector('.lqv-root'),hero=root.querySelector('.lqv-hero').getBoundingClientRect(),title=root.querySelector('.lqv-title-block').getBoundingClientRect(),controls=root.querySelector('.lqv-photo-controls')?.getBoundingClientRect(),toolbar=root.querySelector('.lqv-toolbar').getBoundingClientRect();return {title:title.toJSON(),hero:hero.toJSON(),controls:controls?.toJSON(),toolbar:toolbar.toJSON()}})()");
        const pass=geometry.title.top>=geometry.toolbar.bottom-1&&geometry.title.bottom<=(geometry.controls?.top??geometry.hero.bottom)-5;
        if(!pass)console.log('Photo overlay overlap:',id,language,w,h,geometry);
        await check(String(pass),id+' '+language+' '+w+'x'+h+': photo title stays clear of toolbar and gallery controls');
      }
      await viewport(1920,1080);await sleep(120);
    }
    await click('button[title="Switch to Vietnamese"]');
    const photos=await evaluate("document.querySelectorAll('[data-quick-thumbnail]').length||1");
    for(let i=0;i<photos;i++){
      if(photos>1) await click('[data-quick-thumbnail="'+i+'"]');
      await wait("document.querySelector('.lqv-visual').dataset.photoStatus==='ready'",'selected photograph');
      await check("document.querySelector('.lqv-photo-caption p').textContent===document.querySelector('.lqv-photo>img').alt&&document.querySelector('.lqv-photo-caption>span').textContent.length>6",id+': photo '+i+' matches its caption and credit');
    }
    if(photos>1)await click('[data-quick-thumbnail="0"]');
    await wait("document.querySelector('.lqv-visual').dataset.photoStatus==='ready'",'first photo');
    await shot('quick-reference-'+id+'-1920x1080');
  }
  await openLocation('den-tho-bac');
  for(const [w,h] of [[3840,2160],[1774,887],[1366,768],[768,960],[390,844],[320,568],[667,375]]){
    await viewport(w,h);await sleep(200);
    await check("(()=>{const root=document.querySelector('.lqv-root'),r=root.getBoundingClientRect(),sheet=root.querySelector('.lqv-sheet').getBoundingClientRect(),title=root.querySelector('.lqv-title-block').getBoundingClientRect(),hero=root.querySelector('.lqv-hero').getBoundingClientRect();return root.scrollHeight<=root.clientHeight+1&&r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight&&title.top>=hero.top&&title.bottom<=hero.bottom&&sheet.bottom<=r.bottom+1})()",w+'x'+h+': viewer and photo title fit');
    await shot('quick-reference-den-tho-bac-'+w+'x'+h);
  }
  await viewport(1920,1080);
  await click('.lqv-toolbar button:first-child');
  await wait("document.querySelector('[data-location-overlay=qr]')?.open",'QR opens');
  await escape();await wait("!document.querySelector('[data-location-overlay=qr]')?.open",'QR closes');
  await click('[data-action=show-location-details]');
  await wait("document.querySelector('.dbk-host-detail iframe')?.contentDocument?.querySelector('main')",'existing temple story opens',30000);
  await check("!!document.querySelector('.dbk-host-detail iframe')?.contentDocument?.querySelector('main')",'Existing temple full story remains connected');
  assert.deepEqual(missing, [], 'No missing local assets');assert.deepEqual(exceptions, [], 'No uncaught browser errors');
  console.log('PASS Reference viewer has no missing local assets or browser exceptions');return;
`;
source = source.replace(anchor, body + "\n" + anchor);
const runner = new Module(harnessPath, module);
runner.filename = harnessPath;
runner.paths = Module._nodeModulePaths(path.dirname(harnessPath));
runner._compile(source, harnessPath);
