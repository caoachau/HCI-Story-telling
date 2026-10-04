export type DetailHostAction = 'panorama' | 'qr' | 'resize' | 'expand' | 'close';

export interface DetailHostControls {
  lang: 'vi' | 'en';
  isExpanded: boolean;
  isSidebarWide: boolean;
  actions: DetailHostAction[];
}
