// ===== TypeScript deklarácie pre Deno runtime =====
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const TO_EMAIL = "djparty.sk@gmail.com";
const FROM_EMAIL = "onboarding@resend.dev";
const FROM_NAME = "Socializea Audio";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-client-info, apikey, x-connection-encrypted",
};

function h(val: unknown): string {
  if (val === null || val === undefined) return "Neuvedené";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function safeParseArray<T>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p as T[];
    } catch {
      /* nie je JSON */
    }
  }
  return [];
}

function pick(
  obj: Record<string, unknown>,
  ...keys: string[]
): unknown {
  for (const key of keys) {
    if (key in obj) return obj[key];
  }
  return undefined;
}

// ===== HTML šablóny =====

function buildContactHtml(body: Record<string, unknown>): string {
  const name = h(pick(body, "name", "meno", "customerName"));
  const email = h(pick(body, "email", "customerEmail"));
  const phone = h(pick(body, "phone", "customerPhone"));
  const date = h(pick(body, "date", "eventDate"));
  const msg = h(pick(body, "message", "sprava"));

  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;border:1px solid rgba(189,32,211,0.3);overflow:hidden;">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0 0 8px;">📨 Nová správa z webu</h1>
    <p style="color:#9ca3af;font-size:14px;margin:0;">Kontaktný formulár</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#d1d5db;">
      <tr><td style="padding:6px 0;color:#9ca3af;">Meno:</td><td style="padding:6px 0;color:white;">${name}</td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Email:</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#BD20D3;">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Telefón:</td><td style="padding:6px 0;color:white;">${phone}</td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Dátum:</td><td style="padding:6px 0;color:white;">${date}</td></tr>
    </table>
    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
    <div style="background:rgba(189,32,211,0.08);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;">${msg}</div>
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Automaticky vygenerované z <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

function buildReservationHtml(body: Record<string, unknown>): string {
  const name = h(pick(body, "name", "meno", "customerName"));
  const email = h(pick(body, "email", "customerEmail"));
  const phone = h(pick(body, "phone", "customerPhone"));
  const date = h(pick(body, "date", "eventDate"));
  const msgRaw = String(pick(body, "message", "sprava") ?? "");

  const cartItems = safeParseArray<Record<string, unknown>>(
    pick(body, "cartItems", "items", "equipment") ?? []
  );
  const packages = safeParseArray<Record<string, unknown>>(
    pick(body, "packages", "package", "balik", "baliky") ?? []
  );
  const totalPrice =
    typeof body.totalPrice === "number"
      ? body.totalPrice
      : typeof body.totalPrice === "string"
        ? parseFloat(body.totalPrice)
        : undefined;

  let cartHtml = "";
  if (cartItems.length > 0) {
    cartHtml = `
      <h3 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">🎧 Aparatúra</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:rgba(189,32,211,0.1);">
            <th style="padding:8px 12px;text-align:left;color:#9ca3af;">Položka</th>
            <th style="padding:8px 12px;text-align:center;color:#9ca3af;">Počet</th>
            <th style="padding:8px 12px;text-align:right;color:#9ca3af;">Cena/deň</th>
            <th style="padding:8px 12px;text-align:right;color:#9ca3af;">Spolu</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems
            .map((item) => {
              const itemName = h(
              pick(item, "name", "title", "nazov") ?? "Neznáma položka"
            );
              const qty = Number(
              pick(item, "quantity", "pocet") ?? 1
            );
              const price = Number(
              pick(item, "pricePerDay", "price", "cena") ?? 0
            );
              const total = price * qty;
              return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:8px 12px;color:white;">${itemName}</td>
              <td style="padding:8px 12px;text-align:center;color:#BD20D3;font-weight:700;">${qty}x</td>
              <td style="padding:8px 12px;text-align:right;color:#9ca3af;">${price.toFixed(2)} €</td>
              <td style="padding:8px 12px;text-align:right;color:white;font-weight:600;">${total.toFixed(2)} €</td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>`;
  }

  let packagesHtml = "";
  if (packages.length > 0) {
    packagesHtml = `<h3 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">📦 Balíky</h3>`;
    packagesHtml += packages
      .map((pkg) => {
        const pkgName = h(
        pick(pkg, "name", "nazov") ?? "Balík"
      );
        const pkgPrice = Number(
        pick(pkg, "price", "cena") ?? 0
      );
        const addons = safeParseArray<Record<string, unknown>>(
        pick(pkg, "addons", "prislusenstvo") ?? []
      );

        let tagsHtml = "";
        if (addons.length > 0) {
          tagsHtml = `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">`;
          tagsHtml += addons
            .map((a) => {
              const label = h(
              pick(a, "label", "nazov") ?? "Príplatok"
            );
              const type = String(
              pick(a, "type", "typ") ?? ""
            );
              let color = "#9ca3af",
                bg = "rgba(255,255,255,0.05)";
              if (
                type === "lights" ||
                type.toLowerCase().includes("svetla")
              ) {
                color = "#BD20D3";
                bg = "rgba(189,32,211,0.1)";
              } else if (
                type === "install" ||
                type.toLowerCase().includes("inštalácia") ||
                type.toLowerCase().includes("instalacia")
              ) {
                color = "#1A4BFF";
                bg = "rgba(26,75,255,0.1)";
              } else if (
                type === "delivery" ||
                type.toLowerCase().includes("doprava")
              ) {
                color = "#10b981";
                bg = "rgba(16,185,129,0.1)";
              }
              return `<span style="display:inline-block;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid;color:${color};border-color:${color}40;background:${bg};">${label}</span>`;
            })
            .join("");
          tagsHtml += `</div>`;
        }

        return `
        <div style="background:rgba(189,32,211,0.05);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:14px 16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:white;font-size:15px;">${pkgName}</strong>
            <span style="color:#BD20D3;font-weight:700;font-size:16px;">${pkgPrice.toFixed(2)} €</span>
          </div>
          ${tagsHtml}
        </div>`;
      })
      .join("");
  }

  let totalHtml = "";
  if (totalPrice !== undefined) {
    totalHtml = `
      <div style="margin-top:24px;padding-top:16px;border-top:2px solid #BD20D3;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:white;font-size:18px;font-weight:700;">Celková suma</span>
        <span style="color:#BD20D3;font-size:22px;font-weight:900;">${totalPrice.toFixed(2)} €</span>
      </div>`;
  }

  let messageHtml = "";
  if (msgRaw.trim()) {
    messageHtml = `
      <h3 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">💬 Správa od zákazníka</h3>
      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;white-space:pre-line;">${msgRaw}</div>`;
  }

  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:640px;margin:0 auto;border-radius:16px;border:1px solid rgba(189,32,211,0.3);overflow:hidden;">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0 0 8px;">🛒 Nová rezervácia</h1>
    <p style="color:#9ca3af;font-size:14px;margin:0;">Nezáväzná kalkulácia</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#d1d5db;">
      <tr><td style="padding:6px 0;color:#9ca3af;width:80px;">Meno:</td><td style="padding:6px 0;color:white;">${name}</td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Email:</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#BD20D3;">${email}</a></td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Telefón:</td><td style="padding:6px 0;color:white;">${phone}</td></tr>
      <tr><td style="padding:6px 0;color:#9ca3af;">Dátum:</td><td style="padding:6px 0;color:white;">${date}</td></tr>
    </table>
    <h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">📦 Obsah košíka</h2>
    ${cartHtml}
    ${packagesHtml}
    ${totalHtml}
    ${messageHtml}
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Automaticky vygenerované z <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

// ===== SPUSTENIE FUNKCIE =====

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;

    console.log("Prijaté dáta:", JSON.stringify(body, null, 2));

    const formType = String(body.formType || "contact");

    let subject = "📨 Nová správa z kontaktného formulára";
    let html = "";

    if (formType === "reservation") {
      const customerName = h(
        pick(body, "name", "meno", "customerName")
      );
      subject = `🛒 Nová rezervácia – ${customerName}`;
      html = buildReservationHtml(body);
    } else {
      html = buildContactHtml(body);
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: TO_EMAIL,
        subject,
        html,
      }),
    });

    const result = await resendRes.text();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendRes.status, result);
      return new Response(
        JSON.stringify({
          success: false,
          error: result,
          status: resendRes.status,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Fatal edge function error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});