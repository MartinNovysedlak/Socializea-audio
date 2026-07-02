"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Meno musí mať aspoň 2 znaky." }),
  email: z.string().email({ message: "Zadajte platný email." }),
  phone: z.string().min(10, { message: "Zadajte platné telefónne číslo." }),
  date: z.string().min(1, { message: "Vyberte dátum podujatia." }),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov." }),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Dopyt bol úspešne odoslaný!", {
      description: "Budeme vás kontaktovať v čo najkratšom čase.",
    });
    form.reset();
  }

  return (
    <section id="kontakt" className="py-8 md:py-12 bg-transparent relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
            
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
              
                <div className="space-y-6 md:space-y-10">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Rezervujte si termín v Žiline alebo Čadci</h1>
                    <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                      Máte otázky ohľadom prenájmu aparatúry v Čadci alebo v Žiline? Vyplňte formulár a my vám pripravíme nezáväznú cenovú ponuku na mieru. Pôsobíme v celom Kysuckom regióne. Zavolajte alebo napíšte a my sa vám ozveme.
                    </p>
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] shrink-0">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-bold">Zavolajte nám</p>
                        <p className="text-white text-sm md:text-lg">+421 948 070 577</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] shrink-0">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-bold">Napíšte nám</p>
                        <p className="text-white text-sm md:text-lg">socializea@socializea.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] shrink-0 mt-1">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider font-bold mb-1 md:mb-2">Kde nás nájdete</p>
                        <div className="space-y-2 md:space-y-3">
                          <div>
                            <p className="text-[#BD20D3] font-bold text-[10px] md:text-sm uppercase tracking-wider mb-1">Hlavný sklad a sídlo – Čadca</p>
                            <p className="text-white text-sm md:text-lg leading-snug">Čadečka 1924</p>
                            <p className="text-gray-400 text-xs md:text-sm">022 01 Čadca, Slovensko</p>
                          </div>
                          <div className="border-t border-white/5 pt-2 md:pt-3">
                            <p className="text-[#1A4BFF] font-bold text-[10px] md:text-sm uppercase tracking-wider mb-1">Odberné miesto – Žilina</p>
                            <p className="text-white text-sm md:text-lg leading-snug">Vysokoškolská 4, Budova SADOP</p>
                            <p className="text-gray-400 text-xs md:text-sm">010 01 Žilina, Slovensko</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 p-5 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl backdrop-blur-sm">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300 text-xs md:text-sm">Meno a priezvisko</FormLabel>
                              <FormControl>
                                <Input placeholder="Ján Novák" {...field} className="bg-black/50 border-white/10 text-white h-10 md:h-12 rounded-xl focus:ring-[#BD20D3] text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300 text-xs md:text-sm">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jan@priklad.sk" {...field} className="bg-black/50 border-white/10 text-white h-10 md:h-12 rounded-xl focus:ring-[#BD20D3] text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300 text-xs md:text-sm">Telefón</FormLabel>
                              <FormControl>
                                <Input placeholder="+421 ..." {...field} className="bg-black/50 border-white/10 text-white h-10 md:h-12 rounded-xl focus:ring-[#BD20D3] text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300 text-xs md:text-sm">Dátum podujatia</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="bg-black/50 border-white/10 text-white h-10 md:h-12 rounded-xl focus:ring-[#BD20D3] text-sm [color-scheme:dark]" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 text-xs md:text-sm">Vaša správa</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Mám záujem o prenájom ozvučenia v Čadci na oslavu..." 
                                className="bg-black/50 border-white/10 text-white min-h-[100px] md:min-h-[120px] rounded-xl focus:ring-[#BD20D3] text-sm" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full btn-cyber h-11 md:h-14 rounded-xl text-sm md:text-lg font-bold group border-none">
                        Odoslať nezáväzný dopyt
                        <Send className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Button>
                    </form>
                  </Form>
                </div>

              </div>
            </div>
            
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-[#1A4BFF]/40 to-transparent rounded-tl rounded-tr" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;