"use client";

import React from "react";
import { EquipmentItem } from "@/lib/supabase";

interface RentalItemsProps {
  equipment: EquipmentItem[];
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const RentalItems = ({ equipment, quantities, setQuantities }: RentalItemsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {equipment.map((item) => {
        const qty = quantities[item.id] ?? 0;
        const img = item.main_image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400";

        return (
          <div
            key={item.id}
            className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-2xl overflow-hidden hover:border-[#BD20D3]/40 transition-all duration-300"
          >
            <div className="aspect-video bg-zinc-900 overflow-hidden">
              <img
                src={img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <p className="text-[#BD20D3] font-bold text-sm">
                {item.price_per_day} € / deň
              </p>
              <p className="text-gray-400 text-xs">
                {item.available} ks skladom
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [item.id]: Math.max(0, (prev[item.id] ?? 0) - 1),
                    }))
                  }
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  -
                </button>
                <span className="w-8 text-center text-white font-bold text-sm">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantities((prev) => ({
                      ...prev,
                      [item.id]: Math.min(item.available, (prev[item.id] ?? 0) + 1),
                    }))
                  }
                  disabled={qty >= item.available}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RentalItems;