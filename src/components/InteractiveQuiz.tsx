"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Music, 
  Check, 
  Plus,
  X,
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  PartyPopper,
  Tv,
  Phone,
  Mail,
  User,
  Calendar,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface QuizAnswers {
  people: string;
  location: string;
  eventType: string;
}

interface PackageRecommendation {
  id: string;
  name: string;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  desc: string;
  soundSpecs: string[];
  lightSpecs: string[];
  otherSpecs?: string[];
  warning?: string;
}

const InteractiveQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    people: '',
    location: '',
    eventType: ''
  });

  // Controls whether the user views the package with or without lights
  const [includeLights, setIncludeLights] = useState(true);

  // Booking states inside recommendation
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ people: '', location: '', eventType: '' });
    setShowBookingForm(false);
    setBookingData({ name: '', phone: '', email: '', date: '', message: '' });
    setIncludeLights(true);
  };

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  // 18-path Decision Tree Recommendation Engine (matching updated 8 packages)
  const getRecommendation = (): PackageRecommendation => {
    const { people, location, eventType } = answers;

    // ---------- Packages (priceNoLights / priceWithLights) ----------
    const pkg1: PackageRecommendation = {
      id: 'kompakt-prezentacia',
      name: 'BALÍK 1: Kompakt Prezentácia',
      priceNoLights: 100,
      priceWithLights: 130,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      desc: 'Zameranie: Firemné prezentácie, prednášky, schôdze do 30-100 ľudí (dôraz na čistú reč a obraz).',
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
    };

    const pkg2: PackageRecommendation = {
      id: 'party-mini',
      name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
      priceNoLights: 110,
      priceWithLights: 140,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      desc: 'Zameranie: Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí, kde sa vyžaduje dynamický basový základ.',
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
    };

    const pkg3: PackageRecommendation = {
      id: 'oslava-mini',
      name: 'BALÍK 3: Oslava MINI',
      priceNoLights: 140,
      priceWithLights: 180,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      desc: 'Zameranie: Rodinné oslavy, posedenia, komorné svadby do 30 ľudí v reštauráciách a sálach, kde netreba prehnaný basový tlak, ale peknú atmosféru.',
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
    };

    const pkg4: PackageRecommendation = {
      id: 'oslava-medium',
      name: 'BALÍK 4: Oslava MEDIUM',
      priceNoLights: 180,
      priceWithLights: 270,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      desc: 'Zameranie: Klasická svadba alebo stredne veľká oslava do 100 ľudí v interiéri. Vyvážený pomer medzi skvelou rečou a plným tanečným parketom.',
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
    };

    const pkg5: PackageRecommendation = {
      id: 'klub-medium',
      name: 'BALÍK 5: Klub MEDIUM',
      priceNoLights: 220,
      priceWithLights: 340,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      desc: 'Zameranie: Klubové noci, stužkové, disko párty pre 100 ľudí. Dôraz na masívne basy a rotujúce dynamické lúče.',
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
    };

    const pkg6: PackageRecommendation = {
      id: 'premium-max',
      name: 'BALÍK 6: PREMIUM MAX',
      priceNoLights: 250,
      priceWithLights: 430,
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
      desc: 'Zameranie: Luxusné, veľké svadby, firemné eventy a plesy nad 100 ľudí. Dokonalé priestorové ozvučenie bez hluchých miest a komplexná svetelná show.',
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
    };

    const pkg7: PackageRecommendation = {
      id: 'klub-maximal',
      name: 'BALÍK 7: Klub MAXIMAL',
      priceNoLights: 380,
      priceWithLights: 520,
      image: 'https://images.unsplash.com/photo-1489641493513-ba4ee84ccee9?w=800',
      desc: 'Zameranie: Veľké diskotéky, stužkové pre viacero tried, festivalové stany nad 100 ľudí v interiéri. Extrémny zvukový tlak a laserová show.',
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
    };

    const pkg8: PackageRecommendation = {
      id: 'open-air-arena',
      name: 'BALÍK 8: Open-Air ARENA',
      priceNoLights: 480,
      priceWithLights: 730,
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      desc: 'Zameranie: Vonkajšie festivaly, hody, dni obce, amfiteátre alebo veľké stany. V cene máš dymostroje, plameňomety a snehostroje pre výnimočnú atmosféru.',
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
    };

    // --- DECISION TREE LOGIC ---
    if (people === 'up-to-30') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return pkg3;
        if (eventType === 'dj') return pkg2;
        return pkg1;
      } else {
        if (eventType === 'wedding') {
          return { ...pkg3, warning: 'Upozornenie: Keďže podujatie prebieha v exteriéri, uistite sa, že technika bude chránená pod pevným prístreškom alebo zastrešením pred slnkom, večernou rosou a náhlym dažďom!' };
        }
        if (eventType === 'dj') {
          return { ...pkg2, warning: 'Upozornenie: Keďže podujatie prebieha v exteriéri, uistite sa, že technika bude pod pevným prístreškom alebo zastrešením, ktoré ju ochráni pred rosou, slnkom a dažďom!' };
        }
        return pkg1;
      }
    }

    if (people === 'up-to-100') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return pkg4;
        if (eventType === 'dj') return pkg5;
        return pkg1;
      } else {
        if (eventType === 'wedding') {
          return { ...pkg4, warning: 'Odporúčanie: Pre exteriér k tomuto setu dodávame dištančné stojanové tyče, aby satelity hrali nad úroveň rečníkov a zvuk lepšie pokryl otvorený priestor.' };
        }
        if (eventType === 'dj') {
          return { ...pkg8, warning: 'Odporúčanie: Vonku sa akustický basový tlak rýchlo stráca. Preto sme pre exteriérovú DJ disko párty pre 100 ľudí vybrali balík ARENA s maximálnym basovým arzenálom 5x Subwoofer!' };
        }
        return { ...pkg1, warning: 'Odporúčanie: Pre exteriérovú firemnú prezentáciu pre 100 ľudí odporúčame zvýšiť výšku stojanov (trojnožiek) s reproduktormi pre čisté pokrytie zvuku.' };
      }
    }

    if (people === 'over-100') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return pkg6;
        if (eventType === 'dj') return pkg7;
        return { ...pkg6, warning: 'Odporúčanie: Pri veľkej vnútornej prezentácii využívame digitálny mixpult a rozmiestnenie 4x reproduktorov Behringer v rohoch sály pre dokonalú zrozumiteľnosť hlasu pre všetkých.' };
      } else {
        if (eventType === 'presentation') {
          return { ...pkg8, warning: 'Odporúčanie: Pre veľkú exteriérovú prezentáciu nad 100 ľudí nakonfigurujeme tento set so 4x výškovými satelitmi pre špičkovú zrozumiteľnosť prejavu.' };
        }
        return pkg8;
      }
    }

    return pkg3;
  };

  const recommendedSet = getRecommendation();
  const activePrice = includeLights ? recommendedSet.priceWithLights : recommendedSet.priceNoLights;
  const lightsUpgradePrice = recommendedSet.priceWithLights - recommendedSet.priceNoLights;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error('Prosím vyplňte vaše meno a email.');
      return;
    }

    const priceText = `${activePrice} € (${includeLights ? 'so svetelnou show' : 'bez svetiel'})`;

    toast.success('Rezervačný dopyt bol úspešne odoslaný!', {
      description: `Zaznamenali sme dopyt pre "${recommendedSet.name}" v cene ${priceText}. Čoskoro vás kontaktujeme.`
    });
    setIsOpen(false);
    resetQuiz();
  };

  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1A4BFF]/20 via-[#0a0d1f] to-[#BD20D3]/20 border border-[#BD20D3]/30 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(189,32,211,0.15)]">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#1A4BFF]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 max-w-xl text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Inteligentný pomocník</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Neviete, akú techniku vybrať?
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Náš interaktívny sprievodca vám na základe 3 jednoduchých otázok odporučí ideálny set zvuku a svetiel presne pre vaše podujatie.
              </p>
            </div>

            <div className="shrink-0 z-10 w-full md:w-auto">
              <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetQuiz(); }}>
                <DialogTrigger asChild>
                  <Button className="btn-cyber w-full md:w-auto text-base px-8 py-6 rounded-2xl border-none shadow-[0_0_20px_rgba(189,32,211,0.4)] hover:scale-105 transition-transform">
                    Nakonfigurovať aparatúru
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] custom-scrollbar">
                  <DialogHeader className="border-b border-white/5 pb-4 mb-4">
                    <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                      <Sparkles className="text-[#BD20D3]" />
                      Sprievodca výberom aparatúry
                    </DialogTitle>
                  </DialogHeader>

                  {/* STEP 1 */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 1 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Pre koľko ľudí je plánovaná akcia?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'up-to-30', label: 'Komorná akcia (do 30 ľudí)', desc: 'Menší priestor, dôraz na kompaktné ozvučenie a jednoduchý prevoz.' },
                          { id: 'up-to-100', label: 'Stredný event (do 100 ľudí)', desc: 'Klasické oslavy a stredné sály s vyváženým výkonom a plným zvukom.' },
                          { id: 'over-100', label: 'Veľké podujatie / Klub (nad 100 ľudí)', desc: 'Masívny zvukový tlak, silné basy a robustná klubová show.' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption('people', opt.id)}
                            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group"
                          >
                            <div>
                              <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                              <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                            </div>
                            <Users size={18} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors shrink-0 ml-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 2 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Kde sa bude podujatie konať?</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'indoor', label: 'Interiér', desc: 'Sála, reštaurácia, chata, kultúrny dom.' },
                          { id: 'outdoor', label: 'Exteriér', desc: 'Záhrada, altánok, stan, open-air priestor.' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption('location', opt.id)}
                            className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group h-full"
                          >
                            <MapPin size={24} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors mb-4" />
                            <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                            <p className="text-xs text-gray-400 mt-1 flex-grow">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
                        <ArrowLeft size={14} /> Späť
                      </Button>
                    </div>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 3 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Aký je hlavný účel a typ akcie?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'wedding', label: 'Svadba alebo Oslava', desc: 'Mix podmazovej a tanečnej hudby, mikrofón na príhovory, elegantná atmosféra.', icon: PartyPopper },
                          { id: 'dj', label: 'DJ párty / Diskotéka', desc: 'Dôraz na silné basy, dynamické svetelné efekty a hmlu pre tanečnú náladu.', icon: Music },
                          { id: 'presentation', label: 'Firemná prezentácia (hovorené slovo)', desc: 'Maximálna zrozumiteľnosť hlasu, bezdrôtové mikrofóny a čistota prejavu.', icon: Tv }
                        ].map(opt => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption('eventType', opt.id)}
                              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group"
                            >
                              <div>
                                <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                                <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                              </div>
                              <Icon size={18} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors shrink-0 ml-4" />
                            </button>
                          );
                        })}
                      </div>
                      <Button variant="ghost" onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
                        <ArrowLeft size={14} /> Späť
                      </Button>
                    </div>
                  )}

                  {/* RESULT SCREEN */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {!showBookingForm ? (
                        <div className="space-y-6">
                          <div className="text-center space-y-2 border-b border-white/5 pb-4">
                            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Konfigurácia dokončená</span>
                            <h3 className="text-xl md:text-2xl font-bold text-white">Naše odporúčanie pre vašu akciu:</h3>
                          </div>

                          {/* WARNING */}
                          {recommendedSet.warning && (
                            <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
                              <AlertTriangle className="shrink-0 mt-0.5 text-amber-400" size={18} />
                              <p className="leading-relaxed">{recommendedSet.warning}</p>
                            </div>
                          )}

                          {/* HERO */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-5">
                            <div className="md:col-span-4 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                              <img src={recommendedSet.image} alt={recommendedSet.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                              <div>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <h4 className="text-xl font-bold text-white">{recommendedSet.name}</h4>
                                  <span className={`text-[10px] border px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider ${
                                    includeLights ? 'bg-[#BD20D3]/20 border-[#BD20D3]/50' : 'bg-white/10 border-white/20'
                                  }`}>
                                    {includeLights ? 'SO SVETLAMI' : 'BEZ SVETIEL'}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-xs md:text-sm mt-1.5 leading-relaxed">{recommendedSet.desc}</p>
                              </div>

                              {/* WEEKEND PRICE */}
                              <div className="pt-2 border-t border-white/5">
                                <span className="text-xs text-gray-400 uppercase font-bold block">Cena na celý víkend:</span>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[#BD20D3] font-extrabold text-3xl">
                                    {activePrice} €
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* SPECIFICATIONS */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            {/* SOUND */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                              <span className="text-xs font-bold uppercase tracking-widest text-[#BD20D3] flex items-center gap-1.5 pb-2 border-b border-white/10">
                                <Volume2 size={16} /> Zvuková technika
                              </span>
                              <ul className="space-y-2">
                                {recommendedSet.soundSpecs.map((spec, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                    <Check className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* LIGHTS */}
                            <div 
                              onClick={() => setIncludeLights(!includeLights)}
                              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer select-none group relative ${
                                includeLights 
                                  ? 'bg-[#BD20D3]/5 border-[#BD20D3]/30 shadow-[0_0_20px_rgba(189,32,211,0.05)] hover:bg-[#BD20D3]/10' 
                                  : 'bg-white/5 border-white/10 opacity-75 hover:opacity-100 hover:border-white/25'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Lightbulb className={includeLights ? "text-[#BD20D3]" : "text-gray-400"} size={18} />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                                      Svetlá, efekty & show
                                    </span>
                                  </div>
                                  
                                  {/* Icon toggle */}
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                    includeLights 
                                      ? 'bg-[#BD20D3] text-white shadow-[0_0_10px_rgba(189,32,211,0.5)]' 
                                      : 'bg-white/10 text-gray-400 border border-white/20'
                                  }`}>
                                    {includeLights ? (
                                      <Check size={14} className="stroke-[3]" />
                                    ) : (
                                      <Plus size={14} className="stroke-[3]" />
                                    )}
                                  </div>
                                </div>

                                <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                                  {includeLights 
                                    ? 'Svetelná show je pridaná a zahŕňa tieto položky:' 
                                    : `Pridať svetelnú show a efekty? (+${lightsUpgradePrice} €)`}
                                </p>

                                <ul className="space-y-2">
                                  {recommendedSet.lightSpecs.map((spec, i) => (
                                    <li key={i} className={`text-xs flex items-start gap-2 ${includeLights ? 'text-gray-300' : 'text-gray-500 line-through opacity-50'}`}>
                                      <Check className={includeLights ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={12} />
                                      <span>{spec}</span>
                                    </li>
                                  ))}
                                  {recommendedSet.otherSpecs && recommendedSet.otherSpecs.map((spec, i) => (
                                    <li key={i} className={`text-xs flex items-start gap-2 ${includeLights ? 'text-gray-300' : 'text-gray-500 line-through opacity-50'}`}>
                                      <Check className={includeLights ? 'text-cyan-400 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={12} />
                                      <span>{spec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button variant="outline" onClick={resetQuiz} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 flex-1">
                              Spustiť znova
                            </Button>
                            <Button onClick={() => setShowBookingForm(true)} className="btn-cyber rounded-xl h-12 flex-1 border-none font-bold">
                              Nezáväzne rezervovať
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleBookingSubmit} className="space-y-5">
                          <div className="space-y-2 text-center border-b border-white/5 pb-4">
                            <h3 className="text-lg md:text-xl font-bold text-white">Rezervácia: {recommendedSet.name}</h3>
                            <p className="text-xs text-gray-400">Ponuku vám vypracujeme a pošleme obratom na e-mail.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-name" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *
                              </Label>
                              <Input
                                id="quiz-name"
                                required
                                placeholder="Ján Novák"
                                value={bookingData.name}
                                onChange={(e) => setBookingData(p => ({ ...p, name: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-email" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Mail size={12} className="text-[#BD20D3]" /> E-mail *
                              </Label>
                              <Input
                                id="quiz-email"
                                type="email"
                                required
                                placeholder="jan.novak@example.sk"
                                value={bookingData.email}
                                onChange={(e) => setBookingData(p => ({ ...p, email: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-phone" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Phone size={12} className="text-[#BD20D3]" /> Telefón
                              </Label>
                              <Input
                                id="quiz-phone"
                                type="tel"
                                placeholder="+421 900 123 456"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData(p => ({ ...p, phone: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-date" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#BD20D3]" /> Predbežný dátum *
                              </Label>
                              <Input
                                id="quiz-date"
                                type="date"
                                required
                                value={bookingData.date}
                                onChange={(e) => setBookingData(p => ({ ...p, date: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="quiz-msg" className="text-gray-300 text-xs font-bold uppercase">Poznámka k objednávke</Label>
                            <Textarea
                              id="quiz-msg"
                              placeholder="Miesto akcie, špecifikácie, doprava..."
                              value={bookingData.message}
                              onChange={(e) => setBookingData(p => ({ ...p, message: e.target.value }))}
                              className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setShowBookingForm(false)} className="text-xs text-gray-400 hover:text-white h-11">
                              Späť
                            </Button>
                            <Button type="submit" className="btn-cyber rounded-xl h-11 flex-grow border-none font-bold">
                              Odoslať nezáväzný dopyt
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveQuiz;