"use client";

import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { faqService, FAQItem } from '@/lib/faqService';

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      const data = await faqService.getAll();
      setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-transparent relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="h-8 w-64 mx-auto rounded-lg bg-white/10 animate-pulse mb-8" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) return null;

  return (
    <section className="py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/30 text-[#BD20D3] text-xs font-bold uppercase tracking-widest mb-4">
                  <HelpCircle size={14} />
                  <span>Pomocník</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Často kladené otázky</h2>
                <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
                  Rýchle odpovede na najčastejšie otázky o prenájme techniky.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="bg-white/5 border border-white/10 rounded-2xl px-6 transition-all data-[state=open]:border-[#BD20D3]/30 data-[state=open]:bg-[#BD20D3]/5"
                  >
                    <AccordionTrigger className="text-white font-semibold text-left hover:text-[#BD20D3] transition-colors py-5 [&[data-state=open]>svg]:rotate-180 text-base">
                      <span className="pr-8">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed pb-5 text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;