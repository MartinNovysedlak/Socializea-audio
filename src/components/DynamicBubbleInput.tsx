"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, GripVertical } from 'lucide-react';

interface DynamicBubbleInputProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
}

const DynamicBubbleInput = ({ label, placeholder, items, onChange }: DynamicBubbleInputProps) => {
  const [currentValue, setCurrentValue] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-gray-300">{label}</Label>
        {items.length > 0 && (
          <span className="text-xs text-gray-500">{items.length} položiek</span>
        )}
      </div>

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
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
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
