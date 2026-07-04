"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ak sme sa sem dostali po kliknutí na "Späť" z detailu,
    // sessionStorage obsahuje pozíciu, ktorú obnoví Prenajom.tsx
    const savedScrollY = sessionStorage.getItem('prenajom-scroll-position');
    if (savedScrollY !== null) {
      return; // nerobíme scroll na vrch – Prenajom.tsx obnoví pozíciu
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}