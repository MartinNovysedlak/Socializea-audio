"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { equipmentDatabase, EquipmentItem } from "@/data/equipmentDatabase";

const EquipmentDetail = () => {
  const { id } = useParams();
  const item = equipmentDatabase.find((i) => i.id === id);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-[#020721]">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Aparatura nie je nájdená</h1>
            <p className="text-gray-400">Požadovaná položka nebola nájdená v našom katalógu.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <CardHeader className="pb-4">
                    <h2 className="text-3xl font-bold text-white">{item.name}</h2>
                    <span className="text-xl text-[#BD20D3] uppercase">
                      {item.category === "sound" ? "Zvuk" : 
                       item.category === "lighting" ? "Svetlá a efekty" : "Ostatné"}
                    </span>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {item.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.images.map((img, idx) => (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-white/10">
                          <img 
                            src={img} 
                            alt={`${item.name} - fotka ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://via.placeholder.com/128?text=No+Image";
                            }}
                          />
                        </div>
                      ))}
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
                      <Button className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40 h-12 px-6">
                        Pridať do kalkulácie
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-6">Technické špecifikácie</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex justify-between">
                      <span>Kategória:</span>
                      <span className="text-white font-medium">
                        {item.category === "sound" ? "Zvukové zariadenie" : 
                         item.category === "lighting" ? "Svetelné zariadenie" : "Ostatné"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cena za deň:</span>
                      <span className="text-[#BD20D3] font-bold">{item.pricePerDay} €</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dostupnosť:</span>
                      <span className="text-white font-medium">{item.available} {item.available === 1 ? "kus" : "kusy"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Stav:</span>
                      <span className="text-emerald-400 font-medium">Dostupné</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Výhody prenájmu</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Profesionálna technika od známych výrobcov</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Technická podpora počas prenájmu</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Možnosť kombinácie s inými zariadeniami</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                      <span>Vratná záloha pri prevzatí techniky</span>
                    </li>
                  </ul>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Technické parametre</h3>
                  <ul className="space-y-2 text-gray-300">
                    {item.specifications.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#1A4BFF] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Kľúčové vlastnosti</h3>
                  <ul className="space-y-2 text-gray-300">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#BD20D3] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
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