"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingBag, ChevronRight, Filter, Check } from 'lucide-react';
import { salesService, SalesItem } from '@/lib/salesService';
import { Link } from 'react-router-dom';

const Predaj = () => {
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
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-4">
        {/* HEADER SECTION */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A4BFF]/10 border border-[#1A4BFF]/30 text-[#1A4BFF] text-sm font-medium mb-6">
            <ShoppingBag size={16} />
            <span>Predaj profesionálnej audio & svetelnej techniky</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Profesionálne vybavenie <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A4BFF] to-[#BD20D3]">
              priamo pre vaše potreby
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Vyberte si zo širokej ponuky úplne nových kusov od svetových značiek alebo prevereného B-Stock bazáru so zárukou.
          </p>
        </div>

        {/* CONTROLS / FILTERS */}
        <div className="max-w-5xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#BD20D3]" />
            <span className="text-sm text-gray-300 font-semibold">Filtrovať podľa stavu:</span>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'Všetko' },
              { id: 'new', label: 'Nové produkty' },
              { id: 'used', label: 'B-Stock / Bazár' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#BD20D3] text-white shadow-[0_0_15px_rgba(189,32,211,0.5)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center text-gray-400 py-16">Načítavam produkty pre vás...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-gray-400 py-16 bg-white/5 border border-white/10 rounded-2xl max-w-5xl mx-auto">
            Žiadne produkty nezodpovedajú zvolenému filtru.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredItems.map(item => {
              const mainImg = item.images?.[0] || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80';
              return (
                <Link 
                  to={`/predaj/${item.id}`} 
                  key={item.id} 
                  className="block h-full group"
                >
                  <Card 
                    className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl overflow-hidden hover:border-[#BD20D3]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* Image banner */}
                    <div className="h-56 overflow-hidden relative bg-black/40 border-b border-white/5">
                      <img 
                        src={mainImg} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest ${
                          item.condition === 'new' 
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400' 
                            : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        }`}>
                          {item.condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}
                        </span>
                      </div>
                      
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-widest">
                            Vypredané
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <CardHeader className="pt-6">
                      <CardTitle className="text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors line-clamp-2">
                        {item.name}
                      </CardTitle>
                      <p className="text-gray-400 text-sm line-clamp-3 mt-2">
                        {item.description}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-grow">
                      {/* Key features limit to 3 */}
                      {item.features && item.features.length > 0 && (
                        <ul className="space-y-2">
                          {item.features.slice(0, 3).map((f, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                              <Check size={14} className="text-[#BD20D3] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>

                    <CardFooter className="border-t border-white/5 pt-6 pb-6 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xs text-gray-400 block uppercase font-bold">Cena s DPH</span>
                        <span className="text-3xl font-extrabold text-[#BD20D3]">{item.price} €</span>
                      </div>
                      
                      <Button 
                        asChild
                        className={`h-12 px-6 rounded-xl font-bold transition-all ${
                          item.available 
                            ? 'btn-cyber border-none text-white' 
                            : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <div>
                          Mám záujem
                          <ChevronRight size={16} className="ml-1" />
                        </div>
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
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