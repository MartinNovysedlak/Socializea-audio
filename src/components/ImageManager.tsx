"use client";

import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { equipmentService } from '@/lib/equipmentService';

interface ImageManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ImageManager = ({ images, onChange }: ImageManagerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragFromRef = useRef<number | null>(null);
  const overRef = useRef<number | null>(null);
  const [isFileHover, setIsFileHover] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleFiles = async (files: FileList) => {
    const validImageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      toast.error('Zvoľte prosím iba obrázky!');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Nahrávam ${validImageFiles.length} obrázkov...`);

    try {
      const successfulUrls: string[] = [];

      for (const file of validImageFiles) {
        try {
          const url = await equipmentService.uploadImage(file);
          if (url) successfulUrls.push(url);
        } catch (err) {
          console.error(`Chyba pri nahrávaní súboru ${file.name}:`, err);
        }
      }

      if (successfulUrls.length > 0) {
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const isExternalFileDrag = (e: React.DragEvent) =>
    [...e.dataTransfer.types].includes('Files') && dragFromRef.current === null;

  const handleZoneDragOver = (e: React.DragEvent) => {
    if (!isExternalFileDrag(e)) return;
    e.preventDefault();
    setIsFileHover(true);
  };

  const handleZoneDragLeave = () => setIsFileHover(false);

  const handleZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsFileHover(false);
    if (dragFromRef.current !== null) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = async (indexToRemove: number) => {
    const imageUrl = images[indexToRemove];
    await equipmentService.deleteImage(imageUrl);
    onChange(images.filter((_, idx) => idx !== indexToRemove));
    toast.success('Obrázok odstránený.');
  };

  const moveImage = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= images.length || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const indexFromPoint = (x: number, y: number): number | null => {
    const nodes = gridRef.current?.querySelectorAll<HTMLElement>('[data-image-index]');
    if (!nodes) return null;
    for (const node of nodes) {
      const r = node.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        const idx = Number(node.dataset.imageIndex);
        return Number.isNaN(idx) ? null : idx;
      }
    }
    return null;
  };

  const finishPointerDrag = () => {
    const from = dragFromRef.current;
    const to = overRef.current;
    dragFromRef.current = null;
    overRef.current = null;
    setDragFrom(null);
    setOverIndex(null);
    if (from !== null && to !== null && from !== to) {
      moveImage(from, to);
    }
  };

  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragFromRef.current = index;
    overRef.current = index;
    setDragFrom(index);
    setOverIndex(index);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragFromRef.current === null) return;
    const next = indexFromPoint(e.clientX, e.clientY);
    if (next === null || next === overRef.current) return;
    overRef.current = next;
    setOverIndex(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragFromRef.current === null) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released
    }
    finishPointerDrag();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300 text-base font-semibold">Fotografie produktu</Label>
        <p className="text-xs text-gray-400 mt-1">
          Nahrajte fotky a zmeňte ich poradie pretiahnutím. Prvá fotka bude hlavná.
        </p>
      </div>

      <div
        onDragOver={handleZoneDragOver}
        onDragLeave={handleZoneDragLeave}
        onDrop={handleZoneDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
          isUploading
            ? 'border-[#BD20D3]/50 bg-[#BD20D3]/5 cursor-wait'
            : isFileHover
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
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {images.map((img, index) => {
            const isMain = index === 0;
            const isBeingDragged = dragFrom === index;
            const isDragOver = overIndex === index && dragFrom !== index;

            return (
              <div
                key={`${img}-${index}`}
                data-image-index={index}
                onPointerDown={(e) => handlePointerDown(e, index)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative group rounded-xl overflow-hidden border bg-black/40 flex flex-col select-none touch-none cursor-grab active:cursor-grabbing transition-all duration-150 ${
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

                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white/80 p-1.5 rounded-lg pointer-events-none">
                    <GripVertical size={14} />
                  </div>

                  {isMain && (
                    <span className="absolute bottom-2 left-2 bg-gradient-to-r from-[#BD20D3] to-[#1A4BFF] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md pointer-events-none">
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
                {images.length > 1 && (
                  <div className="flex border-t border-white/10">
                    <button
                      type="button"
                      disabled={index === 0}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index - 1);
                      }}
                      className="flex-1 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none"
                      aria-label="Posunúť doľava"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        moveImage(index, index + 1);
                      }}
                      className="flex-1 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none border-l border-white/10"
                      aria-label="Posunúť doprava"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageManager;
