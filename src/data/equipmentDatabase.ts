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
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    description: "Kompaktný mixážny pult s 8 kanálmi, USB interfészom a jednoduchým ovládaním.",
    mainImage: "/media/Mixážny pult Behringer Xenyx 802.jpg",
    images: [
      "/media/Mixážny pult Behringer Xenyx 802.jpg"
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
    mainImage: "/media/Sada 4 Mikrofónov Omnitronic UHF-304.jpg",
    images: [
      "/media/Sada 4 Mikrofónov Omnitronic UHF-304.jpg"
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
    mainImage: "/media/Mikrofony a headsety Auna VHF.jpg",
    images: [
      "/media/Mikrofony a headsety Auna VHF.jpg"
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
    mainImage: "/media/Reproduktory Behringer B112D.jpg",
    images: [
      "/media/Reproduktory Behringer B112D.jpg"
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
    mainImage: "/media/Reproduktor Behringer B208D.jpg",
    images: [
      "/media/Reproduktor Behringer B208D.jpg"
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
    mainImage: "/media/Subwoofery Behriger B1500XP.jpg",
    images: [
      "/media/Subwoofery Behriger B1500XP.jpg"
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
    mainImage: "/media/The Box Pro DSP 18 Sub.jpg",
    images: [
      "/media/The Box Pro DSP 18 Sub.jpg"
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
    mainImage: "/media/Riadiaci DMX pult Light4Me DMX 192.jpg",
    images: [
      "/media/Riadiaci DMX pult Light4Me DMX 192.jpg"
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
    mainImage: "/media/RGBWA UV Led Par svetlá.jpg",
    images: [
      "/media/RGBWA UV Led Par svetlá.jpg"
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
    mainImage: "/media/Rotujúca 90w Beam hlava.webp",
    images: [
      "/media/Rotujúca 90w Beam hlava.webp"
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
    mainImage: "/media/Samostatné Bodové UV svetlá.jpg",
    images: [
      "/media/Samostatné Bodové UV svetlá.jpg"
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
    mainImage: "/media/Svetlá BeamZ Party Bar.jpg",
    images: [
      "/media/Svetlá BeamZ Party Bar.jpg"
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
    mainImage: "/media/Snehostroj ADJ Snow Flurry HO.jpg",
    images: [
      "/media/Snehostroj ADJ Snow Flurry HO.jpg"
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
    mainImage: "/media/LIGHT4ME Výborník bublín.jpg",
    images: [
      "/media/LIGHT4ME Výborník bublín.jpg"
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
    mainImage: "/media/Stroboskop.jpg",
    images: [
      "/media/Stroboskop.jpg"
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
    mainImage: "/media/Výrobníky plameňov Fire Machine.jpg",
    images: [
      "/media/Výrobníky plameňov Fire Machine.jpg"
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
    mainImage: "/media/Laserový Bar 65W (8x červený laser).jpeg",
    images: [
      "/media/Laserový Bar 65W (8x červený laser).jpeg"
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
    mainImage: "/media/Holografický Laser.jpg",
    images: [
      "/media/Holografický Laser.jpg"
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
    mainImage: "/media/Červeno-zelený Laser.jpg",
    images: [
      "/media/Červeno-zelený Laser.jpg"
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
    mainImage: "/media/BeamZ SUSHI-Z1 DMX.jpg",
    images: [
      "/media/BeamZ SUSHI-Z1 DMX.jpg"
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
    mainImage: "/media/Premietačka Wanbo T6 MAX.jpg",
    images: [
      "/media/Premietačka Wanbo T6 MAX.jpg"
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
    mainImage: "/media/Premietacie plátno 110”.png",
    images: [
      "/media/Premietacie plátno 110”.png"
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
    mainImage: "/media/Konštrukcia na zavesenie reproduktorov na stenu.jpg",
    images: [
      "/media/Konštrukcia na zavesenie reproduktorov na stenu.jpg"
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
    mainImage: "/media/Stojan na mikrofón.jpg",
    images: [
      "/media/Stojan na mikrofón.jpg"
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
    mainImage: "/media/Trojnožka na reproduktory.jpg",
    images: [
      "/media/Trojnožka na reproduktory.jpg"
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
    mainImage: "/media/Držiak pre dvojicu reproboxov.jpg",
    images: [
      "/media/Držiak pre dvojicu reproboxov.jpg"
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
    mainImage: "/media/Teleskopická stojanová tyč.jpg",
    images: [
      "/media/Teleskopická stojanová tyč.jpg"
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
    mainImage: "/media/Konštrukcia na zavesenie reproduktorov na stenu.jpg",
    images: [
      "/media/Konštrukcia na zavesenie reproduktorov na stenu.jpg"
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
    mainImage: "/media/RGBW Led Bar 36w.jpeg",
    images: [
      "/media/RGBW Led Bar 36w.jpeg"
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
    mainImage: "/media/Numark Mixtrack Platinum FX.jpg",
    images: [
      "/media/Numark Mixtrack Platinum FX.jpg"
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