"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';

const DJSection = () => {
  return (
    <section className="py-24 bg-[#020721] border-t border-white/5 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#BD20D3]/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-2xl flex items-center justify-center text-[#BD20D3] mx-auto mb-8">
            <Music size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Potrebujete <span className="text-[#BD20D3]">DJ-a</span> pre vašu udalosť?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10">
            Chystáte sa na oslavu, stužkovú, jubileum alebo inú udalosť a hľadáte toho pravého <span className="text-[#BD20D3] font-semibold">DJ-a</span>? 
            Neváhajte nás kontaktovať! S naším profesionálnym prístupom a širokou paletou hudobných štýlov sa postaráme o to, aby vaša akcia zaznela presne tak, ako si ju predstavujete.
          </p>
          <Button className="btn-cyber h-14 px-10 rounded-xl text-lg border-none">
            Kontaktujte nás
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DJSection;