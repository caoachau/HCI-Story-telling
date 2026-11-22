const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&place=entrance'});
  await wait('document.querySelector(".kd-aerial-plane img")?.naturalWidth===1695&&document.querySelector(".kd-complex-canvas canvas")&&document.querySelectorAll("[data-marker-entry]").length===3','aerial and renderer');
  const arrived=id=>wait('document.querySelector(".kd-complex-tour")?.dataset.complexPhase==="scene"&&document.querySelector(".kd-complex-tour")?.dataset.complexScene==="'+id+'"','arrival '+id);
  const overview=()=>wait('document.querySelector(".kd-complex-tour")?.dataset.complexPhase==="overview"','overview');
  const read=()=>page('return {...document.querySelector(".kd-complex-canvas").dataset}');
  await check('document.querySelectorAll("[data-marker-entry]").length===3&&document.querySelectorAll(".kd-strip [data-entry-card]").length===3&&!document.querySelector(".kd-complex-tour iframe")','Complex keeps the original three pins and cards, with a native tour');
  await shot('complex-overview');
  await click('[data-marker-entry=entrance]');await wait('document.querySelector(".kd-complex-tour").dataset.complexPhase==="travelling"','camera departs aerial');await sleep(400);
  await check('(()=>{const p=Number(document.querySelector(".kd-complex-canvas").dataset.progress);return p>0&&p<1&&document.querySelector(".kd-complex-overview-camera").style.transform.includes("scale(")})()','Camera visibly advances towards the selected position before entering its panorama');
  await arrived('entrance');await shot('complex-museum');
  await check('getComputedStyle(document.querySelector(".kd-complex-overview")).visibility==="hidden"&&document.querySelector(".kd-detail").dataset.selectedPlace==="entrance"&&!document.querySelector(".kd-complex-routes,.kd-complex-credit,.kd-complex-location>span")','Museum panorama has no route buttons, source link or title badge; its introduction stays synchronized');
  const initial=await read();await click('.kd-complex-controls button:first-child');await sleep(80);assert.ok(Number((await read()).fov)<Number(initial.fov));
  const p=await page('const r=document.querySelector(".kd-complex-canvas canvas").getBoundingClientRect();return {x:r.x+r.width*.5,y:r.y+r.height*.5}');
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x+80,y:p.y+15,button:'left',buttons:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x+80,y:p.y+15,button:'left',clickCount:1});await sleep(80);assert.notEqual((await read()).yaw,initial.yaw);const saved=await read();
  for(const id of ['pagoda','pond']){
    await click('[data-entry-card='+id+']');await wait('document.querySelector(".kd-complex-tour").dataset.complexPhase==="travelling"','teleport '+id);await sleep(400);
    await check('Number(document.querySelector(".kd-complex-canvas").dataset.progress)>0&&Number(document.querySelector(".kd-complex-canvas").dataset.progress)<1','Panorama camera and dissolve animate en route to '+id);
    await arrived(id);await check('document.querySelector(".kd-detail").dataset.selectedPlace==="'+id+'"&&document.querySelector("[data-entry-card='+id+']").getAttribute("aria-pressed")==="true"&&!document.querySelector(".kd-complex-routes,.kd-complex-credit,.kd-complex-location>span")','Scene, card and introduction agree without overlays for '+id);
    await shot('complex-'+id);
  }
  await click('[data-entry-card=entrance]');await arrived('entrance');assert.equal((await read()).yaw,saved.yaw);assert.equal((await read()).fov,saved.fov);console.log('PASS Each location retains its camera angle and zoom');
  await click('[data-action=explore-khmer-place]');await wait('document.querySelector(".md-place-viewer")?.open','museum story');await click('.md-place-viewer .md-dialog-close');await wait('!document.querySelector(".md-place-viewer")','close story');assert.equal((await read()).yaw,saved.yaw);console.log('PASS Story returns to the current panorama pose');
  await click('[data-action=complex-overview]');await overview();await check('document.querySelector(".kd-detail").dataset.selectedPlace==="entrance"&&!document.querySelector(".kd-complex-overview").inert','Overview restores the original image and keeps the selected place');
  for(const [width,height] of [[1920,1080],[1280,720],[390,844]]){
    await viewport(width,height);await sleep(120);
    await check('(()=>{const p=document.querySelector(".kd-aerial-plane").getBoundingClientRect();return [...document.querySelectorAll("[data-marker-entry]")].every(b=>{const r=b.getBoundingClientRect();return r.width>=48&&Math.abs((r.x+r.width/2-p.x)/p.width-Number(b.dataset.imageX))<.002&&Math.abs((r.y+r.height/2-p.y)/p.height-Number(b.dataset.imageY))<.002})})()','Aerial pins retain verified positions at '+width);
  }
  await click('[data-entry-card=pond]');await arrived('pond');await shot('complex-phone');
  await check('document.querySelector(".md-root").scrollWidth<=innerWidth+1&&[...document.querySelectorAll(".kd-complex-controls button,[data-action=complex-overview]")].every(b=>{const r=b.getBoundingClientRect(),v=document.querySelector(".kd-complex-tour").getBoundingClientRect();return r.width>=44&&r.height>=44&&r.left>=v.left&&r.right<=v.right&&r.top>=v.top&&r.bottom<=v.bottom&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===b})','Phone tour keeps its remaining controls inside the frame and clear of the accessibility rail');
  await viewport(1920,1080);await click('.kd-complex-controls [data-action=fullscreen-panorama]');await wait('document.querySelector(".kd-complex-expanded .kd-complex-canvas canvas")','expanded renderer');await sleep(250);await shot('complex-expanded');
  await check('(()=>{const v=document.querySelector(".kd-complex-tour").getBoundingClientRect(),f=document.querySelector(".md-footer").getBoundingClientRect();return v.bottom<=f.top+2})()','Expanded tour remains above the main footer');
  await click('[data-action=complex-overview]');await overview();await click('[data-marker-entry=pagoda]');await arrived('pagoda');await click('.kd-complex-controls [data-action=fullscreen-panorama]');await wait('document.querySelector(".kd-complex-tour:not(.kd-complex-expanded) .kd-complex-canvas canvas")','collapsed renderer');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await click('[data-entry-card=entrance]');await arrived('entrance');await click('[data-action=complex-overview]');await overview();console.log('PASS Reduced motion and both directions of teleportation work');
  await click('[data-entry-card=pagoda]');await arrived('pagoda');await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await click('[data-entry-card=pond]');await sleep(80);await click('[data-entry-card=entrance]');await arrived('entrance');await check('document.querySelector(".kd-detail").dataset.selectedPlace==="entrance"','Rapid requests finish at the last selected site');
  await click('[data-place-zone=grounds]');await wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"','grounds unchanged');await check('!document.querySelector(".kd-complex-canvas canvas")&&document.querySelectorAll("[data-panorama-point]").length===3','Leaving the complex releases its renderer and preserves Grounds');
  const cubeTile=requests.find(url=>url.includes('/r-1-1'));
  assert.ok(cubeTile,'Original cubemap tiles were fetched');await cdp('Network.setBlockedURLs',{urls:[cubeTile]});await cdp('Network.setCacheDisabled',{cacheDisabled:true});
  await click('[data-place-zone=landscape]');await wait('document.querySelector(".kd-complex-canvas canvas")','tour ready after return');await click('[data-entry-card=pagoda]');await wait('document.querySelector(".kd-complex-error")','failed panorama');
  await check('document.querySelector(".kd-detail").dataset.selectedPlace==="pagoda"&&getComputedStyle(document.querySelector(".kd-complex-overview")).visibility==="visible"','A missing tile preserves the aerial and introduction');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.kd-complex-error button');await arrived('pagoda');console.log('PASS Failed panorama loading can retry without losing the selected place');
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS Native three-site tour, animated arrival, photo-card navigation, camera state and clean responsive frame');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
