import { useEffect, useState } from 'react';
import type { DetailHostAction, DetailHostControls } from './hostControls';

export function useKioskHost() {
  const [host, setHost] = useState<DetailHostControls | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (window.parent === window || event.origin !== window.location.origin || event.source !== window.parent || event.data?.channel !== 'con-chim-detail' || event.data.type !== 'host-controls') return;
      const controls = event.data.controls;
      if (!controls || !Array.isArray(controls.actions)) return;
      setHost(controls);
    };
    window.addEventListener('message', receive);
    if (window.parent !== window) window.parent.postMessage({ channel:'con-chim-detail', type:'host-controls-request' }, window.location.origin);
    return () => window.removeEventListener('message', receive);
  }, []);
  return { host, act: (action: DetailHostAction) => {
    if (host?.actions.includes(action)) window.parent.postMessage({ channel:'con-chim-detail', type:'host-action', action }, window.location.origin);
  } };
}
