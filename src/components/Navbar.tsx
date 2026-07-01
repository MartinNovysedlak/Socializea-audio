"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#0a0d1f] border-b border-white/10 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl">
          DJ Party
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/prenajom" className="text-gray-300 hover:text-white transition-colors text-sm">
            Prenájom
          </Link>
          <Link to="/predaj" className="text-gray-300 hover:text-white transition-colors text-sm">
            Predaj
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;