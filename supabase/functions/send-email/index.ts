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

function h(val: string): string {
  return val || "Neuvedené";
}

function buildHtml(body: Record<string, any>): string {
  const subjectPrefix = body.subjectPrefix || "Nová správa";
  const heading = subjectPrefix;

  const name = h(body.customerName);
  const email = h(body.customerEmail);
  const phone = h(body.customerPhone);
  const eventDate = h(body.eventDate);
  const pkg = h(body.selectedPackage);
  const msg = body.message || "—";

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
    <div style="background:rgba(189,32,211,0.08);border:1px solid rgba(189,32,211,0.2);border-radius:12px;padding:16px;color:#d1d5db;font-size:14px;line-height:1.6;">${msg}</div>
  </div>
  <div style="background:#040b33;padding:16px 24px;text-align:center;border-top:1px solid rgba(189,32,211,0.15);">
    <p style="color:#6b7280;font-size:12px;margin:0;">Tento e‑mail bol vygenerovaný automaticky z webovej stránky <strong style="color:#9ca3af;">socializea.sk</strong></p>
  </div>
</div>`;
}

// @ts-ignore - Deno global, not available in standard TS
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Determine recipient, subject and HTML content
    const to = body.to || DEFAULT_TO_EMAIL;
    const subject = body.subject || DEFAULT_SUBJECT;
    const html = body.html || buildHtml(body);
    const replyTo = body.replyTo || undefined;

    console.log("Sending email with:");
    console.log("  To:", to);
    console.log("  Subject:", subject);
    console.log("  HTML length:", html?.length || 0);
    console.log("  ReplyTo:", replyTo);

    const emailPayload: any = {
      from: DEFAULT_FROM_EMAIL,
      to: [to],
      subject: subject,
      html: html,
    };

    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("Resend error:", JSON.stringify(error, null, 2));
      return new Response(JSON.stringify({ success: false, error: error.message || error }), {
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
    return new Response(JSON.stringify({ success: false, error: err.message || err }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});