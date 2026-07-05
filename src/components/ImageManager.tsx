"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
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
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40"
          >
            <img
              src={url}
              alt={`upload ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200';
              }}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/70 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors group-hover:opacity-100 opacity-0"
              title="Odstrániť obrázok"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#BD20D3]/10 hover:bg-[#BD20D3]/20 text-[#BD20D3] border border-[#BD20D3]/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading ? 'Nahrávam...' : 'Pridať fotky (viacero)'}
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