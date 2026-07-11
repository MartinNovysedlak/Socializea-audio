"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { EquipmentItem } from '@/lib/supabase';

interface CartContextType {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalItems: number;
}

const CartContext = createContext<CartContextType>({
  quantities: {},
  setQuantities: () => {},
  cartOpen: false,
  setCartOpen: () => {},
  totalItems: 0,
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("cyber_cart_quantities");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  useEffect(() => {
    try {
      localStorage.setItem("cyber_cart_quantities", JSON.stringify(quantities));
    } catch {
      console.error("Nedá sa uložiť košík do localStorage");
    }
  }, [quantities]);

  return (
    <CartContext.Provider value={{ quantities, setQuantities, cartOpen, setCartOpen, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};