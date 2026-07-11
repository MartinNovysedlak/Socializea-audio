"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { EquipmentItem } from '@/lib/supabase';

export interface PackageCartItem {
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

interface CartContextType {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  packageItems: PackageCartItem[];
  setPackageItems: React.Dispatch<React.SetStateAction<PackageCartItem[]>>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  addPackage: (pkg: PackageCartItem) => void;
  removePackage: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("cyber_cart_quantities");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [packageItems, setPackageItems] = useState<PackageCartItem[]>(() => {
    try {
      const saved = localStorage.getItem("cyber_cart_packages");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem("cyber_cart_quantities", JSON.stringify(quantities)); } catch {}
  }, [quantities]);

  useEffect(() => {
    try { localStorage.setItem("cyber_cart_packages", JSON.stringify(packageItems)); } catch {}
  }, [packageItems]);

  const totalEquipmentQty = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalItems = totalEquipmentQty + packageItems.length;

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const addPackage = useCallback((pkg: PackageCartItem) => {
    setPackageItems(prev => [...prev, pkg]);
  }, []);

  const removePackage = useCallback((id: string) => {
    setPackageItems(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <CartContext.Provider value={{
      quantities,
      setQuantities,
      packageItems,
      setPackageItems,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      totalItems,
      addPackage,
      removePackage,
    }}>
      {children}
    </CartContext.Provider>
  );
};