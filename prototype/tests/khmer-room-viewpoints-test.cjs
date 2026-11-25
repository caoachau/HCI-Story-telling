const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const start=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
await viewport(1920,1080);
for(const [place,scene] of [['traditional','traditional-room'],['thematic','thematic-room']]) {
 await cdp('Page.navigate',{url:'http://127.0.0.1:3000/bao-tang-khmer.html?section=map&tab=upper&place='+place+'&scene='+scene});
 await wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"',scene+' ready');
 await check('document.querySelectorAll("[data-entry-card]").length===1 && document.querySelector("[data-entry-card]").dataset.entryCard==='+JSON.stringify(scene),place+' has one panorama');
 await check('!document.querySelector("[data-panorama-point$=to-left], [data-panorama-point$=to-right]")',place+' has no side-view links');
}

for(const [place,center,left,right,leftLink,rightLink] of [
 ['crafts','crafts-center','crafts-left','crafts-right','crafts-center-to-left','crafts-center-to-right'],
 ['faith','faith-center','faith-left','faith-right','faith-center-to-left','faith-center-to-right'],
 ['performing','arts-center','arts-left','arts-right','arts-center-to-left','arts-center-to-right'],
 ['daily-life','daily-center','daily-left','daily-right','daily-center-to-left','daily-center-to-right']]) {
 await cdp('Page.navigate',{url:'http://127.0.0.1:3000/bao-tang-khmer.html?section=map&tab=upper&place='+place+'&scene='+center});
 await wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"',center+' ready');
 await check('[...document.querySelectorAll("[data-entry-card]")].map(x=>x.dataset.entryCard).join(",")==='+JSON.stringify([center,left,right].join(',')),place+' keeps three views in one room');
 await click('[data-panorama-point='+leftLink+']');
 await wait('document.querySelector(".kd-detail")?.dataset.selectedEntry==='+JSON.stringify(left),place+' left navigation');
 await click('[data-action=interior-back]');
 await wait('document.querySelector(".kd-detail")?.dataset.selectedEntry==='+JSON.stringify(center),place+' return to center');
 await click('[data-panorama-point='+rightLink+']');
 await wait('document.querySelector(".kd-detail")?.dataset.selectedEntry==='+JSON.stringify(right),place+' right navigation');
}
assert.deepEqual(errors,[]);console.log('PASS no browser runtime errors');
`;
const test=new Module(file,module);test.filename=file;test.paths=Module._nodeModulePaths(path.dirname(file));test._compile(source.slice(0,start)+body+source.slice(end),file);
