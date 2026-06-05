"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

const ContactMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Koordináty pre fialový bod v Žiline (ulica Republiky)
  const targetCoords: [number, number] = [49.212968, 18.747859];

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current, {
      center: targetCoords,
      zoom: 17,
      zoomControl: false,
      attributionControl: false,
    });

    // Tmavý motív mapy pre dokonalú integráciu do dizajnu
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background: #BD20D3;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 25px rgba(189, 32, 211, 0.7), 0 0 50px rgba(189, 32, 211, 0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(targetCoords, { icon: customIcon }).addTo(mapInstanceRef.current)
      .bindPopup(
        '<div style="color: #333; font-family: sans-serif; text-align: center; padding: 4px;"><strong>Socializea Audio</strong><br/>Budova SADOP<br/>Vysokoškolákov 2989/6<br/>010 08 Žilina</div>'
      );

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section id="mapa" className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 relative z-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kde nás nájdete?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Budova SADOP, Vysokoškolákov 2989/6, 010 08 Žilina
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-[2.5rem] px-4 pb-4 pt-48 backdrop-blur-xl overflow-hidden -mt-48 relative z-10"
        >
          <div 
            ref={mapRef}
            className="w-full h-[650px] rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactMap;