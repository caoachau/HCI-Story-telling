/** Google serves both /vt?lyrs=... and /vt/lyrs=... tile URLs. The map's
 * templates use the second form, whose parameters live in the path rather
 * than URL.searchParams. Recognize both before consulting the local pack.
 */
export function getGoogleTileParams(url: string): URLSearchParams | null {
  const match = /^https:\/\/mt[0-3]\.google\.com\/vt[/?]([^#]+)/.exec(url);
  return match ? new URLSearchParams(match[1]) : null;
}
