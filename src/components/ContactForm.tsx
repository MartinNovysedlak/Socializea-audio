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
import { Send, Phone, Mail, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { sk } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Krstné meno musí mať aspoň 2 znaky." }),
  lastName: z.string().min(2, { message: "Priezvisko musí mať aspoň 2 znaky." }),
  email: z.string().email({ message: "Zadajte platný email." }),
  phone: z.string().min(10, { message: "Zadajte platné telefónne číslo." }),
  date: z.date().optional(),
  message: z.string().min(10, { message: "Správa musí mať aspoň 10 znakov." }),
});

function formatDate(date: Date | undefined): string {
  if (!date) return "Neuvedené";
  return format(date, 'dd.MM.yyyy');
}

const ContactForm = () => {
  const [sending, setSending] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: undefined,
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    const toastId = toast.loading('Odosielam dopyt...');

    const formattedDate = values.date ? formatDate(values.date) : 'Neuvedené';
    const fullName = `${values.firstName} ${values.lastName}`;

    const bodyData = {
      customerName: fullName,
      customerEmail: values.email,
      customerPhone: values.phone,
      selectedPackage: values.date ? `Dátum: ${formattedDate}` : 'Neuvedený',
      eventDate: formattedDate,
      message: values.message,
    };

    console.log('Odosielané dáta do Edge Function:', bodyData);

    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: bodyData,
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
      <style>{`
        .rdp {
          --rdp-cell-size: 28px;
          --rdp-accent-color: #BD20D3;
          --rdp-background-color: rgba(189, 32, 211, 0.1);
          --rdp-accent-color-dark: #BD20D3;
          --rdp-background-color-dark: rgba(189, 32, 211, 0.2);
          --rdp-outline: 2px solid #BD20D3;
          --rdp-outline-selected: 2px solid #BD20D3;
          margin: 0;
        }
        .rdp-months { justify-content: center; }
        .rdp-month {
          background: rgba(10, 13, 31, 0.98);
          border: 1px solid rgba(189, 32, 211, 0.4);
          border-radius: 12px;
          padding: 6px;
        }
        .rdp-caption {
          color: white;
          font-weight: 700;
          font-size: 12px;
          padding: 0 0 4px 0;
        }
        .rdp-head_cell {
          color: #9ca3af;
          font-size: 9px;
          font-weight: 600;
          padding: 2px 0;
        }
        .rdp-day {
          color: #e5e7eb;
          border-radius: 4px;
          font-size: 11px;
          width: 28px;
          height: 28px;
          padding: 0;
        }
        .rdp-day:hover:not(.rdp-day_selected) {
          background: rgba(189, 32, 211, 0.2) !important;
          color: white !important;
        }
        .rdp-day_selected {
          background: #BD20D3 !important;
          color: white !important;
          font-weight: 700;
        }
        .rdp-day_today { border: 1px solid #BD20D3; font-weight: 700; }
        .rdp-day_outside { opacity: 0.3; }
        .rdp-nav_button {
          color: #9ca3af;
          border-radius: 4px;
          width: 24px;
          height: 24px;
        }
        .rdp-nav_button:hover {
          background: rgba(189, 32, 211, 0.2) !important;
          color: white !important;
        }
        .rdp-caption_dropdowns { gap: 2px; }
        .rdp-dropdown {
          background: rgba(189, 32, 211, 0.1);
          border: 1px solid rgba(189, 32, 211, 0.3);
          border-radius: 4px;
          color: white;
          font-size: 10px;
          padding: 1px 3px;
        }
        .rdp-dropdown:focus { outline: none; border-color: #BD20D3; }
        .rdp-vhidden { display: none; }
        .rdp-table { border-collapse: collapse; margin: 0; }
        .rdp-row { margin: 0; }
        .rdp-head_row { height: 20px; }
        .rdp-tbody { border: none; }
        @media (max-width: 640px) {
          .rdp { --rdp-cell-size: 24px; }
          .rdp-day { width: 24px; height: 24px; font-size: 10px; }
          .rdp-month { padding: 4px; }
          .rdp-caption { font-size: 11px; }
          .rdp-nav_button { width: 20px; height: 20px; }
        }
      `}</style>
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
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Krstné meno *</FormLabel>
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
                              <FormLabel className="text-gray-300">Priezvisko *</FormLabel>
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
                            <FormLabel className="text-gray-300">Email</FormLabel>
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
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Dátum podujatia
                              <span className="text-gray-500 font-normal ml-1">(nepovinné)</span>
                            </FormLabel>
                            <Popover open={dateOpen} onOpenChange={setDateOpen}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "h-12 rounded-xl border-white/10 bg-black/50 text-white hover:bg-black/60 hover:text-white w-full justify-start text-left font-normal",
                                      !field.value && "text-gray-500"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                                    {field.value ? format(field.value, 'dd.MM.yyyy') : <span>Vyberte dátum</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 border-[#BD20D3]/20 bg-transparent shadow-none" align="start">
                                <DayPicker
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    setDateOpen(false);
                                  }}
                                  locale={sk}
                                  fromDate={new Date()}
                                  className="rdp"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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