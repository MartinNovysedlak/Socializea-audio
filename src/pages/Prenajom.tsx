"use client";

import React, { useState, useEffect } from 'react';
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
import { usePageMeta } from '@/hooks/usePageMeta';

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const PRESET_FALLBACK: PackageOption[] = [];

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  usePageMeta(
    'Prenájom aparatúry – Socializea-audio | Žilina, Čadca, Kysuce',
    'Prenajmite si profesionálne ozvučenie a svetelnú techniku v Žiline, Čadci a Kysuciach. Vyberte si z hotových balíkov alebo si vyskladajte vlastnú zostavu. Doprava a montáž po celom regióne.'
  );

  const [loadedPackages, setLoadedPackages] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const presetPackages = loadedPackages;

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenDetail = (pkg: PackageOption) => {
    setSelectedPackage(pkg);
    setIsDetailOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      
      <section className="relative pt-24 md:pt-36 pb-10 md:pb-16 overflow-hidden bg-gradient-to-b from-[#020721] via-[#05092a] to-[#020721]">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#1A4BFF]/5 rounded-full blur-[100px] pointer-events-none animate-float-delayed" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl animate-fade-slide-up">
          <Badge className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-extrabold shadow-[0_0_15px_rgba(189,32,211,0.3)]">
            Výber techniky
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4 md:mb-6">
            Zabezpečte si špičkový zvuk <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
              a svetlo na akciu, chatu alebo oslavu
            </span>
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
            Chystáte oslavu, párty na chate, diskotéku alebo firemnú akciu? Vyberte si predpripravený komplet alebo si vyskladajte vlastnú aparatúru v Žiline, Čadci a Kysuciach.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-2">
            <Button 
              onClick={() => handleScrollTo('sety')}
              className="w-full sm:w-auto btn-cyber rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold hover:scale-105 border-none shadow-[0_0_20px_rgba(189,32,211,0.4)]"
            >
              <Layers className="mr-2 animate-pulse" size={16} />
              Pozrieť hotové balíky
            </Button>
            <Button 
              onClick={() => handleScrollTo('polozky')}
              variant="outline"
              className="w-full sm:w-auto border-white/20 hover:border-[#BD20D3] hover:text-white hover:shadow-[0_0_15px_rgba(189,32,211,0.2)] text-white bg-white/5 rounded-xl md:rounded-2xl h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold transition-all hover:scale-105"
            >
              Vyskladať si aparatúru
              <ArrowDown className="ml-2 animate-bounce" size={16} />
            </Button>
          </div>
        </div>
      </section>

      <section id="sety" className="py-12 md:py-20 bg-[#020721]/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>Bez starostí</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white">Hotové balíky na akcie – vyberte si set pre oslavu, párty alebo chatu</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Vyberte si jeden z našich overených a vyvážených setov, ktoré sme zostavili na základe stoviek úspešných akcií.
            </p>
          </div>

          {loadingPackages ? (
            <div className="text-center py-12 text-gray-400">Načítavam balíky...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {presetPackages.map((pkg, index) => {
                const remainingSound = pkg.soundSpecs.length - 3;
                const remainingLights = pkg.lightSpecs.length - 2;

                return (
                <ScrollReveal key={pkg.id} direction="up" delay={index * 0.15}>
                  <Card 
                    className="relative overflow-hidden bg-[#0e122b]/80 border border-white/10 rounded-2xl md:rounded-3xl flex flex-col hover:border-[#BD20D3]/50 hover:shadow-[0_0_30px_rgba(189,32,211,0.1)] hover:-translate-y-2 transition-all duration-300 group h-full cursor-pointer"
                    onClick={() => handleOpenDetail(pkg)}
                  >
                    <div className="h-44 md:h-56 overflow-hidden relative shrink-0">
                      <img 
                        src={pkg.image} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020721] to-transparent" />
                    </div>

                    <CardHeader className="p-4 md:p-6 pb-3 md:pb-4 shrink-0">
                      <CardTitle className="text-lg md:text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors">
                        {pkg.name}
                      </CardTitle>
                      <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed line-clamp-2 md:line-clamp-3">
                        {pkg.description}
                      </p>
                      <div className="flex flex-col gap-1 pt-3 md:pt-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl md:text-3xl font-extrabold text-[#BD20D3]">{pkg.priceNoLights} €</span>
                          <span className="text-gray-400 text-[10px] md:text-xs">/ deň bez svetiel</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg md:text-xl font-bold text-[#1A4BFF]">{pkg.priceWithLights} €</span>
                          <span className="text-gray-400 text-[10px] md:text-xs">/ deň so svetlami</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 md:px-6 pb-4 md:pb-6 pt-0 flex-1 flex flex-col">
                      <div className="border-t border-white/5 pt-3 md:pt-4 space-y-2 flex-1">
                        <p className="text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-wider">Komponenty v sete:</p>
                        {pkg.soundSpecs.slice(0, 3).map((comp, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] md:text-xs text-gray-300">
                            <Check size={10} className="text-[#BD20D3] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{comp}</span>
                          </div>
                        ))}
                        {remainingSound > 0 && (
                          <div className="text-[10px] md:text-xs text-gray-500 italic">
                            + {remainingSound} {remainingSound === 1 ? 'produkt' : 'produkty'} z kategórie zvuk
                          </div>
                        )}
                        {pkg.lightSpecs.length > 0 && (
                          <div className="flex items-start gap-2 text-[11px] md:text-xs text-gray-300 mt-2 pt-2 border-t border-white/5">
                            <Lightbulb size={10} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                            <span className="font-medium text-white">Svetlá & efekty:</span>
                          </div>
                        )}
                        {pkg.lightSpecs.slice(0, 2).map((comp, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-[11px] md:text-xs text-gray-300 ml-4 md:ml-5">
                            <Check size={10} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{comp}</span>
                          </div>
                        ))}
                        {remainingLights > 0 && (
                          <div className="text-[10px] md:text-xs text-gray-500 italic ml-4 md:ml-5">
                            + {remainingLights} {remainingLights === 1 ? 'produkt' : 'produkty'} z kategórie svetlá a efekty
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 md:p-6 pt-0 shrink-0">
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(pkg); }}
                        className="w-full btn-cyber rounded-xl md:rounded-xl h-11 md:h-14 border-none font-bold text-xs md:text-sm"
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

      <section id="polozky" className="py-10 md:py-16 bg-[#020721]">
        <div className="container mx-auto px-4 text-center max-w-4xl mb-8 md:mb-12">
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 mb-3 md:mb-4 px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs uppercase tracking-wider font-semibold">
            Vlastná konfigurácia
          </Badge>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-white mb-3 md:mb-4">
            Potrebujete len konkrétny kus? Vyskladajte si vlastnú aparatúru
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
  );
};

export default Prenajom;