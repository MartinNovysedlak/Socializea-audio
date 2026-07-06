"use client";

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PodmienkyPouzivania = () => {
  return (
    <>
      <Helmet>
        <title>Podmienky používania | Socializea Audio</title>
        <meta name="description" content="Podmienky používania webovej stránky Socializea Audio." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://socializea.sk/podmienky-pouzivania" />
      </Helmet>

      <main className="min-h-screen bg-[#020721]">
        <Navbar />
        <div className="pt-36 pb-16 md:pb-24 container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full flex items-center justify-center text-[#BD20D3]">
                <Shield size={20} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Podmienky používania</h1>
            </div>

            <div className="text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
              <h2 className="text-xl font-bold text-white">1. Rozsah a akceptácia podmienok</h2>
              <p>
                Tieto podmienky používania upravujú prístup a používanie webovej stránky socializea.sk (ďalej len „webová stránka“). 
                Používaním webovej stránky vyjadrujete súhlas s týmito podmienkami. Ak s nimi nesúhlasíte, stránku nepoužívajte.
              </p>

              <h2 className="text-xl font-bold text-white">2. Autorské práva a obsah</h2>
              <p>
                Obsah zverejnený na webovej stránke (texty, fotografie, logá, videá, diagramy) je chránený autorským zákonom. 
                Je zakázané akékoľvek kopírovanie, šírenie alebo komerčné využitie obsahu bez predchádzajúceho písomného súhlasu prevádzkovateľa.
              </p>

              <h2 className="text-xl font-bold text-white">3. Presnosť informácií</h2>
              <p>
                Prevádzkovateľ sa snaží uvádzať presné a aktuálne informácie o technike, cenách a dostupnosti. 
                Napriek maximálnej snahe nemôžeme zaručiť úplnú bezchybnosť všetkých údajov. 
                O prípadných zmenách vás budeme informovať v dostatočnom predstihu.
              </p>

              <h2 className="text-xl font-bold text-white">4. Externé odkazy</h2>
              <p>
                Webová stránka môže obsahovať odkazy na externé stránky. Prevádzkovateľ nezodpovedá za obsah týchto stránok ani za prípadné škody spôsobené ich používaním.
              </p>

              <h2 className="text-xl font-bold text-white">5. Ochrana osobných údajov</h2>
              <p>
                Osobnými údajmi získanými prostredníctvom formulárov na webovej stránke nakladáme v súlade s nariadením GDPR. 
                Vaše údaje (meno, email, telefón) uchovávame výhradne pre účely komunikácie v rámci vybavenia dopytu a nie sú poskytované tretím stranám bez vášho súhlasu.
              </p>
              <p>
                Prevádzkovateľ je oprávnený používať cookies na zlepšenie fungovania stránky, analýzu návštevnosti a personalizáciu obsahu. 
                Cookies môžete odmietnuť v nastaveniach svojho prehliadača.
              </p>

              <h2 className="text-xl font-bold text-white">6. Obmedzenie zodpovednosti</h2>
              <p>
                Prevádzkovateľ nezodpovedá za žiadne priame ani nepriame škody vzniknuté v dôsledku používania alebo nemožnosti používania webovej stránky. 
                Používateľ používa stránku na vlastnú zodpovednosť.
              </p>

              <h2 className="text-xl font-bold text-white">7. Zmena podmienok</h2>
              <p>
                Prevádzkovateľ si vyhradzuje právo kedykoľvek zmeniť tieto podmienky používania. 
                O zmene budete informovaní zverejnením aktualizovanej verzie na tejto stránke.
              </p>

              <h2 className="text-xl font-bold text-white">8. Kontakt</h2>
              <p>
                Ak máte akékoľvek otázky týkajúce sa týchto podmienok, kontaktujte nás na e-mailovej adrese socializea@socializea.com alebo telefonicky na čísle +421 948 070 577.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default PodmienkyPouzivania;