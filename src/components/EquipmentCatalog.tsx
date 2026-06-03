"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PackageProps {
  title: string;
  price: number;
  features: string[];
  image: string;
  isPopular?: boolean;
}

const PackageCard = ({ title, price, features, image, isPopular }: PackageProps) => {
  return (
    <Card className="relative overflow-hidden bg-[#020721]/50 border-white/10 transition-all duration-300 hover:border-[#BD20D3]/50 hover:translate-y-[-8px] ring-1 ring-[#BD20D3]">
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg z-20">
          Populárne
        </div>
      )}
      <div className="h-48 overflow-hidden bg-zinc-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020721] to-transparent z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
        />
      </div>
      <CardHeader className="pt-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold text-[#BD20D3]">{price} €</span>
          <span className="text-gray-400 text-sm">/ deň</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="text-[#BD20D3] shrink-0 mt-0.5" size={16} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pb-6">
        <Button className="w-full bg-white/5 hover:bg-[#BD20D3]/10 text-white border border-white/10 rounded-xl transition-colors">
          Viac informácií
        </Button>
      </CardFooter>
    </Card>
  );
};

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
        "Vhodné do 50 osôb",
      ],
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
        "Vhodné do 120 osôb",
      ],
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
        "Atmosférické osvetlenie",
      ],
    },
  ];

  return (
    <section id="ponuka" className="py-24 bg-[#020721] relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Naša ponuka balíkov
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vyberte si z našich predpripravených sad, ktoré sme zostavili na základe dlhoročných skúseností.
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