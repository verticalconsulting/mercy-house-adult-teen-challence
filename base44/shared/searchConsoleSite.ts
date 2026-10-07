// Shared helper for Google Search Console functions. The connected GSC account
// may have multiple verified properties; we always want the one for the Mercy
// House site (mercyhouseatc.com), not whichever property happens to sort first.

const PREFERRED_DOMAIN = 'mercyhouseatc.com';

/**
 * From a list of GSC site entries (as returned by the webmasters API), pick the
 * one that belongs to the Mercy House site. Falls back to the first entry if no
 * match is found.
 */
export function pickMercyHouseSite(sites: { siteUrl: string }[]): string | null {
  if (!sites || sites.length === 0) return null;
  const match = sites.find((s) =>
    s.siteUrl.toLowerCase().includes(PREFERRED_DOMAIN)
  );
  return (match || sites[0]).siteUrl;
}