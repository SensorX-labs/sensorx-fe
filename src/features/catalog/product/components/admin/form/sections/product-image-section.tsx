'use client';

import React from 'react';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface ProductImageSectionProps {
  imageUrls: string[];
  onRemoveImage: (index: number) => void;
}

export function ProductImageSection({ imageUrls, onRemoveImage }: ProductImageSectionProps) {
  return (
    <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-slate-400" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hình ảnh hàng hóa</h4>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-4 gap-3">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="aspect-square rounded border border-slate-100 overflow-hidden bg-slate-50 relative group">
              <img src={url} alt={`product-${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:text-rose-500 hover:bg-white rounded-full transition-all"
                  onClick={() => onRemoveImage(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          <button className="aspect-square rounded border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 group">
            <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest">Thêm ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
