"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import Kontakt from "./pages/Kontakt";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Predaj from "./pages/Predaj";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import ObchodnePodmienky from "./pages/ObchodnePodmienky";
import PodmienkyPouzivania from "./pages/PodmienkyPouzivania";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/prenajom" element={<Index />} />
            <Route path="/prenajom/:id" element={<Index />} />
            <Route path="/equipment/:id" element={<Index />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/obchodne-podmienky" element={<ObchodnePodmienky />} />
            <Route path="/podmienky-pouzivania" element={<PodmienkyPouzivania />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPostDetail />} />
            <Route path="/predaj" element={<Predaj />} />
            <Route path="/predaj/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;