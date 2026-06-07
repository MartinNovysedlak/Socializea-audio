"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

interface DynamicBubbleInputProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

const DynamicBubbleInput = ({ label, placeholder, items, onChange }: DynamicBubbleInputProps) => {
  const [currentValue, setCurrentValue] = useState('');

  const handleAddItem = () => {
    const trimmed = currentValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setCurrentValue('');
    }
  };

  const handleRemoveItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-gray-300">{label}</Label>
      
      {/* Existing items as bubbles */}
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

      {/* Input with plus button */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-black/50 border-white/10 text-white rounded-xl h-11 flex-1"
        />
        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!currentValue.trim()}
          className="bg-[#BD20D3]/20 border border-[#BD20D3]/40 hover:bg-[#BD20D3]/40 text-white rounded-xl h-11 px-4 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Plus size={18} />
        </Button>
      </div>
    </div>
  );
};

export default DynamicBubbleInput;