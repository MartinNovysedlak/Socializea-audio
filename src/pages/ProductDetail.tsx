"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { salesService, SalesItem } from '@/lib/salesService';
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  User,
  Send,
  Loader2,
  CheckCircle2,
  ShoppingBag,
  Package,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<SalesItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState(0);

  // Inquiry form states
  const [inquiryFirstName, setInquiryFirstName] = useState('');
  const [inquiryLastName, setInquiryLastName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryQuantity, setInquiryQuantity] = useState(1);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInquiryDialog, setShowInquiryDialog] = useState(false);

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
      } catch {
        toast.error('Chyba pri načítavaní produktu.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryFirstName.trim() || !inquiryLastName.trim() || !inquiryEmail.trim()) {
      toast.error('Prosím vyplňte vaše meno, priezvisko a email!');
      return;
    }

    setSending(true);
    const toastId = toast.loading('Odosielam dopyt...');

    try {
      const productName = item?.name || 'Neznámy produkt';
      const productPrice = item?.price ? `${item.price} € / ks` : 'Neuvedená';
      const productCondition = item?.condition === 'new' ? 'Nový kus' : 'B-Stock / Bazár';
      const quantity = inquiryQuantity > 0 ? inquiryQuantity : 1;
      const totalPrice = item?.price ? `${(item.price * quantity).toFixed(2)} €` : '—';

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        {
          name: `${inquiryFirstName} ${inquiryLastName}`,
          email: inquiryEmail,
          phone: inquiryPhone || 'Neuvedený',
          date: 'Kúpa produktu',
          message: `${inquiryMessage || '—'}\n\nProdukt: ${productName}\nCena za kus: ${productPrice}\nPočet kusov: ${quantity}\nCelková cena: ${totalPrice}\nStav: ${productCondition}`,
        },
        'hlWKyd9fiWgqJJT3r'
      );

      toast.dismiss(toastId);
      setShowInquiryDialog(false);
      setShowSuccess(true);
      setInquiryFirstName('');
      setInquiryLastName('');
      setInquiryPhone('');
      setInquiryEmail('');
      setInquiryQuantity(1);
      setInquiryMessage('');
    } catch {
      toast.dismiss(toastId);
      toast.error('Nepodarilo sa odoslať dopyt.', {
        description: 'Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
      });
    } finally {
      setSending(false);
    }
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

  const conditionLabel = item.condition === 'new' ? 'Nový kus' : 'B-Stock / Bazár';
  const pageTitle = `${item.name} – Predaj | Socializea Audio`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={`Kúpte si ${item.name} – ${item.description?.substring(0, 155) || ''}. Cena: ${item.price} € / ks s DPH. Stav: ${conditionLabel}.`} />
        <meta name="keywords" content={`predaj ${item.name}, kúpa audio techniky, ${item.condition === 'new' ? 'nová technika' : 'bazár technika'}, Socializea, Čadca, Žilina`} />
        <link rel="canonical" href={`https://socializea.sk/predaj/${item.id}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={`Kúpte si ${item.name} – ${item.description?.substring(0, 155) || ''}. Cena: ${item.price} € / ks s DPH.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://socializea.sk/predaj/${item.id}`} />
        <meta property="og:image" content={imagesList[0] || 'https://socializea.sk/logo.png'} />
        <meta property="og:locale" content="sk_SK" />
        <meta property="product:price:amount" content={String(item.price)} />
        <meta property="product:price:currency" content="EUR" />
        <meta property="product:condition" content={item.condition === 'new' ? 'new' : 'used'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={`Kúpte si ${item.name} – ${item.description?.substring(0, 155) || ''}. Cena: ${item.price} € / ks s DPH.`} />
        <meta name="twitter:image" content={imagesList[0] || 'https://socializea.sk/logo.png'} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": item.name,
            "description": item.description,
            "image": imagesList[0],
            "offers": {
              "@type": "Offer",
              "price": item.price,
              "priceCurrency": "EUR",
              "availability": item.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "url": `https://socializea.sk/predaj/${item.id}`,
              "itemCondition": item.condition === 'new' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
            }
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />

        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-8">
            <Link
              to="/predaj"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-semibold"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Späť na ponuku techniky
            </Link>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 md:gap-12">

            <div className="lg:col-span-7 space-y-8">
              <div className="aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 relative bg-black/40 group">
                <img
                  src={activeImage}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />

                <div className="absolute bottom-4 left-4">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    item.condition === 'new'
                      ? 'bg-cyan-600/90 border border-cyan-400/50 text-white'
                      : 'bg-amber-600/90 border border-amber-400/50 text-white'
                  }`}>
                    {item.condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}
                  </span>
                </div>

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
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {item.name}
                </h1>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#BD20D3] flex items-baseline gap-2">
                  {item.price} € <span className="text-xs text-gray-400 font-normal">/ ks s DPH</span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {item.specs && item.specs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technické parametre:</h3>
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
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kľúčové výhody:</h3>
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

              <div className="p-5 bg-white/3 border border-white/5 rounded-2xl flex items-start gap-4">
                <ShieldCheck size={32} className="text-[#BD20D3] shrink-0" />
                <div className="text-sm text-gray-400">
                  <p className="font-bold text-white mb-1">Garancia kvality a pôvodu</p>
                  <p className="leading-relaxed">
                    Každé predávané zariadenie je kompletne otestované naším technikom. Všetky kusy doručujeme vrátane riadnej faktúry so zárukou. Možnosť odpočtu DPH pre firmy.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column – compact info card + CTA button */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    <span className="text-[#BD20D3]">💳</span> {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2 mb-4">
                    <span className="text-3xl font-extrabold text-[#BD20D3]">{item.price} €</span>
                    <span className="text-xs text-gray-400">/ ks s DPH</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      item.condition === 'new'
                        ? 'bg-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                        : 'bg-amber-600/20 border border-amber-400/30 text-amber-300'
                    }`}>
                      <Sparkles size={12} />
                      {item.condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      item.available
                        ? 'bg-emerald-600/20 border border-emerald-400/30 text-emerald-300'
                        : 'bg-red-600/20 border border-red-400/30 text-red-300'
                    }`}>
                      {item.available ? 'Skladom' : 'Vypredané'}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowInquiryDialog(true)}
                  disabled={!item.available}
                  className="w-full btn-cyber h-14 rounded-xl font-bold border-none text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(189,32,211,0.3)]"
                >
                  <ShoppingBag size={18} />
                  Mám záujem o produkt
                </Button>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-[#BD20D3]" />
                    <span>Dodanie: <span className="text-white font-semibold">1–3 pracovné dni</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#BD20D3]" />
                    <span>Infolinka: <span className="text-white font-semibold">+421 948 070 577</span></span>
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

      {/* Inquiry Dialog – pop-up with order form */}
      <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
        <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <DialogHeader className="space-y-3 mb-2">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#BD20D3]" />
              Mám záujem o produkt
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm leading-relaxed">
              Vyplňte formulár a my vám obratom zašleme faktúru, prípadne dohodneme osobné prevzatie.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendInquiry} className="space-y-4">
            <div className="flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full px-3 py-1.5">
              <ShoppingBag size={14} className="text-[#BD20D3] shrink-0" />
              <span className="text-xs text-white font-medium truncate">{item?.name || 'Produkt'}</span>
              <span className="text-xs text-[#BD20D3] font-bold ml-auto">{item?.price} € / ks</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                  <User size={12} className="text-[#BD20D3]" /> Meno *
                </Label>
                <Input
                  type="text"
                  autoComplete="given-name"
                  required
                  value={inquiryFirstName}
                  onChange={(e) => setInquiryFirstName(e.target.value)}
                  placeholder="Napr. Ján"
                  className="bg-black/40 border-white/10 text-white rounded-xl h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                  <User size={12} className="text-[#1A4BFF]" /> Priezvisko *
                </Label>
                <Input
                  type="text"
                  autoComplete="family-name"
                  required
                  value={inquiryLastName}
                  onChange={(e) => setInquiryLastName(e.target.value)}
                  placeholder="Napr. Novák"
                  className="bg-black/40 border-white/10 text-white rounded-xl h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Mail size={12} className="text-[#BD20D3]" /> E-mail *
              </Label>
              <Input
                type="email"
                autoComplete="email"
                required
                value={inquiryEmail}
                onChange={(e) => setInquiryEmail(e.target.value)}
                placeholder="jan.novak@email.sk"
                className="bg-black/40 border-white/10 text-white rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Phone size={12} className="text-[#1A4BFF]" /> Telefón (voliteľný)
              </Label>
              <Input
                type="tel"
                autoComplete="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+421 901 234 567"
                className="bg-black/40 border-white/10 text-white rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <ShoppingBag size={12} className="text-[#BD20D3]" /> Počet kusov *
              </Label>
              <Input
                type="number"
                min={1}
                max={99}
                required
                value={inquiryQuantity}
                onChange={(e) => setInquiryQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-black/40 border-white/10 text-white rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-400 font-bold uppercase">
                Poznámka / doplňujúce otázky
              </Label>
              <Textarea
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Mám záujem o zaslanie kuriérom / osobný odber..."
                className="bg-black/40 border-white/10 text-white rounded-xl min-h-[90px]"
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full btn-cyber h-12 rounded-xl font-bold border-none text-base mt-2 flex items-center justify-center gap-2"
            >
              {sending ? (
                <><Loader2 size={16} className="animate-spin" /> Odosielam...</>
              ) : (
                <><Send size={16} /> Odoslať nezáväzný dopyt</>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success dialog after sending inquiry */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-[#BD20D3]" size={32} />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              Ďakujeme za dopyt!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              Váš dopyt na kúpu produktu <strong className="text-white">{item?.name}</strong> bol úspešne odoslaný. Budeme vás kontaktovať čo najskôr.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowSuccess(false)}
            className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full"
          >
            Zavrieť
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductDetail;