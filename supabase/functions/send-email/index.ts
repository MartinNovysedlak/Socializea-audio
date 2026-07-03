import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log("Prijate data:", body) // Toto uvidis v logoch v Supabase

    // Zistime, o aky formular ide (ak chýba, berieme to ako 'contact')
    const formType = body.formType || 'contact'
    
    let htmlContent = ""
    let subject = ""

    if (formType === 'contact') {
      subject = "📩 Nová správa z webu (Kontakt)"
      htmlContent = `
        <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; font-family: sans-serif; border-radius: 10px;">
          <h2 style="color: #a855f7;">Nová kontaktná správa</h2>
          <hr style="border-color: #333;" />
          <p><strong>Meno:</strong> ${body.customerName || body.name || 'Neuvedené'}</p>
          <p><strong>Email:</strong> <a href="mailto:${body.customerEmail || body.email}" style="color: #60a5fa;">${body.customerEmail || body.email || 'Neuvedené'}</a></p>
          <p><strong>Telefón:</strong> ${body.phone || 'Neuvedené'}</p>
          <h3 style="color: #a855f7; margin-top: 20px;">Správa:</h3>
          <p style="background-color: #2d2d2d; padding: 15px; border-radius: 5px;">${body.message || 'Žiadna správa'}</p>
        </div>
      `
    } else {
      subject = "🎉 Nová rezervácia aparatúry!"
      
      // Vygenerovanie tabuľky aparatúry (bezpečné overenie cez ?.)
      let cartHtml = ""
      if (body.cartItems && body.cartItems.length > 0) {
        cartHtml = `
          <h3 style="color: #a855f7;">🎧 Aparatúra</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #fff;">
            <tr style="border-bottom: 1px solid #444; text-align: left;">
              <th style="padding: 10px;">Položka</th>
              <th style="padding: 10px;">Počet</th>
              <th style="padding: 10px;">Cena</th>
            </tr>
            ${body.cartItems.map((item: any) => `
              <tr style="border-bottom: 1px solid #333;">
                <td style="padding: 10px;">${item.name || item.title}</td>
                <td style="padding: 10px;">${item.quantity || 1}x</td>
                <td style="padding: 10px;">${item.price} €</td>
              </tr>
            `).join('')}
          </table>
        `
      }

      htmlContent = `
        <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; font-family: sans-serif; border-radius: 10px;">
          <h2 style="color: #a855f7;">Nová rezervácia</h2>
          <p><strong>Klient:</strong> ${body.customerName || 'Neuvedené'}</p>
          <p><strong>Email:</strong> ${body.customerEmail || 'Neuvedené'}</p>
          <p><strong>Dátum akcie:</strong> ${body.eventDate || 'Neuvedené'}</p>
          <hr style="border-color: #333; margin: 20px 0;" />
          ${cartHtml}
          <h3 style="color: #a855f7;">📦 Balíky:</h3>
          <p style="background-color: #2d2d2d; padding: 10px; border-radius: 5px;">
            ${body.packages ? JSON.stringify(body.packages) : (body.selectedPackage || 'Žiadne balíky')}
          </p>
          <h2 style="color: #22c55e; margin-top: 20px;">Celková suma: ${body.totalPrice || 'Nevyčíslená'} €</h2>
        </div>
      `
    }

    const data = await resend.emails.send({
      from: 'Socializea Audio <onboarding@resend.dev>',
      to: 'martinnovysedlak48@gmail.com',
      subject: subject,
      html: htmlContent,
    })

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error("Fatal Error vo funkcii:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Vrátime 400 s jsonom, aby frontend vedel, čo sa stalo
    })
  }
})