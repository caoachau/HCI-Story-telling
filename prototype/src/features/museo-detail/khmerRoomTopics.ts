import type { GroundsPoint } from "./khmerGroundsPoints";
import { khmerPlacePhotos, type KhmerPlacePhoto } from "./khmerPlaces";

// Provisional identifiers and image positions for previously unmarked exhibits.
// Names remain neutral until museum records are available.
const positions: Record<string, [number, number][]> = {
  "traditional-room": [[.105,.40],[.13,.46],[.15,.51],[.26,.49],[.39,.55],[.42,.55],[.46,.57],[.50,.56],[.54,.57],[.58,.55],[.61,.54],[.64,.55],[.70,.48],[.73,.48],[.76,.48],[.84,.45],[.91,.44]],
  "thematic-room": [[.125,.57],[.15,.58],[.23,.59],[.255,.59],[.27,.59],[.29,.59],[.35,.56],[.37,.56],[.393,.445],[.413,.445],[.433,.445],[.457,.445],[.483,.445],[.51,.445],[.537,.445],[.393,.49],[.413,.49],[.433,.49],[.457,.49],[.483,.49],[.51,.49],[.537,.49],[.62,.56],[.645,.56],[.695,.58],[.71,.58],[.735,.59],[.815,.58],[.835,.57]],
  "daily-left": [[.42,.51],[.44,.50],[.47,.51],[.50,.51],[.55,.50],[.49,.56],[.77,.58],[.79,.57],[.82,.62],[.88,.50],[.92,.50]],
  "daily-right": [[.14,.58],[.23,.58],[.25,.59],[.27,.59],[.30,.57],[.44,.55],[.47,.55],[.50,.55],[.53,.55],[.56,.55],[.89,.62],[.94,.65]],
  "arts-left": [[.14,.51],[.18,.59],[.23,.60],[.40,.55],[.50,.55],[.59,.54],[.70,.55],[.78,.54],[.83,.53],[.94,.55]],
  "arts-right": [[.17,.53],[.23,.53],[.32,.55],[.45,.56],[.49,.56],[.53,.56],[.56,.56],[.73,.59],[.82,.54]],
};

export function groupRoomPoints(id: string, photo: KhmerPlacePhoto, points: GroundsPoint[]): GroundsPoint[] {
  const image = khmerPlacePhotos[photo];
  const added = (positions[id] ?? []).map(([u, v], index): GroundsPoint => {
    const firstNumber: Record<string, number> = { "daily-left": 4, "daily-right": 15, "arts-left": 29, "arts-right": 39 };
    const number = index + (firstNumber[id] ?? 1);
    const title = { vi: `Hiện vật ${number}`, en: `Exhibit ${number}` };
    const caption = { vi: "Vị trí tạm đánh dấu trên ảnh gốc; thông tin hiện vật sẽ được bổ sung.", en: "Provisional position in the original panorama; object information is pending." };
    return { id: `${id}-new-object-${number}`, number, u, v, title, category: image.title, summary: caption,
      view: { yaw: u * 360, pitch: 90 - v * 180, fov: 65 },
      images: [{ src: image.src, title, caption, credit: image.author, crop: { x: Math.max(0, u - .03), y: Math.max(0, v - .05), width: .06, height: .10 } }],
      observe: caption, sections: [], sources: [] };
  });
  const exhibits = [...points.filter(point => !point.targetEntryId), ...added];
  const links = points.filter(point => point.targetEntryId);
  const zone = (u: number) => id === "thematic-room" ? (u < .38 ? 0 : u < .60 ? 1 : 2) : Math.min(2, Math.floor(u * 3));
  const groups = [0, 1, 2].map(index => {
    const members = exhibits.filter(point => zone(point.u) === index);
    if (!members.length) return [];
    const topicId = `room-${id}-${index + 1}`;
    const u = members.reduce((sum, point) => sum + point.u, 0) / members.length;
    const v = members.reduce((sum, point) => sum + point.v, 0) / members.length;
    const roomName = id.startsWith("traditional") ? { vi: "Truyền thống", en: "Traditional exhibition" }
      : id.startsWith("thematic") ? { vi: "Trưng bày chuyên đề", en: "Thematic exhibition" }
      : id.startsWith("faith") ? { vi: "Tín ngưỡng, tôn giáo", en: "Belief and religion" }
      : id.startsWith("arts") ? { vi: "Văn hóa nghệ thuật", en: "Culture and arts" }
      : { vi: "Văn hóa đời thường", en: "Everyday culture" };
    const title = { vi: `${roomName.vi} · khu ${index + 1}`, en: `${roomName.en} · area ${index + 1}` };
    const topic: GroundsPoint = { id: `topic-${topicId}`, topicId, markerKind: "topic", title, category: title, u, v,
      view: { yaw: u * 360, pitch: 90 - v * 180, fov: 80 }, summary: { vi: "Chọn hiện vật để khám phá.", en: "Choose an exhibit to explore." }, images: [], observe: { vi: "", en: "" }, sections: [], sources: [] };
    return [topic, ...members.map(point => ({ ...point, topicId, markerKind: "exhibit" as const }))];
  });
  return [...groups.flat(), ...links];
}
