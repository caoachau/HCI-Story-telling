const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const production=process.argv.includes('--production');
  if(production&&!process.env.KHMER_DISCOVERY_BASE)throw Error('Set KHMER_DISCOVERY_BASE to a Vite preview server for production audio tests; seeking requires HTTP Range support.');
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  else if(!production)base='http://127.0.0.1:3000';
  await viewport(1920,1080);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=overview'});
  await wait('document.querySelectorAll(".md-remarkable-row").length===5','five numbered overview stories');
  await wait('document.querySelector(".md-overview-ctas [data-audio-action=start]")','official narration actions');
  await page('await document.fonts.ready');
  if(!production){
  const data=await page('const {museumAudioCatalog}=await import("/src/audio/museumCatalog.ts");const {contentPlaylist}=await import("/src/audio/catalog.ts");const catalog=museumAudioCatalog("vi");const group=catalog.items.find(item=>item.id==="bao-tang-khmer:section:overview");return {tracks:contentPlaylist(catalog,group,"vi"),items:catalog.items.filter(item=>group.children.includes(item.id))}');
  assert.equal(data.tracks.length,7,'Overview contains exactly seven narrated items');
  assert.equal(new Set(data.tracks.map(t=>t.audioUrl)).size,7,'Every overview narration has its own source');
  assert.ok(data.tracks.every(t=>!t.demo&&t.audioUrl.includes('/audio/khmer-overview/')),'Official uploads replace demo audio');
  assert.equal(data.tracks.filter(t=>t.id.endsWith(':collections')).length,1,'ND01 and ND02 are one track');
  assert.equal(data.tracks.filter(t=>t.id.endsWith(':visit')).length,1,'Three visit reasons share one track');
  assert.ok(!data.items.some(item=>/nd0[12]/i.test(item.id)),'No separate ND01 or ND02 items');
  console.log('PASS Seven real recordings, one joined introduction, one shared visit-reasons recording');
  }
  const gesture=selector=>cdp('Runtime.evaluate',{expression:'document.querySelector('+JSON.stringify(selector)+').click()',userGesture:true});
  await gesture('.md-overview-ctas [data-audio-action=start]');
  await wait('document.querySelector("audio[data-heritage-audio]")?.duration>185&&document.querySelector("[data-audio-status=playing]")','joined audio plays');
  await page('window.__media=document.querySelector("audio[data-heritage-audio]")');
  await check('!document.querySelector("[data-audio-action=next]")&&Math.abs(window.__media.duration-190.746)<.2','One continuous 3:10 timeline');
  const duration=await page('return window.__media.duration');
  await page('window.__media.currentTime=65.8;window.__media.playbackRate=2');
  await wait('window.__media.currentTime>68','playback crosses original file boundary');
  await check('window.__media.src.endsWith("/collections.mp3")&&window.__media.duration==='+duration+'&&Number(document.querySelector(".md-overview-ctas input[type=range]").value)>67','Crossing ND01 to ND02 never resets the source, time or duration');
  await click('.md-overview-ctas .ha-player-close');
  await click('.md-overview-ctas [data-overview-topic=collections]');
  await wait('document.querySelector("[data-overview-story=collections]")','joined introduction detail');
  await check('document.querySelectorAll(".md-khmer-story-prose>section").length===2&&document.querySelectorAll("[data-overview-image]").length>=5','Joined introduction contains both full scripts and a related gallery');
  await shot('overview-narration-introduction');
  await click('.md-overview-close');await wait('!document.querySelector(".md-overview-viewer")','close introduction');
  for(const topic of ['identity','architecture','performing','dailyLife','spiritual']){
    if(['dailyLife','spiritual'].includes(topic)){
      await page('for(let i=0;i<20&&document.querySelector(".md-chamber").dataset.overviewAlbumTopic!=='+JSON.stringify(topic)+';i++){document.querySelector("[data-action=overview-next-photo]").click();await new Promise(r=>setTimeout(r,20))}');
      await click('.md-chamber-open');
    }else await click('.md-remarkable-row[data-overview-topic='+topic+']');
    await wait('document.querySelector("[data-overview-story='+topic+']")','detail '+topic);
    await wait('document.querySelector(".md-overview-main-image")?.naturalWidth>0','related main photograph');
    await check('document.querySelectorAll("[data-overview-image]").length>=4&&document.querySelectorAll(".md-khmer-story-prose p").length>=5','Full script and related photographs for '+topic);
    await gesture('.md-overview-reading [data-audio-action=start]');
    await wait('window.__media.src.endsWith("/'+topic+'.mp3")&&window.__media.duration>60','real narration metadata '+topic);
    await check('!window.__media.error&&!!document.querySelector(".md-overview-reading [data-audio-status]")','Correct recording for '+topic);
    await click('.md-overview-reading .ha-player-close');
    const count=await page('return document.querySelectorAll("[data-overview-image]").length');
    for(let i=0;i<count;i++){
      await click('[data-overview-image="'+i+'"]');await wait('document.querySelector(".md-overview-main-image")?.naturalWidth>0&&!document.querySelector(".md-overview-photo-error")','gallery photograph '+topic+'/'+i);
    }
    await check('!!document.querySelector(".md-khmer-photo-credit[href^=https]")','Photo source is available for '+topic);
    if(topic==='spiritual')await shot('overview-narration-spiritual');
    await click('.md-overview-close');await wait('!document.querySelector(".md-overview-viewer")','close detail');
  }
  for(const topic of ['everyday','learning','route']){
    await click('.md-visit-row[data-overview-topic='+topic+']');await wait('document.querySelector("[data-overview-story=visit]")','shared visit story');
    await check('document.querySelector(".md-overview-reading [data-inline-audio]").dataset.inlineAudio==="bao-tang-khmer:overview:visit"&&document.querySelectorAll(".md-khmer-story-prose>section").length===4','Visit card '+topic+' opens the complete shared story');
    await click('.md-overview-close');await wait('!document.querySelector(".md-overview-viewer")','close visit story');
  }
  for(const [width,height] of [[1920,1080],[1280,720],[390,844]]){
    await viewport(width,height);await sleep(250);
    await check('document.querySelector(".md-root").scrollWidth<=innerWidth+1','Overview fits at '+width);
    await shot('overview-narration-'+width);
  }
  await viewport(1920,1080);await click('.md-overview-ctas .ha-inline-buttons>button:last-child');await wait('document.querySelector(".ha-qr-dialog[open]")','joined audio QR');
  await check('document.querySelector(".ha-qr-dialog").textContent.includes("3")||!!document.querySelector(".ha-qr-dialog canvas,.ha-qr-dialog svg,.ha-qr-dialog img")','Joined content QR renders');
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?view=audio&listen=bao-tang-khmer:section:overview&lang=vi'});
  await viewport(390,844);
  await wait('document.querySelectorAll(".ha-contents [data-audio-item]").length===7','QR overview playlist');
  await check('document.querySelector(".ha-primary").textContent==="Nghe toàn bộ"&&!document.querySelector("audio[data-heritage-audio]")','QR shows seven real recordings and waits for a deliberate play');
  await gesture('.ha-primary');
  await wait('document.querySelector("audio[data-heritage-audio]")?.duration>190','QR joined introduction playback');
  await page('window.__media=document.querySelector("audio[data-heritage-audio]");window.__media.currentTime=window.__media.duration-.15');
  await wait('window.__media.src.endsWith("/identity.mp3")&&window.__media.currentTime>0','playlist automatically continues to identity');
  await check('document.querySelector(".ha-mobile-player .ha-player-heading").textContent.includes("2 / 7")','QR playlist advances once after the complete joined introduction');
  await click('.ha-mobile-player .ha-player-close');
  await click('[data-audio-item="bao-tang-khmer:overview:visit"] .ha-content-link');
  await wait('document.querySelector(".ha-mobile")?.dataset.audioPage==="bao-tang-khmer:overview:visit"','QR shared visit detail');
  await wait('document.querySelector(".ha-hero img")?.naturalWidth>0','QR related photograph');
  await gesture('.ha-primary');
  await wait('window.__media.src.endsWith("/visit.mp3")&&window.__media.duration>248','shared visit narration playback');
  await page('window.__media.currentTime=window.__media.duration-.15');
  await wait('document.querySelector(".ha-primary")?.textContent==="Dừng"','single shared narration finishes');
  await check('window.__media.ended&&document.querySelectorAll(".ha-transcript p").length>=8&&document.querySelector(".ha-mobile").scrollWidth<=innerWidth+1','Single QR narration finishes correctly with its full script and photographs');
  assert.deepEqual(errors,[],'No browser exceptions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
