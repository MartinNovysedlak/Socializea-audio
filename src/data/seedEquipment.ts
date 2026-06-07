export interface SeedItem {
  name: string;
  category: 'sound' | 'lighting' | 'other';
  pricePerDay: number;
  available: number;
  description: string;
  images: string[];
  specifications: string[];
  features: string[];
}

export const seedEquipmentData: SeedItem[] = [
  // 1. Zvuková technika
  {
    name: "Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 2,
    description: "Všestranný analógový mixážny pult s mimoriadne nízkym šumom, ideálny pre stredne veľké podujatia, živé kapely, svadby či firemné večierky. Vďaka integrovanému USB audio rozhraniu umožňuje priame prepojenie s notebookom.",
    images: [],
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
      "USB pripojenie: Jednoduché prehrávanie podmazovej hudby alebo priame nahrávanie celého eventu."
    ]
  },
  {
    name: "Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 12,
    available: 3,
    description: "Ideálny pomocník pre menšie akcie, prezentácie, prednášky či ako pomocný mix pre DJ-ov. Ponúka skvelú kvalitu zvuku v maximálne kompaktnom a spoľahlivom tele.",
    images: [],
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
    name: "the t.bone free solo Twin HT",
    category: "sound",
    pricePerDay: 30,
    available: 2,
    description: "Špičkový set dvoch bezdrôtových dynamických mikrofónov do ruky, navrhnutý pre moderátorov, spevákov a rečníkov. Poskytuje stabilný prenos signálu bez výpadkov.",
    images: [],
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
    name: "Auna VHF (Sada 4 mikrofónov a headsetov)",
    category: "sound",
    pricePerDay: 35,
    available: 2,
    description: "Komplexný bezdrôtový systém s dvoma mikrofónmi do ruky a dvoma hlavovými headsetmi (náhlavnými mikrofónmi). Perfektná voľba pre diskusné fóra, divadlá, konferencie či firemné teambuildingy.",
    images: [],
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
    name: "Behringer B112D",
    category: "sound",
    pricePerDay: 25,
    available: 4,
    description: "Výkonný dvojpásmový aktívny reproduktor s čistým a dynamickým prejavom. Ideálna voľba pre hlavné ozvučenie osláv, svadieb a stredne veľkých tanečných parketov.",
    images: [],
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
    name: "Behringer B208D",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    description: "Ultra-kompaktný a ľahký aktívny reproduktor, ktorý skvele poslúži ako pódiový odposluch (monitor) pre DJ-a/speváka, alebo ako hlavné ozvučenie pre menšie prezentácie a tlačové konferencie.",
    images: [],
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
    name: "Behringer B1500XP",
    category: "sound",
    pricePerDay: 40,
    available: 2,
    description: "Profesionálny 15-palcový subwoofer s masívnym výkonom, navrhnutý pre nekompromisnú reprodukciu najnižších frekvencií. Dodá každej párty ten správny klubový ráz.",
    images: [],
    specifications: [
      "Výkon: 3000 W",
      "Reproduktor: 15\" Turbosound",
      "Integrovaný Boost Frequency a Phase spínač pre precízne naladenie basov"
    ],
    features: [
      "Brutálne basy: 15\" menič Turbosound produkuje hlboký a čitateľný basový tlak, ktorý doslova ucítite.",
      "Aktívna výhybka: Integrovaný stereo crossover posiela ideálne frekvencie priamo do satelitných reproduktorov.",
      "Ochranné obvody: Tepelná ochrana a limitácia chránia subwoofer aj pri celonočnom maximálnom zaťažení."
    ]
  },
  {
    name: "The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 50,
    available: 2,
    description: "Masívny 18-palcový subwoofer s integrovaným DSP procesorom. Navrhnutý pre veľké podujatia, stany a open-air akcie, kde je vyžadovaný extrémny tlak v basovom pásme a maximálna kontrola nad zvukom.",
    images: [],
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
  // 2. Svetlá a efekty
  {
    name: "Light4Me DMX 192",
    category: "lighting",
    pricePerDay: 15,
    available: 2,
    description: "Profesionálny ovládač svetelnej techniky, ktorý umožňuje kompletnú kontrolu nad celou svetelnou šou – od statických farieb po zložité pohyby hláv.",
    images: [],
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
    name: "BeamZ SUSHI-DS",
    category: "lighting",
    pricePerDay: 10,
    available: 2,
    description: "Ultra-kompaktné DMX rozhranie, ktoré premení váš počítač na profesionálny svetelný pult. Umožňuje programovanie svetelných šou cez moderné softvéry.",
    images: [],
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
    name: "RGBWA UV Led Par svetlá",
    category: "lighting",
    pricePerDay: 8,
    available: 16,
    description: "Výkonné LED reflektory určené na nasvietenie sály (uplighting), pódia alebo vytvorenie dynamických farebných podmazov na tanečnom parkete.",
    images: [],
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
    name: "Rotujúca 90W Beam hlava",
    category: "lighting",
    pricePerDay: 25,
    available: 4,
    description: "Rýchla a výkonná otočná hlava s úzkym, ostrým lúčom (Beam efekt). Vytvára ohromujúce svetelné divadlo v priestore, najmä v kombinácii s dymostrojom.",
    images: [],
    specifications: [
      "Výkon LED: 90 W",
      "Efekty: Gobo koleso, farebné koleso, prizma (rozklad lúča)",
      "Ovládanie: DMX, Sound, Auto"
    ],
    features: [
      "Dynamika pohybu: Rýchla rotácia a presné smerovanie lúčov dodajú podujatiu klubovú energiu.",
      "Gobo a farebné koleso: Množstvo svetelných obrazcov a sýtych farieb pre rozmanitú šou."
    ]
  },
  {
    name: "RGBW Led Bar 36W",
    category: "lighting",
    pricePerDay: 10,
    available: 8,
    description: "Dekoratívna svetelná lišta, ideálna na plošné podfarbenie stien (wall-washing), podsvietenie DJ pultu alebo dekoráciu konštrukcií.",
    images: [],
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
    name: "Laserový Bar 65W (8x červený laser)",
    category: "lighting",
    pricePerDay: 30,
    available: 2,
    description: "Unikátny svetelný bar generujúci 8 paralelných, extrémne silných červených laserových lúčov. Vytvára efekt laserovej steny alebo stropu.",
    images: [],
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
    name: "Dymostroj ADJ VF 1300",
    category: "lighting",
    pricePerDay: 20,
    available: 2,
    description: "Výkonný generátor hmly, ktorý je kľúčový pre vizualizáciu svetelných a laserových lúčov. Bez dymu sú svetlá len škvrny na zemi – s ním tvoria priestorové umenie.",
    images: [],
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
    name: "Bublinkostroj",
    category: "lighting",
    pricePerDay: 15,
    available: 2,
    description: "Skvelý efektový stroj, ktorý vyčaruje stovky bublín za minútu. Najpopulárnejší prvok pre detské oslavy, svadby (počas novomanželského tanca) a rodinné podujatia.",
    images: [],
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
    name: "Snehostroj ADJ Snow Flurry HO",
    category: "lighting",
    pricePerDay: 30,
    available: 1,
    description: "Profesionálny stroj na tvorbu umelého snehu na báze peny. Vytvára autentickú zimnú atmosféru kedykoľvek počas roka – ideálny pre vianočné večierky či tematické fotenia.",
    images: [],
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
    name: "Výrobníky plameňov Fire Machine",
    category: "lighting",
    pricePerDay: 45,
    available: 2,
    description: "Extrémny vizuálny efekt generujúci kontrolované výšľahy reálneho ohňa. Používa sa na vyvrcholenie koncertov, predstavení alebo na veľkolepý úvod podujatí.",
    images: [],
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
    name: "BeamZ Party Bar",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "\"All-in-one\" svetelné riešenie na jednom stojane. Obsahuje kombináciu rôznych svetelných efektov, čo z neho robí ideálnu voľbu pre rýchle nasvietenie menších osláv a párty.",
    images: [],
    specifications: [
      "Svetelné zdroje: High-efficiency LED",
      "Súčasťou balenia: Diaľkový ovládač, prepravná taška"
    ],
    features: [
      "Všetko v jednom: Obsahuje PAR reflektory, derby efekty či stroboskopické diódy na jednej lište.",
      "Plug & Play: Extrémne rýchla montáž – stačí postaviť na stojan, zapojuť do sieci a zapnúť automatický režim."
    ]
  },
  {
    name: "Samostatné Bodové UV svetlá",
    category: "lighting",
    pricePerDay: 10,
    available: 4,
    description: "Reflektor vyžarujúci ultrafialové (UV) svetlo. Spôsobuje, že biele oblečenie a fluorescenčné predmety v tme jasne svietia.",
    images: [],
    specifications: [
      "Typ: UV LED diódy s vysokým výkonom a dlhou životnosťou"
    ],
    features: [
      "Tajuplná atmosféra: Nenahraditeľný efekt pre tematické Halloween párty, diskotéky a retro akcie."
    ]
  },
  {
    name: "Stroboskop",
    category: "lighting",
    pricePerDay: 12,
    available: 2,
    description: "Tradičný klubový efekt, ktorý generuje ultrarýchle, intenzívne biele záblesky. Opticky \"kúskuje\" pohyb na tanečnom parkete.",
    images: [],
    specifications: [
      "Nastaviteľná rýchlosť: Od pomalých pulzov ako maják až po extrémnu frekvenciu zábleskov."
    ],
    features: [
      "Maximálna energia: Vybudí atmosféru na tanečnom parkete počas gradácie skladieb na maximum."
    ]
  },
  {
    name: "Holografický Laser",
    category: "lighting",
    pricePerDay: 15,
    available: 2,
    description: "Profesionálny multipoint holografický laser. Projektuje tisíce rotujúcich mikro-lúčov, čím vytvára efekt hviezdnej oblohy alebo komplexnej holografickej sieci po celom priestore sály.",
    images: [],
    specifications: [
      "Typ: Multi-point laserový projektor",
      "Farba: Červená, zelená"
    ],
    features: [
      "Plošné pokrytie: Jeden laser dokáže vizuálne zaplniť celú sálu jemnou a elegantnou sieťou lúčov."
    ]
  },
  {
    name: "Červeno-zelený Laser",
    category: "lighting",
    pricePerDay: 12,
    available: 2,
    description: "Klasický párty laser projektujúci dynamické geometrické tvary, tunely a roviny v dvoch základných farbách.",
    images: [],
    specifications: [
      "Prevádzkové režimy: DMX, Auto, Sound active",
      "Kľúčové farby: Červená (650nm), Zelená (532nm)"
    ],
    features: [
      "Klubová klasika: Najlepšie vynikne v kombinácii s jemným dymom, kde vytvára jasné pohybujúce sa svetelné plochy."
    ]
  },
  // 3. Projekčná technika a príslušenstvo
  {
    name: "Smart Projektor Wanbo T6 MAX",
    category: "other",
    pricePerDay: 30,
    available: 2,
    description: "Prémiový Smart projektor s natívnym Full HD rozlíšením a vysokou svietivosťou. Ideálny na premietanie svadobných videí, prezentácií, firemných podkladov alebo športových prenosov.",
    images: [],
    specifications: [
      "Rozlíšenie: Native 1080p (Full HD)",
      "Svietivosť: Vysoké ANSI lúmeny pre jasný obraz",
      "Konektivita: Wi-Fi, Bluetooth, HDMI, USB"
    ],
    features: [
      "Smart systém: Vďaka integrovanému Androidu podporuje aplikácie priamo bez nutnosti pripájať počítač.",
      "Kvalitná optika: Ostrý obraz a verné podanie farieb aj pri premietaní na veľkú plochu."
    ]
  },
  {
    name: "Premietacie plátno 110\"",
    category: "other",
    pricePerDay: 15,
    available: 2,
    description: "Veľkoformátové mobilné premietacie plátno s matným bielym povrchom, ktorý zaisťuje vynikajúci kontrast a široké pozorovacie uhly pre všetkých hostí v sále.",
    images: [],
    specifications: [
      "Uhlopriečka: 110 palcov (cca 280 cm)",
      "Pomer strán: 16:9",
      "Konštrukcia: Skladacia trojnožka s nastaviteľnou výškou"
    ],
    features: [
      "Dokonalý obraz: Matný povrch eliminuje odlesky okolitého svetla.",
      "Stabilita: Robustná statívová konštrukcia zaručuje bezpečné postavenie na akomkoľvek rovnom povrchu."
    ]
  },
  {
    name: "Profesionálna osvetľovacia konštrukcia",
    category: "other",
    pricePerDay: 35,
    available: 2,
    description: "Robustný svetelný rampový systém (truss) navrhnutý na bezpečné zavesenie všetkých svetiel, laserov a efektov nad úroveň stage-u.",
    images: [],
    specifications: [
      "Materiál: Odolná kovová zliatina",
      "Nastavenie: Flexibilná výška a šírka podľa dispozícií sály"
    ],
    features: [
      "Bezpečnosť na prvom mieste: Masívna kovová konštrukcia s vysokou nosnosťou pre ťažkú techniku.",
      "Čistý dizajn: Umožňuje viesť kabeláž vrchom, takže na zemi nevzniká neporiadok a nehrozí zakopnutie."
    ]
  },
  {
    name: "Konštrukcia na zavesenie reproduktorov na stenu",
    category: "other",
    pricePerDay: 8,
    available: 4,
    description: "Masívne nástenné oceľové držiaky určené pre pevné a permanentné upevnenie reproboxov.",
    images: [],
    specifications: [
      "Materiál: Hrubostenná oceľ",
      "Nastavenie: Variabilný uhol sklonu a natočenia"
    ],
    features: [
      "Úspora miesta: Ideálne riešenie pre prevádzky, kde je potrebné ušetriť miesto na podlahe.",
      "Smerovanie zvuku: Možnosť presného naklonenia reproduktora pre dokonalé pokrytie priestoru zvukom."
    ]
  },
  {
    name: "Stojan na mikrofón",
    category: "other",
    pricePerDay: 5,
    available: 10,
    description: "Profesionálny a vysoko stabilný mikrofónny stojan typu \"šibenica\".",
    images: [],
    specifications: [
      "Konštrukcia: Kovová s nastaviteľným ramenom a výškou"
    ],
    features: [
      "Univerzálnosť: Vhodný pre rečníkov, spevákov, k moderátorskému alebo svadobnému stolu.",
      "Stabilita: Odolná základňa s protišmykovými prvkami tlmí otrasy z podlahy."
    ]
  },
  {
    name: "Trojnožka na reproduktory",
    category: "other",
    pricePerDay: 5,
    available: 8,
    description: "Klasický robustný podlahový statív určený pre bezpečné vyvýšenie satelitných reproboxov.",
    images: [],
    specifications: [
      "Priemer tyče: Štandardných 35 mm (kompatibilný s väčšinou reproboxov)",
      "Nosnosť: Dimenzovaná pre stredné aj ťažké reproduktory"
    ],
    features: [
      "Lepší rozptyl zvuku: Dostať reproduktory do úrovne hláv publika je kľúčové pre čistý a zrozumiteľný zvuk.",
      "Bezpečnostné prvky: Mechanická poistka (kolík) zabraňuje nechcenému zloženiu stojanu."
    ]
  },
  {
    name: "Držiak pre dvojicu reproboxov",
    category: "other",
    pricePerDay: 4,
    available: 4,
    description: "Špeciálny T-adaptér (hniezdo), ktorý sa nasadzuje na klasický reproduktorový stojan.",
    images: [],
    specifications: [
      "Konštrukcia: Pevná kovová rozdvojka s presným vyvážením"
    ],
    features: [
      "Zdvojený výkon: Umožňuje umiestniť dva plnohodnotné reproduktory na jeden jediný stojan.",
      "Kompaktnosť: Šetrí miesto na menších pódiách, kde by dva samostatné stojany prekážali."
    ]
  },
  {
    name: "Teleskopická stojanová tyč",
    category: "other",
    pricePerDay: 4,
    available: 6,
    description: "Dištančná tyč so závitom alebo hladkým koncom, určená na priame prepojenie subwoofera a satelitného reproboxu.",
    images: [],
    specifications: [
      "Výškové nastavenie: Teleskopický systém s poistným mechanizmom"
    ],
    features: [
      "Kompaktné pódium: Satelitný reproduktor \"stojit\" priamo na subwooferi, čo vyzerá vysoko profesionálne a šetrí miesto."
    ]
  }
];