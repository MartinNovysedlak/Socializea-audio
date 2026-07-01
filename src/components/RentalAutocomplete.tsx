"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, Loader2, Check, Package } from 'lucide-react';

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch rental items ONLY from database
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
            image: item.image || '',
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

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectItem = useCallback((item: RentalItem) => {
    if (!items.includes(item.name)) {
      onChange([...items, item.name]);
    }
    setSearchTerm('');
    setFilteredItems([]);
    inputRef.current?.focus();
  }, [items, onChange]);

  const handleRemoveItem = useCallback((index: number) => {
    onChange(items.filter((_, i) => i !== index));
  }, [items, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems.length > 0) {
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
          <span className="text-xs text-gray-500">{selectedCount} položiek</span>
        )}
      </div>

      {/* Selected items as bubbles */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 bg-[#BD20D3]/10 border border-[#BD20D3]/30 rounded-full pl-4 pr-2 py-1.5 text-sm text-white transition-all hover:bg-[#BD20D3]/20"
            >
              <span className="max-w-[200px] truncate">{item}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
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
              }}
              onFocus={() => {
                if (searchTerm.trim()) setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={dbError && !loading ? 'Databáza nie je dostupná...' : placeholder}
              className="bg-black/50 border-white/10 text-white rounded-xl h-11 pl-10 flex-1"
              disabled={loading || dbError}
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

        {/* Loading state */}
        {loading && (
          <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
            <Loader2 size={16} className="mx-auto mb-1.5 text-[#BD20D3] animate-spin" />
            <p>Načítavam položky z databázy...</p>
          </div>
        )}

        {/* Database error state */}
        {!loading && dbError && (
          <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
            <Package size={16} className="mx-auto mb-1.5 text-gray-600" />
            <p>Databáza nie je dostupná alebo neobsahuje žiadne položky na prenájom.</p>
          </div>
        )}

        {/* Suggestions dropdown - ONLY from database */}
        {isOpen && filteredItems.length > 0 && !loading && !dbError && (
          <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item)}
                className="flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-800">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <Package size={14} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.name}</p>
                  {item.category && (
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.category}</p>
                  )}
                </div>
                <div className="w-6 h-6 rounded-full border border-white/20 hover:bg-[#BD20D3]/30 hover:border-[#BD20D3]/50 flex items-center justify-center transition-colors">
                  <Check size={12} className="text-white" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Empty search result */}
        {searchTerm.trim() && filteredItems.length === 0 && !loading && !dbError && (
          <div className="absolute top-full left-0 right-20 mt-1 bg-[#0a0d1f] border border-white/10 rounded-xl p-4 text-center text-xs text-gray-500 z-50">
            <Package size={16} className="mx-auto mb-1.5 text-gray-600" />
            <p>Žiadna položka sa nenašla v databáze. Stlačte Enter pre pridanie vlastnej.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalAutocomplete;