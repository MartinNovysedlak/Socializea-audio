"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Lightbulb, Volume2, ChevronRight } from 'lucide-react';
import { PackageOption } from './PackageDetailDialog';

interface RentalPackageCardProps {
  pkg: PackageOption;
  onDetail: () => void;
}

const RentalPackageCard = ({ pkg, onDetail }: RentalPackageCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-2xl overflow-hidden hover:border-[#BD20D3]/40 transition-all duration-300 group h-full flex flex-col">
      <div className="h-40 overflow-hidden relative bg-black/40 border-b border-white/5">
        <img
          src={pkg.image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <CardHeader className="pt-5 pb-0 px-5">
        <CardTitle className="text-lg sm:text-xl font-bold text-white group-hover:text-[#BD20D3] transition-colors line-clamp-1">
          {pkg.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow px-5 pb-5 pt-3 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {pkg.soundSpecs.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-semibold">
                <Volume2 size={10} />
                Zvuk
              </span>
            )}
            {pkg.lightSpecs.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-[10px] font-semibold">
                <Lightbulb size={10} />
                Svetlá
              </span>
            )}
            {pkg.otherSpecs && pkg.otherSpecs.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-semibold">
                <Package size={10} />
                Ostatné
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-400 line-clamp-2">
            {pkg.description}
          </p>
        </div>

        <div className="pt-4 mt-auto">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-xl font-bold text-[#BD20D3]">{pkg.priceWithLights} €</span>
            <span className="text-gray-500 text-xs">/ víkend</span>
          </div>

          <Button
            onClick={onDetail}
            className="w-full bg-white/5 hover:bg-[#BD20D3]/15 border border-white/10 hover:border-[#BD20D3]/40 text-white rounded-xl h-10 text-sm font-semibold transition-all"
          >
            Detail balíka
            <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalPackageCard;