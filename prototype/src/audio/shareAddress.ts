/** A LAN link is usable only from a device with a route to that network. */
export function isLocalNetworkUrl(value: string) {
  try {
    const host = new URL(value).hostname.toLowerCase();
    return /^10\./.test(host) || /^192\.168\./.test(host)
      || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
      || host.endsWith('.local') || /^\[(fc|fd|fe80:)/.test(host);
  } catch { return false; }
}
