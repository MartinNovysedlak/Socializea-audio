import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://prlkuuhsvtlpcziekqcx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_XrmQIGBiXHBVhKPx29RTnQ_mW6lpaUT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type EquipmentItem = {
  id: string;
  name: string;
  category: 'sound' | 'lighting' | 'other';
  price_per_day: number;
  available: number;
  description: string | null;
  main_image: string | null;
  images: string[];
  specifications: string[];
  features: string[];
  created_at: string;
  updated_at: string;
};