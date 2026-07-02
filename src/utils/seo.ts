export interface EquipmentSeo {
  title: string;
  description: string;
  h1: string;
  h2: string;
  seoText: string;
}

const categoryLabels: Record<string, string> = {
  sound: 'zvuku a ozvučenia',
  lighting: 'svetiel a efektov',
  other: 'príslušenstva',
};

const categoryH2: Record<string, string> = {
  sound: 'Profesionálne zvukové vybavenie',
  lighting: 'Špičková svetelná a efektová technika',
  other: 'Nepostrádateľné príslušenstvo',
};

export function generateEquipmentSeo(name: string, category: string, price: number): EquipmentSeo {
  const categorySlovak = categoryLabels[category] || 'techniky';
  const h2Prefix = categoryH2[category] || 'Profesionálne vybavenie';

  // title – max 60 znakov
  const title = `Prenájom ${name} v Žiline, Čadci a Kysuciach`.substring(0, 60);

  // description – max 155 znakov
  let description = `Požičajte si kvalitnú techniku. ${name} na prenájom v Žiline a Čadci.`;
  if (price) description += ` Cena už od ${price} € / deň.`;
  if (categorySlovak) description += ` Ideálne na vašu akciu s ${categorySlovak}.`;
  description = description.substring(0, 155);

  // h1
  const h1 = `Prenájom ${name} v Žiline, Čadci a Kysuciach`;

  // h2
  const h2 = `${h2Prefix} – ${name} pre vašu akciu`;

  // seoText – dlhý text (150 – 200 slov)
  const seoText = `Prenajmite si profesionálne zariadenie ${name} v Žiline, Čadci a v celom regióne Kysuce. Naša ponuka ${categorySlovak} je vhodná na svadby, firemné akcie, oslavy, diskotéky a kultúrne podujatia v Žilinskom kraji. Všetky zariadenia sú pravidelne servisované a pripravené na okamžité použitie. Osobný odbor je možný v Čadci (Čadečka 1924) alebo v Žiline (Vysokoškolská 4, Budova SADOP). Techniku vám vieme aj dopraviť priamo na miesto konania v rámci celých Kysúc. Kontaktujte nás a my vám pripravíme nezáväznú cenovú ponuku na mieru. Zabezpečíme kompletnú montáž, obsluhu a demontáž techniky, aby ste sa mohli venovať len svojim hosťom.`;

  return { title, description, h1, h2, seoText };
}

export function generateEquipmentAlt(name: string): string {
  return `${name} – prenájom v Žiline, Čadci a Kysuciach`;
}