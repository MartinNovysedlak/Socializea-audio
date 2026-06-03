"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RentalSummary from '@/components/RentalSummary';
import SalesSummary from '@/components/SalesSummary';
import DJSection from '@/components/DJSection';
import Catalog from '@/components/Catalog';
import RentalCalculator from '@/components/RentalCalculator';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#020721] text-white selection:bg-[#BD20D3]/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <RentalSummary />
        <SalesSummary />
        <DJSection />
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