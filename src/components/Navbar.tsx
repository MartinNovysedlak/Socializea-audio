"use client";

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Domov', href: '/' },
    { name: 'Prenájom', href: '/prenajom' },
    { name: 'Predaj', href: '/predaj' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0d1f]/80 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300 relative z-[60]">
          <div className="w-12 h-12 overflow-hidden rounded-lg border border-[#BD20D3]/30 shadow-[0_0_15px_rgba(189,32,211,0.2)]">
            <img src="/logo.png" alt="Socializea Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:inline">
            Socializea<span className="text-[#BD20D3]">-audio</span>
          </span>
        </Link>

        {/* DESKTOP NAV - EXACTLY AS BEFORE FOR PC (hidden below lg) */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="nav-link-underline text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <Link to="/kontakt">
            <Button className="btn-cyber rounded-full px-6 border-none animate-pulse-glow hover:scale-105 active:scale-95 duration-300">
              Napíšte nám
            </Button>
          </Link>
        </div>

        {/* MOBILE BURGER TOGGLE (visible below lg) */}
        <div className="flex lg:hidden items-center gap-3 relative z-[60]">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all focus:outline-none"
            aria-label="Prepnúť menu"
          >
            {isMobileMenuOpen ? <X size={20} className="animate-in spin-in-90 duration-200" /> : <Menu size={20} className="animate-in fade-in duration-200" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN OVERLAY MENU (visible below lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#020721] flex flex-col justify-between p-6 pt-28 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-6 my-auto max-w-sm mx-auto w-full text-center">
            <div className="space-y-4">
              {navLinks.map((link, idx) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={handleLinkClick}
                    className={`block py-3 text-2xl font-bold rounded-2xl transition-all ${
                      isActive 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] scale-105' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ 
                      animationDelay: `${idx * 75}ms`,
                      animation: 'fade-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="pt-6 border-t border-white/10 w-full animate-fade-slide-up" style={{ animationDelay: '350ms' }}>
              <Link to="/kontakt" onClick={handleLinkClick}>
                <Button className="w-full btn-cyber h-14 rounded-2xl border-none font-bold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(189,32,211,0.4)]">
                  <span>Napíšte nám</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 pb-4 border-t border-white/5 pt-4">
            © {new Date().getFullYear()} Socializea-audio. Všetky práva vyhradené.
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;