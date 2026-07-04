"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Check, 
  Layers, 
  ArrowDown, 
  Volume2,
  Lightbulb,
  Package,
  ChevronRight
} from 'lucide-react';
import { EquipmentItem } from '@/lib/supabase';
import { packagesService, PackageData } from '@/lib/packagesService';
import PackageDetailDialog, { PackageOption } from '@/components/PackageDetailDialog';

interface PresetPackage {
  id: string;
  name: string;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  isPopular?: boolean;
  description: string;
  soundSpecs: string[];
  lightSpecs: string[];
  otherSpecs?: string[];
  warning?: string;
}

const PRESET_FALLBACK: PresetPackage[] = [
  {
    id: 'kompakt-prezentacia',
    name: 'BALÍK 1: Kompakt Prezentácia',
    priceNoLights: 100,
    priceWithLights: 130,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    description: 'Firemné prezentácie, prednášky, schôdze do 30-100 ľudí.',
    soundSpecs: ['2x Behringer B112D', '1x Mix Xenyx 802', '2x bezdrôt mikrofón'],
    lightSpecs: ['4x RGBWA UV Par']
  },
  {
    id: 'party-mini',
    name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
    priceNoLights: 110,
    priceWithLights: 140,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    description: 'Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí.',
    soundSpecs: ['1x Behringer B112D', '1x Sub B1500XP', '1x mikrofón'],
    lightSpecs: ['BeamZ Party Bar', '2x Laser', 'Dymostroj']
  },
  {
    id: 'oslava-mini',
    name: 'BALÍK 3: Oslava MINI',
    priceNoLights: 140,
    priceWithLights: 180,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af3bc9?w=800',
    description: 'Rodinné oslavy, komorné svadby do 30 ľudí.',
    soundSpecs: ['2x Behringer B112D', '1x Sub B1500XP', '2x mikrofón'],
    lightSpecs: ['BeamZ Party Bar', '2x Laser', 'Dymostroj']
  },
  {
    id: 'oslava-medium',
    name: 'BALÍK 4: Oslava MEDIUM',
    priceNoLights: 180,
    priceWithLights: 270,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    description: 'Klasická svadba alebo stredne veľká oslava do 100 ľudí.',
    soundSpecs: ['2x Behringer B112D', '1x Sub 18" DSP', '2x mikrofón'],
    lightSpecs: ['6x RGBWA Par', '2x Rotujúca hlava', 'Holografický Laser', 'Dymostroj']
  },
  {
    id: 'klub-medium',
    name: 'BALÍK 5: Klub MEDIUM',
    priceNoLights: 220,
    priceWithLights: 340,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    description: 'Klubové noci, stužkové, disko párty pre 100 ľudí.',
    soundSpecs: ['2x Behringer B112D', '2x Sub 18" DSP', '2x mikrofón'],
    lightSpecs: ['4x Rotujúca hlava', '6x RGBWA Par', 'Holografický Laser', '2x Dymostroj']
  },
  {
    id: 'premium-max',
    name: 'BALÍK 6: PREMIUM MAX',
    priceNoLights: 250,
    priceWithLights: 430,
    image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
    description: 'Luxusné svadby, firemné eventy nad 100 ľudí.',
    soundSpecs: ['2x Behringer B112D', '3x Sub 18" DSP', 'digitálny mixpult'],
    lightSpecs: ['4x Rotujúca hlava', '6x RGBWA Par', 'Holografický Laser', '2x Dymostroj']
  },
  {
    id: 'klub-maximal',
    name: 'BALÍK 7: Klub MAXIMAL',
    priceNoLights: 380,
    priceWithLights: 520,
    image: 'https://images.unsplash.com/photo-1489641493513-ba4ee84ccee9?w=800',
    description: 'Veľké diskotéky, festivalové stany nad 100 ľudí.',
    soundSpecs: ['4x Sub 18" DSP', 'digitálny mixpult', 'procesor'],
    lightSpecs: ['4x Rotujúca hlava', '6x RGBWA Par', '2x Dymostroj']
  },
  {
    id: 'open-air-arena',
    name: 'BALÍK 8: Open-Air ARENA',
    priceNoLights: 480,
    priceWithLights: 730,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
    description: 'Vonkajšie festivaly, hody, dni obce.',
    soundSpecs: ['4x Behringer B112D', '5x Sub 18" DSP', 'digitálny mixpult'],
    lightSpecs: ['4x Rotujúca hlava', '2x Laser BAR', '2x Plameňomet', '2x Dymostroj']
  }
];

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  const [loadedPackages, setLoadedPackages] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const lastScrollSaveRef = useRef<number>(0);

  // 🔑 Prieběžné ukladanie scroll pozície (throttle 100ms)
  // Toto beží len kým sme na stránke Prenajom (nie v detaile)
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollSaveRef.current > 100) {
        lastScrollSaveRef.current = now;
        sessionStorage.setItem('prenajom-scroll-position', String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Načítanie balíkov
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
          setLoadedPackages(PRESET_FALLBACK);
        }
      } catch {
        setLoadedPackages(PRESET_FALLBACK);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  // 🔑 Obnovenie scrollu AŽ keď sú načítané balíky aj equipment
  useEffect(() => {
    if (loadingPackages || !equipment || equipment.length === 0) return;

    const saved = sessionStorage.getItem('prenajom-scroll-position');
    if (saved !== null) {
      const targetY = parseInt(saved, 10);
      
      const timer = setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' as any });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [loadingPackages, equipment]);

  const presetPackages = loadedPackages;

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDetail = (pkg: PackageOption) => {
    setSelectedPackage(pkg);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Prenájom Audio & Svetelnej Techniky | Socializea Audio</title>
        <meta name="description" content="Prenájom profesionálnej zvukovej a svetelnej techniky – reproduktory, subwoofery, mixážne pulty, mikrofóny, LED svetlá, lasery, dymostroje. Hotové balíky aj samostatné položky pre svadby, párty a eventy." />
        <meta name="keywords" content="prenájom ozvučenia, prenájom reproduktorov, prenájom svetiel, prenájom DJ techniky, svadobné ozvučenie, ozvučenie na párty, prenájom subwooferov, prenájom mixpultov, prenájom osvetlenia, Čadca, Žilina" />
        <link rel="canonical" href="https://socializea.sk/prenajom" />
        <meta property="og:title" content="Prenájom Audio & Svetelnej Techniky | Socializea Audio" />
        <meta property="og:description" content="Prenájom profesionálnej zvukovej a svetelnej techniky – reproduktory, subwoofery, mixážne pulty, mikrofóny, LED svetlá, lasery, dymostroje." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socializea.sk/prenajom" />
        <meta property="og:image" content="https://socializea.sk/logo.png" />
        <meta property="og:locale" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prenájom Audio & Svetelnej Techniky | Socializea Audio" />
        <meta name="twitter:description" content="Prenájom profesionálnej zvukovej a svetelnej techniky – reproduktory, subwoofery, mixážne pulty, mikrofóny, LED svetlá, lasery, dymostroje." />
        <meta name="twitter:image" content="https://socializea.sk/logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Ponuka prenájmu techniky",
            "itemListElement": PRESET_FALLBACK.map((pkg, idx) => ({
              "@type": "ListItem",
              "position": idx + 1,
              "item": {
                "@type": "Product",
                "name": pkg.name,
                "description": pkg.description,
                "offers": {
                  "@type": "Offer",
                  "price": pkg.priceNoLights,
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                }
              }
            }))
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721]" ref={mainRef}>
        <Navbar />
        
        <section className="relative pt-36 pb-16 overflow-hidden bg-gradient-to-b from-[#020721] via-[#05092a] to-[#020721]">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#1A4BFF]/5 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl animate-fade-slide-up">
            <Badge className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white mb-6 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-extrabold shadow-[0_0_15px_rgba(189,32,211,0.3)]">
              Výber techniky
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
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

        <section id="sety" className="py-16 md:py-20 bg-[#020721]/50 border-y border-white/5 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="animate-spin-slow" />
                <span>Bez starostí</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Naša ponuka balíkov</h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Vyberte si jeden z našich overených a vyvážených setov, ktoré sme zostavili na základe stoviek úspešných akcií.
              </p>
            </div>

            {loadingPackages ? (
              <div className="text-center py-12 text-gray-400">Načítavam balíky...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {presetPackages.map((pkg, index) => {
                  const remainingSound = pkg.soundSpecs.length - 3;
                  const remainingLights = pkg.lightSpecs.length - 2;

                  return (
                  <ScrollReveal key={pkg.id} direction="up" delay={index * 0.15}>
                    <Card 
                      className="relative overflow-hidden bg-[#0e122b]/80 border border-white/10 rounded-3xl flex flex-col hover:border-[#BD20D3]/50 hover:shadow-[0_0_30px_rgba(189,32,211,0.1)] hover:-translate-y-2 transition-all duration-300 group h-full cursor-pointer"
                      onClick={() => handleOpenDetail(pkg)}
                    >
                      <div className="h-48 md:h-56 overflow-hidden relative shrink-0">
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020721] to-transparent" />
                      </div>

                      <CardHeader className="p-6 pb-4 shrink-0">
                        <CardTitle className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors">
                          {pkg.name}
                        </CardTitle>
                        <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed h-14 overflow-hidden">
                          {pkg.description}
                        </p>
                        <div className="flex items-baseline gap-1.5 pt-4">
                          <span className="text-2xl sm:text-3xl font-extrabold text-[#BD20D3]">{pkg.priceNoLights} €</span>
                          <span className="text-gray-400 text-xs">/ deň bez svetiel</span>
                        </div>
                        <div className="flex items-baseline gap-1.5 text-sm">
                          <span className="text-xl sm:text-2xl font-bold text-[#1A4BFF]">{pkg.priceWithLights} €</span>
                          <span className="text-gray-400 text-xs">/ deň so svetlami</span>
                        </div>
                      </CardHeader>

                      <CardContent className="px-6 pb-6 pt-0 flex-1 flex flex-col">
                        <div className="border-t border-white/5 pt-4 space-y-2.5 flex-1">
                          <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Komponenty v sete:</p>
                          {pkg.soundSpecs.slice(0, 3).map((comp, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                              <Check size={12} className="text-[#BD20D3] shrink-0 mt-0.5" />
                              <span>{comp}</span>
                            </div>
                          ))}
                          {remainingSound > 0 && (
                            <div className="text-xs text-gray-500 italic">
                              + {remainingSound} {remainingSound === 1 ? 'produkt' : 'produkty'} z kategórie zvuk
                            </div>
                          )}
                          {pkg.lightSpecs.length > 0 && (
                            <div className="flex items-start gap-2.5 text-xs text-gray-300 mt-2 pt-2 border-t border-white/5">
                              <Lightbulb size={12} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                              <span className="font-medium text-white">Svetlá & efekty:</span>
                            </div>
                          )}
                          {pkg.lightSpecs.slice(0, 2).map((comp, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 ml-5">
                              <Check size={12} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                              <span>{comp}</span>
                            </div>
                          ))}
                          {remainingLights > 0 && (
                            <div className="text-xs text-gray-500 italic ml-5">
                              + {remainingLights} {remainingLights === 1 ? 'produkt' : 'produkty'} z kategórie svetlá a efekty
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-6 pt-0 shrink-0">
                        <Button 
                          onClick={(e) => { e.stopPropagation(); handleOpenDetail(pkg); }}
                          className="w-full btn-cyber rounded-xl h-14 border-none font-bold text-sm"
                        >
                          Detail balíka a rezervácia
                          <ChevronRight className="ml-2" size={14} />
                        </Button>
                      </CardFooter>
                    </Card>
                  </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="polozky" className="py-12 md:py-16 bg-[#020721]">
          <div className="container mx-auto px-4 text-center max-w-4xl mb-12">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-4 px-3 py-1 text-xs uppercase tracking-wider font-semibold">
              Vlastná konfigurácia
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4">
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

        <PackageDetailDialog
          open={isDetailOpen}
          onOpenChange={(open) => {
            setIsDetailOpen(open);
            if (!open) setSelectedPackage(null);
          }}
          selectedPackage={selectedPackage}
        />

        <Footer />
      </main>
    </>
  );
};

export default Prenajom;