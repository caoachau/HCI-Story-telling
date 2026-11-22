import { type CultureLanguage, type CultureTopic } from "./khmerCulture";

type Copy = Record<CultureLanguage, string>;
/** Short exhibit labels, drawn from the existing stories; no inferred dates or materials. */
const objectLabels: Record<string, { title: Copy; text?: Copy }> = {
  pagoda: { title: { vi: "Không gian chùa Khmer", en: "The Khmer pagoda" } },
  satra: { title: { vi: "Kinh lá buông", en: "Palm-leaf manuscripts" } },
  robam: { title: { vi: "Mặt nạ sân khấu Rôbăm", en: "Robam theatrical masks" }, text: { vi: "Mão và mặt nạ giúp nhận diện nhân vật trên sân khấu Khmer. Cùng động tác múa và âm nhạc, chúng kể lại những câu chuyện được trao truyền qua nhiều thế hệ.", en: "Crowns and masks identify characters on the Khmer stage. Together with movement and music, they tell stories passed down through generations." } },
  duke: { title: { vi: "Mô hình sân khấu Dù kê", en: "Du Ke stage model" } },
  pinpeat: { title: { vi: "Dàn nhạc Ngũ âm", en: "The Pinpeat ensemble" } },
  chapey: { title: { vi: "Đàn Chà pây và lời ca", en: "The Chapey lute and song" } },
  clothing: { title: { vi: "Trang phục Khmer", en: "Khmer dress" } },
  wedding: { title: { vi: "Mô hình đời sống phum sóc", en: "A model of Khmer village life" }, text: { vi: "Những nếp nhà và lối đi trong mô hình gợi lại không gian cư trú của cộng đồng Khmer. Từ đời sống phum sóc, tìm hiểu thêm lễ cưới và những lời chúc gắn kết gia đình.", en: "Houses and pathways in the model evoke Khmer community life. This village setting introduces wedding customs and the blessings that bring families together." } },
  crafts: { title: { vi: "Đồ đan và vật dụng tre", en: "Woven bamboo implements" } },
  livelihood: { title: { vi: "Nông cụ và ngư cụ", en: "Farming and fishing implements" } },
  food: { title: { vi: "Cốm dẹp trong ngày hội", en: "Flat rice at festival time" } },
  ngo: { title: { vi: "Mô hình ghe Ngo", en: "Ngo boat model" } },
};
export function cultureExhibitLabel(topic: CultureTopic, lang: CultureLanguage) {
  const label = objectLabels[topic.id];
  return { title: label?.title[lang] ?? topic.title[lang], text: label?.text?.[lang] ?? topic.summary[lang], question: topic.question[lang] };
}
