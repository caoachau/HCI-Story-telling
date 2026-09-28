import React from 'react';
import { X, BookOpen, Compass, Shield, Award, Users } from 'lucide-react';

interface AboutProjectModalProps {
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-[#11141c] border border-amber-900/40 rounded-2xl shadow-2xl p-8 text-stone-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-xs uppercase tracking-widest text-amber-500 font-mono mb-2">
          {lang === 'vi' ? 'Đề án Trưng bày & Diễn giải Số' : 'Digital Exhibition & Interpretation Project'}
        </div>
        <h2 className="text-2xl lg:text-3xl font-serif font-bold text-amber-100">
          {lang === 'vi'
            ? 'Thiết kế trải nghiệm kể chuyện số nhằm hỗ trợ diễn giải di sản trong du lịch cộng đồng'
            : 'Designing digital storytelling experiences for heritage interpretation in community tourism'}
        </h2>

        {/* Introduction */}
        <p className="text-xs text-stone-300 mt-4 leading-relaxed font-sans">
          {lang === 'vi'
            ? <>Hệ thống được thiết kế dành riêng cho các <strong>màn hình tương tác kích thước lớn</strong> tại trung tâm thông tin du khách, bảo tàng di sản và nhà văn hóa cộng đồng. Ứng dụng kết hợp không gian <strong>Trái Đất 3D tương tác</strong> với nghệ thuật kể chuyện số, giúp du khách khám phá sâu hơn các giá trị văn hóa bản địa.</>
            : <>This system is designed for <strong>large interactive kiosk displays</strong> in visitor centers, heritage museums, and community cultural centers. It combines an <strong>interactive 3D Earth</strong> with digital storytelling to help visitors explore local cultural heritage in depth.</>}
        </p>

        {/* 4 Pillars of the Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="bg-[#171b26] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-serif font-bold">
              <Compass className="w-4 h-4" />
              <span>{lang === 'vi' ? '1. Không gian 3D & cột mốc địa lý' : '1. 3D space & geographic landmarks'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === 'vi' ? 'Mô phỏng hành trình bay từ toàn cảnh đến địa hình và kiến trúc truyền thống.' : 'Cinematic flights move from a regional overview to terrain and traditional architecture.'}
            </p>
          </div>

          <div className="bg-[#171b26] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-serif font-bold">
              <Users className="w-4 h-4" />
              <span>{lang === 'vi' ? '2. Ký ức nghệ nhân & giọng nói bản địa' : '2. Artisan memories & local voices'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === 'vi' ? 'Tôn vinh những người gìn giữ di sản qua ký ức, thuyết minh và âm thanh địa phương.' : 'Honor heritage keepers through personal memories, narration, and local soundscapes.'}
            </p>
          </div>

          <div className="bg-[#171b26] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-serif font-bold">
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'vi' ? '3. Hiện vật số 3D & tư liệu di sản' : '3. 3D artifacts & heritage records'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === 'vi' ? 'Mô hình 3D tương tác giúp du khách quan sát hiện vật và đọc hồ sơ lưu trữ.' : 'Interactive 3D models let visitors examine artifacts and explore their museum records.'}
            </p>
          </div>

          <div className="bg-[#171b26] border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-serif font-bold">
              <Shield className="w-4 h-4" />
              <span>{lang === 'vi' ? '4. Du lịch có trách nhiệm & đạo đức văn hóa' : '4. Responsible tourism & cultural respect'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {lang === 'vi' ? 'Tích hợp quy tắc ứng xử văn hóa và thông tin về tác động sinh kế địa phương.' : 'Share cultural guidelines and information about local livelihood impacts.'}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/25 bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-100/90">
          {lang === 'vi'
            ? 'Nội dung địa điểm, hồ sơ hiện vật, trích dẫn và số liệu cộng đồng được nhập như tư liệu dự án. Hãy đối chiếu với cộng đồng và nguồn địa phương trước khi xem là thông tin đã kiểm chứng hoặc phát hành chính thức.'
            : 'Site descriptions, artifact records, quotations, and community figures are project materials. Verify them with local communities and sources before treating them as confirmed or publishing them officially.'}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span>{lang === 'vi' ? 'Khung giải pháp bảo tàng số · Bản quyền cộng đồng' : 'Digital museum framework · Community ownership'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-sans font-medium transition-colors"
          >
            {lang === 'vi' ? 'Đã hiểu & Bắt đầu trải nghiệm' : 'Got it · Start exploring'}
          </button>
        </div>
      </div>
    </div>
  );
};
