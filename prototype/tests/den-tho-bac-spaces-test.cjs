/* Native map coordinates, matching guide, inner scrolling and touch at 4K. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const expected=JSON.parse(fs.readFileSync(path.join(root,'src/assets/den-tho-bac/map-current-coordinates.json'),'utf8')).points;
  const ids=['temple','exhibition','reception','artifacts','boat','stilt-house','camping','pond'];
  const ready=()=>wait('document.querySelector(".db-aerial-plane img")?.complete&&document.querySelector(".db-aerial-plane img").naturalWidth===2560','new aerial image');
  const selected=async i=>{await wait('document.querySelector(".db-atlas-panel").dataset.panelView==="summary"&&document.querySelector(".db-atlas-panel").dataset.spaceId==='+JSON.stringify(ids[i]),'chosen map point');await settle();};
  const nativeClick=async selector=>{const p=await page('const r=document.querySelector('+JSON.stringify(selector)+').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...p});await cdp('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...p});await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...p});};
  const coordinates=()=>check('(()=>{const plane=document.querySelector(".db-aerial-plane").getBoundingClientRect(),points='+JSON.stringify(expected)+';return points.every(p=>{const r=document.querySelector(".db-map-point[data-space-code=\\""+p.code+"\\"]").getBoundingClientRect();return Math.abs(r.x+r.width/2-plane.x-plane.width*p.percent[0]/100)<1&&Math.abs(r.y+r.height/2-plane.y-plane.height*p.percent[1]/100)<1})})()','All eight pin centers match the marked photograph');
  for(const [width,height] of [[1774,887],[1920,1080],[1280,720],[3840,2160],[1440,900],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=spaces');await ready();await settle();
    await check('document.querySelectorAll(".db-map-point").length===8&&document.querySelectorAll(".db-space-list>button").length===8&&[...document.querySelectorAll(".db-space-list strong")].map(el=>el.textContent).join("|")==='+JSON.stringify(expected.map(p=>p.name).join('|')),'Eight names match the new reference at '+width);
    await check('document.querySelector(".db-aerial-plane img").src.includes("map-current-v2-")&&document.querySelector(".db-aerial-plane img").naturalHeight===1440&&getComputedStyle(document.querySelector(".db-aerial-plane img")).filter==="none"','The supplied clean image is used without colour edits at '+width);
    await coordinates();
    await check('[...document.querySelectorAll(".db-map-point")].every(el=>{const r=el.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest(".db-map-point")===el&&r.width>=44&&r.height>=44})','Every pin can be touched directly at '+width);
    await check('[...document.querySelectorAll(".db-map-point")].every(el=>getComputedStyle(el).backgroundColor==="rgb(16, 16, 16)"&&getComputedStyle(el).borderTopColor==="rgb(255, 255, 255)"&&getComputedStyle(el).color==="rgb(255, 255, 255)")&&[...document.querySelectorAll(".db-space-list>button")].every(el=>getComputedStyle(el).backgroundColor==="rgb(16, 16, 16)")&&getComputedStyle(document.querySelector(".db-atlas-title h1")).color==="rgb(255, 255, 255)"&&getComputedStyle(document.querySelector(".db-atlas-panel")).backgroundColor==="rgb(16, 16, 16)"','Black markers and guide use white text and borders with red accents at '+width);
    if(width>900){
      await check('(()=>{const p=document.querySelector(".db-atlas-panel").getBoundingClientRect(),n=document.querySelector(".db-navigation").getBoundingClientRect(),s=getComputedStyle(document.querySelector(".db-atlas-panel"));return Math.abs(n.top-p.bottom)<.6&&parseFloat(s.borderBottomLeftRadius)===0&&parseFloat(s.borderBottomRightRadius)===0&&s.overflowY==="hidden"&&getComputedStyle(document.querySelector(".db-space-list")).overflowY==="auto"})()','Square panel meets the navigation border with its list scrolling inside at '+width);
      await check('(()=>{const p=document.querySelector(".db-atlas-panel").getBoundingClientRect();return [...document.querySelectorAll(".db-map-point")].every(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<p.left&&r.top>=0&&r.bottom<document.querySelector(".db-navigation").getBoundingClientRect().top})})()','Pins stay clear of the panel and navigation at '+width);
      await check('[...document.querySelectorAll(".db-map-point:not([data-label-side])")].every(el=>{const r=el.getBoundingClientRect(),l=el.querySelector(".db-map-point-label").getBoundingClientRect();return Math.abs((r.left+r.right-l.left-l.right)/2)<1})','Upper labels are centered over their pins at '+width);
    }
    if([1920,1280,3840,390].includes(width))await shot('spaces-red-final-'+width+'x'+height+'-list');
    await click('.db-space-list>button:last-child');await selected(7);
    await check('!document.querySelector(".db-space-list")&&document.querySelectorAll(".db-map-point[aria-pressed=true]").length===1&&document.querySelector("#db-space-description h2").textContent==='+JSON.stringify(expected[7].name),'Choosing one point replaces the list with its summary at '+width);
    if(width>900)await check('document.querySelector("[data-action=open-space-details]").getBoundingClientRect().bottom<document.querySelector(".db-atlas-panel").getBoundingClientRect().bottom','Detail action stays inside the panel at '+width);
    await check('document.querySelector(".db-kiosk").scrollWidth<=innerWidth&&document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1','No horizontal overflow at '+width);
    if([1920,1280,3840,390].includes(width))await shot('spaces-red-final-'+width+'x'+height+'-pond');
  }
  await viewport(1920,1080);await open('?section=spaces');await ready();await settle();
  const effects=new Set();
  for(let i=0;i<expected.length;i++){
    await nativeClick('.db-map-point[data-space-code="'+expected[i].code+'"]');await selected(i);
    await check('document.querySelector("#db-space-description h2").textContent==='+JSON.stringify(expected[i].name),'Native marker '+expected[i].code+' opens the matching summary');
    effects.add(await page('return getComputedStyle(document.querySelector(".db-atlas-selection")).animationName'));
    await click('[data-action=open-space-details]');await wait('document.querySelector("dialog[open]")','point story');
    await check('document.querySelector("#db-reader-title").textContent==='+JSON.stringify(expected[i].name)+'&&document.querySelector("a[href*=map-current-marked-v2]")','Point '+expected[i].code+' opens its own full story and new marked reference');
    await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','reader closes');
  }
  assert.equal(effects.size,8,'Existing eight distinct selection entrances remain available');console.log('PASS Eight finite selection entrances');
  await click('.db-atlas-closeup');await wait('document.querySelector(".db-atlas-viewport").dataset.zoom==="1.5"','close-up');await settle();await coordinates();
  await click('.db-atlas-closeup');await settle();await coordinates();
  await click('[data-action=show-space-list]');await wait('document.querySelector(".db-space-list")','list restored');
  await viewport(1280,720);await settle();await check('document.querySelector(".db-space-list").scrollHeight>document.querySelector(".db-space-list").clientHeight','Short desktop uses an internal list scroller');
  await click('.db-space-list>button:first-child');await selected(0);await click('[data-action=show-space-list]');await settle();
  await page('document.querySelector(".db-space-list>button").focus({preventScroll:true})');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'End',code:'End',windowsVirtualKeyCode:35,nativeVirtualKeyCode:35});
  await check('document.activeElement.dataset.spaceId==="pond"&&document.querySelector(".db-space-list").scrollTop>0&&(()=>{const r=document.activeElement.getBoundingClientRect(),p=document.querySelector(".db-space-list").getBoundingClientRect();return r.top>=p.top-1&&r.bottom<=p.bottom+1})()','Keyboard End reveals the last card inside the panel');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await selected(7);
  await viewport(3840,2160);await open('?section=spaces');await ready();await settle();await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  for(const i of [2,5,7]){const p=await page('const r=document.querySelector(".db-map-point[data-space-code=\\"'+expected[i].code+'\\"]").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await selected(i);}
  console.log('PASS Native 4K touch opens three separated landmarks');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await click('.db-map-point[data-space-code="01"]');await selected(0);await check('getComputedStyle(document.querySelector(".db-atlas-selection")).animationName==="none"','Reduced motion is respected');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
