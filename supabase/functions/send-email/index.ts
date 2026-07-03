import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const TO_EMAIL = "martinnovysedlak48@gmail.com";
const FROM_EMAIL = "Socializea Audio <onboarding@resend.dev>";
const SUBJECT = "🎉 Nová rezervácia z webu Socializea!";

function buildHtml(body: Record<string, any>) {
  const customerName = body.customerName || 'Neuvedené';
  const customerEmail = body.customerEmail || 'Neuvedené';
  const selectedPackage = body.selectedPackage || 'Neuvedené';
  const eventDate = body.eventDate || 'Neuvedené';
  const message = body.message || '—';

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #BD20D3, #1A4BFF); padding:32px 24px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">Nová rezervácia 🎉</h1>
        <p style="color:#f0e6ff; margin-top:8px; font-size:15px;">Socializea Audio</p>
      </div>
      <div style="padding:32px 24px; background-color:#fafafa;">
        <table style="width:100%; border-collapse:collapse;">
          <tr style="border-bottom:1px solid #e0e0e0;">
            <td style="padding:12px 0; color:#555; font-weight:600;">Meno</td>
            <td style="padding:12px 0; color:#111; text-align:right;">${customerName}</td>
          </tr>
          <tr style="border-bottom:1px solid #e0e0e0;">
            <td style="padding:12px 0; color:#555; font-weight:600;">E‑mail</td>
            <td style="padding:12px 0; color:#111; text-align:right;">${customerEmail}</td>
          </tr>
          <tr style="border-bottom:1px solid #e0e0e0;">
            <td style="padding:12px 0; color:#555; font-weight:600;">Balík</td>
            <td style="padding:12px 0; color:#111; text-align:right;">${selectedPackage}</td>
          </tr>
          <tr style="border-bottom:1px solid #e0e0e0;">
            <td style="padding:12px 0; color:#555; font-weight:600;">Dátum podujatia</td>
            <td style="padding:12px 0; color:#111; text-align:right;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding:12px 0; color:#555; font-weight:600; vertical-align:top;">Správa</td>
            <td style="padding:12px 0; color:#111; text-align:right; white-space:pre-line;">${message}</td>
          </tr>
        </table>
      </div>
      <div style="background-color:#f3f4f6; padding:16px 24px; text-align:center; font-size:12px; color:#888;">
        Tento e‑mail bol vygenerovaný automaticky z webového formulára socializea.com
      </div>
    </div>
  `;
}

serve(async (req) => {
  try {
    const body = await req.json();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: SUBJECT,
      html: buildHtml(body),
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});