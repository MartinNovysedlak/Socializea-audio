"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingBag,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Plus,
  Minus,
  Clock,
  ChevronRight,
  Wrench,
  Lightbulb,
  MapPin,
  Check,
  Navigation,
  Truck,
  Loader2,
  Search,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentItem } from "@/lib/supabase";
import { toast } from "sonner";
import { DayPicker } from "react-day-picker";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";

interface PackageCartItem {
  id: string;
  name: string;
  price: number;
  hasLights: boolean;
  image: string;
  arrival: { name: string } | null;
  install: 'none' | 'install' | 'install_uninstall';
  installPrice: number;
  deliveryPrice: number;
  extras: { id: string; label: string; quantity: number; pricePerDay: number }[];
}

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const PACKAGE_STORAGE_KEY = "cyber_cart_packages";

const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

const KYSUCE_BOUNDS = [
  { lat: 49.520, lng: 18.550 },
  { lat: 49.500, lng: 19.050 },
  { lat: 49.350, lng: 19.050 },
  { lat: 49.250, lng: 18.800 },
  { lat: 49.280, lng: 18.600 },
];

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

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Inštalácia / doprava pre samostatnú aparatúru
  const [installSelected, setInstallSelected] = useState(false);
  const [installUninstallSelected, setInstallUninstallSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityMatch[]>([]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [cityLocked, setCityLocked] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof calculateDelivery>>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedCitySearch = useDebounce(deliveryCity, 400);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
    message: ""
  });

  const [packageItems, setPackageItems] = useState<PackageCartItem[]>(() => {
    try {
      const saved = localStorage.getItem(PACKAGE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PACKAGE_STORAGE_KEY, JSON.stringify(packageItems));
    } catch {
      console.error("Nedá sa uložiť balíky do localStorage:", packageItems);
    }
  }, [packageItems]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const pkg = e.detail as PackageCartItem;
      setPackageItems(prev => [...prev, pkg]);
      if (pkg.install === 'install' || pkg.install === 'install_uninstall') {
        setInstallSelected(false);
        setInstallUninstallSelected(false);
      }
      if (pkg.arrival) {
        clearDelivery();
      }
      toast.success(`Balík "${pkg.name}" pridaný do košíka`);
    };
    window.addEventListener('add-package-to-cart', handler as EventListener);
    return () => window.removeEventListener('add-package-to-cart', handler as EventListener);
  }, []);

  const packageHasInstall = packageItems.some(p => p.install === 'install' || p.install === 'install_uninstall');
  const packageHasInstallUninstall = packageItems.some(p => p.install === 'install_uninstall');
  const packageHasDelivery = packageItems.some(p => p.arrival !== null);

  const packageInstallTotal = packageItems.reduce((sum, p) => sum + p.installPrice, 0);
  const packageDeliveryTotal = packageItems.reduce((sum, p) => sum + p.deliveryPrice, 0);

  // Helper function defined early so it can be used in calculations below
  const getPackageTotal = (pkg: PackageCartItem) => {
    let total = pkg.price;
    total += pkg.installPrice;
    total += pkg.deliveryPrice;
    const extrasSum = pkg.extras.reduce((sum, e) => sum + e.pricePerDay * e.quantity, 0);
    total += extrasSum;
    return total;
  };

  useEffect(() => {
    const hasEquipment = Object.values(quantities).some(qty => qty > 0);
    if (!hasEquipment) {
      setInstallSelected(false);
      setInstallUninstallSelected(false);
      clearDelivery();
    }
  }, [quantities]);

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
        const res = await fetch(url, { headers: { 'User-Agent': 'DjPartyRental/1.0 (djparty@example.com)' } });
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
            return {
              name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch,
              country: item.country_code === 'cz' ? 'cz' : 'sk',
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
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) setShowFromCalendar(false);
      if (toRef.current && !toRef.current.contains(event.target as Node)) setShowToCalendar(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setCityDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const totalEquipmentQty = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalItems = totalEquipmentQty + packageItems.length;

  useEffect(() => {
    if (totalItems === 0 && isOpen) { setIsOpen(false); document.body.style.overflow = "unset"; }
  }, [totalItems, isOpen]);

  const cartItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = equipment.find((e) => e.id === id);
      return { item, qty };
    })
    .filter((entry): entry is { item: EquipmentItem; qty: number } => entry.item !== undefined);

  const calculateDays = () => {
    if (!formData.dateFrom || !formData.dateTo) return 1;
    const start = new Date(formData.dateFrom);
    const end = new Date(formData.dateTo);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const getSubtotalPerDay = () => cartItems.reduce((sum, { item, qty }) => sum + item.price_per_day * qty, 0);
  const subtotalPerDay = getSubtotalPerDay();
  const firstDayTotal = subtotalPerDay;
  const additionalDaysTotal = days > 1 ? (days - 1) * subtotalPerDay * 0.5 : 0;
  const installCost = installSelected ? 20 : 0;
  const installUninstallCost = installUninstallSelected ? 40 : 0;
  const deliveryCost = deliveryResult?.price ?? 0;
  const grandTotal = firstDayTotal + additionalDaysTotal + installCost + installUninstallCost + deliveryCost;
  const totalInstallCost = installCost + installUninstallCost + packageInstallTotal;
  const totalDeliveryCost = deliveryCost + packageDeliveryTotal;
  const packagesTotal = packageItems.reduce((sum, p) => sum + getPackageTotal(p), 0);

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 0;
      const item = equipment.find((e) => e.id === id);
      const newQty = Math.max(0, Math.min(item?.available ?? 0, currentQty + delta));
      return { ...prev, [id]: newQty };
    });
  };

  const handleFromSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateFrom: format(date, "yyyy-MM-dd") }));
      setShowFromCalendar(false);
      if (formData.dateTo && isBefore(new Date(formData.dateTo), date)) setFormData(prev => ({ ...prev, dateTo: "" }));
    }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateTo: format(date, "yyyy-MM-dd") }));
      setShowToCalendar(false);
    }
  };

  const toggleDelivery = () => {
    if (deliverySelected) clearDelivery();
    else {
      setDeliverySelected(true);
      requestAnimationFrame(() => { const input = document.getElementById('cart-city-input'); if (input) input.focus(); });
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
      if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`);
      else toast.info(`Doprava do ${cityName}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`);
    }
  };

  const clearDelivery = () => {
    setDeliveryCity(''); setDeliveryResult(null); setDeliverySelected(false); setCityLocked(false);
    setCitySuggestions([]); setCityDropdownOpen(false);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && citySuggestions.length > 0) { e.preventDefault(); selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng); }
    if (e.key === 'Escape') setCityDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) { toast.error("Prosím vyplňte meno a priezvisko!"); return; }
    if (!formData.email.trim()) { toast.error("Prosím vyplňte platný email!"); return; }
    if (!formData.dateFrom || !formData.dateTo) { toast.error("Prosím vyberte dátum od a do!"); return; }
    toast.success("Dopyt bol úspešne odoslaný!", { description: "Náš tím vás bude čoskoro kontaktovať pre potvrdenie rezervácie." });
    setQuantities({}); setPackageItems([]); setInstallSelected(false); setInstallUninstallSelected(false); clearDelivery();
    setFormData({ firstName: "", lastName: "", email: "", phone: "", dateFrom: "", dateTo: "", message: "" });
    setIsOpen(false);
  };

  const removePackage = (id: string) => setPackageItems(prev => prev.filter(p => p.id !== id));

  const hasEquipment = totalEquipmentQty > 0;

  // Spočítame celkový počet inštalácií a deinštalácií z balíkov
  const packageInstallCount = packageItems.filter(p => p.install === 'install').length;
  const packageInstallUninstallCount = packageItems.filter(p => p.install === 'install_uninstall').length;

  return (
    <>
      <style>{`
        .rdp {
          --rdp-cell-size: 28px;
          --rdp-accent-color: #BD20D3;
          --rdp-background-color: rgba(189, 32, 211, 0.1);
          --rdp-accent-color-dark: #BD20D3;
          --rdp-background-color-dark: rgba(189, 32, 211, 0.2);
          --rdp-outline: 2px solid #BD20D3;
          --rdp-outline-selected: 2px solid #BD20D3;
          margin: 0;
        }
        .rdp-months { justify-content: center; }
        .rdp-month {
          background: rgba(10, 13, 31, 0.98);
          border: 1px solid rgba(189, 32, 211, 0.4);
          border-radius: 12px;
          padding: 6px;
        }
        .rdp-caption {
          color: white;
          font-weight: 700;
          font-size: 12px;
          padding: 0 0 4px 0;
        }
        .rdp-head_cell {
          color: #9ca3af;
          font-size: 9px;
          font-weight: 600;
          padding: 2px 0;
        }
        .rdp-day {
          color: #e5e7eb;
          border-radius: 4px;
          font-size: 11px;
          width: 28px;
          height: 28px;
          padding: 0;
        }
        .rdp-day:hover:not(.rdp-day_selected) {
          background: rgba(189, 32, 211, 0.2) !important;
          color: white !important;
        }
        .rdp-day_selected {
          background: #BD20D3 !important;
          color: white !important;
          font-weight: 700;
        }
        .rdp-day_today { border: 1px solid #BD20D3; font-weight: 700; }
        .rdp-day_outside { opacity: 0.3; }
        .rdp-nav_button {
          color: #9ca3af;
          border-radius: 4px;
          width: 24px;
          height: 24px;
        }
        .rdp-nav_button:hover {
          background: rgba(189, 32, 211, 0.2) !important;
          color: white !important;
        }
        .rdp-caption_dropdowns { gap: 2px; }
        .rdp-dropdown {
          background: rgba(189, 32, 211, 0.1);
          border: 1px solid rgba(189, 32, 211, 0.3);
          border-radius: 4px;
          color: white;
          font-size: 10px;
          padding: 1px 3px;
        }
        .rdp-dropdown:focus { outline: none; border-color: #BD20D3; }
        .rdp-vhidden { display: none; }
        .rdp-table { border-collapse: collapse; margin: 0; }
        .rdp-row { margin: 0; }
        .rdp-head_row { height: 20px; }
        .rdp-tbody { border: none; }
        @media (max-width: 640px) {
          .rdp { --rdp-cell-size: 24px; }
          .rdp-day { width: 24px; height: 24px; font-size: 10px; }
          .rdp-month { padding: 4px; }
          .rdp-caption { font-size: 11px; }
          .rdp-nav_button { width: 20px; height: 20px; }
        }
      `}</style>

      {/* FLOATING ACTION BUTTON */}
      {totalItems > 0 && (
        <div
          className="fixed bottom-8 right-8 z-[999] flex flex-col items-end"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && !isOpen && (
            <div className="mb-4 w-80 bg-gradient-to-br from-[#0a0d1f]/95 to-[#020721]/95 border border-[#BD20D3]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-white/10 pb-2">Položky v košíku</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {cartItems.map(({ item, qty }) => {
                  const img = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50";
                  return (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-gray-300">
                      <img src={img} alt="" className="w-8 h-8 rounded object-cover border border-white/10" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50"; }} />
                      <span className="font-semibold text-[#BD20D3] shrink-0">{qty}x</span>
                      <span className="truncate flex-grow">{item.name}</span>
                      <span className="text-white text-xs font-semibold shrink-0">{(item.price_per_day * qty)} €</span>
                    </div>
                  );
                })}
                {packageItems.map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-2 text-sm text-gray-300">
                    <img src={pkg.image} alt={pkg.name} className="w-8 h-8 rounded object-cover border border-white/10" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50"; }} />
                    <span className="font-semibold text-[#BD20D3] shrink-0">1x</span>
                    <span className="truncate flex-grow">{pkg.name}</span>
                    <span className="text-white text-xs font-semibold shrink-0">{getPackageTotal(pkg)} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center text-xs">
                <span className="text-gray-400">Celkom na deň:</span>
                <span className="text-[#BD20D3] font-bold text-sm">{subtotalPerDay.toFixed(2)} €</span>
              </div>
              <button onClick={() => setIsOpen(true)} className="w-full mt-3 py-2 bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 border border-[#BD20D3]/40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                <span>Otvoriť rezerváciu</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          <button onClick={() => setIsOpen(true)} className="relative flex items-center justify-center w-16 h-16 rounded-full btn-cyber shadow-[0_0_25px_rgba(189,32,211,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 group border-none">
            <ShoppingBag size={28} className="text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-white text-[#BD20D3] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#020721] shadow-md">{totalItems}</span>
          </button>
        </div>
      )}

      {/* POP-UP MODAL */}
      {isOpen && totalItems > 0 && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-4 md:my-8">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-4 md:p-6 lg:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button type="button" onClick={() => setIsOpen(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 z-10"><X size={24} /></button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]"><ShoppingBag size={20} /></div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Nezáväzná kalkulácia & Rezervácia</h2>
                  <p className="text-gray-400 text-xs md:text-sm">Prezrite si vybranú techniku a odošlite dopyt.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT COLUMN: SELECTED ITEMS + SUMMARY */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <span>Vybraná technika</span>
                    <span className="text-sm bg-[#BD20D3]/20 border border-[#BD20D3]/40 text-[#BD20D3] px-3 py-1 rounded-full font-semibold">{totalItems} ks</span>
                  </h3>

                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(({ item, qty }) => {
                      const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                      return (
                        <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 md:p-4">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40">
                            <img src={displayImg} alt={item.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"; }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-white truncate">{item.name}</h4>
                            <p className="text-[#BD20D3] font-bold text-sm mt-1">{item.price_per_day} € / deň</p>
                          </div>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-1.5">
                            <button type="button" onClick={() => handleQuantityChange(item.id, -1)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><Minus size={12} /></button>
                            <span className="w-6 text-center text-white font-semibold text-sm">{qty}</span>
                            <button type="button" onClick={() => handleQuantityChange(item.id, 1)} disabled={qty >= item.available} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30"><Plus size={12} /></button>
                          </div>
                        </div>
                      );
                    })}
                    {packageItems.map((pkg) => (
                      <div key={pkg.id} className="flex items-start gap-4 bg-[#BD20D3]/5 border border-[#BD20D3]/30 rounded-xl p-3 md:p-4 relative">
                        <button type="button" onClick={() => removePackage(pkg.id)} className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white"><X size={12} /></button>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#BD20D3]/40 shrink-0 bg-black/40">
                          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white mb-1">{pkg.name}</h4>
                          <p className="text-[#BD20D3] font-bold text-base mt-0.5 mb-2">{getPackageTotal(pkg)} € / víkend</p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {pkg.hasLights && <span className="text-xs px-2 py-1 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-lg text-[#BD20D3] flex items-center gap-1.5 font-medium"><Lightbulb size={12} /> So svetlami</span>}
                            {pkg.install === 'install' && <span className="text-xs px-2 py-1 bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 rounded-lg text-[#1A4BFF] flex items-center gap-1.5 font-medium"><Wrench size={12} /> Inštalácia (+{pkg.installPrice} €)</span>}
                            {pkg.install === 'install_uninstall' && <span className="text-xs px-2 py-1 bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 rounded-lg text-[#1A4BFF] flex items-center gap-1.5 font-medium"><Wrench size={12} /> Inšt.+Deinšt. (+{pkg.installPrice} €)</span>}
                            {pkg.arrival && <span className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center gap-1.5 font-medium"><MapPin size={12} /> {pkg.arrival.name}{pkg.deliveryPrice > 0 ? ` (+${pkg.deliveryPrice} €)` : ' (Zdarma)'}</span>}
                          </div>
                          {pkg.extras.length > 0 && (
                            <div className="text-xs text-gray-400 mt-2 space-y-1 bg-black/20 rounded-lg p-2 border border-white/5">
                              <p className="text-xs font-semibold text-gray-300 mb-1.5">Doplnkové produkty:</p>
                              {pkg.extras.map((e, i) => (
                                <div key={i} className="flex items-center gap-1.5"><Plus size={10} /><span>{e.label}</span><span className="text-[#BD20D3] font-semibold ml-auto">{(e.quantity * e.pricePerDay).toFixed(2)} €</span></div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* DOPLNKOVÉ SLUŽBY PRE SAMOSTATNÚ APARATÚRU */}
                  {hasEquipment && (
                    <div className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#1A4BFF] flex items-center gap-1.5 pb-2 border-b border-white/[0.06]"><Wrench size={14} /> Doplnkové služby</span>

                      <div
                        onClick={() => { if (packageHasInstall) return; setInstallSelected(!installSelected); if (!installSelected) setInstallUninstallSelected(false); }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${packageHasInstall ? 'bg-gray-800/40 border-gray-700/50 opacity-50 cursor-not-allowed' : installSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${packageHasInstall ? 'border-gray-600 bg-gray-700' : installSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                            {packageHasInstall && <Ban size={10} className="text-gray-400" />}
                            {!packageHasInstall && installSelected && <Check size={12} className="text-white stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium ${packageHasInstall ? 'text-gray-500' : 'text-gray-300'}`}>{packageHasInstall ? 'Inštalácia (už v balíku)' : 'Inštalácia'}</span>
                        </div>
                        <span className={`text-xs font-bold ${packageHasInstall ? 'text-gray-600' : installSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>{packageHasInstall ? '—' : '+20 €'}</span>
                      </div>

                      <div
                        onClick={() => { if (packageHasInstall) return; setInstallUninstallSelected(!installUninstallSelected); if (!installUninstallSelected) setInstallSelected(false); }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${packageHasInstall ? 'bg-gray-800/40 border-gray-700/50 opacity-50 cursor-not-allowed' : installUninstallSelected ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${packageHasInstall ? 'border-gray-600 bg-gray-700' : installUninstallSelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                            {packageHasInstall && <Ban size={10} className="text-gray-400" />}
                            {!packageHasInstall && installUninstallSelected && <Check size={12} className="text-white stroke-[3]" />}
                          </div>
                          <span className={`text-xs font-medium ${packageHasInstall ? 'text-gray-500' : 'text-gray-300'}`}>{packageHasInstall ? 'Inštalácia a deinštalácia (už v balíku)' : 'Inštalácia a deinštalácia'}</span>
                        </div>
                        <span className={`text-xs font-bold ${packageHasInstall ? 'text-gray-600' : installUninstallSelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>{packageHasInstall ? '—' : '+40 €'}</span>
                      </div>

                      <div className="border-t border-white/[0.06] pt-2 space-y-2">
                        <div className="relative" ref={cityRef}>
                          <div
                            onClick={() => { if (packageHasDelivery) return; toggleDelivery(); }}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${packageHasDelivery ? 'bg-gray-800/40 border-gray-700/50 opacity-50 cursor-not-allowed' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${packageHasDelivery ? 'border-gray-600 bg-gray-700' : deliverySelected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'}`}>
                              {packageHasDelivery && <Ban size={10} className="text-gray-400" />}
                              {!packageHasDelivery && deliverySelected && <Check size={12} className="text-white stroke-[3]" />}
                            </div>
                            <MapPin size={14} className={`shrink-0 ${packageHasDelivery ? 'text-gray-600' : deliverySelected ? 'text-[#1A4BFF]' : 'text-gray-500'}`} />
                            <div className="flex-1 min-w-0">
                              {packageHasDelivery ? (
                                <span className="text-xs text-gray-500">Doprava (už v balíku)</span>
                              ) : (
                                <Input id="cart-city-input" type="text" value={deliveryCity} onChange={(e) => { setDeliveryCity(e.target.value); setDeliveryResult(null); setCityLocked(false); }} onKeyDown={handleCityKeyDown} onFocus={() => { if (deliveryCity.length >= 2 && deliverySelected && !cityLocked && citySuggestions.length > 0) setCityDropdownOpen(true); }} placeholder="Mesto odberu (SK/CZ)..." readOnly={!deliverySelected} className="bg-transparent border-0 text-white text-xs h-auto px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500" />
                              )}
                            </div>
                            <div className="shrink-0 min-w-[70px] text-right">
                              {packageHasDelivery ? <span className="text-xs text-gray-600">—</span> : deliverySelected && deliveryResult ? <span className={`text-xs font-bold ${deliveryResult.isFree ? 'text-emerald-400' : 'text-[#1A4BFF]'}`}>{deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}</span> : <span className="text-xs text-gray-500">Vybrať</span>}
                            </div>
                            {!packageHasDelivery && deliverySelected && (
                              <button type="button" onClick={(e) => { e.stopPropagation(); clearDelivery(); }} className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all shrink-0"><X size={10} /></button>
                            )}
                          </div>
                          {!packageHasDelivery && cityDropdownOpen && citySuggestions.length > 0 && deliverySelected && !cityLocked && (
                            <div className="absolute top-full left-0 right-0 mt-0.5 bg-[#0a0d1f] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 max-h-60 overflow-y-auto">
                              {searchingCities && <div className="flex items-center justify-center gap-2 p-3 border-b border-white/[0.06] text-gray-500"><Loader2 size={14} className="animate-spin" /><span className="text-xs">Vyhľadávam...</span></div>}
                              {citySuggestions.map((city, i) => (
                                <button key={i} type="button" onClick={() => selectCity(city.name, city.lat, city.lng)} className="flex items-center gap-2.5 w-full p-2.5 transition-colors text-left border-b border-white/[0.06] last:border-b-0 hover:bg-[#1A4BFF]/5 cursor-pointer">
                                  <MapPin size={13} className="text-gray-500 shrink-0 self-start mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white truncate">{city.name}</p>
                                    <span className="text-[9px] text-gray-500/70 leading-tight block mt-0.5">
                                      {[city.postcode, city.district].filter(Boolean).join(', ')}
                                    </span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-[9px] text-gray-500 uppercase block">{city.country === 'sk' ? 'SK' : 'CZ'}</span>
                                    {city.distToNearest !== undefined && city.distToNearest > 0 && (
                                      <span className="text-[8px] text-gray-600 mt-0.5 block whitespace-nowrap">~{city.distToNearest} km od {city.nearestPoint}</span>
                                    )}
                                    {city.distToNearest !== undefined && city.distToNearest <= 0 && (
                                      <span className="text-[8px] text-emerald-500/60 mt-0.5 block">v mieste odberu</span>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {!packageHasDelivery && deliverySelected && deliveryResult && (
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                              <span className={`font-bold px-2 py-0.5 rounded-full ${deliveryResult.isFree ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>{deliveryResult.isFree ? '✓ Doprava ZDARMA' : `${deliveryResult.price} €`}</span>
                              {!deliveryResult.isFree && <span className="text-gray-400 flex items-center gap-1"><Navigation size={10} /> {deliveryResult.distance} km od {deliveryResult.nearestPoint}</span>}
                              {deliveryResult.isKysuce && <span className="text-gray-500">(Kysuce – zadarmo)</span>}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed">Osobný odber v Žiline alebo Čadci je zadarmo. Doprava do 10 km od výdajných miest a po celých Kysuciach je bezplatná. Nad 10 km účtujeme 0,70 € / km.</p>
                      </div>
                    </div>
                  )}

                  {/* SUMMARY SECTION */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {hasEquipment && (
                      <>
                        <div className="flex justify-between text-base text-gray-400"><span>Aparatúra na deň:</span><span className="font-semibold text-white">{subtotalPerDay.toFixed(2)} €</span></div>
                        <div className="flex justify-between text-base text-gray-400"><span>Počet dní prenájmu:</span><span className="flex items-center gap-1.5 font-semibold text-white"><Clock size={14} className="text-gray-500" /> {days} {days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'}</span></div>
                        {days > 1 && (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2 mt-2">
                            <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-2">Výpočet ceny:</p>
                            <div className="flex justify-between text-base text-gray-300"><span>1. deň (plná cena):</span><span className="text-white font-semibold">{firstDayTotal.toFixed(2)} €</span></div>
                            <div className="flex justify-between text-base text-gray-300"><span>{days - 1} {days - 1 === 1 ? 'ďalší deň' : days - 1 < 5 ? 'ďalšie dni' : 'ďalších dní'} (50%):</span><span className="text-white font-semibold">{additionalDaysTotal.toFixed(2)} €</span></div>
                            <div className="flex justify-between text-base text-emerald-400 font-semibold border-t border-emerald-500/20 pt-2 mt-1"><span>Zľava za dlhodobý prenájom:</span><span>- {((days - 1) * subtotalPerDay * 0.5).toFixed(2)} €</span></div>
                          </div>
                        )}
                      </>
                    )}

                    {packageItems.length > 0 && (
                      <div className="border-t border-white/5 pt-3 space-y-2">
                        <p className="text-sm text-gray-400 font-bold uppercase">Balíky:</p>
                        {packageItems.map((pkg) => (
                          <div key={pkg.id} className="flex justify-between text-base"><span className="text-gray-300 truncate flex-1 min-w-0">{pkg.name}</span><span className="text-[#BD20D3] font-bold shrink-0 ml-4">{getPackageTotal(pkg)} €</span></div>
                        ))}
                      </div>
                    )}

                    {/* Inštalácia – z aparatúry aj z balíkov */}
                    {(installSelected && !installUninstallSelected) && (
                      <div className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[#1A4BFF]" /> Inštalácia</span>
                        <span className="text-[#1A4BFF] font-semibold">+{installCost + packageItems.filter(p => p.install === 'install').reduce((s, p) => s + p.installPrice, 0)} €</span>
                      </div>
                    )}
                    {(installUninstallSelected && !installSelected) && (
                      <div className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[#1A4BFF]" /> Inštalácia a deinštalácia</span>
                        <span className="text-[#1A4BFF] font-semibold">+{installUninstallCost + packageItems.filter(p => p.install === 'install_uninstall').reduce((s, p) => s + p.installPrice, 0)} €</span>
                      </div>
                    )}
                    {/* Ak balík má inštaláciu a aparatúra nemá nič vybrané – zobraz len balíkovú inštaláciu */}
                    {!installSelected && !installUninstallSelected && packageInstallCount > 0 && (
                      <div className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[#1A4BFF]" /> Inštalácia</span>
                        <span className="text-[#1A4BFF] font-semibold">+{packageItems.filter(p => p.install === 'install').reduce((s, p) => s + p.installPrice, 0)} €</span>
                      </div>
                    )}
                    {!installSelected && !installUninstallSelected && packageInstallUninstallCount > 0 && (
                      <div className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Wrench size={14} className="text-[#1A4BFF]" /> Inštalácia a deinštalácia</span>
                        <span className="text-[#1A4BFF] font-semibold">+{packageItems.filter(p => p.install === 'install_uninstall').reduce((s, p) => s + p.installPrice, 0)} €</span>
                      </div>
                    )}

                    {/* Doprava – iba ak je vybraná */}
                    {deliverySelected && deliveryResult && (
                      <div className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Truck size={14} className="text-emerald-400" /> Doprava ({deliveryCity})</span>
                        <span className={deliveryResult.isFree ? 'text-emerald-400 font-semibold' : 'text-[#1A4BFF] font-semibold'}>{deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}</span>
                      </div>
                    )}
                    {packageItems.filter(p => p.arrival).map((pkg) => (
                      <div key={pkg.id} className="flex justify-between text-base text-gray-400">
                        <span className="flex items-center gap-1.5"><Truck size={14} className="text-emerald-400" /> Doprava ({pkg.arrival?.name})</span>
                        <span className={pkg.deliveryPrice > 0 ? 'text-[#1A4BFF] font-semibold' : 'text-emerald-400 font-semibold'}>{pkg.deliveryPrice > 0 ? `+${pkg.deliveryPrice} €` : 'Zdarma'}</span>
                      </div>
                    ))}

                    <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                      <span className="text-white font-bold text-lg">Celková suma</span>
                      <span className="text-[#BD20D3] font-extrabold text-3xl">{(grandTotal + packagesTotal).toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CHECKOUT FORM */}
                <div className="lg:col-span-7 bg-black/20 border border-white/10 rounded-2xl p-4 md:p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-1.5 text-sm"><User size={14} className="text-[#BD20D3]" /> Meno *</Label>
                        <Input id="firstName" type="text" placeholder="Ján" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-gray-300 flex items-center gap-1.5 text-sm"><User size={14} className="text-[#BD20D3]" /> Priezvisko *</Label>
                        <Input id="lastName" type="text" placeholder="Novák" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-1.5 text-sm"><Mail size={14} className="text-[#BD20D3]" /> Email *</Label>
                        <Input id="email" type="email" placeholder="jan@priklad.sk" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-gray-300 flex items-center gap-1.5 text-sm"><Phone size={14} className="text-[#BD20D3]" /> Telefón</Label>
                        <Input id="phone" type="tel" placeholder="+421 900 123 456" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 relative" ref={fromRef}>
                        <Label className="text-gray-300 flex items-center gap-1.5 text-sm"><Calendar size={14} className="text-[#BD20D3]" /> Od dátumu *</Label>
                        <div className="relative">
                          <Input type="text" readOnly placeholder="Vyberte dátum" value={formData.dateFrom ? format(new Date(formData.dateFrom), "dd.MM.yyyy") : ""} onClick={() => { setShowFromCalendar(!showFromCalendar); setShowToCalendar(false); }} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11 cursor-pointer pr-10" required />
                          <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
                        </div>
                        {showFromCalendar && (
                          <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl">
                            <DayPicker mode="single" selected={formData.dateFrom ? new Date(formData.dateFrom) : undefined} onSelect={handleFromSelect} disabled={[{ before: startOfDay(new Date()) }]} weekStartsOn={1} initialFocus={showFromCalendar} />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5 relative" ref={toRef}>
                        <Label className="text-gray-300 flex items-center gap-1.5 text-sm"><Calendar size={14} className="text-[#BD20D3]" /> Do dátumu *</Label>
                        <div className="relative">
                          <Input type="text" readOnly placeholder="Vyberte dátum" value={formData.dateTo ? format(new Date(formData.dateTo), "dd.MM.yyyy") : ""} onClick={() => { setShowToCalendar(!showToCalendar); setShowFromCalendar(false); }} className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11 cursor-pointer pr-10" required />
                          <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
                        </div>
                        {showToCalendar && (
                          <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl">
                            <DayPicker mode="single" selected={formData.dateTo ? new Date(formData.dateTo) : undefined} onSelect={handleToSelect} disabled={[{ before: formData.dateFrom ? addDays(new Date(formData.dateFrom), 1) : startOfDay(new Date()) }]} weekStartsOn={1} initialFocus={showToCalendar} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-gray-300 flex items-center gap-1.5 text-sm"><MessageSquare size={14} className="text-[#BD20D3]" /> Poznámka k objednávke</Label>
                      <Textarea id="message" placeholder="Napíšte nám podrobnosti..." value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] md:min-h-[80px]" />
                    </div>
                    <Button type="submit" className="w-full btn-cyber h-11 md:h-12 rounded-xl text-sm md:text-base font-bold border-none mt-2 md:mt-4">Odoslať nezáväzný dopyt</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;