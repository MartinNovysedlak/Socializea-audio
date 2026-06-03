"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#020721]">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>Prémiová technika pre vaše podujatia</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
            Profesionálny prenájom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]">
              zvukovej a svetelnej techniky
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Zabezpečte si špičkový zvuk a dychberúce osvetlenie pre vašu svadbu, firemný večierok alebo súkromnú párty. Kvalita, na ktorú sa môžete spoľahnúť.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/prenajom" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="btn-cyber text-lg px-8 py-7 rounded-full w-full group border-none"
              >
                Spočítať cenu prenájmu
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/prenajom" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-[#1A4BFF] text-[#1A4BFF] hover:bg-[#1A4BFF]/10 hover:text-white text-lg px-8 py-7 rounded-full w-full transition-all duration-300"
              >
                Pozrieť ponuku
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020721] to-transparent" />
    </section>
  );
};

export default Hero;