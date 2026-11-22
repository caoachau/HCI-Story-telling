const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&place=entrance'});
  await wait('document.querySelector(".kd-aerial-plane img")?.naturalWidth===1695&&document.querySelector(".kd-complex-canvas canvas")','overview');
  await page('await document.fonts.ready');
  await check('(()=>{const v=document.querySelector(".kd-aerial-viewport").getBoundingClientRect(),p=document.querySelector(".kd-aerial-plane").getBoundingClientRect(),f=document.querySelector(".kd-frame").getBoundingClientRect(),h=document.querySelector(".kd-heading").getBoundingClientRect();return Math.abs(p.left-v.left)<2&&Math.abs(p.right-v.right)<2&&Math.abs(p.top-v.top)<2&&p.bottom>v.bottom&&h.top-f.top>=18})()','Kiosk overview fills both sides, crops lower trees and gives the heading breathing room');
  const sample=async id=>page('const root=document.querySelector(".kd-complex-tour"),engine=root.querySelector(".kd-complex-canvas"),marker=root.querySelector("[data-marker-entry='+id+']"),samples=[],started=performance.now();while(engine.dataset.tourState==="travelling"&&performance.now()-started<10000){const p=marker.getBoundingClientRect(),v=root.getBoundingClientRect();samples.push({x:p.x+p.width/2-v.x-v.width/2,y:p.y+p.height/2-v.y-v.height/2});await new Promise(r=>requestAnimationFrame(r))}return samples');
  for(const [id,width,height] of [['entrance',1920,1080],['pagoda',1920,1080],['pond',1920,1080],['pond',390,844]]){
    await viewport(width,height);await sleep(100);
    const original=await page('const p=document.querySelector("[data-marker-entry='+id+']").getBoundingClientRect(),v=document.querySelector(".kd-complex-tour").getBoundingClientRect();return {x:p.x+p.width/2-v.x-v.width/2,y:p.y+p.height/2-v.y-v.height/2}');
    const length=Math.hypot(original.x,original.y);
    await click(width===390?'[data-entry-card='+id+']':'[data-marker-entry='+id+']');
    await wait('document.querySelector(".kd-complex-tour").dataset.complexPhase==="travelling"','focus flight');
    const forward=await sample(id);assert.ok(forward.length>=15,'Camera draws enough intermediate frames');
    let previous=length;
    for(const point of forward){
      const distance=Math.hypot(point.x,point.y);
      assert.ok(distance<=previous+.5,'Chosen point must approach the centre from the first frame, without drifting away or reversing: '+JSON.stringify({id,width,previous,distance,point}));
      assert.ok(Math.abs(point.x*original.y-point.y*original.x)/length<.8,'Chosen point follows a straight path');
      assert.ok(point.x*original.x+point.y*original.y>=-.5*length,'Chosen point never overshoots the centre');previous=distance;
    }
    assert.ok(previous<3,'Focus reaches the centre before the panorama replaces the aerial');
    assert.equal(await page('return document.querySelector(".kd-complex-tour").dataset.complexScene'),id);
    await click('[data-action=complex-overview]');await wait('document.querySelector(".kd-complex-tour").dataset.complexPhase==="travelling"','return flight');
    const reverse=await sample(id);previous=0;
    for(const point of reverse){const distance=Math.hypot(point.x,point.y);assert.ok(distance>=previous-.5&&distance<=length+.5,'Return follows the same path without swaying or overshooting');previous=distance;}
    assert.ok(Math.abs(previous-length)<3);await wait('document.querySelector(".kd-complex-tour").dataset.complexPhase==="overview"','overview restored');
    console.log('PASS '+id+' at '+width+': straight focus from first frame, no reversal, exact return');
  }
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS Focus trajectories for all three points and a letterboxed phone image');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
