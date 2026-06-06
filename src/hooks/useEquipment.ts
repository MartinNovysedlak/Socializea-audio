import { useState, useEffect } from 'react';
import { equipmentService } from '@/lib/equipmentService';
import { EquipmentItem } from '@/lib/supabase';

export function useEquipment() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    setLoading(true);
    const data = await equipmentService.getAll();
    setEquipment(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const addEquipment = async (item: {
    name: string;
    category: 'sound' | 'lighting' | 'other';
    pricePerDay: number;
    available: number;
    description: string;
    mainImage?: string;
    images: string[];
    specifications: string[];
    features: string[];
  }) => {
    const newItem = await equipmentService.create(item);
    if (newItem) {
      setEquipment(prev => [newItem, ...prev]);
    }
    return newItem;
  };

  const updateEquipment = async (id: string, updatedItem: {
    name?: string;
    category?: 'sound' | 'lighting' | 'other';
    pricePerDay?: number;
    available?: number;
    description?: string;
    mainImage?: string;
    images?: string[];
    specifications?: string[];
    features?: string[];
  }) => {
    const updated = await equipmentService.update(id, updatedItem);
    if (updated) {
      setEquipment(prev => prev.map(item => item.id === id ? updated : item));
    }
    return updated;
  };

  const deleteEquipment = async (id: string) => {
    const success = await equipmentService.delete(id);
    if (success) {
      setEquipment(prev => prev.filter(item => item.id !== id));
    }
    return success;
  };

  return {
    equipment,
    loading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    refetch: fetchEquipment
  };
}

export function useEquipmentItem(id: string) {
  const [item, setItem] = useState<EquipmentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      const data = await equipmentService.getById(id);
      setItem(data);
      setLoading(false);
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  return { item, loading };
}

export function getStoredEquipment(): EquipmentItem[] {
  return [];
}