"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  X, Check, ShoppingBag, Volume2, Lightbulb, Layers, Wrench, MapPin,
  Navigation, Plus, Minus, Loader2, AlertTriangle, Sparkles, HelpCircle,
  ChevronRight, Euro, Ban
} from 'lucide-react';
import { toast } from 'sonner';
import MapPicker from './MapPicker';

export interface PackageOption {
  id: string;
  name: string;
  priceNoLights: number;
  priceWithLights: number;
  image: string;
  description?: string;
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
  postcode?: string; district?: string; distToNearest?: number; nearestPoint?: string;
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
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
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
  const [additionalProducts, setAdditionalProducts] = useState<
    { id: string; label: string; quantity: number; pricePerDay: number; max: number }[]
  >([]);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedCitySearch = useDebounce(deliveryCity, 400);

  const installPrice = installSelected ? 20 : installUninstallSelected ? 40 : 0;

  const getInstallType = (install: boolean, uninstall: boolean): 'none' | 'install' | 'install_uninstall' => {
    if (uninstall) return 'install_uninstall';
    if (install) return 'install';
    return 'none';
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (open && selectedPackage) {
      setIncludeLights(true);
      setInstallSelected(false);
      setInstallUninstallSelected(false);
      setDeliverySelected(false);
      setDeliveryCity('');
      setDeliveryCoords(null);
      setDeliveryResult(null);
      setCityLocked(false);
      setCitySuggestions([]);
      setCityDropdownOpen(false);
      setAdditionalProducts([]);
      setMapPickerOpen(false);
    }
  }, [open, selectedPackage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search cities
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
            const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
            const nearest = getNearestPoint(coords);
            const address = item.address || {};
            return {
              name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch,
              country: (item.country_code === 'cz' || (address.country || '').toLowerCase().includes('czech')) ? 'cz' : 'sk',
              lat: coords.lat, lng: coords.lng, postcode: address.postcode || '', district: address.city_district || address.county || '',
              distToNearest: nearest.distance, nearestPoint: nearest.name,
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

  // Delivery price is for cart calculation
  const activePackagePrice = includeLights ? selectedPackage?.priceWithLights ?? 0 : selectedPackage?.priceNoLights ?? 0;
  const deliveryPrice = deliveryResult?.price ?? 0;

  const selectCity = (cityName: string, lat: number, lng: number) => {
    setDeliveryCity(cityName);
    setDeliveryCoords({ lat, lng });
    setCityLocked(true);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, cityName);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`);
      else toast.info(`Doprava do ${cityName}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
    }
  };

  const clearDelivery = () => {
    setDeliveryCity('');
    setDeliveryCoords(null);
    setDeliveryResult(null);
    setDeliverySelected(false);
    setCityLocked(false);
    setCitySuggestions([]);
    setCityDropdownOpen(false);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && citySuggestions.length > 0) {
      e.preventDefault();
      selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng);
    }
    if (e.key === 'Escape') setCityDropdownOpen(false);
  };

  const handleMapLocationSelect = (lat: number, lng: number, name: string) => {
    setDeliveryCity(name);
    setDeliveryCoords({ lat, lng });
    setCityLocked(true);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, name);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) toast.success(`Doprava do ${name} je zadarmo!`);
      else toast.info(`Doprava do ${name}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
    }
  };

  const handleAddToCart = () => {
    if (!selectedPackage) return;
    const pkg = {
      id: crypto.randomUUID(),
      name: selectedPackage.name,
      price: activePackagePrice,
      hasLights: includeLights,
      image: selectedPackage.image,
      arrival: deliverySelected && deliveryCity && deliveryCoords
        ? { name: deliveryCity, lat: deliveryCoords.lat, lng: deliveryCoords.lng }
        : null,
      install: getInstallType(installSelected, installUninstallSelected),
      installPrice,
      deliveryPrice,
      extras: additionalProducts.map(p => ({
        id: p.id,
        label: p.label,
        quantity: p.quantity,
        pricePerDay: p.pricePerDay,
      })),
    };
    window.dispatchEvent(new CustomEvent('add-package-to-cart', { detail: pkg }));
    onOpenChange(false);
  };

  const allSpecs = [
    ...(selectedPackage?.soundSpecs || []),
    ...(includeLights ? (selectedPackage?.lightSpecs || []) : []),
    ...(selectedPackage?.otherSpecs || []),
  ];

  const toggleDelivery = () => {
    if (deliverySelected) clearDelivery();
    else {
      setDeliverySelected(true);
      requestAnimationFrame(() => {
        const input = document.getElementById('pkg-city-input');
        if (input) input.focus();
      });
    }
  };

  if (!selectedPackage) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-4xl rounded-3xl shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh] p-0 custom-scrollbar">
          <div className="p-4 md:p-6 lg:p-8">
            <DialogHeader className="border-b border-white/10 pb-4 mb-6">
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                <Sparkles className="text-[#BD20D3]" size={20} />
                {selectedPackage.name}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Left – Product Details */}
              <div className="lg:col-span-3 space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';
                    }}
                  />
                </div>

                {selectedPackage.description && (
                  <div className="p-4 bg-white/3 border border-white/5 rounded-2xl">
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedPackage.description}</p>
                  </div>
                )}

                <Card className="bg-black/30 border border-white/10 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Layers size={16} className="text-[#BD20D3]" />
                      Obsah balíka
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 space-y-4">
                    {selectedPackage.soundSpecs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                          <Volume2 size={13} /> Zvuk
                        </div>
                        <ul className="space-y-1.5">
                          {selectedPackage.soundSpecs.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <Check size={12} className="text-[#BD20D3] shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {includeLights && selectedPackage.lightSpecs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                          <Lightbulb size={13} /> Svetlá a efekty
                        </div>
                        <ul className="space-y-1.5">
                          {selectedPackage.lightSpecs.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <Check size={12} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedPackage.otherSpecs && selectedPackage.otherSpecs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                          <Layers size={13} /> Ostatné
                        </div>
                        <ul className="space-y-1.5">
                          {selectedPackage.otherSpecs.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                              <Check size={12} className="text-purple-400 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {allSpecs.length === 0 && (
                      <p className="text-xs text-gray-500 italic">Zatiaľ neboli pridané konkrétne položky.</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right – Pricing & Options */}
              <div className="lg:col-span-2 space-y-5">
                {/* Price toggle */}
                <div className="bg-gradient-to-br from-[#BD20D3]/10 to-[#1A4BFF]/10 border border-[#BD20D3]/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cena balíka</span>
                    <Badge className="bg-[#BD20D3]/20 border border-[#BD20D3]/40 text-[#BD20D3] text-[11px] uppercase tracking-wider">
                      {includeLights ? 'So svetlami' : 'Bez svetiel'}
                    </Badge>
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#BD20D3]">
                    {activePackagePrice} € <span className="text-gray-400 text-xs font-normal">/ víkend (2 noci)</span>
                  </div>

                  <button
                    onClick={() => setIncludeLights(!includeLights)}
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${includeLights ? 'bg-[#BD20D3] border-[#BD20D3]' : 'border-gray-500'}`}>
                        {includeLights && <Check size={12} className="text-white stroke-[3]" />}
                      </div>
                      <span className="text-sm text-gray-300">Zahrnúť svetlá a efekty</span>
                    </div>
                    <span className="text-xs font-bold text-[#BD20D3]">
                      +{selectedPackage.priceWithLights - selectedPackage.priceNoLights} €
                    </span>
                  </button>
                </div>

                {/* Additional services */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Wrench size={14} /> Voliteľné služby
                  </h4>

                  <button
                    onClick={() => { setInstallSelected(!installSelected); if (!installSelected) setInstallUninstallSelected(false); }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      installSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-white/5 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${installSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                        {installSelected && <Check size={10} className="text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs text-gray-300">Inštalácia</span>
                    </div>
                    <span className="text-xs font-bold text-[#1A4BFF]">+20 €</span>
                  </button>

                  <button
                    onClick={() => { setInstallUninstallSelected(!installUninstallSelected); if (!installUninstallSelected) setInstallSelected(false); }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      installUninstallSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-white/5 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${installUninstallSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                        {installUninstallSelected && <Check size={10} className="text-white stroke-[3]" />}
                      </div>
                      <span className="text-xs text-gray-300">Inštalácia a deinštalácia</span>
                    </div>
                    <span className="text-xs font-bold text-[#1A4BFF]">+40 €</span>
                  </button>

                  <div className="border-t border-white/10 pt-3" ref={cityRef}>
                    <button
                      onClick={toggleDelivery}
                      className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                          {deliverySelected && <Check size={10} className="text-white stroke-[3]" />}
                        </div>
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-300">Doprava na miesto</span>
                      </div>
                      {deliveryResult && (
                        <span className={`text-xs font-bold ${deliveryResult.isFree ? 'text-emerald-400' : 'text-[#1A4BFF]'}`}>
                          {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}
                        </span>
                      )}
                      {!deliveryResult && <span className="text-xs text-gray-500">Vybrať</span>}
                    </button>

                    {deliverySelected && (
                      <div className="mt-2 space-y-2">
                        <div className="relative">
                          <Input
                            id="pkg-city-input"
                            type="text"
                            value={deliveryCity}
                            onChange={(e) => { setDeliveryCity(e.target.value); setDeliveryCoords(null); setDeliveryResult(null); setCityLocked(false); }}
                            onKeyDown={handleCityKeyDown}
                            onFocus={() => { if (deliveryCity.length >= 2 && !cityLocked && citySuggestions.length > 0) setCityDropdownOpen(true); }}
                            placeholder="Mesto odberu (SK/CZ)..."
                            readOnly={cityLocked}
                            className="bg-black/40 border-white/10 text-white rounded-xl h-10 text-sm"
                          />
                          {cityLocked && (
                            <button onClick={clearDelivery} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all">
                              <X size={10} />
                            </button>
                          )}
                        </div>

                        {/* City suggestions dropdown */}
                        {cityDropdownOpen && citySuggestions.length > 0 && !cityLocked && (
                          <div className="bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-40 overflow-y-auto">
                            {searchingCities && (
                              <div className="flex items-center justify-center gap-2 p-2 text-gray-500">
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-[11px]">Vyhľadávam...</span>
                              </div>
                            )}
                            {citySuggestions.map((city, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => selectCity(city.name, city.lat, city.lng)}
                                className="flex items-center gap-2 w-full p-2.5 hover:bg-[#1A4BFF]/5 text-left border-b border-white/[0.04] last:border-b-0 transition-colors"
                              >
                                <MapPin size={12} className="text-gray-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-white truncate">{city.name}</p>
                                </div>
                                <span className="text-[10px] text-gray-500">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Map picker button */}
                        <button
                          type="button"
                          onClick={() => setMapPickerOpen(true)}
                          className="flex items-center gap-2 text-xs text-[#1A4BFF] hover:text-[#1A4BFF]/80 transition-colors py-1.5 px-3 rounded-lg bg-[#1A4BFF]/5 hover:bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 w-full justify-center"
                        >
                          <MapPin size={14} />
                          Vybrať na mape
                        </button>

                        {deliveryResult && (
                          <div className="flex items-center gap-3 text-[10px] text-gray-400">
                            <Navigation size={10} />
                            <span>{deliveryResult.distance} km od {deliveryResult.nearestPoint}</span>
                            <span className={`font-bold px-2 py-0.5 rounded-full ${deliveryResult.isFree ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                              {deliveryResult.isFree ? 'Doprava ZDARMA' : `${deliveryResult.price} €`}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                      Osobný odber v Žiline alebo Čadci: zadarmo. Doprava do 10 km od výdajných miest a po celých Kysuciach: bezplatná. Nad 10 km: 0,70 € / km.
                    </p>
                  </div>
                </div>

                {/* Warning */}
                {selectedPackage.warning && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 leading-relaxed">{selectedPackage.warning}</p>
                  </div>
                )}

                {/* Total & Add to cart */}
                <div className="bg-gradient-to-br from-[#BD20D3]/10 to-[#1A4BFF]/10 border border-[#BD20D3]/30 rounded-2xl p-5 space-y-3">
                  <div className="text-sm text-gray-400 flex justify-between">
                    <span>Balík</span>
                    <span className="text-white font-semibold">{activePackagePrice} €</span>
                  </div>
                  {(installSelected || installUninstallSelected) && (
                    <div className="text-sm text-gray-400 flex justify-between">
                      <span>{installUninstallSelected ? 'Inštalácia + deinštalácia' : 'Inštalácia'}</span>
                      <span className="text-white font-semibold">+{installPrice} €</span>
                    </div>
                  )}
                  {deliveryResult && (
                    <div className="text-sm text-gray-400 flex justify-between">
                      <span>Doprava ({deliveryCity})</span>
                      <span className={deliveryResult.isFree ? 'text-emerald-400 font-semibold' : 'text-white font-semibold'}>
                        {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-[#BD20D3]/30 pt-3 mt-3 flex justify-between items-center">
                    <span className="text-white font-bold">Spolu</span>
                    <span className="text-[#BD20D3] font-extrabold text-xl">
                      {activePackagePrice + installPrice + deliveryPrice} €
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 text-center border-t border-white/10 pt-2 mt-1">
                    * Cena je za víkend (2 noci). Pri dlhšom prenájme sa účtuje príplatok.
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full btn-cyber h-14 rounded-xl font-bold border-none text-base shadow-[0_0_20px_rgba(189,32,211,0.3)] hover:shadow-[0_0_30px_rgba(189,32,211,0.5)]"
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Pridať do košíka
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MapPicker
        open={mapPickerOpen}
        onOpenChange={setMapPickerOpen}
        onLocationSelect={handleMapLocationSelect}
      />
    </>
  );
};

export default PackageDetailDialog;