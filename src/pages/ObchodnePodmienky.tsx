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
        <title>Obchodné podmienky | Socializea-audio – Prenájom & Predaj Techniky</title>
        <meta name="description" content="Úplné obchodné podmienky prenájmu a predaja profesionálnej zvukovej a svetelnej techniky Socializea-audio. Podmienky rezervácie, dodania, zodpovednosti za škodu." />
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

            <p className="text-gray-400 text-sm border-b border-white/5 pb-4">
              <strong className="text-white">Dátum účinnosti:</strong> 1. 1. 2025 | 
              <strong className="text-white ml-3">Verzia:</strong> 1.5
            </p>

            <div className="text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">

              <h2 className="text-xl font-bold text-white">1. Identifikačné údaje a rozsah platnosti</h2>
              <p>
                1.1. Tieto obchodné podmienky (ďalej len „Podmienky") v zmysle § 273 ods. 1 zákona č. 513/1991 Zb. Obchodného zákonníka v platnom znení upravujú vzájomné práva a povinnosti medzi <strong className="text-white">Prenajímateľom / Predávajúcim</strong> – podnikateľom fyzickou osobou pod obchodným menom Socializea-audio (ďalej len „Prenajímateľ" alebo „Predávajúci") a fyzickou alebo právnickou osobou (ďalej len „Nájomca" alebo „Kupujúci") pri poskytovaní služieb prenájmu a predaja zvukovej, svetelnej a súvisiacej techniky, ako aj súvisiacich doplnkových služieb (inštalácia, doprava, obsluha).
              </p>
              <p>
                1.2. <strong className="text-white">Prenajímateľ / Predávajúci:</strong><br />
                Obchodné meno: Socializea-audio<br />
                Meno a priezvisko: Martin Novysedlák<br />
                Miesto podnikania: Čadečka 1924, 022 01 Čadca, Slovenská republika<br />
                Kontaktný e-mail: socializea@socializea.com<br />
                Telefón: +421 948 070 577<br />
                Web: socializea.sk<br />
                Živnosť zapísaná v živnostenskom registri Okresného úradu Čadca
              </p>
              <p>
                1.3. Tieto Podmienky sú záväzné pre všetky právne vzťahy vzniknuté medzi zmluvnými stranami v súvislosti s používaním webovej stránky socializea.sk, odoslaním objednávky, rezervácie alebo dopytu prostredníctvom formulárov na webovej stránke, e-mailovej komunikácie alebo telefonickej dohody.
              </p>

              <h2 className="text-xl font-bold text-white">2. Vymedzenie pojmov</h2>
              <p>
                2.1. <strong className="text-white">Technika</strong> – všetky hmotné predmety, ktoré Prenajímateľ poskytuje do prenájmu alebo na predaj, vrátane, ale nie výlučne, reproduktorov, subwooferov, mixážnych pultov, mikrofónov, bezdrôtových systémov, LED svietidiel, rotujúcich hláv, laserov, dymostrojov, bublinkostrojov, snehostrojov, plameňometov, stojanov, kabeláže, konštrukcií, projektorov a ostatného príslušenstva.
              </p>
              <p>
                2.2. <strong className="text-white">Prenájom</strong> – dočasné poskytnutie Techniky Nájomcovi za dohodnutú odplatu na vopred určené obdobie (ďalej len „Doba prenájmu").
              </p>
              <p>
                2.3. <strong className="text-white">Predaj</strong> – prevod vlastníckeho práva k Technike z Predávajúceho na Kupujúceho za dohodnutú kúpnu cenu.
              </p>
              <p>
                2.4. <strong className="text-white">Balík / Set</strong> – vopred definovaná kombinácia viacerých kusov Techniky (vrátane voliteľných svetiel a doplnkov) ponúkaná za zvýhodnenú súhrnnú cenu.
              </p>
              <p>
                2.5. <strong className="text-white">Rezervácia</strong> – záväzný prejav vôle Nájomcu, ktorým si vyhradzuje konkrétnu Techniku na konkrétny termín. Rezervácia je potvrdená až explicitným súhlasom Prenajímateľa (e-mailom, telefonicky alebo písomne).
              </p>
              <p>
                2.6. <strong className="text-white">Doba prenájmu</strong> – začína odovzdaním Techniky Nájomcovi a končí jej riadnym vrátením na miesto určené Prenajímateľom.
              </p>

              <h2 className="text-xl font-bold text-white">3. Rezervácia a vznik zmluvného vzťahu</h2>
              <p>
                3.1. Rezervácia Techniky sa vykonáva prostredníctvom rezervačného formulára na webovej stránke socializea.sk, e-mailom na adresu socializea@socializea.com, telefonicky na čísle +421 948 070 577 alebo osobnou návštevou v mieste podnikania.
              </p>
              <p>
                3.2. Zaslaním rezervácie alebo objednávky Nájomca potvrdzuje, že sa oboznámil s týmito Podmienkami a bez výhrad s nimi súhlasí.
              </p>
              <p>
                3.3. Zmluvný vzťah medzi Prenajímateľom a Nájomcom vzniká až okamihom potvrdenia rezervácie zo strany Prenajímateľa. Potvrdenie je zaslané e-mailom alebo potvrdené telefonicky. Do tohto okamihu nie je Prenajímateľ povinný Techniku držať a vyhradzuje si právo zmeny.
              </p>
              <p>
                3.4. V prípade zrušenia potvrdenej rezervácie Nájomcom neskôr ako 48 hodín pred začiatkom Doby prenájmu je Prenajímateľ oprávnený účtovať storno poplatok vo výške 50 % z dohodnutej ceny prenájmu. V prípade zrušenia v deň konania podujatia alebo bez udania dôvodu je storno poplatok vo výške 100 % z dohodnutej ceny.
              </p>

              <h2 className="text-xl font-bold text-white">4. Cena a platobné podmienky pri prenájme</h2>
              <p>
                4.1. Ceny za prenájom sú uvedené na webovej stránke a sú konečné vrátane DPH, pokiaľ nie je uvedené inak.
              </p>
              <p>
                4.2. Cena za prenájom je stanovená ako cena za deň (24 hodín) alebo ako cena za víkend (2 noci, resp. 3 dni), v závislosti od konkrétneho balíka alebo položky.
              </p>
              <p>
                4.3. Pri prenájme na viac ako 3 dni (viac ako 2 noci) platí:
                <br />- Prvý deň (prvých 24 hodín): plná cena podľa cenníka.
                <br />- Každá ďalšia noc (každých ďalších 24 hodín): 50 % z plnej dennej ceny.
              </p>
              <p>
                4.4. Pri balíkoch platí:
                <br />- Víkend (2 noci): cena balíka podľa cenníka v plnej výške.
                <br />- Každá ďalšia noc nad rámec 3 dní: 50 % zo základnej ceny balíka (bez príplatkov za svetlá, inštaláciu alebo dopravu).
              </p>
              <p>
                4.5. Platba za prenájom je splatná pri prevzatí Techniky. Spôsoby platby: hotovosť, bankový prevod, platba kartou na mieste (ak je technicky možné).
              </p>
              <p>
                4.6. Na základe dohody je možné vystaviť zálohovú faktúru. Záloha je v takom prípade splatná do 7 dní od vystavenia faktúry.
              </p>
              <p>
                4.7. V prípade omeškania s platbou je Prenajímateľ oprávnený účtovať úrok z omeškania v zmysle platnej legislatívy a môže pozastaviť poskytnutie Techniky až do úplného uhradenia.
              </p>

              <h2 className="text-xl font-bold text-white">5. Cena a platobné podmienky pri predaji</h2>
              <p>
                5.1. Ceny pri predaji Techniky sú uvedené na webovej stránke a sú konečné vrátane DPH, pokiaľ nie je uvedené inak.
              </p>
              <p>
                5.2. Kupujúci je povinný uhradiť kúpnu cenu v plnej výške pred odovzdaním Techniky, a to buď v hotovosti pri osobnom odbere, alebo bankovým prevodom.
              </p>
              <p>
                5.3. Vlastnícke právo k Technike prechádza na Kupujúceho až po úplnom zaplatení kúpnej ceny. Do tohto okamihu zostáva Technika majetkom Predávajúceho.
              </p>

              <h2 className="text-xl font-bold text-white">6. Dodacie a prevádzacie podmienky</h2>
              <p>
                6.1. Miesto odovzdania Techniky je spravidla v mieste podnikania Prenajímateľa (Čadečka 1924, 022 01 Čadca) alebo na odbernom mieste v Žiline (Vysokoškolská 4, Budova SADOP), pokiaľ nie je dohodnuté inak.
              </p>
              <p>
                6.2. Doprava Techniky:
                <br />a) Osobný odber v Žiline alebo Čadci – bezplatný.
                <br />b) Doprava do 10 km vzdušnou čiarou od výdajných miest – bezplatná.
                <br />c) Doprava na území Kysúc – bezplatná.
                <br />d) Doprava nad 10 km vzdušnou čiarou od výdajných miest – spoplatnená sadzbou 0,70 € za každý ďalší kilometer (cesta tam aj naspäť). Presná cena je vždy vopred odkonzultovaná a odsúhlasená.
                <br />e) Doprava do Českej republiky a vzdialenejších lokalít Slovenska – cena je stanovená individuálne na základe vzdialenosti a množstva techniky.
              </p>
              <p>
                6.3. Inštalácia Techniky:
                <br />a) Základná inštalácia (nastavenie a zapojenie) – spoplatnená sumou 20 €.
                <br />b) Inštalácia a deinštalácia (zapojenie aj odpojenie a odvoz) – spoplatnená sumou 40 €.
                <br />c) Inštalácia je dostupná len v rámci dopravných podmienok podľa bodu 6.2.
              </p>
              <p>
                6.4. Nájomca je povinný prevziať Techniku osobne alebo prostredníctvom ním splnomocnenej osoby (staršej ako 18 rokov). Pri prevzatí je Nájomca povinný skontrolovať kompletnosť a stav Techniky a prípadné nedostatky ihneď nahlásiť.
              </p>
              <p>
                6.5. V prípade, že si Nájomca Techniku neprevezme v dohodnutom termíne bez ospravedlnenia, Prenajímateľ má právo odstúpiť od zmluvy a účtovať storno poplatok podľa bodu 3.4.
              </p>

              <h2 className="text-xl font-bold text-white">7. Doba prenájmu a vrátenie techniky</h2>
              <p>
                7.1. Doba prenájmu začína odovzdaním Techniky Nájomcovi a končí jej vrátením na miesto určené Prenajímateľom.
              </p>
              <p>
                7.2. Techniku je Nájomca povinný vrátiť v dohodnutom termíne a čase. V prípade oneskoreného vrátenia bez predchádzajúceho súhlasu Prenajímateľa je Prenajímateľ oprávnený účtovať sankčný poplatok vo výške dvojnásobku dennej ceny prenájmu za každý aj začatý deň omeškania.
              </p>
              <p>
                7.3. Techniku je potrebné vrátiť v rovnakom stave a kompletnosti, v akej bola odovzdaná, s výnimkou bežného opotrebenia vzniknutého riadnym používaním.
              </p>
              <p>
                7.4. Nájomca zodpovedá za kompletnosť Techniky – všetky súčasti, príslušenstvo, káble, diaľkové ovládače a dokumentácia musia byť vrátené spolu s Technikou.
              </p>

              <h2 className="text-xl font-bold text-white">8. Zodpovednosť za škodu a poistenie</h2>
              <p>
                8.1. Nájomca preberá plnú zodpovednosť za Techniku od okamihu jej prevzatia až do okamihu jej riadneho vrátenia späť Prenajímateľovi.
              </p>
              <p>
                8.2. Nájomca zodpovedá za akékoľvek poškodenie, zničenie, stratu alebo odcudzenie Techniky, ktorá je predmetom prenájmu, a to bez ohľadu na zavinenie. To znamená, že Nájomca znáša aj škodu spôsobenú vyššou mocou (napr. živelná pohroma, povodeň, blesk, požiar, krádež vlámaním), pokiaľ nie je dohodnuté inak.
              </p>
              <p>
                8.3. V prípade vzniku škody je Nájomca povinný:
                <br />a) Bezodkladne (najneskôr do 24 hodín) nahlásiť škodu Prenajímateľovi.
                <br />b) Zabezpečiť Techniku proti ďalšiemu poškodeniu.
                <br />c) V prípade krádeže bezodkladne podať trestné oznámenie na príslušnom orgáne (Polícia SR).
              </p>
              <p>
                8.4. Nájomca sa zaväzuje nahradiť Prenajímateľovi všetky vzniknuté škody v plnej výške. Výška škody sa určuje ako:
                <br />a) Cena opravy (ak je poškodenie opraviteľné), alebo
                <br />b) Obvyklá cena Techniky v čase vzniku škody (ak ide o zničenie, stratu alebo neopraviteľné poškodenie), alebo
                <br />c) Cena uvedená v cenníku náhrad škôd, ktorý je Nájomcovi k dispozícii na vyžiadanie.
              </p>
              <p>
                8.5. Nájomcovi sa dôrazne odporúča, aby si uzavrel vlastné poistenie zodpovednosti a poistenie prenajatej veci (napr. v rámci poistenia domácnosti alebo podnikateľského poistenia), ktoré by krylo škody vzniknuté počas doby prenájmu.
              </p>
              <p>
                8.6. Prenajímateľ nezodpovedá za škody spôsobené:
                <br />a) Nesprávnym alebo neodborným používaním Techniky Nájomcom alebo treťou osobou.
                <br />b) Nevhodnými prevádzkovými podmienkami (vlhkosť, mráz, prach, mechanické namáhanie nad rámec bežného používania).
                <br />c) Zásahom do Techniky nepovolanou osobou.
                <br />d) Používaním Techniky v rozpore s návodom na obsluhu alebo s týmito Podmienkami.
              </p>
              <p>
                8.7. Prenajímateľ nezodpovedá za škodu na zdraví alebo majetku Nájomcu ani tretích osôb vzniknutú v súvislosti s používaním Techniky, pokiaľ táto škoda nebola spôsobená hrubou nedbanlivosťou alebo úmyslom Prenajímateľa.
              </p>

              <h2 className="text-xl font-bold text-white">9. Povinnosti nájomcu pri používaní techniky</h2>
              <p>
                9.1. Nájomca sa zaväzuje používať Techniku riadne, v súlade s návodom na obsluhu a účelom, na ktorý je Technika určená.
              </p>
              <p>
                9.2. Nájomca je povinný:
                <br />a) Zabezpečiť Techniku pred poveternostnými vplyvmi (dážď, sneh, mráz, priame slnečné žiarenie nad 30 °C), pokiaľ nie je Technika výslovne určená na vonkajšie použitie.
                <br />b) Zabezpečiť stabilné a bezpečné umiestnenie Techniky tak, aby nedošlo k jej prevráteniu, pádu alebo poškodeniu.
                <br />c) Používať iba predpísané napájacie napätie a konektory.
                <br />d) Nezasahovať do vnútorných častí Techniky.
                <br />e) Nepožičiavať Techniku tretím osobám.
              </p>
              <p>
                9.3. Nájomca nie je oprávnený bez predchádzajúceho písomného súhlasu Prenajímateľa:
                <br />a) Techniku ďalej prenajímať, darovať, predávať alebo inak scudzovať.
                <br />b) Techniku akokoľvek upravovať, modifikovať alebo prestavovať.
                <br />c) Odstrániť alebo poškodiť identifikačné štítky, výrobné čísla alebo označenia Prenajímateľa.
              </p>

              <h2 className="text-xl font-bold text-white">10. Práva a povinnosti prenajímateľa pri predaji</h2>
              <p>
                10.1. Predávajúci sa zaväzuje odovzdať Kupujúcemu Techniku v stave zodpovedajúcom dohodnutým parametrom (nová/použitá a pod.).
              </p>
              <p>
                10.2. Vlastnícke právo k Technike prechádza na Kupujúceho až úplným zaplatením kúpnej ceny. Do tohto okamihu ostáva Technika majetkom Predávajúceho.
              </p>
              <p>
                10.3. Nebezpečenstvo škody na Technike prechádza na Kupujúceho okamihom prevzatia Techniky. Pri doprave zabezpečenej Predávajúcim prechádza nebezpečenstvo škody na Kupujúceho až okamihom odovzdania Techniky na mieste určenia.
              </p>

              <h2 className="text-xl font-bold text-white">11. Zodpovednosť za vady, reklamácie a vrátenie tovaru</h2>
              <p>
                11.1. <strong className="text-white">Prenájom:</strong> Technika je Nájomcovi odovzdaná v bezchybnom a plne funkčnom stave. Nájomca je povinný Techniku pri prevzatí skontrolovať a prípadné závady ihneď nahlásiť. Prenajímateľ nezodpovedá za vady vzniknuté po prevzatí Techniky.
              </p>
              <p>
                11.2. <strong className="text-white">Predaj nových kusov:</strong> Na nové výrobky sa vzťahuje záručná doba 24 mesiacov od prevzatia, pokiaľ nie je na konkrétny výrobok stanovená kratšia záručná doba výrobcom. Záruka sa riadi platnými právnymi predpismi SR a EÚ.
              </p>
              <p>
                11.3. <strong className="text-white">Predaj použitých kusov (B-Stock / bazár):</strong> Na použité výrobky sa vzťahuje záručná doba 6 mesiacov od prevzatia.
              </p>
              <p>
                11.4. <strong className="text-white">Vylúčenie zodpovednosti za vady:</strong> Záruka sa nevzťahuje na:
                <br />a) Vady spôsobené bežným opotrebením.
                <br />b) Vady spôsobené nesprávnym používaním, neodborným zaobchádzaním alebo zásahom nepovolanej osoby.
                <br />c) Vady spôsobené vyššou mocou (blesk, povodeň, požiar, prepätie v sieti a pod.).
                <br />d) Vady vzniknuté používaním neoriginálneho príslušenstva alebo náhradných dielov.
                <br />e) Softvérové chyby, ktoré nie sú spôsobené výrobnou chybou.
              </p>
              <p>
                11.5. <strong className="text-white">Postup pri reklamácii (predaj):</strong> Reklamáciu je potrebné uplatniť bez zbytočného odkladu po zistení vady, najneskôr do konca záručnej doby, e-mailom na adrese socializea@socializea.com alebo osobne v mieste podnikania. Reklamácia bude vybavená v súlade s platnými právnymi predpismi najneskôr do 30 dní od jej uplatnenia.
              </p>
              <p>
                11.6. <strong className="text-white">Vrátenie tovaru (predaj):</strong> Pri predaji tovaru podnikateľom (B2B) sa právo na odstúpenie od zmluvy bez udania dôvodu (§ 7 zákona č. 102/2014 Z.z.) nevzťahuje. Pri predaji spotrebiteľovi (B2C) má spotrebiteľ právo odstúpiť od zmluvy do 14 dní od prevzatia tovaru v súlade s § 7 a nasl. zákona č. 102/2014 Z.z. o ochrane spotrebiteľa pri predaji tovaru na diaľku. Z tohto práva sú vylúčené veci, ktoré boli upravené podľa požiadaviek spotrebiteľa (napr. špeciálna konfigurácia techniky) a veci, ktoré podliehajú rýchlemu zníženiu hodnoty. V prípade odstúpenia od zmluvy znáša spotrebiteľ náklady na vrátenie tovaru.
              </p>
              <p>
                11.7. Pri predaji v kamenných priestoroch (osobný odber) sa právo na odstúpenie od zmluvy bez udania dôvodu na predaj tovaru v kamenných priestoroch nevzťahuje (§ 7 ods. 6 zákona č. 102/2014 Z.z.).
              </p>

              <h2 className="text-xl font-bold text-white">12. Ochrana osobných údajov (GDPR)</h2>
              <p>
                12.1. Prenajímateľ spracúva osobné údaje Nájomcu/Kupujúceho v súlade s nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 (GDPR) a zákonom č. 18/2018 Z.z. o ochrane osobných údajov.
              </p>
              <p>
                12.2. Účelom spracúvania je uzavretie a plnenie zmluvy, komunikácia súvisiaca s objednávkou, vystavenie daňového dokladu, prípadné uplatnenie právnych nárokov a informovanie o novinkách (len na základe súhlasu).
              </p>
              <p>
                12.3. Osobné údaje sú uchovávané po dobu nevyhnutnú na splnenie účelu spracúvania, najviac však 5 rokov od skončenia zmluvného vzťahu.
              </p>
              <p>
                12.4. Nájomca/Kupujúci má právo na prístup k svojim údajom, na opravu, výmaz, obmedzenie spracúvania, právo namietať a právo na prenosnosť údajov.
              </p>

              <h2 className="text-xl font-bold text-white">13. Riešenie sporov</h2>
              <p>
                13.1. Všetky spory vzniknuté z tohto zmluvného vzťahu sa budú riešiť predovšetkým mimosúdnou cestou – vzájomným rokovaním.
              </p>
              <p>
                13.2. Ak nedôjde k mimosúdnemu vyriešeniu sporu, vec bude predložená na rozhodnutie príslušnému súdu Slovenskej republiky, a to miestne a vecne príslušnému súdu podľa miesta podnikania Prenajímateľa.
              </p>
              <p>
                13.3. Vzťahy medzi zmluvnými stranami sa riadia právnym poriadkom Slovenskej republiky, najmä zákonom č. 513/1991 Zb. (Obchodný zákonník), zákonom č. 40/1964 Zb. (Občiansky zákonník) a zákonom č. 250/2007 Z.z. o ochrane spotrebiteľa (pokiaľ je Nájomca/Kupujúci spotrebiteľom).
              </p>

              <h2 className="text-xl font-bold text-white">14. Záverečné ustanovenia</h2>
              <p>
                14.1. Tieto Podmienky sú platné od 1. 1. 2025 a nahrádzajú všetky predchádzajúce verzie.
              </p>
              <p>
                14.2. Prenajímateľ si vyhradzuje právo jednostranne meniť tieto Podmienky. Zmeny sú účinné dňom ich zverejnenia na webovej stránke socializea.sk. Na už vzniknuté zmluvné vzťahy sa vzťahujú Podmienky platné v čase vzniku zmluvného vzťahu.
              </p>
              <p>
                14.3. Ak sa niektoré ustanovenie týchto Podmienok stane neplatným alebo nevymáhateľným, nedotýka sa to platnosti a vymáhateľnosti ostatných ustanovení. Strany sa zaväzujú nahradiť takéto ustanovenie platným ustanovením, ktoré svojím obsahom a účelom najlepšie zodpovedá pôvodnému.
              </p>
              <p>
                14.4. Tieto Podmienky sú vyhotovené v slovenskom jazyku. V prípade rozporu s prekladom do iného jazyka je rozhodujúce slovenské znenie.
              </p>
              <p>
                14.5. Odoslaním objednávky, rezervácie alebo dopytu Nájomca/Kupujúci potvrdzuje, že si tieto Podmienky prečítal, porozumel im a bez výhrad s nimi súhlasí.
              </p>

              <div className="border-t border-white/5 pt-6 mt-6 text-xs text-gray-500">
                <p>Socializea-audio (Martin Novysedlák) | Čadečka 1924, 022 01 Čadca | Živnosť zapísaná v živnostenskom registri Okresného úradu Čadca</p>
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

export default ObchodnePodmienky;