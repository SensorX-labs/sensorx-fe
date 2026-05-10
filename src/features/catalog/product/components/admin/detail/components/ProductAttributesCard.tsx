'use client';

import React from 'react';
import { Layers } from 'lucide-react';

interface ProductAttributesCardProps {
  attributes?: Array<{ name: string; value: string }>;
}

export function ProductAttributesCard({ attributes }: ProductAttributesCardProps) {
  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
      {/* Header đồng bộ */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Thông số kỹ thuật</h4>
        <div className="p-1.5 rounded-md bg-white border border-slate-100 shadow-sm">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {attributes && attributes.length > 0 ? (
          <div className="flex flex-col">
            {attributes.map((attr, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-4 py-3.5 border-b border-slate-100 border-dashed last:border-0 last:pb-0 first:pt-0"
              >
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">
                  {attr.name}
                </span>
                <span className="text-sm font-bold text-slate-800 text-right break-words">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State đồng bộ */
          <div className="py-10 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-14 h-14 rounded bg-white flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
              <Layers className="w-6 h-6 text-slate-300" />
            </div>
            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Trống</h5>
            <p className="text-[11px] font-medium text-slate-400 max-w-[200px]">
              Chưa có thông số kỹ thuật mở rộng cho sản phẩm này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}