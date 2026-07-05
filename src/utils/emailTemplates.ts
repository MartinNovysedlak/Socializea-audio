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
}

export interface ProductInquiryData extends ContactFormData {
  productName: string;
  productPrice: string;
  productCondition: string;
  quantity?: number;
}

export interface PackageQuestionData extends ContactFormData {
  packageName: string;
}

export function generateEmailHtml(
  type: 'contact' | 'rezervacia' | 'produkt' | 'package-question',
  data: ContactFormData | ReservationFormData | ProductInquiryData | PackageQuestionData
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
    case 'package-question':
      return buildBaseHtml({
        title: '📦 Otázka k balíku',
        subtitle: 'Zákazník sa pýta na konkrétny balík z webu Socializea-audio',
        content: buildPackageQuestionContent(data as PackageQuestionData),
      });
    default:
      return '';
  }
}

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

function buildContactInfo(data: { name: string; email: string; phone: string; date: string }, showDate: boolean = true): string {
  let rows = `
    <tr><td style="padding:4px 0;color:#9ca3af;width:100px;">Meno:</td><td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:4px 0;color:#9ca3af;">E-mail:</td><td style="padding:4px 0;color:#BD20D3;">${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding:4px 0;color:#9ca3af;">Telefón:</td><td style="padding:4px 0;color:white;">${escapeHtml(data.phone)}</td></tr>`;
  if (showDate) {
    rows += `
    <tr><td style="padding:4px 0;color:#9ca3af;">Dátum:</td><td style="padding:4px 0;color:white;">${escapeHtml(data.date)}</td></tr>`;
  }
  return `
<h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
<table style="width:100%;font-size:14px;color:#d1d5db;">
  ${rows}
</table>`;
}

function buildMessageBlock(message: string): string {
  if (!message.trim()) return '';
  return `
<h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">💬 Správa</h2>
<div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;color:#d1d5db;font-size:13px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(message)}</div>`;
}

function buildContactContent(data: ContactFormData): string {
  return `
    ${buildContactInfo(data, true)}
    ${buildMessageBlock(data.message)}
  `;
}

function buildProductContent(data: ProductInquiryData): string {
  // Zobrazíme počet kusov namiesto dátumu
  const contactInfoRows = `
    <tr><td style="padding:4px 0;color:#9ca3af;width:100px;">Meno:</td><td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:4px 0;color:#9ca3af;">E-mail:</td><td style="padding:4px 0;color:#BD20D3;">${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding:4px 0;color:#9ca3af;">Telefón:</td><td style="padding:4px 0;color:white;">${escapeHtml(data.phone)}</td></tr>
    <tr><td style="padding:4px 0;color:#9ca3af;">Počet kusov:</td><td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(String(data.quantity || 'Neuvedený'))}</td></tr>`;

  return `
    <h2 style="color:#BD20D3;font-size:16px;margin:0 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">👤 Kontaktné údaje</h2>
    <table style="width:100%;font-size:14px;color:#d1d5db;">
      ${contactInfoRows}
    </table>

    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">🛒 Záujem o produkt</h2>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;font-size:14px;">
      <table style="width:100%;color:#d1d5db;">
        <tr><td style="padding:4px 0;color:#9ca3af;width:100px;">Produkt:</td><td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(data.productName)}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Stav:</td><td style="padding:4px 0;color:${data.productCondition === 'new' ? '#10b981' : '#f59e0b'};font-weight:600;">${data.productCondition === 'new' ? 'Nový kus' : 'B-Stock / Použitý'}</td></tr>
        <tr><td style="padding:4px 0;color:#9ca3af;">Cena:</td><td style="padding:4px 0;color:#BD20D3;font-weight:700;">${escapeHtml(data.productPrice)}</td></tr>
      </table>
    </div>

    ${buildMessageBlock(data.message)}
  `;
}

function buildReservationContent(data: ReservationFormData): string {
  return `
    ${buildContactInfo(data, true)}

    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">📦 Obsah košíka</h2>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;font-size:13px;">
      ${data.cartSummaryHtml}
    </div>

    <div style="margin-top:16px;padding:12px;background:rgba(189,32,211,0.1);border:1px solid rgba(189,32,211,0.2);border-radius:12px;text-align:center;">
      <p style="color:#9ca3af;font-size:13px;margin:0 0 4px;">Počet dní prenájmu: <strong style="color:white;">${data.days}</strong></p>
      <p style="color:white;font-size:20px;font-weight:900;margin:0;">Celková suma: <span style="color:#BD20D3;">${data.totalPrice.toFixed(2)} €</span></p>
    </div>

    ${buildMessageBlock(data.message)}
  `;
}

function buildPackageQuestionContent(data: PackageQuestionData): string {
  return `
    ${buildContactInfo(data, false)}

    <h2 style="color:#BD20D3;font-size:16px;margin:20px 0 12px;border-bottom:1px solid rgba(189,32,211,0.2);padding-bottom:8px;">📦 Otázka k balíku</h2>
    <div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;font-size:14px;">
      <table style="width:100%;color:#d1d5db;">
        <tr><td style="padding:4px 0;color:#9ca3af;width:100px;">Balík:</td><td style="padding:4px 0;color:white;font-weight:600;">${escapeHtml(data.packageName)}</td></tr>
      </table>
    </div>

    ${buildMessageBlock(data.message)}
  `;
}

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