type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  packageName?: string;
  deliveryLat?: number;
  deliveryLng?: number;
};

type ReservationFormData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  cartSummaryHtml?: string;
  days?: number;
  totalPrice?: number;
  deliveryLat?: number;
  deliveryLng?: number;
};

type ProductInquiryData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  packageName?: string;
  deliveryLat?: number;
  deliveryLng?: number;
};

type PackageQuestionData = {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  packageName?: string;
  deliveryLat?: number;
  deliveryLng?: number;
};

export function generateEmailHtml(
  type: 'rezervacia' | 'package-question' | 'contact' | 'product-inquiry',
  data: ContactFormData | ReservationFormData | ProductInquiryData | PackageQuestionData
): string {
  const getTypeLabel = () => {
    switch (type) {
      case 'rezervacia':
        return '📋 Nová nezáväzná rezervácia';
      case 'package-question':
        return '❓ Otázka k balíku';
      case 'contact':
        return '📧 Kontaktný formulár';
      case 'product-inquiry':
        return '🔍 Dopyt na produkt';
      default:
        return 'Správa z webu';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'rezervacia':
        return '#BD20D3';
      case 'package-question':
        return '#1A4BFF';
      case 'contact':
        return '#10b981';
      case 'product-inquiry':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  const coordHtml =
    data.deliveryLat && data.deliveryLng
      ? `<div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:12px;padding:12px 14px;margin-top:16px;font-size:13px;color:#9ca3af;">
           <strong style="color:#10b981;display:block;margin-bottom:6px;">📍 GPS súradnice doručenia</strong>
           <div style="display:flex;justify-content:space-between;padding:6px 0;">
             <span>Zemepisná šírka (lat):</span>
             <span style="color:white;font-weight:600;font-family:monospace;">${data.deliveryLat.toFixed(6)}</span>
           </div>
           <div style="display:flex;justify-content:space-between;padding:6px 0;">
             <span>Zemepisná dĺžka (lng):</span>
             <span style="color:white;font-weight:600;font-family:monospace;">${data.deliveryLng.toFixed(6)}</span>
           </div>
           <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
             <a href="https://www.google.com/maps?q=${data.deliveryLat},${data.deliveryLng}" target="_blank" style="color:#1A4BFF;font-size:12px;font-weight:600;text-decoration:underline;">
               🌍 Otvoriť v Google Maps
             </a>
           </div>
         </div>`
      : '';

  const typeColor = getTypeColor();

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { margin: 0; padding: 0; background-color: #020721; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
          .card { background: #0a0d1f; border-radius: 20px; overflow: hidden; border: 1px solid rgba(189,32,211,0.3); box-shadow: 0 4px 24px rgba(189,32,211,0.2); }
          .header { padding: 28px 28px 16px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.5px; }
          .badge { display: inline-block; margin-top: 10px; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; color: white; background: ${typeColor}; }
          .body { padding: 4px 28px 28px; }
          .section { margin-bottom: 22px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 10px; }
          .field { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; }
          .field:last-child { border-bottom: none; }
          .field-label { color: #6b7280; min-width: 120px; }
          .field-value { color: white; font-weight: 600; text-align: right; max-width: 60%; word-break: break-word; }
          .message-box { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; font-size: 14px; color: #e5e7eb; line-height: 1.6; white-space: pre-wrap; }
          .footer { background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.08); padding: 20px 28px; text-align: center; }
          .footer p { margin: 0; font-size: 12px; color: #6b7280; }
          @media (max-width: 480px) {
            .container { padding: 12px 8px; }
            .header { padding: 20px 16px 12px; }
            .header h1 { font-size: 18px; }
            .body { padding: 0 16px 16px; }
            .field { flex-direction: column; align-items: flex-start; padding: 8px 0; }
            .field-value { text-align: left; max-width: 100%; margin-top: 4px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>${getTypeLabel()}</h1>
              <div class="badge">${data.name}</div>
            </div>
            <div class="body">
              <div class="section">
                <div class="section-title">📞 Kontaktné údaje</div>
                <div class="field"><span class="field-label">Meno a priezvisko</span><span class="field-value">${data.name}</span></div>
                <div class="field"><span class="field-label">E-mail</span><span class="field-value">${data.email}</span></div>
                <div class="field"><span class="field-label">Telefón</span><span class="field-value">${data.phone}</span></div>
              </div>
              <div class="section">
                <div class="section-title">📅 Dátum</div>
                <div class="field"><span class="field-label">Dátum / obdobie</span><span class="field-value">${data.date}</span></div>
                ${'days' in data && data.days ? `<div class="field"><span class="field-label">Počet dní</span><span class="field-value">${data.days}</span></div>` : ''}
              </div>
              ${'packageName' in data && data.packageName ? `
              <div class="section">
                <div class="section-title">📦 Balík</div>
                <div class="field"><span class="field-label">Názov balíka</span><span class="field-value">${data.packageName}</span></div>
              </div>
              ` : ''}
              ${'totalPrice' in data && data.totalPrice !== undefined ? `
              <div class="section">
                <div class="section-title">💰 Cena</div>
                <div class="field" style="border-bottom: 2px solid ${typeColor}; padding-bottom: 12px;">
                  <span class="field-label" style="font-weight:800;color:#e5e7eb;">Celková cena</span>
                  <span class="field-value" style="color:${typeColor};font-size:20px;font-weight:900;">${data.totalPrice.toFixed(2)} €</span>
                </div>
              </div>
              ` : ''}
              ${'cartSummaryHtml' in data && data.cartSummaryHtml ? `
              <div class="section">
                <div class="section-title">🛒 Súhrn objednávky</div>
                ${data.cartSummaryHtml}
              </div>
              ` : ''}
              ${coordHtml}
              <div class="section">
                <div class="section-title">💬 Správa</div>
                <div class="message-box">${data.message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Správa odoslaná z webového formulára<br />Socializea Audio</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}