"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

const SalesSummary = () => {
  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A4BFF]/10 border border-[#1A4BFF]/20 text-[#1A4BFF] text-xs font-bold uppercase tracking-widest">
                  Predaj techniky
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Vybavte sa <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3]">profesionálne</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Okrem prenájmu ponúkame aj predaj špičkovej techniky pre profesionálov aj nadšencov. 
                  Získajte vybavenie, ktoré vydrží a posunie vašu produkciu na novú úroveň.
                </p>

                <ul className="space-y-4">
                  {[
                    "Autorizovaný predajca svetových značiek",
                    "Odborné poradenstvo pri výbere",
                    "Záručný a pozáručný servis",
                    "Možnosť vyskúšania techniky"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2 className="text-[#1A4BFF]" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/predaj" className="inline-block">
                  <Button className="btn-cyber h-14 px-8 rounded-xl text-lg group border-none">
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Prejsť do ponuky predaja
                  </Button>
                </Link>
              </div>
              
              <div className="w-full lg:w-1/2">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-7 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800" 
                      alt="Audio technika" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="col-span-5 space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=600" 
                        alt="Svetelná technika" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    </div>
                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#1A4BFF] to-[#BD20D3] p-6 flex items-center justify-center text-center">
                      <p className="text-white font-bold text-lg leading-tight">
                        Nová <br /> technika <br /> skladom
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesSummary;