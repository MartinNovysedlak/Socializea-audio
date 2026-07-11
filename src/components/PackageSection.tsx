"use client";

import React, { useState, useEffect } from 'react';
import { Package as PackageIcon, Volume2, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { packagesService, PackageData } from '@/lib/packagesService';
import PackageDetailDialog, { PackageOption } from './PackageDetailDialog';
import { EquipmentItem } from '@/lib/supabase';

interface PackageSectionProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const PackageSection = ({ quantities, setQuantities, equipment }: PackageSectionProps) => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      const data = await packagesService.getAll();
      setPackages(data);
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const openPackageDialog = (pkg: PackageData) => {
    const option: PackageOption = {
      id: pkg.id,
      name: pkg.name,
      priceNoLights: pkg.price_no_lights,
      priceWithLights: pkg.price_with_lights,
      image: pkg.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format',
      description: pkg.description,
      soundSpecs: pkg.sound_specs || [],
      lightSpecs: pkg.light_specs || [],
      otherSpecs: pkg.other_specs || [],
      warning: pkg.warning || undefined,
    };
    setSelectedPackage(option);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
        <Loader2 className="animate-spin" size={18} />
        <span>Načítavam balíky...</span>
      </div>
    );
  }

  if (packages.length === 0) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest mb-4">
            <PackageIcon size={14} />
            <span>Zvýhodnené sety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Naše balíky a sety
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Vyberte si z predpripravených balíkov alebo si zostavte vlastnú zostavu z katalógu nižšie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const displayImg = pkg.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format';
            const hasLights = pkg.light_specs && pkg.light_specs.length > 0;

            return (
              <Card
                key={pkg.id}
                className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl overflow-hidden hover:border-[#BD20D3]/50 transition-all group hover:shadow-lg hover:shadow-[#BD20D3]/10 hover:-translate-y-1 cursor-pointer"
                onClick={() => openPackageDialog(pkg)}
              >
                <div className="h-44 overflow-hidden relative bg-black/40">
                  <img
                    src={displayImg}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020721] via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {pkg.sound_specs && pkg.sound_specs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-600/80 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Volume2 size={10} />
                        Zvuk
                      </span>
                    )}
                    {hasLights && (
                      <span className="px-2 py-0.5 rounded-full bg-[#BD20D3]/80 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Lightbulb size={10} />
                        Svetlá
                      </span>
                    )}
                  </div>
                </div>

                <CardHeader className="pt-5 pb-0">
                  <CardTitle className="text-lg font-bold text-white group-hover:text-[#BD20D3] transition-colors">
                    {pkg.name}
                  </CardTitle>
                  <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-5 pb-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Od</p>
                      <p className="text-xl font-extrabold text-[#BD20D3]">{pkg.price_no_lights} € <span className="text-xs text-gray-400 font-normal">/ víkend</span></p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 border border-[#BD20D3]/40 text-white rounded-xl h-9 px-4 text-xs font-semibold transition-all pointer-events-none"
                    >
                      Detail <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <PackageDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedPackage={selectedPackage}
      />
    </>
  );
};

export default PackageSection;