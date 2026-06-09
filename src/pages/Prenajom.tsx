"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
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

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

// Lokálna ponuka hotových setov / balíkov
interface PresetPackage {
  id: string;
  name: string;
  price: number;
  image: string;
  isPopular?: boolean;
  components: string[];
  description: string;
}

const presetPackages: PresetPackage[] = [
  {
    id: 'party-m',
    name: 'Párty Set M (Rodinná Oslava)',
    price: 80,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    description: 'Dokonalý set navrhnutý pre oslavy, menšie svadby a chaty do 50 ľudí v interiéri.',
    components: [
      '2x Aktívny reproduktor Behringer 12"',
      '2x Stabilný stojan na reproduktory',
      '1x Bluetooth prijímač pre mobil / notebook',
      'Kompletná kabeláž'
    ]
  },
  {
    id: 'wedding-l',
    name: 'Svadobný Set L (Premium)',
    price: 150,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
    description: 'Náš vlajkový balík pre svadby a väčšie podujatia do 120 hostí s čistým zvukom a skvelým svetlom.',
    components: [
      '2x Aktívny reproduktor Behringer 15"',
      '1x Aktívny subwoofer Behringer 18"',
      '1x Svetelná rampa (4x LED PAR) so statívom',
      '1x Bezdrôtový mikrofón pre rečníka/moderátora',
      'Kompletná kabeláž'
    ]
  },
  {
    id: 'club-xl',
    name: 'Set Párty/DJ (Club Set XL)',
    price: 240,
    image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=800',
    description: 'Ultimátny basový tlak a ohromujúca svetelná show. Určené pre klubové akcie a svadby nad 150 hostí.',
    components: [
      '4x Aktívny reproduktor Behringer 15"',
      '2x Profesionálny t.bone aktívny subwoofer 18"',
      '1x Svetelná show s rotujúcimi hlavami a laserom',
      '1x Profesionálny dymostroj ADJ VF 1300',
      'Bezdrôtový mikrofón'
    ]
  }
];

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  const [selectedPackage, setSelectedPackage] = useState<PresetPackage | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenBooking = (pkg: PresetPackage) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      toast.error('Prosím vyplňte povinné údaje.');
      return;
    }

    toast.success('Dopyt na balík bol odoslaný!', {
      description: `Váš dopyt pre "${selectedPackage?.name}" bol zaznamenaný. Náš tím vás čoskoro osloví.`
    });
    setIsBookingOpen(false);
    setBookingForm({ name: '', phone: '', email: '', date: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      
      {/* SEKCIA 1: HERO / ÚVODNÝ FILTER */}
      <section className="relative pt-36 pb-16 overflow-hidden bg-gradient-to-b from-[#020721] via-[#05092a] to-[#020721]">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#1A4BFF]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <Badge className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white mb-6 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-extrabold">
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
              className="w-full sm:w-auto bg-[#BD20D3] hover:bg-[#BD20D3]/90 text-white rounded-2xl h-14 px-8 text-base font-bold transition-transform hover:scale-105"
            >
              <Layers className="mr-2" size={18} />
              Pozrieť hotové balíky
            </Button>
            <Button 
              onClick={() => handleScrollTo('polozky')}
              variant="outline"
              className="w-full sm:w-auto border-white/20 hover:border-[#BD20D3]/50 text-white bg-white/5 rounded-2xl h-14 px-8 text-base font-bold transition-transform hover:scale-105"
            >
              Vyskladať si aparatúru
              <ArrowDown className="ml-2 animate-bounce" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* SEKCIA 2: HOTOVÉ SETY / BALÍKY */}
      <section id="sety" className="py-20 bg-[#020721]/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Bez starostí</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Naša ponuka balíkov</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Vyberte si jeden z našich overených a vyvážených setov, ktoré sme zostavili na základe stoviek úspešných akcií.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {presetPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`bg-[#0e122b]/80 border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#BD20D3]/50 transition-all duration-300 relative group ${
                  pkg.isPopular ? 'ring-1 ring-[#BD20D3] shadow-[0_0_30px_rgba(189,32,211,0.15)]' : ''
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-lg">
                    Populárne
                  </span>
                )}

                <div>
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
                    <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed h-12 overflow-hidden">
                      {pkg.description}
                    </p>
                    <div className="flex items-baseline gap-1.5 pt-4">
                      <span className="text-3xl font-extrabold text-[#BD20D3]">{pkg.price} €</span>
                      <span className="text-gray-400 text-xs">/ deň s DPH</span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-6 pt-0 space-y-4">
                    <div className="border-t border-white/5 pt-4 space-y-2.5">
                      <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Komponenty v sete:</p>
                      {pkg.components.map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check size={14} className="text-[#BD20D3] shrink-0 mt-0.5" />
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="p-6 pt-0">
                  <Button 
                    onClick={() => handleOpenBooking(pkg)}
                    className="w-full btn-cyber rounded-xl h-12 border-none font-bold text-sm"
                  >
                    Nezáväzne rezervovať set
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SEKCIA 3: SAMOSTATNÉ POLOŽKY (Pôvodný katalóg a košík) */}
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

        {/* Pôvodný EquipmentCatalog pripojený k databáze Supabase */}
        <EquipmentCatalog 
          equipment={equipment} 
          loading={equipment.length === 0} 
          quantities={quantities} 
          setQuantities={setQuantities} 
        />
      </section>

      {/* Rýchly prepojený plávajúci košík */}
      <FloatingCart 
        quantities={quantities} 
        setQuantities={setQuantities} 
        equipment={equipment} 
      />

      {/* DEDIKOVANÝ MODAL PRE REZERVÁCIU BALÍKA */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-md rounded-3xl p-6 shadow-2xl shadow-[#BD20D3]/20">
          <DialogHeader className="border-b border-white/5 pb-3">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Calendar className="text-[#BD20D3]" />
              Rezervácia balíka
            </DialogTitle>
          </DialogHeader>

          {selectedPackage && (
            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-3">
              <div className="bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-xl p-4">
                <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Vybraný balík:</span>
                <span className="font-bold text-white text-base block mt-0.5">{selectedPackage.name}</span>
                <span className="text-[#BD20D3] font-bold text-lg mt-1 block">{selectedPackage.price} € / deň</span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-name" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                  <User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *
                </Label>
                <Input
                  id="pkg-name"
                  required
                  placeholder="Ján Novák"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pkg-phone" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Phone size={12} className="text-[#BD20D3]" /> Telefón
                  </Label>
                  <Input
                    id="pkg-phone"
                    type="tel"
                    placeholder="+421 900 123 456"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pkg-date" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#BD20D3]" /> Dátum odberu *
                  </Label>
                  <Input
                    id="pkg-date"
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(p => ({ ...p, date: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-email" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                  <Mail size={12} className="text-[#BD20D3]" /> E-mail *
                </Label>
                <Input
                  id="pkg-email"
                  type="email"
                  required
                  placeholder="jan.novak@example.sk"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkg-msg" className="text-gray-300 text-xs font-bold uppercase">Poznámka / Doprava</Label>
                <Textarea
                  id="pkg-msg"
                  placeholder="Mám záujem o dopravu a montáž / špecifické požiadavky..."
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
                />
              </div>

              <Button type="submit" className="w-full btn-cyber h-12 rounded-xl font-bold border-none text-sm mt-2">
                Odoslať rezervačný dopyt
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
};

export default Prenajom;