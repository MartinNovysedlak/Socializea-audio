"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { EquipmentItem } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface EquipmentCatalogProps {
  equipment: EquipmentItem[];
  loading: boolean;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EquipmentCatalog = ({ equipment, loading, quantities, setQuantities }: EquipmentCatalogProps) => {
  const navigate = useNavigate();

  const handleAdd = (itemId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const handleProductClick = (item: EquipmentItem) => {
    // Uloženie pozície pre návrat
    sessionStorage.setItem('prenajom-scroll-position', String(window.scrollY));
    navigate(`/prenajom/${item.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin h-8 w-8 text-[#BD20D3]" />
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        Žiadne produkty sa nenašli.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {equipment.map((item) => {
        const inCartQty = quantities[item.id] || 0 | 0;
        const isInCart = inCartQty > 0
        const isSoldOut = item.available === 0;
        const categoryEmoji = item.category === 'sound' ? '🎤' : item.category === 'lighting' ? '💡' : '📦';

        return (
          <div
            key={item.id}
            className="group bg-[#0e122b]/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-[#BD20D3]/40 hover:shadow-[0_0_25px_rgba(189,32,211,0.08)] transition-all duration-300 cursor-pointer"
            onClick={() => handleProductClick(item)}
          >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden relative bg-black/40">
              <img
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020721] to-transparent" />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-xl text-sm font-extrabold uppercase tracking-widest">
                    Vypredané
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <div className="mb-2">
                <span className="text-xs text-[#BD20D3] font-bold uppercase tracking-wider">
                  {categoryEmoji} {item.category === 'sound' ? 'Zvuk' : item.category === 'lighting' ? 'Svetlo' : 'Príslušenstvo'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-1 line-clamp-2">
                {item.name}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-2 mb-3 flex-1">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="text-lg font-extrabold text-[#BD20D3]">
                  {item.price_per_day} € <span className="text-xs font-normal text-gray-400">/deň</span>
                </div>
              </div>
              <div className="mt-3">
                {isSoldOut ? (
                  <Button
                    disabled
                    size="sm"
                    className="w-full bg-white/10 text-gray-500 border-white/10 rounded-lg h-10 mb-4 cursor-not-allowed"
                  >
                    Vypredané
                  </Button>
                ) : isInCart ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(item.id);
                    }}
                    size="sm"
                    className="w-full bg-[#BD20D3]/80 hover:bg-[#BD20D3] text-white rounded-lg h-10 mb-4 border-none transition-all"
                  >
                    <Check size={14} className="mr-1" />
                    + pridať ({inCartQty} ks)
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(item.id);
                    }}
                    size="sm"
                    className="w-full btn-cyber text-white rounded-lg h-10 mb-4 transition-all border-none"
                  >
                    <ShoppingBag size={14} className="mr-1" />
                    Do košíka
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentCatalog;