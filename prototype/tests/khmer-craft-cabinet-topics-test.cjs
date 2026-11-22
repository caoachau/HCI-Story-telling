/* Real browser checks for the 09–28 topic groups in the right display cabinet. */
const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const file = path.resolve(__dirname, 'den-tho-bac-test.cjs');
const source = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const start = source.indexOf('  const sections=['), end = source.lastIndexOf('\n}\nmain().catch');
const body = String.raw`
  await viewport(1920,1080);
  await cdp('Page.navigate',{url:(process.env.MUSEUM_URL || 'http://127.0.0.1:3000')+'/bao-tang-khmer.html?section=map&tab=upper&place=crafts&scene=crafts-right'});
  await wait('document.querySelector(".kd-panorama")?.dataset.panoramaState==="ready"','panorama');
  await page('const canvas=document.querySelector(".kd-panorama canvas");canvas.focus();for(let i=0;i<32;i++)canvas.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowLeft",bubbles:true}))');
  await wait('[...document.querySelectorAll(".kd-topic-hotspot:not([hidden])")].some(button=>button.textContent.includes("Nghề làm trống"))','right cabinet topic controls');
  await check('document.querySelectorAll(".kd-topic-hotspot:not([hidden])").length===3 && !document.querySelector(".kd-exhibit-dot:not([hidden])")','cabinet overview shows only three topics');
  await check('[...document.querySelectorAll(".kd-topic-hotspot:not([hidden])")].map(button=>button.getAttribute("aria-label")).join("|")==="Nghề làm trống|Nghề vẽ tranh trên lá buông|Nghề làm mão, mặt nạ"','cabinet uses the three requested topic names');
  await click('[data-action=exhibit-list]');
  await check('document.querySelectorAll(".kd-topic-list section").length===3','cabinet list contains exactly three topic sections');
  await check('[...document.querySelectorAll(".kd-topic-list section")].map(section=>section.querySelectorAll(".kd-topic-list-item").length).join(",")==="3,7,5"','drum-making contains only the three confirmed hotspots');
  await check('[...document.querySelectorAll(".kd-topic-list-item")].filter(button=>/26|27|28/.test(button.textContent)).every(button=>button.textContent.includes("Tư liệu hình ảnh"))','grouped photographs are identified as photographic documentation');
  const topics=[['drum-making',[11,14,26]],['palm-leaf-painting',[15,16,17,18,19,20,27]],['crown-mask-making',[21,22,23,24,28]]];
  for(let index=0;index<topics.length;index++){
    const [topic,ids]=topics[index];
    if(index) await click('[data-action=exhibit-list]');
    await page('document.querySelectorAll(".kd-topic-list h3 button")['+index+'].click()');
    await wait('document.querySelector(".kd-topic-toolbar").dataset.topic==="'+topic+'" && document.querySelector(".kd-panorama-canvas").dataset.motionState==="idle"','cabinet topic focus');
    if(index===0) await shot('craft-cabinet-drum');
    const visible=await page('return [...document.querySelectorAll(".kd-exhibit-dot:not([hidden])")].map(button=>button.dataset.panoramaPoint)');
    assert.ok(visible.length>0,'selected cabinet topic has visible exhibits');
    assert.ok(visible.every(id=>ids.some(number=>id==='crafts-display-object-'+number)),'other cabinet topics remain hidden');
  }
  await click('.kd-topic-toolbar button');
  await wait('document.querySelector(".kd-panorama-canvas").dataset.motionState==="idle"','cabinet overview return');
  await check('Math.abs(Number(document.querySelector(".kd-panorama-canvas").dataset.yaw)-4)<1 && document.querySelectorAll(".kd-topic-hotspot:not([hidden])").length===3','back returns to the right cabinet overview');
  assert.deepEqual(errors,[]);console.log('PASS no browser runtime errors');
`;
const test = new Module(file, module); test.filename = file;
test.paths = Module._nodeModulePaths(path.dirname(file));
test._compile(source.slice(0, start) + body + source.slice(end), file);
