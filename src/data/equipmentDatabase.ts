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
    mainImage: "/media/95a5d2b846e9b13c0ae9400ef54353429657cbfc13346bed3dcf1db885d07534.jpg",
    images: [
      "/media/95a5d2b846e9b13c0ae9400ef54353429657cbfc13346bed3dcf1db885d07534.jpg",
      "/media/77492824a2be24d78ec734ab9ec8d83bad8203b551f5552678e36b31284c280a.jpg"
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
    description: "Kompaktný mixážny pult s 8 kanálmi, USB interfészom a jednoduchým ovládaním.",
    mainImage: "/media/77492824a2be24d78ec734ab9ec8d83bad8203b551f5552678e36b31284c280a.jpg",
    images: [
      "/media/77492824a2be24d78ec734ab9ec8d83bad8203b551f5552678e36b31284c280a.jpg"
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
    description: "Drátové mikrofóny s headsetom, vhodné na prednášky a koncerty.",
    mainImage: "/media/d6052c5c81a138ce5304e4488c25f45f50162a32df6649711fd7e0ce077d380c.jpg",
    images: [
      "/media/d6052c5c81a138ce5304e4488c25f45f50162a32df6649711fd7e0ce077d380c.jpg"
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
    id: "mic-auna",
    name: "Mikrofony a headsety Auna VHF",
    category: "sound",
    pricePerDay: 10,
    available: 4,
    description: "Bezdrôtové mikrofóny s vysokou kvalitou zvuku a jednoduchým ovládaním.",
    mainImage: "/media/d6052c5c81a138ce5304e4488c25f45f50162a32df6649711fd7e0ce077d380c.jpg",
    images: [
      "/media/d6052c5c81a138ce5304e4488c25f45f50162a32df6649711fd7e0ce077d380c.jpg"
    ],
    specifications: [
      "4x bezdrôtový mikrofón",
      "Frekvenčný rozsah 50Hz-15kHz",
      "Dosah do 30m",
      "Citlivosť -65dB",
      "Bateriový čas 8 hodín"
    ],
    features: [
      "Vysoká kvalita zvuku",
      "Bezdrôtové pripojenie",
      "Dlhý čas batérie",
      "Jednoduché ovládanie"
    ]
  },
  {
    id: "speakers-b112d",
    name: "Reproduktory Behringer b112d",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    description: "Kvalitné aktívne reproduktory s vynikajúcim zvukom a kompaktným dizajnom.",
    mainImage: "/media/1f9236c88f552f18691beb5bc8de7b65f355c4233101d873b2aba7a463f9931e.jpg",
    images: [
      "/media/1f9236c88f552f18691beb5bc8de7b65f355c4233101d873b2aba7a463f9931e.jpg"
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
    id: "speaker-b208d",
    name: "Reproduktor Behringer b208d",
    category: "sound",
    pricePerDay: 12,
    available: 1,
    description: "Vysokovýkonný reproduktor s vynikajúcou kvalitou zvuku a kompaktnými rozmermi.",
    mainImage: "/media/9f78e4e46bf41dccfcc8e5ed8bed1b7bdd6928c6bcc2b5e10a4ea8a72b140af8.jpg",
    images: [
      "/media/9f78e4e46bf41dccfcc8e5ed8bed1b7bdd6928c6bcc2b5e10a4ea8a72b140af8.jpg"
    ],
    specifications: [
      "8\" woofer",
      "1\" tweeter",
      "200W výkon",
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
    id: "sub-b1500xp",
    name: "Subwoofery Behriger B1500XP",
    category: "sound",
    pricePerDay: 30,
    available: 2,
    description: "Vysokovýkonný subwoofer s vynikajúcou kvalitou basov a kompaktnými rozmermi.",
    mainImage: "/media/a91da4c39ec68a6da7af7f26a347754cea55f023d4d89618e1a68acae99f5cca.jpg",
    images: [
      "/media/a91da4c39ec68a6da7af7f26a347754cea55f023d4d89618e1a68acae99f5cca.jpg"
    ],
    specifications: [
      "15\" woofer",
      "1000W výkon",
      "Frekvenčný rozsah 35Hz-250Hz",
      "XLR/TRS vstupy",
      "Link výstup"
    ],
    features: [
      "Vysoký výkon",
      "Kompaktný dizajn",
      "Vynikajúca kvalita basov",
      "Ľahká manipulácia"
    ]
  },
  {
    id: "sub-dsp18",
    name: "Subwoofer The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 35,
    available: 5,
    description: "Vysokovýkonný subwoofer s digitálnym procesorom pre dokonalé basy.",
    mainImage: "/media/5d7b4e04dcdae02c0fa75f344bcbf2e37357f8c918017379142cbd820cd5000f.jpg",
    images: [
      "/media/5d7b4e04dcdae02c0fa75f344bcbf2e37357f8c918017379142cbd820cd5000f.jpg"
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

  // Lighting Equipment
  {
    id: "dmx-pult",
    name: "Riadiaci DMX pult Light4Me DMX 192",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Profesionálny DMX pult pre riadenie svetelných efektov a zariadení.",
    mainImage: "/media/5492eb8d0887643200d3ba57d0f5c24ef26ebf3bacdfcf4dce885c8f74bceeb0.jpg",
    images: [
      "/media/5492eb8d0887643200d3ba57d0f5c24ef26ebf3bacdfcf4dce885c8f74bceeb0.jpg"
    ],
    specifications: [
      "192 DMX kanály",
      "2 DMX výstupy",
      "LCD displej",
      "Preset pamäť",
      "MIDI ovládanie"
    ],
    features: [
      "Profesionálne ovládanie",
      "Vysoký počet kanálov",
      "Jednoduché programovanie",
      "Kompatibilné s DMX zariadeniami"
    ]
  },
  {
    id: "led-par",
    name: "RGBWA UV Led Par svetlá",
    category: "lighting",
    pricePerDay: 8,
    available: 8,
    description: "Viacfarebné LED svetlá s UV efektom, ideálne pre párty a eventy.",
    mainImage: "/media/320e6751a06d767b4f4e31b2e51a4a60dea49a63dc143727e67890f3d879cd55.jpg",
    images: [
      "/media/320e6751a06d767b4f4e31b2e51a4a60dea49a63dc143727e67890f3d879cd55.jpg"
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
    description: "Profesionálne rotujúce svetelné hlavy s vysokým výkonom.",
    mainImage: "/media/bbf40bc7309782c8efac01d0647863de4dc84bc581a82e5d67f3a8523e02d752.webp",
    images: [
      "/media/bbf40bc7309782c8efac01d0647863de4dc84bc581a82e5d67f3a8523e02d752.webp"
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
    id: "uv-lights",
    name: "Samostatné Bodové UV svetlá",
    category: "lighting",
    pricePerDay: 10,
    available: 2,
    description: "Výkonné UV svetlá pre vytvorenie atmosférických efektov.",
    mainImage: "/media/38b23589a011b1d166936914b2a7f0bd7e1612b7c7054a20010945a937caf1f1.jpg",
    images: [
      "/media/38b23589a011b1d166936914b2a7f0bd7e1612b7c7054a20010945a937caf1f1.jpg"
    ],
    specifications: [
      "UV 395nm",
      "10W výkon",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "UV efekt",
      "DMX ovládanie",
      "Vysoká svietivosť"
    ]
  },
  {
    id: "party-bar",
    name: "Svetlá BeamZ Party Bar",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Kompletný svetelný bar pre párty a eventy s viacerými efekty.",
    mainImage: "/media/2143cfcbdbceef17a4641d34298063871f932bb8055950dd226723d47942649f.jpg",
    images: [
      "/media/2143cfcbdbceef17a4641d34298063871f932bb8055950dd226723d47942649f.jpg"
    ],
    specifications: [
      "RGBW farby",
      "7x 3W LED",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Viacfarebné efekty",
      "Profesionálna kvalita",
      "DMX ovládanie",
      "Vysoká svietivosť"
    ]
  },
  {
    id: "snow-machine",
    name: "Snehostroj ADJ Snow Flurry HO",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "Výkonný snehostroj pre vytvorenie snežnej atmosféry.",
    mainImage: "/media/8b94e446dceb9a44e04c122d963209e7949fc7e779f59f14d0e6f0135260a878.jpg",
    images: [
      "/media/8b94e446dceb9a44e04c122d963209e7949fc7e779f59f14d0e6f0135260a878.jpg"
    ],
    specifications: [
      "500W výkon",
      "2L nádrž",
      "DMX512 ovládanie",
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
    id: "bubble-machine",
    name: "LIGHT4ME Výborník bublín",
    category: "lighting",
    pricePerDay: 20,
    available: 2,
    description: "Výkonný bublinkostroj pre vytvorenie bublinovej atmosféry.",
    mainImage: "/media/7b1c89d3451ba926975d2ec38368030dde21bf8187abdb887dbb858efc9a94e0.jpg",
    images: [
      "/media/7b1c89d3451ba926975d2ec38368030dde21bf8187abdb887dbb858efc9a94e0.jpg"
    ],
    specifications: [
      "400W výkon",
      "1L nádrž",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Malá nádrž",
      "Atmosférické efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "strobe",
    name: "Stroboskop",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "Výkonný stroboskop pre vytvorenie pulzného svetelného efektu.",
    mainImage: "/media/0152ea0b9526a7125263bc5153fecdda741a3584b1a91121ce4032f2f95bc2de.jpg",
    images: [
      "/media/0152ea0b9526a7125263bc5153fecdda741a3584b1a91121ce4032f2f95bc2de.jpg"
    ],
    specifications: [
      "1200W výkon",
      "1-20 Hz",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Rýchlosť regulácia",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "fire-machine",
    name: "Výrobníky plameňov Fire Machine",
    category: "lighting",
    pricePerDay: 30,
    available: 2,
    description: "Výkonné výrobníky plameňov pre dramatické svetelné efekty.",
    mainImage: "/media/6de058e94878cc09dd00dadf1b573d7e60c2415f7b27d4d6f07f2967145a4dc9.jpg",
    images: [
      "/media/6de058e94878cc09dd00dadf1b573d7e60c2415f7b27d4d6f07f2967145a4dc9.jpg"
    ],
    specifications: [
      "2000W výkon",
      "5L nádrž",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Veľká nádrž",
      "Dramatické efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "laser-bar",
    name: "Laserový Bar 65W (8x červený laser)",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Výkonný laserový bar s viacerými efektmi.",
    mainImage: "/media/762d7f97de4b7aabc36fe59b8694b54821e8b1375f233cab9f1c7d36f213abc8.jpeg",
    images: [
      "/media/762d7f97de4b7aabc36fe59b8694b54821e8b1375f233cab9f1c7d36f213abc8.jpeg"
    ],
    specifications: [
      "65W výkon",
      "8x červený laser",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Viacero efektov",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "laser-holographic",
    name: "Holografický Laser",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Holografický laser pre vytvorenie 3D efektov.",
    mainImage: "/media/76042596916dee8b1ebe0612eaf720ff57f7ab7f24dc1cf6414b91d7dde34460.jpg",
    images: [
      "/media/76042596916dee8b1ebe0612eaf720ff57f7ab7f24dc1cf6414b91d7dde34460.jpg"
    ],
    specifications: [
      "50W výkon",
      "Holografický efekt",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "3D efekty",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "laser-red-green",
    name: "Červeno-zelený Laser",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Červeno-zelený laser pre vytvorenie dynamických efektov.",
    mainImage: "/media/e565523e461eaee35a27f85114670121dc1494c7b29b2e0002f5f71ef308ba32.jpg",
    images: [
      "/media/e565523e461eaee35a27f85114670121dc1494c7b29b2e0002f5f71ef308ba32.jpg"
    ],
    specifications: [
      "30W výkon",
      "Červený/zelený laser",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Dynamické efekty",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "beamz-sushi",
    name: "BeamZ SUSHI-Z1 DMX",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Profesionálny DMX riadený svetelný efekt.",
    mainImage: "/media/ac63713587518d2962e4854ac5a344ab2cf0e964faa2a3dc1c28c3b3278dfe40.jpg",
    images: [
      "/media/ac63713587518d2962e4854ac5a344ab2cf0e964faa2a3dc1c28c3b3278dfe40.jpg"
    ],
    specifications: [
      "DMX512 ovládanie",
      "RGBW farby",
      "12/24V DC",
      "IP20 ochrana",
      "Automatické programy"
    ],
    features: [
      "Profesionálna kvalita",
      "DMX ovládanie",
      "Automatické programy",
      "Vysoká svietivosť"
    ]
  },

  // Other Equipment
  {
    id: "projector",
    name: "Premietačka Wanbo T6 MAX",
    category: "other",
    pricePerDay: 20,
    available: 1,
    description: "Vysokokvalitná premietačka Wanbo T6 MAX s vysokým rozlíšením a jasom.",
    mainImage: "/media/b45f164adaefbf0a9e2652fd7aa34dab0d9fa50bdab7205b55f009c6310ae8d2.jpg",
    images: [
      "/media/b45f164adaefbf0a9e2652fd7aa34dab0d9fa50bdab7205b55f009c6310ae8d2.jpg"
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
    description: "Premietacie plátno 110\" s vysokou kvalitou obrazu a jednoduchým nastavením.",
    mainImage: "/media/143f50714d3a307e6303f00a19a2e374a6996397ed82c5ce2a302ca39f2a28c8.png",
    images: [
      "/media/143f50714d3a307e6303f00a19a2e374a6996397ed82c5ce2a302ca39f2a28c8.png"
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
    name: "Osvetľovacia konštrukcia na uchytenie",
    category: "other",
    pricePerDay: 10,
    available: 1,
    description: "Osvetľovacia konštrukcia pre uchytenie všetkých svetiel a efektov.",
    mainImage: "/media/276c7f185f4188dcc24e9fa5a4daa1d10585c945bc41e94348a108846bc81e27.jpg",
    images: [
      "/media/276c7f185f4188dcc24e9fa5a4daa1d10585c945bc41e94348a108846bc81e27.jpg"
    ],
    specifications: [
      "Konštrukcia",
      "Max 100kg",
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
    id: "mic-stand",
    name: "Stojan na mikrofón",
    category: "other",
    pricePerDay: 5,
    available: 2,
    description: "Stojan na mikrofón s vysokou stabilitou a jednoduchým nastavením.",
    mainImage: "/media/a9141bed0fd29e0f3937c2c1b2d1386ebbf1599932613ce429766e9af44bb859.jpg",
    images: [
      "/media/a9141bed0fd29e0f3937c2c1b2d1386ebbf1599932613ce429766e9af44bb859.jpg"
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
    description: "Trojnožka na reproduktory s vysokou stabilitou a jednoduchým nastavením.",
    mainImage: "/media/4e6b4e90687ef8979804fb9500a24f5f8dbb0081d2404d899e6e28646467b823.jpg",
    images: [
      "/media/4e6b4e90687ef8979804fb9500a24f5f8dbb0081d2404d899e6e28646467b823.jpg"
    ],
    specifications: [
      "Trojnožka",
      "Max 1.5m",
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
    id: "speaker-mount",
    name: "Držiak pre dvojicu reproboxov",
    category: "other",
    pricePerDay: 5,
    available: 2,
    description: "Držiak pre dvojicu reproboxov s vysokou stabilitou a jednoduchým nastavením.",
    mainImage: "/media/4898b82b26345a11992ce64614f023bd60aa83de7637eca713bcfb6c8ff39f88.jpg",
    images: [
      "/media/4898b82b26345a11992ce64614f023bd60aa83de7637eca713bcfb6c8ff39f88.jpg"
    ],
    specifications: [
      "Držiak",
      "Max 50kg",
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
    id: "telescopic",
    name: "Teleskopická stojanová tyč",
    category: "other",
    pricePerDay: 8,
    available: 2,
    description: "Teleskopická stojanová tyč s vysokou stabilitou a jednoduchým nastavením.",
    mainImage: "/media/d7bfd119f6cd8102d754abd00090c255ff71dcacc6992e64b98050ccac0a5eb8.jpg",
    images: [
      "/media/d7bfd119f6cd8102d754abd00090c255ff71dcacc6992e64b98050ccac0a5eb8.jpg"
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
  },
  {
    id: "wall-mount",
    name: "Konštrukcia na zavesenie reproduktorov na stenu",
    category: "other",
    pricePerDay: 10,
    available: 1,
    description: "Konštrukcia na zavesenie reproduktorov na stenu s vysokou stabilitou.",
    mainImage: "/media/b548716b902e91a3960a040d2b1671f8a167aa32a9b10c23e2885a96a840eb0b.jpg",
    images: [
      "/media/b548716b902e91a3960a040d2b1671f8a167aa32a9b10c23e2885a96a840eb0b.jpg"
    ],
    specifications: [
      "Konštrukcia",
      "Max 100kg",
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
    id: "rgbw-bar",
    name: "RGBW Led Bar 36w",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "RGBW Led Bar s vysokým výkonom a viacerými efektmi.",
    mainImage: "/media/6ac3f94a868e09cb7022aa2b804d63ecfe67f482dfb6b7b0eedd25200b8ac861.jpeg",
    images: [
      "/media/6ac3f94a868e09cb7022aa2b804d63ecfe67f482dfb6b7b0eedd25200b8ac861.jpeg"
    ],
    specifications: [
      "36W výkon",
      "RGBW farby",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Viacfarebné efekty",
      "Profesionálna kvalita",
      "DMX ovládanie"
    ]
  },
  {
    id: "dj-controller",
    name: "Numark Mixtrack Platinum FX",
    category: "sound",
    pricePerDay: 30,
    available: 1,
    description: "Profesionálny DJ controller pre mixovanie hudby.",
    mainImage: "/media/412c6788cb77b1f0d0316575d54c3c9c2edaca24c041e3e633157de297691e3a.jpg",
    images: [
      "/media/412c6788cb77b1f0d0316575d54c3c9c2edaca24c041e3e633157de297691e3a.jpg"
    ],
    specifications: [
      "2x jog wheel",
      "4x deck",
      "FX controls",
      "USB pripojenie",
      "MIDI ovládanie"
    ],
    features: [
      "Profesionálna kvalita",
      "Viacero efektov",
      "USB pripojenie",
      "MIDI ovládanie"
    ]
  }
];