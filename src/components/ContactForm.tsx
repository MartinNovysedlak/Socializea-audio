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
            {/* ... */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;