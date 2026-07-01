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
  Save,
  Wrench,
  Truck,
  ShoppingBag,
  Search,
  Loader2,
  Minus
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

interface AdditionalService {
  id: string;
  label: string;
  price: number;
  selected: boolean;
}

interface AdditionalProduct {
  id: string;
  label: string;
  quantity: number;
}

interface RentalItem {
  id: string;
  name: string;
  image: string;
  category?: string;
  /** Počet kusov skladom (na obmedzenie množstva) */
  availableCount: number;
}

const SERVICES: AdditionalService[] = [
  { id: 'install', label: 'Inštalácia techniky', price: 20, selected: false },
  { id: 'install-uninstall', label: 'Inštalácia a deinštalácia techniky', price: 40, selected: false },
  { id: 'delivery-outside', label: 'Dovoz mimo okresov Žilina/Kysucké Nové Mesto/Čadca', price: 50, selected: false },
];

interface PackageDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage: PackageOption | null;
}

const PackageDetailDialog = ({ open, onOpenChange, selectedPackage }: PackageDetailDialogProps) => {
  const [includeLights, setIncludeLights] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Services
  const [services, setServices] = useState<AdditionalService[]>(SERVICES.map(s => ({ ...s, selected: false })));

  // Additional products
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
      setServices(SERVICES.map(s => ({ ...s, selected: false })));
      setAdditionalProducts([]);
      setSearchTerm('');
      setSelectedItem(null);
      setItemQuantity(1);
    }
  }, [open, selectedPackage]);

  // Load rental items from DB
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
            availableCount: item.availableCount ?? 1
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

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim() || rentalItems.length === 0) {
      setFilteredItems([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = rentalItems.filter(
      item =>
        !additionalProducts.find(p => p.id === item.id) &&
        (item.name.toLowerCase().includes(lower) ||
         (item.category && item.category.toLowerCase().includes(lower)))
    );
    setFilteredItems(filtered.slice(0, 8));
  }, [searchTerm, rentalItems, additionalProducts]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSelectedItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const addCustomProduct = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setAdditionalProducts(prev => [...prev, { id: crypto.randomUUID(), label: `1 x ${trimmed}`, quantity: 1 }]);
    setSearchTerm('');
    setSearchOpen(false);
  };

  const confirmRentalItem = useCallback(() => {
    if (!selectedItem) return;
    const existingIdx = additionalProducts.findIndex(p => p.id === selectedItem.id);
    if (existingIdx !== -1) {
      // Ak už je pridaný, zvýšime množstvo
      const updated = [...additionalProducts];
      const newQty = Math.min(selectedItem.availableCount, updated[existingIdx].quantity + itemQuantity);
      updated[existingIdx] = { ...updated[existingIdx], quantity: newQty, label: `${newQty} x ${selectedItem.name}` };
      setAdditionalProducts(updated);
      toast.success(`Množstvo zvýšené na ${newQty} ks`);
    } else {
      setAdditionalProducts(prev => [...prev, { id: selectedItem.id, label: `${itemQuantity} x ${selectedItem.name}`, quantity: itemQuantity }]);
    }
    setSelectedItem(null);
    setSearchTerm('');
    setFilteredItems([]);
    setItemQuantity(1);
    searchInputRef.current?.focus();
  }, [selectedItem, itemQuantity, additionalProducts]);

  const removeAdditionalProduct = (id: string) => {
    setAdditionalProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      toast.error('Prosím vyplňte povinné údaje.');
      return;
    }

    const selectedServices = services.filter(s => s.selected);
    const servicesCost = selectedServices.reduce((sum, s) => sum + s.price, 0);
    const activePrice = includeLights ? selectedPackage!.priceWithLights : selectedPackage!.priceNoLights;
    const totalPrice = activePrice + servicesCost;

    toast.success('Dopyt na balík bol odoslaný!', {
      description: `Váš dopyt pre "${selectedPackage!.name}" bol zaznamenaný. Celková kalkulácia: ${totalPrice} €/deň + doplnkové produkty. Náš tím vás čoskoro osloví.`
    });
    onOpenChange(false);
  };

  const resetBack = () => {
    setShowBookingForm(false);
  };

  if (!selectedPackage) return null;

  const activePrice = includeLights ? selectedPackage.priceWithLights : selectedPackage.priceNoLights;
  const lightsUpgradePrice = selectedPackage.priceWithLights - selectedPackage.priceNoLights;
  const selectedServices = services.filter(s => s.selected);
  const servicesCost = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalPrice = activePrice + servicesCost;

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

              {/* ============ DOPLNKOVÉ SLUŽBY ============ */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#1A4BFF] flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <Wrench size={16} /> Doplnkové služby
                </span>
                <div className="space-y-2">
                  {services.map(service => (
                    <div 
                      key={service.id} 
                      onClick={() => toggleService(service.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        service.selected 
                          ? 'bg-[#1A4BFF]/10 border-[#1A4BFF]/40' 
                          : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          service.selected ? 'bg-[#1A4BFF] border-[#1A4BFF]' : 'border-gray-500'
                        }`}>
                          {service.selected && <Check size={12} className="text-white stroke-[3]" />}
                        </div>
                        <span className="text-xs text-gray-300 font-medium">{service.label}</span>
                      </div>
                      <span className={`text-xs font-bold ${service.selected ? 'text-[#1A4BFF]' : 'text-gray-500'}`}>
                        +{service.price} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============ ĎALŠIE PRODUKTY ============ */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <ShoppingBag size={16} /> Ďalšie produkty (voliteľné)
                </span>

                <div className="relative" ref={searchRef}>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setSearchOpen(true);
                          setSelectedItem(null);
                        }}
                        onFocus={() => setSearchOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (selectedItem) {
                              confirmRentalItem();
                            } else if (filteredItems.length > 0) {
                              setSelectedItem(filteredItems[0]);
                            } else if (searchTerm.trim()) {
                              addCustomProduct();
                            }
                          }
                        }}
                        placeholder="Hľadať v databáze alebo napísať vlastnú položku..."
                        className="bg-black/40 border-white/10 text-white rounded-xl h-10 pl-9 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        if (selectedItem) {
                          confirmRentalItem();
                        } else if (searchTerm.trim()) {
                          addCustomProduct();
                        }
                      }}
                      disabled={!searchTerm.trim()}
                      className="bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-white rounded-xl h-10 px-3 text-xs disabled:opacity-30"
                    >
                      <Plus size={14} className="mr-1" />
                      Pridať
                    </Button>
                  </div>

                  {searchOpen && searchTerm.trim() && (
                    <>
                      {loadingItems && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-3 text-center z-50">
                          <Loader2 size={14} className="mx-auto mb-1 text-emerald-400 animate-spin" />
                          <p className="text-[10px] text-gray-500">Hľadám...</p>
                        </div>
                      )}

                      {!loadingItems && dbError && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-3 text-center z-50">
                          <p className="text-[10px] text-gray-500">Databáza nie je dostupná – môžete pridať vlastnú položku.</p>
                        </div>
                      )}

                      {!loadingItems && !dbError && filteredItems.length > 0 && !selectedItem && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                          {filteredItems.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedItem(item);
                                setItemQuantity(1);
                              }}
                              className="flex items-center gap-2.5 w-full p-2.5 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
                            >
                              <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-white truncate">{item.name}</p>
                                {item.category && (
                                  <p className="text-[9px] text-gray-500 uppercase tracking-wider">{item.category}</p>
                                )}
                              </div>
                              <div className="text-[9px] text-gray-500 mr-2 shrink-0">
                                {item.availableCount > 0 ? `${item.availableCount} ks` : 'Nedostupné'}
                              </div>
                              <div className="w-5 h-5 rounded-full border border-white/20 hover:bg-emerald-500/30 hover:border-emerald-500/50 flex items-center justify-center">
                                <Plus size={10} className="text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {!loadingItems && !dbError && selectedItem && (
                        <div className="absolute top-full left-0 right-24 mt-1 bg-[#0a0d1f] border border-emerald-500/30 rounded-xl p-3 shadow-2xl z-50">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-white/10">
                              <img src={selectedItem.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-xs font-bold text-white truncate flex-1">{selectedItem.name}</p>
                          </div>

                          <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl p-2">
                            <span className="text-[10px] text-gray-400 uppercase shrink-0">Počet:</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-white font-bold text-sm">{itemQuantity}</span>
                              <button
                                type="button"
                                onClick={() => setItemQuantity(Math.min(selectedItem.availableCount, itemQuantity + 1))}
                                disabled={itemQuantity >= selectedItem.availableCount}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] text-gray-500 mt-1">
                            Maximálne {selectedItem.availableCount} ks skladom
                          </p>

                          <div className="flex gap-2 mt-2">
                            <Button type="button" variant="ghost" size="sm" onClick={() => { setSelectedItem(null); setItemQuantity(1); }} className="text-[10px] text-gray-400 hover:text-white h-8 flex-1">
                              Zrušiť
                            </Button>
                            <Button type="button" size="sm" onClick={confirmRentalItem} className="bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-white rounded-lg h-8 flex-1 text-[10px] font-semibold">
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
                      <div key={product.id} className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full pl-3 pr-1.5 py-1">
                        <span className="text-[11px] text-white truncate max-w-[200px]">{product.label}</span>
                        <button
                          type="button"
                          onClick={() => removeAdditionalProduct(product.id)}
                          className="w-4 h-4 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center"
                        >
                          <X size={9} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ============ SÚHRN CIEN (VŽDY VIDITEĽNÝ) ============ */}
              <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-white pb-1">Súhrn cien</span>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Základná cena balíka:</span>
                  <span className="text-white font-semibold">{activePrice} € / deň</span>
                </div>
                {selectedServices.length > 0 && (
                  <>
                    {selectedServices.map(s => (
                      <div key={s.id} className="flex justify-between text-xs text-gray-400">
                        <span>{s.label}:</span>
                        <span className="text-[#1A4BFF] font-semibold">+{s.price} €</span>
                      </div>
                    ))}
                  </>
                )}
                {additionalProducts.length > 0 && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Ďalšie produkty:</span>
                    <span className="text-emerald-400 font-semibold">{additionalProducts.length} položiek</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2 mt-1">
                  <span className="text-white">Celková kalkulácia / deň:</span>
                  <span className="text-[#BD20D3]">{totalPrice} €</span>
                </div>
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
                {selectedServices.length > 0 && (
                  <p className="text-xs text-[#1A4BFF]">
                    + {selectedServices.length} doplnková(é) služba(y) ({servicesCost} €)
                  </p>
                )}
                {additionalProducts.length > 0 && (
                  <p className="text-xs text-emerald-400">
                    + {additionalProducts.length} ďalších produktov
                  </p>
                )}
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