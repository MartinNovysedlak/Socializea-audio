"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-[#020721]">
      {/* Background Ambient Glow Layer (Blurred Blobs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 - Top Left Purple */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#BD20D3]/20 blur-[100px] md:blur-[150px] animate-float-slow" />
        
        {/* Blob 2 - Bottom Right Blue */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full bg-[#1A4BFF]/15 blur-[100px] md:blur-[150px] animate-float-delayed" />
        
        {/* Blob 3 - Center Top Blue-Violet */}
        <div className="absolute top-[10%] right-[15%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] rounded-full bg-[#1A4BFF]/10 blur-[100px] md:blur-[130px] animate-float-slow [animation-delay:4s]" />
        
        {/* Blob 4 - Center Left Magenta-Pink */}
        <div className="absolute bottom-[15%] left-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full bg-[#BD20D3]/12 blur-[90px] md:blur-[120px] animate-float-delayed [animation-delay:6s]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 lg:p-12 backdrop-blur-xl overflow-hidden relative shadow-[0_0_50px_rgba(189,32,211,0.05)] transition-all duration-500 hover:shadow-[0_0_60px_rgba(189,32,211,0.1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="max-w-4xl mx-auto text-center animate-fade-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#BD20D3]/30 text-[#BD20D3] text-sm font-medium mb-8 transition-transform duration-300 hover:scale-105 cursor-default">
                <Sparkles size={16} className="animate-pulse" />
                <span>Prémiová technika pre vaše podujatia</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                Profesionálny prenájom <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] animate-pulse duration-10000">
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
                    className="btn-cyber text-lg px-8 py-7 rounded-full w-full group border-none transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(189,32,211,0.8)]"
                  >
                    Spočítať cenu prenájmu
                    <ChevronRight className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/prenajom" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-[#1A4BFF] text-[#1A4BFF] hover:bg-[#1A4BFF]/10 text-lg px-8 py-7 rounded-full w-full transition-all duration-300 hover:scale-105 active:scale-95 hover:border-[#BD20D3] hover:text-white hover:shadow-[0_0_20px_rgba(189,32,211,0.3)] bg-transparent"
                  >
                    Pozrieť ponuku
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