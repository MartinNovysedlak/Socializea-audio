"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020721] border-t border-white/10 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-lg border border-[#BD20D3]/30 shrink-0">
              <img 
                src="/logo.png" 
                alt="Socializea Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tighter text-white uppercase">
              Socializea<span className="text-[#BD20D3]">-audio</span>
            </span>
          </div>

          <div className="flex gap-5 sm:gap-6">
            <a href="#" className="text-gray-500 hover:text-[#BD20D3] transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#BD20D3] transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook size={18} />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#BD20D3] transition-colors">
              <span className="sr-only">Youtube</span>
              <Youtube size={18} />
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-500 text-[10px] sm:text-sm text-center md:text-right">
              © {new Date().getFullYear()} Socializea-audio. Všetky práva vyhradené.
            </p>
            <Link 
              to="/admin" 
              className="text-[10px] sm:text-xs text-gray-600 hover:text-[#BD20D3] transition-colors flex items-center gap-1.5"
              title="Administrácia"
            >
              <Settings size={10} />
              <span>Administrácia</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;