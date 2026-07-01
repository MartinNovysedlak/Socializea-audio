"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Volume2, 
  Lightbulb, 
  Check, 
  HelpCircle,
  Plus,
  User,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export interface PackageOption {
  id: string;
  name: string;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  description: string;
  soundSpecs: string[];
  lightSpecs: string[];
  otherSpecs?: string[];
  warning?: string;
}

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: PackageOption | null;
}

const PackageDetailDialog = ({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  // Reset state when dialog opens/closes or package changes
  React.useEffect(() => {
    if (open && selectedPackage) {
      setIncludeLights(true);
      setShowBookingForm(false);
      setBookingForm({ name: '', phone: '', email: '', date: '', message: '' });
    }
  }, [open, selectedPackage]);

  if (!selectedPackage) return null;

  const activePrice = includeLights ? selectedPackage.priceWithLights : selectedPackage.priceNoLights;
  const lightsUpgradePrice = selectedPackage.priceWithLights - selectedPackage.priceNoLights;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      toast.error('Prosím vyplňte povinné údaje.');
      return;
    }

    toast.success('Dopyt na balík bol odoslaný!', {
      description: `Váš dopyt pre "${selectedPackage.name}" (${includeLights ? 'so svetlami' : 'bez svetiel'} - ${activePrice} €/deň) bol zaznamenaný. Náš tím vás čoskoro osloví.`
    });
    onOpenChange(false);
  };

  const resetBack = () => {
    setShowBookingForm(false);
  };

  const LIGHT_SPECS = [...(selectedPackage.lightSpecs || []), ...(selectedPackage.otherSpecs || [])];
  const hasLightSection = selectedPackage.lightSpecs.length > 0 || (selectedPackage.otherSpecs && selectedPackage.otherSpecs.length > 0);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setShowBookingForm(false);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <DialogHeader className="border-b border-white/5 pb-4 mb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
            <Package className="text-[#BD20D3]" />
            Detail balíka
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showBookingForm ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 border-b border-white/5 pb-4">
                <h3 className="text-xl md:text-2xl font-bold text-white">{selectedPackage.name}</h3>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{selectedPackage.description}</p>
              </div>

              {selectedPackage.warning && (
                <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
                  <HelpCircle className="shrink-0 mt-0.5 text-amber-400" size={18} />
                  <p className="leading-relaxed">{selectedPackage.warning}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-5">
                <div className="md:col-span-4 aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                  <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <h4 className="text-xl font-bold text-white">{selectedPackage.name}</h4>
                      <span className={`text-[10px] border px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider ${
                        includeLights ? 'bg-[#BD20D3]/20 border-[#BD20D3]/50' : 'bg-white/10 border-white/20'
                      }`}>
                        {includeLights ? 'SO SVETLAMI' : 'BEZ SVETIEL'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-400 uppercase font-bold block">Cena za deň s DPH:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#BD20D3] font-extrabold text-3xl">
                        {activePrice} €
                      </span>
                      <span className="text-gray-400">/ deň</span>
                    </div>
                    {includeLights && (
                      <p className="text-emerald-400 text-xs mt-1">
                        Ušetríte {(selectedPackage.priceNoLights + selectedPackage.priceWithLights) - activePrice} € oproti objednaniu zvlášť
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#BD20D3] flex items-center gap-1.5 pb-2 border-b border-white/10">
                    <Volume2 size={16} /> Zvuková technika
                  </span>
                  <ul className="space-y-2">
                    {selectedPackage.soundSpecs.map((spec, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                        <Check className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {hasLightSection && (
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
                          : `Pridať svetelnú show a efekty? (+${lightsUpgradePrice} € / deň)`}
                      </p>

                      <ul className="space-y-2">
                        {selectedPackage.lightSpecs.map((spec, i) => (
                          <li key={i} className={`text-xs flex items-start gap-2 ${includeLights ? 'text-gray-300' : 'text-gray-500 line-through opacity-50'}`}>
                            <Check className={includeLights ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={12} />
                            <span>{spec}</span>
                          </li>
                        ))}
                        {selectedPackage.otherSpecs?.map((spec, i) => (
                          <li key={i} className={`text-xs flex items-start gap-2 ${includeLights ? 'text-gray-300' : 'text-gray-500 line-through opacity-50'}`}>
                            <Check className={includeLights ? 'text-cyan-400 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={12} />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 flex-1">
                  Zavrieť
                </Button>
                <Button onClick={() => setShowBookingForm(true)} className="btn-cyber rounded-xl h-12 flex-1 border-none font-bold">
                  Nezáväzne rezervovať
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="space-y-2 text-center border-b border-white/5 pb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">Rezervácia: {selectedPackage.name}</h3>
                <p className="text-xs text-gray-400">
                  Cena: {activePrice} €/deň ({includeLights ? 'so svetelnou show' : 'bez svetiel'})
                </p>
                <p className="text-xs text-gray-400">Ponuku vám vypracujeme a pošleme obratom na e-mail.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *
                  </Label>
                  <Input
                    required
                    placeholder="Ján Novák"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Mail size={12} className="text-[#BD20D3]" /> E-mail *
                  </Label>
                  <Input
                    type="email"
                    required
                    placeholder="jan.novak@example.sk"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Phone size={12} className="text-[#BD20D3]" /> Telefón
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+421 900 123 456"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#BD20D3]" /> Dátum odberu *
                  </Label>
                  <Input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(p => ({ ...p, date: e.target.value }))}
                    className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs font-bold uppercase">Poznámka / Doprava</Label>
                <Textarea
                  placeholder="Mám záujem o dopravu a montáž / špecifické požiadavky / miesto konania..."
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))}
                  className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={resetBack} className="text-xs text-gray-400 hover:text-white h-11">
                  Späť
                </Button>
                <Button type="submit" className="btn-cyber rounded-xl h-11 flex-grow border-none font-bold">
                  Odoslať rezervačný dopyt
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailDialog;