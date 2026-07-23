/** Primárna produkčná doména – používať všade pre canonical, OG a schema. */
export const SITE_URL = 'https://socializea-audio.com';

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absoluteAsset(path: string): string {
  return absoluteUrl(path);
}
