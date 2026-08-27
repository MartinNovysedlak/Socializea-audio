import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://www.socializea-audio.com';
const SHIPPING_PRICE = '4.90 EUR';

type SalesRow = {
  id: string;
  name: string;
  price: number;
  condition?: string;
  description?: string | null;
  images?: string[] | null;
  available?: boolean | null;
  available_count?: number | null;
  brand?: string | null;
  mpn?: string | null;
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

const HOSTED_JPEG: Record<string, string> = {
  'sale-4': `${SITE_URL}/merchant/sale-4.jpg`,
};

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

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function resolveMerchantId(item: SalesRow): string {
  const n = normalizeName(item.name || '');
  if (n.includes('laser')) return 'sale-3';
  if (n.includes('flame') || n.includes('ohna')) return 'sale-5';
  if (n.includes('hlava') || n.includes('90w')) return 'sale-4';
  if (n.includes('36w') || n.includes('lista')) return 'sale-6';
  return item.id;
}

function getMeta(merchantId: string, item: SalesRow): MerchantMeta {
  if (CATALOG[merchantId]) return CATALOG[merchantId];
  const fallbackMpn = `SP-${merchantId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase() || 'ITEM'}`;
  return {
    brand: (item.brand || 'StagePulse').trim() || 'StagePulse',
    mpn: (item.mpn || fallbackMpn).trim() || fallbackMpn,
    google_product_category: '549',
    product_type: 'Svetelná technika',
  };
}

function isGoogleImage(url: string): boolean {
  return /\.(jpe?g|png|gif)(\?|#|$)/i.test(url);
}

function pickGoogleImages(item: SalesRow, merchantId: string): string[] {
  const fromDb = (Array.isArray(item.images) ? item.images : []).filter(
    (url): url is string => typeof url === 'string' && isGoogleImage(url)
  );
  if (fromDb.length > 0) return fromDb.slice(0, 10);
  if (HOSTED_JPEG[merchantId]) return [HOSTED_JPEG[merchantId]];
  return [];
}

function shippingBlock(country: string, minTransit: number, maxTransit: number): string {
  return [
    '      <g:shipping>',
    `        <g:country>${country}</g:country>`,
    '        <g:service>Standard</g:service>',
    `        <g:price>${SHIPPING_PRICE}</g:price>`,
    `        <g:min_transit_time>${minTransit}</g:min_transit_time>`,
    `        <g:max_transit_time>${maxTransit}</g:max_transit_time>`,
    '      </g:shipping>',
  ].join('\n');
}

function buildItem(item: SalesRow): string | null {
  const merchantId = resolveMerchantId(item);
  const meta = getMeta(merchantId, item);

  const name = String(item.name || '').trim();
  const price = Number(item.price);
  if (!name || !Number.isFinite(price) || price <= 0) return null;

  const images = pickGoogleImages(item, merchantId);
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
    `      <g:id>${escapeXml(merchantId)}</g:id>`,
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
    '      <g:min_handling_time>1</g:min_handling_time>',
    '      <g:max_handling_time>2</g:max_handling_time>',
    shippingBlock('SK', 1, 3),
    shippingBlock('CZ', 2, 5),
    '    </item>',
  ].join('\n');
}

async function loadProducts(): Promise<SalesRow[]> {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co',
    process.env.VITE_SUPABASE_ANON_KEY ||
      'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT'
  );

  const { data, error } = await supabase
    .from('sales')
      .select('id,name,price,condition,description,images,available,available_count')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as SalesRow[];
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
