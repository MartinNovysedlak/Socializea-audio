"use client";

import React, { useState } from 'react';
import { packagesData, PackageType } from '@/data/packages';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Music, 
  PartyPopper,
  Tv,
  Calendar,
  User,
  Phone,
  Mail,
  Zap,
  BadgePercent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Prenajom = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error('Prosím vyplňte vaše meno a email.');
      return;
    }

    toast.success('Rezervačný dopyt bol úspešne odoslaný!', {
      description: `Váš dopyt pre "${selectedPackage?.name}" sme zaznamenali. Čoskoro sa vám ozveme s cenovou ponukou.`
    });
    setIsOpen(false);
    setBookingData({ name: '', phone: '', email: '', date: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white py-16 px-4 relative overflow-hidden">
      {/* Decorative background grid & blobs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#1A4BFF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1A4BFF]/10 to-[#BD20D3]/10 border border-[#BD20D3]/30 text-white text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="text-[#BD20D3] animate-pulse" size={14} />
            Skladom & Pripravené na akciu
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Ponuka Kompletných Balíkov Aparatúry
          </h1>
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
            Vyberte si jeden z našich 8 profesionálne navrhnutých balíkov techniky, ktoré optimálne vyvažujú akustický tlak, dekoratívne osvetlenie a váš rozpočet.
          </p>
        </div>

        {/* 8 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packagesData.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group flex flex-col bg-slate-950/60 border border-white/10 hover:border-[#BD20D3]/40 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(189,32,211,0.15)] hover:-translate-y-1"
            >
              {/* Image & Price Tag */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 font-black text-emerald-400 text-xl shadow-lg">
                  {pkg.price} € <span className="text-xs font-normal text-gray-400">/ dňa</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#BD20D3] transition-colors line-clamp-1">
                    {pkg.name}
                  </h3>
                  <p className="text-[#BD20D3] text-xs font-bold tracking-widest uppercase line-clamp-1">
                    {pkg.tagline}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {pkg.desc}
                  </p>
                </div>

                {/* Technical specifics list summaries */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Volume2 size={12} className="text-emerald-400" /> Zvuková aparatúra
                    </p>
                    <ul className="space-y-1">
                      {pkg.zvuk.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                      {pkg.zvuk.length > 3 && (
                        <li className="text-[10px] text-gray-500 font-semibold pl-4">
                          + ďalšie komponenty ({pkg.zvuk.length - 3}x)
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Zap size={12} className="text-[#BD20D3]" /> Svetlá & Efekty
                    </p>
                    <ul className="space-y-1">
                      {pkg.svetlo.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <Check size={12} className="text-[#BD20D3] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                      {pkg.ostatne && pkg.ostatne.slice(0, 1).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-300">
                          <Check size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Trigger */}
                <Dialog open={isOpen && selectedPackage?.id === pkg.id} onOpenChange={(open) => {
                  if (open) setSelectedPackage(pkg);
                  setIsOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setSelectedPackage(pkg)} 
                      className="w-full bg-white/5 hover:bg-gradient-to-r hover:from-[#1A4BFF] hover:to-[#BD20D3] text-white hover:border-transparent font-bold h-12 rounded-xl transition-all duration-300 border border-white/10"
                    >
                      Zobraziť detaily & Rezervovať
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh]">
                    <DialogHeader className="border-b border-white/5 pb-4 mb-4">
                      <DialogTitle className="text-xl md:text-3xl font-black text-white flex items-center gap-2">
                        <Sparkles className="text-[#BD20D3]" />
                        {selectedPackage?.name}
                      </DialogTitle>
                      <p className="text-gray-400 text-xs md:text-sm mt-1">{selectedPackage?.tagline}</p>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Package info & image */}
                      <div className="space-y-4">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/5">
                          <img src={selectedPackage?.image} alt={selectedPackage?.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Zvýhodnená cena prenájmu</p>
                          <p className="text-3xl font-black text-emerald-400">{selectedPackage?.price} € <span className="text-xs text-gray-400 font-normal">/ dňa vrátane kabeláže</span></p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedPackage?.desc}</p>
                      </div>

                      {/* Right: Technical specifications detailed */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/10 pb-1 flex items-center gap-2">
                            <Volume2 size={16} /> ZVUKOVÁ TECHNIKA
                          </h4>
                          <ul className="space-y-1.5">
                            {selectedPackage?.zvuk.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#BD20D3] uppercase tracking-widest border-b border-[#BD20D3]/10 pb-1 flex items-center gap-2">
                            <Zap size={16} /> SVETELNÁ & EFEKTOVÁ TECHNIKA
                          </h4>
                          <ul className="space-y-1.5">
                            {selectedPackage?.svetlo.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                                <Check size={14} className="text-[#BD20D3] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                            {selectedPackage?.ostatne && selectedPackage?.ostatne.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                                <Check size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Booking Form built right in details modal */}
                    <form onSubmit={handleBookingSubmit} className="space-y-5 pt-6 border-t border-white/5 mt-6">
                      <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                        <Calendar size={18} className="text-[#BD20D3]" /> Nezáväzný dopyt na balík
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase text-gray-400 font-bold flex items-center gap-1">
                            <User size={12} className="text-[#BD20D3]" /> Meno a Priezvisko *
                          </Label>
                          <Input 
                            required 
                            placeholder="Ján Novák"
                            value={bookingData.name}
                            onChange={(e) => setBookingData(p => ({ ...p, name: e.target.value }))}
                            className="bg-black/50 border-white/10 rounded-xl text-sm text-white" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase text-gray-400 font-bold flex items-center gap-1">
                            <Mail size={12} className="text-[#BD20D3]" /> E-mail *
                          </Label>
                          <Input 
                            type="email" 
                            required 
                            placeholder="jan@novak.sk" 
                            value={bookingData.email}
                            onChange={(e) => setBookingData(p => ({ ...p, email: e.target.value }))}
                            className="bg-black/50 border-white/10 rounded-xl text-sm text-white" 
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase text-gray-400 font-bold flex items-center gap-1">
                            <Phone size={12} className="text-[#BD20D3]" /> Telefón
                          </Label>
                          <Input 
                            placeholder="+421 905 123 456" 
                            value={bookingData.phone}
                            onChange={(e) => setBookingData(p => ({ ...p, phone: e.target.value }))}
                            className="bg-black/50 border-white/10 rounded-xl text-sm text-white" 
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs uppercase text-gray-400 font-bold flex items-center gap-1">
                            <Calendar size={12} className="text-[#BD20D3]" /> Dátum akcie *
                          </Label>
                          <Input 
                            type="date" 
                            required 
                            value={bookingData.date}
                            onChange={(e) => setBookingData(p => ({ ...p, date: e.target.value }))}
                            className="bg-black/50 border-white/10 rounded-xl text-sm text-white" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs uppercase text-gray-400 font-bold">Poznámka k akcii (Miesto konania, doprava, požiadavky...)</Label>
                        <Textarea 
                          placeholder="Napíšte nám viac informácií..." 
                          value={bookingData.message}
                          onChange={(e) => setBookingData(p => ({ ...p, message: e.target.value }))}
                          className="bg-black/50 border-white/10 rounded-xl text-sm text-white min-h-[70px]" 
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-11 text-gray-400 hover:text-white">
                          Zrušiť
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3] text-white hover:opacity-95 rounded-xl h-11 font-bold px-8">
                          Odoslať nezáväzný dopyt
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Prenajom;