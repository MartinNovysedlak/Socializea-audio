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
  },
  {
    id: 'sale-2',
    name: 'JBL SRX812P (Použité)',
    price: 950,
    condition: 'used',
    description: 'Profesionálny 12" dvojpásmový aktívny reprobox vo vynikajúcom stave. Ponúka nekompromisný zvukový prednes, robustnú drevenú konštrukciu a integrované DSP riadenie.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    specs: [
      'Výkon: 2000 W Peak / 1500 W Continuous',
      'Reproduktor: 12" basový + 3" neodymový výškový',
      'Max SPL: 136 dB',
      'Frekvenčný rozsah: 40 Hz - 21 kHz'
    ],
    features: [
      'Integrované DSP riadenie cez sieťový Ethercon',
      'Prémiové meniče JBL a zosilňovač Crown DriveCore',
      'Skriňa z odolnej 18 mm preglejky s lakom Duraflex',
      'Množstvo závesných bodov M10 pre fixné inštalácie'
    ],
    available_count: 1,
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