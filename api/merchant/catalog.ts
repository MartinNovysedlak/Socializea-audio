/**
 * Merchant atribúty pre predajné produkty.
 * Ak máš EAN/GTIN, doplň `gtin` a nastav `identifier_exists: true`.
 * Bez GTIN stačí brand + mpn (identifier_exists: false).
 */
export type MerchantProductMeta = {
  brand: string;
  mpn: string;
  gtin?: string;
  identifier_exists: boolean;
  google_product_category: string;
  product_type: string;
};

/** Predvolené údaje podľa ID produktu (Supabase / fallback seed). */
export const MERCHANT_CATALOG: Record<string, MerchantProductMeta> = {
  'sale-1': {
    brand: 'Pioneer DJ',
    mpn: 'DDJ-FLX4',
    identifier_exists: false,
    google_product_category: '242',
    product_type: 'DJ technika > DJ ovládače',
  },
  'sale-3': {
    brand: 'Socializea Audio',
    mpn: 'LASER-BAR-65W-RED',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Laserové efekty',
  },
  'sale-4': {
    brand: 'Socializea Audio',
    mpn: 'RGBW-HEAD-90W',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Moving Head',
  },
  'sale-5': {
    brand: 'Socializea Audio',
    mpn: 'FLAME-MACHINE',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Špeciálne efekty',
  },
  'sale-6': {
    brand: 'Socializea Audio',
    mpn: 'RGBW-BAR-36W',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > LED BAR',
  },
};

export function resolveMerchantMeta(
  id: string,
  name: string
): MerchantProductMeta {
  if (MERCHANT_CATALOG[id]) return MERCHANT_CATALOG[id];

  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toUpperCase()
    .slice(0, 40);

  return {
    brand: 'Socializea Audio',
    mpn: slug || id.toUpperCase(),
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Audio a svetelná technika',
  };
}
