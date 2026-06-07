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
  Clock,
  ChevronRight
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

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  
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

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromCalendar(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleFromSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateFrom: format(date, "yyyy-MM-dd") }));
      setShowFromCalendar(false);
      // Auto-clear "To" date if it's before the new "From" date
      if (formData.dateTo && isBefore(new Date(formData.dateTo), date)) {
        setFormData(prev => ({ ...prev, dateTo: "" }));
      }
    }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dateTo: format(date, "yyyy-MM-dd") }));
      setShowToCalendar(false);
    }
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
        .rdp-months {
          justify-content: center;
        }
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
        .rdp-day_today {
          border: 1px solid #BD20D3;
          font-weight: 700;
        }
        .rdp-day_outside {
          opacity: 0.3;
        }
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
        .rdp-caption_dropdowns {
          gap: 2px;
        }
        .rdp-dropdown {
          background: rgba(189, 32, 211, 0.1);
          border: 1px solid rgba(189, 32, 211, 0.3);
          border-radius: 4px;
          color: white;
          font-size: 10px;
          padding: 1px 3px;
        }
        .rdp-dropdown:focus {
          outline: none;
          border-color: #BD20D3;
        }
        .rdp-vhidden {
          display: none;
        }
        .rdp-table {
          border-collapse: collapse;
          margin: 0;
        }
        .rdp-row {
          margin: 0;
        }
        .rdp-head_row {
          height: 20px;
        }
        .rdp-tbody {
          border: none;
        }
        @media (max-width: 640px) {
          .rdp {
            --rdp-cell-size: 24px;
          }
          .rdp-day {
            width: 24px;
            height: 24px;
            font-size: 10px;
          }
          .rdp-month {
            padding: 4px;
          }
          .rdp-caption {
            font-size: 11px;
          }
          .rdp-nav_button {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>

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
        <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl my-4 md:my-8">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-4 md:p-6 lg:p-8 relative shadow-2xl shadow-[#BD20D3]/20">
              
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 z-10"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Nezáväzná kalkulácia & Rezervácia</h2>
                  <p className="text-gray-400 text-xs md:text-sm">Prezrite si vybranú techniku a odošlite dopyt.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* SELECTED EQUIPMENT LIST */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <span>Vybraná technika</span>
                    <span className="text-xs bg-[#BD20D3]/20 border border-[#BD20D3]/40 text-[#BD20D3] px-2.5 py-0.5 rounded-full">
                      {totalItems} ks
                    </span>
                  </h3>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map(({ item, qty }) => {
                      const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";
                      return (
                        <div key={item.id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-2 md:p-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40">
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

                          <div className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              className="w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-5 text-center text-white font-medium text-xs">
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
                <div className="lg:col-span-7 bg-black/20 border border-white/10 rounded-2xl p-4 md:p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <User size={14} className="text-[#BD20D3]" /> Meno *
                        </Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="Ján"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <User size={14} className="text-[#BD20D3]" /> Priezvisko *
                        </Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Novák"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <Mail size={14} className="text-[#BD20D3]" /> Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jan@priklad.sk"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <Phone size={14} className="text-[#BD20D3]" /> Telefón
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+421 900 123 456"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11"
                        />
                      </div>
                    </div>

                    {/* DATE PICKERS WITH MINI CALENDAR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 relative" ref={fromRef}>
                        <Label className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <Calendar size={14} className="text-[#BD20D3]" /> Od dátumu *
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            readOnly
                            placeholder="Vyberte dátum"
                            value={formData.dateFrom ? format(new Date(formData.dateFrom), "dd.MM.yyyy") : ""}
                            onClick={() => {
                              setShowFromCalendar(!showFromCalendar);
                              setShowToCalendar(false);
                            }}
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11 cursor-pointer pr-10"
                            required
                          />
                          <Calendar 
                            size={16} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none"
                          />
                        </div>
                        
                        {showFromCalendar && (
                          <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl">
                            <DayPicker
                              mode="single"
                              selected={formData.dateFrom ? new Date(formData.dateFrom) : undefined}
                              onSelect={handleFromSelect}
                              disabled={[{ before: startOfDay(new Date()) }]}
                              weekStartsOn={1}
                              locale={undefined}
                              initialFocus={showFromCalendar}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1.5 relative" ref={toRef}>
                        <Label className="text-gray-300 flex items-center gap-1.5 text-sm">
                          <Calendar size={14} className="text-[#BD20D3]" /> Do dátumu *
                        </Label>
                        <div className="relative">
                          <Input
                            type="text"
                            readOnly
                            placeholder="Vyberte dátum"
                            value={formData.dateTo ? format(new Date(formData.dateTo), "dd.MM.yyyy") : ""}
                            onClick={() => {
                              setShowToCalendar(!showToCalendar);
                              setShowFromCalendar(false);
                            }}
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 md:h-11 cursor-pointer pr-10"
                            required
                          />
                          <Calendar 
                            size={16} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none"
                          />
                        </div>
                        
                        {showToCalendar && (
                          <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl">
                            <DayPicker
                              mode="single"
                              selected={formData.dateTo ? new Date(formData.dateTo) : undefined}
                              onSelect={handleToSelect}
                              disabled={[
                                { before: formData.dateFrom ? addDays(new Date(formData.dateFrom), 1) : startOfDay(new Date()) }
                              ]}
                              weekStartsOn={1}
                              initialFocus={showToCalendar}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-gray-300 flex items-center gap-1.5 text-sm">
                        <MessageSquare size={14} className="text-[#BD20D3]" /> Poznámka k objednávke
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Napíšte nám podrobnosti..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] md:min-h-[80px]"
                      />
                    </div>

                    <Button type="submit" className="w-full btn-cyber h-11 md:h-12 rounded-xl text-sm md:text-base font-bold border-none mt-2 md:mt-4">
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