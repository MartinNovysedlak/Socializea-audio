"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom'; // Add this import

interface EquipmentItem {
  id: string;
  name: string;
  category: 'sound' | 'lighting' | 'other';
  pricePerDay: number;
  available: number;
  image: string; // New field for image path
  description: string; // New field for short description
}

const equipmentData: EquipmentItem[] = [
  // Sound
  { 
    id: 'mixer-x1222', 
    name: 'Mixážny pult Behringer Xenyx X1222 USB', 
    category: 'sound', 
    pricePerDay: 25, 
    available: 1,
    image: '/images/mixer-x1222.png', // Example image path
    description: 'Professional mixing console with USB connectivity'
  },
  // ... (add similar fields for all items)
];

// ... (rest of the component remains similar)

// In the map function for filteredEquipment:
{filteredEquipment.map((item) => (
  <Card key={item.id} className="bg-white/5 border border-white/10 hover:border-[#BD20D3]/30 transition-all duration-300">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        {/* Add image/icon here */}
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-16 h-16 rounded-lg mb-2" 
        />
        <CardTitle className="text-white text-base leading-tight">{item.name}</CardTitle>
        <span className="text-xs px-2 py-1 rounded-full bg-[#BD20D3]/10 text-[#BD20D3] font-medium whitespace-nowrap">
          {getCategoryLabel(item.category)}
        </span>
      </div>
    </CardHeader>
    {/* ... rest of the card content */}
  </Card>
))}

<dyad-write path="src/pages/Prenajom.tsx" description="Update Prenajom page to include detail page links.">
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