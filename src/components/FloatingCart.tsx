"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import {
  ShoppingBag,
  X,
  Minus,
  Plus,
  Trash2,
  Send,
  Calendar,
  Package,
  Truck,
  ChevronRight,
  ShoppingCart,
  Euro,
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { EquipmentItem } from '@/lib/supabase';

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

interface PackageInCart {
  id: string;
  name: string;
  price: number;
  hasLights: boolean;
  image: string;
  arrival: { name: string } | null;
  install: 'none' | 'install' | 'install_uninstall';
  installPrice: number;
  deliveryPrice: number;
  extras: { id: string; label: string; quantity: number; pricePerDay: number }[];
}

const FloatingCart = ({ quantities, setQuantities, equipment }: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [packagesInCart, setPackagesInCart] = useState<PackageInCart[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateFrom: '',
    dateTo: '',
    message: '',
  });

  const [sending, setSending] = useState(false);

  useEffect(() => {
    const handleAddPackage = (e: CustomEvent<PackageInCart>) => {
      setPackagesInCart(prev => [...prev, e.detail]);
      setIsOpen(true);
      toast.success(`Balík "${e.detail.name}" pridaný do košíka!`);
    };
    window.addEventListener('add-package-to-cart', handleAddPackage as EventListener);
    return () => window.removeEventListener('add-package-to-cart', handleAddPackage as EventListener);
  }, []);

  const cartItems = equipment.filter(item => (quantities[item.id] || 0) > 0);
  const totalItems = cartItems.reduce((sum, item) => sum + (quantities[item.id] || 0), 0);
  const totalPackages = packagesInCart.length;

  const grandTotal = cartItems.reduce((sum, item) => sum + item.price_per_day * (quantities[item.id] || 0), 0);
  const packagesTotal = packagesInCart.reduce((sum, pkg) => sum + pkg.price + pkg.installPrice + pkg.deliveryPrice, 0);

  const days = 1;

  const handleRemoveCartItem = (id: string) => {
    setQuantities(prev => ({ ...prev, [id]: 0 }));
  };

  const handleChangeQuantity = (id: string, delta: number) => {
    const item = equipment.find(i => i.id === id);
    const current = quantities[id] || 0;
    const newQty = Math.max(0, Math.min(item?.available ?? 0, current + delta));
    setQuantities(prev => ({ ...prev, [id]: newQty }));
  };

  const removePackage = (index: number) => {
    setPackagesInCart(prev => prev.filter((_, i) => i !== index));
    toast.success('Balík odstránený z košíka.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Vyplňte meno a email!');
      return;
    }

    setSending(true);
    const toastId = toast.loading('Odosielam rezerváciu...');

    try {
      const cartText = cartItems.map(item =>
        `  • ${item.name} (${quantities[item.id]} ks) – ${(item.price_per_day * (quantities[item.id] || 0)).toFixed(2)} €`
      ).join('\n');

      const packagesText = packagesInCart.map(pkg => {
        const extrasText = pkg.extras.length > 0
          ? `\n    Doplnky: ${pkg.extras.map(e => `${e.label} (${e.quantity} ks)`).join(', ')}`
          : '';
        return `  • ${pkg.name} – ${pkg.price} €${pkg.installPrice > 0 ? ` (inštalácia: +${pkg.installPrice} €)` : ''}${pkg.deliveryPrice > 0 ? ` (doprava: +${pkg.deliveryPrice} €)` : ''}${extrasText}`;
      }).join('\n');

      const servicesText = [
        ...(packagesInCart.some(p => p.install === 'install') ? ['Inštalácia (+20 €)'] : []),
        ...(packagesInCart.some(p => p.install === 'install_uninstall') ? ['Inštalácia a deinštalácia (+40 €)'] : []),
      ].join('\n') || 'Žiadne';

      const deliveryText = packagesInCart
        .filter(p => p.arrival)
        .map(p => `Doprava do ${p.arrival!.name} (${p.deliveryPrice} €)`)
        .join('\n') || 'Osobný odber';

      const summaryHtml = `
        <h3>🎧 Aparatúra</h3>
        <table>
          <thead><tr><th>Položka</th><th>Počet</th><th>Cena/deň</th><th>Spolu</th></tr></thead>
          <tbody>
            ${cartItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${quantities[item.id]}x</td>
                <td>${item.price_per_day.toFixed(2)} €</td>
                <td>${(item.price_per_day * (quantities[item.id] || 0)).toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h3>📦 Balíky</h3>
        ${packagesInCart.map(pkg => `
          <div style="background:rgba(189,32,211,0.05);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:12px 16px;margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <strong>${pkg.name}</strong>
              <span style="color:#BD20D3;font-weight:700;">${pkg.price.toFixed(2)} €</span>
            </div>
            ${pkg.hasLights ? '<span style="display:inline-block;margin-top:6px;padding:3px 10px;background:rgba(189,32,211,0.1);border:1px solid rgba(189,32,211,0.3);border-radius:8px;color:#BD20D3;font-size:11px;font-weight:600;">💡 So svetlami</span>' : ''}
            ${pkg.installPrice > 0 ? `<span style="display:inline-block;margin-top:6px;margin-left:6px;padding:3px 10px;background:rgba(26,75,255,0.1);border:1px solid rgba(26,75,255,0.3);border-radius:8px;color:#1A4BFF;font-size:11px;font-weight:600;">🔧 ${pkg.install === 'install' ? 'Inštalácia (+20 €)' : 'Inštalácia a deinštalácia (+40 €)'}</span>` : ''}
            ${pkg.deliveryPrice > 0 ? `<span style="display:inline-block;margin-top:6px;margin-left:6px;padding:3px 10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;color:#10b981;font-size:11px;font-weight:600;">📍 ${pkg.arrival?.name} (+${pkg.deliveryPrice} €)</span>` : ''}
            ${pkg.extras.length > 0 ? `
              <div style="margin-top:8px;padding:8px 12px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;">
                <div style="color:#9ca3af;font-weight:600;margin-bottom:4px;">Doplnkové produkty:</div>
                ${pkg.extras.map(e => `<div style="display:flex;justify-content:space-between;color:#d1d5db;padding:2px 0;"><span>${e.label}</span><span style="color:#BD20D3;">${(e.pricePerDay * e.quantity).toFixed(2)} €</span></div>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
        <div style="margin-top:20px;padding-top:16px;border-top:2px solid #BD20D3;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:18px;font-weight:700;">Celková suma</span>
          <span style="color:#BD20D3;font-size:24px;font-weight:900;">${(grandTotal + packagesTotal).toFixed(2)} €</span>
        </div>
      `;

      await emailjs.send(
        'service_s8kq87k',
        'template_st0hc2f',
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone || 'Neuvedený',
          date: formData.dateFrom ? `${formData.dateFrom} až ${formData.dateTo}` : 'Neuvedený',
          message: formData.message || '—',
          subject: 'Objednávka z košíka – prenájom aparatúry (socializea.sk/prenajom)',
          cart_summary: summaryHtml,
          cart_text: `Aparatúra:\n${cartText || '  (žiadna)'}\n\nBalíky:\n${packagesText || '  (žiadne)'}\n\nSlužby:\n${servicesText || '  (žiadne)'}\nDoprava:\n${deliveryText || '  (nevybratá)'}\n\nCelková suma: ${(grandTotal + packagesTotal).toFixed(2)} €\nPočet dní: ${days}`,
        },
        'hlWKyd9fiWgqJJT3r'
      );

      toast.dismiss(toastId);
      toast.success('Rezervácia bola odoslaná!', {
        description: 'Budeme vás kontaktovať pre potvrdenie termínu.',
      });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', dateFrom: '', dateTo: '', message: '' });
      setShowForm(false);
      setFormOpen(false);
      setQuantities({});
      setPackagesInCart([]);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Chyba pri odosielaní.', {
        description: 'Skúste neskôr alebo nás kontaktujte telefonicky.',
      });
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const hasItems = totalItems > 0 || totalPackages > 0;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white shadow-lg shadow-[#BD20D3]/30 hover:shadow-[#BD20D3]/50 hover:scale-105 transition-all flex items-center justify-center"
      >
        <ShoppingBag size={22} />
        {hasItems && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-[#BD20D3] text-xs font-bold flex items-center justify-center shadow-md">
            {totalItems + totalPackages}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-[#0a0d1f] border-l border-[#BD20D3]/30 h-full flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-6 h-16 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingCart size={20} className="text-[#BD20D3]" />
                <span className="text-white font-bold text-lg">Košík</span>
                {hasItems && (
                  <span className="text-xs bg-[#BD20D3]/20 text-[#BD20D3] px-2 py-0.5 rounded-full font-bold">
                    {totalItems + totalPackages}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!hasItems && (
                <div className="text-center text-gray-500 py-12">
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Košík je prázdny</p>
                  <p className="text-xs text-gray-600 mt-1">Pridajte si aparatúru alebo balík.</p>
                </div>
              )}

              {cartItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Package size={14} /> Aparatúra
                  </h4>
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.price_per_day.toFixed(2)} € / deň</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleChangeQuantity(item.id, -1)} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-white font-bold text-sm">{quantities[item.id]}</span>
                          <button onClick={() => handleChangeQuantity(item.id, 1)} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-[#BD20D3] font-bold text-sm whitespace-nowrap">{(item.price_per_day * (quantities[item.id] || 0)).toFixed(2)} €</span>
                        <button onClick={() => handleRemoveCartItem(item.id)} className="text-gray-500 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {packagesInCart.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Package size={14} /> Balíky
                  </h4>
                  <div className="space-y-3">
                    {packagesInCart.map((pkg, idx) => (
                      <div key={idx} className="bg-[#BD20D3]/5 border border-[#BD20D3]/20 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{pkg.name}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {pkg.hasLights && <span className="text-[10px] bg-[#BD20D3]/10 text-[#BD20D3] px-2 py-0.5 rounded-full">💡 So svetlami</span>}
                              {pkg.installPrice > 0 && <span className="text-[10px] bg-[#1A4BFF]/10 text-[#1A4BFF] px-2 py-0.5 rounded-full">🔧 +{pkg.installPrice} €</span>}
                              {pkg.deliveryPrice > 0 && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">📍 +{pkg.deliveryPrice} €</span>}
                            </div>
                          </div>
                          <button onClick={() => removePackage(idx)} className="text-gray-500 hover:text-red-400 shrink-0 ml-2">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-[#BD20D3] font-bold">{(pkg.price + pkg.installPrice + pkg.deliveryPrice).toFixed(2)} €</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {hasItems && (
              <div className="border-t border-white/10 p-6 shrink-0 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Celková suma</span>
                  <span className="text-[#BD20D3] text-2xl font-extrabold">{(grandTotal + packagesTotal).toFixed(2)} €</span>
                </div>

                {!showForm ? (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="w-full btn-cyber h-12 rounded-xl font-bold border-none"
                  >
                    <Send size={16} className="mr-2" />
                    Odoslať rezerváciu
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-400 uppercase font-bold">Meno *</Label>
                          <Input
                            type="text"
                            value={formData.firstName}
                            onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                            placeholder="Ján"
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-400 uppercase font-bold">Priezvisko *</Label>
                          <Input
                            type="text"
                            value={formData.lastName}
                            onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                            placeholder="Novák"
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-400 uppercase font-bold">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          placeholder="jan.novak@email.sk"
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-400 uppercase font-bold">Telefón</Label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+421 ..."
                          className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-400 uppercase font-bold">Od</Label>
                          <Input
                            type="date"
                            value={formData.dateFrom}
                            onChange={e => setFormData(p => ({ ...p, dateFrom: e.target.value }))}
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] text-gray-400 uppercase font-bold">Do</Label>
                          <Input
                            type="date"
                            value={formData.dateTo}
                            onChange={e => setFormData(p => ({ ...p, dateTo: e.target.value }))}
                            className="bg-black/50 border-white/10 text-white rounded-xl h-10 text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-gray-400 uppercase font-bold">Poznámka</Label>
                        <Textarea
                          value={formData.message}
                          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                          placeholder="Ďalšie požiadavky..."
                          className="bg-black/50 border-white/10 text-white rounded-xl min-h-[60px] text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForm(false)}
                          className="flex-1 border-white/10 text-white hover:bg-white/5 rounded-xl h-11"
                        >
                          Zrušiť
                        </Button>
                        <Button
                          type="submit"
                          disabled={sending}
                          className="flex-1 btn-cyber rounded-xl h-11 border-none font-bold"
                        >
                          {sending ? 'Odosielam...' : 'Odoslať'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;