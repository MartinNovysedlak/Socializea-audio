/**
 * Po vite build vytvorí HTML súbory pre marketingové routes
 * so správnymi meta tagmi v počiatočnom HTML (FB/WA/Twitter crawleri).
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const SITE_URL = 'https://socializea-audio.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const pages = [
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

function escapeAttr(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function absoluteUrl(path) {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

function injectMeta(html, page) {
  const url = absoluteUrl(page.path);
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);

  let next = html;

  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  const replacements = [
    [/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`],
    [/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${DEFAULT_IMAGE}" />`],
    [/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`],
    [/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${DEFAULT_IMAGE}" />`],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(next)) {
      next = next.replace(pattern, replacement);
    } else {
      next = next.replace('</head>', `    ${replacement}\n  </head>`);
    }
  }

  return next;
}

function outputPathFor(routePath) {
  if (routePath === '/') return join(distDir, 'index.html');
  return join(distDir, routePath.replace(/^\//, ''), 'index.html');
}

const templatePath = join(distDir, 'index.html');
const template = readFileSync(templatePath, 'utf8');

for (const page of pages) {
  const html = injectMeta(template, page);
  const outPath = outputPathFor(page.path);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`prerender-seo: ${page.path} -> ${outPath.replace(root + '\\', '').replace(root + '/', '')}`);
}

// Ensure crawlers can discover pages
const sitemapUrls = pages
  .map(
    (p) => `  <url>
    <loc>${absoluteUrl(p.path)}</loc>
    <changefreq>${p.path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('prerender-seo: sitemap.xml written');
console.log('prerender-seo: done');
