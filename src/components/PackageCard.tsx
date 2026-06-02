"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PackageProps {
  title: string;
  price: number;
  features: string[];
  image: string;
  isPopular?: boolean;
}

const PackageCard = ({ title, price, features, image, isPopular }: PackageProps) => {
  return (
    <Card className={`relative overflow-hidden bg-zinc-900/50 border-white/10 transition-all duration-300 hover:border-indigo-500/50 hover:translate-y-[-8px] ${isPopular ? 'ring-2 ring-indigo-500' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
          Populárne
        </div>
      )}
      
      <div className="h-48 overflow-hidden bg-zinc-800 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>

      <CardHeader className="pt-6">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-bold text-indigo-400">{price} €</span>
          <span className="text-gray-500 text-sm">/ deň</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
              <Check className="text-indigo-500 shrink-0 mt-0.5" size={16} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-6">
        <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl">
          Viac informácií
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;