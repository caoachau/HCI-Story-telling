/* KT02-KT07: real routes, progressive layers, photo geometry, audio lifecycle,
   optional device notes, and a QR round trip using a reserved local test host. */
const {spawn,spawnSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {disposeBrowser}=require('./browser-artifacts.cjs');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const profile=path.join(root,'.browser-profile','personas-'+process.pid+'-'+Date.now());
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'};
let browser,socket,server,sequence=0,base;
const pending=new Map(),errors=[],requests=[];
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=++sequence,timer=setTimeout(()=>{pending.delete(id);reject(Error('Timeout: '+method));},30000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params}));});}
async function page(code){const result=await cdp('Runtime.evaluate',{expression:`(async()=>{${code}})()`,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
async function wait(expression,label){for(let i=0;i<100;i++){if(await page('return !!('+expression+')'))return;await sleep(100);}throw Error('Timed out: '+label);}
async function check(expression,label){assert.ok(await page('return !!('+expression+')'),label);console.log('PASS '+label);}
const click=selector=>page(`{const el=document.querySelector(${JSON.stringify(selector)});el.focus({preventScroll:true});el.click();}`);
const viewport=(width,height)=>cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
async function open(query='',origin=base){await cdp('Page.navigate',{url:origin+'/con-chim.html'+query});await wait('document.querySelector(".cc-kiosk")','experience');await page('await document.fonts.ready');}
async function shot(name){await sleep(200);const {data}=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(root,'preview','con-chim-personas-'+name+'.png'),Buffer.from(data,'base64'));}
async function main(){
  fs.mkdirSync(profile,{recursive:true});fs.mkdirSync(path.join(root,'preview'),{recursive:true});
  server=http.createServer((req,res)=>{const file=path.resolve(dist,'.'+new URL(req.url,'http://localhost').pathname.replace(/\/$/,'/index.html'));if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;
  browser=spawn(process.env.CHROME_PATH||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--no-proxy-server','--host-resolver-rules=MAP con-chim.test 127.0.0.1','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
  let port;for(let i=0;i<100;i++){try{const value=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];if(/^\d+$/.test(value)){port=value;break;}}catch(error){if(!['ENOENT','EBUSY','EPERM'].includes(error.code))throw error;}await sleep(100);}assert.ok(port,'Chrome started');
  const targets=await(await fetch(`http://127.0.0.1:${port}/json`)).json();socket=new WebSocket(targets.find(item=>item.type==='page').webSocketDebuggerUrl);await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
  socket.addEventListener('message',event=>{const message=JSON.parse(event.data),request=pending.get(message.id);if(request){pending.delete(message.id);clearTimeout(request.timer);message.error?request.reject(Error(JSON.stringify(message.error))):request.resolve(message.result);}if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);if(message.method==='Network.requestWillBeSent')requests.push(message.params.request.url);});
  await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Network.enable');await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]});await viewport(3840,2160);
  await open();await wait('document.querySelector(".cck-feature-photo [data-image-state=ready]")','clear opening photo');await shot('4k-home');
  await check('getComputedStyle(document.querySelector(".cck-feature-photo img")).opacity==="1" && getComputedStyle(document.querySelector(".cck-feature-photo img")).filter==="none" && getComputedStyle(document.querySelector(".cck-feature-photo img")).objectFit==="cover" && getComputedStyle(document.querySelector(".cck-feature-photo img")).maskImage==="none"','Opening uses the museum composition with original-color photography and no image filter or fade');
  await check('document.querySelectorAll(".cck-chapter-dock button").length===5','Museum-style dock exposes five working entrances');
  await click('.cck-chapter-dock button:first-child');
  await check('document.querySelector(".cck-overview h1").textContent.includes("Một cù lao") && document.activeElement.id==="cck-overview-title"','Overview opens its own content and moves keyboard focus');
  await wait('document.querySelector(".cck-overview [data-image-state=ready]")','overview photograph');await shot('4k-overview');
  await click('.cck-overview-facts button:nth-child(2)');
  await check('document.querySelector("#cck-reader-title").textContent.includes("ruộng lúa")','Overview leads directly to the selected story');
  await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  await check('document.activeElement.closest(".cck-overview-facts")','Closing the reader restores the overview origin');
  await click('.cck-header nav button:first-child');await click('.cck-chapter-dock button:nth-child(3)');
  await check('document.querySelector("[data-content-section=history]") && !document.querySelector("[role=dialog]") && document.querySelectorAll(".ccs-timeline button").length===3','History dock opens a complete section with its own timeline');
  await click('.ccs-timeline button:last-child');
  await check('document.querySelector("[data-history-stop=opening]") && document.querySelector(".ccs-history-copy").textContent.includes("9/9/2019")','Selecting a milestone changes the inline history content');
  await shot('4k-history');await click('.ccs-history-copy .cck-primary');
  await click('.cck-reader-nav button:last-child');
  await check('document.querySelector("#cck-reader-title").textContent.includes("bánh xèo") && document.querySelector(".cck-reader-nav > span").textContent.includes("01 / 06")','Reader navigation changes to the actual next story and updates the counter');
  await click('[aria-label="Về khám phá, đóng câu chuyện"]');
  await check('document.querySelector("[data-history-stop=opening]") && document.activeElement.closest(".ccs-history-copy")','Closing a story restores the history section and its selected milestone');
  await click('[data-section-target=community]');
  await check('document.querySelector("[data-content-section=community]") && !document.querySelector("[role=dialog]") && document.querySelectorAll(".ccs-community-topics button").length===3','Community is a full photographic section with three independent topics');
  await click('.ccs-community-topics button:nth-child(2)');
  await check('document.querySelector(".ccs-community-story h2").textContent.includes("mâm cơm")','Changing a community topic updates the scene and its story in place');
  await shot('4k-community');
  await click('.ccs-community-copy .ccs-actions button:nth-child(2)');
  await check('document.querySelector(".ccl-questions h2").textContent.includes("mâm cơm")','Community opens optional questions for the currently selected topic');
  await click('.ccl-close-all');
  await click('[data-section-target=experiences]');
  await check('document.querySelector("[data-content-section=experiences]") && !document.querySelector("[role=dialog]") && document.querySelectorAll(".ccs-experience-grid > button").length===3','Experiences is a complete section with three activity choices');
  await shot('4k-experiences');await click('.ccs-experience-grid > button:last-child');
  await click('.ccs-experience-detail .cck-primary');
  await check('document.querySelector(".ccl-observation h2").textContent.includes("Một vòng cồn")','The observation experience opens the correct photo details');
  await click('.ccl-close-all');
  await click('[aria-label="Phần trước"]');
  await check('document.querySelector(".ccs-community-topics button:nth-child(2)").getAttribute("aria-pressed")==="true"','Section navigation preserves the chosen community topic');
  await click('[data-section-target=history]');
  await check('document.querySelector("[data-history-stop=opening]")','Direct section navigation preserves the historical milestone');
  await click('[data-section-target=experiences]');
  await check('document.querySelector("[data-experience-id=village]") && document.querySelector(".ccs-section-nav > button:last-child").disabled','Experience selection persists and the final section has a clear endpoint');
  await click('.ccs-experience-grid > button:first-child');await click('.ccs-experience-detail .cck-primary');
  await check('document.querySelector(".ccl-activity")','Kitchen experience still provides the detailed beginner preview');
  await click('.ccl-close-all');await click('.cck-header nav button:first-child');
  const initialPhoto=await page('return document.querySelector(".cck-feature-photo img").src');
  await click('[aria-label="Ảnh mở đầu tiếp theo"]');
  await check('document.querySelector(".cck-feature-photo img").src!=='+JSON.stringify(initialPhoto)+' && document.querySelector(".cck-scene-controls > span").textContent.includes("02 / 03")','Manual photo navigation changes the real image and its counter');
  await click('.ccl-entry-share');
  await check('document.querySelector(".ccl-qr-unavailable") && !document.querySelector(".ccl-real-qr")','Localhost presents a clear unavailable state instead of a fake or loopback QR');
  await click('.ccl-close-all');await click('.cck-primary');
  await check('document.querySelectorAll(".cck-summary li").length===3 && document.querySelector(".ccl-duration").textContent.includes("khoảng 1 phút")','The short layer and estimated reading time remain first');
  await check('!document.querySelector("textarea") && localStorage.length===0','A shared kiosk does not expose or automatically store personal notes');
  await page(`window.__voice={play:0,pause:0,resume:0,cancel:0};Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text}}});Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'vi-VN'}],speak:u=>{window.__voice.play++;u.onstart?.()},pause:()=>window.__voice.pause++,resume:()=>window.__voice.resume++,cancel:()=>window.__voice.cancel++}});`);
  await click('.cck-listen');await click('.ccl-pause');
  await check('window.__voice.play===1 && window.__voice.pause===1 && document.querySelector(".ccl-pause").textContent.includes("Tiếp tục")','Visitor can pause the summary');
  await click('.ccl-pause');await check('window.__voice.resume===1','Visitor can resume the summary');
  await click('.ccl-read-actions button:first-child');
  await check('window.__voice.cancel===1 && document.querySelectorAll("[data-question-id]").length===3 && !document.querySelector(".cck-summary")','Opening the deeper layer stops audio and presents questions independently');
  await click('[data-question-id=nguyen-lieu]');
  await check('document.querySelector("#ccl-answer-nguyen-lieu").textContent.includes("Tư liệu đối chiếu") && document.querySelector("#ccl-answer-nguyen-lieu a").href.includes("doanubndvinhlong")','A factual answer identifies its type and exact source');
  await click('[data-question-id=cach-lam]');
  await check('document.querySelectorAll("[data-question-id][aria-expanded=true]").length===1 && document.querySelector("#ccl-answer-cach-lam").textContent.includes("Gợi ý hỏi trực tiếp")','Questions open one at a time and distinguish an invitation to ask from a sourced answer');
  await shot('4k-questions');await click('[aria-label="Về câu chuyện"]');await click('.ccl-read-actions button:nth-child(2)');
  await wait('document.querySelectorAll(".ccl-photo-point").length===3','photo annotations');
  const anchor=()=>page('const p=document.querySelector(".ccl-photo-point"),r=p.getBoundingClientRect(),i=document.querySelector(".ccl-photo-plane img").getBoundingClientRect();return {x:(r.x+r.width/2-i.x)/i.width,y:(r.y+r.height/2-i.y)/i.height}');
  const before=await anchor();await click('[aria-label="Phóng to ảnh"]');const after=await anchor();
  assert.ok(Math.abs(before.x-after.x)<.001&&Math.abs(before.y-after.y)<.001,'Annotation stays attached to the real image while zooming');console.log('PASS Annotation coordinates stay aligned through zoom');
  await click('.ccl-zoom-controls button:last-child');
  await check('!document.querySelector(".ccl-photo-point") && document.querySelectorAll(".ccl-point-list button").length===3','Annotations can be hidden without losing the independent detail list');
  await click('.ccl-point-list button:nth-child(2)');
  await check('document.querySelector(".ccl-point-explanation h3").textContent.includes("lượt bánh")','A detail can be selected independently of the photo overlay');
  await click('.ccl-zoom-controls button:last-child');await shot('4k-observation');
  await page('document.querySelector(".ccl-photo-plane img").dispatchEvent(new Event("error"))');
  await check('document.querySelector(".ccl-photo-error") && document.querySelectorAll(".ccl-point-list button").length===3','An image failure leaves its explanations available');
  await click('.ccl-photo-error button');await wait('document.querySelectorAll(".ccl-photo-point").length===3','photo retry');
  await click('[aria-label="Về câu chuyện"]');await click('.ccl-read-actions button:nth-child(3)');
  await check('document.querySelector(".ccl-activity").textContent.includes("Ai hướng dẫn?") && document.querySelectorAll(".ccl-step-tabs button").length===3','Activity preview introduces the guide and three supported ways to begin');
  await click('.ccl-materials button:nth-child(2)');
  await check('document.querySelector(".ccl-material-detail").textContent.includes("bếp nóng")','Touching a material or tool reveals its explanation');
  await click('.ccl-step-actions button:last-child');
  await check('document.querySelector(".ccl-step h3").textContent.includes("Quan sát trước")','Visitor controls the next preview step');
  await click('.ccl-step-tabs button:last-child');
  await check('document.querySelector(".ccl-step-actions button:last-child").disabled && document.querySelector(".ccl-step").textContent.includes("không có chấm điểm")','The last step is explicit and avoids grading or comparison');
  await shot('4k-activity');
  await check('!document.querySelector("video,iframe") && !document.querySelector("input[type=email]")','No unlicensed demo, autoplay media, or account gate is invented');

  await open('?story=ngay-dau&mode=questions&question=ra-mat&portable=1');
  await check('document.querySelector("[data-question-id=ra-mat]").getAttribute("aria-expanded")==="true" && document.querySelector("#ccl-answer-ra-mat").textContent.includes("9/9/2019")','A direct link restores the exact historical question');
  await click('[aria-label="Về câu chuyện"]');await viewport(390,844);
  await click('.ccl-notes summary');await page('document.querySelector("textarea").focus()');await cdp('Input.insertText',{text:'Tôi muốn hỏi thêm về những ngày đầu làm du lịch.'});
  await check('localStorage.getItem("con-chim-note:ngay-dau")===null','Typing a note does not save it automatically');
  await click('.ccl-notes > div button:first-child');
  await check('localStorage.getItem("con-chim-note:ngay-dau").includes("những ngày đầu")','Portable visitor deliberately saves a note on this device');
  await cdp('Page.reload');await wait('document.querySelector(".ccl-notes textarea")','saved note');
  await check('document.querySelector("textarea").value.includes("những ngày đầu")','Optional note survives reload for the same story');
  await click('.ccl-notes summary');await click('.ccl-notes > div button:last-child');
  await check('localStorage.getItem("con-chim-note:ngay-dau")===null && document.querySelector("textarea").value===""','Visitor can delete the note');
  await shot('portable');
  await open('?story=not-a-story&mode=activity&step=900&portable=1');
  await check('!document.querySelector("[role=dialog]") && document.querySelector(".cck-home")','Unknown story links fall back to the start screen');
  await open('?story=banh-xeo&mode=observe&point=chao&portable=1');
  await wait('document.querySelector(".ccl-photo-point")','deep photo point');
  await check('document.querySelector(".ccl-point-explanation h3").textContent==="Chảo bánh"','A direct link restores the selected image detail');
  await click('.ccl-point-list button:nth-child(2)');
  await check('new URL(location.href).searchParams.get("point")==="banh"','Portable address follows the currently selected detail');
  await open('?story=banh-xeo&mode=activity&step=1&portable=1');
  await check('document.querySelector(".ccl-step-tabs button:nth-child(2)").getAttribute("aria-pressed")==="true"','A direct link restores the preview step');

  // con-chim.test is reserved test data mapped to this local HTTP server only.
  const testOrigin=`http://con-chim.test:${server.address().port}`;
  await viewport(3840,2160);await open('?story=banh-xeo&mode=questions&question=nguyen-lieu',testOrigin);await click('.ccl-share-button');
  await wait('document.querySelector(".ccl-real-qr")?.naturalWidth>0','real story QR');
  const share=await page('return document.querySelector(".ccl-share-actions a").href');
  const parsed=new URL(share);assert.equal(parsed.searchParams.get('story'),'banh-xeo');assert.equal(parsed.searchParams.get('mode'),'questions');assert.equal(parsed.searchParams.get('question'),'nguyen-lieu');assert.equal(parsed.searchParams.get('portable'),'1');
  const encoded=await page('return document.querySelector(".ccl-real-qr").src');
  const qrPath=path.join(root,'.browser-profile','con-chim-personas-qr.png');fs.writeFileSync(qrPath,Buffer.from(encoded.split(',')[1],'base64'));
  // OpenCV's detector is scale-sensitive; validate the actual PNG at several sizes.
  const decoded=spawnSync('python',['-c','import cv2,sys,numpy as np\nimage=cv2.imdecode(np.fromfile(sys.argv[1],dtype=np.uint8),cv2.IMREAD_COLOR)\nfor scale in (0.5,0.75,1,1.5):\n sample=cv2.resize(image,None,fx=scale,fy=scale,interpolation=cv2.INTER_NEAREST)\n value,_,_=cv2.QRCodeDetector().detectAndDecode(sample)\n if value:\n  print(value)\n  break',qrPath],{encoding:'utf8',windowsHide:true,timeout:15000});
  assert.equal(decoded.status,0,decoded.stderr);assert.equal(decoded.stdout.trim(),share,'Actual QR decodes to the exact story and question');console.log('PASS Real QR decodes to the exact story, question, and portable route');
  await shot('4k-qr-test');await viewport(390,844);await cdp('Page.navigate',{url:share});await wait('document.querySelector("#ccl-answer-nguyen-lieu")','QR destination');
  await check('document.querySelector("[data-question-id=nguyen-lieu]").getAttribute("aria-expanded")==="true" && !document.querySelector("input[type=password]")','Scanning route opens the exact question without sign-in');

  for(const [width,height] of [[3840,2160],[1280,720],[390,844],[320,720]]){
    await viewport(width,height);await open('?story=banh-xeo');
    for(const mode of ['read','questions','observe','activity','takeaway']){
      if(mode!=='read')await open('?story=banh-xeo&mode='+mode);
      if(mode==='takeaway'){await open('?story=banh-xeo');await click('.ccl-share-button');}
      await check('document.querySelector(".cck-reader").getBoundingClientRect().height<=innerHeight && document.querySelector(".cck-reader-bar").scrollWidth<=document.querySelector(".cck-reader-bar").clientWidth+1 && document.documentElement.scrollWidth<=innerWidth+1',mode+' fits at '+width+'px');
    }
    await open();
    for(const section of ['overview','explore','history','community','experiences']){
      await click('[data-section-target='+section+']');
      await check('document.querySelector("[data-content-section='+section+']") && !document.querySelector("[role=dialog]") && document.documentElement.scrollWidth<=innerWidth+1 && document.querySelector("main").scrollWidth<=document.querySelector("main").clientWidth+1',section+' is a separate section that fits at '+width+'px');
      if(width>=1280 && ['history','community','experiences'].includes(section))await check('document.querySelector("main").scrollHeight<=document.querySelector("main").clientHeight+1',section+' fits the fixed screen height at '+width+'px');
      if(width>=1280 && section==='history')await check('[...document.querySelectorAll(".ccs-history-copy .ccs-actions button,.ccs-history-pagination button")].every(el=>{const r=el.getBoundingClientRect(),m=document.querySelector("main").getBoundingClientRect();return r.top>=m.top&&r.bottom<=m.bottom})','History reading and milestone controls remain visible at '+width+'px');
      if(width>=1280 && section==='history')await check('[...document.querySelectorAll(".ccs-timeline button > span")].every(el=>{const r=el.getBoundingClientRect(),t=document.querySelector(".ccs-timeline").getBoundingClientRect(),d=document.querySelector(".ccs-history-detail").getBoundingClientRect();return r.bottom<=t.bottom&&r.bottom+4<=d.top})','Timeline dates and labels do not overlap the historical detail at '+width+'px');
      if(width===1280)await shot('1280-'+section);
    }
  }
  assert.ok(!requests.some(url=>/qrserver|api\.qrcode|accounts\.google/.test(url)),'QR is generated locally and has no sign-in service');
  assert.deepEqual(errors,[],'No uncaught browser exceptions');console.log('PASS No uncaught browser exceptions or third-party QR requests');
}
main().catch(async error=>{console.error(error);process.exitCode=1;if(socket?.readyState===1)await shot('failure');}).finally(async()=>{if(socket?.readyState===1)await cdp('Browser.close').catch(()=>{});socket?.close();server?.close();await disposeBrowser(browser,profile);});
