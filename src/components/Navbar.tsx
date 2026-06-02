"use client";

import React from 'react';
import { Music, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Domov', href: '#' },
    { name: 'Ponuka', href: '#ponuka' },
    { name: 'Kalkulačka', href: '#kalkulacka' },
    { name: 'Kontakt', href: '#kontakt' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Music className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">AUDIO<span className="text-indigo-500">RENT</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
            Rezervovať
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-4 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-lg font-medium text-gray-300 hover:text-indigo-400"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
            Rezervovať
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;