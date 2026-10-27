/* Exercise the actual moving leaf, not just screenshots of settled pages. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const idle=()=>wait('document.querySelector(".db-values-book")?.dataset.bookPhase==="idle"','book idle');
  const moving=()=>wait('document.querySelector(".db-values-book")?.dataset.bookPhase==="turning"','continuous leaf turn');
  const prepare=async(query='')=>{await viewport(1672,941);await open('?section=values'+query);await wait('document.querySelector(".db-value-book-surface img")?.complete&&document.querySelector(".db-value-photo-crop img")?.complete','book assets');await idle();await settle();};
  const save=async name=>{const r=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(root,'preview','den-tho-bac-'+name+'.png'),Buffer.from(r.data,'base64'));};
  // Seek by the actual eased rotation, not by a fraction of the duration.
  const angleFrames=[];
  const inspectAngles=async direction=>{
    for(const degrees of [0,45,90,135,180]){
      const sample=await page('const target='+degrees+'/180,rotation=bookLeaf.getAnimations()[0];let low=0,high=900;for(let i=0;i<32;i++){const time=(low+high)/2;rotation.currentTime=time;if(rotation.effect.getComputedTiming().progress<target)low=time;else high=time;}const time='+degrees+'===0?0:'+degrees+'===180?900:(low+high)/2;turnAnimations.forEach(a=>{a.pause();a.currentTime=time;});await new Promise(requestAnimationFrame);const m=new DOMMatrix(getComputedStyle(bookLeaf).transform),r=bookLeaf.getBoundingClientRect();return {degrees:'+degrees+',angle:Math.abs(Math.atan2(m.m13,m.m11)*180/Math.PI),time,width:bookLeaf.offsetWidth,height:bookLeaf.offsetHeight,bookWidth:document.querySelector(".db-value-book").clientWidth,bookHeight:document.querySelector(".db-value-book").clientHeight,rect:r.toJSON()};');
      assert.ok(Math.abs(sample.angle-degrees)<.01,'Actual '+direction+' rotation pauses at '+degrees+' degrees');
      assert.ok(Math.abs(sample.width*2-sample.bookWidth)<=1&&Math.abs(sample.height-sample.bookHeight)<=1,'Leaf is one half-width, full-height page at '+degrees+' degrees');
      await check('getComputedStyle(bookLeaf).clipPath==="none"&&getComputedStyle(bookLeaf).overflow==="visible"&&[bookFront,bookBack].every(face=>{const s=getComputedStyle(face),clip=face.querySelector(".db-value-turn-clip"),cs=getComputedStyle(clip),outline=face.querySelector(".db-value-turn-outline path"),definition=document.getElementById(cs.clipPath.match(/#([^\"]+)/)[1]).firstElementChild;return s.backgroundColor==="rgba(0, 0, 0, 0)"&&s.backgroundImage==="none"&&s.borderTopWidth==="0px"&&s.boxShadow==="none"&&s.clipPath==="none"&&cs.clipPath.startsWith("url(")&&cs.borderTopWidth==="0px"&&cs.boxShadow==="none"&&outline.getAttribute("d")===definition.getAttribute("d")&&outline.getAttribute("transform")===definition.getAttribute("transform")&&cs.backdropFilter==="none"})','Both faces clip their glass, highlight and content to the same curved stroke at '+direction+' '+degrees+' degrees');
      if(degrees===0||degrees===180){
        await check('(()=>{const face='+ (degrees===0?'bookFront':'bookBack')+',clip=face.querySelector(".db-value-turn-clip"),r=clip.getBoundingClientRect(),left=face.dataset.pageSide==="left";clip.style.pointerEvents="auto";const hits=(x,y)=>clip.contains(document.elementFromPoint(r.left+r.width*(left?1-x:x),r.top+r.height*y));const ok=!hits(.002,.002)&&!hits(.002,.5)&&!hits(.99,.005)&&hits(.02,.5)&&hits(.06,.035);clip.style.removeProperty("pointer-events");return ok})()','Native clipping excludes square outer corners and spine inset on the visible '+direction+' face at '+degrees+' degrees');
      }
      angleFrames.push({direction,...sample});await save('values-curve-'+direction+'-'+degrees);
    }
  };
  await prepare('&value=community');
  await page('window.bookLeaf=document.querySelector(".db-value-turning-sheet");window.bookFront=bookLeaf.firstElementChild;window.bookBack=bookLeaf.lastElementChild;window.bookFixed=[...document.querySelectorAll(".db-value-room,.db-value-book-surface,.db-value-book-outline,.db-value-book-controls")].map(el=>({el,html:el.innerHTML,rect:el.getBoundingClientRect().toJSON()}));');
  await save('values-leaf-rest');
  await click('[data-value-page="2"]');await moving();
  await page('window.turnAnimations=document.querySelector(".db-value-book-stage").getAnimations({subtree:true});turnAnimations.forEach(a=>{a.pause();a.currentTime=0});window.frontHTML=bookFront.innerHTML;window.backHTML=bookBack.innerHTML;');
  await check('bookLeaf===document.querySelector(".db-value-turning-sheet")&&bookFront===bookLeaf.firstElementChild&&bookBack===bookLeaf.lastElementChild&&bookLeaf.getAnimations().length===1&&bookLeaf.getAnimations()[0].effect.getTiming().duration===900','One persistent leaf receives one 900ms animation');
  await check('getComputedStyle(bookLeaf).transformStyle==="preserve-3d"&&getComputedStyle(bookFront).backfaceVisibility==="hidden"&&getComputedStyle(bookBack).backfaceVisibility==="hidden"&&getComputedStyle(bookBack).transform!=="none"&&parseFloat(getComputedStyle(document.querySelector(".db-value-book-stage")).perspective)>1000','Perspective and two independent hidden backfaces remain intact');
  await check('getComputedStyle(bookLeaf).backgroundImage==="none"&&getComputedStyle(bookLeaf).boxShadow==="none"&&getComputedStyle(bookLeaf).borderTopWidth==="0px"&&[bookFront,bookBack].every(el=>getComputedStyle(el).boxShadow==="none"&&getComputedStyle(el).backdropFilter==="none"&&getComputedStyle(el.querySelector(".db-value-turn-clip")).clipPath!=="none")&&!bookLeaf.querySelector(".db-value-sheet-surface")&&!bookLeaf.querySelector("img[src*=glass-book]")&&!bookLeaf.querySelector("button")','Leaf has no duplicated book, external rectangle, heavy blur or input targets');
  await inspectAngles('forward');
  const samples=[];
  for(const time of [0,90,180,270,360,450,540,630,720,810,899]){
    await page('turnAnimations.forEach(a=>a.currentTime='+time+');await new Promise(requestAnimationFrame)');
    samples.push(await page('const a=bookLeaf.getAnimations()[0],p=a.effect.getComputedTiming().progress,m=new DOMMatrix(getComputedStyle(bookLeaf).transform);return {time:a.currentTime,progress:p,angle:Math.atan2(m.m13,m.m11)*180/Math.PI,left:getComputedStyle(document.querySelector(".db-value-page-left")).clipPath,right:getComputedStyle(document.querySelector(".db-value-page-right")).clipPath}'));
    await check('document.querySelector(".db-values-book").dataset.valueId==="community"&&document.querySelector("[data-value-page][aria-pressed=true]").dataset.valuePage==="1"&&bookFront.innerHTML===frontHTML&&bookBack.innerHTML===backHTML','Committed page and both face snapshots stay fixed at '+time+'ms');
    if([180,360,540,720].includes(time))await save('values-leaf-forward-'+time);
  }
  assert.ok(samples.every((s,i)=>i===0||s.angle>=samples[i-1].angle),'Forward angles progress continuously without reset');
  assert.ok(samples.filter(s=>s.angle>5&&s.angle<175).length>=5,'At least five distinct intermediate rotations');
  await check('bookFixed.every(({el,rect})=>{const r=el.getBoundingClientRect();return getComputedStyle(el).transform==="none"&&Math.abs(r.x-rect.x)<.5&&Math.abs(r.y-rect.y)<.5&&Math.abs(r.width-rect.width)<.5&&Math.abs(r.height-rect.height)<.5})','Room, frame, outline and controls keep their geometry throughout the turn');
  await click('[data-value-page="3"]');await click('.db-value-page-arrow:first-child');
  await check('bookFront.innerHTML===frontHTML&&bookBack.innerHTML===backHTML&&bookLeaf===document.querySelector(".db-value-turning-sheet")&&bookLeaf.getAnimations()[0].currentTime===899','Rapid extra selections cannot replace or restart the active leaf');
  await page('turnAnimations.forEach(a=>a.finish())');await idle();await settle();
  await check('document.querySelector(".db-values-book").dataset.valueId==="history"&&document.querySelector("[data-value-page][aria-pressed=true]").dataset.valuePage==="2"&&bookLeaf.hidden&&document.querySelector(".db-value-photo-crop img").src.includes("03-reference-")&&!document.querySelector(".db-value-book-action").disabled','Main page, selected tab and action commit together only after completion');
  await save('values-leaf-forward-complete');
  await click('.db-value-page-arrow:first-child');await moving();
  await page('window.turnAnimations=document.querySelector(".db-value-book-stage").getAnimations({subtree:true});turnAnimations.forEach(a=>a.pause());');
  await inspectAngles('reverse');
  for(const time of [180,360,540,720]){await page('turnAnimations.forEach(a=>a.currentTime='+time+');await new Promise(requestAnimationFrame)');await save('values-leaf-reverse-'+time);}
  await check('bookLeaf===document.querySelector(".db-value-turning-sheet")&&bookLeaf.dataset.direction==="-1"&&document.querySelector(".db-values-book").dataset.valueId==="history"','Reverse pivots the same persistent leaf from the left');
  await page('turnAnimations.forEach(a=>a.finish())');await idle();await settle();
  await click('[data-value-page="3"]');await moving();await check('document.querySelector(".db-values-book").dataset.valueId==="community"','Direct tab choice also defers its commit');await idle();await settle();
  await check('document.querySelector(".db-values-book").dataset.valueId==="continuity"&&document.querySelector("[data-value-page][aria-pressed=true]").dataset.valuePage==="3"','Direct tab finishes on the requested fourth page');
  fs.writeFileSync(path.join(root,'.browser-profile/book-motion-samples.json'),JSON.stringify(samples,null,2));
  fs.writeFileSync(path.join(root,'.browser-profile/book-curve-angles.json'),JSON.stringify(angleFrames,null,2));

  // A real-time screencast includes forward, reverse and direct-tab motion.
  const output=path.join(root,'.browser-profile/book-motion-recording');fs.mkdirSync(output,{recursive:true});
  const frames=[];let recording=false;
  const record=e=>{const m=JSON.parse(e.data);if(m.method!=='Page.screencastFrame')return;const p=m.params;void cdp('Page.screencastFrameAck',{sessionId:p.sessionId});if(recording){const name=String(frames.length).padStart(5,'0')+'.jpg';fs.writeFileSync(path.join(output,name),Buffer.from(p.data,'base64'));frames.push({file:name,timestamp:p.metadata.timestamp});}};
  socket.addEventListener('message',record);recording=true;
  await cdp('Page.startScreencast',{format:'jpeg',quality:85,maxWidth:1672,maxHeight:941,everyNthFrame:1});
  await sleep(250);
  const turns=[['.db-value-page-arrow:last-child','forward'],['.db-value-page-arrow:first-child','reverse'],['[data-value-page="1"]','direct']];
  const timings=[];
  for(const [selector,name] of turns){
    await page('window.liveSamples=[];window.watchTurn=true;const sample=t=>{if(!watchTurn)return;const el=document.querySelector(".db-value-turning-sheet"),a=el.getAnimations()[0];if(a)liveSamples.push({t,currentTime:a.currentTime,transform:getComputedStyle(el).transform});requestAnimationFrame(sample);};requestAnimationFrame(sample);');
    await click(selector);await moving();await idle();await sleep(230);
    timings.push({name,samples:await page('watchTurn=false;return liveSamples')});
  }
  recording=false;await cdp('Page.stopScreencast');socket.removeEventListener('message',record);
  fs.writeFileSync(path.join(output,'frames.json'),JSON.stringify({frames,timings},null,2));
  assert.ok(frames.length>25,'Video contains intermediate frames, not just before/after');
  assert.ok(timings.every(t=>t.samples.length>=12),'Each live turn has at least 12 animation-frame samples');
  assert.ok(timings.every(t=>t.samples.every((s,i)=>!i||s.currentTime>=t.samples[i-1].currentTime)),'Live animation clocks never restart');
  console.log('PASS Continuous real-time recording: '+frames.length+' frames across three turns');

  await cdp('Network.setCacheDisabled',{cacheDisabled:true});await cdp('Network.clearBrowserCache');
  let held;const hold=e=>{const m=JSON.parse(e.data);if(m.method==='Fetch.requestPaused'){if(m.params.request.url.includes('03-reference-'))held=m.params.requestId;else void cdp('Fetch.continueRequest',{requestId:m.params.requestId});}};
  socket.addEventListener('message',hold);await cdp('Fetch.enable',{patterns:[{urlPattern:'*03-reference-*.webp'}]});
  await prepare();await click('[data-value-page="2"]');await wait('document.querySelector(".db-values-book").dataset.bookPhase==="loading"','target loading');
  for(let i=0;i<50&&!held;i++)await sleep(30);assert.ok(held,'Target image request intercepted');
  await check('document.querySelector(".db-value-turning-sheet").hidden&&document.querySelector(".db-values-book").dataset.valueId==="affection"&&document.querySelector(".db-value-load-status")','A slow target keeps the current page, and never starts an undecoded flip');
  await click('[data-value-page="1"]');await cdp('Fetch.continueRequest',{requestId:held});await moving();await idle();
  await check('document.querySelector(".db-values-book").dataset.valueId==="history"','The original loading request completes without overlapping later selections');
  await cdp('Fetch.disable');socket.removeEventListener('message',hold);
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await click('[data-value-page="0"]');await idle();
  await check('document.querySelector(".db-value-turning-sheet").hidden&&document.querySelector(".db-values-book").dataset.valueId==="affection"','Reduced motion changes page without a rotating sheet');
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser exceptions');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
