"use client";

import React from 'react';
import { Music, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Music className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold tracking-tighter text-white uppercase">
              Socializea<span className="text-blue-500">-audio</span>
            </span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Socializea-audio. Všetky práva vyhradené.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;