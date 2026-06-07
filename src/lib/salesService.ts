import { supabase } from './supabase';

export interface SalesItem {
  id: string;
  name: string;
  price: number;
  condition: 'new' | 'used';
  description: string;
  images: string[];
  specs: string[];
  available: boolean;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'socializea_sales_items';

// Initial seed data if localStorage is empty
const initialSales: SalesItem[] = [
  {
    id: 'sale-1',
    name: 'Pioneer DJ DDJ-FLX4',
    price: 319,
    condition: 'new',
    description: '2-kanálový DJ ovládač ideálny pre začiatočníkov aj pokročilých. Podporuje rekordbox a Serato DJ Lite.',
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80'],
    specs: ['2 kanály', 'USB-C napájanie', 'Kompatibilný s PC/Mac/iOS/Android'],
    available: true
  },
  {
    id: 'sale-2',
    name: 'JBL SRX812P (Použité)',
    price: 950,
    condition: 'used',
    description: 'Profesionálny 12" dvojpásmový aktívny reprobox vo vynikajúcom stave. Minimálne známky používania, 100% funkčný.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
    specs: ['Výkon 2000W Peak', 'DSP riadenie cez Ethercon', 'Materiál: drevo'],
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
      return data || [];
    } catch (err) {
      // Fallback to local storage
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSales));
        return initialSales;
      }
      return JSON.parse(stored);
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