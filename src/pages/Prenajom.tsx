"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import { useEquipment } from '@/hooks/useEquipment';

const Prenajom = () => {
  const { equipment, loading } = useEquipment();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <EquipmentCatalog 
          equipment={equipment} 
          loading={loading} 
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