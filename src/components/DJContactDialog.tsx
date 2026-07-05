"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, Headphones, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';

const DJContactDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setEventDate("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      toast.error("Prosím vyplňte všetky povinné polia (meno, priezvisko, email a správa)!");
      return;
    }

    setSending(true);

    try {
      const htmlContent = generateEmailHtml('package-question', {
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || 'Neuvedený',
        date: eventDate ? `Dátum akcie: ${eventDate}` : 'Dátum zatiaľ neurčený',
        message,
        packageName: 'DJ-služby',
      });

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        { message_html: htmlContent, title: 'DJ - Kontakt' },
        'hlWKyd9fiWgqJJT3r'
      );

      onOpenChange(false);
      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.error("EmailJS send failed:", error);
      toast.error("Odoslanie zlyhalo. Skúste to prosím neskôr.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <Headphones className="text-[#BD20D3]" size={20} />
              <DialogTitle className="text-xl font-bold text-white">Máte záujem o DJ-a?</DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 text-sm">
              Napíšte nám, pre akú udalosť hľadáte DJ-a a my sa vám ozveme s ponukou.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/20 rounded-full px-3 py-1.5">
              <Headphones size={14} className="text-[#BD20D3] shrink-0" />
              <span className="text-xs text-white font-medium">DJ-služby</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase">Meno *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Napr. Ján"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase">Priezvisko *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Napr. Novák"
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">E-mail *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jan.novak@email.sk"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">Telefón (voliteľný)</label>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+421 901 234 567"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Calendar size={14} className="text-[#BD20D3]" />
                Dátum akcie (voliteľný)
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm [color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-bold uppercase">Vaša správa *</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Popíšte, akú udalosť chystáte, aký typ hudby preferujete a čo by ste si predstavovali..."
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[100px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              disabled={sending}
              className="w-full btn-cyber h-11 rounded-xl font-bold border-none text-sm mt-2"
            >
              {sending ? (
                <><Loader2 size={16} className="mr-2 animate-spin" />Odosiela sa...</>
              ) : (
                "Odoslať dopyt na DJ-a"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-[#BD20D3]" size={32} />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              Ďakujeme!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              Váš dopyt na DJ-služby bol odoslaný. Čoskoro sa vám ozveme s ponukou.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setShowSuccess(false)}
            className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full"
          >
            Zavrieť
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DJContactDialog;