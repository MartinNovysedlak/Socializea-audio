"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  description: string;
  images: string[];
}

const equipmentData: EquipmentItem[] = [
  {
    id: "mixer-x1222",
    name: "Mixážny pult Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 1,
    description: "Profesionálny mixážny pult s USB nahrávacím modulom, 16 kanálov a many vstupov/výstupov.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    description: "Kompaktný mixážny pult s 8 kanálmi, USB interfészom a jednoduchým ovládaním.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "mic-set",
    name: "Sada 2 mikrofónov the t.bone free solo Twin HT",
    category: "sound",
    pricePerDay: 20,
    available: 1,
    description: "Drátové mikrofóny s headsetom, vhodné na prednášky a koncerty.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "speakers-b112d",
    name: "Reproduktory Behringer b112d",
    category: "sound",
    pricePerDay: 15,
    available: 4,
    description: "Kvalitné aktívne reproduktory s vynikajúcim zvukom a kompaktným dizajnom.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "sub-dsp18",
    name: "Subwoofer The Box Pro DSP 18 Sub",
    category: "sound",
    pricePerDay: 35,
    available: 5,
    description: "Vysokovýkonný subwoofer s digitálnym procesorom pre dokonalé basy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "led-par",
    name: "RGBWA UV Led Par svetlá",
    category: "lighting",
    pricePerDay: 8,
    available: 8,
    description: "Viacfarebné LED svetlá s UV efektom, ideálne pre párty a eventy.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "beam-head",
    name: "Rotujúca 90w Beam hlava",
    category: "lighting",
    pricePerDay: 25,
    available: 4,
    description: "Profesionálne rotujúce svetelné hlavy s vysokým výkonom.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: "fog-dj",
    name: "Dymostroj ADJ VF 1300",
    category: "lighting",
    pricePerDay: 25,
    available: 2,
    description: "Výkonný dymostroj pre vytvorenie atmosférických efektov.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ]
  }
];

const EquipmentDetail = () => {
  const { id } = useParams();
  const item = equipmentData.find(i => i.id === id);

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020721]">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Aparatura nie je nájdená</h1>
          <p className="text-gray-400">Požadovaná položka nebola nájdená v našom katalógu.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-[#020721]">
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
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-white/10">
                        <img 
                          src={img} 
                          alt={`${item.name} - fotka ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentDetail;