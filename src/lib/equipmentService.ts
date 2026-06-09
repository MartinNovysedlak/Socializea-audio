import { supabase, EquipmentItem } from './supabase';

export const equipmentService = {
  async getAll(): Promise<EquipmentItem[]> {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }

    return data || [];
  },

  async getById(id: string): Promise<EquipmentItem | null> {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching equipment:', error);
      return null;
    }

    return data;
  },

  async create(item: {
    name: string;
    category: 'sound' | 'lighting' | 'other';
    pricePerDay: number;
    available: number;
    description: string;
    mainImage?: string;
    images: string[];
    specifications: string[];
    features: string[];
  }): Promise<EquipmentItem | null> {
    const { data: maxOrderData } = await supabase
      .from('equipment')
      .select('order_index')
      .order('order_index', { ascending: false })
      .limit(1)
      .single();

    const newOrderIndex = (maxOrderData?.order_index ?? -1) + 1;

    const { data, error } = await supabase
      .from('equipment')
      .insert({
        name: item.name,
        category: item.category,
        price_per_day: item.pricePerDay,
        available: item.available,
        description: item.description,
        main_image: item.mainImage || null,
        images: item.images,
        specifications: item.specifications,
        features: item.features,
        order_index: newOrderIndex
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating equipment:', error);
      return null;
    }

    return data;
  },

  async update(id: string, item: {
    name?: string;
    category?: 'sound' | 'lighting' | 'other';
    pricePerDay?: number;
    available?: number;
    description?: string;
    mainImage?: string;
    images?: string[];
    specifications?: string[];
    features?: string[];
  }): Promise<EquipmentItem | null> {
    const updateData: any = {};
    
    if (item.name !== undefined) updateData.name = item.name;
    if (item.category !== undefined) updateData.category = item.category;
    if (item.pricePerDay !== undefined) updateData.price_per_day = item.pricePerDay;
    if (item.available !== undefined) updateData.available = item.available;
    if (item.description !== undefined) updateData.description = item.description;
    if (item.mainImage !== undefined) updateData.main_image = item.mainImage;
    if (item.images !== undefined) updateData.images = item.images;
    if (item.specifications !== undefined) updateData.specifications = item.specifications;
    if (item.features !== undefined) updateData.features = item.features;

    const { data, error } = await supabase
      .from('equipment')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating equipment:', error);
      return null;
    }

    return data;
  },

  async updateOrder(updates: { id: string; order_index: number }[]): Promise<boolean> {
    const promises = updates.map(({ id, order_index }) =>
      supabase
        .from('equipment')
        .update({ order_index })
        .eq('id', id)
    );

    const results = await Promise.all(promises);
    const hasError = results.some(r => r.error);

    if (hasError) {
      console.error('Error updating order:', results);
      return false;
    }

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting equipment:', error);
      return false;
    }

    return true;
  },

  async uploadImage(file: File): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('equipment-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('equipment-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteImage(url: string): Promise<boolean> {
    const path = url.split('/').pop();
    if (!path) return false;

    const { error } = await supabase.storage
      .from('equipment-images')
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  }
};