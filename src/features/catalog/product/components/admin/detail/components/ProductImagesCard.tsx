'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, CameraOff } from 'lucide-react';

interface ProductImagesCardProps {
  images?: string[];
  productName?: string;
}

export function ProductImagesCard({ images = [], productName }: ProductImagesCardProps) {
  const [selectedImg, setSelectedImg] = useState(0);

  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">

      {/* Header đồng bộ */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Hình ảnh</h4>
        <div className="p-1.5 rounded-md bg-white border border-slate-100 shadow-sm">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4">

        {/* Main Image Container */}
        <div className="aspect-square rounded bg-slate-50/50 border border-slate-100 overflow-hidden group relative flex items-center justify-center">
          {images.length > 0 ? (
            <img
              src={images[selectedImg]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={productName || "Product preview"}
            />
          ) : (
            /* Empty State đồng bộ */
            <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <div className="w-14 h-14 rounded bg-white flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                <CameraOff className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Trống</p>
              <p className="text-[11px] font-medium text-slate-400">
                Chưa có hình ảnh sản phẩm
              </p>
            </div>
          )}
        </div>

        {/* Thumbnails List */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar pt-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImg(idx)}
                className={`
                  relative w-16 h-16 rounded flex-shrink-0 overflow-hidden transition-all duration-300
                  ${selectedImg === idx
                    ? 'ring-2 ring-emerald-500 ring-offset-2 scale-95 opacity-100 shadow-md'
                    : 'border border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'}
                `}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                {selectedImg === idx && (
                  <div className="absolute inset-0 bg-black/5" />
                )}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}