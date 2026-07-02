"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';

const Kontakt = () => {
  return (
    <>
      <Helmet>
        <title>Kontakt – Socializea Audio | Prenájom Techniky Čadca & Žilina</title>
        <meta name="description" content="Kontaktujte Socializea Audio – profesionálny prenájom zvukovej a svetelnej techniky. Sídlo v Čadci, odberné miesto v Žiline. Telefón: +421 948 070 577, Email: socializea@socializea.com." />
        <meta name="keywords" content="kontakt Socializea, prenájom techniky Čadca, prenájom techniky Žilina, ozvučenie Čadca, ozvučenie Žilina, svetelná technika prenájom kontakt" />
        <link rel="canonical" href="https://socializea.sk/kontakt" />
        <meta property="og:title" content="Kontakt – Socializea Audio | Prenájom Techniky Čadca & Žilina" />
        <meta property="og:description" content="Kontaktujte Socializea Audio – profesionálny prenájom zvukovej a svetelnej techniky. Sídlo v Čadci, odberné miesto v Žiline." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://socializea.sk/kontakt" />
        <meta property="og:image" content="https://socializea.sk/logo.png" />
        <meta property="og:locale" content="sk_SK" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kontakt – Socializea Audio | Prenájom Techniky Čadca & Žilina" />
        <meta name="twitter:description" content="Kontaktujte Socializea Audio – profesionálny prenájom zvukovej a svetelnej techniky. Sídlo v Čadci, odberné miesto v Žiline." />
        <meta name="twitter:image" content="https://socializea.sk/logo.png" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Socializea Audio",
            "image": "https://socializea.sk/logo.png",
            "url": "https://socializea.sk",
            "telephone": "+421948070577",
            "email": "socializea@socializea.com",
            "description": "Profesionálny prenájom a predaj zvukovej a svetelnej techniky.",
            "address": [
              {
                "@type": "PostalAddress",
                "streetAddress": "Čadečka 1924",
                "addressLocality": "Čadca",
                "postalCode": "022 01",
                "addressCountry": "SK",
                "description": "Hlavný sklad a sídlo"
              },
              {
                "@type": "PostalAddress",
                "streetAddress": "Vysokoškolská 4, Budova SADOP",
                "addressLocality": "Žilina",
                "postalCode": "010 01",
                "addressCountry": "SK",
                "description": "Odberné miesto"
              }
            ],
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 49.4623,
              "longitude": 18.8252
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              "opens": "08:00",
              "closes": "18:00"
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721] relative overflow-hidden">
        <Navbar />
        
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#BD20D3]/10 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#1A4BFF]/5 rounded-full blur-[120px] animate-float-delayed pointer-events-none" />

        <div className="pt-20 relative z-10 animate-fade-slide-up">
          <ContactForm />
          <ContactMap />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Kontakt;