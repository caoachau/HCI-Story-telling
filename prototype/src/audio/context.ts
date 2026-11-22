import { useEffect } from 'react';
import { updateRoute, type SiteId } from '../experience/state';

/** Persist the currently displayed item for both QR and the shared listen tool. */
export function useAudioContentContext(id: string, active: boolean, siteId: SiteId = 'bao-tang-khmer') {
  useEffect(() => { if (active) updateRoute({ listen: id }, siteId); }, [id, active, siteId]);
}
