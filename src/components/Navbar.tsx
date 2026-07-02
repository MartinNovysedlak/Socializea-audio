"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Speaker, ShoppingBag, BookOpen, Phone } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Domov', href: '/', icon: Home },
    { name: 'Prenájom', href: '/prenajom', icon: Speaker },
    { name: 'Predaj', href: '/predaj', icon: ShoppingBag },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Kontakt', href: '/kontakt', icon: Phone },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d1f]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity duration-300 shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-lg border border-[#BD20D3]/30 shadow-[0_0_15px_rgba(189,32,211,0.2)]">
            <img src="/logo.png" alt="Socializea Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tighter text-white uppercase">
            Socializea<span className="text-[#BD20D3]">-audio</span>
          </span>
        </Link>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link-underline text-xs lg:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive(link.href) ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link to="/kontakt">
            <Button className="btn-cyber rounded-full px-6 border-none animate-pulse-glow hover:scale-105 active:scale-95 duration-300 text-xs lg:text-sm h-10 lg:h-11">
              Napíšte nám
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label={mobileMenuOpen ? 'Zavrieť menu' : 'Otvoriť menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay - vylepšené pre telefóny */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-[#0a0d1f]/95 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col items-stretch gap-3 py-6 px-4 max-w-sm mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#BD20D3]/15 border border-[#BD20D3]/40 text-white shadow-[0_0_15px_rgba(189,32,211,0.2)]'
                      : 'bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20 active:bg-white/15'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    active ? 'bg-[#BD20D3]/20' : 'bg-white/10'
                  }`}>
                    <Icon size={18} className={active ? 'text-[#BD20D3]' : 'text-gray-400'} />
                  </div>
                  <span className="flex-1">{link.name}</span>
                  {active && (
                    <div className="w-2 h-2 rounded-full bg-[#BD20D3] shadow-[0_0_8px_rgba(189,32,211,0.6)]" />
                  )}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/5 mt-1">
              <Link to="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                <Button className="btn-cyber rounded-xl w-full border-none h-12 text-base font-bold shadow-[0_0_20px_rgba(189,32,211,0.3)]">
                  <Phone size={18} className="mr-2" />
                  Napíšte nám
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;