"use client";

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ContactMap = () => {
  const mapRef = useRef<any>(null);
  const center = [49.21302405266172, 18.747822075596567];

  // Custom purple/magenta marker icon (#BD20D3)
  const customIcon = L.divIcon({
    className: 'custom-brand-marker',
    html: `
      <div style="
        width: 28px;
        height: 42px;
        background: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png') no-repeat center/contain;
        filter: hue-rotate(280deg) saturate(3) brightness(1.2);
        transform: rotate(0deg);
      "></div>
      <div style="
        width: 14px;
        height: 14px;
        background: #BD20D3;
        border: 3px solid #020721;
        border-radius: 50%;
        margin: -8px auto 0;
        box-shadow: 0 0 12px #BD20D3, 0 0 24px #BD20D3;
      "></div>
    `,
    iconSize: [28, 46],
    iconAnchor: [14, 46],
    popupAnchor: [0, -40],
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
                  <Popup
                    closeButton={false}
                    autoClose={false}
                    className="custom-popup"
                  >
                    <div className="text-white p-3 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#BD20D3]"></div>
                        <strong className="text-lg">Socializea-audio</strong>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Vysokoškolská 4, 010 01 Žilina<br />
                        <span className="text-[#BD20D3]">Budova SADOP</span>
                      </p>
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400">
                        <span>📍</span>
                        <span>49.2130° N, 18.7478° E</span>
                      </div>
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
      
      <style jsx global>{`
        .custom-brand-marker {
          transition: transform 0.2s ease;
        }
        .custom-brand-marker:hover {
          transform: scale(1.15);
        }
        .leaflet-popup-content-wrapper.custom-popup {
          background: linear-gradient(135deg, #0a0d1f 0%, #020721 100%) !important;
          border: 1px solid #BD20D3/40 !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(189,32,211,0.15) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #020721 !important;
          border: 1px solid #BD20D3/40 !important;
          border-right: none !important;
          border-bottom: none !important;
        }
        .leaflet-popup-close-button {
          display: none !important;
        }
      `}</style>
    </section>
  );
};

export default ContactMap;