import React, { useEffect, useState } from 'react';
import { Copy, ExternalLink, QrCode, RefreshCw } from 'lucide-react';
import type { DiscoveryStory } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';
import { publicStoryLink, type StoryContext } from '../utils/storyLinks';

export function StoryTakeaway({story,context}:{story:DiscoveryStory;context:StoryContext}) {
  const url=publicStoryLink(story.id,context,window.location.href);
  const [code,setCode]=useState(''),[message,setMessage]=useState(''),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{
    if(!url)return;
    let active=true;
    setCode('');setFailed(false);setMessage('Đang tạo mã QR…');
    import('qrcode').then(module=>module.toDataURL(url,{width:768,margin:4,errorCorrectionLevel:'M',color:{dark:'#000000',light:'#ffffff'}})).then(result=>{if(active){setCode(result);setMessage('Mã QR đã sẵn sàng.');}}).catch(()=>{if(active){setFailed(true);setMessage('Chưa tạo được mã QR. Bạn có thể thử lại.');}});
    return()=>{active=false;};
  },[url,attempt]);
  const copy=async()=>{try{await navigator.clipboard.writeText(url!);setMessage('Đã sao chép liên kết câu chuyện.');}catch{setMessage('Chưa sao chép được. Bạn có thể quét mã QR hoặc mở liên kết bên dưới.');}};
  const layer=STORY_LAYERS[story.id];
  const detail=context.mode==='observe'?layer.points.find(point=>point.id===context.point)?.title:context.mode==='questions'?layer.questions.find(question=>question.id===context.question)?.title:context.mode==='activity'?layer.activity?.steps[context.step||0]?.title:undefined;
  const contextName=context.mode==='observe'?'Chi tiết ảnh':context.mode==='activity'?'Xem trước hoạt động':context.mode==='questions'?'Hỏi sâu':'Bản tóm tắt và nội dung mở rộng';
  return <div className="ccl-takeaway"><div className="ccl-takeaway-intro"><p className="cck-kicker">Tiếp tục bằng trình duyệt · Không cần tài khoản</p><h2 id="cck-reader-title">Mang câu chuyện theo</h2><h3>{story.title}</h3><p>Phần mang theo: {contextName}{detail&&<> · <strong>{detail}</strong></>}.</p><div className="ccl-reflection"><strong>Một câu hỏi mang theo</strong><p>{layer.reflection}</p></div></div>
    <div className="ccl-qr-panel">{url?<>
      {code?<img className="ccl-real-qr" src={code} alt={`Mã QR mở câu chuyện ${story.title}`} width={768} height={768}/>:<div className="ccl-qr-loading"><QrCode size={60}/><p>{message}</p>{failed&&<button type="button" className="cck-outline" onClick={()=>setAttempt(value=>value+1)}><RefreshCw size={19}/>Thử lại</button>}</div>}
      <p className="ccl-qr-status" role="status">{message}</p><p>Quét để mở đúng nội dung này trên điện thoại. Bạn có thể lưu trang và tự ghi chú trên thiết bị của mình.</p><div className="ccl-share-actions"><button type="button" className="cck-outline" onClick={copy}><Copy size={19}/>Sao chép liên kết</button><a className="cck-outline" href={url} target="_blank" rel="noopener noreferrer">Mở trang mang theo<ExternalLink size={19}/></a></div><p className="ccl-share-url">{url}</p>
    </>:<div className="ccl-qr-unavailable" role="status"><QrCode size={54}/><h3>Đường dẫn mang theo chưa sẵn sàng</h3><p>Màn hình này chưa có địa chỉ công khai để mở trên điện thoại. Bạn vẫn có thể tiếp tục xem đầy đủ câu chuyện tại đây.</p><p>{story.takeaway}</p></div>}</div>
  </div>;
}
