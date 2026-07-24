import { createClient } from '@supabase/supabase-js';
import { MERCHANT_PRODUCT_IDS, resolveMerchantMeta } from './catalog';

const SITE_URL = 'https://socializea-audio.com';

type SalesRow = {
  id: string;
  name: string;
  price: number;
  condition: 'new' | 'used' | string;
  description: string | null;
  images: string[] | null;
  available: boolean | null;
  available_count: number | null;
  brand?: string | null;
  gtin?: string | null;
  mpn?: string | null;
};

type Req = { method?: string };
type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
  json: (body: Record<string, unknown>) => void;
};

const FALLBACK_PRODUCTS: SalesRow[] = [
  {
    id: 'sale-3',
    name: 'Profesionálny výkonný pohyblivý Laserový BAR 65W (červený)',
    price: 270,
    condition: 'new',
    description:
      'Profesionálny výkonný pohyblivý Laserový BAR o výkone 65W je ideálnou voľbou pre DJ akcie, kluby, bary, diskotéky, svadby, eventy alebo domáce party.',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'],
    available: true,
    available_count: 2,
  },
  {
    id: 'sale-4',
    name: 'Profesionálna otočná a rotujúca RGBW LED hlava 90W',
    price: 140,
    condition: 'new',
    description:
      'Profesionálna rotujúca RGBW hlava o výkone 90W je ideálna pre DJ akcie, koncerty a klubové večery.',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
    available: true,
    available_count: 4,
  },
  {
    id: 'sale-5',
    name: 'Profesionálny výrobník ohňa – Flame Machine',
    price: 120,
    condition: 'new',
    description:
      'Dramatické efekty pre koncerty a vystúpenia. Produkcia realistického a bezpečného plameňa.',
    images: ['https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800'],
    available: true,
    available_count: 2,
  },
  {
    id: 'sale-6',
    name: 'Profesionálna RGBW 4v1 LED BAR svetelná lišta 36W',
    price: 35,
    condition: 'new',
    description:
      'Ideálna pre DJ akcie, kluby, svadby a divadlá. Vytvára bohaté farebné efekty a dynamickú atmosféru.',
    images: ['https://images.unsplash.com/photo-1557683316-973673baf926?w=800'],
    available: true,
    available_count: 8,
  },
];

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatPrice(price: number): string {
  return `${price.toFixed(2)} EUR`;
}

function mapCondition(condition: string): 'new' | 'used' | 'refurbished' {
  if (condition === 'used') return 'used';
  return 'new';
}

function buildItemXml(item: SalesRow): string | null {
  const name = (item.name || '').trim();
  const price = Number(item.price);
  if (!name || !Number.isFinite(price) || price <= 0) return null;

  const meta = resolveMerchantMeta(item.id, name);
  if (!meta) return null;

  const brand = (item.brand || meta.brand).trim();
  const mpn = (item.mpn || meta.mpn).trim();

  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const imageLink = images[0];
  if (!imageLink) return null;

  const available =
    item.available === true || (item.available_count != null && item.available_count > 0);
  const description = stripHtml(item.description || name).slice(0, 5000);
  const link = `${SITE_URL}/predaj/${encodeURIComponent(item.id)}`;
  const additionalImages = images.slice(1, 10);

  const lines = [
    '    <item>',
    `      <g:id>${escapeXml(item.id)}</g:id>`,
    `      <g:title>${escapeXml(name.slice(0, 150))}</g:title>`,
    `      <g:description>${escapeXml(description)}</g:description>`,
    `      <g:link>${escapeXml(link)}</g:link>`,
    `      <g:image_link>${escapeXml(imageLink)}</g:image_link>`,
    ...additionalImages.map(
      (img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`
    ),
    `      <g:availability>${available ? 'in_stock' : 'out_of_stock'}</g:availability>`,
    `      <g:price>${formatPrice(price)}</g:price>`,
    `      <g:brand>${escapeXml(brand)}</g:brand>`,
    `      <g:condition>${mapCondition(String(item.condition || 'new'))}</g:condition>`,
    `      <g:mpn>${escapeXml(mpn)}</g:mpn>`,
    '      <g:identifier_exists>no</g:identifier_exists>',
    `      <g:google_product_category>${escapeXml(meta.google_product_category)}</g:google_product_category>`,
    `      <g:product_type>${escapeXml(meta.product_type)}</g:product_type>`,
    '      <g:shipping>',
    '        <g:country>SK</g:country>',
    '        <g:service>Standard</g:service>',
    '        <g:price>0.00 EUR</g:price>',
    '      </g:shipping>',
    '    </item>',
  ];

  return lines.join('\n');
}

function onlyMerchantProducts(rows: SalesRow[]): SalesRow[] {
  const allowed = new Set(MERCHANT_PRODUCT_IDS);
  return rows.filter((row) => allowed.has(row.id));
}

async function loadProducts(): Promise<SalesRow[]> {
  const supabaseUrl =
    process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co';
  const supabaseAnonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT';

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const filtered = onlyMerchantProducts(data as SalesRow[]);
      if (filtered.length > 0) return filtered;
    }
  } catch {
    // fallback nižšie
  }

  return FALLBACK_PRODUCTS;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') {
    res.status(405);
    return res.json({ status: 'error', message: 'Method not allowed' });
  }

  const products = await loadProducts();
  const itemsXml = products
    .map(buildItemXml)
    .filter((x): x is string => Boolean(x))
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Socializea Audio – Predaj techniky</title>
    <link>${SITE_URL}/predaj</link>
    <description>Predaj profesionálnej audio a svetelnej techniky – Socializea Audio.</description>
${itemsXml}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
  res.status(200).send(xml);
}
