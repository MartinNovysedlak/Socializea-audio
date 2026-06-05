"use client";

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ContactMap = () => {
  // Coordinates for Žilina, Vysokoškolská, budova SADOP (University of Žilina area)
  const mapCenter: [number, number] = [49.2236, 18.7428];
  const zoomLevel = 16;

  useEffect(() => {
    const map = L.map('contact-map', {
      center: mapCenter,
      zoom: zoomLevel,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark themed tile layer to match website colors
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Custom purple marker with glow effect
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

    L.marker(mapCenter, { icon: customIcon }).addTo(map)
      .bindPopup(
        '<div style="color: #333; font-family: sans-serif; text-align: center;"><strong>Socializea Audio</strong><br/>Vysokoškolská, budova SADOP<br/>Žilina</div>'
      );

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section id="mapa" className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Kde nás nájdete</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Navštívte nás v Žiline na adrese Vysokoškolská, budova SADOP. Tešíme sa na vás!
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden">
          <div 
            id="contact-map" 
            className="w-full h-[450px] rounded-2xl"
            style={{ zIndex: 1 }}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;