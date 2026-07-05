"use client";

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Package, ChevronRight, Filter, Volume2, Lightbulb, Layers, ShoppingBag, Music, ChevronDown, Minus, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentItem } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PackageDetailDialog, { PackageOption } from '@/components/PackageDetailDialog';
import { packagesService, PackageData } from '@/lib/packagesService';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import RentalPackageCard from '@/components/RentalPackageCard';

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
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

function Prenajom({ quantities, setQuantities, equipment }: PrenajomProps) {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState<'all' | 'sound' | 'lighting' | 'other'>('all');
  const [loadedPackages, setLoadedPackages] = useState<PackageOption[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [isPackageDetailOpen, setIsPackageDetailOpen] = useState(false);

  // Restore scroll position on back navigation
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const saved = sessionStorage.getItem('prenajom-scroll-position');

    if (saved !== null) {
      const pos = parseInt(saved, 10);
      // Wait a little for content to render
      scrollTimeout = setTimeout(() => {
        window.scrollTo(0, pos);
        sessionStorage.removeItem('prenajom-scroll-position');
      }, 100);
    }

    return () => {
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Fetch packages from DB
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
            images: pkg.images || (pkg.image ? [pkg.image] : ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800']),
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
      } catch (err) {
        console.error('Error loading packages:', err);
        setLoadedPackages([]);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  const openPackageDetail = (pkg: PackageOption) => {
    setSelectedPackage(pkg);
    setIsPackageDetailOpen(true);
  };

  const filteredEquipment = activeFilter === "all"
    ? equipment
    : equipment.filter((item) => item.category === activeFilter);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "sound": return "Zvuk";
      case "lighting": return "Svetlá a efekty";
      case "other": return "Ostatné";
      default: return "";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sound": return <Volume2 size={13} />;
      case "lighting": return <Lightbulb size={13} />;
      default: return <Layers size={13} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sound": return { bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-400", icon: "text-cyan-400" };
      case "lighting": return { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", icon: "text-amber-400" };
      default: return { bg: "bg-purple-500/10", border: "border-purple-500/25", text: "text-purple-400", icon: "text-purple-400" };
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    const currentQty = quantities[id] ?? 0;
    const item = equipment.find((i) => i.id === id);
    const newQty = Math.max(0, Math.min(item?.available ?? 0, currentQty + delta));
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  const handleProductClick = () => {
    sessionStorage.setItem('prenajom-scroll-position', String(window.scrollY));
  };

  return (
    <>
      <Helmet>
        <title>Prenájom Profesionálnej Audio & Svetelnej Techniky | Socializea Audio</title>
        <meta name="description" content="Prenajmite si špičkovú zvukovú a svetelnú techniku na vaše podujatie. Mixpulty, reproduktory, subwoofery, mikrofóny, LED svetlá, lasery, dymostroje a ďalšie. Osobný odber v Žiline alebo Čadci, doprava po celom Slovensku." />
        <meta name="keywords" content="prenájom ozvučenia, prenájom reproduktorov, prenájom svetiel, prenájom DJ techniky, svadobné ozvučenie, ozvučenie na párty, prenájom mikrofónov, prenájom subwoofera, Socializea, Čadca, Žilina, Kysuce" />
        <link rel="canonical" href="https://socializea.sk/prenajom" />
        <meta property="og:title" content="Prenájom Profesionálnej Audio & Svetelnej Techniky | Socializea Audio" />
        <meta property="og:description" content="Prenajmite si špičkovú zvukovú a svetelnú techniku na vaše podujatie. Mixpulty, reproduktory, subwoofery, mikrofóny, LED svetlá, lasery, dymostroje." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socializea.sk/prenajom" />
        <meta property="og:image" content="https://socializea.sk/logo.png" />
        <meta property="og:locale" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prenájom Profesionálnej Audio & Svetelnej Techniky | Socializea Audio" />
        <meta name="twitter:description" content="Prenajmite si špičkovú zvukovú a svetelnú techniku na vaše podujatie." />
        <meta name="twitter:image" content="https://socializea.sk/logo.png" />
      </Helmet>

      <main className="min-h-screen bg-[#020721] relative overflow-hidden">
        <Navbar />

        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />

        <div className="pt-32 pb-16 md:pb-24 container mx-auto px-4 relative z-10">
          
          {/* Hero sekcia prenájmu */}
          <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16 animate-fade-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-6 shadow-[0_0_15px_rgba(189,32,211,0.2)]">
              <Music size={16} />
              <span>Prenájom aparatúry</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Zvoľte si ideálnu aparatúru <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
                pre vašu akciu
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Vyberte si z profesionálnych balíkov alebo si nakombinujte vlastnú zostavu z jednotlivých položiek.
            </p>
          </div>

          {/* Balíky – prvý krátky prehľad */}
          <section className="py-6 md:py-8">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 md:mb-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Pripravené balíky</h2>
                <p className="text-gray-400 text-sm">Kompletné sety zvuku a svetiel pre rôzne typy podujatí</p>
              </div>

              {loadingPackages ? (
                <div className="text-center text-gray-500 py-8">Načítavam balíky...</div>
              ) : loadedPackages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Žiadne balíky nie sú momentálne k dispozícii.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loadedPackages.slice(0, 6).map((pkg) => (
                    <RentalPackageCard
                      key={pkg.id}
                      pkg={pkg}
                      onDetail={() => openPackageDetail(pkg)}
                    />
                  ))}
                </div>
              )}

              {loadedPackages.length > 6 && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => openPackageDetail(loadedPackages[6])}
                    className="btn-cyber rounded-2xl h-12 px-8 border-none text-white font-bold"
                  >
                    Pozrieť všetky balíky
                    <ChevronRight size={18} className="ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Jednotlivé položky – EquipmentCatalog */}
          <EquipmentCatalog
            equipment={equipment}
            loading={false}
            quantities={quantities}
            setQuantities={setQuantities}
          />

        </div>

        <Footer />
      </main>

      {/* PackageDetailDialog */}
      <PackageDetailDialog
        open={isPackageDetailOpen}
        onOpenChange={(open) => {
          setIsPackageDetailOpen(open);
          if (!open) setSelectedPackage(null);
        }}
        selectedPackage={selectedPackage}
      />
    </>
  );
}

export default Prenajom;