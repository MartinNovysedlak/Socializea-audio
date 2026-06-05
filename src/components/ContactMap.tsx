"use client";

import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ContactMap = () => {
  const mapCenter: [number, number] = [49.2236, 18.7428]; // Žilina Vysokoškolská area
  const zoomLevel = 15;

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

    // Custom purple marker
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 20px;
        height: 20px;
        background: #BD20D3;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(189, 32, 211, 0.6);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker(mapCenter, { icon: customIcon }).addTo(map)
      .bindPopup('<div style="color: #333; font-family: sans-serif; font-weight: bold;">Socializea Audio<br/>Žilina</div>');

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section className="py-8 bg-[#020721]">
      <div className="container mx-auto px-4">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 backdrop-blur-xl overflow-hidden">
          <div 
            id="contact-map" 
            className="w-full h-[400px] rounded-2xl"
            style={{ zIndex: 1 }}
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap;