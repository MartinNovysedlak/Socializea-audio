import { supabase } from './supabase';

export interface RentalItemData {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  description: string | null;
  price: number | null;
  available: boolean;
  /** Počet kusov skladom (numerická hodnota z DB) */
  availableCount: number;
}

export const rentalService = {
  async getAll(): Promise<RentalItemData[]> {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, main_image, category, description, price_per_day, available')
      .gte('available', 1)
      .order('name');

    if (error) {
      throw error;
    }

    const mapped: RentalItemData[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.main_image || null,
      category: item.category || null,
      description: item.description || null,
      price: item.price_per_day || null,
      available: item.available > 0,
      availableCount: item.available ?? 0
    }));

    return mapped;
  },

  async search(query: string): Promise<RentalItemData[]> {
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, main_image, category, description, price_per_day, available')
      .gte('available', 1)
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.main_image || null,
      category: item.category || null,
      description: item.description || null,
      price: item.price_per_day || null,
      available: item.available > 0,
      availableCount: item.available ?? 0
    }));
  }
};