import { khmerCultureTopics, type CultureGroup, type CultureLanguage, type CulturePhotoId } from "./khmerCulture";

type Copy = Record<CultureLanguage, string>;
export interface CultureCollection {
  id: string;
  title: Copy;
  topics: string[];
}

/** Editorial topic collections, not claims about rooms or artifact locations. */
export const cultureCollections: Record<CultureGroup, CultureCollection[]> = {
  culture: [
    { id: "beliefs", title: { vi: "Tín ngưỡng", en: "Beliefs" }, topics: ["pagoda", "satra"] },
    { id: "arts", title: { vi: "Nghệ thuật", en: "Arts" }, topics: ["robam", "duke", "pinpeat", "chapey"] },
    { id: "crafts", title: { vi: "Nghề thủ công", en: "Crafts" }, topics: ["crafts", "livelihood", "ngo"] },
    { id: "customs", title: { vi: "Phong tục", en: "Customs" }, topics: ["clothing", "wedding", "food"] },
  ],
  activities: [
    { id: "festivals", title: { vi: "Lễ hội", en: "Festivals" }, topics: ["okom", "newyear", "dolta", "kathina"] },
    { id: "museum", title: { vi: "Tại bảo tàng", en: "At the museum" }, topics: ["exhibition2024", "gongs2025"] },
  ],
  people: [
    { id: "artisans", title: { vi: "Nghệ nhân", en: "Artisans" }, topics: ["lamphen", "thachsang", "thachmau"] },
    { id: "generations", title: { vi: "Thế hệ tiếp nối", en: "Next generation" }, topics: ["youngmakers"] },
    { id: "community", title: { vi: "Ký ức cộng đồng", en: "Community memory" }, topics: ["maha", "keepers"] },
  ],
};

export const cultureGroupCovers: Record<CultureGroup, CulturePhotoId> = {
  culture: "mask", activities: "festival", people: "sang",
};
export const cultureGroupIntroductions: Record<CultureGroup, Copy> = {
  culture: { vi: "Phong tục, tín ngưỡng, nghệ thuật và tri thức dân gian.", en: "Customs, beliefs, arts and folk knowledge." },
  activities: { vi: "Lễ hội, sinh hoạt cộng đồng và những cuộc gặp gỡ tại bảo tàng.", en: "Celebrations, community life and encounters at the museum." },
  people: { vi: "Những con người gìn giữ, truyền dạy và lan tỏa di sản.", en: "The people preserving, teaching and sharing living heritage." },
};

export function cultureGroupTopics(group: CultureGroup, filter = "all") {
  const collection = cultureCollections[group].find(item => item.id === filter);
  const items = khmerCultureTopics.filter(item => item.group === group && (!collection || collection.topics.includes(item.id)));
  if (group !== "culture" || filter !== "all") return items;
  const featured = ["wedding", "crafts", "robam"];
  return [...featured.map(id => items.find(item => item.id === id)!), ...items.filter(item => !featured.includes(item.id))];
}
