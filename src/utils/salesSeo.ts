export interface SalesSeo {
  title: string;
  description: string;
  h1: string;
  h2: string;
  seoText: string;
}

const salesCategoryInfo: Record<string, { label: string; seoDesc: string }> = {
  'Profesionálny výkonný pohyblivý Laserový BAR 65W (červený)': {
    label: 'laserovej techniky',
    seoDesc: 'Výkonný pohyblivý laserový bar s 8 červenými lasermi'
  },
  'Profesionálna otočná a rotujúca RGBW LED hlava 90W': {
    label: 'svetelnej techniky',
    seoDesc: 'Výkonná RGBW LED hlava'
  },
  'Profesionálny výrobník ohňa – Flame Machine': {
    label: 'efektovej techniky',
    seoDesc: 'Profesionálny flame machine'
  },
  'Profesionálna RGBW 4v1 LED BAR svetelná lišta 36W': {
    label: 'svetelnej techniky',
    seoDesc: 'RGBW LED lišta'
  },
  'Pioneer DJ DDJ-FLX4': {
    label: 'DJ techniky',
    seoDesc: 'DJ ovládač Pioneer'
  }
};

const defaultLabel = 'zvukovej a svetelnej techniky';

export function generateSalesSeo(
  name: string,
  price: number,
  condition: 'new' | 'used'
): SalesSeo {
  const label = salesCategoryInfo[name]?.label || defaultLabel;
  const shortDesc = salesCategoryInfo[name]?.seoDesc || name.split(' ').slice(0, 3).join(' ');

  const status = condition === 'new' ? 'Nový kus' : 'B-Stock / Použitý';

  // title – max 60 znakov
  const title = `${shortDesc} ${name} na predaj Žilina, Čadca - ${price} €`.substring(0, 60);

  // description – max 155 znakov
  const description = `${status}: Kúpte si ${name} za ${price} €. Osobný odber v Žiline alebo Čadci. Možnosť dopravy po Kysuciach.`.substring(0, 155);

  // h1
  const h1 = `${name} na predaj v Žiline a Čadci`;

  // h2
  const h2 = `${status} – ${shortDesc} za výhodnú cenu ${price} €`;

  // seoText – dlhý text (150 – 200 slov)
  const seoText = `Kúpte si profesionálne zariadenie ${name} v Žiline, Čadci a v celom regióne Kysuce. Naša ponuka ${label} je vhodná pre DJ-ov, kluby, organizátorov akcií a nadšencov kvalitného zvuku a svetla. ${condition === 'new' ? 'Ide o úplne nový kus v originálnom balení s plnou zárukou a faktúrou.' : 'Ide o preverený B-Stock kus, ktorý prešiel kompletným testovaním a je v plne funkčnom stave.'} Cena je ${price} € vrátane DPH. Osobný odber je možný v Čadci (Čadečka 1924) alebo v Žiline (Vysokoškolská 4, Budova SADOP). Techniku vám vieme aj dopraviť priamo na miesto v rámci celých Kysúc. Na všetky predávané zariadenia poskytujeme záruku a riadnu faktúru. Kontaktujte nás telefonicky alebo emailom a my vám pripravíme individuálnu ponuku.`;

  return { title, description, h1, h2, seoText };
}

export function generateSalesAlt(name: string): string {
  return `${name} – predaj v Žiline a Čadci`;
}