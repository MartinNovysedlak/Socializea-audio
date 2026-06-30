"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  Layers, 
  ArrowDown, 
  HelpCircle,
  Calendar,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { EquipmentItem } from '@/lib/supabase';
import { toast } from 'sonner';
import PackageDetailModal from '@/components/PackageDetailModal';

interface PresetPackage {
  id: string;
  name: string;
  price: number;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  isPopular?: boolean;
  components: string[];
  description: string;
  soundSpecs: string[];
  lightSpecs: string[];
  otherSpecs?: string[];
  warning?: string;
}

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

// All 8 packages matching the quiz configuration with full specs
const presetPackages: PresetPackage[] = [
  {
    id: 'kompakt-prezentacia',
    name: 'BALÍK 1: Kompakt Prezentácia',
    price: 100,
    priceNoLights: 100,
    priceWithLights: 130,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    description: 'Zameranie: Firemné prezentácie, prednášky, schôdze do 30-100 ľudí (dôraz na čistú reč a obraz).',
    components: [
      '1x Mixážny pult Behringer Xenyx 802 (kompaktný, jednoduchý na obsluhu)',
      '2x Reproduktory Behringer B112D (dostatok výkonu na hovorené slovo)',
      '1x Sada 2 bezdrôtových mikrofónov the t.bone free solo Twin HT',
      '2x Trojnožka na reproduktory',
      '2x Stojan na mikrofón',
      '4x RGBWA UV Led Par svetlá (pre interiér) alebo bez svetiel'
    ],
    soundSpecs: [
      '1x Mixážny pult Behringer Xenyx 802 (kompaktný, jednoduchý na obsluhu)',
      '2x Reproduktory Behringer B112D (dostatok výkonu na hovorené slovo)',
      '1x Sada 2 bezdrôtových mikrofónov the t.bone free solo Twin HT (špičková zrozumiteľnosť bez káblov)',
      '2x Trojnožka na reproduktory',
      '2x Stojan na mikrofón'
    ],
    lightSpecs: [
      '4x RGBWA UV Led Par svetlá (nastavené na statickú teplú bielu/oranžovú farbu pre rečníka alebo do pozadia)'
    ]
  },
  {
    id: 'party-mini',
    name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
    price: 110,
    priceNoLights: 110,
    priceWithLights: 140,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    description: 'Zameranie: Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí, kde sa vyžaduje dynamický basový základ.',
    components: [
      '1x Mixážny pult Behringer Xenyx 802',
      '1x Reproduktory Behringer B112D',
      '1x Subwoofer Behringer B1500XP (15" aktívny sub)',
      '1x Teleskopická tyč na reproduktory',
      '1x Samostatný káblový mikrofón',
      '1x Svetelný set BeamZ Party Bar, 2x Červeno-zelený Laser, 1x Dymostroj'
    ],
    soundSpecs: [
      '1x Mixážny pult Behringer Xenyx 802',
      '1x Reproduktory Behringer B112D (ako satelity)',
      '1x Subwoofer Behringer B1500XP (15" aktívny sub, ktorý ľahko prevezieš aj v kufri auta)',
      '1x Teleskopická tyč na reproduktory',
      '1x Samostatný káblový mikrofón'
    ],
    lightSpecs: [
      '1x Svetelný set BeamZ Party Bar (všetko v jednom na stojane, jednoduchá montáž)',
      '2x Červeno-zelený Laser (klasický retro párty efekt)',
      '1x Dymostroj ADJ VF 1300 (zvýrazní svetelné lúče v priestore)'
    ]
  },
  {
    id: 'oslava-mini',
    name: 'BALÍK 3: Oslava MINI',
    price: 140,
    priceNoLights: 140,
    priceWithLights: 180,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    description: 'Zameranie: Rodinné oslavy, posedenia, komorné svadby do 30 ľudí v reštauráciách a sálach, kde netreba prehnaný basový tlak, ale peknú atmosféru.',
    components: [
      '1x Mixážny pult Behringer Xenyx 802',
      '2x Reproduktory Behringer B112D',
      '1x Subwoofer Behringer B1500XP',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '2x Trojnožka na reproduktory',
      '1x Stojan na mikrofón',
      '1x Svetelný set BeamZ Party Bar, 2x Červeno-zelený Laser, 1x Dymostroj'
    ],
    soundSpecs: [
      '1x Mixážny pult Behringer Xenyx 802',
      '2x Reproduktory Behringer B112D',
      '1x Subwoofer Behringer B1500XP (15" aktívny sub, ktorý ľahko prevezieš aj v kufri auta)',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT (pre príhovory a moderovanie)',
      '2x Trojnožka na reproduktory',
      '1x Stojan na mikrofón'
    ],
    lightSpecs: [
      '1x Svetelný set BeamZ Party Bar (všetko v jednom na stojane, jednoduchá montáž)',
      '2x Červeno-zelený Laser (klasický retro párty efekt)',
      '1x Dymostroj ADJ VF 1300'
    ]
  },
  {
    id: 'oslava-medium',
    name: 'BALÍK 4: Oslava MEDIUM',
    price: 180,
    priceNoLights: 180,
    priceWithLights: 270,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    description: 'Zameranie: Klasická svadba alebo stredne veľká oslava do 100 ľudí v interiéri. Vyvážený pomer medzi skvelou rečou a plným tanečným parketom.',
    components: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D (hlavné satelity)',
      '1x Subwoofer The Box Pro DSP 18 Sub',
      '1x Teleskopická stojanová tyč',
      '1x Trojnožka na reproduktory',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '6x RGBWA UV Led Par, 2x Rotujúca 90W Beam hlava, 1x BeamZ SUSHI-DS, 1x Holografický Laser, 2x Červeno-zelený Laser, 1x Dymostroj, 1x Osvetľovacia konštrukcia'
    ],
    soundSpecs: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D (hlavné satelity)',
      '1x Subwoofer The Box Pro DSP 18 Sub (poriadny 18" bas, ktorý roztancuje sálu)',
      '1x Teleskopická stojanová tyč (umiestnenie satelitov priamo na subwoofer)',
      '1x Trojnožka na reproduktory',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT'
    ],
    lightSpecs: [
      '6x RGBWA UV Led Par svetlá',
      '2x Rotujúca 90W Beam hlava',
      '1x BeamZ SUSHI-DS (riadiaci pult pre svetlá)',
      '1x Holografický Laser',
      '2x Červeno-zelený Laser (klasický retro párty efekt)',
      '1x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na uchytenie svetiel'
    ]
  },
  {
    id: 'klub-medium',
    name: 'BALÍK 5: Klub MEDIUM',
    price: 220,
    priceNoLights: 220,
    priceWithLights: 340,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    description: 'Zameranie: Klubové noci, stužkové, disko párty pre 100 ľudí. Dôraz na masívne basy a rotujúce dynamické lúče.',
    components: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D',
      '2x Subwoofer The Box Pro DSP 18 Sub',
      '2x Teleskopická stojanová tyč',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '1x BeamZ SUSHI-DS, 4x Rotujúca Beam hlava, 6x RGBWA UV Par, 2x RGBW Led Bar, 1x Holografický Laser, 2x Červeno-zelený Laser, 2x Dymostroj, 1x Osvetľovacia konštrukcia'
    ],
    soundSpecs: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D',
      '2x Subwoofer The Box Pro DSP 18 Sub (silná dvojica 18" basákov)',
      '2x Teleskopická stojanová tyč',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT'
    ],
    lightSpecs: [
      '1x BeamZ SUSHI-DS (ovládanie svetelnej show)',
      '4x Rotujúca 90W Beam hlava (rýchle a ostré lúče krížom cez parket)',
      '6x RGBWA UV Led Par svetlá',
      '2x RGBW Led Bar 36W',
      '1x Holografický Laser',
      '2x Červeno-zelený Laser (párty efekt)',
      '2x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na uchytenie všetkých svetiel'
    ]
  },
  {
    id: 'premium-max',
    name: 'BALÍK 6: PREMIUM MAX',
    price: 250,
    priceNoLights: 250,
    priceWithLights: 430,
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
    description: 'Zameranie: Luxusné, veľké svadby, firemné eventy a plesy nad 100 ľudí. Dokonalé priestorové ozvučenie bez hluchých miest a komplexná svetelná show.',
    components: [
      '1x Digitálny mixpult Behringer X Air 18',
      '2x Reproduktory Behringer B112D',
      '3x Subwoofer The Box Pro DSP 18 Sub',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '2x Trojnožka na reproduktory',
      '1x BeamZ SUSHI-DS, 6x RGBWA UV Par, 4x RGBW Led Bar, 4x Rotujúca Beam hlava, 1x Holografický Laser, 2x Červeno-zelený Laser, 2x Dymostroj, 1x Osvetľovacia konštrukcia',
      '1x Premietačka Wanbo T6 MAX',
      '1x Premietacie plátno 110"'
    ],
    soundSpecs: [
      '1x Digitálny mixpult Behringer X Air 18 (ovládateľný bezdrôtovo cez iPad z akéhokoľvek miesta v sále)',
      '2x Reproduktory Behringer B112D (rozmiestnené v rohoch sály pre vyrovnanú hlasitosť)',
      '3x Subwoofer The Box Pro DSP 18 Sub',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '2x Trojnožka na reproduktory'
    ],
    lightSpecs: [
      '1x BeamZ SUSHI-DS (počítačové ovládanie zladených svetelných scén)',
      '6x RGBWA UV Led Par svetlá (vytvoria jednotnú farebnú tému v celej sále)',
      '4x RGBW Led Bar 36W (nasvietenie tanečného parketu a dekorácií)',
      '4x Rotujúca 90W Beam hlava (elegantné pomalé pohyby počas obradu, dynamické na párty)',
      '1x Holografický Laser',
      '2x Červeno-zelený Laser (párty efekt)',
      '2x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia na zavesenie techniky'
    ],
    otherSpecs: [
      '1x Premietačka Wanbo T6 MAX',
      '1x Premietacie plátno 110" (na kvízy a svadobné prezentácie)'
    ]
  },
  {
    id: 'klub-maximal',
    name: 'BALÍK 7: Klub MAXIMAL',
    price: 380,
    priceNoLights: 380,
    priceWithLights: 520,
    image: 'https://images.unsplash.com/photo-1489641493513-ba4ee84ccee9?w=800',
    description: 'Zameranie: Veľké diskotéky, stužkové pre viacero tried, festivalové stany nad 100 ľudí v interiéri. Extrémny zvukový tlak a laserová show.',
    components: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4',
      '2x Reproduktory Behringer B112D',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '4x Subwoofer The Box Pro DSP 18 Sub',
      '2x Teleskopická stojanová tyč',
      '1x BeamZ SUSHI-DS, 4x Rotujúca Beam hlava, 6x RGBWA UV Par, 4x RGBW Led Bar, 1x Holografický Laser, 2x Červeno-zelený Laser, 2x Dymostroj, 1x Osvetľovacia konštrukcia'
    ],
    soundSpecs: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4 (ideálne rozdelenie pásiem a ochrana reproduktorov pred preťažením)',
      '2x Reproduktory Behringer B112D',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '4x Subwoofer The Box Pro DSP 18 Sub (štvorica masívnych basákov)',
      '2x Teleskopická stojanová tyč'
    ],
    lightSpecs: [
      '1x BeamZ SUSHI-DS',
      '4x Rotujúca 90W Beam hlava',
      '6x RGBWA UV Led Par svetlá',
      '4x RGBW Led Bar 36W',
      '1x Holografický Laser',
      '2x Červeno-zelený Laser',
      '2x Dymostroj ADJ VF 1300',
      '1x Osvetľovacia konštrukcia'
    ]
  },
  {
    id: 'open-air-arena',
    name: 'BALÍK 8: Open-Air ARENA',
    price: 480,
    priceNoLights: 480,
    priceWithLights: 730,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
    description: 'Zameranie: Vonkajšie festivaly, hody, dni obce, amfiteátre alebo veľké stany. V cene máš dymostroje, plameňomety a snehostroje pre výnimočnú atmosféru.',
    components: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4',
      '4x Reproduktory Behringer B112D',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '5x Subwoofer The Box Pro DSP 18 Sub',
      '2x Teleskopická stojanová tyč',
      '1x BeamZ SUSHI-DS, 4x Rotujúca Beam hlava, 2x Laserový Bar 65W, 6x RGBWA UV Par, 4x RGBW Led Bar, 2x Fire Machine, 2x Snehostroj, 2x Dymostroj, 1x Holografický Laser, 2x Červeno-zelený Laser, 1x Osvetľovacia konštrukcia'
    ],
    soundSpecs: [
      '1x Digitálny mixpult Behringer X Air 18',
      '1x Riadiaci procesor the t.rack 4x4',
      '4x Reproduktory Behringer B112D',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '5x Subwoofer The Box Pro DSP 18 Sub (využitie celého tvojho basového arzenálu na vytvorenie basovej steny)',
      '2x Teleskopická stojanová tyč'
    ],
    lightSpecs: [
      '1x BeamZ SUSHI-DS',
      '4x Rotujúca 90W Beam hlava',
      '2x Laserový Bar 65W',
      '6x RGBWA UV Led Par svetlá',
      '4x RGBW Led Bar 36W',
      '2x Výrobníky plameňov Fire Machine (vizuálne mimoriadne atraktívne po zotmení)',
      '2x Snehostroj ADJ Snow Flurry HO (špeciálny atmosférický efekt sneženia)',
      '2x Dymostroj ADJ VF 1300',
      '1x Holografický Laser',
      '2x Červeno-zelený Laser (párty efekt)',
      '1x Osvetľovacia konštrukcia'
    ]
  }
];

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  const [selectedPackage, setSelectedPackage] = useState<PresetPackage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDetail = (pkg: PresetPackage) => {
    setSelectedPackage(pkg);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedPackage(null);
  };

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      
      {/* SEKCIA 1: HERO */}
      <section className="relative pt-36 pb-16 overflow-hidden bg-gradient-to-b from-[#020721] via-[#05092a] to-[#020721]">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#1A4BFF]/5 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl animate-fade-slide-up">
          <Badge className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white mb-6 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-extrabold shadow-[0_0_15px_rgba(189,32,211,0.3)]">
            Výber techniky
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Zabezpečte si špičkový zvuk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
              a svetlo na akciu
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chystáte akciu? Vyberte si predpripravený komplet alebo si vyskladajte vlastnú aparatúru.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => handleScrollTo('sety')}
              className="w-full sm:w-auto btn-cyber rounded-2xl h-14 px-8 text-base font-bold hover:scale-105 border-none shadow-[0_0_20px_rgba(189,32,211,0.4)]"
            >
              <Layers className="mr-2 animate-pulse" size={18} />
              Pozrieť hotové balíky
            </Button>
            <Button 
              onClick={() => handleScrollTo('polozky')}
              variant="outline"
              className="w-full sm:w-auto border-white/20 hover:border-[#BD20D3] hover:text-white hover:shadow-[0_0_15px_rgba(189,32,211,0.2)] text-white bg-white/5 rounded-2xl h-14 px-8 text-base font-bold transition-all hover:scale-105"
            >
              Vyskladať si aparatúru
              <ArrowDown className="ml-2 animate-bounce" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* SEKCIA 2: ALL PACKAGES */}
      <section id="sety" className="py-20 bg-[#020721]/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Bez starostí</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Naša ponuka balíkov</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Vyberte si jeden z našich overených a vyvážených setov, ktoré sme zostavili na základe stoviek úspešných akcií.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {presetPackages.map((pkg, index) => (
              <ScrollReveal key={pkg.id} direction="up" delay={index * 0.15}>
                <Card 
                  onClick={() => handleOpenDetail(pkg)}
                  className={`relative overflow-hidden bg-[#0e122b]/80 border border-white/10 rounded-3xl flex flex-col hover:border-[#BD20D3]/50 hover:shadow-[0_0_30px_rgba(189,32,211,0.1)] hover:-translate-y-2 transition-all duration-300 group h-full cursor-pointer ${
                    index === 2 ? 'ring-1 ring-[#BD20D3] shadow-[0_0_30px_rgba(189,32,211,0.15)]' : ''
                  }`}
                >
                  {index === 2 && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-lg">
                      Populárne
                    </span>
                  )}

                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020721] to-transparent" />
                  </div>

                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed h-14 overflow-hidden">
                      {pkg.description}
                    </p>
                    <div className="flex items-baseline gap-1.5 pt-4">
                      <span className="text-3xl font-extrabold text-[#BD20D3]">{pkg.price} €</span>
                      <span className="text-gray-400 text-xs">/ deň s DPH</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-0 space-y-4">
                    <div className="border-t border-white/5 pt-4 space-y-2.5">
                      <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Kliknite pre detailné špecifikácie →</p>
                      {pkg.components.slice(0, 3).map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check size={14} className="text-[#BD20D3] shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </div>
                      ))}
                      {pkg.components.length > 3 && (
                        <div className="flex items-start gap-2.5 text-xs text-gray-500">
                          <span className="text-[#BD20D3] shrink-0 mt-0.5">+</span>
                          <span>a ďalších {pkg.components.length - 3} položiek...</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button 
                      onClick={(e) => { e.stopPropagation(); handleOpenDetail(pkg); }}
                      className="w-full btn-cyber rounded-xl h-12 border-none font-bold text-sm"
                    >
                      Zobraziť detail a rezervovať
                    </Button>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SEKCIA 3: SAMOSTATNÉ POLOŽKY */}
      <section id="polozky" className="py-16 bg-[#020721]">
        <div className="container mx-auto px-4 text-center max-w-4xl mb-12">
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-4 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
            Vlastná konfigurácia
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Potrebujete len konkrétny kus?
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Prehliadajte našu kompletnú ponuku a nakombinujte si reproduktory, mikrofóny alebo káble podľa seba.
          </p>
        </div>

        <EquipmentCatalog 
          equipment={equipment} 
          loading={equipment.length === 0} 
          quantities={quantities} 
          setQuantities={setQuantities} 
        />
      </section>

      <FloatingCart 
        quantities={quantities} 
        setQuantities={setQuantities} 
        equipment={equipment} 
      />

      {/* DETAIL MODAL */}
      <PackageDetailModal 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail} 
        package={selectedPackage} 
      />

      <Footer />
    </main>
  );
};

export default Prenajom;