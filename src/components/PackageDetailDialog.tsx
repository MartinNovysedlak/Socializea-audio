"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  Volume2,
  Lightbulb,
  Check,
  HelpCircle,
  Plus,
  X,
  Wrench,
  ShoppingBag,
  Search,
  Loader2,
  Minus,
  Euro,
  MapPin,
  Navigation,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Expand,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';
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
  images?: string[];
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

interface CityMatch {
  name: string;
  country: string;
  lat: number;
  lng: number;
  postcode?: string;
  district?: string;
  distToNearest?: number;
  nearestPoint?: string;
}

const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

const KYSUCE_BOUNDS: { lat: number; lng: number }[] = [
  { lat: 49.520, lng: 18.550 },
  { lat: 49.500, lng: 19.050 },
  { lat: 49.350, lng: 19.050 },
  { lat: 49.250, lng: 18.800 },
  { lat: 49.280, lng: 18.600 },
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

function calculateDelivery(coords: { lat: number; lng: number }, cityName: string): {
  distance: number;
  nearestPoint: string;
  isKysuce: boolean;
  isFree: boolean;
  price: number;
} | null {
  const isKysuce = isPointInPolygon(coords, KYSUCE_BOUNDS);
  if (isKysuce) {
    return { distance: 0, nearestPoint: 'Kysuce', isKysuce: true, isFree: true, price: 0 };
  }

  let minDist = Infinity;
  let nearestPoint = '';
  for (const point of PICKUP_POINTS) {
    const dist = haversineDistance(coords.lat, coords.lng, point.lat, point.lng);
    if (dist < minDist) {
      minDist = dist;
      nearestPoint = point.name;
    }
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
    if (dist < minDist) {
      minDist = dist;
      nearest = point.name;
    }
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

function getInstallType(installSelected: boolean, installUninstallSelected: boolean): 'none' | 'install' | 'install_uninstall' {
  if (installUninstallSelected) return 'install_uninstall';
  if (installSelected) return 'install';
  return 'none';
}

const PackageDetailDialog = ({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [installSelected, setInstallSelected] = useState(false);
  const [installUninstallSelected, setInstallUninstallSelected] = useState(false);

  const [deliveryCity, setDeliveryCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityMatch[]>([]);
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof calculateDelivery>>(null);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [cityLocked, setCityLocked] = useState(false);

  const debouncedCitySearch = useDebounce(deliveryCity, 400);

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

  const [packageUsedCounts, setPackageUsedCounts] = useState<Record<string, number>>({});

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [questionFirstName, setQuestionFirstName] = useState("");
  const [questionLastName, setQuestionLastName] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionPhone, setQuestionPhone] = useState("");
  const [questionMessage, setQuestionMessage] = useState("");
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [showQuestionSuccess, setShowQuestionSuccess] = useState(false);

  const [mapPickerOpen, setMapPickerOpen] = useState(false);

  useEffect(() => {
    if (open && selectedPackage) {
      setIncludeLights(true);
      setInstallSelected(false);
      setInstallUninstallSelected(false);
      setDeliveryCity('');
      setCitySuggestions([]);
      setDeliveryResult(null);
      setDeliverySelected(false);
      setCityLocked(false);
      setAdditionalProducts([]);
      setSearchTerm('');
      setSelectedItem(null);
      setItemQuantity(1);
      setPackageUsedCounts(getPackageUsedCounts(selectedPackage));
      setLightboxOpen(false);
      setLightboxIndex(0);
      setQuestionDialogOpen(false);
      setQuestionFirstName("");
      setQuestionLastName("");
      setQuestionEmail("");
      setQuestionPhone("");
      setQuestionMessage("");
      setSendingQuestion(false);
      setMapPickerOpen(false);
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
            price: item.price ?? 0,
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
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        (item.category && item.category.toLowerCase().includes(lower))
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
    if (!deliverySelected || !debouncedCitySearch.trim() || debouncedCitySearch.trim().length < 2 || cityLocked) {
      setCitySuggestions([]);
      setCityDropdownOpen(false);
      setSearchingCities(false);
      return;
    }

    let cancelled = false;
    const search = async () => {
      setSearchingCities(true);
      try {
        const query = encodeURIComponent(debouncedCitySearch.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=8&accept-language=sk&q=${query}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'DjPartyRental/1.0 (djparty@example.com)',
          },
        });
        if (cancelled) return;
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (cancelled) return;
        if (data && Array.isArray(data)) {
          const mapped: CityMatch[] = data.map((item: any) => {
            const address = item.address || {};
            const district = address.city_district || address.county || address.state_district || address.municipality || '';
            const postcode = address.postcode || '';
            const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
            const nearest = getNearestPoint(coords);
            const countryCode = item.country_code || '';
            const countryName = (address.country || '').toLowerCase();
            const isCzech = countryCode === 'cz' || countryName.includes('czech') || countryName.includes('česko');
            return {
              name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch,
              country: isCzech ? 'cz' : 'sk',
              lat: coords.lat,
              lng: coords.lng,
              postcode,
              district,
              distToNearest: nearest.distance,
              nearestPoint: nearest.name,
            };
          });
          const seen = new Set<string>();
          const unique = mapped.filter(c => {
            const key = c.name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setCitySuggestions(unique);
          setCityDropdownOpen(unique.length > 0);
        } else {
          setCitySuggestions([]);
          setCityDropdownOpen(false);
        }
      } catch {
        if (!cancelled) { setCitySuggestions([]); setCityDropdownOpen(false); }
      } finally { if (!cancelled) setSearchingCities(false); }
    };
    search();
    return () => { cancelled = true; };
  }, [debouncedCitySearch, deliverySelected, cityLocked]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const images = selectedPackage?.images || (selectedPackage?.image ? [selectedPackage.image] : []);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedPackage]);

  const toggleDelivery = () => {
    if (deliverySelected) {
      clearDelivery();
    } else {
      setDeliverySelected(true);
      requestAnimationFrame(() => {
        const input = document.getElementById('city-input');
        if (input) input.focus();
      });
    }
  };

  const selectCity = (cityName: string, lat: number, lng: number) => {
    setDeliveryCity(cityName);
    setCityLocked(true);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, cityName);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) {
        toast.success(`Doprava do ${cityName} je zadarmo!`);
      } else {
        toast.info(
          `Doprava do ${cityName}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`
        );
      }
    }
  };

  const handleMapLocationSelect = (lat: number, lng: number, name: string) => {
    setDeliveryCity(name);
    setCityLocked(true);
    setCityDropdownOpen(false);
    setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, name);
    setDeliveryResult(result);
    if (result) {
      if (result.isFree) {
        toast.success(`Doprava do ${name} je zadarmo!`);
      } else {
        toast.info(
          `Doprava do ${name}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`
        );
      }
    }
  };

  const clearDelivery = () => {
    setDeliveryCity('');
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
    if (e.key === 'Escape') {
      setCityDropdownOpen(false);
    }
  };

  const addCustomProduct = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setAdditionalProducts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), label: `1 x ${trimmed}`, quantity: 1, pricePerDay: CUSTOM_ITEM_DEFAULT_PRICE },
    ]);
    setSearchTerm('');
    setSearchOpen(false);
  };

  const getAvailableForItem = (dbItemName: string, dbAvailable: number): number => {
    const usedInPackage = getUsedInPackageForDbItem(dbItemName, packageUsedCounts);
    const alreadyAdded = additionalProducts
      .filter((p) => {
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
      toast.error(
        `Môžete pridať maximálne ${maxAvailable} ks. ${selectedItem.availableCount} ks skladom, ${usedInPkg} ks už je v balíku.`
      );
      return;
    }

    const itemPrice = selectedItem.price ?? 0;

    const existingIdx = additionalProducts.findIndex((p) => p.id === selectedItem.id);
    if (existingIdx !== -1) {
      const updated = [...additionalProducts];
      const currentQty = updated[existingIdx].quantity;
      const newQty = Math.min(maxAvailable, currentQty + itemQuantity);
      updated[existingIdx] = {
        ...updated[existingIdx],
        quantity: newQty,
        label: `${newQty} x ${selectedItem.name}`,
        pricePerDay: itemPrice,
      };
      setAdditionalProducts(updated);
      toast.success(`Množstvo zvýšené na ${newQty} ks (${itemPrice} € / ks / víkend (2 noci))`);
    } else {
      setAdditionalProducts((prev) => [
        ...prev,
        { id: selectedItem.id, label: `${itemQuantity} x ${selectedItem.name}`, quantity: itemQuantity, pricePerDay: itemPrice },
      ]);
      toast.success(`Produkt pridaný (${itemQuantity} ks × ${itemPrice} € / víkend (2 noci))`);
    }

    setSelectedItem(null);
    setSearchTerm('');
    setFilteredItems([]);
    setItemQuantity(1);
    searchInputRef.current?.focus();
  }, [selectedItem, itemQuantity, additionalProducts, packageUsedCounts, rentalItems]);

  const removeAdditionalProduct = (id: string) => {
    setAdditionalProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddToCart = () => {
    if (!selectedPackage) return;
    const activePackagePrice = includeLights
      ? selectedPackage.priceWithLights
      : selectedPackage.priceNoLights;

    const installCost = installSelected ? 20 : 0;
    const installUninstallCost = installUninstallSelected ? 40 : 0;
    const installPrice = installCost + installUninstallCost;
    const deliveryPrice = deliveryResult?.price ?? 0;

    const pkg = {
      id: crypto.randomUUID(),
      name: selectedPackage.name,
      price: activePackagePrice,
      hasLights: includeLights,
      image: selectedPackage.image,
      arrival: deliverySelected && deliveryCity ? { name: deliveryCity } : null,
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

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFirstName.trim() || !questionLastName.trim() || !questionEmail.trim() || !questionMessage.trim()) {
      toast.error("Prosím vyplňte všetky povinné polia (meno, priezvisko, email a správa)!");
      return;
    }

    setSendingQuestion(true);

    try {
      const htmlContent = generateEmailHtml('package-question', {
        name: `${questionFirstName} ${questionLastName}`,
        email: questionEmail,
        phone: questionPhone || 'Neuvedený',
        date: 'Otázka k balíku',
        message: questionMessage,
        packageName: selectedPackage?.name || 'Neznámy balík',
      });

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        { message_html: htmlContent, title: 'Otázka' },
        'hlWKyd9fiWgqJJT3r'
      );

      setQuestionDialogOpen(false);
      setShowQuestionSuccess(true);

      setQuestionFirstName("");
      setQuestionLastName("");
      setQuestionEmail("");
      setQuestionPhone("");
      setQuestionMessage("");
    } catch (error) {
      console.error("EmailJS send failed:", error);
      toast.error("Odoslanie zlyhalo. Skúste to prosím neskôr.");
    } finally {
      setSendingQuestion(false);
    }
  };

  if (!selectedPackage) return null;

  const activePackagePrice = includeLights
    ? selectedPackage.priceWithLights
    : selectedPackage.priceNoLights;
  const lightsUpgradePrice = selectedPackage.priceWithLights - selectedPackage.priceNoLights;
  const additionalProductsCost = additionalProducts.reduce((sum, p) => sum + p.pricePerDay * p.quantity, 0);
  const deliveryCost = deliveryResult?.price ?? 0;
  const installCostVal = installSelected ? 20 : 0;
  const installUninstallCostVal = installUninstallSelected ? 40 : 0;
  const totalPrice = activePackagePrice + additionalProductsCost + deliveryCost + installCostVal + installUninstallCostVal;

  const hasLightSection =
    selectedPackage.lightSpecs.length > 0 ||
    (selectedPackage.otherSpecs && selectedPackage.otherSpecs.length > 0);

  const allImages: string[] = (selectedPackage.images && selectedPackage.images.length > 0)
    ? selectedPackage.images
    : selectedPackage.image
      ? [selectedPackage.image]
      : [];

  return (
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
              {allImages.length > 0 ? (
                <>
                  {/* Main clickable image */}
                  <div
                    onClick={() => {
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                    className="aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer group relative"
                  >
                    <img
                      src={allImages[0]}
                      alt={selectedPackage.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <Expand className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>
                  </div>
                  {/* Thumbnails */}
                  {allImages.length > 1 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                      {allImages.slice(0, 5).map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                          className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border transition-all hover:border-[#BD20D3]/50 ${
                            idx === lightboxIndex && lightboxOpen ? 'border-[#BD20D3]' : 'border-white/10'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {allImages.length > 5 && (
                        <button
                          type="button"
                          onClick={() => {
                            setLightboxIndex(5);
                            setLightboxOpen(true);
                          }}
                          className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-zinc-800 flex items-center justify-center text-[10px] text-gray-400 hover:text-white transition-colors"
                        >
                          +{allImages.length - 5}
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video md:aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <Package size={40} className="text-gray-600" />
                </div>
              )}
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
                  <span className="text-[#BD20D3] font-extrabold text-2xl sm:text-3xl whitespace-nowrap">{totalPrice} €</span>
                  <span className="text-gray-400 text-xs whitespace-nowrap">/ víkend (2 noci)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-gradient-to-br from-[#1A4BFF]/[0.08] to-[#BD20D3]/[0.06] border border-white/[0.12] rounded-2xl p-5 md:p-6 space-y-4">
              <span className="text-sm font-bold uppercase tracking-widest text-[#BD20D3] flex items-center gap-1.5 pb-3 border-b border-white/[0.08]">
                <Volume2 size={18} /> Zvuková technika
              </span>
              <ul className="space-y-3">
                {selectedPackage.soundSpecs.map((spec, i) => (
                  <li key={i} className="text-sm text-gray-200 flex items-start gap-2.5">
                    <Check className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                    <span className="leading-relaxed">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {hasLightSection && (
              <div
                onClick={() => setIncludeLights(!includeLights)}
                className={`p-5 md:p-6 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer select-none group relative ${
                  includeLights
                    ? 'bg-[#BD20D3]/8 border-[#BD20D3]/40 shadow-[0_0_25px_rgba(189,32,211,0.08)] hover:bg-[#e040D3]/12'
                    : 'bg-gradient-to-br from-[#1A4BFF]/[0.08] to-[#BD20D3]/[0.06] border border-white/[0.07] opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center border-b border-white/[0.08] pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <Lightbulb className={includeLights ? 'text-[#BD20D3]' : 'text-gray-400'} size={20} />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">Svetlá, efekty & show</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${includeLights ? 'bg-[#BD20D3] text-white shadow-[0_0_12px_rgba(189,32,211,0.6)]' : 'bg-white/10 text-gray-400 border border-white/20'}`}>
                      {includeLights ? <Check size={16} className="stroke-[3]" /> : <Plus size={16} className="stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    {includeLights ? 'Svetelná show je pridaná a zahŕňa tieto položky:' : `Pridať svetelnú show a efekty? (+${lightsUpgradePrice} €)`}
                  </p>
                  <ul className="space-y-3">
                    {selectedPackage.lightSpecs.map((spec, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2.5 ${includeLights ? 'text-gray-200' : 'text-gray-500 line-through opacity-50'}`}>
                        <Check className={includeLights ? 'text-emerald-500 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={14} />
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                    {selectedPackage.otherSpecs?.map((spec, i) => (
                      <li key={i} className={`text-sm flex items-start gap-2.5 ${includeLights ? 'text-gray-200' : 'text-gray-500 line-through opacity-50'}`}>
                        <Check className={includeLights ? 'text-cyan-400 shrink-0 mt-0.5' : 'text-gray-600 shrink-0 mt-0.5'} size={14} />
                        <span className="leading-relaxed">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1A4BFF] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]">
              <Wrench size={16} /> Doplnkové služby
            </span>

            <div
              onClick={() => { setInstallSelected(!installSelected); if (!installSelected) setInstallUninstallSelected(false); }}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${installSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                  {installSelected && <Check size={12} className="text-white stroke-[3]" />}
                </div>
                <span className="text-xs text-gray-300 font-medium">Inštalácia</span>
              </div>
              <span className={`text-xs font-bold ${installSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>+20 €</span>
            </div>

            <div
              onClick={() => { setInstallUninstallSelected(!installUninstallSelected); if (!installUninstallSelected) setInstallSelected(false); }}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${installUninstallSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${installUninstallSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                  {installUninstallSelected && <Check size={12} className="text-white stroke-[3]" />}
                </div>
                <span className="text-xs text-gray-300 font-medium">Inštalácia a deinštalácia</span>
              </div>
              <span className={`text-xs font-bold ${installUninstallSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>+40 €</span>
            </div>

            <div className="border-t border-white/[0.06] pt-3 space-y-2">
              <div className="relative" ref={cityRef}>
                <div
                  onClick={toggleDelivery}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-black/20 border-white/5 hover:border-white/20"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                    {deliverySelected && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                  <MapPin size={14} className={`shrink-0 ${deliverySelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <Input
                      id="city-input"
                      type="text"
                      value={deliveryCity}
                      onChange={(e) => { setDeliveryCity(e.target.value); setDeliveryResult(null); setCityLocked(false); }}
                      onKeyDown={handleCityKeyDown}
                      onFocus={() => { if (deliveryCity.length >= 2 && deliverySelected && !cityLocked && citySuggestions.length > 0) setCityDropdownOpen(true); }}
                      placeholder="Mesto odberu (SK/CZ)..."
                      readOnly={!deliverySelected}
                      className="bg-transparent border-0 text-white text-xs h-auto px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="shrink-0 min-w-[70px] text-right">
                    {deliverySelected && deliveryResult ? (
                      <span className={`text-xs font-bold ${deliveryResult.isFree ? 'text-emerald-400' : 'text-[#1A4BFF]'}`}>
                        {deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Vybrať</span>
                    )}
                  </div>
                  {deliverySelected && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); clearDelivery(); }} className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all shrink-0">
                      <X size={10} />
                    </button>
                  )}
                </div>

                {cityDropdownOpen && citySuggestions.length > 0 && deliverySelected && !cityLocked && (
                  <div className="absolute top-full left-0 right-0 mt-0.5 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-60 overflow-y-auto">
                    {searchingCities && (
                      <div className="flex items-center justify-center gap-2 p-3 border-b border-white/[0.06] text-gray-500">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="text-xs">Vyhľadávam...</span>
                      </div>
                    )}
                    {citySuggestions.map((city, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectCity(city.name, city.lat, city.lng)}
                        className="flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 hover:bg-[#1A4BFF]/5 cursor-pointer"
                      >
                        <MapPin size={13} className="text-gray-500 shrink-0 self-start mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{city.name}</p>
                          <span className="text-[11px] text-gray-500/70 leading-tight block mt-0.5">{[city.postcode, city.district].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-gray-500 uppercase block">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                          {city.distToNearest !== undefined && city.distToNearest > 0 && (
                            <span className="text-[10px] text-gray-600 mt-0.5 block whitespace-nowrap">~{city.distToNearest} km od {city.nearestPoint}</span>
                          )}
                          {city.distToNearest !== undefined && city.distToNearest <= 0 && (
                            <span className="text-[10px] text-emerald-500/60 mt-0.5 block">v mieste odberu</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {deliverySelected && deliveryResult && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${deliveryResult.isFree ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                      {deliveryResult.isFree ? '✓ Doprava ZDARMA' : `${deliveryResult.price} €`}
                    </span>
                    {!deliveryResult.isFree && <span className="text-gray-400 flex items-center gap-1"><Navigation size={10} />{deliveryResult.distance} km od {deliveryResult.nearestPoint}</span>}
                    {deliveryResult.isKysuce && <span className="text-gray-500">(Kysuce – zadarmo)</span>}
                  </div>
                )}
              </div>

              {/* Map picker button */}
              {deliverySelected && (
                <button
                  type="button"
                  onClick={() => setMapPickerOpen(true)}
                  className="flex items-center gap-2 text-xs text-[#1A4BFF] hover:text-[#1A4BFF]/80 transition-colors py-1.5 px-3 rounded-lg bg-[#1A4BFF]/5 hover:bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 w-full justify-center"
                >
                  <Map size={14} />
                  Vybrať na mape
                </button>
              )}

              <p className="text-[10px] text-gray-500 leading-relaxed">Osobný odber v Žiline alebo Čadci je zadarmo. Doprava do 10 km od výdajných miest a po celých Kysuciach je bezplatná. Nad 10 km účtujeme 0,70 € / km.</p>
            </div>
          </div>

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
                  onClick={() => { if (selectedItem) confirmRentalItem(); else if (searchTerm.trim()) addCustomProduct(); }}
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
                            className={`flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 ${remaining > 0 ? 'hover:bg-[#1A4BFF]/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-white truncate">{item.name}</p>
                              {item.category && <p className="text-[9px] text-gray-500 uppercase tracking-wider">{item.category}</p>}
                            </div>
                            {item.price != null && <span className="text-[9px] text-gray-400 shrink-0 mr-2">{item.price} €</span>}
                            <div className={`text-[9px] mr-2 shrink-0 ${remaining > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{remaining > 0 ? `${remaining} ks` : 'Vypredané'}</div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${remaining > 0 ? 'border-white/20 hover:bg-[#1A4BFF]/20 hover:border-[#1A4BFF]/40' : 'border-red-500/30 bg-red-500/10'}`}>
                              <Plus size={10} className={remaining > 0 ? 'text-white' : 'text-red-400'} />
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
                        {selectedItem.price != null && <span className="text-[10px] text-gray-300 font-bold whitespace-nowrap">{selectedItem.price} € / ks / víkend (2 noci)</span>}
                      </div>
                      <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/[0.08] rounded-xl p-2">
                        <span className="text-[10px] text-gray-400 uppercase shrink-0">Počet:</span>
                        <div className="flex items-center gap-1.5">
                          <button type="button" onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><Minus size={12} /></button>
                          <span className="w-8 text-center text-white font-bold text-sm">{itemQuantity}</span>
                          <button
                            type="button"
                            onClick={() => { const maxAvail = getAvailableForItem(selectedItem.name, selectedItem.availableCount); setItemQuantity(Math.min(maxAvail, itemQuantity + 1)); }}
                            disabled={itemQuantity >= getAvailableForItem(selectedItem.name, selectedItem.availableCount)}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                          ><Plus size={12} /></button>
                        </div>
                      </div>
                      <p className="text-[9px] text-gray-500 mt-1 whitespace-nowrap">
                        {(() => {
                          const maxAvail = getAvailableForItem(selectedItem.name, selectedItem.availableCount);
                          const usedInPkg = getUsedInPackageForDbItem(selectedItem.name, packageUsedCounts);
                          return `Maximálne ${maxAvail} ks (${usedInPkg} ks už v balíku) – cena: ${((selectedItem.price ?? 0) * itemQuantity).toFixed(2)} € / víkend (2 noci)`;
                        })()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedItem(null); setItemQuantity(1); }} className="text-[10px] text-gray-400 hover:text-white h-8 flex-1">Zrušiť</Button>
                        <Button type="button" size="sm" onClick={confirmRentalItem} className="bg-[#1A4BFF]/15 hover:bg-[#1A4BFF]/30 border border-[#1A4BFF]/25 text-white rounded-lg h-8 flex-1 text-[10px] font-semibold transition-all">
                          <ShoppingBag size={12} className="mr-1" /> Pridať {itemQuantity} ks
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {additionalProducts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {additionalProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-1.5 bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 rounded-full pl-3 pr-1.5 py-1">
                    <span className="text-[11px] text-white truncate max-w-[180px]">{product.label}</span>
                    {product.pricePerDay > 0 && <span className="text-[9px] text-[#1A4BFF] font-bold">({product.pricePerDay} €/ks)</span>}
                    <button type="button" onClick={() => removeAdditionalProduct(product.id)} className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center"><X size={9} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#020721] to-[#0a0d1f] border border-[#BD20D3]/20 rounded-2xl p-5 space-y-2 shadow-[0_0_20px_rgba(189,32,211,0.05)]">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-300 pb-1 flex items-center gap-1.5">
              <Euro size={14} className="text-[#BD20D3]" /> Súhrn cien
            </span>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Balík ({includeLights ? 'so svetlami' : 'bez svetiel'}):</span>
              <span className="text-white font-semibold whitespace-nowrap">{activePackagePrice} € / víkend (2 noci)</span>
            </div>
            {installSelected && <div className="flex justify-between text-xs text-gray-400"><span>Inštalácia:</span><span className="text-[#1A4BFF] font-semibold">+20 €</span></div>}
            {installUninstallSelected && <div className="flex justify-between text-xs text-gray-400"><span>Inštalácia a deinštalácia:</span><span className="text-[#1A4BFF] font-semibold">+40 €</span></div>}
            {deliverySelected && deliveryResult && (
              <div className="flex justify-between text-xs text-gray-400">
                <span>Doprava ({deliveryCity}):</span>
                <span className={deliveryResult.isFree ? 'text-emerald-400 font-semibold' : 'text-[#1A4BFF] font-semibold'}>{deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}</span>
              </div>
            )}
            {additionalProducts.length > 0 && (
              <>
                <div className="border-t border-white/[0.06] pt-2 mt-2 space-y-1.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Pridané produkty:</p>
                  {additionalProducts.map((p) => (
                    <div key={p.id} className="flex justify-between text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Plus size={10} className="text-[#1A4BFF]" />
                        <span>{p.label.replace(/^\d+\s*x\s*/, '')} × {p.quantity}</span>
                      </span>
                      <span className="text-white font-medium whitespace-nowrap">{(p.pricePerDay * p.quantity).toFixed(2)} € / víkend (2 noci)</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs text-gray-400 border-t border-white/[0.06] pt-1">
                    <span className="text-[#1A4BFF] font-semibold">Medzisúčet produktov:</span>
                    <span className="text-[#1A4BFF] font-bold whitespace-nowrap">{additionalProductsCost.toFixed(2)} € / víkend (2 noci)</span>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between items-center border-t border-[#BD20D3]/20 pt-2 mt-2">
              <span className="text-sm font-bold text-white">Celková cena na víkend (2 noci):</span>
              <span className="text-[#BD20D3] text-xl font-extrabold whitespace-nowrap">{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleAddToCart} className="btn-cyber rounded-xl h-12 border-none font-bold w-full">
              <ShoppingBag size={16} className="mr-2" />
              Pridať do košíka
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 w-full">
              Zavrieť
            </Button>
            <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2 rounded-xl w-full cursor-pointer bg-transparent border-0">
                  <HelpCircle size={16} />
                  Je vám niečo nejasné? Spýtajte sa nás
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">Máte otázku k tomuto balíku?</DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">Napíšte nám, čo vás zaujíma a my sa vám ozveme čo najskôr.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendQuestion} className="space-y-4 mt-4">
                  <input type="hidden" name="package_name" value={selectedPackage?.name || ''} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-bold uppercase">Meno *</label>
                      <input type="text" required value={questionFirstName} onChange={(e) => setQuestionFirstName(e.target.value)}
                        placeholder="Napr. Ján" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-bold uppercase">Priezvisko *</label>
                      <input type="text" required value={questionLastName} onChange={(e) => setQuestionLastName(e.target.value)}
                        placeholder="Napr. Novák" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">E-mail *</label>
                    <input type="email" required value={questionEmail} onChange={(e) => setQuestionEmail(e.target.value)}
                      placeholder="jan.novak@email.sk" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">Telefón (voliteľný)</label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={questionPhone}
                      onChange={(e) => setQuestionPhone(e.target.value)}
                      placeholder="+421 901 234 567"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">Vaša otázka *</label>
                    {selectedPackage && (
                      <div className="flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full px-3 py-1.5 mb-2">
                        <Package size={14} className="text-[#BD20D3] shrink-0" />
                        <span className="text-xs text-white font-medium truncate">{selectedPackage.name}</span>
                      </div>
                    )}
                    <textarea required value={questionMessage} onChange={(e) => setQuestionMessage(e.target.value)}
                      placeholder="Napíšte, čo vás zaujíma..." className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[100px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed" />
                  </div>
                  <Button type="submit" disabled={sendingQuestion} className="w-full btn-cyber h-11 rounded-xl font-bold border-none text-sm mt-2">
                    {sendingQuestion ? (<><Loader2 size={16} className="mr-2 animate-spin" />Odosiela sa...</>) : "Odoslať otázku"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={showQuestionSuccess} onOpenChange={setShowQuestionSuccess}>
              <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="text-[#BD20D3]" size={32} />
                </div>
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl font-bold text-white">
                    Ďakujeme!
                  </DialogTitle>
                  <DialogDescription className="text-gray-300 text-base leading-relaxed">
                    Vaša otázka bola úspešne odoslaná. Budeme sa jej venovať a čoskoro sa vám ozveme späť.
                  </DialogDescription>
                </DialogHeader>
                <Button
                  onClick={() => setShowQuestionSuccess(false)}
                  className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full"
                >
                  Zavrieť
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DialogContent>

      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="bg-black/95 border-white/10 max-w-4xl rounded-3xl p-0 overflow-hidden shadow-2xl shadow-black/80">
          <div className="relative flex items-center justify-center min-h-[50vh] md:min-h-[70vh]">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <X size={18} />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 border border-white/10 rounded-full px-3 py-1 text-xs text-white">
              {lightboxIndex + 1} / {allImages.length}
            </div>

            {/* Previous button */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                }}
                className="absolute left-3 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Image */}
            <img
              src={allImages[lightboxIndex]}
              alt={`${selectedPackage.name} – obrázok ${lightboxIndex + 1}`}
              className="w-full h-full object-contain max-h-[80vh]"
            />

            {/* Next button */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Thumbnail strip at bottom */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/60 border border-white/10 rounded-xl px-3 py-2 max-w-[90%] overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      idx === lightboxIndex ? 'border-[#BD20D3]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Map picker dialog */}
      <MapPicker
        open={mapPickerOpen}
        onOpenChange={setMapPickerOpen}
        onLocationSelect={handleMapLocationSelect}
      />
    </Dialog>
  );
};

export default PackageDetailDialog;