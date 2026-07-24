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
  /** Google Merchant – voliteľné */
  brand?: string;
  gtin?: string;
  mpn?: string;
}

const LOCAL_STORAGE_KEY = 'socializea_sales_items';

const initialSales: SalesItem[] = [
  {
    id: 'sale-3',
    name: 'Profesionálny výkonný pohyblivý Laserový BAR 65W (červený)',
    price: 270,
    condition: 'new',
    description: 'Profesionálny výkonný pohyblivý Laserový BAR o výkone 65W je ideálnou voľbou pre DJ akcie, kluby, bary, diskotéky, svadby, eventy alebo domáce party. Táto moderná svetelná technika s precíznym laserovým systémom umožňuje vytváranie intenzívnych, ostrých červených laserových efektov, ktoré vo vašich priestoroch navodia nezameniteľnú dynamickú atmosféru.',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'],
    specs: [
      'Napájanie: AC 100-240V / 50-60 Hz',
      'Spotreba: 65W',
      'Svetelný zdroj: 8x 500mW červený polovodičový laser (TTL)',
      'Laserová vlnová dĺžka: 638nm',
      'DMX kanály: 15CH'
    ],
    features: [
      '8x červený laser: Výkonné polovodičové lasery',
      'Pohyblivá hlava: Otočenie do 180°',
      'Rôzne režimy: Automat, Sound active, DMX512',
      'Jednoduchá montáž: Digitálny displej'
    ],
    available_count: 2,
    available: true
  },
  {
    id: 'sale-4',
    name: 'Profesionálna otočná a rotujúca RGBW LED hlava 90W',
    price: 140,
    condition: 'new',
    description: 'Profesionálna rotujúca RGBW hlava o výkone 90W je ideálna pre DJ akcie, koncerty a klubové večery. Prinesie do vašich vystúpení dynamický a farebný vizuálny efekt. Robustná konštrukcia zaručuje dlhú životnosť.',
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
    specs: [
      'Napájanie: 90-240V 50/60 Hz',
      'Svetelný zdroj: 90W RGBW 4v1 LED',
      'Rozsah pohybu: Horizontálne: 540°, Vertikálne: 180°',
      'Uhol vyžarovania: 3°',
      'DMX kanál: 13 / 15 CH'
    ],
    features: [
      'RGBW LED osvetlenie: Miešanie farieb vrátane bielej',
      'Rotácia a pohyb: Široké smery pre zaujímavé vzory',
      'Režimy: Zvuk, programy, manuál'
    ],
    available_count: 4,
    available: true
  },
  {
    id: 'sale-5',
    name: 'Profesionálny výrobník ohňa – Flame Machine',
    price: 120,
    condition: 'new',
    description: 'Dramatické efekty pre koncerty a vystúpenia. Produkcia realistického a bezpečného plameňa. AKCIA: Cena za 1 kus: 120 €, Zvýhodnená cena za 2 kusy: 200 €.',
    images: ['https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=800'],
    specs: [
      'Palivo: Silikónový olej v spreji',
      'Ovládanie: DMX512',
      'Inštalácia: Bezpečné ukotvenie'
    ],
    features: [
      'Ovládanie: Nastaviteľná dĺžka plameňa cez DMX',
      'Prenositeľnosť: Jednoduchá inštalácia',
      'Kvalita: Odolné materiály',
      'Plnenie: Bežne dostupné náplne'
    ],
    available_count: 2,
    available: true
  },
  {
    id: 'sale-6',
    name: 'Profesionálna RGBW 4v1 LED BAR svetelná lišta 36W',
    price: 35,
    condition: 'new',
    description: 'Ideálna pre DJ akcie, kluby, svadby a divadlá. Vytvára bohaté farebné efekty a dynamickú atmosféru. Kompaktný dizajn s digitálnym displejom.',
    images: ['https://images.unsplash.com/photo-1557683316-973673baf926?w=800'],
    specs: [
      'Napájanie: AC 110-240V 50/60 Hz',
      'Svetelný zdroj: 9 x 4W RGBW 4v1 LED',
      'DMX kanály: 8CH / 4CH',
      'Ochrana: IP20'
    ],
    features: [
      'RGBW LED: 9ks 4W LED diód',
      'Efekty: Blikanie, stmievanie, skákanie',
      'Ovládanie: Diaľkový ovládač, Sound active, DMX512'
    ],
    available_count: 8,
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
      
      // Ak je DB prázdna, vrátime initialSales
      if (!data || data.length === 0) {
        throw new Error('Empty database');
      }

      return (data || []).map(item => ({
        ...item,
        specs: Array.isArray(item.specs) ? item.specs : [],
        features: Array.isArray(item.features) ? item.features : [],
        available_count: item.available_count ?? (item.available ? 1 : 0)
      }));
    } catch (err) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      let items: SalesItem[] = stored ? JSON.parse(stored) : [...initialSales];
      
      // MIGRÁCIA: Skontrolujeme, či v stored nechýbajú nové produkty z initialSales
      let updated = false;
      initialSales.forEach(initialItem => {
        if (!items.find(item => item.id === initialItem.id)) {
          items.push(initialItem);
          updated = true;
        }
      });

      if (updated || !stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      }
      
      return items;
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
      return data;
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
        .insert(newItem)
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
        .update(updatedFields)
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