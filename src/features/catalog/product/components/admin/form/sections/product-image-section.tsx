'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface ProductImageSectionProps {
  imageUrls: string[];
  onRemoveImage: (index: number) => void;
  onUploadImage: (file: File) => Promise<void>;
  isUploading?: boolean;
  onAddOnlineImage?: (url: string) => void;
}

export function ProductImageSection({ 
  imageUrls, 
  onRemoveImage, 
  onUploadImage, 
  isUploading,
  onAddOnlineImage 
}: ProductImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [onlineUrl, setOnlineUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUploadImage(file);
      // Reset input để có thể chọn lại cùng một file nếu cần
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddOnlineClick = () => {
    if (onlineUrl.trim() && onAddOnlineImage) {
      onAddOnlineImage(onlineUrl.trim());
      setOnlineUrl('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOnlineClick();
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-slate-400" />
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Hình ảnh hàng hóa</h4>
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
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button 
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded border-2 border-dashed border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            ) : (
              <>
                <Plus className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Thêm ảnh</span>
              </>
            )}
          </button>
        </div>

        {onAddOnlineImage && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Nhập link ảnh online</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="https://example.com/image.jpg"
                value={onlineUrl}
                onChange={(e) => setOnlineUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
              />
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={handleAddOnlineClick}
                className="border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-all"
              >
                Thêm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
