"use client";

import React, { useState } from "react";
import { Filter, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import equipmentDatabase from "@/data/equipmentDatabase";

// Helper function to convert item name to clean file slug
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[æœ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Function to generate all possible image paths for an item
const getImageCandidates = (itemName: string) => {
  return [
    // 1. Presný názov v priečinku .dyad/media
    `/media/${itemName}.jpg`,
    `/media/${itemName}.png`,
    `/media/${itemName}.jpeg`,
    // 2. Presný názov v koreňovom priečinku (ak by bol nahraný tam)
    `/${itemName}.jpg`,
    `/${itemName}.png`,
    `/${itemName}.jpeg`,
    // 3. Presný názov v priečinku images
    `/images/${itemName}.jpg`,
    `/images/${itemName}.png`,
    `/images/${itemName}.jpeg`,
    // 4. Presný názov v priečinku public/images
    `/public/images/${itemName}.jpg`,
    `/public/images/${itemName}.png`,
    `/public/images/${itemName}.jpeg`,
  ];
};

const EquipmentCatalog = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "sound" | "lighting" | "other">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredEquipment = activeFilter === "all" 
    ? equipmentDatabase 
    : equipmentDatabase.filter((item) => item.category === activeFilter);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipmentDatabase.find((i) => i.id === id);
    const currentQty = quantities[id] ?? 0;
    const newQty = Math.max(
      0,
      Math.min(item?.available ?? 0, currentQty + delta)
    );
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

  const getAvailabilityText = (available: number) => {
    return `${available} ${available === 1 ? "kus" : "kusy"}`;
  };

  const getTotalSum = () => {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const item = equipmentDatabase.find((i) => i.id === id);
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2"> Ponuka aparatúry </h2>
                <p className="text-gray-400"> Vyberte si jednotlivé položky a pridajte ich do kalkulačky </p>
              </div>

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">
                <Filter className="text-[#BD20D3] ml-3" size={18} />
                <div className="flex gap-1">
                  {["all", "sound", "lighting", "other"].map((filter) => (
                    <button 
                      key={filter} 
                      onClick={() => setActiveFilter(filter as any)} 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ activeFilter === filter ? "bg-[#BD20D3] text-white" : "text-gray-400 hover:text-white hover:bg-white/10" }`}
                    >
                      {filter === "all" ? "Všetko" : getCategoryLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Centered Total Sum */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-[#BD20D3]/20 border border-[#BD20D3]/40 rounded-full px-8 py-3">
              <span className="text-[#BD20D3] font-bold text-lg"> Celková suma: {getTotalSum()} € </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
              const candidates = getImageCandidates(item.name);

              return (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#BD20D3]/30 hover:translate-y-[-4px] transition-all duration-300 group">
                  
                  {/* Clickable Image, Category and Title */}
                  <Link to={`/equipment/${item.id}`} className="w-full flex flex-col items-center mb-4 cursor-pointer">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                      <img 
                        src={candidates[0]} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const currentSrc = target.src;
                          
                          // Try to find which candidate index failed by looking at how the URL ends
                          let nextIdx = -1;
                          for (let i = 0; i < candidates.length; i++) {
                            if (currentSrc.endsWith(encodeURI(candidates[i])) || currentSrc.endsWith(candidates[i])) {
                              nextIdx = i + 1;
                              break;
                            }
                          }

                          // If we couldn't match or we reached the end, use the Unsplash fallback
                          if (nextIdx !== -1 && nextIdx < candidates.length) {
                            target.src = candidates[nextIdx];
                          } else {
                            let fallback = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80";
                            if (item.category === "sound") {
                              fallback = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&auto=format&fit=crop&q=80";
                            } else if (item.category === "lighting") {
                              fallback = "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80";
                            } else if (item.category === "other") {
                              fallback = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80";
                            }
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }
                        }} 
                        style={{ objectPosition: "center" }} 
                      />
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#BD20D3]/20 rounded-full px-3 py-1">
                        <span className="text-xs font-medium text-[#BD20D3] whitespace-nowrap"> {getCategoryLabel(item.category)} </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-white group-hover:text-[#BD20D3] transition-colors mb-2 line-clamp-2"> 
                      {item.name} 
                    </h3>
                  </Link>

                  <div className="flex-1 w-full flex flex-col justify-end">
                    <div className="flex justify-center items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                      <span className="text-gray-400 text-sm"> Dostupné: {getAvailabilityText(item.available)} </span>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 rounded-lg h-10 mb-4" 
                      disabled={!quantities[item.id]}
                    >
                      Pridať do kalkulácie
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleRemove(item.id)} 
                        disabled={!quantities[item.id]} 
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-white font-medium text-base"> {quantities[item.id] ?? 0} </span>
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
        </div>
      </div>
    </section>
  );
};

export default EquipmentCatalog;