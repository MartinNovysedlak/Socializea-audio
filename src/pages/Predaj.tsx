"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingBag, ChevronRight, Filter, Info, ShieldCheck, HelpCircle, Check, Tag, Phone } from 'lucide-react';
import { salesService, SalesItem } from '@/lib/salesService';
import { toast } from 'sonner';

const Predaj = () => {
  const [items, setItems] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'used'>('all');
  const [selectedItem, setSelectedItem] = useState<SalesItem | null>(null);

  // Inquiry Form State inside Detail Modal
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

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

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) {
      toast.error('Prosím vyplňte vaše meno a email!');
      return;
    }

    toast.success('Dopyt na kúpu bol odoslaný!', {
      description: `Budeme vás kontaktovať ohľadom produktu ${selectedItem?.name} čo najskôr.`
    });

    setInquiryName('');
    setInquiryPhone('');
    setInquiryEmail('');
    setInquiryMessage('');
    setSelectedItem(null);
  };

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
                <Card 
                  key={item.id} 
                  className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl overflow-hidden hover:border-[#BD20D3]/40 transition-all duration-300 flex flex-col group relative"
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
                    <CardTitle className="text-2xl font-bold text-white group-hover:text-[#BD20D3] transition-colors">
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

                  <CardFooter className="border-t border-white/5 pt-6 pb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 block uppercase font-bold">Cena s DPH</span>
                      <span className="text-3xl font-extrabold text-[#BD20D3]">{item.price} €</span>
                    </div>
                    
                    <Button 
                      onClick={() => item.available && setSelectedItem(item)}
                      disabled={!item.available}
                      className={`h-12 px-6 rounded-xl font-bold transition-all ${
                        item.available 
                          ? 'btn-cyber border-none text-white' 
                          : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Mám záujem
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAILED BUY INQUIRY POP-UP MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-[#BD20D3]/40 rounded-3xl p-6 md:p-8 relative shadow-2xl shadow-[#BD20D3]/25">
              
              <button 
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-8">
                {/* PRODUCT OVERVIEW */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                    <img 
                      src={selectedItem.images?.[0] || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600'} 
                      alt={selectedItem.name} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white font-extrabold text-xs">
                      {selectedItem.condition === 'new' ? 'Úplne nový kus' : 'Preverený B-Stock'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-3xl font-extrabold text-white mb-2">{selectedItem.name}</h2>
                    <div className="text-3xl font-extrabold text-[#BD20D3] mb-4">{selectedItem.price} €</div>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedItem.description}</p>
                  </div>

                  {/* Specifications and features tabs/lists */}
                  {selectedItem.specs && selectedItem.specs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technické parametre:</h4>
                      <ul className="space-y-1.5">
                        {selectedItem.specs.map((spec, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-[#BD20D3] font-bold">•</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.features && selectedItem.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kľúčové výhody:</h4>
                      <ul className="space-y-1.5">
                        {selectedItem.features.map((f, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                            <span className="text-[#1A4BFF] font-bold">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                    <ShieldCheck size={28} className="text-[#BD20D3]" />
                    <div className="text-xs text-gray-400">
                      <p className="font-bold text-white mb-0.5">Záruka a preverený stav</p>
                      <p>Kupujete originálne, riadne zoservisované vybavenie priamo s faktúrou a zárukou.</p>
                    </div>
                  </div>
                </div>

                {/* DIRECT INQUIRY FORM */}
                <div className="w-full md:w-1/2 bg-black/25 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Mám záujem o kúpu</h3>
                    <p className="text-gray-400 text-xs mb-6">Napíšte nám vaše údaje a my vám pripravíme platobné podklady alebo dohodneme osobné prevzatie.</p>
                    
                    <form id="purchase-form" onSubmit={handleSendInquiry} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">Meno a priezvisko *</label>
                        <input 
                          type="text" 
                          required 
                          value={inquiryName} 
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Ján Novák" 
                          className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">E-mailová adresa *</label>
                        <input 
                          type="email" 
                          required 
                          value={inquiryEmail} 
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="jan@priklad.sk" 
                          className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">Telefónne číslo</label>
                        <input 
                          type="tel" 
                          value={inquiryPhone} 
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+421 ..." 
                          className="w-full bg-black/50 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">Poznámka / Otázka</label>
                        <textarea 
                          value={inquiryMessage} 
                          onChange={(e) => setInquiryMessage(e.target.value)}
                          placeholder="Mám záujem o doručenie na dobierku / osobne v Žiline..." 
                          className="w-full bg-black/50 border border-white/10 text-white rounded-xl min-h-[90px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <Button 
                      type="submit" 
                      form="purchase-form"
                      className="w-full btn-cyber h-12 rounded-xl font-bold border-none text-base"
                    >
                      Odoslať nezáväzný dopyt
                    </Button>
                    
                    <div className="text-[10px] text-gray-500 text-center">
                      Odoslaním dopytu súhlasíte so spracovaním osobných údajov pre účely vybavenia ponuky.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
};

export default Predaj;