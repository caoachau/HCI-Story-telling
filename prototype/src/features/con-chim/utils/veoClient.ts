export async function generateVeo({prompt,image,aspectRatio,signal,onStatus}:{prompt:string;image?:string;aspectRatio:string;signal:AbortSignal;onStatus:(text:string)=>void}):Promise<string>{
  const base=(import.meta.env.VITE_CON_CHIM_VEO_API_BASE||'').replace(/\/$/,'');
  const read=async(response:Response)=>{
    if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Studio chưa kết nối dịch vụ tạo video. Vui lòng thử lại sau.');
    const data=await response.json();if(!response.ok||data.error)throw new Error(data.error||'Chưa tạo được video. Vui lòng thử lại.');return data;
  };
  const payload:{prompt:string;aspectRatio:string;imageBase64?:string;mimeType?:string}={prompt,aspectRatio};
  if(image){
    let data=image;
    if(!data.startsWith('data:')){
      const response=await fetch(data,{signal});if(!response.ok)throw new Error('Chưa tải được ảnh đã chọn.');
      const blob=await response.blob();
      data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as string);reader.onerror=()=>reject(new Error('Chưa đọc được ảnh.'));reader.readAsDataURL(blob);});
    }
    payload.imageBase64=data;payload.mimeType=data.match(/^data:([^;]+);/)?.[1]||'image/jpeg';
  }
  onStatus('Đang gửi ý tưởng của bạn…');
  const data=await read(await fetch(base+'/api/veo/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal}));
  if(data.videoUri)return data.videoUri;
  if(!data.operationName)throw new Error('Dịch vụ chưa trả về video. Vui lòng thử lại.');
  onStatus('Đang tạo chuyển động, bạn chờ một chút nhé…');
  for(let i=0;i<60;i++){
    await new Promise<void>((resolve,reject)=>{
      const abort=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'));};
      const timer=window.setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},3000);
      signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
    });
    const result=await read(await fetch(base+'/api/veo/status?operationName='+encodeURIComponent(data.operationName),{signal}));
    if(result.done){if(!result.videoUri)throw new Error('Dịch vụ chưa trả về tệp video.');return result.videoUri;}
  }
  throw new Error('Video chưa hoàn tất trong thời gian chờ. Bạn có thể thử lại.');
}
