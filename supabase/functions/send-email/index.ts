// @ts-ignore - Deno module, not available in standard TS
import { Resend } from "npm:resend@2.0.0";

// @ts-ignore - Deno global, not available in standard TS
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const TO_EMAIL = "djparty.sk@gmail.com";
const FROM_EMAIL = "Socializea Audio <onboarding@resend.dev>";

function h(val: string): string {
  return val || "Neuvedené";
}

// Pôvodná HTML šablóna pre kontaktný formulár
function buildHtml(body: Record<string, any>): string {
  const subjectPrefix = body.subjectPrefix || "Nová správa";
  const heading = subjectPrefix;

  // Preberá anglické aj slovenské názvy kľúčov (kvôli kompatibilite)
  const name = h(body.customerName || body.name || body.meno);
  const email = h(body.customerEmail || body.email);
  const phone = h(body.customerPhone || body.phone || body.tel);
  const eventDate = h(body.eventDate || body.date || body.datum);
  const pkg = h(body.selectedPackage || body.package || body.balik);
  // Ak správu tvorí len „prehľad rezervácie“, zobrazíme ju ako plain text
  const msg = body.message || body.sprava || "—";

  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid rgba(189,32,211,0.3);box-shadow: 0 4px 20px rgba(189,32,211,0.15);">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0;">🔊 ${heading}</h1>
    <p style="color:#9ca3af;font-size:14px;margin-top:8px;">Kontaktný formulár z webu</p>
  </div>
  <div style="padding:24px;">
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <table style="width:100%;font-size:14px;color:#d1d5db;border-collapse: collapse;">
      <tr>
        <td style="padding:6px 0;color:#9ca3af;width:130px;vertical-align: top;">Meno:</td>
        <td style="padding:6px 0;color:white;font-weight:600;vertical-align: top;">${name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#9ca3af;vertical-align: top;">Email:</td>
        <td style="padding:6px 0;vertical-align: top;">
          <a href="mailto:${email}" style="color:#BD20D3; text-decoration: none; font-weight: 600;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#9ca3af;vertical-align: top;">Telefón:</td>
        <td style="padding:6px 0;color:white;vertical-align: top;">${phone}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#9ca3af;vertical-align: top;">Dátum podujatia:</td>
        <td style="padding:6px 0;color:white;font-weight: 600;vertical-align: top;">${eventDate}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;color:#9ca3af;vertical-align: top;">Balík/Záujem:</td>
        <td style="padding:6px 0;color:white;font-weight: 600;vertical-align: top;">${pkg}</td>
      </tr>
    </table>

    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
    <div style="background:rgba(189,32,211,0.08);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;white-space:pre-line;">${msg}</div>
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Tento e‑mail bol vygenerovaný automaticky z webovej stránky <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-connection-encrypted",
};

// @ts-ignore - Deno global, not available in standard TS
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Ak je poskytnuté priame HTML, použijeme ho (platí hlavne pre košík)
    const htmlContent = body.html;

    // Ak nie je explicitne nastavený predmet, použijeme predvolený alebo vlastný
    const subject = body.subject || "🔊 Nová správa z kontaktného formulára";

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: body.to || TO_EMAIL,
      subject: subject,
      html: htmlContent || buildHtml(body),
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
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});