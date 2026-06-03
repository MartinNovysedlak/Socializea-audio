"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const RentalSummary = () => {
  return (
    <section className="py-24 bg-[#020721] border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Prenájom aparatúry</h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10">
            Ak hľadáte zvuk a svetlo na prenájom, ste na správnom mieste! 
            Náš sortiment ozvučovacieho a osvetľovacieho vybavenia je tu, aby vašu udalosť pretvoril do nezabudnuteľného zážitku. 
            Objavte naše možnosti prenájmu a vytvorte ideálnu atmosféru pre vašu akciu.
          </p>
          <Link to="/prenajom">
            <Button className="btn-cyber h-14 px-8 rounded-xl text-lg group border-none">
              Zistiť viac
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RentalSummary;