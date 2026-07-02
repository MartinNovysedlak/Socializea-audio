"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Domov', href: '/' },
    { name: 'Prenájom', href: '/prenajom' },
    { name: 'Predaj', href: '/predaj' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kontakt', href: '/kontakt' },
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

      {/* Overlay – tmavé pozadie cez celú obrazovku */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 bg-black/60 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobilné menu – vysúvanie sprava */}
      <div
        className={`md:hidden fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-[#0a0d1f] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-2 py-8 px-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:translate-x-1 ${
                isActive(link.href)
                  ? 'text-white bg-[#BD20D3]/10 border-l-2 border-[#BD20D3]'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              style={{
                animationDelay: `${index * 80}ms`,
                animation: mobileMenuOpen ? `slideInRight 0.4s ease-out ${index * 80}ms both` : 'none',
              }}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/kontakt"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4"
            style={{
              animationDelay: `${navLinks.length * 80}ms`,
              animation: mobileMenuOpen ? `slideInRight 0.4s ease-out ${navLinks.length * 80}ms both` : 'none',
            }}
          >
            <Button className="btn-cyber rounded-full w-full border-none h-12 text-base">
              Napíšte nám
            </Button>
          </Link>
        </div>
      </div>

      {/* Inline štýly pre animáciu */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;