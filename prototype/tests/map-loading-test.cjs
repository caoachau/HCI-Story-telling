/* Real WebGL regression: slow satellite tiles must retain geographic coverage. */
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs');
let source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
// Delay detail imagery at the origin, including service-worker requests. The
// low-resolution map remains fast, as it does in the shipped local tile pack.
source=source.replace('fs.createReadStream(file).pipe(res);',String.raw`if(process.env.MAP_BASELINE_ENTRY&&file===path.join(dist,'index.html')){res.end(fs.readFileSync(file,'utf8').replace(/src="\/assets\/main-[^"]+\.js"/,'src="/assets/'+process.env.MAP_BASELINE_ENTRY+'"'));return;}const z=Number(req.url.match(/map-tiles\/(?:google-satellite-v1|esri-13192)\/(\d+)\//)?.[1]);if(z>=10&&process.argv.includes('--fail-detail')){res.writeHead(503);res.end();return;}if(z>=10)setTimeout(()=>fs.createReadStream(file).pipe(res),650);else fs.createReadStream(file).pipe(res);`);
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  await viewport(1440,900);
  await cdp('Network.setBypassServiceWorker',{bypass:true});
  await cdp('Network.setCacheDisabled',{cacheDisabled:true});
  if(process.argv.includes('--fail-detail'))await cdp('Network.setBlockedURLs',{urls:['*://mt*.google.com/*','*://wayback.maptiles.arcgis.com/*']});
  await cdp('Page.navigate',{url:base+'/'});
  await wait('document.querySelector(".maplibregl-canvas")','map canvas');
  await page('let el=document.querySelector(".maplibregl-canvas"),f;while(el&&!f){f=el[Object.keys(el).find(k=>k.startsWith("__reactFiber"))];el=el.parentElement}while(f){let h=f.memoizedState;while(h){const v=h.memoizedState?.current;if(v?.getCanvas&&v?.getSource){window.testMap=v;break}h=h.next}if(window.testMap)break;f=f.return}');
  await wait('window.testMap','map instance');
  await page('window.tileErrors=[];testMap.on("error",e=>tileErrors.push(e.error?.message));window.coverage=[];let last=0;testMap.on("render",()=>{const now=performance.now();if(now-last<120)return;last=now;const gl=testMap.getCanvas().getContext("webgl2"),w=gl.drawingBufferWidth,h=gl.drawingBufferHeight,pixels=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let blank=0,total=0;for(let y=30;y<h-30;y+=24)for(let x=30;x<w-30;x+=24){const i=(y*w+x)*4;total++;if(pixels[i+3]<5||(pixels[i]===0&&pixels[i+1]===0&&pixels[i+2]===0))blank++}coverage.push({time:now,blank:blank/total,zoom:testMap.getZoom()})});');
  await wait('document.querySelectorAll(".heritage-marker").length===7','map startup');
  await sleep(2500);
  const baseline=process.argv.includes('--baseline');
  if(!baseline){
    await page('window.originalMapSources=Object.fromEntries(["esri-satellite","google-satellite","terrain-dem"].map(id=>[id,testMap.getSource(id)]))');
    await check('await (async()=>{for(const layer of ["s","h&hl=vi","h&hl=en"]){const results=[];for(const separator of ["/","?"]){const r=await testMap._requestManager.transformRequest("https://mt0.google.com/vt"+separator+"lyrs="+layer+"&x=407&y=241&z=9","Tile");results.push(r.url)}if(results[0]!==results[1]||!results[0].includes("/map-tiles/"))return false}return true})()','Both Google URL formats resolve satellite and both label languages to local files');
    await check('!performance.getEntriesByType("resource").some(r=>/google-details|lyrs=h/.test(r.name))','Disabled road labels make no background requests');
  }
  const sample=async(name,action)=>{
    await page('window.coverage=[];window.sampleStart=performance.now()');
    await action();await sleep(4400);
    const result=await page('return {samples:coverage.length,worst:Math.max(0,...coverage.map(x=>x.blank)),badFrames:coverage.filter(x=>x.blank>.01).length,firstCovered:coverage.find(x=>x.blank<.01)?.time-sampleStart,errors:tileErrors.slice(-5)}');
    console.log('COVERAGE',name,JSON.stringify(result));
    if(result.worst>=.01&&!baseline)console.log('REQUEST_URLS',JSON.stringify(requests.filter(u=>/google.com\/vt|google-satellite/.test(u)).slice(0,12)));
    await shot('map-loading-'+(baseline?'before-':'after-')+name);
    if(!baseline){
      if(result.worst>=.01)console.log('SOURCE_STATE',JSON.stringify(await page('return {layers:testMap.getStyle().layers.filter(l=>l.type==="raster"),sources:Object.fromEntries(Object.entries(testMap.style.tileManagers).map(([id,s])=>[id,{used:s.used,loaded:s.loaded(),tiles:s._inViewTiles?.getAllTiles?.().map(t=>({id:t.tileID.key,state:t.state}))}]))}')));
      assert.ok(result.samples>0,'sampled WebGL frames');assert.ok(result.worst<.01,name+' has no black tile gaps');
    }
  };
  await sample('switch-google',()=>page('document.querySelector(".map-basemap-selector button").click()'));
  await sample('fly-temple',()=>click('.landmark-carousel-card[data-site-id=den-tho-bac]'));
  await sample('overview',()=>page('testMap.flyTo({center:[106.345,9.855],zoom:10.4,pitch:45,bearing:-10,duration:1800})'));
  await sample('fly-coast',()=>click('.landmark-carousel-card[data-site-id=bien-ba-dong]'));
  await sample('rapid-switch',()=>page('const b=document.querySelectorAll(".map-basemap-selector button");b[1].click();setTimeout(()=>b[0].click(),80);setTimeout(()=>b[1].click(),150)'));
  if(!baseline){
    await check('Object.entries(originalMapSources).every(([id,s])=>testMap.getSource(id)===s)','Provider changes preserve satellite and terrain sources');
    await check('testMap.getLayoutProperty("esri-satellite-layer","visibility")==="visible"&&testMap.getLayoutProperty("google-satellite-layer","visibility")==="none"','Rapid switching respects the last choice');
    await sample('flat-pan',()=>page('testMap.setTerrain(null);testMap.easeTo({center:[106.34,9.86],zoom:11.5,pitch:0,bearing:0,duration:1200})'));
  }
  console.log('NETWORK',JSON.stringify(await page('return performance.getEntriesByType("resource").filter(r=>/map-tiles|google.com\\/vt|maptiles.arcgis.com/.test(r.name)).reduce((a,r)=>{const k=r.name.includes("map-tiles/")?"local":"remote";a[k]=(a[k]||0)+1;return a},{})')));
  assert.equal(errors.length,0,'no browser exceptions');
  console.log('PASS map loading scenarios');
`;
const runner=new Module(file,module);runner.filename=file;runner.paths=Module._nodeModulePaths(path.dirname(file));runner._compile(source.slice(0,begin)+body+source.slice(end),file);
