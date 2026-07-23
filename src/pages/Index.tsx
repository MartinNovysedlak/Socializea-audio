"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import InteractiveQuiz from '@/components/InteractiveQuiz';
import RentalSummary from '@/components/RentalSummary';
import DJSection from '@/components/DJSection';
import SalesSummary from '@/components/SalesSummary';
import ContactForm from '@/components/ContactForm';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import SeoHead from '@/components/SeoHead';

const Index = () => {
  return (
    <>
      <SeoHead path="/" includeSiteGraph />

      <div className="min-h-screen bg-[#020721] text-white selection:bg-[#BD20D3]/30 selection:text-white">
        <Navbar />
        <main className="space-y-4 md:space-y-8 lg:space-y-12">
          <ScrollReveal delay={0.1}>
            <Hero />
          </ScrollReveal>
          
          <ScrollReveal delay={0.15}>
            <InteractiveQuiz />
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <RentalSummary />
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <DJSection />
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <SalesSummary />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <FAQSection />
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <ContactForm />
          </ScrollReveal>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
