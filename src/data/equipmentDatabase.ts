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

export const equipmentDatabase: EquipmentItem[] = [
  // Sound Equipment
  {
    id: "mixer-x1222",
    name: "Mixážny pult Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 1,
    description: "Profesionálny mixážny pult s USB nahrávacím modulom, 16 kanálov a many vstupov/výstupov. Ideálny pre live vystúpenia a nahrávanie.",
    mainImage: "/media/Mixážny pult Behringer Xenyx X1222 USB.jpg",
    images: [
      "/media/Mixážny pult Behringer Xenyx X1222 USB.jpg"
    ],
    specifications: [
      "16 kanálov",
      "USB nahrávanie",
      "4-band EQ",
      "2 AUX výstupy",
      "2 preampy"
    ],
    features: [
      "Profesionálne kvality",
      "Kompaktný dizajn",
      "Ľahké ovládanie",
      "Vysoký výkon"
    ]
  },
  // ... (other items with similar updates)
];