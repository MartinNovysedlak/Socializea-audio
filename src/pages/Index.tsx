"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import RentalCalculator from '@/components/RentalCalculator';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <RentalCalculator />
        <ContactForm />
      </main>
      <Footer />
      <MadeWithDyad />
    </div>
  );
};

export default Index;