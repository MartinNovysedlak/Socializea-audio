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
import { SITE_URL, absoluteAsset } from '@/lib/site';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky</title>
        <meta name="description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly. Špičkový zvuk, dychberúce osvetlenie a DJ služby po celom Slovensku." />
        <meta name="keywords" content="prenájom ozvučenia, prenájom reproduktorov, prenájom svetiel, DJ technika prenájom, svadobné ozvučenie, ozvučenie na párty, predaj audio techniky, svetelná show, Socializea, Čadca, Žilina" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content="Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky" />
        <meta property="og:description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={absoluteAsset('/logo.png')} />
        <meta property="og:locale" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Socializea Audio – Prenájom & Predaj Profesionálnej Zvukovej a Svetelnej Techniky" />
        <meta name="twitter:description" content="Profesionálny prenájom a predaj zvukovej a svetelnej techniky pre svadby, firemné akcie, párty a festivaly." />
        <meta name="twitter:image" content={absoluteAsset('/logo.png')} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Socializea Audio",
            "url": SITE_URL,
            "logo": absoluteAsset('/logo.png'),
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
            "sameAs": [
              "https://www.instagram.com/socializea_audio",
              "https://www.facebook.com/p/Socializea-Audio-61556243854211/"
            ]
          })}
        </script>
      </Helmet>

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