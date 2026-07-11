"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, Headphones, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import { generateEmailHtml } from '@/utils/emailTemplates';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { startOfDay } from "date-fns";
import "react-day-picker/dist/style.css";
import { useDialogContext } from '@/contexts/DialogContext';

const DJContactDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { setDialogOpen } = useDialogContext();

  useEffect(() => {
    setDialogOpen(open || showSuccess);
  }, [open, showSuccess, setDialogOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setEventDate(format(date, "dd.MM.yyyy"));
      setShowCalendar(false);
    }
  };

  return (
    <>
      <style>{`
        .dj-datepicker .rdp {
          --rdp-cell-size: 28px;
          --rdp-accent-color: #BD20D3;
          --rdp-background-color: rgba(189, 32, 211, 0.1);
          --rdp-accent-color-dark: #BD20D3;
          --rdp-background-color-dark: rgba(189, 32, 211, 0.2);
          --rdp-outline: 2px solid #BD20D3;
          --rdp-outline-selected: 2px solid #BD20D3;
          margin: 0;
        }
        .dj-datepicker .rdp-months { justify-content: center; }
        .dj-datepicker .rdp-month {
          background: rgba(10, 13, 31, 0.98);
          border: 1px solid rgba(189, 32, 211, 0.4);
          border-radius: 12px;
          padding: 6px;
        }
        .dj-datepicker .rdp-caption { color: white; font-weight: 700; font-size: 12px; padding: 0 0 4px 0; }
        .dj-datepicker .rdp-head_cell { color: #9ca3af; font-size: 9px; font-weight: 600; padding: 2px 0; }
        .dj-datepicker .rdp-day {
          color: #e5e7eb; border-radius: 4px; font-size: 11px; width: 28px; height: 28px; padding: 0;
        }
        .dj-datepicker .rdp-day:hover:not(.rdp-day_selected) { background: rgba(189, 32, 211, 0.2) !important; color: white !important; }
        .dj-datepicker .rdp-day_selected { background: #BD20D3 !important; color: white !important; font-weight: 700; }
        .dj-datepicker .rdp-day_today { border: 1px solid #BD20D3; font-weight: 700; }
        .dj-datepicker .rdp-day_outside { opacity: 0.3; }
        .dj-datepicker .rdp-nav_button { color: #9ca3af; border-radius: 4px; width: 24px; height: 24px; }
        .dj-datepicker .rdp-nav_button:hover { background: rgba(189, 32, 211, 0.2) !important; color: white !important; }
        .dj-datepicker .rdp-caption_dropdowns { gap: 2px; }
        .dj-datepicker .rdp-dropdown {
          background: rgba(189, 32, 211, 0.1);
          border: 1px solid rgba(189, 32, 211, 0.3);
          border-radius: 4px;
          color: white;
          font-size: 10px;
          padding: 1px 3px;
        }
        .dj-datepicker .rdp-dropdown:focus { outline: none; border-color: #BD20D3; }
        .dj-datepicker .rdp-vhidden { display: none; }
        .dj-datepicker .rdp-table { border-collapse: collapse; margin: 0; }
        .dj-datepicker .rdp-row { margin: 0; }
        .dj-datepicker .rdp-head_row { height: 20px; }
        .dj-datepicker .rdp-tbody { border: none; }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white rounded-3xl max-w-md max-h-[90vh] overflow-y-auto p-6 custom-scrollbar">
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
                  autoComplete="given-name"
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
                  autoComplete="family-name"
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
                autoComplete="email"
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

            <div className="space-y-1.5 relative dj-datepicker" ref={calendarRef}>
              <label className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5">
                <Calendar size={14} className="text-[#BD20D3]" />
                Dátum akcie (voliteľný)
              </label>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  placeholder="Vyberte dátum"
                  value={eventDate}
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="bg-black/40 border border-white/10 text-white rounded-xl h-11 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm cursor-pointer"
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] pointer-events-none" />
              </div>
              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 rounded-xl dj-datepicker">
                  <DayPicker
                    mode="single"
                    locale={sk}
                    selected={eventDate ? (() => {
                      const [d, m, y] = eventDate.split('.');
                      return new Date(Number(y), Number(m) - 1, Number(d));
                    })() : undefined}
                    onSelect={handleDateSelect}
                    disabled={[{ before: startOfDay(new Date()) }]}
                    weekStartsOn={1}
                    initialFocus={showCalendar}
                  />
                </div>
              )}
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