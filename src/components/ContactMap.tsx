"use client";

import React, { useEffect, useRef } from 'react';

const ContactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      // Using a styled iframe with OpenStreetMap embed
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=18.735%2C49.220%2C18.745%2C49.225&layer=mapnik&marker=49.2225%2C18.74';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.frameBorder = '0';
      iframe.style.border = '0';
      iframe.title = 'Mapa lokality Socializea-audio v Žiline';
      iframe.allowFullScreen = true;
      mapContainerRef.current.appendChild(iframe);

      return () => {
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = '';
        }
      };
    }
  }, []);

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kde nás nájdete</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Naša prevádzka sa nachádza v centre Žiliny v budove SADOP na Vysokoškolskej ulici. Tešíme sa na vašu návštevu!
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden">
            <div 
              ref={mapContainerRef}
              className="h-[400px] rounded-3xl overflow-hidden"
              style={{ filter: 'grayscale(1) contrast(1.2) brightness(0.7) sepia(0.2) hue-rotate(240deg) saturate(0.8)' }}
            />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              <strong>Adresa:</strong> Vysokoškolská 4, 010 01 Žilina, Slovensko (Budova SADOP)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;