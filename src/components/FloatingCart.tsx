"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Plus, Minus, Trash2, X, Package, Euro, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';
import MapPicker from './MapPicker';
import { useDialogContext } from '@/contexts/DialogContext';
import { EquipmentItem } from '@/lib/supabase';
import { computeUsedEquipmentCounts, PackageCartItem } from '@/lib/packageUtils';

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [open, setOpen] = useState(false);
  const [packageItems, setPackageItems] = useState<PackageCartItem[]>([]);
  const [showMap, setShowMap] = useState(false);
  const { setDialogOpen } = useDialogContext();

  const usedInPackages = React.useMemo(
    () => computeUsedEquipmentCounts(packageItems, equipment),
    [packageItems, equipment]
  );

  // Listen for custom event to open the cart
  useEffect(() => {
    const handleOpenCart = () => setOpen(true);
    const handleAddPackage = (e: CustomEvent<PackageCartItem>) => {
      try {
        const existing = JSON.parse(localStorage.getItem('cyber_cart_packages') || '[]') as PackageCartItem[];
        existing.push(e.detail);
        localStorage.setItem('cyber_cart_packages', JSON.stringify(existing));
        setPackageItems(existing);
        toast.success(`${e.detail.name} pridaný do košíka`);
        dispatchCartUpdate();
      } catch (err) {
        console.error('Failed to add package to cart', err);
      }
    };
    window.addEventListener('open-floating-cart', handleOpenCart);
    window.addEventListener('add-package-to-cart', handleAddPackage as EventListener);

    // Load existing packages on mount
    try {
      const saved = localStorage.getItem('cyber_cart_packages');
      if (saved) setPackageItems(JSON.parse(saved));
    } catch { /* ignore */ }

    return () => {
      window.removeEventListener('open-floating-cart', handleOpenCart);
      window.removeEventListener('add-package-to-cart', handleAddPackage as EventListener);
    };
  }, []);

  useEffect(() => {
    setDialogOpen(open);
  }, [open, setDialogOpen]);

  const dispatchCartUpdate = useCallback(() => {
    window.dispatchEvent(new Event('cart-updated'));
  }, []);

  const handleQuantityChange = useCallback((id: string, delta: number) => {
    setQuantities((prev) => {
      const currentQty = prev[id] ?? 0;
      const item = equipment.find((e) => e.id === id);
      if (!item) return prev;
      const usedInPkg = usedInPackages[id] || 0;
      const maxAvailable = item.available - usedInPkg;
      const newQty = Math.max(0, Math.min(maxAvailable, currentQty + delta));
      return { ...prev, [id]: newQty };
    });
    setTimeout(dispatchCartUpdate, 0);
  }, [equipment, usedInPackages, setQuantities, dispatchCartUpdate]);

  const removeItem = useCallback((id: string) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setTimeout(dispatchCartUpdate, 0);
  }, [setQuantities, dispatchCartUpdate]);

  const removePackage = useCallback((id: string) => {
    const updated = packageItems.filter(p => p.id !== id);
    setPackageItems(updated);
    localStorage.setItem('cyber_cart_packages', JSON.stringify(updated));
    setTimeout(dispatchCartUpdate, 0);
  }, [packageItems, dispatchCartUpdate]);

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0) + packageItems.length;

  // Cart content JSX
  const hasItems = totalItems > 0;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#BD20D3] border border-white/20 shadow-lg shadow-[#BD20D3]/30 flex items-center justify-center text-white hover:bg-[#BD20D3]/80 transition-all hover:scale-105 active:scale-95"
            aria-label="Otvoriť košík"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-[#BD20D3] text-xs font-bold flex items-center justify-center border-2 border-[#020721]">
                {totalItems}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent className="bg-[#0a0d1f] border-white/10 text-white w-full max-w-md rounded-l-3xl overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingBag className="text-[#BD20D3]" size={20} />
              Košík
            </SheetTitle>
          </SheetHeader>

          {!hasItems ? (
            <div className="text-center py-16 text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p>Košík je prázdny</p>
              <p className="text-xs mt-2">Pridajte si produkty na prenájom alebo balíky.</p>
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {/* Equipment items */}
              {Object.entries(quantities).map(([id, qty]) => {
                if (qty <= 0) return null;
                const item = equipment.find(e => e.id === id);
                if (!item) return null;
                const used = usedInPackages[id] || 0;
                const maxAvailable = item.available - used;
                return (
                  <div key={id} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                      <img src={item.main_image || item.images?.[0] || ''} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.price_per_day} € / deň</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(id, -1)}
                          disabled={qty <= 1}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(id, 1)}
                          disabled={qty >= maxAvailable}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}

              {/* Package items */}
              {packageItems.map((pkg) => (
                <div key={pkg.id} className="bg-gradient-to-br from-[#1A4BFF]/5 to-[#BD20D3]/5 border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                      <img src={pkg.image || ''} alt={pkg.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{pkg.name}</p>
                      <p className="text-xs text-gray-400">{pkg.price} € / víkend</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePackage(pkg.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {pkg.extras.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5 space-y-1">
                      {pkg.extras.map((extra, i) => (
                        <p key={i} className="text-xs text-gray-400 ml-4">{extra.label}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Price summary */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Spolu</span>
                  <span className="text-white font-bold">
                    {equipment.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price_per_day, 0) +
                      packageItems.reduce((sum, pkg) => sum + pkg.price + pkg.deliveryPrice + pkg.installPrice, 0)} €
                  </span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <MapPicker
        open={showMap}
        onOpenChange={setShowMap}
        onLocationSelect={() => {}}
      />
    </>
  );
};

export default FloatingCart;