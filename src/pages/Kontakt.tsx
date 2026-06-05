"use client";

import React from 'react';
import ContactForm from '../components/ContactForm';
import ContactMap from '../components/ContactMap';

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-[#020721]">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">Kontaktujte nás</h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto text-center mb-12">
          Máte otázky alebo potrebujete nezáväznú ponuku? Napíšte nám alebo nás navštívte.
        </p>
        
        <ContactForm />
      </main>

      <ContactMap />
    </div>
  );
};

export default Kontakt;