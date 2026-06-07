import { supabase } from './supabase';

export interface SalesItem {
  id: string;
  name: string;
  price: number;
  condition: 'new' | 'used';
  description: string;
  images: string[];
  specs: string[];
  features: string[];
  available_count: number;
  available: boolean;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'socializea_sales_items';

const initialSales: SalesItem[] = [
  {
    id: 'sale-3',
    name: 'Profesionálny výkonný pohyblivý Laserový BAR 65W (červený)',
    price: 270,
    condition: 'new',
    description: 'Profesionálny výkonný pohyblivý Laserový BAR o výkone 65W je ideálnou voľbou pre DJ akcie, kluby, bary, diskotéky, svadby, eventy alebo domáce party. Táto moderná svetelná technika s precíznym laserovým systémom umožňuje vytváranie intenzívnych, ostrých červených laserových efektov, ktoré vo vašich priestoroch navodia nezameniteľnú dynamickú atmosféru. Vďaka kompaktným rozmerom (cca 106 x 8,5 x 18 cm) a robustnému prevedeniu je vhodný do rôznych scenérií.',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=80'],
    specs: [
      'Napájanie: AC 100-240V / 50-60 Hz',
      'Spotreba: 65W',
      'Svetelný zdroj: 8x 500mW červený polovodičový laser (TTL)',
      'Laserová vlnová dĺžka: 638nm',
      'DMX kanály: 15CH',
      'Pripojenie: 3-pin XLR vstup/výstup'
    ],
    features: [
      '8x červený laser: Výkonné polovodičové lasery (8x 500mW)',
      'Pohyblivá hlava: Umožňuje pohyb s uhlom otočenia do 180°',
      'Rôzne režimy: Automat, Sound active, DMX512, Master-slave',
      'Jednoduchá montáž: Digitálny displej, flexibilná konštrukcia'
    ],
    available_count: 2,
    available: true
  },
  {
    id: 'sale-4',
    name: 'Profesionálna otočná a rotujúca RGBW LED hlava 90W',
    price: 140,
    condition: 'new',
    description: 'Profesionálna rotujúca RGBW hlava o výkone 90W je ideálna pre DJ akcie, koncerty, klubové večery a ďalšie podobné udalosti. Táto inovatívna svetelná technika prinesie do vašich vystúpení dynamický a farebný vizuálny efekt. Hlava disponuje robustnou konštrukciou z odolných materiálov, čo zaručuje dlhú životnosť aj pri náročnom používaní.',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'],
    specs: [
      'Napájanie: 90-240V 50/60 Hz',
      'Spotreba: 120W',
      'Svetelný zdroj: 90W RGBW 4v1 LED',
      'Rozsah pohybu: Horizontálne: 540°, Vertikálne: 180°',
      'Uhol vyžarovania: 3°',
      'DMX kanál: 13 / 15 CH',
      'Hmotnosť: 4 kg'
    ],
    features: [
      'RGBW LED osvetlenie: Miešanie farieb vrátane čistej bielej',
      'Rotácia a pohyb: Široké smery pre zaujímavé vzory',
      'Viacero režimov: Zvukový režim, prednastavené programy, manuál'
    ],
    available_count: 4,
    available: true
  },
  {
    id: 'sale-5',
    name: 'Profesionálny výrobník ohňa – Flame Machine',
    price: 120,
    condition: 'new',
    description: 'Dramatické a nezabudnuteľné efekty na vašich koncertoch a vystúpeniach. Flame Machine dokáže produkovať realistický a bezpečný plameň. Ideálna pre kluby, pódiá a divadlá.\n\nAKCIA:\nCena za 1 kus: 120 €\nZvýhodnená cena za 2 kusy: 200 €',
    images: ['https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800&auto=format&fit=crop&q=80'],
    specs: [
      'Palivo: Silikónový olej v spreji',
      'Ovládanie: DMX512',
      'Inštalácia: Bezpečné ukotvenie o zem'
    ],
    features: [
      'Jednoduché ovládanie: Nastaviteľná dĺžka trvania cez DMX',
      'Ľahká prenosnosť: Kompaktné rozmery a jednoduchá inštalácia',
      'Vysoká kvalita: Odolné materiály pre dlhú životnosť',
      'Jednoduché plnenie: Bežne dostupné náplne'
    ],
    available_count: 2,
    available: true
  },
  {
    id: 'sale-6',
    name: 'Profesionálna RGBW 4v1 LED BAR svetelná lišta 36W',
    price: 35,
    condition: 'new',
    description: 'Profesionálna RGBW 4v1 LED BAR svetelná lišta o výkone 36W, ideálna pre DJ akcie, kluby, diskotéky, svadby a divadlá. Vytvára bohaté farebné efekty a pridáva vašim podujatiam dynamickú atmosféru. Kompaktný dizajn z plastového puzdra s digitálnym displejom pre jednoduchú obsluhu.',
    images: ['https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80'],
    specs: [
      'Napájanie: AC 110-240V 50/60 Hz',
      'Spotreba: 36W',
      'Svetelný zdroj: 9 x 4W RGBW 4v1 LED',
      'DMX kanály: 8CH / 4CH',
      'Ochrana: IP20',
      'Hmotnosť: cca 2 kg'
    ],
    features: [
      'RGBW LED osvetlenie: 9 kusov 4W LED pre vysokú reprodukciu farieb',
      'Dynamické efekty: Blikanie, stmievanie, skákanie s nastavením tempa',
      'Flexibilné ovládanie: Diaľkový ovládač (5m), Sound activated, DMX512'
    ],
    available_count: 8,
    available: true
  },
  {
    id: 'sale-1',
    name: 'Pioneer DJ DDJ-FLX4',
    price: 319,
    condition: 'new',
    description: '2-kanálový DJ ovládač ideálny pre začiatočníkov aj pokročilých. Podporuje rekordbox a Serato DJ Lite. Ponúka intuitívne rozloženie ovládacích prvkov a moderné funkcie pre domáce nahrávanie aj živé hranie.',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80'],
    specs: [
      'Počet kanálov: 2',
      'USB-C napájanie pre plug-and-play',
      'Podpora rekordbox, Serato, djay, edjing',
      'Zabudovaná zvuková karta'
    ],
    features: [
      'Smart Fader a Smart Color FX pre hladké prechody',
      'Kompatibilný s PC, Mac, iOS a Android',
      'Mikrofónny vstup s priamym smerovaním do USB audia',
      'Kompaktné a ľahké prenosné šasi'
    ],
    available_count: 3,
    available: true
  }
];

export const salesService = {
  async getAll(): Promise<SalesItem[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        specs: Array.isArray(item.specs) ? item.specs : [],
        features: Array.isArray(item.features) ? item.features : [],
        available_count: item.available_count ?? (item.available ? 1 : 0)
      }));
    } catch (err) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSales));
        return initialSales;
      }
      return JSON.parse(stored);
    }
  },

  async getById(id: string): Promise<SalesItem | null> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        specs: Array.isArray(data.specs) ? data.specs : [],
        features: Array.isArray(data.features) ? data.features : [],
        available_count: data.available_count ?? (data.available ? 1 : 0)
      };
    } catch (err) {
      const items = await this.getAll();
      return items.find(i => i.id === id) || null;
    }
  },

  async create(item: Omit<SalesItem, 'id' | 'created_at'>): Promise<SalesItem> {
    const newItem: SalesItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('sales')
        .insert({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          condition: newItem.condition,
          description: newItem.description,
          images: newItem.images,
          specs: newItem.specs,
          features: newItem.features,
          available_count: newItem.available_count,
          available: newItem.available
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const items = await this.getAll();
      items.unshift(newItem);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      return newItem;
    }
  },

  async update(id: string, updatedFields: Partial<Omit<SalesItem, 'id' | 'created_at'>>): Promise<SalesItem | null> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({
          name: updatedFields.name,
          price: updatedFields.price,
          condition: updatedFields.condition,
          description: updatedFields.description,
          images: updatedFields.images,
          specs: updatedFields.specs,
          features: updatedFields.features,
          available_count: updatedFields.available_count,
          available: updatedFields.available
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const items = await this.getAll();
      const idx = items.findIndex(i => i.id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...updatedFields };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        return items[idx];
      }
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      const items = await this.getAll();
      const updated = items.filter(i => i.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return true;
    }
  }
};