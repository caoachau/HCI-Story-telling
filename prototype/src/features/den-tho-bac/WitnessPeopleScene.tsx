import { ArrowRight } from 'lucide-react';
import reference from '../../assets/den-tho-bac/people-user/witness-layout-v2.webp';
import { storyById } from './content';
import { Picture } from './MemorialMedia';

const PHOTO={src:reference,alt:'Ba người trò chuyện trước nhà trưng bày dưới những tán cây; người đàn ông lớn tuổi ở giữa đưa tay chỉ về phía trước. Ảnh minh họa theo mẫu giuden.png được cung cấp.'};

export function WitnessPeopleIntro({onOpen}:{onOpen:(id:string)=>void}){
  const story=storyById('witness');
  return <article className="db-person-copy db-witness-copy" aria-labelledby="db-witness-name">
      <p className="db-witness-kicker">Câu chuyện từ tư liệu báo chí</p>
      <h2 id="db-witness-name">Phan Văn Tiềm<span aria-hidden="true">.</span></h2>
      <p className="db-witness-role">Nhân chứng Mười Tiềm · Tư liệu năm 2023</p>
      <p className="db-witness-lead">{story.lead}</p>
      <button type="button" className="db-button db-witness-read" onClick={()=>onOpen(story.id)}>Mở câu chuyện<ArrowRight/></button>
      <p className="db-witness-question">{story.question}</p>
  </article>;
}

export function WitnessPeopleScene(){
  return <div className="db-witness-feature">
    <figure className="db-witness-photo">
      <div className="db-witness-photo-stage" tabIndex={0} aria-label="Ảnh người giữ đền; có thể cuộn dọc để xem trọn ảnh"><div className="db-witness-artwork"><Picture photo={PHOTO} width={1672} height={941} eager/><span className="db-people-photo-label db-witness-photo-label">NHÂN CHỨNG</span></div></div>
      <figcaption className="db-witness-caption"><span>Ông Mười Tiềm (đứng giữa) kể chuyện về ngôi đền · Tư liệu năm 2023</span><span>Ảnh minh họa theo mẫu được cung cấp</span></figcaption>
    </figure>
  </div>;
}
