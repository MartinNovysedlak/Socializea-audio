"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEquipmentItem } from "@/hooks/useEquipment";
import { EquipmentItem } from "@/lib/supabase";
import { X, ChevronLeft, ChevronRight, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

interface EquipmentDetailProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const EquipmentDetail = ({ quantities, setQuantities, equipment }: EquipmentDetailProps) => {
  const { id } = useParams();
  const { item, loading } = useEquipmentItem(id || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cartQuantity = id ? (quantities[id] || 0) : 0;

  const images = item?.images && item.images.length > 0
    ? item.images
    : ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleAddToCart = () => {
    if (!item) return;

    setQuantities((prev) => {
      const currentQty = prev[item.id] || 0;
      if (currentQty >= item.available) {
        toast.error(`Nemôžete pridať viac kusov. Maximálne dostupné množstvo je ${item.available}.`);
        return prev;
      }
      
      const newQty = currentQty + 1;
      toast.success("Produkt bol pridaný do košíka!", {
        description: `${item.name} je teraz vo vašom košíku (Spolu: ${newQty} ks).`,
      });
      return {
        ...prev,
        [item.id]: newQty
      };
    });
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, goNext, goPrev]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-[#020721]">
          <div className="text-white text-center">Načítavam...</div>
        </div>
        <Footer />
      </main>
    );
  }

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

  const isInCart = cartQuantity > 0;

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

                    {/* Hlavný obrázok — celý produkt viditeľný */}
                    <div
                      className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 cursor-pointer group relative bg-black/30"
                      onClick={() => openLightbox(0)}
                    >
                      <img
                        src={images[0]}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-full text-sm font-medium">
                          Zväčšiť
                        </span>
                      </div>
                    </div>

                    {/* Náhľady — tiež object-contain */}
                    {images.length > 1 && (
                      <div className="grid grid-cols-3 gap-3">
                        {images.slice(1).map((img, idx) => (
                          <div
                            key={idx + 1}
                            className="aspect-[4/3] rounded-lg overflow-hidden border border-white/10 cursor-pointer group relative bg-black/30"
                            onClick={() => openLightbox(idx + 1)}
                          >
                            <img
                              src={img}
                              alt={`${item.name} - fotka ${idx + 2}`}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-6 border-t border-white/5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                      <div>
                        <span className="text-3xl font-bold text-[#BD20D3]">{item.price_per_day} €</span>
                        <span className="text-gray-500 ml-2">/ deň</span>
                        <p className="text-gray-400 mt-1">
                          Dostupné: {item.available} {item.available === 1 ? "kus" : "kusy"}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link to="/prenajom">
                          <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 h-12 px-6">
                            Späť do ponuky
                          </Button>
                        </Link>
                        {isInCart ? (
                          <Button 
                            onClick={handleAddToCart}
                            disabled={cartQuantity >= item.available}
                            size="sm"
                            className="h-12 px-6 font-bold transition-all btn-cyber hover:opacity-95 text-white rounded-lg border-none"
                          >
                            <Check size={18} className="mr-2 animate-pulse" />
                            V košíku ({cartQuantity})
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleAddToCart}
                            disabled={item.available === 0}
                            size="sm"
                            className="h-12 px-6 font-bold transition-all bg-[#BD20D3] hover:bg-[#BD20D3]/85 text-white rounded-lg"
                          >
                            <ShoppingBag size={18} className="mr-2" />
                            Pridať do košíka
                          </Button>
                        )}
                      </div>
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

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-8"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-10"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <div className="absolute top-4 left-4 md:top-6 md:left-6 text-white/60 text-sm font-medium bg-black/40 px-3 py-1.5 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          <img
            src={images[currentImageIndex]}
            alt={`${item.name} - fotka ${currentImageIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80";
            }}
          />

          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-[#BD20D3] scale-125"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default EquipmentDetail;