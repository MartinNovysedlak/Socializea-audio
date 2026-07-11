"use client";

import React from 'react';
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
import ObchodnePodmienky from './pages/ObchodnePodmienky';
import PodmienkyPouzivania from './pages/PodmienkyPouzivania';
import NotFound from './pages/NotFound';
import FloatingCart from './components/FloatingCart';
import ScrollToTop from './components/ScrollToTop';
import { useEquipment } from './hooks/useEquipment';
import AmbienceBackground from './components/AmbientBackground';

function App() {
  const { equipment } = useEquipment();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AmbienceBackground />
      
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/prenajom" 
            element={<Prenajom equipment={equipment} />}
          />
          <Route 
            path="/prenajom/:id" 
            element={<EquipmentDetail equipment={equipment} />}
          />
          <Route 
            path="/equipment/:id" 
            element={<EquipmentDetail equipment={equipment} />}
          />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/predaj" element={<Predaj />} />
          <Route path="/predaj/:id" element={<ProductDetail />} />
          <Route path="/obchodne-podmienky" element={<ObchodnePodmienky />} />
          <Route path="/podmienky-pouzivania" element={<PodmienkyPouzivania />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <FloatingCart />
    </BrowserRouter>
  );
}

export default App;