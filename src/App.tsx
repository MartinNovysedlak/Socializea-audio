"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Prenajom from './pages/Prenajom';
import Kontakt from './pages/Kontakt';
import Predaj from './pages/Predaj';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/prenajom" element={<Prenajom />} />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/predaj" element={<Predaj />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;