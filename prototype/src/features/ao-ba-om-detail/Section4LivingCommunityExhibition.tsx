import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Flame,
  Music,
  Quote,
  BookOpen,
  Award,
  Calendar,
  Layers,
  Heart,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';
import {
  CULTURAL_PEOPLE,
  CULTURAL_ACTIVITIES,
  UNTOLD_STORIES,
  SACRED_ARTIFACTS,
} from './aoBaOm5PartsData';
import type { AoLanguage } from './types';
import { PeopleEvidence } from '../../experience/EvidencePanels';

interface Section4LivingCommunityExhibitionProps {
  lang: AoLanguage;
}

export const Section4LivingCommunityExhibition: React.FC<Section4LivingCommunityExhibitionProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState<'people' | 'festivals' | 'stories' | 'artifacts'>('people');

  return (
    <section id="section-4-community" className="kiosk-section relative min-h-screen bg-[#07090e] text-[#f4efe6] py-14 sm:py-20 px-4 sm:px-8 lg:px-12 flex flex-col justify-between select-none overflow-hidden">
      {/* Ambient Neon Mists */}
      <div className="kiosk-neon-mist top-1/3 -right-32 bg-amber-500/10 pointer-events-none" />
      <div className="kiosk-neon-mist -bottom-32 -left-32 bg-emerald-500/8 pointer-events-none" />
      
      {/* Background Museum Ambience Lighting & Vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_15%,_rgba(180,83,9,0.12),transparent_70%)] pointer-events-none" />

      {/* Top Header: Section Identity (Museum Hall Aesthetics matching Slice 4) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
              {lang === 'vi' ? 'PHẦN 04 · CON NGƯỜI & ĐỜI SỐNG VĂN HÓA GẮN VỚI DI TÍCH' : 'PART 04 · LIVING HERITAGE, PEOPLE & TRADITIONS'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-amber-50">
            {lang === 'vi' ? 'Không Gian Trưng Bày Di Sản Sống & Cộng Đồng Bản Địa' : 'Living Heritage Gallery & Indigenous Community Showcase'}
          </h2>
          <p className="text-xs sm:text-sm font-serif text-stone-400 max-w-3xl mt-1">
            {lang === 'vi'
              ? 'Con người lịch sử, nghệ nhân gìn giữ, đại lễ Ok Om Bok, phong tục tập quán, ký ức chưa kể và ngọn lửa kế thừa của thế hệ trẻ hôm nay.'
              : 'Historical figures, master artisans, Ok Om Bok rituals, living traditions, untold oral memories, and youth succession.'}
          </p>
        </div>

        {/* Gallery Wing Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono">
          <button
            onClick={() => setActiveCategory('people')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'people' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '1. Con người & Nghệ nhân' : '1. People & Artisans'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('festivals')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'festivals' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '2. Lễ hội & Tập quán' : '2. Festivals & Rites'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('stories')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'stories' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '3. Ký ức & Giai thoại chưa kể' : '3. Untold Memories'}</span>
          </button>
          <button
            onClick={() => setActiveCategory('artifacts')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'artifacts' ? 'bg-amber-500 text-black font-semibold shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? '4. Di vật & Kế thừa hôm nay' : '4. Artifacts & Legacy'}</span>
          </button>
        </div>
      </div>

      {/* Main Exhibition Wings (Museum vitrine and display plaques matching Slice 4) */}
      <div className="relative z-10 flex-1">
        
        {/* WING 1: CON NGƯỜI & NGHỆ NHÂN GÌN GIỮ DI SẢN */}
        {activeCategory === 'people' && <div className="hx-body rounded-2xl bg-[#fbf8f1] text-[#173f3c]"><PeopleEvidence siteId="ao-ba-om" lang={lang} /></div>}

        {/* WING 2: HOẠT ĐỘNG TIÊU BIỂU & ĐẠI LỄ HỘI */}
        {activeCategory === 'festivals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {CULTURAL_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="bg-[#121622] border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between group transition-all"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={act.image}
                      alt={lang === 'vi' ? act.title.vi : act.title.en}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-amber-400/40 text-[10px] font-mono text-amber-300 backdrop-blur-sm">
                      {lang === 'vi' ? act.timeOccurrence.vi : act.timeOccurrence.en}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {lang === 'vi' ? act.title.vi : act.title.en}
                    </h3>
                  </div>

                  <p className="text-xs font-serif text-stone-300 leading-relaxed">
                    {lang === 'vi' ? act.description.vi : act.description.en}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 font-semibold block">
                    {lang === 'vi' ? 'Ý nghĩa văn hóa tâm linh:' : 'Spiritual Meaning:'}
                  </span>
                  <p className="text-xs font-serif text-amber-100/90 leading-relaxed">
                    {lang === 'vi' ? act.culturalMeaning.vi : act.culturalMeaning.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WING 3: KÝ ỨC DÂN GIAN & NHỮNG CÂU CHUYỆN CHƯA KỂ */}
        {activeCategory === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {UNTOLD_STORIES.map((story) => (
              <div
                key={story.id}
                className="bg-[#121622] border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between group transition-all"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={story.image}
                      alt={lang === 'vi' ? story.title.vi : story.title.en}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-amber-400/40 text-[10px] font-mono text-amber-300 backdrop-blur-sm">
                      {lang === 'vi' ? story.narrator.vi : story.narrator.en}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                    {lang === 'vi' ? story.title.vi : story.title.en}
                  </h3>

                  <p className="text-xs font-serif text-stone-300 leading-relaxed italic">
                    "{lang === 'vi' ? story.oralHistory.vi : story.oralHistory.en}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 font-semibold block">
                    {lang === 'vi' ? 'Giá trị nhân văn đúc kết:' : 'Humanist Significance:'}
                  </span>
                  <p className="text-xs font-serif text-amber-200/90 leading-relaxed">
                    {lang === 'vi' ? story.significance.vi : story.significance.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WING 4: DI VẬT ĐẶC SẮC & SỰ TIẾP NỐI HÔM NAY */}
        {activeCategory === 'artifacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
            {SACRED_ARTIFACTS.map((art) => (
              <div
                key={art.id}
                className="bg-[#121622] border border-white/10 hover:border-amber-400/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col justify-between group transition-all"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={art.image}
                      alt={lang === 'vi' ? art.name.vi : art.name.en}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 border border-amber-400/40 text-[11px] font-mono text-amber-300 backdrop-blur-sm">
                      {art.originEra}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {lang === 'vi' ? art.name.vi : art.name.en}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-amber-400/80">
                      {lang === 'vi' ? art.material.vi : art.material.en}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm font-serif text-stone-300 leading-relaxed">
                    {lang === 'vi' ? art.specialStory.vi : art.specialStory.en}
                  </p>
                </div>

                <div className="mt-5 p-4 bg-amber-950/30 border border-amber-500/30 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'vi' ? 'Sự tiếp nối thế hệ trẻ hôm nay:' : 'Living Youth Succession:'}</span>
                  </div>
                  <p className="text-xs font-serif text-amber-100/90 leading-relaxed">
                    {lang === 'vi' ? art.todayContinuity.vi : art.todayContinuity.en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Exhibition Hall Footer Note */}
      <div className="relative z-10 pt-6 mt-8 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>{lang === 'vi' ? 'Di sản sống được nuôi dưỡng từ tình cảm cộng đồng ba dân tộc Kinh – Khmer – Hoa' : 'Living heritage nurtured by the Kinh, Khmer, and Chinese communities'}</span>
        </div>
        <div className="text-amber-300">
          <span>{lang === 'vi' ? 'Không gian diễn xướng văn hóa' : 'Cultural Exhibition Pavilion'}</span>
        </div>
      </div>
    </section>
  );
};
