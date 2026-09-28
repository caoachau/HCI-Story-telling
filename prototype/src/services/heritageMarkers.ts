import type { HeritageSite } from '../data/heritageSites';

const markerImages = import.meta.glob('../assets/heritage-markers/*.{png,webp,avif,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

const markerLabels: Record<string, { vi: string; en: string }> = {
  'ao-ba-om': { vi: 'Ao Bà Om', en: 'Ba Om Pond' },
  'chua-ang': { vi: 'Chùa Âng', en: 'Ang Pagoda' },
  'bao-tang-khmer': { vi: 'Bảo tàng Khmer', en: 'Khmer Museum' },
  'chua-hang': { vi: 'Chùa Hang', en: 'Hang Pagoda' },
  'den-tho-bac': { vi: 'Đền thờ Bác', en: 'Ho Chi Minh Memorial' },
  'con-chim': { vi: 'Cồn Chim', en: 'Con Chim Island' },
  'bien-ba-dong': { vi: 'Biển Ba Động', en: 'Ba Dong Beach' },
};

function getMarkerImage(site: HeritageSite): string | undefined {
  return Object.entries(markerImages).find(([path]) => path.split('/').at(-1)?.replace(/\.[^.]+$/, '') === site.id)?.[1];
}

export function createHeritageMarker(site: HeritageSite, index: number, onActivate: () => void): HTMLButtonElement {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = 'heritage-marker';
  element.dataset.siteId = site.id;
  element.innerHTML = `
    <span class="heritage-marker__body">
      <span class="heritage-marker__label">
        <span class="heritage-marker__index">${String(index + 1).padStart(2, '0')}</span>
        <span class="heritage-marker__name"></span>
        <span class="heritage-marker__indicator" aria-hidden="true"></span>
      </span>
      <span class="heritage-marker__scene" aria-hidden="true">
        <span class="heritage-marker__halo"></span>
        <span class="heritage-marker__model"><img class="heritage-marker__image" alt="" draggable="false" /></span>
        <span class="heritage-marker__status"></span>
      </span>
    </span>
    <span class="heritage-marker__stem" aria-hidden="true"></span>
    <span class="heritage-marker__ground" aria-hidden="true">
      <span class="heritage-marker__ripple"></span>
      <span class="heritage-marker__ripple heritage-marker__ripple--delayed"></span>
      <span class="heritage-marker__plinth"></span>
      <span class="heritage-marker__anchor"></span>
    </span>
  `;

  const image = element.querySelector<HTMLImageElement>('.heritage-marker__image')!;
  const markerImage = getMarkerImage(site);
  element.dataset.imageKind = markerImage ? 'cutout' : 'photo';
  image.decoding = 'async';
  image.width = 128;
  image.height = 104;
  image.src = markerImage ?? site.heroImage;
  image.addEventListener('error', () => {
    if (element.dataset.imageKind === 'cutout') {
      element.dataset.imageKind = 'photo';
      image.src = site.heroImage;
    } else {
      element.dataset.imageKind = 'unavailable';
    }
  });
  element.addEventListener('click', (event) => {
    event.stopPropagation();
    onActivate();
  });
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
  });
  return element;
}

export function updateHeritageMarkerLayout(element: HTMLElement, siteId: string, zoom: number): void {
  // The three city landmarks share almost the same pixel at province scale.
  // Spread only their artwork; the ground anchor remains at its real position.
  const spread = Math.max(0, Math.min(1, (14.8 - zoom) / 2.5));
  const clusterOffsets: Record<string, [number, number]> = {
    'ao-ba-om': [0, -124],
    'chua-ang': [-146, 0],
    'bao-tang-khmer': [146, 0],
  };
  const [baseX, baseY] = clusterOffsets[siteId] ?? [0, 0];
  const x = baseX * spread;
  const y = baseY * spread;
  element.style.setProperty('--marker-spread-x', `${x.toFixed(1)}px`);
  element.style.setProperty('--marker-spread-y', `${y.toFixed(1)}px`);
  element.style.setProperty('--marker-stem-length', `${Math.hypot(x, 26 - y).toFixed(1)}px`);
  element.style.setProperty('--marker-stem-angle', `${(Math.atan2(x, 26 - y) * 180 / Math.PI).toFixed(2)}deg`);
  element.style.setProperty('--marker-model-scale', zoom < 13 ? '0.74' : '0.86');
}

export function updateHeritageMarker(
  element: HTMLElement,
  site: HeritageSite,
  options: { lang: 'vi' | 'en'; visible: boolean; selected: boolean; viewing: boolean; muted: boolean; reduceMotion: boolean },
): void {
  const fullName = options.lang === 'vi' ? site.name : site.englishName;
  element.hidden = !options.visible;
  element.style.display = options.visible ? 'flex' : 'none';
  element.style.zIndex = options.selected ? '10' : '1';
  element.dataset.selected = String(options.selected);
  element.dataset.viewing = String(options.viewing);
  element.dataset.muted = String(options.muted);
  element.dataset.reduceMotion = String(options.reduceMotion);
  element.setAttribute('aria-pressed', String(options.selected));
  element.setAttribute('aria-label', `${fullName}. ${options.selected
    ? (options.lang === 'vi' ? 'Nhấn để đưa mốc về giữa bản đồ' : 'Press to recenter this landmark')
    : (options.lang === 'vi' ? 'Nhấn để khám phá địa điểm' : 'Press to explore this landmark')}`);
  element.title = fullName;
  element.querySelector('.heritage-marker__name')!.textContent = markerLabels[site.id]?.[options.lang] ?? fullName;
  element.querySelector('.heritage-marker__status')!.textContent = options.lang === 'vi' ? 'Đang xem' : 'Viewing';
}
