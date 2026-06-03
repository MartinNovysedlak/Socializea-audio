"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag } from 'lucide-react';

const Predaj = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-40 pb-24 container mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full flex items-center justify-center mx-auto mb-8 text-[#BD20D3]">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Predaj techniky</h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Pripravujeme pre vás ponuku profesionálnej techniky na predaj. Čoskoro tu nájdete špičkové reproduktory, svetlá a príslušenstvo.
        </p>
      </div>
      <Footer />
    </main>
  );
};

export default Predaj;