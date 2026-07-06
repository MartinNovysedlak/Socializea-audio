"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen } from 'lucide-react';

const ObchodnePodmienky = () => {
  return (
    <>
      <Helmet>
        <title>Obchodné podmienky | Socializea Audio</title>
        <meta name="description" content="Obchodné podmienky prenájmu a predaja techniky Socializea Audio." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://socializea.sk/obchodne-podmienky" />
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                <BookOpen size={20} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Obchodné podmienky</h1>
            </div>

            <div className="text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
              <h2 className="text-xl font-bold text-white">1. Úvodné ustanovenia</h2>
              <p>
                Obchodné podmienky upravujú práva a povinnosti medzi spoločnosťou Socializea Audio (prevádzkovateľ) a zákazníkom (objednávateľom) v súvislosti s prenájmom alebo predajom zvukovej a svetelnej techniky.
              </p>
              <p>
                Prevádzkovateľ: Socializea-audio, Čadečka 1924, 022 01 Čadca, Slovensko, IČO: XY, DIČ: XY. Kontakt: socializea@socializea.com, +421 948 070 577.
              </p>

              <h2 className="text-xl font-bold text-white">2. Rezervácia a objednávka</h2>
              <p>
                Rezervácia techniky sa považuje za záväznú až po odoslaní vyplneného rezervačného formulára na webovej stránke alebo po vzájomnej telefonickej/e-mailovej dohode. Prevádzkovateľ potvrdí objednávku bez zbytočného odkladu.
              </p>
              <p>
                Pri dlhodobých prenájmoch (viac ako 3 dni) je potrebné zaplatiť zálohu vo výške 30 % z celkovej ceny. Zvyšnú sumu uhradí objednávateľ pri prevzatí techniky.
              </p>

              <h2 className="text-xl font-bold text-white">3. Cena a platobné podmienky</h2>
              <p>
                Ceny uvedené na stránke sú konečné vrátane DPH. Pri nájme techniky je cena stanovená na deň (alebo na víkend podľa balíka). Pri predaji je cena uvedená za kus s DPH. Platba je možná v hotovosti, bankovým prevodom alebo kartou na mieste.
              </p>
              <p>
                Vratná záloha (kaucií) sa platí pri prevzatí techniky a je vrátená po jej vrátení v nepoškodenom stave najneskôr do 5 pracovných dní.
              </p>

              <h2 className="text-xl font-bold text-white">4. Zodpovednosť za škodu</h2>
              <p>
                Objednávateľ zodpovedá za techniku počas celej doby jej zapožičania. V prípade poškodenia, straty alebo krádeže je objednávateľ povinný nahradiť vzniknutú škodu v plnej výške. Odporúčame si techniku poistiť.
              </p>
              <p>
                Prevádzkovateľ neručí za škody spôsobené nesprávnym používaním techniky, nevhodným prostredím (vlhkosť, mráz, prach) alebo zásahom nepovolaných osôb.
              </p>

              <h2 className="text-xl font-bold text-white">5. Reklamácie a vrátenie tovaru</h2>
              <p>
                Pri predaji techniky platí záruka 24 mesiacov na nové výrobky a 6 mesiacov na použité výrobky (B-Stock). Reklamáciu je možné uplatniť osobne v sídle spoločnosti alebo zaslaním na adresu prevádzkovateľa.
              </p>
              <p>
                Pri prenájme je technika odovzdaná v bezchybnom stave. Objednávateľ je povinný skontrolovať techniku pri prevzatí a prípadné nedostatky ihneď nahlásiť.
              </p>

              <h2 className="text-xl font-bold text-white">6. Záverečné ustanovenia</h2>
              <p>
                Tieto obchodné podmienky sú platné od 1. 1. 2025. Prevádzkovateľ si vyhradzuje právo na ich zmenu. Všetky vzťahy sa riadia právnym poriadkom Slovenskej republiky.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default ObchodnePodmienky;