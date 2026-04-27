'use client';

import React from 'react';
import { Box, Factory, ChevronRight } from 'lucide-react';

interface ProductInfoSectionProps {
  formData: any;
  setFormData: (data: any) => void;
  onOpenCategoryDialog: () => void;
}

export function ProductInfoSection({ formData, setFormData, onOpenCategoryDialog }: ProductInfoSectionProps) {
  return (
    <div className="bg-white rounded border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
        <Box className="w-4 h-4 text-slate-400" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thông tin định danh</h4>
      </div>
      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên hàng hóa <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
            placeholder="Nhập tên đầy đủ của hàng hóa..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nhà sản xuất</label>
          <div className="relative group">
            <input
              type="text"
              value={formData.manufacture}
              onChange={(e) => setFormData({ ...formData, manufacture: e.target.value })}
              className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
              placeholder="Hãng sản xuất, thương hiệu..."
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Factory className="w-3.5 h-3.5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Danh mục</label>
            <div className="relative group cursor-pointer" onClick={onOpenCategoryDialog}>
              <input
                type="text"
                readOnly
                value={formData.categoryName || ''}
                className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded group-hover:border-emerald-300 cursor-pointer outline-none transition-all font-bold text-slate-700 pr-10"
                placeholder="Chọn danh mục..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Đơn vị tính</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="admin-input-premium w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700"
              placeholder="Cái, Chiếc, Bộ..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
