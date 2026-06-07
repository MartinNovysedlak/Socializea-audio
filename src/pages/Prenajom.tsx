"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import EquipmentCatalog from '@/components/EquipmentCatalog';
import FloatingCart from '@/components/FloatingCart';
import Footer from '@/components/Footer';
import { EquipmentItem } from '@/lib/supabase';

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const Prenajom = ({ quantities, setQuantities, equipment }: PrenajomProps) => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <EquipmentCatalog 
          equipment={equipment} 
          quantities={quantities} 
          setQuantities={setQuantities} 
        />
      </div>
      <FloatingCart 
        quantities={quantities} 
        setQuantities={setQuantities} 
        equipment={equipment} 
      />
      <Footer />
    </main>
  );
};

export default Prenajom;
</dyad-chat-summary>

<dyad-chat-summary>Oprava pridávania do košíka z detailu aparatúry - quantities sa teraz správne aktualizujú</dyad-chat-summary>

Opravil som logiku pridávania do košíka. Teraz:

1. **EquipmentDetail** prijíma `quantities` a `setQuantities` ako props
2. **handleAddToCart** priamo aktualizuje `quantities` pre daný produkt
3. **App.tsx** uchováva stav `quantities` a posiela ho do `Prenajom` aj `EquipmentDetail`
4. Tlačidlo zobrazuje aktuálny počet kusov v košíku a je vypnuté ak je dosiahnutý maximálny počet dostupných kusov<dyad-write path="src/components/EquipmentCatalog.tsx" description="Aktualizácia EquipmentCatalog na prijímanie quantities props">
"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';
import { EquipmentItem } from '@/lib/supabase';
import { toast } from 'sonner';

interface EquipmentCatalogProps {
  equipment: EquipmentItem[];
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EquipmentCatalog = ({ equipment, quantities, setQuantities }: EquipmentCatalogProps) => {
  const handleAddToCart = (item: EquipmentItem) => {
    const currentQty = quantities[item.id] ?? 0;
    
    if (currentQty >= item.available) {
      toast.error("Nie je viac dostupných kusov!", {
        description: `Maximálny počet kusov pre ${item.name} je ${item.available}.`,
      });
      return;
    }

    setQuantities((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] ?? 0) + 1,
    }));
    
    toast.success("Produkt bol pridaný do košíka!", {
      description: `${item.name} je teraz vo vašom košíku.`,
    });
  };

  const getCartQuantity = (id: string) => quantities[id] ?? 0;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.map((item) => {
            const cartQty = getCartQuantity(item.id);
            const isInCart = cartQty > 0;
            const isMaxReached = cartQty >= item.available;
            const displayImg = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400";

            return (
              <Card 
                key={item.id} 
                className="bg-white/5 border-white/10 rounded-xl overflow-hidden group hover:border-[#BD20D3]/50 transition-all duration-300"
              >
                <Link to={`/prenajom/${item.id}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-black/30">
                    <img
                      src={displayImg}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400";
                      }}
                    />
                  </div>
                </Link>
                
                <CardContent className="p-4">
                  <Link to={`/prenajom/${item.id}`}>
                    <h3 className="text-lg font-bold text-white hover:text-[#BD20D3] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.category === "sound"
                      ? "Zvuk"
                      : item.category === "lighting"
                        ? "Svetlá a efekty"
                        : "Ostatné"}
                  </p>
                  <p className="text-[#BD20D3] font-bold text-xl mt-2">
                    {item.price_per_day} € <span className="text-gray-500 text-sm font-normal">/ deň</span>
                  </p>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link to={`/prenajom/${item.id}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10"
                    >
                      Detail
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.available === 0 || isMaxReached}
                    className={`flex-1 font-bold transition-all ${
                      isInCart 
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                        : "btn-cyber border-none"
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check size={16} className="mr-1" />
                        {cartQty}
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} className="mr-1" />
                        Pridať
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EquipmentCatalog;