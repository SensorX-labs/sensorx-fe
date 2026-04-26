'use client';

import React from 'react';
import { PackageSearch, Box, Barcode, Factory, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/components/shadcn-ui/button';
import { Badge } from '@/shared/components/shadcn-ui/badge';
import ProductService from '@/features/catalog/product/services/product-service';
import { ProductLoadMoreForModal } from '@/features/catalog/product/models';
import { BaseSelectionModal } from './base-selection-modal';

interface ProductSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: ProductLoadMoreForModal) => void;
}

/**
 * Sub-component để hiển thị từng dòng sản phẩm
 */
const ProductItemRow = ({
  product: p,
  onSelect
}: {
  product: ProductLoadMoreForModal,
  onSelect: (p: ProductLoadMoreForModal) => void
}) => (
  <div
    onClick={() => onSelect(p)}
    className="group bg-white p-4 rounded border border-slate-200/60 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer transition-all duration-200 flex items-center justify-between w-full"
  >
    <div className="flex items-center gap-4 min-w-0 flex-1">
      <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center shrink-0 overflow-hidden border border-slate-100 group-hover:border-emerald-100 transition-colors">
        {p.images?.length > 0 ? (
          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <Box className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1.5">
          <h4 className="text-base font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{p.name}</h4>
          <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] uppercase font-black tracking-widest px-2 py-0.5 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{p.categoryName}</Badge>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5 shrink-0">
            <Barcode className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-600">{p.code}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
          <div className="flex items-center gap-1.5 truncate">
            <Factory className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{p.manufacture}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="shrink-0 pl-4 border-l border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center h-full">
      <Button variant="ghost" className="h-9 px-4 rounded font-black text-[10px] uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
        <CheckCircle2 className="w-4 h-4 mr-2" /> Chọn
      </Button>
    </div>
  </div>
);

export function ProductSelectionDialog({ isOpen, onOpenChange, onSelect }: ProductSelectionDialogProps) {
  return (
    <BaseSelectionModal<ProductLoadMoreForModal>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Chọn sản phẩm"
      description="Tìm kiếm sản phẩm để thiết lập bảng giá nội bộ"
      searchPlaceholder="Nhập tên hoặc mã sản phẩm (VD: SP001)..."
      icon={PackageSearch}
      onSelect={onSelect}
      itemKey={(p) => p.id}
      fetchData={(params) => ProductService.getLoadMore({ ...params, pageSize: 6, isDescending: true })}
      renderItem={(p, handleSelect) => <ProductItemRow key={p.id} product={p} onSelect={handleSelect} />}
      emptyTitle="Không tìm thấy sản phẩm"
    />
  );
}