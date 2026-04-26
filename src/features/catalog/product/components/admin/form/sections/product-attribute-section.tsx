'use client';

import React from 'react';
import { Layers, Trash2, Plus } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';

interface ProductAttributeSectionProps {
  attributes: any[];
  onAddAttribute: () => void;
  onRemoveAttribute: (index: number) => void;
  onAttributeChange: (index: number, field: 'name' | 'value', value: string) => void;
}

export function ProductAttributeSection({ 
  attributes, 
  onAddAttribute, 
  onRemoveAttribute, 
  onAttributeChange 
}: ProductAttributeSectionProps) {
  return (
    <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông số kỹ thuật mở rộng</h4>
        <Layers className="w-4 h-4 text-slate-300" />
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {attributes?.map((attr: any, idx: number) => (
            <div key={idx} className="flex gap-3 items-center animate-in slide-in-from-right-4 duration-300">
              <input
                type="text"
                value={attr.name}
                onChange={(e) => onAttributeChange(idx, 'name', e.target.value)}
                placeholder="Tên thuộc tính (VD: Cân nặng)"
                className="flex-[2] px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
              <input
                type="text"
                value={attr.value}
                onChange={(e) => onAttributeChange(idx, 'value', e.target.value)}
                placeholder="Giá trị (VD: 500g)"
                className="flex-[3] px-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded focus:bg-white focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded shrink-0"
                onClick={() => onRemoveAttribute(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-300 rounded"
            onClick={onAddAttribute}
          >
            <Plus className="w-4 h-4 mr-2" /> Thêm thông số mới
          </Button>
        </div>
      </div>
    </div>
  );
}
