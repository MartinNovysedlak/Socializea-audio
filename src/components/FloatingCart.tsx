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
  ChevronRight,
  Wrench,
  Lightbulb,
  MapPin,
  Check,
  Navigation,
  Loader2,
  Ban,
  Send,
  CheckCircle2,
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
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDialogContext } from '@/contexts/DialogContext';
import MapPicker from './MapPicker';

// ── Missing type definitions ──
interface PackageCartItem {
  id: string;
  name: string;
  price: number;
  hasLights: boolean;
  image: string;
  arrival: { name: string; lat: number; lng: number } | null;
  install: 'none' | 'install' | 'install_uninstall';
  installPrice: number;
  deliveryPrice: number;
  extras: { id: string; label: string; quantity: number; pricePerDay: number }[];
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

interface FloatingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const PACKAGE_STORAGE_KEY = "cyber_cart_packages";

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

// ── The main component ──

const FloatingCart = ({ open, onOpenChange, quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);
  const { setDialogOpen } = useDialogContext();
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [installSelected, setInstallSelected] = useState(false);
  const [installUninstallSelected, setInstallUninstallSelected] = useState(false);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryLat, setDeliveryLat] = useState(0);
  const [deliveryLng, setDeliveryLng] = useState(0);
  const [citySuggestions, setCitySuggestions] = useState<CityMatch[]>([]);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [searchingCities, setSearchingCities] = useState(false);
  const [cityLocked, setCityLocked] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<ReturnType<typeof calculateDelivery>>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const debouncedCitySearch = useDebounce(deliveryCity, 400);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", dateFrom: "", dateTo: "", message: "" });
  const [packageItems, setPackageItems] = useState<PackageCartItem[]>(() => {
    try { const saved = localStorage.getItem(PACKAGE_STORAGE_KEY); return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const totalEquipmentQty = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalItems = totalEquipmentQty + packageItems.length;
  const cartItems = Object.entries(quantities).filter(([_, qty]) => qty > 0).map(([id, qty]) => { const item = equipment.find((e) => e.id === id); return { item, qty }; }).filter((entry): entry is { item: EquipmentItem; qty: number } => entry.item !== undefined);

  useEffect(() => { setDialogOpen(open || showReservationSuccess); }, [open, showReservationSuccess, setDialogOpen]);
  useEffect(() => { try { localStorage.setItem(PACKAGE_STORAGE_KEY, JSON.stringify(packageItems)); } catch {} }, [packageItems]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const pkg = e.detail as PackageCartItem;
      setPackageItems(prev => [...prev, pkg]);
      if (pkg.install === 'install' || pkg.install === 'install_uninstall') { setInstallSelected(false); setInstallUninstallSelected(false); }
      if (pkg.arrival) { clearDelivery(); }
      toast.success(`Balík "${pkg.name}" pridaný do košíka`);
    };
    window.addEventListener('add-package-to-cart', handler as EventListener);
    return () => window.removeEventListener('add-package-to-cart', handler as EventListener);
  }, []);

  useEffect(() => {
    const hasEquipment = Object.values(quantities).some(qty => qty > 0);
    if (!hasEquipment) { setInstallSelected(false); setInstallUninstallSelected(false); clearDelivery(); }
  }, [quantities]);

  useEffect(() => {
    if (!deliverySelected || !debouncedCitySearch.trim() || debouncedCitySearch.trim().length < 2 || cityLocked) {
      setCitySuggestions([]); setCityDropdownOpen(false); setSearchingCities(false); return;
    }
    let cancelled = false;
    const search = async () => {
      setSearchingCities(true);
      try {
        const query = encodeURIComponent(debouncedCitySearch.trim());
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=8&accept-language=sk&q=${query}`;
        const res = await fetch(url, { headers: { 'User-Agent': 'DjPartyRental/1.0' } });
        if (cancelled) return;
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (cancelled) return;
        if (data && Array.isArray(data)) {
          const mapped: CityMatch[] = data.map((item: any) => {
            const address = item.address || {};
            const coords = { lat: parseFloat(item.lat), lng: parseFloat(item.lon) };
            const nearest = getNearestPoint(coords);
            const isCzech = (item.country_code === 'cz' || (address.country || '').toLowerCase().includes('czech'));
            return {
              name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch,
              country: isCzech ? 'cz' : 'sk',
              lat: coords.lat,
              lng: coords.lng,
              postcode: address.postcode || '',
              district: address.city_district || address.county || address.state_district || address.municipality || '',
              distToNearest: nearest.distance,
              nearestPoint: nearest.name,
            };
          });
          const seen = new Set<string>();
          const unique = mapped.filter(c => { const key = c.name.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; });
          setCitySuggestions(unique); setCityDropdownOpen(unique.length > 0);
        } else { setCitySuggestions([]); setCityDropdownOpen(false); }
      } catch { if (!cancelled) { setCitySuggestions([]); setCityDropdownOpen(false); } }
      finally { if (!cancelled) setSearchingCities(false); }
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

  const calculateDays = () => {
    if (!formData.dateFrom || !formData.dateTo) return 1;
    const start = new Date(formData.dateFrom);
    const end = new Date(formData.dateTo);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const days = calculateDays();
  const subtotalPerDay = cartItems.reduce((sum, { item, qty }) => sum + item.price_per_day * qty, 0);
  const firstDayTotal = subtotalPerDay;
  const additionalDaysTotal = days > 1 ? (days - 1) * subtotalPerDay * 0.5 : 0;
  const installCost = installSelected ? 20 : 0;
  const installUninstallCost = installUninstallSelected ? 40 : 0;
  const deliveryCost = deliveryResult?.price ?? 0;
  const grandTotal = firstDayTotal + additionalDaysTotal + installCost + installUninstallCost + deliveryCost;

  const WEEKEND_DAYS = 3;
  const getPackageExtraDaysTotal = (pkg: PackageCartItem) => {
    if (days <= WEEKEND_DAYS) return 0;
    return (days - WEEKEND_DAYS) * pkg.price * 0.5;
  };
  const packagesWeekendTotal = packageItems.reduce((sum, p) =>
    sum + p.price + p.installPrice + p.deliveryPrice + p.extras.reduce((s, e) => s + e.pricePerDay * e.quantity, 0), 0
  );
  const packagesExtraDaysTotal = packageItems.reduce((sum, p) => sum + getPackageExtraDaysTotal(p), 0);
  const packagesTotal = packagesWeekendTotal + packagesExtraDaysTotal;

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 0;
      const item = equipment.find((e) => e.id === id);
      return { ...prev, [id]: Math.max(0, Math.min(item?.available ?? 0, currentQty + delta)) };
    });
  };

  const handleFromSelect = (date: Date | undefined) => {
    if (date) { setFormData(prev => ({ ...prev, dateFrom: format(date, "yyyy-MM-dd") })); setShowFromCalendar(false); if (formData.dateTo && isBefore(new Date(formData.dateTo), date)) setFormData(prev => ({ ...prev, dateTo: "" })); }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (date) { setFormData(prev => ({ ...prev, dateTo: format(date, "yyyy-MM-dd") })); setShowToCalendar(false); }
  };

  const toggleDelivery = () => { if (deliverySelected) clearDelivery(); else { setDeliverySelected(true); requestAnimationFrame(() => { const input = document.getElementById('cart-city-input'); if (input) input.focus(); }); } };

  const selectCity = (cityName: string, lat: number, lng: number) => {
    setDeliveryCity(cityName); setDeliveryLat(lat); setDeliveryLng(lng); setCityLocked(true); setCityDropdownOpen(false); setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, cityName); setDeliveryResult(result);
    if (result) { if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`); else toast.info(`Doprava do ${cityName}: ${result.price} €`); }
  };

  const clearDelivery = () => { setDeliveryCity(''); setDeliveryLat(0); setDeliveryLng(0); setDeliveryResult(null); setDeliverySelected(false); setCityLocked(false); setCitySuggestions([]); setCityDropdownOpen(false); const input = document.getElementById('cart-city-input'); if (input) (input as HTMLInputElement).value = ''; };

  const handleCityKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && citySuggestions.length > 0) { e.preventDefault(); selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng); } if (e.key === 'Escape') setCityDropdownOpen(false); };

  const removePackage = (id: string) => setPackageItems(prev => prev.filter(p => p.id !== id));

  const handleMapLocationSelect = (lat: number, lng: number, name: string) => {
    setDeliveryCity(name); setDeliveryLat(lat); setDeliveryLng(lng); setCityLocked(true); setCityDropdownOpen(false); setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, name); setDeliveryResult(result);
    if (result) { if (result.isFree) toast.success(`Doprava do ${name} je zadarmo!`); else toast.info(`Doprava do ${name}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`); }
  };

  const buildCartSummaryHtml = () => {
    let html = '';
    if (cartItems.length > 0) {
      html += '<div style="margin-bottom:12px;"><strong style="color:#e5e7eb;font-size:13px;">🎧 Technika na prenájom</strong><div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;">';
      cartItems.forEach(({ item, qty }) => { html += `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;"><span style="color:#9ca3af;">${qty}x ${item.name}</span><span style="color:white;font-weight:600;">${(item.price_per_day * qty).toFixed(2)} €/deň</span></div>`; });
      html += '</div></div>';
    }
    if (packageItems.length > 0) {
      html += '<div><strong style="color:#e5e7eb;font-size:13px;">📦 Balíky</strong><div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;">';
      packageItems.forEach(p => { html += `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:12px;"><span style="color:#9ca3af;">1x ${p.name}</span><span style="color:white;font-weight:600;">${p.price.toFixed(2)} €/víkend</span></div>`; if (p.extras.length > 0) { p.extras.forEach(e => { html += `<div style="display:flex;justify-content:space-between;padding:2px 0 2px 16px;font-size:11px;"><span style="color:#6b7280;">+ ${e.label}</span><span style="color:#9ca3af;font-weight:500;">${(e.pricePerDay * e.quantity).toFixed(2)} €</span></div>`; }); } });
      html += '</div></div>';
    }
    return html;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) { toast.error("Prosím vyplňte meno a priezvisko!"); return; }
    if (!formData.email.trim()) { toast.error("Prosím vyplňte platný email!"); return; }
    if (!formData.dateFrom || !formData.dateTo) { toast.error("Prosím vyberte dátum od a do!"); return; }
    setIsSubmitting(true);
    const toastId = toast.loading('Odosielam dopyt...');
    try {
      const totalPrice = grandTotal + packagesTotal;
      const htmlContent = generateEmailHtml('rezervacia', {
        name: `${formData.firstName} ${formData.lastName}`, email: formData.email, phone: formData.phone || 'Neuvedený',
        date: formData.dateFrom ? `${format(new Date(formData.dateFrom), "dd.MM.yyyy")} až ${format(new Date(formData.dateTo), "dd.MM.yyyy")}` : 'Neuvedený',
        message: formData.message || '—', cartSummaryHtml: buildCartSummaryHtml(), days, totalPrice,
        deliveryLat: deliveryLat || undefined, deliveryLng: deliveryLng || undefined,
      });
      await emailjs.send('service_s8kq87k', 'template_zh6cnks', { message_html: htmlContent, title: 'Prenájom – nový dopyt' }, 'hlWKyd9fiWgqJJT3r');
      toast.dismiss(toastId);
      setShowReservationSuccess(true);
      setQuantities({}); setPackageItems([]); setInstallSelected(false); setInstallUninstallSelected(false); clearDelivery();
      setFormData({ firstName: "", lastName: "", email: "", phone: "", dateFrom: "", dateTo: "", message: "" });
      onOpenChange(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Nepodarilo sa odoslať dopyt.", { description: "Skúste to prosím neskôr alebo nás kontaktujte telefonicky." });
      console.error('EmailJS error:', error);
    } finally { setIsSubmitting(false); }
  };

  return (
    <>
      {/* Floating button – zobrazí sa len keď košík nie je otvorený a má položky */}
      {totalItems > 0 && !open && (
        <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {isHovered && !open && (
            <div className="mb-4 w-80 bg-gradient-to-br from-[#0a0d1f]/95 to-[#020721]/95 border border-[#BD20D3]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-white/10 pb-2">Položky v košíku</h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {cartItems.map(({ item, qty }) => {
                  const img = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50";
                  return (
                    <div key={item.id} className="flex items-center gap-2 text-sm text-gray-300">
                      <img src={img} alt="" className="w-8 h-8 rounded object-cover border border-white/10" />
                      <span className="font-semibold text-[#BD20D3] shrink-0">{qty}x</span>
                      <span className="truncate flex-grow">{item.name}</span>
                      <span className="text-white text-xs font-semibold shrink-0">{(item.price_per_day * qty)} €</span>
                    </div>
                  );
                })}
                {packageItems.map((pkg) => (
                  <div key={pkg.id} className="flex items-center gap-2 text-sm text-gray-300">
                    <img src={pkg.image} alt={pkg.name} className="w-8 h-8 rounded object-cover border border-white/10" />
                    <span className="font-semibold text-[#BD20D3] shrink-0">1x</span>
                    <span className="truncate flex-grow">{pkg.name}</span>
                    <span className="text-white text-xs font-semibold shrink-0">{pkg.price} €</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center text-xs">
                <span className="text-gray-400">Celkom na deň:</span>
                <span className="text-[#BD20D3] font-bold text-sm">{subtotalPerDay.toFixed(2)} €</span>
              </div>
              <button onClick={() => onOpenChange(true)} className="w-full mt-3 py-2 bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 border border-[#BD20D3]/40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                <span>Otvoriť rezerváciu</span><ChevronRight size={14} />
              </button>
            </div>
          )}
          <button onClick={() => onOpenChange(true)} className="relative flex items-center justify-center w-16 h-16 rounded-full btn-cyber shadow-[0_0_25px_rgba(189,32,211,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 group border-none">
            <ShoppingBag size={28} className="text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-white text-[#BD20D3] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#020721] shadow-md">{totalItems}</span>
          </button>
        </div>
      )}

      {/* Hlavný košík – zobrazuje sa keď open === true */}
      {open && totalItems > 0 && (
        <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-4 md:my-8">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-4 md:p-6 lg:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              <button type="button" onClick={() => onOpenChange(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 z-10"><X size={24} /></button>
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]"><ShoppingBag size={20} /></div>
                <div><h2 className="text-xl md:text-2xl font-bold text-white">Nezáväzná kalkulácia & Rezervácia</h2><p className="text-gray-400 text-xs md:text-sm">Prezrite si vybranú techniku a odošlite dopyt.</p></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:gap-8">
                <div className="lg:col-span-5 space-y-4">
                  {/* Položky v košíku – zoznam */}
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Vybrané položky</h3>
                  <div className="space-y-3">
                    {cartItems.map(({ item, qty }) => {
                      const img = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                      return (
                        <div key={item.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                          <img src={img} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500">{item.price_per_day} € / deň</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => handleQuantityChange(item.id, -1)} disabled={!qty} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition-all"><Minus size={12} /></button>
                            <span className="w-8 text-center text-white font-bold text-sm">{qty}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} disabled={qty >= item.available} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 transition-all"><Plus size={12} /></button>
                          </div>
                        </div>
                      );
                    })}
                    {packageItems.map((pkg) => (
                      <div key={pkg.id} className="flex items-center gap-3 bg-gradient-to-br from-[#BD20D3]/10 to-[#1A4BFF]/10 border border-[#BD20D3]/30 rounded-2xl p-3">
                        <img src={pkg.image} alt={pkg.name} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{pkg.name}</p>
                          <p className="text-[10px] text-gray-400">{pkg.price} € / víkend (2 noci){pkg.hasLights ? '' : ' – bez svetiel'}</p>
                        </div>
                        <button onClick={() => removePackage(pkg.id)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-500/80 hover:text-white transition-all"><X size={12} /></button>
                      </div>
                    ))}
                  </div>

                  {/* Doplnkové služby */}
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Doplnkové služby</p>
                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <input type="checkbox" id="install" checked={installSelected} onChange={() => { setInstallSelected(!installSelected); if (!installSelected) setInstallUninstallSelected(false); }} className="accent-[#BD20D3]" />
                      <label htmlFor="install" className="cursor-pointer"><Wrench size={12} className="inline mr-1 text-[#BD20D3]" /> Inštalácia (+20 €)</label>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-300">
                      <input type="checkbox" id="install-uninstall" checked={installUninstallSelected} onChange={() => { setInstallUninstallSelected(!installUninstallSelected); if (!installUninstallSelected) setInstallSelected(false); }} className="accent-[#BD20D3]" />
                      <label htmlFor="install-uninstall" className="cursor-pointer"><Wrench size={12} className="inline mr-1 text-[#BD20D3]" /> Inštalácia a deinštalácia (+40 €)</label>
                    </div>
                    <div className="relative border-t border-white/5 pt-2 mt-2" ref={cityRef}>
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <input type="checkbox" id="delivery" checked={deliverySelected} onChange={toggleDelivery} className="accent-[#1A4BFF]" />
                        <label htmlFor="delivery" className="cursor-pointer"><MapPin size={12} className="inline mr-1 text-[#1A4BFF]" /> Doprava</label>
                      </div>
                      {deliverySelected && (
                        <div className="mt-2 space-y-1">
                          <input id="cart-city-input" type="text" value={deliveryCity} onChange={(e) => { setDeliveryCity(e.target.value); setDeliveryResult(null); setCityLocked(false); }} onKeyDown={handleCityKeyDown} onFocus={() => { if (deliveryCity.length >= 2 && !cityLocked && citySuggestions.length > 0) setCityDropdownOpen(true); }} placeholder="Zadajte mesto ..." className="w-full bg-black/40 border border-white/10 rounded-lg h-8 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#1A4BFF]" />
                          {cityDropdownOpen && citySuggestions.length > 0 && !cityLocked && (
                            <div className="bg-[#0a0d1f] border border-white/10 rounded-xl overflow-hidden shadow-lg">
                              {citySuggestions.map((city, i) => (
                                <button key={i} type="button" onClick={() => selectCity(city.name, city.lat, city.lng)} className="flex items-center gap-2 w-full p-2 hover:bg-white/5 text-left border-b border-white/5 last:border-0">
                                  <MapPin size={12} className="text-gray-500 shrink-0" />
                                  <span className="text-xs text-white">{city.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {deliveryResult && (
                            <p className={`text-[10px] ${deliveryResult.isFree ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {deliveryResult.isFree ? 'Doprava ZDARMA' : `${deliveryResult.price} € (${deliveryResult.distance} km od ${deliveryResult.nearestPoint})`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kontaktné údaje a kalendáre */}
                  <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kontaktné údaje</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Meno *" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                      <input type="text" placeholder="Priezvisko *" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} className="bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                    </div>
                    <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                    <input type="tel" placeholder="Telefón" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                    
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider pt-2 border-t border-white/5">Dátum prenájmu</p>
                    <div className="grid grid-cols-2 gap-2 relative" ref={fromRef}>
                      <div className="relative">
                        <input type="text" readOnly value={formData.dateFrom ? format(new Date(formData.dateFrom), "dd.MM.yyyy") : ''} onClick={() => setShowFromCalendar(!showFromCalendar)} placeholder="Od *" className="w-full bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                        <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
                      </div>
                      <div className="relative" ref={toRef}>
                        <input type="text" readOnly value={formData.dateTo ? format(new Date(formData.dateTo), "dd.MM.yyyy") : ''} onClick={() => setShowToCalendar(!showToCalendar)} placeholder="Do *" className="w-full bg-black/40 border border-white/10 rounded-xl h-10 px-3 text-xs text-white placeholder:text-gray-500 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#BD20D3]" />
                        <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
                      </div>
                    </div>
                    {showFromCalendar && (
                      <div className="absolute z-50 bg-[#0a0d1f] border border-[#BD20D3]/40 rounded-xl p-2 shadow-2xl" style={{ top: '100%', left: 0, marginTop: 4 }}>
                        <DayPicker mode="single" selected={formData.dateFrom ? new Date(formData.dateFrom) : undefined} onSelect={handleFromSelect} disabled={[{ before: startOfDay(new Date()) }]} weekStartsOn={1} />
                      </div>
                    )}
                    {showToCalendar && (
                      <div className="absolute z-50 bg-[#0a0d1f] border border-[#BD20D3]/40 rounded-xl p-2 shadow-2xl" style={{ top: '100%', right: 0, marginTop: 4 }}>
                        <DayPicker mode="single" selected={formData.dateTo ? new Date(formData.dateTo) : undefined} onSelect={handleToSelect} disabled={{ before: formData.dateFrom ? new Date(new Date(formData.dateFrom).getTime() + 86400000) : startOfDay(new Date()) }} weekStartsOn={1} />
                      </div>
                    )}

                    <textarea placeholder="Poznámka (voliteľné)" value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full bg-black/40 border border-white/10 rounded-xl min-h-[60px] p-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] leading-relaxed" />
                  </div>
                </div>

                <div className="lg:col-span-7 bg-black/20 border border-white/10 rounded-2xl p-4 md:p-6 lg:p-8 lg:sticky lg:top-8 self-start">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Prehľad ceny</h3>
                  <div className="border-t border-white/10 pt-3 space-y-2 text-xs">
                    {cartItems.map(({ item, qty }) => (
                      <div key={item.id} className="flex justify-between text-gray-400"><span>{qty}x {item.name}</span><span className="text-white font-semibold">{(item.price_per_day * qty).toFixed(2)} € / deň</span></div>
                    ))}
                    {packageItems.map((pkg) => (
                      <div key={pkg.id} className="flex justify-between text-gray-400 border-l-2 border-[#BD20D3] pl-2"><span>1x {pkg.name}</span><span className="text-white font-semibold">{pkg.price.toFixed(2)} € / víkend (2 noci)</span></div>
                    ))}
                    <div className="border-t border-white/5 pt-2 mt-2">
                      <div className="flex justify-between text-gray-400"><span>Prvý deň (základ)</span><span className="text-white">{subtotalPerDay.toFixed(2)} €</span></div>
                      {additionalDaysTotal > 0 && <div className="flex justify-between text-gray-400"><span>Ďalších {days - 1} dní (-50%)</span><span className="text-white">{additionalDaysTotal.toFixed(2)} €</span></div>}
                      {installSelected && <div className="flex justify-between"><span className="text-gray-400">Inštalácia</span><span className="text-white">+20 €</span></div>}
                      {installUninstallSelected && <div className="flex justify-between"><span className="text-gray-400">Inštalácia a deinštalácia</span><span className="text-white">+40 €</span></div>}
                      {deliveryResult && <div className="flex justify-between"><span className="text-gray-400">Doprava</span><span className={deliveryResult.isFree ? 'text-emerald-400' : 'text-white'}>{deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price} €`}</span></div>}
                      {packageItems.length > 0 && !Number.isNaN(packagesTotal) && packagesTotal > 0 && (
                        <div className="mt-2 border-t border-white/5 pt-2">
                          <p className="text-[11px] font-bold text-gray-300 mb-1 lowercase">Cena za balíky na víkend: {packagesWeekendTotal.toFixed(2)} €</p>
                          {packagesExtraDaysTotal > 0 && <p className="text-[11px] text-gray-400">Extra dni (50%): +{packagesExtraDaysTotal.toFixed(2)} €</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center border-t-2 border-[#BD20D3]/40 pt-3 mt-1"><span className="text-sm font-bold text-white">Celková cena</span><span className="text-xl font-extrabold text-[#BD20D3]">{(grandTotal + packagesTotal).toFixed(2)} €</span></div>
                  </div>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full btn-cyber h-12 rounded-xl font-bold border-none mt-6">
                    {isSubmitting ? <><Loader2 size={18} className="mr-2 animate-spin" />Odosiela sa...</> : <><Send size={18} className="mr-2" />Odoslať nezáväzný dopyt</>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MapPicker open={mapPickerOpen} onOpenChange={setMapPickerOpen} onLocationSelect={handleMapLocationSelect} />

      <Dialog open={showReservationSuccess} onOpenChange={setShowReservationSuccess}>
        <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-[#BD20D3]" size={32} />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">Ďakujeme za rezerváciu!</DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">V najbližšej dobe sa vám budeme venovať.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowReservationSuccess(false)} className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full">Zavrieť</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingCart;