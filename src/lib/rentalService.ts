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
    const { data, error } = await supabase
      .from('rental_items')
      .select('*')
      .eq('available', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async search(query: string): Promise<RentalItemData[]> {
    const { data, error } = await supabase
      .from('rental_items')
      .select('*')
      .eq('available', true)
      .ilike('name', `%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
};