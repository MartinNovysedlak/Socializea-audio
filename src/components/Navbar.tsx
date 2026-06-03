"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const navLinks = [
    { name: 'Domov', href: '#' },
    { name: 'Prenájom', href: '#ponuka' },
    { name: 'Kontakt', href: '#kontakt' },
    { name: 'Predaj', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020721]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden rounded-lg border border-[#BD20D3]/30">
            <img 
              src="/logo.png" 
              alt="Socializea Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">
            Socializea<span className="text-[#BD20D3]">-audio</span>
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-4 md:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs md:text-sm font-medium text-gray-300 hover:text-[#BD20D3] transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
          <Button className="hidden sm:flex btn-cyber rounded-full px-6 border-none">
            Rezervovať
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;