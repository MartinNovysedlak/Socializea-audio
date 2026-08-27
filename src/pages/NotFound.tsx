import { Link } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Volume2, ShoppingBag, Phone } from "lucide-react";

const NotFound = () => {
  return (
    <>
      <SeoHead
        path="/"
        title="Stránka nenájdená (404) | Socializea Audio"
        description="Stránka, ktorú hľadáte, nebola nájdená. Vráťte sa na prenájom, predaj alebo kontakt Socializea Audio."
        noindex
      />

      <main className="min-h-screen bg-[#020721] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
          <div className="max-w-lg w-full text-center space-y-6">
            <p className="text-[#BD20D3] text-sm font-bold uppercase tracking-[0.3em]">Chyba 404</p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white">Stránka sa nenašla</h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Adresa neexistuje alebo bola presunutá. Pokračujte na prenájom, predaj alebo nám napíšte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="btn-cyber border-none rounded-xl h-12 px-6">
                <Link to="/">
                  <Home size={16} className="mr-2" />
                  Domov
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5 rounded-xl h-12 px-6">
                <Link to="/prenajom">
                  <Volume2 size={16} className="mr-2" />
                  Prenájom
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/15 text-white hover:bg-white/5 rounded-xl h-12 px-6">
                <Link to="/predaj">
                  <ShoppingBag size={16} className="mr-2" />
                  Predaj
                </Link>
              </Button>
            </div>
            <Link to="/kontakt" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <Phone size={14} className="text-[#BD20D3]" />
              Kontaktovať nás
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
};

export default NotFound;
