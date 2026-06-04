"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  image: string;
}

const equipmentData: EquipmentItem[] = [
  // Sound
  { id: "mixer-x1222", name: "Mixážny pult Behringer Xenyx X1222 USB", category: "sound", pricePerDay: 25, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "mixer-802", name: "Mixážny pult Behringer Xenyx 802", category: "sound", pricePerDay: 15, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "mic-set", name: "Sada 2 mikrofónov the t.bone free solo Twin HT", category: "sound", pricePerDay: 20, available: 1, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
  { id: "mic-auna", name: "Mikrofony a headsety Auna VHF", category: "sound", pricePerDay: 10, available: 4, image: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800" },
  { id: "speakers-b112d", name: "Reproduktory Behringer b112d", category: "sound", pricePerDay: 15, available: 4, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "speaker-b208d", name: "Reproduktor Behringer b208d", category: "sound", pricePerDay: 12, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "sub-b1500xp", name: "Subwoofery Behriger B1500XP", category: "sound", pricePerDay: 30, available: 2, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "sub-dsp18", name: "Subwoofer The Box Pro DSP 18 Sub", category: "sound", pricePerDay: 35, available: 5, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  
  // Lighting
  { id: "dmx-pult", name: "Riadiaci DMX pult Light4Me DMX 192", category: "lighting", pricePerDay: 20, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "beamz-sushi", name: "BeamZ SUSHI-DS", category: "lighting", pricePerDay: 15, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "led-par", name: "RGBWA UV Led Par svetlá", category: "lighting", pricePerDay: 8, available: 8, image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" },
  { id: "beam-head", name: "Rotujúca 90w Beam hlava", category: "lighting", pricePerDay: 25, available: 4, image: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800" },
  { id: "led-bar", name: "RGBW Led Bar 36w", category: "lighting", pricePerDay: 12, available: 4, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "laser-bar", name: "Laserovy Bar 65W (8x červený laser)", category: "lighting", pricePerDay: 40, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "fog-dj", name: "Dymostroj ADJ VF 1300", category: "lighting", pricePerDay: 25, available: 2, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "bubble", name: "Bublinkostroj", category: "lighting", pricePerDay: 20, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "snow", name: "Snehostroj ADJ Snow Flurry HO", category: "lighting", pricePerDay: 25, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "fire", name: "Výrobníky plameňov Fire Machine", category: "lighting", pricePerDay: 30, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "party-bar", name: "Svetlá BeamZ Party Bar", category: "lighting", pricePerDay: 20, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "uv-lights", name: "Samostatné Bodové UV svetlá", category: "lighting", pricePerDay: 10, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "strobe", name: "Stroboskop", category: "lighting", pricePerDay: 15, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "holo-laser", name: "Holografický Laser", category: "lighting", pricePerDay: 35, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "red-green-laser", name: "Červeno-zelený Laser", category: "lighting", pricePerDay: 25, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  
  // Other
  { id: "projector", name: "Premietačka Wanbo T6 MAX", category: "other", pricePerDay: 20, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "screen", name: "Premietacie plátno 110\"", category: "other", pricePerDay: 15, available: 1, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "light-construct", name: "Osvetľovacia konštrukcia na uchytenie", category: "other", pricePerDay: 10, available: 1, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "speaker-construct", name: "Konštrukcia na zavesenie reproduktorov", category: "other", pricePerDay: 8, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "mic-stand", name: "Stojan na mikrofón", category: "other", pricePerDay: 5, available: 2, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800" },
  { id: "tripod", name: "Trojnožka na reproduktory", category: "other", pricePerDay: 10, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "speaker-mount", name: "Držiak pre dvojicu reproboxov", category: "other", pricePerDay: 5, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
  { id: "telescopic", name: "Teleskopická stojanová tyč", category: "other", pricePerDay: 8, available: 2, image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" },
];

const EquipmentCatalog = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sound' | 'lighting' | 'other'>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredEquipment = activeFilter === 'all'
    ? equipmentData
    : equipmentData.filter(item => item.category === activeFilter);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipmentData.find(i => i.id === id);
    const currentQty = quantities[id] || 0;
    const newQty = Math.max(0, Math.min(item?.available || 0, currentQty + delta));
    setQuantities(prev => ({ ...prev, [id]: newQty }));
  };

  const handleAdd = (id: string) => {
    handleQuantityChange(id, 1);
  };

  const handleRemove = (id: string) => {
    handleQuantityChange(id, -1);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'sound': return 'Zvuk';
      case 'lighting': return 'Svetlá a efekty';
      case 'other': return 'Ostatné';
      default: return '';
    }
  };

  const getAvailabilityText = (available: number) => {
    return `${available} ${available === 1 ? 'kus' : 'kusy'}`;
  };

  const getTotalSum = () => {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const item = equipmentData.find(i => i.id === id);
      return sum + (item ? item.pricePerDay * qty : 0);
    }, 0);
  };

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-16 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ponuka aparatúry</h2>
                <p className="text-gray-400">Vyberte si jednotlivé položky a pridajte ich do kalkulačky</p>
              </div>
              
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">
                <Filter className="text-[#BD20D3] ml-3" size={18} />
                <div className="flex gap-1">
                  {(['all', 'sound', 'lighting', 'other'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilter === filter
                          ? 'bg-[#BD20D3] text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {filter === 'all' ? 'Všetko' : getCategoryLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Centered Total Sum */}
            <div className="mb-8 text-center">
              <div className="inline-block bg-[#BD20D3]/20 border border-[#BD20D3]/40 rounded-full px-8 py-3">
                <span className="text-[#BD20D3] font-bold text-lg">
                  Celková suma: {getTotalSum()} €
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/equipment/${item.id}`}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#BD20D3]/30 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group"
                >
                  {/* Image with centered category bubble */}
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-300"
                      style={{ objectPosition: 'center' }}
                    />
                    {/* Category bubble centered at the bottom */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#BD20D3]/20 rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-[#BD20D3] whitespace-nowrap">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 w-full">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#BD20D3] transition-colors mb-2">
                      {item.name}
                    </h3>
                    
                    {/* Price and availability on same line */}
                    <div className="flex justify-center items-center gap-3 mb-3">
                      <span className="text-2xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                      <span className="text-gray-400 text-sm">
                        Dostupné: {getAvailabilityText(item.available)}
                      </span>
                    </div>

                    {/* Small quantity counter below price */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.id);
                        }}
                        disabled={!quantities[item.id]}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-white font-medium text-base">
                        {quantities[item.id] || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAdd(item.id);
                        }}
                        disabled={(quantities[item.id] || 0) >= item.available}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="w-full bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 rounded-lg h-10"
                      disabled={!quantities[item.id]}
                    >
                      Pridať do kalkulácie
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentCatalog;