"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Info, Tag } from 'lucide-react';

const RentalCalculator = () => {
  const [selectedPackage, setSelectedPackage] = useState('party-m');
  const [days, setDays] = useState(1);
  const [addOns, setAddOns] = useState({
    mic: false,
    transport: false,
  });

  const packages = {
    'party-m': { name: 'Párty Set M', price: 80 },
    'wedding-l': { name: 'Svadobný Set L', price: 150 },
    'light-set': { name: 'Svetelný Balík', price: 60 },
  };

  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const deposit = 100;

  useEffect(() => {
    let basePrice = packages[selectedPackage as keyof typeof packages].price * days;
    let addOnPrice = 0;

    if (addOns.mic) addOnPrice += 15 * days;
    if (addOns.transport) addOnPrice += 50;

    const subtotal = basePrice + addOnPrice;
    let currentDiscount = 0;

    if (days >= 3) {
      currentDiscount = subtotal * 0.15;
    }

    setDiscount(currentDiscount);
    setTotal(subtotal - currentDiscount);
  }, [selectedPackage, days, addOns]);

  return (
    <section id="kalkulacka" className="py-24 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kalkulačka prenájmu</h2>
                <p className="text-gray-300">
                  Získajte okamžitý odhad ceny pre vaše podujatie. Stačí si vybrať balík a dĺžku prenájmu.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-white text-lg">1. Vyberte si balík</Label>
                  <RadioGroup 
                    value={selectedPackage} 
                    onValueChange={setSelectedPackage}
                    className="grid grid-cols-1 gap-3"
                  >
                    {Object.entries(packages).map(([id, pkg]) => (
                      <div key={id} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${selectedPackage === id ? 'bg-[#BD20D3]/10 border-[#BD20D3]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={id} id={id} className="border-white/20 text-[#BD20D3]" />
                          <Label htmlFor={id} className="text-white font-medium cursor-pointer">{pkg.name}</Label>
                        </div>
                        <span className="text-[#BD20D3] font-bold">{pkg.price} € / deň</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-white text-lg">2. Počet dní prenájmu</Label>
                    <span className="text-[#BD20D3] font-bold text-xl">{days} {days === 1 ? 'deň' : days < 5 ? 'dni' : 'dní'}</span>
                  </div>
                  <Slider 
                    value={[days]} 
                    onValueChange={(val) => setDays(val[0])} 
                    max={7} 
                    min={1} 
                    step={1}
                    className="py-4"
                  />
                  {days >= 3 && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-400/10 p-2 rounded-lg border border-emerald-400/20">
                      <Tag size={14} />
                      <span>Automaticky aplikovaná zľava 15% za dlhodobý prenájom!</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-white text-lg">3. Doplnkové služby</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id="mic" 
                          checked={addOns.mic} 
                          onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, mic: !!checked }))}
                          className="border-white/20 data-[state=checked]:bg-[#BD20D3]"
                        />
                        <Label htmlFor="mic" className="text-white cursor-pointer">Bezdrôtový mikrofón</Label>
                      </div>
                      <span className="text-gray-400 text-sm">+15 € / deň</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id="transport" 
                          checked={addOns.transport} 
                          onCheckedChange={(checked) => setAddOns(prev => ({ ...prev, transport: !!checked }))}
                          className="border-white/20 data-[state=checked]:bg-[#BD20D3]"
                        />
                        <Label htmlFor="transport" className="text-white cursor-pointer">Doprava a montáž</Label>
                      </div>
                      <span className="text-gray-400 text-sm">+50 € jednorazovo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-[#020721]/80 border-white/10 sticky top-28 shadow-2xl shadow-[#BD20D3]/10">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="text-white flex items-center gap-2">
                  <Calculator className="text-[#BD20D3]" />
                  Prehľad ceny
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>Základná cena ({packages[selectedPackage as keyof typeof packages].name})</span>
                    <span>{packages[selectedPackage as keyof typeof packages].price * days} €</span>
                  </div>
                  {addOns.mic && (
                    <div className="flex justify-between text-gray-400">
                      <span>Bezdrôtový mikrofón</span>
                      <span>{15 * days} €</span>
                    </div>
                  )}
                  {addOns.transport && (
                    <div className="flex justify-between text-gray-400">
                      <span>Doprava a montáž</span>
                      <span>50 €</span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Zľava 15%</span>
                      <span>- {discount.toFixed(2)} €</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-white font-bold text-xl">Celková suma</span>
                    <span className="text-[#BD20D3] font-bold text-4xl">{total.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Info className="text-[#1A4BFF] shrink-0 mt-1" size={18} />
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-white mb-1">Vratná záloha: {deposit} €</p>
                      <p>Záloha sa platí pri prevzatí techniky a je v plnej výške vrátená po skončení nájmu.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RentalCalculator;