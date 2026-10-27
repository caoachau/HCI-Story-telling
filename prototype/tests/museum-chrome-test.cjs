/* Main museum footer, photograph framing and concurrent room transitions. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  const museum=async()=>{await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html'});await wait('document.querySelector(".md-footer")','museum footer');await page('await document.fonts.ready');};
  const idle=()=>wait('!document.querySelector("[data-room-outgoing]")&&document.querySelector(".md-scroll").dataset.roomMotion!=="entering"','room crossfade finished');
  const go=async id=>{await click('.md-footer [data-section='+id+']');await wait('document.querySelector("#museo-'+id+'")?.hidden===false','room '+id);await idle();};
  const toolsTouch='[...document.querySelectorAll(".md-detail-tools>button")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===b})';
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  for(const [width,height] of [[1920,1080],[1280,720],[3840,2160],[768,1024],[390,844],[320,720],[844,390]]){
    await viewport(width,height);await museum();
    await wait('[...document.querySelectorAll(".md-hero-context img")].every(i=>i.complete&&i.naturalWidth>0)','three overview photographs');
    await check('document.querySelectorAll(".md-footer>button").length===5&&!document.querySelector(".md-chapter-dock,.md-screen-nav")','Exactly five persistent footer tabs at '+width);
    await check('(()=>{const r=document.querySelector(".md-footer").getBoundingClientRect();return r.left===0&&r.right===innerWidth&&r.bottom===innerHeight&&r.height>=66&&document.querySelector(".md-root").scrollWidth<=innerWidth+1})()','Footer touches both screen edges and the bottom at '+width+'x'+height);
    await check(toolsTouch,'Three tools remain touchable at '+width+'x'+height);
    await check('(()=>{const r=document.querySelector(".md-detail-tools").getBoundingClientRect();return r.top===(innerWidth<=600?10:innerWidth<=1200?12:14)&&innerWidth-r.right===(innerWidth<=600?12:innerWidth<=1200?14:18)})()','Tools use the memorial position at '+width);
    await check('getComputedStyle(document.querySelector(".md-intro-shade")).opacity==="1"&&getComputedStyle(document.querySelector(".md-hero-art")).maskImage==="none"&&getComputedStyle(document.querySelector(".md-hero-art")).opacity==="1"','Photograph uses one light shade without opaque side masks at '+width);
    await check('(()=>{const f=document.querySelector(".md-footer").getBoundingClientRect();return [...document.querySelectorAll(".md-hero-context img")].every(i=>{const r=i.getBoundingClientRect();return r.width>=(innerWidth>=1900?145:innerWidth>=1000?96:innerHeight<600?55:75)&&Math.abs(r.width/r.height-1)<.02&&r.left>=0&&r.right<=innerWidth&&r.bottom<f.top})})()','All three larger photos retain square proportions and fit at '+width);
    if(height>=700)await check('document.querySelector(".md-hero-copy").getBoundingClientRect().bottom<document.querySelector(".md-hero-context").getBoundingClientRect().top','Introduction text stays above the three photos at '+width);
    if([1920,390,844].includes(width))await shot('museum-chrome-'+width+'x'+height);
    for(const id of ['map','timeline','tour','exhibitions','hero']){
      await go(id);
      await check('document.querySelectorAll(".md-footer [aria-current=page]").length===1&&document.querySelectorAll(".md-main>.md-section:not([hidden])").length===1&&document.querySelector(".md-root").scrollWidth<=innerWidth+1','Only '+id+' is active with a stable footer at '+width);
      await check(toolsTouch,'Tools remain above '+id+' content at '+width);
      await check('(()=>{const b=document.querySelector(".md-footer [aria-current=page]").getBoundingClientRect(),f=document.querySelector(".md-footer").getBoundingClientRect();return b.left>=f.left-1&&b.right<=f.right+1})()','The selected '+id+' tab is visible at '+width);
    }
    await click('.md-hero-copy>.md-play-link');await wait('document.querySelector("#museo-overview")?.hidden===false','detailed overview');
    await check('document.querySelector(".md-footer [data-section=hero]").getAttribute("aria-current")==="page"','Detailed overview belongs to the first footer tab at '+width);
  }
  await viewport(1920,1080);await museum();
  await click('.md-detail-tools-share');await wait('document.querySelector(".md-qr-dialog")?.open&&document.querySelector(".md-qr-image img")?.complete','native QR code');
  await check('document.querySelector(".md-qr-dialog").matches(":modal")&&document.querySelector(".md-qr-image img").naturalWidth===512','QR utility works on the standalone museum page');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
  await wait('!document.querySelector(".md-qr-dialog")','QR closes');
  await check('document.activeElement.matches(".md-detail-tools-share")','QR Escape restores focus');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await click('.md-footer [data-section=map]');await sleep(70);
  await check('(()=>{const o=document.querySelector("[data-room-outgoing]"),n=document.querySelector("#museo-map");return o&&!o.hidden&&o.inert&&o.getAttribute("aria-hidden")==="true"&&!n.hidden&&document.querySelector(".md-scroll").getAttribute("aria-busy")==="true"&&new DOMMatrixReadOnly(getComputedStyle(n).transform).a===1&&!document.querySelector(".md-room-sweep")})()','Actual rooms overlap during the crossfade without scaling or a dark sweep');
  await idle();
  await check('document.querySelectorAll(".md-main>.md-section:not([hidden])").length===1&&document.querySelector(".md-scroll").getAttribute("aria-busy")==="false"','Crossfade releases the outgoing room and input');
  await click('.md-footer [data-section=timeline]');await click('.md-footer [data-section=tour]');await click('.md-footer [data-section=exhibitions]');
  await wait('document.querySelector("#museo-exhibitions")?.hidden===false','last rapid destination');await idle();
  await check('document.querySelector(".md-footer [aria-current=page]").dataset.section==="exhibitions"&&!document.querySelector("[data-room-outgoing]")','Rapid tab presses keep the last requested room');
  await click('.md-footer [data-section=map]');await sleep(40);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await idle();
  await check('!document.querySelector("[data-room-outgoing]")&&document.querySelector("#museo-map").style.opacity===""','Reduced motion cancels an in-progress crossfade cleanly');
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/'});
  await wait('document.querySelector(".landmark-carousel-card[data-site-id=bao-tang-khmer]")&&document.querySelector(".map-top-actions")','map host');
  await click('.landmark-carousel-card[data-site-id=bao-tang-khmer]');
  if(await page('return !!document.querySelector(".map-story-action")'))await click('.map-story-action');
  await wait('document.querySelector(".lqv-root")?.dataset.siteId==="bao-tang-khmer"','museum quick view');
  await click('[data-action=show-location-details]');await wait('document.querySelector(".heritage-location-detail .md-footer")','integrated museum');
  await check('document.querySelectorAll(".md-detail-tools>button").length===3&&document.querySelector(".md-root").getBoundingClientRect().width===innerWidth','Map host uses the same three tools and full museum layout');
  await go('timeline');await page('window.savedMuseum=document.querySelector(".md-root")');
  await click('.md-detail-tools>button:nth-child(2)');await wait('document.querySelector("[data-location-view=quick]")','museum collapsed');
  await click('[data-action=show-location-details]');await wait('document.querySelector("[data-location-view=detail]")','museum reopened');
  await check('document.querySelector(".md-root")===savedMuseum&&document.querySelector(".md-footer [aria-current=page]").dataset.section==="timeline"','Collapse and reopen preserve the museum room');
  await click('.md-detail-tools>button:last-child');await wait('!document.querySelector(".md-root")','museum closed');
  await check('getComputedStyle(document.querySelector(".heritage-header")).visibility==="visible"','Close returns to the main map header');
  for(const [width,height] of [[1920,1080],[1280,720],[3840,2160],[2560,1080],[390,844]]){
    await viewport(width,height);await open();await click('[data-overview-slide="2"]');
    await wait('document.querySelector(".db-overview-carousel").dataset.overviewIndex==="2"&&document.querySelector(".db-overview-carousel").dataset.imageState==="ready"','supplied statue photo');
    await check('getComputedStyle(document.querySelector(".db-overview-image--in .db-overview-artwork")).backgroundImage.includes("03-shrine-user")&&!document.querySelector(".db-overview-background-fill")','Tab 03 uses the supplied image once at '+width);
    if(width>=1000)await check('(()=>{const s=getComputedStyle(document.querySelector(".db-overview-image--in .db-overview-artwork")),size=s.backgroundSize.split(" ").map(parseFloat),p=s.backgroundPosition.split(" ").map(parseFloat),footer=document.querySelector(".db-navigation").getBoundingClientRect();return Math.abs(size[0]/size[1]-1774/887)<.001&&p[1]+80*size[1]/887>65&&p[1]+790*size[1]/887<footer.top-4&&p[0]+760*size[0]/1774>=0&&p[0]+1330*size[0]/1774<=innerWidth})()','Quotation and full pedestal stay visible without stretching at '+width+'x'+height);
    if(width===1920||width===390)await shot('statue-new-'+width);
  }
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS No uncaught browser exceptions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));
compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
