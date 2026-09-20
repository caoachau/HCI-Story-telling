/* A retained camera scene: overview, flight, focus and popup share one map world. */
window.HeritageMap = (() => {
  'use strict';
  const TIMING = { select: 300, prepare: 200, fly: 1200, settle: 300 };
  const SCALE = 2.8;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = n => (1 - Math.cos(Math.PI * clamp(n))) / 2;
  const mix = (a, b, p) => a + (b - a) * p;
  // Labels use leaders so closely grouped locations stay readable without moving anchors.
  const offsets = { ao: [-48,-24], ang: [-148,85], museum: [142,182], hang:[0,38], chim:[52,-20], bac:[38,-20], sea:[50,-100] };
  const mobileLabels={ao:[.28,.35],ang:[.22,.53],museum:[.7,.69],hang:[.25,.72],chim:[.76,.48],bac:[.75,.29],sea:[.72,.85]};

  function markup({places, art, ic, filter}) {
    return `<main class="map-screen" data-stage="overview" aria-label="Bản đồ di sản Trà Vinh">
      <section class="map-canvas" aria-label="Bản đồ trải nghiệm theo tư liệu tham khảo">
        <div class="map-world">
          <img class="map-terrain" src="assets/tra-vinh-aerial.png" alt="Toàn cảnh sông nước và cảnh quan Trà Vinh từ trên cao" draggable="false" fetchpriority="high">
          <img class="map-local-terrain" src="assets/ao-ba-om-aerial.png" alt="Góc nhìn từ trên cao xuống mặt ao và hàng cây Ao Bà Om" draggable="false">
          <div class="map-markers">${places.map(p => `<button class="marker" data-action="place" data-id="${p.id}" aria-label="Khám phá ${p.name}" aria-pressed="false" style="left:${p.x}%;top:${p.y}%">
            <svg class="marker-leader" aria-hidden="true"><line x1="0" y1="0" x2="0" y2="0"/></svg>
            <span class="marker-content"><span class="marker-orbit"></span><span class="marker-symbol">${art.emblem(p.type)}</span><span class="marker-label">${p.name}</span></span><span class="pin-dot"></span>
          </button>`).join('')}</div>
        </div>
        <div class="map-shade" aria-hidden="true"></div>
        <div class="map-heading"><p class="kicker">MỘT VÙNG ĐẤT · MUÔN CÂU CHUYỆN</p><h1 tabindex="-1">Trà Vinh,<br><em>miền di sản.</em></h1><p>Chạm một điểm đến.<br>Mở một câu chuyện.</p></div>
        <button class="map-return" data-action="map-overview" hidden>${ic('back')} Toàn cảnh Trà Vinh</button>
        <div class="map-orientation" aria-hidden="true"><span>B</span>${ic('compass')}</div>
        <div class="map-filter" aria-label="Lọc địa điểm">${[['all','Tất cả'],['culture','Văn hóa'],['nature','Thiên nhiên']].map(([id,label]) => `<button data-action="filter" data-id="${id}" class="${filter===id?'active':''}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div>
        <div class="map-focus-label" hidden><p class="kicker">ĐIỂM DỪNG CỦA BẠN</p><h2></h2><p class="focus-quote"></p><div class="focus-tags"></div><button class="text-btn" data-action="reopen-place">Mở câu chuyện ${ic('arrow')}</button></div>
        <div class="map-flight-status" role="status"><span></span><p>Chọn một địa điểm để bắt đầu</p></div>
        <p class="map-note">BẢN ĐỒ TRẢI NGHIỆM<br><span>Hình ảnh theo tư liệu tham khảo</span></p>
        <div class="map-popup-host" hidden></div>
      </section>
      <section class="places-strip" aria-label="Chọn địa điểm từ danh sách">${places.map(p => `<button class="place-tile" data-action="place" data-id="${p.id}">${art.emblem(p.type)}<span><strong>${p.name}</strong><small>${p.id==='ao'?'Câu chuyện bên mặt nước':p.label}</small></span>${p.id==='ao'?ic('arrow'):''}</button>`).join('')}</section>
    </main>`;
  }

  class Scene {
    constructor(root, options) {
      this.root=root; this.options=options;
      this.canvas=root.querySelector('.map-canvas');
      this.world=root.querySelector('.map-world');
      this.local=root.querySelector('.map-local-terrain');
      this.host=root.querySelector('.map-popup-host');
      this.markers=[...root.querySelectorAll('.marker')];
      this.frame=0; this.epoch=0; this.progress=0; this.highlight=0; this.stage='overview'; this.busy=false; this.afterReturn=null;
      this.place=options.places.find(p=>p.id===options.place)||options.places[0];
      this.filter=options.filter;
      this.resizeObserver=new ResizeObserver(()=>this.paint(this.progress));
      this.resizeObserver.observe(this.canvas);
      this.setFilter(this.filter, false);
      this.paint(0);
      if(['focused','popup'].includes(options.stage)) {
        this.progress=1; this.highlight=1; this.paint(1); this.setStage('focused');
        if(options.stage==='popup')this.open(false);
      } else this.setStage('overview');
    }
    cancel() { cancelAnimationFrame(this.frame); this.epoch++; this.busy=false; this.afterReturn=null; }
    destroy() { this.cancel(); this.resizeObserver.disconnect(); }
    setStage(stage) {
      if(!this.root.isConnected)return;
      this.stage=stage; this.root.dataset.stage=stage;
      const overview=stage==='overview';
      const focused=stage==='focused'||stage==='popup';
      this.root.querySelector('.map-return').hidden=overview;
      this.root.querySelector('.map-heading').inert=!overview;
      this.root.querySelector('.map-filter').inert=!overview;
      const label=this.root.querySelector('.map-focus-label');
      label.hidden=!focused || stage==='popup';
      label.querySelector('h2').textContent=this.place.name;
      label.querySelector('.focus-quote').textContent=this.place.id==='ao'?'Không gian văn hóa giữa lòng Trà Vinh':this.place.label;
      label.querySelector('.focus-tags').textContent=this.place.id==='ao'?'Văn hóa Khmer  ·  Thiên nhiên  ·  5 phút khám phá':this.place.label;
      this.root.querySelector('.map-flight-status p').textContent=overview?'Chọn một địa điểm để bắt đầu':stage==='selected'?`Theo dấu ${this.place.name}`:stage==='preparing'?'Một hành trình đang mở ra…':stage==='flying'?`Đang đến ${this.place.name}…`:stage==='returning'?'Trở về miền di sản…':`Bạn đang ở ${this.place.name}`;
      this.markers.forEach(el=>{
        const selected=!overview&&el.dataset.id===this.place.id;
        el.classList.toggle('selected',selected);
        el.classList.toggle('dimmed',!overview&&!selected);
        el.setAttribute('aria-pressed',String(selected));
        el.disabled=this.busy || (!overview&&this.place.id==='ao'&&el.dataset.id!=='ao');
        el.tabIndex=el.disabled?-1:0;
      });
      this.root.querySelectorAll('.place-tile').forEach(el=>{
        el.classList.toggle('selected',!overview&&el.dataset.id===this.place.id);
        el.disabled=this.busy;
      });
      this.options.onStage(stage,this.place.id);
    }
    paint(progress) {
      this.progress=clamp(progress);
      const w=this.canvas.clientWidth, h=this.canvas.clientHeight;
      if(!w||!h)return;
      // A single shared coordinate surface keeps terrain, anchors and camera together.
      const worldW=Math.max(w,h*(1748/900)), worldH=worldW/(1748/900);
      const startX=(w-worldW)/2, startY=(h-worldH)/2;
      const targetX=w*(w<700?.5:.47), targetY=h*(w<700?.29:.48);
      const px=worldW*this.place.x/100, py=worldH*this.place.y/100;
      const scale=mix(1,SCALE,this.progress);
      const x=mix(startX,targetX-px*SCALE,this.progress);
      const y=mix(startY,targetY-py*SCALE,this.progress);
      Object.assign(this.world.style,{width:`${worldW}px`,height:`${worldH}px`,transform:`translate3d(${x}px,${y}px,0) scale(${scale})`});
      // The supplied close aerial is a narrative level of detail, not surveyed GIS tiles.
      // It is anchored to Ao and moves with the SAME camera during its reveal.
      const ao=this.options.places[0];
      const localW=Math.max(w,h*(1760/894))*(w<700?1.48:1.12)/SCALE, localH=localW/(1760/894);
      const detail=this.place.id==='ao'?ease((this.progress-.2)/.6):0;
      Object.assign(this.local.style,{width:`${localW}px`,height:`${localH}px`,left:`${worldW*ao.x/100-localW*.482}px`,top:`${worldH*ao.y/100-localH*.475}px`,opacity:String(detail)});
      this.local.style.setProperty('--detail-feather',`${15*(1-ease((this.progress-.7)/.3))}%`);
      this.markers.forEach(el=>{
        const isSelected=el.dataset.id===this.place.id && this.stage!=='overview';
        const displayScale=isSelected?mix(mix(1,1.12,this.highlight),1.4,this.progress):mix(1,.78,this.progress);
        el.style.setProperty('--marker-scale',String(displayScale/scale));
        const place=this.options.places.find(p=>p.id===el.dataset.id);
        const anchorX=startX+worldW*place.x/100, anchorY=startY+worldH*place.y/100;
        const desired=offsets[el.dataset.id]||[0,-14];
        const label=el.querySelector('.marker-label');
        const halfLabel=Math.max(34,label.offsetWidth/2)+14;
        const mobile=mobileLabels[el.dataset.id];
        const labelX=w<700?w*mobile[0]:anchorX+desired[0];
        const labelY=w<700?h*mobile[1]:anchorY+desired[1];
        const offset=[Math.max(halfLabel,Math.min(w-halfLabel,labelX))-anchorX,Math.max(43,Math.min(h-85,labelY))-anchorY];
        const offsetProgress=isSelected?1-this.progress:1;
        el.style.setProperty('--label-x',`${offset[0]*offsetProgress}px`);
        el.style.setProperty('--label-y',`${offset[1]*offsetProgress}px`);
        const line=el.querySelector('line');
        line.setAttribute('x2',String(offset[0]*offsetProgress));
        line.setAttribute('y2',String(offset[1]*offsetProgress));
        const distantOpacity=this.stage==='selected'?.65:['preparing','flying','focused','popup'].includes(this.stage)?.35:1;
        el.style.opacity=isSelected?'1':String(mix(distantOpacity,this.place.id==='ao'?0:.28,this.progress));
      });
    }
    setFilter(filter, notify=true) {
      if(this.stage!=='overview')return;
      this.filter=filter;
      this.options.places.forEach(p=>{
        const hidden=filter!=='all'&&!p.category.includes(filter);
        this.root.querySelectorAll(`[data-action="place"][data-id="${p.id}"]`).forEach(el=>el.hidden=hidden);
      });
      this.root.querySelectorAll('[data-action="filter"]').forEach(el=>{
        el.classList.toggle('active',el.dataset.id===filter);
        el.setAttribute('aria-pressed',String(el.dataset.id===filter));
      });
      if(notify)this.options.onFilter(filter);
    }
    select(id) {
      const place=this.options.places.find(p=>p.id===id);
      if(!place||this.busy)return;
      if(this.stage!=='overview') {
        if(id===this.place.id){if(this.stage==='focused')this.open();return;}
        this.overview(()=>this.select(id)); return;
      }
      this.cancel(); this.place=place; this.highlight=0; this.options.onSelect(id);
      this.host.hidden=true; this.host.innerHTML='';
      this.busy=true; this.setStage('selected'); this.paint(0);
      if(this.options.reduced()){this.finishFlight();this.open();return;}
      const epoch=this.epoch, start=performance.now();
      const flightStart=TIMING.select+TIMING.prepare, flightEnd=flightStart+TIMING.fly;
      const tick=now=>{
        if(epoch!==this.epoch||!this.root.isConnected)return;
        const elapsed=now-start;
        this.highlight=ease(elapsed/TIMING.select);
        let stage=elapsed<TIMING.select?'selected':elapsed<flightStart?'preparing':elapsed<flightEnd?'flying':'focused';
        if(this.stage!==stage){
          if(stage==='focused')this.busy=false;
          this.setStage(stage);
        }
        this.paint(ease((elapsed-flightStart)/TIMING.fly));
        if(elapsed>=flightEnd+TIMING.settle){this.frame=0;this.open();return;}
        this.frame=requestAnimationFrame(tick);
      };
      this.frame=requestAnimationFrame(tick);
    }
    finishFlight() { this.cancel(); this.highlight=1; this.paint(1); this.setStage('focused'); this.paint(1); }
    open(focus=true) {
      if(this.stage!=='focused' && this.stage!=='popup')return;
      this.cancel(); this.host.innerHTML=this.options.detail(); this.host.hidden=false;
      this.setStage('popup');
      if(focus&&!document.querySelector('dialog[open]'))this.host.querySelector('h2')?.focus({preventScroll:true});
      this.options.announce(`${this.place.name}. Thông tin địa điểm đã mở.`);
    }
    close() {
      if(this.stage!=='popup')return;
      this.cancel(); this.host.hidden=true; this.host.innerHTML='';
      this.setStage('focused');
      this.root.querySelector(`.marker[data-id="${this.place.id}"]`)?.focus({preventScroll:true});
      this.options.announce(`Đã đóng thông tin. Bản đồ vẫn ở ${this.place.name}.`);
    }
    overview(after) {
      if(this.stage==='overview'){after?.();return;}
      this.cancel(); this.host.hidden=true; this.host.innerHTML='';
      this.afterReturn=after;
      const initial=this.progress, epoch=this.epoch;
      const complete=()=>{
        this.busy=false;this.highlight=0;this.setStage('overview');this.paint(0);
        this.setFilter(this.filter,false);
        this.root.querySelector('h1')?.focus({preventScroll:true});
        const next=this.afterReturn;this.afterReturn=null;next?.();
      };
      if(this.options.reduced()||initial===0){complete();return;}
      this.busy=true;this.setStage('returning');
      const start=performance.now();
      const tick=now=>{
        if(epoch!==this.epoch||!this.root.isConnected)return;
        const p=clamp((now-start)/1000);
        this.paint(initial*(1-ease(p)));
        if(p===1){this.frame=0;complete();return;}
        this.frame=requestAnimationFrame(tick);
      };
      this.frame=requestAnimationFrame(tick);
    }
    motionChanged() {
      if(!this.options.reduced())return;
      if(this.stage==='returning'){const next=this.afterReturn;this.cancel();this.highlight=0;this.setStage('overview');this.paint(0);next?.();}
      else if(['selected','preparing','flying'].includes(this.stage)){this.finishFlight();this.open(false);}
    }
  }
  return {markup, Scene};
})();
