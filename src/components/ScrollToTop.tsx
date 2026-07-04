"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = 'manual';

    // Ak sme na stránke prenájmu a je uložená pozícia, obnovíme ju
    if (pathname === '/prenajom') {
      const savedScrollY = sessionStorage.getItem('prenajom-scroll-position');
      if (savedScrollY !== null) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        sessionStorage.removeItem('prenajom-scroll-position');
        return;
      }
    }

    // Inak skrolujeme na vrch
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}