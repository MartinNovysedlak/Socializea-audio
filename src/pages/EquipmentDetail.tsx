"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { LucideIcon } from "lucide-react";

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
      "https://example.com/mixer1.jpg",
      "https://example.com/mixer2.jpg",
      "https://example.com/mixer3.jpg"
    ]
  },
  {
    id: "mixer-802",
    name: "Mixážny pult Behringer Xenyx 802",
    category: "sound",
    pricePerDay: 15,
    available: 1,
    description: "Kompaktný mixážný pult s 8 kanálmi, USB interfészom a jednoduchým ovládaním.",
    images: [
      "https://example.com/mixer802-1.jpg",
      "https://example.com/mixer802-2.jpg"
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
      "https://example.com/mic-set-1.jpg",
      "https://example.com/mic-set-2.jpg"
    ]
  },
  // Add more items as needed...
];

const EquipmentDetail = () => {
  const { id } = useParams();
  const item = equipmentData.find(i => i.id === id);

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020721]">
        <div className="text-white">Aparatura nie je nájdená</div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-[#020721]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card className="bg-white/5 border-white/10 rounded-xl p-6">
                <CardHeader className="pb-4">
                  <h2 className="text-3xl font-bold text-white">{item.name}</h2>
                  <span className="text-xl text-[#BD20D3]">Category: {item.category}</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.images.map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#BD20D3]">{item.pricePerDay} € / deň</span>
                    <span className="text-gray-500">
                      Dostupné: {item.available} {item.available === 1 ? "kus" : "kusy"}
                    </span>
                  </div>
                  <Button className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/30 text-[#BD20D3] border border-[#BD20D3]/40">
                    Add to calculation
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Technical Specifications</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Power: 100W RMS</li>
                <li>Frequency Response: 20Hz - 20kHz</li>
                <li>Connectivity: XLR, 1/4"</li>
                <li>Portable: Yes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentDetail;