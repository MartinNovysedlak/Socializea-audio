"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Settings } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#020721] border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden rounded-lg border border-[#BD20D3]/30">
              <img 
                src="/logo.png" 
                alt="Socializea Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white uppercase">
              Socializea<span className="text-[#BD20D3]">-audio</span>
            </span>
          </div>

          <div className="flex gap-6">
            <a href="https://www.instagram.com/socializea_audio/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#BD20D3] transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61556243854211&locale=sk_SK" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#BD20D3] transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook size={20} />
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Socializea-audio. Všetky práva vyhradené.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/obchodne-podmienky"
                className="text-xs text-gray-600 hover:text-[#BD20D3] transition-colors"
              >
                Obchodné podmienky
              </Link>
              <Link
                to="/podmienky-pouzivania"
                className="text-xs text-gray-600 hover:text-[#BD20D3] transition-colors"
              >
                Podmienky používania
              </Link>
              <Link
                to="/admin"
                className="text-xs text-gray-600 hover:text-[#BD20D3] transition-colors flex items-center gap-1.5"
                title="Administrácia"
              >
                <Settings size={12} />
                <span>Administrácia</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;