import React, { useState } from "react";
import ImageManager from "@/components/ImageManager";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400&auto=format&fit=crop"
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white">AudioRent Admin</h1>
          <p className="text-gray-400">Správa techniky a fotografií</p>
        </header>

        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <ImageManager images={images} onChange={setImages} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-[#BD20D3]">Aktuálne poradie</h3>
            <ul className="space-y-2">
              {images.map((img, idx) => (
                <li key={idx} className="text-sm text-gray-400 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="truncate">{img.substring(0, 50)}...</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#BD20D3]/10 flex items-center justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-[#BD20D3] shadow-[0_0_20px_rgba(189,32,211,0.5)]"></div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pripravené na uloženie</h3>
            <p className="text-sm text-gray-400">Zmeny v poradí sa prejavia okamžite v katalógu produktov.</p>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
