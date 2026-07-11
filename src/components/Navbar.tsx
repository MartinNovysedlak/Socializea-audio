"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, ShoppingBag } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // Pravidelná kontrola localStorage pre aktuálny počet položiek v košíku (každých 500 ms)
  useEffect(() => {
    const updateCount = () => {
      try {
        const qtyStr = localStorage.getItem("cyber_cart_quantities");
        const pkgStr = localStorage.getItem("cyber_cart_packages");
        const quantities = qtyStr ? JSON.parse(qtyStr) : {};
        const packages = pkgStr ? JSON.parse(pkgStr) : [];
        const count = Object.values(quantities).reduce((a: number, b: any) => a + (b as number), 0) + packages.length;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    // Ihned po načítaní
    updateCount();

    // Pravidelná kontrola
    const interval = setInterval(updateCount, 500);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'Domov', href: '/' },
    { name: 'Prenájom', href: '/prenajom' },
    { name: 'Predaj', href: '/predaj' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  const openMenu = () => {
    setIsClosing(false);
    setIsMobileMenuOpen(true);
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  const openCart = () => {
    window.dispatchEvent(new CustomEvent('open-floating-cart'));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0d1f] border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-300">
          <div className="w-12 h-12 overflow-hidden rounded-lg border border-[#BD20D3]/30 shadow-[0_0_15px_rgba(189,32,211,0.2)]">
            <img src="/logo.png" alt="Socializea Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tighter text-white uppercase">
            Socializea<span className="text-[#BD20D3]">-audio</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
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

          {/* IKONA KOŠÍKA – v desktopovej časti, vždy viditeľná */}
          <button
            onClick={openCart}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            aria-label="Otvoriť košík"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#BD20D3] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0d1f]">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/kontakt">
            <Button className="btn-cyber rounded-full px-6 border-none transition-colors duration-200">
              Napíšte nám
            </Button>
          </Link>
        </div>

        {/* MOBILE BURGER TOGGLE */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={openCart}
            className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            aria-label="Otvoriť košík"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#BD20D3] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0a0d1f]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={isMobileMenuOpen ? closeMenu : openMenu}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all focus:outline-none"
            aria-label="Prepnúť menu"
          >
            {isMobileMenuOpen ? <X size={20} className="animate-in spin-in-90 duration-200" /> : <Menu size={20} className="animate-in fade-in duration-200" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN OVERLAY MENU – slide from right */}
      {(isMobileMenuOpen || isClosing) && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
            onClick={closeMenu}
          />
          
          {/* panel */}
          <div 
            className={`relative w-full max-w-sm bg-[#0e122b] border-l border-[#BD20D3]/30 shadow-2xl shadow-[#BD20D3]/20 h-full flex flex-col ${
              isClosing 
                ? 'animate-out slide-out-to-right duration-300' 
                : 'animate-in slide-in-from-right duration-300'
            }`}
          >
            {/* Header s logom a krížikom */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/5 shrink-0">
              <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2.5">
                <div className="w-9 h-9 overflow-hidden rounded-lg border border-[#BD20D3]/30">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-bold tracking-tighter text-white uppercase">
                  Socializea<span className="text-[#BD20D3]">-audio</span>
                </span>
              </Link>
              <button
                onClick={closeMenu}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                aria-label="Zavrieť menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigačné linky – posunuté nižšie od vrchu */}
            <div className="flex-1 flex flex-col justify-start pt-12 md:pt-16 px-8">
              <div className="space-y-3">
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
                          : 'text-white hover:text-gray-200'
                      }`}
                      style={{ 
                        animationDelay: `${idx * 75}ms`,
                        animation: !isClosing ? 'fade-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none'
                      }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Spodné tlačidlo */}
            <div className="px-8 pb-8 shrink-0 border-t border-white/5 pt-6">
              <Link to="/kontakt" onClick={handleLinkClick}>
                <Button className="w-full btn-cyber h-14 rounded-2xl border-none font-bold text-base flex items-center justify-center gap-2">
                  <span>Napíšte nám</span>
                  <ArrowRight size={18} />
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