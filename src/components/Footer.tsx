"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Settings, FileText, Shield, Cookie, MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY } from '@/lib/company';
import { openCookieSettings } from '@/lib/cookieConsent';

const Footer = () => {
  return (
    <footer className="bg-[#020721] border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo-icon.png" alt="" className="h-10 w-10 object-contain" />
              <span className="text-lg font-bold tracking-tighter text-white uppercase leading-none">
                Socializea<span className="text-[#BD20D3]">-audio</span>
              </span>
            </Link>
            <div className="text-sm text-gray-400 space-y-2">
              <p className="flex items-start justify-center md:justify-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-[#BD20D3]" />
                <span>
                  {COMPANY.owner}<br />
                  {COMPANY.street}<br />
                  {COMPANY.zip} {COMPANY.city}
                </span>
              </p>
              <a href={COMPANY.phoneHref} className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
                <Phone size={14} className="text-[#BD20D3]" />
                {COMPANY.phone}
              </a>
              <a href={COMPANY.emailHref} className="flex items-center justify-center md:justify-start gap-2 hover:text-white transition-colors">
                <Mail size={14} className="text-[#BD20D3]" />
                {COMPANY.email}
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-6">
              <a
                href="https://www.instagram.com/socializea_audio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#BD20D3] transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/p/Socializea-Audio-61556243854211/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#BD20D3] transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <Facebook size={20} />
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
              <Link to="/obchodne-podmienky" className="hover:text-[#BD20D3] transition-colors flex items-center gap-1.5">
                <FileText size={12} />
                <span>Obchodné podmienky</span>
              </Link>
              <Link to="/podmienky-pouzivania" className="hover:text-[#BD20D3] transition-colors flex items-center gap-1.5">
                <Shield size={12} />
                <span>Ochrana súkromia</span>
              </Link>
              <button
                type="button"
                onClick={openCookieSettings}
                className="hover:text-[#BD20D3] transition-colors flex items-center gap-1.5"
              >
                <Cookie size={12} />
                <span>Nastavenie cookies</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {COMPANY.brand}. Všetky práva vyhradené.
            </p>
            <p className="text-xs text-gray-600">Odberné miesto: {COMPANY.pickupZilina}, {COMPANY.pickupZilinaCity}</p>
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
    </footer>
  );
};

export default Footer;
