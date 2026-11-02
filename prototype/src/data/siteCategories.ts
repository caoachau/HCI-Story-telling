import type { HeritageSite } from './heritageSites';

export function isSiteInCategory(site: HeritageSite, category: string): boolean {
  if (category === 'khmer') return ['ao-ba-om', 'chua-ang', 'bao-tang-khmer'].includes(site.id);
  if (category === 'eco') return ['con-chim', 'bien-ba-dong', 'ao-ba-om'].includes(site.id);
  if (category === 'history') return ['den-tho-bac', 'chua-hang', 'chua-ang'].includes(site.id);
  return true;
}
