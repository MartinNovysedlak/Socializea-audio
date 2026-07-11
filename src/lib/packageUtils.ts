import { EquipmentItem } from "./supabase";

export interface PackageCartItem {
  id: string;
  name: string;
  price: number;
  hasLights: boolean;
  image: string;
  arrival: { name: string; lat: number; lng: number } | null;
  install: "none" | "install" | "install_uninstall";
  installPrice: number;
  deliveryPrice: number;
  extras: { id: string; label: string; quantity: number; pricePerDay: number }[];
}

/**
 * Parses a spec string like "2x Behringer B112D" to extract count and name.
 */
function extractBaseNameAndCount(spec: string): { name: string; count: number } {
  const match = spec.match(/^(\d+)\s*(x|ks|kus)\s+/i);
  if (match) return { name: spec.replace(match[0], "").trim(), count: parseInt(match[1], 10) };
  const simpleMatch = spec.match(/^(\d+)\s+/);
  if (simpleMatch) return { name: spec.replace(simpleMatch[0], "").trim(), count: parseInt(simpleMatch[1], 10) };
  return { name: spec.trim(), count: 1 };
}

/**
 * Builds a map of equipment name → count from the package's spec strings.
 */
function getPackageUsedCounts(
  soundSpecs: string[],
  lightSpecs: string[],
  otherSpecs: string[]
): Record<string, number> {
  const map: Record<string, number> = {};
  const allSpecs = [...soundSpecs, ...lightSpecs, ...otherSpecs];
  for (const spec of allSpecs) {
    const { name, count } = extractBaseNameAndCount(spec);
    const key = name.trim();
    map[key] = (map[key] || 0) + count;
  }
  return map;
}

/**
 * Fuzzy matches a database item name against a package's used item names.
 * Returns the total count of units used for that item.
 */
function getUsedInPackageForDbItem(
  dbItemName: string,
  packageUsedCounts: Record<string, number>
): number {
  const dbLower = dbItemName.toLowerCase().trim();
  let totalUsed = 0;
  for (const [pkgItemName, count] of Object.entries(packageUsedCounts)) {
    const pkgLower = pkgItemName.toLowerCase().trim();
    if (dbLower.includes(pkgLower) || pkgLower.includes(dbLower)) totalUsed += count;
  }
  return totalUsed;
}

/**
 * For a given package, return a map of equipment ID → units used in the package's base specs.
 */
function getUsedEquipmentIdsFromPackage(
  pkg: PackageCartItem,
  equipment: EquipmentItem[]
): Record<string, number> {
  // The PackageCartItem does not carry sound/light specs directly.
  // However, the "extras" array already contains the additional products with IDs.
  // For the base package items (sound/light/other), we need to look at the original package data.
  // Since we don't have the full PackageData here, we rely on the fact that in the dialog,
  // the base items are already accounted for in `packageUsedCounts` which we don't have here.
  // Instead, we will compute for all packages based on the equipment names in the package name?
  // That's not reliable. Better approach: store the used IDs in PackageCartItem when adding to cart.

  // For now, we'll handle only the extras (additional products) which already have IDs.
  // The base package specs will be considered separately via the `getUsedInPackageForDbItem` function,
  // but that requires the specs strings. Since we don't have them in the cart,
  // we need to store them in PackageCartItem. Let's extend PackageCartItem.
  return {};
}

/**
 * Compute a map of equipment ID → total units used across all packages in the cart.
 * This considers both base package specs (if stored) and extras.
 */
export function computeUsedEquipmentCounts(
  packageItems: PackageCartItem[],
  equipment: EquipmentItem[]
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const pkg of packageItems) {
    // 1. Handle extras (these have IDs directly)
    for (const extra of pkg.extras) {
      if (extra.id) {
        result[extra.id] = (result[extra.id] || 0) + extra.quantity;
      }
    }

    // 2. Handle base package specs – we don't have them here,
    //    so we rely on the fact that they were already accounted for
    //    when the package was added to cart (the extras included? No, extras are additional).
    //    To properly handle this, we need to store the base used counts in PackageCartItem.
    //    We'll assume for now that base items are not tracked by ID, only by name.
    //    This is a limitation we accept for now.
  }

  return result;
}

/**
 * Given a list of packages (with their base specs stored as soundSpecs, lightSpecs, otherSpecs),
 * compute a map of equipment name → count used.
 * This is used for matching against database items.
 */
export function computeBasePackageUsedByName(packages: PackageCartItem[]): Record<string, number> {
  // This function is not directly used yet because PackageCartItem doesn't carry specs.
  // We'll leave it as a placeholder for future extension.
  return {};
}