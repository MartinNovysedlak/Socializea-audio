"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { equipmentService } from '@/lib/equipmentService';
import { toast } from 'sonner';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setTotalFiles(files.length);
    setUploadCount(0);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await equipmentService.uploadImage(file);
      if (url) {
        newUrls.push(url);
      } else {
        toast.error(`Nepodarilo sa nahrať súbor ${file.name}.`);
      }
      setUploadCount((prev) => prev + 1);
    }

    onChange([...images, ...newUrls]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={`${idx}-${url.substring(url.lastIndexOf('/') + 1).substring(0, 8)}`}
                className="relative group aspect-square rounded-xl overflow-hidden border-2 transition-all"
                style={{
                  borderColor: isFirst ? '#BD20D3' : 'rgba(255,255,255,0.1)',
                  boxShadow: isFirst ? '0 0 12px rgba(189,32,211,0.3)' : 'none',
                }}
              >
                <img
                  src={url}
                  alt={`Fotka ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200';
                  }}
                />

                {/* Hlavná fotografia odznak */}
                {isFirst && (
                  <div className="absolute top-2 left-2 bg-[#BD20D3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={10} fill="white" />
                    Hlavná
                  </div>
                )}

                {/* Ovládacie prvky pri hoveri */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                  {/* Poradie */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'left')}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Posunúť doľava"
                    >
                      <ChevronLeft size={14} className="text-white" />
                    </button>
                    <span className="text-xs text-white font-medium w-6 text-center">{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'right')}
                      disabled={idx === images.length - 1}
                      className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Posunúť doprava"
                    >
                      <ChevronRight size={14} className="text-white" />
                    </button>
                  </div>

                  {/* Zmazať */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                    title="Odstrániť"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload tlačidlo */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#BD20D3]/10 hover:bg-[#BD20D3]/20 text-[#BD20D3] border border-[#BD20D3]/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading ? 'Nahrávam...' : images.length === 0 ? 'Pridať fotky' : 'Pridať ďalšie fotky'}
        </button>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={16} className="animate-spin text-[#BD20D3]" />
            <span>
              Nahrávam {uploadCount}/{totalFiles} súborov…
            </span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageManager;