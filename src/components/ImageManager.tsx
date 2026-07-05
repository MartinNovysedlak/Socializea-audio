"use client";

import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { equipmentService } from '@/lib/equipmentService';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImageManager = ({ images, onChange }: ImageManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList) => {
    const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validImageFiles.length === 0) {
      toast.error('Zvoľte prosím iba obrázky!');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Nahrávam ${validImageFiles.length} obrázkov...`);

    try {
      const successfulUrls: string[] = [];
      
      // Nahrávame postupne jeden po druhom, aby sme predišli problémom so súbežnosťou
      for (const file of validImageFiles) {
        try {
          const url = await equipmentService.uploadImage(file);
          if (url) {
            successfulUrls.push(url);
          }
        } catch (err) {
          console.error(`Chyba pri nahrávaní súboru ${file.name}:`, err);
        }
      }
      
      if (successfulUrls.length > 0) {
        // Pridáme všetky úspešne nahrané URL k existujúcim
        onChange([...images, ...successfulUrls]);
        toast.dismiss(toastId);
        toast.success(`Úspešne nahraných ${successfulUrls.length} obrázkov!`);
      } else {
        toast.dismiss(toastId);
        toast.error('Nepodarilo sa nahrať žiadne obrázky.');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Chyba pri spracovaní obrázkov.');
      console.error(error);
    } finally {
      setIsUploading(false);
      // Resetujeme input, aby bolo možné znova vybrať rovnaké súbory ak treba
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageUrl = images[indexToRemove];
    await equipmentService.deleteImage(imageUrl);
    
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    toast.success('Obrázok odstránený.');
  };

  const handleCardDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setOverIndex(index);
  };

  const handleCardDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const updated = [...images];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);

    setDragIndex(null);
    setOverIndex(null);
  };

  const handleCardDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 text-base font-semibold">Fotografie produktu</Label>
        <p className="text-xs text-gray-400 mt-1">
          Nahrajte fotky a zmeňte ich poradie presunutím. Prvá fotka bude automaticky nastavená ako hlavná.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
          isUploading 
            ? 'border-[#BD20D3]/50 bg-[#BD20D3]/5 cursor-wait' 
            : isDragging 
              ? 'border-[#BD20D3] bg-[#BD20D3]/10 cursor-pointer' 
              : 'border-white/10 bg-black/30 hover:border-[#BD20D3]/50 hover:bg-white/5 cursor-pointer'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
        <div className="w-12 h-12 rounded-full bg-[#BD20D3]/10 flex items-center justify-center text-[#BD20D3]">
          <Upload size={24} />
        </div>
        <div>
          <p className="text-white font-medium">
            {isUploading ? 'Nahrávam...' : 'Kliknite sem alebo pretiahnite súbory'}
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, index) => {
            const isMain = index === 0;
            const isBeingDragged = dragIndex === index;
            const isDragOver = overIndex === index;

            return (
              <div 
                key={`${img}-${index}`} 
                draggable
                onDragStart={(e) => handleCardDragStart(e, index)}
                onDragOver={(e) => handleCardDragOver(e, index)}
                onDrop={(e) => handleCardDrop(e, index)}
                onDragEnd={handleCardDragEnd}
                className={`relative group rounded-xl overflow-hidden border bg-black/40 flex flex-col cursor-grab active:cursor-grabbing transition-all duration-200 ${
                  isMain ? 'border-[#BD20D3] ring-1 ring-[#BD20D3]' : 'border-white/10'
                } ${isBeingDragged ? 'opacity-40 scale-95' : ''} ${
                  isDragOver ? 'border-[#BD20D3] bg-[#BD20D3]/10 scale-105' : ''
                }`}
              >
                <div className="aspect-video w-full bg-zinc-900 relative">
                  <img
                    src={img}
                    alt={`Náhľad ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                  
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white/80 p-1.5 rounded-lg">
                    <GripVertical size={14} />
                  </div>

                  {isMain && (
                    <span className="absolute bottom-2 left-2 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                      Hlavná
                    </span>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageManager;