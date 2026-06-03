"use client";

import React from 'react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navLinks = [
    { name: 'Domov', href: '#' },
    { name: 'Prenájom', href: '#ponuka' },
    { name: 'Kontakt', href: '#kontakt' },
    { name: 'Predaj', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Music className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">
            Socializea<span className="text-blue-500">-audio</span>
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs md:text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
          <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
            Rezervovať
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;