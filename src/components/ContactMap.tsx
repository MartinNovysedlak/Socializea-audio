"use client";

import React, { useEffect, useRef } from 'react';

const ContactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Coordinates: 49.21302405266172, 18.747822075596567
  const lat = 49.21302405266172;
  const lon = 18.747822075596567;

  // Calculate bbox around the point (approx 0.01 degree ~ 1km)
  const bbox = `${lon - 0.005}%2C${lat - 0.005}%2C${lon + 0.005}%2C${lat + 0.005}`;

  useEffect(() => {
    if (mapContainerRef.current) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
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
  }, [bbox, lat, lon]);

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kde nás nájdete</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Naša prevádzka sa nachádza v centre Žiliny. Tešíme sa na vašu návštevu!
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden relative">
            <div 
              ref={mapContainerRef}
              className="h-[400px] rounded-3xl overflow-hidden"
              style={{ 
                filter: 'grayscale(1) contrast(1.2) brightness(0.8)',
                backgroundColor: '#020721'
              }}
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