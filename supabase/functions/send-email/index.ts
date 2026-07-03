import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

// Vytiahnutie kľúča, ktorý si uložil v kroku 2
const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

// Cors hlavičky sú nutné, aby tvoj web mohol komunikovať s funkciou
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Ošetrenie OPTIONS požiadavky pre prehliadače
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Dáta, ktoré pošleš z Reactu (napr. meno, balik, email)
    const body = await req.json()

    const data = await resend.emails.send({
      from: 'Socializea Audio <onboarding@resend.dev>', // Zatiaľ nechaj tento testovací
      to: 'socializea@socializea.com', // Tu daj SVOJ email, kam chceš dostávať notifikácie
      subject: 'Nová rezervácia z webu!',
      html: `<p>Máš novú rezerváciu od klienta: <strong>${body.meno}</strong>.</p><p>Zvolený balík: <strong>${body.balik}</strong>.</p><p>Kontakt na klienta: ${body.email}</p>`,
    })

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})