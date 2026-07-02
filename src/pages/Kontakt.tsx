"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';

const Kontakt = () => {
  return (
    <main className="min-h-screen bg-[#020721] relative overflow-hidden">
      <Navbar />
      
      {/* Background Floating Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />

      <div className="pt-20 relative z-10 animate-fade-slide-up">
        <ContactForm />
        <ContactMap />
      </div>
      <Footer />
    </main>
  );
};

export default Kontakt;