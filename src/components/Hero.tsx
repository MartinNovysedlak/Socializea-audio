"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-transparent">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 lg:p-12 backdrop-blur-xl overflow-hidden relative shadow-[0_0_50px_rgba(189,32,211,0.05)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(189,32,211,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="max-w-4xl mx-auto text-center animate-fade-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-8 transition-transform duration-300 hover:scale-105 cursor-default">
                <Sparkles size={16} className="animate-pulse" />
                <span>Prenájom aparatúry v Žiline, Čadci a Kysuciach</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                Profesionálny prenájom aparatúry v Žiline, Čadci a celých Kysuciach <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] animate-pulse duration-10000">
                  zvukovej a svetelnej techniky na vaše podujatie
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Zabezpečte si špičkový zvuk a dychberúce osvetlenie pre vašu svadbu, firemný večierok alebo súkromnú párty v Žiline, Čadci a okolí. Poctive kysucké služby s osobným prístupom a dopravou po celom regióne.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/prenajom" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="btn-cyber text-lg px-8 py-7 rounded-full w-full group border-none transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(189,32,211,0.8)]"
                  >
                    Spočítať cenu prenájmu
                    <ChevronRight className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/predaj" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-[#1A4BFF] text-[#1A4BFF] hover:bg-[#1A4BFF]/10 text-lg px-8 py-7 rounded-full w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[#BD20D3] hover:text-white hover:shadow-[0_0_20px_rgba(189,32,211,0.3)] bg-transparent"
                  >
                    Pozrieť ponuku na predaj
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

export default Hero;