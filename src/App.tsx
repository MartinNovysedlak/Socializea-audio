"use client";

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Prenajom from './pages/Prenajom';
import EquipmentDetail from './pages/EquipmentDetail';
import Kontakt from './pages/Kontakt';
import { useEquipment } from './hooks/useEquipment';

function App() {
  const { equipment } = useEquipment();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/prenajom" 
          element={
            <Prenajom 
              quantities={quantities} 
              setQuantities={setQuantities} 
              equipment={equipment} 
            />
          } 
        />
        <Route 
          path="/prenajom/:id" 
          element={
            <EquipmentDetail 
              quantities={quantities} 
              setQuantities={setQuantities} 
            />
          } 
        />
        <Route path="/kontakt" element={<Kontakt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;