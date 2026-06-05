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
    description: "Všestranný analógový mixážny pult s mimoriadne nízkym šumom, ideálny pre stredne veľké podujatia, živé kapely, svadby či firemné večierky. Vďaka integrovanému USB audio rozhraniu umožňuje priame prepojenie s notebookom.",
    mainImage: "/media/Mixážny pult Behringer Xenyx X1222 USB.jpg",
    images: [
      "/media/Mixážny pult Behringer Xenyx X1222 USB.jpg"
    ],
    specifications: [
      "Počet kanálov: 16 (4 mono, 4 stereo)",
      "Ekvalizér: 3-pásmový na každom kanáli + 7-pásmový grafický hlavný EQ",
      "Efektový procesor: Áno (24-bit, 16 predvolieb)",
      "Pripojenie: USB, XLR, Jack 6.3 mm"
    ],
    features: [
      "Prémiové predzosilňovače: XENYX mikrofónne predzosilňovače zaručujú krištáľovo čistý zvuk.",
      "Jednogombíkové kompresory: Jednoduché nastavenie dynamiky pre dokonale vyvážený hlas.",
      "24-bitový Multi-FX procesor: Špičkové efekty (reverb, delay, chorus) pre profesionálny zvukový prejav.",
      "USB pripojenie: Jednoduché prehrávanie podmazovej hudby alebo priamy nahrávanie celého eventu."
    ]
  },
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    description: "Ideálny pomocník pre menšie akcie, prezentácie, prednášky či ako pomocný mix pre DJ-ov. Ponúka skvelú kvalitu zvuku v maximálne kompaktnom a spoľahlivom tele.",
    mainImage: "/media/Mixážny pult Behringer Xenyx 802.jpg",
    images: [
      "/media/Mixážny pult Behringer Xenyx 802.jpg"
    ],
    specifications: [
      "Počet kanálov: 8 (2 mono, 2 stereo)",
      "Mikrofónne predzosilňovače: 2x XENYX s fantómovým napájaním (+48 V)",
      "Ekvalizér: 3-pásmový",
      "Hlavný výstup: Jack 6.3 mm"
    ],
    features: [
      "Kompaktné rozmery: Minimálne nároky na priestor, rýchla montáž a zapojenie.",
      "Britský EQ: Trojpásmový ekvalizér poskytuje teplý a muzikálny charakter zvuku.",
      "Flexibilita: Skvelé riešenie pre zapojenie dvoch mikrofónov a podmazovej hudby z telefónu či notebooku."
    ]
  },
  {
    id: "mic-set",
    name: "Sada 2 mikrofónov the t.bone free solo Twin HT",
    category: "sound",
    pricePerDay: 20,
    available: 1,
    description: "Špičkový set dvoch bezdrôtových dynamických mikrofónov do ruky, navrhnutý pre moderátorov, spevákov a rečníkov. Poskytuje stabilný prenos signálu bez výpadkov.",
    mainImage: "/media/Sada 2 mikrofónov the t.bone free solo Twin HT.jpg",
    images: [
      "/media/Sada 2 mikrofónov the t.bone free solo Twin HT.jpg"
    ],
    specifications: [
      "Typ mikrofónov: Dynamické, kardioidná charakteristika",
      "Pásmo: UHF (nastaviteľné frekvencie)",
      "Výstupy: 2x XLR (samostatné) alebo 1x Jack 6.3 mm (mix)",
      "Napájanie mikrofónov: 2x AA batéria"
    ],
    features: [
      "Duálny systém: Jeden prijímač obsluhuje obidva mikrofóny súčasne, čo šetrí miesto a kabeláž.",
      "Žiadne rušenie: Nastaviteľné frekvencie v bezpečnom pásme eliminujú riziko rušenia inými zariadeniami.",
      "Jasný LCD displej: Neustály prehľad o stave batérie a sile signálu priamo na mikrofóne aj prijímači."
    ]
  },
  {
    id: "mic-auna",
    name: "Mikrofony a headsety Auna VHF",
    category: "sound",
    pricePerDay: 10,
    available: 4,
    description: "Komplexný bezdrôtový systém s dvoma mikrofónmi do ruky and dvoma hlavovými headsetmi (náhlavnými mikrofónmi). Perfektná voľba pre diskusné fóra, divadlá, konferencie či firemné teambuildingy.",
    mainImage: "/media/Mikrofony a headsety Auna VHF.jpg",
    images: [
      "/media/Mikrofony a headsety Auna VHF.jpg"
    ],
    specifications: [
      "Frekvenčné pásmo: VHF",
      "Obsah balenia: 2x Handheld mikrofón, 2x Headset s bodypackom, 1x Prijímač",
      "Dosah signálu: do 50 metrov (v otvorenom priestore)"
    ],
    features: [
      "Maximálna voľnosť pohybu: Headsety umožňujú rečníkom mať úplne voľné ruky pre prezentáciu.",
      "Až 4 zdroje súčasne: Schopnosť ozvučiť až štyri osoby naraz pomocou jednej kompaktnej základne.",
      "Dlhá výdrž: Energeticky úsporná konštrukcia zaručuje bezproblémové fungovanie počas celého eventu."
    ]
  },
  {
    id: "speakers-b112d",
    name: "Reproduktory Behringer b112d",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    description: "Výkonný dvojpásmový aktívny reproduktor s čistým a dynamickým prejavom. Ideálna voľba pre hlavné ozvučenie osláv, svadieb a stredne veľkých tanečných parketov.",
    mainImage: "/media/Reproduktory Behringer B112D.jpg",
    images: [
      "/media/Reproduktory Behringer B112D.jpg"
    ],
    specifications: [
      "Výkon: 1000 W (Peak)",
      "Reproduktory: 12\" basový + 1.35\" hliníkový kompresný výškový menič",
      "Vstupy: 2x XLR/Jack kombo vstupy s nezávislým nastavením hlasitosti",
      "Hmotnosť: 12.3 kg"
    ],
    features: [
      "Vysoký výkon: 1000 W v špičke zabezpečí dostatočný akustický tlak aj pre zaplnený parket.",
      "Class-D zosilňovač: Obrovský výkon a skvelý zvukový prejav v prekvapivo ľahkom šasi.",
      "Wireless-ready: Možnosť priameho prepojenia s digitálnymi bezdrôtovými mikrofónmi Behringer."
    ]
  },
  {
    id: "speaker-b208d",
    name: "Reproduktor Behringer b208d",
    category: "sound",
    pricePerDay: 12,
    available: 1,
    description: "Ultra-kompaktný a ľahký aktívny reproduktor, ktorý skvele poslúži ako pódiový odposluch (monitor) pre DJ-a/speváka, alebo ako hlavné ozvučenie pre menšie prezentácie a tlačové konferencie.",
    mainImage: "/media/Reproduktor Behringer B208D.jpg",
    images: [
      "/media/Reproduktor Behringer B208D.jpg"
    ],
    specifications: [
      "Výkon: 200 W",
      "Reproduktor: 8\" basový + 1.35\" výškový menič",
      "Vstupy: 1x XLR, 1x Jack 6.3 mm"
    ],
    features: [
      "Maximálna mobilita: Vďaka nízkej váhe a integrovanému madlu je manipulácia hračkou.",
      "Flexibilné umiestnenie: Trapézový tvar umožňuje umiestnenie na stojan alebo položenie na zem ako monitor."
    ]
  },
  {
    id: "sub-b1500xp",
    name: "Subwoofery Behriger B1500XP",
    category: "sound",
    pricePerDay: 30,
    available: 2,
    description: "Profesionálny 15-palcový subwoofer s masívnym výkonom, navrhnutý pre nekompromisnú reprodukciu najnižších frekvencií. Dodá každej párty ten správny klubový ráz.",
    mainImage: "/media/Subwoofery Behriger B1500XP.jpg",
    images: [
      "/media/Subwoofery Behriger B1500XP.jpg"
    ],
    specifications: [
      "Výkon: 3000 W",
      "Reproduktor: 15\" Turbosound",
      "Integrovaný Boost Frequency a Phase spínač pre precízne naladenie basov"
    ],
    features: [
      "Brutálne basy: 15\" menič Turbosound produkuje hlboký a čitateľný basový tlak, ktorý doslova ucítite.",
      "Aktívna výhybka: Integrovaný stereo crossover posiela ideálne frekvencie priamo do vašich satelitných reproduktorov.",
      "Ochranné obvody: Tepelná ochrana a limitácia chránia subwoofer aj pri celonočnom maximálnom zaťažení."
    ]
  },
  {
    id: "sub-dsp18",
    name: "Subwoofer The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 35,
    available: 5,
    description: "Masívny 18-palcový subwoofer s integrovaným DSP procesorom. Navrhnutý pre veľké podujatia, stany a open-air akcie, kde je vyžadovaný extrémny tlak v basovom pásme a maximálna kontrola nad zvukom.",
    mainImage: "/media/The Box Pro DSP 18 Sub.jpg",
    images: [
      "/media/The Box Pro DSP 18 Sub.jpg"
    ],
    specifications: [
      "Výkon: 800 W (RMS) / 2400 W (Peak)",
      "Reproduktor: 18\" s 4\" cievkou",
      "Frekvenčný rozsah: 30 Hz – 150 Hz",
      "Max SPL: 128 dB"
    ],
    features: [
      "Maximálny akustický tlak: 18\" basový menič bez problémov zaplní basmi aj veľké priestranstvá.",
      "Pokročilé DSP: Prednastavené režimy a konfigurácie umožňujú okamžité zladenie s akýmikoľvek satelitnými reproduktormi.",
      "Robustná konštrukcia: Pevná drevená ozvučnica chráni komponenty a minimalizuje nechcené rezonancie."
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
  },

  // Lighting Equipment
  {
    id: "dmx-pult",
    name: "Riadiaci DMX pult Light4Me DMX 192",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Profesionálny ovládač svetelnej techniky, ktorý umožňuje kompletnú kontrolu nad celou svetelnou šou – od statických farieb po zložité pohyby hláv.",
    mainImage: "/media/Riadiaci DMX pult Light4Me DMX 192.jpg",
    images: [
      "/media/Riadiaci DMX pult Light4Me DMX 192.jpg"
    ],
    specifications: [
      "Počet DMX kanálov: 192",
      "Ovládanie až 12 inteligentných svetiel (každé do 16 kanálov)",
      "Zabudovaný mikrofón pre synchronizáciu svetiel s hudbou (Sound-to-Light)"
    ],
    features: [
      "Kontrola v reálnom čase: Umožňuje okamžite reagovať na zmenu atmosféry na parkete.",
      "Programovateľné scény: Možnosť predpripraviť si svetelné scény pre rôzne fázy eventu (romantický tanec, divoká gradácia)."
    ]
  },
  {
    id: "beamz-sushi",
    name: "Digitálne PC/DMX rozhranie BeamZ SUSHI-DS",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Ultra-kompaktné DMX rozhranie, ktoré premení váš počítač na profesionálny svetelný pult. Umožňuje programovanie svetelných šou cez moderné softvéry.",
    mainImage: "/media/BeamZ SUSHI-Z1 DMX.jpg",
    images: [
      "/media/BeamZ SUSHI-Z1 DMX.jpg"
    ],
    specifications: [
      "Počet kanálov: 128 (rozšíriteľné na 512)",
      "Kompatibilita: Sunlite, Daslight, Light Rider a ďalšie"
    ],
    features: [
      "Moderné ovládanie: Tvorba dychberúcich svetelných efektov vizuálne priamo na obrazovke notebooku.",
      "Kompaktnosť: Zariadenie veľkosti USB kľúča, ktoré nahradí rozmerné hardvérové pulty."
    ]
  },
  {
    id: "led-par",
    name: "Profesionálne LED Par reflektory (RGBWA + UV)",
    category: "lighting",
    pricePerDay: 8,
    available: 8,
    description: "Výkonné LED reflektory určené na nasvietenie sály (uplighting), pódia alebo vytvorenie dynamických farebných podmazov na tanečnom parkete.",
    mainImage: "/media/RGBWA UV Led Par svetlá.jpg",
    images: [
      "/media/RGBWA UV Led Par svetlá.jpg"
    ],
    specifications: [
      "Zdroj svetla: High-power LED diódy",
      "Režimy: DMX, Auto, Sound active (podľa hudby), Master/Slave"
    ],
    features: [
      "6v1 technológia: Kombinácia farieb červená, zelená, modrá, biela, jantárová (Amber) a ultrafialová (UV) pre nekonečné spektrum farieb.",
      "Dokonalá sýtosť: Jantárová zaručuje teplé pastelové tóny, UV svetlo vytvára magický neónový efekt."
    ]
  },
  {
    id: "beam-head",
    name: "Inteligentná otočná hlava Moving Head 90W Beam",
    category: "lighting",
    pricePerDay: 25,
    available: 4,
    description: "Rýchla a výkonná otočná hlava s úzkym, ostrým lúčom (Beam efekt). Vytvára ohromujúce svetelné divadlo v priestore, najmä v kombinácii s dymostrojom.",
    mainImage: "/media/Rotujúca 90w Beam hlava.webp",
    images: [
      "/media/Rotujúca 90w Beam hlava.webp"
    ],
    specifications: [
      "Výkon LED: 90 W",
      "Efekty: Gobo koleso, farebné koleso, prizma (rozklad lúča)",
      "Ovládanie: DMX, Sound, Auto"
    ],
    features: [
      "Dynamika pohybu: Rýchla rotácia and presné smerovanie lúčov dodajú podujatiu klubovú energiu.",
      "Gobo a farebné koleso: Množstvo svetelných obrazcov a sýtych farieb pre rozmanitú šou."
    ]
  },
  {
    id: "rgbw-bar",
    name: "Svetelná LED lišta RGBW Led Bar 36W",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "Dekoratívna svetelná lišta, ideálna na plošné podfarbenie stien (wall-washing), podsvietenie DJ pultu alebo dekoráciu konštrukcií.",
    mainImage: "/media/RGBW Led Bar 36w.jpeg",
    images: [
      "/media/RGBW Led Bar 36w.jpeg"
    ],
    specifications: [
      "Výkon: 36 W",
      "Miešanie farieb: RGBW (červená, zelená, modrá, biela)"
    ],
    features: [
      "Lineárne nasvietenie: Rovnomerne pokryje veľkú plochu steny elegantným farebným tónom.",
      "Nízky profil: Nenápadný dizajn, ktorý opticky neruší vzhľad sály."
    ]
  },
  {
    id: "laser-bar",
    name: "Efektový laserový bar 65W s ôsmimi červenými lúčmi",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Unikátny svetelný bar generujúci 8 paralelných, extrémne silných červených laserových lúčov. Vytvára efekt laserovej steny alebo stropu.",
    mainImage: "/media/Laserový Bar 65W (8x červený laser).jpeg",
    images: [
      "/media/Laserový Bar 65W (8x červený laser).jpeg"
    ],
    specifications: [
      "Celkový príkon: 65 W",
      "Typ laseru: 8x červený laserový modul s nezávislým naklápaním (Tilt)"
    ],
    features: [
      "Sci-Fi vizuál: Vytvára futuristickú atmosféru a dychberúcu geometriu v priestore.",
      "Vysoká svietivosť: Lúče sú jasne viditeľné aj na dlhšie vzdialenosti."
    ]
  },
  {
    id: "smoke-machine",
    name: "Profesionálny dymostroj ADJ VF 1300",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Výkonný generátor hmly, ktorý je kľúčový pre vizualizáciu svetelných a laserových lúčov. Bez dymu sú svetlá len škvrny na zemi – s ním tvoria priestorové umenie.",
    mainImage: "/media/Dymostroj ADJ VF 1300.jpg",
    images: [
      "/media/Dymostroj ADJ VF 1300.jpg"
    ],
    specifications: [
      "Výkon výhrevného telesa: 1300 W",
      "Doba prvého žhavenia: cca 7 minút",
      "Ovládanie: Káblové aj bezdrôtové diaľkové ovládanie"
    ],
    features: [
      "Vysoká produkcia: Rýchlo zaplní tanečný parket hustou, bezpečnou hmlou.",
      "Technológia ETS: Elektronické snímanie teploty zaisťuje optimálnu úroveň ohrevu bez prerušovania."
    ]
  },
  {
    id: "bubble-machine",
    name: "Výkonný generátor mydlových bublín",
    category: "lighting",
    pricePerDay: 20,
    available: 2,
    description: "Skvelý efektový stroj, ktorý vyčaruje stovky bublín za minútu. Najpopulárnejší prvok pre detské oslavy, svadby (počas novomanželského tanca) a rodinné podujatia.",
    mainImage: "/media/LIGHT4ME Výborník bublín.jpg",
    images: [
      "/media/LIGHT4ME Výborník bublín.jpg"
    ],
    specifications: [
      "Veľkokapacitná nádrž pre nepretržitú prevádzku",
      "Bezpečná prevádzka s certifikovanými náplňami"
    ],
    features: [
      "Radosť pre všetkých: Zaručený úspech u detí a skvelý vizuál na svadobných fotografiách.",
      "Jednoduchá obsluha: Stačí naliať kvapalinu a zapnúť."
    ]
  },
  {
    id: "snow-machine",
    name: "Výkonný výrobník umelého snehu ADJ Snow Flurry HO",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "Profesionálny stroj na tvorbu umelého snehu na báze peny. Vytvára autentickú zimnú atmosféru kedykoľvek počas roka – ideálny pre vianočné večierky či tematické fotenia.",
    mainImage: "/media/Snehostroj ADJ Snow Flurry HO.jpg",
    images: [
      "/media/Snehostroj ADJ Snow Flurry HO.jpg"
    ],
    specifications: [
      "Výkon: Vysokokapacitná produkcia (High Output)",
      "Ovládanie: Diaľkový ovládač s časovačom (Timer)"
    ],
    features: [
      "Okamžitá zima: Generuje penu, ktorá imituje padajúce snehové vločky a po dopade nezanecháva trvalé fľaky.",
      "Prepínač množstva: Možnosť nastaviť od jemného sneženia až po hustú snehovú fujavicu."
    ]
  },
  {
    id: "fire-machine",
    name: "Pódiový výrobník skutočných plameňov Fire Machine",
    category: "lighting",
    pricePerDay: 30,
    available: 2,
    description: "Extrémny vizuálny efekt generujúci kontrolované výšľahy reálneho ohňa. Používa sa na vyvrcholenie koncertov, predstavení alebo na veľkolepý úvod podujatí.",
    mainImage: "/media/Výrobníky plameňov Fire Machine.jpg",
    images: [
      "/media/Výrobníky plameňov Fire Machine.jpg"
    ],
    specifications: [
      "Výška plameňa: cca 2 až 3 metre",
      "Palivo: Špeciálne aerosólové nádoby (flame spray)"
    ],
    features: [
      "WOW Efekt: Ohromujúci prvok, ktorý okamžite pritiahne pozornosť celého publika a dodá akcii prestíž.",
      "Bezpečné spustenie: Plne ovládateľné cez DMX protokol pre presné načasovanie do rytmu hudby."
    ]
  },
  {
    id: "party-bar",
    name: "Kompletný svetelný set BeamZ Party Bar",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "\"All-in-one\" svetelné riešenie na jednom stojane. Obsahuje kombináciu rôznych svetelných efektov, čo z neho robí ideálnu voľbu pre rýchle nasvietenie menších osláv a párty.",
    mainImage: "/media/Svetlá BeamZ Party Bar.jpg",
    images: [
      "/media/Svetlá BeamZ Party Bar.jpg"
    ],
    specifications: [
      "Svetelné zdroje: High-efficiency LED",
      "Súčasťou balenia: Diaľkový ovládač, prepravná taška"
    ],
    features: [
      "Všetko v jednom: Obsahuje PAR reflektory, derby efekty či stroboskopické diódy na jednej lište.",
      "Plug & Play: Extrémne rýchla montáž – stačí postaviť na stojan, zapojiť do siete a zapnúť automatický režim."
    ]
  },
  {
    id: "uv-lights",
    name: "Bodový UV LED reflektor (Blacklight)",
    category: "lighting",
    pricePerDay: 10,
    available: 2,
    description: "Reflektor vyžarujúci ultrafialové (UV) svetlo. Spôsobuje, že biele oblečenie a fluorescenčné predmety v tme jasne svietia.",
    mainImage: "/media/Samostatné Bodové UV svetlá.jpg",
    images: [
      "/media/Samostatné Bodové UV svetlá.jpg"
    ],
    specifications: [
      "Typ: UV LED diódy s vysokým výkonom and dlhou životnosťou"
    ],
    features: [
      "Tajuplná atmosféra: Nenahraditeľný efekt pre tematické Halloween párty, diskotéky a retro akcie."
    ]
  },
  {
    id: "strobe",
    name: "Výkonný zábleskový stroboskop",
    category: "lighting",
    pricePerDay: 15,
    available: 1,
    description: "Tradičný klubový efekt, ktorý generuje ultrarýchle, intenzívne biele záblesky. Opticky \"kúskuje\" pohyb na tanečnom parkete.",
    mainImage: "/media/Stroboskop.jpg",
    images: [
      "/media/Stroboskop.jpg"
    ],
    specifications: [
      "Nastaviteľná rýchlosť: Od pomalých pulzov až po extrémnu frekvenciu zábleskov"
    ],
    features: [
      "Maximálna energia: Vybudí atmosféru na tanečnom parkete počas gradácie skladieb na maximum."
    ]
  },
  {
    id: "laser-holographic",
    name: "Profesionálny multipoint holografický laser",
    category: "lighting",
    pricePerDay: 25,
    available: 1,
    description: "Projektuje tisíce rotujúcich mikro-lúčov, čím vytvára efekt hviezdnej oblohy alebo komplexnej holografickej siete po celom priestore sály.",
    mainImage: "/media/Holografický Laser.jpg",
    images: [
      "/media/Holografický Laser.jpg"
    ],
    specifications: [
      "Typ: Multipoint Holographic Laser"
    ],
    features: [
      "Plošné pokrytie: Jeden laser dokáže vizuálne zaplniť celú sálu jemnou a elegantnou sieťou lúčov."
    ]
  },
  {
    id: "laser-red-green",
    name: "Dvojfarebný grafický červeno-zelený laser",
    category: "lighting",
    pricePerDay: 20,
    available: 1,
    description: "Klasický párty laser projektujúci dynamické geometrické tvary, tunely a roviny v dvoch základných farbách.",
    mainImage: "/media/Červeno-zelený Laser.jpg",
    images: [
      "/media/Červeno-zelený Laser.jpg"
    ],
    specifications: [
      "Farby: Červená, Zelená"
    ],
    features: [
      "Klubová klasika: Najlepšie vynikne v kombinácii s jemným dymom, kde vytvára jasné pohybujúce sa svetelné plochy."
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
  }
];