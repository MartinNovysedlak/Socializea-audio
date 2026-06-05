"use client";

import React from 'react';

const ContactMap = () => {
  return (
    <section className="py-24 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">Kde nás nájdete</h2>
          <p className="text-gray-300 text-center mb-10">Žilina, Vysokoškolská 4 - Budova SADOP</p>
          
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-500/10">
            <div className="relative h-[400px] rounded-3xl overflow-hidden">
              <iframe 
                title="Mapa lokality Socializea-audio"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://www.openstreetmap.org/export/embed.html?bbox=18.735%2C49.220%2C18.745%2C49.225&layer=mapnik&marker=49.2225%2C18.74"
                className="opacity-70 grayscale contrast-125 brightness-75 invert-[.2] sepia-[.3] hue-rotate-[240deg]"
                style={{ 
                  filter: 'brightness(0.7) invert(0.2) sepia(0.3) hue-rotate(240deg) saturate(0.8) contrast(1.3)',
                  transform: 'scale(1.05)'
                }}
              />
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#020721] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
</dyad-command>

<dyad-write path="src/pages/Kontakt.tsx" description="Adding map section below the contact form">
"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';
import Footer from '@/components/Footer';

const Kontakt = () => {
  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <div className="pt-20">
        <ContactForm />
        <ContactMap />
      </div>
      <Footer />
    </main>
  );
};

export default Kontakt;
</dyad-command>

<dyad-command type="refresh"></dyad-command>

Skúsim to opraviť a pridať mapu naprázdň, aby bolo isté, že sa zobrazí.

<dyad-write path="src/components/ContactMap.tsx" description="Updated map component with proper styling">
"use client";

import React from 'react';

const ContactMap = () => {
  return (
    <section className="py-12 bg-[#020721]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">Kde nás nájdete</h2>
          <p className="text-gray-300 text-center mb-10 text-lg">Žilina, Vysokoškolská 4 - Budova SADOP</p>
          
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden">
            <div className="h-[400px] rounded-3xl overflow-hidden">
              <iframe 
                title="Mapa lokality Socializea-audio"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://www.openstreetmap.org/export/embed.html?bbox=18.735%2C49.220%2C18.745%2C49.225&layer=mapnik&marker=49.2225%2C18.74"
                className="grayscale contrast-125 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;
</dyad-command>

<dyad-write path="src/components/ContactMap.tsx" description="Dark-themed map component matching the site design">
"use client";

import React from 'react';

const ContactMap = () => {
  return (
    <section className="py-12 bg-[#020721]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">Kde nás nájdete</h2>
          <p className="text-gray-300 text-center mb-10 text-lg">Žilina, Vysokoškolská 4 - Budova SADOP</p>
          
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden">
            <div className="h-[400px] rounded-3xl overflow-hidden">
              <iframe 
                title="Mapa lokality Socializea-audio"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://www.openstreetmap.org/export/embed.html?bbox=18.735%2C49.220%2C18.745%2C49.225&layer=mapnik&marker=49.2225%2C18.74"
                className="grayscale contrast-125 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;