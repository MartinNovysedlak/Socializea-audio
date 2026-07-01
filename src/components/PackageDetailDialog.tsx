"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Wrench,
  ShoppingBag,
  Search,
  Loader2,
  Minus,
  Euro,
  MapPin,
  Truck,
  Navigation
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

interface AdditionalProduct {
  id: string;
  label: string;
  quantity: number;
  pricePerDay: number;
}

interface RentalItem {
  id: string;
  name: string;
  image: string;
  category?: string;
  availableCount: number;
  price: number | null;
}

// Približné súradnice výdajných miest
const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

// Približné hraničné body Kysúc (polygón)
const KYSUCE_BOUNDS = [
  { lat: 49.520, lng: 18.550 }, // severozápad (Makov)
  { lat: 49.500, lng: 19.050 }, // severovýchod (Oravská Lesná)
  { lat: 49.350, lng: 19.050 }, // východ
  { lat: 49.250, lng: 18.800 }, // juhovýchod
  { lat: 49.280, lng: 18.600 }, // juhozápad
];

// Mestá SK/CZ s približnými súradnicami
const CITIES: { name: string; country: 'sk' | 'cz'; lat: number; lng: number }[] = [
  { name: 'Bratislava', country: 'sk', lat: 48.1486, lng: 17.1077 },
  { name: 'Košice', country: 'sk', lat: 48.7170, lng: 21.2497 },
  { name: 'Prešov', country: 'sk', lat: 48.9980, lng: 21.2393 },
  { name: 'Banská Bystrica', country: 'sk', lat: 48.7395, lng: 19.1530 },
  { name: 'Nitra', country: 'sk', lat: 48.3069, lng: 18.0864 },
  { name: 'Trnava', country: 'sk', lat: 48.3774, lng: 17.5883 },
  { name: 'Martin', country: 'sk', lat: 49.0639, lng: 18.9229 },
  { name: 'Trenčín', country: 'sk', lat: 48.8945, lng: 18.0441 },
  { name: 'Poprad', country: 'sk', lat: 49.0505, lng: 20.2973 },
  { name: 'Prievidza', country: 'sk', lat: 48.7742, lng: 18.6245 },
  { name: 'Zvolen', country: 'sk', lat: 48.5750, lng: 19.1283 },
  { name: 'Liptovský Mikuláš', country: 'sk', lat: 49.0813, lng: 19.6185 },
  { name: 'Michalovce', country: 'sk', lat: 48.7557, lng: 21.9184 },
  { name: 'Spišská Nová Ves', country: 'sk', lat: 48.9446, lng: 20.5613 },
  { name: 'Ružomberok', country: 'sk', lat: 49.0746, lng: 19.3076 },
  { name: 'Považská Bystrica', country: 'sk', lat: 49.1158, lng: 18.4465 },
  { name: 'Kysucké Nové Mesto', country: 'sk', lat: 49.3015, lng: 18.7859 },
  { name: 'Turzovka', country: 'sk', lat: 49.4043, lng: 18.6226 },
  { name: 'Krásno nad Kysucou', country: 'sk', lat: 49.3958, lng: 18.8340 },
  { name: 'Bytča', country: 'sk', lat: 49.2237, lng: 18.5585 },
  { name: 'Ostrava', country: 'cz', lat: 49.8209, lng: 18.2625 },
  { name: 'Praha', country: 'cz', lat: 50.0755, lng: 14.4378 },
  { name: 'Brno', country: 'cz', lat: 49.1951, lng: 16.6068 },
  { name: 'Olomouc', country: 'cz', lat: 49.5938, lng: 17.2509 },
  { name: 'Zlín', country: 'cz', lat: 49.2266, lng: 17.6668 },
  { name: 'Frýdek-Místek', country: 'cz', lat: 49.6819, lng: 18.3673 },
  { name: 'Havířov', country: 'cz', lat: 49.7801, lng: 18.4372 },
  { name: 'Opava', country: 'cz', lat: 49.9407, lng: 17.8946 },
  { name: 'Třinec', country: 'cz', lat: 49.6776, lng: 18.6706 },
  { name: 'Český Těšín', country: 'cz', lat: 49.7460, lng: 18.6261 },
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

interface CityMatch {
  name: string;
  country: string;
}

function searchCities(query: string): CityMatch[] {
  if (!query.trim() || query.trim().length < 2) return [];
  const lower = query.toLowerCase().trim();
  return CITIES
    .filter(c => c.name.toLowerCase().includes(lower))
    .slice(0, 6)
    .map(c => ({ name: c.name, country: c.country }));
}

function getCityCoords(cityName: string): { lat: number; lng: number } | null {
  const city = CITIES.find(c => c.name.toLowerCase() === cityName.toLowerCase());
  return city ? { lat: city.lat, lng: city.lng } : null;
}

function calculateDelivery(cityName: string): { 
  distance: number; 
  nearestPoint: string; 
  isKysuce: boolean; 
  isFree: boolean; 
  price: number;
} | null {
  const coords = getCityCoords(cityName);
  if (!coords) return null;

  // Skontroluj, či je mesto priamo na Kysuciach
  const isKysuce = isPointInPolygon(coords, KYSUCE_BOUNDS);
  if (isKysuce) {
    return { distance: 0, nearestPoint: 'Kysuce', isKysuce: true, isFree: true, price: 0 };
  }

  // Nájdi najbližšie výdajné miesto
  let minDist = Infinity;
  let nearestPoint = '';
  for (const point of PICKUP_POINTS) {
    const dist = haversineDistance(coords.lat, coords.lng, point.lat, point.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestPoint = point.name;
    }
  }

  // Do 10 km od výdajného miesta = zadarmo
  const isFree = minDist <= 10;
  const price = isFree ? 0 : Math.round((minDist - 10) * 0.70 * 100) / 100;

  return { distance: Math.round(minDist * 10) / 10, nearestPoint, isKysuce: false, isFree, price };
}

const CUSTOM_ITEM_DEFAULT_PRICE = 0;

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: PackageOption | null;
}

function extractBaseNameAndCount(spec: string): { name: string; count: number } {
  const match = spec.match(/^(\d+)\s*(x|ks|kus)\s+/i);
  if (match) return { name: spec.replace(match[0], '').trim(), count: parseInt(match[1], 10) };
  const simpleMatch = spec.match(/^(\d+)\s+/);
  if (simpleMatch) return { name: spec.replace(simpleMatch[0], '').trim(), count: parseInt(simpleMatch[1], 10) };
  return { name: spec.trim(), count: 1 };
}

function getPackageUsedCounts(pkg: PackageOption): Record<string, number> {
  const map: Record<string, number> = {};
  const allSpecs = [...pkg.soundSpecs, ...pkg.lightSpecs, ...(pkg.otherSpecs || [])];
  for (const spec of allSpecs) {
    const { name, count } = extractBaseNameAndCount(spec);
    const key = name.trim();
    map[key] = (map[key] || 0) + count;
  }
  return map;
}

function getUsedInPackageForDbItem(dbItemName: string, packageUsedCounts: Record<string, number>): number {
  const dbLower = dbItemName.toLowerCase().trim();
  let totalUsed = 0;
  for (const [pkgItemName, count] of Object.entries(packageUsedCounts)) {
    const pkgLower = pkgItemName.toLowerCase().trim();
    if (dbLower.includes(pkgLower) || pkgLower.includes(dbLower)) totalUsed += count;
  }
  return totalUsed;
}

const PackageDetailDialog = ({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Delivery state
  const [deliveryCity, setDeliveryCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityMatch[]>([]);
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof calculateDelivery>>(null);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  const [additionalProducts, setAdditionalProducts] = useState<AdditionalProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [filteredItems, setFilteredItems] = useState<RentalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  const [packageUsedCounts, setPackageUsedCounts] = useState<Record<string, number>>({});

  React.useEffect(() => {
    if (open && selectedPackage) {
      setIncludeLights(true);
      setShowBookingForm(false);
      setBookingForm({ name: '', phone: '', email: '', date: '', message: '' });
      setDeliveryCity('');
      setCitySuggestions([]);
      setDeliveryResult(null);
      setDeliverySelected(false);
      setAdditionalProducts([]);
      setSearchTerm('');
      setSelectedItem(null);
      setItemQuantity(1);
      setPackageUsedCounts(getPackageUsedCounts(selectedPackage));
    }
  }, [open, selectedPackage]);

  useEffect(() => {
    if (!open) return;
    const fetchItems = async () => {
      setLoadingItems(true);
      setDbError(false);
      try {
        const { rentalService } = await import('@/lib/rentalService');
        const data = await rentalService.getAll();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: RentalItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
            category: item.category || '',
            availableCount: item.availableCount ?? 1,
            price: item.price ?? 0
          }));
          setRentalItems(mapped);
        } else {
          setRentalItems([]);
          setDbError(true);
        }
      } catch {
        setRentalItems([]);
        setDbError(true);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, [open]);

  useEffect(() => {
    if (!searchTerm.trim() || rentalItems.length === 0) {
      setFilteredItems([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = rentalItems.filter(
      item => item.name.toLowerCase().includes(lower) || (item.category && item.category.toLowerCase().includes(lower))
    );
    setFilteredItems(filtered.slice(0, 8));
  }, [searchTerm, rentalItems]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSelectedItem(null);
      }
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (deliveryCity.length >= 2) {
      setCitySuggestions(searchCities(deliveryCity));
      setCityDropdownOpen(true);
    } else {
      setCitySuggestions([]);
      setCityDropdownOpen(false);
    }
  }, [deliveryCity]);

  const selectCity = (cityName: string) => {
    setDeliveryCity(cityName);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const result = calculateDelivery(cityName);
    setDeliveryResult(result);
    if (result) {
      setDeliverySelected(true);
      if (result.isFree) {
        toast.success(`Doprava do ${cityName} je zadarmo! (${result.nearestPoint})`);
      } else {
        toast.info(`Doprava do ${cityName}: ${result.price.toFixed(2)} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
      }
    }
  };

  const clearDelivery = () => {
    setDeliveryCity('');
    setDeliveryResult(null);
    setDeliverySelected(false);
  };

  const toggleDelivery = () => {
    if (deliverySelected) {
      clearDelivery();
    }
  };

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && citySuggestions.length > 0) {
      e.preventDefault();
      selectCity(citySuggestions[0].name);
    }
  };

  const addCustomProduct = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setAdditionalProducts(prev => [...prev, { 
      id: crypto.randomUUID(), 
      label: `1 x ${trimmed}`, 
      quantity: 1,
      pricePerDay: CUSTOM_ITEM_DEFAULT_PRICE
    }]);
    setSearchTerm('');
    setSearchOpen(false);
  };

  const getAvailableForItem = (dbItemName: string, dbAvailable: number): number => {
    const usedInPackage = getUsedInPackageForDbItem(dbItemName, packageUsedCounts);
    const alreadyAdded = additionalProducts
      .filter(p => {
        const labelLower = p.label.toLowerCase();
        const dbLower = dbItemName.toLowerCase();
        return labelLower.includes(dbLower) || dbLower.includes(labelLower);
      })
      .reduce((sum, p) => sum + p.quantity, 0);
    return Math.max(0, dbAvailable - usedInPackage - alreadyAdded);
  };

  const confirmRentalItem = useCallback(() => {
    if (!selectedItem) return;

    const maxAvailable = getAvailableForItem(selectedItem.name, selectedItem.availableCount);
    const usedInPkg = getUsedInPackageForDbItem(selectedItem.name, packageUsedCounts);

    if (itemQuantity > maxAvailable) {
      toast.error(`Môžete pridať maximálne ${maxAvailable} ks. ${selectedItem.availableCount} ks skladom, ${usedInPkg} ks už je v balíku.`);
      return;
    }

    const itemPrice = selectedItem.price ?? 0;

    const existingIdx = additionalProducts.findIndex(p => p.id === selectedItem.id);
    if (existingIdx !== -1) {
      const updated = [...additionalProducts];
      const currentQty = updated[existingIdx].quantity;
      const updatedPrice = itemPrice;
      const newQty = Math.min(maxAvailable, currentQty + itemQuantity);
      updated[existingIdx] = { 
        ...updated[existingIdx], 
        quantity: newQty, 
        label: `${newQty} x ${selectedItem.name}`,
        pricePerDay: updatedPrice 
      };
      setAdditionalProducts(updated);
      toast.success(`Množstvo zvýšené na ${newQty} ks (${updatedPrice} € / ks / víkend)`);
    } else {
      setAdditionalProducts(prev => [...prev, { 
        id: selectedItem.id, 
        label: `${itemQuantity} x ${selectedItem.name}`, 
        quantity: itemQuantity,
        pricePerDay: itemPrice 
      }]);
      toast.success(`Produkt pridaný (${itemQuantity} ks × ${itemPrice} € / víkend)`);
    }

    setSelectedItem(null);
    setSearchTerm('');
    setFilteredItems([]);
    setItemQuantity(1);
    searchInputRef.current?.focus();
  }, [selectedItem, itemQuantity, additionalProducts, packageUsedCounts, rentalItems]);

  const removeAdditionalProduct = (id: string) => {
    setAdditionalProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      toast.error('Prosím vyplňte povinné údaje.');
      return;
    }
    const activePackagePrice = includeLights ? selectedPackage!.priceWithLights : selectedPackage!.priceNoLights;
    const additionalProductsCost = additionalProducts.reduce((sum, p) => sum + p.pricePerDay * p.quantity, 0);
    const deliveryCost = deliveryResult?.price ?? 0;
    const totalPrice = activePackagePrice + additionalProductsCost + deliveryCost;

    toast.success('Dopyt na balík bol odoslaný!', {
      description: `Váš dopyt pre "${selectedPackage!.name}" bol zaznamenaný. Celková kalkulácia: ${totalPrice} € / víkend. Náš tím vás čoskoro osloví.`
    });
    onOpenChange(false);
  };

  const resetBack = () => setShowBookingForm(false);

  if (!selectedPackage) return null;

  const activePackagePrice = includeLights ? selectedPackage.priceWithLights : selectedPackage.priceNoLights;
  const lightsUpgradePrice = selectedPackage.priceWithLights - selectedPackage.priceNoLights;
  const additionalProductsCost = additionalProducts.reduce((sum, p) => sum + p.pricePerDay * p.quantity, 0);
  const deliveryCost = deliveryResult?.price ?? 0;
  const totalPrice = activePackagePrice + additionalProductsCost + deliveryCost;

  const hasLightSection = selectedPackage.lightSpecs.length > 0 || (selectedPackage.otherSpecs && selectedPackage.otherSpecs.length > 0);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) setShowBookingForm(false);
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

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-3xl overflow-hidden p-5">
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
                    <span className="text-xs text-gray-400 uppercase font-bold block">Cena na víkend:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#BD20D3] font-extrabold text-3xl">{totalPrice} €</span>
                      <span className="text-gray-400 text-xs">/ víkend</span>
                    </div>
                    {includeLights && (
                      <p className="text-emerald-400 text-xs mt-1">
                        Ušetríte {(selectedPackage.priceNoLights + selectedPackage.priceWithLights) - activePackagePrice} € oproti objednaniu zvlášť
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#BD20D3] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
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
                        : 'bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className={includeLights ? "text-[#BD20D3]" : "text-gray-400"} size={18} />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Svetlá, efekty & show</span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          includeLights ? 'bg-[#BD20D3] text-white shadow-[0_0_10px_rgba(189,32,211,0.5)]' : 'bg-white/10 text-gray-400 border border-white/20'
                        }`}>
                          {includeLights ? <Check size={14} className="stroke-[3]" /> : <Plus size={14} className="stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                        {includeLights ? 'Svetelná show je pridaná a zahŕňa tieto položky:' : `Pridať svetelnú show a efekty? (+${lightsUpgradePrice} €)`}
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

              {/* DOPRAVA - NOVÁ SEKCIA */}
              <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A4BFF] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
                  <Truck size={16} /> Doprava a odber
                </span>

                <div className="relative" ref={cityRef}>
                  <div className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-black/20 border-white/5 hover:border-white/20"
                    onClick={() => {
                      if (!deliverySelected) {
                        const input = document.getElementById('city-input') as HTMLInputElement;
                        input?.focus();
                      }
                    }}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                      deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'
                    }`}>
                      {deliverySelected && <Check size={12} className="text-white stroke-[3]" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500 shrink-0" />
                        <Input
                          id="city-input"
                          type="text"
                          value={deliveryCity}
                          onChange={(e) => {
                            setDeliveryCity(e.target.value);
                            setDeliverySelected(false);
                            setDeliveryResult(null);
                          }}
                          onKeyDown={handleCityKeyDown}
                          onFocus={() => { if (deliveryCity.length >= 2) setCityDropdownOpen(true); }}
                          placeholder="Napíšte názov mesta (SK/CZ)..."
                          className="bg-transparent border-0 text-white text-xs h-auto p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                        />
                      </div>
                      
                      {deliveryResult && deliverySelected && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            deliveryResult.isFree 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                          }`}>
                            {deliveryResult.isFree ? '✓ Doprava ZDARMA' : `Doprava: ${deliveryResult.price.toFixed(2)} €`}
                          </span>
                          {!deliveryResult.isFree && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Navigation size={10} />
                              {deliveryResult.distance} km od {deliveryResult.nearestPoint}
                            </span>
                          )}
                          {deliveryResult.isKysuce && (
                            <span className="text-[10px] text-gray-500">(Kysuce – zadarmo)</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {deliverySelected && (
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); clearDelivery(); }}
                          className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all"
                        >
                          <X size={10} />
                        </button>
                      )}
                      <span className={`text-xs font-bold ${deliverySelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>
                        {deliverySelected ? deliveryCost === 0 ? 'Zdarma' : `+${deliveryCost.toFixed(2)} €` : 'Vybrať'}
                      </span>
                    </div>
                  </div>

                  {cityDropdownOpen && citySuggestions.length > 0 && !deliverySelected && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                      {citySuggestions.map((city, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectCity(city.name)}
                          className="flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 hover:bg-[#1A4BFF]/5 cursor-pointer"
                        >
                          <MapPin size={13} className="text-gray-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{city.name}</p>
                          </div>
                          <span className="text-[9px] text-gray-500 uppercase">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Osobný odber v Žiline alebo Čadci je zadarmo. Doprava do 10 km od výdajných miest a po celých Kysuciach je bezplatná. Nad 10 km účtujeme 0,70 € / km.
                </p>
              </div>

              {/* ĎALŠIE PRODUKTY */}
              <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300 flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
                  <ShoppingBag size={16} className="text-[#1A4BFF]" /> Ďalšie produkty (voliteľné)
                </span>

                <div className="relative" ref={searchRef}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); setSelectedItem(null); }}
                        onFocus={() => setSearchOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (selectedItem) confirmRentalItem();
                            else if (filteredItems.length > 0) setSelectedItem(filteredItems[0]);
                            else if (searchTerm.trim()) addCustomProduct();
                          }
                        }}
                        placeholder="Hľadať v databáze alebo napísať vlastnú položku..."
                        className="bg-black/40 border-white/[0.12] text-white rounded-xl h-10 pl-9 text-xs placeholder:text-gray-500 focus:border-[#1A4BFF]/50 focus:ring-[#1A4BFF]/20"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (selectedItem) confirmRentalItem();
                        else if (searchTerm.trim()) addCustomProduct();
                      }}
                      disabled={!searchTerm.trim()}
                      className="bg-[#1A4BFF]/15 hover:bg-[#1A4BFF]/30 border border-[#1A4BFF]/25 text-white rounded-xl h-10 px-3 text-xs disabled:opacity-30 transition-all"
                    >
                      <Plus size={14} className="mr-1" /> Pridať
                    </Button>
                  </div>

                  {searchOpen && searchTerm.trim() && (
                    <>
                      {loadingItems && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-3 text-center z-50">
                          <Loader2 size={14} className="mx-auto mb-1 text-[#1A4BFF] animate-spin" />
                          <p className="text-[10px] text-gray-500">Hľadám...</p>
                        </div>
                      )}
                      {!loadingItems && dbError && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-3 text-center z-50">
                          <p className="text-[10px] text-gray-500">Databáza nie je dostupná – môžete pridať vlastnú položku.</p>
                        </div>
                      )}
                      {!loadingItems && !dbError && filteredItems.length > 0 && !selectedItem && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                          {filteredItems.map((item) => {
                            const remaining = getAvailableForItem(item.name, item.availableCount);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  if (remaining <= 0) {
                                    toast.error(`Pre položku "${item.name}" nie sú k dispozícii ďalšie kusy.`);
                                    return;
                                  }
                                  setSelectedItem(item);
                                  setItemQuantity(1);
                                }}
                                className={`flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 ${
                                  remaining > 0 ? 'hover:bg-[#1A4BFF]/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                                }`}
                              >
                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-white truncate">{item.name}</p>
                                  {item.category && <p className="text-[9px] text-gray-500 uppercase tracking-wider">{item.category}</p>}
                                </div>
                                {item.price != null && (
                                  <span className="text-[9px] text-gray-400 shrink-0 mr-2">{item.price} €</span>
                                )}
                                <div className={`text-[9px] mr-2 shrink-0 ${remaining > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {remaining > 0 ? `${remaining} ks` : 'Vypredané'}
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                  remaining > 0 ? 'border-white/20 hover:bg-[#1A4BFF]/20 hover:border-[#1A4BFF]/40' : 'border-red-500/30 bg-red-500/10'
                                }`}>
                                  <Plus size={10} className={remaining > 0 ? "text-white" : "text-red-400"} />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {!loadingItems && !dbError && selectedItem && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-[#1A4BFF]/30 rounded-xl p-3 shadow-2xl z-50">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-white/10">
                              <img src={selectedItem.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-bold text-white truncate flex-1">{selectedItem.name}</p>
                            {selectedItem.price != null && (
                              <span className="text-[10px] text-gray-300 font-bold">{selectedItem.price} € / ks / víkend</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/[0.08] rounded-xl p-2">
                            <span className="text-[10px] text-gray-400 uppercase shrink-0">Počet:</span>
                            <div className="flex items-center gap-1.5">
                              <button type="button" onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-white font-bold text-sm">{itemQuantity}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const maxAvailable = getAvailableForItem(selectedItem.name, selectedItem.availableCount);
                                  setItemQuantity(Math.min(maxAvailable, itemQuantity + 1));
                                }}
                                disabled={itemQuantity >= getAvailableForItem(selectedItem.name, selectedItem.availableCount)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1">
                            {(() => {
                              const maxAvailable = getAvailableForItem(selectedItem.name, selectedItem.availableCount);
                              const usedInPkg = getUsedInPackageForDbItem(selectedItem.name, packageUsedCounts);
                              return `Maximálne ${maxAvailable} ks (${usedInPkg} ks už v balíku) – cena: ${(selectedItem.price ?? 0) * itemQuantity} € / víkend`;
                            })()}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedItem(null); setItemQuantity(1); }} className="text-[10px] text-gray-400 hover:text-white h-8 flex-1">Zrušiť</Button>
                            <Button type="button" size="sm" onClick={confirmRentalItem} className="bg-[#1A4BFF]/15 hover:bg-[#1A4BFF]/30 border border-[#1A4BFF]/25 text-white rounded-lg h-8 flex-1 text-[10px] font-semibold transition-all">
                              <ShoppingBag size={12} className="mr-1" />
                              Pridať {itemQuantity} ks
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {additionalProducts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {additionalProducts.map(product => (
                      <div key={product.id} className="flex items-center gap-1.5 bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 rounded-full pl-3 pr-1.5 py-1">
                        <span className="text-[11px] text-white truncate max-w-[180px]">{product.label}</span>
                        {product.pricePerDay > 0 && (
                          <span className="text-[9px] text-[#1A4BFF] font-bold">({product.pricePerDay} €/ks)</span>
                        )}
                        <button type="button" onClick={() => removeAdditionalProduct(product.id)} className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center">
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ============ SÚHRN CIEN ============ */}
              <div className="bg-gradient-to-br from-[#020721] to-[#0a0d1f] border border-[#BD20D3]/20 rounded-2xl p-5 space-y-2 shadow-[0_0_20px_rgba(189,32,211,0.05)]">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300 pb-1 flex items-center gap-1.5">
                  <Euro size={14} className="text-[#BD20D3]" /> Súhrn cien
                </span>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Balík ({includeLights ? 'so svetlami' : 'bez svetiel'}):</span>
                  <span className="text-white font-semibold">{activePackagePrice} € / víkend</span>
                </div>
                
                {deliverySelected && deliveryResult && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Doprava ({deliveryCity}):</span>
                    <span className={deliveryResult.isFree ? 'text-emerald-400 font-semibold' : 'text-[#1A4BFF] font-semibold'}>
                      {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price.toFixed(2)} €`}
                    </span>
                  </div>
                )}
                
                {additionalProducts.length > 0 && (
                  <>
                    <div className="border-t border-white/[0.06] pt-2 mt-2 space-y-1.5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Pridané produkty:</p>
                      {additionalProducts.map(p => {
                        const itemCost = p.pricePerDay * p.quantity;
                        return (
                          <div key={p.id} className="flex justify-between text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <Plus size={10} className="text-[#1A4BFF]" />
                              <span>{p.label.replace(/^\d+\s*x\s*/, '')} × {p.quantity}</span>
                            </span>
                            <span className="text-white font-medium">{itemCost.toFixed(2)} € / víkend</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between text-xs text-gray-400 border-t border-white/[0.06] pt-1">
                        <span className="text-[#1A4BFF] font-semibold">Medzisúčet produktov:</span>
                        <span className="text-[#1A4BFF] font-bold">{additionalProductsCost.toFixed(2)} € / víkend</span>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between items-center border-t border-[#BD20D3]/20 pt-2 mt-2">
                  <span className="text-sm font-bold text-white">Celková cena na víkend:</span>
                  <span className="text-[#BD20D3] text-xl font-extrabold">{totalPrice.toFixed(2)} €</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 flex-1">Zavrieť</Button>
                <Button onClick={() => setShowBookingForm(true)} className="btn-cyber rounded-xl h-12 flex-1 border-none font-bold">Nezáväzne rezervovať</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div className="space-y-2 text-center border-b border-white/5 pb-4">
                <h3 className="text-lg md:text-xl font-bold text-white">Rezervácia: {selectedPackage.name}</h3>
                <p className="text-xs text-gray-400">
                  Celková cena: {totalPrice.toFixed(2)} € / víkend ({includeLights ? 'so svetelnou show' : 'bez svetiel'})
                </p>
                {deliverySelected && deliveryResult && (
                  <p className="text-xs text-[#1A4BFF]">
                    Doprava do {deliveryCity}: {deliveryResult.isFree ? 'Zdarma' : `${deliveryResult.price.toFixed(2)} €`}
                  </p>
                )}
                {additionalProducts.length > 0 && (
                  <p className="text-xs text-[#BD20D3]">+ {additionalProducts.reduce((sum, p) => sum + p.quantity, 0)} ks produktov navyše ({additionalProductsCost.toFixed(2)} € / víkend)</p>
                )}
                <p className="text-xs text-gray-400">Ponuku vám vypracujeme a pošleme obratom na e-mail.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5"><User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *</Label>
                  <Input required placeholder="Ján Novák" value={bookingForm.name} onChange={(e) => setBookingForm(p => ({ ...p, name: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5"><Mail size={12} className="text-[#BD20D3]" /> E-mail *</Label>
                  <Input type="email" required placeholder="jan.novak@example.sk" value={bookingForm.email} onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5"><Phone size={12} className="text-[#BD20D3]" /> Telefón</Label>
                  <Input type="tel" placeholder="+421 900 123 456" value={bookingForm.phone} onChange={(e) => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5"><Calendar size={12} className="text-[#BD20D3]" /> Dátum odberu *</Label>
                  <Input type="date" required value={bookingForm.date} onChange={(e) => setBookingForm(p => ({ ...p, date: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs font-bold uppercase">Poznámka / Doprava</Label>
                <Textarea placeholder="Špecifické požiadavky, miesto konania akcie…" value={bookingForm.message} onChange={(e) => setBookingForm(p => ({ ...p, message: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={resetBack} className="text-xs text-gray-400 hover:text-white h-11">Späť</Button>
                <Button type="submit" className="btn-cyber rounded-xl h-11 flex-grow border-none font-bold">Odoslať rezervačný dopyt</Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailDialog;