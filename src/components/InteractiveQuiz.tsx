"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Users, 
  MapPin, 
  Music, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  PartyPopper,
  Tv,
  Phone,
  Mail,
  User,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface QuizAnswers {
  people: string;
  location: string;
  eventType: string;
}

const InteractiveQuiz = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    people: '',
    location: '',
    eventType: ''
  });

  // Booking states inside recommendation
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    message: ''
  });

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ people: '', location: '', eventType: '' });
    setShowBookingForm(false);
    setBookingData({ name: '', phone: '', email: '', date: '', message: '' });
  };

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  // Simple recommendation engine logic
  const getRecommendation = () => {
    const { people, location, eventType } = answers;

    if (eventType === 'presentation') {
      return {
        id: 'konferencia-s',
        name: 'Konferenčný Set S',
        price: 60,
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd8a?w=800',
        components: [
          '2x Aktívny reproduktor 8"',
          '2x Profesionálny bezdrôtový mikrofón',
          'Bluetooth mixpult',
          'Kompletná kabeláž a stojany'
        ],
        desc: 'Ideálne riešenie pre prezentácie, firemné mítingy, prednášky a hovorené slovo.'
      };
    }

    if (people === 'over-100' || (people === 'up-to-100' && location === 'outdoor' && eventType === 'dj')) {
      return {
        id: 'club-xl',
        name: 'Set Párty/DJ (Club Set XL)',
        price: 240,
        image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800',
        components: [
          '4x Výkonný aktívny reproduktor 15"',
          '2x Aktívny subwoofer 18"',
          'Profesionálna DJ konzola Pioneer',
          'Svetelná show s DMX ovládaním',
          'Výkonný dymostroj ADJ'
        ],
        desc: 'Kompletná nekompromisná klubová aparatúra pre veľké tanečné akcie, festivaly a open-air párty.'
      };
    }

    if (people === 'up-to-100' || location === 'outdoor') {
      return {
        id: 'wedding-l',
        name: 'Svadobný Set L (Premium)',
        price: 150,
        image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        components: [
          '2x Aktívny reproduktor 15"',
          '1x Výkonný aktívny subwoofer 18"',
          'Svetelná rampa (4x LED PAR) na statíve',
          'Bezdrôtový mikrofón pre moderátora',
          'Kompletná kabeláž'
        ],
        desc: 'Náš najpopulárnejší balík, ktorý dodá vašej svadbe či oslave kryštálový zvuk a skvelú svetelnú atmosféru.'
      };
    }

    // Default or small events
    return {
      id: 'party-m',
      name: 'Párty Set M (Oslava)',
      price: 80,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      components: [
        '2x Aktívny reproduktor 12"',
        'Stojany na reproduktory',
        'Bluetooth prijímač pre mobil/PC',
        'Kompletná prepojovacia kabeláž'
      ],
      desc: 'Skvelá a kompaktná voľba pre menšie rodinné oslavy, chaty a narodeninové párty.'
    };
  };

  const recommendedSet = getRecommendation();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error('Prosím vyplňte vaše meno a email.');
      return;
    }

    toast.success('Rezervačný dopyt bol úspešne odoslaný!', {
      description: `Váš dopyt pre "${recommendedSet.name}" sme zaznamenali. Čoskoro sa vám ozveme.`
    });
    setIsOpen(false);
    resetQuiz();
  };

  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#1A4BFF]/20 via-[#0a0d1f] to-[#BD20D3]/20 border border-[#BD20D3]/30 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(189,32,211,0.15)]">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#BD20D3]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#1A4BFF]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 max-w-xl text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Inteligentný pomocník</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Neviete, akú techniku vybrať?
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Náš interaktívny sprievodca vám na základe 3 jednoduchých otázok odporučí ideálny set zvuku a svetiel presne pre vaše podujatie.
              </p>
            </div>

            <div className="shrink-0 z-10 w-full md:w-auto">
              <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetQuiz(); }}>
                <DialogTrigger asChild>
                  <Button className="btn-cyber w-full md:w-auto text-base px-8 py-6 rounded-2xl border-none shadow-[0_0_20px_rgba(189,32,211,0.4)] hover:scale-105 transition-transform">
                    Nakonfigurovať aparatúru
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0a0d1f] border-white/10 text-white max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-[#BD20D3]/20 overflow-y-auto max-h-[90vh]">
                  <DialogHeader className="border-b border-white/5 pb-4 mb-4">
                    <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2 text-white">
                      <Sparkles className="text-[#BD20D3]" />
                      Sprievodca výberom aparatúry
                    </DialogTitle>
                  </DialogHeader>

                  {/* STEP 1: PEOPLE SIZE */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 1 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Pre koľko ľudí je plánovaná akcia?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'up-to-30', label: 'Komorná párty / oslava (do 30 ľudí)', desc: 'Menší priestor, dôraz na čistý zvuk og nízku cenu.' },
                          { id: 'up-to-100', label: 'Svadba / Stredný event (do 100 ľudí)', desc: 'Tanečný parket, vyvážený zvuk s basmi a osvetlenie.' },
                          { id: 'over-100', label: 'Veľké podujatie / Klub (nad 100 ľudí)', desc: 'Silný zvukový tlak, subwoofery a kompletná svetelná show.' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption('people', opt.id)}
                            className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group"
                          >
                            <div>
                              <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                              <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                            </div>
                            <Users size={18} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors shrink-0 ml-4" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: LOCATION */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 2 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Kde sa bude podujatie konať?</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'indoor', label: 'Interiér', desc: 'Sála, reštaurácia, chata, kultúrny dom.' },
                          { id: 'outdoor', label: 'Exteriér', desc: 'Záhrada, altánok, stan, open-air priestor.' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectOption('location', opt.id)}
                            className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group h-full"
                          >
                            <MapPin size={24} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors mb-4" />
                            <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                            <p className="text-xs text-gray-400 mt-1 flex-grow">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
                        <ArrowLeft size={14} /> Späť
                      </Button>
                    </div>
                  )}

                  {/* STEP 3: EVENT TYPE */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-xs text-[#BD20D3] uppercase font-bold tracking-widest">Krok 3 z 3</span>
                        <h3 className="text-lg md:text-xl font-bold text-white">Aký je hlavný účel a typ akcie?</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { id: 'wedding', label: 'Svadba alebo Oslava', desc: 'Mix podmazovej a tanečnej hudby, mikrofón na príhovory, dekoračné svetlá.', icon: PartyPopper },
                          { id: 'dj', label: 'DJ párty / Diskotéka', desc: 'Dôraz na silné basy, dynamické svetelné efekty a hmlu pre dokonalú atmosféru.', icon: Music },
                          { id: 'presentation', label: 'Firemná prezentácia (hovorené slovo)', desc: 'Maximálna zrozumiteľnosť hlasu, bezdrôtové mikrofóny, podmazová hudba.', icon: Tv }
                        ].map(opt => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelectOption('eventType', opt.id)}
                              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#BD20D3]/50 hover:bg-[#BD20D3]/5 text-left transition-all group"
                            >
                              <div>
                                <p className="font-bold text-white group-hover:text-[#BD20D3] transition-colors">{opt.label}</p>
                                <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>
                              </div>
                              <Icon size={18} className="text-gray-500 group-hover:text-[#BD20D3] transition-colors shrink-0 ml-4" />
                            </button>
                          );
                        })}
                      </div>
                      <Button variant="ghost" onClick={() => setStep(2)} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
                        <ArrowLeft size={14} /> Späť
                      </Button>
                    </div>
                  )}

                  {/* RECOMMENDATION RESULT SCREEN */}
                  {step === 4 && (
                    <div className="space-y-6">
                      {!showBookingForm ? (
                        <div className="space-y-6">
                          <div className="text-center space-y-2 border-b border-white/5 pb-4">
                            <span className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Konfigurácia dokončená</span>
                            <h3 className="text-xl md:text-2xl font-bold text-white">Naše odporúčanie pre vašu akciu:</h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-5">
                            <div className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                              <img src={recommendedSet.image} alt={recommendedSet.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                              <div>
                                <h4 className="text-xl font-bold text-white">{recommendedSet.name}</h4>
                                <p className="text-[#BD20D3] font-bold text-2xl mt-1">{recommendedSet.price} € <span className="text-xs text-gray-400 font-normal">/ dňa</span></p>
                                <p className="text-gray-300 text-xs md:text-sm mt-2 leading-relaxed">{recommendedSet.desc}</p>
                              </div>
                              
                              <div className="space-y-1.5">
                                <p className="text-xs font-bold uppercase text-gray-400">Set obsahuje:</p>
                                {recommendedSet.components.map((comp, idx) => (
                                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                                    <Check size={12} className="text-[#BD20D3] shrink-0" />
                                    <span>{comp}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button variant="outline" onClick={resetQuiz} className="border-white/10 text-white hover:bg-white/5 rounded-xl h-12 flex-1">
                              Spustiť znova
                            </Button>
                            <Button onClick={() => setShowBookingForm(true)} className="btn-cyber rounded-xl h-12 flex-1 border-none font-bold">
                              Nezáväzne rezervovať
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleBookingSubmit} className="space-y-5">
                          <div className="space-y-2 text-center border-b border-white/5 pb-4">
                            <h3 className="text-lg md:text-xl font-bold text-white">Rezervácia: {recommendedSet.name}</h3>
                            <p className="text-xs text-gray-400">Ponuku vám vypracujeme a pošleme obratom na e-mail.</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-name" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <User size={12} className="text-[#BD20D3]" /> Meno a priezvisko *
                              </Label>
                              <Input
                                id="quiz-name"
                                required
                                placeholder="Ján Novák"
                                value={bookingData.name}
                                onChange={(e) => setBookingData(p => ({ ...p, name: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-email" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Mail size={12} className="text-[#BD20D3]" /> E-mail *
                              </Label>
                              <Input
                                id="quiz-email"
                                type="email"
                                required
                                placeholder="jan.novak@example.sk"
                                value={bookingData.email}
                                onChange={(e) => setBookingData(p => ({ ...p, email: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-phone" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Phone size={12} className="text-[#BD20D3]" /> Telefón
                              </Label>
                              <Input
                                id="quiz-phone"
                                type="tel"
                                placeholder="+421 900 123 456"
                                value={bookingData.phone}
                                onChange={(e) => setBookingData(p => ({ ...p, phone: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="quiz-date" className="text-gray-300 text-xs font-bold uppercase flex items-center gap-1.5">
                                <Calendar size={12} className="text-[#BD20D3]" /> Predbežný dátum *
                              </Label>
                              <Input
                                id="quiz-date"
                                type="date"
                                required
                                value={bookingData.date}
                                onChange={(e) => setBookingData(p => ({ ...p, date: e.target.value }))}
                                className="bg-black/50 border-white/10 text-white rounded-xl h-11 text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="quiz-msg" className="text-gray-300 text-xs font-bold uppercase">Poznámka k objednávke</Label>
                            <Textarea
                              id="quiz-msg"
                              placeholder="Miesto akcie, špecifikácie, doprava..."
                              value={bookingData.message}
                              onChange={(e) => setBookingData(p => ({ ...p, message: e.target.value }))}
                              className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setShowBookingForm(false)} className="text-xs text-gray-400 hover:text-white h-11">
                              Späť
                            </Button>
                            <Button type="submit" className="btn-cyber rounded-xl h-11 flex-grow border-none font-bold">
                              Odoslať nezáväzný dopyt
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveQuiz;