import React from 'react';
import {ArrowUpRight,MapPin} from 'lucide-react';
import {mapLink,sources} from '../data/conChimData';
import {MotionWords} from './MotionWords';
export function Footer(){
  return <footer id="farewell" className="cc-footer" aria-labelledby="cc-farewell-title"><div className="cc-container" data-screen-reader>
    <div className="cc-footer-main"><div className="cc-footer-message">
      <p className="cc-footer-eyebrow">Một chuyến đi khép lại. Một cuộc hẹn mở ra.</p>
      <h2 id="cc-farewell-title"><MotionWords>Hẹn gặp trên cồn.</MotionWords></h2>
      <p>Đi chậm. Gặp người. Mang về một câu chuyện.</p>
      <a href={mapLink} className="cc-button cc-footer-cta" target="_blank" rel="noreferrer"><MapPin size={18}/> Tìm đường đến Cồn Chim <ArrowUpRight size={19}/></a>
    </div>
      <div className="cc-footer-links"><h3>Hẹn một ngày gần nhất</h3><a href="#experiences">Chọn trải nghiệm <ArrowUpRight size={18}/></a><a href="#gallery">Những khoảnh khắc trên cồn <ArrowUpRight size={18}/></a><p>Mang bình nước riêng, giữ đường làng sạch và xin phép trước khi chụp ảnh người dân.</p></div>
    </div><div className="cc-footer-bottom"><span>Ký Ức Bản Địa · Cồn Chim</span><div><a href={sources.opening} target="_blank" rel="noreferrer">Câu chuyện ra mắt</a><a href={sources.award} target="_blank" rel="noreferrer">Du lịch cộng đồng ASEAN 2025</a></div></div>
  </div></footer>;
}
