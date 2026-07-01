"use client";

import React, { useState, useEffect } from 'react';
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
import FloatingCart from './components/FloatingCart';
import ScrollToTop from './components/ScrollToTop';
import { useEquipment } from './hooks/useEquipment';
import AmbientBackground from './components/AmbientBackground';

function App() {
  const { equipment } = useEquipment();
  
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("cyber_cart_quantities");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cyber_cart_quantities", JSON.stringify(quantities));
    } catch (e) {
      console.error("Nedá sa uložiť košík do localStorage:", e);
    }
  }, [quantities]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AmbientBackground />
      
      <div className="relative z-10">
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
          <Route 
            path="/equipment/:id" 
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
      </div>

      {/* Globálny plávajúci košík – zobrazí sa na všetkých stránkach, ak má položky */}
      <FloatingCart 
        quantities={quantities} 
        setQuantities={setQuantities} 
        equipment={equipment} 
      />
    </BrowserRouter>
  );
}

export default App;