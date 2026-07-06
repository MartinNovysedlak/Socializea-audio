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
        <title>Podmienky používania a Ochrana súkromia | Socializea Audio</title>
        <meta name="description" content="Podmienky používania webovej stránky socializea.sk vrátane ochrany osobných údajov (GDPR), cookies politiky a autorských práv." />
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
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Podmienky používania a ochrana súkromia</h1>
            </div>

            <p className="text-gray-400 text-sm border-b border-white/5 pb-4">
              <strong className="text-white">Dátum účinnosti:</strong> 1. 1. 2025 | 
              <strong className="text-white ml-3">Verzia:</strong> 2.1
            </p>

            <div className="text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">

              <h2 className="text-xl font-bold text-white">1. Úvodné ustanovenia</h2>
              <p>
                1.1. Tieto Podmienky používania a ochrany súkromia (ďalej len „Podmienky používania") upravujú pravidlá, za ktorých môžete používať webovú stránku <strong className="text-white">socializea.sk</strong> (ďalej len „Webová stránka") a všetky jej podstránky, služby a funkcionality.
              </p>
              <p>
                1.2. Prevádzkovateľom Webovej stránky je <strong className="text-white">Matej Novysedlák</strong>, miesto podnikania Čadečka 1924, 022 01 Čadca, živnosť zapísaná v živnostenskom registri Okresného úradu Čadca (ďalej len „Prevádzkovateľ").
              </p>
              <p>
                1.3. Používaním Webovej stránky vyjadrujete súhlas s týmito Podmienkami používania. Ak s nimi nesúhlasíte, Webovú stránku nepoužívajte a neposkytujte prostredníctvom nej žiadne osobné údaje.
              </p>
              <p>
                1.4. Prevádzkovateľ si vyhradzuje právo kedykoľvek jednostranne zmeniť tieto Podmienky používania. O zmene budete informovaní zverejnením aktualizovanej verzie na tejto stránke s uvedením dátumu účinnosti. Odporúčame vám pravidelne kontrolovať aktuálne znenie.
              </p>

              <h2 className="text-xl font-bold text-white">2. Rozsah a dostupnosť služieb</h2>
              <p>
                2.1. Webová stránka slúži na:
                <br />a) Informovanie o ponuke prenájmu a predaja zvukovej, svetelnej a súvisiacej techniky.
                <br />b) Vytváranie rezervácií a odosielanie dopytov na prenájom techniky.
                <br />c) Vytváranie objednávok na kúpu techniky.
                <br />d) Poskytovanie odborných informácií, rád a blogových článkov.
                <br />e) Komunikáciu so zákazníkmi prostredníctvom kontaktných formulárov.
              </p>
              <p>
                2.2. Prevádzkovateľ sa snaží zabezpečiť nepretržitú dostupnosť Webovej stránky, avšak nezodpovedá za dočasné výpadky spôsobené technickou údržbou, poruchou serverov, výpadkom internetového pripojenia alebo inými okolnosťami, ktoré nemôže ovplyvniť.
              </p>

              <h2 className="text-xl font-bold text-white">3. Autorské práva a duševné vlastníctvo</h2>
              <p>
                3.1. Celý obsah Webovej stránky vrátane, ale nie výlučne, textov, fotografií, grafických prvkov, log, videí, zvukových nahrávok, diagramov, ilustrácií, databáz, softvérového kódu a dizajnu, je chránený autorským zákonom (zákon č. 185/2015 Z.z. Autorský zákon v platnom znení) a právom duševného vlastníctva.
              </p>
              <p>
                3.2. Žiadna časť Webovej stránky nesmie byť bez predchádzajúceho písomného súhlasu Prevádzkovateľa:
                <br />a) Kopírovaná, reprodukovaná, distribuovaná, zverejňovaná, prenášaná, upravovaná alebo inak používaná na komerčné účely.
                <br />b) Použitá na vytváranie odvodených diel.
                <br />c) Vkladaná do iných webových stránok (framing, hotlinking) bez súhlasu.
              </p>
              <p>
                3.3. Fotografie produktov, ktoré nie sú výhradným vlastníctvom Prevádzkovateľa, sú použité na základe licencie (napr. Unsplash) alebo so súhlasom vlastníka.
              </p>
              <p>
                3.4. Ochranné známky, logá a názvy značiek uvedené na Webovej stránke sú majetkom ich príslušných vlastníkov a sú použité výhradne na identifikačné účely.
              </p>

              <h2 className="text-xl font-bold text-white">4. Používanie webovej stránky</h2>
              <p>
                4.1. Používateľ sa zaväzuje používať Webovú stránku v súlade s platnými právnymi predpismi, týmito Podmienkami používania a dobrými mravmi.
              </p>
              <p>
                4.2. Používateľovi je zakázané:
                <br />a) Zasahovať do bezpečnosti Webovej stránky (napr. pokusy o neoprávnený prístup, hackerské útoky, šírenie škodlivého kódu).
                <br />b) Používať Webovú stránku na šírenie spam-u, nevyžiadanej reklamy alebo iného nevyžiadaného obsahu.
                <br />c) Používať automatizované nástroje (scraping, boty, crawlers) na extrakciu údajov bez predchádzajúceho súhlasu.
                <br />d) Zverejňovať prostredníctvom Webovej stránky nezákonný, urážlivý, hanlivý, diskriminačný alebo inak nevhodný obsah.
                <br />e) Vydávať sa za inú osobu alebo falšovať identitu.
              </p>
              <p>
                4.3. Používateľ je zodpovedný za správnosť a pravdivosť údajov, ktoré prostredníctvom Webovej stránky poskytne.
              </p>

              <h2 className="text-xl font-bold text-white">5. Registrácia a používateľské účty</h2>
              <p>
                5.1. Niektoré funkcionality Webovej stránky (napr. administrácia) môžu vyžadovať registráciu alebo prihlásenie. Prístupové údaje sú dôverné a používateľ ich nesmie sprístupniť tretím osobám.
              </p>
              <p>
                5.2. Prevádzkovateľ nezodpovedá za škody vzniknuté v dôsledku zneužitia prístupových údajov používateľa.
              </p>

              <h2 className="text-xl font-bold text-white">6. Ochrana osobných údajov (GDPR)</h2>
              <p>
                6.1. Prevádzkovateľ spracúva osobné údaje v súlade s nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR), zákonom č. 18/2018 Z.z. o ochrane osobných údajov a súvisiacimi právnymi predpismi.
              </p>

              <h3 className="text-lg font-bold text-white mt-6">6.2. Správca osobných údajov</h3>
              <p>
                Správcom osobných údajov je Matej Novysedlák, Čadečka 1924, 022 01 Čadca, e-mail: socializea@socializea.com. Prevádzkovateľ nemenoval zodpovednú osobu (DPO), keďže na to nie je zo zákona povinný.
              </p>

              <h3 className="text-lg font-bold text-white mt-6">6.3. Aké osobné údaje spracúvame a na aký účel</h3>
              <p>
                <strong className="text-white">a) Kontaktné a rezervačné formuláre:</strong>
                <br />Účel: Vybavenie dopytu, rezervácie alebo objednávky.
                <br />Spracúvané údaje: Meno, priezvisko, e-mail, telefónne číslo, správa, dátum podujatia.
                <br />Právny základ: Plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR) a opatrenia pred uzavretím zmluvy.
                <br />Doba uchovávania: Po dobu trvania zmluvného vzťahu a následne 5 rokov od jeho skončenia (archivačné účely podľa zákona o účtovníctve).
              </p>
              <p>
                <strong className="text-white">b) Newsletter a marketingové aktivity:</strong>
                <br />Účel: Zasielanie informácií o novinkách, akciách a podujatiach (iba na základe výslovného súhlasu).
                <br />Spracúvané údaje: E-mail, meno (ak je poskytnuté).
                <br />Právny základ: Súhlas (čl. 6 ods. 1 písm. a) GDPR).
                <br />Doba uchovávania: Do odvolania súhlasu.
              </p>
              <p>
                <strong className="text-white">c) Súbory cookies (pozri samostatnú sekciu nižšie).</strong>
              </p>

              <h3 className="text-lg font-bold text-white mt-6">6.4. Príjemcovia osobných údajov</h3>
              <p>
                Vaše osobné údaje sú sprístupnené výhradne:
                <br />a) Prevádzkovateľovi v nevyhnutnom rozsahu.
                <br />b) Poskytovateľovi e-mailovej služby (EmailJS) pre účely odosielania správ – EmailJS spracúva údaje na základe spracovateľskej zmluvy v súlade s GDPR.
                <br />c) Poskytovateľovi webhostingu a cloudových služieb.
                <br />d) Príslušným orgánom štátnej správy (napr. daňový úrad, súd) v rozsahu a prípadoch stanovených zákonom.
              </p>
              <p>
                Vaše osobné údaje nie sú poskytované tretím stranám na ich marketingové účely.
              </p>

              <h3 className="text-lg font-bold text-white mt-6">6.5. Prenos údajov do tretích krajín</h3>
              <p>
                Vaše osobné údaje sú spracúvané výhradne na území Európskej únie a Európskeho hospodárskeho priestoru (EÚ/EHP). V prípade použitia služieb, ktoré môžu zahŕňať spracovanie mimo EÚ/EHP (napr. EmailJS), je zabezpečená primeraná úroveň ochrany prostredníctvom štandardných zmluvných doložiek (SCC).
              </p>

              <h3 className="text-lg font-bold text-white mt-6">6.6. Vaše práva podľa GDPR</h3>
              <p>
                V súvislosti so spracúvaním vašich osobných údajov máte nasledujúce práva:
                <br />a) <strong className="text-white">Právo na prístup</strong> – máte právo získať potvrdenie, či spracúvame vaše údaje, a ak áno, máte právo získať kópiu týchto údajov.
                <br />b) <strong className="text-white">Právo na opravu</strong> – ak sú vaše údaje nepresné alebo neúplné, máte právo na ich opravu.
                <br />c) <strong className="text-white">Právo na výmaz („právo byť zabudnutý")</strong> – máte právo požiadať o vymazanie vašich údajov, ak už nie sú potrebné na účel, na ktorý boli zhromaždené, alebo ak odvoláte súhlas.
                <br />d) <strong className="text-white">Právo na obmedzenie spracúvania</strong> – máte právo požiadať o obmedzenie spracúvania v určitých prípadoch (napr. ak namietate presnosť údajov).
                <br />e) <strong className="text-white">Právo namietať</strong> – máte právo namietať spracúvanie vašich údajov založené na oprávnenom záujme.
                <br />f) <strong className="text-white">Právo na prenosnosť údajov</strong> – máte právo získať svoje údaje v štruktúrovanom, bežne používanom a strojovo čitateľnom formáte a preniesť ich inému správcovi.
                <br />g) <strong className="text-white">Právo podať sťažnosť</strong> – ak sa domnievate, že spracúvanie vašich údajov je v rozpore s GDPR, máte právo podať sťažnosť dozornému orgánu – Úradu na ochranu osobných údajov Slovenskej republiky (www.dataprotection.gov.sk).
              </p>

              <h2 className="text-xl font-bold text-white">7. Cookies a podobné technológie</h2>
              <p>
                7.1. Webová stránka používa súbory cookies a podobné technológie (ďalej len „Cookies") na zabezpečenie správneho fungovania, analýzu návštevnosti a personalizáciu obsahu.
              </p>
              <p>
                7.2. <strong className="text-white">Aké cookies používame:</strong>
              </p>
              <p>
                <strong className="text-white">a) Nevyhnutné cookies:</strong> Sú potrebné na fungovanie Webovej stránky. Bez nich by stránka nefungovala správne. Nie je možné ich odmietnuť.
              </p>
              <p>
                <strong className="text-white">b) Analytické cookies:</strong> Používame ich na zber anonymných štatistík o návštevnosti (napr. Google Analytics 4, dáta sú anonymizované). Údaje sú agregované a nie je možné identifikovať konkrétneho používateľa.
              </p>
              <p>
                <strong className="text-white">c) Marketingové cookies:</strong> V súčasnosti tieto cookies nepoužívame.
              </p>
              <p>
                7.3. Váš prehliadač vám umožňuje cookies spravovať, blokovať alebo mazať. Návody nájdete v nastaveniach konkrétneho prehliadača (Chrome, Firefox, Safari, Edge).
              </p>

              <h2 className="text-xl font-bold text-white">8. Obmedzenie zodpovednosti</h2>
              <p>
                8.1. Webová stránka je poskytovaná „tak, ako je" (as is). Prevádzkovateľ nezodpovedá za:
                <br />a) Prípadné chyby, nepresnosti alebo opomenutia v obsahu.
                <br />b) Dočasnú nedostupnosť stránky z technických príčin.
                <br />c) Škody spôsobené vírusmi, malvérom alebo iným škodlivým kódom.
                <br />d) Obsah externých webových stránok, na ktoré Webová stránka odkazuje.
                <br />e) Škody vzniknuté v dôsledku použitia informácií zverejnených na Webovej stránke.
              </p>

              <h2 className="text-xl font-bold text-white">9. Odkazy na tretie strany</h2>
              <p>
                9.1. Webová stránka môže obsahovať odkazy na externé webové stránky (napr. sociálne siete, mapové podklady). Prevádzkovateľ nemá kontrolu nad obsahom a postupmi týchto stránok a nezodpovedá za ne.
              </p>

              <h2 className="text-xl font-bold text-white">10. Zmluva uzatváraná na diaľku</h2>
              <p>
                10.1. Webová stránka umožňuje uzatváranie zmlúv na diaľku (rezervácia prenájmu, objednávka predaja). Vzťahuje sa na ne zákon č. 102/2014 Z.z. o ochrane spotrebiteľa pri predaji tovaru na diaľku.
              </p>
              <p>
                10.2. Pri predaji tovaru platia výnimky stanovené v § 7 ods. 6 zákona č. 102/2014 Z.z.
              </p>

              <h2 className="text-xl font-bold text-white">11. Riešenie sporov</h2>
              <p>
                11.1. Všetky spory medzi Prevádzkovateľom a používateľom sa budú riešiť prednostne mimosúdnou cestou.
              </p>
              <p>
                11.2. Prípadné súdne spory bude riešiť miestne a vecne príslušný súd Slovenskej republiky.
              </p>

              <h2 className="text-xl font-bold text-white">12. Záverečné ustanovenia</h2>
              <p>
                12.1. Tieto Podmienky používania nadobúdajú účinnosť dňom 1. 1. 2025.
              </p>
              <p>
                12.2. Prevádzkovateľ si vyhradzuje právo jednostranne meniť tieto Podmienky používania.
              </p>
              <p>
                12.3. V prípade akýchkoľvek otázok nás kontaktujte na e-mailovej adrese: socializea@socializea.com.
              </p>

              <div className="border-t border-white/5 pt-6 mt-6 text-xs text-gray-500">
                <p>Matej Novysedlák | Čadečka 1924, 022 01 Čadca | Živnosť zapísaná v živnostenskom registri Okresného úradu Čadca</p>
                <p className="mt-1">E-mail: socializea@socializea.com | Tel: +421 948 070 577 | Web: socializea.sk</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default PodmienkyPouzivania;