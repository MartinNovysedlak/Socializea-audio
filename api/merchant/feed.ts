import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://www.socializea-audio.com';

type SalesRow = {
  id: string;
  name: string;
  price: number;
  condition?: string;
  description?: string | null;
  images?: string[] | null;
  available?: boolean | null;
  available_count?: number | null;
};

type MerchantMeta = {
  brand: string;
  mpn: string;
  google_product_category: string;
  product_type: string;
};

const CATALOG: Record<string, MerchantMeta> = {
  'sale-3': {
    brand: 'StagePulse',
    mpn: 'SP-LASER-BAR-65W-RED',
    google_product_category: '549',
    product_type: 'Svetelná technika > Laserové efekty',
  },
  'sale-4': {
    brand: 'StagePulse',
    mpn: 'SP-RGBW-HEAD-90W',
    google_product_category: '549',
    product_type: 'Svetelná technika > Moving Head',
  },
  'sale-5': {
    brand: 'StagePulse',
    mpn: 'SP-FLAME-MACHINE',
    google_product_category: '549',
    product_type: 'Svetelná technika > Špeciálne efekty',
  },
  'sale-6': {
    brand: 'StagePulse',
    mpn: 'SP-RGBW-BAR-36W',
    google_product_category: '549',
    product_type: 'Svetelná technika > LED BAR',
  },
};

const FALLBACK: SalesRow[] = [
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildItem(item: SalesRow): string | null {
  const meta = CATALOG[item.id];
  if (!meta) return null;

  const name = String(item.name || '').trim();
  const price = Number(item.price);
  if (!name || !Number.isFinite(price) || price <= 0) return null;

  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  if (!images[0]) return null;

  const inStock =
    item.available === true ||
    (typeof item.available_count === 'number' && item.available_count > 0);

  const description = stripHtml(item.description || name).slice(0, 5000);
  const condition = item.condition === 'used' ? 'used' : 'new';
  const link = `${SITE_URL}/predaj/${encodeURIComponent(item.id)}`;
  const extraImages = images.slice(1, 10);

  return [
    '    <item>',
    `      <g:id>${escapeXml(item.id)}</g:id>`,
    `      <g:title>${escapeXml(name.slice(0, 150))}</g:title>`,
    `      <g:description>${escapeXml(description)}</g:description>`,
    `      <g:link>${escapeXml(link)}</g:link>`,
    `      <g:image_link>${escapeXml(images[0])}</g:image_link>`,
    ...extraImages.map(
      (img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`
    ),
    `      <g:availability>${inStock ? 'in_stock' : 'out_of_stock'}</g:availability>`,
    `      <g:price>${price.toFixed(2)} EUR</g:price>`,
    `      <g:brand>${escapeXml(meta.brand)}</g:brand>`,
    `      <g:condition>${condition}</g:condition>`,
    `      <g:mpn>${escapeXml(meta.mpn)}</g:mpn>`,
    '      <g:identifier_exists>no</g:identifier_exists>',
    `      <g:google_product_category>${escapeXml(meta.google_product_category)}</g:google_product_category>`,
    `      <g:product_type>${escapeXml(meta.product_type)}</g:product_type>`,
    '      <g:shipping>',
    '        <g:country>SK</g:country>',
    '        <g:service>Standard</g:service>',
    '        <g:price>0.00 EUR</g:price>',
    '      </g:shipping>',
    '    </item>',
  ].join('\n');
}

async function loadProducts(): Promise<SalesRow[]> {
  const allowed = new Set(Object.keys(CATALOG));

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co',
      process.env.VITE_SUPABASE_ANON_KEY ||
        'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT'
    );

    const { data, error } = await supabase
      .from('sales')
      .select('id,name,price,condition,description,images,available,available_count')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const filtered = (data as SalesRow[]).filter((row) => allowed.has(row.id));
      if (filtered.length > 0) return filtered;
    }
  } catch {
    // fallback
  }

  return FALLBACK;
}

function sendXml(res: any, status: number, xml: string) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=900');
  res.end(xml);
}

function sendJson(res: any, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      return sendJson(res, 405, { status: 'error', message: 'Method not allowed' });
    }

    const products = await loadProducts();
    const items = products.map(buildItem).filter(Boolean).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Socializea Audio – Predaj techniky</title>
    <link>${SITE_URL}/predaj</link>
    <description>Predaj profesionálnej audio a svetelnej techniky – Socializea Audio.</description>
${items}
  </channel>
</rss>`;

    return sendXml(res, 200, xml);
  } catch (err: any) {
    return sendJson(res, 500, {
      status: 'error',
      message: err?.message || 'Feed generation failed',
    });
  }
}
