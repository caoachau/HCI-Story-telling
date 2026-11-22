/* Real Chrome checks, reusing the repository's CDP/browser cleanup harness. */
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module");
const file = path.resolve(__dirname, "den-tho-bac-test.cjs");
const source = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const begin = source.indexOf("  const sections=["),
  end = source.lastIndexOf("\n}\nmain().catch");
if (begin < 0 || end < begin) throw Error("Browser harness boundaries changed");
const body = String.raw`
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const loaded=()=>wait('[...document.querySelectorAll("#museo-map img")].every(i=>i.complete&&i.naturalWidth>0)','discovery photographs');
  const area=async id=>{await click('[data-place-zone='+id+']');await wait('document.querySelector("#museo-map").dataset.zone==='+JSON.stringify(id),'tab '+id);await loaded();};
  const openMuseum=async()=>{await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html'});await wait('document.querySelector(".md-footer")','museum');await click('.md-footer [data-section=map]');await wait('document.querySelector("#museo-map")?.hidden===false','discovery');await loaded();await page('await document.fonts.ready');};
  const touch=async selector=>{const r=await page('const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:r.x,y:r.y,button:'left',clickCount:1});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x,y:r.y,button:'left',clickCount:1});};
  for(const [width,height] of [[1920,1080],[1280,720],[3840,2160],[768,1024],[390,844],[320,720],[844,390]]){
    await viewport(width,height);await openMuseum();await area('landscape');await click('[data-entry-card=entrance]');
    await check('JSON.stringify([...document.querySelectorAll(".kd-tabs button span")].map(e=>e.textContent))===JSON.stringify(["Quần thể","Khuôn viên","Tầng trệt","Tầng lầu"])','Four tabs keep their order at '+width);
    await check('document.querySelector(".kd-visual").textContent.includes("Chưa có ảnh cho khu vực này")&&!document.querySelector(".kd-marker,.md-places-topic,.md-places-tiles")','Missing flycam has no borrowed photograph or guessed positions at '+width);
    await check('document.querySelectorAll(".kd-floor-links button").length===2','Museum introduction has both floor entrances at '+width);
    await click('[data-entry-card=memorial]');await check('document.querySelector(".kd-detail").dataset.selectedPlace==="memorial"&&document.querySelector("[data-entry-card=memorial]").getAttribute("aria-pressed")==="true"&&!document.querySelector("dialog[open]")','Choosing a site synchronizes its introduction without opening detail at '+width);
    await area('grounds');
    await click('[data-entry-card=facade-view]');await loaded();
    await check('document.querySelector("#museo-map").dataset.photo==="facade"&&document.querySelector(".kd-detail").dataset.selectedPhoto==="facade"','Grounds shows the documented facade at '+width);
    await touch('.kd-image-controls button:last-child');await loaded();
    await check('document.querySelector("#museo-map").dataset.photo==="roof"&&document.querySelector(".kd-detail").dataset.selectedPhoto==="roof"&&document.querySelector("[data-entry-card=roof-view]").getAttribute("aria-pressed")==="true"','Image next button synchronizes photo, card and introduction at '+width);
    await click('[data-entry-card=memorial-view]');await loaded();
    await check('document.querySelector("#museo-map").dataset.photo==="memorial"&&document.querySelector(".kd-detail").dataset.selectedEntry==="memorial-view"&&!document.querySelector("dialog[open]")','Grounds card selects the same large photograph at '+width);
    await check('(()=>{const s=getComputedStyle(document.querySelector(".kd-main-photo"));return s.filter==="none"&&s.opacity==="1"&&s.maskImage==="none"&&s.objectFit==="contain"})()','Main photograph stays bright and uncropped at '+width);
    await check('(()=>{const image=document.querySelector(".kd-main-photo").getBoundingClientRect(),frame=document.querySelector(".kd-visual").getBoundingClientRect();return image.top>=frame.top&&image.bottom<=frame.bottom&&image.left>=frame.left&&image.right<=frame.right})()','Actual image bounds fit within the photograph frame at '+width);
    if(width>=1280)await check('[...document.querySelectorAll(".kd-tabs button,.kd-image-controls button")].every(b=>{const r=b.getBoundingClientRect();return r.width>=48&&r.height>=48&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===b})','Kiosk tabs and image controls have reachable 48px targets at '+width);
    await shot('khmer-discovery-grounds-'+width+'x'+height);
    await area('ground');await check('document.querySelectorAll("[data-room-entry]").length===3&&!document.querySelector("[data-room-entry=welcome] img,[data-room-entry=stairs] img")','Ground floor keeps existing areas without substitute photographs and a separate trial at '+width);
    await click('[data-room-entry=welcome]');await check('document.querySelector("#museo-map").dataset.room==="welcome"&&document.querySelector(".kd-visual").textContent.includes("Chưa có ảnh cho khu vực này")','A ground-floor area remains accessible with missing photography at '+width);
    await click('.kd-back');await check('document.querySelector("#museo-map").dataset.zone==="ground"&&document.querySelectorAll("[data-room-entry]").length===3','Back returns to the correct ground-floor list at '+width);
    await area('upper');await check('document.querySelectorAll("[data-room-entry]").length===6','Upper floor lists existing display topics at '+width);
    await click('[data-room-entry=performing]');await loaded();await touch('.kd-image-controls button:last-child');await loaded();
    await check('document.querySelector("#museo-map").dataset.room==="performing"&&document.querySelector("#museo-map").dataset.photo==="drum"&&document.querySelector(".kd-detail").dataset.selectedPhoto==="drum"','Room image navigation stays inside the chosen display at '+width);
    await click('[data-object-card=mask]');await wait('document.querySelector(".kd-object-dialog")?.open','object detail');
    await check('document.querySelector(".kd-object-dialog").matches(":modal")&&document.querySelector(".kd-object-dialog img")&&document.querySelector(".kd-object-dialog figcaption").textContent.length>30&&document.querySelector(".kd-object-body article p")','Object opens its close photograph, caption and existing story at '+width);
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector(".kd-object-dialog")','object closes');
    await check('document.querySelector("#museo-map").dataset.room==="performing"&&document.querySelector("#museo-map").dataset.photo==="drum"&&document.querySelector(".kd-detail").dataset.selectedPhoto==="drum"&&document.activeElement.dataset.objectCard==="mask"','Closing an object restores its exact room, image, introduction and focus at '+width);
    await shot('khmer-discovery-room-'+width+'x'+height);
    await click('.kd-back');await click('[data-room-entry=performing]');await check('document.querySelector("#museo-map").dataset.photo==="drum"','Reopening a display restores its last image at '+width);
    await click('.kd-back');await click('[data-room-entry=manuscripts]');await check('document.querySelector(".kd-visual .kd-missing")&&!document.querySelector("[data-object-card]")&&document.querySelector(".kd-strip-empty")','Missing manuscript imagery does not reuse unrelated objects at '+width);
    await click('.kd-back');await area('grounds');
    await check('document.querySelector(".kd-detail").dataset.selectedEntry==="memorial-view"','Returning to a tab retains its selection at '+width);
    await check('(()=>{const f=document.querySelector(".md-footer").getBoundingClientRect(),v=document.querySelector(".kd-visual").getBoundingClientRect(),b=document.querySelector(".kd-tabs").getBoundingClientRect();return document.querySelector(".md-root").scrollWidth<=innerWidth+1&&f.bottom===innerHeight&&v.height>(innerHeight<480?65:100)&&b.top>=v.bottom-1&&b.bottom<=f.top&&document.querySelectorAll(".md-footer>button").length===5})()','Image, four tabs and persistent dock fit without horizontal overflow at '+width+'x'+height);
  }
  await viewport(1920,1080);await openMuseum();await area('upper');
  await page('document.querySelector("#kd-tab-upper").focus()');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Home',code:'Home',windowsVirtualKeyCode:36});
  await check('document.querySelector("#museo-map").dataset.zone==="landscape"&&document.activeElement.id==="kd-tab-landscape"','Tab keyboard selection updates both content and focus');
  await area('upper');await click('[data-room-entry=faith]');await click('[data-object-card=chair]');await wait('document.querySelector(".kd-object-dialog")?.open','chair detail');
  await check('document.querySelector(".kd-object-body h3").textContent==="Câu chuyện hiện vật"','Preaching chair reuses its existing dedicated object story');await click('.kd-object-dialog header button');
  await area('grounds');await click('.kd-directory');await wait('document.querySelector(".md-place-directory")','directory');await click('[data-directory-place=daily-life]');await wait('!document.querySelector("dialog[open]")','directory closes');
  await check('document.querySelector("#museo-map").dataset.zone==="upper"&&document.querySelector(".kd-detail").dataset.selectedPlace==="daily-life"','External directory selection updates the discovery hierarchy');
  await click('.kd-directory');await wait('document.querySelector(".md-place-directory")','directory for an unlocated object');await click('[data-directory-place=boat]');await wait('document.querySelector(".md-place-viewer")?.open','existing unlocated-object story');
  await check('document.querySelector(".md-place-viewer-panel").dataset.placeId==="boat"&&document.querySelector(".kd-detail").dataset.selectedPlace==="daily-life"','An object without a confirmed floor opens its existing story and preserves the current display');await click('.md-place-viewer .md-dialog-close');await wait('!document.querySelector(".md-place-viewer")','unlocated-object story closes');
  await area('grounds');await click('[data-entry-card=roof-view]');await loaded();await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.setBlockedURLs',{urls:['*qa-missing-roof*']});await page('for(const img of document.querySelectorAll(".kd-visual img,.kd-detail-image img"))img.src+="?qa-missing-roof=1"');
  await wait('document.querySelector(".kd-visual .kd-missing")&&document.querySelector(".kd-detail-image .kd-missing")','failed photograph fallback');
  await check('document.querySelector(".kd-detail").dataset.selectedEntry==="roof-view"&&document.querySelector("[data-entry-card=roof-view]").getAttribute("aria-pressed")==="true"','Failed photographs retain synchronized cards and introductions');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('[data-entry-card=facade-view]');await click('[data-entry-card=roof-view]');await wait('document.querySelector(".kd-visual img")?.naturalWidth>0','photograph recovers on returning to the view');await cdp('Network.setCacheDisabled',{cacheDisabled:false});
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS No uncaught browser exceptions');
`;
const compiled = new Module(file, module);
compiled.filename = file;
compiled.paths = Module._nodeModulePaths(path.dirname(file));
compiled._compile(source.slice(0, begin) + body + source.slice(end), file);
