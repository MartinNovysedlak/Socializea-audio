// @ts-ignore - Deno typy nie sú dostupné v projekte
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// @ts-ignore - Deno je globálne dostupné v runtime
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")

const handler = async (req: Request): Promise<Response> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Chýba RESEND_API_KEY v Secrets")
    }

    const { to, subject, html } = await req.json()

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Chýbajú povinné polia: to, subject, html" }),
        { status: 400, headers: { ...headers, "Content-Type": "application/json" } }
      )
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error("Resend API error:", data)
      throw new Error(data.message || "Nepodarilo sa odoslať email")
    }

    console.log("Email odoslaný:", data)

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...headers, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Chyba:", error.message)

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
    )
  }
}

serve(handler)