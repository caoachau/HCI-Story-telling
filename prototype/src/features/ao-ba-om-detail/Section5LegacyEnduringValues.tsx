import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight,
  History,
  CheckCircle2,
  TreeDeciduous,
  QrCode,
  Heart,
  ChevronRight,
  Share2,
  HelpCircle,
  Trophy,
  RotateCcw,
  X,
} from 'lucide-react';
import { HERITAGE_LEGACY, AO_BA_OM_OVERVIEW } from './aoBaOm5PartsData';
import type { AoLanguage } from './types';
import { BeforeAfterSlider } from '../../components/BeforeAfterSlider';
import aerialImg from '../../../assets/ao-ba-om-aerial.webp';
import rootsImg from '../../assets/ao-ba-om/roots.webp';
import pagodaImg from '../../assets/ao-ba-om/ang-pagoda.webp';
import festivalImg from '../../assets/ao-ba-om/festival-2024.webp';

interface QuizQuestion {
  id: string;
  questionVi: string;
  questionEn: string;
  optionsVi: string[];
  optionsEn: string[];
  correctIdx: number;
  explanationVi: string;
  explanationEn: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionVi: 'Theo truyền thuyết dân gian, bà Om đã dùng mưu trí gì để giúp phái nữ chiến thắng cuộc thi đào ao?',
    questionEn: 'According to folk legend, what clever trick did Madam Om use to help the women win the pond-digging contest?',
    optionsVi: [
      'Treo đèn lồng lên ngọn cây sao làm phái nam tưởng sao Mai đã mọc',
      'Mời các chàng trai uống rượu say mềm',
      'Huy động người từ các phum sóc lân cận đào xuyên đêm',
      'Nhờ thần linh hóa phép đào xong trước nửa đêm',
    ],
    optionsEn: [
      'Hoisted a wind lantern high on the tallest tree so men mistook it for the Morning Star',
      'Invited the men to drink rice wine until they fell asleep',
      'Mobilized laborers from neighboring villages to dig through the night',
      'Prayed for divine spirits to complete the pond overnight',
    ],
    correctIdx: 0,
    explanationVi: 'Bà Om khéo léo treo đèn lồng gió lên ngọn cây dầu cao nhất. Phái nam ngỡ sao Mai đã mọc tưởng trời sắp sáng nên nghỉ đào, còn phái nữ kiên trì đào đến rạng đông.',
    explanationEn: 'Madam Om hoisted a wind lantern high on the tallest tree. The men thought the Morning Star had risen and went to rest, while the women persevered until dawn.',
  },
  {
    id: 'q2',
    questionVi: 'Quần thể thực vật độc đáo nhất bao quanh hồ nước Ao Bà Om có đặc điểm gì nổi bật?',
    questionEn: 'What is the most unique botanical feature surrounding the Ao Ba Om pond?',
    optionsVi: [
      'Gần 500 cây sao dầu cổ thụ với mạng lưới rễ trồi cao 1-2m tạo hình vòm hang kỳ thú',
      'Rừng đước ngập mặn trải dài hàng chục hecta',
      'Vườn dừa sáp sáp ngút ngàn của miệt vườn Cầu Kè',
      'Rừng thông cổ thụ xanh ngát quanh năm',
    ],
    optionsEn: [
      'Nearly 500 giant dipterocarp trees with 1-2m exposed root arches and sculptural hollows',
      'Mangrove forests stretching across dozens of coastal hectares',
      'Sprawling orchards of rare wax coconuts from Cau Ke',
      'Evergreen pine groves flourishing year-round',
    ],
    correctIdx: 0,
    explanationVi: 'Vành đai gần 500 cây sao đen và dầu rái từ 100 đến hơn 300 năm tuổi trên giồng cát cổ có bộ rễ trồi cuộn trào kỳ vĩ là tuyệt tác tự nhiên hiếm có.',
    explanationEn: 'Nearly 500 giant 100-300+ year-old trees on ancient sand dunes display massive exposed root arches resembling nature’s living sculptures.',
  },
  {
    id: 'q3',
    questionVi: 'Lễ hội truyền thống lớn nhất của đồng bào Khmer diễn ra vào rằm tháng 10 âm lịch tại Ao Bà Om là gì?',
    questionEn: 'What is the largest traditional Khmer festival celebrated at Ao Ba Om on the 10th lunar month full moon?',
    optionsVi: [
      'Đại lễ Ok Om Bok (Lễ Cúng Trăng & Đua Ghe Ngo) - Di sản phi vật thể Quốc gia',
      'Tết Chol Chnam Thmay mừng năm mới',
      'Lễ Sen Dolta cúng ông bà tổ tiên',
      'Lễ hội Nghinh Ông Cần Giờ',
    ],
    optionsEn: [
      'Ok Om Bok Festival (Moon Worship & Sacred Canoe Racing) - National Intangible Heritage',
      'Chol Chnam Thmay Traditional New Year',
      'Sen Dolta Ancestor Remembrance Festival',
      'Whale Worshipping Festival',
    ],
    correctIdx: 0,
    explanationVi: 'Lễ hội Ok Om Bok là đại lễ cúng Thần Mặt Trăng, tạ ơn mùa màng, đút cốm dẹp, thả đèn nước hoa đăng lung linh và đua ghe Ngo tưng bừng.',
    explanationEn: 'Ok Om Bok is the sacred moon thanksgiving ritual featuring Com Dep feedings, illuminated water lanterns on the pond, and thunderous Ngo canoe regattas.',
  },
  {
    id: 'q4',
    questionVi: 'Ngôi chùa cổ kính hơn 1.000 năm tuổi nằm ngay sát góc bờ Ao Bà Om có tên là gì?',
    questionEn: 'What is the name of the millennium-old ancient temple situated right beside Ao Ba Om?',
    optionsVi: [
      'Chùa Âng (Wat Nokor Bach Chey)',
      'Chùa Hang (Wat Kompong Chrây)',
      'Chùa Cò (Wat Nodol)',
      'Chùa Vàm Ray',
    ],
    optionsEn: [
      'Ang Pagoda (Wat Nokor Bach Chey)',
      'Hang Pagoda (Wat Kompong Chray)',
      'Co Pagoda (Wat Nodol)',
      'Vam Ray Pagoda',
    ],
    correctIdx: 0,
    explanationVi: 'Chùa Âng (Wat Nokor Bach Chey) xây dựng từ thế kỷ X, là một trong những ngôi chùa cổ kính và tiêu biểu nhất cho kiến trúc Angkor tại Nam Bộ.',
    explanationEn: 'Ang Pagoda (Wat Nokor Bach Chey), built in the 10th century, is one of the oldest and most exemplary monuments of Angkor architecture in Southern Vietnam.',
  },
];

interface Section5LegacyEnduringValuesProps {
  lang: AoLanguage;
  onOpenQRCode?: () => void;
  onReturnToMap?: () => void;
}

export const Section5LegacyEnduringValues: React.FC<Section5LegacyEnduringValuesProps> = ({
  lang,
  onOpenQRCode,
  onReturnToMap,
}) => {
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizCurrentIdx, setQuizCurrentIdx] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const chapters = [
    {
      id: 'pillar-today',
      num: '01',
      title: lang === 'vi' ? 'Dấu ấn còn lại hôm nay' : 'Living Imprints Today',
      subtitle: lang === 'vi' ? 'Nơi này còn để lại điều gì?' : 'What remains today?',
      data: HERITAGE_LEGACY.todayPresence,
      image: AO_BA_OM_OVERVIEW.heroImage,
    },
    {
      id: 'pillar-history',
      num: '02',
      title: lang === 'vi' ? 'Giá trị lịch sử & nhân văn' : 'Historical Values',
      subtitle: lang === 'vi' ? 'Chứng nhân ngàn năm mở cõi' : 'Witness to millennia of history',
      data: HERITAGE_LEGACY.historicalValue,
      image: aerialImg,
    },
    {
      id: 'pillar-architecture',
      num: '03',
      title: lang === 'vi' ? 'Giá trị kiến trúc & tự nhiên' : 'Architectural & Natural Wonders',
      subtitle: lang === 'vi' ? 'Kiệt tác rễ trồi & Baray thiêng' : 'Root sculptures & sacred Baray',
      data: HERITAGE_LEGACY.architecturalArtisticValue,
      image: rootsImg,
    },
    {
      id: 'pillar-culture',
      num: '04',
      title: lang === 'vi' ? 'Giá trị văn hóa & tâm linh' : 'Cultural & Spiritual Identity',
      subtitle: lang === 'vi' ? 'Linh hồn lễ hội Ok Om Bok' : 'The soul of Ok Om Bok festival',
      data: HERITAGE_LEGACY.culturalSpiritualValue,
      image: festivalImg,
    },
    {
      id: 'pillar-conservation',
      num: '05',
      title: lang === 'vi' ? 'Bảo tồn & Tiếp nối tương lai' : 'Conservation & Future Continuance',
      subtitle: lang === 'vi' ? 'Thách thức & Sức sống thế hệ trẻ' : 'Challenges & Youth Stewardship',
      data: {
        title: HERITAGE_LEGACY.conservationAndContinuity.title,
        content: HERITAGE_LEGACY.conservationAndContinuity.content,
        bullets: HERITAGE_LEGACY.conservationAndContinuity.achievements,
      },
      image: pagodaImg,
    },
  ];

  const currentChapter = chapters[activeChapterIdx];

  return (
    <section id="section-5-legacy" className="kiosk-section relative min-h-screen bg-[#07090e] text-[#f4efe6] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 flex flex-col justify-between select-none overflow-hidden">
      {/* Ambient Neon Mists */}
      <div className="kiosk-neon-mist top-1/4 -right-32 bg-amber-500/12 pointer-events-none" />
      <div className="kiosk-neon-mist -bottom-32 -left-32 bg-orange-600/8 pointer-events-none" />
      
      {/* Background Architectural Landmark Hero with Sunset Flare (Matching Slice 5 Azadi Tower layout) */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentChapter.image}
          alt={currentChapter.title}
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.15] transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e]/80" />
      </div>

      {/* Top Header: Section Identity */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
              {lang === 'vi' ? 'PHẦN 05 · DẤU ẤN & GIÁ TRỊ DI SẢN' : 'PART 05 · ENDURING HERITAGE LEGACY & VALUES'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-50">
            {lang === 'vi' ? 'Ngày Nay Nơi Này Còn Để Lại Điều Gì Cho Chúng Ta?' : 'What Enduring Legacy Remains for Us Today?'}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setQuizCurrentIdx(0);
              setQuizSelectedOption(null);
              setQuizIsAnswered(false);
              setQuizScore(0);
              setQuizCompleted(false);
              setIsQuizOpen(true);
            }}
            className="kiosk-magnetic-btn kiosk-magnetic-btn--ghost !py-2.5 !px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:border-amber-400"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{lang === 'vi' ? 'Thử tài hiểu biết' : 'Heritage Quiz'}</span>
          </button>

          <button
            onClick={onOpenQRCode}
            className="kiosk-magnetic-btn kiosk-magnetic-btn--ghost !py-2.5 !px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>{lang === 'vi' ? 'Lưu di sản về điện thoại' : 'Save to Mobile'}</span>
          </button>
          {onReturnToMap && (
            <button
              onClick={onReturnToMap}
              className="kiosk-magnetic-btn kiosk-magnetic-btn--primary !py-2.5 !px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xl shadow-amber-500/15"
            >
              <Compass className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Trở về Bản đồ' : 'Return to Map'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Monument Storytelling Layout (Matching Slice 5 Azadi Tower) */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
        
        {/* Left Column (Lg: Col 7): Landmark Big Number & Story Narrative */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Monument Number & Title */}
          <div className="space-y-2">
            <span className="text-5xl sm:text-6xl md:text-7xl font-mono font-extrabold text-amber-400/30 block tracking-tighter">
              {currentChapter.num}
            </span>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
              {currentChapter.subtitle}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-50 leading-tight">
              {currentChapter.title}
            </h1>
          </div>

          {/* Lead Chapter Narrative */}
          <p className="font-serif text-base sm:text-lg text-stone-200/95 leading-relaxed max-w-2xl drop-shadow text-justify sm:text-left">
            {lang === 'vi' ? currentChapter.data.content.vi : currentChapter.data.content.en}
          </p>

          {/* Core Bullets Points */}
          <div className="space-y-2.5 pt-2 max-w-2xl">
            {currentChapter.data.bullets.map((bullet, bIdx) => (
              <div
                key={bIdx}
                className="flex items-start gap-3 p-3 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-amber-400/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs sm:text-sm font-serif text-stone-200 leading-relaxed">
                  {lang === 'vi' ? bullet.vi : bullet.en}
                </span>
              </div>
            ))}
          </div>

          {/* Conservation Highlights & Policy Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-mono">
              <TreeDeciduous className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'vi' ? 'Vành đai xanh không rác thải nhựa' : 'Zero-Single-Use-Plastic Eco Zone'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{lang === 'vi' ? '100% Cổ thụ được số hóa theo dõi' : '100% Trees Digitally Monitored'}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Lg: Col 5): Inscribed Golden Heritage Message & Before/After Peek (Matching Slice 5 right slider) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* THE TIMELESS MESSAGE CARD (Thông điệp vàng cho thế hệ hôm nay) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1810]/95 via-[#14120e]/95 to-[#0b0a08]/95 border-2 border-amber-500/40 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden">
            {/* Gilded Corner Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>{lang === 'vi' ? 'THÔNG ĐIỆP CHO THẾ HỆ HÔM NAY' : 'MESSAGE FOR TODAY\'S GENERATION'}</span>
            </div>

            <p className="font-serif text-sm sm:text-base text-amber-100 leading-relaxed italic border-l-2 border-amber-400 pl-4 py-1">
              "{lang === 'vi' ? HERITAGE_LEGACY.timelessMessage.quote.vi : HERITAGE_LEGACY.timelessMessage.quote.en}"
            </p>

            <div className="pt-2 border-t border-amber-500/20 space-y-0.5">
              <div className="text-xs font-mono font-semibold text-amber-300">
                {lang === 'vi' ? HERITAGE_LEGACY.timelessMessage.author.vi : HERITAGE_LEGACY.timelessMessage.author.en}
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                {lang === 'vi' ? HERITAGE_LEGACY.timelessMessage.subtext.vi : HERITAGE_LEGACY.timelessMessage.subtext.en}
              </div>
            </div>
          </div>

          {/* Quick Before-After Split Peek (Right side peek slider matching Slice 5) */}
          <div className="bg-[#121620]/90 border border-white/10 rounded-3xl p-4 shadow-xl">
            <BeforeAfterSlider
              lang={lang}
              pastImage={aerialImg}
              pastLabel={lang === 'vi' ? 'Tư liệu xưa (Thế kỷ XX)' : 'Archive View (20th Cent)'}
              pastYear="1920"
              pastDescription={
                lang === 'vi'
                  ? 'Khu vực đụn cát hoang sơ bao bọc quanh hồ tự nhiên, nơi các vị thiền sư tĩnh tu.'
                  : 'Untouched ancient dunes and water mirror where monks practiced meditation.'
              }
              presentImage={AO_BA_OM_OVERVIEW.heroImage}
              presentLabel={lang === 'vi' ? 'Di tích hiện nay' : 'Today Heritage'}
              presentDescription={
                lang === 'vi'
                  ? 'Quần thể thắng cảnh xanh sạch đẹp, trung tâm văn hóa hội tụ hàng vạn du khách.'
                  : 'Pristine green heritage park welcoming tens of thousands during festivals.'
              }
            />
          </div>
        </div>
      </div>

      {/* Bottom Landmark Navigation Bar (Thumbnails strip matching Slice 5 at bottom) */}
      <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Thumbnail Selector Strip */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {chapters.map((ch, idx) => {
            const isSelected = activeChapterIdx === idx;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapterIdx(idx)}
                className={`flex-shrink-0 flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-black/50 border-white/10 text-stone-400 hover:bg-black/80 hover:text-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                  <img src={ch.image} alt={ch.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-mono text-amber-400">{ch.num}</span>
                  <span className="block text-xs font-serif font-bold text-amber-100 whitespace-nowrap">{ch.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Exploration Conclusion Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono text-stone-400 flex-shrink-0">
          <span>{activeChapterIdx + 1} / {chapters.length} {lang === 'vi' ? 'Lát cắt di sản' : 'Heritage Facets'}</span>
          <span className="text-stone-600">|</span>
          <span className="text-amber-300 font-semibold">{lang === 'vi' ? 'Hoàn thành chuyến tham quan số' : 'Digital Tour Completed'}</span>
        </div>
      </div>

      {/* ═══ INTERACTIVE HERITAGE QUIZ MODAL ═══ */}
      {isQuizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-[#121622] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-amber-100">
                    {lang === 'vi' ? 'Thử Tài Hiểu Biết · Di Tích Ao Bà Om' : 'Ao Ba Om Heritage Quiz'}
                  </h3>
                  <span className="text-xs font-mono text-amber-400/80">
                    {!quizCompleted
                      ? (lang === 'vi' ? `Câu ${quizCurrentIdx + 1} / ${QUIZ_QUESTIONS.length}` : `Question ${quizCurrentIdx + 1} of ${QUIZ_QUESTIONS.length}`)
                      : (lang === 'vi' ? 'Kết quả thử thách' : 'Challenge Results')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizCompleted ? (
              <div className="space-y-5">
                {/* Question Text */}
                <p className="font-serif text-base sm:text-lg text-amber-50 font-semibold leading-snug">
                  {lang === 'vi'
                    ? QUIZ_QUESTIONS[quizCurrentIdx].questionVi
                    : QUIZ_QUESTIONS[quizCurrentIdx].questionEn}
                </p>

                {/* Option Buttons */}
                <div className="space-y-2.5">
                  {(lang === 'vi'
                    ? QUIZ_QUESTIONS[quizCurrentIdx].optionsVi
                    : QUIZ_QUESTIONS[quizCurrentIdx].optionsEn
                  ).map((opt, optIdx) => {
                    const isSelected = quizSelectedOption === optIdx;
                    const isCorrect = optIdx === QUIZ_QUESTIONS[quizCurrentIdx].correctIdx;
                    let btnStyle = 'bg-white/5 border-white/10 hover:border-amber-400/40 text-stone-200';

                    if (quizIsAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
                      } else {
                        btnStyle = 'bg-white/3 border-white/5 text-stone-500 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-500/20 border-amber-400 text-amber-100';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizIsAnswered}
                        onClick={() => {
                          setQuizSelectedOption(optIdx);
                          setQuizIsAnswered(true);
                          if (optIdx === QUIZ_QUESTIONS[quizCurrentIdx].correctIdx) {
                            setQuizScore((prev) => prev + 1);
                          }
                        }}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-serif transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-black/40 flex items-center justify-center font-mono text-xs font-bold text-amber-300 flex-shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {quizIsAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {quizIsAnswered && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-serif text-amber-200/90 leading-relaxed animate-in fade-in duration-200">
                    <span className="font-mono uppercase font-bold text-amber-400 block mb-1">
                      {lang === 'vi' ? '💡 Giải thích di sản:' : '💡 Heritage Fact:'}
                    </span>
                    {lang === 'vi'
                      ? QUIZ_QUESTIONS[quizCurrentIdx].explanationVi
                      : QUIZ_QUESTIONS[quizCurrentIdx].explanationEn}
                  </div>
                )}

                {/* Next button */}
                {quizIsAnswered && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (quizCurrentIdx + 1 < QUIZ_QUESTIONS.length) {
                          setQuizCurrentIdx((prev) => prev + 1);
                          setQuizSelectedOption(null);
                          setQuizIsAnswered(false);
                        } else {
                          setQuizCompleted(true);
                        }
                      }}
                      className="kiosk-magnetic-btn kiosk-magnetic-btn--primary !py-2.5 !px-5 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                    >
                      <span>
                        {quizCurrentIdx + 1 < QUIZ_QUESTIONS.length
                          ? (lang === 'vi' ? 'Câu tiếp theo' : 'Next Question')
                          : (lang === 'vi' ? 'Xem kết quả' : 'View Results')}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completion Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                  <Trophy className="w-8 h-8 text-black" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-amber-100">
                  {lang === 'vi' ? 'Chúc mừng bạn!' : 'Congratulations!'}
                </h4>
                <p className="text-sm font-serif text-stone-300">
                  {lang === 'vi'
                    ? `Bạn đã trả lời đúng ${quizScore} / ${QUIZ_QUESTIONS.length} câu hỏi về Di tích Ao Bà Om.`
                    : `You answered ${quizScore} / ${QUIZ_QUESTIONS.length} questions correctly about Ao Ba Om.`}
                </p>
                <div className="inline-block px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                  {quizScore >= 3
                    ? (lang === 'vi' ? '🏅 Danh hiệu: Đại Sứ Di Sản Ao Bà Om' : '🏅 Title: Ao Ba Om Heritage Ambassador')
                    : (lang === 'vi' ? '🎖️ Danh hiệu: Người Bạn Của Di Sản' : '🎖️ Title: Friend of Heritage')}
                </div>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setQuizCurrentIdx(0);
                      setQuizSelectedOption(null);
                      setQuizIsAnswered(false);
                      setQuizScore(0);
                      setQuizCompleted(false);
                    }}
                    className="kiosk-magnetic-btn kiosk-magnetic-btn--ghost !py-2.5 !px-4 text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'vi' ? 'Thử lại' : 'Play Again'}</span>
                  </button>
                  <button
                    onClick={() => setIsQuizOpen(false)}
                    className="kiosk-magnetic-btn kiosk-magnetic-btn--primary !py-2.5 !px-5 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'Đóng' : 'Close'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
