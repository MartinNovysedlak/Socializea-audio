"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

const SalesSummary = () => {
  return (
    <section className="py-24 bg-[#020721] border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600" 
                alt="Audio technika" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 mt-8">
              <img 
                src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=600" 
                alt="Svetelná technika" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">Predaj aparatúry</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Okrem prenájmu ponúkame aj predaj špičkovej techniky pre profesionálov aj nadšencov. 
              Získajte vybavenie, ktoré vydrží a posunie vašu produkciu na novú úroveň.
            </p>
            <Link to="/predaj">
              <Button className="btn-cyber h-14 px-8 rounded-xl text-lg group border-none">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Zobraziť viac
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesSummary;