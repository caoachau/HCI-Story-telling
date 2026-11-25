const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const start=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
await viewport(1920,1080);
await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
for(const [place,scene] of [['traditional','traditional-room'],['thematic','thematic-room'],['faith','faith-center'],['performing','arts-center'],['daily-life','daily-center'],['faith','faith-left'],['faith','faith-right'],['performing','arts-left'],['performing','arts-right'],['daily-life','daily-left'],['daily-life','daily-right']]) {
 await cdp('Page.navigate',{url:'http://127.0.0.1:3000/bao-tang-khmer.html?section=map&tab=upper&place='+place+'&scene='+scene});
 await wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"',scene+' ready');
 await check('document.querySelectorAll(".kd-topic-hotspot").length>0 && !document.querySelector(".kd-exhibit-dot:not([hidden])")',scene+' overview groups exhibits');
 await click('[data-action=exhibit-list]');
 await check('document.querySelectorAll(".kd-topic-list-item").length>0',scene+' lists exhibits');
 await click('.kd-topic-list h3 button');
 await wait('document.querySelector(".kd-panorama-canvas").dataset.motionState==="idle" && !!document.querySelector(".kd-exhibit-dot:not([hidden])")',scene+' reveals dots');
 await click('.kd-exhibit-dot:not([hidden])');
 await check('!!document.querySelector("[data-ground-point-detail][open]")',scene+' opens exhibit details');
 await click('[data-ground-point-detail] header button');
 await check('!document.querySelector("[data-ground-point-detail]") && document.querySelector(".kd-topic-toolbar").dataset.topic!=="overview"',scene+' closes details back to its group');
 await click('.kd-topic-toolbar > button');
 await wait('document.querySelector(".kd-topic-toolbar").dataset.topic==="overview" && !document.querySelector(".kd-exhibit-dot:not([hidden])")',scene+' returns to overview');
}
assert.deepEqual(errors,[]);console.log('PASS no browser runtime errors');
`;
const test=new Module(file,module);test.filename=file;test.paths=Module._nodeModulePaths(path.dirname(file));test._compile(source.slice(0,start)+body+source.slice(end),file);
