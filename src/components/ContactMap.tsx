"use client";

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ContactMap = () => {
  const mapRef = useRef<any>(null);
  const center = [49.21302405266172, 18.747822075596567];

  // Custom marker icon in brand color
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'custom-marker',
  });

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            {/* Top glow accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kde nás nájdete</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Naša prevádzka sa nachádza v centre Žiliny v budove SADOP na Vysokoškolskej ulici. Tešíme sa na vašu návštevu!
              </p>
            </div>
            
            <div className="h-[400px] rounded-3xl overflow-hidden relative">
              <MapContainer
                ref={mapRef}
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ backgroundColor: '#020721' }}
              >
                {/* CartoDB Dark Matter - true black/white tiles */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  subdomains={['a', 'b', 'c', 'd']}
                  maxZoom={19}
                />
                <Marker position={center} icon={customIcon}>
                  <Popup>
                    <div className="text-white p-1">
                      <strong>Socializea-audio</strong><br />
                      Vysokoškolská 4, 010 01 Žilina
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF]"></span>
                <strong>Adresa:</strong> Vysokoškolská 4, 010 01 Žilina, Slovensko (Budova SADOP)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;