/**
 * Po vite build vytvorí HTML súbory pre marketingové routes
 * so správnymi meta tagmi v počiatočnom HTML (Google/FB/WA/Twitter).
 * Sitemap doplní aj detaily produktov, prenájmu a blogu zo Supabase.
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

function loadDotEnv() {
  try {
    const raw = readFileSync(join(root, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // .env nemusí existovať v CI – použijú sa fallbacky ako v supabase.ts
  }
}

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

function isoDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function clipMeta(text, fallback, max = 160) {
  const cleaned = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return fallback;
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

function firstImage(value) {
  if (Array.isArray(value) && value[0]) return value[0];
  if (typeof value === 'string' && value) return value;
  return '';
}

function injectMeta(html, page) {
  const url = absoluteUrl(page.path);
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const keywords = escapeAttr(page.keywords || '');
  const image = escapeAttr(page.image || DEFAULT_IMAGE);

  let next = html;

  next = next.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  const replacements = [
    [/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${url}" />`],
    [/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`],
    [/<meta name="keywords" content="[^"]*"\s*\/?>/i, `<meta name="keywords" content="${keywords}" />`],
    [/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`],
    [/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`],
    [/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}" />`],
    [/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${image}" />`],
    [/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`],
    [/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`],
    [/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${image}" />`],
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

function sitemapUrl(path, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${absoluteUrl(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${Number(priority).toFixed(1)}</priority>
  </url>`;
}

async function fetchRows(table, select) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co';
  const supabaseKey =
    process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT';

  const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!res.ok) {
    console.warn(`prerender-seo: ${table} fetch failed (${res.status})`);
    return [];
  }

  const rows = await res.json();
  return Array.isArray(rows) ? rows : [];
}

async function collectDynamicPages(today) {
  const extraUrls = [];
  const detailPages = [];

  try {
    const [sales, equipment, posts] = await Promise.all([
      fetchRows('sales', 'id,name,description,images,created_at'),
      fetchRows('equipment', 'id,name,description,main_image,images,price_per_day,updated_at,created_at'),
      fetchRows('blog_posts', 'id,title,excerpt,image,published_at'),
    ]);

    for (const row of sales) {
      if (!row?.id) continue;
      const path = `/predaj/${row.id}`;
      extraUrls.push(sitemapUrl(path, isoDate(row.created_at) || today, 'weekly', 0.7));
      detailPages.push({
        path,
        title: `${row.name || 'Produkt'} | Socializea Audio – Predaj`,
        description: clipMeta(
          row.description,
          `Kúpte ${row.name || 'produkt'} v Socializea Audio. Profesionálna audio a svetelná technika.`
        ),
        image: firstImage(row.images),
      });
    }
    for (const row of equipment) {
      if (!row?.id) continue;
      const path = `/prenajom/${row.id}`;
      extraUrls.push(sitemapUrl(path, isoDate(row.updated_at || row.created_at) || today, 'weekly', 0.7));
      const snippet = clipMeta(row.description, '', 120);
      detailPages.push({
        path,
        title: `${row.name || 'Prenájom'} | Socializea Audio`,
        description: snippet
          ? `Prenájom ${row.name} – ${snippet}${snippet.endsWith('…') ? '' : '.'} Cena: ${row.price_per_day} € / deň.`
          : `Prenájom ${row.name || 'techniky'}. Cena: ${row.price_per_day ?? ''} € / deň. Socializea Audio.`,
        image: row.main_image || firstImage(row.images),
      });
    }
    for (const row of posts) {
      if (!row?.id) continue;
      const path = `/blog/${row.id}`;
      extraUrls.push(sitemapUrl(path, isoDate(row.published_at) || today, 'monthly', 0.6));
      detailPages.push({
        path,
        title: `${row.title || 'Článok'} | Socializea Audio Blog`,
        description: clipMeta(
          row.excerpt,
          `${row.title || 'Článok'}. Článok na blogu Socializea Audio o ozvučení a svetelnej technike.`
        ),
        image: row.image,
      });
    }

    console.log(
      `prerender-seo: sitemap extras sales=${sales.length} equipment=${equipment.length} blog=${posts.length}`
    );
  } catch (err) {
    console.warn('prerender-seo: dynamic sitemap skipped', err?.message || err);
  }

  return { extraUrls, detailPages };
}

async function main() {
  loadDotEnv();

  const today = new Date().toISOString().slice(0, 10);
  const { extraUrls, detailPages } = await collectDynamicPages(today);

  const templatePath = join(distDir, 'index.html');
  try {
    const template = readFileSync(templatePath, 'utf8');
    for (const page of [...pages, ...detailPages]) {
      const html = injectMeta(template, page);
      const outPath = outputPathFor(page.path);
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html, 'utf8');
      console.log(`prerender-seo: ${page.path}`);
    }
  } catch {
    console.warn('prerender-seo: dist/index.html missing, skipping HTML prerender');
  }

  const staticUrls = pages.map((p) =>
    sitemapUrl(p.path, today, p.changefreq || 'monthly', p.priority ?? 0.5)
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...extraUrls].join('\n')}
</urlset>
`;

  try {
    mkdirSync(distDir, { recursive: true });
    writeFileSync(join(distDir, 'sitemap.xml'), sitemap, 'utf8');
  } catch {
    console.warn('prerender-seo: could not write dist/sitemap.xml');
  }
  writeFileSync(join(root, 'public/sitemap.xml'), sitemap, 'utf8');
  console.log('prerender-seo: sitemap.xml written');
  console.log('prerender-seo: done');
}

await main();
