// @ts-ignore - Deno module, not available in standard TS
import { Resend } from "npm:resend@2.0.0";

// @ts-ignore - Deno global, not available in standard TS
const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const TO_EMAIL = "martinnovysedlak48@gmail.com";
const FROM_EMAIL = "Socializea Audio <onboarding@resend.dev>";
const SUBJECT = "🎉 Nová rezervácia z webu Socializea!";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-connection-encrypted",
};

function h(val: string): string {
  return val || "Neuvedené";
}

function buildHtml(body: Record<string, any>): string {
  const name = h(body.customerName);
  const email = h(body.customerEmail);
  const pkg = h(body.selectedPackage);
  const date = h(body.eventDate);
  const msg = body.message || "—";

  const lines = [
    '<div style="font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">',
    '  <div style="background:linear-gradient(135deg,#BD20D3,#1A4BFF);padding:32px 24px;text-align:center">',
    '    <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700">Nová rezervácia 🎉</h1>',
    '    <p style="color:#f0e6ff;margin-top:8px;font-size:15px">Socializea Audio</p>',
    "  </div>",
    '  <div style="padding:32px 24px;background:#fafafa">',
    '    <table style="width:100%;border-collapse:collapse">',
    '      <tr style="border-bottom:1px solid #e0e0e0">',
    '        <td style="padding:12px 0;color:#555;font-weight:600">Meno</td>',
    '        <td style="padding:12px 0;color:#111;text-align:right">' + name + "</td>",
    "      </tr>",
    '      <tr style="border-bottom:1px solid #e0e0e0">',
    '        <td style="padding:12px 0;color:#555;font-weight:600">E‑mail</td>',
    '        <td style="padding:12px 0;color:#111;text-align:right">' + email + "</td>",
    "      </tr>",
    '      <tr style="border-bottom:1px solid #e0e0e0">',
    '        <td style="padding:12px 0;color:#555;font-weight:600">Balík</td>',
    '        <td style="padding:12px 0;color:#111;text-align:right">' + pkg + "</td>",
    "      </tr>",
    '      <tr style="border-bottom:1px solid #e0e0e0">',
    '        <td style="padding:12px 0;color:#555;font-weight:600">Dátum podujatia</td>',
    '        <td style="padding:12px 0;color:#111;text-align:right">' + date + "</td>",
    "      </tr>",
    "      <tr>",
    '        <td style="padding:12px 0;color:#555;font-weight:600;vertical-align:top">Správa</td>',
    '        <td style="padding:12px 0;color:#111;text-align:right;white-space:pre-line">' + msg + "</td>",
    "      </tr>",
    "    </table>",
    "  </div>",
    '  <div style="background:#f3f4f6;padding:16px 24px;text-align:center;font-size:12px;color:#888">',
    "    Tento e‑mail bol vygenerovaný automaticky z webového formulára socializea.com",
    "  </div>",
    "</div>",
  ];

  return lines.join("\n");
}

// @ts-ignore - Deno global, not available in standard TS
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

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