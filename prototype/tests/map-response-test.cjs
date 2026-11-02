/* Measure real interaction latency without expensive framebuffer readbacks. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs');
let source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  const baseline=process.argv.includes('--baseline');
  await viewport(2456,1042);
  await cdp('Page.navigate',{url:process.env.MAP_TEST_URL||base+'/'});
  await wait('document.querySelectorAll(".heritage-marker").length===7','map starts');
  await page('let el=document.querySelector(".maplibregl-canvas"),f;while(el&&!f){f=el[Object.keys(el).find(k=>k.startsWith("__reactFiber"))];el=el.parentElement}while(f){let h=f.memoizedState;while(h){const v=h.memoizedState?.current;if(v?.getCanvas&&v?.getSource){window.testMap=v;break}h=h.next}if(window.testMap)break;f=f.return}');
  await wait('window.testMap','map instance');
  await page('window.responseProfile={};testMap.on("render",()=>{const p=responseProfile;if(!p.start)return;const t=performance.now()-p.start;p.frames??=[];p.frames.push(t);if(!p.panel&&document.querySelector(".heritage-map-viewport").dataset.storyOpen==="true")p.panel=t;if(!p.tiles&&(!p.movement||p.arrived)&&testMap.areTilesLoaded())p.tiles=t;});testMap.on("movestart",()=>{responseProfile.started=true;responseProfile.arrived=undefined;responseProfile.tiles=undefined});testMap.on("moveend",()=>{if(responseProfile.started)responseProfile.arrived=performance.now()-responseProfile.start});');
  const measureResponse=async(name,code)=>{
    await page('performance.clearResourceTimings();responseProfile={start:performance.now(),movement:'+String(name!=="google-overview")+'};'+code);
    await sleep(6500);
    const result=await page('const p=responseProfile;const r=performance.getEntriesByType("resource").filter(r=>/map-tiles|google.com\\/vt|maptiles.arcgis.com/.test(r.name));const times=r.map(r=>r.duration).sort((a,b)=>a-b);return {panel:p.panel,arrived:p.arrived,tiles:p.tiles,frames:p.frames?.length,p95Request:times[Math.floor(times.length*.95)],requests:r.length,bytes:r.reduce((a,r)=>a+r.transferSize,0),remote:r.filter(r=>!r.name.includes("map-tiles")).map(r=>r.name).slice(0,4)}');
    console.log('RESPONSE',name,JSON.stringify(result));
    return result;
  };
  await measureResponse('google-overview','document.querySelector(".map-basemap-selector button").click()');
  await page('window.originalTerrain=testMap.getSource("terrain-dem")');
  const selection=await measureResponse('select-temple','document.querySelector(".landmark-carousel-card[data-site-id=den-tho-bac]").click()');
  if(!baseline)assert.ok(selection.panel<250,'selection opens information within 250ms');
  await measureResponse('overview','document.querySelector(".map-top-actions button:nth-child(2)").click()');
  await measureResponse('zoom-regional','testMap.easeTo({center:[106.367,9.86],zoom:13.5,pitch:55,bearing:-12,duration:250})');
  await shot('map-response-'+(baseline?'before':'after'));
  assert.equal(errors.length,0,'no browser exceptions');
  console.log('PASS map response scenarios');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
