"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { salesService, SalesItem } from '@/lib/salesService';
import { generateSalesSeo, generateSalesAlt } from '@/utils/salesSeo';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<SalesItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(0);

  // SEO metadáta
  const seo = item ? generateSalesSeo(item.name, item.price, item.condition) : null;

  // Use hook for title and meta description
  usePageMeta(
    seo?.title || 'Socializea-audio | Predaj techniky Žilina, Čadca, Kysuce',
    seo?.description
  );

  // Remove old useEffect document.title

  // Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const allItems = await salesService.getAll();
        const found = allItems.find(p => p.id === id);
        if (found) {
          setItem(found);
          setActiveImage(found.images?.[0] || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800');
          setActiveIndex(0);
        } else {
          toast.error('Produkt nebol nájdený.');
          navigate('/predaj');
        }
      } catch (err) {
        toast.error('Chyba pri načítavaní produktu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) {
      toast.error('Prosím vyplňte vaše meno a email!');
      return;
    }

    setSending(true);
    setTimeout(() => {
      toast.success('Dopyt na kúpu bol úspešne odoslaný!', {
        description: `Budeme vás kontaktovať ohľadom produktu ${item?.name} čo najskôr.`
      });
      setInquiryName('');
      setInquiryPhone('');
      setInquiryEmail('');
      setInquiryMessage('');
      setSending(false);
    }, 1000);
  };

  const imagesList = item?.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'];

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? imagesList.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    setActiveImage(imagesList[newIndex]);
  };

  const goToNext = () => {
    const newIndex = activeIndex === imagesList.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    setActiveImage(imagesList[newIndex]);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020721] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow pt-48 pb-24 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD20D3] mx-auto mb-4"></div>
            Načítavam detail produktu...
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#020721]">
      <Navbar />

      <div className="pt-36 pb-24 container mx-auto px-4">
        {/* BACK BUTTON */}
        <div className="max-w-6xl mx-auto mb-8">
          <Link
            to="/predaj"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-semibold"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Späť na ponuku techniky
          </Link>
        </div>

        {/* PRODUCT LAYOUT */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

          {/* LEFT: IMAGE GALLERY & SPECIFICATIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Active Image */}
            <div className="aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 relative bg-black/40 group">
              <img
                src={activeImage}
                alt={generateSalesAlt(item.name)}
                className="w-full h-full object-contain"
              />

              {/* SEO Meta description (skryté) */}
              <div className="sr-only" aria-hidden="true">
                {seo?.description}
              </div>

              {/* Kategória — ľavý dolný roh */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  item.condition === 'new'
                    ? 'bg-cyan-600/90 border border-cyan-400/50 text-white'
                    : 'bg-amber-600/90 border border-amber-400/50 text-white'
                }`}>
                  {item.condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}
                </span>
              </div>

              {/* Šípky */}
              {imagesList.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <ChevronRightIcon size={20} />
                  </button>
                </>
              )}

              {!item.available && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-6 py-3 rounded-2xl text-base font-extrabold uppercase tracking-widest">
                    Vypredané
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImage(imgUrl);
                      setActiveIndex(idx);
                    }}
                    className={`w-20 h-16 rounded-xl overflow-hidden border transition-all ${
                      activeImage === imgUrl
                        ? 'border-[#BD20D3] ring-1 ring-[#BD20D3]'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${generateSalesAlt(item.name)} – náhľad ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product info */}
            <div className="space-y-4 pt-4">
              {/* H1 */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                {seo?.h1 || item.name}
              </h1>
              {/* H2 */}
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {seo?.h2}
              </p>
              <div className="text-3xl font-extrabold text-[#BD20D3] flex items-baseline gap-2">
                {item.price} € <span className="text-xs text-gray-400 font-normal">s DPH</span>
              </div>
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Specs & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              {item.specs && item.specs.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technické parametre:</h2>
                  <ul className="space-y-2">
                    {item.specs.map((spec, i) => (
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
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kľúčové výhody:</h2>
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
            </div>

            {/* Verification card */}
            <div className="p-5 bg-white/3 border border-white/5 rounded-2xl flex items-start gap-4">
              <ShieldCheck size={32} className="text-[#BD20D3] shrink-0" />
              <div className="text-sm text-gray-400">
                <p className="font-bold text-white mb-1">Garancia kvality a pôvodu</p>
                <p className="leading-relaxed">
                  Každé predávané zariadenie je kompletne otestované naším technikom. Všetky kusy doručujeme vrátane riadnej faktúry so zárukou. Možnosť odpočtu DPH pre firmy.
                </p>
              </div>
            </div>

            {/* SEO text block */}
            <div className="p-5 bg-white/3 border border-white/5 rounded-2xl">
              <p className="text-gray-400 text-xs leading-relaxed">
                {seo?.seoText}
              </p>
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Mám záujem o kúpu</h2>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Vyplňte formulár a my vám obratom zašleme faktúru, preveríme dostupnosť alebo dohodneme osobné prevzatie v Čadci či Žiline.
                </p>
              </div>

              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Meno a priezvisko *</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="Napr. Ján Novák"
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-12 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">E-mailová adresa *</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="jan.novak@email.sk"
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-12 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Telefónne číslo</label>
                  <input
                    type="tel"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+421 ..."
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-12 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Poznámka / doplňujúce otázky</label>
                  <textarea
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Mám záujem o zaslanie kuriérom / osobný odber v Žiline..."
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[100px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!item.available || sending}
                  className="w-full btn-cyber h-12 rounded-xl font-bold border-none text-base mt-2"
                >
                  {sending ? 'Odosielam...' : 'Odoslať nezáväzný dopyt'}
                </Button>
              </form>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#BD20D3]" />
                  <span>Rýchla infolinka: <span className="text-white font-semibold">+421 948 070 577</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#1A4BFF]" />
                  <span>E-mail: <span className="text-white font-semibold">socializea@socializea.com</span></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProductDetail;