"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Catalog from '@/components/Catalog';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import RentalCalculator from '@/components/RentalCalculator';
import Footer from '@/components/Footer';

const Prenajom = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <Catalog />
        <EquipmentCatalog />
        <RentalCalculator />
      </div>
      <Footer />
    </main>
  );
};

export default Prenajom;