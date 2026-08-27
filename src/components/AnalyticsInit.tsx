"use client";

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageview } from '@/lib/analytics/track';

const AnalyticsInit = () => {
  const location = useLocation();

  useEffect(() => {
    return initAnalytics();
  }, []);

  useEffect(() => {
    trackPageview(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsInit;
