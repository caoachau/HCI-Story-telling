/* Focused visual capture, using the isolated production browser harness. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  for(const [width,height] of [[1920,1080],[3840,2160],[1280,720],[390,844],[320,720]]){
    await viewport(width,height);await open();
    for(const index of [0,1,2]){
      if(index)await click('[data-overview-slide="'+index+'"]');
      await wait('document.querySelector(".db-overview-carousel").dataset.imageState==="ready"&&document.querySelector(".db-overview-carousel").dataset.overviewIndex==="'+index+'"','selected image');await settle();
      await shot('overview-remake-'+width+'x'+height+'-'+index);
      await check('document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1&&document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1','Full overview has no overflow at '+width+' / '+index);
      await check('document.querySelector(".db-overview-copy").getBoundingClientRect().bottom+8<=document.querySelector(".db-overview-image-tabs").getBoundingClientRect().top','Introduction stays above photo tabs at '+width+' / '+index);
    }
  }
  assert.deepEqual(errors,[]);console.log('PASS No browser errors');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
