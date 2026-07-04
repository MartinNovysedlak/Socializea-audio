"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    // Ak ideme na /prenajom a je uložená pozícia, necháme obnovenie na Prenajom.tsx
    if (pathname === '/prenajom') {
      const saved = sessionStorage.getItem('prenajom-scroll-position');
      if (saved !== null) {
        return; // Prenajom.tsx obnoví pozíciu až po načítaní obsahu
      }
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}