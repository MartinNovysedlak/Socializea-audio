// @ts-ignore - Deno module, not available in standard TS
import { Resend } from "npm:resend@2.0.0";

// @ts-ignore - Deno global, not available in standard TS
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const DEFAULT_TO_EMAIL = "martinnovysedlak48@gmail.com";
const DEFAULT_FROM_EMAIL = "Socializea Audio <onboarding@resend.dev>";
const DEFAULT_SUBJECT = "🔊 Nová správa z kontaktného formulára";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-connection-encrypted",
};

function escape(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// @ts-ignore - Deno global, not available in standard TS
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Received body keys:", Object.keys(body));

    // Determine if this is a cart order or simple contact
    const isCart = body.type === "cart";
    const subject = isCart
      ? `🔊 Nový dopyt z košíka – ${escape(body.customerName)}`
      : (body.subject || DEFAULT_SUBJECT);

    // Build simple contact HTML
    const name = escape(body.customerName || body.name || "");
    const email = escape(body.customerEmail || body.email || "");
    const phone = escape(body.customerPhone || body.phone || "");
    const eventDate = escape(body.eventDate || body.date || "");
    const pkg = escape(body.selectedPackage || body.package || "");
    const messageText = escape(body.message || "");

    // Build cart items HTML
    let cartHtml = "";
    if (Array.isArray(body.cartItems)) {
      cartHtml = "<h3 style='color:#BD20D3;font-size:16px;margin:20px 0 10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;'>📦 Obsah košíka</h3>";
      
      body.cartItems.forEach((item: any) => {
        cartHtml += `<div style="background:rgba(189,32,211,0.05);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:12px 16px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="color:white;font-size:14px;">${escape(item.name)}</strong>
            <span style="color:#BD20D3;font-weight:700;font-size:14px;">${escape(item.price || "0")} €</span>
          </div>
          ${item.qty ? `<div style="margin-top:6px;"><span style="color:#9ca3af;font-size:12px;">Počet: <strong style="color:white;">${escape(String(item.qty))}x</strong></span></div>` : ""}
          ${item.details ? `<div style="margin-top:6px;padding:8px 12px;background:rgba(0,0,0,0.2);border-radius:8px;color:#d1d5db;font-size:12px;line-height:1.5;">${escape(item.details)}</div>` : ""}
        </div>`;
      });

      if (body.totalPrice) {
        cartHtml += `<div style="margin-top:16px;padding-top:12px;border-top:2px solid #BD20D3;display:flex;justify-content:space-between;align-items:center;">
          <span style="color:white;font-size:16px;font-weight:700;">Celková suma</span>
          <span style="color:#BD20D3;font-size:20px;font-weight:900;">${escape(body.totalPrice)} €</span>
        </div>`;
      }
    }

    const htmlContent = `<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid rgba(189,32,211,0.3);">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0;">🔊 ${isCart ? "Nový dopyt z košíka" : "Nová správa"}</h1>
    <p style="color:#9ca3af;font-size:14px;margin-top:8px;">${isCart ? "Nezáväzná kalkulácia z webu" : "Kontaktný formulár z webu"}</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <table style="width:100%;font-size:14px;color:#d1d5db;">
      <tr><td style="padding:4px 0;color:#9ca3af;width:100px;">Meno:</td><td style="padding:4px 0;color:white;font-weight:600;">${name}</td></tr>
      <tr><td style="padding:4px 0;color:#9ca3af;">Email:</td><td style="padding:4px 0;color:#BD20D3;">${email}</td></tr>
      <tr><td style="padding:4px 0;color:#9ca3af;">Tel:</td><td style="padding:4px 0;color:white;">${phone}</td></tr>
      <tr><td style="padding:4px 0;color:#9ca3af;">Dátum:</td><td style="padding:4px 0;color:white;">${eventDate}</td></tr>
      <tr><td style="padding:4px 0;color:#9ca3af;">Balík:</td><td style="padding:4px 0;color:white;">${pkg}</td></tr>
    </table>
    ${cartHtml}
    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
    <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;color:#d1d5db;font-size:13px;line-height:1.5;">${messageText}</div>
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(189,32,211,0.2);text-align:center;padding-bottom:20px;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">Tento email bol odoslaný automaticky z webovej stránky.</p>
    </div>
  </div>
</div>`;

    const to = isCart ? (body.to || DEFAULT_TO_EMAIL) : DEFAULT_TO_EMAIL;
    const replyTo = body.replyTo || body.customerEmail || body.email || undefined;

    console.log("Sending email:");
    console.log("  To:", to);
    console.log("  Subject:", subject);
    console.log("  HTML length:", htmlContent.length);

    const emailPayload: any = {
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject: subject,
      html: htmlContent,
    };

    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("Resend error details:", JSON.stringify(error, null, 2));
      return new Response(JSON.stringify({ success: false, error: error.message || "Unknown error", details: error }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully:", JSON.stringify(data));
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", JSON.stringify(err, null, 2));
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});