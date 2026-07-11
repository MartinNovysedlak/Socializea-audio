"use client";

import React, { useState, useEffect, useRef } from "react";
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
    if (inside) inside = !inside;
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

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);
  const { isAnyDialogOpen, setDialogOpen } = useDialogContext();
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

  // Poslucháč na otvorenie košíka z iných miest (napr. z navigácie)
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('open-floating-cart', handler);
    return () => window.removeEventListener('open-floating-cart', handler);
  }, []);

  // Uloženie balíkov a dispatch eventu pre Navbar
  useEffect(() => {
    try {
      localStorage.setItem(PACKAGE_STORAGE_KEY, JSON.stringify(packageItems));
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch {}
  }, [packageItems]);

  const totalEquipmentQty = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalItems = totalEquipmentQty + packageItems.length;
  const cartItems = Object.entries(quantities).filter(([_, qty]) => qty > 0).map(([id, qty]) => { const item = equipment.find((e) => e.id === id); return { item, qty }; }).filter((entry): entry is { item: EquipmentItem; qty: number } => entry.item !== undefined);

  useEffect(() => { setDialogOpen(isOpen || showReservationSuccess); }, [isOpen, showReservationSuccess, setDialogOpen]);

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
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=8&accept-language=sk&q=${query}`, { headers: { 'User-Agent': 'DjPartyRental/1.0' } });
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
            return { name: item.display_name?.split(',')[0] || item.name || debouncedCitySearch, country: isCzech ? 'cz' : 'sk', lat: coords.lat, lng: coords.lng, postcode: address.postcode || '', district: address.city_district || address.county || '', distToNearest: nearest.distance, nearestPoint: nearest.name };
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
  useEffect(() => { if (isOpen) document.body.style.overflow = "hidden"; else document.body.style.overflow = "unset"; return () => { document.body.style.overflow = "unset"; }; }, [isOpen]);
  useEffect(() => { if (totalItems === 0 && isOpen) { setIsOpen(false); document.body.style.overflow = "unset"; } }, [totalItems, isOpen]);

  const calculateDays = () => {
    if (!formData.dateFrom || !formData.dateTo) return 1;
    const start = new Date(formData.dateFrom);
    const end = new Date(formData.dateTo);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };
  const days = calculateDays();
  const nights = days - 1;
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

  const packageHasInstall = packageItems.some(p => p.install === 'install' || p.install === 'install_uninstall');
  const packageHasDelivery = packageItems.some(p => p.arrival !== null);
  const packageInstallCount = packageItems.filter(p => p.install === 'install').length;
  const packageInstallUninstallCount = packageItems.filter(p => p.install === 'install_uninstall').length;
  const hasAnyAdditionalService = installSelected || installUninstallSelected || deliverySelected || packageHasInstall || packageInstallUninstallCount > 0 || packageHasDelivery;
  const hasSomethingToShow = totalEquipmentQty > 0 || packageItems.length > 0;

  const getPackageDisplayTotal = (pkg: PackageCartItem) => {
    return pkg.price + getPackageExtraDaysTotal(pkg);
  };

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
    setDeliveryCity(cityName);
    setDeliveryLat(lat);
    setDeliveryLng(lng);
    setCityLocked(true); setCityDropdownOpen(false); setCitySuggestions([]);
    const result = calculateDelivery({ lat, lng }, cityName);
    setDeliveryResult(result);
    if (result) { if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`); else toast.info(`Doprava do ${cityName}: ${result.price} €`); }
  };
  const clearDelivery = () => {
    setDeliveryCity('');
    setDeliveryLat(0);
    setDeliveryLng(0);
    setDeliveryResult(null); setDeliverySelected(false); setCityLocked(false); setCitySuggestions([]); setCityDropdownOpen(false);
  };
  const handleCityKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && citySuggestions.length > 0) { e.preventDefault(); selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng); } if (e.key === 'Escape') setCityDropdownOpen(false); };
  const removePackage = (id: string) => setPackageItems(prev => prev.filter(p => p.id !== id));

  const handleMapLocationSelect = (lat: number, lng: number, name: string) => {
    setDeliveryCity(name);
    setDeliveryLat(lat);
    setDeliveryLng(lng);
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

  const buildCartSummaryHtml = () => {
    // ... (funkcia zostáva rovnaká ako v pôvodnom súbore – pre stručnosť vynechaná, ale v produkte musí byť)
    return '';
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
        deliveryLat: deliveryLat || undefined,
        deliveryLng: deliveryLng || undefined,
      });
      await emailjs.send('service_s8kq87k', 'template_st0hc2f', { message_html: htmlContent, title: 'Prenájom' }, 'hlWKyd9fiWgqJJT3r');
      toast.dismiss(toastId);
      setShowReservationSuccess(true);
      setQuantities({}); setPackageItems([]); setInstallSelected(false); setInstallUninstallSelected(false); clearDelivery();
      setFormData({ firstName: "", lastName: "", email: "", phone: "", dateFrom: "", dateTo: "", message: "" });
      setIsOpen(false);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Nepodarilo sa odoslať dopyt.", { description: "Skúste to prosím neskôr alebo nás kontaktujte telefonicky." });
      console.error('EmailJS error:', error);
    } finally { setIsSubmitting(false); }
  };

  // ... (zvyšný JSX zostáva rovnaký – pre stručnosť skrátený)
  return (
    <>
      {/* ... (celý JSX z pôvodného súboru) */}
      <div>Floating Cart</div>
    </>
  );
};

export default FloatingCart;