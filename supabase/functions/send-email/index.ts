// @ts-expect-error - Deno npm: prefix, not available in standard TS
import { Resend } from "npm:resend@2.0.0";

// @ts-expect-error - Deno global, not available in standard TS
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const TO_EMAIL = "djparty.sk@gmail.com";
const FROM_EMAIL = "Socializea Audio <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-connection-encrypted",
};

function h(val: unknown): string {
  if (val === null || val === undefined) return "Neuvedené";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

// --- Šablóna pre kontaktný formulár (formType: contact) ---
function buildContactHtml(body: Record<string, unknown>): string {
  const name = h(body.name);
  const email = h(body.email);
  const phone = h(body.phone);
  const date = h(body.date);
  const message = h(body.message);

  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid rgba(189,32,211,0.3);box-shadow: 0 4px 20px rgba(189,32,211,0.15);">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0;">📨 Nová správa</h1>
    <p style="color:#9ca3af;font-size:14px;margin-top:8px;">Kontaktný formulár z webu</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <div style="font-size:14px;color:#d1d5db;line-height:1.8;">
      <p style="margin:0 0 8px;"><strong style="color:#9ca3af;">Meno:</strong> ${name}</p>
      <p style="margin:0 0 8px;"><strong style="color:#9ca3af;">Email:</strong> <a href="mailto:${email}" style="color:#BD20D3;text-decoration:none;">${email}</a></p>
      <p style="margin:0 0 8px;"><strong style="color:#9ca3af;">Telefón:</strong> ${phone}</p>
      <p style="margin:0 0 8px;"><strong style="color:#9ca3af;">Dátum podujatia:</strong> ${date}</p>
    </div>
    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
    <div style="background:rgba(189,32,211,0.08);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;white-space:pre-line;">${message}</div>
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Tento e‑mail bol vygenerovaný automaticky zo stránky <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

// --- Šablóna pre rezerváciu z košíka (formType: reservation) ---
function buildReservationHtml(body: Record<string, unknown>): string {
  const name = h(body.name);
  const email = h(body.email);
  const phone = h(body.phone);
  const date = h(body.date);
  const message = body.message ? String(body.message) : "";

  const cartItems = Array.isArray(body.cartItems) ? body.cartItems : [];
  const packages = Array.isArray(body.packages) ? body.packages : [];
  const totalPrice = typeof body.totalPrice === "number" ? body.totalPrice : undefined;

  // --- HTML tabuľky pre aparatúru ---
  let cartHtml = "";
  if (cartItems.length > 0) {
    cartHtml += `
    <h3 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">🎧 Aparatúra</h3>
    <table style="width:100%;border-collapse:collapse;font-size:13px;color:#d1d5db;">
      <thead>
        <tr style="background:rgba(189,32,211,0.1);">
          <th style="padding:8px 12px;text-align:left;color:#9ca3af;font-weight:600;">Položka</th>
          <th style="padding:8px 12px;text-align:center;color:#9ca3af;font-weight:600;">Počet</th>
          <th style="padding:8px 12px;text-align:right;color:#9ca3af;font-weight:600;">Cena/deň</th>
          <th style="padding:8px 12px;text-align:right;color:#9ca3af;font-weight:600;">Spolu</th>
        </tr>
      </thead>
      <tbody>`;
    for (const item of cartItems) {
      const itemName = h(item.name || item.nazov);
      const qty = Number(item.quantity || item.pocet || 1);
      const price = Number(item.pricePerDay || item.cena || 0);
      const total = price * qty;
      cartHtml += `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
          <td style="padding:8px 12px;color:white;">${itemName}</td>
          <td style="padding:8px 12px;text-align:center;color:#BD20D3;font-weight:700;">${qty}x</td>
          <td style="padding:8px 12px;text-align:right;color:#9ca3af;">${price.toFixed(2)} €</td>
          <td style="padding:8px 12px;text-align:right;color:white;font-weight:600;">${total.toFixed(2)} €</td>
        </tr>`;
    }
    cartHtml += `</tbody></table>`;
  }

  // --- HTML pre balíky s príplatkami ako tagmi ---
  let packagesHtml = "";
  if (packages.length > 0) {
    packagesHtml += `<h3 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">📦 Balíky</h3>`;
    for (const pkg of packages) {
      const pkgName = h(pkg.name || pkg.nazov);
      const pkgPrice = typeof pkg.price === "number" ? pkg.price : 0;
      const addons = Array.isArray(pkg.addons) ? pkg.addons : [];

      packagesHtml += `
      <div style="background:rgba(189,32,211,0.05);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:14px 16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:white;font-size:15px;">${pkgName}</strong>
          <span style="color:#BD20D3;font-weight:700;font-size:16px;">${pkgPrice.toFixed(2)} €</span>
        </div>`;
      if (addons.length > 0) {
        packagesHtml += `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">`;
        for (const addon of addons) {
          const addonLabel = h(addon.label || addon.nazov);
          const addonType = String(addon.type || "");
          let color = "#9ca3af";
          let bg = "rgba(255,255,255,0.05)";
          if (addonType === "lights") { color = "#BD20D3"; bg = "rgba(189,32,211,0.1)"; }
          else if (addonType === "install") { color = "#1A4BFF"; bg = "rgba(26,75,255,0.1)"; }
          else if (addonType === "delivery") { color = "#10b981"; bg = "rgba(16,185,129,0.1)"; }
          packagesHtml += `
            <span style="display:inline-block;padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;border:1px solid;color:${color};border-color:${color}40;background:${bg};">${addonLabel}</span>`;
        }
        packagesHtml += `</div>`;
      }
      packagesHtml += `</div>`;
    }
  }

  // --- Celková suma ---
  let totalHtml = "";
  if (totalPrice !== undefined) {
    totalHtml = `
    <div style="margin-top:24px;padding-top:16px;border-top:2px solid #BD20D3;display:flex;justify-content:space-between;align-items:center;">
      <span style="color:white;font-size:18px;font-weight:700;">Celková suma</span>
      <span style="color:#BD20D3;font-size:22px;font-weight:900;">${totalPrice.toFixed(2)} €</span>
    </div>`;
  }

  // --- Správa ---
  let messageBlock = "";
  if (message.trim()) {
    messageBlock = `
    <h3 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">💬 Správa od zákazníka</h3>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;white-space:pre-line;">${message}</div>`;
  }

  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:640px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid rgba(189,32,211,0.3);box-shadow: 0 4px 20px rgba(189,32,211,0.15);">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0;">🛒 Nová rezervácia</h1>
    <p style="color:#9ca3af;font-size:14px;margin-top:8px;">Nezáväzná kalkulácia z webu</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <div style="font-size:14px;color:#d1d5db;line-height:1.8;">
      <p style="margin:0 0 6px;"><strong style="color:#9ca3af;">Meno:</strong> ${name}</p>
      <p style="margin:0 0 6px;"><strong style="color:#9ca3af;">Email:</strong> <a href="mailto:${email}" style="color:#BD20D3;text-decoration:none;">${email}</a></p>
      <p style="margin:0 0 6px;"><strong style="color:#9ca3af;">Telefón:</strong> ${phone}</p>
      <p style="margin:0 0 6px;"><strong style="color:#9ca3af;">Dátum:</strong> ${date}</p>
    </div>
    <h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">📦 Obsah košíka</h2>
    ${cartHtml}
    ${packagesHtml}
    ${totalHtml}
    ${messageBlock}
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Tento e‑mail bol vygenerovaný automaticky zo stránky <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

// @ts-expect-error - Deno global, not available in standard TS
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json() as Record<string, unknown>;
    const formType = String(body.formType || "contact");

    let html = "";
    let subject = "🔊 Nová správa z kontaktného formulára";

    if (formType === "reservation") {
      subject = `🛒 Nová rezervácia – ${h(body.name)}`;
      html = buildReservationHtml(body);
    } else {
      subject = `📨 Nová správa od ${h(body.name)}`;
      html = buildContactHtml(body);
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: String(body.to || TO_EMAIL),
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});