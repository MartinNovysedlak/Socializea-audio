import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@4.1.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
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
    const { to, subject, html, from } = body

    if (!to || !subject || !html) {
      throw new Error("Chýbajú povinné polia: to, subject, html")
    }

    const { data, error } = await resend.emails.send({
      from: from || "Socializea Audio <onboarding@resend.dev>",
      to: [to],
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