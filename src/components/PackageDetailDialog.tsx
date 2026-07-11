"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Package, Volume2, Lightbulb, Check, HelpCircle, X, Wrench,
  ShoppingBag, Loader2, MapPin, Navigation, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import MapPicker from './MapPicker';

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

const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

const KYSUCE_BOUNDS = [
  { lat: 49.520, lng: 18.550 }, { lat: 49.500, lng: 19.050 },
  { lat: 49.350, lng: 19.050 }, { lat: 49.250, lng: 18.800 },
  { lat: 49.280, lng: 18.600 },
];

interface CityMatch {
  name: string; country: string; lat: number; lng: number;
  postcode?: string; district?: string;
}

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

function isPointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function calculateDelivery(coords: { lat: number; lng: number }, cityName: string): {
  distance: number; nearestPoint: string; isKysuce: boolean; isFree: boolean; price: number;
} | null {
  const isKysuce = isPointInPolygon(coords, KYSUCE_BOUNDS);
  if (isKysuce) return { distance: 0, nearestPoint: 'Kysuce', isKysuce: true, isFree: true, price: 0 };
  let minDist = Infinity;
  let nearestPoint = '';
  for (const point of PICKUP_POINTS) {
    const dist = haversineDistance(coords.lat, coords.lng, point.lat, point.lng);
    if (dist < minDist) { minDist = dist; nearestPoint = point.name; }
  }
  const isFree = minDist <= 10;
  const price = isFree ? 0 : Math.round((minDist - 10) * 0.70);
  return { distance: Math.round(minDist * 10) / 10, nearestPoint, isKysuce: false, isFree, price };
}

function getNearestPoint(coords: { lat: number; lng: number }): { name: string; distance: number } {
  let minDist = Infinity;
  let nearest = '';
  for (const point of PICKUP_POINTS) {
    const dist = haversineDistance(coords.lat, coords.lng, point.lat, point.lng);
    if (dist < minDist) { minDist = dist; nearest = point.name; }
  }
  return { name: nearest, distance: Math.round(minDist * 10) / 10 };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => { const timer = setTimeout(() => setDebouncedValue(value), delay); return () => clearTimeout(timer); }, [value, delay]);
  return debouncedValue;
}

async function geocodeCity(cityName: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = encodeURIComponent(cityName.trim());
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=sk,cz&limit=1&accept-language=sk`,
      { headers: { 'User-Agent': 'Socializea/1.0' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch { return null; }
}

const PackageDetailDialog = ({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [installSelected, setInstallSelected] = useState(false);
  const [installUninstallSelected, setInstallUninstallSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityMatch[]>([]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [cityLocked, setCityLocked] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof calculateDelivery>>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedCitySearch = useDebounce(deliveryCity, 400);

  const installPrice = installSelected ? 20 : installUninstallSelected ? 40 : 0;
  const activePackagePrice = includeLights ? (selectedPackage?.priceWithLights ?? 0) : (selectedPackage?.priceNoLights ?? 0);
  const deliveryPrice = deliveryResult?.price ?? 0;

  const getInstallType = (install: boolean, uninstall: boolean): 'none' | 'install' | 'install_uninstall' => {
    if (uninstall) return 'install_uninstall';
    if (install) return 'install';
    return 'none';
  };

  useEffect(() => {
    if (open && selectedPackage) {
      setIncludeLights(true);
      setInstallSelected(false);
      setInstallUninstallSelected(false);
      setDeliverySelected(false);
      setDeliveryCity(''); setDeliveryCoords(null); setDeliveryResult(null);
      setCityLocked(false); setCitySuggestions([]); setCityDropdownOpen(false);
      setMapPickerOpen(false); setSending(false);
    }
  }, [open, selectedPackage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setCityDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!deliverySelected || !debouncedCitySearch.trim() || debouncedCitySearch.trim().length < 2 || cityLocked) {
      setCitySuggestions([]); setCityDropdownOpen(false); setSearchingCities(false); return;
    }
    let cancelled = false;
    const search = async () => {
      setSearchingCities(true);
      try {
        const query = encodeURIComponent(debouncedCitySearch.trim());
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=6&accept-language=sk&q=${query}`,
          { headers: { 'User-Agent': 'DjPartyRental/1.0' } }
        );
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) {
          const mapped: CityMatch[] = data.map((item: any) => {
            const address = item.address || {};
            const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
            const nearest = getNearestPoint(coords);
            return {
              name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch,
              country: (item.country_code === 'cz' || (address.country || '').toLowerCase().includes('czech')) ? 'cz' : 'sk',
              lat: coords.lat, lng: coords.lng, postcode: address.postcode || '', district: address.city_district || address.county || '',
            };
          });
          const seen = new Set<string>();
          const unique = mapped.filter(c => { const key = c.name.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
          setCitySuggestions(unique); setCityDropdownOpen(unique.length > 0);
        }
      } catch { if (!cancelled) { setCitySuggestions([]); setCityDropdownOpen(false); } }
      finally { if (!cancelled) setSearchingCities(false); }
    };
    search();
    return () => { cancelled = true; };
  }, [debouncedCitySearch, deliverySelected, cityLocked]);

  const selectCity = (cityName: string, lat: number, lng: number) => {
    setDeliveryCity(cityName); setDeliveryCoords({ lat, lng }); setCityLocked(true);
    setCityDropdownOpen(false); setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, cityName);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`);
      else toast.info(`Doprava do ${cityName}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
    }
  };

  const clearDelivery = () => {
    setDeliveryCity(''); setDeliveryCoords(null); setDeliveryResult(null);
    setDeliverySelected(false); setCityLocked(false); setCitySuggestions([]); setCityDropdownOpen(false);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (citySuggestions.length > 0) {
        selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng);
      } else if (deliveryCity.trim()) {
        setCityLocked(true); setDeliveryResult(null); setCityDropdownOpen(false); setDeliveryCoords(null);
      }
    }
    if (e.key === 'Escape') setCityDropdownOpen(false);
  };

  const handleMapLocationSelect = (lat: number, lng: number, name: string) => {
    setDeliveryCity(name); setDeliveryCoords({ lat, lng }); setCityLocked(true);
    setCityDropdownOpen(false); setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, name);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) toast.success(`Doprava do ${name} je zadarmo!`);
      else toast.info(`Doprava do ${name}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
    }
  };

  const toggleDelivery = () => {
    if (deliverySelected) clearDelivery();
    else { setDeliverySelected(true); requestAnimationFrame(() => { const input = document.getElementById('pkg-city-input'); if (input) input.focus(); }); }
  };

  const handleAddToCart = async () => {
    if (!selectedPackage) return;
    setSending(true);

    let finalCoords = deliveryCoords;
    if (deliverySelected && !finalCoords && deliveryCity.trim()) {
      const result = await geocodeCity(deliveryCity);
      if (result) finalCoords = result;
    }

    const pkg = {
      id: crypto.randomUUID(),
      name: selectedPackage.name,
      price: activePackagePrice,
      hasLights: includeLights,
      image: selectedPackage.image,
      arrival: deliverySelected && deliveryCity && finalCoords
        ? { name: deliveryCity, lat: finalCoords.lat, lng: finalCoords.lng }
        : null,
      install: getInstallType(installSelected, installUninstallSelected),
      installPrice,
      deliveryPrice,
      extras: [],
    };
    window.dispatchEvent(new CustomEvent('add-package-to-cart', { detail: pkg }));
    onOpenChange(false);
    setSending(false);
  };

  if (!selectedPackage) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <DialogHeader className="border-b border-white/5 pb-4 mb-4">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
              <Package className="text-[#BD20D3]" />
              Detail balíka
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedPackage.warning && (
              <div className="flex gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm">
                <HelpCircle className="shrink-0 mt-0.5 text-amber-400" size={18} />
                <p className="leading-relaxed">{selectedPackage.warning}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-3xl overflow-hidden p-5">
              <div className="md:col-span-4">
                <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5">
                  <img src={selectedPackage.image} alt={selectedPackage.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <h4 className="text-xl sm:text-2xl font-bold text-white">{selectedPackage.name}</h4>
                    <span className={`text-[10px] border px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider ${includeLights ? 'bg-[#BD20D3]/20 border-[#BD20D3]/50' : 'bg-white/10 border-white/20'}`}>
                      {includeLights ? 'SO SVETLAMI' : 'BEZ SVETIEL'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed mt-2">{selectedPackage.description}</p>
                </div>
                <div className="pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-400 uppercase font-bold block">Cena na víkend (2 noci):</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#BD20D3] font-extrabold text-2xl sm:text-3xl whitespace-nowrap">{activePackagePrice + installPrice + deliveryPrice} €</span>
                    <span className="text-gray-400 text-xs whitespace-nowrap">/ víkend (2 noci)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A4BFF] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
                <Wrench size={16} /> Voliteľné služby
              </span>

              <button onClick={() => { setInstallSelected(!installSelected); if (!installSelected) setInstallUninstallSelected(false); }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${installSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {installSelected && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Inštalácia</span>
                </div>
                <span className={`text-xs font-bold ${installSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>+20 €</span>
              </button>

              <button onClick={() => { setInstallUninstallSelected(!installUninstallSelected); if (!installUninstallSelected) setInstallSelected(false); }}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${installUninstallSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installUninstallSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {installUninstallSelected && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">Inštalácia a deinštalácia</span>
                </div>
                <span className={`text-xs font-bold ${installUninstallSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>+40 €</span>
              </button>

              <div className="border-t border-white/[0.06] pt-3 space-y-2" ref={cityRef}>
                <div onClick={toggleDelivery} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-black/20 border-white/5 hover:border-white/20">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {deliverySelected && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <MapPin size={14} className={`shrink-0 ${deliverySelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <Input id="pkg-city-input" type="text" value={deliveryCity}
                      onChange={(e) => { setDeliveryCity(e.target.value); setDeliveryCoords(null); setDeliveryResult(null); setCityLocked(false); }}
                      onKeyDown={handleCityKeyDown}
                      onFocus={() => { if (deliveryCity.length >= 2 && deliverySelected && !cityLocked && citySuggestions.length > 0) setCityDropdownOpen(true); }}
                      placeholder="Mesto odberu (SK/CZ)..." readOnly={!deliverySelected}
                      className="bg-transparent border-0 text-white text-xs h-auto px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500" />
                  </div>
                  <div className="shrink-0 min-w-[70px] text-right">
                    {deliverySelected && deliveryResult ? (
                      <span className={`text-xs font-bold ${deliveryResult.isFree ? 'text-emerald-400' : 'text-[#1A4BFF]'}`}>
                        {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}
                      </span>
                    ) : <span className="text-xs text-gray-500">Vybrať</span>}
                  </div>
                  {deliverySelected && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); clearDelivery(); }}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all shrink-0">
                      <X size={10} />
                    </button>
                  )}
                </div>

                {deliverySelected && cityDropdownOpen && citySuggestions.length > 0 && !cityLocked && (
                  <div className="mt-0.5 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-40 overflow-y-auto">
                    {searchingCities && (
                      <div className="flex items-center justify-center gap-2 p-2 text-gray-500">
                        <Loader2 size={12} className="animate-spin" />
                        <span className="text-[11px]">Vyhľadávam...</span>
                      </div>
                    )}
                    {citySuggestions.map((city, i) => (
                      <button key={i} type="button" onClick={() => selectCity(city.name, city.lat, city.lng)}
                        className="flex items-center gap-2 w-full p-2.5 hover:bg-[#1A4BFF]/5 text-left border-b border-white/[0.04] last:border-b-0 transition-colors">
                        <MapPin size={12} className="text-gray-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{city.name}</p>
                          <span className="text-[10px] text-gray-500">{city.district}</span>
                        </div>
                        <span className="text-[10px] text-gray-500">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                      </button>
                    ))}
                  </div>
                )}

                {deliverySelected && (
                  <button type="button" onClick={() => setMapPickerOpen(true)}
                    className="flex items-center gap-2 text-xs text-[#1A4BFF] hover:text-[#1A4BFF]/80 transition-colors py-1.5 px-3 rounded-lg bg-[#1A4BFF]/5 hover:bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 w-full justify-center">
                    <MapPin size={14} /> Vybrať na mape
                  </button>
                )}

                {deliverySelected && deliveryResult && (
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <Navigation size={10} />
                    <span>{deliveryResult.distance} km od {deliveryResult.nearestPoint}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${deliveryResult.isFree ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                      {deliveryResult.isFree ? 'Doprava ZDARMA' : `${deliveryResult.price} €`}
                    </span>
                  </div>
                )}
                <p className="text-[10px] text-gray-500 leading-relaxed">Osobný odber v Žiline alebo Čadci je zadarmo. Doprava do 10 km od výdajných miest a po celých Kysuciach je bezplatná. Nad 10 km účtujeme 0,70 € / km.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#020721] to-[#0a0d1f] border border-[#BD20D3]/20 rounded-2xl p-5 space-y-2 shadow-[0_0_20px_rgba(189,32,211,0.05)]">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300 pb-1 flex items-center gap-1.5">Súhrn cien</span>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Balík ({includeLights ? 'so svetlami' : 'bez svetiel'}):</span>
                <span className="text-white font-semibold">{activePackagePrice} €</span>
              </div>
              {installSelected && <div className="flex justify-between text-xs text-gray-400"><span>Inštalácia:</span><span className="text-[#1A4BFF] font-semibold">+20 €</span></div>}
              {installUninstallSelected && <div className="flex justify-between text-xs text-gray-400"><span>Inštalácia a deinštalácia:</span><span className="text-[#1A4BFF] font-semibold">+40 €</span></div>}
              {deliveryResult && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Doprava ({deliveryCity}):</span>
                  <span className={deliveryResult.isFree ? 'text-emerald-400 font-semibold' : 'text-[#1A4BFF] font-semibold'}>
                    {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-[#BD20D3]/20 pt-2 mt-2">
                <span className="text-sm font-bold text-white">Celková cena na víkend</span>
                <span className="text-[#BD20D3] text-xl font-extrabold">{activePackagePrice + installPrice + deliveryPrice} €</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleAddToCart} disabled={sending}
                className="w-full btn-cyber rounded-xl h-14 font-bold border-none text-base shadow-[0_0_20px_rgba(189,32,211,0.3)]">
                {sending ? <><Loader2 size={18} className="mr-2 animate-spin" /> Pridávam...</>
                  : <><ShoppingBag size={18} className="mr-2" /> Pridať do košíka</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MapPicker open={mapPickerOpen} onOpenChange={setMapPickerOpen} onLocationSelect={handleMapLocationSelect} />
    </>
  );
};

export default PackageDetailDialog;