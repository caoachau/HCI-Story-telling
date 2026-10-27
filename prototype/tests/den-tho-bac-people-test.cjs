/* Verify the supplied People composition in the real production kiosk. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const harnessPath=path.resolve(__dirname,'den-tho-bac-test.cjs');
const source=fs.readFileSync(harnessPath,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`

  const fullWidthPhoto=async person=>{
    await check('(()=>{const prefix=".db-"+'+JSON.stringify(person)+',stage=document.querySelector(prefix+"-photo-stage"),art=document.querySelector(prefix+"-artwork"),image=art.querySelector("img"),picture=art.querySelector(".db-picture"),caption=document.querySelector(prefix+"-photo>figcaption"),label=art.querySelector(".db-people-photo-label"),a=art.getBoundingClientRect(),s=stage.getBoundingClientRect(),p=picture.getBoundingClientRect(),c=caption.getBoundingClientRect(),l=label.getBoundingClientRect(),style=getComputedStyle(image),matrix=new DOMMatrixReadOnly(style.transform);return Math.abs(a.left-s.left)<.6&&Math.abs(a.right-s.right)<.6&&Math.abs(p.width-art.clientWidth)<.6&&[stage,art,picture,image].every(el=>{const cs=getComputedStyle(el);return cs.maxWidth==="none"&&parseFloat(cs.paddingLeft)===0&&parseFloat(cs.paddingRight)===0&&parseFloat(cs.marginLeft)===0&&parseFloat(cs.marginRight)===0})&&style.display==="block"&&Math.abs(parseFloat(style.width)-picture.clientWidth)<.6&&Math.abs(image.clientWidth/image.clientHeight-image.naturalWidth/image.naturalHeight)<.02&&Math.abs(matrix.a-matrix.d)<.00001&&c.top>=s.bottom-.6&&Math.abs(l.left-a.left-1)<.6&&Math.abs(l.top-a.top-1)<.6})()','Full-width '+person+' image, undistorted crop, corner label and separate caption');

    if(await page('return getComputedStyle(document.querySelector(".db-'+person+'-photo-stage")).overflowY==="auto"')){
      await check('(()=>{const pane=document.querySelector(".db-'+person+'-photo-stage"),art=document.querySelector(".db-'+person+'-artwork"),caption=document.querySelector(".db-'+person+'-photo>figcaption"),before=caption.getBoundingClientRect().top;pane.scrollTop=pane.scrollHeight;const a=art.getBoundingClientRect(),s=pane.getBoundingClientRect();const ok=a.bottom<=s.bottom+1&&caption.getBoundingClientRect().top===before&&s.bottom<=caption.getBoundingClientRect().top;pane.scrollTop=0;return ok})()','The complete '+person+' photograph can be reached without moving its caption');
    }
  };

  const loaded=()=>wait('document.querySelector(".db-witness-artwork img")?.complete&&document.querySelector(".db-witness-artwork img")?.naturalWidth>0','witness photograph loaded');
  for(const [width,height] of [[1672,941],[1920,1080],[3840,2160],[1280,720],[1920,900],[2560,1080],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=people');await loaded();await settle();
    await fullWidthPhoto('witness');
    await shot('people-witness-'+width+'x'+height);
    await check('document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1&&('+width+'<1280||document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1)','People screen has no horizontal overflow and fits desktop at '+width+'x'+height);
    await check('(()=>{const art=document.querySelector(".db-witness-artwork").getBoundingClientRect(),main=document.querySelector("'+(width>=1280?'main':'.db-people-shell')+'").getBoundingClientRect(),image=document.querySelector(".db-witness-artwork img");return Math.abs(art.width/art.height-1212/569)<.001&&art.left>=main.left-1&&art.right<=main.right+1&&art.top>=main.top-1&&document.querySelector(".db-witness-photo-stage").getBoundingClientRect().bottom<=main.bottom+1&&getComputedStyle(image).objectFit==="contain"&&getComputedStyle(image).filter==="none"&&image.naturalWidth===1672&&image.src.includes("witness-layout-v2-")})()','Badge-free photograph keeps its proportions within the chapter at '+width+'x'+height);
    await check('[...document.querySelectorAll("'+(width>=1280?'main button':'.db-person-tabs button')+'")].every(button=>{const r=button.getBoundingClientRect(),m=document.querySelector("main").getBoundingClientRect();return r.height>=40&&r.left>=m.left&&r.right<=m.right&&r.top>=m.top&&r.bottom<=m.bottom&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','Both selectors remain visible and touchable at '+width+'x'+height);
    await check('document.querySelector(".db-person-tabs").getBoundingClientRect().bottom+8<=document.querySelector(".db-witness-copy").getBoundingClientRect().top&&!document.querySelector(".db-witness-footer")&&document.querySelectorAll(".db-person-tabs").length===1&&document.querySelector(".db-witness-copy .db-witness-question")&&document.querySelector(".db-witness-photo-label")','One shared vertical selector sits above the witness introduction at '+width+'x'+height);
    await check('(()=>{const r=document.querySelector(".db-witness-artwork").getBoundingClientRect(),rects=[...document.querySelectorAll(".db-detail-tools,main button,.db-witness-caption,.db-witness-question")].filter(el=>getComputedStyle(el).display!=="none").map(el=>el.getBoundingClientRect()),walker=document.createTreeWalker(document.querySelector(".db-witness-copy"),NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);rects.push(...range.getClientRects());}return [[330,120],[586,190],[804,145],[532,125],[330,597],[570,558],[614,560],[816,597]].every(([x,y])=>{const px=r.x+x/1212*r.width,py=r.y+(y-44)/569*r.height;const stage=document.querySelector(".db-witness-photo-stage"),s=stage.getBoundingClientRect();if(py<s.top||py>s.bottom)return stage.scrollHeight>stage.clientHeight;return !rects.some(b=>px>=b.left&&px<=b.right&&py>=b.top&&py<=b.bottom)})})()','Faces, raised hand and feet stay undistorted and remain accessible in the photo pane at '+width+'x'+height);
    await page('window.peopleMenu=document.querySelector(".db-person-tabs");window.peopleMenuRects=[...peopleMenu.children].map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})');
    await click('.db-person-tabs button:last-child');await wait('document.querySelector("[data-person-tab=portrait]")','portrait selection');await settle();
    await check('window.peopleMenu===document.querySelector(".db-person-tabs")&&[...peopleMenu.children].every((el,i)=>{const r=el.getBoundingClientRect(),before=peopleMenuRects[i];return ["x","y","width","height"].every(key=>Math.abs(r[key]-before[key])<.5)})','Switching to portrait preserves the same menu nodes and exact button positions at '+width+'x'+height);
    await click('.db-person-tabs button:first-child');await loaded();await settle();
    await check('window.peopleMenu===document.querySelector(".db-person-tabs")&&[...peopleMenu.children].every((el,i)=>{const r=el.getBoundingClientRect(),before=peopleMenuRects[i];return ["x","y","width","height"].every(key=>Math.abs(r[key]-before[key])<.5)})','Switching back preserves the exact selector positions at '+width+'x'+height);
  }
  for(const [width,height] of [[1672,941],[1920,1080],[3840,2160],[1280,720],[1920,900],[2560,1080],[768,1024],[390,844],[320,720]]){
    await viewport(width,height);await open('?section=people&person=portrait');
    await wait('[...document.querySelectorAll("main img")].every(image=>image.complete&&image.naturalWidth>0)','portrait photographs loaded');await settle();
    await fullWidthPhoto('portrait');
    await shot('people-portrait-'+width+'x'+height);
    await check('document.querySelector("[data-person-tab=portrait]")&&document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1','Portrait link opens the second tab without horizontal overflow at '+width+'x'+height);
    await check('(()=>{const artwork=document.querySelector(".db-portrait-artwork").getBoundingClientRect(),photo=document.querySelector(".db-portrait-photo-stage").getBoundingClientRect();return document.querySelector(".db-portrait-photo-label")&&artwork.width>0&&artwork.height>0&&Math.abs(artwork.width/artwork.height-522/627)<.01&&artwork.left>=photo.left-1&&artwork.right<=photo.right+1&&artwork.top>=photo.top-1&&Math.abs(artwork.width-photo.width)<1})()','Artist close view excludes the baked-in badge at '+width+'x'+height);
    await check('document.querySelector(".db-portrait-archive img").src.includes("ho-chi-minh-portrait-updated-")&&document.querySelector(".db-portrait-archive img").naturalWidth===1315&&getComputedStyle(document.querySelector(".db-portrait-archive img")).objectFit==="contain"&&getComputedStyle(document.querySelector(".db-portrait-archive img")).filter==="none"','Updated supplied archive photograph stays complete and unfiltered at '+width+'x'+height);
    if(width>=1280){
      await check('document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1&&[...document.querySelectorAll("main button")].every(button=>{const r=button.getBoundingClientRect(),main=document.querySelector("main").getBoundingClientRect();return r.height>=44&&r.top>=main.top&&r.bottom<=main.bottom&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','Portrait controls fit in the fixed screen and remain touchable at '+width+'x'+height);
      await check('(()=>{const columns=[...document.querySelector(".db-people-layout").children].map(el=>el.getBoundingClientRect());return columns.every((r,i)=>!i||(Math.abs(r.top-columns[0].top)<1&&r.left>=columns[i-1].right))&&document.querySelector(".db-portrait-copy").getBoundingClientRect().bottom+16<=document.querySelector(".db-portrait-credit").getBoundingClientRect().top})()','Three columns and the source footer remain separate at '+width+'x'+height);
    } else {
      await page('document.querySelector(".db-portrait-read").scrollIntoView({block:"center"})');
      await check('(()=>{const button=document.querySelector(".db-portrait-read"),r=button.getBoundingClientRect();return r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})()','Portrait story remains reachable in the narrow layout at '+width+'x'+height);
    }
  }
  await viewport(1920,1080);await open('?section=people');await loaded();await settle();
  await check('document.querySelector(".db-people").dataset.motionOwner==="gsap"&&getComputedStyle(document.querySelector(".db-witness-photo")).opacity==="1"&&getComputedStyle(document.querySelector(".db-witness-artwork")).transform==="none"','Photo entrance fades without zooming');
  await click('.db-witness-read');await wait('document.querySelector("dialog[open]")','witness story opens');
  await check('document.querySelector("#db-reader-title").textContent.length>0&&document.querySelector(".db-lead").textContent.includes("Phan Văn Tiềm")&&document.querySelectorAll(".db-reader-chapter").length>=3&&document.querySelector(".db-reader-photo img").src.includes("witness-")','CTA opens the witness account and original journalistic photograph');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','witness story closes');
  await check('document.activeElement===document.querySelector(".db-witness-read")','Closing the story restores CTA focus');
  await click('.db-person-tabs button:last-child');await settle();
  await check('document.querySelector("[data-person-tab=portrait]")&&document.querySelector(".db-person-copy h2").textContent.includes("Phong Ba")&&!document.querySelector(".db-witness-artwork")&&document.activeElement===document.querySelector(".db-person-tabs button:last-child")','Second tab preserves its separate portrait layout and receives focus');
  await shot('people-portrait-preserved');
  await click('.db-person-copy .db-button');await wait('document.querySelector("dialog[open]")','portrait story opens');
  await check('!document.querySelector(".db-lead").textContent.includes("Phan Văn Tiềm")&&document.querySelector(".db-reader-photo img").src.includes("artist-interview-original-")&&document.querySelector(".db-reader-layout figcaption").textContent.includes("Đắk Nông")','Second tab opens its own story and original supplied photograph');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','portrait reader closes');
  await click('.db-person-tabs button:first-child');await loaded();await settle();
  await check('document.querySelector("[data-person-tab=witness]")&&document.activeElement===document.querySelector(".db-person-tabs button:first-child")','Returning to the witness tab restores its composition and focus');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowDown',code:'ArrowDown',windowsVirtualKeyCode:40});
  await wait('document.querySelector("[data-person-tab=portrait]")&&document.activeElement===document.querySelector(".db-person-tabs button:last-child")','vertical keyboard selection moves focus');
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Home',code:'Home',windowsVirtualKeyCode:36});
  await wait('document.querySelector("[data-person-tab=witness]")&&document.activeElement===document.querySelector(".db-person-tabs button:first-child")','Home returns to the first story');console.log('PASS Vertical keyboard selection changes story and focus together');
  await click('[data-detail-action=sources]');await wait('document.querySelector("dialog[open]")','source layer opens');
  await check('document.querySelectorAll(".db-source-list>a").length===5&&document.querySelector(".db-history-source-note").textContent.includes("Con người")','Shared source control retains all sources and explains the edited illustration');
  await click('.db-reader-bar button');await wait('!document.querySelector("dialog")','source layer closes');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
  const tapTab=async index=>{const point=await page('const r=document.querySelectorAll(".db-person-tabs button")['+index+'].getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  await tapTab(1);await wait('document.querySelector("[data-person-tab=portrait]")','touch selects portrait');
  await tapTab(0);await loaded();console.log('PASS Native touch selects both stories using the persistent menu');
  const touch=await page('const r=document.querySelector(".db-witness-read").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}');
  await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch]});await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait('document.querySelector("dialog[open]")','actual touch opens witness story');console.log('PASS Native touch opens the story');
  await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
  await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait('!document.querySelector("dialog")','Escape closes touch reader');
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await open('?section=people');await loaded();
  await check('getComputedStyle(document.querySelector(".db-witness-artwork")).animationName==="none"&&getComputedStyle(document.querySelector(".db-witness-copy")).animationName==="none"','Reduced motion disables both entrances');
  await cdp('Emulation.setEmulatedMedia',{features:[]});await page('document.documentElement.classList.add("reduce-motion")');
  await check('getComputedStyle(document.querySelector(".db-witness-artwork")).animationName==="none"&&getComputedStyle(document.querySelector(".db-witness-copy")).animationName==="none"','Host accessibility preference disables both entrances');
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.setBlockedURLs',{urls:['*witness-layout-v2-*.webp']});await open('?section=people');
  await wait('document.querySelector(".db-witness-artwork .db-picture")?.dataset.imageState==="error"','failed photograph state');
  await check('document.querySelector(".db-witness-copy h2").textContent.startsWith("Phan Văn Tiềm")&&document.querySelector(".db-witness-read")&&document.querySelector(".db-witness-artwork .db-image-status button")','A failed photo retains story content and offers retry');
  await cdp('Network.setBlockedURLs',{urls:[]});await click('.db-witness-artwork .db-image-status button');await loaded();
  await check('document.querySelector(".db-witness-artwork .db-picture").dataset.imageState==="ready"','Retry restores the photograph');
  assert.deepEqual(errors,[],'No uncaught browser errors');console.log('PASS No uncaught browser errors');
`;
const runner=new Module(harnessPath,module);runner.filename=harnessPath;runner.paths=Module._nodeModulePaths(path.dirname(harnessPath));runner._compile(source.slice(0,begin)+body+source.slice(end),harnessPath);
