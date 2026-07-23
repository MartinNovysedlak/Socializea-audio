/**
 * Po vite build vytvorí HTML súbory pre marketingové routes
 * so správnymi meta tagmi v počiatočnom HTML (Google/FB/WA/Twitter).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const seo = JSON.parse(readFileSync(join(root, 'src/lib/seo-pages.json'), 'utf8'));

const SITE_URL = seo.siteUrl;
const DEFAULT_IMAGE = seo.defaultImage;
const pages = seo.pages;

function escapeAttr(value) {
  return String(value)
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
  const keywords = escapeAttr(page.keywords || '');

  let next = html;

  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  const replacements = [
    [/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`],
    [/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`],
    [/<meta name="keywords" content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`],
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
  console.log(`prerender-seo: ${page.path}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = pages
  .map(
    (p) => `  <url>
    <loc>${absoluteUrl(p.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq || 'monthly'}</changefreq>
    <priority>${Number(p.priority ?? 0.5).toFixed(1)}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;

writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8');
console.log('prerender-seo: sitemap.xml written');
console.log('prerender-seo: done');
