"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingBag, ChevronRight, Filter, Check } from 'lucide-react';
import { salesService, SalesItem } from '@/lib/salesService';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/lib/utils';

const Predaj = () => {
  usePageMeta(
    'Predaj techniky – Socializea-audio | Žilina, Čadca, Kysuce',
    'Kúpte si profesionálnu zvukovú a svetelnú techniku v Žiline a Čadci. Nové kusy aj overený B-Stock. Osobný odber, faktúra, záruka. Prezrite si ponuku!'
  );

  const [items, setItems] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'used'>('all');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const data = await salesService.getAll();
      setItems(data);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter(item => item.condition === activeFilter);

  return (
    <main className="min-h-screen bg-[#020721] relative overflow-hidden">
      <Navbar />

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />
      
      <div className="pt-24 md:pt-32 pb-16 md:pb-24 container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-10 md:mb-16 animate-fade-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 text-[#1A4BFF] text-xs md:text-sm font-medium mb-4 md:mb-6 shadow-[0_0_15px_rgba(26,75,255,0.2)]">
            <ShoppingBag size={14} />
            <span>Predaj profesionálnej audio & svetelnej techniky v Žiline a Čadci</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Profesionálne vybavenie priamo pre vaše potreby – <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3]">
              predaj techniky v Žiline, Čadci a Kysuciach
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2">
            Vyberte si zo širokej ponuky úplne nových kusov od svetových značiek alebo prevereného B-Stock bazáru so zárukou.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl backdrop-blur-md animate-fade-slide-up [animation-delay:0.1s]">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#BD20D3]" />
            <span className="text-xs md:text-sm text-gray-300 font-semibold">Filtrovať podľa stavu:</span>
          </div>
          <div className="flex gap-1 md:gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { id: 'all', label: 'Všetko' },
              { id: 'new', label: 'Nové produkty' },
              { id: 'used', label: 'B-Stock / Bazár' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={cn(
                  "px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-sm font-semibold transition-all whitespace-nowrap",
                  activeFilter === f.id ? 'bg-[#BD20D3] text-white shadow-[0_0_15px_rgba(189,32,211,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Načítavam produkty pre vás...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-white/5 border border-white/10 rounded-2xl max-w-5xl mx-auto">
            Žiadne produkty nezodpovedajú zvolenému filtru.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {filteredItems.map((item, index) => {
              const mainImg = item.images?.[0] || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80';
              return (
                <ScrollReveal key={item.id} direction="up" delay={index * 0.1}>
                  <Link 
                    to={`/predaj/${item.id}`} 
                    className="block h-full group"
                  >
                    <Card 
                      className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden hover:border-[#BD20D3]/50 hover:shadow-[0_0_40px_rgba(189,32,211,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative"
                    >
                      <div className="h-52 md:h-72 lg:h-80 overflow-hidden relative bg-black/40 border-b border-white/5">
                        <img 
                          src={mainImg} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                          <span className={cn(
                            "px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm",
                            item.condition === 'new' 
                              ? 'bg-cyan-600/90 border border-cyan-400/50 text-white' 
                              : 'bg-amber-600/90 border border-amber-400/50 text-white'
                          )}>
                            {item.condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}
                          </span>
                        </div>
                        
                        {!item.available && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold uppercase tracking-widest">
                              Vypredané
                            </span>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pt-4 md:pt-6 px-4 md:px-6">
                        <CardTitle className="text-lg md:text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors line-clamp-2">
                          {item.name}
                        </CardTitle>
                        <p className="text-gray-400 text-xs md:text-sm line-clamp-2 md:line-clamp-3 mt-2">
                          {item.description}
                        </p>
                      </CardHeader>

                      <CardContent className="px-4 md:px-6 space-y-3 flex-grow">
                        {item.features && item.features.length > 0 && (
                          <ul className="space-y-1.5 md:space-y-2">
                            {item.features.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] md:text-xs text-gray-300">
                                <Check size={12} className="text-[#BD20D3] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>

                      <CardFooter className="border-t border-white/5 pt-4 md:pt-6 pb-4 md:pb-6 px-4 md:px-6 flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-[10px] md:text-xs text-gray-400 block uppercase font-bold">Cena s DPH</span>
                          <span className="text-2xl md:text-3xl font-extrabold text-[#BD20D3]">{item.price} €</span>
                        </div>
                        
                        <Button 
                          asChild
                          className={cn(
                            "h-10 md:h-12 px-4 md:px-6 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all",
                            item.available 
                              ? 'btn-cyber border-none text-white' 
                              : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                          )}
                        >
                          <div>
                            Mám záujem
                            <ChevronRight size={14} className="ml-1" />
                          </div>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default Predaj;