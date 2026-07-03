// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@4.1.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

interface EmailPayload {
  // Dynamický režim (preferovaný)
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  packageName?: string
  message?: string

  // Pôvodný režim (spätná kompatibilita)
  subject?: string
  html?: string
}

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY nie je nastavený v Supabase secrets")
    }

    const resend = new Resend(resendApiKey)
    const body: EmailPayload = await req.json()

    // --- Pevne nastavené adresy (testovací režim) ---
    const FROM = "onboarding@resend.dev"
    const TO = "socializea@socializea.com"

    let subject: string
    let html: string

    // Dynamická stavba e‑mailu ak prišli detaily klienta
    if (body.clientName) {
      const clientName = body.clientName || "Neznámy"
      const clientEmail = body.clientEmail || "Neuvedený"
      const clientPhone = body.clientPhone || "Neuvedený"
      const pkg = body.packageName || "Neuvedený"
      const msg = body.message || "—"

      subject = `Dopyt od ${clientName} – ${pkg}`

      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0d1f; color: white; border-radius: 16px; overflow: hidden; border: 1px solid rgba(189,32,211,0.3);">
          <div style="padding: 24px; background: linear-gradient(135deg, #BD20D3, #1A4BFF);">
            <h1 style="margin: 0; font-size: 20px; color: white;">📬 Nový dopyt cez web</h1>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600; width: 120px;">Meno:</td>
                <td style="padding: 8px 12px; color: white; font-weight: 700;">${clientName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Email:</td>
                <td style="padding: 8px 12px; color: white;">${clientEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Telefón:</td>
                <td style="padding: 8px 12px; color: white;">${clientPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #9ca3af; font-weight: 600;">Balík:</td>
                <td style="padding: 8px 12px; color: white; font-weight: 700;">${pkg}</td>
              </tr>
            </table>
            <div style="margin-top: 16px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-weight: 600; font-size: 12px; text-transform: uppercase;">Správa:</p>
              <p style="margin: 0; color: #d1d5db; white-space: pre-wrap;">${msg}</p>
            </div>
          </div>
          <div style="padding: 12px 24px; background: rgba(0,0,0,0.2); text-align: center; font-size: 11px; color: #6b7280;">
            Odoslané z webu Socializea Audio (testovací režim Resend)
          </div>
        </div>
      `
    } else if (body.subject && body.html) {
      // Spätná kompatibilita: starší formulár posiela hotový subject a html
      subject = body.subject
      html = body.html
    } else {
      throw new Error("Chýbajú údaje pre e‑mail – pošlite clientName alebo subject + html.")
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      throw new Error(error.message || "Chyba pri odosielaní emailu")
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Edge Function error:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})