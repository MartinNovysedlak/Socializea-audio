"use client";

import React, { useState, useEffect } from "react";
import { EquipmentItem } from "@/lib/supabase";
import RentalItems from "@/components/RentalItems";
import FloatingCart from "@/components/FloatingCart";

interface PrenajomProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
  setEquipment: React.Dispatch<React.SetStateAction<EquipmentItem[]>>;
}

const Prenajom = ({ quantities, setQuantities, equipment, setEquipment }: PrenajomProps) => {
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase.from("equipment").select("*");
        if (error) throw error;
        setEquipment(data || []);
      } catch (err) {
        console.error("Chyba pri načítaní techniky:", err);
      }
    };
    if (equipment.length === 0) fetchEquipment();
  }, [equipment.length, setEquipment]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Prenájom techniky</h1>
      <RentalItems
        equipment={equipment}
        quantities={quantities}
        setQuantities={setQuantities}
      />
    </div>
  );
};

export default Prenajom;