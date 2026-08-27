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
  brand?: string;
  gtin?: string;
  mpn?: string;
}

const LOCAL_STORAGE_KEY = 'socializea_sales_items';

function mapSalesRow(item: SalesItem): SalesItem {
  return {
    ...item,
    specs: Array.isArray(item.specs) ? item.specs : [],
    features: Array.isArray(item.features) ? item.features : [],
    images: Array.isArray(item.images) ? item.images : [],
    available_count: item.available_count ?? (item.available ? 1 : 0),
  };
}

export const salesService = {
  async getAll(): Promise<SalesItem[]> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }

    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
      return [];
    }

    return (data || []).map(mapSalesRow);
  },

  async getById(id: string): Promise<SalesItem | null> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching sale:', error);
      return null;
    }

    return mapSalesRow(data);
  },

  async create(item: Omit<SalesItem, 'id' | 'created_at'>): Promise<SalesItem | null> {
    const newItem: SalesItem = {
      ...item,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('sales')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error('Error creating sale:', error);
      return null;
    }

    return mapSalesRow(data);
  },

  async update(id: string, updatedFields: Partial<Omit<SalesItem, 'id' | 'created_at'>>): Promise<SalesItem | null> {
    const { data, error } = await supabase
      .from('sales')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating sale:', error);
      return null;
    }

    return mapSalesRow(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting sale:', error);
      return false;
    }

    return true;
  },
};
