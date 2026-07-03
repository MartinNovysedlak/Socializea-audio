"use client";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
}

export interface ReservationFormData extends ContactFormData {
  cartSummaryHtml: string;
  days: number;
  totalPrice: number;
  /** Plná cena za 1. deň (aparát) */
  firstDayTotal?: number;
  /** Suma za ďalšie dni so zľavou 50 % */
  additionalDaysTotal?: number;
  /** Počet dní okrem prvého */
  discountDaysCount?: number;
}

export interface ProductInquiryData extends ContactFormData {
  productName: string;
  productPrice: string;
  productCondition: string;
}

export function generateEmailHtml(
  type: 'contact' | 'rezervacia' | 'produkt',
  data: ContactFormData | ReservationFormData | ProductInquiryData
): string {
  switch (type) {
    case 'contact':
      return buildBaseHtml({
        title: '📬 Nový kontaktný dopyt',
        subtitle: 'Kontaktný formulár z webu Socializea-audio',
        content: buildContactContent(data as ContactFormData),
      });
    case 'produkt':
      return buildBaseHtml({
        title: '🛒 Dopyt na kúpu produktu',
        subtitle: 'Záujem o kúpu z webu Socializea-audio',
        content: buildProductContent(data as ProductInquiryData),
      });
    case 'rezervacia':
      return buildBaseHtml({
        title: '🔊 Nová nezáväzná rezervácia',
        subtitle: 'Kalkulácia a rezervácia z webu Socializea-audio',
        content: buildReservationContent(data as ReservationFormData),
      });
    default:
      return '';
  }
}

// -------------------- BASE WRAPPER --------------------

function buildBaseHtml(opts: { title: string; subtitle: string; content: string }): string {
  return `
<div style="background:#020721;color:white;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid rgba(189,32,211,0.3);">
  <div style="background:linear-gradient(135deg,#0a0d1f,#020721);padding:30px 24px 20px;text-align:center;border-bottom:1px solid rgba(189,32,211,0.2);">
    <h1 style="color:#BD20D3;font-size:24px;margin:0;">${opts.title}</h1>
    <p style="color:#9ca3af;font-size:14px;margin-top:8px;">${opts.subtitle}</p>
  </div>

  <div style="padding:24px;">
    ${opts.content}

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(189,32,211,0.2);text-align:center;">
      <p style="color:#9ca3af;font-size:12px;">Tento e-mail bol odoslaný automaticky z webovej stránky <a href="https://socializea.sk" style="color:#BD20D3;text-decoration:none;">Socializea-audio</a>.</p>
    </div>
  </div>
</div>`;
}

// -------------------- KONTAKTNÉ ÚDAJE (vylepšené rozloženie) --------------------

function buildContactInfo(data: { name: string; email: string; phone: string; date: string }): string {
  return `
<h2 style="color:#BD20D3;font-size:16px;margin:0 0 16px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
<table style="width:100%;font-size:14px;color:#d1d5db;border-collapse:separate;border-spacing:0 4px;">
  <tr>
    <td style="padding:6px 16px 6px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Meno:</td>
    <td style="padding:6px 0;color:white;font-weight:600;">${escapeHtml(data.name)}</td>
  </tr>
  <tr>
    <td style="padding:6px 16px 6px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">E-mail:</td>
    <td style="padding:6px 0;color:#BD20D3;">${escapeHtml(data.email)}</td>
  </tr>
  <tr>
    <td style="padding:6px 16px 6px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Telefón:</td>
    <td style="padding:6px 0;color:white;">${escapeHtml(data.phone)}</td>
  </tr>
  <tr>
    <td style="padding:6px 16px 6px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Dátum:</td>
    <td style="padding:6px 0;color:white;">${escapeHtml(data.date)}</td>
  </tr>
</table>`;
}

// -------------------- SPRÁVA --------------------

function buildMessageBlock(message: string): string {
  if (!message.trim()) return '';
  return `
<h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
<div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;color:#d1d5db;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</div>`;
}

// -------------------- KONTAKT --------------------

function buildContactContent(data: ContactFormData): string {
  return `
    ${buildContactInfo(data)}
    ${buildMessageBlock(data.message)}
  `;
}

// -------------------- PRODUKT --------------------

function buildProductContent(data: ProductInquiryData): string {
  return `
    ${buildContactInfo(data)}

    <h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">🛒 Záujem o produkt</h2>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;font-size:14px;line-height:1.8;">
      <table style="width:100%;color:#d1d5db;border-spacing:0 4px;">
        <tr>
          <td style="padding:4px 16px 4px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Produkt:</td>
          <td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(data.productName)}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Stav:</td>
          <td style="padding:4px 0;color:${data.productCondition === 'new' ? '#10b981' : '#f59e0b'};font-weight:600;">${data.productCondition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}</td>
        </tr>
        <tr>
          <td style="padding:4px 16px 4px 0;color:#9ca3af;width:120px;vertical-align:middle;white-space:nowrap;">Cena:</td>
          <td style="padding:4px 0;color:#BD20D3;font-weight:700;">${escapeHtml(data.productPrice)}</td>
        </tr>
      </table>
    </div>

    ${buildMessageBlock(data.message)}
  `;
}

// -------------------- REZERVÁCIA (s podrobným rozpisom cien a zľavou) --------------------

function buildReservationContent(data: ReservationFormData): string {
  // Zostavíme samostatný súhrn cien pre prehľadnosť
  const priceRows: string[] = [];

  if (data.firstDayTotal !== undefined && data.firstDayTotal > 0) {
    priceRows.push(priceRow('1. deň (plná cena)', data.firstDayTotal));
  }

  if (data.discountDaysCount && data.discountDaysCount > 0 && data.additionalDaysTotal !== undefined) {
    const label = `${data.discountDaysCount} ${data.discountDaysCount === 1 ? 'ďalší deň' : data.discountDaysCount < 5 ? 'ďalšie dni' : 'ďalších dní'} (50 %)`;
    priceRows.push(priceRow(label, data.additionalDaysTotal));
    priceRows.push(discountRow(data.additionalDaysTotal));
  }

  return `
    ${buildContactInfo(data)}

    <h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">📦 Obsah košíka</h2>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;font-size:13px;">
      ${data.cartSummaryHtml}
    </div>

    ${priceRows.length > 0 ? `
    <h2 style="color:#BD20D3;font-size:16px;margin:24px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💰 Rozpis cien za prenájom</h2>
    <div style="background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;font-size:13px;line-height:1.6;">
      ${priceRows.join('\n')}
    </div>
    ` : ''}

    <div style="margin-top:20px;padding:16px;background:rgba(189,32,211,0.1);border:1px solid rgba(189,32,211,0.2);border-radius:12px;text-align:center;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 4px;">Počet dní prenájmu: <strong style="color:white;">${data.days}</strong></p>
      <p style="color:white;font-size:20px;font-weight:900;margin:0;">Celková suma: <span style="color:#BD20D3;">${data.totalPrice.toFixed(2)} €</span></p>
    </div>

    ${buildMessageBlock(data.message)}
  `;
}

// -------------------- POMOCNÉ ROW-Y --------------------

function priceRow(label: string, amount: number): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;">
    <span style="color:#9ca3af;">${label}</span>
    <span style="color:white;font-weight:600;min-width:100px;text-align:right;">${amount.toFixed(2)} €</span>
  </div>`;
}

function discountRow(savedAmount: number): string {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-top:1px solid rgba(16,185,129,0.3);margin-top:4px;padding-top:8px;">
    <span style="color:#10b981;font-weight:600;">✅ Zľava za dlhodobý prenájom (50 % na ďalšie dni)</span>
    <span style="color:#10b981;font-weight:700;min-width:100px;text-align:right;">– ${savedAmount.toFixed(2)} €</span>
  </div>`;
}

// -------------------- ESCAPE --------------------

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}