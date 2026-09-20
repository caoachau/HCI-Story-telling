from pathlib import Path
p = Path(r'F:\TTNM-HCI\prototype\app.js')
s = p.read_text(encoding='utf-8')
s = s.replace("reset:'<path", "bookmark:'<path d=\"M6 3h12v18l-6-4-6 4z\"/>',\n    reset:'<path")
s = s.replace('x:43,y:40','x:45.3,y:21.5').replace('x:30,y:65','x:45.15,y:21.9').replace('x:66,y:28','x:45.5,y:22.05').replace('x:69,y:56','x:47.6,y:29.7').replace('x:82,y:77','x:55.9,y:31').replace('x:56,y:82','x:54.85,y:91.8')
s = s.replace("name:'Bảo tàng Khmer'", "name:'Bảo tàng Văn hóa Khmer'")
s = s.replace("let state = {view:'idle',", "let state = {view:'map',mapStage:'overview',")
s = s.replace('  let opener = null;', '  let opener = null;\n  let mapScene = null;\n  let saved = new Set();')
s = s.replace('view:state.view,place:state.place', 'view:state.view,mapStage:state.mapStage,place:state.place')
s = s.replace("    stopSpeech();\n    if(dialog.open)dialog.close();\n    if(remember", "    stopSpeech();\n    mapScene?.destroy();mapScene=null;\n    if(dialog.open)dialog.close();\n    if(remember", 1)
s = s.replace('    state={...state,...data,view};', "    state={...state,...data,view,mapStage:view==='map'?(data.mapStage||'overview'):'overview'};")
s = s.replace('  function back() {\n', "  function back() {\n    if(state.view==='map' && state.mapStage!=='overview'){mapScene.overview();return;}\n")
s = s.replace("    history=[];completed=new Set();quizResults={};prefs=defaultPrefs();", "    mapScene?.destroy();mapScene=null;\n    history=[];completed=new Set();saved=new Set();quizResults={};prefs=defaultPrefs();")
s = s.replace("state={view:'idle',", "state={view:'map',mapStage:'overview',")
s = s.replace("${history.length?'':'disabled'}", "${history.length || (state.view==='map'&&state.mapStage!=='overview')?'':'disabled'}")
a=s.index('  function mapScreen(){')
b=s.index('  function visual(',a)
s=s[:a]+'''  function mapScreen(){return HeritageMap.markup({places,art,ic,filter:state.filter});}
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
''' + s[b:]
s = s.replace("    app.innerHTML=state.view==='idle'?welcome():", "    mapScene?.destroy();mapScene=null;\n    app.innerHTML=")
s = s.replace("    if(focus)app.querySelector('h1,h2')?.focus({preventScroll:true});", "    if(state.view==='map')mountMap();\n    if(focus && !(state.view==='map'&&state.mapStage==='popup'))app.querySelector('h1,h2')?.focus({preventScroll:true});")
s = s.replace("case 'map':go('map');break;", "case 'map':if(mapScene)mapScene.overview();else go('map');break;\n      case 'map-overview':mapScene?.overview();break;")
s = s.replace("case 'place':go('detail',{place:id,filter:'all'});break;", "case 'place':selectPlace(id);break;\n      case 'reopen-place':mapScene?.open();break;\n      case 'save-place':if(saved.has(state.place))saved.delete(state.place);else saved.add(state.place);el.setAttribute('aria-pressed',String(saved.has(state.place)));el.setAttribute('aria-label',`${saved.has(state.place)?'Bỏ lưu':'Lưu'} địa điểm`);toast(saved.has(state.place)?'Đã lưu địa điểm trong lượt khám phá này.':'Đã bỏ lưu địa điểm.');break;")
s = s.replace("case 'close-place':go('map',{},false);break;", "case 'close-place':mapScene?.close();break;")
a=s.index("      case 'filter':")
b=s.index("      case 'intro':",a)
s=s[:a]+"      case 'filter':mapScene?.setFilter(id);break;\n"+s[b:]
s=s.replace("prefs[id]=!prefs[id];applyPrefs();", "prefs[id]=!prefs[id];applyPrefs();if(id==='reduced')mapScene?.motionChanged();")
s=s.replace('Màn hình sẽ trở về lời chào ban đầu.', 'Màn hình sẽ trở về bản đồ toàn cảnh Trà Vinh.')
s=s.replace("  document.addEventListener('visibilitychange'", "  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open&&mapScene){e.preventDefault();if(state.mapStage==='popup')mapScene.close();else if(state.mapStage!=='overview')mapScene.overview();}});\n  document.addEventListener('visibilitychange'")
s=s.replace("  window.addEventListener('pagehide',stopSpeech);", "  window.addEventListener('pagehide',()=>{stopSpeech();mapScene?.destroy();});")
s=s.replace("if(location.hash==='#map')go('map',{},false);else render();", "render();")
p.write_text(s,encoding='utf-8')
