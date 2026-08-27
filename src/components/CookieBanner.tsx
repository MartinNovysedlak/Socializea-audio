"use client";

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cookie, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  COOKIE_SETTINGS_EVENT,
  getCookieConsent,
  saveCookieConsent,
} from '@/lib/cookieConsent';

const CookieBanner = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = getCookieConsent();
    if (!existing) setVisible(true);
    else {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    }

    const open = () => {
      const current = getCookieConsent();
      if (current) {
        setAnalytics(current.analytics);
        setMarketing(current.marketing);
      }
      setShowSettings(true);
      setVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  const close = () => {
    setVisible(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    saveCookieConsent({ analytics: false, marketing: false });
    close();
  };

  const acceptAll = () => {
    saveCookieConsent({ analytics: true, marketing: true });
    close();
  };

  const saveCustom = () => {
    saveCookieConsent({ analytics, marketing });
    close();
  };

  if (!visible) return null;
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] p-3 md:p-5">
      <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-[#0a0d1f]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.45)] p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#BD20D3]/15 border border-[#BD20D3]/30 flex items-center justify-center text-[#BD20D3] shrink-0">
            <Cookie size={18} />
          </div>
          <div>
            <p className="text-white font-bold text-sm md:text-base">Súbory cookies</p>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-1">
              Používame nevyhnutné cookies (košík, nastavenie súhlasu). Analytické a marketingové cookies zapneme len so súhlasom.{' '}
              <Link to="/podmienky-pouzivania" className="text-[#BD20D3] hover:underline">
                Zásady ochrany súkromia
              </Link>
            </p>
          </div>
        </div>

        {showSettings && (
          <div className="space-y-3 mb-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <label className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold">Nevyhnutné</p>
                <p className="text-gray-500 text-xs mt-0.5">Košík, relácia a uloženie vášho súhlasu. Vždy zapnuté.</p>
              </div>
              <input type="checkbox" checked disabled className="mt-1 accent-[#BD20D3]" />
            </label>
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-white text-sm font-semibold">Analytické</p>
                <p className="text-gray-500 text-xs mt-0.5">Anonymné štatistiky návštevnosti. Momentálne ich nespúšťame, kým ich nezapneme v kóde.</p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 accent-[#BD20D3]"
              />
            </label>
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-white text-sm font-semibold">Marketingové</p>
                <p className="text-gray-500 text-xs mt-0.5">Reklamné meranie. Momentálne ich nepoužívame.</p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 accent-[#BD20D3]"
              />
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSettings((v) => !v)}
            className="border-white/15 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl h-11"
          >
            <Settings2 size={14} className="mr-2" />
            {showSettings ? 'Skryť nastavenia' : 'Nastavenia'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={acceptNecessary}
            className="border-white/15 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl h-11"
          >
            Len nevyhnutné
          </Button>
          {showSettings ? (
            <Button type="button" onClick={saveCustom} className="btn-cyber border-none rounded-xl h-11">
              Uložiť výber
            </Button>
          ) : (
            <Button type="button" onClick={acceptAll} className="btn-cyber border-none rounded-xl h-11">
              Prijať všetko
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
