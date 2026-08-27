"use client";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** react-helmet-async dopĺňa tagy, ale nemaže statické z index.html. Necháme vždy poslednú (aktuálnu) verziu. */
export default function SeoDedupe() {
  const { pathname } = useLocation();

  useEffect(() => {
    const keepLast = (selector: string) => {
      const nodes = [...document.querySelectorAll(selector)];
      if (nodes.length < 2) return;
      nodes.slice(0, -1).forEach((el) => el.remove());
    };

    keepLast('meta[name="robots"]');
    keepLast('meta[name="description"]');
    keepLast('meta[name="keywords"]');
    keepLast('meta[property="og:title"]');
    keepLast('meta[property="og:description"]');

    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    if (/noindex/i.test(robots)) {
      document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
      document.querySelectorAll('meta[property="og:url"]').forEach((el) => el.remove());
    } else {
      keepLast('link[rel="canonical"]');
      keepLast('meta[property="og:url"]');
    }
    keepLast('meta[property="og:image"]');
    keepLast('meta[name="twitter:title"]');
    keepLast('meta[name="twitter:description"]');
    keepLast('meta[name="twitter:image"]');

    const titles = [...document.querySelectorAll('title')];
    if (titles.length > 1) titles.slice(1).forEach((el) => el.remove());
  }, [pathname]);

  return null;
}
