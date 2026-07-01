import { supabase, Package } from './supabase';

export const packageService = {
  async getAll(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching packages from Supabase:', err);
      return [];
    }
  },

  async getById(id: string): Promise<Package | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching package by ID:', err);
      return null;
    }
  },

  async create(item: Omit<Package, 'id' | 'created_at'>): Promise<Package | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating package:', err);
      return null;
    }
  },

  async update(id: string, updatedFields: Partial<Omit<Package, 'id' | 'created_at'>>): Promise<Package | null> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating package:', err);
      return null;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting package:', err);
      return false;
    }
  }
};