export interface PackageType {
  id: string;
  name: string;
  price: number;
  tagline: string;
  image: string;
  desc: string;
  zvuk: string[];
  svetlo: string[];
  ostatne?: string[];
}

export const packagesData: PackageType[] = [
  {
    id: 'balik-1',
    name: 'BALÍK 1: Kompakt Prezentácia',
    price: 60,
    tagline: 'Firemné prezentácie, prednášky, schôdze do 30-100 ľudí',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd8a?w=800',
    desc: 'Zameranie na čistú reč a obraz. Ideálne riešenie pre prezentácie, firemné mítingy, prednášky a hovorené slovo.',
    zvuk: [
      '1x Mixážny pult Behringer Xenyx 802 (kompaktný, jednoduchý na obsluhu)',
      '2x Reproduktory Behringer B112D (dostatok výkonu na hovorené slovo)',
      '1x Sada 2 bezdrôtových mikrofónov the t.bone free solo Twin HT (špičková zrozumiteľnosť bez káblov)',
      '2x Trojnožka na reproduktory',
      '2x Stojan na mikrofón'
    ],
    svetlo: [
      '2x RGBWA UV Led Par svetlá (nastavené na statickú teplú bielu/oranžovú farbu pre osvetlenie rečníka)'
    ],
    ostatne: [
      '1x Premietačka Wanbo T6 MAX (1080p, vysoký jas pre čitateľné prezentácie)',
      '1x Premietacie plátno 110"'
    ]
  },
  {
    id: 'balik-2',
    name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
    price: 90,
    tagline: 'Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    desc: 'Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí, kde sa vyžaduje dynamický basový základ.',
    zvuk: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D (ako satelity)',
      '1x Subwoofer Behringer B1500XP (15" aktívny sub, ktorý ľahko prevezieš aj v kufri auta)',
      '2x Trojnožka na reproduktory',
      '1x Mikrofóny a headsety Auna VHF (pre DJa alebo karaoke)'
    ],
    svetlo: [
      '1x Svetelný set BeamZ Party Bar (všetko v jednom na stojane, jednoduchá montáž)',
      '1x Červeno-zelený Laser (klasický retro párty efekt)',
      '1x Dymostroj ADJ VF 1300 (zvýrazní svetelné lúče v priestore)'
    ]
  },
  {
    id: 'balik-3',
    name: 'BALÍK 3: Oslava MINI',
    price: 80,
    tagline: 'Rodinné oslavy, posedenia, komorné svadby do 30 ľudí',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
    desc: 'Rodinné oslavy, posedenia, komorné svadby do 30 ľudí v reštauráciách a sálach, kde netreba prehnaný basový tlak, ale peknú atmosféru.',
    zvuk: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT (pre príhovory a moderovanie)',
      '2x Trojnožka na reproduktory',
      '1x Stojan na mikrofón'
    ],
    svetlo: [
      '4x RGBWA UV Led Par svetlá (rozmiestnené na zemi pre dekoračné podsvietenie stien sály)',
      '1x Bublinkostroj (skvelá zábava pre deti a spestrenie programu)',
      '1x Dymostroj ADJ VF 1300'
    ]
  },
  {
    id: 'balik-4',
    name: 'BALÍK 4: Svadba MEDIUM',
    price: 150,
    tagline: 'Klasická svadba alebo stredne veľká oslava do 100 ľudí v interiéri',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    desc: 'Klasická svadba alebo stredne veľká oslava do 100 ľudí v interiéri. Vyvážený pomer medzi skvelou rečou a plným tanečným parketom.',
    zvuk: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D (hlavné satelity)',
      '1x Subwoofer The Box Pro DSP 18 Sub (poriadny 18" bas, ktorý roztancuje sálu)',
      '2x Teleskopická stojanová tyč (umiestnenie satelitov priamo na subwoofer)',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT (pre mladomanželov a starejšieho)',
      '1x Mikrofóny a headsety Auna VHF (záložné)'
    ],
    svetlo: [
      '6x RGBWA UV Led Par svetlá (kompletné ambientné osvetlenie sály)',
      '4x RGBW Led Bar 36w (nasvietenie steny za DJom alebo hlavným stolom)',
      '1x Holografický Laser (jemné, elegantné svetelné hviezdy)',
      '1x Bublinkostroj (nezabudnuteľný prvý tanec)',
      '1x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na uchytenie svetiel'
    ]
  },
  {
    id: 'balik-5',
    name: 'BALÍK 5: Klub MEDIUM',
    price: 190,
    tagline: 'Klubové noci, stužkové, disko párty pre 100 ľudí',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    desc: 'Klubové noci, stužkové, disko párty pre 100 ľudí. Dôraz na masívne basy a rotujúce dynamické lúče.',
    zvuk: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D',
      '2x Subwoofer The Box Pro DSP 18 Sub (silná dvojička 18" basákov)',
      '2x Teleskopická stojanová tyč',
      '1x Mikrofóny a headsety Auna VHF'
    ],
    svetlo: [
      '1x Riadiaci DMX pult Light4Me DMX 192 (manuálne ovládanie svetelnej show)',
      '4x Rotujúca 90w Beam hlava (rýchle a ostré lúče krížom cez parket)',
      '1x Laserový Bar 65W (červené lúče vytvárajúce priestorový vejár)',
      '4x RGBWA UV Led Par svetlá',
      '1x Stroboskop (pre gradovanie pesničiek)',
      '1x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na uchytenie všetkých svetiel'
    ]
  },
  {
    id: 'balik-6',
    name: 'BALÍK 6: Svadba PREMIUM MAX',
    price: 290,
    tagline: 'Luxusné, veľké svadby, firemné eventy a plesy nad 100 ľudí',
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
    desc: 'Luxusné, veľké svadby, firemné eventy a plesy nad 100 ľudí. Dokonalé priestorové ozvučenie bez hluchých miest a komplexná svetelná show.',
    zvuk: [
      '1x Digitálny mixpult Behringer X Air 18 (ovládateľný bezdrôtovo cez iPad z akéhokoľvek miesta v sále)',
      '4x Reproduktory Behringer B112D (rozmiestnené v rohoch sály pre vyrovnanú hlasitosť)',
      '2x Subwoofer The Box Pro DSP 18 Sub',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '4x Mikrofóny a headsety Auna VHF (pre rečníkov, kapelu či účinkujúcich)',
      '2x Trojnožka na reproduktory',
      '2x Držiak pre dvojicu reproboxov / Držiaky na stenu'
    ],
    svetlo: [
      '1x BeamZ SUSHI-DS (počítačové ovládanie zladených svetelných scén)',
      '8x RGBWA UV Led Par svetlá (vytvoria jednotnú farebnú tému v celej sále)',
      '4x RGBW Led Bar 36w (nasvietenie tanečného parketu a dekorácií)',
      '4x Rotujúca 90w Beam hlava (elegantné pomalé pohyby počas obradu, dynamické na párty)',
      '2x Samostatné Bodové UV svetlá (magické svietenie bielych šiat)',
      '2x Bublinkostroj (hustá stena bublín)',
      '2x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na zavesenie techniky'
    ],
    ostatne: [
      '1x Premietačka Wanbo T6 MAX + 1x Premietacie plátno 110" (na kvízy a svadobné prezentácie)'
    ]
  },
  {
    id: 'balik-7',
    name: 'BALÍK 7: Klub MAXIMAL',
    price: 360,
    tagline: 'Veľké diskotéky, stužkové pre viacero tried, festivalové stany nad 100 ľudí',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    desc: 'Veľké diskotéky, stužkové pre viacero tried, festivalové stany nad 100 ľudí v interiéri. Extrémny zvukový tlak a laserová show.',
    zvuk: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4 (ideálne rozdelenie pásiem a ochrana reproduktorov pred preťažením)',
      '4x Reproduktory Behringer B112D',
      '4x Subwoofer The Box Pro DSP 18 Sub (štvorica masívnych basákov)',
      '4x Teleskopická stojanová tyč'
    ],
    svetlo: [
      '1x BeamZ SUSHI-DS',
      '4x Rotujúca 90w Beam hlava',
      '1x Laserový Bar 65W (brutálna červená laserová stena)',
      '8x RGBWA UV Led Par svetlá',
      '4x RGBW Led Bar 36w',
      '1x Holografický Laser',
      '1x Stroboskop',
      '2x Dymostroj ADJ VF 1300 (udržiavanie stabilnej hmly)',
      '2x Výrobníky plameňov Fire Machine (bezpečné pódiové plamene pre silné hudobné momenty)',
      '1x Osvetľovacia konštrukcia'
    ]
  },
  {
    id: 'balik-8',
    name: 'BALÍK 8: Open-Air ARENA',
    price: 490,
    tagline: 'Vonkajšie festivaly, hody, dni obce, amfiteátre alebo veľké stany',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
    desc: 'Vonkajšie festivaly, hody, dni obce, amfiteátre alebo veľké stany. Navrhnuté špeciálne tak, aby prekonalo akustické straty v exteriéri.',
    zvuk: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4',
      '4x Reproduktory Behringer B112D',
      '5x Subwoofer The Box Pro DSP 18 Sub (využitie celého tvojho basového arzenálu na vytvorenie basovej steny)',
      '4x Teleskopická stojanová tyč'
    ],
    svetlo: [
      '1x BeamZ SUSHI-DS',
      '4x Rotujúca 90w Beam hlava',
      '1x Laserový Bar 65W',
      '8x RGBWA UV Led Par svetlá',
      '4x RGBW Led Bar 36w',
      '2x Výrobníky plameňov Fire Machine (vizuálne mimoriadne atraktívne po zotmení)',
      '2x Snehostroj ADJ Snow Flurry HO (špeciálny atmosférický efekt sneženia)',
      '2x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia'
    ]
  }
];