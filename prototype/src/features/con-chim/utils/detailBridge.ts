/** Only exchange messages with the same-origin host that owns this frame. */
export function installDetailBridge() {
  const embedded = window.parent !== window;
  const send = (type: string) => {
    if (embedded) window.parent.postMessage({ channel: 'con-chim-detail', type }, window.location.origin);
  };
  window.addEventListener('message', event => {
    if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.channel !== 'con-chim-detail') return;
    if (event.data.type === 'preferences') document.documentElement.classList.toggle('reduce-motion', !!event.data.reduceMotion);
  });
  document.addEventListener('click', () => send('interaction'), { passive: true });
  document.addEventListener('change', () => send('interaction'));
  let modal: HTMLElement | null = null;
  let returnFocus: HTMLElement | null = null;
  let previousOverflow = '';
  const inertNodes = new Map<HTMLElement, boolean>();
  const root = document.getElementById('root')!;
  const observer = new MutationObserver(() => {
    const next = [...root.querySelectorAll<HTMLElement>('[data-detail-modal]')].at(-1) ?? null;
    if (modal === next) return;
    inertNodes.forEach((wasInert, node) => { node.inert = wasInert; });
    inertNodes.clear();
    if (next) {
      if (!modal) {
        returnFocus = document.activeElement as HTMLElement;
        previousOverflow = document.documentElement.style.overflow;
      }
      document.documentElement.style.overflow = 'hidden';
      next.setAttribute('role', 'dialog');
      next.setAttribute('aria-modal', 'true');
      next.setAttribute('aria-label', next.querySelector('h2, h3, h4')?.textContent?.trim() || 'Xem chi tiết');
      let branch: HTMLElement = next;
      while (branch.parentElement && branch !== root) {
        for (const sibling of branch.parentElement.children) {
          if (sibling instanceof HTMLElement && sibling !== branch) {
            inertNodes.set(sibling, sibling.inert);
            sibling.inert = true;
          }
        }
        branch = branch.parentElement;
      }
      const close = next.querySelector<HTMLButtonElement>('button');
      if (close) {
        if (!close.getAttribute('aria-label')) close.setAttribute('aria-label', 'Đóng cửa sổ');
        close.focus({ preventScroll: true });
      }
    } else if (modal) {
      document.documentElement.style.overflow = previousOverflow;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    }
    modal = next;
  });
  observer.observe(root, { childList: true, subtree: true });
  document.addEventListener('keydown', event => {
    if (!modal) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      modal.querySelector<HTMLButtonElement>('button')?.click();
    }
    if (event.key === 'Tab') {
      const items = [...modal.querySelectorAll<HTMLElement>('button, a[href], input, textarea, select, summary, [tabindex="0"]')].filter(el => !el.hasAttribute('disabled') && el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      const outside = !items.includes(document.activeElement as HTMLElement);
      if (event.shiftKey && (document.activeElement === first || outside)) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && (document.activeElement === last || outside)) { event.preventDefault(); first?.focus(); }
    }
  });
  const ready = new MutationObserver(() => {
    if (!root.querySelector('main')) return;
    send('ready');
    ready.disconnect();
  });
  ready.observe(root, { childList: true, subtree: true });
  window.addEventListener('pagehide', () => { observer.disconnect(); ready.disconnect(); }, { once: true });
}
