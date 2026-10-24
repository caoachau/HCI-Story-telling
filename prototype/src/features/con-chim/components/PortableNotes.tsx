import React, { useState } from 'react';
import type { DiscoveryStory } from '../data/kt01Stories';
import { STORY_LAYERS } from '../data/storyLayers';

export function PortableNotes({story}:{story:DiscoveryStory}) {
  const key=`con-chim-note:${story.id}`;
  const [note,setNote]=useState(()=>{try{return (localStorage.getItem(key)||'').slice(0,500);}catch{return '';}});
  const [message,setMessage]=useState('');
  const save=()=>{try{if(note.trim())localStorage.setItem(key,note);else localStorage.removeItem(key);setMessage('Đã lưu trên thiết bị đang dùng. Nội dung không được gửi đi.');}catch{setMessage('Thiết bị chưa lưu được ghi chú. Bạn có thể tự sao chép nội dung.');}};
  const remove=()=>{try{localStorage.removeItem(key);setNote('');setMessage('Đã xóa ghi chú trên thiết bị này.');}catch{setMessage('Chưa xóa được ghi chú. Vui lòng thử lại.');}};
  return <details className="ccl-notes"><summary>Ghi lại điều bạn muốn nhớ <span>(tùy chọn)</span></summary><label htmlFor="ccl-personal-note">{STORY_LAYERS[story.id].reflection}</label><textarea id="ccl-personal-note" maxLength={500} rows={4} value={note} onChange={event=>setNote(event.target.value)}/><p>{note.length}/500 ký tự. Chỉ lưu khi bạn chọn, trên thiết bị đang dùng.</p><div><button type="button" className="cck-outline" onClick={save}>Lưu trên thiết bị này</button><button type="button" className="cck-outline" onClick={remove}>Xóa ghi chú</button></div><p role="status">{message}</p></details>;
}
