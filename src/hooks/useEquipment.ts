"use client";

import { useState, useEffect } from 'react';
import { equipmentDatabase, EquipmentItem } from '@/data/equipmentDatabase';

const STORAGE_KEY = 'socializea_equipment_data';

export function getStoredEquipment(): EquipmentItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipmentDatabase));
    return equipmentDatabase;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return equipmentDatabase;
  }
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);

  useEffect(() => {
    setEquipment(getStoredEquipment());
  }, []);

  const saveEquipment = (newItems: EquipmentItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    setEquipment(newItems);
    window.dispatchEvent(new Event('equipment-updated'));
  };

  useEffect(() => {
    const handleUpdate = () => {
      setEquipment(getStoredEquipment());
    };
    window.addEventListener('equipment-updated', handleUpdate);
    return () => window.removeEventListener('equipment-updated', handleUpdate);
  }, []);

  const addEquipment = (item: Omit<EquipmentItem, 'id'>) => {
    const items = getStoredEquipment();
    const newItem: EquipmentItem = {
      ...item,
      id: `item-${Date.now()}`
    };
    saveEquipment([...items, newItem]);
    return newItem;
  };

  const updateEquipment = (id: string, updatedItem: Partial<EquipmentItem>) => {
    const items = getStoredEquipment();
    const newItems = items.map(item => item.id === id ? { ...item, ...updatedItem } as EquipmentItem : item);
    saveEquipment(newItems);
  };

  const deleteEquipment = (id: string) => {
    const items = getStoredEquipment();
    const newItems = items.filter(item => item.id !== id);
    saveEquipment(newItems);
  };

  return {
    equipment,
    addEquipment,
    updateEquipment,
    deleteEquipment
  };
}