import { supabase } from './supabase';

export interface RentalItemData {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  description: string | null;
  price: number | null;
  available: boolean;
}

export const rentalService = {
  async getAll(): Promise<RentalItemData[]> {
    console.log('📦 Fetching rental items from equipment table...');
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, main_image, category, description, price_per_day, available')
      .gte('available', 1)  // Supabase column 'available' is number, NOT boolean
      .order('name');

    if (error) {
      console.error('❌ Database error:', error.message);
      throw error;
    }

    console.log('✅ Raw data from DB:', data);

    const mapped: RentalItemData[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.main_image || null,
      category: item.category || null,
      description: item.description || null,
      price: item.price_per_day || null,
      available: item.available > 0
    }));

    console.log('✅ Mapped rental items:', mapped.length);
    return mapped;
  },

  async search(query: string): Promise<RentalItemData[]> {
    console.log(`🔍 Searching for: "${query}"`);
    const { data, error } = await supabase
      .from('equipment')
      .select('id, name, main_image, category, description, price_per_day, available')
      .gte('available', 1)
      .ilike('name', `%${query}%`)
      .order('name');

    if (error) {
      console.error('❌ Search error:', error.message);
      throw error;
    }

    const mapped: RentalItemData[] = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.main_image || null,
      category: item.category || null,
      description: item.description || null,
      price: item.price_per_day || null,
      available: item.available > 0
    }));

    return mapped;
  }
};