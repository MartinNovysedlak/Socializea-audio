"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import { EquipmentItem } from '@/lib/supabase';

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <EquipmentCatalog 
          equipment={equipment} 
          loading={equipment.length === 0} 
          quantities={quantities} 
          setQuantities={setQuantities} 
        />
      </div>
      <FloatingCart 
        quantities={quantities} 
        setQuantities={setQuantities} 
        equipment={equipment} 
      />
      <Footer />
    </main>
  );
};

export default Prenajom;