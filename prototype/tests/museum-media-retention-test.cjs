const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  base=process.env.KHMER_DISCOVERY_BASE||'http://127.0.0.1:3000';
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await viewport(1920,1080);
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=overview'});
  await wait('document.querySelector("[data-section=map]")','museum overview');for(let i=0;i<100&&!requests.some(url=>url.includes('khmer-grounds-360.jpg'));i++)await sleep(50);assert.ok(requests.some(url=>url.includes('khmer-grounds-360.jpg')),'Panorama starts preloading before entering Discovery');await click('[data-section=map]');await wait('document.querySelector("[data-place-zone=grounds]")','discovery');await click('[data-place-zone=grounds]');
  const ready=()=>wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"','panorama ready');await ready();await check('!document.querySelector(".kd-panorama-status")','No loading text covers the panorama');
  await check('document.querySelector(".kd-detail").dataset.selectedPoint==="museum-building"&&Math.abs(Number(document.querySelector(".kd-panorama-canvas").dataset.yaw)-178.2)<.01&&Math.abs(Number(document.querySelector(".kd-panorama-canvas").dataset.pitch)-11.7)<.01','Grounds starts centered on marker one without a camera turn');
  await page('window.__panoramaCanvas=document.querySelector(".kd-panorama canvas");window.__panoramaLoading=[];window.__panoramaObserver=new MutationObserver(()=>{window.__panoramaLoading.push(document.querySelector(".kd-panorama")?.dataset.panoramaState)});window.__panoramaObserver.observe(document.querySelector(".kd-panorama"),{attributes:true,attributeFilter:["data-panorama-state"]})');
  const count=()=>requests.filter(url=>url.includes('khmer-grounds-360.jpg')).length;
  const loaded=count();
  const initialFov=Number(await page('return document.querySelector(".kd-panorama-canvas").dataset.fov'));
  await click('.kd-panorama-controls button:first-child');await wait('Number(document.querySelector(".kd-panorama-canvas").dataset.fov)==='+String(initialFov-8),'zoom frame presented');const fov=await page('return document.querySelector(".kd-panorama-canvas").dataset.fov');
  for(let i=0;i<4;i++){await click('[data-action=fullscreen-panorama]');await sleep(120);await check('document.querySelector(".kd-panorama canvas")===window.__panoramaCanvas&&document.querySelector(".kd-panorama").dataset.panoramaState==="ready"','Fullscreen toggle keeps the same ready canvas');}
  assert.equal(await page('return document.querySelector(".kd-panorama-canvas").dataset.fov'),fov);assert.equal(count(),loaded);
  await check('!window.__panoramaLoading.includes("loading")','Fullscreen never restarts panorama loading');
  await click('[data-place-zone=landscape]');await check('!document.querySelector(".kd-complex-hint")','Removed the aerial instruction label');
  await click('[data-place-zone=grounds]');await ready();assert.equal(count(),loaded);console.log('PASS Returning to Grounds reuses the decoded panorama without another request');
  for(const zone of ['ground','upper']){await click('[data-place-zone='+zone+']');await ready();await check('!document.querySelector(".kd-panorama-credit")','Removed the uploaded-image credit overlay: '+zone);}
  await click('[data-entry-card=archaeology]');const modelReady=()=>wait('document.querySelector(".kd-inline-model .kd-model")?.dataset.modelState==="ready"','model ready');await modelReady();
  const models=requests.filter(url=>url.includes('khmer-sandstone')&&url.includes('.glb')).length;
  await click('.kd-back');await cdp('Network.setBlockedURLs',{urls:['*khmer-sandstone*.glb*']});
  await click('[data-entry-card=archaeology]');await modelReady();assert.equal(requests.filter(url=>url.includes('khmer-sandstone')&&url.includes('.glb')).length,models);console.log('PASS Reopening the artifact reuses its parsed GLB even when its URL is blocked');
  await shot('media-reused-model');assert.deepEqual(errors,[],'No browser exceptions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
