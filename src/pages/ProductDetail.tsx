"use client";

// ... keep existing imports and code ...

// Nájdeme volanie generateEmailHtml – v riadku asi 91
// Zmeníme 'produkt' na 'product-inquiry'

// Predtým:
// const htmlContent = generateEmailHtml('produkt', { ... });

// Po oprave:
const htmlContent = generateEmailHtml('product-inquiry', {
  name: `${inquiryFirstName} ${inquiryLastName}`,
  email: inquiryEmail,
  phone: inquiryPhone || 'Neuvedený',
  date: 'Dopyt na produkt',
  message: inquiryMessage,
  packageName: product?.name || 'Neznámy produkt',
});

// ... keep rest of the file ...