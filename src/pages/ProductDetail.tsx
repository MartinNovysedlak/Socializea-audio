"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight, ShoppingBag, Loader2, CheckCircle2, Phone, Mail } from 'lucide-react';
import { salesService, SalesItem } from '@/lib/salesService';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<SalesItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false);
  const [inquiryFirstName, setInquiryFirstName] = useState('');
  const [inquiryLastName, setInquiryLastName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [showInquirySuccess, setShowInquirySuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await salesService.getById(id);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const images = product?.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'];

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryFirstName.trim() || !inquiryLastName.trim() || !inquiryEmail.trim() || !inquiryMessage.trim()) {
      toast.error("Prosím vyplňte všetky povinné polia!");
      return;
    }
    setSendingInquiry(true);
    try {
      const htmlContent = generateEmailHtml('product-inquiry', {
        name: `${inquiryFirstName} ${inquiryLastName}`,
        email: inquiryEmail,
        phone: inquiryPhone || 'Neuvedený',
        date: 'Dopyt na produkt',
        message: inquiryMessage,
        packageName: product?.name || 'Neznámy produkt',
      });

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        { message_html: htmlContent, title: 'Dopyt na produkt' },
        'hlWKyd9fiWgqJJT3r'
      );

      setInquiryDialogOpen(false);
      setShowInquirySuccess(true);
      setInquiryFirstName('');
      setInquiryLastName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMessage('');
    } catch (error) {
      console.error('EmailJS error:', error);
      toast.error('Odoslanie zlyhalo. Skúste to prosím neskôr.');
    } finally {
      setSendingInquiry(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] text-gray-400">
          Načítavam produkt...
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-white space-y-4">
          <h2 className="text-2xl font-bold">Produkt nebol nájdený</h2>
          <p className="text-gray-400">Hľadaný produkt neexistuje alebo bol odstránený.</p>
          <Link to="/predaj">
            <Button className="btn-cyber rounded-xl border-none">Späť na zoznam produktov</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Socializea Audio – Predaj</title>
        <meta name="description" content={product.description?.substring(0, 160) || ''} />
        <link rel="canonical" href={`https://socializea.sk/predaj/${product.id}`} />
        <meta property="og:title" content={`${product.name} | Socializea Audio – Predaj`} />
        <meta property="og:description" content={product.description?.substring(0, 160) || ''} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://socializea.sk/predaj/${product.id}`} />
        <meta property="og:image" content={images[0] || 'https://socializea.sk/logo.png'} />
        <meta property="og:locale" content="sk_SK" />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="EUR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Socializea Audio – Predaj`} />
        <meta name="twitter:description" content={product.description?.substring(0, 160) || ''} />
        <meta name="twitter:image" content={images[0] || 'https://socializea.sk/logo.png'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: images[0],
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'EUR',
              availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `https://socializea.sk/predaj/${product.id}`,
            },
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />

        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4 animate-fade-slide-up">
          <div className="max-w-6xl mx-auto mb-8">
            <button onClick={() => navigate('/predaj')} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-sm font-semibold">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Späť na ponuku predaja
            </button>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 relative bg-black/40 group">
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-contain" />
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${product.condition === 'new' ? 'bg-cyan-600/90 border border-cyan-400/50 text-white' : 'bg-amber-600/90 border border-amber-400/50 text-white'}`}>
                    {product.condition === 'new' ? 'Nový kus' : 'B-Stock'}
                  </span>
                </div>
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((prev) => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => setActiveImage((prev) => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                {!product.available && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-red-500 border border-red-500/30 bg-red-500/10 px-6 py-3 rounded-2xl text-base font-extrabold uppercase tracking-widest">Vypredané</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`w-20 h-16 rounded-xl overflow-hidden border transition-all ${activeImage === idx ? 'border-[#BD20D3] ring-1 ring-[#BD20D3]' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-4 pt-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">{product.name}</h1>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#BD20D3]">{product.price} €</div>
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {product.specs && product.specs.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Technické parametre:</h3>
                    <ul className="space-y-2">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                          <span className="text-[#BD20D3] font-bold mt-0.5">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Kľúčové výhody:</h3>
                    <ul className="space-y-2">
                      {product.features.map((f, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2.5">
                          <Check size={16} className="text-[#1A4BFF] shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#0a0d1f] to-[#020721] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-32 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                  <ShoppingBag size={20} className="text-[#BD20D3]" />
                  <div>
                    <p className="text-sm text-gray-400">
                      Dostupnosť:{' '}
                      <span className={`font-bold ${product.available_count > 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                        {product.available_count > 0 ? `${product.available_count} ks na sklade` : 'Vypredané'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Dialog open={inquiryDialogOpen} onOpenChange={setInquiryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={!product.available} className="w-full btn-cyber h-12 rounded-xl font-bold border-none">
                        <ShoppingBag size={18} className="mr-2" /> Mám záujem
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Máte záujem o tento produkt?</DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">Napíšte nám a my sa vám ozveme.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSendInquiry} className="space-y-4 mt-4">
                        <div className="flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full px-3 py-1.5">
                          <ShoppingBag size={14} className="text-[#BD20D3] shrink-0" />
                          <span className="text-xs text-white font-medium truncate">{product.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-bold uppercase">Meno *</label>
                            <input type="text" required value={inquiryFirstName} onChange={(e) => setInquiryFirstName(e.target.value)} placeholder="Napr. Ján" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs text-gray-400 font-bold uppercase">Priezvisko *</label>
                            <input type="text" required value={inquiryLastName} onChange={(e) => setInquiryLastName(e.target.value)} placeholder="Napr. Novák" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">E-mail *</label>
                          <input type="email" required value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} placeholder="jan.novak@email.sk" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">Telefón (voliteľný)</label>
                          <input type="tel" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} placeholder="+421 901 234 567" className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-400 font-bold uppercase">Vaša správa *</label>
                          <textarea required value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} placeholder="Čo by ste chceli vedieť?" className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[100px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed" />
                        </div>
                        <Button type="submit" disabled={sendingInquiry} className="w-full btn-cyber h-11 rounded-xl font-bold border-none text-sm mt-2">
                          {sendingInquiry ? <><Loader2 size={16} className="mr-2 animate-spin" />Odosiela sa...</> : 'Odoslať dopyt'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

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

        <Dialog open={showInquirySuccess} onOpenChange={setShowInquirySuccess}>
          <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="text-[#BD20D3]" size={32} />
            </div>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold text-white">Ďakujeme!</DialogTitle>
              <DialogDescription className="text-gray-300 text-base leading-relaxed">Váš dopyt bol odoslaný. Čoskoro sa vám ozveme.</DialogDescription>
            </DialogHeader>
            <Button onClick={() => setShowInquirySuccess(false)} className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full">Zavrieť</Button>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default ProductDetail;