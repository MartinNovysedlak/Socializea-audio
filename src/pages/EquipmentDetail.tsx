"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface EquipmentItem {
  id: string;
  name: string;
  category: "sound" | "lighting" | "other";
  pricePerDay: number;
  available: number;
  description: string;
  images: string[];
  specifications?: string[];
  features?: string[];
}

const equipmentData: EquipmentItem[] = [
  {
    id: "mixer-x1222",
    name: "Mixážny pult Behringer Xenyx X1222 USB",
    category: "sound",
    pricePerDay: 25,
    available: 1,
    description: "Profesionálny mixážny pult s USB nahrávacím modulom, 16 kanálov a many vstupov/výstupov. Ideálny pre live vystúpenia a nahrávanie.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "16 kanálov",
      "USB nahrávanie",
      "4-band EQ",
      "2 AUX výstupy",
      "2 preampy"
    ],
    features: [
      "Profesionálne kvality",
      "Kompaktný dizajn",
      "Ľahké ovládanie",
      "Vysoký výkon"
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
    ],
    specifications: [
      "8 kanálov",
      "USB interfész",
      "2-band EQ",
      "2 AUX výstupy",
      "Phantom napájanie"
    ],
    features: [
      "Prehľadné ovládanie",
      "Kompaktné rozmery",
      "Vysoká kvalita zvuku",
      "Economicke riešenie"
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
    ],
    specifications: [
      "2x drátový mikrofón",
      "1x headset",
      "Frekvenčný rozsah 20Hz-20kHz",
      "Citlivosť -54dB",
      "3.5mm jack výstup"
    ],
    features: [
      "Vysoká kvalita zvuku",
      "Odolná konštrukcia",
      "Komfortné použitie",
      "Profesionálny výkon"
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
    ],
    specifications: [
      "12\" woofer",
      "1.35\" tweeter",
      "400W výkon",
      "XLR/TRS vstupy",
      "Link výstup"
    ],
    features: [
      "Vysoký výkon",
      "Kompaktný dizajn",
      "Vynikajúca kvalita zvuku",
      "Ľahká manipulácia"
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
    ],
    specifications: [
      "18\" woofer",
      "1000W výkon",
      "DSP procesor",
      "XLR vstupy/výstupy",
      "Limitér"
    ],
    features: [
      "Vysoký výkon",
      "Digitálne spracovanie",
      "Profesionálna kvalita",
      "Výborné basy"
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
    ],
    specifications: [
      "RGBWA UV farby",
      "9x 3W LED diódy",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Viacfarebné osvetlenie",
      "UV efekt",
      "DMX ovládanie",
      "Vysoká svietivosť"
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
    ],
    specifications: [
      "90W výkon",
      "Rotujúca hlava",
      "DMX512 ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Rotujúce efekty",
      "Profesionálna kvalita",
      "DMX ovládanie"
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
    ],
    specifications: [
      "1300W výkon",
      "2.5L nádrž",
      "DMX ovládanie",
      "12/24V DC",
      "IP20 ochrana"
    ],
    features: [
      "Vysoký výkon",
      "Veľká nádrž",
      "Atmosférické efekty",
      "DMX ovládanie"
    ]
  },
  {
    id: "projector",
    name: "Premietačka Wanbo T6 MAX",
    category: "other",
    pricePerDay: 20,
    available: 1,
    description: "Vysokokvalitná premietačka Wanbo T6 MAX s vysokým rozlíšením a jasom.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "4K rozlíšenie",
      "5500 ANSI lúmenov",
      "HDR10 podpora",
      "WiFi pripojenie",
      "HDMI vstup"
    ],
    features: [
      "Vysoké rozlíšenie",
      "Vysoký jas",
      "HDR podpora",
      "WiFi pripojenie"
    ]
  },
  {
    id: "screen",
    name: "Premietacie plátno 110\"",
    category: "other",
    pricePerDay: 15,
    available: 1,
    description: "Premietacie plátno 110\" s vysokou kvalitou obrazu a jednoduchým nastavením.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "110\" rozmer",
      "16:9 pomer",
      "1.1 gain",
      "White surface",
      "Easy setup"
    ],
    features: [
      "Vysoká kvalita obrazu",
      "Veľké rozmer",
      "Jednoduché nastavenie",
      "Vynikajúca farba"
    ]
  },
  {
    id: "mic-stand",
    name: "Stojan na mikrofón",
    category: "other",
    pricePerDay: 5,
    available: 2,
    description: "Stojan na mikrofón s vysokou stabilitou a jednoduchým nastavením.",
    images: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800"
    ],
    specifications: [
      "Stojan",
      "Max 2m",
      "Easy assembly",
      "Stable base",
      "Adjustable height"
    ],
    features: [
      "Vysoká stabilita",
      "Jednoduché nastavenie",
      "Univerzálny dizajn",
      "Odolná konštrukcia"
    ]
  }
];

const EquipmentDetail = () => {
  const { id } = useParams();
  const item = equipmentData.find(i => i.id === id);

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

                {item.specifications && (
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
                )}

                {item.features && (
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
                )}
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