"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { Send, Phone, Mail, MapPin, Calendar, Warehouse, Store, CheckCircle2, Loader2 } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "Zadajte meno." }),
  lastName: z.string().min(1, { message: "Zadajte priezvisko." }),
  email: z.string().email({ message: "Zadajte platný email." }),
  phone: z.string().min(10, { message: "Zadajte platné telefónne číslo." }).optional().or(z.literal('')),
  date: z.string().optional(),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov." }),
});

const ContactForm = () => {
  const [showDateCalendar, setShowDateCalendar] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      message: "",
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowDateCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_s8kq87k',
        'template_zh6cnks',
        {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          phone: values.phone || 'Neuvedený',
          date: values.date || 'Neuvedený',
          message: values.message,
        },
        'hlWKyd9fiWgqJJT3r'
      );

      setSubmitted(true);
      form.reset();
    } catch (error) {
      toast.error('Nepodarilo sa odoslať dopyt.', {
        description: 'Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
      });
      console.error('EmailJS error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      form.setValue('date', format(date, "dd.MM.yyyy"));
      setShowDateCalendar(false);
    }
  };

  return (
    <>
      <section id="kontakt" className="py-12 bg-transparent relative">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#020721] via-[#0a0d1f] to-[#020721] border border-[#BD20D3]/20 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#BD20D3]/40 to-transparent rounded-bl rounded-br" />
              
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Rezervujte si termín</h2>
                      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                        Máte otázky alebo si chcete overiť dostupnosť techniky? Vyplňte formulár a my vám pripravíme nezáväznú cenovú ponuku na mieru.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] shrink-0">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Zavolajte nám</p>
                          <p className="text-white text-lg">+421 948 070 577</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] shrink-0">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Napíšte nám</p>
                          <p className="text-white text-lg">socializea@socializea.com</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#BD20D3]/10 border border-[#BD20D3]/20 flex items-center justify-center text-[#BD20D3] mt-1 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-4 mt-1">Kde nás nájdete</p>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Warehouse size={18} className="text-[#BD20D3] mt-1 shrink-0" />
                              <div>
                                <p className="text-[#BD20D3] font-bold text-sm uppercase tracking-wider mb-1">Hlavný sklad a sídlo</p>
                                <p className="text-white text-lg leading-snug">Čadečka 1924</p>
                                <p className="text-gray-400 text-sm">022 01 Čadca, Slovensko</p>
                              </div>
                            </div>
                            <div className="border-t border-white/5 pt-4">
                              <div className="flex items-start gap-3">
                                <Store size={18} className="text-[#1A4BFF] mt-1 shrink-0" />
                                <div>
                                  <p className="text-[#1A4BFF] font-bold text-sm uppercase tracking-wider mb-1">Odberné miesto</p>
                                  <p className="text-white text-lg leading-snug">Vysokoškolská 4, Budova SADOP</p>
                                  <p className="text-gray-400 text-sm">010 01 Žilina, Slovensko</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 border border-white/10 p-6 md:p-8 md:p-10 rounded-3xl backdrop-blur-sm">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  Meno <span className="text-red-400">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Ján" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">
                                  Priezvisko <span className="text-red-400">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Novák" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">
                                Email <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="jan@priklad.sk" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Telefón</FormLabel>
                              <FormControl>
                                <Input placeholder="+421 ..." {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="relative" ref={calendarRef}>
                              <FormLabel className="text-gray-300">
                                Dátum podujatia
                                <span className="text-gray-500 font-normal ml-1">(nepovinné)</span>
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type="text"
                                    readOnly
                                    placeholder="Vyberte dátum"
                                    value={field.value || ""}
                                    onClick={() => setShowDateCalendar(!showDateCalendar)}
                                    className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3] cursor-pointer pr-10"
                                  />
                                </FormControl>
                                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
                              </div>
                              {showDateCalendar && (
                                <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl">
                                  <DayPicker
                                    mode="single"
                                    selected={field.value ? (() => {
                                      const [d, m, y] = field.value.split('.');
                                      return new Date(Number(y), Number(m) - 1, Number(d));
                                    })() : undefined}
                                    onSelect={handleDateSelect}
                                    disabled={[{ before: startOfDay(new Date()) }]}
                                    weekStartsOn={1}
                                    initialFocus={showDateCalendar}
                                  />
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">
                                Vaša správa <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Napíšte nám viac o vašom podujatí..." 
                                  className="bg-black/50 border-white/10 text-white min-h-[120px] rounded-xl focus:ring-[#BD20D3]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full btn-cyber h-auto min-h-12 py-3 px-4 rounded-xl text-sm sm:text-base font-bold group border-none whitespace-normal"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              <span>Odosiela sa...</span>
                            </>
                          ) : (
                            <>
                              <span>Odoslať nezáväzný dopyt</span>
                              <Send className="ml-2 w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
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

      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-green-400" size={32} />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              Ďakujeme za vašu otázku!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              Vašu otázku sme úspešne prijali. Budeme sa jej venovať a čo najskôr vás budeme kontaktovať.
            </DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setSubmitted(false)}
            className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full"
          >
            Zavrieť
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactForm;