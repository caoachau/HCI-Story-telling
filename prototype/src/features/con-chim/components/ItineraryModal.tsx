import React,{useEffect,useRef,useState} from 'react';
import {ArrowRight,CalendarDays,Users,Check,Download,Clock,Leaf,RefreshCw} from 'lucide-react';
import {TOURS} from '../data/conChimData';
import {Modal} from './Modal';
import {loadPlan,PLAN_KEY,SavedPlan,todayInVietnam,downloadPlan} from '../utils/itinerary';
export function ItineraryModal({isOpen,initialTour='village',onClose}:{isOpen:boolean;initialTour?:string;onClose:()=>void}){
  const [tour,setTour]=useState('village'),[duration,setDuration]=useState('day'),[date,setDate]=useState(todayInVietnam),[guests,setGuests]=useState(2),[fullName,setFullName]=useState(''),[phone,setPhone]=useState(''),[email,setEmail]=useState(''),[result,setResult]=useState<SavedPlan|null>(null),[status,setStatus]=useState('');
  const resultHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(result)resultHeading.current?.focus({preventScroll:true});},[result]);
  useEffect(()=>{if(!isOpen)return;const saved=loadPlan();setTour(TOURS.some(item=>item.id===initialTour)?initialTour:saved?.tour||'village');setDuration(saved?.duration||'day');setDate(saved?.date&&saved.date>=todayInVietnam()?saved.date:todayInVietnam());setGuests(saved?.guests||2);setResult(null);setStatus('');},[isOpen,initialTour]);
  if(!isOpen)return null;
  const current=TOURS.find(item=>item.id===tour)!;
  const create=(event:React.FormEvent)=>{event.preventDefault();const plan={tour,duration,date,guests};try{localStorage.setItem(PLAN_KEY,JSON.stringify(plan));setStatus('Đã lưu lịch trình trên thiết bị này.');}catch{setStatus('Lịch trình sẵn sàng để tải về. Thiết bị chưa lưu được cho lần sau.');}setResult(plan);};
  return <Modal title="Lên lịch trải nghiệm Cồn Chim" onClose={onClose} wide className="cc-plan-modal">
    <div className="cc-plan-intro"><Leaf size={24} strokeWidth={1.2}/><h3>{result?'Một cuộc hẹn với Cồn Chim.':'Một ngày của riêng bạn.'}</h3><p>{result?'Chuyến đi đã thành hình. Bạn có thể tải về và mang theo.':'Chọn điều bạn muốn trải nghiệm, mình cùng xếp thành một hành trình.'}</p></div>
    {!result?<form className="cc-plan-form" onSubmit={create}>
      <fieldset><legend>Chọn cách khám phá</legend><div className="cc-tour-options">{TOURS.map(item=><button type="button" key={item.id} aria-pressed={tour===item.id} className={tour===item.id?'is-active':''} onClick={()=>setTour(item.id)}><img src={item.image} alt="" style={{objectPosition:item.id==='cuisine'?'75% center':'center'}}/><span>{item.title}</span>{tour===item.id&&<Check size={17}/>}</button>)}</div></fieldset>
      <div className="cc-plan-fields"><label><span><Clock size={16}/> Thời lượng</span><select value={duration} onChange={event=>setDuration(event.target.value)}><option value="half">Nửa ngày</option><option value="day">Một ngày</option></select></label><label><span><CalendarDays size={16}/> Ngày dự kiến</span><input type="date" required min={todayInVietnam()} value={date} onChange={event=>setDate(event.target.value)}/></label><label><span><Users size={16}/> Số lượng khách</span><select value={guests} onChange={event=>setGuests(Number(event.target.value))}>{[1,2,3,4,5,6,8,10,15,20].map(value=><option key={value} value={value}>{value} người</option>)}</select></label></div>
      <div className="cc-plan-preview"><h4>Trong chuyến đi này</h4><div>{(duration==='half'?current.stops.slice(0,3):current.stops).map(stop=><span key={stop.time}><Check size={15}/>{stop.title}</span>)}</div></div>
      <details className="cc-plan-contact"><summary>Thông tin liên hệ mang theo <span>(tùy chọn)</span></summary><div className="cc-plan-fields"><label><span>Họ và tên</span><input type="text" autoComplete="name" placeholder="Họ và tên" value={fullName} onChange={event=>setFullName(event.target.value)}/></label><label><span>Số điện thoại / Zalo</span><input type="tel" autoComplete="tel" placeholder="Số điện thoại / Zalo" value={phone} onChange={event=>setPhone(event.target.value)}/></label><label><span>Email</span><input type="email" autoComplete="email" placeholder="Email" value={email} onChange={event=>setEmail(event.target.value)}/></label></div></details>
      <div className="cc-plan-actions"><p>Giờ và hoạt động là gợi ý.<br/>Hẹn trước với người đón khách khi lên đường.</p><button className="cc-button" type="submit">Tạo lịch trình của tôi <ArrowRight size={18}/></button></div>
    </form>:<div className="cc-plan-result">
      <div className="cc-plan-result-meta"><span><CalendarDays size={17}/>{new Intl.DateTimeFormat('vi-VN').format(new Date(result.date+'T12:00:00+07:00'))}</span><span><Users size={17}/>{result.guests} người</span><span><Clock size={17}/>{result.duration==='half'?'Nửa ngày':'Một ngày'}</span></div>
      <h4 ref={resultHeading} tabIndex={-1}>{TOURS.find(item=>item.id===result.tour)?.title}</h4>
      <ol className="cc-plan-stops">{(result.duration==='half'?current.stops.slice(0,3):current.stops).map(stop=><li key={stop.time}><time>{stop.time}</time><div><strong>{stop.title}</strong><p>{stop.body}</p></div></li>)}</ol>
      <p className="cc-plan-saved" role="status"><Check size={17}/>{status}</p>
      <div className="cc-plan-actions"><button type="button" className="cc-text-button" onClick={()=>setResult(null)}><RefreshCw size={16}/>Chỉnh lại lịch trình</button><button type="button" className="cc-button" onClick={()=>downloadPlan(result,{fullName,phone,email})}><Download size={18}/>Tải lịch trình</button></div>
      <small>Lịch trình gợi ý, chưa phải đặt chỗ. Thông tin liên hệ chỉ có trong tệp bạn tải về, không được gửi đi hoặc tự động lưu.</small>
    </div>}
  </Modal>;
}
