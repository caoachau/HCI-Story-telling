(() => {
  'use strict';
  const app = document.getElementById('app');
  const dialog = document.getElementById('dialog');
  const art = window.HeritageArt;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const iconPaths = {
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>', back: '<path d="M20 12H5m6-6-6 6 6 6"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
    map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15m6-12v15"/>',
    book:'<path d="M12 6q-5-4-9-2v15q5-2 9 2 5-4 9-2V4q-5-2-9 2v15"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
    access:'<circle cx="12" cy="4" r="2"/><path d="M4 8h16m-8 0v7m0-3-5 9m5-9 5 9"/>',
    expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    touch:'<path d="M8 13V5a2 2 0 0 1 4 0v7-3a2 2 0 0 1 4 0v3-1a2 2 0 0 1 4 0v5q0 6-6 6h-1q-4 0-6-4l-4-5a2 2 0 0 1 3-2l2 2"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/>',
    pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    audio:'<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4q4 4 0 8m3-11q7 7 0 14"/>',
    pause:'<path d="M8 5v14M16 5v14" stroke-width="4"/>',
    text:'<path d="M4 5h16M4 10h16M4 15h16M4 20h10"/>',
    panorama:'<path d="M3 5q9 4 18 0v14q-9-4-18 0V5Z"/><path d="m5 16 4-5 4 4 3-3 3 4"/><circle cx="16" cy="9" r="1"/>',
    check:'<path d="m5 12 4 4L20 5"/>', exit:'<path d="M10 4H4v16h6m3-4 5-4-5-4m-5 4h12"/>',
    sparkle:'<path d="m12 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>',
    leaf:'<path d="M20 3Q1 1 4 15q6 10 16-12ZM4 20 15 9"/>',
    moon:'<path d="M20 15A9 9 0 0 1 9 3a8 8 0 1 0 11 12Z"/>',
    bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
    reset:'<path d="M4 10a8 8 0 1 1 1 7M4 3v7h7"/>',
  };
  const ic = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.sparkle}</svg>`;
  const btn = (text, action, style='', attrs='') => `<button class="btn ${style}" data-action="${action}" ${attrs}>${text}</button>`;
  const places = [
    {id:'ao',name:'Ao Bà Om',type:'pond',category:['culture','nature'],label:'Văn hóa · Thiên nhiên',x:45.3,y:21.5,photo:'ao-ba-om.jpg',desc:'Bên mặt nước yên bình, những câu chuyện về tên gọi và đời sống văn hóa vẫn đang được kể.'},
    {id:'ang',name:'Chùa Âng',type:'temple',category:['culture'],label:'Văn hóa · Kiến trúc',x:45.15,y:21.9,photo:'chua-ang.jpg',desc:'Một điểm dừng tiếp theo để tìm hiểu kiến trúc và văn hóa Khmer, trong không gian gần Ao Bà Om.'},
    {id:'museum',name:'Bảo tàng Văn hóa Khmer',type:'museum',category:['culture'],label:'Văn hóa',x:45.5,y:22.05,desc:'Một điểm khám phá trong hành trình tìm hiểu văn hóa. Nội dung chi tiết đang được chuẩn bị.'},
    {id:'hang',name:'Chùa Hang',type:'cave',category:['culture'],label:'Văn hóa',x:47.6,y:29.7,desc:'Một điểm dừng trên bản đồ khám phá. Câu chuyện về địa điểm sẽ được bổ sung trong phiên bản tiếp theo.'},
    {id:'chim',name:'Cồn Chim',type:'island',category:['nature'],label:'Thiên nhiên',x:55.9,y:31,desc:'Tiếp nối hành trình với chủ đề thiên nhiên. Nội dung chi tiết đang được chuẩn bị.'},
    {id:'sea',name:'Biển Ba Động',type:'beach',category:['nature'],label:'Thiên nhiên',x:54.85,y:91.8,desc:'Một điểm dừng hướng về biển trong hành trình khám phá. Câu chuyện đầy đủ sẽ được bổ sung.'},
    {id:'bac',name:'Đền thờ Bác',type:'temple',category:['culture'],label:'Văn hóa · Ký ức',x:50.3,y:12.1,desc:'Một điểm dừng trong hành trình khám phá Trà Vinh. Nội dung chi tiết đang được chuẩn bị.'},
  ];
  const branches = {
    legend:{name:'Truyền thuyết',kind:'legend',label:'TRUYỀN THUYẾT DÂN GIAN · MỘT CÁCH KỂ',scenes:[
      {title:'Cuộc thi\nđược kể lại',text:'Một truyền thuyết kể về cuộc thi đào ao giữa nam và nữ. Nhóm phụ nữ do bà Om dẫn dắt. Hai bên hẹn kết thúc khi sao mai xuất hiện.'},
      {title:'Ánh đèn\ntrong đêm',text:'Trong cách kể này, bà Om treo đèn lên cây. Nhóm nam tưởng đó là sao mai và dừng cuộc thi; nhóm nữ tiếp tục công việc và giành phần thắng.',reveal:true},
      {title:'Câu chuyện\nvà tên gọi',text:'Theo truyền thuyết vừa nghe, tên ao gắn với người phụ nữ dẫn dắt cuộc thi. Đây là một câu chuyện dân gian, không phải bằng chứng xác định lịch sử hình thành ao.',photo:'ao-ba-om.jpg'},
    ],question:'Câu chuyện cuộc thi đào ao vừa xem được giới thiệu dưới dạng nào?',options:['Truyền thuyết dân gian','Biên bản ghi chép cuộc thi','Kết quả khai quật khảo cổ'],answer:0,explanation:'Đây là một cách kể dân gian về tên gọi Ao Bà Om.'},
    culture:{name:'Văn hóa – lễ hội',kind:'festival',label:'VĂN HÓA KHMER · TƯ LIỆU LỄ HỘI 2024',scenes:[
      {title:'Gặp nhau\ntrong lễ hội',text:'Không gian Ao Bà Om gắn với sinh hoạt văn hóa Khmer. Lễ hội Ok Om Bok năm 2024 được tổ chức tại đây; lễ hội còn được gọi là lễ cúng trăng.'},
      {title:'Những hoạt động\nbên ao',text:'Tư liệu về đêm hội năm 2024 ghi nhận biểu diễn nghệ thuật, tái hiện nghi lễ cúng trăng, diễu hành quanh ao và thả hoa đăng, đèn nước.'},
      {title:'Một nơi để\ncùng gặp gỡ',text:'Các hoạt động lễ hội tạo dịp gặp gỡ và giao lưu trong cộng đồng. Bạn muốn quan sát không gian quanh ao hay thử một câu hỏi về nội dung vừa xem?',photo:'ao-ba-om.jpg'},
    ],question:'Lễ hội Ok Om Bok vừa được giới thiệu còn có tên gọi nào?',options:['Lễ cầu ngư','Lễ cúng trăng','Lễ khai bút'],answer:1,explanation:'Ok Om Bok còn được gọi là lễ cúng trăng.'},
  };
  const defaultPrefs = () => ({large:false,contrast:false,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,captions:true});
  let state = {view:'map',mapStage:'overview',place:'ao',branch:'legend',index:0,filter:'all',answer:null,revealed:false,pan:-18};
  let prefs = defaultPrefs();
  let history = [];
  let completed = new Set();
  let quizResults = {};
  let speaking = false;
  let speechToken = 0;
  let toastTimer;
  let opener = null;
  let mapScene = null;
  let saved = new Set();
  const session = new ContentSession(() => reset(true));
  const announce = text => document.getElementById('announcement').textContent = text;
  function toast(text) {
    const el = document.getElementById('toast');
    el.textContent = text; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'),5500);
  }
  function snapshot(){return {view:state.view,mapStage:state.mapStage,place:state.place,branch:state.branch,index:state.index,answer:state.answer,revealed:state.revealed,pan:state.pan};}
  function stopSpeech() {
    speechToken++; speaking=false;
    if('speechSynthesis' in window) speechSynthesis.cancel();
    document.querySelectorAll('[data-action="audio"]').forEach(el=>{el.innerHTML=ic('audio')+'Nghe thuyết minh';el.classList.remove('speaking');el.setAttribute('aria-pressed','false');});
    document.querySelector('.caption-live')?.remove();
  }
  function go(view, data={}, remember=true) {
    stopSpeech();
    mapScene?.destroy();mapScene=null;
    if(dialog.open)dialog.close();
    if(remember && state.view!=='idle')history.push(snapshot());
    state={...state,...data,view,mapStage:view==='map'?(data.mapStage||'overview'):'overview'};
    if(view==='idle')session.stop();else session.enter(`${view}:${state.place}:${state.branch}:${state.index}`);
    render(true);
    window.scrollTo({top:0,behavior:'instant'});
  }
  function back() {
    if(state.view==='map' && state.mapStage!=='overview'){mapScene.overview();return;}
    if(history.length){const previous=history.pop();go(previous.view,previous,false);}
    else go('map',{},false);
  }
  function reset(expired=false) {
    stopSpeech();
    if(dialog.open)dialog.close();
    mapScene?.destroy();mapScene=null;
    history=[];completed=new Set();saved=new Set();quizResults={};prefs=defaultPrefs();
    state={view:'map',mapStage:'overview',place:'ao',branch:'legend',index:0,filter:'all',answer:null,revealed:false,pan:-18};
    session.stop();applyPrefs();render(true);
    if(expired)toast('Lượt khám phá đã kết thúc. Chạm để bắt đầu một hành trình mới.');
  }
  function brand(){return `<div class="brand"><img class="brand-mark" src="assets/brand.svg" alt=""><div><div class="brand-name">TRÀ VINH</div><div class="brand-sub">Heritage stories</div></div></div>`;}
  function welcome(){return `<section class="welcome fade-in"><div class="welcome-image" aria-hidden="true"></div><div class="welcome-top">${brand()}<button class="text-btn" data-action="help">${ic('help')} Hướng dẫn</button></div><div class="welcome-decor" aria-hidden="true">✦</div><main class="welcome-main"><p class="kicker">MỘT VÙNG ĐẤT · MUÔN CÂU CHUYỆN</p><h1 tabindex="-1">Chạm vào<br>miền <em>di sản.</em></h1><p class="welcome-intro">Từ những tán cây bên ao đến mái chùa cổ kính.<br>Mở một câu chuyện, hiểu thêm một vùng đất.</p><div class="touch-cue">${btn('Bắt đầu khám phá '+ic('arrow'),'start','gold')}<span class="circle" aria-hidden="true">${ic('touch')}</span></div></main><div class="welcome-place">${ic('pin')}<div><small>MỘT GÓC TRÀ VINH</small><strong>Ao Bà Om</strong></div></div><div class="welcome-bottom"><span>Khám phá bằng những cái chạm</span><span>Bản đồ · Câu chuyện · Trải nghiệm</span></div></section>`;}
  function header() {
    const contexts={map:'BẢN ĐỒ DI SẢN',detail:'KHÁM PHÁ ĐỊA ĐIỂM',intro:'AO BÀ OM · MỞ ĐẦU',choose:'AO BÀ OM · CHỌN CÂU CHUYỆN',story:`AO BÀ OM · ${branches[state.branch].name.toUpperCase()}`,quiz:'AO BÀ OM · MỘT CÂU HỎI NHỎ',complete:'AO BÀ OM · DẤU CHÂN KHÁM PHÁ',panorama:'AO BÀ OM · GÓC NHÌN KHÁC'};
    return `<header class="header">${brand()}<div class="header-context">${contexts[state.view]||''}</div><div class="header-actions"><span class="tag">${ic('leaf')} Văn hóa & thiên nhiên</span><button class="icon-btn" data-action="fullscreen" aria-label="Bật hoặc tắt toàn màn hình">${ic('expand')}</button></div></header>`;
  }
  function dock(){return `<nav class="dock" aria-label="Điều hướng chính"><div class="dock-group"><button data-action="map" class="${['map','detail'].includes(state.view)?'active':''}">${ic('map')} Bản đồ</button><button data-action="back" ${history.length || (state.view==='map'&&state.mapStage!=='overview')?'':'disabled'}>${ic('back')} Quay lại</button><div class="dock-separator"></div><button data-action="journey">${ic('compass')} Đã khám phá <span>${completed.size?`· ${completed.size}/2`:''}</span></button></div><span class="session-note">Mỗi cái chạm, một điều mới.</span><div class="dock-group"><button data-action="help">${ic('help')} Hướng dẫn</button><button data-action="access">${ic('access')} Trợ năng</button><button data-action="end" class="end-btn">${ic('exit')} Kết thúc</button></div></nav>`;}
  function mapScreen(){return HeritageMap.markup({places,art,ic,filter:state.filter});}
  function detail(){
    const p=places.find(p=>p.id===state.place)||places[0];
    return `<section class="detail-panel" role="dialog" aria-modal="false" aria-labelledby="place-title">
      <div class="detail-photo">${p.photo?`<img src="assets/${p.photo}" alt="${p.name}">`:`<div class="illustration">${art.emblem(p.type)}</div>`}
        <span class="detail-location">${ic('compass')} TRÀ VINH / ${p.id==='ao'?'AO BÀ OM':'ĐIỂM DỪNG DI SẢN'}</span>
        <button class="icon-btn save-place" data-action="save-place" aria-label="${saved.has(p.id)?'Bỏ lưu':'Lưu'} địa điểm" aria-pressed="${saved.has(p.id)}">${ic('bookmark')}</button>
        <button class="icon-btn close-detail" data-action="close-place" aria-label="Đóng thông tin địa điểm">${ic('close')}</button>
      </div>
      <div class="detail-content"><p class="kicker">MỘT NƠI CHỐN · NHIỀU CÂU CHUYỆN</p><h2 id="place-title" tabindex="-1">${p.name}</h2>
        ${p.id==='ao'?`<p class="detail-quote">Không gian văn hóa giữa lòng Trà Vinh</p><div class="detail-tags"><span class="tag">Văn hóa Khmer</span><span class="tag">Thiên nhiên</span><span class="tag">${ic('clock')} 5 phút khám phá</span></div><p>Một không gian văn hóa và cảnh quan đặc trưng của Trà Vinh, gắn với đời sống và ký ức cộng đồng Khmer.</p><div class="actions">${btn('KHÁM PHÁ CÂU CHUYỆN '+ic('arrow'),'intro')}${btn(ic('panorama')+' XEM 360°','panorama','secondary')}</div>`:`<div class="detail-tags"><span class="tag">${p.label}</span></div><p>${p.desc}</p><p class="preview-note">Câu chuyện đầy đủ đang được chuẩn bị. Mời bạn khám phá Ao Bà Om.</p><div class="actions">${btn('Khám phá Ao Bà Om '+ic('arrow'),'place','','data-id="ao"')}${btn('Tiếp tục ngắm bản đồ','close-place','secondary')}</div>`}
      </div>
    </section>`;
  }
  function selectPlace(id){
    if(!places.some(p=>p.id===id))return;
    if(state.view!=='map')go('map',{filter:'all'});
    mapScene?.select(id);
  }
  function mountMap(){
    mapScene=new HeritageMap.Scene(app.querySelector('.map-screen'),{
      places,place:state.place,stage:state.mapStage,filter:state.filter,detail,
      reduced:()=>prefs.reduced,announce,
      onSelect:id=>{state.place=id;session.enter(`map:${id}`);},
      onFilter:filter=>{state.filter=filter;announce(`Đã lọc: ${places.filter(p=>filter==='all'||p.category.includes(filter)).length} địa điểm`);},
      onStage:(stage,id)=>{
        state.mapStage=stage;state.place=id;
        const backButton=app.querySelector('.dock [data-action="back"]');
        if(backButton)backButton.disabled=!history.length && stage==='overview';
      }
    });
  }
  function visual(content,label,caption='',extra='') {return `<div class="story-visual">${content}<span class="visual-label">${label}</span>${caption?`<span class="visual-caption">${caption}</span>`:''}${extra}</div>`;}
  function mediaTools(){return `<div class="media-tools"><button class="text-btn" data-action="audio" aria-pressed="false">${ic('audio')} Nghe thuyết minh</button><button class="text-btn" data-action="transcript">${ic('text')} Bản đọc</button><button class="text-btn" data-action="sources">Nguồn tư liệu ${ic('book')}</button></div>`;}
  const introText='Ao Bà Om còn được gọi là Ao Vuông. Quanh mặt nước là những cây sao, dầu lâu năm, có bộ rễ nổi tạo nên dáng vẻ đặc biệt.';
  function intro(){return `<main class="story-screen fade-in">${visual('<img src="assets/ao-ba-om.jpg" alt="Không gian Ao Bà Om, hàng cây soi bóng bên mặt nước">','MỘT GÓC TRÀ VINH','Ao Bà Om · Ảnh tư liệu')}<section class="story-content"><p class="kicker">AO BÀ OM / LỜI MỞ ĐẦU</p><h1 tabindex="-1">Một khoảng dừng<br><span class="serif-italic">bên mặt nước.</span></h1><div class="rule"></div><p class="story-copy">${introText}</p><p class="muted" style="font-size:14px">Một nơi chốn, nhiều góc nhìn.<br>Bạn muốn bắt đầu từ câu chuyện nào?</p>${mediaTools()}<div class="actions">${btn('Chọn câu chuyện '+ic('arrow'),'choose')}${btn(ic('panorama'),'panorama','secondary','aria-label="Xem toàn cảnh"')}</div></section></main>`;}
  function choose(){return `<main class="story-screen fade-in">${visual('<img src="assets/re-cay.jpg" alt="Bộ rễ cổ thụ quanh Ao Bà Om">','AO BÀ OM','Một nơi chốn, nhiều góc nhìn')}<section class="story-content choice-content"><p class="kicker">CHỌN ĐIỀU KHIẾN BẠN TÒ MÒ</p><h1 tabindex="-1">Câu chuyện nào<br><span class="serif-italic">dành cho bạn?</span></h1><p class="story-copy">Bạn có thể đổi chủ đề bất cứ lúc nào.</p><div class="branch-cards">${Object.entries(branches).map(([key,b])=>`<button class="branch-card" data-action="branch" data-id="${key}"><div class="branch-art">${art.story(b.kind)}</div><div class="branch-text"><strong>${b.name}</strong><p>${key==='legend'?'Theo dấu câu chuyện dân gian về tên gọi.':'Khám phá sự gắn kết với đời sống Khmer.'}</p><small>${completed.has(key)?ic('check')+' Đã khám phá':ic('clock')+' 3–5 phút'} ${ic('arrow')}</small></div></button>`).join('')}</div><button class="text-btn" data-action="panorama">${ic('panorama')} Hoặc dạo một vòng quanh ao</button></section></main>`;}
  function story(){const b=branches[state.branch],s=b.scenes[state.index],locked=s.reveal&&!state.revealed;
    return `<main class="story-screen fade-in">${visual(s.photo?`<img src="assets/${s.photo}" alt="Ao Bà Om">`:art.story(b.kind),s.photo?'AO BÀ OM':state.branch==='legend'?'MINH HỌA TRUYỀN THUYẾT':'MINH HỌA KHÔNG GIAN LỄ HỘI',s.photo?'Ảnh tư liệu':'Minh họa, không phải ảnh sự kiện',locked?`<button class="reveal-button" data-action="reveal" aria-label="Khám phá ánh đèn">${ic('sparkle')}</button>`:'')}<section class="story-content"><p class="kicker">${b.label}</p><div class="story-progress" aria-label="Cảnh ${state.index+1} trên 3">${[0,1,2].map(n=>`<span class="${n<state.index?'done':n===state.index?'current':''}"></span>`).join('')}<small>0${state.index+1} / 03</small></div><h1 tabindex="-1">${s.title.replace('\n','<br>')}</h1><p class="story-copy">${locked?'Trong đêm tối, một ánh đèn xuất hiện trên cành cây. Điều gì sẽ xảy ra tiếp theo?':s.text}</p>${locked?btn(ic('sparkle')+' Khám phá ánh đèn','reveal','secondary'):''}${!locked?mediaTools():''}<div class="actions">${btn(state.index===2?'Một câu hỏi nhỏ '+ic('arrow'):'Tiếp tục '+ic('arrow'),'next')}${state.index===2?btn(ic('panorama'),'panorama','secondary','aria-label="Xem toàn cảnh"'):btn(ic('back'),'previous','secondary','aria-label="Cảnh trước"')}</div><button class="text-btn" data-action="choose">${ic('book')} Chọn chủ đề khác</button></section></main>`;
  }
  function quiz(){const b=branches[state.branch],answered=state.answer!==null,correct=state.answer===b.answer;return `<main class="story-screen fade-in">${visual(art.story(b.kind),'MỘT CÂU HỎI NHỎ','Cùng nhớ lại câu chuyện vừa xem')}<section class="story-content"><p class="kicker">DỪNG LẠI MỘT CHÚT</p><h1 tabindex="-1">Bạn còn nhớ?</h1><p class="story-copy" style="margin-bottom:5px">${b.question}</p><div class="quiz-options" role="group" aria-label="Chọn câu trả lời">${b.options.map((o,i)=>`<button class="quiz-option ${answered?(i===b.answer?'correct':i===state.answer?'wrong':''):''}" data-action="answer" data-id="${i}" aria-pressed="${state.answer===i}"><span class="letter">${answered&&i===b.answer?ic('check'):String.fromCharCode(65+i)}</span>${o}</button>`).join('')}</div>${answered?`<div class="feedback ${correct?'':'wrong'}" role="status"><strong>${correct?'Chính xác!':'Chưa đúng, cùng xem lại nhé.'}</strong> ${b.explanation}</div>`:''}<div class="actions">${btn(answered?'Tiếp tục hành trình '+ic('arrow'):'Bỏ qua câu hỏi '+ic('arrow'),'finish')}${answered&&!correct?btn('Xem lại','review','secondary'):''}</div></section></main>`;}
  function complete(){const b=branches[state.branch],result=quizResults[state.branch];return `<main class="story-screen fade-in">${visual('<img src="assets/ao-ba-om.jpg" alt="Hàng cây và mặt nước Ao Bà Om">','MỘT CÂU CHUYỆN VỪA ĐƯỢC MỞ','Tiếp tục khám phá những điều mới')}<section class="story-content"><div class="complete-badge">${ic('check')}</div><p class="kicker">DẤU CHÂN KHÁM PHÁ</p><h1 tabindex="-1">Một câu chuyện.<br><span class="serif-italic">Một góc nhìn mới.</span></h1><p class="story-copy" style="font-size:18px;margin:20px 0">Bạn vừa khám phá chủ đề <strong>${b.name.toLowerCase()}</strong> tại Ao Bà Om.</p><div class="complete-stats"><div><strong>${completed.size}<span style="font-size:22px;color:var(--muted)"> / 2</span></strong><small>chủ đề đã khám phá</small></div><div><strong>${result==='skipped'?'—':result==='correct'?'✓':'↺'}</strong><small>${result==='skipped'?'đã bỏ qua câu hỏi':result==='correct'?'đã trả lời đúng':'đã xem giải thích'}</small></div></div><button class="next-place" data-action="place" data-id="ang"><img src="assets/chua-ang.jpg" alt="Chùa Âng"><span><small>ĐIỂM DỪNG TIẾP THEO</small><strong>Chùa Âng</strong></span>${ic('arrow')}</button><div class="actions">${btn(completed.size===2?'Xem lại các chủ đề':'Khám phá chủ đề còn lại','choose','secondary')}${btn('Về bản đồ '+ic('arrow'),'map')}</div></section></main>`;}
  function panorama(){return `<main class="panorama-screen fade-in"><div class="panorama-top"><div><p class="kicker muted" style="margin-bottom:10px">MỘT GÓC NHÌN KHÁC</p><h1 tabindex="-1">Dạo quanh <span class="serif-italic">Ao Bà Om.</span></h1><p>Kéo nhẹ để quan sát, hoặc chọn một chi tiết bên dưới.</p></div>${btn(ic('back')+' Trở về câu chuyện','back','secondary small')}</div><div class="panorama-frame" aria-label="Ảnh toàn cảnh có thể kéo ngang"><div class="panorama-world" style="--pan:${state.pan}%"><img draggable="false" src="assets/ao-ba-om.jpg" alt="Ảnh toàn cảnh Ao Bà Om"><button class="hotspot" data-action="hotspot" data-id="water">${ic('sparkle')} Mặt nước</button><button class="hotspot root" data-action="hotspot" data-id="roots">${ic('sparkle')} Hàng cây</button></div><span class="panorama-badge">TOÀN CẢNH MÔ PHỎNG · ẢNH TƯ LIỆU</span></div><div class="panorama-controls"><div>${btn(ic('back'),'pan-left','secondary','aria-label="Xem phía bên trái"')}${btn(ic('arrow'),'pan-right','secondary','aria-label="Xem phía bên phải"')}</div><div>${btn(ic('panorama')+' Mặt nước','hotspot','secondary','data-id="water"')}${btn(ic('leaf')+' Hàng cây & bộ rễ','hotspot','secondary','data-id="roots"')}</div><button class="text-btn" data-action="sources">${ic('book')} Nguồn ảnh</button></div></main>`;}
  function render(focus=false) {
    mapScene?.destroy();mapScene=null;
    app.innerHTML=`<div class="shell">${header()}${({map:mapScreen,detail:mapScreen,intro,choose,story,quiz,complete,panorama}[state.view]||mapScreen)()}${dock()}</div>`;
    if(state.view==='map')mountMap();
    if(focus)app.querySelector(state.view==='map'&&state.mapStage==='popup'?'.detail-panel h2':'h1,h2')?.focus({preventScroll:true});
    if(state.view==='panorama')bindPan();
  }
  function applyPrefs(){document.body.classList.toggle('large-text',prefs.large);document.body.classList.toggle('high-contrast',prefs.contrast);document.body.classList.toggle('reduced-motion',prefs.reduced);}
  function currentText(){if(state.view==='intro')return introText;if(state.view==='story')return branches[state.branch].scenes[state.index].text;return '';}
  function openDialog(title,content,actions='') {
    opener=document.activeElement;
    dialog.innerHTML=`<div class="dialog-header"><h2 id="dialog-title">${title}</h2><button class="icon-btn" data-action="close-dialog" aria-label="Đóng cửa sổ">${ic('close')}</button></div>${content}${actions?`<div class="dialog-actions">${actions}</div>`:''}`;
    if(!dialog.open)dialog.showModal();
  }
  function closeDialog(){dialog.close();if(opener?.isConnected)opener.focus();}
  function help(){openDialog('Khám phá thật đơn giản',`<div class="help-step"><span>1</span><div><strong>Chọn một địa điểm</strong><p>Chạm vào biểu tượng trên bản đồ hoặc thẻ địa điểm ở phía dưới.</p></div></div><div class="help-step"><span>2</span><div><strong>Mở câu chuyện của bạn</strong><p>Chọn chủ đề, đọc hoặc nghe. Dùng nút Tiếp tục và Quay lại theo nhịp của bạn.</p></div></div><div class="help-step"><span>3</span><div><strong>Tiếp tục khám phá</strong><p>Trở về bản đồ để chọn nơi khác, hoặc bấm Kết thúc để nhường bàn cho lượt tiếp theo.</p></div></div><p class="help-note">Một nội dung giữ trên màn hình quá 5 phút sẽ tự trở về màn hình chờ. Bạn cũng có thể nhờ người hướng dẫn tại chỗ hỗ trợ.</p>`,btn('Đã hiểu '+ic('check'),'close-dialog'));}
  function access(){openDialog('Thoải mái theo cách của bạn',`<div class="setting-row"><div><strong>Cỡ chữ</strong><small>Áp dụng cho nội dung và điều hướng</small></div><div class="size-options"><button data-action="font" data-id="normal" class="${!prefs.large?'active':''}" aria-pressed="${!prefs.large}">A</button><button data-action="font" data-id="large" class="${prefs.large?'active':''}" aria-pressed="${prefs.large}">A+</button></div></div>${[['contrast','Tương phản cao','Làm rõ chữ và đường nét'],['reduced','Giảm chuyển động','Dừng hiệu ứng nền và chuyển cảnh'],['captions','Phụ đề khi nghe','Hiển thị lời đọc khi phát thuyết minh']].map(([key,name,sub])=>`<div class="setting-row"><div><strong>${name}</strong><small>${sub}</small></div><button class="switch" role="switch" aria-label="${name}" aria-checked="${prefs[key]}" data-action="pref" data-id="${key}"></button></div>`).join('')}<p class="help-note">Các lựa chọn được giữ trong lượt khám phá này. Khi kết thúc, màn hình trở về thiết lập ban đầu.</p>`,btn('Tiếp tục khám phá','close-dialog'));}
  function sources(){openDialog('Nguồn & tư liệu',`<p class="dialog-copy">Nội dung được biên soạn ngắn để phục vụ trải nghiệm khám phá.</p><ul class="sources-list"><li><a href="https://vietnamtourism.vn/en/index.php/tourism/items/1395" target="_blank" rel="noopener noreferrer">Ao Bà Om — Cục Du lịch Quốc gia Việt Nam</a><small>Cảnh quan, tên gọi và điểm đến gần ao. Ảnh Chùa Âng: TITC.</small></li><li><a href="https://vinhlongtourist.vn/vi/detailnews/?id=news_57043&t=ve-vinh-long-den-tham-quan-ao-ba-om-thang-canh-mien-tay" target="_blank" rel="noopener noreferrer">Ao Bà Om — Trung tâm Xúc tiến Du lịch Vĩnh Long</a><small>Một dị bản truyền thuyết. Ảnh ao và rễ cây từ bài của Huỳnh Biển, 18/09/2025.</small></li><li><a href="https://dantoc.vietnamtourism.gov.vn/tra-vinh-dem-le-hoi-ok-om-bok-nam-2024/" target="_blank" rel="noopener noreferrer">Đêm lễ hội Ok Om Bok năm 2024</a><small>Tư liệu sự kiện năm 2024, đăng từ Cổng thông tin Trà Vinh.</small></li></ul><p class="help-note">Bản đồ và các cảnh minh họa được thiết kế riêng cho trải nghiệm. Ảnh toàn cảnh được mô phỏng kéo ngang, không phải dữ liệu 360°.</p>`,btn('Trở lại khám phá','close-dialog'));}
  function journey(){openDialog('Dấu chân trong lượt này',`<p class="dialog-copy">${completed.size?`Bạn đã khám phá ${completed.size}/2 chủ đề tại Ao Bà Om.`:'Bạn chưa hoàn thành chủ đề nào. Bắt đầu với Ao Bà Om để mở câu chuyện đầu tiên.'}</p><div style="margin-top:20px">${Object.entries(branches).map(([key,b])=>`<div class="setting-row"><strong>${b.name}</strong><span class="tag">${completed.has(key)?ic('check')+' Đã khám phá':'Chưa khám phá'}</span></div>`).join('')}</div>`,btn('Khám phá Ao Bà Om '+ic('arrow'),'intro'));}
  function playAudio(){
    if(speaking){stopSpeech();return;}
    if(!('speechSynthesis' in window)){toast('Trình duyệt chưa hỗ trợ giọng đọc. Bạn có thể mở Bản đọc để theo dõi nội dung.');return;}
    const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'));
    if(!voice){toast('Máy này chưa có giọng đọc tiếng Việt. Nội dung đầy đủ vẫn có trong Bản đọc.');return;}
    const text=currentText();if(!text)return;
    const utterance=new SpeechSynthesisUtterance(text);utterance.lang='vi-VN';utterance.voice=voice;utterance.rate=.88;
    const token=++speechToken;
    utterance.onend=utterance.onerror=()=>{if(token===speechToken)stopSpeech();};
    speaking=true;
    document.querySelectorAll('[data-action="audio"]').forEach(el=>{el.innerHTML=ic('pause')+' Dừng thuyết minh';el.classList.add('speaking');el.setAttribute('aria-pressed','true');});
    if(prefs.captions){const caption=document.createElement('p');caption.className='caption-live';caption.textContent=text;document.querySelector('.media-tools')?.after(caption);}
    speechSynthesis.speak(utterance);
  }
  function movePan(amount){state.pan=Math.max(-35.4,Math.min(0,state.pan+amount));const el=document.querySelector('.panorama-world');if(el)el.style.setProperty('--pan',`${state.pan}%`);}
  function bindPan(){const el=document.querySelector('.panorama-frame');let start=null;el.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;start={x:e.clientX,pan:state.pan};el.setPointerCapture(e.pointerId);el.classList.add('dragging');});el.addEventListener('pointermove',e=>{if(!start)return;state.pan=start.pan;movePan((e.clientX-start.x)/(el.clientWidth*1.55)*100);});const end=()=>{start=null;el.classList.remove('dragging');};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);}
  async function action(name,id,el){
    switch(name){
      case 'start':history=[];clearTimeout(toastTimer);document.getElementById('toast').classList.remove('show');go('map',{},false);break;
      case 'map':if(mapScene)mapScene.overview();else go('map');break;
      case 'map-overview':mapScene?.overview();break;
      case 'place':selectPlace(id);break;
      case 'reopen-place':mapScene?.open();break;
      case 'save-place':if(saved.has(state.place))saved.delete(state.place);else saved.add(state.place);el.setAttribute('aria-pressed',String(saved.has(state.place)));el.setAttribute('aria-label',`${saved.has(state.place)?'Bỏ lưu':'Lưu'} địa điểm`);toast(saved.has(state.place)?'Đã lưu địa điểm trong lượt khám phá này.':'Đã bỏ lưu địa điểm.');break;
      case 'close-place':mapScene?.close();break;
      case 'filter':mapScene?.setFilter(id);break;
      case 'intro':go('intro',{place:'ao'});break;
      case 'choose':go('choose',{place:'ao'});break;
      case 'branch':go('story',{place:'ao',branch:id,index:0,answer:null,revealed:false});break;
      case 'next':if(branches[state.branch].scenes[state.index].reveal&&!state.revealed){state.revealed=true;render();toast('Câu chuyện đã được mở. Chọn Tiếp tục khi bạn sẵn sàng.');break;}if(state.index<2)go('story',{index:state.index+1,revealed:false});else{completed.add(state.branch);go('quiz',{answer:null});}break;
      case 'previous':if(state.index>0)go('story',{index:state.index-1,revealed:false});else go('choose');break;
      case 'reveal':state.revealed=true;render();announce(branches[state.branch].scenes[state.index].text);break;
      case 'answer':state.answer=Number(id);render();app.querySelector(`[data-action="answer"][data-id="${id}"]`)?.focus({preventScroll:true});break;
      case 'review':go('story',{index:state.branch==='legend'?2:0,revealed:true});break;
      case 'finish':quizResults[state.branch]=state.answer===null?'skipped':state.answer===branches[state.branch].answer?'correct':'incorrect';go('complete');break;
      case 'panorama':go('panorama',{pan:-18});break;
      case 'pan-left':movePan(8);break;
      case 'pan-right':movePan(-8);break;
      case 'hotspot':openDialog(id==='water'?'Mặt nước và bóng cây':'Những bộ rễ quanh ao',`${id==='roots'?'<img src="assets/re-cay.jpg" alt="Chi tiết bộ rễ cây quanh Ao Bà Om" style="height:230px;border-radius:12px;margin-bottom:18px">':''}<p class="dialog-copy">${id==='water'?'Quan sát mặt ao và bóng cây trong ảnh. Chi tiết nào khiến bạn chú ý trước tiên?':'Những bộ rễ nổi quanh ao là một nét đặc trưng của cảnh quan nơi đây.'}</p>`,btn('Tiếp tục quan sát','close-dialog'));break;
      case 'back':back();break;
      case 'help':help();break;
      case 'access':access();break;
      case 'font':prefs.large=id==='large';applyPrefs();dialog.querySelectorAll('[data-action="font"]').forEach(b=>{const active=(b.dataset.id==='large')===prefs.large;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});break;
      case 'pref':prefs[id]=!prefs[id];applyPrefs();if(id==='reduced')mapScene?.motionChanged();el.setAttribute('aria-checked',String(prefs[id]));if(id==='captions'&&!prefs.captions)document.querySelector('.caption-live')?.remove();break;
      case 'sources':sources();break;
      case 'journey':journey();break;
      case 'transcript':openDialog('Bản đọc câu chuyện',`<p class="dialog-copy">${escape(currentText())}</p>`,btn('Trở về câu chuyện','close-dialog'));break;
      case 'audio':playAudio();break;
      case 'end':openDialog('Kết thúc lượt khám phá?',`<p class="dialog-copy">Màn hình sẽ trở về bản đồ toàn cảnh Trà Vinh. Tiến độ và lựa chọn trong lượt này sẽ được đặt lại.</p>`,btn('Tiếp tục khám phá','close-dialog','secondary')+btn('Kết thúc '+ic('exit'),'confirm-end'));break;
      case 'confirm-end':reset();break;
      case 'close-dialog':closeDialog();break;
      case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Chọn F11 trên máy tính để trình diễn toàn màn hình.');}break;
    }
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-action]');if(!el||el.disabled)return;action(el.dataset.action,el.dataset.id,el);});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeDialog();}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open&&mapScene){e.preventDefault();if(state.mapStage==='popup')mapScene.close();else if(state.mapStage!=='overview')mapScene.overview();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpeech();else session.check();});
  window.addEventListener('focus',()=>session.check());
  window.addEventListener('pagehide',()=>{stopSpeech();mapScene?.destroy();});
  setInterval(()=>session.check(),250);
  applyPrefs();
  render();
})();
