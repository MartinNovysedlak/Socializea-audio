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
    <section id="kontakt" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="space-y-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Rezervujte si termín</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Máte otázky alebo si chcete overiť dostupnosť techniky? Vyplňte formulár a my vám pripravíme nezáväznú cenovú ponuku na mieru.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Zavolajte nám</p>
                    <p className="text-white text-lg">+421 900 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Napíšte nám</p>
                    <p className="text-white text-lg">info@socializea-audio.sk</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Kde nás nájdete</p>
                    <p className="text-white text-lg">Bratislava, Slovensko</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-sm">
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
                            <Input placeholder="Ján Novák" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500" />
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
                            <Input placeholder="jan@priklad.sk" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500" />
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
                            <Input placeholder="+421 ..." {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500" />
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
                          <FormLabel className="text-gray-300">Dátum podujatia</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-blue-500" />
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
                            className="bg-black/50 border-white/10 text-white min-h-[120px] rounded-xl focus:ring-blue-500" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl text-lg font-bold group">
                    Odoslať nezáväzný dopyt
                    <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </form>
              </Form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;