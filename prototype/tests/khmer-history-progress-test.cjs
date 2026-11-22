const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  base=process.env.KHMER_DISCOVERY_BASE||'http://127.0.0.1:3000';
  await viewport(1920,1080);
  await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=timeline'});
  await wait('document.querySelector(".md-khmer-history:not([hidden]) [data-history-phase]")','history timeline');
  await page('await document.fonts.ready');
  const phases=await page('return [...document.querySelectorAll("[data-history-phase]")].map(el=>el.dataset.historyPhase)');
  const endpoint='(()=>{const rail=document.querySelector(".md-history-progress").getBoundingClientRect(),dot=document.querySelector("[data-history-phase][aria-pressed=true] .md-history-dot").getBoundingClientRect();return Math.abs(rail.right-dot.left-dot.width/2)<1.5})()';
  for(const [width,height] of [[1920,1080],[1280,720],[390,844]]){
    await viewport(width,height);
    for(const index of [0,1,2,4,3,1]){
      await click('[data-history-phase="'+phases[index]+'"]');
      await wait(endpoint,'gold line ends at selected dot');
      await sleep(750);
      await check(endpoint,'Progress stops at milestone '+(index+1)+' at '+width);
      await check('document.querySelectorAll("[data-history-phase][aria-pressed=true]").length===1','Exactly one milestone selected');
    }
    await click('[data-action=history-previous-phase]');
    await check('document.querySelector("[data-history-phase][aria-pressed=true]").dataset.historyPhase==='+JSON.stringify(phases[0]),'Left arrow selects previous period at '+width);
    await wait(endpoint,'previous endpoint');
    if(width>=1280)await check('(()=>{const left=document.querySelector("[data-action=history-previous-phase]").getBoundingClientRect(),first=document.querySelector("[data-history-phase]").getBoundingClientRect();return left.width>=44&&left.height>=44&&left.right<=first.left})()','Touchable left arrow sits before first milestone');
    if(width===1920){await click('[data-action=history-next-phase]');await sleep(900);await shot('khmer-history-progress');}
  }
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await click('[data-history-phase="'+phases[2]+'"]');await wait(endpoint,'reduced motion endpoint');
  await check(endpoint,'Reduced motion keeps the same selected endpoint');
  assert.deepEqual(errors,[],'No browser exceptions');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
