"use client";

import React from 'react';
import PackageCard from './PackageCard';

const Catalog = () => {
  const packages = [
    {
      title: "Párty Set M",
      price: 80,
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      features: [
        "2x Aktívny reproduktor 12\"",
        "Stojany na reproduktory",
        "Kompletná kabeláž",
        "Bluetooth prijímač",
        "Vhodné do 50 osôb"
      ]
    },
    {
      title: "Svadobný Set L",
      price: 150,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
      features: [
        "2x Aktívny reproduktor 15\"",
        "1x Aktívny subwoofer 18\"",
        "Svetelná rampa (4x LED PAR)",
        "Bezdrôtový mikrofón",
        "Vhodné do 120 osôb"
      ]
    },
    {
      title: "Svetelný Balík",
      price: 60,
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800",
      features: [
        "4x LED Moving Head",
        "Dymostroj s náplňou",
        "DMX ovládač",
        "Stojan na svetlá",
        "Atmosférické osvetlenie"
      ]
    }
  ];

  return (
    <section id="ponuka" className="py-24 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Naša ponuka balíkov</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vyberte si z našich predpripravených setov, ktoré sme zostavili na základe dlhoročných skúseností.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <PackageCard key={index} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;