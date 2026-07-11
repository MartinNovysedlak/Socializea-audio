"use client";

import { EquipmentItem } from "@/lib/supabase";

export interface PackageCartItem {
  id: string;
  name: string;
  price: number;
  hasLights: boolean;
  image: string;
  arrival: { name: string; lat: number; lng: number } | null;
  install: 'none' | 'install' | 'install_uninstall';
  installPrice: number;
  deliveryPrice: number;
  extras: { id: string; label: string; quantity: number; pricePerDay: number }[];
  soundSpecs?: string[];
  lightSpecs?: string[];
  otherSpecs?: string[];
}

export function extractBaseNameAndCount(spec: string): { name: string; count: number } {
  const match = spec.match(/^(\d+)\s*(x|ks|kus)\s+/i);
  if (match) return { name: spec.replace(match[0], '').trim(), count: parseInt(match[1], 10) };
  const simpleMatch = spec.match(/^(\d+)\s+/);
  if (simpleMatch) return { name: spec.replace(simpleMatch[0], '').trim(), count: parseInt(simpleMatch[1], 10) };
  return { name: spec.trim(), count: 1 };
}

export function getPackageUsedCounts(pkg: PackageCartItem): Record<string, number> {
  const map: Record<string, number> = {};
  const allSpecs = [...(pkg.soundSpecs || []), ...(pkg.lightSpecs || []), ...(pkg.otherSpecs || [])];
  for (const spec of allSpecs) {
    const { name, count } = extractBaseNameAndCount(spec);
    const key = name.trim();
    map[key] = (map[key] || 0) + count;
  }
  // Tiež započítame extras (pridané položky v balíku)
  for (const extra of (pkg.extras || [])) {
    const { name } = extractBaseNameAndCount(extra.label);
    const key = name.trim();
    map[key] = (map[key] || 0) + extra.quantity;
  }
  return map;
}

export function getUsedInPackageForDbItem(
  dbItemName: string,
  packageUsedCounts: Record<string, number>
): number {
  const dbLower = dbItemName.toLowerCase().trim();
  let totalUsed = 0;
  for (const [pkgItemName, count] of Object.entries(packageUsedCounts)) {
    const pkgLower = pkgItemName.toLowerCase().trim();
    if (dbLower.includes(pkgLower) || pkgLower.includes(dbLower)) {
      totalUsed += count;
    }
  }
  return totalUsed;
}

export function computeAllPackagesUsedCounts(
  packageItems: PackageCartItem[]
): Record<string, number> {
  const combined: Record<string, number> = {};
  for (const pkg of packageItems) {
    const used = getPackageUsedCounts(pkg);
    for (const [key, count] of Object.entries(used)) {
      combined[key] = (combined[key] || 0) + count;
    }
  }
  return combined;
}

export function getAvailableCount(
  item: EquipmentItem,
  usedFromPackages: Record<string, number>,
  currentInCart: number
): number {
  const usedInPkg = getUsedInPackageForDbItem(item.name, usedFromPackages);
  return Math.max(0, item.available - usedInPkg - currentInCart);
}

export const PACKAGE_USED_KEY = 'cyber_cart_package_used_counts';

export function saveUsedCountsToStorage(usedCounts: Record<string, number>) {
  try {
    localStorage.setItem(PACKAGE_USED_KEY, JSON.stringify(usedCounts));
  } catch {}
}

export function loadUsedCountsFromStorage(): Record<string, number> {
  try {
    const saved = localStorage.getItem(PACKAGE_USED_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}