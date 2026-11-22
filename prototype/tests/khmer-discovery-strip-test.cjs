const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'den-tho-bac-test.cjs'),source=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
const begin=source.indexOf('  const sections=['),end=source.lastIndexOf('\n}\nmain().catch');
const body=String.raw`
  if(process.env.KHMER_DISCOVERY_BASE)base=process.env.KHMER_DISCOVERY_BASE;
  await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await viewport(1920,1080);await cdp('Page.navigate',{url:base+'/bao-tang-khmer.html?section=map&place=entrance'});
  await wait('document.querySelectorAll(".kd-strip>button").length===3','three complex cards');
  const widths=()=>page('return {count:document.querySelector(".kd-bottom").dataset.cardCount,directory:document.querySelector(".kd-directory-area").getBoundingClientRect().width,strip:document.querySelector(".kd-strip").getBoundingClientRect().width,scroll:document.querySelector(".kd-strip").scrollWidth,client:document.querySelector(".kd-strip").clientWidth}');
  const fit=async label=>check('(()=>{const f=document.querySelector(".kd-frame").getBoundingClientRect(),d=document.querySelector(".kd-directory"),r=d.getBoundingClientRect(),s=d.querySelector("span").getBoundingClientRect(),a=d.querySelector("svg").getBoundingClientRect();return document.querySelector(".md-root").scrollWidth<=innerWidth+1&&r.width>=44&&r.height>=48&&r.left>=f.left&&r.right<=f.right&&r.bottom<=f.bottom&&s.left>=r.left&&s.right<=r.right&&a.right<=r.right&&document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest("button")===d})()',label);
  await check('document.querySelectorAll(".kd-tabs button>svg").length===4&&document.querySelectorAll(".kd-strip .kd-card-caption").length===3&&document.querySelector(".kd-bottom-heading h3").textContent.includes("KHÁM PHÁ")','Tabs, picture captions and heading follow the heritage design');
  const three=await widths();assert.equal(three.count,'3');await fit('Three-card layout keeps the directory pill fully reachable');await shot('discovery-strip-three');
  await click('[data-place-zone=upper]');await wait('document.querySelectorAll(".kd-strip>button").length===6','six upper-floor cards');
  const six=await widths();assert.equal(six.count,'6');assert.ok(six.directory<three.directory-5,'Directory area contracts when more cards need space');assert.ok(six.scroll>six.client,'Long rows scroll within the card strip');await fit('Six-card layout reserves a reachable directory action');await shot('discovery-strip-six');
  await click('[data-entry-card=archaeology]');await wait('document.querySelector(".kd-bottom").dataset.cardCount==="1"','one object');
  const one=await widths();assert.ok(one.directory>three.directory+100,'Directory area uses the space freed by fewer cards');await fit('One-card layout expands the directory area');await shot('discovery-strip-one');
  await click('.kd-back');await click('[data-entry-card=manuscripts]');await wait('document.querySelector(".kd-bottom").dataset.cardCount==="0"','empty display');
  await check('document.querySelector(".kd-strip-empty")&&!document.querySelector(".kd-strip>button")','An empty display keeps its explanatory message');await fit('Empty display still provides the directory');
  for(const [width,height] of [[1280,720],[768,1024],[390,844],[844,390],[3840,2160]]){
    await viewport(width,height);await click('[data-place-zone=landscape]');await wait('document.querySelectorAll(".kd-strip>button").length===3','complex cards restored');await sleep(120);await fit('Responsive directory fits at '+width+'x'+height);
    await check('(()=>{const t=document.querySelector(".kd-tabs").getBoundingClientRect(),s=document.querySelector(".kd-strip").getBoundingClientRect(),d=document.querySelector(".kd-directory-area").getBoundingClientRect();return t.right<=s.left+1&&s.right<=d.left+1&&document.querySelectorAll(".kd-strip>button").length===3})()','Tabs, picture strip and fluid directory keep separate columns at '+width);
    await shot('discovery-strip-'+width+'x'+height);
  }
  await viewport(1920,1080);await click('[data-place-zone=upper]');await click('[data-entry-card=daily-life]');await wait('document.querySelector("[data-object-card=farm]")','room objects');
  await click('[data-object-card=farm]');await check('document.querySelector("[data-object-card=farm]").getAttribute("aria-pressed")==="true"&&document.querySelector(".kd-detail").dataset.selectedPhoto==="farm"','Restyled object cards still synchronize the main picture and information');
  await click('.kd-directory');await wait('document.querySelector(".md-dialog[open]")','all places');
  await check('document.querySelectorAll("[data-directory-place]").length===16||document.querySelector(".md-dialog").textContent.includes("Tất cả")','Directory action still opens all places');
  assert.deepEqual(errors,[],'No browser exceptions');console.log('PASS Adaptive directory width for 0/1/3/6 cards, responsive design and card selection');
`;
const compiled=new Module(file,module);compiled.filename=file;compiled.paths=Module._nodeModulePaths(path.dirname(file));compiled._compile(source.slice(0,begin)+body+source.slice(end),file);
