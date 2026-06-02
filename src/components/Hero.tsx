"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
  const scrollToCalculator = () => {
    const element = document.getElementById('kalkulacka');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-black">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>Prémiová technika pre vaše podujatia</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Profesionálny prenájom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              zvukovej a svetelnej techniky
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Zabezpečte si špičkový zvuk a dychberúce osvetlenie pre vašu svadbu, firemný večierok alebo súkromnú párty. Kvalita, na ktorú sa môžete spoľahnúť.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToCalculator}
              size="lg" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-7 rounded-full w-full sm:w-auto group"
            >
              Spočítať cenu prenájmu
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-7 rounded-full w-full sm:w-auto"
            >
              Pozrieť ponuku
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default Hero;