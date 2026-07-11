"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Minus, Search, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EquipmentItem } from '@/lib/supabase';

interface EquipmentCatalogProps {
  equipment: EquipmentItem[];
  loading: boolean;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  usedInPackages?: Record<string, number>;
}

const EquipmentCatalog = ({ equipment, loading, quantities, setQuantities, usedInPackages = {} }: EquipmentCatalogProps) => {
  const [search, setSearch] = useState('');

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipment.find(i => i.id === id);
    if (!item) return;
    const currentQty = quantities[id] ?? 0;
    const usedInPkg = usedInPackages[id] || 0;
    const maxAvailable = item.available - usedInPkg;
    const newQty = Math.max(0, Math.min(maxAvailable, currentQty + delta));
    setQuantities(prev => ({ ...prev, [id]: newQty }));
  };

  const getAvailable = (item: EquipmentItem) => {
    const used = usedInPackages[item.id] || 0;
    return item.available - used;
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Hľadať v katalógu..."
          className="bg-black/40 border-white/10 text-white rounded-xl h-12 pl-12"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
          <Loader2 className="animate-spin" size={18} />
          <span>Načítavam techniku...</span>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package size={32} className="mx-auto mb-3 opacity-50" />
          <p>Žiadna technika nenájdená</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => {
            const qty = quantities[item.id] ?? 0;
            const available = getAvailable(item);
            const disabled = available <= 0;
            const maxReached = qty >= available;

            return (
              <Link
                key={item.id}
                to={`/prenajom/${item.id}`}
                className="block group"
              >
                <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl overflow-hidden hover:border-[#BD20D3]/50 transition-all h-full flex flex-col hover:shadow-lg hover:shadow-[#BD20D3]/10 hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative bg-black/40">
                    {item.main_image ? (
                      <img
                        src={item.main_image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Package size={32} className="text-gray-500" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        disabled ? 'bg-red-600/80 text-white' : 'bg-emerald-600/80 text-white'
                      }`}>
                        {disabled ? 'Vypredané' : `${available} ks`}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                      {item.category === 'sound' ? 'Zvuk' : item.category === 'lighting' ? 'Svetlá' : 'Ostatné'}
                    </p>
                    <h3 className="text-base font-bold text-white group-hover:text-[#BD20D3] transition-colors line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-grow">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <div>
                        <span className="text-[#BD20D3] font-bold text-lg">{item.price_per_day} €</span>
                        <span className="text-gray-500 text-xs ml-1">/ deň</span>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={qty <= 0}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white font-bold text-sm w-8 text-center tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          disabled={maxReached || disabled}
                          className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EquipmentCatalog;