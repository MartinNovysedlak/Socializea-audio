"use client";

import React, { useEffect, useRef } from 'react';

const ContactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
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
          
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden relative">
            {/* Top glow accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div 
              ref={mapContainerRef}
              className="h-[400px] rounded-3xl overflow-hidden relative"
              style={{ 
                filter: 'grayscale(1) contrast(1.3) brightness(0.6) sepia(0.3) hue-rotate(260deg) saturate(1.5)',
                backgroundColor: '#020721'
              }}
            />
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]"></span>
              <strong>Adresa:</strong> Vysokoškolská 4, 010 01 Žilina, Slovensko (Budova SADOP)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;