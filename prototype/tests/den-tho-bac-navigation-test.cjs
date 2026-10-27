/* Real-browser coverage for the shared overlay footer on every detail chapter. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
if(begin<0||end<begin)throw Error('Browser harness boundaries changed');
const body=String.raw`
  for(const [width,height] of [[1774,887],[1920,1080],[3840,2160],[1280,720],[1440,900]]){
    await viewport(width,height);await open();let commonGeometry;
    for(const section of ['overview','history','spaces','people','activities','values']){
      await click('[data-section-target='+section+']');
      await wait('[...document.querySelectorAll("main img")].every(img=>img.complete&&img.naturalWidth>0)','chapter photographs');
      if(section==='overview')await wait('document.querySelector(".db-overview-carousel").dataset.imageState==="ready"','overview photograph');
      await settle();
      const geometry=await page('const f=document.querySelector(".db-navigation"),n=f.querySelector("nav"),s=getComputedStyle(f);return {height:f.getBoundingClientRect().height,top:f.getBoundingClientRect().top,padding:s.padding,gap:getComputedStyle(n).gap,buttons:[...n.children].map(b=>{const r=b.getBoundingClientRect(),t=getComputedStyle(b),i=b.querySelector("svg").getBoundingClientRect();return {left:r.left,top:r.top,width:r.width,height:r.height,font:t.fontSize,weight:t.fontWeight,padding:t.padding,iconWidth:i.width,iconHeight:i.height}})};');
      if(!commonGeometry)commonGeometry=geometry;
      assert.deepEqual(geometry,commonGeometry,'One footer size, type scale and icon geometry for '+section+' at '+width);
      console.log('PASS Footer matches the shared geometry: '+section+' at '+width);

      await check('(()=>{const footer=document.querySelector(".db-navigation"),r=footer.getBoundingClientRect(),main=document.querySelector("main").getBoundingClientRect(),style=getComputedStyle(footer);return style.position==="absolute"&&style.backgroundColor==="rgba(12, 12, 12, 0.68)"&&style.backdropFilter==="blur(8px)"&&style.borderTopWidth==="1px"&&r.left===0&&Math.abs(r.right-innerWidth)<1&&Math.abs(r.bottom-innerHeight)<1&&main.top===0&&Math.abs(main.bottom-innerHeight)<1})()','Footer overlays the full viewport with exact dark fill and 8px blur: '+section+' at '+width);
      await check('[...document.querySelectorAll(".db-navigation button")].length===6&&[...document.querySelectorAll(".db-navigation button")].every(button=>{const style=getComputedStyle(button),r=button.getBoundingClientRect(),selected=button.hasAttribute("aria-current");return style.color==="rgb(255, 255, 255)"&&getComputedStyle(button.querySelector("svg")).color==="rgb(255, 255, 255)"&&style.backgroundColor===(selected?"rgb(200, 28, 25)":"rgba(0, 0, 0, 0)")&&parseFloat(style.borderRadius)>100&&r.height>=44&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','All six actions remain touchable, white, with only the active pill red: '+section+' at '+width);
      await check('document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1&&document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1&&[...document.querySelectorAll("main button")].every(button=>{const r=button.getBoundingClientRect(),footer=document.querySelector(".db-navigation").getBoundingClientRect(),list=button.closest(".db-space-list");if(list)return list.getBoundingClientRect().bottom<=footer.top+1&&getComputedStyle(list).overflowY==="auto";return r.top>=0&&r.bottom<=footer.top+1&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===button})','Chapter controls stay above the footer without overflow: '+section+' at '+width);
      if(section==='spaces'){
        await page('const list=document.querySelector(".db-space-list");list.scrollTop=list.scrollHeight;');
        await check('(()=>{const list=document.querySelector(".db-space-list"),last=list.lastElementChild,r=last.getBoundingClientRect();return r.bottom<=document.querySelector(".db-navigation").getBoundingClientRect().top&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===last})()','Map list scrolls to its last point above the shared footer at '+width);
        await page('document.querySelector(".db-space-list").scrollTop=0;');
      }
      if(section==='overview')await check('document.querySelectorAll(".db-overview-image-tabs button").length===3&&[...document.querySelectorAll(".db-overview-image-tabs button")].every((button,i,all)=>{const r=button.getBoundingClientRect();return r.bottom<document.querySelector(".db-navigation").getBoundingClientRect().top&&(!i||Math.abs(r.top-all[0].getBoundingClientRect().top)<1)})&&!document.querySelector(".db-overview-ambient")&&getComputedStyle(document.querySelector(".db-overview-artwork")).filter==="none"','Photo tabs remain horizontal above the footer and background stays sharp at '+width);
      await shot('shared-footer-'+width+'-'+section);
    }
    await click('[data-section-target=people]');await click('.db-person-tabs button:last-child');await settle();
    await check('document.querySelector("[data-person-tab=portrait]")&&document.querySelector(".db-portrait-read").getBoundingClientRect().bottom<document.querySelector(".db-navigation").getBoundingClientRect().top','Portrait story CTA remains above the shared footer at '+width);
    await shot('shared-footer-'+width+'-portrait');
    await click('[data-section-target=spaces]');await click('.db-space-list button:nth-child(4)');await settle();
    await check('document.querySelector(".db-atlas-panel").dataset.panelView==="summary"&&[...document.querySelectorAll(".db-atlas-panel button")].every(button=>button.getBoundingClientRect().bottom<document.querySelector(".db-navigation").getBoundingClientRect().top)','Selected map summary actions remain above the shared footer at '+width);
  }
  await viewport(390,844);await open();
  for(const section of ['overview','history','spaces','people','activities','values']){
    await click('[data-section-target='+section+']');await settle();
    await check('(()=>{const footer=document.querySelector(".db-navigation").getBoundingClientRect();return Math.abs(footer.bottom-innerHeight)<1&&footer.width===innerWidth&&getComputedStyle(document.querySelector(".db-navigation")).backdropFilter==="blur(8px)"&&document.querySelectorAll(".db-navigation button").length===6&&document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1})()','Mobile footer stays fixed over its chapter with all six actions at '+section);
  }
  assert.deepEqual(errors,[]);console.log('PASS No uncaught browser errors');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
