"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-transparent">
      {/* Decorative corner gradient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#BD20D3]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-float-delayed pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto animate-fade-slide-up">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 lg:p-12 backdrop-blur-xl overflow-hidden relative shadow-[0_0_50px_rgba(189,32,211,0.05)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(189,32,211,0.1)] hover:border-[#BD20D3]/30 group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br transition-all duration-700 group-hover:w-full group-hover:via-[#BD20D3]/60" />
            
            <div className="max-w-4xl mx-auto text-center animate-fade-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-8 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(189,32,211,0.3)] cursor-default">
                <Sparkles size={16} className="animate-pulse" />
                <span>Prémiová technika pre vaše podujatia</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1] animate-fade-slide-up" style={{ animationDelay: '0.3s' }}>
                Profesionálny prenájom a predaj <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] animate-pulse duration-10000 bg-[length:200%_200%] animate-gradient-shift">
                  zvukovej a svetelnej techniky
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-slide-up" style={{ animationDelay: '0.45s' }}>
                Zabezpečte si špičkový zvuk a dychberúce osvetlenie pre vašu svadbu, firemný večierok alebo súkromnú párty. Kvalita, na ktorú sa môžete spoľahnúť.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-slide-up" style={{ animationDelay: '0.6s' }}>
                <Link to="/prenajom" className="w-full sm:w-auto group/btn">
                  <Button 
                    size="lg" 
                    className="btn-cyber text-lg px-8 py-7 rounded-full w-full group border-none transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(189,32,211,0.8)] animate-pulse-glow"
                  >
                    Spočítať cenu prenájmu
                    <ChevronRight className="ml-2 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/predaj" className="w-full sm:w-auto group/btn">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-[#1A4BFF] text-[#1A4BFF] hover:bg-[#1A4BFF]/10 text-lg px-8 py-7 rounded-full w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[#BD20D3] hover:text-white hover:shadow-[0_0_20px_rgba(189,32,211,0.3)] bg-transparent"
                  >
                    Pozrieť ponuku na predaj
                    <ChevronRight className="ml-2 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr transition-all duration-700 group-hover:w-full group-hover:via-[#1A4BFF]/60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;