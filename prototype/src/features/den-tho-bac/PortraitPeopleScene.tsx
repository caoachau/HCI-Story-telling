import { ArrowRight } from 'lucide-react';
import demo from '../../assets/den-tho-bac/portrait-user/portrait-demo.webp';
import archive from '../../assets/den-tho-bac/portrait-user/ho-chi-minh-portrait-updated.webp';
import { storyById } from './content';
import { Picture } from './MemorialMedia';

const ARTIST={src:demo,alt:'Họa sĩ Phong Ba cầm bức chân dung Bác Hồ, theo ảnh trong mẫu giao diện được cung cấp.'};
const ARCHIVE={src:archive,alt:'Ảnh tư liệu đen trắng được cung cấp: chân dung Bác Hồ trên bàn thờ, hai bên có hoa và rèm phía trên.'};

export function PortraitArchive(){
  return <figure className="db-portrait-archive"><Picture photo={ARCHIVE} width={1315} height={1196} eager/><figcaption>Chân dung Bác Hồ · Ảnh tư liệu được cung cấp</figcaption></figure>;
}

export function PortraitPeopleScene({onOpen}:{onOpen:(id:string)=>void}){
  const story=storyById('portrait');
  return <>
      <figure className="db-portrait-photo">
        <div className="db-portrait-photo-stage" tabIndex={0} aria-label="Ảnh họa sĩ; có thể cuộn dọc để xem trọn ảnh"><div className="db-portrait-artwork"><Picture photo={ARTIST} width={1672} height={941} eager/><span className="db-people-photo-label db-portrait-photo-label">HỌA SĨ</span></div></div>
        <figcaption>Họa sĩ Phong Ba · Ảnh: Lê Dung <span>(theo mẫu cung cấp)</span></figcaption>
      </figure>
      <article className="db-portrait-story">
        <p className="db-portrait-kicker">Câu chuyện từ tư liệu báo chí</p>
        <div className="db-person-copy db-portrait-copy">
          <h2>Họa sĩ Phong Ba<span>.</span></h2>
          <p className="db-portrait-role">Liêu Tử Phong · Người vẽ chân dung Bác</p>
          <p className="db-portrait-lead">{story.lead}</p>
          <div className="db-portrait-action"><button type="button" className="db-button db-portrait-read" onClick={()=>onOpen(story.id)}>Mở câu chuyện<ArrowRight/></button></div>
        </div>
        <p className="db-portrait-credit">Tư liệu ảnh: Báo Đắk Nông</p>
      </article>
  </>;
}
