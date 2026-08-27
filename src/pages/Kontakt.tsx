"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import SeoHead from '@/components/SeoHead';
import FAQSection from '@/components/FAQSection';

const Kontakt = () => {
  return (
    <>
      <SeoHead
        path="/kontakt"
        breadcrumbs={[
          { name: 'Domov', path: '/' },
          { name: 'Kontakt', path: '/kontakt' },
        ]}
      />
      <Navbar />
      <div className="pt-24">
        <ScrollReveal direction="up" delay={0.1}>
          <ContactForm />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.15}>
          <ContactMap />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.2}>
          <FAQSection />
        </ScrollReveal>
      </div>
      <Footer />
    </>
  );
};

export default Kontakt;
