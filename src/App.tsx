"use client";

import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Prenajom from "./pages/Prenajom";
import Predaj from "./pages/Predaj";
import ONas from "./pages/ONas";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "sonner";
import { EquipmentItem } from "@/lib/supabase";
import FloatingCart from "./components/FloatingCart";

const CART_STORAGE_KEY = "cyber_cart_quantities";

function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      console.error("Nedá sa uložiť do localStorage:", quantities);
    }
  }, [quantities]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#020721] font-montserrat overflow-x-hidden">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prenajom" element={<Prenajom quantities={quantities} setQuantities={setQuantities} equipment={equipment} setEquipment={setEquipment} />} />
            <Route path="/predaj" element={<Predaj />} />
            <Route path="/o-nas" element={<ONas />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Routes>
        </main>
        <Footer />
        <FloatingCart quantities={quantities} setQuantities={setQuantities} equipment={equipment} />

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#0a0d1f",
              border: "1px solid rgba(189, 32, 211, 0.3)",
              color: "white",
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;