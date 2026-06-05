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

<dyad-write path="src/components/ContactMap.tsx" description="Creating a dark-themed map component matching the site design">
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

<dyad-write path="src/pages/Kontakt.tsx" description="Adding map section below the contact form on the contact page">
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