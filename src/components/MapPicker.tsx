"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2, Navigation, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface MapPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

const PICKUP_POINTS = [
  { name: 'Žilina', lat: 49.2235, lng: 18.7394 },
  { name: 'Čadca', lat: 49.4358, lng: 18.7889 },
];

const KYSUCE_BOUNDS: { lat: number; lng: number }[] = [
  { lat: 49.520, lng: 18.550 },
  { lat: 49.500, lng: 19.050 },
  { lat: 49.350, lng: 19.050 },
  { lat: 49.250, lng: 18.800 },
  { lat: 49.280, lng: 18.600 },
];

const MapPicker = ({ open, onOpenChange, onLocationSelect }: MapPickerProps) => {
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [selectedName, setSelectedName] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const initMap = useCallback(async () => {
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(mapContainerRef.current!, {
        center: [48.7, 19.5],
        zoom: 7.5,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Draw Kysuce free-delivery zone polygon
      const kysucePolygon = L.polygon(KYSUCE_BOUNDS, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(map);

      kysucePolygon.bindPopup(`
        <div style="padding:10px;min-width:200px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="width:10px;height:10px;border-radius:50%;background:#10b981;"></div>
            <span style="font-weight:bold;font-size:14px;color:#10b981;">Oblasť Kysuce</span>
          </div>
          <p style="margin:0;font-size:12px;color:#4b5563;line-height:1.4;">
            Do tohto regiónu je doprava techniky <strong style="color:#10b981;">zdarma</strong>.
            Patria sem: Čadca, Kysucké Nové Mesto, Turzovka, Krásno nad Kysucou a okolité obce.
          </p>
        </div>
      `);

      // Add pickup points with popups
      PICKUP_POINTS.forEach((point) => {
        const icon = L.divIcon({
          className: 'custom-pickup-marker',
          html: `<div style="background:#1A4BFF;color:white;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:bold;white-space:nowrap;border:2px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;gap:4px;cursor:pointer;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${point.name}
          </div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="padding:12px;min-width:220px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <div style="width:10px;height:10px;border-radius:50%;background:#1A4BFF;"></div>
              <span style="font-weight:bold;font-size:15px;color:#1A4BFF;">${point.name === 'Žilina' ? 'Odberné miesto Žilina' : 'Hlavný sklad a sídlo'}</span>
            </div>
            ${point.name === 'Žilina' 
              ? '<p style="margin:0 0 4px 0;font-size:13px;color:#374151;"><strong>Adresa:</strong> Vysokoškolská 4, Budova SADOP</p><p style="margin:0;font-size:12px;color:#6b7280;">010 01 Žilina</p>'
              : '<p style="margin:0 0 4px 0;font-size:13px;color:#374151;"><strong>Adresa:</strong> Čadečka 1924</p><p style="margin:0;font-size:12px;color:#6b7280;">022 01 Čadca</p>'
            }
            <div style="margin-top:8px;padding-top:6px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#10b981;"><strong>✓</strong> Osobný odber zdarma</p>
              <p style="margin:0;font-size:11px;color:#10b981;"><strong>✓</strong> Doprava do 10 km zadarmo</p>
            </div>
          </div>
        `);
      });

      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setSelectedLat(lat);
        setSelectedLng(lng);

        // Reverse geocode
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=sk`,
          { headers: { 'User-Agent': 'DjPartyRental/1.0 (djparty@example.com)' } }
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.address || {};
            const cityName = address.city || address.town || address.village || address.municipality || address.county || 'Neznáme miesto';
            setSelectedName(cityName);
          })
          .catch(() => {
            setSelectedName('Neznáme miesto');
          });

        // Update marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        const customIcon = L.divIcon({
          className: 'custom-selected-marker',
          html: `<div style="background:#BD20D3;color:white;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 3px 12px rgba(189,32,211,0.6);font-size:16px;">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      });

      mapRef.current = map;
      setMapLoaded(true);
    } catch (err) {
      console.error('Failed to load map:', err);
      toast.error('Nepodarilo sa načítať mapu.');
    }
  }, []);

  useEffect(() => {
    if (open && !mapRef.current) {
      const timer = setTimeout(() => initMap(), 100);
      return () => clearTimeout(timer);
    }
    return () => {
      if (!open && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [open, initMap]);

  const handleConfirm = () => {
    if (selectedLat === null || selectedLng === null) {
      toast.error('Prosím, kliknite na mapu a vyberte miesto.');
      return;
    }
    onLocationSelect(selectedLat, selectedLng, selectedName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-3xl rounded-3xl p-0 overflow-hidden shadow-2xl shadow-[#BD20D3]/20">
        <DialogHeader className="p-4 md:p-6 border-b border-white/5">
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
            <MapPin className="text-[#BD20D3]" size={20} />
            Vyberte miesto na mape
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 md:p-6 space-y-4">
          <div className="relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 relative"
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80 z-10">
                  <Loader2 size={24} className="animate-spin text-[#BD20D3]" />
                </div>
              )}
            </div>

            {/* Legenda – prekryv na mape */}
            <div className="absolute bottom-4 left-4 z-20 bg-[#0a0d1f]/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 shadow-lg max-w-[220px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Legenda</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#1A4BFF] border border-white/40 shrink-0"></div>
                  <span className="text-[10px] text-white">Výdajné miesto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10b981] border border-white/40 shrink-0"></div>
                  <span className="text-[10px] text-white">Doprava ZDARMA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px]">📍</div>
                  <span className="text-[10px] text-white">Vami vybrané miesto</span>
                </div>
              </div>
            </div>
          </div>

          {selectedLat !== null && selectedLng !== null && (
            <div className="bg-gradient-to-br from-[#1A4BFF]/[0.08] to-[#BD20D3]/[0.06] border border-white/[0.12] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-[#BD20D3] shrink-0" />
                <span className="text-white font-medium">{selectedName}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Navigation size={12} />
                <span>{selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}</span>
              </div>
              <div className="text-[10px] text-gray-500">
                Kliknite na mapu pre výber miesta. Modré body = výdajné miesta (Žilina, Čadca). Zelená oblasť = Kysuce – doprava zadarmo.
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white hover:bg-white/5 rounded-xl h-11 flex-1"
            >
              <X size={16} className="mr-1" /> Zrušiť
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={selectedLat === null}
              className="bg-[#BD20D3] hover:bg-[#BD20D3]/80 text-white rounded-xl h-11 flex-1 font-bold disabled:opacity-40 transition-all"
            >
              <Check size={16} className="mr-1" /> Potvrdiť výber
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapPicker;