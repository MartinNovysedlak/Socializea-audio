"use client";

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import PackageSection from '@/components/PackageSection';
import ScrollReveal from '@/components/ScrollReveal';
import { EquipmentItem } from '@/lib/supabase';

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
  usedInPackages?: Record<string, number>;
}

const Prenajom = ({ quantities, setQuantities, equipment, usedInPackages = {} }: PrenajomProps) => {
  return (
    <>
      <Helmet>
        <title>Prenájom Audio & Svetelnej Techniky | Socializea Audio</title>
        <meta name="description" content="Profesionálny prenájom zvukovej a svetelnej techniky pre svadby, koncerty, párty, firemné akcie. Kvalitné ozvučenie a efekty na prenájom. Socializea-audio." />
      </Helmet>

      <main className="min-h-screen bg-[#020721] overflow-hidden">
        <Navbar />
        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            <ScrollReveal direction="up" delay={0.1}>
              <PackageSection
                quantities={quantities}
                setQuantities={setQuantities}
                equipment={equipment}
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <EquipmentCatalog
                equipment={equipment}
                loading={equipment.length === 0}
                quantities={quantities}
                setQuantities={setQuantities}
                usedInPackages={usedInPackages}
              />
            </ScrollReveal>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Prenajom;