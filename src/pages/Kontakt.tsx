"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

const Kontakt = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
};

export default Kontakt;