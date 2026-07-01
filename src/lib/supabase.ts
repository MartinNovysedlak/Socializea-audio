import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'sound' | 'lighting' | 'other';
  price_per_day: number;
  available: number;
  description?: string;
  main_image?: string;
  images: string[];
  specifications: string[];
  features: string[];
  order_index?: number;
  created_at?: string;
}

export interface Package {
  id?: string;
  name: string;
  image: string;
  description: string;
  sound_specs: string[];
  light_specs: string[];
  other_specs: string[];
  price_no_lights: number;
  price_with_lights: number;
  is_popular?: boolean;
  created_at?: string;
}

export const addPackage = async (packageData: Omit<Package, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('packages')
    .insert(packageData)
    .select()
    .single();
  return { data, error };
};

export const getPackages = async () => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updatePackage = async (id: string, packageData: Partial<Package>) => {
  const { data, error } = await supabase
    .from('packages')
    .update(packageData)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deletePackage = async (id: string) => {
  const { data, error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);
  return { data, error };
};