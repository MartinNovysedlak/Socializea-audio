"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveQuiz from '@/components/InteractiveQuiz';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Zap, 
  Check, 
  ShieldCheck, 
  Clock, 
  Heart,
  Music
} from 'lucide-react';
import { packagesData } from '@/data/packages';

const Index = () => {
  return (
    <div className="bg-[#030712] min-h-screen relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1A4BFF]/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center max-w-6xl mx-auto space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wider uppercase">
          <span className="text-[#BD20D3]">NEW</span>
          <span>Inteligentná konfigurácia aparatúry</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
          Profesionálny zvuk & svetlá <br />
          <span className="bg-gradient-to-r from-[#1A4BFF] via-[#BD20D3] to-[#BD20D3] bg-clip-text text-transparent">
            bez zbytočných starostí
          </span>
        </h1>

        <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          Zapožičajte si špičkovú zvukovú a svetelnú techniku optimalizovanú pre akýkoľvek typ akcie. Oslavy, kluby, svadby, či firemné prezentácie.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            to="/prenajom" 
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3] text-white font-extrabold text-base hover:opacity-95 transition-all shadow-[0_0_25px_rgba(189,32,211,0.3)] hover:scale-105"
          >
            Prehliadať 8 Balíkov
          </Link>
          <a 
            href="#quiz" 
            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-base transition-all hover:bg-white/10"
          >
            Pomôcť s výberom
          </a>
        </div>
      </section>

      {/* QUIZ ANCHOR SECTION */}
      <section id="quiz" className="scroll-mt-20">
        <InteractiveQuiz />
      </section>

      {/* BRAND VALUES / BENEFITS */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-950/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">100% Spoloahlivosť</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Všetka technika je pred prenájmom dôkladne testovaná. Používame výhradne overené značky (Behringer, ADJ, BeamZ).
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#BD20D3]/10 border border-[#BD20D3]/30 flex items-center justify-center text-[#BD20D3] mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Rýchle zapojenie</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Naše sety dodávame s kompletnou farebne označenou kabelážou a inštrukciami pre bleskové zapojenie do 15 minút.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950/40 border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 flex items-center justify-center text-[#1A4BFF] mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold text-white">Podpora 24/7</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Počas trvania prenájmu sme vám plne k dispozícii na telefóne pre akékoľvek nečakané situácie alebo technické otázky.
            </p>
          </div>
        </div>
      </section>

      {/* SAMPLE PACKAGES PREVIEW SECTION */}
      <section className="py-16 px-4 bg-slate-950/20 border-t border-white/5">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white">Ukážka našich balíkov</h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Zoznámte sa s najobľúbenejšími balíkmi našich zákazníkov pre svadby aj klubové noci.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packagesData.slice(2, 5).map((pkg) => (
              <div key={pkg.id} className="bg-slate-950/80 border border-white/5 rounded-3xl overflow-hidden flex flex-col justify-between">
                <div className="relative h-48">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-emerald-400 font-bold text-sm">
                    {pkg.price} € / deň
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="font-extrabold text-white text-lg line-clamp-1">{pkg.name}</h4>
                  <p className="text-gray-400 text-xs line-clamp-2">{pkg.desc}</p>
                </div>
                <div className="p-6 pt-0">
                  <Link 
                    to="/prenajom" 
                    className="block text-center w-full bg-white/5 hover:bg-white/10 text-white font-semibold text-xs py-3 rounded-xl transition-all"
                  >
                    Detail balíka
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/prenajom" 
              className="inline-flex items-center gap-2 text-sm text-[#BD20D3] font-bold hover:underline"
            >
              Zobraziť všetkých 8 prepracovaných balíkov <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;