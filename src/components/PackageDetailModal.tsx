"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Check, 
  AlertTriangle, 
  Volume2, 
  Lightbulb, 
  Plus,
  User,
  Calendar,
  Phone,
  Mail,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface PackageDetail {
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

interface PackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: PackageDetail | null;
}

const PackageDetailModal = ({ isOpen, onClose, package: pkg }: PackageDetailModalProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  if (!pkg) return null;

  const activePrice = includeLights ? pkg.priceWithLights : pkg.priceNoLights;
  const lightsUpgradePrice = pkg.priceWithLights - pkg.priceNoLights;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error('Prosím vyplňte vaše meno a email.');
      return;
    }

    const priceText = `${activePrice} € (${includeLights ? 'so svetelnou show' : 'bez svetiel'})`;

    toast.success('Rezervačný dopyt bol úspešne odoslaný!', {
      description: `Zaznamenali sme dopyt pre "${pkg.name}" v cene ${priceText}. Čoskoro vás kontaktujeme.`
    });
    onClose();
    setShowBookingForm(false);
    setBookingData({ name: '', phone: '', email: '', date: '', message: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <DialogHeader className="border-b border-white/5 pb-4 mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
            <Sparkles className="text-[#BD20D3]" />
            Detail balíka: {pkg.name}
          </DialogTitle>
        </DialogHeader>

        {!showBookingForm ? (
          <div className="space-y-6">
            {/* WARNING */}
            {pkg.warning && (
              <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
                <AlertTriangle className="shrink-0 mt-0.5 text-amber-400" size={18} />
                <p className="leading-relaxed">{pkg.warning}</p>
              </div>
            )}

            {/* HERO */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-5">
              <div className="md:col-span-4 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                    <span className={`text-[10px] border px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider ${
                      includeLights ? 'bg-[#BD20D3]/20 border-[#BD20D3]/50' : 'bg-white/10 border-white/20'
                    }`}>
                      {includeLights ? 'SO SVETLAMI' : 'BEZ SVETIEL'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs md:text-sm mt-1.5 leading-relaxed">{pkg.desc}</p>
                </div>

                {/* PRICE */}
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
                  {pkg.soundSpecs.map((spec, i) => (
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
                    {pkg.lightSpecs.map((spec, i) => (
                      <li key={i} className={`text-xs flex items-start gap-2 ${includeLights ? 'text-gray-300' : 'text-gray-500 line-through opacity-50'}`}>
                        <Check className={includeLights ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={12} />
                        <span>{spec}</span>
                      </li>
                    ))}
                    {pkg.otherSpecs && pkg.otherSpecs.map((spec, i) => (
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
              <Button variant="outline" onClick={() => { setShowBookingForm(false); setIncludeLights(true); }} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 flex-1">
                Zatvoriť
              </Button>
              <Button onClick={() => setShowBookingForm(true)} className="btn-cyber rounded-xl h-12 flex-1 border-none font-bold">
                Nezáväzne rezervovať
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-5">
            <div className="space-y-2 text-center border-b border-white/5 pb-4">
              <h3 className="text-lg md:text-xl font-bold text-white">Rezervácia: {pkg.name}</h3>
              <p className="text-xs text-gray-400">Ponuku vám vypracujeme a pošleme obratom na e-mail.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pkg-name" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                  <User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *
                </Label>
                <Input
                  id="pkg-name"
                  required
                  placeholder="Ján Novák"
                  value={bookingData.name}
                  onChange={(e) => setBookingData(p => ({ ...p, name: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
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
                  value={bookingData.email}
                  onChange={(e) => setBookingData(p => ({ ...p, email: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
              </div>
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
                  value={bookingData.phone}
                  onChange={(e) => setBookingData(p => ({ ...p, phone: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pkg-date" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#BD20D3]" /> Predbežný dátum *
                </Label>
                <Input
                  id="pkg-date"
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData(p => ({ ...p, date: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pkg-msg" className="text-gray-300 text-xs font-bold uppercase">Poznámka k objednávke</Label>
              <Textarea
                id="pkg-msg"
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
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailModal;