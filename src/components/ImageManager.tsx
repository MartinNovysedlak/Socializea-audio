"use client";

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Star, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { equipmentService } from '@/lib/equipmentService';
import { toast } from 'sonner';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

interface UploadTask {
  file: File;
  status: 'pending' | 'uploading' | 'done' | 'error';
  url?: string;
}

const ImageManager: React.FC<ImageManagerProps> = ({ images, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [tasks, setTasks] = useState<UploadTask[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Vytvoríme úlohy pre každý súbor
    const newTasks: UploadTask[] = fileArray.map(file => ({
      file,
      status: 'pending',
    }));
    
    setTasks(newTasks);
    setUploading(true);

    // Nahrávame postupne, aby sme mali prehľad
    for (let i = 0; i < newTasks.length; i++) {
      setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'uploading' } : t));
      
      try {
        const url = await equipmentService.uploadImage(newTasks[i].file);
        if (url) {
          setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'done', url } : t));
        } else {
          setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'error' } : t));
          toast.error(`Nepodarilo sa nahrať ${newTasks[i].file.name}`);
        }
      } catch (err) {
        console.error('Unexpected upload error:', err);
        setTasks(prev => prev.map((t, idx) => idx === i ? { ...t, status: 'error' } : t));
        toast.error(`Chyba pri nahrávaní ${newTasks[i].file.name}`);
      }
    }

    // Po dokončení všetkých úloh pridáme len úspešné URL k existujúcim obrázkom
    const successfulUrls = tasks
      .filter(t => t.status === 'done' && t.url)
      .map(t => t.url!);

    if (successfulUrls.length > 0) {
      onChange([...images, ...successfulUrls]);
    }

    // Reset
    setTasks([]);
    setUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const totalFiles = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const errorCount = tasks.filter(t => t.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Ukáž prebiehajúce nahrávanie */}
      {uploading && tasks.length > 0 && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Nahrávam {doneCount + errorCount}/{totalFiles}
              {errorCount > 0 && <span className="text-red-400 ml-1">({errorCount} chýb)</span>}
            </span>
            <Loader2 size={14} className="animate-spin text-[#BD20D3]" />
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {tasks.map((task, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {task.status === 'uploading' && <Loader2 size={12} className="animate-spin text-[#BD20D3]" />}
                {task.status === 'done' && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                {task.status === 'error' && <AlertCircle size={12} className="text-red-400" />}
                <span className="truncate text-gray-300">{task.file.name}</span>
                {task.status === 'done' && <span className="text-emerald-400 ml-auto">OK</span>}
                {task.status === 'error' && <span className="text-red-400 ml-auto">Chyba</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galéria existujúcich obrázkov */}
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

                {isFirst && (
                  <div className="absolute top-2 left-2 bg-[#BD20D3] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Star size={10} fill="white" />
                    Hlavná
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
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

      {/* Tlačidlo pre nahratie */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#BD20D3]/10 hover:bg-[#BD20D3]/20 text-[#BD20D3] border border-[#BD20D3]/30 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading ? 'Prebieha nahrávanie...' : images.length === 0 ? 'Pridať fotky' : 'Pridať ďalšie fotky'}
        </button>

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