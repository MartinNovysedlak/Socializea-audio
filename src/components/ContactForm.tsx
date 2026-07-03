"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Meno musí mať aspoň 2 znaky." }),
  email: z.string().email({ message: "Zadajte platný email." }),
  phone: z.string().min(10, { message: "Zadajte platné telefónne číslo." }),
  date: z.string().optional(),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov." }),
});

const ContactForm = () => {
  const [sending, setSending] = useState(false);
  
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    const toastId = toast.loading('Odosielam dopyt...');

    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d1f; color: white; border-radius: 16px; overflow: hidden; border: 1px solid rgba(189,32,211,0.3);">
          <div style="padding: 24px; background: linear-gradient(135deg, #BD20D3, #1A4BFF);">
            <h1 style="margin: 0; font-size: 20px; color: white;">📬 Nový kontaktný dopyt</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600; width: 120px;">Meno:</td>
                <td style="padding: 8px 12px; color: white; font-weight: 700;">${values.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Email:</td>
                <td style="padding: 8px 12px; color: white;">${values.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Telefón:</td>
                <td style="padding: 8px 12px; color: white;">${values.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Dátum:</td>
                <td style="padding: 8px 12px; color: white;">${values.date || 'Neuvedený'}</td>
              </tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-weight: 600; font-size: 12px; text-transform: uppercase;">Správa:</p>
              <p style="margin: 0; color: #d1d5db; white-space: pre-wrap;">${values.message}</p>
            </div>
          </div>
          <div style="padding: 12px 24px; background: rgba(0,0,0,0.2); text-align: center; font-size: 11px; color: #6b7280;">
            Odoslané z webu Socializea Audio
          </div>
        </div>
      `;

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'socializea@socializea.com',
          subject: `📬 Nový dopyt z webu – ${values.name}`,
          html,
        },
      });

      if (error) throw error;

      toast.dismiss(toastId);
      toast.success('Dopyt bol úspešne odoslaný!', {
        description: 'Budeme vás kontaktovať v čo najkratšom čase.',
      });
      form.reset();
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Nepodarilo sa odoslať dopyt.', {
        description: 'Skúste to prosím neskôr alebo nás kontaktujte telefonicky.',
      });
      console.error('Send email error:', error);
    } finally {
      setSending(false);
    }
  }

  return (
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
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-2">Kde nás nájdete</p>
                        <div className="space-y-3">
                          <div>
                            <p className="text-[#BD20D3] font-bold text-sm uppercase tracking-wider mb-1">Hlavný sklad a sídlo</p>
                            <p className="text-white text-lg leading-snug">Čadečka 1924</p>
                            <p className="text-gray-400 text-sm">022 01 Čadca, Slovensko</p>
                          </div>
                          <div className="border-t border-white/5 pt-3">
                            <p className="text-[#1A4BFF] font-bold text-sm uppercase tracking-wider mb-1">Odberné miesto</p>
                            <p className="text-white text-lg leading-snug">Vysokoškolská 4, Budova SADOP</p>
                            <p className="text-gray-400 text-sm">010 01 Žilina, Slovensko</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 p-6 md:p-8 md:p-10 rounded-3xl backdrop-blur-sm">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Meno a priezvisko</FormLabel>
                              <FormControl>
                                <Input placeholder="Ján Novák" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jan@priklad.sk" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <FormItem>
                              <FormLabel className="text-gray-300">
                                Dátum podujatia
                                <span className="text-gray-500 font-normal ml-1">(nepovinné)</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-[#BD20D3]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Vaša správa</FormLabel>
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
                        disabled={sending}
                        className="w-full btn-cyber h-auto min-h-12 py-3 px-4 rounded-xl text-sm sm:text-base font-bold group border-none whitespace-normal"
                      >
                        {sending ? (
                          <span>Odosielam...</span>
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
  );
};

export default ContactForm;