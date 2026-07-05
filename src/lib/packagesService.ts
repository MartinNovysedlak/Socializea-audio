"use client";

import { supabase } from './supabase';

export interface PackageData {
  id: string;
  name: string;
  price_no_lights: number;
  price_with_lights: number;
  images: string[];
  description: string;
  sound_specs: string[];
  light_specs: string[];
  other_specs: string[];
  warning: string;
  created_at?: string;
}

const TABLE = 'packages';

export const packagesService = {
  getAll: async (): Promise<PackageData[]> => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
    return (data || []).map(item => ({
      ...item,
      images: item.images || [],
      sound_specs: item.sound_specs || [],
      light_specs: item.light_specs || [],
      other_specs: item.other_specs || [],
    })) as PackageData[];
  },

  getById: async (id: string): Promise<PackageData | null> => {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching package:', error);
      return null;
    }
    return {
      ...data,
      images: data.images || [],
      sound_specs: data.sound_specs || [],
      light_specs: data.light_specs || [],
      other_specs: data.other_specs || [],
    } as PackageData;
  },

  create: async (data: Omit<PackageData, 'id' | 'created_at'>): Promise<PackageData | null> => {
    const { data: created, error } = await supabase
      .from(TABLE)
      .insert({
        name: data.name,
        price_no_lights: data.price_no_lights,
        price_with_lights: data.price_with_lights,
        images: data.images,
        description: data.description,
        sound_specs: data.sound_specs,
        light_specs: data.light_specs,
        other_specs: data.other_specs,
        warning: data.warning,
      })
      .select()
      .single();
    if (error) {
      console.error('Error creating package:', error);
      return null;
    }
    return {
      ...created,
      images: created.images || [],
      sound_specs: created.sound_specs || [],
      light_specs: created.light_specs || [],
      other_specs: created.other_specs || [],
    } as PackageData;
  },

  update: async (id: string, data: Partial<Omit<PackageData, 'id' | 'created_at'>>): Promise<PackageData | null> => {
    const { data: updated, error } = await supabase
      .from(TABLE)
      .update({
        name: data.name,
        price_no_lights: data.price_no_lights,
        price_with_lights: data.price_with_lights,
        images: data.images,
        description: data.description,
        sound_specs: data.sound_specs,
        light_specs: data.light_specs,
        other_specs: data.other_specs,
        warning: data.warning,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('Error updating package:', error);
      return null;
    }
    return {
      ...updated,
      images: updated.images || [],
      sound_specs: updated.sound_specs || [],
      light_specs: updated.light_specs || [],
      other_specs: updated.other_specs || [],
    } as PackageData;
  },

  delete: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Error deleting package:', error);
      return false;
    }
    return true;
  },
};