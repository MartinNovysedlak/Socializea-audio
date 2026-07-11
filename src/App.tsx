"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from '@/pages/Index';
import Prenajom from '@/pages/Prenajom';
import Predaj from '@/pages/Predaj';
import Blog from '@/pages/Blog';
import BlogPostDetail from '@/pages/BlogPostDetail';
import Kontakt from '@/pages/Kontakt';
import Admin from '@/pages/Admin';
import ObchodnePodmienky from '@/pages/ObchodnePodmienky';
import PodmienkyPouzivania from '@/pages/PodmienkyPouzivania';
import EquipmentDetail from '@/pages/EquipmentDetail';
import ProductDetail from '@/pages/ProductDetail';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingCart from '@/components/FloatingCart';
import AmbientBackground from '@/components/AmbientBackground';
import { useEquipment } from '@/hooks/useEquipment';
import { computeUsedEquipmentCounts, PackageCartItem } from '@/lib/packageUtils';

function App() {
  const { equipment } = useEquipment();

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('cyber_cart_quantities');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [packageItems, setPackageItems] = useState<PackageCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cyber_cart_packages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync quantities to localStorage
  useEffect(() => {
    localStorage.setItem('cyber_cart_quantities', JSON.stringify(quantities));
  }, [quantities]);

  // Listen for package additions
  useEffect(() => {
    const handleAddPackage = (e: CustomEvent<PackageCartItem>) => {
      setPackageItems(prev => {
        const updated = [...prev, e.detail];
        localStorage.setItem('cyber_cart_packages', JSON.stringify(updated));
        return updated;
      });
    };
    window.addEventListener('add-package-to-cart', handleAddPackage as EventListener);
    return () => window.removeEventListener('add-package-to-cart', handleAddPackage as EventListener);
  }, []);

  const usedInPackages = useMemo(
    () => computeUsedEquipmentCounts(packageItems, equipment),
    [packageItems, equipment]
  );

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AmbientBackground />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/prenajom"
            element={
              <Prenajom
                quantities={quantities}
                setQuantities={setQuantities}
                equipment={equipment}
                usedInPackages={usedInPackages}
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
          <Route path="/predaj" element={<Predaj />} />
          <Route path="/predaj/:id" element={<ProductDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/obchodne-podmienky" element={<ObchodnePodmienky />} />
          <Route path="/podmienky-pouzivania" element={<PodmienkyPouzivania />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingCart
          quantities={quantities}
          setQuantities={setQuantities}
          equipment={equipment}
        />
      </Router>
    </HelmetProvider>
  );
}

export default App;