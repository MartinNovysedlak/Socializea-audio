"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import Footer from '@/components/Footer';

const Prenajom = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <EquipmentCatalog />
      </div>
      <Footer />
    </main>
  );
};

export default Prenajom;