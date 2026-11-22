const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
base=process.env.KHMER_DISCOVERY_BASE||'http://127.0.0.1:3001';await viewport(1920,1080);
await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&place=entrance'});await wait('document.querySelector("[data-place-zone=grounds]")','grounds');await click('[data-place-zone=grounds]');
const ready=()=>wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"&&document.querySelector(".kd-panorama-canvas")?.dataset.fov','rendered panorama');await ready();
const settled=()=>wait('document.querySelector(".kd-panorama-canvas").dataset.motionState==="idle"','camera settles');
await check('[...document.querySelectorAll("[data-panorama-point] b")].map(el=>el.textContent).join(",")==="1,2,3,4"&&document.querySelectorAll("[data-point-card]").length===4','Four numbered markers and synchronized cards');
for(const id of ['museum-building','ngo-ba-si','maha-son-thong','outdoor-instrument']){
 const before=await page('return document.querySelector(".kd-panorama-canvas").dataset.fov');await click('[data-point-card='+id+']');await sleep(80);await settled();
 await check('!document.querySelector(".kd-panorama-popup")&&document.querySelector(".kd-detail").dataset.selectedPoint==="'+id+'"&&document.querySelector("[data-panorama-point='+id+']").getAttribute("aria-expanded")==="false"','Inline card pans without opening popup: '+id);
 assert.equal(await page('return document.querySelector(".kd-panorama-canvas").dataset.fov'),before);
 await click('[data-panorama-point='+id+']');await sleep(80);await settled();await check('!document.querySelector(".kd-panorama-popup")','Inline marker keeps photograph clear');
 if(id==='ngo-ba-si'){
   await shot('ngo-boat-marker-02');
   await click('[data-action=explore-khmer-place]');await wait('document.querySelector(".kd-point-dialog")?.open','boat detail');
   await check('document.querySelector(".kd-point-dialog").dataset.groundPointDetail==="ngo-ba-si"&&["1997","2021","28 m","Kim Crụp","gỗ sao","Makara","Giồng Chùa"].every(text=>document.querySelector(".kd-point-dialog").textContent.includes(text))','Boat detail contains supplied provenance, dimensions, maker and decoration');
   for(let i=0;i<3;i++){await wait('document.querySelector(".kd-point-visual figure img")?.naturalWidth>0','original boat photograph');await click('.kd-point-gallery-controls button:last-child');}
   await shot('ngo-boat-detail');await click('.kd-point-dialog header button');await wait('!document.querySelector(".kd-point-dialog")','close boat detail');
 }
}
await shot('grounds-inline-no-popup');await click('[data-action=fullscreen-panorama]');await ready();await wait('document.querySelector(".kd-panorama-popup")?.dataset.visible==="true"','expanded popup');
await check('document.querySelector(".kd-panorama-popup").dataset.popupPoint==="outdoor-instrument"','Expanded view opens selected point popup');await shot('grounds-expanded-with-popup');
await click('.kd-popup-close');await check('!document.querySelector(".kd-panorama-popup")','Expanded popup closes');await click('[data-panorama-point=outdoor-instrument]');await sleep(80);await settled();await wait('document.querySelector(".kd-panorama-popup")?.dataset.visible==="true"','reopen same popup');
await click('[data-action=fullscreen-panorama]');await ready();await check('!document.querySelector(".kd-panorama-popup")&&document.querySelector(".kd-detail").dataset.selectedPoint==="outdoor-instrument"','Collapse removes popup and retains selection');
assert.deepEqual(errors,[]);console.log('PASS inline pan-only and expanded popups');
`;
const test=new Module(file,module);test.filename=file;test.paths=Module._nodeModulePaths(path.dirname(file));test._compile(source.slice(0,begin)+body+source.slice(end),file);
