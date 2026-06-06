"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EquipmentItem } from "@/lib/supabase";
import { toast } from "sonner";

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateFrom: "",
    dateTo: "",
    message: ""
  });

  const cartItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = equipment.find((e) => e.id === id);
      return { item, qty };
    })
    .filter((entry): entry is { item: EquipmentItem; qty: number } => entry.item !== undefined);

  const totalItems = cartItems.reduce((sum, current) => sum + current.qty, 0);
  
  const calculateDays = () => {
    if (!formData.dateFrom || !formData.dateTo) return 1;
    const start = new Date(formData.dateFrom);
    const end = new Date(formData.dateTo);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  
  const getSubtotal = () => {
    return cartItems.reduce((sum, { item, qty }) => sum + item.price_per_day * qty, 0);
  };

  const subtotalPerDay = getSubtotal();
  const baseTotal = subtotalPerDay * days;
  
  const discount = days >= 3 ? baseTotal * 0.15 : 0;
  const grandTotal = baseTotal - discount;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 0;
      const item = equipment.find((e) => e.id === id);
      const newQty = Math.max(0, Math.min(item?.available ?? 0, currentQty + delta));
      return { ...prev, [id]: newQty };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("Prosím vyplňte meno a priezvisko!");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Prosím vyplňte platný email!");
      return;
    }
    if (!formData.dateFrom || !formData.dateTo) {
      toast.error("Prosím vyberte dátum od a do!");
      return;
    }

    toast.success("Dopyt bol úspešne odoslaný!", {
      description: "Náš tím vás bude čoskoro kontaktovať pre potvrdenie rezervácie."
    });

    setQuantities({});
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateFrom: "",
      dateTo: "",
      message: ""
    });
    setIsOpen(false);
  };

  if (totalItems === 0) return null;

  return (
    <>
      {/* FLOATING ACTION BUTTON WITH HOVER PREVIEW */}
      <div 
        className="fixed bottom-8 right-8 z-[999] flex flex-col items-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* HOVER PREVIEW CONTAINER */}
        {isHovered && !isOpen && (
          <div className="mb-4 w-80 bg-gradient-to-br from-[#0a0d1f]/95 to-[#020721]/95 border border-[#BD20D3]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
              Položky v košíku
            </h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {cartItems.map(({ item, qty }) => {
                const img = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50";
                return (
                  <div key={item.id} className="flex items-center gap-2 text-sm text-gray-300">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-8 h-8 rounded object-cover border border-white/10" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50";
                      }}
                    />
                    <span className="font-semibold text-[#BD20D3] shrink-0">{qty}x</span>
                    <span className="truncate flex-grow">{item.name}</span>
                    <span className="text-white text-xs font-semibold shrink-0">{(item.price_per_day * qty)} €</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 mt-3 pt-3 flex justify-between items-center text-xs">
              <span className="text-gray-400">Celkom na deň:</span>
              <span className="text-[#BD20D3] font-bold text-sm">{subtotalPerDay.toFixed(2)} €</span>
            </div>
            
            <button 
              onClick={() => setIsOpen(true)}
              className="w-full mt-3 py-2 bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 border border-[#BD20D3]/40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
            >
              <span>Otvoriť rezerváciu</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* CART TRIGGER BUTTON */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full btn-cyber shadow-[0_0_25px_rgba(189,32,211,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 group border-none"
        >
          <ShoppingBag size={28} className="text-white group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 bg-white text-[#BD20D3] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#020721] shadow-md">
            {totalItems}
          </span>
        </button>
      </div>

      {/* POP-UP MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Nezáväzná kalkulácia & Rezervácia</h2>
                  <p className="text-gray-400 text-sm">Prezrite si vybranú techniku a odošlite dopyt.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* SELECTED EQUIPMENT LIST */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Vybraná technika</span>
                    <span className="text-xs bg-[#BD20D3]/20 border border-[#BD20D3]/40 text-[#BD20D3] px-2.5 py-0.5 rounded-full">
                      {totalItems} ks
                    </span>
                  </h3>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(({ item, qty }) => {
                      const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                      return (
                        <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40">
                            <img
                              src={displayImg}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate" title={item.name}>
                              {item.name}
                            </h4>
                            <p className="text-[#BD20D3] font-bold text-xs mt-0.5">
                              {item.price_per_day} € / deň
                            </p>
                          </div>

                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-white font-medium text-xs">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              disabled={qty >= item.available}
                              className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-30"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* SUMMARY SECTION */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Aparatúra na deň:</span>
                      <span>{subtotalPerDay.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Počet dní prenájmu:</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-500" />
                        {days} {days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'}
                      </span>
                    </div>
                    {days >= 3 && (
                      <div className="flex justify-between text-sm text-emerald-400 font-semibold">
                        <span>Dlhodobá zľava 15%:</span>
                        <span>- {discount.toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="border-t border-white/5 pt-3 flex justify-between items-end">
                      <span className="text-white font-bold text-base">Celková suma</span>
                      <span className="text-[#BD20D3] font-extrabold text-2xl">
                        {grandTotal.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>

                {/* CHECKOUT FORM */}
                <div className="lg:col-span-7 bg-black/20 border border-white/10 rounded-2xl p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-1.5">
                          <User size={14} className="text-[#BD20D3]" /> Meno *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Ján"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-gray-300 flex items-center gap-1.5">
                          <User size={14} className="text-[#BD20D3]" /> Priezvisko *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Novák"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-1.5">
                          <Mail size={14} className="text-[#BD20D3]" /> Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jan@priklad.sk"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-gray-300 flex items-center gap-1.5">
                          <Phone size={14} className="text-[#BD20D3]" /> Telefón
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+421 900 123 456"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="dateFrom" className="text-gray-300 flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#BD20D3]" /> Od dátumu *
                        </Label>
                        <Input
                          id="dateFrom"
                          type="date"
                          value={formData.dateFrom}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateFrom: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="dateTo" className="text-gray-300 flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#BD20D3]" /> Do dátumu *
                        </Label>
                        <Input
                          id="dateTo"
                          type="date"
                          min={formData.dateFrom}
                          value={formData.dateTo}
                          onChange={(e) => setFormData(prev => ({ ...prev, dateTo: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-gray-300 flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-[#BD20D3]" /> Poznámka k objednávke
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Napíšte nám podrobnosti..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="bg-black/50 border-white/10 text-white rounded-xl min-h-[80px]"
                      />
                    </div>

                    <Button type="submit" className="w-full btn-cyber h-12 rounded-xl text-base font-bold border-none mt-4">
                      Odoslať nezáväzný dopyt
                    </Button>
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