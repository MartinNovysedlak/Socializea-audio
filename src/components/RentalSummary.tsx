"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music2, Zap, ShieldCheck } from 'lucide-react';

const RentalSummary = () => {
  return (
    <section className="py-24 bg-[#020721] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" 
                alt="Profesionálna audio technika" 
                className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020721] via-transparent to-transparent" />
            </div>
            {/* Decorative floating elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#BD20D3]/20 rounded-full blur-3xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#1A4BFF]/20 rounded-full blur-3xl" />
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
              Služby prenájmu
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Prenájom aparatúry <br />
              <span className="text-gray-500">bez starostí</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Ak hľadáte zvuk a svetlo na prenájom, ste na správnom mieste! 
              Náš sortiment ozvučovacieho a osvetľovacieho vybavenia je tu, aby vašu udalosť pretvoril do nezabudnuteľného zážitku.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10">
                  <Music2 className="text-[#BD20D3]" size={18} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Krištáľový zvuk</h4>
                  <p className="text-sm text-gray-400">Špičková technika od svetových značiek.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10">
                  <Zap className="text-[#1A4BFF]" size={18} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Svetelná show</h4>
                  <p className="text-sm text-gray-400">Atmosféra, ktorá ohúri každého hosťa.</p>
                </div>
              </div>
            </div>

            <Link to="/prenajom" className="inline-block">
              <Button className="btn-cyber h-14 px-8 rounded-xl text-lg group border-none">
                Objaviť možnosti prenájmu
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalSummary;