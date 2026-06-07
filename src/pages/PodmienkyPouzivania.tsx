"use client";

import React from 'react';
import Footer from '../components/Footer';

const PodmienkyPouzivania = () => {
  return (
    <div className="min-h-screen bg-[#020721] text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Podmienky <span className="text-[#BD20D3]">používania</span>
        </h1>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Všeobecné ustanovenia</h2>
            <p>
              Tieto podmienky používania (ďalej len „Podmienky“) upravujú pravidlá používania webovej stránky Socializea-audio (ďalej len „Webová stránka“). Používaním Webovej stránky používateľ potvrdzuje, že si tieto Podmienky prečítal, porozumel im a zaväzuje sa ich dodržiavať.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Používanie webovej stránky</h2>
            <p>
              Webová stránka je určená na informačné účely a na umožnenie objednávania tovaru a služieb. Používateľ sa zaväzuje používať Webovú stránku v súlade s platnými právnymi predpami Slovenskej republiky a týmito Podmienkami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Duševné vlastníctvo</h2>
            <p>
              Všetok obsah Webovej stránky, vrátane textov, obrázkov, grafiky, log, zvukových a video záznamov, je chránený autorským právom a inými právami duševného vlastníctva. Akékoľvek kopírovanie, rozširovanie, úprava alebo iné použitie obsahu bez písomného súhlasu vlastníka je zakázané.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Registrácia a používateľský účet</h2>
            <p>
              Pre niektoré funkcie Webovej stránky môže byť potrebná registrácia. Používateľ je povinný poskytovať pravdivé a aktuálne údaje. Používateľ je zodpovedný za bezpečnosť svojho účtu a hesla. V prípade podozrenia z neoprávneného prístupu je používateľ povinný okamžite kontaktovať prevádzkovateľa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Objednávanie a nákup</h2>
            <p>
              Objednaním tovaru alebo služieb prostredníctvom Webovej stránky uzatvára používateľ kúpnu zmluvu s Predávajúcim. Podrobnosti o objednávaní, platbe a dodaní sú upravené v Obchodných podmienkach. Predávajúci si vyhradzuje právo odmietnuť objednávku v odôvodnených prípadoch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Zodpovednosť za obsah</h2>
            <p>
              Používateľ je výlučne zodpovedný za akýkoľvek obsah, ktorý uverejní na Webovej stránke (napr. komentáre, recenzie). Používateľ sa zaväzuje neuvádzať obsah, ktorý je nezákonný, urážlivý, hanlivý alebo porušuje práva tretích osôb.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Obmedzenie zodpovednosti</h2>
            <p>
              Prevádzkovateľ Webovej stránky neručí za prerušenie prevádzky, stratu údajov alebo akékoľvek škody vzniknuté používaním Webovej stránky, okrem prípadov, keď je škoda spôsobená úmyselne alebo z hrubej nepozornosti prevádzkovateľa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Odkazy na tretie strany</h2>
            <p>
              Webová stránka môže obsahovať odkazy na webové stránky tretích osôb. Prevádzkovateľ nenesie zodpovednosť za obsah týchto stránok ani za spôsob, akým tieto stránky narábajú s osobnými údajmi používateľov.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Cookies</h2>
            <p>
              Webová stránka používa cookies na zabezpečenie správnej funkčnosti, analýzu návštevnosti a personalizáciu obsahu. Používaním Webovej stránky používateľ súhlasí s používaním cookies v súlade s nastaveniami svojho prehliadača.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Zmena podmienok</h2>
            <p>
              Prevádzkovateľ si vyhradzuje právo kedykoľvek zmeniť tieto Podmienky. Zmeny nadobúdajú účinnosť dňom zverejnenia na Webovej stránke. Používaním Webovej stránky po zmenách používateľ potvrdzuje súhlas so zmenenými Podmienkami.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Kontakt</h2>
            <p>
              V prípade akýchkoľvek otázok týkajúcich sa týchto Podmienok nás môžete kontaktovať prostredníctvom kontaktných údajov uvedených na Webovej stránke.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            Posledná aktualizácia: Január 2025
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PodmienkyPouzivania;