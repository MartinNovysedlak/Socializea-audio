"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { absoluteUrl, absoluteAsset } from '@/lib/site';

const Kontakt = () => {
  return (
    <>
      <Helmet>
        <title>Kontakt | Socializea Audio</title>
        <meta
          name="description"
          content="Kontaktujte Socializea Audio – prenájom a predaj zvukovej a svetelnej techniky. Čadca, Žilina a celé Slovensko."
        />
        <link rel="canonical" href={absoluteUrl('/kontakt')} />
        <meta property="og:title" content="Kontakt | Socializea Audio" />
        <meta
          property="og:description"
          content="Kontaktujte Socializea Audio – prenájom a predaj zvukovej a svetelnej techniky. Čadca, Žilina a celé Slovensko."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/kontakt')} />
        <meta property="og:image" content={absoluteAsset('/logo.png')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kontakt | Socializea Audio" />
        <meta
          name="twitter:description"
          content="Kontaktujte Socializea Audio – prenájom a predaj zvukovej a svetelnej techniky."
        />
        <meta name="twitter:image" content={absoluteAsset('/logo.png')} />
      </Helmet>
      <Navbar />
      <div className="pt-24">
        <ScrollReveal direction="up" delay={0.1}>
          <ContactForm />
        </ScrollReveal>
        <ScrollReveal direction="up" delay={0.15}>
          <ContactMap />
        </ScrollReveal>
      </div>
      <Footer />
    </>
  );
};

export default Kontakt;
