import { supabase } from './supabase';

export const equipmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(item: any) {
    const { data, error } = await supabase
      .from('equipment')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('equipment')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    return !error;
  },

  async updateOrder(updates: { id: string; order_index: number }[]) {
    const promises = updates.map(({ id, order_index }) =>
      supabase.from('equipment').update({ order_index }).eq('id', id)
    );

    const results = await Promise.all(promises);
    return results.every((r) => !r.error);
  },

  async uploadImage(file: File): Promise<string | null> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${random}-${file.size}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`[Upload] Začínam nahrávať: ${fileName} (${(file.size / 1024).toFixed(1)} KB)`);

    const { error: uploadError } = await supabase.storage
      .from('equipment-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[Upload] Chyba pri nahrávaní:', uploadError);
      return null;
    }

    console.log('[Upload] Úspešne nahrané:', fileName);

    const { data } = supabase.storage
      .from('equipment-images')
      .getPublicUrl(filePath);

    console.log('[Upload] Verejná URL:', data.publicUrl);
    return data.publicUrl;
  },
};