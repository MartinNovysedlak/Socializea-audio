import React from 'react';
import { ArrowRight, Music, Headphones, Mic2, Radio, Users, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import ContactMap from '@/components/ContactMap';

const Index = () => {
  return (
    <main className="min-h-screen bg-[#020721] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020721]/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Socializea Audio
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-purple-400 transition-colors">Domov</a>
            <a href="#services" className="hover:text-purple-400 transition-colors">Služby</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">Kontakt</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Profesionálny zvuk pre vaše <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">podujatia</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Poskytujeme kompletné audiovizuálne riešenia pre koncerty, konferencie a súkromné akcie. Kvalita, na ktorú sa môžete spoľahnúť.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center">
              Kontaktujte nás <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="#services" className="px-8 py-3 border border-white/20 rounded-full font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center">
              Naše služby
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-[#0a1128]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Naše služby</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Music, title: "Koncerty & Festivaly", desc: "Profesionálne zvukové systémy pre akékoľvek veľké podujatie." },
              { icon: Mic2, title: "Konferencie & Semináre", desc: "Jasný a zrozumiteľný zvuk pre prezentácie a diskusie." },
              { icon: Headphones, title: "Súkromné Akcie", desc: "Dizajnované audio riešenia na mieru pre vaše oslavy." }
            ].map((service, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-colors">
                <service.icon className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users, value: "500+", label: "Spokojných klientov" },
            { icon: Radio, value: "10+", label: "Rokov skúseností" },
            { icon: Clock, value: "24/7", label: "Podpora" },
            { icon: Music, value: "1000+", label: "Vykonaných akcií" }
          ].map((stat, i) => (
            <div key={i} className="p-6">
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-[#0a1128]">
        <div className="container mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Kontaktujte nás</h2>
          <p className="text-gray-300">Máte otázky alebo potrebujete cenovú ponuku? Napíšte nám a ozveme sa vám do 24 hodín.</p>
        </div>
        <ContactForm />
      </section>

      {/* Map Section */}
      <ContactMap />

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Socializea Audio. Všetky práva vyhradené.</p>
          <p className="mt-2 text-sm">Žilina, Slovensko</p>
        </div>
      </footer>
    </main>
  );
};

export default Index;