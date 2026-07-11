"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Music, 
  ArrowRight, 
  ArrowLeft, 
  PartyPopper,
  Tv,
  AlertTriangle
} from 'lucide-react';
import { packagesService, PackageData } from '@/lib/packagesService';
import PackageDetailDialog, { PackageOption } from './PackageDetailDialog';

interface QuizAnswers {
  people: string;
  location: string;
  eventType: string;
}

interface InteractiveQuizProps {
  autoOpen?: boolean;
  onAutoOpenHandled?: () => void;
}

const PACKAGE_NAME_MAPPING: Record<string, string> = {
  'oslava-mini': 'Oslava MINI',
  'party-mini': 'Párty MINI',
  'kompakt-prezentacia': 'Kompakt Prezentácia',
  'oslava-medium': 'Oslava MEDIUM',
  'klub-medium': 'Klub MEDIUM',
  'premium-max': 'PREMIUM MAX',
  'klub-maximal': 'Klub MAXIMAL',
  'open-air-arena': 'Open-Air ARENA',
};

const InteractiveQuiz = ({ autoOpen = false, onAutoOpenHandled }: InteractiveQuizProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    people: '',
    location: '',
    eventType: ''
  });

  const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);

  const [loadedPackages, setLoadedPackages] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  // Auto-open dialog when autoOpen prop is set
  useEffect(() => {
    if (autoOpen && !isOpen) {
      setIsOpen(true);
      if (onAutoOpenHandled) onAutoOpenHandled();
    }
  }, [autoOpen]);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoadingPackages(true);
      try {
        const dbPackages = await packagesService.getAll();
        if (dbPackages.length > 0) {
          const mapped: PackageOption[] = dbPackages.map((pkg: PackageData) => ({
            id: pkg.id,
            name: pkg.name,
            priceNoLights: pkg.price_no_lights,
            priceWithLights: pkg.price_with_lights,
            image: pkg.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
            description: pkg.description,
            soundSpecs: pkg.sound_specs || [],
            lightSpecs: pkg.light_specs || [],
            otherSpecs: pkg.other_specs || [],
            warning: pkg.warning || undefined
          }));
          setLoadedPackages(mapped);
        } else {
          setLoadedPackages([]);
        }
      } catch {
        setLoadedPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ people: '', location: '', eventType: '' });
    setSelectedPackage(null);
  };

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (key === 'eventType') {
      const recommendation = getRecommendation(newAnswers);
      setSelectedPackage(recommendation);
      setIsOpen(false);
      setTimeout(() => {
        setIsPackageDetailOpen(true);
      }, 300);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const getRecommendation = (answers: QuizAnswers): PackageOption | null => {
    const { people, location, eventType } = answers;
    if (loadedPackages.length === 0) return null;

    const findPackage = (idPrefix: string): PackageOption | null => {
      if (loadedPackages.length === 0) return null;
      
      const exactMatch = loadedPackages.find(p => p.id === idPrefix);
      if (exactMatch) return exactMatch;
      
      const mappedName = PACKAGE_NAME_MAPPING[idPrefix];
      if (mappedName) {
        const nameMatch = loadedPackages.find(p => p.name.includes(mappedName));
        if (nameMatch) return nameMatch;
      }
      
      const nameFallback = loadedPackages.find(p => 
        p.name.toLowerCase().includes(idPrefix.replace(/-/g, ' ').toLowerCase())
      );
      if (nameFallback) return nameFallback;
      
      return loadedPackages[0];
    };

    if (people === 'up-to-30') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return findPackage('oslava-mini');
        if (eventType === 'dj') return findPackage('party-mini');
        return findPackage('kompakt-prezentacia');
      } else {
        if (eventType === 'wedding') {
          const pkg = findPackage('oslava-mini');
          if (pkg) return { ...pkg, warning: 'Upozornenie: Keďže podujatie prebieha v exteriéri, uistite sa, že technika bude chránená pod pevným prístreškom alebo zastrešením pred slnkom, večernou rosou a náhlym dažďom!' };
          return pkg;
        }
        if (eventType === 'dj') {
          const pkg = findPackage('party-mini');
          if (pkg) return { ...pkg, warning: 'Upozornenie: Keďže podujatie prebieha v exteriéri, uistite sa, že technika bude pod pevným prístreškom alebo zastrešením, ktoré ju ochráni pred rosou, slnkom a dažďom!' };
          return pkg;
        }
        return findPackage('kompakt-prezentacia');
      }
    }

    if (people === 'up-to-100') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return findPackage('oslava-medium');
        if (eventType === 'dj') return findPackage('klub-medium');
        return findPackage('kompakt-prezentacia');
      } else {
        if (eventType === 'wedding') {
          const pkg = findPackage('oslava-medium');
          if (pkg) return { ...pkg, warning: 'Odporúčanie: Pre exteriér k tomuto setu odporúčame pridať dištančné stojanové tyče, aby satelity hrali nad úroveň rečníkov a zvuk lepšie pokryl otvorený priestor. Ideálne s dištančnými tyčami.' };
          return pkg;
        }
        if (eventType === 'dj') {
          const pkg = findPackage('open-air-arena');
          if (pkg) return { ...pkg, warning: 'Odporúčanie: Vonku sa akustický basový tlak rýchlo stráca. Preto sme pre exteriérovú DJ disko párty pre 100 ľudí vybrali balík ARENA s maximálnym basovým arzenálom 5x Subwoofer!' };
          return pkg;
        }
        return findPackage('kompakt-prezentacia');
      }
    }

    if (people === 'over-100') {
      if (location === 'indoor') {
        if (eventType === 'wedding') return findPackage('premium-max');
        if (eventType === 'dj') return findPackage('klub-maximal');
        const pkg = findPackage('premium-max');
        if (pkg) return { ...pkg, warning: 'Odporúčanie: Pri veľkej vnútornej prezentácii využívame digitálny mixpult a 4 topy (reproduktory) kvôli zrozumiteľnosti v celej sále.' };
        return pkg;
      } else {
        if (eventType === 'wedding') return findPackage('open-air-arena');
        if (eventType === 'dj') return findPackage('open-air-arena');
        const pkg = findPackage('open-air-arena');
        if (pkg) return { ...pkg, warning: 'Odporúčanie: Pre veľkú exteriérovú prezentáciu nad 100 ľudí odporúčame konfiguráciu so 4x top reproduktormi pre špičkovú zrozumiteľnosť prejavu.' };
        return pkg;
      }
    }

    return loadedPackages[0] || null;
  };

  return (
    <>
      <section className="py-12 bg-transparent relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-[#1A4BFF]/20 via-[#0a0d1f] to-[#BD20D3]/20 border border-[#BD20D3]/30 rounded-[2.5rem] p-6 md:p-8 lg:p-12 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(189,32,211,0.15)]">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#1A4BFF]/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={14} />
                  <span>Inteligentný pomocník</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
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
                      Spustiť sprievodcu
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
                            { id: 'up-to-30', label: 'Komorná akcia (do 30 ľudí)', desc: 'Menší priestor, dôraz na kompaktné ozvučenie.' },
                            { id: 'up-to-100', label: 'Stredný event (do 100 ľudí)', desc: 'Klasické oslavy a stredné sály.' },
                            { id: 'over-100', label: 'Veľké podujatie / Klub (nad 100 ľudí)', desc: 'Masívny zvuk, silné basy, klubová show.' }
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
                            { id: 'wedding', label: 'Svadba alebo Oslava', desc: 'Mix hudby, mikrofón na príhovory, elegantná atmosféra.', icon: PartyPopper },
                            { id: 'dj', label: 'DJ párty / Diskotéka', desc: 'Dôraz na silné basy, dynamické svetelné efekty a hmlu.', icon: Music },
                            { id: 'presentation', label: 'Firemná prezentácia (hovorené slovo)', desc: 'Maximálna zrozumiteľnosť hlasu, čistota prejavu.', icon: Tv }
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
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PackageDetailDialog 
        open={isPackageDetailOpen}
        onOpenChange={(open) => {
          setIsPackageDetailOpen(open);
          if (!open) resetQuiz();
        }}
        selectedPackage={selectedPackage}
      />
    </>
  );
};

export default InteractiveQuiz;