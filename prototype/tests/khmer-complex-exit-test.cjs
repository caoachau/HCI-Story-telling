const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve('tests/den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  base=process.env.KHMER_DISCOVERY_BASE||'http://127.0.0.1:3000';
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&tab=landscape'});
  const overview=()=>wait('document.querySelector(".kd-complex-tour")?.dataset.complexScene==="overview"&&document.querySelector(".kd-complex-canvas")?.dataset.tourState==="overview"','aerial overview');
  await overview();
  const scene=id=>wait('document.querySelector(".kd-complex-tour")?.dataset.complexScene==="'+id+'"&&document.querySelector(".kd-complex-tour").dataset.complexPhase==="scene"','scene '+id);
  for(const [id,exit] of [['entrance','button'],['pagoda','button'],['pond','escape']]){
    await click('[data-marker-entry='+id+']');await scene(id);
    await click('[data-action=fullscreen-panorama]');await wait('document.querySelector(".kd-complex-expanded .kd-complex-canvas")?.dataset.scene==="'+id+'"','expanded scene');
    if(exit==='button')await click('.kd-complex-expanded [data-action=fullscreen-panorama]');else{await page('document.querySelector(".kd-complex-expanded canvas").focus()');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});}
    await overview();await check('!document.querySelector(".kd-complex-expanded")&&document.querySelectorAll(".kd-complex-overview [data-marker-entry]").length===3&&[...document.querySelectorAll(".kd-complex-overview [data-marker-entry]")].every(b=>{const r=b.getBoundingClientRect();return r.width>=44&&b.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})','Exit returns directly to three reachable markers: '+id+' via '+exit);
  }
  await shot('complex-exit-overview');await click('[data-action=fullscreen-panorama]');await wait('document.querySelector(".kd-complex-expanded")','expanded aerial');await click('.kd-complex-expanded [data-action=fullscreen-panorama]');await overview();console.log('PASS Expanding and collapsing the aerial remains on the overview');
  await click('[data-marker-entry=pond]');await scene('pond');console.log('PASS Markers remain usable after leaving fullscreen');assert.deepEqual(errors,[],'No browser exceptions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
