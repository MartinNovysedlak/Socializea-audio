/** Primárna produkčná doména – používať všade pre canonical, OG a schema. */
export const SITE_URL = 'https://www.socializea-audio.com';

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absoluteAsset(path: string): string {
  return absoluteUrl(path);
}

export function clipMeta(text: string | null | undefined, fallback: string, max = 160): string {
  const cleaned = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}
