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
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  PartyPopper,
  Tv,
  Phone,
  Mail,
  User,
  Calendar,
  AlertTriangle
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
  price: number;
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
  };

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  // 18-path Decision Tree Recommendation Engine
  const getRecommendation = (): PackageRecommendation => {
    const { people, location, eventType } = answers;

    // Package 1: Kompakt Prezentácia
    const pkg1: PackageRecommendation = {
      id: 'prezentacia-kompakt',
      name: 'BALÍK 1: Kompakt Prezentácia',
      price: 60,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      desc: 'Zameranie: Firemné prezentácie, prednášky, schôdze do 30-100 ľudí (dôraz na čistú reč a obraz).',
      soundSpecs: [
        '1x Mixážny pult Behringer Xenyx 802',
        '2x Reproduktory Behringer B112D (výkon pre hovorené slovo)',
        '1x Sada 2 bezdrôtových mikrofónov the t.bone free solo Twin HT',
        '2x Trojnožka na reproduktory',
        '2x Stojan na mikrofón'
      ],
      lightSpecs: [
        '2x RGBWA UV Led Par svetlá (nastavené na statickú teplú bielu/oranžovú pre rečníka)',
        '1x Premietačka Wanbo T6 MAX (1080p, vysoký jas pre čitateľné prezentácie)',
        '1x Premietacie plátno 110"'
      ]
    };

    // Package 2: Párty MINI (Chata / Oslava)
    const pkg2: PackageRecommendation = {
      id: 'party-mini',
      name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
      price: 80,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      desc: 'Zameranie: Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí, kde sa vyžaduje dynamický basový základ.',
      soundSpecs: [
        '1x Mixážny pult Behringer Xenyx X1222 USB',
        '2x Reproduktory Behringer B112D (ako satelity)',
        '1x Subwoofer Behringer B1500XP (15" aktívny sub, skvelý transport)',
        '2x Trojnožka na reproduktory',
        '1x Mikrofóny a headsety Auna VHF (pre DJa/karaoke)'
      ],
      lightSpecs: [
        '1x Svetelný set BeamZ Party Bar (všetko v jednom na stojane)',
        '1x Červeno-zelený Laser (retro párty efekt)',
        '1x Dymostroj ADJ VF 1300 (zvýrazní lúče)'
      ]
    };

    // Package 3: Oslava MINI
    const pkg3: PackageRecommendation = {
      id: 'oslava-mini',
      name: 'BALÍK 3: Oslava MINI',
      price: 70,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      desc: 'Zameranie: Rodinné oslavy, posedenia, komorné svadby do 30 ľudí v reštauráciách a sálach s príjemnou atmosférou bez prehnaného tlaku.',
      soundSpecs: [
        '1x Mixážny pult Behringer Xenyx X1222 USB',
        '2x Reproduktory Behringer B112D',
        '1x Sada 2 mikrofónov the t.bone free solo Twin HT (pre príhovory)',
        '2x Trojnožka na reproduktory',
        '1x Stojan na mikrofón'
      ],
      lightSpecs: [
        '4x RGBWA UV Led Par svetlá (ambientné podsvietenie stien sály)',
        '1x Bublinkostroj (spestrenie programu a zábava pre deti)',
        '1x Dymostroj ADJ VF 1300'
      ]
    };

    // Package 4: Svadba MEDIUM
    const pkg4: PackageRecommendation = {
      id: 'svadba-medium',
      name: 'BALÍK 4: Svadba MEDIUM',
      price: 150,
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      desc: 'Zameranie: Klasická svadba alebo stredne veľká oslava do 100 ľudí v interiéri. Vyvážený pomer medzi čistým hovoreným slovom a plným tanečným parketom.',
      soundSpecs: [
        '1x Mixážny pult Behringer Xenyx X1222 USB',
        '2x Reproduktory Behringer B112D (satelity)',
        '1x Subwoofer The Box Pro DSP 18 Sub (silný 18" bas)',
        '2x Teleskopická stojanová tyč',
        '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
        '1x Mikrofóny a headsety Auna VHF (záložné)'
      ],
      lightSpecs: [
        '6x RGBWA UV Led Par svetlá (ambientné osvetlenie sály)',
        '4x RGBW Led Bar 36W (nasvietenie steny za DJom / hlavným stolom)',
        '1x Holografický Laser',
        '1x Bublinkostroj (pre prvý novomanželský tanec)',
        '1x Dymostroj ADJ VF 1300',
        '1x Osvetľovacia konštrukcia na uchytenie svetiel'
      ]
    };

    // Package 5: Klub MEDIUM
    const pkg5: PackageRecommendation = {
      id: 'klub-medium',
      name: 'BALÍK 5: Klub MEDIUM',
      price: 180,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      desc: 'Zameranie: Klubové noci, stužkové, disko párty pre 100 ľudí. Dôraz na masívne basy a rýchle rotujúce svetelné lúče.',
      soundSpecs: [
        '1x Mixážny pult Behringer Xenyx X1222 USB',
        '2x Reproduktory Behringer B112D',
        '2x Subwoofer The Box Pro DSP 18 Sub (silná dvojica 18" basákov)',
        '2x Teleskopická stojanová tyč',
        '1x Mikrofóny a headsety Auna VHF'
      ],
      lightSpecs: [
        '1x Riadiaci DMX pult Light4Me DMX 192',
        '4x Rotujúca 90W Beam hlava (ostré lúče)',
        '1x Laserový Bar 65W (červený priestorový vejár)',
        '4x RGBWA UV Led Par svetlá',
        '1x Stroboskop',
        '1x Dymostroj ADJ VF 1300',
        '1x Osvetľovacia konštrukcia'
      ]
    };

    // Package 6: Svadba PREMIUM MAX
    const pkg6: PackageRecommendation = {
      id: 'svadba-premium-max',
      name: 'BALÍK 6: Svadba PREMIUM MAX',
      price: 320,
      image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
      desc: 'Zameranie: Luxusné veľké svadby, plesy a galavečery nad 100 ľudí. Dokonalé priestorové ozvučenie bez hluchých miest a veľkolepá svetelná show.',
      soundSpecs: [
        '1x Digitálny mixpult Behringer X Air 18 (ovládateľný bezdrôtovo cez iPad)',
        '4x Reproduktory Behringer B112D (vyrovnané pokrytie celej sály)',
        '2x Subwoofer The Box Pro DSP 18 Sub',
        '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
        '4x Mikrofóny a headsety Auna VHF (rečníci, kapela, hostia)',
        '2x Trojnožka na reproduktory',
        '2x Držiaky na reproduktory (stena/dvojice)'
      ],
      lightSpecs: [
        '1x BeamZ SUSHI-DS (počítačové riadenie zladených scén)',
        '8x RGBWA UV Led Par svetlá (ambient sály)',
        '4x RGBW Led Bar 36W',
        '4x Rotujúca 90W Beam hlava',
        '2x Samostatné Bodové UV svetlá',
        '2x Bublinkostroj',
        '2x Dymostroj ADJ VF 1300',
        '1x Osvetľovacia konštrukcia'
      ],
      otherSpecs: [
        '1x Premietačka Wanbo T6 MAX',
        '1x Premietacie plátno 110" (na kvízy a svadobné prezentácie)'
      ]
    };

    // Package 7: Klub MAXIMAL
    const pkg7: PackageRecommendation = {
      id: 'klub-maximal',
      name: 'BALÍK 7: Klub MAXIMAL',
      price: 380,
      image: 'https://images.unsplash.com/photo-1489641493513-ba4ee84ccee9?w=800',
      desc: 'Zameranie: Veľké diskotéky, stužkové pre viacero tried, festivalové stany nad 100 ľudí v interiéri. Extrémny zvukový tlak a laserová show.',
      soundSpecs: [
        '1x Digitálny mixpult Behringer X Air 18',
        '1x Riadiaci procesor the t.rack 4x4 (ochrana pred preťažením)',
        '4x Reproduktory Behringer B112D',
        '4x Subwoofer The Box Pro DSP 18 Sub (štvorica basákov)',
        '4x Teleskopická stojanová tyč'
      ],
      lightSpecs: [
        '1x BeamZ SUSHI-DS (počítačové riadenie)',
        '4x Rotujúca 90W Beam hlava',
        '1x Laserový Bar 65W (červená laserová stena)',
        '8x RGBWA UV Led Par svetlá',
        '4x RGBW Led Bar 36W',
        '1x Holografický Laser',
        '1x Stroboskop',
        '2x Dymostroj ADJ VF 1300 (stabilná hmla)',
        '2x Výrobníky plameňov Fire Machine (bezpečné pódiové plamene)',
        '1x Osvetľovacia konštrukcia'
      ]
    };

    // Package 8: Open-Air ARENA
    const pkg8: PackageRecommendation = {
      id: 'open-air-arena',
      name: 'BALÍK 8: Open-Air ARENA',
      price: 490,
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      desc: 'Zameranie: Vonkajšie festivaly, hody, dni obce, amfiteátre alebo veľké stany. Navrhnuté tak, aby prekonalo akustické straty v otvorenom exteriéri.',
      soundSpecs: [
        '1x Digitálny mixpult Behringer X Air 18',
        '1x Riadiaci procesor the t.rack 4x4',
        '4x Reproduktory Behringer B112D',
        '5x Subwoofer The Box Pro DSP 18 Sub (basová stena z celého skladu)',
        '4x Teleskopická stojanová tyč'
      ],
      lightSpecs: [
        '1x BeamZ SUSHI-DS',
        '4x Rotujúca 90W Beam hlava',
        '1x Laserový Bar 65W',
        '8x RGBWA UV Led Par svetlá',
        '4x RGBW Led Bar 36W',
        '2x Výrobníky plameňov Fire Machine',
        '2x Snehostroj ADJ Snow Flurry HO (atmosférické sneženie)',
        '2x Dymostroj ADJ VF 1300',
        '1x Osvetľovacia konštrukcia'
      ]
    };

    // --- DECISION TREE EVALUATION ---

    // 1. Kategória: Komorná akcia (do 30 ľudí)
    if (people === 'up-to-30') {
      if (eventType === 'presentation') {
        return pkg1;
      }
      if (eventType === 'dj') {
        if (location === 'outdoor') {
          return {
            ...pkg2,
            warning: 'Upozornenie: Keďže podujatie prebieha v exteriéri, uistite sa, že technika bude pod pevným prístreškom alebo zastrešením, ktoré ju ochráni pred rosou, slnkom a dažďom!'
          };
        }
        return pkg2;
      }
      // Svadba alebo Oslava
      if (location === 'outdoor') {
        return {
          ...pkg3,
          warning: 'Upozornenie: Pri plánovaní akcie vonku nezabudnite na zastrešenie aparatúry. Chráni citlivú techniku pred priamym slnkom, večernou vlhkosťou a náhlym dažďom!'
        };
      }
      return pkg3;
    }

    // 2. Kategória: Stredný event (do 100 ľudí)
    if (people === 'up-to-100') {
      if (eventType === 'presentation') {
        if (location === 'outdoor') {
          return {
            ...pkg1,
            warning: 'Odporúčanie: Pre exteriérové prednášky je vhodné pridať statívy a umiestniť reproduktory vyššie, aby sa zvuk v otvorenom priestranstve lepšie niesol.'
          };
        }
        return pkg1;
      }
      if (eventType === 'dj') {
        if (location === 'outdoor') {
          // Exteriér + DJ párty ➔ BALÍK 8: Open-Air ARENA (basy sa vonku strácajú, potrebný max tlak)
          return {
            ...pkg8,
            warning: 'V exteriéri dochádza k obrovským akustickým stratám v basovom pásme. Pre tanečný parket pre 100 ľudí vonku odporúčame rovno sadu ARENA, aby mal DJ dostatočný zvukový tlak.'
          };
        }
        return pkg5; // Interiér + DJ ➔ BALÍK 5
      }
      // Svadba alebo Oslava
      if (location === 'outdoor') {
        return {
          ...pkg4,
          warning: 'Odporúčanie: V exteriéri odporúčame použiť satelitné reproduktory na dištančných tyčiach nad subwoofermi pre lepší rozptyl zvuku do priestoru.'
        };
      }
      return pkg4;
    }

    // 3. Kategória: Veľké podujatie / Klub (nad 100 ľudí)
    if (people === 'over-100') {
      if (location === 'outdoor') {
        // Všetky exteriérové akcie nad 100 ľudí smerujú na BALÍK 8: Open-Air ARENA
        if (eventType === 'presentation') {
          return {
            ...pkg8,
            warning: 'Odporúčanie: V závislosti od rozloženia publika v exteriéri je možné tento set nakonfigurovať so 4x satelitnými (top) reproduktormi pre rovnomernú zrozumiteľnosť prejavu.'
          };
        }
        return pkg8;
      }
      // Interiér
      if (eventType === 'presentation') {
        return {
          ...pkg6,
          desc: 'Zameranie: Prezentácie a schôdze nad 100 ľudí. Využíva sa digitálny mixpult a 4 top reproduktory rozmiestnené v rohoch sály pre dokonalú zrozumiteľnosť bez ozveny.'
        };
      }
      if (eventType === 'dj') {
        return pkg7;
      }
      // Svadba alebo Oslava
      return pkg6;
    }

    // Fallback default
    return pkg3;
  };

  const recommendedSet = getRecommendation();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error('Prosím vyplňte vaše meno a email.');
      return;
    }

    toast.success('Rezervačný dopyt bol úspešne odoslaný!', {
      description: `Váš dopyt pre "${recommendedSet.name}" sme zaznamenali. Čoskoro sa vám ozveme.`
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
                <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh]">
                  <DialogHeader className="border-b border-white/5 pb-4 mb-4">
                    <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                      <Sparkles className="text-[#BD20D3]" />
                      Sprievodca výberom aparatúry
                    </DialogTitle>
                  </DialogHeader>

                  {/* STEP 1: PEOPLE SIZE */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 1 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Pre koľko ľudí je plánovaná akcia?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'up-to-30', label: 'Komorná akcia (do 30 ľudí)', desc: 'Menší priestor, dôraz na čistý zvuk a kompaktnosť.' },
                          { id: 'up-to-100', label: 'Stredný event (do 100 ľudí)', desc: 'Tanečný parket, vyvážený zvuk s basmi a osvetlenie.' },
                          { id: 'over-100', label: 'Veľké podujatie / Klub (nad 100 ľudí)', desc: 'Silný zvukový tlak, subwoofery a kompletná svetelná show.' }
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

                  {/* STEP 2: LOCATION */}
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

                  {/* STEP 3: EVENT TYPE */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 3 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Aký je hlavný účel a typ akcie?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'wedding', label: 'Svadba alebo Oslava', desc: 'Mix podmazovej a tanečnej hudby, mikrofón na príhovory, dekoračné svetlá.', icon: PartyPopper },
                          { id: 'dj', label: 'DJ párty / Diskotéka', desc: 'Dôraz na silné basy, dynamické svetelné efekty a hmlu pre dokonalú atmosféru.', icon: Music },
                          { id: 'presentation', label: 'Firemná prezentácia (hovorené slovo)', desc: 'Maximálna zrozumiteľnosť hlasu, bezdrôtové mikrofóny, podmazová hudba.', icon: Tv }
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

                  {/* RECOMMENDATION RESULT SCREEN */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {!showBookingForm ? (
                        <div className="space-y-6">
                          <div className="text-center space-y-2 border-b border-white/5 pb-4">
                            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Konfigurácia dokončená</span>
                            <h3 className="text-xl md:text-2xl font-bold text-white">Naše odporúčanie pre vašu akciu:</h3>
                          </div>

                          {recommendedSet.warning && (
                            <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
                              <AlertTriangle className="shrink-0 mt-0.5 text-amber-400" size={18} />
                              <p className="leading-relaxed">{recommendedSet.warning}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-5">
                            <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                              <img src={recommendedSet.image} alt={recommendedSet.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                              <div>
                                <h4 className="text-lg font-bold text-white">{recommendedSet.name}</h4>
                                <p className="text-[#BD20D3] font-bold text-2xl mt-1">{recommendedSet.price} € <span className="text-xs text-gray-400 font-normal">/ dňa s DPH</span></p>
                                <p className="text-gray-300 text-xs md:text-sm mt-2 leading-relaxed">{recommendedSet.desc}</p>
                              </div>
                            </div>
                          </div>

                          {/* Detail specifications inside recommendation card */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/2 border border-white/5 rounded-2xl p-4">
                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#BD20D3] block">Zvuková technika</span>
                              <ul className="space-y-1.5">
                                {recommendedSet.soundSpecs.map((spec, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                                    <Check className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#1A4BFF] block">Svetlá, efekty & ostatné</span>
                              <ul className="space-y-1.5">
                                {recommendedSet.lightSpecs.map((spec, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                                    <Check className="text-emerald-500 shrink-0 mt-0.5" size={12} />
                                    <span>{spec}</span>
                                  </li>
                                ))}
                                {recommendedSet.otherSpecs && recommendedSet.otherSpecs.map((spec, i) => (
                                  <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                                    <Check className="text-cyan-400 shrink-0 mt-0.5" size={12} />
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
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