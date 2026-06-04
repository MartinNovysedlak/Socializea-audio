"use client";
import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import equipmentDatabase from "@/data/equipmentDatabase"; // Removed EquipmentItem import
const EquipmentCatalog = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "sound" | "lighting" | "other">("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const filteredEquipment = activeFilter === "all" ? equipmentDatabase : equipmentDatabase.filter((item) => item.category === activeFilter);
  const handleQuantityChange = (id: string, delta: number) => {
    const item = equipmentDatabase.find((i) => i.id === id);
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
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">
              <Filter className="text-[#BD20D3] ml-3" size={18} />
              <div className="flex gap-1">
                {["all", "sound", "lighting", "other"].map((filter) => (
                  <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${ activeFilter === filter ? "bg-[#BD20D3] text-white" : "text-gray-400 hover:text-white hover:bg-white/10" }`}>
                    {filter === "all" ? "Všetko" : getCategoryLabel(filter)}
                  </button>
                ))}
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
            {filteredEquipment.map((item) => (
              <Link key={item.id} to={`/equipment/${item.id}`} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#BD20D3]/30 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                  <img src={item.mainImage} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-300" onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Try different fallback paths
                    const fallbackPaths = [
                      `/public${item.mainImage}`,
                      `${item.mainImage}`,
                      `https://via.placeholder.com/128?text=${encodeURIComponent(item.name)}`,
                      "https://via.placeholder.com/128?text=No+Image"
                    ];
                    let currentPath = fallbackPaths[0];
                    const tryNextPath = () => {
                      const nextIndex = fallbackPaths.indexOf(currentPath) + 1;
                      if (nextIndex < fallbackPaths.length) {
                        currentPath = fallbackPaths[nextIndex];
                        target.src = currentPath;
                      }
                    };
                    tryNextPath();
                  }} style={{ objectPosition: "center" }} />
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-[#BD20D3]/20 rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-[#BD20D3] whitespace-nowrap"> {getCategoryLabel(item.category)} </span>
                </div>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold text-white group-hover:text-[#BD20D3] transition-colors mb-2"> {item.name} </h3>
                <div className="flex justify-center items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                  <span className="text-gray-400 text-sm"> Dostupné: {getAvailabilityText(item.available)} </span>
                </div>
                <Button size="sm" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }} className="w-full bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 rounded-lg h-10 mb-4" disabled={!quantities[item.id]}>
                  Pridať do kalkulácie
                </Button>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(item.id);
                  }} disabled={!quantities[item.id]} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    <Minus size={12} />
                  </button>
                  <span className="w-10 text-center text-white font-medium text-base"> {quantities[item.id] ?? 0} </span>
                  <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd(item.id);
                  }} disabled={(quantities[item.id] ?? 0) >= item.available} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default EquipmentCatalog;