"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  description: string;
  images: string[];
  specifications?: string[];
  features?: string[];
}

const equipmentData: EquipmentItem[] = [
  {
    id: "mixer-x1222",
    name: "Mixážny pult Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 1,
    description: "Profesionálny mixážny pult s USB nahrávacím modulom, 16 kanálov a many vstupov/výstupov. Ideálny pre live vystúpenia a nahrávanie.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
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
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    description: "Kompaktný mixážny pult s 8 kanálmi, USB interfészom a jednoduchým ovládaním. Vhodný pre malé podujatia a štúdiové nahrávky.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "8 kanálov",
      "USB interfész",
      "2-band EQ",
      "2 AUX výstupy",
      "Phantom napájanie"
    ],
    features: [
      "Prehľadné ovládanie",
      "Kompaktné rozmery",
      "Vysoká kvalita zvuku",
      "Economicke riešenie"
    ]
  },
  {
    id: "mic-set",
    name: "Sada 2 mikrofónov the t.bone free solo Twin HT",
    category: "sound",
    pricePerDay: 20,
    available: 1,
    description: "Drátové mikrofóny s headsetom, vhodné na prednášky a koncerty. Vysoká kvalita zvuku a odolná konštrukcia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "2x drátový mikrofón",
      "1x headset",
      "Frekvenčný rozsah 20Hz-20kHz",
      "Citlivosť -54dB",
      "3.5mm jack výstup"
    ],
    features: [
      "Vysoká kvalita zvuku",
      "Odolná konštrukcia",
      "Komfortné použitie",
      "Profesionálny výkon"
    ]
  },
  {
    id: "speakers-b112d",
    name: "Reproduktory Behringer b112d",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    description: "Kvalitné aktívne reproduktory s vynikajúcim zvukom a kompaktným dizajnom. Vhodné pre stredne veľké priestory.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "12\" woofer",
      "1.35\" tweeter",
      "400W výkon",
      "XLR/TRS vstupy",
      "Link výstup"
    ],
    features: [
      "Vysoký výkon",
      "Kompaktný dizajn",
      "Vynikajúca kvalita zvuku",
      "Ľahká manipulácia"
    ]
  },
  {
    id: "sub-dsp18",
    name: "Subwoofer The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 35,
    available: 5,
    description: "Vysokovýkonný subwoofer s digitálnym procesorom pre dokonalé basy. Ideálny pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "18\" woofer",
      "1000W výkon",
      "DSP procesor",
      "XLR vstupy/výstupy",
      "Limitér"
    ],
    features: [
      "Vysoký výkon",
      "Digitálne spracovanie",
      "Profesionálna kvalita",
      "Výborné basy"
    ]
  },
  {
    id: "led-par",
    name: "RGBWA UV Led Par svetlá",
    category: "lighting",
    pricePerDay: 8,
    available: 8,
    description: "Viacfarebné LED svetlá s UV efektom, ideálne pre párty a eventy. Jednoduché ovládanie a vysoká svietivosť.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "RGBWA UV farby",
      "9x 3W LED diódy",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Viacfarebné osvetlenie",
      "UV efekt",
      "DMX ovládanie",
      "Vysoká svietivosť"
    ]
  },
  {
    id: "beam-head",
    name: "Rotujúca 90w Beam hlava",
    category: "lighting",
    pricePerDay: 25,
    available: 4,
    description: "Profesionálne rotujúce svetelné hlavy s vysokým výkonom. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "90W výkon",
      "Rotujúca hlava",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Rotujúce efekty",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "fog-dj",
    name: "Dymostroj ADJ VF 1300",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "Výkonný dymostroj pre vytvorenie atmosférických efektov. Vhodný pre koncerty, párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "1300W výkon",
      "2.5L nádrž",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Veľká nádrž",
      "Atmosférické efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "mic-auna",
    name: "Mikrofony a headsety Auna VHF",
    category: "sound",
    pricePerDay: 10,
    available: 4,
    description: "Bezdrôtové mikrofóny a headsety Auna VHF s vysokou kvalitou zvuku a jednoduchým ovládaním.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "2x bezdrôtový mikrofón",
      "1x headset",
      "VHF frekvencia",
      "Dolet 30m",
      "Baterie súčasťou"
    ],
    features: [
      "Bezdrôtové pripojenie",
      "Vysoká kvalita zvuku",
      "Jednoduché ovládanie",
      "Dlhý dolet"
    ]
  },
  {
    id: "speaker-b208d",
    name: "Reproduktor Behringer b208d",
    category: "sound",
    pricePerDay: 12,
    available: 1,
    description: "Kompaktný reproduktor Behringer b208d s vynikajúcim zvukom a nízkou hmotnosťou.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "8\" woofer",
      "1\" tweeter",
      "200W výkon",
      "XLR/TRS vstupy",
      "Link výstup"
    ],
    features: [
      "Kompaktný dizajn",
      "Vysoký výkon",
      "Vynikajúca kvalita zvuku",
      "Ľahká manipulácia"
    ]
  },
  {
    id: "sub-b1500xp",
    name: "Subwoofery Behriger B1500XP",
    category: "sound",
    pricePerDay: 30,
    available: 2,
    description: "Vysokovýkonný subwoofer Behringer B1500XP pre dokonalé basy a hlboké frekvencie.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "15\" woofer",
      "800W výkon",
      "XLR vstupy/výstupy",
      "Link výstup",
      "Limitér"
    ],
    features: [
      "Vysoký výkon",
      "Hlboké basy",
      "Profesionálna kvalita",
      "Výborný zvuk"
    ]
  },
  {
    id: "dmx-pult",
    name: "Riadiaci DMX pult Light4Me DMX 192",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Profesionálny DMX pult pre ovládanie svetelných efektov s 192 kanálmi a množstvom funkcií.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "192 DMX kanály",
      "16 faderov",
      "LCD displej",
      "USB port",
      "Preset banky"
    ],
    features: [
      "Profesionálne ovládanie",
      "Vysoký počet kanálov",
      "LCD displej",
      "USB pripojenie"
    ]
  },
  {
    id: "beamz-sushi",
    name: "BeamZ SUSHI-DS",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "Moderné svetelné efekty BeamZ SUSHI-DS s automatickými efektmi a jednoduchým ovládaním.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Automatické efekty",
      "RGBW farby",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Automatické efekty",
      "RGBW farby",
      "DMX ovládanie",
      "Vysoká svietivosť"
    ]
  },
  {
    id: "led-bar",
    name: "RGBW Led Bar 36w",
    category: "lighting",
    pricePerDay: 12,
    available: 4,
    description: "RGBW LED bar s vysokou svietivosťou a množstvom farieb. Vhodné pre párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "36W výkon",
      "RGBW farby",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoká svietivosť",
      "RGBW farby",
      "DMX ovládanie",
      "Kompaktný dizajn"
    ]
  },
  {
    id: "laser-bar",
    name: "Laserovy Bar 65W (8x červený laser)",
    category: "lighting",
    pricePerDay: 40,
    available: 1,
    description: "Výkonný laserový bar s 8x červenými laserovými diódami. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "65W výkon",
      "8x červený laser",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Červené lasery",
      "DMX ovládanie",
      "Profesionálna kvalita"
    ]
  },
  {
    id: "bubble",
    name: "Bublinkostroj",
    category: "lighting",
    pricePerDay: 20,
    available: 2,
    description: "Bublinkostroj pre vytvorenie atmosférických efektov. Vhodné pre párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w/800"
    ],
    specifications: [
      "400W výkon",
      "2L nádrž",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Veľká nádrž",
      "Atmosférické efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "snow",
    name: "Snehostroj ADJ Snow Flurry HO",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "Snehostroj ADJ Snow Flurry HO pre vytvorenie snehových efektov. Vhodné pre zimné podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "400W výkon",
      "1.5L nádrž",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Malá nádrž",
      "Snehové efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "fire",
    name: "Výrobníky plameňov Fire Machine",
    category: "lighting",
    pricePerDay: 30,
    available: 2,
    description: "Výrobníky plameňov pre vytvorenie dramatických efektov. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "500W výkon",
      "2L nádrž",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Veľká nádrž",
      "Plameňové efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "party-bar",
    name: "Svetlá BeamZ Party Bar",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Svetlá BeamZ Party Bar s automatickými efektmi a vysokou svietivosťou. Vhodné pre párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Automatické efekty",
      "RGBW farby",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Automatické efekty",
      "RGBW farby",
      "DMX ovládanie",
      "Vysoká svietivosť"
    ]
  },
  {
    id: "uv-lights",
    name: "Samostatné Bodové UV svetlá",
    category: "lighting",
    pricePerDay: 10,
    available: 2,
    description: "Samostatné bodové UV svetlá pre vytvorenie atmosférického osvetlenia. Vhodné pre párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "UV svetlá",
      "10W výkon",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "UV efekty",
      "Vysoká svietivosť",
      "DMX ovládanie",
      "Kompaktný dizajn"
    ]
  },
  {
    id: "strobe",
    name: "Stroboskop",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "Stroboskop pre vytvorenie blikajúcich efektov. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Stroboskop",
      "1200W výkon",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Blikajúce efekty",
      "Vysoký výkon",
      "DMX ovládanie",
      "Profesionálna kvalita"
    ]
  },
  {
    id: "holo-laser",
    name: "Holografický Laser",
    category: "lighting",
    pricePerDay: 35,
    available: 1,
    description: "Holografický laser pre vytvorenie 3D efektov. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Holografický laser",
      "50W výkon",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "3D efekty",
      "Vysoký výkon",
      "DMX ovládanie",
      "Profesionálna kvalita"
    ]
  },
  {
    id: "red-green-laser",
    name: "Červeno-zelený Laser",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Červeno-zelený laser pre vytvorenie dramatických efektov. Vhodné pre koncerty a veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Červeno-zelený laser",
      "30W výkon",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Červeno-zelené efekty",
      "Vysoký výkon",
      "DMX ovládanie",
      "Profesionálna kvalita"
    ]
  },
  {
    id: "projector",
    name: "Premietačka Wanbo T6 MAX",
    category: "other",
    pricePerDay: 20,
    available: 1,
    description: "Vysokokvalitná premietačka Wanbo T6 MAX s vysokým rozlíšením a jasom. Vhodná pre prezentácie a filmy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "4K rozlíšenie",
      "5500 ANSI lúmenov",
      "HDR10 podpora",
      "WiFi pripojenie",
      "HDMI vstup"
    ],
    features: [
      "Vysoké rozlíšenie",
      "Vysoký jas",
      "HDR podpora",
      "WiFi pripojenie"
    ]
  },
  {
    id: "screen",
    name: "Premietacie plátno 110\"",
    category: "other",
    pricePerDay: 15,
    available: 1,
    description: "Premietacie plátno 110\" s vysokou kvalitou obrazu a jednoduchým nastavením. Vhodné pre prezentácie a filmy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "110\" rozmer",
      "16:9 pomer",
      "1.1 gain",
      "White surface",
      "Easy setup"
    ],
    features: [
      "Vysoká kvalita obrazu",
      "Veľké rozmer",
      "Jednoduché nastavenie",
      "Vynikajúca farba"
    ]
  },
  {
    id: "light-construct",
    name: "Osvetľovacia konštrukcia na uchytenie -všetkých svetiel a efektov",
    category: "other",
    pricePerDay: 10,
    available: 1,
    description: "Osvetľovacia konštrukcia pre uchytenie všetkých svetiel a efektov. Vhodná pre veľké podujatia.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Konštrukcia",
      "Max 100kg",
      "Easy assembly",
      "Stable base",
      "Adjustable height"
    ],
    features: [
      "Univerzálna konštrukcia",
      "Vysoká nosnosť",
      "Jednoduchá montáž",
      "Stabilné základne"
    ]
  },
  {
    id: "speaker-construct",
    name: "Konštrukcia na zavesenie reproduktorov na stenu",
    category: "other",
    pricePerDay: 8,
    available: 2,
    description: "Konštrukcia na zavesenie reproduktorov na stenu. Vhodná pre reproduktory všetkých veľkostí.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Konštrukcia",
      "Max 50kg",
      "Easy assembly",
      "Wall mount",
      "Adjustable angle"
    ],
    features: [
      "Univerzálna konštrukcia",
      "Vysoká nosnosť",
      "Jednoduchá montáž",
      "Nastaviteľný uhol"
    ]
  },
  {
    id: "mic-stand",
    name: "Stojan na mikrofón",
    category: "other",
    pricePerDay: 5,
    available: 2,
    description: "Stojan na mikrofón s vysokou stabilitou a jednoduchým nastavením. Vhodný pre všetky typy mikrofónov.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Stojan",
      "Max 2m",
      "Easy assembly",
      "Stable base",
      "Adjustable height"
    ],
    features: [
      "Vysoká stabilita",
      "Jednoduché nastavenie",
      "Univerzálny dizajn",
      "Odolná konštrukcia"
    ]
  },
  {
    id: "tripod",
    name: "Trojnožka na reproduktory",
    category: "other",
    pricePerDay: 10,
    available: 2,
    description: "Trojnožka na reproduktory s vysokou stabilitou a jednoduchým nastavením. Vhodná pre reproduktory všetkých veľkostí.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Trojnožka",
      "Max 100kg",
      "Easy assembly",
      "Stable base",
      "Adjustable height"
    ],
    features: [
      "Vysoká stabilita",
      "Jednoduchá montáž",
      "Univerzálny dizajn",
      "Odolná konštrukcia"
    ]
  },
  {
    id: "speaker-mount",
    name: "Držiak pre dvojicu reproboxov",
    category: "other",
    pricePerDay: 5,
    available: 2,
    description: "Držiak pre dvojicu reproboxov s vysokou stabilitou a jednoduchým nastavením. Vhodný pre reproduktory všetkých veľkostí.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Držiak",
      "Max 50kg",
      "Easy assembly",
      "Stable base",
      "Adjustable angle"
    ],
    features: [
      "Univerzálny dizajn",
      "Vysoká nosnosť",
      "Jednoduchá montáž",
      "Nastaviteľný uhol"
    ]
  },
  {
    id: "telescopic",
    name: "Teleskopická stojanová tyč",
    category: "other",
    pricePerDay: 8,
    available: 2,
    description: "Teleskopická stojanová tyč s vysokou stabilitou a jednoduchým nastavením. Vhodná pre reproduktory všetkých veľkostí.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Teleskopická tyč",
      "Max 3m",
      "Easy assembly",
      "Stable base",
      "Adjustable height"
    ],
    features: [
      "Vysoká stabilita",
      "Jednoduché nastavenie",
      "Univerzálny dizajn",
      "Odolná konštrukcia"
    ]
  }
];

const EquipmentDetail = () => {
  const { id } = useParams();
  const item = equipmentData.find(i => i.id === id);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-[#020721]">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Aparatura nie je nájdená</h1>
            <p className="text-gray-400">Požadovaná položka nebola nájdená v našom katalógu.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <CardHeader className="pb-4">
                    <h2 className="text-3xl font-bold text-white">{item.name}</h2>
                    <span className="text-xl text-[#BD20D3] uppercase">
                      {item.category === "sound" ? "Zvuk" : 
                       item.category === "lighting" ? "Svetlá a efekty" : "Ostatné"}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {item.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.images.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10">
                          <img 
                            src={img} 
                            alt={`${item.name} - fotka ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                      <div>
                        <span className="text-3xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                        <span className="text-gray-500 ml-2">/ deň</span>
                        <p className="text-gray-400 mt-1">
                          Dostupné: {item.available} {item.available === 1 ? "kus" : "kusy"}
                        </p>
                      </div>
                      <Button className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 h-12 px-6">
                        Pridať do kalkulácie
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Technické špecifikácie</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex justify-between">
                      <span>Kategória:</span>
                      <span className="text-white font-medium">
                        {item.category === "sound" ? "Zvukové zariadenie" : 
                         item.category === "lighting" ? "Svetelné zariadenie" : "Ostatné"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cena za deň:</span>
                      <span className="text-[#BD20D3] font-bold">{item.pricePerDay} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dostupnosť:</span>
                      <span className="text-white font-medium">{item.available} {item.available === 1 ? "kus" : "kusy"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Stav:</span>
                      <span className="text-emerald-400 font-medium">Dostupné</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Výhody prenájmu</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Profesionálna technika od známych výrobcov</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Technická podpora počas prenájmu</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Možnosť kombinácie s inými zariadeniami</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Vratná záloha pri prevzatí techniky</span>
                    </li>
                  </ul>
                </Card>

                {item.specifications && (
                  <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Technické parametre</h3>
                    <ul className="space-y-2 text-gray-300">
                      {item.specifications.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#1A4BFF] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {item.features && (
                  <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4">Kľúčové vlastnosti</h3>
                    <ul className="space-y-2 text-gray-300">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default EquipmentDetail;