"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Music, Mic, Layers, Calendar, Check, Send } from 'lucide-react';

interface AudioItem {
  id: string;
  name: string;
  category: 'reproduktory' | 'mikrofony' | 'mixpulty' | 'sety';
  description: string;
  pricePerDay: number;
  image: string;
  specs: string[];
}

const rentalItems: AudioItem[] = [
  {
    id: '1',
    name: 'Profesionálny L-Acoustics Sound System',
    category: 'sety',
    description: 'Kompletný prémiový zvukový set vhodný pre festivaly, koncerty a veľké firemné akcie.',
    pricePerDay: 450,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    specs: ['Výkon: 10kW RMS', '2x Subwoofer, 4x Line Array', 'Zosilňovače s DSP', 'Vrátane kabeláže a montáže']
  },
  {
    id: '2',
    name: 'Pioneer DJ XDJ-XZ',
    category: 'mixpulty',
    description: 'Profesionálny all-in-one DJ systém pre USB, rekordbox a Serato DJ Pro.',
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    specs: ['4-kanálový mixpult', 'Veľké jog wheels s displejom', 'Špičkové efekty Color FX a Beat FX']
  },
  {
    id: '3',
    name: 'Bezdrôtový set Shure QLXD24/SM58',
    category: 'mikrofony',
    description: 'Vokálový bezdrôtový mikrofón s legendárnou vložkou SM58 pre čistý a stabilný prenos.',
    pricePerDay: 45,
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=800',
    specs: ['Digitálny bezdrôtový prenos', 'Frekvenčný rozsah 20Hz - 20kHz', 'Dosah až 100 metrov', 'Výdrž batérie až 9 hodín']
  },
  {
    id: '4',
    name: 'Aktívny reproduktor JBL PRX815',
    category: 'reproduktory',
    description: 'Vysoko výkonný aktívny dvojpásmový reproduktor s Wi-Fi ovládaním a skvelým prednesom.',
    pricePerDay: 35,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    specs: ['Výkon: 1500W', '15" basový menič', 'Zabudované Wi-Fi pre DSP nastavenia', 'Robustná drevená ozvučnica']
  }
];

const Prenajom = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<AudioItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateFrom: '',
    dateTo: '',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredItems = activeCategory === 'all' 
    ? rentalItems 
    : rentalItems.filter(item => item.category === activeCategory);

  const handleBookClick = (item: AudioItem) => {
    setSelectedItem(item);
    setFormData(prev => ({
      ...prev,
      notes: `Mám záujem o prenájom: ${item.name} (${item.pricePerDay}€ / deň)`
    }));
    const element = document.getElementById('booking-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', dateFrom: '', dateTo: '', notes: '' });
      setSelectedItem(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0a0d1f] text-white pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero sekcia */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white mb-4 px-4 py-1 rounded-full text-xs uppercase tracking-wider">
            Profesionálny prenájom
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 uppercase">
            Prenájom <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#4F46E5]">Audio Techniky</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Špičkové ozvučenie, bezdrôtové mikrofóny, DJ technika a kompletné zvukové sety pre akékoľvek podujatie od rodinných osláv až po festivaly.
          </p>
        </div>

        {/* Filtre kategórií */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'all', label: 'Všetko', icon: Volume2 },
            { id: 'sety', label: 'Sety na kľúč', icon: Layers },
            { id: 'reproduktory', label: 'Reproduktory', icon: Music },
            { id: 'mikrofony', label: 'Mikrofóny', icon: Mic },
            { id: 'mixpulty', label: 'DJ & Mixpulty', icon: Volume2 }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                variant={activeCategory === cat.id ? "default" : "outline"}
                className={`rounded-full px-6 flex items-center gap-2 transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[#BD20D3] hover:bg-[#BD20D3]/90 text-white border-none' 
                    : 'border-white/10 hover:border-[#BD20D3]/50 text-gray-300 hover:text-white bg-transparent'
                }`}
              >
                <Icon size={16} />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Katalóg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-[#0e122b]/60 border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#BD20D3]/50 transition-all duration-300 group">
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/10 text-white">
                    {item.pricePerDay}€ / deň
                  </div>
                </div>
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="border-[#BD20D3]/30 text-[#BD20D3] text-[10px] uppercase">
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-white group-hover:text-[#BD20D3] transition-colors">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0">
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    {item.specs.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                        <Check size={14} className="text-[#BD20D3]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
              <CardFooter className="p-5 border-t border-white/5 bg-[#0e122b]/40">
                <Button 
                  onClick={() => handleBookClick(item)}
                  className="w-full bg-[#BD20D3] hover:bg-[#BD20D3]/90 text-white rounded-lg"
                >
                  Rezervovať techniku
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Rezervačný formulár */}
        <div id="booking-form" className="max-w-3xl mx-auto bg-[#0e122b]/80 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#BD20D3] to-[#4F46E5]" />
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <Calendar className="text-[#BD20D3]" />
              Rýchly dopyt na prenájom
            </h2>
            <p className="text-gray-400 text-sm">
              Vyplňte formulár a my vám obratom overíme dostupnosť techniky a vypracujeme nezáväznú cenovú ponuku.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center my-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Check className="text-emerald-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ďakujeme za dopyt!</h3>
              <p className="text-emerald-200/80 text-sm max-w-md mx-auto">
                Vaša požiadavka bola úspešne odoslaná. Náš tím vás bude čoskoro kontaktovať telefonicky alebo e-mailom pre potvrdenie detailov.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedItem && (
                <div className="bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400 block uppercase">Vybraná technika</span>
                    <span className="font-semibold text-white">{selectedItem.name}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setSelectedItem(null)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Zrušiť výber
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Meno a priezvisko</Label>
                  <Input 
                    id="name" 
                    required
                    placeholder="Napr. Ján Kováč" 
                    className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required
                    placeholder="jan.kovac@email.sk" 
                    className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Telefónne číslo</Label>
                  <Input 
                    id="phone" 
                    required
                    placeholder="+421 900 000 000" 
                    className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFrom" className="text-gray-300">Dátum od</Label>
                  <Input 
                    id="dateFrom" 
                    type="date" 
                    required
                    className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                    value={formData.dateFrom}
                    onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo" className="text-gray-300">Dátum do</Label>
                  <Input 
                    id="dateTo" 
                    type="date" 
                    required
                    className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                    value={formData.dateTo}
                    onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-300">Poznámka / Špecifikácia dopytu</Label>
                <Textarea 
                  id="notes" 
                  rows={4}
                  placeholder="Popíšte vaše podujatie, špecifické požiadavky alebo zoznam ďalšej techniky, ktorú by ste si priali preriadiť..." 
                  className="bg-[#070a1e] border-white/10 text-white focus:border-[#BD20D3] rounded-lg"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full bg-[#BD20D3] hover:bg-[#BD20D3]/90 text-white py-6 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Send size={18} />
                Odoslať nezáväzný dopyt
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prenajom;