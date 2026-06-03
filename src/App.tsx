"use client";

import React from "react";
import { Routes, Route } from "react-router-dom";
import EquipmentCatalog from "@/components/EquipmentCatalog";
import EquipmentDetail from "@/pages/EquipmentDetail";
import Index from "@/pages/Index";
import Prenajom from "@/pages/Prenajom";
import Kontakt from "@/pages/Kontakt";
import Predaj from "@/pages/Predaj";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/prenajom" element={<Prenajom />} />
      <Route path="/kontakt" element={<Kontakt />} />
      <Route path="/predaj" element={<Predaj />} />
      <Route path="/equipment/:id" element={<EquipmentDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
</dyad-chat-summary>