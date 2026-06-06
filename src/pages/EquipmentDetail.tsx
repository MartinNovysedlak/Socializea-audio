"use client";

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getStoredEquipment } from "@/hooks/useEquipment";
import { EquipmentItem } from "@/data/equipmentDatabase";

const EquipmentDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<EquipmentItem | null>(null);

  useEffect(() => {
    const items = getStoredEquipment();
    const found = items.find((i) => i.id === id);
    if (found) {
      setItem(found);
    }
  }, [id]);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-[#020721]">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Aparatúra nie je nájdená</h1>
            <p className="text-gray-400">Požadovaná položka nebola nájdená v našom katalógu.</p>
            <Link to="/prenajom" className="text-[#BD20D3] hover:underline mt-4 inline-block">Návrat do katalógu</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <CardHeader className="pb-4">
                    <h2 className="text-3xl font-bold text-white">{item.name}</h2>
                    <span className="text-xl text-[#BD20D3] uppercase">
                      {item.category === "sound"
                        ? "Zvuk"
                        : item.category === "lighting"
                          ? "Svetlá a efekty"
                          : "Ostatné"}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-300 leading-relaxed text-lg">{item.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.images && item.images.length > 0 ? (
                        item.images.map((img, idx) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-white/10">
                            <img
                              src={img}
                              alt={`${item.name} - fotka ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80";
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="aspect-video rounded-lg overflow-hidden border border-white/10 col-span-2">
                          <img
                            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80"
                            alt="Predvolený obrázok"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-6 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                      <div>
                        <span className="text-3xl font-bold text-[#BD20D3]">{item.pricePerDay} €</span>
                        <span className="text-gray-500 ml-2">/ deň</span>
                        <p className="text-gray-400 mt-1">
                          Dostupné: {item.available} {item.available === 1 ? "kus" : "kusy"}
                        </p>
                      </div>
                      <Link to="/prenajom">
                        <Button className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 h-12 px-6">
                          Späť do ponuky
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Technické parametre</h3>
                  {item.specifications && item.specifications.length > 0 ? (
                    <ul className="space-y-3 text-gray-300">
                      {item.specifications.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-3 border-b border-white/5 pb-2">
                          <div className="w-1.5 h-1.5 bg-[#BD20D3] rounded-full mt-2.5 flex-shrink-0"></div>
                          <span className="text-white font-medium">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nie sú zadané žiadne technické parametre.</p>
                  )}
                </Card>
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Kľúčové vlastnosti</h3>
                  {item.features && item.features.length > 0 ? (
                    <ul className="space-y-2 text-gray-300">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">Nie sú zadané žiadne kľúčové vlastnosti.</p>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default EquipmentDetail;