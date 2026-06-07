"use client";

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ObchodnePodmienky = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020721] text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-32 pb-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Obchodné <span className="text-[#BD20D3]">podmienky</span>
        </h1>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Všeobecné ustanovenia</h2>
            <p>
              Tieto obchodné podmienky (ďalej len „Podmienky") upravujú práva a povinnosti medzi spoločnosťou Socializea-audio (ďalej len „Predávajúci") a jej zákazníkmi (ďalej len „Kupujúci") pri nákupe tovaru a služieb prostredníctvom webovej stránky.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Objednávka a uzatvorenie zmluvy</h2>
            <p>
              Objednávka je nezáväznou ponukou Kupujúceho na uzatvorenie kúpnej zmluvy. Kúpna zmluva vzniká doručením potvrdenia objednávky Predávajúcim na e-mailovú adresu Kupujúceho. Predávajúci si vyhradzuje právo odmietnuť objednávku v prípade, že tovar nie je na sklad alebo došlo k chybe v ceníku.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Cena tovaru</h2>
            <p>
              Ceny tovaru sú uvedené v EUR a zahrňajú DPH. Predávajúci si vyhradzuje právo zmeny cien. Pre platnosť je rozhodná cena uvedená v čase odoslania objednávky. Dopravné a balné poplatky sú účtované samostatne, ak nie je uvedené inak.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Spôsob platby</h2>
            <p>
              Kupujúci môže zaplatiť za tovar nasledujúcimi spôsobmi:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Platba kartou online</li>
              <li>Bankovým prevodom na účet Predávajúceho</li>
              <li>Hotovosťou pri osobnom odbere</li>
              <li>Hotovosťou na dobierku (ak je dostupné)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Dodanie tovaru</h2>
            <p>
              Dodacia lehota je zvyčajne 3-7 pracovných dní od potvrdenia objednávky. V prípade väččích objednávok alebo špeciálnych produktov sa dodacia lehota môže predĺžiť. O presnom termíne dodania bude Kupujúci informovaný e-mailom.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Právo na odstúpenie od zmluvy</h2>
            <p>
              Kupujúci má právo odstúpiť od zmluvy bez udania dôvodu do 14 dní od prevzatia tovaru. Na uplatnenie práva na odstúpenie musí Kupujúci vyplniť a odoslať formulár na odstúpenie od zmluvy. Tovar musí byť vrátený v neporušenom stave, neopotrebovaný a v originálnom obale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Záruka a reklamácie</h2>
            <p>
              Na tovar sa vzťahuje záruka v trvaní 24 mesiacov od dátumu predaja, ak nie je uvedená predĺžená záruka výrobcom. Reklamáciu je potrebné nahlásiť písomne na e-mailovú adresu Predávajúceho. Predávajúci vydá rozhodnutie o reklamácii do 30 dní od doručenia reklamovaného tovaru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Ochrana osobných údajov</h2>
            <p>
              Predávajúci spracúva osobné údaje Kupujúceho v súlade s Nariadením GDPR a zákonom o ochrane osobných údajov. Podrobnosti o spracúvaní osobných údajov sú uvedené v Zásadách ochrany osobných údajov.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Riešenie sporov</h2>
            <p>
              Všetky spory vzniknuté z týchto Podmienok alebo v súvislosti s nimi budú riešené podľa právneho poriadku Slovenskej republiky. Kupujúci má právo obrátiť sa na spotrebiteľskú arbitrážu alebo na príslušný súd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Záverečné ustanovenia</h2>
            <p>
              Tieto Podmienky nadobúdajú platnosť dňom zverejnenia na webovej stránke Predávajúceho. Predávajúci si vyhradzuje právo na zmenu týchto Podmienok. Zmeny nadobúdajú účinnosť dňom zverejnenia. Tieto Podmienky sú účinné od 1.1.2025.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Posledná aktualizácia: Január 2025
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ObchodnePodmienky;