/** Primárna produkčná doména – používať všade pre canonical, OG a schema. */
export const SITE_URL = 'https://socializea-audio.com';

export function absoluteUrl(path = '/'): string {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absoluteAsset(path: string): string {
  return absoluteUrl(path);
}

export type MarketingPageMeta = {
  path: string;
  title: string;
  description: string;
};

/** Statické marketingové stránky – prerender meta pre crawlerov (FB/WA/Twitter). */
export const MARKETING_PAGES: MarketingPageMeta[] = [
  {
    path: '/',
    title: 'Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky',
    description:
      'Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly. Špičkový zvuk, dychberúce osvetlenie a DJ služby po celom Slovensku.',
  },
  {
    path: '/prenajom',
    title: 'Prenájom Audio & Svetelnej Techniky | Socializea Audio',
    description:
      'Prenájom profesionálnej zvukovej a svetelnej techniky – reproduktory, subwoofery, mixážne pulty, mikrofóny, LED svetlá, lasery, dymostroje.',
  },
  {
    path: '/predaj',
    title: 'Predaj Audio & Svetelnej Techniky | Socializea Audio',
    description:
      'Kúpte si profesionálnu audio a svetelnú techniku – reproduktory, subwoofery, mixážne pulty, mikrofóny, LED svetlá, lasery.',
  },
  {
    path: '/blog',
    title: 'Blog – Rady, Tipy & Novinky zo Sveta Audio Techniky | Socializea Audio',
    description:
      'Odborné články o nastavení svetiel, výbere ozvučenia na svadbu, trendoch v eventovej technike a DJ vybavení.',
  },
  {
    path: '/kontakt',
    title: 'Kontakt | Socializea Audio',
    description:
      'Kontaktujte Socializea Audio – prenájom a predaj zvukovej a svetelnej techniky. Čadca, Žilina a celé Slovensko.',
  },
  {
    path: '/obchodne-podmienky',
    title: 'Obchodné podmienky | Socializea-audio – Prenájom & Predaj Techniky',
    description:
      'Úplné obchodné podmienky prenájmu a predaja profesionálnej zvukovej a svetelnej techniky Socializea-audio.',
  },
  {
    path: '/podmienky-pouzivania',
    title: 'Podmienky používania a Ochrana súkromia | Socializea-audio',
    description:
      'Podmienky používania webovej stránky socializea-audio.com vrátane ochrany osobných údajov (GDPR), cookies politiky a autorských práv.',
  },
];
