import { supabase } from './supabase';

export interface PackageData {
  id: string;
  name: string;
  price_no_lights: number;
  price_with_lights: number;
  image: string;
  description: string;
  sound_specs: string[];
  light_specs: string[];
  other_specs: string[];
  warning: string;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

function parseImageToImages(pkg: any): PackageData {
  let images: string[] = [];
  if (pkg.image) {
    try {
      const parsed = JSON.parse(pkg.image);
      if (Array.isArray(parsed)) {
        images = parsed;
      } else {
        images = [pkg.image];
      }
    } catch {
      images = [pkg.image];
    }
  }
  return { ...pkg, images };
}

function stringifyImagesToImage(images: string[]): string {
  try {
    return JSON.stringify(images);
  } catch {
    return images[0] || '';
  }
}

export const packagesService = {
  async getAll(): Promise<PackageData[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching packages:', error);
      return [];
    }
    return (data || []).map(parseImageToImages);
  },

  async getById(id: string): Promise<PackageData | null> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error fetching package:', error);
      return null;
    }
    return parseImageToImages(data);
  },

  async create(pkg: { name: string; price_no_lights: number; price_with_lights: number; image?: string; description?: string; sound_specs?: string[]; light_specs?: string[]; other_specs?: string[]; warning?: string; images?: string[] }): Promise<PackageData | null> {
    const imageValue = pkg.images && pkg.images.length > 0
      ? stringifyImagesToImage(pkg.images)
      : (pkg.image || '');

    const { data, error } = await supabase
      .from('packages')
      .insert({
        name: pkg.name,
        price_no_lights: pkg.price_no_lights,
        price_with_lights: pkg.price_with_lights,
        image: imageValue,
        description: pkg.description || '',
        sound_specs: pkg.sound_specs || [],
        light_specs: pkg.light_specs || [],
        other_specs: pkg.other_specs || [],
        warning: pkg.warning || ''
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating package:', error);
      return null;
    }
    return parseImageToImages(data);
  },

  async update(id: string, pkg: { name?: string; price_no_lights?: number; price_with_lights?: number; image?: string; description?: string; sound_specs?: string[]; light_specs?: string[]; other_specs?: string[]; warning?: string; images?: string[] }): Promise<PackageData | null> {
    const updateData: any = {};
    if (pkg.name !== undefined) updateData.name = pkg.name;
    if (pkg.price_no_lights !== undefined) updateData.price_no_lights = pkg.price_no_lights;
    if (pkg.price_with_lights !== undefined) updateData.price_with_lights = pkg.price_with_lights;
    if (pkg.description !== undefined) updateData.description = pkg.description;
    if (pkg.sound_specs !== undefined) updateData.sound_specs = pkg.sound_specs;
    if (pkg.light_specs !== undefined) updateData.light_specs = pkg.light_specs;
    if (pkg.other_specs !== undefined) updateData.other_specs = pkg.other_specs;
    if (pkg.warning !== undefined) updateData.warning = pkg.warning;

    // Ak odovzdali images pole, uložíme ho ako JSON do image stĺpca
    if (pkg.images !== undefined) {
      updateData.image = stringifyImagesToImage(pkg.images);
    } else if (pkg.image !== undefined) {
      updateData.image = pkg.image;
    }

    const { data, error } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating package:', error);
      return null;
    }
    return parseImageToImages(data);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting package:', error);
      return false;
    }
    return true;
  }
};