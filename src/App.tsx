"use client";

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Index from './pages/Index';
import Prenajom from './pages/Prenajom';

// Jednoduché dočasné podstránky pre správne fungovanie navigácie bez chýb
const Predaj = () => (
  <div className="min-h-screen bg-[#0a0d1f] text-white pt-28 pb-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">PREDAJ</h1>
      <p className="text-gray-400">Pripravujeme ponuku profesionálnej audio techniky na predaj.</p>
    </div>
  </div>
);

const Blog = () => (
  <div className="min-h-screen bg-[#0a0d1f] text-white pt-28 pb-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">BLOG</h1>
      <p className="text-gray-400">Sledujte čoskoro zaujímavé články a novinky zo sveta audio techniky.</p>
    </div>
  </div>
);

const Kontakt = () => (
  <div className="min-h-screen bg-[#0a0d1f] text-white pt-28 pb-16 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">KONTAKT</h1>
      <p className="text-gray-400">Napíšte nám na info@socializea.sk alebo zavolajte pre cenovú ponuku.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0d1f]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/prenajom" element={<Prenajom />} />
          <Route path="/predaj" element={<Predaj />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/kontakt" element={<Kontakt />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;