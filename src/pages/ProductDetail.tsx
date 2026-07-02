"use client";

import React from 'react';

// Placeholder for SEO text – if a real implementation exists, replace this with the actual hook/data
const seo = {
  seoText: 'Toto je ukážkový SEO text pre detail produktu. V prípade reálneho použitia sem doplňte obsah z databázy alebo z hooku.'
};

const ProductDetail = () => {
  return (
    <div className="min-h-screen bg-[#020721] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto mt-32">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">Detail produktu</h1>
        <div className="p-5 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-gray-400 text-sm leading-relaxed">
            {seo?.seoText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;