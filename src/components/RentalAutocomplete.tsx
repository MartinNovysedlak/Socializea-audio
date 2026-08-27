"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, Loader2, Package, Minus, ShoppingBag, GripVertical } from 'lucide-react';

interface RentalItem {
  id: string;
  name: string;
  image: string;
  category?: string;
}

interface RentalAutocompleteProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

const RentalAutocomplete = ({ label, placeholder, items, onChange }: RentalAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [filteredItems, setFilteredItems] = useState<RentalItem[]>([]);

  // Quantity selection state
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Fetch rental items from database (equipment table)
  useEffect(() => {
    const fetchRentalItems = async () => {
      setLoading(true);
      setDbError(false);
      try {
        const { rentalService } = await import('@/lib/rentalService');
        const data = await rentalService.getAll();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: RentalItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            image: item.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
            category: item.category || ''
          }));
          setRentalItems(mapped);
        } else {
          setRentalItems([]);
          setDbError(true);
        }
      } catch {
        setRentalItems([]);
        setDbError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRentalItems();
  }, []);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim() || rentalItems.length === 0) {
      setFilteredItems([]);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = rentalItems.filter(
      item =>
        !items.includes(item.name) &&
        (item.name.toLowerCase().includes(lower) ||
         (item.category && item.category.toLowerCase().includes(lower)))
    );
    setFilteredItems(filtered.slice(0, 8));
  }, [searchTerm, rentalItems, items]);

  // Click outside to close all dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedItem(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const confirmQuantity = useCallback(() => {
    if (!selectedItem) return;
    const formatted = `${quantity} x ${selectedItem.name}`;
    if (!items.includes(formatted)) {
      onChange([...items, formatted]);
    }
    setSelectedItem(null);
    setSearchTerm('');
    setFilteredItems([]);
    setQuantity(1);
    inputRef.current?.focus();
  }, [selectedItem, quantity, items, onChange]);

  const handleSelectItem = useCallback((item: RentalItem) => {
    setSelectedItem(item);
    setQuantity(1);
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    onChange(items.filter((_, i) => i !== index));
  }, [items, onChange]);

  const handleItemDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndex === null || dragIndex === index) return;
    setOverIndex(index);
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedItem) {
        confirmQuantity();
      } else if (filteredItems.length > 0) {
        handleSelectItem(filteredItems[0]);
      } else {
        const trimmed = searchTerm.trim();
        if (trimmed && !items.includes(trimmed)) {
          onChange([...items, trimmed]);
          setSearchTerm('');
        }
      }
    }
  };

  const selectedCount = items.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">{label}</Label>
        {selectedCount > 0 && (
          <span className="text-xs text-gray-500">{selectedCount} položiek · pretiahni pre poradie</span>
        )}
      </div>

      {/* Selected items as bubbles */}
      {items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => {
            const isDragging = dragIndex === index;
            const isOver = overIndex === index && dragIndex !== index;
            return (
              <div
                key={`${item}-${index}`}
                draggable
                onDragStart={(e) => handleItemDragStart(e, index)}
                onDragOver={(e) => handleItemDragOver(e, index)}
                onDrop={(e) => handleItemDrop(e, index)}
                onDragEnd={handleItemDragEnd}
                className={`group flex items-center gap-2 bg-[#BD20D3]/10 border rounded-xl pl-2 pr-2 py-1.5 text-sm text-white transition-all cursor-grab active:cursor-grabbing ${
                  isDragging ? 'opacity-40 border-[#BD20D3]/50' : 'border-[#BD20D3]/30 hover:bg-[#BD20D3]/20'
                } ${isOver ? 'border-[#BD20D3] bg-[#BD20D3]/25 ring-1 ring-[#BD20D3]' : ''}`}
              >
                <GripVertical size={14} className="text-[#BD20D3]/80 shrink-0" />
                <span className="flex-1 min-w-0 truncate">{item}</span>
                <button
                  type="button"
                  draggable={false}
                  onClick={() => handleRemoveItem(index)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-colors shrink-0"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Search input with suggestions */}
      <div className="relative" ref={wrapperRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                setSelectedItem(null);
              }}
              onFocus={() => {
                setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={loading ? 'Načítavam...' : placeholder}
              className="bg-black/50 border-white/10 text-white rounded-xl h-11 pl-10 flex-1"
              disabled={loading && !dbError}
            />
            {loading && (
              <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BD20D3] animate-spin" />
            )}
          </div>
          <Button
            type="button"
            onClick={() => {
              const trimmed = searchTerm.trim();
              if (trimmed && !items.includes(trimmed)) {
                onChange([...items, trimmed]);
                setSearchTerm('');
              }
            }}
            disabled={!searchTerm.trim() || dbError}
            className="bg-[#BD20D3]/20 border border-[#BD20D3]/40 hover:bg-[#BD20D3]/40 text-white rounded-xl h-11 px-4 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* Dropdown content */}
        {isOpen && searchTerm.trim() && (
          <>
            {/* Loading state */}
            {loading && (
              <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
                <Loader2 size={16} className="mx-auto mb-1.5 text-[#BD20D3] animate-spin" />
                <p>Načítavam položky z databázy...</p>
              </div>
            )}

            {/* Database error / empty state */}
            {!loading && dbError && (
              <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
                <Package size={16} className="mx-auto mb-1.5 text-gray-600" />
                <p>Databáza nie je dostupná alebo neobsahuje žiadne položky na prenájom.</p>
              </div>
            )}

            {/* Suggestions dropdown */}
            {!loading && !dbError && filteredItems.length > 0 && !selectedItem && (
              <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      {item.category && (
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category}</p>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white/20 hover:bg-[#BD20D3]/30 hover:border-[#BD20D3]/50 flex items-center justify-center transition-colors">
                      <Plus size={12} className="text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quantity selector for selected item */}
            {!loading && !dbError && selectedItem && (
              <div
                ref={quantityRef}
                className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-[#BD20D3]/40 rounded-xl p-4 shadow-2xl shadow-black/50 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-800 border border-white/10">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selectedItem.name}</p>
                    {selectedItem.category && (
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{selectedItem.category}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 bg-black/40 border border-white/10 rounded-xl p-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase shrink-0">Počet kusov:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-white font-bold text-lg">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setQuantity(1);
                    }}
                    className="text-xs text-gray-400 hover:text-white h-9 flex-1"
                  >
                    Zrušiť
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={confirmQuantity}
                    className="bg-[#BD20D3]/20 hover:bg-[#BD20D3]/40 border border-[#BD20D3]/40 text-white rounded-lg h-9 flex-1 text-xs font-semibold"
                  >
                    <ShoppingBag size={14} className="mr-1.5" />
                    Pridať {quantity} ks
                  </Button>
                </div>
              </div>
            )}

            {/* Empty search result */}
            {!loading && !dbError && filteredItems.length === 0 && !selectedItem && (
              <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
                <Package size={16} className="mx-auto mb-1.5 text-gray-600" />
                <p>Žiadna položka sa nenašla v databáze. Stlačte Enter pre pridanie vlastnej.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RentalAutocomplete;