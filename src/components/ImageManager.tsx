"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
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

  const handleFiles = async (files: FileList) => {
    const validImageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validImageFiles.length === 0) {
      toast.error('Zvoľte prosím iba obrázky!');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Nahrávam obrázky na server...');

    try {
      const uploadPromises = validImageFiles.map(file => equipmentService.uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUrls = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUrls.length > 0) {
        onChange([...images, ...successfulUrls]);
        toast.dismiss(toastId);
        toast.success(`Úspešne nahraných ${successfulUrls.length} obrázkov!`);
      } else {
        toast.dismiss(toastId);
        toast.error('Chyba pri nahrávaní obrázkov.');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Chyba pri spracovaní obrázkov.');
      console.error(error);
    } finally {
      setIsUploading(false);
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
    
    // Pokus o vymazanie zo storage
    await equipmentService.deleteImage(imageUrl);
    
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    toast.success('Obrázok odstránený.');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === images.length - 1) return;

    const updated = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 text-base font-semibold">Fotografie produktu</Label>
        <p className="text-xs text-gray-400 mt-1">
          Nahrajte fotky zo svojho zariadenia. Prvá fotografia v poradí bude automaticky nastavená ako hlavná. Poradie môžete zmeniť šípkami.
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
            {isUploading ? 'Nahrávam...' : 'Kliknite sem alebo pretiahnite súbory na nahranie'}
          </p>
          <p className="text-gray-400 text-xs mt-1">Podporuje JPG, PNG, WEBP</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, index) => {
            const isMain = index === 0;
            return (
              <div 
                key={index} 
                className={`relative group rounded-xl overflow-hidden border bg-black/40 flex flex-col ${
                  isMain ? 'border-[#BD20D3] ring-1 ring-[#BD20D3]' : 'border-white/10'
                }`}
              >
                <div className="aspect-video w-full bg-zinc-900 relative">
                  <img
                    src={img}
                    alt={`Náhľad ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isMain && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                      Hlavná fotka
                    </span>
                  )}
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Odstrániť fotku"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-2 bg-white/5 flex items-center justify-between gap-1 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, 'left');
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  
                  <span className="text-xs font-semibold text-gray-400">
                    #{index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === images.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, 'right');
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowRight size={16} />
                  </Button>
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