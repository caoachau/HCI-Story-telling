import { InlineAudioActions } from "../../audio/InlineAudioActions";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAudioContentContext } from '../../audio/context';
import { restoredParams, updateRoute } from '../../experience/state';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Footprints,
  Flower2,
  Hammer,
  ImageOff,
  Landmark,
  Layers3,
  Leaf,
  MapPin,
  Music2,
  Sailboat,
  Users,
  Waves,
  X,
} from "lucide-react";
import {
  findKhmerPlace,
  khmerPlaces,
  khmerPlacePhotos,
  khmerPlaceSources,
  khmerPlaceZones,
  type KhmerPlacePhoto,
  type KhmerPlaceZone,
  type PlaceLanguage,
} from "./khmerPlaces";
import {
  discoveryEntryForPlace,
  discoveryTabEntries,
  discoveryPhoto,
  khmerDiscoveryTabs,
  type DiscoveryAerial,
  type DiscoveryEntry,
  type DiscoveryObject,
} from "./khmerDiscovery";
import { useMuseumReducedMotion } from "./museumMotion";
import {
  KhmerGroundsPointDetail,
  GroundsPointImage,
} from "./KhmerGroundsPointDetail";
import {
  KhmerGroundsPanorama,
  type PanoramaView,
} from "./KhmerGroundsPanorama";
import { KhmerComplexTour } from "./KhmerComplexTourViewer";
import { loadMuseumPanorama } from "./museumMediaCache";
import { ExpandablePhoto } from "./ExpandableMedia";

export const placeIcons = {
  building: Landmark,
  leaf: Leaf,
  water: Waves,
  boat: Sailboat,
  book: BookOpen,
  faith: Landmark,
  craft: Hammer,
  music: Music2,
  people: Users,
  steps: Footprints,
};
const ArtifactModel = lazy(() => import("./KhmerArtifactModel").then(module => ({ default: module.KhmerArtifactModel })));
const zoneIcons = { landscape: Users, grounds: Leaf, ground: Landmark, upper: Layers3 };
const groundsIcons: Record<string, typeof Landmark> = { "museum-building": Landmark, "maha-son-thong": Landmark, "outdoor-instrument": Music2 };

function DiscoveryCardCaption({ title, category, icon: Icon }: { title: string; category: string; icon: typeof Landmark }) {
  return <span className="kd-card-caption">
    <Icon className="kd-card-icon" aria-hidden="true" />
    <span className="kd-card-text"><strong>{title}</strong><small>{category}</small></span>
    <span className="kd-card-arrow" aria-hidden="true"><ArrowRight /></span>
  </span>;
}

function DiscoveryImage({
  photo,
  lang,
  className = "",
  expandable = false,
}: {
  photo?: KhmerPlacePhoto;
  lang: PlaceLanguage;
  className?: string;
  expandable?: boolean;
}) {
  const data = discoveryPhoto(photo);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo]);
  if (data && !failed && expandable) return <ExpandablePhoto title={data.title[lang]} lang={lang} className={className}><img src={data.src} alt={data.title[lang]} onError={() => setFailed(true)} draggable={false} /></ExpandablePhoto>;
  return data && !failed ? (
    <img
      className={className}
      src={data.src}
      alt={data.title[lang]}
      onError={() => setFailed(true)}
      draggable={false}
    />
  ) : (
    <div className={`kd-missing ${className}`}>
      <ImageOff aria-hidden="true" />
      <span>
        {lang === "vi"
          ? "Chưa có ảnh cho khu vực này"
          : "No image available for this area"}
      </span>
    </div>
  );
}

function AerialScene({
  aerial,
  entries,
  selected,
  lang,
  onSelect,
}: {
  aerial: DiscoveryAerial;
  entries: DiscoveryEntry[];
  selected: string;
  lang: PlaceLanguage;
  onSelect: (item: DiscoveryEntry) => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0, top: 0, left: 0 });
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const photo = new Image();
    let disposed = false;
    const measure = () => {
      if (disposed || !photo.naturalWidth) return;
      // Fill the width. Wide frames crop the lower trees, keeping the pond
      // and every confirmed landmark; tall frames retain the whole photograph.
      let scale = node.clientWidth / photo.naturalWidth;
      const lowestMarker = Math.max(...aerial.markers.filter(marker => marker.confirmed).map(marker => marker.y), 0);
      // On exceptionally short screens, retain the whole image rather than
      // crop every landmark out of the viewport. Cards remain available below.
      if (photo.naturalHeight * scale * lowestMarker + 30 > node.clientHeight)
        scale = Math.min(scale, node.clientHeight / photo.naturalHeight);
      const width = photo.naturalWidth * scale;
      const height = photo.naturalHeight * scale;
      setSize({
        width,
        height,
        top: Math.max(0, (node.clientHeight - height) / 2),
        left: (node.clientWidth - width) / 2,
      });
    };
    photo.onload = measure;
    photo.src = khmerPlacePhotos[aerial.photo].src;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (photo.complete) measure();
    return () => {
      disposed = true;
      photo.onload = null;
      observer.disconnect();
    };
  }, [aerial]);
  return (
    <div className="kd-aerial-viewport" ref={viewport}>
      <div
        className="kd-photo-plane kd-aerial-plane"
        style={{ position: "absolute", left: size.left, top: size.top, width: size.width || "100%", height: size.height || "100%" }}
      >
        <DiscoveryImage
          photo={aerial.photo}
          lang={lang}
          className="kd-main-photo"
        />
        {size.width > 0 &&
          aerial.markers
            .filter(
              (marker) =>
                marker.confirmed &&
                marker.x >= 0 &&
                marker.x <= 1 &&
                marker.y >= 0 &&
                marker.y <= 1,
            )
            .map((marker) => {
              const item = entries.find((item) => item.id === marker.entryId);
              return (
                item && (
                  <button
                    type="button"
                    className="kd-marker"
                    key={item.id}
                    style={{
                      left: `${marker.x * 100}%`,
                      top: `${marker.y * 100}%`,
                    }}
                    aria-pressed={selected === item.id}
                    data-marker-entry={item.id}
                    data-image-x={marker.x}
                    data-image-y={marker.y}
                    aria-label={`${marker.number}. ${findKhmerPlace(item.placeId).title[lang]}`}
                    onClick={() => onSelect(item)}
                  >
                    <b>{marker.number}</b>
                    <span>{findKhmerPlace(item.placeId).title[lang]}</span>
                  </button>
                )
              );
            })}
      </div>
    </div>
  );
}

function ObjectDetail({
  object,
  room,
  lang,
  close,
  startWithPhoto = false,
}: {
  object: DiscoveryObject;
  room: DiscoveryEntry;
  lang: PlaceLanguage;
  close: () => void;
  startWithPhoto?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [display, setDisplay] = useState<"3d" | "photo">(object.model && !startWithPhoto ? "3d" : "photo");
  const vi = lang === "vi",
    photo = khmerPlacePhotos[object.photo];
  const story = findKhmerPlace(object.placeId ?? room.placeId);
  useEffect(() => {
    const origin = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.showModal();
    return () => {
      node?.close();
      origin?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      className="kd-object-dialog"
      ref={dialog}
      aria-labelledby="kd-object-title"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <header>
        <span>
          {vi ? "HIỆN VẬT · " : "OBJECT · "}
          {findKhmerPlace(room.placeId).title[lang]}
        </span>
        <button
          autoFocus
          type="button"
          onClick={close}
          aria-label={vi ? "Đóng chi tiết hiện vật" : "Close object detail"}
        >
          <X />
        </button>
      </header>
      <div className="kd-object-body">
        <figure>
          {object.model && <div className="kd-model-tabs" role="group" aria-label={vi ? "Cách xem hiện vật" : "Object view"}>
            <button type="button" aria-pressed={display === "3d"} onClick={() => setDisplay("3d")}>{vi ? "Mô hình 3D" : "3D model"}</button>
            <button type="button" aria-pressed={display === "photo"} onClick={() => setDisplay("photo")}>{object.modelPreview ? vi ? "Ảnh mô hình" : "Model preview" : vi ? "Ảnh tư liệu" : "Photograph"}</button>
          </div>}
          {object.model && display === "3d"
            ? <Suspense fallback={<div className="kd-missing">{vi ? "Đang mở trình xem 3D…" : "Opening 3D viewer…"}</div>}><ArtifactModel src={object.model} lang={lang} title={photo.title[lang]} initialZoomSteps={object.initialZoomSteps} /></Suspense>
            : <DiscoveryImage photo={object.photo} lang={lang} expandable />}
          <figcaption>
            {display === "3d" && object.model ? <>
              {vi ? "Mô hình 3D · Tư liệu do người dùng cung cấp" : "3D model · User-supplied material"}
            </> : <>{photo.caption[lang]}<small>{photo.author}</small></>}
          </figcaption>
        </figure>
        <article>
          <h2 id="kd-object-title">{photo.title[lang]}</h2><InlineAudioActions lang={lang} />
          <p className="kd-object-caption">{photo.caption[lang]}</p>
          <h3>
            {object.placeId || object.story
              ? vi
                ? "Câu chuyện hiện vật"
                : "Object story"
              : vi
                ? "Câu chuyện khu trưng bày"
                : "Display context"}
          </h3>
          {object.story ? object.story.sections.map(section => <section className="kd-object-story-section" key={section.title.vi}>
            <h3>{section.title[lang]}</h3><p>{section.text[lang]}</p>
          </section>) : story.paragraphs.map((p) => (
            <p key={p.vi}>{p[lang]}</p>
          ))}
          {object.story ? <details className="kd-object-sources">
            <summary>{vi ? "Nguồn tham khảo" : "References"}</summary>
            {object.story.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title[lang]} <ArrowRight size={16} /></a>)}
          </details> : <a
            href={khmerPlaceSources[photo.source].url}
            target="_blank"
            rel="noreferrer"
          >
            {khmerPlaceSources[photo.source].title[lang]}{" "}
            <ArrowRight size={16} />
          </a>}
          <button type="button" className="kd-action" onClick={close}>
            <ArrowLeft />
            {vi ? "Về gian đang xem" : "Back to this display"}
          </button>
        </article>
      </div>
    </dialog>
  );
}

export function KhmerMuseumPlaces({
  lang,
  active,
  selectedId,
  onSelect,
  onExplore,
  onDirectory,
}: {
  lang: PlaceLanguage;
  active: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onExplore: (id: string, origin: HTMLElement) => void;
  onDirectory: () => void;
}) {
  const root = useRef<HTMLElement>(null),
    strip = useRef<HTMLDivElement>(null);
  const initialRoute = useRef(restoredParams('bao-tang-khmer')).current;
  const lastSelected = useRef(selectedId);
  const initial = (() => {
    const tab = khmerDiscoveryTabs.find(tab => tab.id === initialRoute.get('tab'));
    const scene = tab && discoveryTabEntries(tab).find(item => item.id === initialRoute.get('scene') && item.placeId === selectedId && item.panorama?.sceneGroup);
    if (tab && scene) return { tab, entry: scene };
    const entry = tab?.entries.find(entry => entry.placeId === selectedId && (!entry.trial || !!entry.panorama?.sceneGroup));
    if (tab && entry) return { tab, entry };
    const located = discoveryEntryForPlace(selectedId, tab?.id);
    if (located.entry.panorama?.sceneGroup) return located;
    if (tab?.panoramaEntry?.panorama?.sceneGroup) return { tab, entry: tab.panoramaEntry };
    return discoveryEntryForPlace(selectedId);
  })();
  const [zoneId, setZoneId] = useState<KhmerPlaceZone>(initial.tab.id);
  const [selections, setSelections] = useState<Record<string, string>>({
    [initial.tab.id]: initial.entry.id,
  });
  const [openRooms, setOpenRooms] = useState<
    Record<string, string | undefined>
  >(() => initialRoute.has('object') || initial.entry.panorama?.sceneGroup ? { [initial.tab.id]: initial.entry.id } : {});
  const [photos, setPhotos] = useState<Record<string, number>>({});
  const [artifact, setArtifact] = useState<DiscoveryObject | null>(null);
  const panoramaViews = useRef<Record<string, PanoramaView>>({});
  const [pointId, setPointId] = useState<string | undefined>(() => initial.tab.id === "grounds"
    ? initial.entry.panorama?.points?.find(point => point.id === initialRoute.get('point'))?.id ?? initial.entry.panorama?.points?.[0]?.id
    : undefined);
  const [pointDetailId, setPointDetailId] = useState<string>();
  const [pointFocus, setPointFocus] = useState<{
    id: string;
    revision: number;
  }>();
  const pointRevision = useRef(0);
  const [complexTravel, setComplexTravel] = useState<{ id: string; revision: number }>();
  const complexRevision = useRef(0);
  const [objectSelections, setObjectSelections] = useState<Record<string, string>>(() => {
    const object = initial.entry.objects.find(object => object.id === initialRoute.get('object'));
    return object ? { [initial.entry.id]: object.id } : {};
  });
  const reduced = useMuseumReducedMotion(root),
    vi = lang === "vi";
  const tab = khmerDiscoveryTabs.find((tab) => tab.id === zoneId)!;
  const entry =
    discoveryTabEntries(tab).find((item) => item.id === selections[zoneId]) ??
    (tab.panoramaEntry?.id === selections[zoneId] ? tab.panoramaEntry : tab.entries[0]);
  const place = findKhmerPlace(entry.placeId),
    zone = khmerPlaceZones.find((zone) => zone.id === zoneId)!;
  const floor = zoneId === "ground" || zoneId === "upper",
    roomOpen = floor && openRooms[zoneId] === entry.id;
  const floorOverview = roomOpen && (entry.id === tab.panoramaEntry?.id || !!entry.panorama?.sceneGroup);
  const photoIndex = Math.min(
    photos[`${zoneId}:${entry.id}`] ?? 0,
    Math.max(0, entry.photos.length - 1),
  );
  const objectId = objectSelections[entry.id] ?? (entry.photos.length
    ? entry.objects.find(object => !object.model && object.photo === entry.photos[photoIndex])?.id
    : entry.objects.find(object => object.model)?.id);
  const selectedObject = roomOpen ? entry.objects.find(object => object.id === objectId) : undefined;
  const modelObject = selectedObject?.model ? selectedObject : undefined;
  const mainPhoto =
    zoneId === "landscape"
      ? tab.aerial?.photo
      : floor && !roomOpen
        ? undefined
        : selectedObject?.photo ?? entry.photos[photoIndex];
  const currentObject = selectedObject ?? (roomOpen && mainPhoto && !entry.trial
    ? { id: mainPhoto, photo: mainPhoto } satisfies DiscoveryObject : undefined);
  const detailPhoto =
    artifact?.photo ??
    modelObject?.photo ??
    (zoneId === "grounds" || roomOpen ? mainPhoto : entry.cover);
  const detail = discoveryPhoto(detailPhoto);
  const panorama =
    zoneId === "grounds" || roomOpen ? entry.panorama : undefined;
  const themedPanorama = panorama?.points?.some(point => point.markerKind === "topic");
  const point = panorama?.points?.find((point) => point.id === pointId);
  const pointDetail = panorama?.points?.find(
    (point) => point.id === pointDetailId,
  );
  useAudioContentContext(point ? panorama?.sceneGroup ? `bao-tang-khmer:zone:${zoneId}` : `bao-tang-khmer:point:${point.id}`
    : currentObject ? `bao-tang-khmer:object:${entry.id}:${currentObject.id}`
    : floor && !roomOpen || entry.trial ? `bao-tang-khmer:zone:${zoneId}`
    : zoneId === 'grounds' ? 'bao-tang-khmer:zone:grounds'
    : `bao-tang-khmer:place:${zoneId}:${entry.id}`, active);
  const stripObjects = entry.objects.filter(object => object.model || !entry.photos.includes(object.photo));
  const sceneCards = panorama?.viewpoints?.map(id => discoveryTabEntries(tab).find(item => item.id === id)).filter((item): item is DiscoveryEntry => !!item);
  const backLabel = panorama?.backEntryId === "interior-stairs"
    ? { vi: "Quay về cầu thang", en: "Back to the staircase" }
    : panorama?.backEntryId?.endsWith("-center")
      ? { vi: "Về trung tâm phòng", en: "Back to the room center" }
      : undefined;
  const stripCount = sceneCards?.length ?? (entry.panorama?.sceneGroup ? tab.entries.length : roomOpen && !floorOverview ? entry.photos.length + stripObjects.length : panorama?.points?.length ?? tab.entries.length);
  if (panorama && !panoramaViews.current[entry.id]) {
    const initialPoint = panorama.points?.find(point => point.id === pointId);
    panoramaViews.current[entry.id] = {
      yaw: initialPoint?.view.yaw ?? panorama.yaw,
      pitch: initialPoint?.view.pitch ?? panorama.pitch,
      fov: panorama.fov,
    };
  }

  useEffect(() => {
    if (!active || !panorama?.sceneGroup) return;
    const destinations = panorama.points?.flatMap(hotspot => {
      const src = khmerDiscoveryTabs.flatMap(discoveryTabEntries).find(item => item.id === hotspot.targetEntryId)?.panorama?.src;
      return src ? [src] : [];
    }) ?? [];
    const timer = window.setTimeout(() => destinations.forEach(src => { void loadMuseumPanorama(src).catch(() => {}); }), 400);
    return () => clearTimeout(timer);
  }, [active, panorama, tab]);

  useEffect(() => {
    if (!active) return;
    const image = khmerDiscoveryTabs.find(tab => tab.id === "grounds")?.entries[0]?.panorama?.src;
    const timer = window.setTimeout(() => { if (image) void loadMuseumPanorama(image).catch(() => {}); }, 350);
    return () => clearTimeout(timer);
  }, [active]);

  // Search and directory selections enter the same hierarchy as photo cards.
  useEffect(() => {
    if (selectedId === lastSelected.current) return;
    lastSelected.current = selectedId;
    const next = discoveryEntryForPlace(selectedId, zoneId);
    setZoneId(next.tab.id);
    setSelections((previous) => ({
      ...previous,
      [next.tab.id]: next.entry.id,
    }));
    setOpenRooms((previous) => ({ ...previous, [next.tab.id]: next.entry.panorama?.sceneGroup ? next.entry.id : undefined }));
    setArtifact(null);
    setPointId(next.tab.id === "grounds" ? next.entry.panorama?.points?.[0]?.id : undefined);
    setPointDetailId(undefined);
    setPointFocus(undefined);
    setComplexTravel(undefined);
  }, [selectedId, zoneId]);

  function choose(item: DiscoveryEntry, open = false, nextZone = zoneId) {
    setComplexTravel(undefined);
    const firstPoint = nextZone === "grounds" ? item.panorama?.points?.[0] : undefined;
    if (firstPoint && item.panorama) {
      const initialView = { ...firstPoint.view, fov: item.panorama.fov };
      if (panoramaViews.current[item.id]) Object.assign(panoramaViews.current[item.id], initialView);
      else panoramaViews.current[item.id] = initialView;
    }
    setPointId(firstPoint?.id);
    setPointDetailId(undefined);
    setPointFocus(firstPoint && nextZone === zoneId && item.id === entry.id
      ? { id: firstPoint.id, revision: ++pointRevision.current }
      : undefined);
    setArtifact(null);
    setZoneId(nextZone);
    updateRoute({ tab: nextZone, scene: item.panorama?.sceneGroup ? item.id : undefined }, 'bao-tang-khmer');
    setSelections((previous) => ({ ...previous, [nextZone]: item.id }));
    if (nextZone === "ground" || nextZone === "upper")
      setOpenRooms((previous) => ({
        ...previous,
        [nextZone]: open ? item.id : undefined,
      }));
    lastSelected.current = item.placeId;
    onSelect(item.placeId);
  }
  function changeTab(id: KhmerPlaceZone) {
    const next = khmerDiscoveryTabs.find((tab) => tab.id === id)!;
    choose(
      next.panoramaEntry ?? next.entries.find((item) => item.id === selections[id]) ??
        next.entries[0],
      !!next.panoramaEntry,
      id,
    );
  }
  function choosePoint(id: string) {
    const hotspot = panorama?.points?.find(point => point.id === id);
    if (hotspot?.targetEntryId) {
      navigateScene(hotspot.targetEntryId);
      return;
    }
    if (!panorama?.points?.some((point) => point.id === id)) return;
    setPointId(id);
    setPointFocus({ id, revision: ++pointRevision.current });
    onSelect(entry.placeId);
  }
  function navigateScene(id: string) {
    for (const destinationTab of khmerDiscoveryTabs) {
      const destination = discoveryTabEntries(destinationTab).find(item => item.id === id);
      if (destination) { choose(destination, true, destinationTab.id); return; }
    }
  }
  function travelComplex(item: DiscoveryEntry) {
    choose(item);
    setComplexTravel({ id: item.id, revision: ++complexRevision.current });
  }
  function changePhoto(index: number) {
    setArtifact(null);
    setObjectSelections(previous => ({ ...previous, [entry.id]: entry.objects.find(object => !object.model && object.photo === entry.photos[index])?.id ?? "" }));
    setPhotos((previous) => ({
      ...previous,
      [`${zoneId}:${entry.id}`]: index,
    }));
  }
  useEffect(() => {
    if (!active) return;
    const track = strip.current,
      selected = track?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!track || !selected) return;
    const item = selected.getBoundingClientRect(),
      bounds = track.getBoundingClientRect();
    if (item.left < bounds.left || item.right > bounds.right)
      track.scrollTo({
        left:
          track.scrollLeft +
          item.left -
          bounds.left -
          (bounds.width - item.width) / 2,
        behavior: reduced ? "instant" : "smooth",
      });
  }, [active, zoneId, entry.id, roomOpen, photoIndex, pointId, selectedObject?.id, reduced]);

  return (
    <section
      className="md-section md-map-section md-framed kd-discovery"
      id="museo-map"
      ref={root}
      hidden={!active}
      tabIndex={-1}
      aria-labelledby="md-map-title"
      data-place-scene-motion="ready"
      data-reduced-motion={reduced}
      data-zone={zoneId}
      data-room={roomOpen ? entry.id : ""}
      data-photo={mainPhoto ?? ""}
    >
      <div className="md-frame kd-frame">
        <div className="kd-body">
          <div className="kd-stage">
            <header className="kd-heading">
              <div>
                <span className="md-eyebrow">
                  {vi ? "KHÁM PHÁ BẢO TÀNG" : "EXPLORE THE MUSEUM"}
                </span>
                <h2 id="md-map-title">
                  {vi ? "Không gian di sản" : "Heritage spaces"}
                </h2>
              </div>
              {roomOpen && (
                <button
                  type="button"
                  className="kd-back"
                  onClick={() => {
                    setOpenRooms((previous) => ({
                      ...previous,
                      [zoneId]: undefined,
                    }));
                    setArtifact(null);
                  }}
                >
                  <ArrowLeft />
                  {vi ? "Về danh sách gian" : "All displays"}
                </button>
              )}
            </header>
            <div
              className="kd-visual"
              id="kd-tab-panel"
              role="tabpanel"
              aria-labelledby={`kd-tab-${zoneId}`}
            >
              {floor && !roomOpen ? (
                <div className="kd-room-list">
                  <div className="kd-list-intro">
                    <h3>{zone.title[lang]}</h3>
                    <p>
                      {vi
                        ? "Chọn gian / khu trưng bày để xem bên trong"
                        : "Choose a display area to look inside"}
                    </p>
                  </div>
                  <div className="kd-room-grid">
                    {tab.entries.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        data-room-entry={item.id}
                        aria-pressed={entry.id === item.id}
                        onClick={() => choose(item, true)}
                      >
                        <DiscoveryImage photo={item.cover} lang={lang} />
                        <span>
                          <strong>
                            {item.title?.[lang] ??
                              findKhmerPlace(item.placeId).title[lang]}
                          </strong>
                          <small>
                            {item.cover
                              ? vi
                                ? "Ảnh đại diện · Xem bên trong"
                                : "Preview · Look inside"
                              : vi
                                ? "Xem thông tin khu vực"
                                : "View area information"}
                          </small>
                        </span>
                        <ArrowRight />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {modelObject?.model ? (
                    <div className="kd-inline-model" data-inline-model={modelObject.id}>
                      {active && <Suspense fallback={<div className="kd-missing">{vi ? "Đang mở mô hình 3D…" : "Opening 3D model…"}</div>}>
                        <ArtifactModel key={modelObject.id} src={modelObject.model} lang={lang} title={khmerPlacePhotos[modelObject.photo].title[lang]} initialZoomSteps={modelObject.initialZoomSteps} />
                      </Suspense>}
                    </div>
                  ) : panorama ? (
                    <KhmerGroundsPanorama
                      key={panorama.sceneGroup ?? entry.id}
                      panorama={panorama}
                      view={panoramaViews.current[entry.id]}
                      lang={lang}
                      active={active}
                      selectedPointId={pointId}
                      focusRequest={pointFocus}
                      onSelectPoint={choosePoint}
                      onClearPoint={() => { setPointId(undefined); setPointDetailId(undefined); setPointFocus(undefined); }}
                      onOpenPoint={(id) => setPointDetailId(id)}
                      backLabel={backLabel}
                      onBack={panorama.backEntryId ? () => {
                        navigateScene(panorama.backEntryId!);
                      } : undefined}
                    />
                  ) : zoneId === "landscape" && tab.aerial ? (
                    <KhmerComplexTour aerial={tab.aerial} selected={entry.id} request={complexTravel} lang={lang} active={active}>
                      <AerialScene aerial={tab.aerial} entries={tab.entries} selected={entry.id} lang={lang} onSelect={travelComplex} />
                    </KhmerComplexTour>
                  ) : (
                    <div className="kd-photo-plane">
                      <DiscoveryImage
                        key={mainPhoto ?? entry.id}
                        photo={mainPhoto}
                        lang={lang}
                        className="kd-main-photo"
                        expandable
                      />
                    </div>
                  )}
                  {!mainPhoto && !modelObject && (
                    <p className="kd-empty-note">
                      {zoneId === "landscape"
                        ? vi
                          ? "Chọn địa điểm từ dải thẻ bên dưới để tiếp tục khám phá."
                          : "Choose a place from the cards below to continue."
                        : vi
                          ? "Bạn vẫn có thể đọc giới thiệu và chọn hiện vật có tư liệu bên dưới."
                          : "You can still read the introduction and choose documented objects below."}
                    </p>
                  )}
                </>
              )}
            </div>

          </div>
          <article
            className="kd-detail"
            data-selected-place={entry.placeId}
            data-selected-entry={entry.id}
            data-selected-photo={point?.id ?? detailPhoto ?? ""}
            data-selected-point={point?.id ?? ""}
          >
            <div key={`image:${point?.id ?? "default"}`} className="kd-detail-image">
              {point ? (
                <GroundsPointImage image={point.images[0]} lang={lang} />
              ) : (
                <DiscoveryImage photo={detailPhoto} lang={lang} />
              )}
              <span>{vi ? "ĐIỂM KHÁM PHÁ" : "DISCOVERY"}</span>
            </div>
            <div
              key={`copy:${point?.id ?? "default"}`}
              className="kd-detail-copy"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="kd-kicker">
                {point ? (
                  `${point.number === undefined ? "" : `${String(point.number).padStart(2, "0")} · `}${point.category[lang]}`
                ) : zoneId === "landscape" && tab.aerial ? (
                  `${tab.aerial.markers.find(marker => marker.entryId === entry.id)?.number ?? ""} · ${place.tags[0][lang]}`
                ) : (
                  <>
                    {zone.title[lang]} ·{" "}
                    {vi ? "Văn hóa Khmer" : "Khmer culture"}
                  </>
                )}
              </span>
              <h3>
                {point?.title[lang] ?? (themedPanorama ? (vi ? "Khám phá các nghề truyền thống" : "Explore traditional crafts") : undefined) ??
                  entry.title?.[lang] ??
                  ((zoneId === "grounds" || roomOpen || artifact) && detail
                    ? detail.title[lang]
                    : place.title[lang])}
              </h3>
              <p>
                {point?.summary[lang] ?? (themedPanorama ? (vi ? "Chọn một chủ đề trong ảnh: Nghề dệt chiếu, Nghề vẽ tranh trên kiếng hoặc Nghề đan lát. Sau đó chọn hiện vật để xem chi tiết." : "Choose mat weaving, glass painting or basketry in the panorama, then select an exhibit to explore its details.") : undefined) ??
                  (zoneId === "landscape" ? place.description[lang] :
                  (zoneId === "grounds" || roomOpen || entry.trial) && detail
                    ? detail.caption[lang]
                    : place.short[lang])}
              </p>
              <div className="kd-observe">
                <span>{roomOpen && detail && !modelObject ? vi ? "NGUỒN ẢNH" : "PHOTO CREDIT" : vi ? "GỢI Ý QUAN SÁT" : "LOOK CLOSER"}</span>
                <p>
                  {roomOpen && detail && !modelObject ? detail.author : point?.observe[lang] ??
                    (modelObject ? vi ? "Kéo để xoay mô hình, dùng hai ngón tay hoặc nút cộng trừ để phóng gần." : "Drag to rotate; pinch or use plus and minus to zoom."
                    : entry.trial
                      ? vi
                        ? "Kéo để nhìn quanh không gian 360°"
                        : "Drag to look around the panorama"
                      : zoneId === "landscape" ? place.highlights[0].text[lang] : place.highlights[0].title[lang])}
                </p>
              </div>
              {(point?.floors ?? entry.floors) && (
                <div className="kd-floor-links">
                  {(point?.floors ?? entry.floors)!.map((id) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => changeTab(id)}
                    >
                      {
                        khmerPlaceZones.find((zone) => zone.id === id)!.title[
                          lang
                        ]
                      }
                      <ArrowRight />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="kd-detail-actions">
              <InlineAudioActions lang={lang} />
              <button
                type="button"
                className="kd-action"
                data-action="explore-khmer-place"
                onClick={(event) =>
                  point
                    ? setPointDetailId(point.id)
                    : currentObject ? setArtifact(currentObject)
                    : floor && !roomOpen
                      ? choose(entry, true)
                      : entry.trial
                        ? root.current
                            ?.querySelector<HTMLButtonElement>(
                              ".kd-panorama-controls button:last-child",
                            )
                            ?.click()
                        : onExplore(entry.placeId, event.currentTarget)
                }
              >
                {point
                  ? vi
                    ? "Khám phá chi tiết"
                    : "Explore details"
                  : floor && !roomOpen
                    ? vi
                      ? entry.trial
                        ? "Xem ảnh thử 360°"
                        : "Xem ảnh bên trong"
                      : "Look inside"
                    : vi
                      ? entry.trial
                        ? "Toàn màn hình"
                        : "Xem chi tiết"
                      : entry.trial
                        ? "Fullscreen"
                        : "Read more"}
                <ArrowRight />
              </button>
            </div>
          </article>
        </div>
        <div className="kd-bottom" data-card-count={stripCount}>
          <header className="kd-bottom-heading">
            <Flower2 aria-hidden="true" />
            <h3>{vi ? "KHÁM PHÁ KHÔNG GIAN DI SẢN" : "EXPLORE HERITAGE SPACES"}</h3>
            <p>{floorOverview ? zone.title[lang] : roomOpen ? place.title[lang] : vi ? "Những địa điểm gắn liền với văn hóa Khmer Trà Vinh" : "Places connected with Khmer culture in Trà Vinh"}</p>
            <span aria-hidden="true" />
          </header>
          <div
            className="kd-tabs"
            role="tablist"
            aria-label={vi ? "Khu vực khám phá" : "Exploration areas"}
          >
            {khmerDiscoveryTabs.map((item, index) => (
              <button
                key={item.id}
                id={`kd-tab-${item.id}`}
                type="button"
                role="tab"
                data-place-zone={item.id}
                aria-selected={zoneId === item.id}
                aria-controls="kd-tab-panel"
                tabIndex={zoneId === item.id ? 0 : -1}
                onClick={() => changeTab(item.id)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % khmerDiscoveryTabs.length
                      : event.key === "ArrowLeft"
                        ? (index + khmerDiscoveryTabs.length - 1) %
                          khmerDiscoveryTabs.length
                        : event.key === "ArrowDown" || event.key === "ArrowUp"
                          ? (index + 2) % khmerDiscoveryTabs.length
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? khmerDiscoveryTabs.length - 1
                              : -1;
                  if (next < 0) return;
                  event.preventDefault();
                  changeTab(khmerDiscoveryTabs[next].id);
                  document
                    .getElementById(`kd-tab-${khmerDiscoveryTabs[next].id}`)
                    ?.focus();
                }}
              >
                {(() => { const Icon = zoneIcons[item.id]; return <Icon aria-hidden="true" />; })()}
                <span>
                  {
                    khmerPlaceZones.find((zone) => zone.id === item.id)!
                      .title[lang]
                  }
                </span>
                <small>{item.panoramaEntry?.panorama?.points?.length ?? item.entries[0]?.panorama?.points?.length ?? item.entries.length}</small>
              </button>
            ))}
          </div>
          <div
            className="kd-strip"
            ref={strip}
            role="group"
            aria-label={
              roomOpen
                ? vi
                  ? "Ảnh và hiện vật trong gian"
                  : "Photos and objects in this display"
                : zone.title[lang]
            }
          >
            {panorama?.points && !themedPanorama &&
              panorama.points.filter(item => !item.targetEntryId || item.showInStrip).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-point-card={item.id}
                  aria-pressed={pointId === item.id}
                  onClick={() => choosePoint(item.id)}
                >
                  <GroundsPointImage image={item.images[0]} lang={lang} />
                  <DiscoveryCardCaption title={`${String(item.number).padStart(2, "0")} · ${item.title[lang]}`} category={item.category[lang]} icon={groundsIcons[item.id] ?? Landmark} />
                </button>
              ))}
            {roomOpen && !floorOverview ? (
              <>
                {entry.photos.map((photo, index) => (
                  <button
                    type="button"
                    key={`photo-${photo}`}
                    data-photo-card={photo}
                    aria-pressed={!modelObject && index === photoIndex && (!selectedObject || selectedObject.photo === photo)}
                    onClick={() => changePhoto(index)}
                  >
                    <DiscoveryImage photo={photo} lang={lang} />
                    <DiscoveryCardCaption title={khmerPlacePhotos[photo].title[lang]} category={entry.trial ? vi ? "Ảnh thử do bạn cung cấp" : "User-supplied test image" : vi ? "Ảnh trong khu trưng bày" : "Display photograph"} icon={placeIcons[place.icon]} />
                  </button>
                ))}
                {stripObjects.map((object) => (
                  <button
                    type="button"
                    key={`object-${object.id}`}
                    data-object-card={object.id}
                    aria-pressed={selectedObject?.id === object.id}
                    onClick={() => {
                      setArtifact(null);
                      setObjectSelections(previous => ({ ...previous, [entry.id]: object.id }));
                    }}
                  >
                    <DiscoveryImage photo={object.photo} lang={lang} />
                    <DiscoveryCardCaption title={khmerPlacePhotos[object.photo].title[lang]} category={object.model ? vi ? "Hiện vật · Mô hình 3D & câu chuyện" : "Object · 3D model & story" : vi ? "Hiện vật · Khám phá chi tiết" : "Object · Explore details"} icon={placeIcons[place.icon]} />
                  </button>
                ))}
                {!entry.photos.length && !entry.objects.length && (
                  <p className="kd-strip-empty">
                    {vi
                      ? "Chưa có ảnh và hiện vật cho khu vực này. Bạn có thể xem phần giới thiệu."
                      : "No photographs or objects available for this area. You can read its introduction."}
                  </p>
                )}
              </>
            ) : (
              zoneId !== "grounds" && (sceneCards ?? tab.entries).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-place-id={item.placeId}
                  data-entry-card={item.id}
                  aria-pressed={item.id === entry.id && !point}
                  onClick={() => zoneId === "landscape" ? travelComplex(item) : choose(item, floor)}
                >
                  <DiscoveryImage photo={item.cover} lang={lang} />
                  <DiscoveryCardCaption title={`${tab.aerial ? `${tab.aerial.markers.find(marker => marker.entryId === item.id)?.number ?? ""}. ` : ""}${item.viewpointTitle?.[lang] ?? item.title?.[lang] ?? findKhmerPlace(item.placeId).title[lang]}`} category={sceneCards ? vi ? "Góc nhìn 360° trong phòng" : "360° room viewpoint" : floor ? vi ? "Chọn khu · Xem bên trong" : "Choose area · Look inside" : zoneId === "landscape" ? findKhmerPlace(item.placeId).tags[0][lang] : zone.title[lang]} icon={placeIcons[findKhmerPlace(item.placeId).icon]} />
                </button>
              ))
            )}
          </div>
          <div className="kd-directory-area">
            <button type="button" className="kd-directory" onClick={onDirectory}>
              <span>{vi
              ? `Tất cả ${khmerPlaces.length} điểm`
              : `All ${khmerPlaces.length} places`}</span>
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
      {artifact && (
        <ObjectDetail
          object={artifact}
          startWithPhoto={modelObject?.id === artifact.id}
          room={entry}
          lang={lang}
          close={() => setArtifact(null)}
        />
      )}
      {pointDetail && (
        <KhmerGroundsPointDetail
          key={pointDetail.id}
          point={pointDetail}
          lang={lang}
          close={() => setPointDetailId(undefined)}
          onFloor={changeTab}
        />
      )}
    </section>
  );
}
