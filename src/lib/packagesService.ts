import { supabase } from './supabase';

export interface PackageData {
  id: string;
  name: string;
  price_no_lights: number;
  price_with_lights: number;
  image: string;
  images: string[];
  description: string;
  sound_specs: string[];
  light_specs: string[];
  other_specs: string[];
  warning: string;
  created_at?: string;
  updated_at?: string;
}

// 💡 Type alias pre create/update - vynecháva images (rieši sa interne)
export type PackageInput = Omit<PackageData, 'id' | 'created_at' | 'updated_at' | 'images'> & { images?: string[] };

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
    return (data || []).map(row => ({
      ...row,
      images: row.image ? [row.image] : [],
    }));
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
    return data ? { ...data, images: data.image ? [data.image] : [] } : null;
  },

  // 🛠️ Používame PackageInput namiesto Omit<PackageData, ...>
  async create(pkg: PackageInput): Promise<PackageData | null> {
    const { data, error } = await supabase
      .from('packages')
      .insert({
        name: pkg.name,
        price_no_lights: pkg.price_no_lights,
        price_with_lights: pkg.price_with_lights,
        image: pkg.images?.[0] || pkg.image || '',
        description: pkg.description,
        sound_specs: pkg.sound_specs,
        light_specs: pkg.light_specs,
        other_specs: pkg.other_specs,
        warning: pkg.warning
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating package:', error);
      return null;
    }
    return data ? { ...data, images: data.image ? [data.image] : [] } : null;
  },

  // 🛠️ Používame Partial<PackageInput> namiesto Partial<Omit<PackageData, ...>>
  async update(id: string, pkg: Partial<PackageInput>): Promise<PackageData | null> {
    const updateData: any = {};
    if (pkg.name !== undefined) updateData.name = pkg.name;
    if (pkg.price_no_lights !== undefined) updateData.price_no_lights = pkg.price_no_lights;
    if (pkg.price_with_lights !== undefined) updateData.price_with_lights = pkg.price_with_lights;
    if (pkg.description !== undefined) updateData.description = pkg.description;
    if (pkg.sound_specs !== undefined) updateData.sound_specs = pkg.sound_specs;
    if (pkg.light_specs !== undefined) updateData.light_specs = pkg.light_specs;
    if (pkg.other_specs !== undefined) updateData.other_specs = pkg.other_specs;
    if (pkg.warning !== undefined) updateData.warning = pkg.warning;
    
    // 💡 Ukladáme iba image (jeden string) – databáza nemá stĺpec images
    if (pkg.image !== undefined) {
      updateData.image = pkg.image;
    } else if (pkg.images !== undefined && pkg.images.length > 0) {
      updateData.image = pkg.images[0];
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
    return data ? { ...data, images: data.image ? [data.image] : [] } : null;
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