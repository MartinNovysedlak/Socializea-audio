"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
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
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky</title>
        <meta name="description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly. Špičkový zvuk, dychberúce osvetlenie a DJ služby po celom Slovensku." />
        <meta name="keywords" content="prenájom ozvučenia, prenájom reproduktorov, prenájom svetiel, DJ technika prenájom, svadobné ozvučenie, ozvučenie na párty, predaj audio techniky, svetelná show, Socializea, Čadca, Žilina" />
        <link rel="canonical" href="https://socializea.sk" />
        <meta property="og:title" content="Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky" />
        <meta property="og:description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socializea.sk" />
        <meta property="og:image" content="https://socializea.sk/logo.png" />
        <meta property="og:locale" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky" />
        <meta name="twitter:description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly." />
        <meta name="twitter:image" content="https://socializea.sk/logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Socializea Audio",
            "url": "https://socializea.sk",
            "logo": "https://socializea.sk/logo.png",
            "description": "Profesionálny prenájom a predaj zvukovej a svetelnej techniky.",
            "email": "socializea@socializea.com",
            "telephone": "+421948070577",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Čadečka 1924",
              "addressLocality": "Čadca",
              "postalCode": "022 01",
              "addressCountry": "SK"
            },
            "sameAs": ["https://www.instagram.com/socializea"]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#020721] text-white selection:bg-[#BD20D3]/30 selection:text-white">
        <Navbar />
        <main className="space-y-4">
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
        <MadeWithDyad />
      </div>
    </>
  );
};

export default Index;