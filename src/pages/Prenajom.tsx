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

interface PresetPackage {
  id: string;
  name: string;
  price: number;
  image: string;
  isPopular?: boolean;
  components: string[];
  description: string;
}

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

// All 8 packages matching the quiz configuration
const presetPackages: PresetPackage[] = [
  {
    id: 'kompakt-prezentacia',
    name: 'BALÍK 1: Kompakt Prezentácia',
    price: 100,
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
    description: 'Zameranie: Firemné prezentácie, prednášky, schôdze do 30-100 ľudí (dôraz na čistú reč a obraz).',
    components: [
      '1x Mixážny pult Behringer Xenyx 802 (kompaktný, jednoduchý na obsluhu)',
      '2x Reproduktory Behringer B112D (dostatok výkonu na hovorené slovo)',
      '1x Sada 2 bezdrôtových mikrofónov the t.bone free solo Twin HT',
      '2x Trojnožka na reproduktory',
      '2x Stojan na mikrofón',
      '4x RGBWA UV Led Par svetlá (pre interiér) alebo bez svetiel'
    ]
  },
  {
    id: 'party-mini',
    name: 'BALÍK 2: Párty MINI (Chata / Oslava)',
    price: 110,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    description: 'Zameranie: Menšie narodeninové oslavy, DJ párty na chate do 30 ľudí, kde sa vyžaduje dynamický basový základ.',
    components: [
      '1x Mixážny pult Behringer Xenyx 802',
      '1x Reproduktory Behringer B112D',
      '1x Subwoofer Behringer B1500XP (15" aktívny sub)',
      '1x Teleskopická tyč na reproduktory',
      '1x Samostatný káblový mikrofón',
      '1x Svetelný set BeamZ Party Bar, 2x Červeno-zelený Laser, 1x Dymostroj'
    ]
  },
  {
    id: 'oslava-mini',
    name: 'BALÍK 3: Oslava MINI',
    price: 140,
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
    ]
  },
  {
    id: 'oslava-medium',
    name: 'BALÍK 4: Oslava MEDIUM',
    price: 180,
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
    ]
  },
  {
    id: 'klub-medium',
    name: 'BALÍK 5: Klub MEDIUM',
    price: 220,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    description: 'Zameranie: Klubové noci, stužkové, disko párty pre 100 ľudí. Dôraz na masívne basy a rotujúce dynamické lúče.',
    components: [
      '1x Mixážny pult Behringer Xenyx X1222 USB',
      '2x Reproduktory Behringer B112D',
      '2x Subwoofer The Box Pro DSP 18 Sub',
      '2x Teleskopická stojanová tyč',
      '1x Sada 2 mikrofónov the t.bone free solo Twin HT',
      '1x BeamZ SUSHI-DS, 4x Rotujúca Beam hlava, 6x RGBWA UV Par, 2x RGBW Led Bar, 1x Holografický Laser, 2x Červeno-zelený Laser, 2x Dymostroj, 1x Osvetľovacia konštrukcia'
    ]
  },
  {
    id: 'premium-max',
    name: 'BALÍK 6: PREMIUM MAX',
    price: 250,
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
    ]
  },
  {
    id: 'klub-maximal',
    name: 'BALÍK 7: Klub MAXIMAL',
    price: 380,
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
    ]
  },
  {
    id: 'open-air-arena',
    name: 'BALÍK 8: Open-Air ARENA',
    price: 480,
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
      
      {/* SEKCIA 1: HOTOVÉ SETY */}
      <section id="sety" className="py-20 bg-[#020721]/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Bez starostí</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Naša ponuka balíkov
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Vyberte si jeden z našich overených a vyvážených setov, ktoré sme zostavili na základe stoviek úspešných akcií.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {presetPackages.map((pkg, index) => {
              return (
                <ScrollReveal key={pkg.id} direction="up" delay={index * 0.15}>
                  <Card 
                    className="relative overflow-hidden bg-[#0e122b]/80 border border-white/10 rounded-3xl flex flex-col hover:border-[#BD20D3]/50 hover:shadow-[0_0_30px_rgba(189,32,211,0.1)] hover:-translate-y-2 transition-all duration-300 group h-full"
                    onClick={() => handleOpenBooking(pkg)}
                  >
                    {index === 2 && (
                      <span className="absolute top-4 right-4 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full z-10 shadow-lg">
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
                      <p className="text-gray-400 text-sm line-clamp-2 mt-2">
                        {pkg.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 px-6 pb-6 pt-0">
                      <div className="border-t border-white/5 pt-4 space-y-2.5">
                        <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Komponenty v sete:</p>
                        {pkg.components.map((comp, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                            <Check size={14} className="text-[#BD20D3] shrink-0 mt-0.5" />
                            <span>{comp}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0">
                      <Button 
                        onClick={() => handleOpenBooking(pkg)}
                        className="w-full btn-cyber rounded-xl h-12 border-none font-bold text-sm"
                      >
                        Nezáväzne rezervovať set
                      </Button>
                    </CardFooter>
                  </Card>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      {/* SEKCIA 2: SAMOSTATNÉ POLOŽKY */}
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
                <span className="text-[10px]-[10px] text-gray-400 font-bold uppercase tracking-wider block">Vybraný balík:</span>
                <span className="font-bold text-white text-base block mt-0.5">{selectedPackage.name}</span>
                <span className="text-[#BD20D3] font-bold text-lg mt-1 block">{selectedPackage.price} € / deň s DPH</span>
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
                    onChange={(e) => setBookingForm(p => ({ ...p => ({ ...p, phone: e.target.value }))}
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