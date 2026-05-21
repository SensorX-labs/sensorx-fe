'use client';

import React from 'react';
import { Box, ChevronRight } from 'lucide-react';
import { Supplier } from '@/features/catalog/supplier/models';
import { UnitOfQuantity } from '@/features/catalog/unit-of-quantity/models';
import { ProductDetail } from '../../../models';

interface ProductInfoSectionProps {
  formData: ProductDetail;
  setFormData: (data: ProductDetail) => void;
  onOpenCategoryDialog: () => void;
  suppliers: Supplier[];
  units: UnitOfQuantity[];
}

export function ProductInfoSection({
  formData,
  setFormData,
  onOpenCategoryDialog,
  suppliers,
  units
}: ProductInfoSectionProps) {
  return (
    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Box className="w-4 h-4 text-slate-400" />
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">Thông tin định danh</h4>
      </div>
      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tên hàng hóa <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="admin-input-premium w-full px-4 py-3 bg-slate-50/30 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
            placeholder="Nhập tên đầy đủ của hàng hóa..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nhà cung cấp</label>
          <select
            value={formData.supplierId || ''}
            onChange={(e) => {
              const supplier = suppliers.find(item => item.id === e.target.value);
              setFormData({
                ...formData,
                supplierId: e.target.value || null,
                supplierName: supplier?.name || ''
              });
            }}
            className="admin-input-premium w-full px-4 py-3 bg-slate-50/30 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
          >
            <option value="">Chọn nhà cung cấp...</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Danh mục</label>
            <div className="relative group cursor-pointer" onClick={onOpenCategoryDialog}>
              <input
                type="text"
                readOnly
                value={formData.categoryName || ''}
                className="admin-input-premium w-full px-4 py-3 bg-slate-50/30 border border-slate-200 rounded group-hover:border-indigo-300 cursor-pointer outline-none transition-all font-bold text-slate-700 pr-10"
                placeholder="Chọn danh mục..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Đơn vị tính</label>
            <select
              value={formData.unitOfQuantityId || ''}
              onChange={(e) => {
                const unit = units.find(item => item.id === e.target.value);
                setFormData({
                  ...formData,
                  unitOfQuantityId: e.target.value || null,
                  unitOfQuantityName: unit?.name || ''
                });
              }}
              className="admin-input-premium w-full px-4 py-3 bg-slate-50/30 border border-slate-200 rounded focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
            >
              <option value="">Chọn đơn vị tính...</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
