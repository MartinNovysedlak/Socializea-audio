export const SITE_PAGES: { path: string; label: string }[] = [
  { path: '/', label: 'Domov' },
  { path: '/prenajom', label: 'Prenájom' },
  { path: '/predaj', label: 'Predaj' },
  { path: '/blog', label: 'Blog' },
  { path: '/kontakt', label: 'Kontakt' },
  { path: '/obchodne-podmienky', label: 'Obchodné podmienky' },
  { path: '/podmienky-pouzivania', label: 'Ochrana súkromia' },
];

export function pageLabel(path: string): string {
  const known = SITE_PAGES.find((p) => p.path === path);
  if (known) return known.label;
  if (path.startsWith('/prenajom/')) return `Prenájom detail`;
  if (path.startsWith('/predaj/')) return `Predaj detail`;
  if (path.startsWith('/blog/')) return `Blog článok`;
  return path;
}
