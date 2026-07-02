"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Music2, Zap } from 'lucide-react';

const RentalSummary = () => {
  return (
    <section className="py-8 sm:py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" 
                    alt="Profesionálna audio technika" 
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020721]/50 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#BD20D3]/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
                  Služby prenájmu
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                  Prenájom aparatúry <br />
                  <span className="text-gray-500">bez starostí</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
                  Ak hľadáte zvuk a svetlo na prenájom, ste na správnom mieste! 
                  Náš sortiment ozvučovacieho a osvetľovacieho vybavenia je tu, aby vašu udalosť pretvoril do nezabudnuteľného zážitku.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 py-2 sm:py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10 shrink-0">
                      <Music2 className="text-[#BD20D3]" size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold text-sm sm:text-base">Krištáľový zvuk</h4>
                      <p className="text-xs sm:text-sm text-gray-400">Špičková technika od svetových značiek.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg border border-white/10 shrink-0">
                      <Zap className="text-[#1A4BFF]" size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-semibold text-sm sm:text-base">Svetelná show</h4>
                      <p className="text-xs sm:text-sm text-gray-400">Atmosféra, ktorá ohúri každého hosťa.</p>
                    </div>
                  </div>
                </div>

                <Link to="/prenajom" className="inline-block w-full sm:w-auto">
                  <Button className="btn-cyber h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg group border-none w-full sm:w-auto">
                    Objaviť možnosti prenájmu
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalSummary;