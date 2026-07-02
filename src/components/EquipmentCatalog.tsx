"use client";

import React, { useState } from "react";
import { Filter, Minus, Plus, Volume2, Lightbulb, Layers, ShoppingBag, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EquipmentItem } from "@/lib/supabase";

interface EquipmentCatalogProps {
  equipment: EquipmentItem[];
  loading: boolean;
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const EquipmentCatalog = ({ equipment, loading, quantities, setQuantities }: EquipmentCatalogProps) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "sound" | "lighting" | "other">("all");

  const filteredEquipment = activeFilter === "all"
    ? equipment
    : equipment.filter((item) => item.category === activeFilter);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipment.find((i) => i.id === id);
    const currentQty = quantities[id] ?? 0;
    const newQty = Math.max(0, Math.min(item?.available ?? 0, currentQty + delta));
    setQuantities((prev) => ({ ...prev, [id]: newQty }));
  };

  const handleAdd = (id: string) => {
    handleQuantityChange(id, 1);
  };

  const handleRemove = (id: string) => {
    handleQuantityChange(id, -1);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "sound": return "Zvuk";
      case "lighting": return "Svetlá a efekty";
      case "other": return "Ostatné";
      default: return "";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "sound": return <Volume2 size={13} />;
      case "lighting": return <Lightbulb size={13} />;
      default: return <Layers size={13} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sound": return { bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-400", icon: "text-cyan-400" };
      case "lighting": return { bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", icon: "text-amber-400" };
      default: return { bg: "bg-purple-500/10", border: "border-purple-500/25", text: "text-purple-400", icon: "text-purple-400" };
    }
  };

  const getAvailabilityText = (available: number) => {
    return `${available} ${available === 1 ? "kus" : "kusy"}`;
  };

  if (loading) {
    return (
      <section className="py-12 bg-transparent relative">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 py-12">Načítavam produktov...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ponuka aparatúry na akcie</h2>
                  <p className="text-gray-400">Vyberte si jednotlivé položky a pridajte ich do kalkulačky pre oslavu, chatu alebo diskotéku</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">
                  <Filter className="text-[#BD20D3] ml-3" size={18} />
                  <div className="flex gap-1">
                    {["all", "sound", "lighting", "other"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          activeFilter === filter ? "bg-[#BD20D3] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {filter === "all" ? "Všetko" : getCategoryLabel(filter)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {filteredEquipment.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                Žiadna technika nevyhovuje zadanému filtru.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEquipment.map((item) => {
                  const displayImage = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80";
                  const catColor = getCategoryColor(item.category);
                  const inCartQty = quantities[item.id] ?? 0;

                  return (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#BD20D3]/30 hover:translate-y-[-4px] transition-all duration-300 group">
                      <Link to={`/equipment/${item.id}`} className="w-full flex flex-col items-center mb-4 cursor-pointer">
                        <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                          <img
                            src={displayImage}
                            alt={item.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80";
                            }}
                            style={{ objectPosition: "center" }}
                          />
                        </div>

                        <div className={`inline-flex items-center gap-1.5 ${catColor.bg} border ${catColor.border} rounded-full px-3 py-1 mb-3`}>
                          <span className={catColor.icon}>{getCategoryIcon(item.category)}</span>
                          <span className={`text-xs font-semibold ${catColor.text} whitespace-nowrap`}>{getCategoryLabel(item.category)}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-white group-hover:text-[#BD20D3] transition-colors mb-2 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex-1 w-full flex flex-col justify-end">
                        <div className="flex justify-center items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-[#BD20D3]">{item.price_per_day} €</span>
                          <span className="text-gray-400 text-sm">Dostupné: {getAvailabilityText(item.available)}</span>
                        </div>

                        {inCartQty === 0 ? (
                          <Button
                            onClick={() => handleAdd(item.id)}
                            size="sm"
                            className="w-full bg-[#BD20D3] hover:bg-[#BD20D3]/85 text-white rounded-lg h-10 mb-4 transition-all"
                          >
                            <ShoppingBag size={14} className="mr-2" />
                            Pridať do košíka
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleAdd(item.id)}
                            disabled={inCartQty >= item.available}
                            size="sm"
                            className="w-full btn-cyber hover:opacity-95 text-white rounded-lg h-10 mb-4 transition-all border-none"
                          >
                            <Check size={14} className="mr-2 animate-pulse" />
                            V košíku ({inCartQty})
                          </Button>
                        )}

                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={!quantities[item.id]}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-white font-medium text-base">{quantities[item.id] ?? 0}</span>
                          <button
                            onClick={() => handleAdd(item.id)}
                            disabled={(quantities[item.id] ?? 0) >= item.available}
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentCatalog;