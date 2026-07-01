export type PackageCartItem = {
  type: 'package';
  id: string;
  packageName: string;
  packageId: string;
  includeLights: boolean;
  installSelected: boolean;
  installUninstallSelected: boolean;
  deliverySelected: boolean;
  deliveryCity: string;
  deliveryResult: { price: number; isFree: boolean; distance: number; nearestPoint: string; isKysuce: boolean } | null;
  additionalProducts: { id: string; label: string; quantity: number; pricePerDay: number }[];
  price: number;
  image: string;
};

export type CartItem = PackageCartItem;