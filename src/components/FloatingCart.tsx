"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  Package,
  Volume2,
  Lightbulb,
  MapPin,
  Wrench,
  Euro,
  Send,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { EquipmentItem } from "@/lib/supabase";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { generateEmailHtml } from "@/utils/emailTemplates";
import {
  computeAllPackagesUsedCounts,
  saveUsedCountsToStorage,
  loadUsedCountsFromStorage,
  getAvailableCount,
  PackageCartItem,
} from "@/utils/packageItemUtils";
import MapPicker from "./MapPicker";

const CART_STORAGE_KEY = "cyber_cart_quantities";
const PACKAGE_STORAGE_KEY = "cyber_cart_packages";

interface FloatingCartProps {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  equipment: EquipmentItem[];
}

const dispatchCartUpdate = () => {
  try {
    window.dispatchEvent(new CustomEvent("cart-updated"));
  } catch {}
};

const FloatingCart = ({
  quantities,
  setQuantities,
  equipment,
}: FloatingCartProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [packageItems, setPackageItems] = useState<PackageCartItem[]>([]);
  const [usedFromPackages, setUsedFromPackages] = useState<
    Record<string, number>
  >({});

  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [reservationFirstName, setReservationFirstName] = useState("");
  const [reservationLastName, setReservationLastName] = useState("");
  const [reservationEmail, setReservationEmail] = useState("");
  const [reservationPhone, setReservationPhone] = useState("");
  const [reservationMessage, setReservationMessage] = useState("");
  const [sendingReservation, setSendingReservation] = useState(false);
  const [showReservationSuccess, setShowReservationSuccess] = useState(false);

  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(
    new Set()
  );
  const [showSummary, setShowSummary] = useState(true);

  const cartRef = useRef<HTMLDivElement>(null);

  const packageItemsStringRef = useRef("");

  // Load packages from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PACKAGE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPackageItems(parsed);
        }
      }
    } catch {}
  }, []);

  // Save packages to localStorage and update used counts
  useEffect(() => {
    const serialized = JSON.stringify(packageItems);
    if (serialized === packageItemsStringRef.current) return;
    packageItemsStringRef.current = serialized;

    try {
      localStorage.setItem(PACKAGE_STORAGE_KEY, serialized);
      const used = computeAllPackagesUsedCounts(packageItems);
      saveUsedCountsToStorage(used);
      setUsedFromPackages(used);
      dispatchCartUpdate();
    } catch {}
  }, [packageItems]);

  // Listen for add-package-to-cart event
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as PackageCartItem;
      if (detail) {
        setPackageItems((prev) => [...prev, detail]);
        setIsOpen(true);
        toast.success(`Balík "${detail.name}" bol pridaný do košíka!`);
      }
    };
    window.addEventListener("add-package-to-cart", handler);
    return () => window.removeEventListener("add-package-to-cart", handler);
  }, []);

  // Listen for open-floating-cart event
  useEffect(() => {
    const handler = () => setIsOpen((prev) => !prev);
    window.addEventListener("open-floating-cart", handler);
    return () => window.removeEventListener("open-floating-cart", handler);
  }, []);

  const cartItemIds = Object.keys(quantities).filter((id) => quantities[id] > 0);
  const cartItems = cartItemIds
    .map((id) => {
      const item = equipment.find((e) => e.id === id);
      if (!item) return null;
      return { item, quantity: quantities[id] };
    })
    .filter(Boolean) as { item: EquipmentItem; quantity: number }[];

  const totalCartPrice = cartItems.reduce(
    (sum, { item, quantity }) => sum + item.price_per_day * quantity,
    0
  );

  const totalPackagesPrice = packageItems.reduce(
    (sum, pkg) =>
      sum + pkg.price + pkg.installPrice + pkg.deliveryPrice,
    0
  );

  // Total price of package extras
  const totalExtrasPrice = packageItems.reduce((sum, pkg) => {
    const extrasTotal = (pkg.extras || []).reduce(
      (eSum, e) => eSum + e.pricePerDay * e.quantity,
      0
    );
    return sum + extrasTotal;
  }, 0);

  const grandTotal =
    totalCartPrice + totalPackagesPrice + totalExtrasPrice;

  const removeItem = (id: string) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    dispatchCartUpdate();
  };

  const removePackage = (id: string) => {
    setPackageItems((prev) => prev.filter((p) => p.id !== id));
    toast.success("Balík odstránený z košíka.");
  };

  const clearCart = () => {
    if (
      cartItems.length === 0 &&
      packageItems.length === 0
    )
      return;
    setQuantities({});
    setPackageItems([]);
    localStorage.removeItem(PACKAGE_STORAGE_KEY);
    localStorage.removeItem("cyber_cart_package_used_counts");
    dispatchCartUpdate();
    toast.success("Košík vyprázdnený.");
  };

  const togglePackageExpand = (id: string) => {
    setExpandedPackages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !reservationFirstName.trim() ||
      !reservationLastName.trim() ||
      !reservationEmail.trim()
    ) {
      toast.error(
        "Prosím vyplňte meno, priezvisko a email!"
      );
      return;
    }

    setSendingReservation(true);

    try {
      // Build cart summary HTML
      let cartHtml = "";
      if (cartItems.length > 0) {
        cartHtml +=
          '<div style="margin-bottom:12px;padding:8px 12px;background:rgba(0,0,0,0.3);border-radius:12px;">';
        cartHtml +=
          '<p style="font-weight:700;color:#BD20D3;margin:0 0 8px 0;font-size:13px;">📦 Jednotlivé položky:</p>';
        cartHtml += `<table style="width:100%;border-collapse:collapse;font-size:12px;">`;
        cartItems.forEach(({ item, quantity }) => {
          cartHtml += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
            <td style="padding:6px 0;color:#e5e7eb;">${item.name}</td>
            <td style="padding:6px 0;text-align:center;color:#9ca3af;">${quantity} ks</td>
            <td style="padding:6px 0;text-align:right;color:#BD20D3;font-weight:700;">${(
              item.price_per_day * quantity
            ).toFixed(2)} €</td>
          </tr>`;
        });
        cartHtml += `</table>`;
        cartHtml += `</div>`;
      }

      if (packageItems.length > 0) {
        cartHtml +=
          '<div style="padding:8px 12px;background:rgba(0,0,0,0.3);border-radius:12px;">';
        cartHtml +=
          '<p style="font-weight:700;color:#1A4BFF;margin:0 0 8px 0;font-size:13px;">🎯 Balíky:</p>';
        packageItems.forEach((pkg) => {
          const pkgTotal =
            pkg.price +
            pkg.installPrice +
            pkg.deliveryPrice +
            (pkg.extras || []).reduce(
              (s, e) => s + e.pricePerDay * e.quantity,
              0
            );
          cartHtml += `<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <p style="font-weight:700;color:white;margin:0;font-size:12px;">${pkg.name}</p>
                <p style="color:#9ca3af;margin:2px 0 0 0;font-size:11px;">${pkg.hasLights ? "So svetlami" : "Bez svetiel"}</p>
              </div>
              <p style="color:#BD20D3;font-weight:700;margin:0;font-size:13px;">${pkgTotal.toFixed(2)} €</p>
            </div>
            ${pkg.arrival ? `<p style="color:#9ca3af;margin:4px 0 0 0;font-size:10px;">📍 Doručenie: ${pkg.arrival.name}</p>` : ""}
            ${pkg.install !== "none" ? `<p style="color:#9ca3af;margin:2px 0 0 0;font-size:10px;">🔧 ${pkg.install === "install" ? "Inštalácia" : "Inštalácia + deinštalácia"}</p>` : ""}
          </div>`;
        });
        cartHtml += `</div>`;
      }

      cartHtml += `<div style="padding:8px 12px;margin-top:8px;border-top:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;">
        <span style="font-weight:800;color:white;font-size:14px;">CELKOVÁ CENA:</span>
        <span style="font-weight:900;color:#BD20D3;font-size:16px;">${grandTotal.toFixed(2)} €</span>
      </div>`;

      const htmlContent = generateEmailHtml("rezervacia", {
        name: `${reservationFirstName} ${reservationLastName}`,
        email: reservationEmail,
        phone: reservationPhone || "Neuvedený",
        date: "Rezervácia cez web",
        message: reservationMessage,
        cartSummaryHtml: cartHtml,
        totalPrice: grandTotal,
        days: 1,
      });

      await emailjs.send(
        "service_s8kq87k",
        "template_st0hc2f",
        { message_html: htmlContent, title: "Nová rezervácia" },
        "hlWKyd9fiWgqJJT3r"
      );

      setReservationDialogOpen(false);
      setShowReservationSuccess(true);

      setReservationFirstName("");
      setReservationLastName("");
      setReservationEmail("");
      setReservationPhone("");
      setReservationMessage("");
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("Odoslanie rezervácie zlyhalo. Skúste prosím neskôr.");
    } finally {
      setSendingReservation(false);
    }
  };

  const totalItemCount =
    cartItems.reduce((sum, { quantity }) => sum + quantity, 0) +
    packageItems.length +
    packageItems.reduce(
      (sum, pkg) =>
        sum + (pkg.extras || []).reduce((s, e) => s + e.quantity, 0),
      0
    );

  if (totalItemCount === 0) return null;

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#BD20D3] border-2 border-[#BD20D3]/60 shadow-[0_0_20px_rgba(189,32,211,0.5)] flex items-center justify-center text-white hover:scale-110 transition-all duration-300 active:scale-95"
        aria-label="Otvoriť košík"
      >
        <ShoppingBag size={22} />
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-[#020721]">
          {totalItemCount > 9 ? "9+" : totalItemCount}
        </span>
      </button>

      {/* Cart panel */}
      <div
        className={`fixed top-0 right-0 z-[9999] h-full w-full max-w-md bg-[#0e122b] border-l border-[#BD20D3]/30 shadow-2xl shadow-black/50 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-[#BD20D3]" />
              <h2 className="text-lg font-bold text-white">Košík</h2>
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                {totalItemCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {totalItemCount > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
                >
                  Vyčistiť
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Cart content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {cartItems.length === 0 && packageItems.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <Package size={40} className="mx-auto mb-3 text-gray-600" />
                <p>Košík je prázdny</p>
              </div>
            )}

            {/* Individual items */}
            {cartItems.map(({ item, quantity }) => {
              const displayImage =
                item.main_image ||
                (item.images && item.images[0]) ||
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100";

              return (
                <div
                  key={item.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 relative group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-800">
                    <img
                      src={displayImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.price_per_day} € / deň × {quantity} ks
                    </p>
                    <p className="text-[#BD20D3] font-bold text-sm mt-1">
                      {(item.price_per_day * quantity).toFixed(2)} €
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={11} />
                  </button>
                  <div className="flex items-center gap-1.5 self-end shrink-0">
                    <button
                      onClick={() => {
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
                        }));
                        dispatchCartUpdate();
                      }}
                      className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-white font-medium text-xs w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        const maxAllowed =
                          getAvailableCount(item, usedFromPackages, quantity) +
                          quantity;
                        if (quantity >= maxAllowed) return;
                        setQuantities((prev) => ({
                          ...prev,
                          [item.id]: (prev[item.id] || 0) + 1,
                        }));
                        dispatchCartUpdate();
                      }}
                      className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Packages */}
            {packageItems.map((pkg) => {
              const isExpanded = expandedPackages.has(pkg.id);
              const extrasTotal = (pkg.extras || []).reduce(
                (sum, e) => sum + e.pricePerDay * e.quantity,
                0
              );
              const pkgTotal =
                pkg.price + pkg.installPrice + pkg.deliveryPrice + extrasTotal;

              return (
                <div
                  key={pkg.id}
                  className="bg-gradient-to-br from-[#1A4BFF]/[0.06] to-[#BD20D3]/[0.04] border border-[#BD20D3]/20 rounded-2xl p-4 relative group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-zinc-800 border border-white/10">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {pkg.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold border px-1.5 py-0.5 rounded-full border-[#BD20D3]/30 text-[#BD20D3]">
                          {pkg.hasLights ? "So svetlami" : "Bez svetiel"}
                        </span>
                        <span className="text-[#BD20D3] font-bold text-xs">
                          {pkg.price} €
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removePackage(pkg.id)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>

                  <button
                    onClick={() => togglePackageExpand(pkg.id)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mt-2 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    {isExpanded ? "Skryť detaily" : "Zobraziť detaily"}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 border-t border-white/[0.08] pt-3">
                      {pkg.arrival && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <MapPin size={12} className="text-[#1A4BFF]" />
                          <span>
                            Doručenie: {pkg.arrival.name} (+{pkg.deliveryPrice}{" "}
                            €)
                          </span>
                        </div>
                      )}
                      {pkg.install !== "none" && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Wrench size={12} className="text-cyan-400" />
                          <span>
                            {pkg.install === "install"
                              ? "Inštalácia"
                              : "Inštalácia + deinštalácia"}{" "}
                            (+{pkg.installPrice} €)
                          </span>
                        </div>
                      )}
                      {(pkg.extras || []).length > 0 && (
                        <div className="text-xs space-y-1">
                          <p className="text-gray-500 font-semibold uppercase tracking-wider">
                            Ďalšie produkty:
                          </p>
                          {pkg.extras.map((e) => (
                            <div
                              key={e.id}
                              className="flex justify-between text-gray-400 pl-3"
                            >
                              <span>{e.label}</span>
                              <span className="text-white">
                                {(e.pricePerDay * e.quantity).toFixed(2)} €
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between text-xs pt-2 border-t border-white/[0.08]">
                        <span className="text-white font-bold">Cena balíka:</span>
                        <span className="text-[#BD20D3] font-extrabold">
                          {pkgTotal.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer with total + reservation */}
          <div className="border-t border-white/10 p-5 shrink-0 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Spolu:</span>
              <span className="text-[#BD20D3] font-extrabold text-2xl">
                {grandTotal.toFixed(2)} €
              </span>
            </div>

            <Dialog
              open={reservationDialogOpen}
              onOpenChange={setReservationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full btn-cyber rounded-xl h-12 border-none font-bold">
                  <Send size={16} className="mr-2" />
                  Nezáväzne rezervovať
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0d1f] border border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">
                    Nezáväzná rezervácia
                  </DialogTitle>
                  <DialogDescription className="text-gray-400 text-sm">
                    Vyplňte formulár nižšie a odošlite nám nezáväzný dopyt na
                    rezerváciu. Ozveme sa vám čo najskôr.
                  </DialogDescription>
                </DialogHeader>

                {/* Cart summary in dialog */}
                <div className="my-4 bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2 text-sm">
                  {cartItems.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-gray-300"
                    >
                      <span>
                        {item.name} × {quantity}
                      </span>
                      <span className="text-[#BD20D3] font-semibold">
                        {(item.price_per_day * quantity).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                  {packageItems.map((pkg) => {
                    const pkgTotal =
                      pkg.price +
                      pkg.installPrice +
                      pkg.deliveryPrice +
                      (pkg.extras || []).reduce(
                        (s, e) => s + e.pricePerDay * e.quantity,
                        0
                      );
                    return (
                      <div
                        key={pkg.id}
                        className="flex justify-between text-gray-300"
                      >
                        <span>🎯 {pkg.name}</span>
                        <span className="text-[#BD20D3] font-semibold">
                          {pkgTotal.toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10 mt-2">
                    <span className="text-white">Celková cena:</span>
                    <span className="text-[#BD20D3]">
                      {grandTotal.toFixed(2)} €
                    </span>
                  </div>
                </div>

                <form
                  onSubmit={handleReservationSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-bold uppercase">
                        Meno *
                      </label>
                      <input
                        type="text"
                        required
                        value={reservationFirstName}
                        onChange={(e) =>
                          setReservationFirstName(e.target.value)
                        }
                        placeholder="Napr. Ján"
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-bold uppercase">
                        Priezvisko *
                      </label>
                      <input
                        type="text"
                        required
                        value={reservationLastName}
                        onChange={(e) =>
                          setReservationLastName(e.target.value)
                        }
                        placeholder="Napr. Novák"
                        className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={reservationEmail}
                      onChange={(e) => setReservationEmail(e.target.value)}
                      placeholder="jan.novak@email.sk"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">
                      Telefón (voliteľný)
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={reservationPhone}
                      onChange={(e) => setReservationPhone(e.target.value)}
                      placeholder="+421 901 234 567"
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl h-11 px-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-bold uppercase">
                      Správa (voliteľné)
                    </label>
                    <textarea
                      value={reservationMessage}
                      onChange={(e) => setReservationMessage(e.target.value)}
                      placeholder="Ak máte akékoľvek otázky, napíšte nám..."
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl min-h-[80px] p-4 focus:outline-none focus:ring-1 focus:ring-[#BD20D3] text-sm leading-relaxed"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sendingReservation}
                    className="w-full btn-cyber h-11 rounded-xl font-bold border-none text-sm mt-2"
                  >
                    {sendingReservation ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Odosiela sa...
                      </>
                    ) : (
                      "Odoslať rezerváciu"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Success dialog */}
      <Dialog
        open={showReservationSuccess}
        onOpenChange={setShowReservationSuccess}
      >
        <DialogContent className="bg-[#0a0d1f] border border-[#BD20D3]/40 text-white max-w-md rounded-3xl shadow-2xl shadow-[#BD20D3]/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#BD20D3]/20 border border-[#BD20D3]/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-[#BD20D3]" size={32} />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              Ďakujeme!
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-base leading-relaxed">
              Vaša nezáväzná rezervácia bola úspešne odoslaná. Budeme sa jej
              venovať a čoskoro sa vám ozveme späť.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowReservationSuccess(false);
              setIsOpen(false);
            }}
            className="btn-cyber border-none rounded-xl h-12 px-8 font-bold mt-6 w-full"
          >
            Zavrieť
          </Button>
        </DialogContent>
      </Dialog>

      <MapPicker
        open={false}
        onOpenChange={() => {}}
        onLocationSelect={() => {}}
      />
    </>
  );
};

export default FloatingCart;