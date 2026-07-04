"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEquipmentItem } from "@/hooks/useEquipment";
import { EquipmentItem } from "@/lib/supabase";
import { X, ChevronLeft, ChevronRight, ShoppingBag, Check, ShieldCheck, Phone, Mail, HelpCircle, Package, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

interface EquipmentDetailProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const EquipmentDetail = ({ quantities, setQuantities, equipment }: EquipmentDetailProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading } = useEquipmentItem(id || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [questionFirstName, setQuestionFirstName] = useState("");
  const [questionLastName, setQuestionLastName] = useState("");
  const [questionEmail, setQuestionEmail] = useState("");
  const [questionPhone, setQuestionPhone] = useState("");
  const [questionMessage, setQuestionMessage] = useState("");
  const [sendingQuestion, setSendingQuestion] = useState(false);
  const [desiredQuantity, setDesiredQuantity] = useState(1);

  const cartQuantity = id ? (quantities[id] || 0) : 0;

  const images = item?.images && item.images.length > 0
    ? item.images
    : ["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80"];

  useEffect(() => {
    if (item) {
      setActiveImage(images[0]);
      setActiveIndex(0);
      setDesiredQuantity(1);
    }
  }, [item]);

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

  const goToPrevImage = () => {
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    setActiveImage(images[newIndex]);
  };

  const goToNextImage = () => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    setActiveImage(images[newIndex]);
  };

  const handleAddToCart = () => {
    if (!item) return;

    setQuantities((prev) => {
      const currentQty = prev[item.id] || 0;
      const newTotal = currentQty + desiredQuantity;
      if (newTotal > item.available) {
        toast.error(`Nemôžete pridať viac kusov. Maximálne dostupné množstvo je ${item.available}.`);
        return prev;
      }
      
      toast.success("Produkt bol pridaný do košíka!", {
        description: `${desiredQuantity} ks ${item.name} je teraz vo vašom košíku (Spolu: ${newTotal} ks).`,
      });
      return {
        ...prev,
        [item.id]: newTotal
      };
    });
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionFirstName.trim() || !questionLastName.trim() || !questionEmail.trim() || !questionMessage.trim()) {
      toast.error("Prosím vyplňte všetky povinné polia (meno, priezvisko, email a správa)!");
      return;
    }

    setSendingQuestion(true);

    try {
      const { generateEmailHtml } = await import('@/utils/emailTemplates');
      const htmlContent = generateEmailHtml('package-question', {
        name: `${questionFirstName} ${questionLastName}`,
        email: questionEmail,
        phone: questionPhone || 'Neuvedený',
        date: 'Otázka k produktu',
        message: questionMessage,
        packageName: item?.name || 'Neznámy produkt',
      });

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        { message_html: htmlContent },
        'hlWKyd9fiWgqJJT3r'
      );

      toast.success("Vaša otázka bola odoslaná!", {
        description: "Odpovieme vám čo najskôr na uvedený email."
      });

      setQuestionFirstName("");
      setQuestionLastName("");
      setQuestionEmail("");
      setQuestionPhone("");
      setQuestionMessage("");
      setQuestionDialogOpen(false);
    } catch (error) {
      console.error("EmailJS send failed:", error);
      toast.error("Odoslanie zlyhalo. Skúste to prosím neskôr.");
    } finally {
      setSendingQuestion(false);
    }
  };

  const decreaseQuantity = () => {
    setDesiredQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    if (!item) return;
    setDesiredQuantity((prev) => Math.min(item.available - cartQuantity, prev + 1));
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

  const handleBack = () => {
    navigate('/prenajom');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020721] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-48 pb-24 flex items-center justify-center animate-fade-slide-up">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD20D3] mx-auto mb-4"></div>
            Načítavam detail aparatúry...
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] bg-[#020721] animate-fade-slide-up">
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
  const categoryLabel =
    item.category === "sound"
      ? "Zvuková technika"
      : item.category === "lighting"
        ? "Svetelná technika"
        : "Ostatná technika";
  const pageTitle = `${item.name} – Prenájom ${categoryLabel} | Socializea Audio`;

  const isSoldOut = item.available === 0;
  const maxToAdd = item.available - cartQuantity;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Prenájom ${item.name} – ${item.description?.substring(0, 155) || ""}. Cena: ${item.price_per_day} € / deň. Dostupné: ${item.available} ks. Kategória: ${categoryLabel}.`}
        />
        <meta
          name="keywords"
          content={`prenájom ${item.name}, ${item.category === "sound" ? "prenájom reproduktorov, prenájom ozvučenia" : item.category === "lighting" ? "prenájom svetiel, svetelná technika" : "príslušenstvo prenájom"}, Socializea, Čadca, Žilina`}
        />
        <link rel="canonical" href={`https://socializea.sk/prenajom/${item.id}`} />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={`Prenájom ${item.name} – ${item.description?.substring(0, 155) || ""}. Cena: ${item.price_per_day} € / deň.`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://socializea.sk/prenajom/${item.id}`} />
        <meta property="og:image" content={images[0] || "https://socializea.sk/logo.png"} />
        <meta property="og:locale" content="sk_SK" />
        <meta property="product:price:amount" content={String(item.price_per_day)} />
        <meta property="product:price:currency" content="EUR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta
          name="twitter:description"
          content={`Prenájom ${item.name} – ${item.description?.substring(0, 155) || ""}. Cena: ${item.price_per_day} € / deň.`}
        />
        <meta name="twitter:image" content={images[0] || "https://socializea.sk/logo.png"} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: item.name,
            description: item.description,
            image: images[0],
            category: categoryLabel,
            offers: {
              "@type": "Offer",
              price: item.price_per_day,
              priceCurrency: "EUR",
              availability: item.available > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `https://socializea.sk/prenajom/${item.id}`
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />

        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4 animate-fade-slide-up">
          <div className="max-w-6xl mx-auto mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-semibold"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Späť na ponuku prenájmu
            </button>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 md:gap-12">
            {/* Left column – gallery & description */}
            <div className="lg:col-span-7 space-y-8">
              {/* Main image */}
              <div className="aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 relative bg-black/40 group">
                <img
                  src={activeImage}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />

                {/* Availability / condition badge */}
                <div className="absolute bottom-4 left-4">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      !isSoldOut
                        ? "bg-cyan-600/90 border border-cyan-400/50 text-white"
                        : "bg-amber-600/90 border border-amber-400/50 text-white"
                    }`}
                  >
                    {!isSoldOut ? "Dostupné" : "Vypredané"}
                  </span>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={goToNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {isSoldOut && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-6 py-3 rounded-2xl text-base font-extrabold uppercase tracking-widest">
                      Vypredané
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImage(imgUrl);
                        setActiveIndex(idx);
                      }}
                      className={`w-20 h-16 rounded-xl overflow-hidden border transition-all ${
                        activeImage === imgUrl
                          ? "border-[#BD20D3] ring-1 ring-[#BD20D3]"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Name, price, description */}
              <div className="space-y-4 pt-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {item.name}
                </h1>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#BD20D3] flex items-baseline gap-2">
                  {item.price_per_day} €{" "}
                  <span className="text-xs text-gray-400 font-normal">/ deň</span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Specs & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {item.specifications && item.specifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Technické parametre:
                    </h3>
                    <ul className="space-y-2">
                      {item.specifications.map((spec, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                          <span className="text-[#BD20D3] font-bold mt-0.5">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.features && item.features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                      Kľúčové výhody:
                    </h3>
                    <ul className="space-y-2">
                      {item.features.map((f, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                          <Check size={16} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(!item.specifications || item.specifications.length === 0) &&
                  (!item.features || item.features.length === 0) && (
                    <div className="md:col-span-2">
                      <p className="text-gray-500 italic">Nie sú zadané žiadne dodatočné informácie.</p>
                    </div>
                  )}
              </div>
            </div>

            {/* Right column – add to cart */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32 space-y-6" style={{ animationDelay: '0.1s' }}>
                {/* Available quantity */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <Package size={20} className="text-[#BD20D3]" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Dostupnosť:{" "}
                      <span className={`font-bold ${!isSoldOut ? "text-cyan-400" : "text-amber-400"}`}>
                        {isSoldOut ? "0 ks" : `${item.available} ks`}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quantity selector */}
                {!isSoldOut && (
                  <div>
                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-3">
                      Počet kusov
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={decreaseQuantity}
                        disabled={desiredQuantity <= 1}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-xl font-bold text-white w-12 text-center tabular-nums">
                        {desiredQuantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        disabled={desiredQuantity >= maxToAdd}
                        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus size={18} />
                      </button>
                      {maxToAdd > 0 && (
                        <span className="text-xs text-gray-500 ml-1">
                          max {maxToAdd}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Add to cart button */}
                {isSoldOut ? (
                  <Button
                    disabled
                    size="sm"
                    className="w-full bg-white/10 text-gray-500 border-white/10 cursor-not-allowed font-bold rounded-lg h-10"
                  >
                    Vypredané
                  </Button>
                ) : isInCart ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={maxToAdd <= 0}
                    size="sm"
                    className="w-full bg-[#BD20D3] hover:bg-[#BD20D3]/85 text-white font-bold rounded-lg h-10 border-none"
                  >
                    <Check size={14} className="mr-2 animate-pulse" />
                    V košíku ({cartQuantity})
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="w-full bg-[#BD20D3] hover:bg-[#BD20D3]/85 text-white font-bold rounded-lg h-10 border-none"
                  >
                    <ShoppingBag size={14} className="mr-2" />
                    Pridať do košíka
                  </Button>
                )}

                {/* Question button – bez orámovania */}
                <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-4">
                      <HelpCircle size={16} />
                      Je vám niečo nejasné? Spýtajte sa nás
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-white">Máte otázku k tomuto produktu?</DialogTitle>
                      <DialogDescription className="text-gray-400 text-sm">
                        Napíšte nám, čo vás zaujíma a my sa vám ozveme čo najskôr.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSendQuestion} className="space-y-4 mt-4">
                      <input type="hidden" name="package_name" value={item?.name || ''} />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">Meno *</label>
                          <input
                            type="text"
                            required
                            value={questionFirstName}
                            onChange={(e) => setQuestionFirstName(e.target.value)}
                            placeholder="Napr. Ján"
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">Priezvisko *</label>
                          <input
                            type="text"
                            required
                            value={questionLastName}
                            onChange={(e) => setQuestionLastName(e.target.value)}
                            placeholder="Napr. Novák"
                            className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">E-mail *</label>
                        <input
                          type="email"
                          required
                          value={questionEmail}
                          onChange={(e) => setQuestionEmail(e.target.value)}
                          placeholder="jan.novak@email.sk"
                          className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">Telefón (voliteľný)</label>
                        <input
                          type="tel"
                          value={questionPhone}
                          onChange={(e) => setQuestionPhone(e.target.value)}
                          placeholder="+421 901 234 567"
                          className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold uppercase">Vaša otázka *</label>
                        {item && (
                          <div className="flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full px-3 py-1.5 mb-2">
                            <Package size={14} className="text-[#BD20D3] shrink-0" />
                            <span className="text-xs text-white font-medium truncate">{item.name}</span>
                          </div>
                        )}
                        <textarea
                          required
                          value={questionMessage}
                          onChange={(e) => setQuestionMessage(e.target.value)}
                          placeholder="Napíšte, čo vás zaujíma..."
                          className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[100px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={sendingQuestion}
                        className="w-full btn-cyber h-11 rounded-xl font-bold border-none text-sm mt-2"
                      >
                        {sendingQuestion ? (
                          <><Loader2 size={16} className="mr-2 animate-spin" />Odosiela sa...</>
                        ) : "Odoslať otázku"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Contact info */}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#BD20D3]" />
                    <span>
                      Rýchla infolinka:{" "}
                      <span className="text-white font-semibold">+421 948 070 577</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#1A4BFF]" />
                    <span>
                      E-mail:{" "}
                      <span className="text-white font-semibold">socializea@socializea.com</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        {/* Lightbox overlay */}
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
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80";
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
    </>
  );
};

export default EquipmentDetail;