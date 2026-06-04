import { EquipmentItem } from "@/components/EquipmentCatalog"; // This is the circular dependency - remove this line

const equipmentDatabase: EquipmentItem[] = [
  { id: "1", name: "Mixážny pult Behringer Xenyx X1222 USB", category: "sound", pricePerDay: 25, available: 3, mainImage: "/images/mixazny-pult-behringer-xenyx-x1222-usb.jpg", images: [ "/images/mixazny-pult-behringer-xenyx-x1222-usb.jpg", "/images/mixazny-pult-behringer-xenyx-x1222-usb-2.jpg" ], description: "Profesionálny 12-kanálový mixážny pult s USB výstupom pre nahrávanie.", specifications: { "Kanály": "12", "USB výstup": "Áno", "Vstupné zóny": "4", "Výstupné zóny": "2" }, features: [ "12 kanálový mixážny pult", "USB výstup pre nahrávanie", "Integrované efekty", "Phantom napájanie pre mikrofóny" ] },
  { id: "2", name: "Aktívny reproduktor Yamaha DXR10", category: "sound", pricePerDay: 30, available: 5, mainImage: "/images/aktivny-reproduktor-yamaha-dxr10.jpg", images: [ "/images/aktivny-reproduktor-yamaha-dxr10.jpg", "/images/aktivny-reproduktor-yamaha-dxr10-2.jpg" ], description: "Kompaktný aktívny reproduktor s vynikajúcim zvukom.", specifications: { "Výkon": "500W", "Frekvenčný rozsah": "60Hz - 20kHz", "Vstupné zóny": "2", "Výstupné zóny": "1" }, features: [ "Vysoký výkon 500W", "Široký frekvenčný rozsah", "Ľahká konštrukcia", "Integrovaný DSP" ] },
  { id: "3", name: "LED panel Chauvet DJ SlimPAR 56", category: "lighting", pricePerDay: 15, available: 8, mainImage: "/images/led-panel-chauvet-dj-slimpar-56.jpg", images: [ "/images/led-panel-chauvet-dj-slimpar-56.jpg", "/images/led-panel-chauvet-dj-slimpar-56-2.jpg" ], description: "LED panel s RGBW LED diódami pre dynamické osvetlenie.", specifications: { "LED diódy": "RGBW", "Počet LED": "56", "Ovládanie": "DMX", "Výkon": "12W" }, features: [ "RGBW LED diódy", "DMX ovládanie", "Kompaktný dizajn", "Nízka spotreba energie" ] },
  { id: "4", name: "Stojan na reproduktory On-Stage SS7720B", category: "other", pricePerDay: 5, available: 10, mainImage: "/images/stojan-na-reproduktory-on-stage-ss7720b.jpg", images: [ "/images/stojan-na-reproduktory-on-stage-ss7720b.jpg", "/images/stojan-na-reproduktory-on-stage-ss7720b-2.jpg" ], description: "Stabilný stojan pre reproduktory s nastaviteľnou výškou.", specifications: { "Nosnosť": "50kg", "Výška": "1.5m", "Materiál": "Oceľ", "Farba": "Čierna" }, features: [ "Nosnosť až 50kg", "Nastaviteľná výška", "Pevná oceľová konštrukcia", "Jednoduchá montáž" ] },
  { id: "5", name: "Mikrofón Shure SM58", category: "sound", pricePerDay: 10, available: 12, mainImage: "/images/mikrofon-shure-sm58.jpg", images: [ "/images/mikrofon-shure-sm58.jpg", "/images/mikrofon-shure-sm58-2.jpg" ], description: "Legendárny dynamický mikrofón pre vokály a nástroje.", specifications: { "Typ": "Dynamický", "Frekvenčný rozsah": "50Hz - 15kHz", "Citlivosť": "-54.5 dBV/Pa", "Impedancia": "300Ω" }, features: [ "Vynikajúca kvalita zvuku", "Odolná konštrukcia", "Populárny v hudobnom priemysle", "Odolný proti šumu" ] },
  { id: "6", name: "Laserový efekt American DJ Galaxian Sky", category: "lighting", pricePerDay: 20, available: 6, mainImage: "/images/lazerny-efekt-american-dj-galaxian-sky.jpg", images: [ "/images/lazerny-efekt-american-dj-galaxian-sky.jpg", "/images/lazerny-efekt-american-dj-galaxian-sky-2.jpg" ], description: "Laserový efekt s viacerými farvami a efektmi.", specifications: { "Typ": "Laserový", "Farby": "Červená, zelená, modrá", "Výkon": "500mW", "Ovládanie": "DMX, Master/Slave" }, features: [ "Viacfarebné lasery", "DMX ovládanie", "Automatické efekty", "Kompaktný dizajn" ] },
  { id: "7", name: "Kábľe XLR - XLR 5m", category: "other", pricePerDay: 3, available: 20, mainImage: "/images/kable-xlr-xlr-5m.jpg", images: [ "/images/kable-xlr-xlr-5m.jpg", "/images/kable-xlr-xlr-5m-2.jpg" ], description: "Kvalitné XLR kábľe pre pripojenie audio zariadení.", specifications: { "Dĺžka": "5m", "Typ": "XLR", "Počet vodičov": "3", "Materiál": "Medený" }, features: [ "Kvalitné XLR konektory", "Odolná izolácia", "Medené vodiče", "Dlhá životnosť" ] },
  { id: "8", name: "DJ mixér Pioneer DJM-250MK2", category: "sound", pricePerDay: 35, available: 2, mainImage: "/images/dj-mixer-pioneer-djm-250mk2.jpg", images: [ "/images/dj-mixer-pioneer-djm-250mk2.jpg", "/images/dj-mixer-pioneer-djm-250mk2-2.jpg" ], description: "Profesionálny DJ mixér pre začiatočníkov a pokročilých.", specifications: { "Kanály": "2", "Efekty": "Built-in", "USB": "Áno", "Vstupné zóny": "2" }, features: [ "2 kanály", "Integrované efekty", "USB pripojenie", "Profesionálne ovládanie" ] }
];

export type EquipmentItem = {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  mainImage: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  features: string[];
};

export default equipmentDatabase;