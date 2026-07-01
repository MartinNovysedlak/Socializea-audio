"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EquipmentItem } from '@/lib/supabase';
import { rentalService } from '@/lib/rentalService';

interface CartContextType {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cyber_cart_quantities';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      console.error('Nedá sa uložiť košík do localStorage');
    }
  }, [quantities]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.from('rental_equipment').select('*');
        if (error) throw error;
        if (data) setEquipment(data as EquipmentItem[]);
      } catch {
        // fallback: try rentalService
        try {
          const data = await rentalService.getAll();
          if (data && Array.isArray(data)) setEquipment(data as unknown as EquipmentItem[]);
        } catch {
          // silent fail
        }
      }
    };
    fetchEquipment();
  }, []);

  return (
    <CartContext.Provider value={{ quantities, setQuantities, equipment }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within a CartProvider');
  return ctx;
};