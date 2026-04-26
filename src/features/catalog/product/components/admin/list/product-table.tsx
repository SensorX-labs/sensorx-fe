'use client';

import React from 'react';
import { Package, Eye, Edit, Trash2, Barcode, Factory } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { ProductPageList } from '../../../models';
import { ProductStatus } from '../../../enums/product-status';

interface ProductTableProps {
  products: ProductPageList[];
  onViewDetail: (product: ProductPageList) => void;
  onEdit: (product: ProductPageList) => void;
  onDelete?: (product: ProductPageList) => void;
}

const statusColor: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  [ProductStatus.INACTIVE]: 'bg-slate-50 text-slate-500 border-slate-100'
};

const statusLabel: Record<string, string> = {
  [ProductStatus.ACTIVE]: 'Đang hoạt động',
  [ProductStatus.INACTIVE]: 'Tạm ngưng'
};

export function ProductTable({ products, onViewDetail, onEdit, onDelete }: ProductTableProps) {
  return (
    <table className="w-full text-sm border-separate border-spacing-0">
      <thead>
        <tr className="bg-slate-50/50">
          <th className="text-left px-6 py-4 font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-100">Thông tin hàng hóa</th>
          <th className="text-left px-6 py-4 font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-100">Nhà sản xuất</th>
          <th className="text-left px-6 py-4 font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-100">Phân loại</th>
          <th className="text-left px-6 py-4 font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-100">Trạng thái</th>
          <th className="text-center px-6 py-4 font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-100">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {products.length > 0 ? products.map((p) => (
          <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded border border-slate-100 overflow-hidden bg-white flex-shrink-0 shadow-sm group-hover:border-emerald-200 transition-colors">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Barcode className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-mono text-slate-500 font-bold tracking-wider uppercase">{p.code || '--'}</span>
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-slate-600">
                <Factory className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm italic font-medium">{p.manufacture || '--'}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider border border-blue-100">
                {p.categoryName || 'Chưa phân loại'}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider
                ${statusColor[p.status as ProductStatus] ?? 'bg-slate-50 text-slate-400 border-slate-100'}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse ${p.status === ProductStatus.ACTIVE ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {statusLabel[p.status as ProductStatus] || p.status}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-all"
                  title="Xem chi tiết"
                  onClick={() => onViewDetail(p)}
                >
                  <Eye className="w-4.5 h-4.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-all"
                  title="Chỉnh sửa"
                  onClick={() => onEdit(p)}
                >
                  <Edit className="w-4.5 h-4.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-all" 
                  title="Xóa"
                  onClick={() => onDelete?.(p)}
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </Button>
              </div>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={5} className="px-6 py-20 text-center">
              <div className="flex flex-col items-center">
                <Package className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-slate-400 font-medium italic">Không tìm thấy sản phẩm nào</p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
