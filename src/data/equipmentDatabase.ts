export interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  description: string;
  mainImage: string;
  images: string[];
  specifications: string[];
  features: string[];
}

export const equipmentDatabase: EquipmentItem[] = [];