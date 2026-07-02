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

      {/* Mobilné menu – plné pozadie, veľké tlačidlá, čitateľné */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-[#020721] border-t border-[#BD20D3]/30">
          <div className="flex flex-col items-stretch gap-4 p-6 pt-8 max-w-md mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-5 px-6 py-5 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#BD20D3]/20 border-2 border-[#BD20D3]/60 text-white shadow-[0_0_20px_rgba(189,32,211,0.15)]'
                      : 'bg-white/8 border-2 border-white/10 text-white hover:bg-white/15 hover:border-white/30'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    active ? 'bg-[#BD20D3]/30' : 'bg-white/10'
                  }`}>
                    <Icon size={22} className={active ? 'text-[#BD20D3]' : 'text-gray-300'} />
                  </div>
                  <span className="flex-1">{link.name}</span>
                  {active && (
                    <div className="w-3 h-3 rounded-full bg-[#BD20D3] shadow-[0_0_12px_rgba(189,32,211,0.8)]" />
                  )}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t-2 border-white/10">
              <Link to="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                <Button className="btn-cyber rounded-2xl w-full border-none h-14 text-lg font-bold shadow-[0_0_25px_rgba(189,32,211,0.4)]">
                  <Phone size={22} className="mr-3" />
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