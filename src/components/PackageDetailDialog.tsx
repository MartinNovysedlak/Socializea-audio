"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  MapPin,
  Wrench,
  Lightbulb,
  ShoppingBag,
  AlertTriangle,
  Loader2,
  Search,
  Navigation,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lng: number;
  postcode?: string;
  district?: string;
}

const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getNearestPoint(coords: { lat: number; lng: number }): { name: string; distance: number } {
  let minDist = Infinity;
  let nearest = '';
  for (const point of PICKUP_POINTS) {
    const dist = haversineDistance(coords.lat, coords.lng, point.lat, point.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = point.name;
    }
  }
  return { name: nearest, distance: Math.round(minDist * 10) / 10 };
}

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: PackageOption | null;
}

export default function PackageDetailDialog({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) {
  const [withLights, setWithLights] = useState(true);
  const [installType, setInstallType] = useState<'none' | 'install' | 'install_uninstall'>('none');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [cityLocked, setCityLocked] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [searchingCities, setSearchingCities] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nearestPoint, setNearestPoint] = useState('');
  const cityRef = useRef<HTMLDivElement>(null);
  const [extras, setExtras] = useState<{ id: string; label: string; quantity: number; pricePerDay: number }[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setWithLights(true);
      setInstallType('none');
      setDeliveryCity('');
      setCityLocked(false);
      setDeliverySelected(false);
      setDeliveryPrice(0);
      setExtras([]);
      setCitySuggestions([]);
      setCityDropdownOpen(false);
      setDistance(0);
      setNearestPoint('');
    }
  }, [open]);

  const price = selectedPackage ? (withLights ? selectedPackage.priceWithLights : selectedPackage.priceNoLights) : 0;
  const installPrice = installType === 'install' ? 20 : installType === 'install_uninstall' ? 40 : 0;

  const handleAddToCart = () => {
    if (!selectedPackage) return;
    if (deliverySelected && !cityLocked) {
      toast.error('Prosím vyberte konkrétne mesto zo zoznamu.');
      return;
    }
    window.dispatchEvent(new CustomEvent('add-package-to-cart', {
      detail: {
        id: selectedPackage.id + (withLights ? '-lights' : '') + Date.now(),
        name: selectedPackage.name,
        price,
        hasLights: withLights,
        image: selectedPackage.image,
        arrival: deliverySelected ? { name: deliveryCity } : null,
        install: installType,
        installPrice,
        deliveryPrice,
        extras,
      }
    }));
    onOpenChange(false);
  };

  const clearDelivery = () => {
    setDeliveryCity('');
    setDeliverySelected(false);
    setCityLocked(false);
    setDeliveryPrice(0);
    setCitySuggestions([]);
    setCityDropdownOpen(false);
  };

  const selectCity = (cityName: string, lat: number, lng: number) => {
    setDeliveryCity(cityName);
    setCityLocked(true);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const nearest = getNearestPoint({ lat, lng });
    setNearestPoint(nearest.name);
    setDistance(nearest.distance);
    const isFree = nearest.distance <= 10;
    const price = isFree ? 0 : Math.round((nearest.distance - 10) * 0.70);
    setDeliveryPrice(price);
    if (isFree) toast.success(`Doprava do ${cityName} je zadarmo!`);
    else toast.info(`Doprava do ${cityName}: ${price} € (~${nearest.distance} km od ${nearest.name})`);
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeliveryCity(val);
    setCityLocked(false);
    setDeliveryPrice(0);
    if (val.trim().length < 2) {
      setCitySuggestions([]);
      setCityDropdownOpen(false);
      return;
    }
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(async () => {
      setSearchingCities(true);
      try {
        const query = encodeURIComponent(val.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=8&accept-language=sk&q=${query}`;
        const res = await fetch(url, { headers: { 'User-Agent': 'DjPartyRental/1.0 (djparty@example.com)' } });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data && Array.isArray(data)) {
          const mapped: CitySuggestion[] = data
            .map((item: any) => ({
              name: item.display_name?.split(',')[0] || item.name || val,
              country: item.country_code === 'cz' ? 'cz' : 'sk',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              postcode: item.address?.postcode || '',
              district: item.address?.city_district || item.address?.county || item.address?.state_district || item.address?.municipality || '',
            }))
            .filter((c: CitySuggestion, idx: number, arr: CitySuggestion[]) => {
              const key = c.name.toLowerCase();
              return arr.findIndex(x => x.name.toLowerCase() === key) === idx;
            });
          setCitySuggestions(mapped);
          setCityDropdownOpen(mapped.length > 0);
        } else {
          setCitySuggestions([]);
          setCityDropdownOpen(false);
        }
      } catch {
        setCitySuggestions([]);
        setCityDropdownOpen(false);
      } finally {
        setSearchingCities(false);
      }
    }, 400);
    setSearchTimeout(timeout);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!selectedPackage) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <DialogHeader className="border-b border-white/5 pb-4 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <DialogTitle className="text-xl md:text-2xl font-bold text-white">{selectedPackage.name}</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                {selectedPackage.description}
              </DialogDescription>
            </div>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white shrink-0"><X size={24} /></button>
          </div>
        </DialogHeader>

        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 mb-6 bg-black/30">
          <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {selectedPackage.soundSpecs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5"><span className="text-cyan-400">●</span> Zvuková technika</p>
              <ul className="space-y-1">
                {selectedPackage.soundSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300"><Check size={12} className="text-cyan-400 shrink-0 mt-0.5" />{spec}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedPackage.lightSpecs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5"><span className="text-amber-400">●</span> Svetlá a efekty</p>
              <ul className="space-y-1">
                {selectedPackage.lightSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300"><Check size={12} className="text-amber-400 shrink-0 mt-0.5" />{spec}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedPackage.otherSpecs && selectedPackage.otherSpecs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5"><span className="text-purple-400">●</span> Ostatné</p>
              <ul className="space-y-1">
                {selectedPackage.otherSpecs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300"><Check size={12} className="text-purple-400 shrink-0 mt-0.5" />{spec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedPackage.warning && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 mb-6">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-amber-300 leading-relaxed">{selectedPackage.warning}</p>
          </div>
        )}

        <div className="border-t border-white/10 pt-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-gray-400 text-sm font-semibold">Svetelná technika</Label>
            <div className="flex gap-3">
              <button
                onClick={() => setWithLights(false)}
                className={`flex-1 p-4 rounded-2xl border transition-all ${!withLights ? 'bg-[#BD20D3]/10 border-[#BD20D3]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <p className="text-white font-semibold text-sm">Iba zvuk</p>
                <p className="text-[#BD20D3] font-bold text-lg mt-1">{selectedPackage.priceNoLights} €</p>
              </button>
              <button
                onClick={() => setWithLights(true)}
                className={`flex-1 p-4 rounded-2xl border transition-all ${withLights ? 'bg-[#BD20D3]/10 border-[#BD20D3]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <p className="text-white font-semibold text-sm">So svetlami</p>
                <p className="text-[#BD20D3] font-bold text-lg mt-1">{selectedPackage.priceWithLights} €</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-400 text-sm font-semibold flex items-center gap-1.5"><Wrench size={16} /> Profesionálna inštalácia</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setInstallType(prev => prev === 'install' ? 'none' : 'install')}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${installType === 'install' ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installType === 'install' ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {installType === 'install' && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Inštalácia</p>
                    <p className="text-[10px] text-gray-400">Montáž + zapojenie</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1A4BFF]">+20 €</span>
              </button>
              <button
                onClick={() => setInstallType(prev => prev === 'install_uninstall' ? 'none' : 'install_uninstall')}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${installType === 'install_uninstall' ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installType === 'install_uninstall' ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {installType === 'install_uninstall' && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">Inštalácia + deinštalácia</p>
                    <p className="text-[10px] text-gray-400">Kompletný servis</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1A4BFF]">+40 €</span>
              </button>
            </div>
          </div>

          <div className="space-y-3" ref={cityRef}>
            <Label className="text-gray-400 text-sm font-semibold flex items-center gap-1.5"><MapPin size={16} /> Doprava a osobné prevzatie</Label>
            <div className="relative">
              <div
                onClick={() => { if (!deliverySelected) { setDeliverySelected(true); setTimeout(() => { const input = document.getElementById('package-city-input'); if (input) input.focus(); }, 100); } }}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${deliverySelected ? cityLocked ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-[#1A4BFF]/10 border-[#1A4BFF]/30' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${deliverySelected && cityLocked ? 'bg-emerald-500 border-emerald-500' : deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                  {deliverySelected && cityLocked && <Check size={12} className="text-white stroke-[3]" />}
                </div>
                <MapPin size={16} className={`shrink-0 ${deliverySelected && cityLocked ? 'text-emerald-400' : deliverySelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  {deliverySelected ? (
                    <input
                      id="package-city-input"
                      type="text"
                      value={deliveryCity}
                      onChange={handleCityInputChange}
                      onFocus={() => { if (citySuggestions.length > 0 && !cityLocked) setCityDropdownOpen(true); }}
                      placeholder="Zadajte mesto odberu (SK/CZ)..."
                      readOnly={cityLocked}
                      className="bg-transparent border-0 text-white text-xs h-auto px-0 focus:outline-none w-full placeholder:text-gray-500"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Vybrať miesto doručenia alebo osobného odberu</span>
                  )}
                </div>
                <div className="shrink-0">
                  {deliverySelected && cityLocked ? (
                    <span className={`text-xs font-bold ${deliveryPrice === 0 ? 'text-emerald-400' : 'text-[#1A4BFF]'}`}>
                      {deliveryPrice === 0 ? 'Zdarma' : `+${deliveryPrice} €`}
                    </span>
                  ) : deliverySelected ? (
                    <Search size={14} className="text-gray-400 animate-pulse" />
                  ) : (
                    <span className="text-xs text-gray-500">+ ? €</span>
                  )}
                </div>
                {deliverySelected && (cityLocked || deliveryCity) && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); clearDelivery(); }} className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all shrink-0"><X size={10} /></button>
                )}
              </div>

              {cityDropdownOpen && citySuggestions.length > 0 && !cityLocked && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {searchingCities && (
                    <div className="flex items-center justify-center gap-2 p-3 border-b border-white/[0.06] text-gray-500">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs">Vyhľadávam...</span>
                    </div>
                  )}
                  {citySuggestions.map((city, i) => {
                    const nearest = getNearestPoint({ lat: city.lat, lng: city.lng });
                    return (
                      <button key={i} type="button" onClick={() => selectCity(city.name, city.lat, city.lng)} className="flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 hover:bg-[#1A4BFF]/5 cursor-pointer">
                        <MapPin size={13} className="text-gray-500 shrink-0 self-start mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{city.name}</p>
                          <span className="text-[11px] text-gray-500/70 leading-tight block mt-0.5">
                            {[city.postcode, city.district].filter(Boolean).join(', ')}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] text-gray-500 uppercase block">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                          {nearest.distance > 0 ? (
                            <span className="text-[10px] text-gray-600 mt-0.5 block whitespace-nowrap">~{nearest.distance} km od {nearest.name}</span>
                          ) : (
                            <span className="text-[10px] text-emerald-500/60 mt-0.5 block">v mieste odberu</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {deliverySelected && cityLocked && (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${deliveryPrice === 0 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                    {deliveryPrice === 0 ? '✓ Doprava ZDARMA' : `${deliveryPrice} €`}
                  </span>
                  {deliveryPrice > 0 && <span className="text-gray-400 flex items-center gap-1"><Navigation size={10} /> {distance} km od {nearestPoint}</span>}
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">Osobný odber v Žiline alebo Čadci je zadarmo. Doprava do 10 km od výdajných miest je bezplatná. Nad 10 km účtujeme 0,70 € / km.</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Balík na víkend:</p>
              <p className="text-white text-xs text-gray-500">
                {withLights ? 'So svetlami' : 'Iba zvuk'}
                {installPrice > 0 && ` + inštalácia (${installPrice} €)`}
                {deliverySelected && cityLocked && ` + doprava (${deliveryPrice} €)`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-[#BD20D3]">{price + installPrice + deliveryPrice} €</p>
              <p className="text-[10px] text-gray-500">/ víkend</p>
            </div>
          </div>
          <Button onClick={handleAddToCart} className="w-full btn-cyber h-14 rounded-xl text-base font-bold border-none">
            <ShoppingBag size={18} className="mr-2" /> Pridať do košíka
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}