import { supabase } from './supabase';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at?: string;
}

export const faqService = {
  async getAll(): Promise<FAQItem[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }

    return data || [];
  },

  async create(item: Omit<FAQItem, 'id' | 'created_at' | 'order_index'>, orderIndex: number): Promise<FAQItem | null> {
    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question: item.question,
        answer: item.answer,
        order_index: orderIndex
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }

    return data;
  },

  async update(id: string, item: Partial<Pick<FAQItem, 'question' | 'answer' | 'order_index'>>): Promise<FAQItem | null> {
    const { data, error } = await supabase
      .from('faqs')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }

    return data;
  },

  async updateOrder(updates: { id: string; order_index: number }[]): Promise<boolean> {
    const promises = updates.map(({ id, order_index }) =>
      supabase.from('faqs').update({ order_index }).eq('id', id)
    );
    const results = await Promise.all(promises);
    return results.every(r => !r.error);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }

    return true;
  }
};