const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const start=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  if(process.argv.includes('--production')) {
    await viewport(390,844);
    for(const id of ['bao-tang-khmer','bao-tang-khmer:object:archaeology:sandstone']) {
      await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?view=audio&lang=vi&listen='+id});await wait('document.querySelector("[data-audio-page]")?.dataset.audioPage==='+JSON.stringify(id),'production content');
      await check('!document.querySelector("[data-audio-action=start]")&&!document.querySelector("audio")&&document.querySelector("h1").textContent.length>0','Production without demo retains content and hides unconfigured audio: '+id);
    }
    assert.deepEqual(errors,[],'No production browser exceptions');return;
  }
  base=process.env.QR_AUDIO_BASE||'http://127.0.0.1:3000';
  await viewport(390,844);
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer&lang=vi'});await wait('document.querySelector("[data-audio-page]")','mobile overview');
  const cases=await page('const {loadAudioCatalog,audioPageUrl}=await import("/src/audio/catalog.ts");const {SITE_IDS}=await import("/src/experience/state.ts");const cases=[];for(const site of SITE_IDS){const c=await loadAudioCatalog(site,"vi");const root=c.items.find(i=>i.id===c.rootId),detail=c.items.find(i=>!i.children.length&&i.parentId);for(const item of [root,detail])cases.push({url:audioPageUrl(item,"vi"),id:item.id,title:item.title});}for(const site of ["bao-tang-khmer","con-chim","den-tho-bac"]){const c=await loadAudioCatalog(site,"en"),item=c.items.find(i=>!i.children.length&&i.parentId);cases.push({url:audioPageUrl(item,"en"),id:item.id,title:item.title});}return cases');
  for(const entry of cases){
    await cdp('Page.navigate',{url:entry.url});await wait('document.querySelector("[data-audio-page]")?.dataset.audioPage==='+JSON.stringify(entry.id),'direct content '+entry.id);
    await check('document.querySelector("h1").textContent==='+JSON.stringify(entry.title)+'&&!document.querySelector("audio")&&document.documentElement.scrollWidth<=innerWidth+1','Direct URL opens real content without autoplay: '+entry.id);
    await cdp('Page.reload');await wait('document.querySelector("[data-audio-page]")?.dataset.audioPage==='+JSON.stringify(entry.id),'refresh '+entry.id);
  }
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer:object:archaeology:sandstone&lang=vi'});await wait('document.querySelector("[data-audio-page]")','sandstone mobile');await click('.ha-mobile-footer a:last-child');await wait('document.querySelector(".kd-model canvas")','full website artifact');await check('new URLSearchParams(location.search).get("view")==="detail"&&document.querySelector("[data-object-card=sandstone]").getAttribute("aria-pressed")==="true"','Full-website link restores the selected 3D object with audio mode removed');
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/index.html?site=den-tho-bac&detail=1&view=detail&lang=vi'});await wait('document.querySelector(".dbk-host-detail iframe")?.contentDocument?.querySelector(".db-kiosk")','embedded memorial');
  await page('const w=document.querySelector(".dbk-host-detail iframe").contentWindow;[...w.document.querySelectorAll(".hx-tools button")].find(b=>b.getAttribute("aria-label")==="Nghe và bản chữ").click()');await wait('document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector(".ha-panel [data-audio-action=start]")','iframe audio panel');
  await cdp('Runtime.evaluate',{expression:'document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("[data-audio-action=start]").click()',userGesture:true});await wait('document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("audio")&&!document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("audio").paused','iframe actual audio');
  await cdp('Runtime.evaluate',{expression:'import("/src/audio/player.ts").then(({audioPlayer})=>audioPlayer.playSingle({id:"test-parent",siteId:"den-tho-bac",title:"Parent test",audioUrl:"/audio/demo.mp3",pageUrl:location.href,description:"",demo:true}))',awaitPromise:true,userGesture:true});await wait('document.querySelector("audio")&&!document.querySelector("audio").paused','parent actual audio');
  await check('document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("audio").paused','Starting audio in the parent stops audio in the existing same-origin iframe');
  await cdp('Runtime.evaluate',{expression:'document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("[data-audio-action=start]").click()',userGesture:true});await wait('!document.querySelector(".dbk-host-detail iframe").contentDocument.querySelector("audio").paused','child reclaims audio');await check('document.querySelector("audio").paused','Starting child audio stops the parent player');
  assert.deepEqual(errors,[],'No uncaught browser exceptions');console.log('PASS Direct routes, refresh, full-website return and iframe audio ownership');
`;
const test=new Module(file,module);test.filename=file;test.paths=Module._nodeModulePaths(path.dirname(file));test._compile(source.slice(0,start)+body+source.slice(end),file);
