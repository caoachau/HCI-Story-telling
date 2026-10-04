import {TOURS} from '../data/conChimData';
export interface SavedPlan { tour:string;duration:string;date:string;guests:number; }
export const PLAN_KEY='con-chim-itinerary';
export const todayInVietnam=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function loadPlan():SavedPlan|null {
  try { const value=JSON.parse(localStorage.getItem(PLAN_KEY)||'null');
    return value&&TOURS.some(tour=>tour.id===value.tour)&&['half','day'].includes(value.duration)&&typeof value.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&Number.isInteger(value.guests)&&value.guests>0&&value.guests<=20?value:null;
  }catch{return null;}
}
export function planText(plan:SavedPlan){
  const tour=TOURS.find(item=>item.id===plan.tour)!;
  const stops=plan.duration==='half'?tour.stops.slice(0,3):tour.stops;
  return ['CỒN CHIM · LỊCH TRÌNH CỦA BẠN',tour.title,'Ngày dự kiến: '+plan.date,'Số khách: '+plan.guests,'',...stops.map(stop=>stop.time+' · '+stop.title+'\n'+stop.body),'','Lịch trình gợi ý. Hãy hẹn với người đón khách về bến, giờ đón, hoạt động và thực đơn trước khi đi.','Mang bình nước riêng và giữ đường làng sạch.'].join('\n');
}
export function downloadPlan(plan:SavedPlan,contact?:{fullName:string;phone:string;email:string}){
  const contactLines=contact?[contact.fullName.trim(),contact.phone.trim(),contact.email.trim()].filter(Boolean):[];
  const text=planText(plan)+(contactLines.length?'\n\nTHÔNG TIN MANG THEO\n'+contactLines.join('\n'):'');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='con-chim-'+plan.date+'.txt';document.body.appendChild(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
