/**
 * Merchant atribúty pre predajné produkty.
 *
 * Bez oficiálneho EAN/GTIN NIKDY nevymýšľame falošné kódy –
 * Google ich overuje a môže zablokovať Merchant účet.
 * Správne riešenie: identifier_exists = false + brand + mpn.
 */
export type MerchantProductMeta = {
  brand: string;
  mpn: string;
  gtin?: string;
  identifier_exists: boolean;
  google_product_category: string;
  product_type: string;
};

/** Len produkty, ktoré sa reálne predávajú. */
export const MERCHANT_CATALOG: Record<string, MerchantProductMeta> = {
  'sale-3': {
    brand: 'StagePulse',
    mpn: 'SP-LASER-BAR-65W-RED',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Laserové efekty',
  },
  'sale-4': {
    brand: 'StagePulse',
    mpn: 'SP-RGBW-HEAD-90W',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Moving Head',
  },
  'sale-5': {
    brand: 'StagePulse',
    mpn: 'SP-FLAME-MACHINE',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > Špeciálne efekty',
  },
  'sale-6': {
    brand: 'StagePulse',
    mpn: 'SP-RGBW-BAR-36W',
    identifier_exists: false,
    google_product_category: '549',
    product_type: 'Svetelná technika > LED BAR',
  },
};

/** ID produktov, ktoré idú do Merchant feedu. */
export const MERCHANT_PRODUCT_IDS = Object.keys(MERCHANT_CATALOG);

export function resolveMerchantMeta(
  id: string,
  name: string
): MerchantProductMeta | null {
  if (MERCHANT_CATALOG[id]) return MERCHANT_CATALOG[id];
  return null;
}
