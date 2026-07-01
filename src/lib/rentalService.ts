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
    console.log('📦 Fetching all rental items from DB...');
    const { data, error } = await supabase
      .from('rental_items')
      .select('*')
      .eq('available', true)
      .order('name');
    
    if (error) {
      console.error('❌ Database error:', error.message);
      throw error;
    }
    console.log('✅ Found rental items:', data?.length || 0);
    return data || [];
  },

  async search(query: string): Promise<RentalItemData[]> {
    console.log(`🔍 Searching rental items for: "${query}"`);
    const { data, error } = await supabase
      .from('rental_items')
      .select('*')
      .eq('available', true)
      .ilike('name', `%${query}%`)
      .order('name');
    
    if (error) {
      console.error('❌ Search error:', error.message);
      throw error;
    }
    return data || [];
  }
};