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
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
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

  useEffect(() => { setDialogOpen(isOpen || showReservationSuccess); }, [isOpen, showReservationSuccess, setDialogOpen]);
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
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=sk,cz&limit=8&accept-language=sk&q=${query}`,
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
              distToNearest: nearest.distance, nearestPoint: nearest.name,
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
  const hasAnyAdditionalService = installSelected || installUninstallSelected || deliverySelected || packageHasInstall || packageHasDelivery;
  const hasSomethingToShow = totalEquipmentQty > 0 || packageItems.length > 0;

  const getPackageDisplayTotal = (pkg: PackageCartItem) => pkg.price + getPackageExtraDaysTotal(pkg);

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
    setDeliveryCity(cityName); setCityLocked(true); setCityDropdownOpen(false); setCitySuggestions([]);
    setDeliveryCoords({ lat, lng });
    const result = calculateDelivery({ lat, lng }, cityName);
    setDeliveryResult(result);
    if (result) { if (result.isFree) toast.success(`Doprava do ${cityName} je zadarmo!`); else toast.info(`Doprava do ${cityName}: ${result.price} € (vzdialenosť ${result.distance} km od ${result.nearestPoint})`); }
  };

  const clearDelivery = () => { setDeliveryCity(''); setDeliveryCoords(null); setDeliveryResult(null); setDeliverySelected(false); setCityLocked(false); setCitySuggestions([]); setCityDropdownOpen(false); };

  const handleCityKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && citySuggestions.length > 0) { e.preventDefault(); selectCity(citySuggestions[0].name, citySuggestions[0].lat, citySuggestions[0].lng); } if (e.key === 'Escape') setCityDropdownOpen(false); };

  const removePackage = (id: string) => setPackageItems(prev => prev.filter(p => p.id !== id));

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

  const buildCartSummaryHtml = () => {
    let html = '';

    if (cartItems.length > 0) {
      const equipSubtotalBase = firstDayTotal + additionalDaysTotal;
      html += `
        <div style="margin-bottom:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px 20px;">
          <h3 style="margin:0 0 12px 0;color:#BD20D3;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
            🎧 Aparatúra
            <span style="font-size:11px;background:rgba(189,32,211,0.15);color:#BD20D3;padding:2px 10px;border-radius:20px;font-weight:600;">${cartItems.reduce((s,{qty}) => s + qty, 0)} ks</span>
          </h3>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead>
              <tr style="background:rgba(189,32,211,0.08);">
                <th style="padding:8px 10px;text-align:left;color:#9ca3af;font-weight:600;">Položka</th>
                <th style="padding:8px 10px;text-align:center;color:#9ca3af;font-weight:600;">Počet</th>
                <th style="padding:8px 10px;text-align:right;color:#9ca3af;font-weight:600;">Cena/deň</th>
                <th style="padding:8px 10px;text-align:right;color:#9ca3af;font-weight:600;">Spolu</th>
              </tr>
            </thead>
            <tbody>`;
      cartItems.forEach(({ item, qty }) => {
        html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:8px 10px;color:white;">${item.name}</td>
          <td style="padding:8px 10px;text-align:center;color:#BD20D3;font-weight:700;">${qty}x</td>
          <td style="padding:8px 10px;text-align:right;color:#9ca3af;">${item.price_per_day.toFixed(2)} €</td>
          <td style="padding:8px 10px;text-align:right;color:white;font-weight:600;">${(item.price_per_day * qty).toFixed(2)} €</td>
        </tr>`;
      });
      html += `</tbody></table>`;
      if (days > 1) {
        html += `<div style="margin-top:12px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:12px;padding:12px 14px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0;"><span style="color:#9ca3af;">1. deň (plná cena)</span><span style="color:white;font-weight:600;">${firstDayTotal.toFixed(2)} €</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0;"><span style="color:#9ca3af;">${nights} ${nights === 1 ? 'ďalšia noc' : 'ďalšie noci'} (50%)</span><span style="color:white;font-weight:600;">${additionalDaysTotal.toFixed(2)} €</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0;border-top:1px solid rgba(16,185,129,0.15);padding-top:6px;margin-top:3px;">
            <span style="color:#10b981;font-weight:600;">🌟 Zľava za dlhodobý prenájom</span>
            <span style="color:#10b981;font-weight:600;">− ${((days - 1) * subtotalPerDay * 0.5).toFixed(2)} €</span>
          </div>
        </div>`;
      }
      html += `<div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.1);">
        <span style="color:white;font-weight:700;font-size:14px;">Aparatúra spolu</span>
        <span style="color:white;font-weight:900;font-size:16px;">${equipSubtotalBase.toFixed(2)} €</span>
      </div></div>`;
    }

    if (packageItems.length > 0) {
      html += `
        <div style="margin-bottom:20px;background:rgba(26,75,255,0.03);border:1px solid rgba(26,75,255,0.12);border-radius:16px;padding:16px 20px;">
          <h3 style="margin:0 0 12px 0;color:#1A4BFF;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">
            📦 Balíky
            <span style="font-size:11px;background:rgba(26,75,255,0.15);color:#1A4BFF;padding:2px 10px;border-radius:20px;font-weight:600;">${packageItems.length} ks</span>
          </h3>`;
      packageItems.forEach((pkg) => {
        const displayTotal = getPackageDisplayTotal(pkg);
        html += `<div style="background:rgba(26,75,255,0.05);border:1px solid rgba(26,75,255,0.15);border-radius:12px;padding:12px 14px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:white;font-size:14px;">${pkg.name}</strong>
            <span style="color:#1A4BFF;font-weight:800;font-size:15px;white-space:nowrap;margin-left:20px;">${displayTotal.toFixed(2)} €</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
            ${pkg.hasLights ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(189,32,211,0.1);border:1px solid rgba(189,32,211,0.3);border-radius:8px;color:#BD20D3;font-size:11px;font-weight:600;">💡 So svetlami</span>' : ''}
            ${pkg.install === 'install' ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(26,75,255,0.1);border:1px solid rgba(26,75,255,0.3);border-radius:8px;color:#1A4BFF;font-size:11px;font-weight:600;">🔧 Inštalácia (+'+pkg.installPrice+' €)</span>' : ''}
            ${pkg.install === 'install_uninstall' ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(26,75,255,0.1);border:1px solid rgba(26,75,255,0.3);border-radius:8px;color:#1A4BFF;font-size:11px;font-weight:600;">🔧 Inšt.+Deinšt. (+'+pkg.installPrice+' €)</span>' : ''}
            ${pkg.arrival ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;color:#10b981;font-size:11px;font-weight:600;">📍 '+pkg.arrival.name+(pkg.deliveryPrice>0 ? ' (+'+pkg.deliveryPrice+' €)' : ' (Zdarma)')+'</span>' : ''}
          </div>`;
        if (pkg.arrival && pkg.arrival.lat && pkg.arrival.lng) {
          html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(26,75,255,0.05);border:1px solid rgba(26,75,255,0.2);border-radius:10px;text-align:center;">
            <span style="color:#9ca3af;font-size:11px;">📍 Súradnice: ${pkg.arrival.lat.toFixed(6)}, ${pkg.arrival.lng.toFixed(6)}</span><br />
            <a href="https://www.google.com/maps?q=${pkg.arrival.lat},${pkg.arrival.lng}" target="_blank" rel="noopener noreferrer" style="color:#1A4BFF;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(26,75,255,0.08);border-radius:8px;margin-top:6px;">
              🗺️ Otvoriť v Mapách Google
            </a>
          </div>`;
        }
        if (pkg.extras.length > 0) {
          html += `<div style="margin-top:8px;padding:8px 12px;background:rgba(0,0,0,0.3);border-radius:8px;font-size:12px;">
            <div style="color:#9ca3af;font-weight:600;margin-bottom:4px;">Doplnkové produkty:</div>`;
          pkg.extras.forEach((e) => {
            html += `<div style="display:flex;justify-content:space-between;color:#d1d5db;padding:2px 0;"><span>${e.label} (${e.quantity}x)</span><span style="color:#1A4BFF;margin-left:20px;">${(e.quantity * e.pricePerDay).toFixed(2)} €</span></div>`;
          });
          html += `</div>`;
        }
        html += `</div>`;
      });
      if (days > WEEKEND_DAYS && packagesExtraDaysTotal > 0) {
        const extraNights = nights - WEEKEND_DAYS + 1;
        html += `<div style="margin-top:8px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:12px;padding:12px 14px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0;">
            <span style="color:#9ca3af;">Víkend (2 noci) – všetky položky v cene</span>
            <span style="color:white;font-weight:600;">${packagesWeekendTotal.toFixed(2)} €</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:3px 0;">
            <span style="color:#9ca3af;">${extraNights} ${extraNights === 1 ? 'ďalšia noc' : 'ďalšie noci'} (+50 % zo základnej ceny balíka)</span>
            <span style="color:#10b981;font-weight:600;">+${packagesExtraDaysTotal.toFixed(2)} €</span>
          </div>
        </div>`;
      }
      html += `<div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.1);">
        <span style="color:white;font-weight:700;font-size:14px;">Balíky spolu</span>
        <span style="color:white;font-weight:900;font-size:16px;">${packagesTotal.toFixed(2)} €</span>
      </div></div>`;
    }

    const hasServices = installSelected || installUninstallSelected || deliveryResult || packageItems.some(p => p.install !== 'none' || p.arrival);
    if (hasServices) {
      let servicesTotalCalc = 0;
      let servicesHtml = '';
      if (installSelected) { servicesTotalCalc += 20; servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">Inštalácia</span><span style="color:#1A4BFF;font-weight:700;">+20,00 €</span></div>`; }
      if (installUninstallSelected) { servicesTotalCalc += 40; servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">Inštalácia a deinštalácia</span><span style="color:#1A4BFF;font-weight:700;">+40,00 €</span></div>`; }
      packageItems.filter(p => p.install !== 'none').forEach(p => {
        servicesTotalCalc += p.installPrice;
        const label = p.install === 'install' ? 'Inštalácia' : 'Inštalácia a deinštalácia';
        servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">${label} <span style="color:rgba(255,255,255,0.4);">(${p.name})</span></span><span style="color:#1A4BFF;font-weight:700;">+${p.installPrice.toFixed(2)} €</span></div>`;
      });
      if (deliveryResult) {
        servicesTotalCalc += deliveryResult.price;
        servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">Doprava <span style="color:rgba(255,255,255,0.4);">(${deliveryCity})</span></span><span style="color:${deliveryResult.isFree ? '#10b981' : '#1A4BFF'};font-weight:700;">${deliveryResult.isFree ? 'Zdarma' : `+${deliveryResult.price.toFixed(2)} €`}</span></div>`;
        if (deliveryCoords) {
          servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">📍 Súradnice</span><span style="color:#9ca3af;font-size:12px;">${deliveryCoords.lat.toFixed(6)}, ${deliveryCoords.lng.toFixed(6)}</span></div>`;
          servicesHtml += `<div style="margin-top:8px;padding:8px 12px;background:rgba(26,75,255,0.05);border:1px solid rgba(26,75,255,0.2);border-radius:10px;text-align:center;">
            <a href="https://www.google.com/maps?q=${deliveryCoords.lat},${deliveryCoords.lng}" target="_blank" rel="noopener noreferrer" style="color:#1A4BFF;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;padding:6px 16px;background:rgba(26,75,255,0.08);border-radius:8px;">
              🗺️ Otvoriť v Mapách Google
            </a>
          </div>`;
        }
      }
      packageItems.filter(p => p.arrival).forEach(p => {
        if (p.deliveryPrice > 0) { servicesTotalCalc += p.deliveryPrice; servicesHtml += `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;"><span style="color:#9ca3af;">Doprava <span style="color:rgba(255,255,255,0.4);">(${p.arrival!.name})</span></span><span style="color:#1A4BFF;font-weight:700;">+${p.deliveryPrice.toFixed(2)} €</span></div>`; }
      });
      html += `
        <div style="margin-bottom:20px;background:rgba(16,185,129,0.03);border:1px solid rgba(16,185,129,0.12);border-radius:16px;padding:16px 20px;">
          <h3 style="margin:0 0 12px 0;color:#10b981;font-size:15px;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:10px;">🔧 Doplnkové služby</h3>
          ${servicesHtml}
        </div>`;
    }

    const totalPrice = grandTotal + packagesTotal;
    html += `
      <div style="background:linear-gradient(135deg,rgba(189,32,211,0.08),rgba(26,75,255,0.05));border:2px solid rgba(189,32,211,0.3);border-radius:18px;padding:20px 24px;">
        <h3 style="margin:0 0 14px 0;color:#BD20D3;font-size:16px;font-weight:700;text-align:center;border-bottom:1px solid rgba(189,32,211,0.15);padding-bottom:10px;">💰 Súhrn objednávky</h3>`;
    if (cartItems.length > 0) html += `<div style="display:flex;font-size:14px;padding:5px 0;"><span style="color:#9ca3af;">🎧 Aparatúra</span><span style="margin-left:auto;color:white;font-weight:600;min-width:80px;text-align:right;">${(firstDayTotal + additionalDaysTotal).toFixed(2)} €</span></div>`;
    if (packageItems.length > 0) html += `<div style="display:flex;font-size:14px;padding:5px 0;"><span style="color:#9ca3af;">📦 Balíky</span><span style="margin-left:auto;color:white;font-weight:600;min-width:80px;text-align:right;">${packagesTotal.toFixed(2)} €</span></div>`;
    if (hasServices) {
      const servicesTotalCalc =
        (installSelected ? 20 : 0) + (installUninstallSelected ? 40 : 0) +
        (deliveryResult?.price ?? 0) +
        packageItems.reduce((s, p) => s + p.installPrice + (p.arrival ? p.deliveryPrice : 0), 0);
      html += `<div style="display:flex;font-size:14px;padding:5px 0;"><span style="color:#9ca3af;">🔧 Doplnkové služby</span><span style="margin-left:auto;color:white;font-weight:600;min-width:80px;text-align:right;">${servicesTotalCalc.toFixed(2)} €</span></div>`;
    }
    html += `<div style="display:flex;align-items:center;margin-top:14px;padding-top:14px;border-top:2px solid #BD20D3;">
      <span style="color:white;font-size:18px;font-weight:800;">Celková suma</span>
      <span style="margin-left:auto;color:#BD20D3;font-size:26px;font-weight:900;min-width:120px;text-align:right;">${totalPrice.toFixed(2)} €</span>
    </div></div>`;

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

  return (
    <>
      <style>{`
        .rdp { --rdp-cell-size: 28px; --rdp-accent-color: #BD20D3; --rdp-background-color: rgba(189, 32, 211, 0.1); --rdp-accent-color-dark: #BD20D3; --rdp-background-color-dark: rgba(189, 32, 211, 0.2); --rdp-outline: 2px solid #BD20D3; --rdp-outline-selected: 2px solid #BD20D3; margin: 0; }
        .rdp-months { justify-content: center; }
        .rdp-month { background: rgba(10, 13, 31, 0.98); border: 1px solid rgba(189, 32, 211, 0.4); border-radius: 12px; padding: 6px; }
        .rdp-caption { color: white; font-weight: 700; font-size: 12px; padding: 0 0 4px 0; }
        .rdp-head_cell { color: #9ca3af; font-size: 9px; font-weight: 600; padding: 2px 0; }
        .rdp-day { color: #e5e7eb; border-radius: 4px; font-size: 11px; width: 28px; height: 28px; padding: 0; }
        .rdp-day:hover:not(.rdp-day_selected) { background: rgba(189, 32, 211, 0.2) !important; color: white !important; }
        .rdp-day_selected { background: #BD20D3 !important; color: white !important; font-weight: 700; }
        .rdp-day_today { border: 1px solid #BD20D3; font-weight: 700; }
        .rdp-day_outside { opacity: 0.3; }
        .rdp-nav_button { color: #9ca3af; border-radius: 4px; width: 24px; height: 24px; }
        .rdp-nav_button:hover { background: rgba(189, 32, 211, 0.2) !important; color: white !important; }
        .rdp-caption_dropdowns { gap: 2px; }
        .rdp-dropdown { background: rgba(189, 32, 211, 0.1); border: 1px solid rgba(189, 32, 211, 0.3); border-radius: 4px; color: white; font-size: 10px; padding: 1px 3px; }
        .rdp-dropdown:focus { outline: none; border-color: #BD20D3; }
        .rdp-vhidden { display: none; }
        @media (max-width: 640px) { .rdp { --rdp-cell-size: 24px; } .rdp-day { width: 24px; height: 24px; font-size: 10px; } .rdp-month { padding: 4px; } .rdp-caption { font-size: 11px; } .rdp-nav_button { width: 20px; height: 20px; } }
        .cart-scroll-wrapper { overflow-y: auto; overflow-x: hidden; max-height: 260px; padding-right: 0.5rem; }
        .cart-scroll-wrapper::-webkit-scrollbar { width: 4px; }
        .cart-scroll-wrapper::-webkit-scrollbar-track { background: transparent; }
        .cart-scroll-wrapper::-webkit-scrollbar-thumb { background: rgba(189, 32, 211, 0.3); border-radius: 4px; }
        .cart-scroll-wrapper::-webkit-scrollbar-thumb:hover { background: rgba(189, 32, 211, 0.5); }
        .cart-item-row { display: grid; grid-template-columns: auto 1fr auto; gap: 0.75rem; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.75rem 1rem; }
        @media (min-width: 640px) { .cart-item-row { padding: 0.875rem 1rem; gap: 1rem; } }
        .cart-item-image { width: 48px; height: 48px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; background: rgba(0,0,0,0.4); }
        @media (min-width: 640px) { .cart-item-image { width: 56px; height: 56px; } }
        .cart-item-details { min-width: 0; overflow: hidden; }
        .cart-item-name { font-size: 0.875rem; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (min-width: 640px) { .cart-item-name { font-size: 1rem; } }
        .cart-item-price { font-size: 0.75rem; font-weight: 700; color: #BD20D3; margin-top: 2px; }
        @media (min-width: 640px) { .cart-item-price { font-size: 0.875rem; margin-top: 4px; } }
        .cart-qty-controls { display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.375rem; flex-shrink: 0; }
        .cart-qty-btn { width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; transition: all 0.15s; border: none; background: transparent; cursor: pointer; }
        .cart-qty-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .cart-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cart-qty-value { width: 24px; text-align: center; color: white; font-weight: 600; font-size: 0.875rem; }
      `}</style>

      {/* ... (rest of the JSX remains exactly the same as before) ... */}
    </>
  );
};

export default FloatingCart;