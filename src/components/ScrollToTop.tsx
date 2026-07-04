"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Vypneme automatické scrollovanie prehliadača – všetky scroly budeme ovládať manuálne
    window.history.scrollRestoration = 'manual';

    // Ak sme na /prenajom a sessionStorage obsahuje pozíciu, neskrolujeme na vrch
    if (pathname === '/prenajom') {
      const savedScrollY = sessionStorage.getItem('prenajom-scroll-position');
      if (savedScrollY !== null) {
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}