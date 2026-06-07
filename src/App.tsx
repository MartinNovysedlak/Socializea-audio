"use client";

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Prenajom from './pages/Prenajom';
import EquipmentDetail from './pages/EquipmentDetail';
import Kontakt from './pages/Kontakt';
import Admin from './pages/Admin';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Predaj from './pages/Predaj';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
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
              equipment={equipment}
            />
          } 
        />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPostDetail />} />
        <Route path="/predaj" element={<Predaj />} />
        <Route path="/predaj/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;