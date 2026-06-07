"use client";

import React, { useEffect, useRef, useState } from 'react';

const ContactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const center: [number, number] = [49.21302405266172, 18.747822075596567];

  useEffect(() => {
    // 1. Inject Leaflet CSS dynamically
    const leafletCssId = 'leaflet-cdn-css';
    if (!document.getElementById(leafletCssId)) {
      const link = document.createElement('link');
      link.id = leafletCssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // 2. Inject Leaflet JS dynamically
    const leafletJsId = 'leaflet-cdn-js';
    if (!document.getElementById(leafletJsId)) {
      const script = document.createElement('script');
      script.id = leafletJsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.crossOrigin = '';
      script.onload = () => {
        setIsLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else if ((window as any).L) {
      setIsLeafletLoaded(true);
    }

    // 3. Add custom map UI overrides
    const styleId = 'contact-map-custom-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = `
        .leaflet-container {
          background: #020721 !important;
        }
        .leaflet-marker-shadow {
          display: none !important;
        }
        .leaflet-marker-icon.leaflet-interactive:not(.custom-brand-marker) {
          opacity: 0 !important;
        }
        .custom-brand-marker {
          transition: transform 0.2s ease;
        }
        .custom-brand-marker:hover {
          transform: scale(1.15);
        }
        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 0.3; }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: linear-gradient(135deg, #0a0d1f 0%, #020721 100%) !important;
          border: 1px solid rgba(189,32,211,0.4) !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(189,32,211,0.15) !important;
          padding: 0 !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
          color: white !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: #020721 !important;
          border: 1px solid rgba(189,32,211,0.4) !important;
          border-right: none !important;
          border-bottom: none !important;
        }
        .leaflet-popup-close-button {
          display: none !important;
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isLeafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Remove any existing map instance before initializing a new one
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 15,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Use dark-themed map tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Create a beautiful custom SVG pin as marker icon
    const customIcon = L.divIcon({
      className: 'custom-brand-marker',
      html: `
        <div style="position: relative; width: 32px; height: 42px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            bottom: -2px;
            width: 12px;
            height: 12px;
            background: rgba(189, 32, 211, 0.8);
            border-radius: 50%;
            box-shadow: 0 0 10px #BD20D3, 0 0 20px #BD20D3;
            animation: pulse-marker 2s infinite ease-in-out;
          "></div>
          <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 8px rgba(0,0,0,0.5));">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16 24.84 0 16 0ZM16 22C12.68 22 10 19.32 10 16C10 12.68 12.68 10 16 10C19.32 10 22 12.68 22 16C22 19.32 19.32 22 16 22Z" fill="#BD20D3"/>
            <circle cx="16" cy="16" r="4" fill="#1A4BFF" />
          </svg>
        </div>
      `,
      iconSize: [32, 46],
      iconAnchor: [16, 44],
      popupAnchor: [0, -42],
    });

    const marker = L.marker(center, { icon: customIcon }).addTo(map);

    const popupContent = `
      <div class="p-4 min-w-[220px] text-white">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-2.5 h-2.5 rounded-full bg-[#BD20D3]"></div>
          <span class="text-lg font-bold text-white">Socializea-audio</span>
        </div>
        <p class="text-gray-200 text-sm leading-relaxed mb-3">
          Vysokoškolská 4, 010 01 Žilina<br />
          <span class="text-[#BD20D3] font-medium">Budova SADOP</span>
        </p>
        <div class="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400">
          <span>📍</span>
          <span>49.2130° N, 18.7478° E</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      closeButton: false,
      autoClose: false,
      className: 'custom-popup',
    }).openPopup();

    // Trigger sizing recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [isLeafletLoaded]);

  return (
    <section className="py-12 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kde nás nájdete</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Naša prevádzka sa nachádza v centre Žiliny v budove SADOP na Vysokoškolskej ulici. Tešíme sa na vašu návštevu!
              </p>
            </div>
            
            <div className="h-[400px] rounded-3xl overflow-hidden relative border border-white/5 bg-[#020721]">
              {!isLeafletLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Načítavam mapu...
                </div>
              )}
              <div ref={mapContainerRef} className="w-full h-full" />
            </div>
            
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