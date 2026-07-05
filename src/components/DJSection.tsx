"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, Headphones, Mic2, Disc, Zap } from 'lucide-react';

const DJSection = () => {
  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="absolute inset-0 z-0 opacity-10">
              <img 
                src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=2000" 
                alt="DJ at work" 
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020721]/80 via-transparent to-[#020721]/80" />
            </div>

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#BD20D3]/10 rounded-full blur-[100px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">
              <div className="w-full lg:w-2/5 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#BD20D3]/20 to-transparent border border-white/10 flex flex-col items-center justify-center text-center p-4">
                    <Music className="text-[#BD20D3] mb-2" size={32} />
                    <span className="text-xs font-bold text-white uppercase">Svadby</span>
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1A4BFF]/20 to-transparent border border-white/10 flex flex-col items-center justify-center text-center p-4">
                    <Mic2 className="text-[#1A4BFF] mb-2" size={32} />
                    <span className="text-xs font-bold text-white uppercase">Eventy</span>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center p-4">
                    <Disc className="text-gray-400 mb-2" size={32} />
                    <span className="text-xs font-bold text-white uppercase">Párty</span>
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#BD20D3]/20 to-transparent border border-white/10 flex flex-col items-center justify-center text-center p-4">
                    <Zap className="text-[#BD20D3] mb-2" size={32} />
                    <span className="text-xs font-bold text-white uppercase">Oslavy</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-3/5 space-y-8 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-[#BD20D3]">
                  <Headphones size={24} />
                  <span className="font-bold uppercase tracking-widest text-sm">Profesionálny hudobný doprovod</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Potrebujete <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">DJ-a</span> pre vašu udalosť?
                </h2>
                
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Chystáte sa na oslavu, stužkovú, jubileum alebo inú udalosť a hľadáte toho pravého DJ-a? 
                  S naším profesionálnym prístupom a širokou paletou hudobných štýlov sa postaráme o to, aby vaša akcia zaznela presne tak, ako si ju predstavujete.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button className="btn-cyber h-14 px-10 rounded-xl text-lg group border-none">
                    Kontaktujte nás
                  </Button>
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

export default DJSection;