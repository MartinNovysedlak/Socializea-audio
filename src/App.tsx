import React from "react";
import { Routes, Route } from "react-router-dom";
import EquipmentCatalog from "@/components/EquipmentCatalog";
import EquipmentDetail from "@/pages/EquipmentDetail";
import { Index } from "@/pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/equipment/:id" element={<EquipmentDetail />} />
      {/* other existing routes */}
    </Routes>
  );
}

export default App;